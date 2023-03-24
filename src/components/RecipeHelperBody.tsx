import * as React from "react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import { useState } from "react";

import * as recipesData from "./prototype files/recipes_raw/recipes_raw_nosource_ar.json"

//for speech synth
import speech from 'speech-js';

//for displaying all the filtered recipies
import fillRecipes from "./recipeCards.js";

//for cards
import { Card, Container, Grid, GridListTileBar, Grow, Radio, Typography } from "@material-ui/core";
// import React, {Component,useEffect, useState} from 'react';

import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography'
// import Card from '@mui/material/Card';
// import Typography from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useSwipeable } from "react-swipeable";
import { alignProperty } from "@mui/material/styles/cssUtils";
// import Typography from '@mui/material/Typography';
import { TextField } from '@material-ui/core';

interface Recipe {
    title: string;
    ingredients: string[];
    instructions: string[];
    picture_link: string;
    liked: boolean;
}


const recipes = Object.values(recipesData).map((val) => { //fixed current instruction
    var cleanInstructions = new Array();
    let index = 0;
    let step = "";

    while (val.instructions != null && index < val.instructions.length) {
        step = step + val.instructions[index];
        if (val.instructions[index] == '.') {
            cleanInstructions.push(step); //adds as it's own sentence
            step = "";
        }
        index++;
    }
    return ({
        title: val.title,
        ingredients: val.ingredients,
        // instructions: val.instructions,
        instructions: cleanInstructions,
        picture_link: val.picture_link,
        liked: false,
    } as Recipe)

})


