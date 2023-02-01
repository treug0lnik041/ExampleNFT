import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ExampleNFT", function () {
	async function deployOnlyFixture() {
		const [owner, otherAccount] = await ethers.getSigners();

		const ExampleNFT = await ethers.getContractFactory("ExampleNFT");
		const exampleNFT = await ExampleNFT.deploy();

		return { owner, otherAccount, exampleNFT };
	}

	async function deployAndCreateFixture() {
		const [owner, otherAccount] = await ethers.getSigners();
		
		const ExampleNFT = await ethers.getContractFactory("ExampleNFT");
		const exampleNFT = await ExampleNFT.deploy();
		await exampleNFT.connect(owner)._createCollectible("someURI");

		return { owner, otherAccount, exampleNFT };
	}

	describe("ERC721 Standart", function () {
		it("Metadata", async function () {
			const { owner, otherAccount, exampleNFT } = await loadFixture(deployAndCreateFixture);

			expect(await exampleNFT.name()).to.equal("Example NFT");
			expect(await exampleNFT.symbol()).to.equal("EXMPLNFT");
			expect(await exampleNFT.tokenURI(0)).to.equal("someURI");
		});

		it("Basic functions", async function () {
			const { owner, otherAccount, exampleNFT } = await loadFixture(deployAndCreateFixture);

			expect(await exampleNFT.balanceOf(owner.address)).to.equal(1);
			expect(await exampleNFT.ownerOf(0)).to.equal(owner.address);

			await exampleNFT.connect(owner).approve(otherAccount.address, 0);
			expect(await exampleNFT.getApproved(0)).to.equal(otherAccount.address);
			await exampleNFT.connect(otherAccount).transferFrom(owner.address, otherAccount.address, 0);
			expect(await exampleNFT.balanceOf(otherAccount.address)).to.equal(1);
			
			expect(await exampleNFT.ownerOf(0)).to.equal(otherAccount.address);
		});

		it("Transfer", async function () {
			const { owner, otherAccount, exampleNFT } = await loadFixture(deployOnlyFixture);

			exampleNFT.connect(owner)._createCollectible("someURI1");
			exampleNFT.connect(owner)._createCollectible("someURI2");
			exampleNFT.connect(owner)._createCollectible("someURI3");

			// Approve
			await exampleNFT.connect(owner).approve(otherAccount.address, 0);
			await exampleNFT.connect(owner).approve(otherAccount.address, 1);

			expect(await exampleNFT.getApproved(0)).to.equal(otherAccount.address);
			expect(await exampleNFT.getApproved(1)).to.equal(otherAccount.address);

			// Transfer
			await exampleNFT.connect(otherAccount).transferFrom(owner.address, otherAccount.address, 0);
			await exampleNFT.connect(otherAccount)["safeTransferFrom(address,address,uint256)"](owner.address, otherAccount.address, 1);

			expect(await exampleNFT.balanceOf(owner.address)).to.equal(1);
			expect(await exampleNFT.balanceOf(otherAccount.address)).to.equal(2);
			expect(await exampleNFT.ownerOf(0)).to.equal(otherAccount.address);
			expect(await exampleNFT.ownerOf(1)).to.equal(otherAccount.address);

			expect(await exampleNFT.tokenURI(0)).to.equal("someURI1");
			expect(await exampleNFT.tokenURI(1)).to.equal("someURI2");
			expect(await exampleNFT.tokenURI(2)).to.equal("someURI3");
		});
	});
});