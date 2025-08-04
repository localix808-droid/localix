-- =====================================================
-- DATABASE SECURITY AUDIT SCRIPT
-- Run this in your Supabase SQL Editor to check for unrestricted tables
-- =====================================================

-- =====================================================
-- 1. CHECK FOR TABLES WITHOUT RLS ENABLED
-- =====================================================

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity = false THEN '❌ RLS DISABLED - SECURITY RISK!'
        ELSE '✅ RLS Enabled'
    END as security_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename NOT LIKE 'pg_%'
AND tablename NOT LIKE 'information_schema%'
ORDER BY rowsecurity ASC, tablename;

-- =====================================================
-- 2. CHECK FOR TABLES WITHOUT RLS POLICIES
-- =====================================================

SELECT 
    t.schemaname,
    t.tablename,
    t.rowsecurity as rls_enabled,
    COUNT(p.policyname) as policy_count,
    CASE 
        WHEN t.rowsecurity = true AND COUNT(p.policyname) = 0 THEN '❌ RLS ENABLED BUT NO POLICIES - BLOCKED!'
        WHEN t.rowsecurity = false THEN '❌ RLS DISABLED - SECURITY RISK!'
        WHEN COUNT(p.policyname) > 0 THEN '✅ RLS Enabled with Policies'
        ELSE '⚠️ No Policies Found'
    END as security_status
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
WHERE t.schemaname = 'public' 
AND t.tablename NOT LIKE 'pg_%'
AND t.tablename NOT LIKE 'information_schema%'
GROUP BY t.schemaname, t.tablename, t.rowsecurity
ORDER BY 
    CASE 
        WHEN t.rowsecurity = true AND COUNT(p.policyname) = 0 THEN 1
        WHEN t.rowsecurity = false THEN 2
        ELSE 3
    END,
    t.tablename;

-- =====================================================
-- 3. DETAILED POLICY ANALYSIS
-- =====================================================

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as operation,
    qual as condition,
    with_check as insert_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, cmd, policyname;

-- =====================================================
-- 4. CHECK FOR TABLES THAT MIGHT BE UNRESTRICTED
-- =====================================================

WITH table_security AS (
    SELECT 
        t.tablename,
        t.rowsecurity as rls_enabled,
        COUNT(p.policyname) as policy_count,
        STRING_AGG(DISTINCT p.cmd, ', ' ORDER BY p.cmd) as operations_covered
    FROM pg_tables t
    LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
    WHERE t.schemaname = 'public' 
    AND t.tablename NOT LIKE 'pg_%'
    AND t.tablename NOT LIKE 'information_schema%'
    GROUP BY t.tablename, t.rowsecurity
)
SELECT 
    tablename,
    rls_enabled,
    policy_count,
    operations_covered,
    CASE 
        WHEN rls_enabled = false THEN '❌ UNRESTRICTED - RLS DISABLED'
        WHEN rls_enabled = true AND policy_count = 0 THEN '❌ UNRESTRICTED - NO POLICIES'
        WHEN operations_covered IS NULL THEN '❌ UNRESTRICTED - NO OPERATIONS COVERED'
        WHEN operations_covered NOT LIKE '%SELECT%' THEN '⚠️ PARTIALLY RESTRICTED - NO SELECT POLICY'
        WHEN operations_covered NOT LIKE '%INSERT%' THEN '⚠️ PARTIALLY RESTRICTED - NO INSERT POLICY'
        WHEN operations_covered NOT LIKE '%UPDATE%' THEN '⚠️ PARTIALLY RESTRICTED - NO UPDATE POLICY'
        WHEN operations_covered NOT LIKE '%DELETE%' THEN '⚠️ PARTIALLY RESTRICTED - NO DELETE POLICY'
        ELSE '✅ FULLY RESTRICTED'
    END as restriction_status
FROM table_security
ORDER BY 
    CASE 
        WHEN rls_enabled = false THEN 1
        WHEN rls_enabled = true AND policy_count = 0 THEN 2
        WHEN operations_covered IS NULL THEN 3
        ELSE 4
    END,
    tablename;

-- =====================================================
-- 5. CHECK FOR SENSITIVE TABLES WITHOUT PROPER SECURITY
-- =====================================================

