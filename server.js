const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require("fs");
const path = require("path");
const { animals } = require("./data/animals.json");

//middleware that instructs the server to make certain files
//readily available and to not gate it behind a server endpoint
//provided a file path to a location in the application 'zookeepr-public'
//and instructed the server to make these files static resources
//all our front-end code can be accessed without having a specific server endpoint!
app.use(express.static("zookeepr-public"))

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

//will take in req.query as the first paramater
//and the 'animals' array as the second
function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  //note that we save the animalsArray as filtereResults here:
  let filteredResults = animalsArray;

  if (query.personalityTraits) {
    //save personalityTraits as a dedicated array
    //if personalityTraits is a string,
    //place it into a new array and save
    if (typeof query.personalityTraits === "string") {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    //loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach((trait) => {
      //check the trait against each animal in the filteredResults array.
      //remember, it is initially a copy of the animalsArray
      //but here we're updating it for each trait in the .forEach() loop.
      //For each trait being targeted by the filter,
      //the filteredResults array will then contain only the entries that contain the trait,
      //so at the end we'll have an array of animals that have every one of the traits when the .forEach() loops is finished
      filteredResults = filteredResults.filter(
        (animal) => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }

  //if the query paramater is a sepcific diet like carnivore
  //then it will filter through the animals array
  //and find the object with the same carnivore diet
  //and put that into the new filteredResults array
  if (query.diet) {
    filteredResults = filteredResults.filter(
      (animal) => animal.diet === query.diet
    );
  }
  if (query.species) {
    filteredResults = filteredResults.filter(
      (animal) => animal.species === query.species
    );
  }
  if (query.name) {
    filteredResults = filteredResults.filter(
      (animal) => animal.name === query.name
    );
  }
  return filteredResults;
}

//filters through the animal array and checks to see if the id
//in the url matches the id in the objects inside the animals array
//after creating the new array, we put an index of zero at the end
//to specify we are only looking at the first
//(and only) element of that new array
function findById(id, animalsArray) {
  const result = animalsArray.filter((animal) => animal.id === id)[0];
  return result;
}

function createNewAnimal(body, animalsArray) {
  const animal = body;
  animalsArray.push(animal);
  //synchronous version of writeFile because the file we are
  //writing to is small
  //want to write to our animals.json file in the data subdirectory
  //so we use the path.join() method to join the value of
  //__dirname, which represents the directory of the file
  //we execute the code in, with the path to the animals.json file
  fs.writeFileSync(
    path.join(__dirname, "./data/animals.json"),
    JSON.stringify({ animals: animalsArray }, null, 2)
  );

  //return finished code to post route for response
  return animal;
}

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== "string") {
    return false;
  }
  if (!animal.species || typeof animal.species !== "string") {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== "string") {
    return false;
  }
  if (
    !animal.personalityTraits ||
    typeof animal.personalityTraits !== "string"
  ) {
    return false;
  }
  return true;
}

//the get() method requires two arguements
//the first is a string that describes the route the client will have to fetch from
//the second is a callback function that will execute every time
//that route is accessed with a GET request
//the second takeaway is that we are using the send() method
//from the res(ponse) paramater to send the string 'Hello!' to our client
//req(uest)
app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  //query takes in the paramater after the ? in the url
  //and turns it into a json in the console
  //whatever string of query parameters you use on the URL will become JSON
  //if i use a query with the same name but different values,
  //then it will become an array in the JSON
  console.log(req.query);
  //res.json allows us to send lot of json rather than short messages
  res.json(results);
});

//a param route must come after the other GET route
app.get("/api/animals/:id", (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

//POST requests can package up data (typically as an object),
//and send it to the server
app.post("/api/animals", (req, res) => {
  //req.body is where our incoming content will be
  //req.body property is where we can access that data
  //on the server side and do something with it
  //using console.log() to view the data we're posting on the server
  // console.log(req.body);

  //set id on what the next index of the array will be
  req.body.id = animals.length.toString();

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

//route for index.html file
app.get("/", (req, res) => {
  //this GET route responds with an html page to display in the browser
  //tell where to find the file we want our server to read and send it back to the client
  res.sendFile(path.join(__dirname, "./zookeepr-public/index.html"));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
