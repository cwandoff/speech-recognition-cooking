/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-var */
/* eslint-disable prefer-const */
import React from 'react';
import mic from './mic.png';
import Image from 'next/image';
import { useEffect } from "react";
function Mic() {
  var hark = require('./hark.bundle.js')
  let recorder: any;
  useEffect(() => {
    recorder = window.navigator;
    recorder.getUserMedia({ audio : true}, onMediaSuccess, function(){});
  

    function onMediaSuccess(blog: any) {

        var options = {};
        var speechEvents = hark(blog, options);
        
        speechEvents.on('speaking', function() {
          //console.log('User speaking');
          var obj = document.getElementById("icon");
          if (obj != null){
            obj.style.animation = "listening 0.5s linear forwards";
          }
        });

        speechEvents.on('stopped_speaking', function() {
          //console.log('User stopped speaking');
          
          var obj = document.getElementById("icon");
          if (obj != null){
            obj.style.animation = "idle 0.5s linear forwards";
          }
        });
      }
    }, []); 
  
  return (
    <div className="microphone" >
      <Image src={mic} id="icon" alt="mic icon" />
    </div>
  );
}

export default Mic;
