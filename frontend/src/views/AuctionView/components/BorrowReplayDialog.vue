<template>
  <div class="dialog">
    <div class="dialog-mask" @click="$emit('closeDialog')"></div>
    <div class="dialog-content animate__fadeIn animate__animated">
      <div class="dialog-header">
        <div class="title">Borrower Repay</div>
        <img src="../../../assets/svg/close.svg" alt="" class="close" @click="$emit('closeDialog')" />
      </div>
      <div class="dialog-content-container">
        <div class="tip-content">
          Payment of debt with Interest <br />
          as well as pay a penalty 2% of Maximum<br />
          Offer to Maximum Bid Liquidator
        </div>
        <a-button :loading="isLoading" class="primary-btn-sha" @click="redeem">
          Pay {{ dealNum(auctionInfo.redeem_amount) }}
          {{ auctionInfo.underlying.name == "USD" ? USDByChainId[chainId] : auctionInfo.underlying.name }}
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import bigNumberUtil from "@/utils/bigNumberUtil";
import { USDByChainId } from "../../../utils/constantData";
import { mapGetters } from "vuex";
import { message } from "ant-design-vue";
import { getTranStatus } from "@/api/common";
import BigNumber from "bignumber.js";
import { MaxUint256, ZeroAddress } from "@/config/constants";
import { getAuctionInfo } from "@/api/auctionApi";
import addressMap from "@/abi/addressMap";

const calculator = new bigNumberUtil();
export default {
  data() {
    return {
      USDByChainId,
      isLoading: false,
      auctionInfo: {
        underlying: {}
      }
    };
  },
  props: ["bundle_id", "closeDialog"],

  computed: {
    ...mapGetters(["account", "web3", "isConnected", "chainId", "usdtDecimal", "ethBalance", "usdtBalance"])
  },
  methods: {
    async getData() {
      try {
        const res = await getAuctionInfo({
          chain: this.$store.chainId,
          bundle_id: this.bundle_id
        });
        if (res && res.data && res.data.code === 0) {
          this.auctionInfo = res.data.data;
        }
      } catch (e) {
        console.log(e);
      }
    },
    dealNum: calculator.dealNum,
    dealCatchErr(e) {
      this.isLoading = false;
      if (e.code == 4001) {
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
    async dealRes(transactionHash) {
      let statusRes = await getTranStatus(transactionHash);
      if (statusRes.data.data == 1) {
        setTimeout(() => {
          this.isLoading = false;
          this.$emit("closeDialog");
          this.$emit("updateData");
          message.success("Transaction Success");
        }, 3000);
      } else {
        setTimeout(() => {
          this.dealRes(transactionHash);
        }, 3000);
      }
    },
    async redeem() {
      if (this.isLoading) {
        return;
      }
      let _auctionId = this.auctionInfo.auction_id;
      if (_auctionId == null) {
        let value = "0";
        let _amount = "0";
        if (this.auctionInfo.underlying.address == ZeroAddress) {
          _amount = BigNumber(this.auctionInfo.redeem_amount).plus("0.000001").toFixed(this.auctionInfo.underlying.decimal);
          value = _amount;
          if (BigNumber(this.ethBalance).lt(value)) {
            message.error("Insufficient balance");
            return;
          }
        } else {
          if (BigNumber(this.usdtBalance).lt(this.auctionInfo.redeem_amount)) {
            message.error("Insufficient balance");
            return;
          }
          let allowance = await this.$store.dispatch("erc20/allowance", {
            owner: this.account,
            spender: addressMap[this.chainId]["vault"],
            address: this.auctionInfo.underlying.address
          });
          console.log(allowance);
          if (BigNumber(10).pow(this.auctionInfo.underlying.decimals).multipliedBy(this.auctionInfo.redeem_amount).lt(allowance.toString())) {
            try {
              this.isLoading = true;
              await this.$store.dispatch("erc20/approve", {
                spender: addressMap[this.chainId]["vault"],
                amount: MaxUint256,
                address: this.auctionInfo.underlying.address
              });
            } catch (err) {
              this.isLoading = false;
            }
            let allowance2 = await this.$store.dispatch("erc20/allowance", {
              owner: this.account,
              spender: addressMap[this.chainId]["vault"],
              address: this.auctionInfo.underlying.address
            });
            if (BigNumber(10).pow(this.auctionInfo.underlying.decimals).multipliedBy(this.auctionInfo.redeem_amount).lt(allowance2.toString())) {
              this.isLoading = false;
              message.error("Insufficient allowance");
              return;
            }
          }
        }
        let _bundleId = this.auctionInfo.bundle_id;
        this.isLoading = true;
        this.$store
            .dispatch("vault/reply", {
              _bundleId,
              value,
              _amount
            })
            .then((res) => {
              this.dealRes(res.transactionHash);
            })
            .catch((e) => {
              this.dealCatchErr(e);
            });
        return;
      }
      let value = "0";
      if (this.auctionInfo.underlying.address == ZeroAddress) {
        value = this.auctionInfo.redeem_amount;
        if (BigNumber(this.ethBalance).lt(value)) {
          message.error("Insufficient balance");
          return;
        }
      } else {
        value = "0";
        if (BigNumber(this.usdtBalance).lt(this.auctionInfo.redeem_amount)) {
          message.error("Insufficient balance");
          return;
        }
        let allowance = await this.$store.dispatch("erc20/allowance", {
          owner: this.account,
          spender: addressMap[this.chainId]["auctionNFT"],
          address: this.auctionInfo.underlying.address
        });
        let precison = BigNumber(10).pow(this.auctionInfo.underlying.decimals);
        if (precison.multipliedBy(this.auctionInfo.redeem_amount).gt(allowance.toString())) {
          try {
            this.isLoading = true;
            await this.$store.dispatch("erc20/approve", {
              spender: addressMap[this.chainId]["auctionNFT"],
              amount: MaxUint256,
              address: this.auctionInfo.underlying.address
            });
          } catch (err) {
            this.isLoading = false;
          }
          let allowance2 = await this.$store.dispatch("erc20/allowance", {
            owner: this.account,
            spender: addressMap[this.chainId]["auctionNFT"],
            address: this.auctionInfo.underlying.address
          });
          if (precison.multipliedBy(this.auctionInfo.redeem_amount).gt(allowance2.toString())) {
            console.log("lt2");
            this.isLoading = false;
            message.error("Insufficient allowance");
            return;
          }
        }
      }
      this.isLoading = true;
      this.$store
          .dispatch("auctionNFT/redeem", {
            value,
            _auctionId
          })
          .then((res) => {
            this.dealRes(res.transactionHash);
          })
          .catch((e) => {
            this.dealCatchErr(e);
          });
    }
  }
};
</script>
<style scoped lang="scss">
.dialog-content-container {
  min-width: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 80vh;
  padding: 0 30px;
  @media screen and (max-width: 1000px) {
    min-width: 0;
    width: 95vw;
  }

  .primary-btn-sha {
    width: 100%;
  }

  .tip-content {
    font-size: 20px;
    font-family: Roboto-SemiBold, Roboto;
    font-weight: 600;
    margin: 30px 0 60px;
    text-align: center;
  }
}

.dialog-content {
  position: absolute;
  z-index: 1;
  background: #ffffff;
  border-radius: 30px 30px 30px 30px;
  padding: 30px 0;

  .dialog-header {
    display: flex;
    padding: 0 30px;
    justify-content: space-between;

    .title {
      font-size: 20px;
      font-family: Roboto-SemiBold, Roboto;
      font-weight: 600;
      color: #000000;
      line-height: 35px;
    }

    .close {
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
  }
}
</style>
