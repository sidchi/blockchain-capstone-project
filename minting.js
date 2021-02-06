//Based on Github repo to mint multiple tokens

const fs = require('fs');
const HDWalletProvider = require("truffle-hdwallet-provider")
const mnemonic = fs.readFileSync("./eth-contracts/.secret").toString().trim();
const zokratesProof = [
    require("./zokrates/code/square/proof_0.json"),
    require("./zokrates/code/square/proof_1.json"),
    require("./zokrates/code/square/proof_2.json"),
    require("./zokrates/code/square/proof_3.json"),
    require("./zokrates/code/square/proof_4.json"),
    require("./zokrates/code/square/proof_5.json"),
    require("./zokrates/code/square/proof_6.json"),
    require("./zokrates/code/square/proof_7.json"),
    require("./zokrates/code/square/proof_8.json"),
    require("./zokrates/code/square/proof_9.json")
];
const web3 = require('web3')
const OWNER_ADDRESS = "0x47144fD98DAe2eCF1a802f2dd964EEDdcC2C6455"
const CONTRACT_ADDRESS = "0xad28Beb95CA06355d6215ab30656B40BF287DAbd"
const NETWORK = "rinkeby"
const MINT_COUNT =10
const MNEMONIC = mnemonic
const INFURA_KEY = "97f1bb79d7a547b49e3eee4248d87268"

if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
    console.error("Please set a mnemonic, infura key, owner, network, and contract address.")
    return
}

const contract = require('./eth-contracts/build/contracts/SolnSquareVerifier.json'); 
const ABI = contract.abi;

async function main() {
    const provider = new HDWalletProvider(MNEMONIC, `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`)
    const web3Instance = new web3(
        provider
    )

    if (CONTRACT_ADDRESS) {
        const nftContract = new web3Instance.eth.Contract(ABI, CONTRACT_ADDRESS, { gasLimit: "1000000" })
        // tokens issued directly to the owner.
        for (let i = 0; i < MINT_COUNT ; i++) {
            try {
                let proofs = Object.values(zokratesProof[i].proof);
                let inputs = zokratesProof[i].inputs;
                console.log("Owner: "+ OWNER_ADDRESS + "\n");
                console.log("Index: "+i+ "\n");
                console.log("Proofs: "+ proofs+ "\n");
                console.log("Inputs: "+ inputs+ "\n");
                const result = await nftContract.methods.mintNFT(OWNER_ADDRESS,i,...proofs,inputs).send({ from: OWNER_ADDRESS });
            
			console.log("Minted Transaction: " + result.transactionHash)
            } catch (e) {
                console.log(e);
            }
        }
    }
}

main()