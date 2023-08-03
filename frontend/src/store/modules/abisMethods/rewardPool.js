import getContract from "@/abi/index.js";
import {getRewardData} from "@/api/governance";
import BigNumber from "bignumber.js";

function judgeToken(rootState) {
    if (!state.token) state.token = getContract.getContractByName('rewardPool', rootState.app.web3)
}

const state = {
    rewardData: {},
    totalEarnedNum: 0,
    claimed: 0
};
const mutations = {
    SET_TokenData(state, val) {
        state.rewardData = val
    },
    SET_TotalEarned(state, val) {
        state.totalEarnedNum = val
    },
    SET_Claimed(state, val) {
        state.claimed = val
    },
};
const actions = {

    async getRewardData({rootState, commit}) {
        try {
            const res = await getRewardData(rootState.app.chainId, rootState.app.account)
            if (res && res.data && res.data.code === 0) {
                commit("SET_TokenData", res.data.data)
                commit("SET_Claimed", res.data.extra.claimed)
            }
        } catch (e) {
            console.log(e)
        }
    },
    getReward({rootState}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.getReward().estimateGas({
                from: rootState.app.account,
            }).then(gas => {
                state.token.methods.getReward().send({
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
    totalEarned({rootState, commit}, {_account}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.totalEarned(_account).call().then(res => {
                commit("SET_TotalEarned", BigNumber(res).div(10 ** rootState.TBCStake.tbcDecimals))
                resolve(res)
            }).catch(err => {
                reject(JSON.parse(err.message.substr(24, err.message.length)).message)
            })
        })
    },
    users({rootState}, {param0, param1}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.users(param0, param1).call().then(res => {
                resolve(res)
            }).catch(err => {
                reject(JSON.parse(err.message.substr(24, err.message.length)).message)
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
