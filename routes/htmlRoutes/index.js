const router = require("express").Router();
const path = require("path");

//route for index.html file
router.get("/", (req, res) => {
  //this GET route responds with an html page to display in the browser
  //tell where to find the file we want our server to read and send it back to the client
  res.sendFile(path.join(__dirname, "../../zookeepr-public/index.html"));
});

//route for animals.html file
router.get("/animals", (req, res) => {
  res.sendFile(path.join(__dirname, "../../zookeepr-public/animals.html"));
});

//route for zookeepers.html file
router.get("/zookeepers", (req, res) => {
  res.sendFile(path.join(__dirname, "../../zookeepr-public/zookeepers.html"));
});

//"wildcard" route
//* route should always come last otherwise it will take precedence
//over named route and won't see what i expect on routes like /zookeeper
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../zookeepr-public/index.html"));
});

module.exports = router;
