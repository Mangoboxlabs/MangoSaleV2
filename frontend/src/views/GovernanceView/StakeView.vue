<template>
  <div class="StakeView">
    <div class="title">
      Stake TBC
    </div>
    <div class="info">
      Stake TBC to Receive Rewards
      <span v-if="tbcStaking.incr>0"> & Increase Credit Value</span>
    </div>
    <div class="add-coin" @click="addToken">
      Add TBC to MateMask
    </div>
    <div class="tabs-box">
      <div class="tabs">
        <div class="tab" :class="{'active':activeNav1==0}" @click="activeNav1=0">
          Stake
        </div>
        <div class="tab" :class="{'active':activeNav1==1}" @click="activeNav1=1">
          Position
        </div>
        <span class="glider" :style="`transform:translateX(${activeNav1*130}px)`"></span>

      </div>

    </div>

    <div class="stake-box" v-show="activeNav1==0">

      <div class="stake-option" v-for="(item, index) in productList" :key="index"
           :class="{'active':product_id==item.product_id}" @click="product_id=item.product_id">
        <div class="stake-option-header">
          <div class="left">
            <div class="name">
              {{ item.name }}
              <img src="../../assets/svg/down.svg" alt="" class="icon">
            </div>
          </div>
          <div class="right">
            APY
            <Tooltip placement="top">
              <template #title>
              <span>
                APY based on yesterday's number of Staking.
              </span>
              </template>
              <img src="@/assets/images/tip_icon.webp" alt="" class="icon">
            </Tooltip>
            <strong> {{ item.apy }}%</strong>
          </div>
        </div>
        <div class="stake-option-content" v-show="product_id==item.product_id">
          <div class="left">
            Pool Size
          </div>
          <div class="right">
            {{ showNumber(item.balance) }}
          </div>
        </div>
      </div>
      <div class="stake-content-box">
        <div class="input-box-header">
          <div class="left">
            <div class="name">
              Stake
            </div>
          </div>
          <div class="right">
            <span class="">
              Balance:
            </span>
            <img src="../../assets/images/coin-logo.webp" alt="" class="icon">
            <div class="balance">
              {{ dealNum(tbcBalance) }}
            </div>
          </div>
        </div>
        <div class="input-box">
          <input type="number" step="any" v-model="amount">
          <div class="right-tip">
            <div class="primary-btn max-btn" @click="setMax">
              Max
            </div>
            <div class="line"></div>
            <img src="../../assets/images/coin-logo.webp" alt="" class="icon">
            <div class="name">
              TBC
            </div>
          </div>
        </div>
        <div class="automatic" @click="autoReinvestment=!autoReinvestment">
          <div class="check-box">
            <div class="checked" v-show="autoReinvestment"></div>
          </div>
          Automatic Reinvestment
          <Tooltip placement="top">
            <template #title>
              <span>
                Once the current staking period ends, your principals and rewards will be reinvested
                in the next circle of the staking period automatically.
              </span>
            </template>
            <img src="@/assets/images/tip_icon.webp" alt="" class="tip-icon">
          </Tooltip>
        </div>
        <a-button
            class="primary-btn-sha"
            v-if="amount === undefined || amount === '' || amount === null || amount == 0"
            disabled="disabled">
          Enter an amount
        </a-button>
        <a-button class="primary-btn-sha" disabled="disabled"
                  v-else-if="amount > parseFloat(BigNumber(tbcBalance).toFixed(4))">
          Insufficient TBC Balance
        </a-button>
        <a-button
            class="primary-btn-sha"
            v-else-if="amount < 1" disabled="disabled">
          {{ less1 }}
        </a-button>
        <a-button v-else class="primary-btn-sha" @click="stake" :loading="isLoading">
          <span style="margin-right: 6px"
                v-if="isApprove">Approve & </span>
          Stake
        </a-button>
        <div class="tip" v-if="tbcStaking.incr>0 && !tbcStaking.status">
          Stake {{ dealNum(tbcStaking.min) }} TBC users to enjoy an additional {{ dealNum(tbcStaking.incr * 100) }}%
          borrowing limit.
        </div>
        <div class="bottom-info">
          <div class="name">
            Maturity Date (UTC)
          </div>
          <div class="value">
            {{ formatTime(addDay(product_id)) }}
          </div>
        </div>
      </div>
    </div>
    <div class="position-box" v-show="activeNav1==1">
      <div class="position-info">
        <div class="info-item">
          <div class="name">
            Balance
          </div>
          <div class="value">
            {{ dealNum(positionsExtra.balance) }} TBC
          </div>
        </div>
        <div class="flex-box">
          <div class="info-item">
            <div class="name">
              Accumulated Rewards
            </div>
            <div class="value">
              {{ dealNum(positionsExtra.rewards) }} TBC
            </div>
          </div>
          <div class="info-item">
            <div class="name">
              Latest Rewards
            </div>
            <div class="value">
              {{ dealNum(positionsExtra.last_rewards) }} TBC
            </div>
          </div>
        </div>
      </div>

      <TBCMaturedPosition @click="activeStake=1" :activeStake="activeStake"/>
      <TBCStakePostion @click="activeStake=2" :activeStake="activeStake"/>
      <TBCHistory :activeStake="activeStake" @click="activeStake=3"/>
    </div>


  </div>
