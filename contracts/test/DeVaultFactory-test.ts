import { ethers } from "hardhat";
const { expect } = require("chai");

describe("DeVaultFactory-test", function() {
    let deVaultFactory;
    it("deploy", async function() {
        const DeVaultFactory = await ethers.getContractFactory("DeVaultFactory");
        deVaultFactory = await DeVaultFactory.deploy();
        await deVaultFactory.deployed();
        console.log('deVaultFactory deployed:', deVaultFactory.address);
    });
});