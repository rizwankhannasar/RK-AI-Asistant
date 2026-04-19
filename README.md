# AI Chatbot Assistant ![Logo](logo.png)

## Overview
Modern glassmorphism-style AI chatbot powered by OpenRouter API (GPT-4o-mini). Features smooth animations, typing indicators, tool calling (e.g., get current time), and responsive full-width layout.

**Full-width chat container fix applied**: Chat now spans 100% of the page display.

## Features
- Real-time chat with AI assistant
- Glassmorphism UI design
- Typing indicator
- Message animations
- Custom scrollbar
- Tool calling support (get_time function)
- Responsive design

## Tech Stack
- **Frontend**: HTML5, CSS3 (Glassmorphism), Vanilla JavaScript
- **Backend**: OpenRouter API (GPT-4o-mini model)
- **Fonts**: Google Fonts (Inter)

## Quick Start
1. Open `index.html` directly in your web browser (no server needed).
2. Chat interface loads immediately.
3. Type messages and press Enter or click Send.

## API Configuration
- Uses OpenRouter API key (already configured in `script.js` for demo).
- **Security Note**: API key is client-side for local dev only. For production, proxy through backend.
- Edit `OPENROUTER_API_KEY` in `script.js` for your own key.

## Customization
- **Model**: Change `model` in `script.js` fetch call.
- **Tools**: Extend `tools` array in `script.js`.
- **Styling**: Modify CSS variables in `:root` of `style.css`.
- **System Prompt**: Update `conversationHistory[0].content`.

## Files
- `logo.png` - Project logo
- `index.html` - Main structure and UI
- `style.css` - Glassmorphism styles, animations, responsive layout
- `script.js` - Chat logic, API calls, tool handling
- `TODO.md` - Development progress tracker
- `agent.py` - (Unused in this frontend version)
- `logos/logo.svg` - Alternative SVG logo

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Best experience on desktop; mobile responsive

## Troubleshooting
- **CORS Issues**: Open via `python -m http.server` or live server extension.
- **API Errors**: Check browser console; verify OpenRouter key.
- **No Response**: Ensure internet connection.

---

⭐ **Enjoy chatting with your AI assistant!**