</template>

<script>
import {message, Tooltip} from "ant-design-vue";
import {mapGetters} from "vuex";
import addressMap from "@/abi/addressMap";
import BigNumber from "bignumber.js";
import bigNumberUtil from "@/utils/bigNumberUtil";
import {formatTime} from "../../utils/timeUtil";

const now = parseInt(new Date().valueOf() / 1000);
import {MaxUint256, TBCUrl} from "@/config/constants";
import {confirmTransaction} from "@/api/common";
import TBCMaturedPosition from "@/views/GovernanceView/components/TBCMaturedPosition";
import TBCHistory from "@/views/GovernanceView/components/TBCHistory";
import TBCStakePostion from "@/views/GovernanceView/components/TBCStakePostion";

const calculator = new bigNumberUtil();
export default {
  name: "StakeView",
  components: {Tooltip, TBCMaturedPosition, TBCHistory, TBCStakePostion},
  data() {
    return {
      dealNum: calculator.dealNum,
      onGettingData: false,
      amount: undefined,
      activeStake: 1,
      less1: 'Amount < 1',
      activeNav1: 0,
      product_id: 1,
      isSelectAll: false,
      isLoading: false,
      total: 2,
      total2: 2,
      stakeList: [{day: 10}, {day: 90}, {day: 90}],
      stakingTotal: 0,
      autoReinvestment: false,
      tbcAllowance: 0
    };
  },
  computed: {
    ...mapGetters(["account", "web3", "isConnected", "chainId", "usdtDecimal"]),
    tbcBalance() {
      return this.$store.state.TBCStake.tbcBalance;
    },
    isApprove() {
      return BigNumber(this.tbcAllowance).lt(!this.amount * BigNumber(10).pow(this.tbcDecimals) ? 1 : this.amount * BigNumber(10).pow(this.tbcDecimals));
    },
    tbcStaking() {
      return this.$store.state.app.tbcStaking;
    },
    productList() {
      return this.$store.state.TBCStake.productList;
    },
    tbcDecimals() {
      return this.$store.state.TBCStake.tbcDecimals;
    },
    positionsList() {
      return this.$store.state.TBCStake.positionsList;
    },
    positionsExtra() {
      return this.$store.state.TBCStake.positionsExtra;
    },
  },
  watch: {
    isConnected() {
      this.getData();
    },
    chainId() {
      this.getData();
    },
    account() {
      this.getData();
    }
  },
  created() {
    this.getData();
  },
  methods: {
    BigNumber,
    formatTime,
    diffDay(timestamp) {
      return Math.ceil((now - timestamp) / 86400);
    },
    addDay(product_id) {
      let index = this.productList.findIndex((item) => item.product_id == product_id);
      if (index == -1) {
        return '-';
      }
      let day = this.productList[index]['day'];
      return (now + day * 86400 + 86400) * 1000;
    },
    showNumber(number) {
      number = BigNumber(number);
      if (number.isNaN()) {
        return '0';
      }
      return BigNumber(number.toFixed(3)).toString();
    },
    setMax() {
      this.amount = BigNumber(this.tbcBalance).toFixed(3, BigNumber.ROUND_DOWN);
    },
    async addToken() {
      try {

        await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: addressMap[this.chainId]["tbc"],
              symbol: "TBC",
              decimals: this.tbcDecimals,
              image: TBCUrl,
            },
          },
        });
        console.log('add success');
      } catch (error) {
        console.error('add fail:', error);
      }
    },
    async getTBCBalance() {
      const decimals = await this.$store.dispatch("erc20/decimals", {
        address: addressMap[this.chainId]["tbc"]
      });
      const balance = await this.$store.dispatch("erc20/balanceOf", {
        address: addressMap[this.chainId]["tbc"],
        account: this.account
      });
      this.$store.commit("TBCStake/SET_TBCBalance", calculator.divide(balance, BigNumber(10).pow(decimals)));
    },
    async getData() {
      if (!this.isConnected) {
        return;
      }
      this.$store.dispatch("TBCStake/getStakeProductList");
      this.$store.dispatch("TBCStake/getStakePositions");


      this.getTBCBalance();
      this.allowance();


    },
    async allowance() {
      if (this.isConnected) {
        let res = await this.$store.dispatch("erc20/allowance", {
          owner: this.account,
          spender: addressMap[this.chainId]["TBCStake"],
          address: addressMap[this.chainId]["tbc"]
        });
        this.tbcAllowance = res;
      }
    },
    async approve() {
      if (this.isLoading) {
        return;
      }
      if (this.isConnected) {
        try {
          this.isLoading = true;
          const isS = await this.$store.dispatch("erc20/approve", {
            spender: addressMap[this.chainId]["TBCStake"],
            amount: MaxUint256,
            address: addressMap[this.chainId]["tbc"]
          }).then(() => {
            this.allowance();
            this.isLoading = false;
            return true;
          }).catch(e => {
            this.isLoading = false;
            console.log(e);
            return false;
          });
          return isS;
        } catch (e) {
          console.log(e);
          this.isLoading = false;
        }
      }
    },
    async stake() {
      if (this.isLoading) {
        return;
      }

      let decimal = await this.$store.dispatch("erc20/decimals", {address: addressMap[this.chainId]["tbc"]});
      let amount = BigNumber(this.amount);
      if (!this.account) {
        message.error('Please connect the wallet first');
        return;
      }
      if (!this.isConnected) {
        message.error('Wrong network');
        return;
      }
      if (amount.isNaN() || amount.lte(0)) {
        message.error('Enter a amount');
        return;
      }

      amount = amount.multipliedBy(BigNumber(10).pow(decimal)).toFixed(0);
      if (this.isApprove) {
        const isS = await this.approve();
        if (!isS) {
          return;
        }
      }
      this.isLoading = true;

      this.$store.dispatch("TBCStake/stake", {
        amount: BigNumber(calculator.multiply(this.amount, BigNumber(10).pow(decimal))).toFixed(0),
        productId: this.product_id,
        autoReinvestment: this.autoReinvestment
      }).then(async tx => {
        this.$store.dispatch('app/getETHBalance');
        try {
          await confirmTransaction(tx.transactionHash);
          await this.getData();
          message.success('Deposit Success');
          this.$store.dispatch("app/getPersonInfo");
        } catch (err) {
          await this.getData();
        }
        this.isLoading = false;
      }).catch(e => {
        this.dealCatchErr(e);
      });
    },
    dealCatchErr(e) {
      this.isLoading = false;
      if (e.code === 4001) {
        message.error('User canceled  transaction');
        return;
      }
      if (e.message && e.message.indexOf("{") < 0) {
        message.error(e.message);
      } else {
        const err = JSON.parse(e.message.substr(e.message.indexOf("{"), e.message.length));
        this.isLoading = false;
        if (err.originalError) {
          message.error(err.originalError.message);
        } else {
          message.error(e.message.substr(0, e.message.indexOf("{")));
        }

      }

    },

  },

};
</script>

