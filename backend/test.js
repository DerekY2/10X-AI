require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const Papa = require("papaparse");
const OpenAI = require("openai");
const bodyParser = require("body-parser");
const deepseek = require("routes/deepseek")
const app = express();
const PORT = 5000;
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.KEY1
});

app.use("/deepseek", deepseek)
app.use(cors());
app.use(bodyParser.json());

function parseJSON(data){
  Parser.parse(data, {header:true, complete: (results)=>{
    return results;
  }})
}

function loadCSV(filePath) {
    const file = fs.readFileSync(filePath, "utf8");
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
            faqData = result.data;
            console.log("CSV Data Loaded:", faqData);
        },
    });
}

console.log(process.env.KEY1)
loadCSV("username.csv");

app.get('/chat', (req,res)=>{
  res.send('Hi')
})

console.log('what the flip is going on')
// API route to handle chatbot requests
app.post("/chat", async (req, res) => {
  console.log('post received')
  try {
    console.log("started chat attempt with key - ",JSON.parse(fs.readFileSync("backend/keys/keys.json", "utf8")))
    const prompt = req.body.message;
    console.log(prompt)
  } catch (error) {
    res.json({ error: "AI request failed - ",error });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
