# Career Pivot Coach

An AI-powered career coaching web application built with Next.js, Google's Gemini AI, and MySQL database. Get personalized career transition guidance with structured, data-driven advice and persistent user accounts.

## 🚀 Live Demo

Visit the live application at [your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)

## ✨ Features

- **🤖 Gemini AI Integration**: Powered by Google's latest Gemini models for intelligent career coaching
- **👤 User Authentication**: Secure sign up/sign in with email/password or Google OAuth
- **🔐 Password Recovery**: Complete forgot password flow with email-based reset
- **💾 Persistent Chat History**: Save and resume conversations across sessions
- **📝 Dual Input System**: Separate tabs for resume upload and venting about work frustrations
- **📋 Structured Responses**: AI-generated career roadmaps with proper formatting and visual hierarchy
- **🎨 Modern UI**: Dark-themed interface with smooth animations and professional design
- **⚡ Real-time Streaming**: Live responses as the AI generates advice
- **🔒 Privacy-First**: Secure user data with bcrypt password hashing and MySQL database
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL (PlanetScale for production)
- **Authentication**: NextAuth.js with JWT sessions
- **AI**: Google Gemini AI (via Vercel AI SDK)
- **UI Components**: Radix UI, Lucide Icons
- **Deployment**: Vercel
- **Styling**: Tailwind CSS with custom animations
- **Security**: bcrypt password hashing, Zod validation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MySQL database (local or cloud)
- Google AI API Key (from [Google AI Studio](https://makersuite.google.com/app/apikey))
- NextAuth secrets and Google OAuth credentials (optional)

### Local Development

1. **Clone and install dependencies:**
```bash
git clone https://github.com/charlie2bored/shftrr.git
cd shftrr
npm install
```

2. **Set up MySQL database:**
Follow the [Database Setup Guide](DATABASE_SETUP.md) to configure MySQL.

3. **Set up environment variables:**
Create a `.env.local` file in the root directory:
```bash
# Database
DATABASE_URL="mysql://username:password@localhost:3306/career_pivot_db"

# NextAuth
NEXTAUTH_SECRET=your-super-secure-random-string-here
NEXTAUTH_URL=http://localhost:3000

# AI
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. **Run database migrations:**
```bash
npm run db:migrate
npm run db:seed  # Creates test user
```

5. **Run the development server:**
```bash
npm run dev
```

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser

### Test Accounts

- **Email**: `test@example.com`
- **Password**: `password123`

## 📖 Usage

1. **Resume Tab**: Paste your resume, LinkedIn profile, or career summary
2. **Vent Tab**: Share what's frustrating you about your current work situation
3. **Get Coaching**: Click "Send" to receive personalized career transition advice
4. **Review Roadmap**: Read the structured AI response with actionable next steps

## 🔧 API Endpoints

- `POST /api/gemini-career-coach` - Main career coaching endpoint
- Accepts: `messages`, `resumeText`, `ventText`, `temperature`
- Returns: Streaming AI response with career guidance

## 🚀 Deployment

### Vercel (Recommended)

For complete deployment instructions, see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

**Quick Setup:**
1. **Connect GitHub**: Import your repository to Vercel
2. **Environment Variables**: Add all required variables in Vercel dashboard
3. **Database**: Set up PlanetScale or Vercel Postgres
4. **Deploy**: Vercel will automatically build and deploy your app

### Manual Deployment

```bash
npm run build
npm start
```

### Environment Variables Required

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for complete environment setup.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Privacy Notice

This application uses Google's Gemini AI service. Career data is processed through Google's secure API infrastructure. No personal data is stored permanently on our servers.