import {Card, Container, Grid, GridListTileBar, Grow, Radio, Typography} from "@material-ui/core";
import React, {Component,useEffect, useState} from 'react';

import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';

//https://stackoverflow.com/questions/13709482/how-to-read-text-file-in-javascript

//not using this page yet. Would like to move stuff out of the helperbody

let myRecipe = { 
    title: "pie",
    ingredients: ["f","b","d"],
    instructions: "step...",
    picture_link: "https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350",
    liked: false
  }
  
//   console.log(faceapi.nets)
// ageGenderNet
// faceExpressionNet
// faceLandmark68Net
// faceLandmark68TinyNet
// faceRecognitionNet
// ssdMobilenetv1
// tinyFaceDetector
// tinyYolov2



  let recipes = [];
for (let i = 1; i<15; i++) {
    recipes.push(
        <Card sx={{ maxWidth: 600 }}>
      <CardContent>
        <Typography variant='h3' gutterBottom>
        </Typography>
        <Typography variant="h4" component="div">
        {myRecipe.title}
        </Typography>
        <img
src={myRecipe.picture_link}
alt= {myRecipe.title + "image"}
/>        <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {myRecipe.ingredients}
        </Typography>
        <Typography variant="body1">
        {myRecipe.instructions}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={()=>{myRecipe.liked = !myRecipe.liked, console.log(myRecipe.liked)}} size="small">Like this Recipe!</Button>
      </CardActions>
    </Card>
        )
}

 function fillRecipes(recipes) {
    return recipes;
}

export default fillRecipes;