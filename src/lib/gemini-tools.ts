import { z } from 'zod';

// Tool schemas
export const getMarketSalarySchema = z.object({
  role: z.string().describe("The job title/role to get salary data for"),
  location: z.string().optional().describe("Location for salary data (city, state, or 'remote')"),
  experience_level: z.enum(["entry", "mid", "senior", "executive"]).optional().describe("Experience level")
});

export const calculateRunwaySchema = z.object({
  monthly_savings: z.number().describe("Monthly savings amount in dollars"),
  monthly_expenses: z.number().describe("Monthly expenses in dollars"),
  emergency_fund: z.number().optional().describe("Emergency fund amount (defaults to 0)")
});

// Tool functions - temporarily commented out to fix build
// export async function getMarketSalary(params: z.infer<typeof getMarketSalarySchema>) {
//   const { role, location = "remote", experience_level = "mid" } = params;

//   // Placeholder salary data - replace with real API calls
//   const salaryData = {
//     "Software Engineer": { entry: 70000, mid: 120000, senior: 180000, executive: 250000 },
//     "Product Manager": { entry: 80000, mid: 140000, senior: 200000, executive: 280000 },
//     "Data Scientist": { entry: 75000, mid: 130000, senior: 190000, executive: 260000 },
//     "UX Designer": { entry: 65000, mid: 110000, senior: 160000, executive: 220000 },
//     "Marketing Manager": { entry: 60000, mid: 100000, senior: 150000, executive: 210000 },
//     "Sales Representative": { entry: 50000, mid: 90000, senior: 140000, executive: 200000 },
//     "HR Manager": { entry: 65000, mid: 110000, senior: 160000, executive: 220000 },
//     "Consultant": { entry: 70000, mid: 120000, senior: 180000, executive: 250000 }
//   };

//   // Location adjustment (simplified)
//   const locationMultiplier = location.toLowerCase() === "remote" ? 1.0 :
//                             location.toLowerCase().includes("san francisco") ? 1.3 :
//                             location.toLowerCase().includes("new york") ? 1.2 :
//                             location.toLowerCase().includes("austin") ? 1.1 : 1.0;

//   const baseSalary = salaryData[role]?.[experience_level] || 100000;
//   const adjustedSalary = Math.round(baseSalary * locationMultiplier);

//   return {
//     role,
//     location,
//     experience_level,
//     estimated_salary: adjustedSalary,
//     salary_range: {
//       low: Math.round(adjustedSalary * 0.8),
//       high: Math.round(adjustedSalary * 1.2)
//     },
//     source: "Market data (placeholder)",
//     confidence: "high"
//   };
// }

// export async function calculateRunway(params: z.infer<typeof calculateRunwaySchema>) {
//   const { monthly_savings, monthly_expenses, emergency_fund = 0 } = params;

//   const monthly_net = monthly_savings - monthly_expenses;
//   const months_of_runway = emergency_fund > 0 ? emergency_fund / monthly_expenses : 0;

//   // Calculate runway based on different scenarios
//   const scenarios = {
//     conservative: Math.floor(emergency_fund / (monthly_expenses * 1.2)), // 20% buffer
//     moderate: Math.floor(emergency_fund / monthly_expenses),
//     aggressive: Math.floor(emergency_fund / (monthly_expenses * 0.8)) // 80% of expenses
//   };

//   return {
//     monthly_net_income: monthly_net,
//     emergency_fund,
//     months_of_runway: scenarios.moderate,
//     runway_scenarios: scenarios,
//     recommendation: monthly_net > 0 ?
//       `You can sustain this for ${scenarios.moderate} months with your current emergency fund.` :
//       `Warning: You're spending more than you save. Consider reducing expenses or increasing income.`,
//     break_even_analysis: {
//       required_income: monthly_expenses,
//       current_gap: Math.abs(monthly_net),
//       suggested_actions: monthly_net <= 0 ? [
//         "Reduce discretionary spending by 10-20%",
//         "Look for side income opportunities",
//         "Consider part-time work in target field"
//       ] : ["You're in a good position to transition"]
//     }
//   };
// }

// Tool definitions for Gemini
export const tools = [
  {
    name: "get_market_salary",
    description: "Get market salary data for a specific role and location",
    parameters: {
      type: "object",
      properties: {
        role: {
          type: "string",
          description: "The job title/role to get salary data for"
        },
        location: {
          type: "string",
          description: "Location for salary data (city, state, or 'remote')"
        },
        experience_level: {
          type: "string",
          enum: ["entry", "mid", "senior", "executive"],
          description: "Experience level"
        }
      },
      required: ["role"]
    }
  },
  {
    name: "calculate_runway",
    description: "Calculate financial runway based on savings and expenses",
    parameters: {
      type: "object",
      properties: {
        monthly_savings: {
          type: "number",
          description: "Monthly savings amount in dollars"
        },
        monthly_expenses: {
          type: "number",
          description: "Monthly expenses in dollars"
        },
        emergency_fund: {
          type: "number",
          description: "Emergency fund amount (optional)"
        }
      },
      required: ["monthly_savings", "monthly_expenses"]
    }
  }
];
