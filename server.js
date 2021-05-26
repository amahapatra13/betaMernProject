const express  = require('express');

const connectDb = require('./config/db');

//Connect the database
connectDb();

const app = express();

app.get('/' , (req,res) => res.send("API Running"));


//Routes
app.use('/api/users', require('./routes/api/user'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/post', require('./routes/api/post'))

const PORT = process.env.NODE_ENV || 5000;

app.listen(PORT , () => {
    console.log(`Sever started on ${PORT}`)
})