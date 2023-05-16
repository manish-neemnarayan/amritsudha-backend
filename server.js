const mongoose = require("mongoose");
const config = require("./config/index");

const app = require("./app");

// as soon as this function run server and db has been connected
(async() => {
    try {

        await mongoose.connect(config.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("DB is connected")
        // if any error occurs it will be resolved here
        app.on("error", (error) => {
            console.log("ERROR", error);
            throw error;
        })

        // listening app
        app.listen(config.PORT, (req, res) => {
            console.log(`App is listening on port ${config.PORT}`)
        }) 

    } catch (err) {
      console.log("ERROR", err);
      throw err;  // will kill the execution context
    }
})()
