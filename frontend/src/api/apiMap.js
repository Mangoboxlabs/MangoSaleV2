const abiMap = {
    Launchpad: {
        address: "5DZsFRS5RddZXFHx5t3VhKGaQXTSKKVwkd25gQFPC7ezBGVH",
        abi: require("../abi/launchpad.json")
    },
    FairLaunchpad: {
        address: "5Dq61YMX6zH6M4NRkUoXngtYJDLAvu8vuzstG1gyQLEWpKen",
        abi: require("../abi/FairLaunch.json")
    },
    DutchAuction: {
        address: "5D9twf1f7iwe9k1K75XPZwSE3LcbyTsgnPXXznaUhPY944iW",
        abi: require("../abi/DutchAuction.json")
    },

    tokenFactory : {
        address:'5HfipxSLEjXCbBfyg8s1o5vV5ybMRPdybx9yMsfhU8FLFgDG',
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
