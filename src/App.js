import './App.css';
import React, {useRef, useState} from 'react';

import firebase from 'firebase/compat/app'

import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/analytics';

// Inbuilt firebase hooks
import {useAuthState} from 'react-firebase-hooks/auth' 
import { useCollectionData } from 'react-firebase-hooks/firestore';



firebase.initializeApp({

  // your configuration here
  apiKey: "AIzaSyCSEYJ1S_ACFhUk-23SPNPfjp0etLwcSO4",
  authDomain: "react-chat-app-b99b7.firebaseapp.com",
  projectId: "react-chat-app-b99b7",
  storageBucket: "react-chat-app-b99b7.appspot.com",
  messagingSenderId: "532271320983",
  appId: "1:532271320983:web:a7e6adac8358021e95bed2",
  measurementId: "G-WRQ7JQZNC9",
  databaseURL : "https:/react-chat-app-b99b7.firebaseio.com"

})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);//this firebase will tell me automatically that weather somenady has signed or not...


  // this is responsible for the design part of the chat app
  return (
    <div className="App">
      
      <header>
        <h1>Aao baatein krein</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SingnIn />}
      </section>

    </div>
  );
}

function SingnIn(){

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>sign
      <button className='sign-in' onClick={signInWithGoogle}>Sign In With Google</button>
      <p>Lets connect to talk and grow together. #WeWillRock</p>
    </>
  )

}


function SignOut(){

  return auth.currentUser && (
    <button className='sign-out' onClick={() => auth.signOut()}>Sign Out</button>
  )

}


function ChatRoom(){


  const dummy = useRef();

  const messagesRef = firestore.collection('messages');

  const query = messagesRef.orderBy('createdAt').limit(1500);

  const [messages] = useCollectionData(query,{idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {

    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      Text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current && dummy.current.scrollIntoView({behavior:'smooth'})
  };

  return (
    <>

    {messages && messages.map((msg) => (<ChatMessage key={msg.id} message={msg} />))}
    <form onSubmit={sendMessage}>

      <input 
      value={formValue} 
      onChange={(e) => setFormValue(e.target.value)} 
      placeholder='kuch bolo : ' 
      />

      <button type="submit" disabled={!formValue}>
      Go
      </button>

    </form>
    <div ref={dummy}></div>
    </>
  )

}

function ChatMessage(props){

  const { Text,uid,photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <>
    <div className={`message ${messageClass} `}>
      <img src={photoURL} alt="profilePic" />
      <p>{Text}</p>
    </div>
    </>
  )
}

export default App;
