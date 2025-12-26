# Gemini 3 Pro Career Coach Setup

## Environment Variables Required

Create a `.env.local` file in your project root with:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
```

## Getting a Google AI API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env.local` file

## Features Implemented

### 🤖 Agentic Career Coach
- Uses Gemini 3 Pro for intelligent conversations
- Function calling capabilities for data-driven advice
- Strategic career pivot planning

### 🛠️ Function Calling Tools

#### `get_market_salary`
- **Purpose**: Get realistic salary data for specific roles
- **Parameters**:
  - `role`: Job title (required)
  - `location`: City/state or "remote" (optional)
  - `experience_level`: "entry", "mid", "senior", "executive" (optional)

#### `calculate_runway`
- **Purpose**: Calculate financial viability of career transitions
- **Parameters**:
  - `monthly_savings`: Income in dollars (required)
  - `monthly_expenses`: Expenses in dollars (required)
  - `emergency_fund`: Emergency fund amount (optional)

### 🎯 System Instruction
```
You are a career pivot agent. Use the provided tools to build a factual, high-stakes escape plan for professionals in crisis.

Your approach:
- NEVER give generic advice; always back it up with tool-derived data
- Use get_market_salary to provide realistic salary expectations
- Use calculate_runway to assess financial viability of career transitions
- Be direct about financial realities and timelines
- Focus on concrete next steps backed by data
```

## API Usage Examples

### Salary Research
```
User: "What's the salary range for a Senior Software Engineer in San Francisco?"

Gemini: [Calls get_market_salary tool]
Tool Result: {
  "role": "Senior Software Engineer",
  "location": "San Francisco",
  "experience_level": "senior",
  "estimated_salary": 234000,
  "salary_range": {"low": 187200, "high": 280800}
}
```

### Financial Planning
```
User: "I make $8000/month but spend $6000. How long can I last?"

Gemini: [Calls calculate_runway tool]
Tool Result: {
  "monthly_net_income": 2000,
  "runway_scenarios": {
    "conservative": 8,
    "moderate": 10,
    "aggressive": 12
  }
}
```

## Privacy Considerations

⚠️ **Important**: This implementation uses external APIs and will transmit user career/financial data to Google. This differs from the original privacy-focused local Ollama approach.

If you need to maintain the original privacy requirements, consider:
- Using local models with function calling emulation
- Implementing privacy-preserving data handling
- Using on-device AI solutions

## Running the Application

1. Set up your API key in `.env.local`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Access the Gemini-powered career coach at `/`

## Testing Function Calling

Try these prompts to test the agentic capabilities:

1. "I'm a senior software engineer making $150k. What's my runway if I spend $8k/month?"
2. "What's the salary range for a Product Manager in New York?"
3. "I want to become a UX Designer. What's the entry-level salary and how long would $50k last me?"
4. "Help me create a pivot plan from accounting to data science."

The AI will automatically call the appropriate tools and provide data-backed career advice.

