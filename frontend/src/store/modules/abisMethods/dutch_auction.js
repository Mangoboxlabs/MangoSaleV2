/* eslint-disable */
import connectContract from "@/api/connectContract"
import {formatResult} from "@/utils/formatUtils"
import Accounts from "@/api/Account.js";
import {dealResult, reportErr} from "@/utils/dealResult";

const value = 0;
const queryGasLimit = -1;
const gasLimit = 3000n * 100000000n;
const storageDepositLimit = null;


async function judgeContract(web3) {
    if (!state.contract) {
        state.contract = await connectContract(web3, 'DutchAuction')
    }
}

const state = {
    contract: null
}
const mutations = {};
const actions = {
    async create({rootState}, info) {
        console.log(info)
        await judgeContract(rootState.app.web3)
        const injector = await Accounts.accountInjector();
        const AccountId = await Accounts.accountAddress();
        const timeMemory = new Date().getTime()
        window.messageBox.push(timeMemory)
        await state.contract.tx.create({storageDepositLimit, gasLimit},
            //params
            info
        ).signAndSend(AccountId, {signer: injector.signer}, result => {
            dealResult(result, rootState.app.web3, state.contract, "Create")

        }).catch(err=>{
            reportErr(err)
        });

    },
    async buy({rootState}, {id, amount}) {
        console.log(id,amount)
        await judgeContract(rootState.app.web3)
        const injector = await Accounts.accountInjector();
        const AccountId = await Accounts.accountAddress();
        const timeMemory = new Date().getTime()
        window.messageBox.push(timeMemory)
        await state.contract.tx.buy({storageDepositLimit, gasLimit},
            //params
            id, amount
        ).signAndSend(AccountId, {signer: injector.signer}, result => {
            dealResult(result, rootState.app.web3, state.contract, "Buy")

        }).catch(err=>{
            reportErr(err)
        });

    },
    async claim({rootState}, id) {
        await judgeContract(rootState.app.web3)
        const injector = await Accounts.accountInjector();
        const AccountId = await Accounts.accountAddress();
        const timeMemory = new Date().getTime()
        window.messageBox.push(timeMemory)
        await state.contract.tx.claim({storageDepositLimit, gasLimit},
            //params
            id
        ).signAndSend(AccountId, {signer: injector.signer}, result => {
            dealResult(result, rootState.app.web3, state.contract, "Claim")

        }).catch(err=>{
            reportErr(err)
        });

    },
    async getReward({rootState}, id) {
        await judgeContract(rootState.app.web3)
        const AccountId = await Accounts.accountAddress();
        let data = await state.contract.query.getReward(AccountId, {value, queryGasLimit}, id)
        data = formatResult(data);
        return data

    },
    async state({rootState}, id) {
        await judgeContract(rootState.app.web3)
        const AccountId = await Accounts.accountAddress();
        let data = await state.contract.query.state(AccountId, {value, queryGasLimit}, id)
        data = formatResult(data);
        return data

    },
    async getAllPresale({rootState}) {
        await judgeContract(rootState.app.web3)
        const AccountId = await Accounts.accountAddress();
        let data = await state.contract.query.getAllPresale(AccountId, {value, queryGasLimit},)
        data = formatResult(data);
        return data

    },
    async getUserPresale({rootState}) {
        await judgeContract(rootState.app.web3)
        const AccountId = await Accounts.accountAddress();
        let data = await state.contract.query.getUserPresale(AccountId, {value, queryGasLimit},)
        data = formatResult(data);
        return data

    },
    async getPresale({rootState}, id) {
        await judgeContract(rootState.app.web3)
        const AccountId = await Accounts.accountAddress();
        let data = await state.contract.query.getPresale(AccountId, {value, queryGasLimit}, id)
        data = formatResult(data);
        return data

    },
    async getPresaleCharge({rootState}, id) {
        await judgeContract(rootState.app.web3)
        const AccountId = await Accounts.accountAddress();
        let data = await state.contract.query.getPresaleCharge(AccountId, {value, queryGasLimit}, id)
        data = formatResult(data);
        return data

    },
}
export default {
    namespaced: true,
    mutations,
    state,
    actions
}
	