const fs = require("fs");
const path = require("path");

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
    path.join(__dirname, "../data/animals.json"),
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
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

module.exports = {
  filterByQuery,
  findById,
  createNewAnimal,
  validateAnimal,
};
