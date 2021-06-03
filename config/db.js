const mongoose = require('mongoose');

const config  = require('config');

const db = config.get('mongoose');

const connectDb = async () => {
    try{
        await mongoose.connect(db,{
            useNewUrlParser : true,
            useUnifiedTopology : true,
            useCreateIndex : true,
            useFindAndModify : false
        });
        console.log('Mongo db connected');
    }catch(err){
        console.log(err.message);
        //Exit
        process.exit(1);

    }
} 

module.exports = connectDb;