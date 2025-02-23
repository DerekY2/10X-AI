const express = require('express')
const cors = require("cors");
const ollama = express.Router()
const OpenAI = require("openai");
const fs = require("fs");
const app = express()
const info = require("../info");
const { Stream } = require('stream');
const {marked} = require('marked');
const {logData} = require('../logger')
const local = "localhost"
const addressWSL = process.env.WSL
const pointer = process.env.POINTER_IP
const ollama_port = process.env.OLLAMA_PORT
const server = process.env.ADDRESS // MUST BE CONNECTED VIA SSH TUNNEL
const address = `http://${local}:${ollama_port}/v1/`
const openai = new OpenAI({
  baseURL: address,
  // required but ignored
  apiKey: 'ollama',
});

const streaming = true

app.use(cors())
// console.log(`Connected to ${address}`)
const dataset = readFile('./data.csv');

ollama
  .route('/deepseek/r1/:distilled') // requested route is localhost:5000/ollama/deepseek/r1
  .post(async (req, res) => { // if it's a POST request

    // Set request message as prompt
    const prompt = req.body.message;
    console.log(`Requesting reseponse from R1-distilled-${req.params.distilled}`)
    console.log(`user:\n${prompt}`)
    try {
      // Use openai SDK to make an API call with data, then store response as "response"
      const response = await openai.chat.completions.create({
        // System = model behavior; user = user's prompt; -- this is where the magic happens
        messages: [
          {role: "system", content: `You are Bingus, 10X Hub's AI assistant. Example FAQ's for reference: ${info} ; You must follow the tone instructions. Here is a supplemental list of other organizations and their programs in case the user asks about programs and activities: ${dataset}. You may return multiple relevant programs if they exist. Do not mention that you have a dataset.` },
          {role: "user", content: prompt}],
        model: `deepseek-r1:${req.params.distilled}`, // Model - this corresponds to R1-Distilled Qwen
        // stream: true // We won't need streams for now
        stream: true
      });

      if(response){
        let final="";
        for await (const message of response) {
          final += message.choices[0].delta.content; // Capture final response part
        }

        const htmlResponse = marked(final);
        console.log(`response:\n${htmlResponse}`)

        logData(prompt, final, htmlResponse, '/ollama/deepseek/r1/:distilled')

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
      console.log(`API error: ${error.stack}`);
      if (error.response) {
          console.log('Response error:', error.response);
          console.log('Response status:', error.response.status);
          console.log('Response data:', error.response.data);
      } else if (error.request) {
          console.log('Request made but no response received:', error.request);
      } else {
          console.log('General error message:', error.message);
      }
      res.status(500).json({ error: `<p>API request failed - ${error} | route: ollama/deepseek/r1</p>` });
  }
  });

  function readFile(file){
    return fs.readFileSync(file, 'utf8');
  }

module.exports = ollama