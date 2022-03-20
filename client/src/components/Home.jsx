import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import WalletBalance from "./WalletBalance";
import NFTImage from "./NFTImage";
import { EthContext } from "../context/EthContext";
import Ape from "../../../smart-contract/artifacts/contracts/Ape.sol/Ape.json";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

const Home = () => {
  const { currentAccount } = useContext(EthContext);
  const [totalMinted, setTotalMinted] = useState(0);
  const [contract, setContract] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    getNFTContract();
  }, []);

  useEffect(() => {
    getCount();
  }, [contract, currentAccount]);

  const getCount = async () => {
    if (!contract) {
      getNFTContract();
    } else if (contract) {
      const count = await contract.getTokenCount();
      setTotalMinted(parseInt(count));
      console.log(parseInt(count));
    }
  };

  const getNFTContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    setSigner(signer);
    const nftContract = new ethers.Contract(contractAddress, Ape.abi, signer);
    setContract(nftContract);
  };

  return (
    <div>
      <WalletBalance />

      <h1>NFT Collection</h1>
      <div className="container">
        <div className="row">
          {currentAccount ? (
            Array(totalMinted + 1)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="col-sm">
                  <NFTImage
                    tokenId={`${i + 1}`}
                    contract={contract}
                    signer={signer}
                    totalMinted={totalMinted}
                  />
                </div>
              ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
