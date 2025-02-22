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

app.use(cors())

GPT
  .route('/4o')
  .post(async (req, res) => {
    console.log('post received; route: openai/4o')
    try {
      console.log("started chat attempt with key - ", process.env.OPENAI_1)
      const prompt = req.body.message;
      console.log(`request body: ${req.body}`)
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: `You are Megatron, 10X Hub's AI assistant. Here is some data about 10X Hub's employees that may help answer some of the user's questions: ${readFile('./users.json')}. ${info}` },
          {role: "user", content: prompt}],
        model: "chatgpt-4o-latest",
        // stream: true
      });

      console.log(completion.choices[0].message.content);

      res.json({ response: completion.choices[0].message.content });
    } catch (error) {
      console.log('API error')
      res.json({ error: `API request failed - ${error}\nroute: openai/4o`});
    }
  });

  function readFile(file){
      return fs.readFileSync(file, 'utf8');
    }

module.exports = GPT