import getContract from "@/abi/index.js";

function judgeToken(rootState) {
    if (!state.token) state.token = getContract.getContractByName('stakingProof', rootState.app.web3)
}

const state = {};
const mutations = {};
const actions = {
    approve({rootState}, {to, tokenId}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.approve(to, tokenId).estimateGas({
                from: rootState.app.account,
            }).then(gas => {
                state.token.methods.approve(to, tokenId).send({
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
    balanceOf({rootState}, {owner}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.balanceOf(owner).call().then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    burn({rootState}, {_tokenId}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.burn(_tokenId).estimateGas({
                from: rootState.app.account,
            }).then(gas => {
                state.token.methods.burn(_tokenId).send({
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
    buy({rootState}, {value, _tokenId, _redemption}) {
        console.log({value, _tokenId, _redemption})
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.buy(_tokenId, _redemption).estimateGas({
                from: rootState.app.account,
                value
            }).then(gas => {
                state.token.methods.buy(_tokenId, _redemption).send({
                    from: rootState.app.account,
                    gas: parseInt(gas * 1.2),
                    value
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
    cancelList({rootState}, {_tokenId}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.cancelList(_tokenId).estimateGas({
                from: rootState.app.account,
            }).then(gas => {
                state.token.methods.cancelList(_tokenId).send({
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
    getApproved({rootState}, {tokenId}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.getApproved(tokenId).call().then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    isApprovedForAll({rootState}, {owner, operator}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.isApprovedForAll(owner, operator).call().then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    isListing({rootState}, {_tokenId}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.isListing(_tokenId).call().then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    list({rootState}, {_tokenId, _price}) {
        console.log(_tokenId, _price)
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.list(_tokenId, _price).estimateGas({
                from: rootState.app.account,
            }).then(gas => {
                state.token.methods.list(_tokenId, _price).send({
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
    lists({rootState}, {param0}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.lists(param0).call().then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    mint({rootState}, {_to, _tokenId}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.mint(_to, _tokenId).estimateGas({
                from: rootState.app.account,
            }).then(gas => {
                state.token.methods.mint(_to, _tokenId).send({
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
    name({rootState}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.name().call().then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    ownerOf({rootState}, {tokenId}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.ownerOf(tokenId).call().then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    safeTransferFrom({rootState}, {from, to, tokenId}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.safeTransferFrom(from, to, tokenId).estimateGas({
                from: rootState.app.account,
            }).then(gas => {
                state.token.methods.safeTransferFrom(from, to, tokenId).send({
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
    setApprovalForAll({rootState}, {operator, approved}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.setApprovalForAll(operator, approved).estimateGas({
                from: rootState.app.account,
            }).then(gas => {
                state.token.methods.setApprovalForAll(operator, approved).send({
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
    supportsInterface({rootState}, {interfaceId}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.supportsInterface(interfaceId).call().then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    symbol({rootState}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.symbol().call().then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    tokenURI({rootState}, {tokenId}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.tokenURI(tokenId).call().then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    transferFrom({rootState}, {from, to, tokenId}) {
        judgeToken(rootState)
        return new Promise((resolve, reject) => {
            state.token.methods.transferFrom(from, to, tokenId).estimateGas({
                from: rootState.app.account,
            }).then(gas => {
                state.token.methods.transferFrom(from, to, tokenId).send({
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
