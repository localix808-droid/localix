-- =====================================================
-- QUICK SECURITY CHECK - UNRESTRICTED TABLES
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Check for tables without RLS enabled (UNRESTRICTED)
SELECT 
    tablename,
    '❌ UNRESTRICTED - RLS DISABLED' as status,
    'CRITICAL SECURITY RISK' as risk_level
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = false
AND tablename NOT LIKE 'pg_%'
AND tablename NOT LIKE 'information_schema%'

UNION ALL

-- Check for tables with RLS but no policies (BLOCKED)
SELECT 
    t.tablename,
    '❌ BLOCKED - RLS ENABLED BUT NO POLICIES' as status,
    'HIGH SECURITY RISK' as risk_level
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
WHERE t.schemaname = 'public' 
AND t.rowsecurity = true
AND t.tablename NOT LIKE 'pg_%'
AND t.tablename NOT LIKE 'information_schema%'
GROUP BY t.tablename
HAVING COUNT(p.policyname) = 0

ORDER BY risk_level DESC, tablename;

-- =====================================================
-- SUMMARY COUNT
-- =====================================================

SELECT 
    COUNT(CASE WHEN rowsecurity = false THEN 1 END) as unrestricted_tables,
    COUNT(CASE WHEN rowsecurity = true AND policy_count = 0 THEN 1 END) as blocked_tables,
    COUNT(*) as total_tables,
    CASE 
        WHEN COUNT(CASE WHEN rowsecurity = false THEN 1 END) = 0 
         AND COUNT(CASE WHEN rowsecurity = true AND policy_count = 0 THEN 1 END) = 0 
        THEN '✅ ALL TABLES SECURE'
        ELSE '❌ SECURITY ISSUES FOUND'
    END as security_status
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
) subq; 