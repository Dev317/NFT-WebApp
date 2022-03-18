const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deploy", function () {
  it("Should return the correct name and symbol", async function () {
    const Ape = await ethers.getContractFactory("Ape");
    const ape = await Ape.deploy();
    await ape.deployed();

    expect(await ape.name()).to.equal("Ape");
    expect(await ape.symbol()).to.equal("APE");
  });
});

describe("Mint", function() {
  it("Should transfer nfts to minter", async function() {
    const [owner, addr1] = await ethers.getSigners();

    const Ape = await ethers.getContractFactory("Ape");
    const ape = await Ape.deploy();
    await ape.deployed();

    const tokenId = 0;
    const uri = 'random';

    // Check that addr1 owns the token
    await ape.safeMint(addr1.address, uri, { value: ethers.utils.parseEther('0.05')});
    expect(await ape.ownerOf(tokenId)).to.equal(addr1.address);
    expect(await ape.balanceOf(addr1.address)).to.equal(1);
    expect(await ape.isContentOwned(uri)).to.equal(true);

  });
});

describe("Pause", function() {
  it("No transfer of NFT", async function() {
    const [owner, addr1] = await ethers.getSigners();

    const Ape = await ethers.getContractFactory("Ape");
    const ape = await Ape.deploy();
    await ape.deployed();

    const uri = 'random';

    // Check that error is thrown
    await ape.pause();
    await expect(ape.safeMint(addr1.address, uri, { value: ethers.utils.parseEther('0.05')})).to.be.revertedWith('Pausable: paused');
  });
});