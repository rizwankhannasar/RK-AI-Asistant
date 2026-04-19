// IMPORTANT: Exposing API keys in client-side code is a security risk for public websites.
// For local testing and development, this is fine, but in production, API calls should be routed through a backend.
const OPENROUTER_API_KEY = "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";

// Chat memory state
let conversationHistory = [
    { role: "system", content: "You are a helpful AI assistant." }
];

const tools = [
    {
        type: "function",
        function: {
            name: "get_time",
            description: "Get current time",
            parameters: {
                type: "object",
                properties: {}
            }
        }
    }
];

function getTime() {
    const now = new Date();
    return { time: now.toLocaleTimeString() };
}

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');
const typingIndicator = document.getElementById('typing-indicator');

// Scroll window to bottom
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add message to UI
function addMessageToUI(content, role) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', role);
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    
    // Simple logic to parse basic newlines (a real app might use marked.js for markdown)
    contentDiv.innerHTML = content.replace(/\n/g, '<br>');
    
    msgDiv.appendChild(contentDiv);
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
}

// Show/Hide typing indicator
function showTyping(show) {
    if (show) {
        typingIndicator.classList.remove('hide');
        scrollToBottom();
    } else {
        typingIndicator.classList.add('hide');
    }
}

async function callAI(messagesArr) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: messagesArr,
                tools: tools
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message;

    } catch (error) {
        console.error("Fetch Error:", error);
        return { role: "assistant", content: "Sorry, I encountered an error. Please try again." };
    }
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const text = userInput.value.trim();
    if (!text) return;

    // Display user message
    addMessageToUI(text, 'user');
    userInput.value = '';
    
    // Add to history
    conversationHistory.push({ role: "user", content: text });
    
    // Show bot typing
    showTyping(true);

    // Call API
    let message = await callAI(conversationHistory);

    // Check if a tool was called
    if (message.tool_calls && message.tool_calls.length > 0) {
        const toolCall = message.tool_calls[0];
        if (toolCall.function.name === "get_time") {
            const result = getTime();
            
            // Add bot's tool call intent to history
            conversationHistory.push(message);
            
            // Add tool response to history
            conversationHistory.push({
                role: "tool",
                content: JSON.stringify(result),
                tool_call_id: toolCall.id
            });

            // Call API again with tool result
            message = await callAI(conversationHistory);
        }
    }

    // Hide typing
    showTyping(false);

    // Display bot response
    addMessageToUI(message.content, 'assistant');
    
    // Add final response to history
    conversationHistory.push(message);
});
