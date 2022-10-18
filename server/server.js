require("dotenv").config();
const { SERVER_PORT } = process.env;

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


app.listen(SERVER_PORT, () => {
    console.log(`Server running on port ${SERVER_PORT}`);
})