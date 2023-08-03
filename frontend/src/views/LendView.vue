<template>
  <div class="LendView">
    <div class="lend-item" v-for="(item, index) in tokenList" :key="index">
      <div class="left-part">
        <div class="deposit-box">
          <img class="icon" :src="require('@/assets' + item.icon)" alt="" />
          <div class="deposit-content">
            <div class="name">Deposit APR</div>
            <div class="value">{{ showNumber(BigNumber(item.deposit_apy * 100).plus(item.deposit_reward_rate * 100)) }}%</div>
            <div class="apy-box pc">
              <div class="detail-apy">
                <div class="name">
                  Interest APR
                </div>
                <div class="info">
                  Earned in {{ item.name }}
                </div>
                <div class="val">
                  {{ showNumber(item.deposit_apy * 100) }}%
                </div>
              </div>
              <div class="detail-apy">
                <div class="name">
                  Reward APR
                </div>
                <div class="info">
                  Earned in TBC
                </div>
                <div class="val">
                  {{ showNumber(item.deposit_reward_rate * 100) }}%
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="apy-box m">
          <div class="detail-apy">
            <div class="name">
              Interest APR
            </div>
            <div class="info">
              Earned in {{ item.name }}
            </div>
            <div class="val">
              {{ showNumber(item.deposit_apy * 100) }}%
            </div>
          </div>
          <div class="detail-apy">
            <div class="name">
              Reward APR
            </div>
            <div class="info">
              Earned in TBC
            </div>
            <div class="val">
              {{ showNumber(item.deposit_reward_rate * 100) }}%
            </div>
          </div>
        </div>
        <div class="deposit-list">
          <div class="deposit-item">
            <div class="name">Total Deposit</div>
            <div class="value">
              {{ showNumber(item.aum) }}
            </div>
          </div>
          <div class="deposit-item">
            <div class="name">My Deposited</div>
            <div class="value">
              {{ showNumberDeposit(mul(item.balance, item.new_price)) }}
            </div>
          </div>
          <div class="deposit-item">
            <div class="name">Total Earnings</div>
            <div class="value">
              {{ showNumber(mul(item.balance, BigNumber(item.new_price).minus(item.cost_price))) }}
            </div>
          </div>
        </div>
      </div>
      <div class="right-part">
        <div class="right-nav">
          <div class="nav-item" :class="{ active: item.active != 1 }" @click="active: item.active = 0;">Deposit</div>
          <div class="nav-item" :class="{ active: item.active == 1 }" @click="active: item.active = 1;">Withdraw</div>
        </div>
        <!-- deposite -->
        <div class="deposit-operate-box" v-if="item.active != 1">
          <div class="input-header">
            <div class="name">Deposit</div>
            <div class="value">
              <span>Balance:</span>
              <strong class="value-content">
                <img class="icon" :src="require('@/assets' + item.icon)" alt="" />
                <strong>{{ showNumber(item.name == "ETH" ? ethBalance : usdtBalance) }}</strong>
              </strong>
            </div>
          </div>
          <div class="input-box">
            <input type="text" v-model="item.depositeAmount" />
            <div class="input-right-tip">
              <img class="icon" :src="require('@/assets' + item.icon)" alt="" />
              <strong>{{ item.tokenName }}</strong>
            </div>
          </div>
          <div class="choose-rate">
            <div
                class="rate"
                :class="{ active: item.depositRateActive == rate_item }"
                v-for="rate_item in rateIdx"
                :key="rate_item"
                @click="
                item.depositRateActive = rate_item;
                item.depositeAmount = mul(item.name == 'ETH' ? ethBalance : usdtBalance, rate_item, 3);
              "
            >
              {{ rate_item * 100 }}%
            </div>
          </div>
          <div>
            <a-button :loading="item.isLoading" class="primary-btn-sha" @click="deposit(item)">
              {{ depositName(item) }}
            </a-button>
          </div>
        </div>
        <!-- withdraw -->
        <div class="deposit-operate-box" v-else>
          <div class="input-header">
            <div class="name">Withdraw</div>
            <div class="value">
              <span>Amount:</span>
              <strong class="value-content">
                <img class="icon" :src="require('@/assets' + item.icon)" alt="" />
                <strong>{{ showNumber(canWithdrawBalance(item)) }}</strong>
              </strong>
            </div>
          </div>
          <div class="input-box">
            <input type="text" v-model="item.withdrawAmount" placeholder="0" />
