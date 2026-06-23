# Groq API Integration Guide

## Quick Setup

### 1. Get Your Groq API Key
1. Visit https://console.groq.com/keys
2. Sign up or log in
3. Click "Create API Key"
4. Copy the key (starts with `gsk_`)

### 2. Add to .env File
```env
GROQ_API_KEY=gsk_your_actual_key_here
GROQ_MODEL=llama-3.3-70b-versatile
DEFAULT_AI_PROVIDER=groq
```

### 3. Restart Dev Server
```bash
# Stop current server (Ctrl+C in terminal)
npm run dev
```

## Testing the Chat

### Start the App
```bash
npm run dev
```

### Navigate to Chat
Open browser: http://localhost:3000/dashboard/employees/marketing-director

### Test Features
1. **Send a message** → Should stream real AI response (not mock)
2. **Click suggested prompts** → Populates input with brand name
3. **Toggle history** → Collapse/expand button in header
4. **Rename conversation** → Double-click any conversation title
5. **Delete conversation** → Hover over conversation, click trash icon
6. **Message actions** → Hover over AI message to see Copy/Save/Regenerate/Feedback
7. **Scroll up** → "Jump to latest" pill appears during streaming
8. **Switch employee** → Click "Switch" button in header
9. **Mobile view** → Resize to <768px to see drawer history

## Available Groq Models

Change `GROQ_MODEL` in `.env`:

| Model | Speed | Quality | Best For |
|-------|-------|---------|----------|
| `llama-3.3-70b-versatile` | Fast | Excellent | **Default - all tasks** |
| `llama-3.1-8b-instant` | Very Fast | Good | Quick responses |
| `mixtral-8x7b-32768` | Fast | Very Good | Long context (32k) |
| `gemma2-9b-it` | Fast | Good | Google's model |

See all models: https://console.groq.com/docs/models

## How It Works

### Without Groq Key
- Mock streaming responses with placeholder text
- No API calls made
- Safe for development/UI testing

### With Groq Key
- Real AI responses stream token-by-token
- Brand Brain context injected into system prompt
- Messages saved to database
- Ellipsis fallback if >2s delay

### Fallback Behavior
If Groq API fails:
1. Error shown inline in chat
2. "Try again" button appears
3. User message preserved
4. No data loss

## Troubleshooting

### "Failed to generate response"
- Check `GROQ_API_KEY` is correct in `.env`
- Verify key at https://console.groq.com/keys
- Restart dev server after changing `.env`

### Slow responses
- Try faster model: `GROQ_MODEL=llama-3.1-8b-instant`
- Check internet connection
- Groq is usually very fast (<1s first token)

### Type errors
```bash
npm run build
```
Should compile cleanly. If not, check for TypeScript errors.

## Environment Variables Reference

```env
# Required for Groq
GROQ_API_KEY=                    # Your Groq API key
GROQ_MODEL=llama-3.3-70b-versatile  # Model to use
DEFAULT_AI_PROVIDER=groq         # Set groq as default

# Optional: Other providers still work
OPENAI_API_KEY=                  # OpenAI backup
ANTHROPIC_API_KEY=               # Claude backup
```

## Switching Providers

To use OpenAI instead of Groq:
```env
DEFAULT_AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

To use multiple providers, change `DEFAULT_AI_PROVIDER` and restart.

## Cost

Groq is currently **free** for development with generous rate limits:
- 30 requests/minute
- Fast inference (LPU hardware)
- No credit card required for signup

Check pricing: https://groq.com/pricing/