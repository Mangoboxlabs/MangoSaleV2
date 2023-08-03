import getContract from "@/abi/index.js";
import {getAuctionsData, getBidHistory} from "@/api/auctionApi";
import bignumber from "bignumber.js";

function judgeToken(rootState) {
    if (!state.token) state.token = getContract.getContractByName("auctionNFT", rootState.app.web3);
}

const state = {
    allowance: 0,
    auctionsData: {},
    extra: {},
    BidHistory: [],
};
const mutations = {
    SET_ALLOWANCE(state, val) {
        state.allowance = val;
    },
    SET_AUCTIONDATA(state, val) {
        state.auctionsData = val;
    },
    SET_EXTRA(state, val) {
        state.extra = val;
    },
    SET_BIDHistory(state, val) {
        state.BidHistory = val;
    },
};
const actions = {
    async getBidHistory({rootState}, auction_id) {
        try {
            const res = await getBidHistory({
                chain: rootState.app.chainId,
                auction_id,
            });
            if (res && res.data && res.data.code === 0) {
                return res.data.data;
            }
        } catch (e) {
            console.log(e);
        }
    },
    async getAuctionsData({rootState, commit}, {type, is_ended, is_my_nft}) {
        try {
            const res = await getAuctionsData({
                chain: rootState.app.chainId,
                address: rootState.app.account,
                type,
                is_my_nft,
                is_ended,
            });
            if (res && res.data && res.data.code === 0) {
                commit("SET_AUCTIONDATA", res.data.data);
                commit("SET_EXTRA", res.data.extra);
            }
        } catch (e) {
            console.log(e);
        }
    },
    auctions({rootState}, {param0}) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .auctions(param0)
                .call()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    bid({rootState}, {_auctionId, value, _price}) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .bid(_auctionId, _price)
                .estimateGas({
                    from: rootState.app.account,
                    value: rootState.app.web3.utils.toWei(bignumber(value).toFixed(18).toString()),
                })
                .then((gas) => {
                    state.token.methods
                        .bid(_auctionId, _price)
                        .send({
                            from: rootState.app.account,
                            gas: parseInt(gas * 1.2),
                            value: rootState.app.web3.utils.toWei(bignumber(value).toFixed(18).toString()),
                        })
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    create({rootState}, {_bundleId}) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .create(_bundleId)
                .estimateGas({
                    from: rootState.app.account,
                })
                .then((gas) => {
                    state.token.methods
                        .create(_bundleId)
                        .send({
                            from: rootState.app.account,
                            gas: parseInt(gas * 1.2),
                        })
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    createAndBid({rootState}, {value, _bundleId, _price}) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .createAndBid(_bundleId, _price)
                .estimateGas({
                    from: rootState.app.account,
                    value: rootState.app.web3.utils.toWei(bignumber(value).toFixed(18).toString()),
                })
                .then((gas) => {
                    state.token.methods
                        .createAndBid(_bundleId, _price)
                        .send({
                            from: rootState.app.account,
                            gas: parseInt(gas * 1.2),
                            value: rootState.app.web3.utils.toWei(bignumber(value).toFixed(18).toString()),
                        })
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    margin({rootState}, {param0, param1}) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .margin(param0, param1)
                .call()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    payment({rootState}, {value, _auctionId}) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .payment(_auctionId)
                .estimateGas({
                    from: rootState.app.account,
                    value: rootState.app.web3.utils.toWei(bignumber(value).toFixed(18).toString()),
                })
                .then((gas) => {
                    state.token.methods
                        .payment(_auctionId)
                        .send({
                            from: rootState.app.account,
                            gas: parseInt(gas * 1.2),
                            value: rootState.app.web3.utils.toWei(bignumber(value).toFixed(18).toString()),
                        })
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    reBuildAndBid({rootState}, {value, _auctionId, _price}) {
        judgeToken(rootState);
        console.log({value, _auctionId, _price})
        return new Promise((resolve, reject) => {
            state.token.methods
                .reBuildAndBid(_auctionId, _price)
                .estimateGas({
                    from: rootState.app.account,
                    value: rootState.app.web3.utils.toWei(bignumber(value).toFixed(18).toString()),
                })
                .then((gas) => {
                    state.token.methods
                        .reBuildAndBid(_auctionId, _price)
                        .send({
                            from: rootState.app.account,
                            gas: parseInt(gas * 1.2),
                            value: rootState.app.web3.utils.toWei(bignumber(value).toFixed(18).toString()),
                        })
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    rebuildAuction({rootState}, {_auctionId}) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .rebuildAuction(_auctionId)
                .estimateGas({
                    from: rootState.app.account,
                })
                .then((gas) => {
                    state.token.methods
                        .rebuildAuction(_auctionId)
                        .send({
                            from: rootState.app.account,
                            gas: parseInt(gas * 1.2),
                        })
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    redeem({rootState}, {value, _auctionId}) {
        console.log('redeem',value, _auctionId);
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .redeem(_auctionId)
                .estimateGas({
                    from: rootState.app.account,
                    value: rootState.app.web3.utils.toWei(bignumber(value).toFixed(18).toString()),
                })
                .then((gas) => {
                    state.token.methods
                        .redeem(_auctionId)
                        .send({
                            from: rootState.app.account,
                            gas: parseInt(gas * 1.2),
                            value: rootState.app.web3.utils.toWei(bignumber(value).toFixed(18).toString()),
                        })
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    withdrawMargin({rootState}, {_bundleId}) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .withdrawMargin(_bundleId)
                .estimateGas({
                    from: rootState.app.account,
                })
                .then((gas) => {
                    state.token.methods
                        .withdrawMargin(_bundleId)
                        .send({
                            from: rootState.app.account,
                            gas: parseInt(gas * 1.2),
                        })
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
};
export default {
    namespaced: true,
    mutations,
    state,
    actions,
};

