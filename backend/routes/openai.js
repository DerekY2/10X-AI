const express = require('express')
const cors = require("cors");
const GPT = express.Router()
const OpenAI = require("openai");
const app = express()
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_1
});

app.use(cors())

GPT
  .route('/v3')
  .post(async (req, res) => {
    console.log('post received; route: openrouter/deepseek/v3')
    try {
      console.log("started chat attempt with key - ", process.env.DEEPSEEK_1)
      const prompt = req.body.message;
      console.log(`request body: ${req.body}`)
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {role: "user", content: prompt}],
        model: "deepseek-chat",
        stream: true
      });

      console.log(completion.choices[0].message.content);

      res.json({ response: completion.choices[0].message.content });
    } catch (error) {
      console.log('API error')
      res.json({ error: `API request failed - ${error}\nroute: deepseek/v3`});
    }
  });

module.exports = GPT