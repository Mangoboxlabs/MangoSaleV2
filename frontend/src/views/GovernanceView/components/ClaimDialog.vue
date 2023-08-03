<template>
  <div class="ClaimDialog dialog animate__animated animate__fadeIn">
    <div class="dialog-mask" @click="$emit('closeDialog')"></div>
    <div class="dialog-content">
      <div class="dialog-header">
        <div class="title">
          Claim TBC
        </div>
        <img src="../../../assets/svg/close.svg" alt="" class="close" @click="$emit('closeDialog')">
      </div>
      <div class="dialog-content-container">
        <div class="info">
          Claim all TBC
        </div>
        <div class="input-box">
<!--          <input type="number" placeholder="Claimable">-->
          <div class="left">Claimable</div>
          <div class="right-tip">
            <img src="../../../assets/images/coin-logo.webp" alt="" class="icon">
            {{ dealNum(totalEarned) }} TBC
          </div>
        </div>
<!--        <div class="input-box">-->
<!--          <div class="left">Wallet TBC</div>-->
<!--          <div class="right-tip">-->
<!--            {{ dealNum(totalEarned) }} TBC-->
<!--            <div class="to">-->
<!--              >-->
<!--            </div>-->
<!--            {{ dealNum(tbcBalance) }} TBC-->
<!--          </div>-->
<!--        </div>-->
        <a-button class="primary-btn-sha" @click="getReward" :loading="isLoading">
          Claim TBC
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import {message} from "ant-design-vue";
import {confirmTransaction} from "@/api/common";
import bigNumberUtil from "@/utils/bigNumberUtil";
import addressMap from "@/abi/addressMap";
import BigNumber from "bignumber.js";
import {mapGetters} from "vuex";
const calculator = new bigNumberUtil();
export default {
  name: "ClaimDialog",

  data() {
    return {
      calculator,
      dealNum:calculator.dealNum,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(["account","isConnected","chainId"]),
    tbcBalance(){
      return this.$store.state.TBCStake.tbcBalance
    },
    totalEarned(){
      return this.$store.state.rewardPool.totalEarnedNum
    },
  },
  created() {
    this.getTBCBalance()
  },
  methods: {
    async getTBCBalance() {
      if(!this.isConnected){
        return
      }
      const decimals = await this.$store.dispatch("erc20/decimals", {
        address: addressMap[this.chainId]["tbc"]
      })
      const balance = await this.$store.dispatch("erc20/balanceOf", {
        address: addressMap[this.chainId]["tbc"],
        account: this.account
      })
      this.$store.commit("TBCStake/SET_TBCBalance", calculator.divide(balance, BigNumber(10).pow(decimals)))
    },
    dealCatchErr(e) {
      this.isLoading=false
      if (e.code == 4001) {
        message.error('User canceled  transaction');
        return;
      }
      if (e.code === 4001) {
        message.error('User canceled  transaction');
        return;
      }
      if (e.message && e.message.indexOf("{") < 0) {
        message.error(e.message)
      } else {
        const err = JSON.parse(e.message.substr(e.message.indexOf("{"), e.message.length))
        if (err.originalError) {
          message.error(err.originalError.message)
        } else {
          message.error(e.message.substr(0, e.message.indexOf("{")))
        }

      }
    },
    getReward() {
      try {
        this.isLoading = true
        this.$store.dispatch("rewardPool/getReward").then(async (tx) => {
          try {
            await confirmTransaction(tx.transactionHash);
            await this.$emit('updateData');
            message.success('Claim Success');
            await this.$emit('closeDialog');

            this.isLoading=false
          } catch (err) {
            await this.getData();
          }
          this.isLoading = false;
        }).catch((e) => {
          this.dealCatchErr(e)
        })
      } catch (e) {
        console.log(e)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.ClaimDialog {
  .dialog-content {
    min-width: 360px;

    .dialog-content-container {
      padding: 0 30px;

      .info {
        font-size: 12px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #333333;
      }

      .primary-btn-sha {
        margin-top: 40px;
        width: 100%;
        font-family: RussoOneRegular, Russo One;
      }

      .input-box {
        width: 100%;
        height: 50px;
        margin-top: 20px;
        background: #F1F1F1;
        border-radius: 50px 50px 50px 50px;
        position: relative;

        .left {
          line-height: 50px;
          font-size: 12px;
          font-family: Roboto-Medium, Roboto;
          color: #C3C3C3;
          padding-left: 20px;
        }

        input {
          background: none;
          height: 100%;
          width: 100%;

          &::placeholder {
            font-size: 12px;
            font-family: Roboto-Medium, Roboto;
            color: #C3C3C3;
            padding-left: 10px;
          }
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

          .to {
            margin: 0 10px;
          }

          .icon {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }

          .max-btn {
            width: 76px;
            height: 40px;
            line-height: 40px;

            font-family: Roboto-Bold, Roboto;
            font-weight: bold;
            color: #613A00;
          }

          .line {
            height: 30px;
            width: 1px;
            background: #DADADA;
            margin: 0 30px 0 20px;
          }
        }

      }

    }
  }
}
@media screen and (max-width: 1000px) {
  .primary-btn-sha{
    height: 5vh;
  }
}
</style>
