'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase, Business } from '@/lib/supabase'
import { ArrowLeft, Loader2, Building2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const newBusinessSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  description: z.string().optional(),
  industry: z.string().min(1, 'Please select an industry'),
  website: z.string().url().optional().or(z.literal('')),
  subscription_plan: z.enum(['starter', 'pro', 'agency']),
})

type NewBusinessForm = z.infer<typeof newBusinessSchema>

export default function NewBusinessPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [canCreate, setCanCreate] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewBusinessForm>({
    resolver: zodResolver(newBusinessSchema),
    defaultValues: {
      subscription_plan: 'starter',
    },
  })

  useEffect(() => {
    if (user) {
      fetchBusinesses()
    }
  }, [user])

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setBusinesses(data || [])
      
      // Check if user can create more businesses
      const hasStarterPlan = data?.some(business => business.subscription_plan === 'starter')
      if (hasStarterPlan && data && data.length >= 1) {
        setCanCreate(false)
      }
    } catch (error) {
      console.error('Error fetching businesses:', error)
      toast.error('Failed to load businesses')
    }
  }

  const onSubmit = async (data: NewBusinessForm) => {
    if (!user || !canCreate) return

    setIsLoading(true)
    try {
      const { data: businessData, error } = await supabase
        .from('businesses')
        .insert([
          {
            user_id: user.id,
            name: data.name,
            description: data.description || null,
            industry: data.industry,
            website: data.website || null,
            subscription_plan: data.subscription_plan,
          },
        ])
        .select()
        .single()

      if (error) {
        throw error
      }

      toast.success('Business created successfully!')
      router.push(`/dashboard/business/${businessData.id}`)
    } catch (error: any) {
      console.error('Error creating business:', error)
      toast.error(error.message || 'Failed to create business')
    } finally {
      setIsLoading(false)
    }
  }

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Manufacturing',
    'Real Estate',
    'Food & Beverage',
    'Entertainment',
    'Professional Services',
    'Other',
  ]

  const subscriptionPlans = [
    {
      id: 'starter',
      name: 'Launch',
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        'Business Dashboard',
        '1 Social Media Account',
        '3 Scheduled Posts Per Week',
        'Basic Business Model Canvas',
        'Limited AI Assistant'
      ]
    },
    {
      id: 'pro',
      name: 'Grow',
      price: '$12/month',
      description: 'Most popular choice',
      features: [
        'Everything in Launch',
        'Up to 5 Social Media Accounts',
        'Unlimited Scheduled Posts',
        'Full Business Model Canvas',
        'Customer Persona Generator',
        'Advanced Analytics',
        'Email Support'
      ]
    },
    {
      id: 'agency',
      name: 'Scale',
      price: '$39/month',
      description: 'For growing agencies',
      features: [
        'Everything in Grow',
        'Up to 10 Social Media Accounts',
        'Exportable Reports',
        'Team Collaboration (5 users)',
        'White-Label Branding',
        'Live Chat Support'
      ]
    }
  ]

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!canCreate) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">Create New Business</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Limit Reached</h2>
            <p className="text-gray-600 mb-6">
              You've reached the limit of 1 business for the free plan. Upgrade to create more businesses and unlock additional features.
            </p>
            <div className="space-y-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back to Dashboard
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 ml-4"
              >
                Upgrade Plan
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Create New Business</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Business Information</h2>
            <p className="text-sm text-gray-600 mt-1">
              Set up your new business profile and choose a subscription plan.
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="input"
                  placeholder="Enter your business name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                  Industry *
                </label>
                <select
                  {...register('industry')}
                  className="input"
                >
                  <option value="">Select an industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  {...register('website')}
                  type="url"
                  className="input"
                  placeholder="https://example.com"
                />
                {errors.website && (
                  <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="subscription_plan" className="block text-sm font-medium text-gray-700 mb-1">
                  Subscription Plan *
                </label>
                <select
                  {...register('subscription_plan')}
                  className="input"
                >
                  {subscriptionPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - {plan.price}
                    </option>
                  ))}
                </select>
                {errors.subscription_plan && (
                  <p className="mt-1 text-sm text-red-600">{errors.subscription_plan.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="input"
                  placeholder="Describe your business..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* Subscription Plan Details */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Subscription Plan Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="text-center mb-3">
                      <h4 className="font-medium text-gray-900">{plan.name}</h4>
                      <p className="text-lg font-bold text-primary">{plan.price}</p>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                href="/dashboard"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Create Business'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 