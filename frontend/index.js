const DEEPSEEK_V3 = "http://localhost:5000/deepseek/v3";
const OPEN_ROUTER = "http://localhost:5000/openrouter/deepseek/v3";

const SERVER = OPEN_ROUTER

document.getElementById("send-button").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") sendMessage();
});

async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const message = userInput.value.trim();

    if (!message) return;

    chatBox.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
    userInput.value = "";
    console.log(JSON.stringify({ message }))
    try {
        const response = await fetch(SERVER, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        console.log('sent POST request')
        const data = await response.json();

        if(data.error){
            chatBox.innerHTML += `<div><strong>DeepSeek V3:</strong> ${data.error}</div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }
        else{
            chatBox.innerHTML += `<div><strong>DeepSeek V3:</strong> ${data.response}</div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    } catch (error) {
        chatBox.innerHTML += `<div><strong>DeepSeek V3:</strong> Error: Unable to reach server</div>`;
    }
}
