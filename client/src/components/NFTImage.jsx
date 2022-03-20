import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const NFTImage = ({ tokenId, contract, signer, totalMinted }) => {
  const contentId = import.meta.env.VITE_CID;
  const metadataURI = `${contentId}/bayc-${tokenId}`;
  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/bayc-${tokenId}.png`;
  const [isMinted, setIsMinted] = useState(false);


  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    let result;
    try {
      result = await contract.isContentOwned(metadataURI);
    } catch (err) {
      console.log(err);
    }
    setIsMinted(result);
  };

  const mintToken = async () => {
    const connection = contract.connect(signer);
    const addr = connection.address;

    await contract.safeMint(addr, metadataURI, {
      value: ethers.utils.parseEther("0.05"),
    });

    wait();
    getMintedStatus();
  };

  const getURI = async () => {
    console.log(totalMinted);
    let uri = await contract.tokenURI(totalMinted - 1);
    console.log(uri);
    uri = `https://gateway.pinata.cloud/ipfs/${uri.slice(6)}.png`;
    window.open(uri, "_blank");
  };

  return (
    <div className="card" style={{ width: "18rem" }}>
      <img
        className="card-img-top"
        src={isMinted ? imageURI : "../../assets/placeholder.png"}
      />
      <div className="card-body">
        <h5 className="card-title">ID #{tokenId}</h5>
        {!isMinted ? (
          <button className="btn btn-primary" onClick={mintToken}>
            Mint
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={getURI}>
            Show URI
          </button>
        )}
      </div>
    </div>
  );
};

export default NFTImage;
