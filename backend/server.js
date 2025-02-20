const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const bodyParser = require("body-parser");
const fs = require("fs");
const Papa = require("papaparse");

const app = express();
const PORT = 5000;

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: JSON.parse(fs.readFileSync("backend/keys/keys.json", "utf8"))
});

app.use(cors());
app.use(bodyParser.json());

// Load spreadsheet data
let faqData = [];

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

loadCSV("backend/username.csv");


// API route to handle chatbot requests
app.post("/chat", async (req, res) => {
  console.log('post received')
  try {
    console.log("started chat attempt with key - ",JSON.parse(fs.readFileSync("backend/keys/keys.json", "utf8")))
    const prompt = req.body.message;
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {role: "user", content: prompt}],
      model: "deepseek-chat",
    });

    console.log(completion.choices[0].message.content);

      return res.json({ response: completion.choices[0].message.content });
  } catch (error) {
      return res.status(500).json({ error: "AI request failed - ",error });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));