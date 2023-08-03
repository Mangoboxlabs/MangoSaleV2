<template>
  <div class="SellNFTDialogContent dialog-content">
    <div class="dialog-header">
      <div class="title">
        Sell NFT
      </div>
      <img src="../../../assets/svg/close.svg" alt="" class="close" @click="$emit('closeDialog')">
    </div>
    <div class="dialog-content-container">
      <div class="tip">
        By selling NFT, you can transfer the ownership and corresponding debts simultaneously.
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
        <div class="primary-btn-sha view-btn" @click="openUrl">
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
      <div class="market-info">

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
      <div class="sell-box">

        <div class="sell-item">
          <div class="sell-header">
            <div class="name">
              List Price
            </div>
            <div class="min">
              （ Min {{ dealNum(debt) }}）
            </div>
          </div>
          <div class="input-box">
            <input type="number" step="any" v-model="amount" placeholder="0" @input="checkNum" @blur="checkNum"/>
            <div class="input-right-tip">
              <img class="icon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
              <strong>{{ dataObj.underlying.name }}</strong>
            </div>
          </div>
          <img class="down-icon"  src="@/assets/images/down_icon.png" alt="">
        </div>
        <div class="sell-item">
          <div class="sell-header">
            Est. Net Income
          </div>
          <div class="input-box">
            <input type="number" step="any" v-model="canRecPrice" placeholder="0" @input="checkIncomeNum"/>
            <div class="input-right-tip">
              <img class="icon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
              <strong>{{ dataObj.underlying.name }}</strong>
            </div>
          </div>
        </div>
        <a-button
            class="primary-btn-sha"
            v-if="amount === '.' || amount === '' || amount === undefined || amount == 0"
            disabled="disabled">
          Enter an amount
        </a-button>
        <a-button v-else class="primary-btn-sha" @click="handleSell" :loading="isLoading">
          Sell
        </a-button>
      </div>
      <div class="tip" style="padding-top: 20px">
        Recommend setting a List Price above the Debt level but below the Floor Price.<br/>
        Buy your NFT before the auction, transferring NFT ownership and debt to the buyer.<br/>
        Est. Net Income=List Price - Debt
      </div>
    </div>
  </div>
</template>
<script>
import bigNumberUtil from "@/utils/bigNumberUtil";
import {mapGetters} from "vuex";
import BigNumber from "bignumber.js";
import {getTranStatus} from "@/api/common";
import {message} from "ant-design-vue";

const calculator = new bigNumberUtil();

export default {
  props: ["dataObj"],
  data() {
    return {
      inputTimeout: null,
      amount: undefined,
      nftList: [],
      lessDebt: 'Amount < debt',
      dealNum: calculator.dealNum,
      isLoading: false,
      curChooseType: 0,
      canRecPrice: undefined
    };
  },
  computed: {
    ...mapGetters(['account', 'web3', 'ethBalance', 'usdtBalance', 'usdtDecimal', 'isConnected', 'chainId']),

    balance() {
      if (this.dataObj.underlying && this.dataObj.underlying.address === "0x0000000000000000000000000000000000000000") {
        return (this.ethBalance);
      }
      return (this.usdtBalance);
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
  },
  methods: {
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
        if (err.originalError) {
          message.error(err.originalError.message);
        } else {
          message.error(e.message.substr(0, e.message.indexOf("{")));
        }
      }
      this.isLoading = false;
    },
    checkNum() {
      clearTimeout(this.inputTimeout);
      if (BigNumber(this.amount).isLessThan(BigNumber(this.debt))) {
        this.inputTimeout = setTimeout(() => {
          if (BigNumber(this.amount).isLessThan(BigNumber(this.debt))) {
            this.amount = BigNumber(this.debt).toFixed(3, BigNumber.ROUND_UP);
          }

          this.canRecPrice = BigNumber(calculator.subtract(this.amount, this.debt)).toFixed(3);
        }, 1500);
      } else {
        this.canRecPrice = BigNumber(calculator.subtract(this.amount, this.debt)).toFixed(3);
      }

    },
    checkIncomeNum() {
      this.amount = BigNumber(calculator.add(this.canRecPrice, this.debt)).toFixed(3);
    },
    handleSell() {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;

      if (BigNumber(this.amount).isLessThan(BigNumber(this.debt))) {
        this.amount = BigNumber(this.debt).toFixed(3, BigNumber.ROUND_UP);
      }

      let decimals = 10 ** this.dataObj.underlying.decimals ? 10 ** this.dataObj.underlying.decimals : 10 ** 6;
      this.$store.dispatch("stakingProof/list", {
        _tokenId: this.dataObj.bundle_id,
        _price: BigNumber(calculator.multiply(this.amount, decimals)).toFixed(0),
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
  padding: 0 30px 0;

  .primary-btn-sha {
    margin-top: 22px;
    width: 100%;
  }

  .view-btn {
    width: 160px;
  }

  .tip {
    font-size: 13px;
    font-family: Roboto-Medium, Roboto;
    font-weight: 500;
    color: #999999;
    margin: 15px 0 20px;
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

  .market-info {
    margin-top: 7px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 50px;
    background: #F3F3F3;
    border-radius: 15px 15px 15px 15px;
    border: 1px solid #E2E2E2;
    align-items: center;

    .market-item {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 22px;

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

  .sell-box {
    width: 375px;
    margin: 20px auto;

    .sell-item {
      position: relative;
      width: 365px;
      background: #F1F1F1;
      border-radius: 15px 15px 15px 15px;
      padding: 15px 22px 5px;
      margin-bottom: 10px;

      .down-icon {
        width: 29px;
        height: 29px;
        position: absolute;
        bottom: -20px;
        z-index: 1;
        left: calc(50% - 15px);

      }
    }

    .sell-header {
      display: flex;
      align-items: center;
      font-family: Roboto-Bold, Roboto;
      font-weight: bold;
      color: #000000;

      .min {
        color: #999999;
      }
    }

    .input-box {
      height: 44px;
      background: #f1f1f1;
      border-radius: 50px 50px 50px 50px;
      position: relative;

      input {
        width: 100%;
        height: 100%;
        background: none;
        padding: 0 20px;
        font-weight: bold;
      }

      .input-right-tip {
        position: absolute;
        right: 20px;
        top: 11px;
        display: flex;
        align-items: center;
        font-family: Roboto-Black, Roboto;
        color: #333333;
        font-size: 12px;
        padding-left: 20px;
        border-left: 1px solid #dadada;

        .icon {
          width: 22px;
          height: 22px;
          margin-right: 6px;
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

    .sell-box{
      width: 100%;
      .sell-item{
        width: 100%;
      }
    }
    .primary-btn-sha{
      height: auto;
    }
  }
}
</style>
