// import * as React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useState } from "react";
import * as recipesData from "./prototype files/recipes_raw/recipes_raw_nosource_ar.json";

// import * as React from 'react';
import IconButton from "@mui/material/IconButton";
// import SearchIcon from '@mui/icons-material/Search';

//for speech synth
import speech from "speech-js";

//for displaying all the filtered recipies
// import fillRecipes from "./recipeCards.js";

//for cards
import {
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
} from "@material-ui/core";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
// import Button from '@mui/material/Button';
import { useSwipeable } from "react-swipeable";
import Typography from "@mui/material/Typography";
import { AppBar, Button, Container, TextField } from "@material-ui/core";
import { Header } from "./ui/Header";
import { ArrowCircleLeft, ArrowCircleRight } from "@mui/icons-material";

import SearchIcon from "@mui/icons-material/Search";
import { Recipe } from "../types";
import { RecipeCard } from "./ui/recipeCard";

const recipes = Object.values(recipesData).map((val) => {
  //fixed current instruction
  var cleanInstructions = new Array();
  let index = 0;
  let step = "";
  let _veg = false;
  let _vegan = false;
  let _pesc = false;

  while (val.instructions != null && index < val.instructions.length) {
    step = step + val.instructions[index];
    if (val.instructions[index] == ".") {
      cleanInstructions.push(step); //adds as it's own sentence
      step = "";
    }
    index++;
  }

  if (val.title != null) {
    if (val.title.includes("Vegan")) {
      _vegan = true;
      _veg = true;
      _pesc = true;
    }

    if (val.title.includes("Vegetarian")) _veg = true;
    _pesc = true;

    if (val.title.includes("pescatarian")) {
      _pesc = true;
    }

    //add a gluten option?
  }

  return {
    title: val.title,
    ingredients: val.ingredients,
    // instructions: val.instructions,
    instructions: cleanInstructions,
    picture_link: val.picture_link,
    liked: false,
    veg: _veg,
    vegan: _vegan,
    pesc: _pesc,
  } as Recipe;
});

