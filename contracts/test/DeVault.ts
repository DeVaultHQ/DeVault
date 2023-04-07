import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { utils,  } from "ethers"
import { Provider } from "@ethersproject/providers";
import { getProof, b, s } from "../scripts/proofs"

describe("DeVault", function () {
    const key = "123"; // number string
    const pwd = "abc 123";
    const passwordHash = b("20234527716876976045330331029277415515200138841533840117928897402759085012640");
    // const accounts = await ethers.getSigners()
    // const provider = accounts[0].provider

    async function deployDeVault() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const DeVault = await ethers.getContractFactory("DeVault");
        const deVault = await DeVault.deploy(key, passwordHash);

        return { deVault, owner, otherAccount };
    }

    async function deployMockERC20() {
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const mockERC20 = await MockERC20.deploy();

        return { mockERC20 };
    }

    async function deployMockERC721() {
        const MockERC721 = await ethers.getContractFactory("MockERC721");
        const mockERC721 = await MockERC721.deploy();

        return { mockERC721 };
    }

    describe("Deploy", function () {
        it("Should set the right key hash", async function () {
            const { deVault, owner } = await loadFixture(deployDeVault);

            expect(await deVault.getKeyHash()).to.equal(key);
        });

        it("Should set the right password hash", async function () {
            const { deVault, owner } = await loadFixture(deployDeVault);

            expect(await deVault.getPasswordHash()).to.equal(passwordHash);
        });

        it("Should set the right nonce", async function () {
            const { deVault, owner } = await loadFixture(deployDeVault);

            expect(await deVault.getNonce()).to.equal(b("0"));
        });
    });

    describe("Verify", function () {
        it("Should verify the proof success", async function () {
            const { deVault, owner } = await loadFixture(deployDeVault);
            const provider = owner.provider as Provider;
            const nonce = "0"; // number string
            const datahash = "456"; // number string

            const proofs = await getProof(provider, pwd, key, nonce, datahash);
            const res = deVault.verifyProof(proofs.proof, proofs.pwdhash, proofs.fullhash, proofs.allhash)
            expect(await res).to.equal(true)
        })
    })

    describe("Execute", function () {
        it("Should send ether success", async function () {
            const { deVault, owner, otherAccount } = await loadFixture(deployDeVault);
            const provider = owner.provider as Provider;
            const nonce = await deVault.getNonce(); // number string
            const sendTo = otherAccount.address;
            const value = ethers.utils.parseEther("0.1")
            const func = "0x00"
            const dataHash = s(b(utils.solidityKeccak256(['address', 'uint256', 'bytes'], [sendTo, value, func])))
            const proofs = await getProof(provider, pwd, key, nonce.toString(), dataHash);

            await owner.sendTransaction({
                to: deVault.address,
                value: ethers.utils.parseEther("1.0"),
            })

            await deVault.execute(
                proofs.proof,
                proofs.expiration,
                proofs.allhash,
                sendTo,
                value,
                func,
            )
            const deVaultBalance = await provider.getBalance(deVault.address)
            expect(deVaultBalance).to.lte(ethers.utils.parseEther("0.9"))
        })

        it("Should receive and send nft success", async function () {
            const { deVault, owner, otherAccount } = await loadFixture(deployDeVault);
            const { mockERC721 } = await loadFixture(deployMockERC721);

            const provider = owner.provider as Provider;
            const nonce = await deVault.getNonce(); // number string
            const sendTo = otherAccount.address;
            const value = "0"
            const func = mockERC721.interface.encodeFunctionData("safeTransferFrom(address,address,uint256)", [deVault.address, sendTo, 1])
            const dataHash = s(b(utils.solidityKeccak256(['address', 'uint256', 'bytes'], [mockERC721.address, value, func])))
            const proofs = await getProof(provider, pwd, key, nonce.toString(), dataHash);

            // receive
            await mockERC721.mint(deVault.address, 1)
            expect(await mockERC721.ownerOf(b("1"))).to.equal(deVault.address)

            await deVault.execute(
                proofs.proof,
                proofs.expiration,
                proofs.allhash,
                mockERC721.address,
                value,
                func,
            )
            expect(await mockERC721.ownerOf(b("1"))).to.equal(sendTo)
        })

        it("Should receive and send erc20 success", async function () {
            const { deVault, owner, otherAccount } = await loadFixture(deployDeVault);
            const { mockERC20 } = await loadFixture(deployMockERC20);

            const provider = owner.provider as Provider;
            const nonce = await deVault.getNonce(); // number string
            const sendTo = otherAccount.address;
            const value = "0"
            const amount = ethers.utils.parseEther("10")
            const func = mockERC20.interface.encodeFunctionData("transfer", [sendTo, amount])
            const dataHash = s(b(utils.solidityKeccak256(['address', 'uint256', 'bytes'], [mockERC20.address, value, func])))
            const proofs = await getProof(provider, pwd, key, nonce.toString(), dataHash);

            // receive
            await mockERC20.mint(deVault.address, ethers.utils.parseEther("100"))
            expect(await mockERC20.balanceOf(deVault.address)).to.equal(ethers.utils.parseEther("100"))

            await deVault.execute(
                proofs.proof,
                proofs.expiration,
                proofs.allhash,
                mockERC20.address,
                value,
                func,
            )
            expect(await mockERC20.balanceOf(deVault.address)).to.equal(ethers.utils.parseEther("90"))
        })
    })

    describe("SetVault", function () {
        it("Should set the vault success", async function () {
            const { deVault, owner } = await loadFixture(deployDeVault);
            const provider = owner.provider as Provider;
            const nonce = "0"; // number string
            const vaultKey = "123123123";
            const vaultValue = "encrypted(pwd, value)";
            const dataHash = s(b(utils.solidityKeccak256(['uint256', 'string'], [vaultKey, vaultValue])))
            const proofs = await getProof(provider, pwd, key, nonce, dataHash);

            await deVault.setVault(vaultKey, vaultValue, proofs.proof, proofs.expiration, proofs.allhash)

            const res = await deVault.getVault(vaultKey)
            expect(res).to.equal(vaultValue)

            it("Should set the nonce to 1", async function () {
                const nonceRes = await deVault.getNonce()
                expect(nonceRes).to.equal(b("1"))
            })

            // override the vault
            it("Should override the vault success", async function () {
                const nonce = "1"; // number string
                const vaultKey = "45645445";
                const vaultValue = "encrypted(pwd, new_value)";
                const dataHash = s(b(utils.solidityKeccak256(['uint256', 'string'], [vaultKey, vaultValue])))
                const proofs = await getProof(provider, pwd, key, nonce, dataHash);

                await deVault.setVault(vaultKey, vaultValue, proofs.proof, proofs.expiration, proofs.allhash)

                const res = await deVault.getVault(vaultKey)
                expect(res).to.equal(vaultValue)

                it("Should set the nonce to 2", async function () {
                    const nonceRes = await deVault.getNonce()
                    expect(nonceRes).to.equal(b("2"))
                })
            })
        })

    })
});

