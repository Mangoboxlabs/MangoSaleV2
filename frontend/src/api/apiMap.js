const abiMap = {
    Launchpad: {
        address: "5DZsFRS5RddZXFHx5t3VhKGaQXTSKKVwkd25gQFPC7ezBGVH",
        abi: require("../abi/launchpad.json")
    },
    FairLaunchpad: {
        address: "5GBRdNHQW4a35KZu4fRpPocsTnVZaLeaNMMeFHeg1Pa4XrxK",
        abi: require("../abi/FairLaunch.json")
    },
    DutchAuction: {
        address: "5CT7Qwp8Z3VmpntkPfbjicSkomDvza9b7XXJcPFbc9aWa7uV",
        abi: require("../abi/DutchAuction.json")
    },

    tokenFactory : {
        address:'5HYW3ZFcjukAeVe61R9dZodn2nai4Gq66c3MPJYFd2VS8B2a',
        abi:require("../abi/token_factory.json")
    },
    Erc20Hash:{
        address:'0x7f7488396c172b3ea40568836d429925ce0067d39918cfe7847846b6146f850b',
    },
    token:{
        abi:require("../abi/erc20.json")
    }
}
export default abiMap
