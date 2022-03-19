import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react'
import WalletBalance from './WalletBalance'
import { EthContext } from '../context/EthContext';
import Ape from '../../../smart-contract/artifacts/contracts/Ape.sol/Ape.json';

const contractAddress = '0x4f227F4d9Cc393c5843D3af8Dd3e2AB6C0742868';

function Home() {

  const { currentAccount } = useContext(EthContext);
  const [totalMinted, setTotalMinted] = useState(0);
  const [contract, setContract] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    getNFTContract();
    getCount();
  }, [totalMinted]);

  const getCount = async () => {
    if (contract) {
      const count = await contract.getTokenCount();
      setTotalMinted(parseInt(count));
      console.log(parseInt(count));
    }
  };

  const getNFTContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    setSigner(signer);
    const nftContract = new ethers.Contract(
        contractAddress,
        Ape.abi,
        signer
    );

    console.log(nftContract);
    setContract(nftContract);
  }

  return (
    <div>
        <WalletBalance />

        <h1>NFT Collection</h1>
        <div className="container">
          <div className="row">
            {currentAccount ? (Array(totalMinted + 1)
            .fill(0)
            .map((_, i) => (
              <div key={i} className='col-sm'>
                <NFTImage tokenId={`bayc-${i + 1}`} getCount={getCount} contract={contract} signer={signer} totalMinted={totalMinted}/>
              </div>
            ))) : (
              <></>
            )}
          </div>
        </div>
        
    </div>
  )
}

// https://gateway.pinata.cloud/ipfs/QmfQBu1sLyvWrycL9dVQTVXkSASsjQUfXrEDqgGratCxfg/bayc-1.png
function NFTImage({ tokenId, getCount, contract, signer, totalMinted }) {
  const contentId = 'QmfQBu1sLyvWrycL9dVQTVXkSASsjQUfXrEDqgGratCxfg';
  const metadataURI = `${contentId}/${tokenId}`;
  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
  // const imageURI = `assets/${tokenId}.png`;
  const [isMinted, setIsMinted] = useState(false);

  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    console.log(contract);
    console.log(metadataURI);

    let result;
    try {
      result = await contract.isContentOwned(metadataURI);
    } catch (err) {
      console.log(err);
    }
    console.log(result);
    setIsMinted(result);
  };

  const mintToken = async() => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    console.log(addr);
    console.log(contract);

    const result = await contract.payToMint(addr, metadataURI, {
      value : ethers.utils.parseEther('0.05')
    });

    await result.wait();
    getMintedStatus();
  };

  async function getURI() {
    const uri = await contract.tokenURI(totalMinted-1);
    console.log(uri);
    return uri;
  }

  return (
    <div className='card' style={{ width: '18rem' }}>
       <img
        className='card-img-top'
        src={isMinted ? imageURI : '../../assets/placeholder.png'} />
       <div className='card-body'>
         <h5 className='card-title'>ID #{tokenId}</h5>
         {!isMinted ? (
           <button
           className='btn btn-primary'
            onClick={mintToken}
           >
             Mint
           </button>
         ) : (
          <button
            className='btn btn-secondary'
            onClick={getURI}
          >
            Show URI
          </button>
         )}
       </div>
    </div>
  )
}

export default Home