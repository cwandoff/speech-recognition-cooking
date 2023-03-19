import * as React from "react";
import { TestButton } from "../src/components/ButtonTest";
// import {Dictaphone } from "../src/components/Dictaphone"
import { Content } from "../src/components/ui/Content";
import Button from "@mui/material/Button";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useState } from "react";
// import "regenerator-runtime/runtime";

const HomePage = (_props: any) => {
  const [message, setMessage] = useState("");
  const commands = [
    {
      command: ["Hello", "Hi"],
      callback: ({ command }) => setMessage(`Hi there! You said: "${command}"`),
      matchInterim: true,
    },
    {
      command: ["Test"],
      callback: () => setMessage("This is a good test message!"),
    },
    {
      command: "clear",
      callback: ({ resetTranscript }) => resetTranscript(),
    },
  ];

  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition(
    { commands }
  );

  // if (!browserSupportsSpeechRecognition) {
  //   return <span>Browser doesn't support speech recognition.</span>;
  // }

  SpeechRecognition.startListening({ continuous: true });

  return (
    <Content>
      {/* <Button onClick={SpeechRecognition.startListening}>Start</Button>
      <Button onClick={SpeechRecognition.stopListening}>Stop</Button> */}

      <p>{message}</p>
      <p>{transcript}</p>
    </Content>
  );
};

export default HomePage;

// import React from 'react';

// const Dictaphone = () => {
//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition
//   } = useSpeechRecognition();

//   if (!browserSupportsSpeechRecognition) {
//     return <span>Browser doesn't support speech recognition.</span>;
//   }

//   return (
//     <div>
//       <p>Microphone: {listening ? 'on' : 'off'}</p>
//       <button onClick={SpeechRecognition.startListening}>Start</button>
//       <button onClick={SpeechRecognition.stopListening}>Stop</button>
//       <button onClick={resetTranscript}>Reset</button>
//       <p>{transcript}</p>
//     </div>
//   );
// };
// export default Dictaphone;
