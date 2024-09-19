const mongoose = require("mongoose")


async function connectDB(dbURL){
    try {
        const connectionInstance = await mongoose.connect(dbURL);
        console.log(`MongoDB is connected !! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`mongoDB connectoin error: ${error}`);  
    }
}

module.exports = connectDB