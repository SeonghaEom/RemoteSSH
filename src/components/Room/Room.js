import React, { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import styled from 'styled-components';
import socket from '../../socket';
import VideoCard from '../Video/VideoCard';
import BottomBar from '../BottomBar/BottomBar';
import Chat from '../Chat/Chat';
import AddWish from '../WishList/AddWish';
import Wish from '../WishList/Wish';
import RoomList from '../RoomList';
import Layout from '../TopicModal/Layout'

const Room = (props) => {
  var currentUser = sessionStorage.getItem('user');
  const [peers, setPeers] = useState([]);
  const [userVideoAudio, setUserVideoAudio] = useState({
    localUser: { video: true, audio: true },
  });
  const [wishlist, setWishList] = useState([]);
  const [displayChat, setDisplayChat] = useState(false);
  const [displayWish, setDisplayWish] = useState(false);
  const [displayOtherTable, setDisplayOtherTable] = useState(false);
  const [displayAdd, setDisplayAdd] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  
  const peersRef = useRef([]);
  const userVideoRef = useRef();
  const screenTrackRef = useRef();
  const userStream = useRef();
  var roomId = props.match.params.roomId;
  console.log("Room ", sessionStorage);


  useEffect(() => {
    // Set Back Button Event
    window.addEventListener('popstate', goToBack);
    console.log("peers ", peers);
    // Connect Camera & Mic
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideoRef.current.srcObject = stream;
        userStream.current = stream;
        console.log(currentUser);
        socket.emit('BE-join-room', { roomId, userName: currentUser});
        socket.on('FE-user-join', (users) => {
          // all users
          console.log(users);
          const peers = [];
          users.forEach(({ userId, info }) => {
            let { userName, video, audio } = info;

            if (userName !== currentUser) {
              const peer = createPeer(userId, socket.id, stream);

              peer.userName = userName;
              peer.peerID = userId;

              peersRef.current.push({
                peerID: userId,
                peer,
                userName,
              });
              peers.push(peer);

              setUserVideoAudio((preList) => {
                return {
                  ...preList,
                  [peer.userName]: { video, audio },
                };
              });
            }
          });

          setPeers(peers);
        });

        socket.on('FE-receive-call', ({ signal, from, info }) => {
          let { userName, video, audio } = info;
          const peerIdx = findPeer(from);

          if (!peerIdx) {
            const peer = addPeer(signal, from, stream);

            peer.userName = userName;

            peersRef.current.push({
              peerID: from,
              peer,
              userName: userName,
            });
            setPeers((users) => {
              return [...users, peer];
            });
            setUserVideoAudio((preList) => {
              return {
                ...preList,
                [peer.userName]: { video, audio },
              };
            });
          }
        });

        socket.on('FE-call-accepted', ({ signal, answerId }) => {
          const peerIdx = findPeer(answerId);
          peerIdx.peer.signal(signal);
        });

        socket.on('FE-user-leave', ({ userId, userName }) => {
          const peerIdx = findPeer(userId);
          peerIdx.peer.destroy();
          setPeers((users) => {
            users = users.filter((user) => user.peerID !== peerIdx.peer.peerID);
            return [...users];
          });
        });
      });

    socket.on('FE-toggle-camera', ({ userId, switchTarget }) => {
      const peerIdx = findPeer(userId);

      setUserVideoAudio((preList) => {
        let video = preList[peerIdx.userName].video;
        let audio = preList[peerIdx.userName].audio;

        if (switchTarget === 'video') video = !video;
        else audio = !audio;

        return {
          ...preList,
          [peerIdx.userName]: { video, audio },
        };
      });
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const start = new Date();
    let latestCheckTime = start;
    const intervalId = setInterval(() => {
      const now = new Date();
      const delta = now - latestCheckTime;
      console.log(delta);
      latestCheckTime = now;
      //update firebase user studytime by adding
    }, 60000);
    return () => {
      // unmount
      clearInterval(intervalId);
    }
  }, []);

  function createPeer(userId, caller, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('BE-call-user', {
        userToCall: userId,
        from: caller,
        signal,
      });
    });
    peer.on('disconnect', () => {
      peer.destroy();
    });

    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('BE-accept-call', { signal, to: callerId });
    });

    peer.on('disconnect', () => {
      peer.destroy();
    });

    peer.signal(incomingSignal);

    return peer;
  }

  function findPeer(id) {
    return peersRef.current.find((p) => p.peerID === id);
  }

  function createUserVideo(peer, index, arr) {
    return (
      <VideoContainer>
        {displayWish ?
          <AddWish display ={displayAdd} setWishList={setWishList} wishlist={wishlist} userName={peer.userName} userFood={'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'} goToScreen={clickAdd} />:
          <VideoBox
            className={`width-peer${peers.length > 8 ? '' : peers.length}`}
            onClick={expandScreen}
            key={index}
          >
            {writeUserName(peer.userName)}
            <FaIcon className="fas fa-expand" />
            <VideoCard key={index} peer={peer} number={arr.length} />
          </VideoBox>
          }
          <UserName>{peer.userName}</UserName>
          <UserFood>
                <img src={'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'} width="300" height="300" alt={peer.userName} />
          </UserFood>
          <AddButton onClick={clickAdd}>
            <div>
              <FaIcon className="fas fa-heart"></FaIcon>
            </div>
            AddWish
          </AddButton>
      </VideoContainer>
    );
  }

  function writeUserName(userName, index) {
    if (userVideoAudio.hasOwnProperty(userName)) {
      if (!userVideoAudio[userName].video) {
        return <UserName key={userName}>{userName}</UserName>;
      }
    }
  }

  // Open Chat
  const clickChat = (e) => {
    e.stopPropagation();
    setDisplayChat(!displayChat);
  };

  const clickWish = (e) => {
    e.stopPropagation();
    setDisplayWish(!displayWish);
  };

  
  const clickAdd = (e) => {
    e.stopPropagation();
    setDisplayAdd(!displayAdd);
  };

  // BackButton
  const goToOtherTable = (e) => {
    e.stopPropagation();
    setDisplayOtherTable(!displayOtherTable);
    console.log(displayOtherTable);
    // e.preventDefault();
    // socket.emit('BE-leave-room', { roomId, leaver: currentUser });
    // sessionStorage.removeItem('user');
    // window.location.href = '/room-list';
  };

  const goToBack = (e) => {
    e.preventDefault();
    socket.emit('BE-leave-room', { roomId, leaver: currentUser });
    sessionStorage.removeItem('user');
    window.location.href = '/';
  };

  const toggleCameraAudio = (e) => {
    const target = e.target.getAttribute('data-switch');

    setUserVideoAudio((preList) => {
      let videoSwitch = preList['localUser'].video;
      let audioSwitch = preList['localUser'].audio;

      if (target === 'video') {
        const userVideoTrack = userVideoRef.current.srcObject.getVideoTracks()[0];
        videoSwitch = !videoSwitch;
        userVideoTrack.enabled = videoSwitch;
      } else {
        const userAudioTrack = userVideoRef.current.srcObject.getAudioTracks()[0];
        audioSwitch = !audioSwitch;

        if (userAudioTrack) {
          userAudioTrack.enabled = audioSwitch;
        } else {
          userStream.current.getAudioTracks()[0].enabled = audioSwitch;
        }
      }

      return {
        ...preList,
        localUser: { video: videoSwitch, audio: audioSwitch },
      };
    });

    socket.emit('BE-toggle-camera-audio', { roomId, switchTarget: target });
  };

  const clickScreenSharing = () => {
    if (!screenShare) {
      navigator.mediaDevices
        .getDisplayMedia({ cursor: true })
        .then((stream) => {
          const screenTrack = stream.getTracks()[0];

          peersRef.current.forEach(({ peer }) => {
            // replaceTrack (oldTrack, newTrack, oldStream);
            peer.replaceTrack(
              peer.streams[0]
                .getTracks()
                .find((track) => track.kind === 'video'),
              screenTrack,
              userStream.current
            );
          });

          // Listen click end
          screenTrack.onended = () => {
            peersRef.current.forEach(({ peer }) => {
              peer.replaceTrack(
                screenTrack,
                peer.streams[0]
                  .getTracks()
                  .find((track) => track.kind === 'video'),
                  userStream.current
              );
            });
            userVideoRef.current.srcObject = userStream.current;
            setScreenShare(false);
          };

          userVideoRef.current.srcObject = stream;
          screenTrackRef.current = screenTrack;
          setScreenShare(true);
        });
    } else {
      screenTrackRef.current.onended();
    }
  };

  const expandScreen = (e) => {
    const elem = e.target;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
  };

  return (
    <RoomContainer>
      <Layout/>
      <VideoAndBarContainer>
        {displayWish ?
        <Wish display ={displayWish} setWishList={setWishList} wishlist={wishlist} goToScreen={clickWish} /> :
        displayAdd ?
        <AddWish display ={displayAdd} setWishList={setWishList} wishlist={wishlist} userName={currentUser} userFood={'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'} goToScreen={clickAdd} />:
        displayOtherTable ?
        <RoomList display={displayOtherTable} roomId={roomId} goToScreen={goToOtherTable}/> :
        <VideoContainer>
          {/* Current User Video */}
          <VideoBox
            className={`width-peer${peers.length > 8 ? '' : peers.length}`}
          >
            {userVideoAudio['localUser'].video ? null : (
              <UserName>{currentUser}</UserName>
            )}
            <FaIcon className="fas fa-expand" />
            <MyVideo
              onClick={expandScreen}
              ref={userVideoRef}
              muted
              autoPlay
              playInline
            ></MyVideo>
            <UserName>{currentUser}</UserName>
            <UserFood>
              <img src={'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'} width="300" height="300" alt={currentUser} />
            </UserFood>
            <AddButton onClick={clickAdd}>
              <div>
                <FaIcon className="fas fa-heart"></FaIcon>
              </div>
              AddWish
            </AddButton>
          </VideoBox>
          {/* Joined User Vidoe */}
          {peers &&
            peers.map((peer, index, arr) => createUserVideo(peer, index, arr))}
        </VideoContainer>
        }
        <BottomBar
          clickScreenSharing={clickScreenSharing}
          clickChat={clickChat}
          clickWish={clickWish}
          goToBack={goToBack}
          goToOtherTable={goToOtherTable}
          toggleCameraAudio={toggleCameraAudio}
          userVideoAudio={userVideoAudio['localUser']}
          screenShare={screenShare}
        />
      </VideoAndBarContainer>
      <Chat display={displayChat} roomId={roomId}/>
      
    </RoomContainer>
  );
};

const RoomContainer = styled.div`
  display: flex;
  width: 100%;
  max-height: 100vh;
  flex-direction: row;
  overflow: invisible;
`;

const VideoContainer = styled.div`
  max-width: 100%;
  height: 92%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: center;
  padding: 15px;
  box-sizing: border-box;
  gap: 10px;
`;

const VideoAndBarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

const MyVideo = styled.video``;

const VideoBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  > video {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  :hover {
    > i {
      display: block;
    }
  }
`;

const UserName = styled.div`
  position: absolute;
  font-size: calc(20px + 5vmin);
  z-index: 1;
`;

const UserFood = styled.div`
  position: relative;
`;

const AddButton = styled.div`
  width: auto;
  border: none;
  font-size: 0.9375rem;
  padding: 5px;
  background-color: #77b7dd;
  
  :hover {
    background-color: #ee2560;
    cursor: pointer;
    border-radius: 15px;
  }

  .sharing {
    color: #ee2560;
  }
`;

const FaIcon = styled.i`
  display: none;
  position: absolute;
  right: 15px;
  top: 15px;
`;

export default Room;
