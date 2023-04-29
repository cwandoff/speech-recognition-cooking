import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import * as React from "react";
import { FC, useState } from "react";
import { Recipe } from "../../types";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

interface recipeCardProps {
  myRecipe: Recipe;
  recipeIndex: number;
  listLength: number;
  favorite: boolean;
}

export const RecipeCard: FC<recipeCardProps> = ({
  myRecipe,
  recipeIndex,
  listLength,
  favorite,
}) => {
  const [currentInstruction, setCurrentInstruction] = useState(
    "You haven't started yet!"
  );

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

  const handleFavorite = (title: string) => {
    if (favorite) {
       favorite = false;
       alert(title + ' has been unfavorited! \n \n Sometimes the icon is a little slow, swipe between recipes to see the updated favorited status.');
    } else if (!favorite) {
      favorite = true;
      alert(title + ' has been favorited! \n \n Sometimes the icon is a little slow, swipe between recipes to see the updated favorited status.');
    }
    myRecipe.liked = favorite;

  };

  return (
    <Card style={{ maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h3" gutterBottom></Typography>
        <Typography variant="h4" component="div">
          {myRecipe.title}
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={myRecipe.liked ? true : false}
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
              onClick={() => {
                handleFavorite(myRecipe.title);
              }}
            />
          }
          label="Favorite"
        />
        <Typography variant="h5" component="div">
          Ingredients
        </Typography>
        {makeIngredients()}
        <Typography variant="h5" component="div">
          Instructions
        </Typography>
        {makeInstructions()}
        Page: {recipeIndex % listLength} / {listLength}
      </CardContent>
    </Card>
  );
};
