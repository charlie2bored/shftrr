# CareerPivot

A SaaS platform for mid-career transitions, built with Next.js 15, TypeScript, Tailwind CSS, Shadcn/UI, and Supabase.

## Features

- **User Authentication**: Secure sign-up and login with Supabase Auth
- **Diagnostic Quiz**: Comprehensive career assessment after signup
- **Profile Management**: Track current job title and salary
- **Financial Planning**: Monitor monthly expenses, debt, and savings
- **Career Goals**: Define target industries and desired salary
- **Transition Planning**: Create structured milestones for 6-month, 1-year, and 2-year plans
- **AI-Powered Escape Plans**: Generate personalized career transition strategies using Google Gemini AI
- **Burnout Risk Assessment**: Analyze daily vents and work patterns for burnout indicators
- **Financial Runway Calculator**: Calculate how long current savings will last
- **Realistic Roadmaps**: AI-generated 3-phase transition plans based on financial constraints
- **Protected Dashboard**: Secure routes with middleware-based authentication
- **Responsive Design**: Modern UI with Shadcn/UI components

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Shadcn/UI
- **Backend**: Supabase (Auth & Database)
- **Styling**: Tailwind CSS with custom design system

## Database Schema

The application uses the following Supabase tables:

- `users`: Extended user profile with job and salary information
- `user_assessments`: Diagnostic quiz results and career assessment data
- `financial_constraints`: Monthly expenses, debt, and savings tracking
- `career_goals`: Target industries and desired salary
- `transition_plans`: Structured milestones for different time periods (6 months, 1 year, 2 years)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd careerpivot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

Get your Google AI API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### AI-Powered Features

The application includes AI-powered career transition planning using Google Gemini:

- **Burnout Risk Assessment**: Analyzes daily work complaints and patterns to score burnout risk (0-100)
- **Financial Runway Calculation**: Calculates how many months your current savings will last based on expenses
- **Personalized Roadmaps**: Creates realistic 3-phase transition plans (6 months, 1 year, 2 years) that consider:
  - Financial constraints (won't suggest quitting if runway is limited)
  - Current skills and experience
  - Industry transition feasibility
  - Risk mitigation and contingency plans

The AI considers factors like high mortgage payments, suggests bridge jobs instead of immediate career switches, and provides actionable, specific steps rather than vague advice.

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Go to your project's SQL Editor and run the migration file:
   - Copy the contents of `supabase/migrations/20241224000000_initial_schema.sql`
   - Execute it in your Supabase SQL Editor

3. Enable Row Level Security (RLS) is already configured in the migration

4. Get your project URL and anon key from Settings > API

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/           # Shadcn/UI components
│   └── dashboard/    # Dashboard-specific components
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   ├── auth.ts
│   ├── database.types.ts
│   └── supabase.ts
supabase/
└── migrations/
    └── 20241224000000_initial_schema.sql
```

## Key Components

- **AuthContext**: Manages authentication state across the app
- **UserProfile**: Handles user profile updates
- **FinancialConstraints**: Manages financial planning data
- **CareerGoals**: Tracks career objectives
- **TransitionPlans**: Creates and manages milestone plans

## Authentication Flow

1. Users can sign up with email/password
2. Email verification is required (configurable in Supabase)
3. Protected routes redirect unauthenticated users to login
4. Authenticated users are redirected from auth pages to dashboard

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

Make sure to:
- Set environment variables
- Configure the build command: `npm run build`
- Set the output directory: `.next`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
