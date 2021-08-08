const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const { animals } = require("./data/animals.json");

//will take in req.query as the first paramater and the 'animals' array as the second
function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  //note that we save the animalsArray as filtereResults here:
  let filteredResults = animalsArray;

  if (query.personalityTraits) {
    //save personalityTraits as a dedicated array
    //if personalityTraits is a string, plave it into a new array and save
    if (typeof query.personalityTraits === "string") {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    //loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach((trait) => {
      //check the trait against each animal in the filteredResults array.
      //remember, it is initially a copy of the animalsArray but here we're updating it for each trait in the .forEach() loop.
      //For each trait being targeted by the filter, the filteredResults array will then contain only the entries that contain the trait,
      //so at the end we'll have an array of animals that have every one of the traits when the .forEach() loops is finished
      filteredResults = filteredResults.filter(
        (animal) => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }

  //if the query paramater is a sepcific diet like carnivore then it will filter through the animals array 
  //and find the object with the same carnivore diet and put that into the new filteredResults array
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

//the get() method requires two arguements
//the first is a string that describes the route the client will have to fetch from
//the second is a callback function that will execute every time that route is accessed with a GET request
//the second takeaway is that we are using the send() method from the res(ponse) paramater to send the string 'Hello!' to our client
//req(uest)
app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  //query takes in the paramater after the ? in the url and turns it into a json in the console
  //whatever string of query parameters you use on the URL will become JSON
  //if i use a query with the same name but different values, then it will become an array in the JSON
  console.log(req.query);
  //res.json allows us to send lot of json rather than short messages
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
