const DEEPSEEK_V3 = "http://localhost:5000/deepseek/v3";
const OPEN_ROUTER = "http://localhost:5000/openrouter/deepseek/v3";
const OLLAMA_R1 = "http://localhost:5000/ollama/deepseek/r1/1.5b";
const SERVER = OLLAMA_R1
const messages = [];

const chatWindow = document.querySelector('.chat-window')
const sendBtn = document.querySelector('.send-btn')
const chatContainer = document.querySelector(".chat-container");

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

async function sendMessage() {

    // Grab user input
    const userInput = document.querySelector(".user-input");
    const message = userInput.value.trim(); // take stored value as message to be sent
    
    // if the message is empty (i.e. nohing was typed, immediately exit function)
    if (!message) return;

    // Prevent use from sending anymore messages while the current message is being processed
    disable(true)

    // Create user chat bubble containing the message sent
    chatContainer.innerHTML += `<div class="user"><p>${message}</p></div>`;
    chatContainer.innerHTML += `<div class='chat-typing'><div class='model'><img src="assets/sky-icon.png" alt="icon"><div class="loader model"></div></div><div>`;
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Reset input box
    userInput.value = "";
    console.log(JSON.stringify({ message }))

    // Keep history of messages for logging purposes
    messages.push({role: "user", content: message})

    try {

        // async POST request using fetch, then save response to var 'response'
        const response = await fetch(SERVER, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        console.log('sent POST request')

        // wait for response, then set to 'data'
        const data = await response.json();

        // handle internal error within data
        if(data.error){
            chatContainer.innerHTML += `<div class="model"><img src="assets/sky-icon.png" alt="icon"><p>${data.error}</p></div>`;
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        // handle API overload
        else if(data.response.trim()==""){
            chatContainer.innerHTML += `<div class="error"><p>ERROR: API overloaded, please try again.</p></div>`;
        }

        // Clean data
        else{
            // Create AI chat bubble containing the response
            chatContainer.innerHTML += `<div class="model"><img src="assets/sky-icon.png" alt="icon"><p>${data.response}</p></div>`;
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        // push AI response
        messages.push({role: "system", content: data.response})
    } 
    // if error
    catch (error) {
        chatContainer.innerHTML += `<div class="error"><p>ERROR: Connection failed.</p></div>`;
        chatContainer.innerHTML += `<div class="error"><p>${error}</p></div>`;
    }
    // Remove loader
    document.querySelector('.chat-container .chat-typing').remove()

    //re-enable form submit
    disable(false)
}

function disable(toggle){
    //disable submit
    if(toggle){
        sendBtn.disabled = true
        document.querySelector('.send-btn i').classList.remove('bxs-send')
        document.querySelector('.send-btn i').classList.add('bx-loader-alt')
        document.querySelector('.send-btn i').classList.add('bx-spin')
    }
    //enable submit
    else{
        sendBtn.disabled = false
        document.querySelector('.send-btn i').classList.remove('bx-loader-alt')
        document.querySelector('.send-btn i').classList.remove('bx-spin')
        document.querySelector('.send-btn i').classList.add('bxs-send')
    }
}
