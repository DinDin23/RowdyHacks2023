import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
<<<<<<< HEAD
import "./Login.css"
=======
import './Login.css';
>>>>>>> f80f1ce5 (login logout works)

export default function Login(props) {
  const [ user, setUser ] = useState([]);
  const defaultProfile = useState({name: "", email: "", picture: null});
<<<<<<< HEAD
  const [ profile, setProfile ] = useState(defaultProfile);
=======
  const [ profile, setProfile ] = defaultProfile;
>>>>>>> f80f1ce5 (login logout works)

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
    props.setUsername(profile.name)
    props.fetchLobbies()
    props.setPage("lobbyselector")
  }


  return (
<<<<<<< HEAD
    <div className="flexColumn" id='logintext'>
      <input placeholder="username" style={{width: 500}} value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})}></input>
      <button onClick={seeLobbies}>See Lobbies</button>
      <h2 style={{marginBottom: "1em", marginTop: "0.5em"}}>NeonBlader</h2>
  
      {profile.name && profile.name.length > 0 ? (
        <div>
            <img src={profile.picture} alt="user image" />
            <p>Name: {profile.name}</p>
            <p style={{marginBottom: "5em"}}>Email Address: {profile.email}</p>
            <button onClick={logOut}>Log out</button>
        </div>
=======
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
>>>>>>> f80f1ce5 (login logout works)
      ) : (
          <button onClick={() => login()}>Sign in with Google 🚀 </button>
      )}
    </div>
     
  )
}