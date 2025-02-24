const express = require('express')
const cors = require("cors");
const ollama = express.Router()
const OpenAI = require("openai");
const fs = require("fs");
const app = express()
const info = require("../info");
const { Stream } = require('stream');
const openai = new OpenAI({
  baseURL: "http://localhost:11430/v1/", // MUST BE CONNECTED VIA SSH TUNNEL FIRST  
  // required but ignored
  apiKey: 'ollama',
});

app.use(cors())

ollama
  .route('/deepseek/r1') // requested route is localhost:5000/ollama/deepseek/r1
  .post(async (req, res) => { // if it's a POST request

    // Set request message as prompt
    const prompt = req.body.message;

    try {

      // Use openai SDK to make an API call with data, then store response as "response"
      const response = await openai.chat.completions.create({

        // System = model behavior; user = user's prompt; -- this is where the magic happens
        messages: [
          {role: "system", content: `You are Megatron, 10X Hub's AI assistant. Here is some data about some of us at 10X Hub that may help answer some of the user's questions: ${readFile('./users.json')}. ${info}` },
          {role: "user", content: prompt}],
        model: "deepseek-r1:7b", // Model - this corresponds to R1-Distilled Qwen 7B
        // stream: true // We won't need streams for now
        stream: false
      });

      // If there was a response from DeepSeek
      if (response.choices && response.choices.length > 0) {
        console.log(`response:\n${response.choices[0].message.content}`);
        res.json({ response: response.choices[0].message.content });
      } 
      // Handle if no responses from DeepSeek
      else {
        console.log(`Returned none from API: ${response.choices}`);
        res.status(500).json({ error: `Returned none from API:${response.choices}` });
      }
    } 
    // Handle error
    catch (error) {
      console.log(`API error: ${error.stack}`)
      res.status(500).json({ error: `API request failed - ${error}\nroute: ollama/deepseek/r1`});
    }
  });

  function readFile(file){
    return fs.readFileSync(file, 'utf8');
  }

module.exports = ollama