import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
// import { getMarketSalary, calculateRunway, tools } from '@/lib/gemini-tools'; // Temporarily disabled
import { z } from 'zod';

const requestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })),
  resumeText: z.string().optional(),
  ventText: z.string().optional(),
  temperature: z.number().optional().default(0.7)
});

const systemInstruction = `You are an empathetic career coach and trusted advisor. Your goal is to help professionals navigate career changes with confidence and clarity.

### FORMATTING CONSTRAINTS - ABSOLUTE PRIORITY:

You are a Career Strategist for shftrr.

CRITICAL FORMATTING RULES (VIOLATION WILL BREAK THE SYSTEM):
1. **ABSOLUTELY NO BOLD TEXT**: Do NOT use **bold** formatting ANYWHERE in your response. No **bold**, no **asterisks**, no **markdown bold**. Plain text only.
2. **The "Airy" Rule**: Every paragraph MUST be 1-2 sentences maximum. NEVER write a paragraph with 3 or more sentences. Use double line breaks (\n\n) aggressively between EVERY paragraph.
3. **Opening Statement**: Always start with a warm, 1-sentence reaction to the user's input. Keep it plain text.
4. **Strategic Italics**: Use *italics* sparingly for personal emphasis (e.g., *your* journey, *this* transition).
5. **Section Dividers**: Use --- (Horizontal Rules) frequently to separate major conceptual shifts.
6. **Lists**: Use plain text bulleted lists with - (dash). Each list item must have a double newline before it.

FORMATTING REQUIREMENTS - MAXIMUM PRIORITY:
- **NO BOLD TEXT ANYWHERE**: This is the most important rule. Never use **bold** markdown. Never use **asterisks** for bold.
- **Max 2 Sentences per Paragraph**: This is non-negotiable for readability.
- **Double Line Breaks**: You MUST use TWO newline characters (\n\n) between every single paragraph, header, and list item.
- **Plain Text Only**: Keep all text plain and readable. No bold, no emphasis except occasional italics.
- **Lists**: Use - (dash) for bullets. Each list item must have a double newline before it.
- **Scannability**: The response should look like a series of short, impactful insights rather than a long letter.

CONVERSATIONAL APPROACH:
- Be warm, supportive, and understanding - like a trusted mentor over coffee
- Start conversations by acknowledging their situation and showing genuine interest
- Ask thoughtful questions to understand their motivations, skills, and concerns
- Build rapport before diving into practical details
- Use "we" and "let's" to create partnership in the journey

DATA-DRIVEN WHEN APPROPRIATE:
- Use tools only when you have enough context and the user is ready for specific calculations
- Present data insights conversationally, not as cold facts
- Frame financial and salary information as helpful insights, not requirements
- Never demand data - gently ask when it would be helpful

RESPONSE STYLE:
- Natural, conversational tone with occasional empathy and encouragement
- Focus on understanding first, planning second
- Be concise but complete - aim for 300-500 words per response
- End with open questions to continue the conversation

REMEMBER: You're a coach, not a drill sergeant. People come to you in moments of uncertainty - meet them with empathy and guidance.`;

