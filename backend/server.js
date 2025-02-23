require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const openai = require("./routes/openai")
const deepseek = require("./routes/deepseek")
const ollama = require("./routes/ollama")
const openrouter = require("./routes/openRouter")

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Set up routes

app.use("/openai", openai)
app.use("/deepseek", deepseek)
app.use("/ollama", ollama)
app.use("/openrouter", openrouter)

app.get('/', (req,res)=>{
  res.send('Hi')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));