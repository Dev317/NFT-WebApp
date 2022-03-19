import React, { useState, useEffect } from "react";

export const EthContext = React.createContext();

export const EthProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        return alert("Please install Metamask");
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      }

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        return alert("Please install Metamask");
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <EthContext.Provider
      value={{
        currentAccount,
        connectWallet,
      }}
    >
      {children}
    </EthContext.Provider>
  );
};
