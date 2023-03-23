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
import {Card, Container, Grid, GridListTileBar, Grow, Radio, Typography} from "@material-ui/core";
// import React, {Component,useEffect, useState} from 'react';

import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';

interface Recipe {
    title: string;
    ingredients: string[];
    instructions: string[];
    picture_link: string;
    liked: boolean;
}

const recipes = Object.values(recipesData).map((val) => {
    
    return ({
        title: val.title,
        ingredients: val.ingredients,
        instructions: val.instructions,
        picture_link: val.picture_link,
        liked: false,
    } as Recipe)

})


const RecipeHelperBody = (_props: any) => {
    const [message, setMessage] = useState("");
    const [currentTranscript, setCurrentTranscript] = useState("");
    const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
    const [filtered, setFiltered] = useState<Recipe[]>(recipes);
    const [currentInstruction, setCurrentInstruction] = useState("");

    const handleFilter = (recipeType: string) => {

        const searched = []
        for (const r of recipes) {
            if (r.title != undefined) {
                if (r.title.includes(recipeType)) {
                    searched.push(r);
                }
            }
        }
        setFiltered(searched);
        if (searched.length > 0){
            setCurrentRecipe(null); //clears current one
            speech.synthesis(`I found a ${recipeType} recipe`, 'en-US') // speech synthesis module
            setCurrentRecipe(searched[0]);
        }
        else
        speech.synthesis(`No ${recipeType} recipe found.`, 'en-US') // speech synthesis module

    }

    const handleStart = (recipeName: string) => {

        if (recipeExists(recipeName)) {
            setCurrentRecipe(getRecipe(recipeName));
            setMessage(`Starting recipe: ${currentRecipe?.title}`);
        }
    }

    const handleNext = () => {

        if (currentRecipe == null) {
            speech.synthesis("No recipe has been started yet", 'en-US') // speech synthesis module
            setMessage("No recipe has been started yet");
        } else {
            speech.synthesis("the next step is", 'en-US') // speech synthesis module
            setMessage("Now showing the next step")
            /** 
             * GO TO NEXT STEP IN THE RECIPE
             */
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
            command: 'Next (step)',
            callback: () => handleNext()
        },
        {
            command: "I'm done",
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

    for(const i of myRecipe.ingredients){
        {i}
    }  

    SpeechRecognition.startListening({ continuous: true });
    return (
        <div>
            <p>{myRecipe.title}</p>
            <p>{message}</p>
            <p>{transcript}</p>

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
        <Button onClick={()=>{myRecipe.liked = !myRecipe.liked, console.log(myRecipe.liked)}} size="small">Like this Recipe!</Button>
      </CardActions>
    </Card>
        </div>
    );
};

export default RecipeHelperBody;
