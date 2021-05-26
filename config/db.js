const mongoose = require('mongoose');

const config  = require('./config');

const db = config.get('mongoose');

const connectDb = async () => {
    try{
        await mongoose.connect(db);
        console.log('Mongo db connected');
    }catch(err){
        console.log(err.message);
        //Exit
        process.exit(1);

    }
} 

module.exports = connectDb;