SELECT 
    t.tablename,
    t.rowsecurity as rls_enabled,
    COUNT(p.policyname) as policy_count,
    CASE 
        WHEN t.tablename LIKE '%token%' OR t.tablename LIKE '%secret%' OR t.tablename LIKE '%password%' THEN '🔐 SENSITIVE'
        WHEN t.tablename LIKE '%user%' OR t.tablename LIKE '%auth%' THEN '👤 USER DATA'
        WHEN t.tablename LIKE '%business%' OR t.tablename LIKE '%company%' THEN '🏢 BUSINESS DATA'
        WHEN t.tablename LIKE '%social%' OR t.tablename LIKE '%account%' THEN '📱 SOCIAL MEDIA'
        ELSE '📊 GENERAL DATA'
    END as data_type,
    CASE 
        WHEN t.rowsecurity = false THEN '❌ CRITICAL SECURITY RISK!'
        WHEN t.rowsecurity = true AND COUNT(p.policyname) = 0 THEN '❌ HIGH SECURITY RISK!'
        WHEN t.tablename LIKE '%token%' AND COUNT(p.policyname) < 4 THEN '⚠️ TOKEN SECURITY INSUFFICIENT'
        ELSE '✅ SECURE'
    END as security_risk
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
WHERE t.schemaname = 'public' 
AND t.tablename NOT LIKE 'pg_%'
AND t.tablename NOT LIKE 'information_schema%'
GROUP BY t.tablename, t.rowsecurity
HAVING 
    t.rowsecurity = false 
    OR (t.rowsecurity = true AND COUNT(p.policyname) = 0)
    OR (t.tablename LIKE '%token%' AND COUNT(p.policyname) < 4)
ORDER BY 
    CASE 
        WHEN t.rowsecurity = false THEN 1
        WHEN t.rowsecurity = true AND COUNT(p.policyname) = 0 THEN 2
        ELSE 3
    END,
    t.tablename;

-- =====================================================
-- 6. SUMMARY REPORT
-- =====================================================

WITH security_summary AS (
    SELECT 
        COUNT(*) as total_tables,
        COUNT(CASE WHEN rowsecurity = false THEN 1 END) as tables_without_rls,
        COUNT(CASE WHEN rowsecurity = true THEN 1 END) as tables_with_rls,
        COUNT(CASE WHEN rowsecurity = true AND policy_count = 0 THEN 1 END) as tables_without_policies
    FROM (
        SELECT 
            t.tablename,
            t.rowsecurity,
            COUNT(p.policyname) as policy_count
        FROM pg_tables t
        LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
        WHERE t.schemaname = 'public' 
        AND t.tablename NOT LIKE 'pg_%'
        AND t.tablename NOT LIKE 'information_schema%'
        GROUP BY t.tablename, t.rowsecurity
    ) subq
)
SELECT 
    'DATABASE SECURITY SUMMARY' as report_type,
    total_tables as "Total Tables",
    tables_with_rls as "Tables with RLS",
    tables_without_rls as "Tables without RLS",
    tables_without_policies as "Tables without Policies",
    CASE 
        WHEN tables_without_rls = 0 AND tables_without_policies = 0 THEN '✅ EXCELLENT SECURITY'
        WHEN tables_without_rls = 0 AND tables_without_policies > 0 THEN '⚠️ GOOD BUT NEEDS POLICIES'
        WHEN tables_without_rls > 0 THEN '❌ CRITICAL SECURITY ISSUES'
        ELSE '❓ UNKNOWN SECURITY STATUS'
    END as overall_security_status
FROM security_summary;

-- =====================================================
-- 7. FIX SCRIPT FOR UNRESTRICTED TABLES (if needed)
-- =====================================================

-- Uncomment and run this section if you find unrestricted tables:

/*
-- Example: Enable RLS on a table
-- ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;

-- Example: Create basic policies for a table
-- CREATE POLICY "Users can view own data" ON your_table_name
--     FOR SELECT USING (auth.uid() = user_id);

-- CREATE POLICY "Users can insert own data" ON your_table_name
--     FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can update own data" ON your_table_name
--     FOR UPDATE USING (auth.uid() = user_id);

-- CREATE POLICY "Users can delete own data" ON your_table_name
--     FOR DELETE USING (auth.uid() = user_id);
*/

-- =====================================================
-- 8. VERIFICATION QUERIES
-- =====================================================

-- Test if you can access tables without authentication
-- (This should fail if RLS is working properly)

-- SELECT 'Testing access to users table...' as test;
-- SELECT COUNT(*) FROM users LIMIT 1;

-- SELECT 'Testing access to businesses table...' as test;
-- SELECT COUNT(*) FROM businesses LIMIT 1;

-- SELECT 'Testing access to social_accounts table...' as test;
-- SELECT COUNT(*) FROM social_accounts LIMIT 1;

-- =====================================================
-- END OF SECURITY AUDIT
-- ===================================================== 