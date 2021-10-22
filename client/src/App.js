import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import myEpicNft from './utils/MyEpicNFT.json'

// Constants
const TWITTER_HANDLE = 'FlolightC';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = "0x8a68283B05d5b4d66A3Cfab05d6ea0c0300Ae5e5";

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const [mintedNFTCount, setMintedNFTCount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if(!ethereum) {
      console.log("Make sure you are connected to your wallet!");
      return;
    } else {
      console.log("Ethereum object is ok", ethereum);
    }

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Yes, we found an authorized account");
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found...");
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum} = window;

      if(!ethereum) {
        console.log("Make sure you are connected to your wallet!");
      return;
      } 

      const accounts = await ethereum.request({ method: "eth_requestAccounts"});

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      setupEventListener();
    } catch(error){
      console.log(error);
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum){

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(`Hey! We've minted your NFT and sent it to your wallet. It may be blank tight ow. It can take max of 10 min to show up on OpenSea. Here is the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`);

        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object does not exist!");
      }
    } catch(error){
      console.log(error);
    }
  }

  const askContractToMintNft = async () => {
    
    try {
      const { ethereum } = window;

      if (ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log(`Minned, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch(error) {
      console.log(error);
    }
  };
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  const getTotalNFTsMintedSoFar = async () => {
    try {
      const { ethereum } = window;

      if (ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        let count = await connectedContract.getTotalNFTsMintedSoFar();

        console.log(`${count}/50 NFT have been minted so far`);

        setMintedNFTCount(count.toNumber());

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch(error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getTotalNFTsMintedSoFar();
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          <p className="sub-text">{mintedNFTCount}/{TOTAL_MINT_COUNT} NFT have already been minted</p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Follow me on Twitter @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
