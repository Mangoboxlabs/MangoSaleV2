<template>
  <div class="dialog-content">
    <div class="dialog-header">
      <div class="title">
        Borrow/Repay
      </div>
      <img src="../../../assets/svg/close.svg" alt="" class="close" @click="$emit('closeDialog')">
    </div>
    <div class="dialog-content-container">
      <div class="nav-list">
        <div class="nav-item" :class="{'active':activeIndex==1}" @click="activeIndex=1">
          Borrow
        </div>
        <div class="nav-item" :class="{'active':activeIndex==2}" @click="activeIndex=2">
          Repay
        </div>
      </div>
      <div class="nft-detail-box">
        <div class="part1" v-if="dataObj.nft.type=='Estate'">
          <div class="img-box">
            <img v-if="dataObj.nft" :src="dataObj.nft.image" alt="" class="icon">
          </div>
          <div class="part1-content">
            <div class="flex-box">
              <img v-if="dataObj.nft" class="logo" :src="require('@/assets'+dataObj.nft.logo)" alt="">
              <strong>{{ dataObj.identify }}</strong>
            </div>
            <div class="info-list">
              <div class="item" v-for="(attri,index) in dataObj.nft.attributes" :key="index">
                <div v-for="(value,key) in attri" :key="key">
                  <div class="name">
                    {{ key }}
                  </div>
                  <div class="value">
                    {{ value }}
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div class="primary-btn-sha" @click="openUrl">
            View map
          </div>
        </div>
        <div class="nft-list" v-if="dataObj.nft.type!='Estate'">
          <div class="nft-item" v-for="(nft,index) in nftList" :key="index">
            <div class="square">
              <img :src="nft.image" alt="" class="icon">
            </div>
            <div class="name">
              <strong v-if="nft.name">{{ nft.name }}</strong>
              <strong v-else>#{{ nft.token_id }}</strong>
            </div>
            <div class="type">
              {{ nft.project_name }}
            </div>
          </div>
        </div>
        <div class="part2" v-show="activeIndex===1">
          <div class="left-part">
            <div class="flex-box">
              <div class="name">
                Floor Price
              </div>
              <div class="value-box">
                <img class="icon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
                {{ dealNum(dataObj.staked_value) }}
              </div>
            </div>
            <div class="flex-box">
              <div class="name">
                Loan to Value
              </div>
              <div class="value-box">

                {{ dealNum(dataObj.max_borrow_rate * 100) }}%
                <span class="incr" v-if="tbcStaking.status && tbcStaking.incr>0"
                > + {{ dealNum(tbcStaking.incr * 100) }}%</span>

                <img style="margin-left: 10px" class="icon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
                <div v-if="tbcStaking.status && tbcStaking.incr>0">
                  {{ dealNum(dataObj.staked_value * calculator.add(dataObj.max_borrow_rate, tbcStaking.incr)) }}
                </div>
                <div v-else>{{ dealNum(dataObj.staked_value * dataObj.max_borrow_rate) }}</div>

              </div>
            </div>
            <div class="flex-box">
              <div class="name">
                Borrow APR
              </div>
              <div class="value-box">
                {{ dealNum(curBorrowAPY * 100) }}%
              </div>
            </div>


          </div>
          <div class="right-part">
            <div class="flex-box">
              <div class="name">
                Available Loan Limit
              </div>
              <div class="value-box available-time">
                <img class="icon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
                {{ dealNum(loanLimit) }}
              </div>
            </div>
            <div class="flex-box">
              <div class="name">
                Est. Loan Time Available
              </div>
              <div class="value-box available-time">
                <div class="time-box">
                  <div class="time-item">
                    {{ countdown.days }}d
                  </div>
                  <div class="time-item">
                    {{ countdown.hours }}h
                  </div>
                  <div class="time-item">
                    {{ countdown.minutes }}m
                  </div>
                  <div class="time-item">
                    {{ countdown.secs }}s
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div class="part2" v-show="activeIndex===2">
          <div class="left-part">
            <div class="flex-box">
              <div class="name">
                Floor Price
              </div>
              <div class="value-box">
                <img class="icon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
                {{ dealNum(dataObj.staked_value) }}
              </div>
            </div>

            <div class="flex-box healthy-box">
              <div class="name">
                Healthy Factor
                <Tooltip placement="top">
                  <template #title>
                    <span>NFTs will be liquidated When the liquidation factor is below 1</span>
                  </template>
                  <img src="../../../assets/images/tip_icon.webp" alt="" class="tip-icon">
                </Tooltip>
              </div>
              <div class="value">
                <div class="progress-box">
                  <div class="progress-content">
                    <div class="progress-part1"></div>
                    <div class="progress-part2"></div>
                    <div class="progress-part3"></div>
                  </div>
                  <div class="progress-cycle" :class="{'health': dataObj.health_index> 1.2 }"
                       :style="'left:' + (dataObj.health_index / 3) * 100 + '%'">
                    <strong>{{ dataObj.health_index }}</strong>
                  </div>
                  <div class="progress-line1"></div>
                  <div class="progress-line2"></div>
                </div>
              </div>
            </div>

          </div>
          <div class="right-part">
            <div class="flex-box">
              <div class="name">
                Available Loan Limit
              </div>
              <div class="value-box">
                <img class="icon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
                {{ dealNum(loanLimit) }}
              </div>
            </div>
            <div class="flex-box">
              <div class="name">
                Est. Loan Time Available
              </div>
              <div class="value-box available-time">
                <div class="time-box">
                  <div class="time-item">
                    {{ countdown.days }}d
                  </div>
                  <div class="time-item">
                    {{ countdown.hours }}h
                  </div>
                  <div class="time-item">
                    {{ countdown.minutes }}m
                  </div>
                  <div class="time-item">
                    {{ countdown.secs }}s
                  </div>
                </div>
              </div>
            </div>
            <div class="flex-box">
              <div class="name">
                Debt with Interest
              </div>
              <div class="value-box">
                {{ dealNum(dataObj.borrow_sum) }}
              </div>

            </div>
          </div>
        </div>
      </div>
      <div class="bottom-content">
        <div class="title">
          {{ activeIndex == 1 ? "Borrow" : "Repay" }} Amount
        </div>
        <div class="input-box">
          <input type="number" step="any" v-model="amount">
          <div class="right-tip">
            <div class="max-btn primary-btn" @click="setMax()">
              Max
            </div>
            <div class="line"></div>
            <img class="icon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
            {{ dataObj.underlying.name == "USD" ? USDByChainId[this.chainId] : dataObj.underlying.name }}
          </div>
        </div>
        <div class="operate-box">
          <a-button :loading="isLoading" class="primary-btn-sha" v-if="activeIndex==1" @click="borrow">
            Borrow
          </a-button>
          <template v-else>
            <a-button class="primary-btn-sha" v-if="!balanceIsEnough" disabled>
               Insufficient Balance
            </a-button>
            <a-button :loading="isLoading" class="primary-btn-sha" v-else
                      @click="reply">
            <span style="margin-right: 6px" v-if="!isApprove">Approve &
            </span>
              Repay
            </a-button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {message, Tooltip} from "ant-design-vue";