const RecipeHelperBody = (_props: any) => {

    //implement swiper https://www.npmjs.com/package/react-swipeable
    const handlers = useSwipeable({
        onSwiped: (eventData) => console.log("User Swiped!", eventData),
        // onSwipedUp: () => getNextRecipe(recipes,currentRecipe?.title), //change it to the recipe on the left or right
        swipeDuration: 500, // only swipes under 250ms will trigger callbacks
        //         onSwiped: (SwipeEventData) => ({console.log("30")}),
        onSwipedLeft: () => getNextRecipe((filtered == null ? recipes : filtered), currentRecipe?.title),   // After LEFT swipe  (SwipeEventData) => void
        onSwipedRight: () => getPrevRecipe((filtered == null ? recipes : filtered), currentRecipe?.title),   // After RIGHT swipe  (SwipeEventData) => void
        //   onSwipedUp,     // After UP swipe    (SwipeEventData) => void
        //   onSwipedDown,   // After DOWN swipe  (SwipeEventData) => void
        //   onSwipeStart,   // Start of swipe    (SwipeEventData) => void *see details*
        //   onSwiping,      // During swiping    (SwipeEventData) => void
        //   onTap,          // After a tap       ({ event }) => void
    });


    //handle viewing next instruction
    function getInstructionIndex() {
        let currInstructIndex = 0;
        while (currentInstruction != currentRecipe?.instructions[0]) {
            if (currentRecipe?.instructions.length == null)
                return 0; //error the recipe doesn't have instructions
            else if (currentInstruction == currentRecipe.instructions[currInstructIndex]) //if the instructions match
                break;

            currInstructIndex++;
        }

        return currInstructIndex;
    }

    const [postData, setPostData] = useState("");

    const [message, setMessage] = useState("");
    const [currentTranscript, setCurrentTranscript] = useState("");
    const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
    const [filtered, setFiltered] = useState<Recipe[]>(recipes);
    const [currentInstruction, setCurrentInstruction] = useState("");

    const handleFilter = (recipeType: string) => {
        // recipeType = ' '+recipeType;
        const searched = []

        for (const r of recipes) {
            if (r.title != undefined) {
                if(r.title.toLowerCase().indexOf(recipeType) >= 0){
                    searched.push(r)
                }
            }
        }
        setFiltered(searched);
        if (searched.length > 0) {
            setCurrentRecipe(null); //clears current one
            speech.synthesis(`I found a ${searched[0].title} recipe, swipe for other ${recipeType} recipes`, 'en-US') // speech synthesis module
            setCurrentRecipe(searched[0]);

            if (searched[0].instructions != null)
                setCurrentInstruction(searched[0].instructions[0]);

            firstStep();
        }
        else
            speech.synthesis(`No ${recipeType} recipe found.`, 'en-US') // speech synthesis module

    }

    const firstStep = () => {
        speech.synthesis(`The first step is  ${currentRecipe?.instructions[0]} `, 'en-US') // speech synthesis module
        return null;
    }
    const handleStart = (recipeName: string) => {

        if (recipeExists(recipeName)) {
            setCurrentRecipe(getRecipe(recipeName));

            if (currentRecipe != null) {
                if (currentRecipe.instructions != null)
                    setCurrentInstruction(currentRecipe.instructions[0])
            }



            setMessage(`Starting recipe: ${currentRecipe?.title}`);
        }
    }

    const handleNext = () => {

        if (currentRecipe == null) {
            speech.synthesis("No recipe has been started yet", 'en-US') // speech synthesis module
            setMessage("No recipe has been started yet");
        } else {
            // speech.synthesis("the next step is", 'en-US') // speech synthesis module
            setMessage("Now showing the next step")
            /** 
             * GO TO NEXT STEP IN THE RECIPE
             */
            let ind = getInstructionIndex();

            if (ind < currentRecipe.instructions.length - 1) {
                setCurrentInstruction(currentRecipe.instructions[ind + 1]);
                speech.synthesis(`The next step is ${currentInstruction} `, 'en-US') // speech synthesis module
                setMessage("Now showing the next step")
            }
            else
                setMessage("this is the last step")
            speech.synthesis("You're done! this is the last step", 'en-US') // speech synthesis module

        }
    }

    const handleEnd = () => {
        if (currentRecipe == null) {
            setMessage("No recipe has been started yet");
        } else {
            setMessage("Ending recipe")
            setCurrentRecipe(null);
            //POTENTIAL AUDIO OUTPUT
        }
    }

    const recipeExists = (recipeName: string) => {

        for (const r of recipes) {
            if (r.title != undefined) {
                if (r.title == recipeName) {
                    return true;
                }
            }
        }
        return false;

    }

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
        return null
    }


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
    }


    //find recipe to the right of current filtered recipes
    const getNextRecipe = (recipeArr: Recipe[], recipeName?: string) => {

        let org_index = getRecipeIndex(recipeArr, recipeName);
        console.log(currentRecipe);
        if (org_index < recipeArr.length - 1) {
            setCurrentRecipe(recipeArr[org_index + 1]); //changes curr recipe to nexy recipe
            setCurrentInstruction(recipeArr[org_index + 1].instructions[0]); //changes curr instruc to first of recipe
        }
        else
            setMessage("There is no recipe to the left.")


        console.log(currentRecipe);
        return null
    }

    //find recipe to the left of current filtered recipes
    const getPrevRecipe = (recipeArr: Recipe[], recipeName?: string) => {

        let org_index = getRecipeIndex(recipeArr, recipeName);
        //  console.log(currentRecipe);
        if (org_index > 0) {
            setCurrentRecipe(recipeArr[org_index - 1]); //changes curr recipe to nexy recipe

            if (recipeArr[org_index - 1].instructions != null)
                setCurrentInstruction(recipeArr[org_index - 1].instructions[0]); //changes curr instruc to first of recipe
        }
        else {
            setMessage("There is no recipe to the left.")
        }

        //  console.log(currentRecipe);
        return null
    }
    const commands = [
        { //duplicate of show me
            command: 'Find me a :recipeType recipe',
            callback: (recipeType: any) => handleFilter(recipeType)
        },
        {
            command: 'Show me a :recipeType recipe',
            callback: (recipeType: any) => handleFilter(recipeType)
        },
        {
            command: 'Start (the) :recipe recipe',
            callback: (recipe: any) => handleStart(recipe)
        },
        {
            command: '(what\'s the) next (step)',
            callback: () => handleNext()
        },
        {
            command: '(what\'s the) first step',
            callback: () => firstStep()
        },
        {
            command: '(what\'s) after that (step)',
            callback: () => handleNext()
        },
        {
            command: "I'm done (cooking)(baking)",
            callback: () => handleEnd(),

        },
        {
            command: 'reset',
            callback: () => resetTranscript(),
        },
    ];

    const { transcript, resetTranscript } = useSpeechRecognition({ commands });
    let myRecipe = recipes[100];


    if (currentRecipe != null)
        myRecipe = currentRecipe;

    for (const i of myRecipe.ingredients) {
        { i }
    }

    SpeechRecognition.startListening({ continuous: true });

    const clear = () => {
    setPostData("");
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    clear();
    }
          

    return (
        <div>
            <p>{currentInstruction}</p>
            <p>{message}</p>
            <p>{transcript}</p>
<<<<<<< HEAD

            {/* <div {...handlers}> You can swipe here </div> */}
            <div {...handlers}>
                <Typography variant="body1" component="div" align="center">
                    Swipe left & right to see other recipes!
                </Typography>
                <Card style={{ maxWidth: 600, alignSelf: 'center' }}>
                    <CardContent>
                        <Typography variant='h3' gutterBottom>
                        </Typography>
                        <Typography variant="h4" component="div">
                            {myRecipe.title}
                        </Typography>
                        <Typography variant="h5" component="div">
                            Ingredients
                        </Typography>
                        <Typography style={{ marginBottom: 1.5 }} color="textSecondary">
                            {myRecipe.ingredients}
                        </Typography>
                        <Typography variant="h5" component="div">
                            Instructions
                        </Typography>
                        <Typography variant="body1">
                            {myRecipe.instructions}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        {/* <Button onClick={()=>{myRecipe.liked = !myRecipe.liked, console.log(myRecipe.liked)}} size="small">Like this Recipe!</Button> */}
                    </CardActions>
                </Card>
            </div>
=======
    
    {/* <div {...handlers}> You can swipe here </div> */}
    <div {...handlers}>
    <Typography variant="body" component="div" align="center"> 
    Swipe left & right to see other recipes!
        </Typography> 
    <Card sx={{ maxWidth: 600}}>
      <CardContent>
        <Typography variant='h3' gutterBottom>
        </Typography>
        <Typography variant="h4" component="div">
        {myRecipe.title}
        </Typography>
        <Typography variant="h5" component="div"> 
      Ingredients
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {myRecipe.ingredients}
        </Typography>
        <Typography variant="h5" component="div">
      Instructions
        </Typography>
        <Typography variant="body1">
        {myRecipe.instructions}
        </Typography>
      </CardContent>
      <CardActions>
        {/* <Button onClick={()=>{myRecipe.liked = !myRecipe.liked, console.log(myRecipe.liked)}} size="small">Like this Recipe!</Button> */}
      </CardActions>
    </Card>
    </div>
>>>>>>> 6a93e95d740e1817142f1a76a7c2d471ddafedf1
        </div>
    );
};



export default RecipeHelperBody;
