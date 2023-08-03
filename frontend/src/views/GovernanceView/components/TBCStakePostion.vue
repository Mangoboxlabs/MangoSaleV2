<template>
  <div class="position-detail staking" :class="{'active':activeStake==2}">
    <div class="position-detail-header">
      <div class="left">
        <div class="title">
          Stakes( {{ positionsList.staking.length }} )
        </div>
        <img src="@/assets/svg/down.svg" alt="" class="icon">
      </div>
    </div>
    <div v-show="activeStake==2">
      <template v-for="(stakeItem,index) in positionsList.staking" :key="index">
        <div class="position-detail-part">
          <div class="position-detail-info">
            <div class="info-item">
              <div class="name">
                Stake Period
              </div>
              <div class="value">
                {{ stakeItem.invest_day }}-Day
              </div>
            </div>
            <div class="info-item">
              <div class="name">
                Duration
              </div>
              <div class="value">
                {{ diffDay(stakeItem.invest_start) }} Day
              </div>
            </div>
            <div class="info-item">
              <div class="name">
                Maturity Date
              </div>
              <div class="value">
                {{ formatTime(stakeItem.maturity_date * 1000) }}-Day
              </div>
            </div>
            <div class="info-item">
              <div class="name">
                Staked Principal
              </div>
              <div class="value">
                {{ dealNum(stakeItem.initial_capital) }} TBC
              </div>
            </div>
            <div class="info-item">
              <div class="name">
                Rewards
              </div>
              <div class="value">
                {{ decimalsProfit(stakeItem.profit) }} TBC
              </div>
            </div>
          </div>
          <div class="automatic-bottom">
            <div class="left" @click="openNFTURL(stakeItem)">
              <img src="@/assets/images/opensea_icon.webp" alt="" class="icon">
              Opensea
            </div>
            <div class="right">
              Automatic Reinvestment
              <Switch class="switch" @change="stakeAutoChange(stakeItem)" :checked="stakeItem.auto_reinvestment == 1"/>
            </div>
          </div>
        </div>
      </template>
      <div v-if="positionsExtra.count" class="more-btn" @click="onLoadMore() "
           v-show="positionsList.staking.length < positionsExtra.count.staking">
        More
      </div>
    </div>
    <div class="dialog" v-show="showAuto">
      <div class="dialog-mask" @click="showAuto=false"></div>
      <div class="dialog-content  animate__fadeIn animate__animated">
        <div class="dialog-header">
          <div class="title">
            <span v-if="autoReinvestment == 1">Automatic Reinvestment</span>
            <span v-else>Cancel Reinvestment</span>
          </div>
          <img src="../../../assets/svg/close.svg" alt="" class="close"  @click="showAuto=false">
        </div>
        <div class="dialog-container stake_modal">
          <div class="enable_staking_content ">
                    <span v-if="autoReinvestment == 1"
                    >Once the current staking period ends, your principals and rewards will be reinvested in the next circle of the staking period automatically.</span
                    >
            <span v-else>By canceling the reinvestment, your assets will be unstaked and available for withdrawal once the current staking period ends.</span>
          </div>
          <div class="enable_staking_btn_wrap">
            <a-button class="primary-btn-sha" @click="changeAutoReInvestment()" :loading="isLoading">
              Understand
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import BigNumber from "bignumber.js";
import moment from "moment";
import {formatTime} from "@/utils/timeUtil";
import {getPositionsMore} from "@/api/govStakingApi";
import {message, Switch,} from "ant-design-vue"
import {confirmTransaction} from "@/api/common";
import bigNumberUtil from "@/utils/bigNumberUtil";
import addressMap from "@/abi/addressMap"
import {ChainIdMapByIdStake,} from "@/utils/constantData";
import {updateAutoReinvestment} from "@/api/govStakingApi";
import {ChainIdMapById} from "@/utils/constantData";

