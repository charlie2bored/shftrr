# Frontend Dashboard

Next.js 15 dashboard for Career Pivot Coach with dark mode and streaming responses.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI
- **State**: React hooks with localStorage persistence
- **API**: Native fetch with streaming support

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Or run complete system
cd ../server && python run-complete-system.py
```

## Features

### 🎨 UI Components
- **Sidebar**: Escape plan history with localStorage
- **Vent Area**: Glowing textarea with tabbed input
- **Roadmap Panel**: Markdown-rendered AI responses
- **Dark Mode**: Professional dark theme throughout

### ⚡ Real-time Features
- **Streaming**: Word-by-word AI response display
- **Persistence**: Conversation history with timestamps
- **Responsive**: Mobile-first design

## Development

```bash
# Development
npm run dev

# Build for production
npm run build

# Type checking
npm run lint
```

## Architecture

```
app/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # Reusable UI components
│   ├── lib/          # Custom hooks and utilities
│   └── types/        # TypeScript definitions
├── public/           # Static assets
└── styles/          # Global styles
```

## Key Components

- `Sidebar`: History management and navigation
- `VentArea`: User input with glowing effects
- `RoadmapPanel`: Markdown rendering with icons
- `useChat`: Streaming API integration
- `useEscapePlans`: History persistence

## Styling

- **Tailwind CSS**: Utility-first styling
- **Shadcn/UI**: Consistent component library
- **Custom CSS**: Glowing textarea effects
- **Responsive**: Mobile-first approach

## API Integration

Connects to FastAPI backend with Server-Sent Events for streaming responses. All data stays local - no external API calls for user information.