<!--            <input type="text" v-model="item.withdrawAmount" :placeholder="placeholder(item)" />-->
            <div class="input-right-tip">
              <img class="icon" :src="require('@/assets' + item.icon)" alt="" />
              <strong>{{ item.tokenName }}</strong>
            </div>
          </div>
          <div class="choose-rate">
            <div
                class="rate"
                :class="{ active: item.withdrawRateActive == rate_item }"
                v-for="rate_item in rateIdx"
                :key="rate_item"
                @click="
                item.withdrawRateActive = rate_item;
                item.withdrawAmount = mul(canWithdrawBalance(item), rate_item, 3);
              "
            >
              {{ rate_item * 100 }}%
            </div>
          </div>
          <div>
            <a-button :loading="item.isLoading" class="primary-btn-sha" @click="withdraw(item)">
              Withdraw {{ item.tokenName }}
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import { mapGetters } from "vuex";
import addressMap from "@/abi/addressMap";
import { confirmTransaction } from "@/api/common";
import { ZeroAddress } from "@/config/constants";
import BigNumber from "bignumber.js";
import { getLendingData } from "@/api/homeApi";

BigNumber.set({
  ROUNDING_MODE: BigNumber.ROUND_DOWN
});
const MaxUint256 = BigNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").toFixed(0);
export default {
  name: "LendView",
  data() {
    return {
      amount: 0,
      BigNumber,
      allowanceBalance: 0,
      rateIdx: ["0.25", "0.50", "0.75", "1"],
      operateArr: [],
      tokenList: []
    };
  },
  computed: {
    ...mapGetters(["account", "web3", "ethBalance", "usdtBalance", "usdtDecimal", "isConnected", "chainId"])
  },
  watch: {
    account() {
      this.getData();
    },
    chainId() {
      this.getData();
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    canWithdrawBalance(item) {
      let number = BigNumber(item.balance).multipliedBy(item.new_price);
      if (number.isNaN()) {
        return "0";
      }
      let max = BigNumber(BigNumber(number.toFixed(5, BigNumber.ROUND_HALF_UP)).toFixed(4)).toString();
      return this.min(item.pool_balance, max);
    },
    min(num1, num2) {
      return BigNumber(num1).lt(num2) ? num1 : num2;
    },
    depositName(item) {
      let needApprove;
      if (item.underlying === ZeroAddress) {
        needApprove = false;
      } else {
        needApprove = BigNumber(item.allowance).lt(!item.depositeAmount ? 1 : item.depositeAmount);
      }
      return needApprove ? "Approve & Deposit" : "Deposit";
    },
    placeholder(item) {
      if (BigNumber(item.pool_balance).gte(this.mul(item.balance, item.new_price, 3))) {
        return "";
      }
      return "Max withdraw amount:" + BigNumber(item.pool_balance).toFixed(3);
    },
    showNumber(number) {
      number = BigNumber(number);
      if (number.isNaN()) {
        return "0";
      }
      return BigNumber(number.toFixed(3)).toString();
    },
    showNumberDeposit(number) {
      number = BigNumber(number);
      if (number.isNaN()) {
        return "0";
      }
      if (number != 0 && number.lt(BigNumber(0.001))) {
        return "<0.001";
      }
      return BigNumber(BigNumber(number.toFixed(5, BigNumber.ROUND_HALF_UP)).toFixed(3)).toString();
    },
    mul(number1, number2, decimal = 18) {
      return BigNumber(number1).multipliedBy(number2).toFixed(decimal);
    },
    async getAllowance(underlying) {
      let result = await this.$store.dispatch("erc20/allowance", {
        owner: this.account,
        spender: addressMap[this.chainId]["vault"],
        address: underlying
      });
      return result.toString();
    },
    async getBalance() {
      if (this.$store.state.app.isConnected) {
        await this.$store.dispatch("usdt/getMyDecimals");
        this.$store.dispatch("usdt/getMyBalance");
        this.$store.dispatch("app/getETHBalance");
      }
    },
    async deposit(item) {
      if (!this.account) {
        message.error("Please connect the wallet first");
        return;
      }
      if (!this.isConnected) {
        message.error("Wrong network");
        return;
      }
      let value = 0;
      let amount = BigNumber(item.depositeAmount);
      if (amount.isNaN() || amount.lte(0)) {
        message.error("Enter a amount");
        return;
      }
      let balance;
      if (item.underlying === ZeroAddress) {
        balance = this.ethBalance;
      } else {
        balance = this.usdtBalance;
      }
      if (amount.gt(balance)) {
        message.error("Insufficient balance");
        return;
      }

      try {
        if (item.isLoading) {
          return;
        }
        item.isLoading = true;
        let allowance = item.allowance;
        if (item.underlying !== ZeroAddress && BigNumber(allowance).lt(amount)) {
          await this.$store.dispatch("erc20/approve", {
            spender: addressMap[this.chainId]["vault"],
            amount: MaxUint256,
            address: item.underlying
          });
          allowance = BigNumber((await this.getAllowance(item.underlying)).toString())
              .div(BigNumber(10).pow(item.decimal))
              .toFixed(18);
          item.allowance = allowance;
        }
        if (item.underlying !== ZeroAddress && BigNumber(allowance).lt(amount)) {
          message.error("Insufficient allowance");
          item.isLoading = false;
          return;
        }
        amount = amount.multipliedBy(BigNumber(10).pow(item.decimal)).toFixed(0);
        if (item.underlying === ZeroAddress) {
          value = amount;
        }
        this.$store
            .dispatch("vault/deposit", {
              value,
              _underlying: item.underlying,
              _amount: amount
            })
            .then(async (tx) => {
              this.getBalance();
              try {
                await confirmTransaction(tx.transactionHash);
                await this.getData();
                message.success("Deposit Success");
              } catch (err) {
                console.log(err);
                await this.getData();
              }
              item.isLoading = false;
            })
            .catch((e) => {
              item.isLoading = false;
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
            });
      } catch (e) {
        item.isLoading = false;
        if (e.code === 4001) {
          message.error("User canceled  transaction");
          return;
        }
        console.log(e);
        if (e.message) {
          message.error(e.message);
        } else {
          JSON.parse(e.message.substr(24, e.message.length)).message;
        }
      }
    },
    withdraw(item) {
      if (item.isLoading) {
        return;
      }
      let amount = BigNumber(item.withdrawAmount);
      if (amount.isNaN() || amount.lte(0)) {
        message.error("Enter a amount");
        return;
      }
      let balance = this.canWithdrawBalance(item);
      if (amount.gt(balance)) {
        message.error("Insufficient balance");
        return;
      }
      if (amount.isEqualTo(BigNumber(balance).toFixed(3))) {
        amount = BigNumber(balance);
      }
      let _share = amount.div(item.new_price)
          .multipliedBy(BigNumber(10).pow(item.decimal))
          .toFixed(0);
      try {
        item.isLoading = true;
        this.$store
            .dispatch("vault/withdraw", {
              _underlying: item.underlying,
              _share: _share
            })
            .then(async (tx) => {
              this.getBalance();
              try {
                await confirmTransaction(tx.transactionHash);
                await this.getData();
                message.success("Withdraw Success");
              } catch (err) {
                await this.getData();
              }
              item.isLoading = false;
            })
            .catch((e) => {
              item.isLoading = false;
              if (e.code == 4001) {
                message.error("User canceled  transaction");
                return;
              }
              console.log(e);
              if (e.message && e.message.indexOf("{") < 0) {
                message.error(e.message);
              } else {
                const err = JSON.parse(e.message.substr(e.message.indexOf("{"), e.message.length));
                message.error(err.originalError.message);
              }
            });
      } catch (e) {
        item.isLoading = false;
        if (e.code == 4001) {
          message.error("User canceled  transaction");
          return;
        }
        message.info(e.message);
      }
    },
    async getData() {
      if (!this.account) {
        const result = await getLendingData();
        const code = result.data.code;
        const data = result.data.data;
        this.tokenList = data;
        if (code != 0) {
          return;
        }
        return;
      }
      if (!this.chainId) {
        return;
      }
      this.getBalance();
      const result = await getLendingData(this.chainId, this.account);
      const code = result.data.code;
      const data = result.data.data;
      if (code != 0) {
        return;
      }
      let oldTokenList = this.tokenList;
      let reserveKeys = ["active"];
      if (oldTokenList && oldTokenList.length > 0) {
        for (let index = 0; index < oldTokenList.length; index++) {
          for (let i in reserveKeys) {
            let key = reserveKeys[i];
            data[index][key] = oldTokenList[index][key];
          }
        }
      }
      this.tokenList = data;
      for (let i in data) {
        if (data[i].underlying != ZeroAddress) {
          this.tokenList[i].allowance = BigNumber((await this.getAllowance(data[i].underlying)).toString())
              .div(BigNumber(10).pow(data[i].decimal))
              .toFixed(18);
        } else {
          this.tokenList[i].allowance = MaxUint256;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.LendView {
  .lend-item {
    margin: 30px auto;
    width: var(--content-width);
    background: #ffffff;
    box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.05);
    border-radius: 20px 20px 20px 20px;
    border: 1px solid #e2e2e2;
    padding: 50px;
    display: flex;
    .apy-box.m{
      display: none;
    }
    .left-part {
      width: 50%;
      padding-right: 40px;
      border-right: 1px solid #e2e2e2;


      .deposit-box {
        display: flex;

        .icon {
          width: 60px;
          height: 60px;
          margin-right: 20px;
          opacity: 1;
        }

        .deposit-content {
          .name {
            font-size: 15px;
            font-family: Roboto-Medium, Roboto;
            font-weight: 500;
            color: #999999;
          }

          .value {
            display: flex;
            align-items: center;
            font-size: 22px;
            font-family: Roboto-Black, Roboto;
            font-weight: 900;
            margin-top: 6px;
            color: #000000;
          }
        }
      }

      .deposit-list {
        margin-top: 50px;
        display: flex;
        justify-content: space-between;

        .deposit-item {
          .name {
            font-size: 15px;
            font-family: Roboto-Medium, Roboto;
            font-weight: 500;
            color: #999999;
          }

          .value {
            display: flex;
            align-items: center;
            margin-top: 20px;
            font-size: 18px;
            font-family: Roboto-Black, Roboto;
            font-weight: 900;
            color: #333333;
          }
        }
      }
    }

    .right-part {
      width: 50%;
      padding-left: 40px;

      .right-nav {
        width: 100%;
        display: flex;
        border-bottom: 1px solid #e2e2e2;

        .nav-item {
          cursor: pointer;
          width: 100px;
          padding-bottom: 10px;
          font-size: 13px;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          text-align: center;
          user-select: none;

          &.active {
            color: #ffc600;
            border-bottom: 2px solid #ffc600;
          }
        }
      }

      .deposit-operate-box {
        width: 100%;

        .input-header {
          margin-top: 20px;
          width: 100%;
          display: flex;
          justify-content: space-between;

          .name {
            font-size: 15px;
            font-family: Roboto-Bold, Roboto;
            font-weight: bold;
            color: #000000;
          }

          .value {
            display: flex;
            align-items: center;

            .value-content {
              display: flex;
              align-items: center;
              color: #333;
            }

            span {
              font-size: 12px;
              font-family: Roboto-Medium, Roboto;
              font-weight: 500;
              color: #999;
            }

            .icon {
              width: 15px;
              height: 15px;
              margin: -1px 5px 0 12px;
            }
          }
        }

        .input-box {
          height: 44px;
          background: #f1f1f1;
          border-radius: 50px 50px 50px 50px;
          margin-top: 20px;
          position: relative;

          input {
            width: 100%;
            height: 100%;
            background: none;
            padding: 0 20px;
            font-size: 18px;
            font-weight: bold;
          }

          .input-right-tip {
            position: absolute;
            right: 20px;
            top: 11px;
            display: flex;
            align-items: center;
            font-size: 16px;
            padding-left: 20px;
            border-left: 1px solid #dadada;

            .icon {
              width: 22px;
              height: 22px;
              margin-right: 6px;
            }
          }
        }

        .choose-rate {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 10px 0 20px 0;

          .rate {
            width: 20%;
            min-height: 30px;
            height: 3vh;
            background: #f1f1f1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50px 50px 50px 50px;
            font-size: 14px;
            font-family: Roboto-Medium, Roboto;
            font-weight: 500;
            cursor: pointer;
            user-select: none;

            &.active {
              background: linear-gradient(225deg, #ffab00 0%, #ffc600 100%);
            }
          }
        }

        .primary-btn-sha {
          height: 5.5vh;
          max-height: 60px;
          color: #613a00;
          min-height: 40px;
          width: 100%;
          font-family: RussoOneRegular, Russo One;

          &.disable {
            cursor: default;
            background: lightgray !important;

            &:after {
              background: lightgray !important;
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 1000px) {
    .lend-item {
      display: block;
      padding: 3vh 5vw;

      .left-part,
      .right-part {
        width: 100%;
        padding: 0;
      }

      .left-part {
        border-right: none;
        .apy-box.m{
          display: block;
          margin-top: 20px;
        }
        .deposit-box {
          .icon {
            width: 15vw;
            height: 15vw;
          }

          .deposit-content {
            .name {
              font-size: 3.8vw;
            }
            .apy-box.pc{
              display: none;
            }


            .value {
              font-size: 6vw;
            }
          }
        }

        .deposit-list {
          padding-bottom: 3vh;

          .deposit-item {
            .name {
              font-size: 3.8vw;
            }

            .value {
              font-size: 5vw;
            }
          }
        }
      }

      .right-part {
        .right-nav {
          .nav-item {
            width: 22vw;
            font-size: 4vw;
            min-width: 80px;
          }
        }

        .deposit-operate-box {
          .input-header {
            .name {
              font-size: 5vw;
            }

            .value {
              font-size: 3.8vw;

              span {
                font-size: 4vw;
              }
            }
          }
        }
      }
    }
  }
}
</style>
