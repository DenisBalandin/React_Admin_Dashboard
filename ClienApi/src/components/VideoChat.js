import React, { useEffect, useState, useRef } from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import {Redirect} from 'react-router-dom';

const Video = styled.video``;

function VideoChat(props) {
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  useEffect(() => {
    setUsers({});
    socket.current = io.connect("/");
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })

    socket.current.on("yourID", (id) => {
      setYourID(id);
    })
    socket.current.on("allUsers", (users) => {
      setUsers(users);
    })

    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    })
  }, []);
  function endCall() {
    setUsers({});
      if(props.match.params.userid !== undefined){
      console.log(props.match.params.userid);
      window.location.replace('/');
    }else{
      window.location.reload(false);
    }
  }
  //console.log(yourID,users,stream,receivingCall,caller,callerSignal,callAccepted);
  function callPeer(id) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
            {
                urls: "stun:localhost:8000",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            },
            {
                urls: "turn:localhost:8000",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            }
        ]
    },
      stream: stream,
    });

    peer.on("signal", data => {
      socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })
  }

  function acceptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.current.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <Video className={callAccepted? 'userVideo': 'myVideo' } playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <Video className={callAccepted?  'myVideo' : 'userVideo' }  playsInline ref={partnerVideo} autoPlay />
    );
  }

  let incomingCall = "";
  if (receivingCall && callAccepted !== true && props.match.params.userid === undefined) {
    incomingCall = (
      <div className="acept_call">
        {/* <h1>{caller} is calling you</h1> */}
        <div onClick={acceptCall}>Accept call from user</div>
      </div>
    )
  }
  if(props.match.params.userid !== undefined){
    Object.keys(users).map(key => {
      if (key !== yourID) {
         callPeer(key);
      }
    });
  }
  let sendInvatation;
  if (caller === "" && props.match.params.userid === undefined) {
    let token = Math.random().toString(36).substr(2);
    sendInvatation = (
      <div className="sendInvatationcss">
        <div onClick={acceptCall}>Send Invatation to another user:</div> 
    <p>localhost:3000/video_chat/{token}</p>
      </div>
    )
  }
  let loading;
  if (callAccepted !== true && props.match.params.userid !== undefined) {
    loading = (
      <div className="sendInvatationcss">
        <div>loading...</div> 
      </div>
    )
  }
  let leave;
  if (callAccepted) {
    leave = (
      <div className="endCall" onClick={endCall}>End call</div>
    )
  }
  console.log(users);
  console.log(caller);
  return (
      <div className="container">
        {PartnerVideo}
        {UserVideo}
      <div className="call_block">
        {loading}
        {sendInvatation}
        {incomingCall}
        {leave}
      </div> 
    </div>
  );
}

export default VideoChat;
