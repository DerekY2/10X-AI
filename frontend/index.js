const DEEPSEEK_V3 = "http://localhost:5000/deepseek/v3";
const OPEN_ROUTER = "http://localhost:5000/openrouter/deepseek/v3";
const SERVER = OPEN_ROUTER
const messages = [];

const chatWindow = document.querySelector('.chat-window')
const sendBtn = document.querySelector('.send-btn')

// on submit, run sendMessage()
document.querySelector(".send-btn").addEventListener("click", ()=>{
    console.log('sending message');
    sendMessage();
});

// on Enter, run sendMessage()
document.querySelector(".user-input").addEventListener("keydown", function(e) {
    if (e.keyCode == 13 && !e.shiftKey && sendBtn.disabled==false) {
        e.preventDefault();
        sendMessage();
    }
});

document.querySelector(".chat-btn").addEventListener("click",()=>{
    chatWindow.classList.remove('hidden');
})
document.querySelector(".close-btn").addEventListener('click',()=>{
    chatWindow.classList.add('hidden')
})

async function sendMessage(msg = null) {
    const userInput = document.querySelector(".user-input");
    const chatContainer = document.querySelector(".chat-container");
    const message = userInput.value.trim();
    

    if (!message) return;
    disable(true)
    chatContainer.innerHTML += `<div class="user"><p>${message}</p></div>`;
    chatContainer.innerHTML += `<div class='chat-typing'><div class='model'><img src="assets/sky-icon.png" alt="icon"><div class="loader model"></div></div><div>`;
    chatContainer.scrollTop = chatContainer.scrollHeight;
    userInput.value = "";
    console.log(JSON.stringify({ message }))
    messages.push({role: "user", content: message})
    try {
        const response = await fetch(SERVER, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        console.log('sent POST request')
        const data = await response.json();

        if(data.error){
            chatContainer.innerHTML += `<div class="model"><img src="assets/sky-icon.png" alt="icon"><p>${data.error}</p></div>`;
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }else if(data.response.trim()==""){
            chatContainer.innerHTML += `<div class="error"><p>ERROR: API overloaded, please try again.</p></div>`;
        }
        else{
            chatContainer.innerHTML += `<div class="model"><img src="assets/sky-icon.png" alt="icon"><p>${data.response}</p></div>`;
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        messages.push({role: "system", content: data.response})
    } catch (error) {
        chatContainer.innerHTML += `<div class="error"><p>ERROR: Connection failed.</p></div>`;
    }
    document.querySelector('.chat-container .chat-typing').remove()
    disable(false)
}

function disable(toggle){
    if(toggle){
        sendBtn.disabled = true
        document.querySelector('.send-btn i').classList.remove('bxs-send')
        document.querySelector('.send-btn i').classList.add('bx-loader-alt')
        document.querySelector('.send-btn i').classList.add('bx-spin')
    }
    else{
        sendBtn.disabled = false
        document.querySelector('.send-btn i').classList.remove('bx-loader-alt')
        document.querySelector('.send-btn i').classList.remove('bx-spin')
        document.querySelector('.send-btn i').classList.add('bxs-send')
    }
}
