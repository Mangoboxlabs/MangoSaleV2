<template>
  <div class="TBCMaturePosition">
    <div class="position-detail" :class="{'active':activeStake==1}">
      <div class="position-detail-header">
        <div class="left">
          <div class="title">
            Matured Stakes ( {{ positionsList.matured.length }} )
          </div>
          <img src="@/assets/svg/down.svg" alt="" class="icon">
        </div>
        <div class="right" @click="selectAllClick">
          <div class="check-box">
            <div class="checked" v-show="isSelectAll"></div>
          </div>
          All
        </div>
      </div>
      <div v-show="activeStake==1">
        <template v-for="(item,index) in positionsList.matured" :key="index">
          <div class="position-detail-part" v-if="index < positionsExtra.count.matured">
            <div class="position-detail-info">
              <div class="info-item">
                <div class="name">
                  Stake Period
                </div>
                <div class="value">
                  {{ item.invest_day }}-Day
                </div>
              </div>
              <div class="info-item">
                <div class="name">
                  Duration
                </div>
                <div class="value">
                  {{
                    diffDay(item.invest_start)
                  }} Day
                </div>
              </div>
              <div class="info-item">
                <div class="name">
                  Maturity Date
                </div>
                <div class="value">
                  {{ formatTime(item.maturity_date) }}
                </div>
              </div>
              <div class="info-item">
                <div class="name">
                  Staked Principal
                </div>
                <div class="value">
                  {{ dealNum(item.initial_capital) }} TBC
                </div>
              </div>
              <div class="info-item">
                <div class="name">
                  Rewards
                </div>
                <div class="value">
                  {{ decimalsProfit(item.profit) }}TBC
                </div>
              </div>
            </div>
            <div class="operate-box" v-show="!isSelectAll">
              <button class="primary-btn-sha" @click="clickShowRestake(item)" :loading="item.isLoading">
                Restake
              </button>
              <button class="primary-btn-sha">
                Withdraw
              </button>
            </div>
            <div class="operate-box" v-show="isSelectAll&&index==(positionsExtra.count.matured-1)">
              <button class="primary-btn-sha">
                Restake
              </button>
              <button class="primary-btn-sha">
                Withdraw
              </button>
            </div>
          </div>
        </template>
        <div v-if="positionsExtra.count" class="more-btn" @click="onLoadMore() "
             v-show="positionsList.matured.length > positionsExtra.count.matured">
          More
        </div>
      </div>
    </div>
    <div class="dialog" v-show="showStake">
      <div class="dialog-mask" @click="showStake=false"></div>
      <div class="dialog-content  animate__fadeIn animate__animated">
        <div class="dialog-header">
          <div class="title">
            Stake Period
          </div>
          <img src="../../../assets/svg/close.svg" alt="" class="close" @click="showStake=false">
        </div>
        <div class="dialog-container stake_modal">
          <div class="day-list">
            <div class="list-item"
                 v-for="product in productList"
                 :key="product.product_id"
                 :class="{'active': product_id == product.product_id}"
                 @click="changePeriod(product.product_id)"
            >

              <h3>{{ product.day }}-Day</h3>
              <p>
                <span>{{ product.apy > 0 ? product.apy + '%' : '-' }}</span>
              </p>
            </div>
          </div>
          <div class=" input-box-header" v-if="!isSelectAll">
            <h3>Total Amount:</h3>
            <p>
              {{ dealNum(showTicketBalance) }}
              <small>TBC</small>
            </p>
          </div>
          <div class="input-box" :class="{ 'trade-input-all': isSelectAll }">
            <input type="number" step="any" v-model="reStakeAmount">
            <div class="right-tip">
              <img src="@/assets/images/coin-logo.webp"  class="select-icon icon" alt="">
            </div>
          </div>
          <div class="stake-auto">
            <div>
              <Checkbox @change="autoChange" :defaultChecked="true">
                Automatic Reinvestment
              </Checkbox>

              <span class="stake-content-tooltip">
                      <Tooltip
                          placement="bottom"
                          title="Once the current staking period ends, your principals and rewards will be reinvested in the next circle of the staking period automatically."
                      >
                          <img src="~@/assets/svg/question.svg" class="icon" width="20" height="20"/>
                      </Tooltip>
                  </span>
            </div>
          </div>
          <div class="stake-button">
            <a-button class="primary-btn-sha" v-if="desireChainId != chainId || !account" @click="connectWallet()">
              Connect Wallet
            </a-button>
            <a-button class="primary-btn-sha" disabled="disabled" v-else-if="reStakeAmount > parseFloat(showTicketBalance.toFixed(4))">
              Insufficient TBC Balance
            </a-button>
            <a-button
                class="primary-btn-sha"
                v-else-if="reStakeAmount === '.' || reStakeAmount === '' || reStakeAmount === null || reStakeAmount == 0"
                disabled="disabled">
              Enter an amount
            </a-button>
            <a-button
                class="primary-btn-sha"
                v-else-if="reStakeAmount < 1" disabled="disabled">
              {{ less1 }}
            </a-button>
            <a-button
                class="primary-btn-sha"
                v-else @click="isSelectAll ? reinvestBatch(ticket_ids) : clickReStake()"
                      :loading="isLoading">
              Stake
            </a-button>
          </div>
          <div class="stake-date">
            <label>Maturity Date (UTC)</label>
            <p :class="{ auto: autoChecked }">
              {{ formatTime(addDay(product_id)) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {formatTime} from "@/utils/timeUtil";
import bigNumberUtil from "@/utils/bigNumberUtil";
import BigNumber from "bignumber.js"
import {confirmTransaction} from "@/api/common";
import {message, Tooltip, Checkbox} from "ant-design-vue";
import addressMap from "@/abi/addressMap";
import {getPositionsMore} from "@/api/govStakingApi";

const calculator = new bigNumberUtil();

let now = parseInt(new Date().valueOf() / 1000);

export default {
  name: "TBCMaturePosition",
  props: ["activeStake"],
  components:{Tooltip,Checkbox},
  computed: {
    ...mapGetters(["account", "web3", "isConnected", "chainId", "usdtDecimal", "desireChainId"]),
    positionsList() {
      return this.$store.state.TBCStake.positionsList
    },

    productList() {
      return this.$store.state.TBCStake.productList
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
          return val === 0 ? '0.0000' : '-';
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
      isSelectAll: false,
      dealNum: calculator.dealNum,
      loadingMore: false,
      showStake: false,
      reStakeAmount: undefined,
      less1: 'Amount < 1',
      curItem: undefined,
      showTicketBalance: BigNumber(0),
      ticket_ids:[],
      product_id: undefined,
      isLoading: false,
      autoChecked:false
    }
  },
  methods: {
    formatTime,
    reinvestBatch() {

    },
    autoChange(e) {
      this.autoChecked = e.target.checked;
    },
    connectWallet() {

    },
    selectAllClick() {
      this.isSelectAll = !this.isSelectAll;
      this.positionsList.matured.forEach((item) => {
        if (this.isSelectAll) {
          this.ticket_ids.push(item.ticket_id);
          const itemBalance = BigNumber(item.initial_capital).plus(item.profit);
          this.allTicketBalance = this.allTicketBalance.plus(itemBalance);
        } else {
          this.ticket_ids = [];
          this.allTicketBalance = BigNumber(0);
        }
      });
    },
    clickShowRestake(item) {
      this.reStakeAmount = '';
      this.showStake = true;
      this.curItem = item;
      this.showTicketBalance = BigNumber(item.initial_capital).plus(item.profit);
    },
    onLoadMore() {
      this.loadingMore = true
      getPositionsMore({
        address: this.account,
        chain: this.chainType,
        limit: '10',
        skip: this.positionsList.matured.length,
        type: "matured",
      }).then(({data, code}) => {
        let tempObj = this.positionsList
        if (code == 0) {
          tempObj.matured = tempObj.matured.concat(data);
        }
        this.$store.commit("TBCStake/SET_Positions", tempObj)
      }).finally(() => {
        this.loadingMore = false;
      });
    },
    addDay(product_id) {
      let index = this.productList.findIndex((item) => item.product_id == product_id);
      if (index == -1) {
        return '-';
      }
      let day = this.productList[index]['day'];
      return now + day * 86400 + 86400;
    },
    changePeriod(val) {
      this.product_id = val;
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
  .input-box-header {
    display: flex;
    justify-content: space-between;
    padding: 20px 0 0 0;
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

      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #333333;

      .icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }

      span {

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

      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #333333;

      .icon {
        width: 20px;
        height: 20px;
        margin-right: 6px;
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
  .stake-auto{
    padding: 10px 0;
    display: flex;
    align-items: center;
  }
  .stake-button{
    width: 100%;
    display: flex;
    padding: 10px 0;
    justify-content: center;
    .primary-btn-sha{
      padding: 0 30px;
    }
  }
  .stake-date{
    display: flex;
    justify-content: space-between;
  }
  .day-list {
    display: flex;
    justify-content: space-between;
    .list-item {
      width: 22%;
      border: 1px solid #eee;
      border-radius: 10px;
      padding: 10px;
      &.active{
        border: 1px solid #333;
        box-shadow: 0 0 5px #eee;
      }
    }
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

        .icon {
          width: 30px;
          height: 30px;
          margin-right: 10px;
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
