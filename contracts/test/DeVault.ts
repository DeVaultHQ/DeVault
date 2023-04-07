import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { utils,} from "ethers"
import { Provider } from "@ethersproject/providers";
import { getProof, b, s } from "../scripts/proofs"

describe("DeVault", function () {
    const key = "123"; // number string
    const pwd = "abc 123";
    const passwordHash = b("20234527716876976045330331029277415515200138841533840117928897402759085012640");

    async function deployDeVault() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const DeVault = await ethers.getContractFactory("DeVault");
        const deVault = await DeVault.deploy(key, passwordHash);

        return { deVault, owner, otherAccount };
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

    describe("SetVault", function () {
        it("Should set empty vault fail", async function () {
            const { deVault, owner } = await loadFixture(deployDeVault);
            const provider = owner.provider as Provider;
            const nonce = "0"; // number string
            const vaultKey = "123123123";
            const vaultValue = "";
            const dataHash = s(b(utils.solidityKeccak256(['uint256', 'string'], [vaultKey, vaultValue])))
            const proofs = await getProof(provider, pwd, key, nonce, dataHash);

            await expect(deVault.setVault(vaultKey, vaultValue, proofs.proof, proofs.expiration, proofs.allhash)).to.be.revertedWith("DeVault:: vault value is empty")
        })

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

            let nonceRes = await deVault.getNonce()
            expect(nonceRes).to.equal(b("1"))
        })

        it("Should overwrite the vault success", async function () {
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

            let nonceRes = await deVault.getNonce()
            expect(nonceRes).to.equal(b("1"))

            const newNonce = "1"; // number string
            const newVaultKey = "45645445";
            const newVaultValue = "encrypted(pwd, new_value)";
            const newDataHash = s(b(utils.solidityKeccak256(['uint256', 'string'], [newVaultKey, newVaultValue])))
            const newProofs = await getProof(provider, pwd, key, newNonce, newDataHash);

            await deVault.setVault(newVaultKey, newVaultValue, newProofs.proof, newProofs.expiration, newProofs.allhash)

            const newValue = await deVault.getVault(vaultKey)
            expect(newValue).to.equal(vaultValue)

            nonceRes = await deVault.getNonce()
            expect(nonceRes).to.equal(b("2"))
        })

        it("Should get keys success", async function () {
            const { deVault, owner } = await loadFixture(deployDeVault);
            const provider = owner.provider as Provider;
            const nonce = "0"; // number string
            const vaultKey = "123123123";
            const vaultValue = "encrypted(pwd, value)";
            const dataHash = s(b(utils.solidityKeccak256(['uint256', 'string'], [vaultKey, vaultValue])))
            const proofs = await getProof(provider, pwd, key, nonce, dataHash);

            await deVault.setVault(vaultKey, vaultValue, proofs.proof, proofs.expiration, proofs.allhash)

            const newNonce = "1"; // number string
            const newVaultKey = "45645445";
            const newVaultValue = "encrypted(pwd, new_value)";
            const newDataHash = s(b(utils.solidityKeccak256(['uint256', 'string'], [newVaultKey, newVaultValue])))
            const newProofs = await getProof(provider, pwd, key, newNonce, newDataHash);
            await deVault.setVault(newVaultKey, newVaultValue, newProofs.proof, newProofs.expiration, newProofs.allhash)

            const keys = await deVault.getVaultKeysLength();
            expect(keys).to.equal(b("2"))
            for (let i = 0; i < 2; i++) {
                const key = await deVault.getVaultKey(i);
                expect(key).to.equal([vaultKey, newVaultKey][i])
            }
        })
    })

    describe("SetRecover", function () {
        it("Should set the recover success", async function () {
            const { deVault, owner } = await loadFixture(deployDeVault);
            const provider = owner.provider as Provider;
            const nonce = "0"; // number string
            const needGuardiansNum = '3';
            const accounts = await ethers.getSigners();
            const guardians = [accounts[0].address, accounts[1].address, accounts[2].address];
            const dataHash = s(b(utils.solidityKeccak256(['address[]', 'uint256'], [guardians, needGuardiansNum])));
            const proofs = await getProof(provider, pwd, key, nonce, dataHash);

            await deVault.setRecover(guardians, needGuardiansNum, proofs.proof, proofs.expiration, proofs.allhash);

            const res = await deVault.getRecover();
            expect(res[0]).to.eql(guardians);
            expect(res[1]).to.equal(needGuardiansNum);

            it("Should set the nonce to 1", async function () {
                const nonceRes = await deVault.getNonce()
                expect(nonceRes).to.equal(b("1"))
            })
        })
    })

    describe("RecoverPassword", function () {
        it("Should recover the password success", async function () {
            const {deVault, owner} = await loadFixture(deployDeVault);
            const newPasswordHash = b("17466748668564451514422910246405586532533310782245479172674728689683134284428");
            const provider = owner.provider as Provider;
            const nonce = "0"; // number string
            const needGuardiansNum = '3';
            const accounts = await ethers.getSigners();
            const guardians = [accounts[0].address, accounts[1].address, accounts[2].address];
            const dataHash = s(b(utils.solidityKeccak256(['address[]', 'uint256'], [guardians, needGuardiansNum])));
            const proofs = await getProof(provider, pwd, key, nonce, dataHash);

            await deVault.setRecover(guardians, needGuardiansNum, proofs.proof, proofs.expiration, proofs.allhash);

            const res = await deVault.getRecover();
            expect(res[0]).to.eql(guardians);
            expect(res[1]).to.equal(needGuardiansNum);

            await deVault.connect(accounts[0]).recoverPassword(newPasswordHash);
            console.log('recoverPassword done 0');
            await deVault.connect(accounts[1]).recoverPassword(newPasswordHash);
            console.log('recoverPassword done 1');
            await deVault.connect(accounts[2]).recoverPassword(newPasswordHash);
            console.log('recoverPassword done 2');

            let recover = await deVault.getPasswordHash();
            expect(recover).to.equal(newPasswordHash);
        })
    })
});


