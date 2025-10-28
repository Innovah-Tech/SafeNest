import { expect } from "chai";
import { ethers } from "hardhat";
import { SafeNest } from "../typechain-types";

describe("SafeNest", function () {
  // We define a fixture to reuse the same setup in every test.

  let safeNest: SafeNest;
  let owner: any;
  let user1: any;
  let user2: any;

  before(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    const safeNestFactory = await ethers.getContractFactory("SafeNest");
    safeNest = (await safeNestFactory.deploy()) as SafeNest;
    await safeNest.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should have the right platform name on deploy", async function () {
      expect(await safeNest.platformName()).to.equal("SafeNest - Decentralized Help Platform");
    });

    it("Should have zero help requests initially", async function () {
      expect(await safeNest.totalHelpRequests()).to.equal(0);
    });

    it("Should have zero help provided initially", async function () {
      expect(await safeNest.totalHelpProvided()).to.equal(0);
    });

    it("Should have correct platform fee", async function () {
      expect(await safeNest.platformFee()).to.equal(ethers.parseEther("0.01"));
    });

    it("Should set the correct owner", async function () {
      expect(await safeNest.owner()).to.equal(owner.address);
    });
  });

  describe("Help Request Creation", function () {
    it("Should allow creating a help request", async function () {
      const title = "Need help with Solidity";
      const description = "I'm having trouble with smart contract development";
      const category = "smart-contracts";
      const isPremium = false;

      await safeNest.connect(user1).createHelpRequest(title, description, category, isPremium, { value: 0 });

      expect(await safeNest.totalHelpRequests()).to.equal(1);

      const helpRequest = await safeNest.getHelpRequest(0);
      expect(helpRequest.title).to.equal(title);
      expect(helpRequest.description).to.equal(description);
      expect(helpRequest.category).to.equal(category);
      expect(helpRequest.requester).to.equal(user1.address);
      expect(helpRequest.isPremium).to.equal(false);
    });

    it("Should allow creating a premium help request with reward", async function () {
      const title = "Urgent DeFi help needed";
      const description = "Need immediate assistance with DeFi protocol";
      const category = "defi";
      const isPremium = true;
      const totalValue = ethers.parseEther("0.1");
      const platformFee = ethers.parseEther("0.01");
      const expectedReward = totalValue - platformFee;

      await safeNest.connect(user2).createHelpRequest(title, description, category, isPremium, { value: totalValue });

      expect(await safeNest.totalHelpRequests()).to.equal(2);

      const helpRequest = await safeNest.getHelpRequest(1);
      expect(helpRequest.title).to.equal(title);
      expect(helpRequest.isPremium).to.equal(true);
      expect(helpRequest.reward).to.equal(expectedReward);
    });
  });

  describe("Helper Registration", function () {
    it("Should allow user to register as helper", async function () {
      const name = "John Doe";
      const bio = "Experienced Solidity developer";
      const skills = ["solidity", "defi", "smart-contracts"];

      await safeNest.connect(user1).registerAsHelper(name, bio, skills);

      expect(await safeNest.isHelper(user1.address)).to.equal(true);

      const profile = await safeNest.getUserProfile(user1.address);
      expect(profile.name).to.equal(name);
      expect(profile.bio).to.equal(bio);
    });
  });

  describe("Platform Statistics", function () {
    it("Should return correct platform stats", async function () {
      const stats = await safeNest.getPlatformStats();
      expect(stats[0]).to.equal(2); // total requests
      expect(stats[1]).to.equal(0); // total help provided
      expect(stats[2]).to.equal(2); // total helpers (placeholder)
    });
  });
});
