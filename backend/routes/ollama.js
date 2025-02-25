const express = require('express')
const cors = require("cors");
const ollama = express.Router()
const OpenAI = require("openai");
const fs = require("fs");
const app = express()
const info = require("../info");
const { Stream } = require('stream');
const local = "localhost"
const streaming = false
const addressWSL = process.env.WSL
const pointer = process.env.POINTER_IP
const ollama_port = process.env.OLLAMA_PORT
const server = process.env.ADDRESS // MUST BE CONNECTED VIA SSH TUNNEL
const address = `http://${local}:${ollama_port}/v1/`
const openai = new OpenAI({
  baseURL: address,
  // required but ignored
  apiKey: 'ollama',
});

app.use(cors())
console.log(`Connected to ${address}`)

ollama
  .route('/deepseek/r1/:distilled') // requested route is localhost:5000/ollama/deepseek/r1
  .post(async (req, res) => { // if it's a POST request

    // Set request message as prompt
    const prompt = req.body.message;
    console.log(`Requesting reseponse from R1-distilled-${req.params.distilled}`)
    console.log(`user:\n${prompt}`)
    try {
      // Use openai SDK to make an API call with data, then store response as "response"
      const response = await openai.chat.completions.create({
        // System = model behavior; user = user's prompt; -- this is where the magic happens
        messages: [
          {role: "system", content: `You are Donald Duck, 10X Hub's AI assistant. Here is some data about some of us at 10X Hub that may help answer some of the user's questions: ${readFile('./users.json')}. ${info}` },
          {role: "user", content: prompt}],
        model: `deepseek-r1:${req.params.distilled}`, // Model - this corresponds to R1-Distilled Qwen
        // stream: true // We won't need streams for now
        stream: streaming
      });

      // If there was a response from DeepSeek
      if (!streaming && response.choices && response.choices.length > 0) {
        console.log(`response:\n${response.choices[0].message.content}`);
        res.json({ response: response.choices[0].message.content });
      } 
      else if(streaming && response){
        let think,final="";
        for await (const message of response) {
          if (message.role === 'system' && message.response.includes('Thinking...')) {
            think += message.response; // Capture thinking part
          } else {
            final += message.response; // Capture final response part
          }
        }
        console.log(`thoughts:\n${think}\nfinal:\n${final}`)
        // Send thinking and output in separate responses
        res.json({
          thinking: think,
          output: final
        });
  
      }
      // Handle if no responses from DeepSeek
      else {
        console.log(`Returned none from API: ${response.choices}`);
        res.status(500).json({ error: `Returned none from API:${response.choices}` });
      }
    } 
    // Handle error
    catch (error) {
      console.log(`API error: ${error.stack}`);
      if (error.response) {
          console.log('Response error:', error.response);
          console.log('Response status:', error.response.status);
          console.log('Response data:', error.response.data);
      } else if (error.request) {
          console.log('Request made but no response received:', error.request);
      } else {
          console.log('General error message:', error.message);
      }
      res.status(500).json({ error: `API request failed - ${error.stack}\nroute: ollama/deepseek/r1` });
  }
  });

  function readFile(file){
    return fs.readFileSync(file, 'utf8');
  }

module.exports = ollama