const RecipeHelperBody = (_props: any) => {
  //implement swiper https://www.npmjs.com/package/react-swipeable
  const handlers = useSwipeable({
    onSwiped: (eventData: any) => console.log("User Swiped!", eventData),
    swipeDuration: 500, // only swipes under 250ms will trigger callbacks
    onSwipedLeft: () =>
      getNextRecipe(
        filtered == null ? recipes : filtered,
        currentRecipe?.title
      ), // After LEFT swipe  (SwipeEventData) => void
    onSwipedRight: () =>
      getPrevRecipe(
        filtered == null ? recipes : filtered,
        currentRecipe?.title
      ), // After RIGHT swipe  (SwipeEventData) => void
  });

  //handle viewing next instruction
  function getInstructionIndex() {
    let currInstructIndex = 0;
    while (currentInstruction != currentRecipe?.instructions[0]) {
      if (currentRecipe?.instructions.length == null)
        return 0; //error the recipe doesn't have instructions
      else if (
        currentInstruction == currentRecipe.instructions[currInstructIndex]
      )
        //if the instructions match
        break;

      currInstructIndex++;
    }

    return currInstructIndex;
  }

  const [postData, setPostData] = useState("");
  const [message, setMessage] = useState("");
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [currentRecipe, setCurrentRecipe] = useState<Recipe>(recipes[0]);
  const [filtered, setFiltered] = useState<Recipe[]>(recipes);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [restrictions, setRestrictions] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [keyword, setKeyword] = useState(" ");
  const [currentInstruction, setCurrentInstruction] = useState(
    "You haven't started yet!"
  );

  const handleFilter = (recipeType: string) => {
    // recipeType = ' '+recipeType;
    const searched = [];

    setKeyword(recipeType);
    resetTranscript(); //it got the keyword it needed.

    for (const r of recipes) {
      if (r.title != undefined) {
        if (r.title.toLowerCase().indexOf(recipeType) >= 0) {
          searched.push(r);
        }
      }
    }
    setFiltered(searched);
    if (searched.length > 0) {
      console.log(
        `I found a ${searched[0].title} recipe. You can swipe for other ${recipeType} recipes`
      );
      speech.synthesis(
        `I found a ${searched[0].title} recipe. You can swipe for other ${recipeType} recipes`,
        "en-US"
      ); // speech synthesis module
      setCurrentRecipe(searched[0]);

      if (searched[0].instructions != null)
        setCurrentInstruction(searched[0].instructions[0]);

      firstStep();
    } else speech.synthesis(`No ${recipeType} recipe found.`, "en-US"); // speech synthesis module
  };

  const readIngredient = (factor: number) => {
    speech.synthesis(`${currentRecipe?.ingredients[factor]} `, "en-US"); // speech synthesis module
  };

  const handleIngredients = (factor: number) => {
    let ingredientsIndex = currentRecipe?.ingredients.length;
    let str = currentRecipe?.ingredients[0];

    let i = 1;
    while (i < ingredientsIndex) {
      console.log(ingredientsIndex + i);
      if (i + 1 == ingredientsIndex)
        str = str + ".    and" + currentRecipe?.ingredients[i];
      else str = str + ".    " + currentRecipe?.ingredients[i];
      i++;
    }

    //update all instruction values if you are doubling it

    speech.synthesis(
      `There are ${currentRecipe?.ingredients.length} ingredients for ${currentRecipe?.title}  . ${str}`,
      "en-US"
    ); // speech synthesis module
    var cleanIngerdients = new Array();

    while (i < ingredientsIndex) {
      console.log(ingredientsIndex + i);
      cleanIngerdients.push(currentRecipe?.ingredients[i]);
      i++;
      readIngredient(2);
    }

    cleanIngerdients.forEach((element) => {
      speech.synthesis("hi", "en-US"); // speech synthesis module

      console.log({ element });
    });

    return null;
  };

  const firstStep = () => {
    speech.synthesis(
      `The first step is  ${currentRecipe?.instructions[0]} `,
      "en-US"
    ); // speech synthesis module
    console.log("Getting first step");
    return null;
  };

  const handleStart = (recipeName: string) => {
    const recipe = getRecipe(recipeName);
    if (recipe === undefined) {
      setMessage("Invalid Recipe");
    } else {
      setCurrentRecipe(recipe);
    }

    if (currentRecipe != null) {
      if (currentRecipe.instructions != null)
        setCurrentInstruction(currentRecipe.instructions[0]);
    }
    if (recipeExists(recipeName)) {
      setMessage(`Starting recipe: ${currentRecipe?.title}`);
    }
  };

  const handleNext = (mirror: string) => {
    speech.synthesis("the next step is", "en-US"); // speech synthesis module

    if (currentRecipe == null) {
      speech.synthesis("No recipe has been started yet", "en-US"); // speech synthesis module
      setMessage("No recipe has been started yet");
    } else {
      setMessage("Now showing the next step");
      /**
       * GO TO NEXT STEP IN THE RECIPE
       */
      let ind = getInstructionIndex();

      if (ind < currentRecipe.instructions.length - 1) {
        setCurrentInstruction(currentRecipe.instructions[ind + 1]);
        if (mirror.includes("step"))
          speech.synthesis(`The next step is ${currentInstruction} `, "en-US");
        // speech synthesis module
        else speech.synthesis(`After that ${currentInstruction} `, "en-US"); // speech synthesis module

        setMessage("Now showing the next step");
      } else setMessage("this is the last step");
      speech.synthesis("You're done! this is the last step.", "en-US"); // speech synthesis module
    }
  };

  const handleEnd = () => {
    if (currentRecipe == null) {
      setMessage("No recipe has been started yet");
    } else {
      setMessage("Okay, see ya later al ligator");
      setCurrentRecipe(recipes[0]);
      speech.synthesis("Okay, see ya later al ligator", "en-US"); // speech synthesis module

      //POTENTIAL AUDIO OUTPUT
    }
  };

  const recipeExists = (recipeName: string) => {
    for (const r of recipes) {
      if (r.title != undefined) {
        if (r.title == recipeName) {
          return true;
        }
      }
    }
    return false;
  };

  const getRecipe = (recipeName: string) => {
    /**
     * SEARCH THROUGH RECIPE LIST
     *
     * IF THE RECIPE AT WHATEVER INDEX HAS THE SAME TITLE
     *  RETURN THAT RECIPE AS A RECIPE TYPE
     */
    for (const r of recipes) {
      if (r.title != undefined) {
        if (r.title == recipeName) {
          return r;
        }
      }
    }
    // return null;
  };

  //for swiper
  //find recipe to the left of current filtered recipies

  const getRecipeIndex = (recipeArr: Recipe[], recipeName?: string) => {
    let org_index = 0;

    for (const r of recipeArr) {
      if (r.title != undefined && recipeName != null) {
        if (r.title == recipeName) {
          break; //found the current recipe
        }
      }
      org_index++;
    }
    return org_index;
  };

  //find recipe to the right of current filtered recipes
  const getNextRecipe = (recipeArr: Recipe[], recipeName?: string) => {
    let org_index = getRecipeIndex(recipeArr, recipeName);
    if (org_index < recipeArr.length - 1) {
      setCurrentRecipe(recipeArr[org_index + 1]); //changes curr recipe to nexy recipe
      setCurrentInstruction(recipeArr[org_index + 1].instructions[0]); //changes curr instruc to first of recipe
    } else setMessage("There is no recipe to the left.");
    return null;
  };

  //find recipe to the left of current filtered recipes
  const getPrevRecipe = (recipeArr: Recipe[], recipeName?: string) => {
    let org_index = getRecipeIndex(recipeArr, recipeName);
    //  console.log(currentRecipe);
    if (org_index > 0) {
      setCurrentRecipe(recipeArr[org_index - 1]); //changes curr recipe to nexy recipe

      if (recipeArr[org_index - 1].instructions != null)
        setCurrentInstruction(recipeArr[org_index - 1].instructions[0]); //changes curr instruc to first of recipe
    } else {
      setMessage("There is no recipe to the left.");
    }

    //  console.log(currentRecipe);
    return null;
  };
  const commands = [
    {
      //duplicate of show me
      command: "(Find) (me) (a)(an) :recipeType recipe",
      callback: (recipeType: any) => handleFilter(recipeType),
    },
    {
      command: "Show me (a)(an) :recipeType recipe",
      callback: (recipeType: any) => handleFilter(recipeType),
    },
    {
      command: "Start (the) :recipe recipe",
      callback: () => handleStart(currentRecipe.title),
    },
    {
      command: "(what's the) next (step)",
      callback: () => handleNext("step"),
    },
    {
      command: "(what's)(the) first (step)",
      callback: () => firstStep(),
    },
    {
      command: "(what's)(the step) after that (step)",
      callback: () => handleNext("after"),
    },
    {
      command: "(what) (are) (the) (required) ingredients",
      callback: () => handleIngredients(1),
    },
    {
      command: "I'm done (cooking)(baking)",
      callback: () => handleEnd(),
    },
    {
      command: "reset",
      callback: () => resetTranscript(),
    },
  ];

  const { transcript, resetTranscript } = useSpeechRecognition({ commands });
  let myRecipe = recipes[100];

  if (currentRecipe != null) myRecipe = currentRecipe;

  SpeechRecognition.startListening({ continuous: true });

  //handle form
  const clear = () => {
    setPostData("");
  };

  const makeIngredients = () => {
    var cleanIngredients = new Array();
    let index = 0;

    while (index < myRecipe.ingredients.length) {
      cleanIngredients.push(
        <Typography style={{ marginBottom: 1.5 }} color="textSecondary">
          {myRecipe.ingredients[index]}
        </Typography>
      );
      index++;
    }

    return cleanIngredients;
  };

  const makeInstructions = () => {
    var cleanIngredients = new Array();
    let index = 0;

    while (index < myRecipe.instructions.length) {
      if (myRecipe.instructions[index] == currentInstruction) {
        cleanIngredients.push(
          <Typography style={{ marginBottom: 1.5 }}>
            <b>
              {" "}
              {index + 1}. {myRecipe.instructions[index]}{" "}
            </b>
          </Typography>
        );
      } else {
        cleanIngredients.push(
          <Typography style={{ marginBottom: 1.5 }}>
            {index + 1}. {myRecipe.instructions[index]}
          </Typography>
        );
      }

      index++;
    }

    return cleanIngredients;
  };

  //sorry it's way too nested
  //PrimarySearchAppBar look up for more menu nav stuff
  const favLinks = (ind: number) => {};
  const makeFavorites = () => {
    const searched = [];

    for (const f of favorites) {
      if (f < recipes.length) {
        if (recipes[f]) {
          searched.push(recipes[f]);
        }
      }
    }

    setFiltered(searched);
    setCurrentRecipe(filtered[0]);
    setCurrentInstruction(filtered[0].instructions[0]);
  };

  const displayFavorites = () => {
    var favs = new Array();
    let index = 0;
    let t = "";
    recipes.map((recipe) => {
      if (recipe.liked) {
        t = recipe.title;
        t = t.toLowerCase();
        favs.push(
          <Button onClick={() => makeFavorites()}>
            <Typography variant="h6" component="div">
              {recipe.title}{" "}
            </Typography>
          </Button>
        );
      }
    });
    return favs;
  };

  const handleRestrictions = (restriction: number) => {
    if (restrictions[restriction - 1]) {
      let title = currentRecipe.title;
      setFiltered(recipes);
      setCurrentRecipe(filtered[getRecipeIndex(filtered, title)]);
      restrictions[restriction - 1] = false;
      return;
    }

    restrictions[restriction - 1] = true;
    //further filters the recipe

    //None = 0
    //pescitarian = 1
    //vegitarian = 2
    //vegan = 3
    let index = 0;
    var newList = new Array();
    let saveCurrRep = currentRecipe;
    let found = false;
    let orgRec = 0;

    while (index < filtered.length) {
      if (filtered[index].vegan) {
        newList.push(filtered[index]);
      } else if (filtered[index].veg && restriction <= 2) {
        newList.push(filtered[index]);
      } //doesnt resquire a vegan recipe
      else if (filtered[index].pesc && restriction <= 1) {
        newList.push(filtered[index]);
      } //doesnt resquire a vegan recipe
      else if (restriction == 0) {
        //no restriction
        newList.push(filtered[index]);
      }
      index++;

      if (newList != null && currentRecipe != null) {
        if (
          newList.length > 0 &&
          newList.at(newList.length - 1).title == currentRecipe.title
        )
          orgRec = newList.length - 1;
      }

      if (newList.at(newList.length - 1) == saveCurrRep) {
        found = true;
        orgRec = newList.length - 1;
      }
    }

    setFiltered(newList);
    setCurrentRecipe(filtered[0]); //reset current recipe if qualifies
    setCurrentInstruction(currentRecipe.instructions[0]);

    return newList;
  };

  const handleFavorite = () => {
    var newFavs = new Array();

    currentRecipe.liked = !currentRecipe.liked; //change what it currently looks like
    console.log("Liked: " + currentRecipe.liked);
    let index = 0;
    let currIndex = getRecipeIndex(recipes, currentRecipe.title);

    console.log(
      "current" + recipes[currIndex].title + " aka " + currentRecipe.title
    );

    if (favorites != undefined) {
      if (favorites.includes(currIndex)) {
        console.log(
          "need to remove " +
            recipes[currIndex].title +
            " aka " +
            currentRecipe.title
        );

        while (favorites.length > 0) {
          if (favorites.at(favorites.length - 1) == currIndex) favorites.pop();
          else newFavs.push(favorites.pop());
        }
        setFavorites(newFavs);
      } else {
        favorites.push(currIndex);
      }
    } else {
      setFavorites([currIndex]);
    }
    console.log(favorites);
  };

  if (transcript.length > 100) {
    resetTranscript();
  }

  const handleHeaderClick = () => {
    handleFilter(" ");

    if (restrictions[0]) handleRestrictions(1);

    if (restrictions[1]) handleRestrictions(2);

    if (restrictions[2]) handleRestrictions(3);

    // handleFilter(" ")
  };

  

  // const handleFavorite = () => {
  //   let favs = new Array();
  //   recipes.map((recipe) => {
  //     if (recipe.liked) {
  //       favs.push(getRecipeIndex(recipes, currentRecipe.title));
  //     }
  //   });
  //   if (favs.length > 0) {
  //     setFavorites(favs);
  //   }
  // };

  // handleFavorite();


  return (
    <Container>
      <Grid wrap="wrap" container spacing={4}>
        <AppBar color="inherit" position="sticky">
          <Grid container spacing={1}>
            <Grid onClick={() => handleHeaderClick()} item xs={2}>
              <Header />
            </Grid>
            <Grid item xs={8}>
              <TextField
                name="recipe"
                variant="outlined"
                label="recipe title"
                fullWidth
                value={postData}
                onChange={(e) => setPostData(e.target.value)}
              ></TextField>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                onClick={() => handleFilter(postData)}
              >
                <SearchIcon />
              </Button>
            </Grid>
          </Grid>
        </AppBar>
        <Grid item xs={4}>
          <div>
            <Card style={{ maxWidth: 300 }}>
              <CardContent>
                <Typography variant="h3" gutterBottom></Typography>
                <Typography variant="h5" component="div">
                  Filter Modifications
                </Typography>
                <Typography variant="h6" component="div">
                  Dietary Retrictions
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onClick={(event) => {
                          handleRestrictions(1);
                        }}
                      />
                    }
                    label="Pescatarian"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onClick={() => {
                          handleRestrictions(2);
                        }}
                      />
                    }
                    label="Vegetarian"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onClick={() => {
                          handleRestrictions(3);
                        }}
                      />
                    }
                    label="Vegan"
                  />
                </FormGroup>
                <Typography variant="h5" component="div">
                  Favorites
                </Typography>
                {favorites.toString()}
                {displayFavorites()}
              </CardContent>
              <CardActions></CardActions>
            </Card>
          </div>
        </Grid>

        <Grid item xs={8}>
          <Grid>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <IconButton
                onClick={() =>
                  getPrevRecipe(
                    filtered == null ? recipes : filtered,
                    currentRecipe?.title
                  )
                }
                aria-label="next recipe"
              >
                <ArrowCircleLeft />
              </IconButton>
              <Typography variant="body1" component="div" align="center">
                Search Results: {filtered.length} <br></br> Swipe left or right
                to see other recipes!
              </Typography>
              <IconButton
                onClick={() =>
                  getNextRecipe(
                    filtered == null ? recipes : filtered,
                    currentRecipe?.title
                  )
                }
                aria-label="previous recipe"
              >
                <ArrowCircleRight />
              </IconButton>
            </div>
            <div {...handlers}>
              <RecipeCard
                myRecipe={currentRecipe}
                recipeIndex={getRecipeIndex(filtered, currentRecipe.title) + 1}
                listLength={filtered.length}
                favorite={currentRecipe.liked}
              />
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecipeHelperBody;
