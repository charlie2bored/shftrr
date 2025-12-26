# Gemini API Integration

This directory previously contained model training infrastructure for Career Pivot Coach. Since switching to **Gemini 3 Pro API**, all training files and scripts have been removed.

## Architecture Change

### **Before: Local Model Training**
- Fine-tuned Llama models on career coaching datasets
- Required 1,000+ training examples
- Local processing with Ollama
- Hours of training time

### **Now: Gemini API with Function Calling**
- Pre-trained Gemini 3 Pro model
- Guided by system prompts and tools
- Real-time function calling for data
- Instant deployment, no training required

## Current Files

- `__init__.py` - Python package initialization
- `README.md` - This documentation

## Gemini Integration Details

### **API Endpoint**
Located in: `app/src/app/api/gemini-career-coach/route.ts`

### **System Prompt**
```typescript
// Career pivot agent with strategic guidance
// Uses tools for data-driven advice
// Never gives generic advice, always backs up with data
```

### **Function Calling Tools**
- **`get_market_salary`**: Provides market salary data for roles and locations
- **`calculate_runway`**: Calculates financial runway based on savings and expenses

### **Environment Setup**
```bash
# Add to .env.local
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

## Benefits of Gemini API Approach

✅ **Instant Deployment** - No training time required
✅ **Data-Driven** - Real-time tool access for accurate information
✅ **Scalable** - Handle diverse career scenarios
✅ **Maintainable** - Update behavior via prompts, not retraining
✅ **Powerful** - Access to Gemini's broad knowledge base

## Migration Complete

All training infrastructure has been removed. The career coach now operates entirely through:
- System prompts for behavior guidance
- Function calling for data access
- Gemini's reasoning capabilities

The application is **production-ready** and much more efficient than the previous training-based approach!