import bigNumberUtil from "@/utils/bigNumberUtil";
import {mapGetters} from "vuex";
import BigNumber from "bignumber.js";
import {MaxUint256} from "@/config/constants";

const calculator = new bigNumberUtil();
import {getTranStatus} from "@/api/common";
import {USDByChainId} from "@/utils/constantData";
import addressMap from "@/abi/addressMap";
import {ZeroAddress} from "@/config/constants";

BigNumber.set({
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});
export default {
  name: "BorrowDialog",
  components: {Tooltip},
  props: ["closeDialog", "dataObj", "availableLoanArr", "countdown"],

  data() {
    return {
      calculator,
      BigNumber,
      USDByChainId,
      dealNum: calculator.dealNum,
      activeIndex: 1,
      isLoading: false,
      amount: undefined,
      nftList: [],
      curBorrowAPY: 0,
      allowanceNum: 0,
      oldAmount: 0,
      oldBorrowSum: 0
    };
  },
  computed: {
    ...mapGetters([
      'isConnected',
      'account',
      'currentTheme',
      'web3',
      "usdtBalance",
      "ethBalance",
      'chainId'
    ]),
    tbcStaking() {
      return this.$store.state.app.tbcStaking;
    },
    balanceIsEnough() {
      if (!this.amount) {
        return true;
      }
      if (this.dataObj.underlying && this.dataObj.underlying.address === "0x0000000000000000000000000000000000000000") {
        return BigNumber(this.amount).lt(this.ethBalance);
      } else {
        return BigNumber(this.amount).lt(this.usdtBalance);
      }
    },
    isApprove() {
      if (this.dataObj.underlying && this.dataObj.underlying.address === "0x0000000000000000000000000000000000000000") {
        return true;
      }
      if (!this.amount) {
        return true;
      }
      return BigNumber(this.amount).lt(this.allowanceNum);
    },
    loanLimit() {
      let canBorrow = 0, result = 0;
      if (this.dataObj.underlying.address === "0x0000000000000000000000000000000000000000") {
        canBorrow = this.availableLoanArr[0];
      } else {
        canBorrow = this.availableLoanArr[1];
      }

      result = BigNumber(this.dataObj.available_borrow).lt(canBorrow) ?
          BigNumber(this.dataObj.available_borrow).toFixed(3) :
          BigNumber(canBorrow).toFixed(3);


      if (BigNumber(this.amount).isNaN()) {
        return result;
      }
      if (this.activeIndex === 2) {
        return calculator.add(BigNumber(result), this.amount);
      }
      return calculator.subtract(BigNumber(result), this.amount);
    },
    availableTime() {
      const lqApr = this.tokensData.liquidate_rate;
      let amount = 0;
      if (this.activeIndex == 1) { //borrow
        amount = this.amount;
      } else {
        amount = -this.amount;
      }
      if (this.amount == undefined || BigNumber(this.amount).isNaN()) {
        amount = 0;
      }
      amount = calculator.add(this.dataObj.borrow_sum, amount);
      if (BigNumber(amount).isNaN()) {
        return "0 Days 0 Hours";
      }
      const availAmount = calculator.subtract(calculator.multiply(this.dataObj.staked_value, lqApr), amount);
      let canBorrowYears = 0;

      this.tokensData.pools.forEach(item => {
        if (item.name == this.dataObj.underlying.name) {
          const onYearCost = amount * item.borrow_apy;
          canBorrowYears = calculator.divide(availAmount, onYearCost);

        }
      });

      if (!canBorrowYears || canBorrowYears <= 0) {
        return "0 Days 0 Hours";
      }
      const days = parseInt(canBorrowYears * 365).toFixed(0);
      const hours = (canBorrowYears * 365 - days) * 24;
      return days + " Days " + BigNumber(hours).toFixed(0) + " Hours";
    },

    tokensData() {
      return this.$store.state.stake.tokensData;
    },
  },

  async beforeCreate() {
    if (!this.dataObj.nft.type) {
      return;
    }
    try {
      this.nftList = await this.$store.dispatch("stake/getBundleTokensByID", this.dataObj.bundle_id);
    } catch (e) {
      console.log(e);
    }
    this.initData();
  },
  methods: {
    async getAllowance() {

      if (this.dataObj.underlying.address != ZeroAddress) {
        let result = await this.$store.dispatch('erc20/allowance', {
          owner: this.account,
          spender: addressMap[this.chainId]['vault'],
          address: this.dataObj.underlying.address,
        });
        this.allowanceNum = BigNumber(result.toString())
            .div(BigNumber(10).pow(6))
            .toFixed(18);
      } else {
        this.allowanceNum = MaxUint256;
      }
    },
    async initData() {
      if (!this.isConnected || !this.tokensData.pools) {
        return;
      }
      this.tokensData.pools.forEach(item => {
        const name = item.name;
        if (name === this.dataObj.underlying.name) {
          this.curBorrowAPY = item.borrow_apy;
        }
      });
      this.$store.dispatch('app/getETHBalance');
      this.$store.dispatch('usdt/getMyBalance');
      this.getAllowance();
    },

    openUrl() {
      window.open(this.dataObj.nft.link, "_blank");
    },
    async dealRes(transactionHash) {
      let statusRes = await getTranStatus(transactionHash);
      if (statusRes.data.data == 1) {
        setTimeout(() => {
          this.isLoading = false;
          if (calculator.subtract(this.oldBorrowSum, this.oldAmount) == 0) {
            this.$emit("closeDialog");
          }
          this.$emit("updateData");
          message.success("Transaction Success");

        }, 3000);
      } else {
        setTimeout(() => {
          this.dealRes(transactionHash);
        }, 3000);
      }
    },
    dealCatchErr(e) {
      this.isLoading = false;
      if (e.code == 4001) {
        message.error('User canceled  transaction');
        return;
      }
      if (e.message && e.message.indexOf("{") < 0) {
        message.error(e.message);
      } else {
        const err = JSON.parse(e.message.substr(e.message.indexOf("{"), e.message.length));
        if (err.originalError) {
          message.error(err.originalError.message);
        } else {
          message.error(e.message.substr(0, e.message.indexOf("{")));
        }
      }
    },
    setMax() {
      let canBorrow = 0;
      if (this.dataObj.underlying.address === "0x0000000000000000000000000000000000000000") {
        canBorrow = this.availableLoanArr[0];
      } else {
        canBorrow = this.availableLoanArr[1];
      }

      if (this.activeIndex === 1) {
        this.amount = BigNumber(this.dataObj.available_borrow).lt(canBorrow) ?
            BigNumber(this.dataObj.available_borrow).toFixed(3) :
            BigNumber(canBorrow).toFixed(3);

      } else {
        this.amount = BigNumber(this.dataObj.borrow_sum);
      }
    },
    borrow() {
      if (this.loanLimit < 0) {
        message.info("Over Available Loan Limit");
        return;
      }
      let decimals = BigNumber(10).pow(this.dataObj.underlying.decimals);
      if (this.dataObj.underlying.address === "0x0000000000000000000000000000000000000000") {
        decimals = 10 ** 18;
      }
      if (!decimals) {
        decimals = 10 ** 6;
      }
      if (!this.isConnected) {
        message.info("Please connect");
        return;
      }
      if (!this.amount || this.amount <= 0) {
        message.info("Please input amount");
        return;
      }
      try {
        this.isLoading = true;
        this.$store.dispatch("vault/borrow", {
          _bundleId: this.dataObj.bundle_id,
          _amount: BigNumber(calculator.multiply(this.amount, decimals)).toFixed(0)
        }).then(res => {
          this.dealRes(res.transactionHash);
        }).catch(e => {
          this.dealCatchErr(e);
        });
      } catch (e) {
        console.log(e);
      }
    },
    async reply() {
      let decimals = BigNumber(10).pow(this.dataObj.underlying.decimals), value = 0;
      if (!decimals) {
        decimals = 10 ** 6;
      }

      this.oldAmount = BigNumber(this.amount);
      this.oldBorrowSum = BigNumber(this.dataObj.borrow_sum);

      if (!this.isConnected) {
        message.info("Please connect");
        return;
      }
      if (!this.amount || this.amount <= 0) {
        message.info("Please input amount");
        return;
      }
      this.isLoading = true;

      if (!this.isApprove) {
        const isP = await this.$store.dispatch('erc20/approve', {
          spender: addressMap[this.chainId]['vault'],
          amount: MaxUint256,
          address: this.dataObj.underlying.address,
        }).then(() => {
          this.getAllowance();
          return true;
        }).catch(err => {
          this.dealCatchErr(err);
          return false;
        });
        if (!isP) {
          return;
        }
      }


      let amount = BigNumber(calculator.multiply(this.amount, decimals)).toFixed(0);
      if ((calculator.subtract(this.amount, this.dataObj.borrow_sum)) == 0 && this.dataObj.underlying.address != "0x0000000000000000000000000000000000000000") {
        amount = 0;
      }
      if (this.dataObj.underlying.address == "0x0000000000000000000000000000000000000000") {
        const apyAmount = calculator.multiply(calculator.multiply(amount, this.curBorrowAPY), 0.00137);
        amount = BigNumber(calculator.add(amount, apyAmount)).toFixed(0);
        value = BigNumber(amount).toFixed(0);
      }
      try {
        this.$store.dispatch("vault/reply", {
          _bundleId: this.dataObj.bundle_id,
          _amount: amount,
          value
        }).then(res => {
          this.dealRes(res.transactionHash);
        }).catch(e => {
          this.dealCatchErr(e);
        });
      } catch (e) {
        console.log(e);
        this.isLoading = false;
      }
    }
  },


};
</script>

