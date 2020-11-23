import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
const VideoCard = (props) => {
  const ref = useRef();
  const peer = props.peer;

  useEffect(() => {
    peer.on('stream', (stream) => {
      ref.current.srcObject = stream;
    });
    peer.on('track', (track, stream) => {
    });
  }, [peer]);

  return (
    <div>
      <Video
        playsInline
        autoPlay
        ref={ref}
      />

      <p>test</p>
    </div>
  );
};

const Video = styled.video``;

export default VideoCard;
