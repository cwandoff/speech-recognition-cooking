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
import { makeStyles } from "@material-ui/core/styles";

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

  const CheckList = () => {
    var cleanIngredients = new Array();
    let index = 0;
    while (index < myRecipe.ingredients.length) {
      
        /*if (myRecipe.ingredients[index].includes("ounce)")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("ounce)").pop() );
          
        } */
        if (myRecipe.ingredients[index].includes("ounce) cans")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("ounce) cans").pop() );
          
        }
        else if (myRecipe.ingredients[index].includes("ounce) can")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("ounce) can").pop() );
          
        }
        else if (myRecipe.ingredients[index].includes("ounce) packages")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("ounce) packages").pop() );
          
        }
        else if (myRecipe.ingredients[index].includes("ounce) package")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("ounce) package").pop() );
          
        }
        else if (myRecipe.ingredients[index].includes("cups")) {
            //myRecipe.ingredients[index].split("cups").pop();
          cleanIngredients.push(myRecipe.ingredients[index].split("cups").pop());
        }
           
        else if (myRecipe.ingredients[index].includes("cup")) {
            //cleanIngredients.push({(myRecipe.ingredients[index]).split(find).pop()});
          cleanIngredients.push(myRecipe.ingredients[index].split("cup").pop()) ;
           
        }
        else if (myRecipe.ingredients[index].includes("cans")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("cans").pop());
           
        }
        else if (myRecipe.ingredients[index].includes("can")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("can").pop() );
           
        }
        else if (myRecipe.ingredients[index].includes("ounces")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("ounces").pop() );
           
        } 
        else if (myRecipe.ingredients[index].includes("ounce")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("ounce").pop() );
           
        }
        else if (myRecipe.ingredients[index].includes("pounds")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("pounds").pop() );
           
        }
        else if (myRecipe.ingredients[index].includes("pound")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("pound").pop() );
           
        }
        else if (myRecipe.ingredients[index].includes("packages")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("packages").pop() );
           
        }
        else if (myRecipe.ingredients[index].includes("package")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("package").pop() );
           
        }
        else if (myRecipe.ingredients[index].includes("teaspoons")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("teaspoons").pop() );
           
        }
        else if (myRecipe.ingredients[index].includes("teaspoon")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("teaspoon").pop() );
           
        }
        else if (myRecipe.ingredients[index].includes("cloves")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("cloves").pop() );
           
        }
        else if (myRecipe.ingredients[index].includes("clove")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("clove").pop() );
           
        }
        else if (myRecipe.ingredients[index].includes("tablespoons")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("tablespoons").pop());
           
        }
        else if (myRecipe.ingredients[index].includes("tablespoon")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("tablespoon").pop());
           
        }



        else if (myRecipe.ingredients[index].includes("1")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("1").pop() );
           
        }
        else if (myRecipe.ingredients[index].includes("2")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("2").pop() );
           
        }
        else if (myRecipe.ingredients[index].includes("3")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("3").pop());
           
        }
        else if (myRecipe.ingredients[index].includes("4")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("4").pop() );
           
        }
        else if (myRecipe.ingredients[index].includes("5")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("5").pop() );
           
        }
        else if (myRecipe.ingredients[index].includes("6")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("6").pop() );
           
        }
        else if (myRecipe.ingredients[index].includes("7")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("7").pop() );
           
        }
        else if (myRecipe.ingredients[index].includes("8")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("8").pop() );
           
        }
        else if (myRecipe.ingredients[index].includes("9")) {
          cleanIngredients.push(myRecipe.ingredients[index].split("9").pop() );
           
        }
        else {
          cleanIngredients.push(myRecipe.ingredients[index]);
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

  const useStyles = makeStyles({
    list: {
        position: 'fixed', //or absolute
        fontSize: '17px',
        display: 'inline-block',
        textAlign: 'left',
        borderRadius: '10px',
        border: '2px solid #7C6354',
        padding: '5px',
        width: '300px',
        height: '250px',
        overflow: 'auto',
        backgroundColor: 'white',
        bottom: '20px',
        left: '30px'
      }
    });
  const classes = useStyles();


  return (
    <>
    <Card style={{ maxWidth: 600 }}>
        <CardContent>
          <Typography variant="h3" gutterBottom></Typography>
          <Typography variant="h4" component="div">
            {myRecipe.title}
          </Typography>
          <FormControlLabel
            control={<Checkbox
              checked={myRecipe.liked ? true : false}
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
              onClick={() => {
                handleFavorite(myRecipe.title);
              } } />}
            label="Favorite" />
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
      
      <Card variant="outlined" className={classes.list}>
        <CardContent>
          <div style={{textAlign: 'center'}}>
          <h1>
            GROCERY LIST
          </h1>
          </div>
        <p>
          <ul>
          {CheckList().map(o => <li key={o}> {o} </li>)}
          </ul>
        </p>
        </CardContent>
      </Card>
      
      </>
  );
};
