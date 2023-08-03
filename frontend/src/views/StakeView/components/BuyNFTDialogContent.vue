<template>
  <div class="BuyNFTDialogContent dialog-content">
    <div class="dialog-header">
      <div class="title">
        Buy NFT
      </div>
      <img src="../../../assets/svg/close.svg" alt="" class="close" @click="$emit('closeDialog')">
    </div>
    <div class="dialog-content-container">
      <div class="tip">
        Buy NFT with {{ curChooseType == 0 ? "Staking" : "Repay" }}.
      </div>
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
            <strong v-else>{{ nft.token_id }}</strong>
          </div>
          <div class="type">
          </div>
        </div>
      </div>
      <div class="part2">
        <div class="left-part">
          <div class="flex-box">
            <div class="name">
              Debt
            </div>
            <div class="value-box">
              <img class="icon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
              <strong>{{ dealNum(debt) }}</strong>
            </div>
          </div>
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
            <div class="name boost-box">
              Loan to Value
              <div class="boost-btn" @click="$router.push('/governance/staking')" v-if="!tbcStaking.status">Boost
                Credit
              </div>
            </div>
            <div class="value-box">
              <strong class="rate">{{ showNum(borrowRate) }}%</strong>
              <img style="margin-left: 6px" class="icon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
              {{ dealNum(dataObj.staked_value * dataObj.max_borrow_rate) }}
            </div>
          </div>
          <div class="flex-box">
            <div class="name">
              Total Borrowed / Repaid
            </div>
            <div class="value-box">
              <img class="icon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
              <strong>{{ dealNum(dataObj.borrow_sum) }}</strong> /
              <strong>{{ dealNum(dataObj.reply_sum) }}</strong>
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
      <div class="market-info">
        <div class="market-item">
          <div class="name">
            List Price
          </div>
          <div class="value">
            <img class="icon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
            {{ dealNum(dataObj.list_price) }}
          </div>
        </div>
        <div class="market-item">
          <div class="name">
            Floor Price
          </div>
          <div class="value">
            <img class="icon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
            {{ dealNum(dataObj.staked_value) }}
          </div>
        </div>
        <div class="market-item">
          <div class="name">
            Debt
          </div>
          <div class="value">
            <img class="icon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
            {{ dealNum(debt) }}
          </div>
        </div>
      </div>
      <div class="buy-type-box">
        <div class="type-header">
          <div class="name">
            Buy Type
          </div>
          <div class="balance">
            Balance: {{ dealNum(balance) }}
          </div>
        </div>
        <div class="type-choose">
          <div class="choose-type-box" :class="{active:curChooseType==0}" @click="curChooseType=0">
            <div class="inline">
              <img class="icon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
              {{ dealNum(stakingValue) }}
            </div>
            <div class="tip">
              Buy with Staking
            </div>
          </div>
          <div class="choose-type-box" :class="{active:curChooseType==1}" @click="curChooseType=1">
            <div class="inline">
              <img class="icon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
              {{ dealNum(dataObj.list_price) }}
            </div>
            <div class="tip">
              Buy with Repay
            </div>
          </div>
        </div>
      </div>
      <div class="tip-box">
        Buy with Staking will get NFT ownership, requiring real-time attention to the Staking information to avoid
        breaking the warehouse.<br/>
        "Buy with Repay" will get NFT ownership and liquidity borrowing can be staked on the platform.
      </div>
      <div class="button-box">
        <a-button v-if="balanceNotEnough" class="primary-btn-sha" disabled>
           Insufficient Balance
        </a-button>
        <a-button v-else class="primary-btn-sha" @click="handleBuy" :loading="isLoading">
                <span style="margin-right: 6px" v-if="!isApprove">Approve &
            </span>
          Buy
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import bigNumberUtil from "@/utils/bigNumberUtil";
import {message, Tooltip} from "ant-design-vue";
import {mapGetters} from "vuex";
import BigNumber from "bignumber.js";
import {getTranStatus} from "@/api/common";
import {MaxUint256, ZeroAddress} from "@/config/constants";
import addressMap from "@/abi/addressMap";