<style lang="scss" scoped>
.StakeView {
  display: flex;
  flex-direction: column;
  align-items: center;
  .tabs-box {
    margin: 30px 0 20px 0px;
    .tabs {
      display: flex;
      position: relative;
      user-select: none;
      background: #E2E2E2;
      border-radius: 99px;
    }

    .tabs * {
      z-index: 2;
    }

    .tab {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 130px;
      height: 50px;
      font-weight: 500;
      border-radius: 99px;
      cursor: pointer;
      font-size: 16px;

      &.active {
        color: #111;
        background: none;
      }

      &:hover {
        color: #333333;
        background-color: #FFAB00;
        opacity: 0.7;
      }
    }

    .glider {
      position: absolute;
      display: flex;
      width: 130px;
      height: 50px;

      background: linear-gradient(225deg, #ffab00 0%, #ffc600 100%);
      z-index: 1;
      border-radius: 99px;
      transition: 0.25s ease-out;
    }
  }
  .title {
    font-size: 30px;
    font-family: Roboto-SemiBold, Roboto;
    font-weight: 600;
    color: #000000;
  }

  .add-coin {
    width: 200px;
    height: 32px;
    background: linear-gradient(225deg, rgba(#FFAB00, 0.3) 0%, rgba(#FFC600, 0.3) 100%);
    border-radius: 30px 30px 30px 30px;
    text-align: center;
    border: 1px solid #FFAD01;
    margin-top: 20px;
    font-size: 14px;
    font-family: Roboto-Medium, Roboto;
    font-weight: 500;
    color: #FFAD01;
    line-height: 32px;
    cursor: pointer;
    user-select: none;
  }

  .stake-box {
    .stake-option {
      margin-bottom: 10px;
      overflow: hidden;
      background: #FFFFFF;
      box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.1);
      border-radius: 20px 20px 20px 20px;
      padding: 20px 30px;
      width: 544px;
      transition: 0.3s;
      height: 80px;
      cursor: pointer;

      .stake-option-header {
        text-transform: capitalize;
      }

      &.active {
        cursor: default;
        height: 130px;
        border: 1px solid #FFAD01;

        .stake-option-header {
          .left {
            .icon {
              transform: rotate(180deg);
              transition: 0.3s;
            }
          }
        }
      }

      .stake-option-header {
        display: flex;
        justify-content: space-between;

        .left {
          .name {
            font-size: 18px;
            font-family: Roboto-Black, Roboto;
            font-weight: 900;
            color: #000000;

            .icon {
              margin-left: 6px;
              width: 10px;
              height: 10px;
            }
          }
        }

        .right {
          display: flex;
          font-size: 14px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #000000;
          align-items: center;

          .icon {
            height: 10px;
            width: 10px;
            margin: 0 10px 0 3px;
            opacity: 1;
          }

          strong {
            font-size: 16px;
          }
        }
      }

      .stake-option-content {
        display: flex;
        justify-content: space-between;
        margin-top: 30px;

        .left {
          font-size: 14px;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #999999;
        }

        .right {
          font-size: 14px;
          font-family: Roboto-Black, Roboto;
          font-weight: 900;
          color: #333333;
        }
      }
    }

    .stake-content-box {
      padding: 30px;
      width: 544px;
      background: #FFFFFF;
      box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.05);
      border-radius: 20px 20px 20px 20px;
      opacity: 1;
      border: 1px solid #E2E2E2;

      .input-box-header {
        display: flex;
        justify-content: space-between;

        .left {
          .name {
            font-size: 20px;
            font-family: Roboto-Black, Roboto;
            font-weight: 900;
            color: #000000;
          }
        }

        .right {
          display: flex;
          align-items: center;
          font-size: 14px;
          font-family: Roboto-Black, Roboto;
          font-weight: 900;
          color: #333333;

          .icon {
            width: 20px;
            height: 20px;
            margin-right: 6px;
            opacity: 1;
          }

          span {
            font-size: 14px;
            font-weight: 500;
            color: #999999;
            margin-right: 20px;
            font-weight: 500;
          }

        }
      }

      .input-box {
        width: 100%;
        height: 50px;
        margin-top: 20px;
        background: #F1F1F1;
        border-radius: 50px 50px 50px 50px;
        position: relative;

        input {
          background: none;
          padding: 0 20px;
          height: 100%;
        }

        .right-tip {
          position: absolute;
          right: 10px;
          top: 0;
          display: flex;
          align-items: center;
          height: 50px;
          font-size: 14px;
          font-family: Roboto-Black, Roboto;
          font-weight: 900;
          color: #333333;

          .icon {
            width: 20px;
            height: 20px;
            margin-right: 6px;
            opacity: 1;
          }

          .max-btn {
            height: 32px;
            font-size: 14px;
            font-family: Roboto-Bold, Roboto;
            font-weight: bold;
            color: #613A00;
          }

          .line {
            height: 30px;
            width: 1px;
            background: #DADADA;
            margin: 0 10px 0 10px;
          }
        }

      }

      .automatic {
        display: flex;
        margin: 30px 0;
        user-select: none;
        font-size: 16px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #333333;
        align-items: center;

        .tip-icon {

          margin-left: 5px;
        }


      }

      .primary-btn-sha {
        height: 50px;
        width: 100%;
        font-family: RussoOneRegular, Russo One;
      }

      .tip {
        margin-top: 30px;
        opacity: 0.7;
      }

      .bottom-info {
        display: flex;
        margin-top: 20px;
        justify-content: space-between;

        .value {
          font-size: 16px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #333333;
        }

        .name {

          font-size: 16px;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #999999;
        }
      }
    }
  }

  .info {
    font-size: 16px;
    font-family: Roboto-SemiBold, Roboto;
    font-weight: 600;
    color: #000000;
    margin-top: 20px;
  }

  .nav-list {
    width: 300px;
    height: 60px;
    background: #E2E2E2;
    border-radius: 50px 50px 50px 50px;
    display: flex;
    margin: 40px 0 30px;

    .nav-item {
      width: 150px;
      height: 60px;
      cursor: pointer;
      text-align: center;
      line-height: 60px;
      border-radius: 30px 30px 30px 30px;
      font-size: 16px;
      font-family: Roboto-Bold, Roboto;
      font-weight: bold;
      color: #613A00;

      &.active {
        background: linear-gradient(225deg, #FFAB00 0%, #FFC600 100%);
      }
    }
  }

  .position-box {
    .position-info {
      width: 544px;
      padding: 20px 40px;
      background: #FFFFFF;
      box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.1);
      border-radius: 20px 20px 20px 20px;
      opacity: 1;
      border: 1px solid #E2E2E2;

      .info-item {
        .name {
          font-size: 14px;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #999999;
        }

        .value {
          font-size: 14px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #000000;
          margin-top: 8px;
        }
      }

      .flex-box {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;

        .info-item {
          .value {
            color: #FFC001;
          }
        }
      }


    }

    .position-detail {
      width: 544px;
      cursor: pointer;
      background: #FFFFFF;
      box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.1);
      border-radius: 20px 20px 20px 20px;
      padding: 30px;
      border: 1px solid #E2E2E2;
      margin-top: 20px;
      transition: 0.3s;

      &.active {
        cursor: default;

        .position-detail-header {
          .left {
            .icon {
              transform: rotate(180deg);
              opacity: 1;
            }
          }
        }
      }

      .position-detail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;


        .left {
          display: flex;
          align-items: center;

          .title {
            font-size: 20px;
            font-family: Roboto-Black, Roboto;
            font-weight: 900;
            color: #000000;
          }

          .icon {
            margin-left: 6px;
            width: 20px;
          }
        }

        .right {
          cursor: pointer;
          display: flex;
          font-size: 16px;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #333333;
        }
      }

      .position-detail-part {
        border-radius: 15px 15px 15px 15px;
        border: 1px solid #D2D2D2;
        padding: 30px 20px;
        margin-top: 20px;
        transition: 0.3s;

        .position-detail-info {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;

          .info-item {
            width: 30%;
            margin-bottom: 20px;
            white-space: nowrap;

            .name {
              font-size: 14px;
              font-family: Roboto-Medium, Roboto;
              font-weight: 500;
              color: #999999;
            }

            .value {
              margin-top: 6px;
              font-size: 14px;
              font-family: Roboto-Bold, Roboto;
              font-weight: bold;
              color: #000000;
            }
          }
        }

        .operate-box {
          display: flex;
          justify-content: space-between;

          .primary-btn-sha {
            width: 48%;
            height: 50px;
            font-family: RussoOneRegular, Russo One;
          }
        }

        .automatic-bottom {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-family: Roboto-Bold, Roboto;
          color: #000000;
          border-top: 1px solid #D2D2D2;
          padding-top: 20px;

          .left {
            display: flex;
            align-items: center;
            font-weight: bold;

            .icon {
              width: 10px;
              height: 30px;
              margin-right: 6px;
            }
          }

          .right {
            display: flex;
            align-items: center;
            font-weight: 500;

            .switch {
              margin-left: 10px;
            }
          }
        }
      }

      .more-btn {
        margin: 20px auto;
        width: 100px;
        height: 30px;
        border-radius: 50px 50px 50px 50px;
        border: 1px solid #D2D2D2;
        font-size: 14px;
        text-align: center;
        font-family: Roboto-Medium, Roboto;
        cursor: pointer;
        line-height: 30px;
        font-weight: 500;
        color: #999999;
      }
    }


  }
}

@media screen and (max-width: 1000px) {
  .StakeView {
    .stake-box {
      width: 100%;

      .stake-option {
        width: 100%;
      }

      .stake-content-box {
        width: 100%;

        .input-box {
          .max-btn {
            font-size: 3.2vw;
          }
        }

        .automatic {
          font-size: 3.8vw;
        }

        .bottom-info {
          .name {
            font-size: 3.8vw;
          }

          .value {
            font-size: 4vw;
          }
        }
      }
    }

    .position-box {
      width: 100%;

      .position-info {
        width: 100%;

        .info-item {
          .name {
            font-size: 3.4vw;
          }

          .value {
            font-size: 3.8vw;
          }
        }
      }

      .position-detail {
        width: 100%;

        .position-detail-part {
          padding: 3vh 3vw;

          .position-detail-info {
            .info-item {
              .name {
                font-size: 3.2vw;
              }

              .value {
                font-size: 3.6vw;
              }
            }
          }

          .automatic-bottom {
            .left {
              font-size: 3.4vw;

              .icon {
                width: 20px;
                height: 20px;
              }
            }

            .right {
              font-size: 3.2vw;
            }
          }

        }
      }

    }
  }
}
</style>
