require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const Papa = require("papaparse");
const openai = require("./routes/openai")
const deepseek = require("./routes/deepseek")
const openrouter = require("./routes/openRouter")

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Set up routes
app.use("/openai", openai)
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
console.log(fs.readFileSync("users.json", "utf8"))

app.get('/', (req,res)=>{
  res.send('Hi')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));