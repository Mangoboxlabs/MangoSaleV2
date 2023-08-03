import getContract from '@/abi/index.js';
import BigNumber from 'bignumber.js';
BigNumber.set({
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

function judgeToken(rootState, address) {
  state.token = getContract.getContractByToken('erc20', address, rootState.app.web3);
}

import addressMap from '@/abi/addressMap';

const state = {
  balace: 0,
  decimals: 6,
};
const mutations = {
  SET_Balance(state, amount) {
    state.balace = amount;
  },
  SET_Decimals(state, decimals) {
    state.decimals = decimals;
  },
};
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
            reject(JSON.parse(err.message.substr(24, err.message.length)).message);
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
                .then((res) => {
                  resolve(res);
                });
          })
          .catch((err) => {
            reject(JSON.parse(err.message.substr(24, err.message.length)).message);
          });
    });
  },
  async getMyBalance({ rootState, commit }) {
    judgeToken(rootState, addressMap[rootState.app.chainId].usdt);
    const res = await state.token.methods.balanceOf(rootState.app.account).call();
    commit('SET_Balance', BigNumber(res.toString()).div(state.decimals).toFixed(18));
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
  async getMyDecimals({ rootState, commit }) {
    judgeToken(rootState, addressMap[rootState.app.chainId].usdt);
    const res = await state.token.methods.decimals().call();
    commit('SET_Decimals', 10 ** res);
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
