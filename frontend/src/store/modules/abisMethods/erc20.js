import getContract from '@/abi/index.js';

function judgeToken(rootState, address) {
  state.token = getContract.getContractByToken('erc20', address, rootState.app.web3);
}

const state = {};
const mutations = {};
const actions = {
  allowance({ rootState }, { owner, address, spender }) {
    judgeToken(rootState, address);
    return new Promise((resolve, reject) => {
      state.token.methods
        .allowance(owner, spender)
        .call()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  approve({ rootState }, { spender, address, amount }) {
    judgeToken(rootState, address);
    return new Promise((resolve, reject) => {
      state.token.methods
        .approve(spender, amount)
        .estimateGas({
          from: rootState.app.account,
        })
        .then((gas) => {
          state.token.methods
            .approve(spender, amount)
            .send({
              from: rootState.app.account,
              gas: parseInt(gas * 1.2),
            })
            .then((tx) => {
              let loop = 1;
              let internalId = setInterval(() => {
                let receipt = rootState.app.web3.eth.getTransactionReceipt(tx.transactionHash);
                if (loop++ > 600) {
                  clearInterval(internalId);
                  reject(tx);
                  return;
                }
                if (!receipt) {
                  return;
                }
                clearInterval(internalId);
                if (receipt.status == 0) {
                  reject(tx);
                } else {
                  resolve(tx);
                }
              }, 1000);
            }).catch((err) => {
            reject(err);
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  balanceOf({ rootState }, { account, address }) {
    judgeToken(rootState, address);
    return new Promise((resolve, reject) => {
      state.token.methods
        .balanceOf(account)
        .call()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(JSON.parse(err.message.substr(24, err.message.length)).message);
        });
    });
  },
  decimals({ rootState }, { address }) {
    judgeToken(rootState, address);
    return new Promise((resolve, reject) => {
      state.token.methods
        .decimals()
        .call()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(JSON.parse(err.message.substr(24, err.message.length)).message);
        });
    });
  },
  decreaseAllowance({ rootState }, { spender, subtractedValue }) {
    judgeToken(rootState);
    return new Promise((resolve, reject) => {
      state.token.methods
        .decreaseAllowance(spender, subtractedValue)
        .estimateGas({
          from: rootState.app.account,
        })
        .then((gas) => {
          state.token.methods
            .decreaseAllowance(spender, subtractedValue)
            .send({
              from: rootState.app.account,
              gas: parseInt(gas * 1.2),
            })
            .then((res) => {
              resolve(res);
            });
        })
        .catch((err) => {
          reject(JSON.parse(err.message.substr(24, err.message.length)).message);
        });
    });
  },
  increaseAllowance({ rootState }, { spender, addedValue }) {
    judgeToken(rootState);
    return new Promise((resolve, reject) => {
      state.token.methods
        .increaseAllowance(spender, addedValue)
        .estimateGas({
          from: rootState.app.account,
        })
        .then((gas) => {
          state.token.methods
            .increaseAllowance(spender, addedValue)
            .send({
              from: rootState.app.account,
              gas: parseInt(gas * 1.2),
            })
            .then((res) => {
              resolve(res);
            });
        })
        .catch((err) => {
          reject(JSON.parse(err.message.substr(24, err.message.length)).message);
        });
    });
  },
  name({ rootState }) {
    judgeToken(rootState);
    return new Promise((resolve, reject) => {
      state.token.methods
        .name()
        .call()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(JSON.parse(err.message.substr(24, err.message.length)).message);
        });
    });
  },
  symbol({ rootState }) {
    judgeToken(rootState);
    return new Promise((resolve, reject) => {
      state.token.methods
        .symbol()
        .call()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(JSON.parse(err.message.substr(24, err.message.length)).message);
        });
    });
  },
  totalSupply({ rootState }) {
    judgeToken(rootState);
    return new Promise((resolve, reject) => {
      state.token.methods
        .totalSupply()
        .call()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(JSON.parse(err.message.substr(24, err.message.length)).message);
        });
    });
  },
  transfer({ rootState }, { recipient, amount }) {
    judgeToken(rootState);
    return new Promise((resolve, reject) => {
      state.token.methods
        .transfer(recipient, amount)
        .estimateGas({
          from: rootState.app.account,
        })
        .then((gas) => {
          state.token.methods
            .transfer(recipient, amount)
            .send({
              from: rootState.app.account,
              gas: parseInt(gas * 1.2),
            })
            .then((res) => {
              resolve(res);
            });
        })
        .catch((err) => {
          reject(JSON.parse(err.message.substr(24, err.message.length)).message);
        });
    });
  },
  transferFrom({ rootState }, { sender, recipient, amount }) {
    judgeToken(rootState);
    return new Promise((resolve, reject) => {
      state.token.methods
        .transferFrom(sender, recipient, amount)
        .estimateGas({
          from: rootState.app.account,
        })
        .then((gas) => {
          state.token.methods
            .transferFrom(sender, recipient, amount)
            .send({
              from: rootState.app.account,
              gas: parseInt(gas * 1.2),
            })
            .then((res) => {
              resolve(res);
            });
        })
        .catch((err) => {
          reject(JSON.parse(err.message.substr(24, err.message.length)).message);
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
