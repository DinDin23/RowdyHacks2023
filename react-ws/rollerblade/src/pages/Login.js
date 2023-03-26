import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './Login.css';

export default function Login(props) {
  const [ user, setUser ] = useState([]);
  const defaultProfile = useState({name: "", email: "", picture: null});
  const [ profile, setProfile ] = defaultProfile;

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

  function joinLobby() {
    props.setUsername(profile.name)
    props.joinLobby(profile.name)
    props.setPage("lobby")
  }


  return (
    <div id='logintext'>
      <input style={{width: 500}} value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})}></input>
      <button onClick={joinLobby}>Join Lobby</button>
      <h2>NeonBlader</h2>
      <br style={{borderBottom: 200}}/> 
      {profile.name && profile.name.length > 0 ? (
          <div>
              <img src={profile.picture} alt="user image" />
              <p>Name: {profile.name}</p>
              <p>Email Address: {profile.email}</p>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <button onClick={logOut}>Log out</button>
          </div>
      ) : (
          <button onClick={() => login()}>Sign in with Google 🚀 </button>
      )}
    </div>
     
  )
}