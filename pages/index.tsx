import * as React from "react";
import { Content } from "../src/components/ui/Content";
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

const HomePage = (_props: any) => {
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
   
    return recipeType as string;
  }

  const handleStart = (recipeName: string) => {

    /**
     * NEED JSON IMPLEMENTATION FIRST
     * USE MUI ELEMENTS TO DISPLAY STEPS + SPEECH OUTPUT
     */

    // setCurrentRecipe(recipeName)

  }

  const handleNext = () => {
    /** 
     * GO TO NEXT STEP IN THE RECIPE
     */
  }

  const handleEnd = () => {
    setCurrentRecipe(null);
    //POTENTIAL AUDIO OUTPUT
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
      callback: (recipeType: any) => setMessage(`Hey, showing a ${handleFilter(recipeType)} recipe`)
    },
    {
      command: 'Start (the) :recipe recipe',
      callback: (recipe: any) => setMessage(`Starting recipe: ${handleKeywords(recipe)} ${handleStart(recipe)}`)
    },
    {
      command: 'Next (step)',
      callback: () => setMessage(`Now showing ${handleNext()}`)
    },
    {
      command: 'End (recipe)',
      callback: () => setMessage(`Ending recipe ${handleEnd()}`)
    },
    {
      command: 'reset',
      callback: () => resetTranscript()
    },
  ];

  const { transcript, resetTranscript } = useSpeechRecognition({ commands });

  SpeechRecognition.startListening({ continuous: true });

  return (
    <Content>

      <p>{message}</p>
      <p>{currentTranscript}</p>

    </Content>
  );
};

export default HomePage;
