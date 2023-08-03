import getContract from "@/abi/index.js";
import {getProductList, getPositions} from "@/api/govStakingApi";
import {TBCDecimals} from "@/config/constants";

function judgeToken(rootState) {
    if (!state.token) state.token = getContract.getContractByName('TBCStake', rootState.app.web3)
}

const state = {
    tbcDecimals: TBCDecimals,
    tbcBalance:0,
    productList:[],
    positionsList: {
        history:[],
        staking:[],
        matured:[]
    },
    positionsExtra:{
        count:{

        }
    },
    tbcAllowance:0
};
const mutations = {
    SET_TBCBalance(state, amount) {
        state.tbcBalance = amount
    },
    SET_ProductList(state, data) {
        state.productList = data
    },
    SET_Positions(state, data) {
        state.positionsList = data
    },
    SET_PositionExtra(state, data) {
        state.positionsExtra = data
    },
};
const actions = {
    async getStakePositions({rootState,commit}){
        try {
            const res = await getPositions(rootState.app.chainId, rootState.app.account)
            if(res&&res.data&&res.data.code===0){
                commit("SET_Positions",res.data.data)
                commit("SET_PositionExtra",res.data.extra)
            }
        } catch (e) {
            console.log(e)
        }
    },
    async getStakeProductList({rootState,commit}){
        try {
            const res = await getProductList(rootState.app.chainId,rootState.app.account)
            if(res&&res.data&&res.data.code===0){
                commit("SET_ProductList",res.data.data)
            }
        } catch (e) {
            console.log(e)
        }
    },
    reStake({rootState}, {id, profit, amount, productId, autoReinvestment, signature}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.reStake(id, profit, amount, productId, autoReinvestment, signature).estimateGas({
                from: rootState.app.account,
            }).then(gas => {
                state.token.methods.reStake(id, profit, amount, productId, autoReinvestment, signature).send({
                    from: rootState.app.account,
                    gas: parseInt(gas * 1.2)
                }).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            }).catch(err => {
                reject(err)
            })
        })
    },
    reStakeBatch({rootState}, {id, profit, amount, productId, autoReinvestment, signature}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.reStakeBatch(id, profit, amount, productId, autoReinvestment, signature).estimateGas({
                from: rootState.app.account,
            }).then(gas => {
                state.token.methods.reStakeBatch(id, profit, amount, productId, autoReinvestment, signature).send({
                    from: rootState.app.account,
                    gas: parseInt(gas * 1.2)
                }).then(res => {

                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            }).catch(err => {
                reject(err)
            })
        })
    },
    stake({rootState}, {amount, productId, autoReinvestment}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.stake(amount, productId, autoReinvestment).estimateGas({
                from: rootState.app.account,
            }).then(gas => {
                state.token.methods.stake(amount, productId, autoReinvestment).send({
                    from: rootState.app.account,
                    gas: parseInt(gas * 1.2)
                }).then(res => {

                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            }).catch(err => {
                reject(err)
            })
        })
    },
    stakingTotal({rootState}, {_user}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.stakingTotal(_user).call().then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    withdraw({rootState}, {id, profit, amount, signature}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.withdraw(id, profit, amount, signature).estimateGas({
                from: rootState.app.account,
            }).then(gas => {
                state.token.methods.withdraw(id, profit, amount, signature).send({
                    from: rootState.app.account,
                    gas: parseInt(gas * 1.2)
                }).then(res => {

                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            }).catch(err => {
                reject(err)
            })
        })
    },
    withdrawBatch({rootState}, {id, profit, amount, signature}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.withdrawBatch(id, profit, amount, signature).estimateGas({
                from: rootState.app.account,
            }).then(gas => {
                state.token.methods.withdrawBatch(id, profit, amount, signature).send({
                    from: rootState.app.account,
                    gas: parseInt(gas * 1.2)
                }).then(res => {

                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            }).catch(err => {
                reject(err)
            })
        })
    },
}
export default {
    namespaced: true,
    mutations,
    state,
    actions
}