<style lang="scss" scoped>
.dialog-content-container {
  min-width: 650px;
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 80vh;
  padding-bottom: 38px;

  .nav-list {
    display: flex;
    margin: 30px 0;
    padding: 0 30px;

    border-bottom: 1px solid #E2E2E2;

    .nav-item {
      font-size: 16px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #333333;
      padding: 16px 26px;
      cursor: pointer;

      &.active {
        color: #FFC001;
        border-bottom: 1px solid #FFC600;
      }
    }
  }

  .nav-btn-box {
    display: flex;
    padding: 0 30px;

    .nav-item {
      width: 180px;
      height: 44px;
      background: #E2E2E2;
      border-radius: 50px 50px 50px 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-family: Roboto-SemiBold, Roboto;
      font-weight: 600;
      color: #613A00;
      margin-right: 10px;
      cursor: pointer;

      .icon {
        display: none;
        width: 30px;
        height: 30px;
        margin-right: 6px;
      }

      &.active {
        background: linear-gradient(225deg, #FFAB00 0%, #FFC600 100%);

        .icon {
          display: block;
        }
      }
    }
  }


  .nft-detail-box {
    padding: 0 30px;

    .nft-list {

      padding: 15px;
      overflow: auto;
      height: 150px;
      background: #F3F3F3;
      border-radius: 23px 23px 23px 23px;
      display: grid;
      grid-template-columns: repeat(5, minmax(130px, 1fr));
      align-items: start;

      &::-webkit-scrollbar {
        display: none;
      }

      .nft-item {
        margin: 0 4px 8px 4px;
        background: #FFFFFF;
        border-radius: 8px 8px 8px 8px;
        border: 2px solid #fff;
        padding: 6px;
        position: relative;
        max-width: 200px;

        &.active {
          border: 2px solid #FFC001;

          .choose-box {
            .icon {
              display: block;
            }
          }
        }

        .square {
          position: relative;

          &::before {
            content: "";
            display: block;
            padding-top: 100%;
          }

          .icon {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
          }
        }


        .choose-box {
          position: absolute;
          top: 12px;
          right: 10px;
          width: 15px;
          height: 15px;
          background: #FFFFFF;
          border-radius: 50%;

          .icon {
            width: 16px;
            filter: drop-shadow(#FFC600 5000px -2px);
            height: 16px;
            transform: translate(-5000px, 2px);
            display: none;
          }
        }


        .name {
          font-size: 14px;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #333333;
          margin-top: 6px;
          white-space: nowrap;
          overflow: hidden;

        }

        .type {
          font-size: 12px;
          opacity: 0.6;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }

    .part1 {
      display: flex;
      padding-bottom: 26px;
      border-bottom: 1px solid #E2E2E2;
      align-items: center;
      width: 100%;

      .img-box {
        width: 113px;
        height: 113px;
        background: #F3F3F3;
        border-radius: 8px 8px 8px 8px;
        border: 1px solid #E2E2E2;
        padding: 4px;

        .icon {
          width: 105px;
          height: 105px;
          opacity: 1;
        }
      }

      .part1-content {
        margin-left: 15px;
        flex-grow: 1;
        padding-right: 20%;

        .flex-box {
          display: flex;
          align-items: center;

          .logo {
            width: 30px;
            height: 30px;
            margin-right: 8px;
          }

          strong {
            font-size: 18px;
            font-family: Roboto-Black, Roboto;
            font-weight: 900;
            color: #000000;
            text-transform: capitalize;
          }
        }

        .info-list {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;

          .item {
            .name {
              font-size: 14px;
              font-family: Roboto-Medium, Roboto;
              font-weight: 500;

              color: #999999;
            }

            .value {
              margin-top: 12px;
              font-size: 14px;
              font-family: Roboto-Black, Roboto;
              font-weight: 900;
              color: #333333;
            }
          }
        }

      }


    }

    .part2 {
      display: flex;
      justify-content: space-between;
      padding: 26px 0;

      .left-part, .right-part {
        width: 48%;

        .healthy-box {
          .progress-box {
            max-width: 140px;
          }
        }
      }

      .flex-box {
        justify-content: space-between;
        padding: 6px 0;
        display: flex;
        align-items: center;

        .name {
          font-size: 14px;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #999999;

        }

        .value-box {
          display: flex;
          align-items: center;
          font-size: 14px;
          font-family: Roboto-Black, Roboto;
          font-weight: 900;

          .icon {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }

          .blue {
            font-size: 14px;
            font-family: Roboto-SemiBold, Roboto;
            font-weight: 600;
            color: #6284F5;
            margin-left: 10px;
          }

        }

        .available-time {
          font-weight: bold;

          strong {
            color: #FFBD01;
            margin-right: 3px;
          }
        }
      }
    }
  }

  .bottom-content {
    padding: 0 20%;

    .title {
      font-size: 20px;
      font-family: Roboto-Bold, Roboto;
      font-weight: bold;
      color: #000000;
      padding: 30px 0 20px;
    }

    .input-box {

      position: relative;
      height: 50px;
      background: #F1F1F1;
      border-radius: 50px 50px 50px 50px;
      padding-left: 20px;
      font-family: Roboto-Black, Roboto;

      input {
        width: 100%;
        height: 100%;
        background: none;
      }

      .right-tip {
        position: absolute;
        display: flex;
        right: 0;
        top: 10px;
        align-items: center;
        padding-right: 26px;

        .max-btn {
          font-size: 12px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          height: 30px;
          line-height: 30px;
        }

        .line {
          width: 1px;
          height: 30px;
          background: #DADADA;
          margin: 0 10px;
        }

        .icon {
          width: 20px;
          height: 20px;
          margin: 0 10px;
        }

        font-size: 14px;
        font-family: Roboto-Black, Roboto;
        font-weight: 900;
        color: #333333;
      }
    }

    .operate-box {
      justify-content: space-between;
      display: flex;
      margin-top: 23px;

      .primary-btn-sha {
        width: 100%;
        height: 45px;
        white-space: nowrap;
      }
    }
  }
}

@media screen and (max-width: 1000px) {
  .dialog-header {
    display: flex;
    padding: 3vh 30px 0;
    justify-content: space-between;

    .title {
      font-size: 5vw;
      font-family: Roboto-SemiBold, Roboto;
      font-weight: 600;
      color: #000000;
    }

    .close {
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
  }

  .dialog-content-container {
    min-width: 300px;

    .nav-list {
      padding: 0 5vw;

      .nav-item {
        padding: 3vw 5vw;

      }
    }


    .nft-detail-box {
      padding: 0 5vw;

      .nft-list {
        width: 100%;
        grid-template-columns: repeat(3, minmax(100px, 1fr));
      }

      .part1 {
        .img-box {
          width: 22vw;
          height: 22vw;
          padding: 1vw;

          .icon {
            width: 20vw;
            height: 20vw;
          }
        }

        .part1-content {
          padding-right: 10px;
          flex-grow: 1;

          .info-list {
            flex-direction: column;

            .item {
              display: flex;
              justify-content: space-between;

              .value {
                margin-top: 0;
                text-align: right;
                white-space: nowrap;
              }
            }
          }
        }
      }

      .part2 {
        flex-direction: column;
        padding: 16px 0;

        .left-part, .right-part {
          width: 100%;

          .healthy-box {
            padding-bottom: 20px;

          }
        }
      }
    }

    .bottom-content {
      padding: 0 5vw;

      .input-box {
        .right-tip {
          top: 5px;
        }
      }
    }
  }
}

@media screen and (min-width: 1440px) {
  .dialog-content-container {
    .nft-detail-box {
      .nft-list {
        height: 200px;
      }
    }
  }


}
</style>
