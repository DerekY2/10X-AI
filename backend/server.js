require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const openai = require("./routes/openai")
const deepseek = require("./routes/deepseek")
const openrouter = require("./routes/openRouter")
const ollama = require("./routes/ollama")

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Set up routes
app.use("/openai", openai)
app.use("/deepseek", deepseek)
app.use("/openrouter", openrouter)
app.use("/ollama", ollama)

app.get('/', (req,res)=>{
  res.send('Hi')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));