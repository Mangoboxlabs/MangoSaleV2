<template>
  <div class="">
    <div class="dialog-header">
      <div class="title">
        Loan ID{{ "# " + nftObj.bundle_id }}
      </div>
      <img src="../../../assets/svg/close.svg" alt="" class="close" @click="$emit('closeDialog')"/>
    </div>
    <div class="BidDialogContent dialog-content-container">
      <div class="bottom-content">
        <div class="input-header">
          Balance
          <div class="right">
            <img v-if="nftObj.underlying" class="icon" :src="require('@/assets' + nftObj.underlying.icon)" alt=""/>
            {{ dealNum(balance) }}
          </div>
        </div>
        <div class="input-box">
          <input type="number" step="any" v-model="amount" :placeholder="'Min: ' + showNumAuto(minBidCost)"/>
          <div class="right-tip">
            <div class="max-btn primary-btn" @click="setMin">Min</div>
            <div class="line"></div>
            <img v-if="nftObj.underlying" class="icon" :src="require('@/assets' + nftObj.underlying.icon)" alt=""/>
            <span v-if="nftObj.underlying">{{ nftObj.underlying.name === "USD" ? USDByChainId[chainId] : "" }}</span>
          </div>
        </div>
        <!-- <div class="input-bottom">
          <div class="left">
            <div class="check-box" style="display: none">
              <div class="checked"></div>
            </div>
            <span>Proxy Bid</span>
            <Tooltip placement="top">
              <template #title>
                <span
                  >Please enter your maximum bid price, which is subject to the bid rule (10% increase), and when
                  someone bids, the system will automatically make additional bids at 10% increase until your maximum
                  bid price.</span
                >
              </template>
              <img src="../../../assets/images/tip_icon.webp" alt="" class="tip-icon" />
            </Tooltip>
          </div>
          <div class="right">
            {{ countdown }}
          </div>
        </div> -->
        <div class="input-bottom">
          <div class="left">
            <div class="check-box" style="display: none">
              <div class="checked"></div>
            </div>
            <span v-if="nftObj.my_margin > 0">Margin paid</span>
            <span v-else>Pay margin</span>
          </div>
          <div class="right">
            <img
                v-if="nftObj.underlying"
                class="icon"
                style="width: 20px"
                :src="require('@/assets' + nftObj.underlying.icon)"
                alt=""
            />&nbsp;
            <template v-if="nftObj.my_margin > 0">{{ showNumAuto(nftObj.my_margin) }}</template>
            <template v-else>{{ showNumAuto(nftObj.margin) }}</template>
          </div>
        </div>
        <div class="operate-box">

          <a-button class="primary-btn-sha" :loading="isLoading" @click="bid">
            {{ bidName }}
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import bigNumberUtil from "@/utils/bigNumberUtil";
import addressMap from "@/abi/addressMap";
import BigNumber from "bignumber.js";
import {getTranStatus} from "@/api/common";
import {message} from "ant-design-vue";

const calculator = new bigNumberUtil();
import {USDByChainId} from "@/utils/constantData";
import {MaxUint256, ZeroAddress} from "@/config/constants";

