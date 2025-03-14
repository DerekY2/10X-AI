const express = require('express')
const cors = require("cors");
const GPT = express.Router()
const OpenAI = require("openai");
const fs = require("fs");
const info = require("../info")
const app = express()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_1
});

const streaming = false;

app.use(cors())

GPT
  .route('/4o')
  .post(async (req, res) => {
    console.log('post received; route: openai/4o')
    try {
      // console.log("started chat attempt with key - ", process.env.OPENAI_1)
      const prompt = req.body.message;
      console.log(`request body: ${req.body}`)
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: `You are Blawgg, 10X Hub's AI assistant. Here is some data about 10X Hub's employees that may help answer some of the user's questions: ${readFile('./users.json')}. ${info}` },
          {role: "user", content: prompt}],
        model: "gpt-4o",
        stream: streaming
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
        res.json({
          output: final
        });
  
      }
      // Handle if no responses from GPT
      else {
        console.log(`Returned none from API: ${response.choices}`);
        res.status(500).json({ error: `Returned none from API:${response.choices}` });
      }
    } 
    catch (error) {
      console.log('API error')
      res.json({ error: `API request failed - ${error} | route: openai/4o`});
    }
  });

  function readFile(file){
      return fs.readFileSync(file, 'utf8');
    }

module.exports = GPT