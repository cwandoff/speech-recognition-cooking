import * as React from "react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import { useState } from "react";

import * as recipesData from "./prototype files/recipes_raw/recipes_raw_nosource_ar.json"


interface Recipe {
    title: string;
    ingredients: string[];
    instructions: string[];
    picture_link: string;
}

const recipes = Object.values(recipesData).map((val) => {
    
    return ({
        title: val.title,
        ingredients: val.ingredients,
        instructions: val.instructions,
        picture_link: val.picture_link
    } as Recipe)

})

// for(const r of recipes){
//     console.log(r.instructions[0]);
// }

const RecipeHelperBody = (_props: any) => {
    const [message, setMessage] = useState("");
    const [currentTranscript, setCurrentTranscript] = useState("");
    const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
    const [filtered, setFiltered] = useState<Recipe[]>(recipes);
    const [currentInstruction, setCurrentInstruction] = useState("");


    const handleFilter = (recipeType: string) => {

        setMessage(`Now showing a ${recipeType} recipe`);

        const searched = []
        for (const r of recipes) {
            if (r.title != undefined) {
                if (r.title.includes(recipeType)) {
                    searched.push(r);
                }
            }
        }

        setFiltered(searched);
    }

    const handleStart = (recipeName: string) => {

        if (recipeExists(recipeName)) {
            setCurrentRecipe(getRecipe(recipeName));
            setMessage(`Starting recipe: ${currentRecipe?.title}`);
        }
    }

    const handleNext = () => {

        if (currentRecipe == null) {
            setMessage("No recipe has been started yet");
        } else {
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
            command: 'I am done',
            callback: () => handleEnd(),
            
        },
        {
            command: 'reset',
            callback: () => resetTranscript(),
        },
    ];

    const { transcript, resetTranscript } = useSpeechRecognition({ commands });

    SpeechRecognition.startListening({ continuous: true });

    return (
        <div>

            <p>{message}</p>
            <p>{transcript}</p>

        </div>
    );
};

export default RecipeHelperBody;
