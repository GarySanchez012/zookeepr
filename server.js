const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require("fs");
const path = require("path");
const { animals } = require("./data/animals.json");
const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");

//middleware that instructs the server to make certain files
//readily available and to not gate it behind a server endpoint
//provided a file path to a location in the application 'zookeepr-public'
//and instructed the server to make these files static resources
//all our front-end code can be accessed without having a specific server endpoint!
app.use(express.static("zookeepr-public"));

//app.use() is a method executed by our express.js server
//that mounts a function to the server that our requests
//will pass htrough before getting to the intended endpoint
//functions we mount to our server are called middleware

//parse incoming string or array data
//express.urlencoded({extended: true}) method takes incoming
//POST data and converts it to key/value pairs
//that can be accessed in the req.body object
//extended: true option informs our server that there may be
//sub-array data nested in it as well
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
//express.json() method takes incoming POST data in the form of
//JSON and parses it into the req.body JS object
app.use(express.json());
//need both middleware functions above when creating  a server
//that's looking to accept POST data

//the app will use the router we set up in apiRoutes
app.use("/api", apiRoutes);

//the router will serve back our html routes
app.use("/", htmlRoutes)

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
