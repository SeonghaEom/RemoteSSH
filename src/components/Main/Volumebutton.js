import React, { useEffect, useState, useRef } from 'react';
import {Button} from 'semantic-ui-react';
import styled from 'styled-components';
import soundfile1 from './dialogue_1.mp3';
import soundfile2 from './dialogue_2.mp3';
import {Slider,Handles,Tracks} from 'react-compound-slider';
import { useHistory } from 'react-router-dom';

const Volumebutton = ({ now}) => {
    const [playbutton,setPlayButton]=useState(true);
    // // var talk1={audio}
    // var talk1= new Audio(soundfile1)
    // //console.log(talk1)
    // talk1.load()
    // talk1.volume=0.2
    // talk1.loop=true


    // const sliderStyle = {  // Give the slider some width
    //     position: 'relative',
    //     width: '100%',
    //     height: 80,
    //     border: '1px solid steelblue',
    //   }

    //   const railStyle = {
    //     position: 'absolute',
    //     width: '100%',
    //     height: 10,
    //     marginTop: 35,
    //     borderRadius: 5,
    //     backgroundColor: '#8B9CB6',
    //   }
    //   function Handle({
    //         handle: { id, value, percent },
    //         getHandleProps
    //       }) {
            
    //         talk1.volume=value/10
    //         return (
    //           <div
    //             style={{
    //               left: `${percent}%`,
    //               position: 'absolute',
    //               marginLeft: -15,
    //               marginTop: 25,
    //               zIndex: 2,
    //               width: 30,
    //               height: 30,
    //               border: 0,
    //               textAlign: 'center',
    //               cursor: 'pointer',
    //               borderRadius: '50%',
    //               backgroundColor: '#2C4870',
    //               color: '#333',
    //             }}
    //             {...getHandleProps(id)}
    //           >
    //             <div style={{ fontFamily: 'Roboto', fontSize: 11, marginTop: -35 }}>
    //               {value}
    //             </div>
    //           </div>
    //         ) }
    //         function playtalk1(e){
    //             e.preventDefault()
    //             setPlayButton(!playbutton)
    //             console.log(talk1.paused)
    //             if (!playbutton){talk1.play()}
    //             else {talk1.pause()}

    //         }
    //         talk1.addEventListener('play', function() {
    //         console.log('play')
        
    //         }); 
            // function playtalk(playbutton){
            // if (playbutton==true){talk1.play()}
            //     else{talk1.pause()}}
            function clicked(e)
            {e.preventDefault()
              setPlayButton(!playbutton)}
return <div onClick={clicked}>
      {/* <Button onClick={setPlayButton(!playbutton)}> */}
        <img alt="remoteSSHLogo" height="28" src={playbutton?require('../../pictures/play-button.svg'):require('../../pictures/pause-button.svg')}/>
      {/* </Button> */}
      </div>                          
};

export default Volumebutton;