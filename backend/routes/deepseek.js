const express = require('express')
const cors = require("cors");
const deepseek = express.Router()
const OpenAI = require("openai");
const fs = require("fs");
const info = require("../info")
const app = express()
const {marked} = require('marked');
const {logData} = require('../logger')
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_1
});

app.use(cors())
const dataset = readFile('./data.csv');

deepseek
  .route('/v3')
  .post(async (req, res) => {
    console.log('post received; route: openrouter/deepseek/v3')
    try {
      console.log("started chat attempt with key - ", process.env.DEEPSEEK_1)
      const prompt = req.body.message;
      console.log(`request body: ${req.body}`)
      const response = await openai.chat.completions.create({
        messages: [
          { role: "system", content: `You are Bingus, 10X Hub's AI assistant. Example FAQ's for reference: ${info} ; You must follow the tone instructions. Here is a supplemental list of other organizations and their programs in case the user asks about programs and activities: ${dataset}. You may return multiple relevant programs if they exist. Do not mention that you have a dataset.` },
          {role: "user", content: prompt}],
        model: "deepseek-chat",
        stream: true
      });

      if(response){
        let final="";
        for await (const message of response) {
          final += message.choices[0].delta.content; // Capture final response part
        }

        const htmlResponse = marked(final);
        console.log(`response:\n${htmlResponse}`)

        logData(prompt, final, htmlResponse, '/deepseek/v3')

        // Send thinking and output in separate responses
        res.json({
          response: htmlResponse
        });
      }
      else {
        console.log(`Returned none from API: ${response.choices}`);
        res.status(500).json({ error: `<p>Returned none from API:${response.choices}</p>` });
      }
    } catch (error) {
      console.log('API error')
      res.json({ error: `<p>API request failed - ${error} | route: deepseek/v3</p>`});
    }
  });

  function readFile(file){
      return fs.readFileSync(file, 'utf8');
    }

module.exports = deepseek