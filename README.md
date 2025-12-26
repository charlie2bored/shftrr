# Career Pivot Coach

An AI-powered career coaching web application built with Next.js and Google's Gemini AI. Get personalized career transition guidance with structured, data-driven advice.

## 🚀 Live Demo

Visit the live application at [your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)

## ✨ Features

- **🤖 Gemini AI Integration**: Powered by Google's latest Gemini models for intelligent career coaching
- **📝 Dual Input System**: Separate tabs for resume upload and venting about work frustrations
- **📋 Structured Responses**: AI-generated career roadmaps with proper formatting and visual hierarchy
- **🎨 Modern UI**: Dark-themed interface with smooth animations and professional design
- **⚡ Real-time Streaming**: Live responses as the AI generates advice
- **🔒 Privacy-First**: All processing happens through secure API calls (no data stored)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **AI**: Google Gemini AI (via Vercel AI SDK)
- **UI Components**: Radix UI, Lucide Icons
- **Deployment**: Vercel
- **Styling**: Tailwind CSS with custom animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Google AI API Key (from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Local Development

1. **Clone and install dependencies:**
```bash
git clone https://github.com/yourusername/career-pivot-coach.git
cd career-pivot-coach
npm install
```

2. **Set up environment variables:**
Create a `.env.local` file in the root directory:
```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

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

1. **Connect GitHub**: Import your repository to Vercel
2. **Environment Variables**: Add `GOOGLE_GENERATIVE_AI_API_KEY` in Vercel dashboard
3. **Deploy**: Vercel will automatically build and deploy your app

### Manual Deployment

```bash
npm run build
npm start
```

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