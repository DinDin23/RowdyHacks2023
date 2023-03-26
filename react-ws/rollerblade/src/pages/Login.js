import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function Login(props) {
  const [ user, setUser ] = useState([]);
  const [ profile, setProfile ] = useState({name: "", email: "", picture: null});

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

  function seeLobbies() {
    props.setUsername(profile.name)
    props.fetchLobbies()
    props.setPage("lobbyselector")
  }


  return (
    <div>
      <input style={{width: 500}} value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})}></input>
      <button onClick={seeLobbies}>See Lobbies</button>
      <h2>Google Login</h2>
      <br />
      <br />
      {profile.name.length > 0 ? (
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