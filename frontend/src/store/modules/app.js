import {setStorage, getStorage} from "@/utils/storageUtils";
import {message} from "ant-design-vue";
import Web3 from "web3";
import getWeb3 from "@/utils/getWeb3";
import {getMainData} from "@/api/homeApi";
import {getPersonInfo} from "@/api/common";
import {ChainIdMapByAPIId, ChainIdMapByName} from "@/utils/constantData";
import {chainId1, WETHAddress} from "@/config/constants";

const ETHDECIMAL = 10 ** 18;
const state = {
    web3: null,
    account: "",
    onRightChain: false,
    isConnected: false,
    chainId: ChainIdMapByName["Sepolia"],
    curEmail: undefined,
    messageArr: getStorage("messageArr") || [],
    ethBalance: 0,
    onConnecting: false,
    tbcDecimal: 10 ** 18,

    tbcBalance: 0,
    usdtBalance: 0,
    isSign: getStorage("isSign") || false,
    collapsed: true,
    desireChainId: ChainIdMapByName["Sepolia"],
    currentTheme: getStorage("currentTheme") || "",
    homeData: {
        status: {
            eth: 0,
        },
        networks: [],
    },
    tbcStaking: {},
    onGettingData: false,
    unRead: 0
};


const mutations = {
    SET_THEME: (state, theme) => {
        state.currentTheme = theme;
        setStorage("currentTheme", theme);
    },

    SET_ONCONNECTING(state, val) {
        state.onConnecting = val;
    },
    SET_ISSIGN: (state, value) => {
        state.isSign = value;
        setStorage("isSign", value);
    },
    SET_ACCOUNT(state, account) {
        if (account) {
            account = Web3.utils.toChecksumAddress(account);
        }
        state.account = account;
    },
    SET_DesireChainId(state, val) {
        state.desireChainId = val;
    },
    SET_CurEmail(state, val) {
        state.curEmail = val;
    },
    SET_Messages(state, val) {
        state.messageArr = val;
        setStorage("messageArr", val);
    },

    SET_OnRightChain(state, val) {
        state.onRightChain = val;
    },
    SET_ISCONNECT(state, isConnect) {
        state.isConnected = isConnect;
    },
    SET_Web3(state, web3) {
        state.web3 = web3;
    },
    SET_Balance(state, amount) {
        state.ethBalance = amount / ETHDECIMAL;
    },

    SET_CHAINID: (state, chainId) => {
        state.chainId = chainId;
    },
    SET_DESIRE_CHAINID: (state, desireChainId) => {
        state.desireChainId = desireChainId;
    },
    SET_SIDEBAR(state, isCollapse) {
        state.collapsed = isCollapse;
    },
    SET_TBCStaking(state, val) {
        state.tbcStaking = val;
    },
    SET_HomeData(state, val) {
        state.homeData = val;
    },
    SET_UnRead(state, val) {
        state.unRead = val;
    },
    SET_ONGETTINGDATA(state, val) {
        state.onGettingData = val;
    },
};


const getters = {
    wrongNetWork(state) {
        return state.chainId !== state.desireChainId;
    },
};
const actions = {
    async getPersonInfo({state, commit}) {
        try {
            commit('SET_ONGETTINGDATA', true);
            const info = await getPersonInfo(state.account);
            commit('SET_CurEmail', info.data.data.email);
            commit('SET_Messages', info.data.data.messages);
            commit('SET_UnRead', info.data.data.un_read);
            commit('SET_ONGETTINGDATA', false);
            if (info.data.data.tbc_staking) {
                for (let key in info.data.data.tbc_staking) {
                    if (ChainIdMapByAPIId[state.chainId] == key) {
                        commit('SET_TBCStaking', info.data.data.tbc_staking[key]);

                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    },
    async getHomeData({commit}) {
        try {
            const res = await getMainData();
            commit("SET_HomeData", res.data.data);
        } catch (e) {
            console.log(e);
        }
    },
    async getETHBalance({state, dispatch, commit}, address = WETHAddress) {
        let res = 0;
        if (state.chainId == chainId1) {
            res = await state.web3.eth.getBalance(state.account);
        } else {
            res = await dispatch("erc20/balanceOf", {
                address,
                account: state.account
            }, {root: true});
        }

        commit("SET_Balance", res);
    },
    updateTheme({commit}, theme) {
        commit("SET_THEME", theme);
    },
    toggleSideBar({commit}, isCollapse) {
        commit("SET_SIDEBAR", isCollapse);
    },
    updateDesireChainId({commit}, chainId) {
        commit("SET_DESIRE_CHAINID", chainId);
    },
    updateChainId({commit}, chainId) {
        commit("SET_CHAINID", chainId);
    },
    async registerWeb3erWeb3({commit}) {
        // const provider = await detectEthereumProvider();
        const provider = window.ethereum;
        if (provider) {
            // From now on, this should always be true:
            // provider === window.ethereum
            try {
                if (window.ethereum) {
                    try {
                        await window.ethereum
                            .request({method: "eth_requestAccounts"})
                            .then(() => {
                            })
                            .catch((err) => {
                                console.log(err);
                                message.error(err.message);
                            });
                    } catch (error) {
                        console.error("MetaMask Account access is denied. Procedure:", error);
                    }
                }
            } catch (e) {
                console.log(e);
            }
            return new Promise((resolve) => {
                getWeb3(provider).then(async (result) => {
                    commit("app/SET_Web3", result.web3);
                    await window.ethereum.request({method: "eth_requestAccounts"}).then(async (accounts) => {
                        if (accounts && accounts.length > 0) {
                            commit("app/SET_ACCOUNT", accounts[0]);
                        }
                        let balance = await result.web3.eth.getBalance(accounts[0]);
                        commit("app/SET_Balance", balance);
                    });

                    try {
                        window.ethereum.on("accountsChanged", async (accounts) => {
                            if (accounts && accounts.length > 0) {
                                let balance = await result.web3.eth.getBalance(accounts[0]);
                                commit("app/SET_Balance", balance);
                            }
                        });
                        window.ethereum.on("chainChanged", async () => {
                            let balance = await result.web3.eth.getBalance(this.account);
                            commit("app/SET_Balance", balance);

                            let chainId = await window.ethereum.request({method: "eth_chainId"});
                            commit("app/SET_CHAINID", chainId);
                        });
                    } catch (e) {
                        message.info(e);
                    }

                    try {
                        let chainId = await window.ethereum.request({method: "eth_chainId"});
                        commit("app/SET_CHAINID", chainId);
                        if ((chainId == this.desireChainId || chainId == this.desireChainId2) && this.account) {
                            commit("app/SET_ISCONNECT", true);
                        }
                        if (!(chainId == this.desireChainId || chainId == this.desireChainId2)) {
                            message.error("Please choose right chain");
                        }
                    } catch (e) {
                        this.isWalletModal = false;
                    }

                    if (this.account && !this.wrongNetWork && !this.isSign) {
                        this.showSign = true;
                    }
                    resolve(result);
                });
            }).catch((err) => {
                message.error(err);
            });
        } else {
            message.info("Install MetaMask first!");
        }
    },
};
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
