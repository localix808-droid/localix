# Business Management Platform

A comprehensive business management solution for small businesses with social media automation, business model canvas, and analytics.

## Features

### 🚀 Core Features
- **Business Dashboard**: Centralized management for all your businesses
- **Social Media Automation**: Schedule and automate posts across multiple platforms
- **Business Model Canvas**: Interactive tool for visualizing your business model
- **Customer Persona Generator**: Define and understand your target audience
- **Advanced Analytics**: Detailed insights and growth reports
- **Multi-business Support**: Manage multiple businesses from one account

### 📊 Analytics & Insights
- Business performance tracking
- Social media engagement metrics
- Growth rate analysis
- Customer behavior insights
- Exportable reports (PDF, CSV)

### 🔧 Business Tools
- Business Model Canvas creation and editing
- Target audience segmentation
- Customer persona development
- Social media content planning
- Automated posting schedules

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Forms**: React Hook Form, Zod validation
- **UI Components**: Radix UI, Lucide React icons
- **Charts**: Recharts
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd business-management-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Update the configuration in `lib/supabase.ts`

4. **Set up the database**
   - Run the SQL schema from `database-schema.sql` in your Supabase SQL editor
   - This will create all necessary tables and security policies

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main tables:

- **users**: User profiles and authentication
- **businesses**: Business information and subscription plans
- **social_accounts**: Connected social media accounts
- **scheduled_posts**: Social media posts and scheduling
- **business_model_canvas**: Business model canvas data
- **customer_personas**: Customer persona definitions

## Pricing Plans

### 🟩 Launch (Free)
- Business Dashboard
- 1 Social Media Account
- 3 Scheduled Posts Per Week
- Basic Business Model Canvas
- Limited AI Assistant

### 🟨 Grow ($12/month)
- Everything in Launch
- Up to 5 Social Media Accounts
- Unlimited Scheduled Posts
- Full Business Model Canvas
- Customer Persona Generator
- Advanced Analytics
- Email Support

### 🟥 Scale ($39/month)
- Everything in Grow
- Up to 10 Social Media Accounts
- Exportable Reports (PDF, CSV)
- Team Collaboration (5 users)
- White-Label Branding
- Live Chat Support

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── lib/                   # Utility libraries
│   ├── auth-context.tsx   # Authentication context
│   └── supabase.ts        # Supabase configuration
├── components/            # Reusable components
├── database-schema.sql    # Database schema
└── package.json           # Dependencies
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Features in Development

- [ ] Social media API integrations (Facebook, Twitter, Instagram, LinkedIn)
- [ ] AI-powered content generation
- [ ] Advanced reporting and analytics
- [ ] Team collaboration features
- [ ] White-label branding options
- [ ] Mobile app development

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@businesspro.com or join our Slack channel.

## Roadmap

- [ ] Q1 2024: Social media integrations
- [ ] Q2 2024: AI content assistant
- [ ] Q3 2024: Advanced analytics
- [ ] Q4 2024: Mobile app launch 