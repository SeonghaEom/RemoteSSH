import React, { useEffect, useState, useRef } from 'react';
import {Button} from 'semantic-ui-react';
import styled from 'styled-components';
import soundfile1 from './dialogue_1.mp3';
import soundfile2 from './dialogue_2.mp3';

import {Slider,Handles,Tracks} from 'react-compound-slider';

// export 
//   }
import firestore from "../../config/fbconfig";
import { useHistory } from 'react-router-dom';
import socket from '../../socket';

const Volume = ({ display, roomId, goToVolume }) => {

    const [roomList, setRoomList] = useState([]);
    const [userList, setUserList] = useState([]);

    var talk1= new Audio(soundfile1)
    var talk2= new Audio(soundfile2) 
    talk1.load()
    talk2.load()
    talk1.volume=1
    talk2.volume=1
    talk1.loop=true
    talk2.loop=true
    const sliderStyle = {  // Give the slider some width
        position: 'relative',
        width: '100%',
        height: 80,
        border: '1px solid steelblue',
      }

      const railStyle = {
        position: 'absolute',
        width: '100%',
        height: 10,
        marginTop: 35,
        borderRadius: 5,
        backgroundColor: '#8B9CB6',
      }
      function Handle({
            handle: { id, value, percent },
            getHandleProps
          }) {
            
            talk1.volume=value/10
            return (
              <div
                style={{
                  left: `${percent}%`,
                  position: 'absolute',
                  marginLeft: -15,
                  marginTop: 25,
                  zIndex: 2,
                  width: 30,
                  height: 30,
                  border: 0,
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  backgroundColor: '#2C4870',
                  color: '#333',
                }}
                {...getHandleProps(id)}
              >
                <div style={{ fontFamily: 'Roboto', fontSize: 11, marginTop: -35 }}>
                  {value}
                </div>
              </div>
            ) }
            function playtalk1(e){
                e.preventDefault()
                talk1.play()
            }

    useEffect(() => {
      async function fetchData(){
        await fetch('http://localhost:9000/room-list')
          .then(function(response) {
            return response.json();
        }).then((json) => {
          setRoomList(json);
          json.forEach((roomId) => {
            socket.emit('BE-get-all-users', roomId);
          })
        })}
      fetchData();
      socket.on('FE-show-all-users', ({roomId, users}) => {
        setUserList((preList) => {
          
          preList = preList.concat({
              roomId: roomId,
              users: users,
          })
          console.log(preList);
          return preList;
        })
      });

    }, []);

    const history = useHistory();

    //console.log(roomList)
    

//Room list from server
        // fetch('http://localhost:9000/room-list').then(r =>
        //     r.json()
        // ).then(roomList => {
        //     setRoomList(roomList);
        // })

        return <div className='roomlist-background'>
              <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'start'}}>
                {/* <div className="close" onClick={goToVolume}></div> */}
                {/* <div className="close" onClick={(e) => {
                  goToVolume(e);
                  history.go(0);
                }}></div> */}
                <div style={{color: 'white', fontSize: '26px', marginTop: '40px'}}>
                  Listen to what others are talking about
                </div>
              </div>
              <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'start'}} >
                {
                    (roomList.length > 1
                        ? //userList.map((roomuser) =>
                        <div className="roomlist-container">
                            <div className="roomlist-roomId">
                              Other Room
                            </div>
                            <div style={{width:'100%'}}>
                                   <Slider
                                    rootStyle={sliderStyle /* inline styles for the outer div. Can also use className prop. */}
                                    domain={[0, 10]}
                                    values={[1]}
                                >
                                    <div style={railStyle /* Add a rail as a child.  Later we'll make it interactive. */} />

                                    <Handles>
                                    {({ handles, getHandleProps }) => (
                                        <div className="slider-handles">
                                        {handles.map(handle => (
                                            <Handle
                                            key={handle.id}
                                            handle={handle}
                                            getHandleProps={getHandleProps}
                                            />
                                        ))}
                                        </div>
                                    )}
                                    </Handles>


                                </Slider>
                                <center>
                                  <Button onClick={playtalk1}>
                                    <img alt="remoteSSHLogo" height="28" src={require('../../pictures/play-button.svg')}/>
                                  </Button>
                                </center>
                            </div>
                           
                        </div>
                        : <div className="roomlist-container">There is no other room</div>)
                }
            </div>
        </div>
    }
;


export default Volume;

///////////////////////////////////////////////////////