BigNumber.set({
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

export default {
  name: "BidDialogContent",
  props: ["nftObj", "closeDialog", "updateData", "nowTime", "extra"],
  components: {},
  computed: {
    ...mapGetters([
      "usdtDecimal",
      "isConnected",
      "account",
      "currentTheme",
      "ethBalance",
      "usdtBalance",
      "chainId",
      "isSign",
      "web3",
    ]),
    bidName() {
      let needApprove =
          this.nftObj.underlying.address != ZeroAddress && BigNumber(this.allowanceNum).lt(this.amount ? this.amount : 1);
      return needApprove ? "Approve & Bid" : "Bid";
    },
    minBidCost() {
      if (this.nftObj.bid_price && this.nftObj.bid_price > 0) {
        return calculator.multiply(this.nftObj.bid_price, (parseInt(this.extra.BID_INCREMENT) + 10000) / 10000);
      }
      if (this.nftObj.method == "createAndBid") {
        let feeRate = BigNumber("0.06")
            .multipliedBy(10 * 60)
            .div(365 * 24 * 3600)
            .plus(1);
        return BigNumber(this.nftObj.init_bid_price).multipliedBy(feeRate);
      }
      return this.nftObj.init_bid_price;
    },
    countdown() {
      const now = this.nowTime;
      const end = this.nftObj.end_time * 1000;
      const diff = calculator.subtract(end, now);
      if (diff < 0) {
        return "end";
      }
      const seconds = Math.ceil(diff / 1000);
      let hours = Math.floor(seconds / 3600);
      hours = hours < 10 ? "0" + hours : hours;
      let minutes = Math.floor((seconds - hours * 3600) / 60);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      let secs = seconds - hours * 3600 - minutes * 60;
      secs = secs < 10 ? "0" + secs : secs;
      return hours + ":" + minutes + ":" + secs;
    },
    allowanceNum() {
      return this.$store.state.auctionNFT.allowance;
    },
    balance() {
      if (this.nftObj.underlying && this.nftObj.underlying.address === "0x0000000000000000000000000000000000000000") {
        return this.ethBalance;
      }
      return this.usdtBalance;
    },
  },
  data() {
    return {
      USDByChainId,
      ZeroAddress,
      amount: undefined,
      isLoading: false,
      dealNum: calculator.dealNum,
      showNumAuto: calculator.showNumAuto,
    };
  },
  methods: {
    BigNumber,
    setMin() {
      this.amount = BigNumber(this.minBidCost).toFixed(3);
    },
    async allowance() {
      if (this.isConnected) {
        let res = await this.$store.dispatch("erc20/allowance", {
          owner: this.account,
          spender: addressMap[this.chainId]["auctionNFT"],
          address: this.nftObj.underlying.address,
        });
        this.$store.commit("auctionNFT/SET_ALLOWANCE", BigNumber(res).div(this.usdtDecimal).toFixed(6));
      }
    },
    dealCatchErr(e) {
      this.isLoading = false;
      if (e.code === 4001) {
        message.error("User canceled  transaction");
        return;
      }
      if (e.message && e.message.indexOf("{") < 0) {
        message.error(e.message);
      } else {
        const err = JSON.parse(e.message.substr(e.message.indexOf("{"), e.message.length));
        message.error(err.originalError.message);
      }
    },
    async bid() {
      if (!this.isConnected) {
        message.error("Connect wallet first");
        return;
      }
      let amount = BigNumber(this.amount);
      if (amount.isNaN()) {
        message.error("Please enter the amount");
        return;
      }
      if (amount.lt(BigNumber(this.minBidCost).toFixed(2))) {
        message.error("The bid price is less than the initial price");
        return;
      }
      if (amount.lt(this.minBidCost)) {
        amount = BigNumber(this.minBidCost);
      }

      try {
        if (this.isLoading) {
          return;
        }

        this.isLoading = true;
        if (this.nftObj.underlying.address != ZeroAddress && BigNumber(this.allowanceNum).lt(amount)) {
          await this.$store.dispatch("erc20/approve", {
            spender: addressMap[this.chainId]["auctionNFT"],
            amount: MaxUint256,
            address: this.nftObj.underlying.address,
          });
          await this.allowance();
        }
        let method = this.nftObj.method ? this.nftObj.method : "bid";
        let _price = amount.multipliedBy(10 ** this.nftObj.underlying.decimals).toFixed(0);
        let value = "0";
        console.log(
          this.nftObj.underlying.address , ZeroAddress,this.nftObj.my_margin
        )
        if (this.nftObj.my_margin == 0 && this.nftObj.underlying.address == ZeroAddress) {
          value = this.nftObj.margin;
          console.log({
              margin:this.nftObj.margin}
          )
        }
        let res = await this.$store.dispatch("auctionNFT/" + method, {
          value,
          _auctionId: this.nftObj.auction_id,
          _bundleId: this.nftObj.bundle_id,
          _price,
        });
        await this.dealRes(res.transactionHash);
        this.$emit("closeDialog");
        this.amount = "";
      } catch (err) {
        console.log(err);
        this.dealCatchErr(err);
        this.isLoading = false;
      }
    },
    async dealRes(transactionHash) {
      let statusRes = await getTranStatus(transactionHash);
      if (statusRes.data.data == 1) {
        setTimeout(() => {
          this.isLoading = false;
          this.$emit("updateData");
          message.success("Transaction Success");
        }, 3000);
      } else {
        setTimeout(() => {
          this.dealRes(transactionHash);
        }, 3000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
  min-width: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 80vh;
  padding-bottom: 38px;
  @media screen and (max-width: 1000px) {
    min-width: 0;
    width: 95vw;
  }
}

.BidDialogContent {
  .bottom-content {
    padding: 0 30px;

    .title {
      font-size: 20px;
      font-family: Roboto-Bold, Roboto;
      font-weight: bold;
      color: #000000;
      padding: 30px 0 20px;
    }

    .input-bottom {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;

      .right {
        font-weight: bold;

        strong {
          color: #ffbd01;
          margin-right: 3px;
        }
      }

      .left {
        display: flex;
        align-items: center;

        .tip-icon {

          margin-left: 5px;
        }
      }
    }

    .input-header {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      margin: 20px 0 15px 0;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #333333;
      align-items: center;

      .right {
        display: flex;
        align-items: center;
        font-size: 14px;

        .icon {
          width: 20px;
          height: 20px;
          margin-right: 6px;
        }
      }
    }

    .input-box {
      position: relative;
      height: 50px;
      background: #f1f1f1;
      border-radius: 50px 50px 50px 50px;
      padding-left: 16px;
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
          background: #dadada;
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
      }
    }
  }
}

@media screen and (max-width: 1000px) {
  .BidDialogContent {
    .bottom-content {
      .input-box {
        .right-tip {
          top: 5px;
          .max-btn{
            min-width: 60px;
          }
        }
      }
    }
  }
}
</style>
