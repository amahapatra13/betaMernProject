const express  = require('express');

const connectDb = require(config/db);

//Connect the database
connectDb();

const app = express();

app.get('/' , (req,res) => res.send("API Running"));

const PORT = process.env.NODE_ENV || 5000;

app.listen(PORT , () => {
    console.log(`Sever started on ${PORT}`)
})