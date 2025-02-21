require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const Papa = require("papaparse");
const deepseek = require("./routes/deepseek")
const openrouter = require("./routes/openRouter")

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/deepseek", deepseek)
app.use("/openrouter", openrouter)
// Load spreadsheet data
let faqData = [];

function parseCSV(filePath) {
    const file = fs.readFileSync(filePath, "utf8");
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
            console.log("CSV Data Loaded:", result.data);
        },
    });
}

function parseJSON(data){
  Papa.parse(data, {header:true, complete: (result)=>{
    console.log("JSON Data loaded:",result.data)
    // return results;
  }})
}

parseCSV("users.csv");
parseJSON("users.json");

app.get('/', (req,res)=>{
  res.send('Hi')
})

console.log('what the flip is going on')

// API route to handle chatbot requests
// app.post("/chat", async (req, res) => {
//   console.log('post received')
//   try {
//     console.log("started chat attempt with key - ", process.env.KEY1)
//     const prompt = req.body.message;
//     const completion = await openai.chat.completions.create({
//       messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         {role: "user", content: prompt}],
//       model: "deepseek-chat",
//       stream: true
//     });

//     console.log(completion.choices[0].message.content);

//     res.json({ response: completion.choices[0].message.content });
//   } catch (error) {
//     console.log('API error')
//     res.status(500).json({ error: `AI request failed - ${error}`});
//   }
// });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));