const calculator = new bigNumberUtil();
export default {
  components: {Tooltip},
  props: ["dataObj", "countdown"],
  data() {
    return {
      curBorrowAPY: 0,
      nftList: [],
      dealNum: calculator.dealNum,
      allowanceNum: 0,
      isLoading: false,
      curChooseType: 0
    };
  },
  computed: {
    ...mapGetters(['account', 'web3', 'ethBalance', 'usdtBalance', 'usdtDecimal', 'isConnected', 'chainId']),
    tbcStaking() {
      return this.$store.state.app.tbcStaking;
    },
    borrowRate() {
      if (!this.tbcStaking.status || this.tbcStaking.incr == 0) {
        return this.dataObj.max_borrow_rate * 100;
      } else {
        return calculator.add(this.dataObj.max_borrow_rate, this.tbcStaking.incr) * 100;
      }
    },
    balance() {
      if (this.dataObj.underlying && this.dataObj.underlying.address === "0x0000000000000000000000000000000000000000") {
        return (this.ethBalance);
      }
      return (this.usdtBalance);
    },
    tokensData() {
      return this.$store.state.stake.tokensData;
    },
    isApprove() {
      if (this.dataObj.underlying && this.dataObj.underlying.address === "0x0000000000000000000000000000000000000000") {
        return true;
      }
      return BigNumber(this.dataObj.list_price).lt(this.allowanceNum);
    },
    balanceNotEnough() {
      if (this.curChooseType == 0) {
        return BigNumber(this.balance).lt(this.stakingValue);
      } else {
        return BigNumber(this.balance).lt(this.dataObj.list_price);
      }
    },
    stakingValue() {
      if (calculator.subtract(this.dataObj.list_price, this.debt) <= 0) {
        return 0;
      }
      return calculator.subtract(this.dataObj.list_price, this.debt);
    },
    debt() {
      return this.dataObj.borrow_sum;
    },
    loanLimit() {
      return this.dataObj.available_borrow;
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
    showNum(num) {
      let res = Number(Number(num) * 100).toFixed(0) / 100;
      return res.toLocaleString();
    },
    async initData() {
      if (!this.isConnected || !this.tokensData.pools) {
        return;
      }
      this.$store.dispatch('app/getETHBalance');
      this.$store.dispatch('usdt/getMyBalance');

      this.tokensData.pools.forEach(item => {
        const name = item.name;
        if (name === this.dataObj.underlying.name) {
          this.curBorrowAPY = item.borrow_apy;
        }
      });
      this.getAllowance();
    },
    async getAllowance() {

      if (this.dataObj.underlying.address != ZeroAddress) {
        let result = await this.$store.dispatch('erc20/allowance', {
          owner: this.account,
          spender: addressMap[this.chainId]['stakingProof'],
          address: this.dataObj.underlying.address,
        });
        this.allowanceNum = BigNumber(result.toString())
            .div(BigNumber(10).pow(this.dataObj.underlying.decimals))
            .toFixed(18);
      } else {
        this.allowanceNum = MaxUint256;
      }
    },
    openUrl() {
      window.open(this.dataObj.nft.link, "_blank");
    },
    async dealRes(transactionHash) {
      let statusRes = await getTranStatus(transactionHash);
      if (statusRes.data.data == 1) {
        setTimeout(() => {
          this.isLoading = false;
          this.$emit("updateData");
          message.success("Transaction Success");
          this.$emit("closeDialog");
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
        this.isLoading = false;
        if (err.originalError) {
          message.error(err.originalError.message);
        } else {
          message.error(e.message.substr(0, e.message.indexOf("{")));
        }
      }
    },
    async handleBuy() {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;

      if (!this.isApprove) {
        await this.$store.dispatch('erc20/approve', {
          spender: addressMap[this.chainId]['stakingProof'],
          amount: MaxUint256,
          address: this.dataObj.underlying.address,
        }).then(() => {
          this.getAllowance();

        }).catch(err => {
          this.dealCatchErr(err);
        });
      }


      let value = 0, amount;
      if (this.curChooseType == 0) {
        amount = this.stakingValue;
      } else {
        amount = this.dataObj.list_price;
      }
      amount = calculator.multiply(amount, BigNumber(10).pow(this.dataObj.underlying.decimals));
      if (this.dataObj.underlying.address === "0x0000000000000000000000000000000000000000") {
        if (this.curChooseType == 0) {
          const apyAmount = calculator.multiply(calculator.multiply(amount, this.curBorrowAPY), 0.00137);
          amount = BigNumber(calculator.add(amount, apyAmount)).toFixed(0);
        }
        value = BigNumber(amount).toFixed(0);
      }

      this.$store.dispatch("stakingProof/buy", {
        value,
        _tokenId: this.dataObj.bundle_id,
        _redemption: this.curChooseType == 1, //=1 repay
      }).then(res => {
        this.dealRes(res.transactionHash);
      }).catch(err => {
        this.dealCatchErr(err);
      });
    }
  }
};
</script>
<style scoped lang="scss">
.dialog-content-container {
  width: 780px;
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 80vh;
  padding: 0 30px 38px;

  .tip {
    font-size: 13px;
    font-family: Roboto-Medium, Roboto;
    font-weight: 500;
    color: #999999;
    margin: 15px 0 20px;
  }

  .tip-box {
    width: 100%;
    font-size: 13px;
    font-family: Roboto-Medium, Roboto;
    font-weight: 500;
    color: #999999;
    margin: 15px 0 20px;
    line-height: 19px;
  }

  .button-box {
    display: flex;
    align-items: center;
    justify-content: center;

    .primary-btn-sha {
      width: 365px;
      margin: 0 auto;
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
      padding: 9px 0;
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

  .market-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 50px;
    background: #F3F3F3;
    border-radius: 15px 15px 15px 15px;
    border: 1px solid #E2E2E2;
    padding: 0 22px;
    align-items: center;

    .market-item {
      display: flex;
      align-items: center;

      .name {
        font-size: 13px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #999999;
      }

      .value {
        margin-left: 30px;
        font-size: 13px;
        font-family: Roboto-Black, Roboto;
        font-weight: 900;
        color: #333333;
        display: flex;
        align-items: center;

        .icon {
          margin-right: 6px;
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .buy-type-box {
    width: 375px;
    margin: 20px auto;

    .type-header {
      display: flex;
      justify-content: space-between;

      .balance {
        color: #999999;
      }
    }

    .type-choose {
      display: flex;
      justify-content: space-between;

      .type-header {
        font-size: 15px;
        font-family: Roboto-Bold, Roboto;
        font-weight: bold;
        color: #000000;
      }

      .choose-type-box {
        margin-top: 15px;
        width: 175px;
        height: 82px;
        background: #FFFFFF;
        box-shadow: 0px 4px 15px 4px rgba(0, 0, 0, 0.05);
        border-radius: 15px 15px 15px 15px;
        opacity: 1;
        border: 1px solid #E2E2E2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &.active {
          background: linear-gradient(225deg, #FFAB00 0%, #FFC600 100%);
        }

        .inline {
          display: flex;
          align-items: center;
          font-size: 15px;
          font-family: Roboto-Black, Roboto;
          font-weight: 900;
          color: #333333;

          .icon {
            width: 20px;
            height: 20px;
            margin-right: 6px;
          }
        }

        .tip {
          font-size: 13px;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #333333;
          margin: 10px 0 0 0;
        }
      }
    }
  }
}

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

@media screen and (max-width: 1000px) {
  .dialog-content-container {
    width: 95vw;

    .part2 {
      display: block;

      .left-part, .right-part {
        width: 100%;
      }
    }

    .market-info {
      flex-direction: column;
      padding: 10px;
      height: auto;
      .market-item {
        width: 100%;
        margin-top: 10px;
        justify-content: space-between;
        &:first-child{
          margin-top: 0;
        }
        .value {
          margin-left: 0;
        }
      }
    }

    .buy-type-box {
      width: 95vw;
      .type-header{
        width: 100%;
        justify-content: flex-start;
        .balance{
          margin-left: 30%;
        }
      }
      .type-choose {
        width: 95vw;
        display: flex;
        justify-content: flex-start;
        .choose-type-box {
          width: 40%!important;
          &:last-child{
            margin-left: 10px;
          }
        }
      }
    }

    .nft-list {
      grid-template-columns: repeat(3, minmax(100px, 1fr));
    }

    .primary-btn-sha {
      height: auto;
    }
  }
}
</style>
