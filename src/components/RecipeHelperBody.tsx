
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
import { Card, Grid, GridListTileBar, Grow, Radio } from "@material-ui/core";
// import React, {Component,useEffect, useState} from 'react';

// import { TextField } from '@material-ui/core';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
import { useSwipeable } from "react-swipeable";
// import Typography from '@mui/material/Typography';

import useStyles from "./styles";

// import {Grid, Grow, Paper} from "@material-ui/core";
// import React from "react";
import { AppBar, Button, Container, TextField, Typography } from "@material-ui/core";


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
        swipeDuration: 500, // only swipes under 250ms will trigger callbacks
        onSwipedLeft: () => getNextRecipe((filtered == null ? recipes : filtered), currentRecipe?.title),   // After LEFT swipe  (SwipeEventData) => void
        onSwipedRight: () => getPrevRecipe((filtered == null ? recipes : filtered), currentRecipe?.title),   // After RIGHT swipe  (SwipeEventData) => void

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
    const [currentRecipe, setCurrentRecipe] = useState<Recipe>(recipes[0]);
    const [filtered, setFiltered] = useState<Recipe[]>(recipes);
    const [currentInstruction, setCurrentInstruction] = useState("You haven't started yet!");

    const handleFilter = (recipeType: string) => {
        // recipeType = ' '+recipeType;
        const searched = []

        for (const r of recipes) {
            if (r.title != undefined) {
                if (r.title.toLowerCase().indexOf(recipeType) >= 0) {
                    searched.push(r)
                }
            }
        }
        setFiltered(searched);
        if (searched.length > 0) {
            console.log(`I found a ${searched[0].title} recipe. You can swipe for other ${recipeType} recipes`);
            speech.synthesis(`I found a ${searched[0].title} recipe. You can swipe for other ${recipeType} recipes`, 'en-US') // speech synthesis module
            setCurrentRecipe(searched[0]);

            if (searched[0].instructions != null)
                setCurrentInstruction(searched[0].instructions[0]);

            firstStep();
        }
        else
            speech.synthesis(`No ${recipeType} recipe found.`, 'en-US') // speech synthesis module

    }

    const readIngredient = (factor: number) => {
        speech.synthesis(`${currentRecipe?.ingredients[factor]} `, 'en-US') // speech synthesis module
    }


    const handleIngredients = (factor: number) => {

        let ingredientsIndex = currentRecipe?.ingredients.length;
        let str = currentRecipe?.ingredients[0];

        let i = 1;
        while (i < ingredientsIndex) {
            // speech.synthesis(`${currentRecipe?.ingredients[i]} `, 'en-US') // speech synthesis module
            // speech.synthesis("hi", 'en-US') // speech synthesis module
            console.log(ingredientsIndex + i)
            if (i + 1 == ingredientsIndex)
                str = str + ".    and" + currentRecipe?.ingredients[i];
            else
                str = str + ".    " + currentRecipe?.ingredients[i];
            i++;
        }

        //update all instruction values if you are doubling it

        speech.synthesis(`There are ${currentRecipe?.ingredients.length} ingredients for ${currentRecipe?.title}  . ${str}`, 'en-US') // speech synthesis module
        var cleanIngerdients = new Array();

        while (i < ingredientsIndex) {
            // speech.synthesis(`${currentRecipe?.ingredients[i]} `, 'en-US') // speech synthesis module
            // speech.synthesis("hi", 'en-US') // speech synthesis module
            console.log(ingredientsIndex + i)
            cleanIngerdients.push(currentRecipe?.ingredients[i])
            i++;
            readIngredient(2);

        }

        cleanIngerdients.forEach(element => {
            // speech.synthesis({element}, 'en-US') // speech synthesis module
            speech.synthesis("hi", 'en-US') // speech synthesis module

            console.log({ element })

        });


        return null;
    }
    const firstStep = () => {
        speech.synthesis(`The first step is  ${currentRecipe?.instructions[0]} `, 'en-US') // speech synthesis module
        return null;
    }

    const handleStart = (recipeName: string) => {

        const recipe = getRecipe(recipeName);
        if (recipe === undefined) {
            setMessage("Invalid Recipe");
        } else {
            setCurrentRecipe(recipe);
        }

        if (currentRecipe != null) {
            if (currentRecipe.instructions != null)
                setCurrentInstruction(currentRecipe.instructions[0])
        }
        if (recipeExists(recipeName)) {
            setMessage(`Starting recipe: ${currentRecipe?.title}`);
        }
    }

    const handleNext = (mirror: string) => {

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
                if (mirror.includes("step"))
                    speech.synthesis(`The next step is ${currentInstruction} `, 'en-US') // speech synthesis module
                else
                    speech.synthesis(`After that ${currentInstruction} `, 'en-US') // speech synthesis module

                setMessage("Now showing the next step")
            }
            else
                setMessage("this is the last step")
            speech.synthesis("You're done! this is the last step.", 'en-US') // speech synthesis module

        }
    }

    const handleEnd = () => {
        if (currentRecipe == null) {
            setMessage("No recipe has been started yet");
        } else {
            setMessage("Okay, see ya later al ligator");
            setCurrentRecipe(recipes[0]);
            speech.synthesis("Okay, see ya later al ligator", 'en-US'); // speech synthesis module

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
        // return null;
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
            command: '(Find) (me) (a)(an) :recipeType recipe',
            callback: (recipeType: any) => handleFilter(recipeType)
        },
        {
            command: 'Show me (a)(an) :recipeType recipe',
            callback: (recipeType: any) => handleFilter(recipeType)
        },
        {
            command: 'Start (the) :recipe recipe',
            callback: (recipe: any) => handleStart(recipe)
        },
        {
            command: '(what\'s the) next (step)',
            callback: () => handleNext("step")
        },
        {
            command: '(what\'s)(the) first (step)',
            callback: () => firstStep()
        },
        {
            command: '(what\'s)(the step) after that (step)',
            callback: () => handleNext("after")
        },
        {
            command: '(what) (are) (the) (required) ingredients',
            callback: () => handleIngredients(1)
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

    //handle form
    const clear = () => {
        setPostData("");
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        clear();
    }

    if (transcript.length > 600) {
        resetTranscript();
    }

    const classes = useStyles(); //for styling


    const makeIngredients = () => {
        var cleanIngredients = new Array();
        let index = 0;

        while (index < myRecipe.ingredients.length) {
            cleanIngredients.push(
                <Typography style={{ marginBottom: 1.5 }} color="textSecondary">
                    {myRecipe.ingredients[index]}
                </Typography>
            )
            index++;
        }

        return (
            cleanIngredients
        )
    };

    const makeInstructions = () => {
        var cleanIngredients = new Array();
        let index = 0;

        while (index < myRecipe.instructions.length) {
            cleanIngredients.push(
                <Typography style={{ marginBottom: 1.5 }}>
                    {index + 1}. {myRecipe.instructions[index]}
                </Typography>
            )
            index++;
        }

        return (
            cleanIngredients
        )
    };

    return (
        <Container>
            <form autoComplete="on" noValidate onSubmit={handleSubmit} className="box-with-heading" >
                <TextField name="recipe" variant="outlined" label="recipe title" fullWidth value={postData} onChange={(e) => setPostData(e.target.value)} />
                <Button variant="contained" className="button-standard" color="primary" size="large" type="submit" onClick={() => handleFilter(postData)} fullWidth>search</Button>
                {/* <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button> */}
            </form>
            <p>Al says: {message}</p>
            <p>You're saying: {transcript}</p>
            <Button>
                <Card style={{ maxWidth: 600 }}>
                    <CardContent>
                        <Typography variant='h3' gutterBottom>
                        </Typography>
                        <Typography variant="h5" component="div">
                            Next Instruction
                        </Typography>
                        <Typography variant="body1" component="div">
                            {currentInstruction}
                        </Typography>
                    </CardContent>
                    <CardActions>
                    </CardActions>
                </Card>
            </Button>
            <Typography variant="body1" component="div" align="center">
                Swipe left or right to see other recipes!
            </Typography>
            <div {...handlers}>
                <Card style={{ maxWidth: 600 }}>
                    <CardContent>
                        <Typography variant='h3' gutterBottom>
                        </Typography>
                        <Typography variant="h4" component="div">
                            {myRecipe.title}
                        </Typography>
                        <Typography variant="h5" component="div">
                            Ingredients
                        </Typography>
                        {/* <Typography style={{ marginBottom: 1.5 }} color="textSecondary">
                            {myRecipe.ingredients[0]}
                        </Typography> */}
                        {makeIngredients()}
                        <Typography variant="h5" component="div">
                            Instructions
                        </Typography>
                        {/* <Typography variant="body1">
                            {myRecipe.instructions}
                        </Typography> */}
                        {makeInstructions()}
                    </CardContent>
                    <CardActions>
                        {/* <Button onClick={()=>{myRecipe.liked = !myRecipe.liked, console.log(myRecipe.liked)}} size="small">Like this Recipe!</Button> */}
                    </CardActions>
                </Card>
            </div>
        </Container>
    );
};

export default RecipeHelperBody;