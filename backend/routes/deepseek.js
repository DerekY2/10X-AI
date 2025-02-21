const express = require('express')
const cors = require("cors");
const deepseek = express.Router()
const OpenAI = require("openai");
const fs = require("fs");
const info = require("../info")
const app = express()
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_1
});

app.use(cors())

deepseek
  .route('/v3')
  .post(async (req, res) => {
    console.log('post received; route: openrouter/deepseek/v3')
    try {
      console.log("started chat attempt with key - ", process.env.DEEPSEEK_1)
      const prompt = req.body.message;
      console.log(`request body: ${req.body}`)
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: `You are Megatron, 10X Hub's AI assistant. Here is some data about 10X Hub's employees that may help answer some of the user's questions: ${readFile('./users.json')}. ${info}` },
          {role: "user", content: prompt}],
        model: "deepseek-chat",
        // stream: true
      });

      console.log(completion.choices[0].message.content);

      res.json({ response: completion.choices[0].message.content });
    } catch (error) {
      console.log('API error')
      res.json({ error: `API request failed - ${error}\nroute: deepseek/v3`});
    }
  });

  function readFile(file){
      return fs.readFileSync(file, 'utf8');
    }

module.exports = deepseek