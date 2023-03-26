import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function Login(props) {
  const [ user, setUser ] = useState([]);
  const [ profile, setProfile ] = useState([]);

  const login = useGoogleLogin({
      onSuccess: (codeResponse) => setUser(codeResponse),
      onError: (error) => console.log('Login Failed:', error)
  });

  const logOut = () => {
    googleLogout();
    setProfile(null);
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

  return (
    <div>
      <input style={{width: 500}} value={props.username} onChange={(e) => props.setUsername(e.target.value)}></input>
      <button onClick={props.joinLobby}>Join Lobby</button>
      <h2>Google Login</h2>
      <br />
      <br />
      {profile ? (
          <div>
              <img src={profile.picture} alt="user image" />
              <p>Name: {profile.name}</p>
              <p>Email Address: {profile.email}</p>
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