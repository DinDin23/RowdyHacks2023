import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import "./Login.css"
import useSound from "use-sound"
import mySound from "../retro.mp3"

export default function Login(props) {
  const [ user, setUser ] = useState([]);
  const defaultProfile = useState({name: "", email: "", picture: null});
  const [ profile, setProfile ] = useState(defaultProfile);

  const login = useGoogleLogin({
      onSuccess: (codeResponse) => setUser(codeResponse),
      onError: (error) => console.log('Login Failed:', error)
  });

  const logOut = () => {
    googleLogout();
    setProfile(defaultProfile);
  };

  useEffect(
    () => {
        if (user) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    setProfile(res.data);
                })
                .catch((err) => console.log(err));
        }
    },
    [ user ]
  );

  function seeLobbies() {
    if (profile.name && profile.name.length > 0) {
      props.setUsername(profile.name)
      props.fetchLobbies()
      props.setPage("lobbyselector")
    }
  }

  function MyButton(){
    const [playSound] = useSound(mySound)
    
    return (
      <button onClick={() => playSound()} >
         Play Sound
      </button>
    )
  }


  return (
    <div className="flexColumn" id='logintext'>
      
      <h2 style={{marginBottom: "1em", marginTop: "0.5em"}}>NeonBlader</h2>


      <input placeholder="username" style={{width: 300}} value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})}></input>
      <button onClick={seeLobbies}>See Lobbies</button>
  
      {profile.name && profile.name.length > 0 ? (
        <div style={{marginTop: 30}}>
            {profile.picture && <img src={profile.picture} alt="user image" />}
            <p>Name: {profile.name}</p>
            {profile.email && <p style={{marginBottom: "5em"}}>Email Address: {profile.email}</p>}
            <button onClick={logOut}>Log out</button>
        </div>
      ) : (
          <button onClick={() => login()}>Sign in with Google 🚀 </button>
      )}
      {MyButton()}
    </div>
     
  )
}