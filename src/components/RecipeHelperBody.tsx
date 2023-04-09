
import * as React from "react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import { useState } from "react";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import * as recipesData from "./prototype files/recipes_raw/recipes_raw_nosource_ar.json"

// import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
// import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { time } from "console";

//for speech synth
import speech from 'speech-js';

//for displaying all the filtered recipies
import fillRecipes from "./recipeCards.js";

//for cards
import { Card, Checkbox, FormControlLabel, FormGroup, Grid, GridListTile, GridListTileBar, Grow, Radio, Slider } from "@material-ui/core";
// import React, {Component,useEffect, useState} from 'react';

// import { TextField } from '@material-ui/core';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
import { useSwipeable } from "react-swipeable";
import Typography from '@mui/material/Typography';

import useStyles from "./styles";

// import {Grid, Grow, Paper} from "@material-ui/core";
// import React from "react";
import { AppBar, Button, Container, TextField } from "@material-ui/core";
import { Header } from "./ui/Header";
import { ArrowCircleLeft, ArrowCircleRight } from "@mui/icons-material";

import StarBorderIcon from '@mui/icons-material/StarBorder';
import SearchIcon from '@mui/icons-material/Search';

interface Recipe {
    title: string;
    ingredients: string[];
    instructions: string[];
    picture_link: string;
    liked: boolean;
    veg: boolean; //dietary restrictions
    vegan: boolean;
    pesc: boolean;

}