// const Volume = ({displayVolume,setdisplayVolume}) => {

    // var talk1= new Audio(soundfile1)
    // var talk2= new Audio(soundfile2) 
    // talk1.load()
    // talk2.load()
    // talk1.volume=1
    // talk2.volume=1
    // talk1.loop=true
    // talk2.loop=true
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
    //         talk1.volume=value
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
    //         ) 
    //         }

    // document.getElementById("button1").addEventListener("click", function(event){
    //     event.preventDefault()
    //   });
    // document.getElementById("button2").addEventListener("click", function(event){
    //     event.preventDefault()
    //   });
    //   document.getElementById("button3").addEventListener("click", function(event){
    //     event.preventDefault()
    //   });
    //   document.getElementById("button4").addEventListener("click", function(event){
    //     event.preventDefault()
    //   });

    // k.addEventListener('loadstart', function() {
    //     console.log('loadstart')
        
    // }); 
    // k.addEventListener('loadedmetadata', function() {
    //     console.log('loadmetadata')
        
    // }); 
    // k.addEventListener('canplay', function() {
    //     console.log('canplay')
        
    // }); 
    // function playtalk1(e){
    //     e.preventDefault()
    //     talk1.play()
    //     // k.addEventListener('loadeddata', function() {
    //     //     var playPromise = k.play();
    //     //     console.log(playPromise)
            
    //     // });
        
    //     document.getElementById('pause1').disabled=false
    // }
  
    // function pausetalk1(e){
    //     e.preventDefault()
    //     talk1.volume=0
    //     console.log('pause1')
    // }

    // function volumedown1(e){
    //     e.preventDefault()
    //     const current=talk1.volume
    //     talk1.volume=current*0.9
    // }
    // function volumeup1(e){
    //     e.preventDefault()
    
    //     const current=talk1.volume
    //     const new1=current*1.1

    //     if (current!=0 && new1<=1){
    //     talk1.volume=new1}
        
    // }
    // function playtalk2(e){
    //     e.preventDefault()
    //     talk2.play()
    //     // k.addEventListener('loadeddata', function() {
    //     //     var playPromise = k.play();
    //     //     console.log(playPromise)
            
    //     // });
    
    // }

    // function pausetalk2(e){
    //     e.preventDefault()
    //     talk2.volume=0
    //     console.log('pause1')
    // }

    // function volumedown2(e){
    //     e.preventDefault()
    //     const current=talk2.volume
    //     talk1.volume=current*0.9
    // }
    // function volumeup2(e){
    //     e.preventDefault()
    
    //     const current=talk2.volume
    //     const new1=current*1.1

    //     if (current!=0 && new1<=1){
    //     talk2.volume=new1}
        
    // }
    // playtalk=(e,soundtrack)=>{
    //     e.preventDefault()
    //     soundtrack.play()
    // }
    // function check(){
    //     console.log(k.readyState)
    //     k.addEventListener('loadstart', function() {
    //         console.log('loadstart')
            
    //     }); 
    //     k.addEventListener('loadedmetadata', function() {
    //         console.log('loadmetadata')
            
    //     }); 
    //     k.addEventListener('canplay', function() {
    //         console.log('canplay')
             
    //     });
    // }
    
//   const removeFromWishList = (foodToRemove) => {
//     setWishList(
//       wishlist.filter((food) => food !== foodToRemove)
//     );
//   };
//
//   return (



//       <AddWishContainer >
//         <TopHeader>Hear from other groups</TopHeader>
//         <h3>Group 1</h3>
//         <Slider
//     rootStyle={sliderStyle /* inline styles for the outer div. Can also use className prop. */}
//     domain={[0, 1]}
//     values={[1]}
//  >
//     <div style={railStyle /* Add a rail as a child.  Later we'll make it interactive. */} />

//     <Handles>
//       {({ handles, getHandleProps }) => (
//         <div className="slider-handles">
//           {handles.map(handle => (
//             <Handle
//               key={handle.id}
//               handle={handle}
//               getHandleProps={getHandleProps}
//             />
//           ))}
//         </div>
//       )}
//     </Handles>


// </Slider>
        
//             {/* <Button id="pause1"  onClick={pausetalk1}><i class="fas fa-volume-mute"></i></Button>
//             <Button id="down1" onClick={volumedown1}><i class="fas fa-minus"></i></Button>
//             <Button id="up1"  onClick={volumeup1}><i class="fas fa-plus"></i></Button> */}
//             <Button id="play1" onClick={playtalk1}><i class="fa fa-volume-up"></i></Button>

//         <h3>Group 2</h3>
//         <Row>
    
//         <Button id="pause1"  onClick={pausetalk2}><i class="fas fa-volume-mute"></i></Button>
//             <Button id="down1" onClick={volumedown2}><i class="fas fa-minus"></i></Button>
//             <Button id="up1"  onClick={volumeup2}><i class="fas fa-plus"></i></Button>
//             <Button id="play1" onClick={playtalk2}><i class="fa fa-volume-up"></i></Button>
    
//         </Row>
//       </AddWishContainer>

//   );
// };

// const MyContainer = styled.label``;

const AddWishContainer = styled.div`
  display: block;
  width: 70%;
  hieght: 100%;
  background-color: white;
  transition: all 0.5s ease;
  overflow: hidden;
`;

const WishContainer = styled.div`
  display: block;
  width: 70%;
  hieght: 100%;
  background-color: white;
  transition: all 0.5s ease;
  overflow: hidden;
`;

const TopHeader = styled.div`
  width: 100%;
  margin-top: 15px;
  font-weight: 600;
  font-size: 20px;
  color: black;
`;


const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 15px;
  line-height: 35px;
`;

// export default Volume;