// Simple rate limiting (in production, use Redis or similar)
const rateLimit = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userRequests = rateLimit.get(identifier) || 0;

  if (userRequests >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limited
  }

  rateLimit.set(identifier, userRequests + 1);

  // Clean up old entries (simple implementation)
  setTimeout(() => {
    rateLimit.delete(identifier);
  }, RATE_LIMIT_WINDOW);

  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Simple rate limiting by IP (in production, use user ID)
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown';

    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { messages, resumeText, ventText, temperature } = requestSchema.parse(body);

    // Prepare the conversation context
    let contextMessage = '';
    if (resumeText || ventText) {
      contextMessage = 'Context about the user:\n';
      if (resumeText) contextMessage += `Resume: ${resumeText}\n\n`;
      if (ventText) contextMessage += `Current situation: ${ventText}\n\n`;
    }

    // Combine context with user messages
    const fullMessages = [
      { role: 'system' as const, content: systemInstruction },
      ...(contextMessage ? [{ role: 'system' as const, content: contextMessage }] : []),
      ...messages.map(msg => ({
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content
      }))
    ];

    console.log('Making Gemini API call...');
    console.log('API Key available:', !!env.GOOGLE_GENERATIVE_AI_API_KEY);
    console.log('API Key length:', env.GOOGLE_GENERATIVE_AI_API_KEY?.length);

    // Check if API key is available
    if (!env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('Google Generative AI API key is missing. Pass it using the \'apiKey\' parameter or the GOOGLE_GENERATIVE_AI_API_KEY environment variable.');
    }

    let result;
    try {
      result = await generateText({
        model: google('gemini-flash-latest'),
        messages: fullMessages,
        // Temporarily disable tools to fix build
        // tools: {
        //   get_market_salary: tool({
        //     description: 'Get market salary data for a specific role and location',
        //     parameters: z.object({
        //       role: z.string().describe("The job title/role to get salary data for"),
        //       location: z.string().optional().describe("Location for salary data (city, state, or 'remote')"),
        //       experience_level: z.enum(["entry", "mid", "senior", "executive"]).optional().describe("Experience level")
        //     }),
        //     execute: getMarketSalary
        //   }),
        //   calculate_runway: tool({
        //     description: 'Calculate financial runway based on savings and expenses',
        //     parameters: z.object({
        //       monthly_savings: z.number().describe("Monthly savings amount in dollars"),
        //       monthly_expenses: z.number().describe("Monthly expenses in dollars"),
        //       emergency_fund: z.number().optional().describe("Emergency fund amount")
        //     }),
        //     execute: calculateRunway
        //   })
        // },
        temperature: temperature
      });
      console.log('Gemini API call successful');
    } catch (apiError) {
      console.error('Gemini API call failed:', apiError);

      // Handle quota exceeded errors specifically
      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      if (errorMessage.includes('quota exceeded') || errorMessage.includes('Quota exceeded')) {
        throw new Error(`QUOTA_EXCEEDED: You've reached the free tier limit of 20 requests per day. To continue using the career coach, please upgrade to a paid Gemini API plan at https://ai.google.dev/pricing. Your conversation history will be preserved.`);
      }

      throw new Error(`Gemini API error: ${errorMessage}`);
    }

    // Clean up the response to remove any function call syntax
    let cleanResponse = result.text || "I apologize, but I encountered an issue processing your request. Please try again.";

    console.log('Raw Gemini response:', cleanResponse);
    console.log('Raw response length:', cleanResponse.length);

    // Remove function call notations that might appear in the response
    cleanResponse = cleanResponse
      .replace(/\(\s*For\s+[^)]+\)/gi, '') // Remove "(For function_name)" patterns
      .replace(/\(\s*for\s+[^)]+\)/gi, '') // Remove "(for function_name)" patterns (case insensitive)
      .replace(/get_market_salary/gi, '') // Remove function name mentions
      .replace(/calculate_runway/gi, '') // Remove function name mentions
      .replace(/---\s*Tool\s+Usage\s*---[\s\S]*?(?=---|$)/gi, '') // Remove tool usage sections
      .replace(/---\s*Tool\s+Results\s*---[\s\S]*?(?=---|$)/gi, '') // Remove tool results sections
      // Fix run-on bullet points (e.g., "• Point 1 • Point 2")
      .replace(/([.!?])\s*•/g, '$1\n\n-') // Convert "•" after punctuation to a new markdown list item
      .replace(/:\s*•/g, ':\n\n-') // Convert "•" after a colon to a new markdown list item
      .replace(/•\s+/g, '\n- ') // Convert any remaining "•" to "- " on a new line
      // AGGRESSIVELY REMOVE ALL FORMATTING MARKDOWN: This is critical to prevent bold/large text
      .replace(/^#+\s*/gm, '') // Remove ALL header markdown (# ## ###)
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove ALL **bold** markdown, including inline
      .replace(/\*([^*]+)\*/g, '$1') // Remove *italic* markdown that might be confused
      .replace(/^\*\*([^*]+)\*\*$/gm, '$1') // Remove **...** from entire lines
      .replace(/\n\*\*([^*]+)\*\*\n/g, '\n$1\n') // Remove **...** from paragraphs between newlines
      .replace(/\*\*([^*]{1,50})\*\*/g, '$1') // Catch any remaining short bold phrases
      .replace(/`([^`]+)`/g, '$1') // Remove code formatting
      // Normalize multiple spaces but preserve line breaks
      .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with single space
      .replace(/\n\s+/g, '\n') // Remove leading spaces from lines
      .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines to double newlines
      .trim();

    // Temporarily disabled length limiting to allow full responses
    // TODO: Re-enable with user preference for concise vs detailed responses
    // const maxLength = 1500;
    // if (cleanResponse.length > maxLength) {
    //   // Smart truncation logic would go here
    // }

    // If the response becomes empty after cleaning, provide a fallback
    if (!cleanResponse || cleanResponse.trim().length < 10) {
      cleanResponse = "I've analyzed your situation and provided insights based on current market data. How can I help you further with your career transition?";
    }

    // Enforce brevity: Keep responses under 600 words for conciseness
    const maxLength = 3000; // ~600 words limit
    if (cleanResponse.length > maxLength) {
      // Cut at paragraph boundary for clean breaks
      const truncated = cleanResponse.substring(0, maxLength);
      const lastParagraph = truncated.lastIndexOf('\n\n');
      const lastSentence = truncated.lastIndexOf('.');

      if (lastParagraph > maxLength * 0.6) {
        cleanResponse = cleanResponse.substring(0, lastParagraph) + '\n\n*Response truncated for brevity...*';
      } else if (lastSentence > maxLength * 0.7) {
        cleanResponse = cleanResponse.substring(0, lastSentence + 1) + '\n\n*Response truncated for brevity...*';
      } else {
        cleanResponse = truncated + '...\n\n*Response truncated for brevity...*';
      }
    }

    console.log('Cleaned response length:', cleanResponse.length);

    return NextResponse.json({
      response: cleanResponse,
      toolCalls: result.toolCalls || [],
      toolResults: result.toolResults || []
    });

  } catch (error) {
    console.error('Gemini Career Coach API error:', error);
    const errorDetails = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Internal server error', details: errorDetails },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
