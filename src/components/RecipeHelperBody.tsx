import * as React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useState } from "react";


interface Recipe{
  title: string;
  ingredients: string[];
  instructions: string;
  picture_link: string;
}

const RecipeHelperBody = (_props: any) => {
  const [message, setMessage] = useState("");
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [currentInstruction, setCurrentInstruction] = useState("");

  const handleKeywords = (keyword: string) => {

    setCurrentTranscript(transcript)
    console.log(currentTranscript)
    resetTranscript()
    return keyword as string;
  }

  const handleFilter = (recipeType: string) => {

    setMessage(`Now showing a ${recipeType} recipe`);
   
    return recipeType as string;
  }

  const handleStart = (recipeName: string) => {

    setMessage(`Starting recipe: ${handleKeywords(recipeName)}`);
    /**
     * NEED JSON IMPLEMENTATION FIRST
     * USE MUI ELEMENTS TO DISPLAY STEPS + SPEECH OUTPUT
     */

    // setCurrentRecipe(recipeName)

  }

  const handleNext = () => {

    if(currentRecipe == null){
        setMessage("No recipe has been started yet");
    } else {
        setMessage("Now showing the next step")
        /** 
         * GO TO NEXT STEP IN THE RECIPE
         */
    }
  }

  const handleEnd = () => {
    if(currentRecipe == null){
        setMessage("No recipe has been started yet");
    } else {
        setMessage("Ending recipe")
        setCurrentRecipe(null);
    //POTENTIAL AUDIO OUTPUT
    }
    
  }

  const recipeExists = (recipeName: string) => {
    /**
     * FIGURE OUT HOW TO PARSE THROUGH THE JSON
     */
  }

  const getRecipe = (recipeName: string) => {
    /**
     * SEARCH THROUGH RECIPE LIST
     *
     * IF THE RECIPE AT WHATEVER INDEX HAS THE SAME TITLE
     *  RETURN THAT RECIPE AS A RECIPE TYPE
     */
  }

  const commands = [
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
      command: 'End (recipe)',
      callback: () => handleEnd()
    },
    {
      command: 'reset',
      callback: () => resetTranscript()
    },
  ];

  const { transcript, resetTranscript } = useSpeechRecognition({ commands });

  SpeechRecognition.startListening({ continuous: true });

  return (
    <div>

      <p>{message}</p>
      <p>{currentTranscript}</p>

    </div>
  );
};

export default RecipeHelperBody;
