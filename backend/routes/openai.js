const express = require('express')
const cors = require("cors");
const GPT = express.Router()
const OpenAI = require("openai");
const fs = require("fs");
const info = require("../info")
const {marked} = require('marked');
const {logData} = require('../logger')
const app = express()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_1
});

const streaming = false;

app.use(cors())
const dataset = readFile('./data.csv');

GPT
  .route('/4o')
  .post(async (req, res) => {
    console.log('post received; route: openai/4o')
    try {
      // console.log("started chat attempt with key - ", process.env.OPENAI_1)
      const prompt = req.body.message;
      console.log(`request body: ${req.body}`)
      const response = await openai.chat.completions.create({
        messages: [
          { role: "system", content: `You are Bingus, 10X Hub's AI assistant. Example FAQ's for reference: ${info} ; You must follow the tone instructions. Here is a supplemental list of other organizations and their programs in case the user asks about programs and activities: ${dataset}. You may return multiple relevant programs if they exist. Do not mention that you have a dataset.` },
          {role: "user", content: prompt}],
        model: "gpt-4o",
        stream: streaming
      });

      if(response){
        let final="";
        for await (const message of response) {
          final += message.choices[0].delta.content; // Capture final response part
        }

        const htmlResponse = marked(final);
        console.log(`response:\n${htmlResponse}`)

        logData(prompt, final, htmlResponse, '/openai/4o')

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
    catch (error) {
      console.log('API error')
      res.json({ error: `<p>API request failed - ${error} | route: openai/4o</p>`});
    }
  });

  function readFile(file){
      return fs.readFileSync(file, 'utf8');
    }

module.exports = GPT