const express = require('express')
const cors = require("cors");
const openrouter = express.Router()
const OpenAI = require("openai");
const fs = require("fs");
const app = express()
const info = require("../info")
const {marked} = require('marked');
const {logData} = require('../logger')
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
    const dataset = readFile('./data.csv');

    console.log(`user:\n${prompt}`)

    try {

      // Use openai SDK to make an API call with data, then store response as "response"
      const response = await openai.chat.completions.create({

        // System = model behavior; user = user's prompt; -- this is where the magic happens
        messages: [
          {role: "system", content: `You are Bingus, 10X Hub's AI assistant. Example FAQ's for reference: ${info} ; You must follow the tone instructions. Here is a supplemental list of other organizations and their programs in case the user asks about programs and activities: ${dataset}. You will only provide program/activity information for STEM-related requests, in alignment with 10X Hub's mission. You may return multiple relevant programs if they exist. You must only use information from the dataset provided. Do not hallucinate. Do not mention that you have a dataset.` },
          {role: "user", content: prompt}],
        model: "deepseek/deepseek-chat:free", // Model - this corresponds to DeepSeek V3 on the OpenRouter API
        stream: true // We won't need streams for now
      });

      if(response){
        let final="";
        for await (const message of response) {
          final += message.choices[0].delta.content; // Capture final response part
        }

        const htmlResponse = marked(final);
        console.log(`response:\n${htmlResponse}`)

        logData(prompt, final, htmlResponse, '/openrouter/deepseek/v3')

        // Send thinking and output in separate responses
        res.json({
          response: htmlResponse
        });
      }
      // Handle if no responses from DeepSeek
      else {
        console.log(`Returned none from API: ${response.choices}`);
        res.status(500).json({ error: `<p>Returned none from API:${response.choices}</p>` });
      }
    } 
    // Handle error
    catch (error) {
      console.log(`API error: ${error.stack}`)
      res.status(500).json({ error: `<p>API request failed - ${error} | route: openRouter/deepseek/v3</p>`});
    }
  });

  function readFile(file){
    return fs.readFileSync(file, 'utf8');
  }

module.exports = openrouter