import getContract from "@/abi/index.js";
import { getLendingData } from "@/api/homeApi";

function judgeToken(rootState) {
    if (!state.token) state.token = getContract.getContractByName("vault", rootState.app.web3);
}

const state = {
    tokenList: [],
};
const mutations = {
    SET_LendData(state, val) {
        state.tokenList = val;
    },
};
const actions = {
    async getLendData({ rootState, commit }) {
        try {
            const res = await getLendingData(rootState.app.chainId, rootState.app.account);
            if (res && res.data && res.data.code === 0) {
                commit("SET_LendData", res.data.data);
            }
        } catch (e) {
            console.log(e);
        }
    },
    DIVISOR({ rootState }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .DIVISOR()
                .call()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    ONE_YEAR({ rootState }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .ONE_YEAR()
                .call()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    auctionEnd({ rootState }, value, { _bundleId, _auctionUser, _price }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .auctionEnd(_bundleId, _auctionUser, _price)
                .estimateGas({
                    from: rootState.app.account,
                })
                .then((gas) => {
                    state.token.methods
                        .auctionEnd(_bundleId, _auctionUser, _price)
                        .send({
                            from: rootState.app.account,
                            gas: parseInt(gas * 1.2),
                            value: rootState.app.web3.utils.toWei(value.toString()),
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
    borrow({ rootState }, { _bundleId, _amount }) {
        console.log({ _bundleId, _amount });
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .borrow(_bundleId, _amount)
                .estimateGas({
                    from: rootState.app.account,
                })
                .then((gas) => {
                    state.token.methods
                        .borrow(_bundleId, _amount)
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
    bundles({ rootState }, { param0 }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .bundles(param0)
                .call()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    compensationRatio({ rootState }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .compensationRatio()
                .call()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    deposit({ rootState }, { value, _underlying, _amount }) {
        console.log(_underlying);
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .deposit(_underlying, _amount)
                .estimateGas({
                    from: rootState.app.account,
                    value,
                })
                .then((gas) => {
                    state.token.methods
                        .deposit(_underlying, _amount)
                        .send({
                            from: rootState.app.account,
                            gas: parseInt(gas * 1.2),
                            value,
                        })
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            console.log(err);
                            reject(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
        });
    },
    feeRatio({ rootState }, { param0 }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .feeRatio(param0)
                .call()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    getAum({ rootState }, { _underlying }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .getAum(_underlying)
                .call()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    initialize({ rootState }, { _owner, _stakeProof, _auction, _stake, _rewardPools }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .initialize(_owner, _stakeProof, _auction, _stake, _rewardPools)
                .estimateGas({
                    from: rootState.app.account,
                })
                .then((gas) => {
                    state.token.methods
                        .initialize(_owner, _stakeProof, _auction, _stake, _rewardPools)
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
    interestPerShare({ rootState }, { _underlying }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .interestPerShare(_underlying)
                .call()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    liquidate({ rootState }, { _bundleId }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .liquidate(_bundleId)
                .estimateGas({
                    from: rootState.app.account,
                })
                .then((gas) => {
                    state.token.methods
                        .liquidate(_bundleId)
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
    newBundle({ rootState }, { _user, _underlying, _amount, _nftCount }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .newBundle(_user, _underlying, _amount, _nftCount)
                .estimateGas({
                    from: rootState.app.account,
                })
                .then((gas) => {
                    state.token.methods
                        .newBundle(_user, _underlying, _amount, _nftCount)
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
    owner({ rootState }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .owner()
                .call()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    pools({ rootState }, { param0 }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .pools(param0)
                .call()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    redeem({ rootState }, { value, _bundleId, _user }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .redeem(_bundleId, _user)
                .estimateGas({
                    from: rootState.app.account,
                })
                .then((gas) => {
                    state.token.methods
                        .redeem(_bundleId, _user)
                        .send({
                            from: rootState.app.account,
                            gas: parseInt(gas * 1.2),
                            value: rootState.app.web3.utils.toWei(value.toString()),
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
    reply({ rootState }, { _bundleId, value, _amount }) {
        console.log('reply',{ _bundleId, value, _amount });
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .reply(_bundleId, _amount)
                .estimateGas({
                    from: rootState.app.account,
                    value: value,
                })
                .then((gas) => {
                    state.token.methods
                        .reply(_bundleId, _amount)
                        .send({
                            from: rootState.app.account,
                            gas: parseInt(gas * 1.2),
                            value: value,
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
    setPool({ rootState }, { _underlying, _allow, _borrowAPY, _occupancyFactor }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .setPool(_underlying, _allow, _borrowAPY, _occupancyFactor)
                .estimateGas({
                    from: rootState.app.account,
                })
                .then((gas) => {
                    state.token.methods
                        .setPool(_underlying, _allow, _borrowAPY, _occupancyFactor)
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
    setPoolDepositeToken({ rootState }, { _underlying, _depositToken }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .setPoolDepositeToken(_underlying, _depositToken)
                .estimateGas({
                    from: rootState.app.account,
                })
                .then((gas) => {
                    state.token.methods
                        .setPoolDepositeToken(_underlying, _depositToken)
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
    stakeProof({ rootState }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .stakeProof()
                .call()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    transferOwnership({ rootState }, { newOwner }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .transferOwnership(newOwner)
                .estimateGas({
                    from: rootState.app.account,
                })
                .then((gas) => {
                    state.token.methods
                        .transferOwnership(newOwner)
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
    updateBlock({ rootState }, { _time }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .updateBlock(_time)
                .estimateGas({
                    from: rootState.app.account,
                })
                .then((gas) => {
                    state.token.methods
                        .updateBlock(_time)
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
    userLoan({ rootState }, { _bundleId }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .userLoan(_bundleId)
                .call()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    withdraw({ rootState }, { _underlying, _share }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .withdraw(_underlying, _share)
                .estimateGas({
                    from: rootState.app.account,
                })
                .then((gas) => {
                    state.token.methods
                        .withdraw(_underlying, _share)
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
    withdrawPlatformFee({ rootState }, { _underlying, _to, _amount }) {
        judgeToken(rootState);
        return new Promise((resolve, reject) => {
            state.token.methods
                .withdrawPlatformFee(_underlying, _to, _amount)
                .estimateGas({
                    from: rootState.app.account,
                })
                .then((gas) => {
                    state.token.methods
                        .withdrawPlatformFee(_underlying, _to, _amount)
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

