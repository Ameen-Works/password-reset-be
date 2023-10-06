const mongoose = require("mongoose");
const dotenv = require("dotenv");

// dotenv.config({ path: "./DBConfig.env" });

const dbURL = process.env.DB_URL;

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const con = mongoose.connection;

try {
  con.on("open", () => {
    console.log("MongoDB Connected!!!");
  });
} catch (error) {
  console.log(error);
}

module.exports=con;