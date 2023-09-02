import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
// import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
let baseAccount = Keypair.generate();

// This is the address of your solana program, if you forgot, just run solana address -k target/deploy/myepicproject-keypair.json
const programID = new PublicKey(GdznKgspiotCkiri58p4ayMMzhMThV2g7QfYYYfAJm5a);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}

// All your other Twitter and GIF constants you had.

// const App = () => {
// 	// All your other code.
// }



const TEST_GIFS = [
  'https://media.giphy.com/media/StKiS6x698JAl9d6cx/giphy.gif',
	'https://media.giphy.com/media/aSJm5dRB5YFuKsATyV/giphy.gif',
	'https://media.giphy.com/media/3NtY188QaxDdC/giphy.gif',
	'https://media.giphy.com/media/cfuL5gqFDreXxkWQ4o/giphy.gif'
]

// Constants
const TWITTER_HANDLE = 'itsrajsinghh';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /* this function will holds the logics for deciding if a phantom wallet is connected or not*/

  //state
    const [walletAddress, setWalletAddress] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [gifList, setGifList] = useState([]);

  //Actions
    const checkIfWalletIsConnected = async () => {
      try {
        const {solana} = window;

        if (solana) {
          if (solana.isPhantom) {
            console.log("Phantom wallet found");
          // The solana wallet gives us a function that will allow us to connect directly with the user's wallet!

            const response = await solana.connect({onlyIfTrusted: true});
            console.log(
          'Connected with Public Key:',
          response.publicKey.toString()
        );

          /*
          * Set the user's publicKey in state to be used later!
          */
            setWalletAddress(response.publicKey.toString());
            
          }
        } else {
          alert('Solana object not found! get a solana wallet');
        }
      } catch (error) {
        console.error(error);
        
      }
    };
  /* Let's define this method so our code doesn't break.
  we will write the logic for this next!*/

  const connectWallet = async () => {
    const {solana} = window;
    
    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key: ', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const sendGif = async () => {
    if (inputValue.length>0) {
      console.log('gif link', inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue('');
    } else {
      console.log('Empty input. Try again');
    }
  };

  const onInputChange = (event) => {
    const {value} = event.target;
    setInputValue(value);
  };

  const getProvider = () =>{
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(connection, window.solana, opts.preflightCommitment,);
    return provider;
  }
  
  /*We want to render this UI when the user hasn't connected
  their wallet to our app yet*/

  const renderNotConnectedContainer = () => (
    <button className = "cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to wallet 
      </button>

    
  );

const renderConnectedContainer = () => (
  <div className="connected-container">

    <form onSubmit = {(event) =>{
        event.preventDefault();
    sendGif();
    }}>
    
    <input type = "text" placeholder = "Enter gif link" value = {inputValue} onChange = {onInputChange}/>
    <button type = "submit" className = "cta-button submit-gif-button">Submit</button>
    </form>
    
    <div className="gif-grid">
      {gifList.map(gif => (
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
        </div>
      ))}
    </div>
  </div>
);

  //UseEffects
  useEffect (() =>{
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(()=>{
    if (walletAddress) {
      console.log('Fetching GIF list...');
      setGifList(TEST_GIFS);
    }
  },[walletAddress])

  // when our component first mounts, Let's check to see if we have a connected phantom wallet
  // useEffect(()=>{
  //   const onLoad = async () =>{
  //     await checkIfWalletIsConnected();
  //   };
  //   window.addEventListener('load', onLoad);
  //   return () => window.removeEventListener('load' , onLoad);
    
  // }, []);

  
  return (
    <div className="App">
      {/* This was solely added for some styling fanciness */}
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🛸MetaHub</p>
          <p className="sub-text">
            Store your favourite <span className = "gif">GIFs</span> here 🫠
          </p>
           {/* Render your connect to wallet button right here */}
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with ❤️ @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
      
  );
};

export default App;