const recipes = Object.values(recipesData).map((val) => { //fixed current instruction
    var cleanInstructions = new Array();
    let index = 0;
    let step = "";
    let _veg = false;
    let _vegan = false;
    let _pesc = false;



    while (val.instructions != null && index < val.instructions.length) {
        step = step + val.instructions[index];
        if (val.instructions[index] == '.') {
            cleanInstructions.push(step); //adds as it's own sentence


            //check for dietary restrictions
            // if (step.includes("chicken"))


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

        if (val.title.includes("Vegetarian"))
            _veg = true;
        _pesc = true;


        if (val.title.includes("pescatarian")) {
            _pesc = true;
        }

        //add a gluten option?


    }


    return ({
        title: val.title,
        ingredients: val.ingredients,
        // instructions: val.instructions,
        instructions: cleanInstructions,
        picture_link: val.picture_link,
        liked: false,
        veg: _veg,
        vegan: _vegan,
        pesc: _pesc
    } as Recipe)

})

// recipes.sort(); eventually sort recipes

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
    const [favorites, setFavorites] = useState<number[]>([]);
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
        speech.synthesis("the next step is", 'en-US') // speech synthesis module

        if (currentRecipe == null) {
            speech.synthesis("No recipe has been started yet", 'en-US') // speech synthesis module
            setMessage("No recipe has been started yet");
        } else {
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

            if (myRecipe.instructions[index] == currentInstruction) {
                cleanIngredients.push(
                    <Typography style={{ marginBottom: 1.5 }}>
                        <b>   {index + 1}. {myRecipe.instructions[index]} </b>
                    </Typography>
                )
            }
            else {
                cleanIngredients.push(
                    <Typography style={{ marginBottom: 1.5 }}>
                        {index + 1}. {myRecipe.instructions[index]}
                    </Typography>
                )
            }

            index++;
        }

        return (
            cleanIngredients
        )
    };


    //sorry it's way too nested
    //PrimarySearchAppBar look up for more menu nav stuff
    const favLinks = (ind: number) => {

    }
    const makeFavorites = () => {

        const searched = [];

        for (const f of favorites) {
            if (f < recipes.length) {
                if (recipes[f]) {
                    searched.push(recipes[f])
                }
            }
        }

        setFiltered(searched);
        setCurrentRecipe(filtered[0]);
        setCurrentInstruction(filtered[0].instructions[0]);


    }

    const displayFavorites = () => {
        var favs = new Array();
        let index = 0;
        let t = "";

        while (favorites != null && index < favorites.length) {
            if (recipes[favorites[index]].liked) {
                t = recipes[favorites[index]].title;
                t = t.toLowerCase();
                favs.push(
                    <Button onClick={() => makeFavorites()}>
                        <Typography variant="h6" component="div">
                            {recipes[favorites[index]].title} </Typography>
                    </Button>

                );
            }

            index++;
        }

        return (favs);

    };
    const handleScale = (factor: number) => {
        var cleanIngredients = new Array();
        let index = 0;


        while (index < myRecipe.ingredients.length) {

            if (myRecipe.ingredients[index])

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

    const handleRestrictions = (restriction: number) => {

        speech.synthesis(`I found a`, 'en-US') // speech synthesis module
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
            }
            else if (filtered[index].veg && restriction <= 2) {
                newList.push(filtered[index]);
            } //doesnt resquire a vegan recipe
            else if (filtered[index].pesc && restriction <= 1) {
                newList.push(filtered[index]);
            } //doesnt resquire a vegan recipe
            else if (restriction == 0) { //no restriction
                newList.push(filtered[index]);
            }
            index++;

            if (newList != null && currentRecipe != null) {
                if (newList.length > 0 && newList.at(newList.length - 1).title == currentRecipe.title)
                    orgRec = newList.length - 1;
            }


        }


        setFiltered(newList);
        setCurrentRecipe(filtered[orgRec]);        //reset current recipe if qualifies
        setCurrentInstruction(currentRecipe.instructions[0]);

        return (
            newList
        )
    };

    const handleFavorite = () => {

        var newFavs = new Array();

        currentRecipe.liked = !currentRecipe.liked; //change what it currently looks like
        console.log("Liked: " + currentRecipe.liked);
        let index = 0;
        let currIndex = getRecipeIndex(recipes, currentRecipe.title);

        console.log("current" + recipes[currIndex].title + " aka " + currentRecipe.title);

        if (favorites != undefined) {
            if (favorites.includes(currIndex)) {
                console.log("need to remove " + recipes[currIndex].title + " aka " + currentRecipe.title);

                while (favorites.length > 0) {

                    if (favorites.at(favorites.length - 1) == currIndex)
                        favorites.pop();
                    else
                        newFavs.push(favorites.pop());

                }
                setFavorites(newFavs);

            }
            else {
                favorites.push(currIndex);
            }

        }
        else {
            setFavorites([currIndex]);
        }
        console.log(favorites);

    };



    //cleans up listening
    if (transcript.includes("vegan")) {
        handleRestrictions(3);
        resetTranscript();

    }


    if (transcript.length > 100) {
        resetTranscript();
    }

    return (
        <Container>

            <Grid wrap='wrap' container spacing={4}>
                <AppBar color='inherit' position='sticky'>
                    <Grid container spacing={1}>
                        <Grid onClick={() => handleFilter(" ")} item xs={2}><Header /></Grid>
                        <Grid item xs={8}>
                            <TextField name="recipe" variant="outlined" label="recipe title" fullWidth value={postData} onChange={(e) => setPostData(e.target.value)}>
                            </TextField>
                        </Grid>
                        <Grid item xs={2}>
                            <Button variant="contained" onClick={() => handleFilter(postData)}>
                                <SearchIcon />
                            </Button>
                        </Grid>
                    </Grid>

                </AppBar>
                <Grid item xs={4}>
                    {/* <Grid item xs={8}> <p>Al says: {message}</p> </Grid>
                <Grid item xs={8}> <p>You're saying: {transcript}</p></Grid> */}
                    <div>

                        <Card style={{ maxWidth: 300 }}>
                            <CardContent>
                                <Typography variant='h3' gutterBottom>
                                </Typography>
                                <Typography variant="h5" component="div">
                                    Filter Modifications
                                </Typography>
                                <Typography variant="h6" component="div">
                                    Dietary Retrictions
                                </Typography>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox onClick={() => { handleRestrictions(1) }} />} label="Pescatarian" />
                                    <FormControlLabel control={<Checkbox onClick={() => { handleRestrictions(2) }} />} label="Vegetarian" />
                                    <FormControlLabel control={<Checkbox onClick={() => { handleRestrictions(3) }} />} label="Vegan" />
                                </FormGroup>

                                <Typography variant="h5" component="div">
                                    Recipe Modifications
                                </Typography>

                                <Typography variant="h6" component="div">
                                    Scale
                                </Typography>
                                <Slider defaultValue={30} step={10} marks min={10} max={110} />

                                <FormControlLabel control={<Checkbox onClick={() => { handleFavorite() }} />} label="Favorite" />

                            </CardContent>
                            <CardActions>
                            </CardActions>
                        </Card>
                        {favorites.toString()}
                        {displayFavorites()}

                    </div>
                </Grid>

                <Grid item xs={8}>

                    <div>
                        <Typography variant="body1" component="div" align="center">
                            Search Results: {filtered.length} <br></br> Swipe left or right to see other recipes!
                        </Typography>
                        <div {...handlers}>
                            <Card style={{ maxWidth: 600 }}>
                                <CardContent>
                                    <Typography variant='h3' gutterBottom>
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={11}><Typography variant="h4" component="div">
                                            {myRecipe.title}
                                        </Typography></Grid>
                                        <Grid item xs={1}><StarIcon htmlColor={currentRecipe?.liked ? ("yellow") : ("blue")} onClick={() => currentRecipe.liked != currentRecipe.liked}></StarIcon></Grid>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button variant="contained" onClick={() => handleFilter(postData)}>
                                            <SearchIcon />
                                        </Button>
                                    </Grid>
                                </Grid>

                            </AppBar>
                            <Grid item xs={4}>
                                {/* <Grid item xs={8}> <p>Al says: {message}</p> </Grid>
                <Grid item xs={8}> <p>You're saying: {transcript}</p></Grid> */}
                                <div>

                                    <Card style={{ maxWidth: 300 }}>
                                        <CardContent>
                                            <Typography variant='h3' gutterBottom>
                                            </Typography>
                                            <Typography variant="h5" component="div">
                                                Filter Modifications
                                            </Typography>
                                            <Typography variant="h6" component="div">
                                                Dietary Retrictions
                                            </Typography>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox onClick={() => { handleRestrictions(1) }} />} label="Pescatarian" />
                                                <FormControlLabel control={<Checkbox onClick={() => { handleRestrictions(2) }} />} label="Vegetarian" />
                                                <FormControlLabel control={<Checkbox onClick={() => { handleRestrictions(3) }} />} label="Vegan" />
                                            </FormGroup>

                                            <Typography variant="h5" component="div">
                                                Recipe Modifications
                                            </Typography>

                                            <Typography variant="h6" component="div">
                                                Scale
                                            </Typography>
                                            <Slider defaultValue={30} step={10} marks min={10} max={110} />

                                            <FormControlLabel control={<Checkbox onClick={() => { handleFavorite() }} />} label="Favorite" />

                                        </CardContent>
                                        <CardActions>
                                        </CardActions>
                                    </Card>
                                    {favorites.toString()}
                                    {displayFavorites()}

                                </div>
                            </Grid>

                            <Grid item xs={8}>

                                <div>

                                    <Typography variant="body1" component="div" align="center">
                                        Search Results: {filtered.length} <br></br> Swipe left or right to see other recipes!
                                    </Typography>

                                </div>
                                <div {...handlers}>
                                    <Card style={{ maxWidth: 600 }}>
                                        <CardContent>
                                            <Typography variant='h3' gutterBottom>
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={11}><Typography variant="h4" component="div">
                                                    {myRecipe.title}
                                                </Typography></Grid>
                                                <Grid item xs={>
                                                    <StarIcon htmlColor={currentRecipe?.liked ? ("yellow") : ("blue")} onClick={() => currentRecipe.liked != currentRecipe.liked}></StarIcon></Grid>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Button variant="contained" onClick={() => handleFilter(postData)}>
                                                <SearchIcon />
                                            </Button>
                                        </Grid>
                                    </Grid>

                                </AppBar>
                                <Grid item xs={4}>
                                    {/* <Grid item xs={8}> <p>Al says: {message}</p> </Grid>
                <Grid item xs={8}> <p>You're saying: {transcript}</p></Grid> */}
                                    <div>

                                        <Card style={{ maxWidth: 300 }}>
                                            <CardContent>

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

                                                {/* {currentRecipe.liked ? (
              <button onClick={() => currentRecipe.liked = true}>
              <AutoAwesomeIcon htmlColor="yellow" />
              </button>            ):(
                <button onClick={() => currentRecipe.liked = true}>
                <AutoAwesomeIcon htmlColor="green" />
                </button>
            )} */}
                                                <Typography variant='h3' gutterBottom>
                                                </Typography>
                                                <Typography variant="h5" component="div">
                                                    Recipe Modifications
                                                </Typography>
                                                <Typography variant="h6" component="div">
                                                    Dietary Retrictions
                                                </Typography>
                                                <FormGroup>
                                                    <FormControlLabel control={<Checkbox onClick={() => { handleRestrictions(1) }} />} label="Pescatarian" />
                                                    <FormControlLabel control={<Checkbox onClick={() => { handleRestrictions(2) }} />} label="Vegetarian" />
                                                    <FormControlLabel control={<Checkbox onClick={() => { handleRestrictions(3) }} />} label="Vegan" />
                                                </FormGroup>
                                                <Typography variant="h6" component="div">
                                                    Scale
                                                </Typography>

                                            </CardContent>
                                            <CardActions>
                                            </CardActions>
                                        </Card>
                                    </div>
                                </Grid>

                                <Grid item xs={8}>

                                    <div>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                            <IconButton onClick={() => getNextRecipe((filtered == null ? recipes : filtered), currentRecipe?.title)} aria-label="next recipe">
                                                <ArrowCircleLeft />
                                            </IconButton>
                                            <Typography variant="body1" component="div" align="center">
                                                Search Results: {filtered.length} <br></br> Swipe left or right to see other recipes!
                                            </Typography>
                                            <IconButton onClick={() => getPrevRecipe((filtered == null ? recipes : filtered), currentRecipe?.title)} aria-label="previous recipe">
                                                <ArrowCircleRight />
                                            </IconButton>
                                        </div>
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
                                                    {makeIngredients()}
                                                    <Typography variant="h5" component="div">
                                                        Instructions
                                                    </Typography>
                                                    {makeInstructions()}
                                                </CardContent>
                                                <CardActions>
                                                    {/* <Button onClick={()=>{myRecipe.liked = !myRecipe.liked, console.log(myRecipe.liked)}} size="small">Like this Recipe!</Button> */}
                                                </CardActions>
                                            </Card>
                                        </div>
                                    </div>


                                </Grid>
                            </Grid>


                        </Container >
                        );
};



                        const Search = styled('div')(({theme}) => ({
                            position: 'relative',
                        borderRadius: theme.shape.borderRadius,
                        backgroundColor: alpha(theme.palette.common.white, 0.15),
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
                        marginRight: theme.spacing(2),
                        marginLeft: 0,
                        width: '100%',
                        [theme.breakpoints.up('sm')]: {
                            marginLeft: theme.spacing(3),
                        width: 'auto',
    },
}));

                        const SearchIconWrapper = styled('div')(({theme}) => ({
                            padding: theme.spacing(0, 2),
                        height: '100%',
                        position: 'absolute',
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
}));

                        const StyledInputBase = styled(InputBase)(({theme}) => ({
                            color: 'inherit',
                        '& .MuiInputBase-input': {
                            padding: theme.spacing(1, 1, 1, 0),
                        // vertical padding + font size from searchIcon
                        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                        transition: theme.transitions.create('width'),
                        width: '100%',
                        [theme.breakpoints.up('md')]: {
                            width: '20ch',
        },
    },
}));


export default RecipeHelperBody;