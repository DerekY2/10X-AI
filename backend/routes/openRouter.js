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

const streaming = false;

app.use(cors())

openrouter
  .route('/deepseek/v3') // requested route is localhost:5000/openrouter/deepseek/v3
  .post(async (req, res) => { // if it's a POST request

    // Set request message as prompt
    const prompt = req.body.message;
    const dataset = readFile('./data.csv');

    console.log(`user:\n${prompt}`)

    try {

      // Use openai SDK to make an API call with data, then store response as "response"
      const response = await openai.chat.completions.create({

        // System = model behavior; user = user's prompt; -- this is where the magic happens
        messages: [
          {role: "system", content: `You are Blawgg, 10X Hub's AI assistant. Here is some data about some of us at 10X Hub that may help answer some of the user's questions: ${dataset}. Example FAQ's for reference: ${info} ; You must folow the tone instructions.` },
          {role: "user", content: prompt}],
        model: "deepseek/deepseek-chat:free", // Model - this corresponds to DeepSeek V3 on the OpenRouter API
        stream: streaming // We won't need streams for now
      });

      // If there was a response from DeepSeek
      if (!streaming && response.choices && response.choices.length > 0) {
        console.log(`response:\n${response.choices[0].message.content}`);
        res.json({ response: response.choices[0].message.content });
      } 
      else if(streaming && response){
        let final="";
        for await (const message of response) {
            final += message.response; // Capture final response part
        }
        console.log(`response:\n${final}`)
        // Send thinking and output in separate responses
        res.json({
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
      console.log(`API error: ${error.stack}`)
      res.status(500).json({ error: `API request failed - ${error} | route: openRouter/deepseek/v3`});
    }
  });

  function readFile(file){
    return fs.readFileSync(file, 'utf8');
  }

module.exports = openrouter