//util
async function getProof(
    provider: Provider,
    pwd: string,
    key: string,
    nonce: string,
    datahash: string) {

    let expiration = parseInt(String(Date.now() / 1000 + 600))
    let chainId = (await provider.getNetwork()).chainId
    console.log("ChainId", chainId)
    let fullhash = utils.solidityKeccak256(['uint256','uint256','uint256','uint256'], [expiration, chainId, nonce, datahash])
    fullhash = s(b(fullhash).div(8)) //must be 254b, not 256b

    let input = [stringToHex(pwd), s(b(key)), fullhash]
    let data = await snarkjs.groth16.fullProve({in:input}, "./zk/v1/circuit_js/circuit.wasm", "./zk/v1/circuit_final.zkey")

    // console.log(JSON.stringify(data))

    const vKey = JSON.parse(fs.readFileSync("./zk/v1/verification_key.json"))
    const res = await snarkjs.groth16.verify(vKey, data.publicSignals, data.proof)

    if (res === true) {
        console.log("Verification OK")

        let pwdhash = data.publicSignals[0]
        let fullhash = data.publicSignals[1]
        let allhash = data.publicSignals[2]

        let proof = [
            BigNumber.from(data.proof.pi_a[0]).toHexString(),
            BigNumber.from(data.proof.pi_a[1]).toHexString(),
            BigNumber.from(data.proof.pi_b[0][1]).toHexString(),
            BigNumber.from(data.proof.pi_b[0][0]).toHexString(),
            BigNumber.from(data.proof.pi_b[1][1]).toHexString(),
            BigNumber.from(data.proof.pi_b[1][0]).toHexString(),
            BigNumber.from(data.proof.pi_c[0]).toHexString(),
            BigNumber.from(data.proof.pi_c[1]).toHexString()
        ]
        return {proof, pwdhash, key, expiration, chainId, nonce, datahash, fullhash, allhash}
    } else {
        throw new Error("Verification failed");
    }
}


function stringToHex(string: string) :string{
    let hexStr = '';
    for (let i = 0; i < string.length; i++) {
        let compact = string.charCodeAt(i).toString(16)
        hexStr += compact
    }
    return '0x' + hexStr
}

function getAbi(jsonPath: string) {
    let file = fs.readFileSync(jsonPath)
    let abi = JSON.parse(file.toString()).abi
    return abi
}

async function delay(sec: number)   {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, sec * 1000);
    })
}

function m(num: number, decimals: BigNumber): BigNumber {
    return BigNumber.from(num).mul(BigNumber.from(10).pow(decimals))
}

function d(bn: BigNumber, decimals: BigNumber): Number {
    return bn.mul(BigNumber.from(100)).div(BigNumber.from(10).pow(decimals)).toNumber() / 100
}

function b(num: string):BigNumber {
    return BigNumber.from(num)
}

function n(bn: BigNumber) {
    return bn.toNumber()
}

function s(bn: BigNumber) {
    return bn.toString()
}
