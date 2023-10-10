require("dotenv").config();
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongouri = process.env.MONGO_URI;
const mongoose = require("mongoose");
const app = express();
// I want to import my csv file
const dsb = fs.readFileSync(path.join(__dirname, "dsb.csv"), "utf-8");
const rows = dsb.split("\n");
// Define a mongoose schema
const schema = new mongoose.Schema({
  address: String,
});

// Create a mongoose model
const DsbModel = mongoose.model("DsbModel", schema);

// Save data to MongoDB
const connectDb = async () => {
  // Connect to MongoDB
  await mongoose.connect(mongouri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  rows.forEach(async (row) => {
    const data = row.trim();
    if (data) {
      // Assuming that the first column represents the address
      const newData = new DsbModel({ address: data });
      await newData.save();
    }
  });
};
connectDb();
app.get("/check-address/:address", async (req, res) => {
  const inputAddress = req.params.address; // Convert to lowercase for case-insensitivity

  try {
    const result = await DsbModel.findOne({ address: inputAddress });
    if (result) {
      // Address exists in the database
      res.json({ exists: true, message: "Wallet is whitelisted" });
    } else {
      // Address does not exist in the database
      res.json({ exists: false, message: "Wallet is not whitelisted" });
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3001, function () {
  console.log("App is listening at port 3001");
});
// i want to comnnect to a database
// i want to
