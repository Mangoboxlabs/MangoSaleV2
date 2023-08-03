
import addressMap from "@/abi/addressMap";
import {chainId1} from "@/config/constants";
const CONTRACTS = {

    erc20:{
        abi:require("./data/erc20.json"),
    },
    erc721:{
        abi:require("./data/erc721.json"),
    },
    vault:{
        abi:require("./data/vault.json"),
        address:addressMap[chainId1].vault
    },
    usdt:{
        abi:require("./data/erc20.json"),
        address:addressMap[chainId1].usdt
    },
    stake:{
        abi:require("./data/stake.json"),
        address:addressMap[chainId1].stake
    },
    auctionNFT:{
        abi:require("./data/auctionNFT.json"),
        address:addressMap[chainId1].auctionNFT
    },
    rewardPool:{
        abi:require("./data/rewardPool.json"),
        address:addressMap[chainId1].rewardPool
    },
    TBCStake:{
        abi:require("./data/TBCStake.json"),
        address:addressMap[chainId1].TBCStake
    },
    stakingProof:{
        abi:require("./data/stakingProof.json"),
        address:addressMap[chainId1].stakingProof
    },
};

function getContractByName(name, web3) {
    return new web3.eth.Contract(CONTRACTS[name].abi, CONTRACTS[name].address, {});
}

function getContractByToken(name, address, web3) {
    return new web3.eth.Contract(CONTRACTS[name].abi, address, {});
}

function getContractAddress(name) {
    return CONTRACTS[name].address;
}

export default {
    CONTRACTS,
    getContractByName,
    getContractByToken,
    getContractAddress
};
