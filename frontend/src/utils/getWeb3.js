import Web3 from "web3";
import {message} from "ant-design-vue";
let curProvider = null
const getWeb3= async (provider)=>{
    return new Promise(function (resolve,reject){
        try{
            if(provider){
                curProvider = provider
                let web3 = new Web3(curProvider)
                resolve({
                    web3,
                })
            }else if (window.ethereum) {
                window.ethereum.autoRefreshOnNetworkChange = false;
                let web3 = new Web3(window.ethereum)
                curProvider = window.ethereum
                resolve({
                    web3,
                })
            }else{
                reject(new Error("Unable to Connect"))
            }
        }catch (e){
            console.log(e)
            message.error(e)
        }
    })
}

export default getWeb3
