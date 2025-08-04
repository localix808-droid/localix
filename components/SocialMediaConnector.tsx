'use client'

import { Settings } from 'lucide-react'

export default function SocialMediaConnector() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Settings className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Social Media Integration
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Connect your social media accounts to schedule posts, track engagement, and manage your online presence from one central dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}