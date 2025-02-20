require("dotenv").config();
const express = require("express");
const cors = require("cors");

function parseJSON(data){
  Parser.parse(data, {header:true, complete: (results)=>{
    return results;
  }})
}

console.log(parseJSON(csvData))
console.log(parseJSON(csvData.data))