const express = require('express')
const cors = require("cors");
const openrouter = express.Router()
const OpenAI = require("openai");
const fs = require("fs");
const app = express()
const info = require("../info")
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1", // OpenRouter API URL
  apiKey: process.env.OPEN_ROUTER_1        // Private API key from .env
});

app.use(cors())

openrouter
  .route('/deepseek/v3') // requested route is localhost:5000/openrouter/deepseek/v3
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
        model: "deepseek/deepseek-chat:free", // Model - this corresponds to DeepSeek V3 on the OpenRouter API
        // stream: true // We won't need streams for now
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
      res.status(500).json({ error: `API request failed - ${error}\nroute: openRouter/deepseek/v3`});
    }
  });

  function readFile(file){
    return fs.readFileSync(file, 'utf8');
  }

module.exports = openrouter