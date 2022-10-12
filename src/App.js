import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

import Lock from "./artifacts/contracts/Lock.sol/Lock.json";
import { use } from "chai";
const lockAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

function App() {
  const [lock, setLockValue] = useState();
  useEffect(() => {
    fetchGreeting();
  }, []);

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== undefined) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.ContractFactory(
        lockAddress,
        Lock.abi,
        provider
      );
      try {
        const data = await contract.withdraw();
        setLockValue(data);
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function setLock() {
    if (!lock) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.ContractFactory(
        lockAddress,
        Lock.abi,
        signer
      );
      const transaction = await contract.setLock(lock);
      setLockValue("");
      await transaction.wait();
      fetchGreeting();
    }
  }




  return (
    <div className="App">
      <div className="App-header">
        <div className="description">
          <h1>Lock.sol</h1>
          <h2>Dapp using React JS and Solidity Smart Contracts</h2>
        </div>
        <div className="customButton">
          <button style={{backgroundColor:'green'}}>Fetch Greeting</button>
          <button style={{backgroundColor:'green'}}>Set Greeting</button>
        </div>
        <input placeholder="set greeting message"/>
      </div> 
    </div>
  );
}

export default App;
