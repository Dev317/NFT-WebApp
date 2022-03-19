import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { EthContext } from "../context/EthContext";

function WalletBalance() {
  const { currentAccount, connectWallet } = useContext(EthContext);
  const [balance, setBalance] = useState();

  const getBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(currentAccount);
    setBalance(ethers.utils.formatEther(balance));
  };

  return (
    <div className="card">
      <div className="card-body">
        {currentAccount ? (
          <button className="btn btn-info" onClick={() => getBalance()}>
            Show My Balance
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => connectWallet()}>
            Connect Wallet
          </button>
        )}
        <br />
        <br />
        {currentAccount ? (
          <h5 className="card-title">Your Balance: {balance}</h5>
        ) : (
          <h4>Please connect wallet</h4>
        )}
      </div>
    </div>
  );
}

export default WalletBalance;