const calculator = new bigNumberUtil();
let now = parseInt(new Date().valueOf() / 1000);
export default {
  name: "TBCMaturePosition",
  props: ["activeStake"],
  components: {
    Switch
  },
  computed: {
    ...mapGetters(["account", "web3", "isConnected", "chainId", "usdtDecimal"]),
    positionsList() {
      return this.$store.state.TBCStake.positionsList
    },
    positionsExtra() {
      return this.$store.state.TBCStake.positionsExtra
    },
    tbcBalance() {
      return this.$store.state.app.tbcBalance
    },
    decimalsProfit() {
      return function (val) {
        if (!val) {
          return val == 0 ? '0.0000' : '-';
        }
        if (BigNumber(val).eq(0)) {
          return '0';
        }
        if (val < 0.0001) {
          return '< 0.0001';
        } else {
          return new BigNumber(val.toString()).toFixed(4);
        }
      };
    },
  },
  data() {
    return {
      showAuto: false,
      isSelectAll: false,
      isLoading: false,
      dealNum: calculator.dealNum,
      autoReinvestment: 0,
      loadingMore: false,
      curItem: undefined
    }
  },
  methods: {
    formatTime,
    stakeAutoChange(item) {
      this.autoReinvestment = item.auto_reinvestment == 1 ? '0' : '1';
      this.showAuto = true;
      this.curItem = item;
    },
    openNFTURL(item) {
      window.open(`https://opensea.io/assets/${ChainIdMapById[this.chainId]}/${addressMap[this.chainId].TBCStake}/${item.token_id}`, "_blank")
    },
    changeAutoReInvestment(){
      console.log(this.curItem)
      let item= this.curItem
      let chainName = ChainIdMapByIdStake[this.chainId]
      let autoReinvestment = !(item.auto_reinvestment==1 ? 1 : 0);
      let token_id = item.token_id;
      let datetime =
          moment()
              .utc()
              .format('YYYY-MM-DD HH:mm:ss') + ' UTC';
      const exampleMessage = `token_id:${token_id}\nchain:${chainName}\nautoReinvestment:${autoReinvestment}\ndatetime:${datetime}`;
      const msg = (this.web3.utils.utf8ToHex(exampleMessage)).toString('hex');
      window.ethereum
          .request({
            method: 'personal_sign',
            params: [msg, this.account],
          })
          .then((signature) => {
            updateAutoReinvestment({
              signature,
              token_id,
              chain: chainName,
              autoReinvestment: autoReinvestment,
              datetime,
            })
                .then(res => {
                  if (res.data.code == 0) {
                    this.showAuto = false;
                    item['auto_reinvestment'] = autoReinvestment ? '1' : '0';
                  } else {
                    message.error(res.data.msg)
                  }
                })
                .catch(() => {
                  message.error("Failed")
                });
          })
    },
    onLoadMore() {
      this.loadingMore = true
      getPositionsMore({
        address: this.account,
        chain: this.chainId,
        limit: '10',
        skip: this.positionsList.staking.length,
        type: "staking",
      }).then(({data, code}) => {
        let tempObj = this.positionsList
        if (code == 0) {
          tempObj.staking = tempObj.staking.concat(data);
        }
        this.$store.commit("TBCStake/SET_Positions", tempObj)
      }).finally(() => {
        this.loadingMore = false;
      });
    },
    dealCatchErr(e) {
      this.isLoading = false
      if (e.code === 4001) {
        message.error('User canceled  transaction');
        return;
      }
      if (e.message && e.message.indexOf("{") < 0) {
        message.error(e.message)
      } else {
        const err = JSON.parse(e.message.substr(e.message.indexOf("{"), e.message.length))
        this.isLoading = false
        if (err.originalError) {
          message.error(err.originalError.message)
        } else {
          message.error(e.message.substr(0, e.message.indexOf("{")))
        }

      }

    },
    async getTBCBalance() {
      const decimals = await this.$store.dispatch("erc20/decimals", {
        address: addressMap[this.chainId]["tbc"]
      })
      const balance = await this.$store.dispatch("erc20/balanceOf", {
        address: addressMap[this.chainId]["tbc"],
        account: this.account
      })

      this.$store.commit("TBCStake/SET_TBCBalance", calculator.divide(balance, BigNumber(10).pow(decimals)))
    },
    clickReStake(item) {
      console.log(item)
      this.$store.dispatch("TBCStake/reStake", {
        id: item.id,
        profit: item.profit,
        amount: item.amount,
        productId: item.product_id,
        autoReinvestment: item.autoReinvestment,
        signature: item.signature
      }).then(async tx => {
        this.$store.dispatch('app/getETHBalance');
        this.getTBCBalance()
        try {
          await confirmTransaction(tx.transactionHash);
          await this.getData();
          message.success('ReStake Success');
        } catch (err) {
          await this.$emit("updateDate");
        }
        this.isLoading = false;
      }).catch(e => {
        this.dealCatchErr(e)
      })
    },
    diffDay(timestamp) {
      return Math.ceil((now - timestamp) / 86400);
    },
  }
}
</script>
<style lang="scss" scoped>
.dialog-container {
  width: 500px;
  padding: 10px 30px 0;

  .enable_staking_title {
    color: #000;

    letter-spacing: 0;
    font-family: AvertaStd-Semibold;
  }

  .enable_staking_content {
    margin-top: 20px;
    color: #8f97aa;

  }

  .enable_staking_btn_wrap {
    width: 100%;
    display: flex;
    justify-content: center;

    .primary-btn-sha {
      margin: 30px auto 0px;
    }
  }
  @media screen and (max-width: 1000px) {
     width: 90vw;
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
        margin-left: 10px;
        width: 20px;
      }
    }

    .right {
      cursor: pointer;
      display: flex;
      font-size: 18px;
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

          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #999999;
        }

        .value {
          overflow-x: hidden;
          margin-top: 6px;

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

      font-family: Roboto-Bold, Roboto;
      color: #000000;
      border-top: 1px solid #D2D2D2;
      padding-top: 20px;

      .left {
        display: flex;
        align-items: center;
        font-weight: bold;
        cursor: pointer;

        .icon {
          width: 30px;
          height: 30px;
          margin-right: 10px;
          opacity: 1;

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

    text-align: center;
    font-family: Roboto-Medium, Roboto;
    cursor: pointer;
    line-height: 30px;
    font-weight: 500;
    color: #999999;
  }
}

@media screen and (max-width: 1000px) {
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
            overflow-x: hidden;
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
</style>
