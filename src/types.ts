export interface Recipe {
  __typename: "Recipe";
  title: string;
  ingredients: string[];
  instructions: string[];
  picture_link: string;
  liked: boolean;
  veg: boolean; //dietary restrictions
  vegan: boolean;
  pesc: boolean;
}