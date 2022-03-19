import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

let eth;

if (typeof window !== 'undefined') {
    eth = window.ethereum;
    console.log(eth);
}

function WalletBalance() {
    const [balance, setBalance] = useState();
    const [currentAccount, setCurrentAccount] = useState();

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])

    const getBalance = async() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(currentAccount);
        setBalance(ethers.utils.formatEther(balance));
    }

    const connectWalletUser = async (metamask = eth) => {
        try {
            if (!metamask) {
                return alert('Please install Metamask');
            }

            const accounts = await metamask.request({ method: 'eth_requestAccounts'});
            if (accounts.length) setCurrentAccount(accounts[0])
            console.log(accounts[0]);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    const checkIfWalletIsConnected = async(metamask = eth) => {
        try {
            if (!metamask) {
                return alert('Please install Metamask');
            }
            const accounts = await metamask.request({ method: 'eth_requestAccounts' });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            }
          } catch (err) {
            console.log(err);
          }
    }

  return (
    <div className="card">
        <div className="card-body">
            {currentAccount ? 
            (<button className="btn btn-success" onClick={() => getBalance()}>
                Show My Balance
            </button>
            ) : (
            <button className="btn btn-success" onClick={() => connectWalletUser()}>
                    Connect Wallet
            </button>
            )}
            <br/>
            <br />
            {currentAccount ?
             (<h5 className="card-title">
                 Your Balance: {balance}
            </h5>) : (
            <h4>
                Please connect wallet
            </h4>)}
        </div>
    </div>
  )
}

export default WalletBalance