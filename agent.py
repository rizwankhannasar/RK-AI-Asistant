import os
from openai import OpenAI
from dotenv import load_dotenv
import json

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY", "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")
client = OpenAI(
    api_key=api_key,
    base_url="https://openrouter.ai/api/v1"
)

def get_time():
    from datetime import datetime
    return {"time": datetime.now().strftime("%H:%M:%S")}

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_time",
            "description": "Get current time",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    }
]

# Provide the agent with conversation memory
messages = [
    {"role": "system", "content": "You are a helpful AI assistant."}
]

def run_agent(user_input):
    messages.append({"role": "user", "content": user_input})

    response = client.chat.completions.create(
        model="openai/gpt-4o-mini",
        messages=messages,
        tools=tools
    )

    message = response.choices[0].message
    messages.append(message)

    # Check if tool is called
    if message.tool_calls:
        tool_name = message.tool_calls[0].function.name

        if tool_name == "get_time":
            result = get_time()

            messages.append({
                "role": "tool",
                "content": json.dumps(result),
                "tool_call_id": message.tool_calls[0].id
            })

            final = client.chat.completions.create(
                model="openai/gpt-4o-mini",
                messages=messages
            )
            
            final_message = final.choices[0].message
            messages.append(final_message)
            return final_message.content

    return message.content

# Run
print("AI Agent initialized. Type 'exit' to quit.")
while True:
    try:
        user_input = input("You: ")
        if user_input.lower() in ['exit', 'quit']:
            print("Goodbye!")
            break
            
        print("Agent:", run_agent(user_input))
    except (KeyboardInterrupt, EOFError):
        print("\nGoodbye!")
        break
    except Exception as e:
        print(f"Error: {e}")
        break