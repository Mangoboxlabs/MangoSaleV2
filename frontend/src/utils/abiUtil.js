const addressMap={
    vault:"0x12288E9d691ad4355CcD2Fb7B9C965Cdc48F9FF3"
}

function getContractByName(name, web3) {
    const contract = require("../abi/data/" + name + ".json")
    return new web3.eth.Contract(contract, addressMap[name], {});
}

async function getContractByToken(name, address, web3) {
    const contract = require("../abi/data/" + name + ".json")
    // const chainId = await web3.eth.getChainId()
    const chainId = 1234
    return new web3.eth.Contract(contract ,contract.networks[chainId].address, {});
}
function getContractByAddress(name, address, web3) {
    const contract = require("../abi/data/" + name + ".json")
    return new web3.eth.Contract(contract.abi, address, {});
}
async function getContractAddress(name, web3) {
    const contract = require("../abi/data/" + name + ".json")
    // const chainId = await web3.eth.getChainId()
    const chainId = 1234
    return contract.networks[chainId].address;
}

export default {
    getContractByName,
    getContractByToken,
    getContractByAddress,
    getContractAddress
};
