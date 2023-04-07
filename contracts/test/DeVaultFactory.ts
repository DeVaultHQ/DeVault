import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DeVaultFactory", function () {
    const key = "123"; // number string
    const pwd = "abc 123";
    const passwordHash = "20234527716876976045330331029277415515200138841533840117928897402759085012640";

    async function deployDeVaultFactory() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const DeVaultFactory = await ethers.getContractFactory("DeVaultFactory");
        const deVaultFactory = await DeVaultFactory.deploy();

        return {deVaultFactory, owner, otherAccount};
    }

    describe("CreateDeVault", function () {
        it("Should empty value", async function () {
            const {deVaultFactory, owner} = await loadFixture(deployDeVaultFactory);
            expect(await deVaultFactory.getDeVault(key)).to.equal("0x0000000000000000000000000000000000000000");
        });

        it("Should create success", async function () {
            const {deVaultFactory, owner} = await loadFixture(deployDeVaultFactory);

            await deVaultFactory.createDeVault(key, passwordHash)

            expect(!await deVaultFactory.getDeVault(key)).to.not.eq("0x0000000000000000000000000000000000000000");

            // create duplicate
            await expect(deVaultFactory.createDeVault(key, passwordHash)).to.be.revertedWith("DeVaultFactory: DeVault already exists");
        });
    });
});
