const express = require('express')
const cors = require("cors");
const openrouter = express.Router()
const OpenAI = require("openai");
const app = express()
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_1
});

app.use(cors())

openrouter
  .route('/deepseek/v3')
  .post(async (req, res) => {
    console.log('post received; route: openrouter/deepseek/v3')
    const prompt = req.body.message;
    try {
      console.log("started chat attempt with key -", process.env.OPEN_ROUTER_1)
      console.log(`request body: ${prompt}`)

      // const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      //   method: "POST",
      //   headers: {
      //     "Authorization": `Bearer ${process.env.OPEN_ROUTER_1}`,
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({
      //     "model": "deepseek/deepseek-chat:free",
      //     "messages": [
      //       {
      //         "role": "user",
      //         "content": "What is the meaning of life?"
      //       }
      //     ],
      //     "stream": true
      //   })
      // });

      const response = await openai.chat.completions.create({
        messages: [
          { role: "system", content: `You are Gronk, 10X Hub's customer service agent. Here is some data about 10X Hub's clients: ${JSON.stringify('../users.json')}` },
          {role: "user", content: prompt}],
        model: "deepseek/deepseek-chat:free",
        // stream: true
      });

      if (response.choices && response.choices.length > 0) {
        console.log(response.choices[0].message.content);
        res.json({ response: response.choices[0].message.content });
      } else {
        console.log(`Returned none from API: ${response.choices}`);
        res.status(500).json({ error: `Returned none from API:${response.choices}` });
      }
    } catch (error) {
      console.log(`API error: ${error.stack}`)
      res.status(500).json({ error: `API request failed - ${error}\nroute: openRouter/deepseek/v3`});
    }
  });

module.exports = openrouter