const router = require("express").Router();
const {
  filterByQuery,
  findById,
  createNewAnimal,
  validateAnimal,
} = require("../../lib/animals");
const { animals } = require("../../data/animals");

//the get() method requires two arguements
//the first is a string that describes the route the client will have to fetch from
//the second is a callback function that will execute every time
//that route is accessed with a GET request
//the second takeaway is that we are using the send() method
//from the res(ponse) paramater to send the string 'Hello!' to our client
//req(uest)
router.get("/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  //query takes in the paramater after the ? in the url
  //and turns it into a json in the console
  //whatever string of query parameters you use on the URL will become JSON
  //if i use a query with the same name but different values,
  //then it will become an array in the JSON
  // console.log(req.query);
  //res.json allows us to send lot of json rather than short messages
  res.json(results);
});

//a param route must come after the other GET route
router.get("/animals/:id", (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

//POST requests can package up data (typically as an object),
//and send it to the server
router.post("/animals", (req, res) => {
  //req.body is where our incoming content will be
  //req.body property is where we can access that data
  //on the server side and do something with it
  //using console.log() to view the data we're posting on the server
  // console.log(req.body);

  //set id on what the next index of the array will be
  req.body.id = animals.length.toString();
  // console.log(req.body)

  //if any data in req.body is incorrect, send 404 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send("The animal is not properly formatted.");
  } else {
    //add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);

    //using res.json() to send the data back to the client
    res.json(animal);
  }
});

module.exports = router;