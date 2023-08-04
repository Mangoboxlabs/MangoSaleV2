<template>
  <div class="DetailView">
    <h2><strong>{{ this.contractName }}</strong></h2>
    <div class="header-part" v-if="projectInfo">
      <div class="logo">
        <img :src="projectInfo.logo" alt="">
      </div>
      <div class="header-content">
        <div class="name">
          {{ projectInfo.name }}
        </div>
        <div class="value" style="margin-top: 20px;display: flex">
          <div class="col" v-if="projectInfo.github " >
            Github: <a target="_blank" :href="'https://github.com/'+projectInfo.github">{{ projectInfo.github }}</a>
          </div>
          <div class="col"  v-if="projectInfo.twitter ">
            Twitter: <a target="_blank"
                        :href="'https://twitter.com/' +projectInfo.twitter ">{{ projectInfo.twitter }}</a>
          </div>
          <div class="col" v-if="projectInfo.website ">
            Website: <a :href="projectInfo.website" target="_blank">{{ projectInfo.website }}</a>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-content">
      <div class="left-part">
        <div class="in-line">
          <div class="name">
            Presale Address
          </div>
          <div class="value">
            {{ formatAddress(PresaleAddress) }}
          </div>
        </div>
        <div class="in-line">
          <div class="name">
            Token Name
          </div>
          <div class="value">
            {{ tokenInfo.name }}
          </div>
        </div>
        <div class="in-line">
          <div class="name">
            Token Address
          </div>
          <div class="value">
            {{ formatAddress(projectObj.token) }}
          </div>
        </div>
        <div class="in-line">
          <div class="name">
            Token Decimals
          </div>
          <div class="value">
            {{ tokenInfo.decimals }}
          </div>
        </div>

        <div class="in-line">
          <div class="name">
            Total Supply
          </div>
          <div class="value">
            {{ tokenInfo.totalSupply }}
          </div>
        </div>
        <div class="in-line" v-if="projectObj.type==1">
          <div class="name">
            Presale Rate
          </div>
          <div class="value" v-if="projectObj.pricePresale">
            1 USDT = {{ BigNumber(10 ** 6).div(BigNumber(projectObj.pricePresale.replace(/\,/g, ''))) }}
            {{ tokenInfo.symbol }}
          </div>
        </div>

        <div class="in-line">
          <div class="name">
            Soft Cap
          </div>
          <div class="value" v-if="projectObj">
            {{
              projectObj.softCap
            }}
          </div>
        </div>
        <div class="in-line" v-if="projectObj.type==1">
          <div class="name">
            Hard Cap
          </div>
          <div class="value">
            {{
              projectObj.hardCap
            }}
          </div>
        </div>


      </div>
      <div class="right-part">
        <div class="title">
          Countdown
        </div>
        <div class="time-box" v-if="countdownT&&countdownT!=1">
          {{ countdownT.hours }}:{{ countdownT.minutes }}:{{ countdownT.secs }}
        </div>
        <div class="time-box" v-if="!countdownT">
          End
        </div>
        <div class="time-box" v-if="countdownT== 1">
          Not Start
        </div>

        <div class="percentage" v-if="projectObj.amount">
          <div class="progress-header">
            <div class="left">
              Percentage
            </div>
            <div class="right">{{ showNum(poolBalance / projectObj.amount.replace(/,/g, '') * 100) }}%</div>
          </div>
          <div class="progress-box">
            <div class="progress" :style="'width:' + poolBalance / projectObj.amount.replace(/,/g, '') * 100 + '%'">
            </div>
          </div>
          <div class="progress-bottom">
            <div class="left">
              {{ poolBalance }}
            </div>
            <div class="right">
              {{ projectObj.amount }}
            </div>
          </div>
        </div>
        <div class="buy-box">
          <div class="input-header">
            <div class="left">
              Balance
            </div>
            <div class="right">
              {{ balance }} {{ tokenInfo.symbol }}
            </div>
          </div>
          <div class="input-box">
            <a-input class="amount-input" @input="checkInput" v-model="amount"
                     :placeholder="projectObj.minimumPurchase + '~' + projectObj.maximumPurchase"/>
            <div class="max-btn" @click="amount=(projectObj.maximumPurchase - reward)">
              Max
            </div>
          </div>
          <div class="input-bottom">
            <div class="left">
              minimum/maximum Purchase
            </div>
            <div class="right">
              {{ projectObj.minimumPurchase }} / {{ projectObj.maximumPurchase }}
            </div>
          </div>
          <div class="operate-btns" v-if="countdownT&&countdownT!=1">
            <a-button v-if="allowance<amount*10**decimals" type="primary" @click="approve">Approve</a-button>
            <a-button  v-else type="primary" @click="buy">Buy</a-button>
          </div>
          <template v-if="!countdownT">
            <a-button disabled="" type="primary">End</a-button>
          </template>
          <template v-if="countdownT==1">
            <a-button disabled="" type="primary"> Not Start</a-button>
          </template>

        </div>
      </div>
    </div>
    <div class="detail-content">
      <div class="left-part">
        <div class="in-line">
          <div class="name">
            Start Time(UTC)
          </div>
          <div class="value" v-if="projectObj.startTime">
            {{
              new Date(projectObj.startTime.replace(/,/g, '') * 1)
            }}
          </div>
        </div>
        <div class="in-line">
          <div class="name">
            End Time(UTC)
          </div>
          <div class="value" v-if="projectObj.endTime">
            {{
              new Date(projectObj.endTime.replace(/,/g, '') * 1)
            }}
          </div>
        </div>
      </div>
      <div class="right-part">
        <div class="user-box">
          <div class="in-line">
            <div class="name">
              Status
            </div>
            <div class="right">

            </div>
          </div>
          <div class="in-line">
            <div class="name">
              Minimum purchase
            </div>
            <div class="value">
              {{ projectObj.minimumPurchase }} {{ tokenInfo.symbol }}
            </div>
          </div>
          <div class="in-line">
            <div class="name">
              Maximum purchase
            </div>
            <div class="value">
              {{ projectObj.maximumPurchase }} {{ tokenInfo.symbol }}
            </div>
          </div>
          <div class="in-line">
            <div class="name">
              You Purchased
            </div>
            <div class="value">
              {{ reward }}
            </div>
          </div>
          <div class="in-line">
            <div class="name">

            </div>
            <div class="val"
                 v-if="!countdownT  &&projectObj && (projectObj.softCap > 0) && BigNumber(projectObj.softCap.replace(/,/g, '')).lt(this.totalPerchase)">
              <a-button @click="claim">Claim</a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {getIpfs} from "@/utils/ipfsApi";
import BigNumber from "bignumber.js";
import abiMap from "@/api/apiMap";
import {formatAddress, showNum} from "@/utils/formatUtils";

import {message} from "ant-design-vue";
// const MaxUint256 = BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff').toFixed(0);
export default {
  name: "DetailView",
  data() {
    return {
      showNum,
      formatAddress,
      PresaleAddress: abiMap["Launchpad"].address,
      contractName: "Launchpad",
      BigNumber,
      amount: undefined,
      countDown: null,
      projectObj: {},
      projectInfo: {},
      reward: 0,
      countdownT: null,
      decimals: 10,
      allowance: 0,
      balance: 0,
      tokenInfo: {},
      checkTimeout: null,
      poolBalance: 0,
      totalPerchase: 0
    }
  },
  watch: {
    account() {
      this.getData()
    }
  },
  computed: {
    account() {
      return this.$store.state.app.account
    },

  },
  async created() {
    this.getData()

    this.countDown = setInterval(async () => {
      this.countdownT = this.getEndTime(this.projectObj)
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.countDown)
  },
  methods: {
    async getReward() {
      const reward = await this.$store.dispatch(this.contractName + "/getReward", this.projectObj.id)
      this.reward = reward
    },
    async claim() {
      await this.$store.dispatch(this.contractName + "/claim", {
        id: this.projectObj.id,
      })
      this.getBalance()
      this.getReward()
    },
    checkInput() {
      clearTimeout(this.checkTimeout)
      this.checkTimeout = setTimeout(() => {
        if (BigNumber(this.amount).lt(this.projectObj.minimumPurchase)) {
          this.amount = this.projectObj.minimumPurchase
        }
        if (BigNumber(this.amount).gt(this.projectObj.maximumPurchase)) {
          this.amount = this.projectObj.maximumPurchase
        }
      }, 1000)
    },
    async approve() {
      await this.$store.dispatch("erc20/approve", {
        spender: this.PresaleAddress,
        value: (this.amount * 10 ** this.decimals).toString(),
        address: this.projectObj.token.trim(),
      })
      this.getAllowance()
    },
    async getPoolBalance() {
      let res = await this.$store.dispatch(this.contractName + "/getPresaleCharge", {
        id: this.projectObj.id,
      })
      this.poolBalance = BigNumber(this.projectObj.amount.replace(/,/g, '')).minus(res).toLocaleString()
      this.totalPerchase = res
    },
    async getBalance() {
      let res = await this.$store.dispatch("erc20/balanceOf", {
        owner: this.account,
        address: this.projectObj.token.trim(),
      })
      this.balance = res.replace(/,/g, '')
    },
    async getAllowance() {
      console.log(this.PresaleAddress)
      let allowance = await this.$store.dispatch("erc20/allowance", {
        spender: this.PresaleAddress,
        owner: this.account,
        address: this.projectObj.token.trim(),
      })
      console.log(allowance)
      this.allowance = allowance.replace(/,/g, '')
    },
    async buy() {
      this.checkInput()
      if (this.amount > (this.projectObj.maximumPurchase - this.reward)) {
        message.error("Insufficient quota")
        return
      }
      await this.$store.dispatch(this.contractName + "/buy", {
        id: this.projectObj.id,
        // .multipliedBy(10 ** this.decimals)
        amount: BigNumber(this.amount).toFixed(0)
      })
      this.getData()
    },
    async getData() {
      const projectInfo = await getIpfs(this.$route.params.projectInfo)

      if (projectInfo) {
        this.projectInfo = projectInfo.data

      }
      this.projectObj = this.$route.params
      console.log(this.projectObj)
      switch (this.$route.params.type) {
        case 1:
          this.PresaleAddress = abiMap["Launchpad"].address
          this.contractName = "Launchpad"
          break
        case 2:
          this.PresaleAddress = abiMap["FairLaunchpad"].address
          this.contractName = "FairLaunchpad"
          break
        case 3:
          this.PresaleAddress = abiMap["DutchAuction"].address
          this.contractName = "DutchAuction"
          break
      }

      const coinInfo = await this.$store.dispatch("erc20/queryInfo", this.projectObj.token)
      this.decimals = coinInfo.decimals
      await this.getAllowance()
      this.getBalance()
      this.getReward()
      this.getPoolBalance()
      this.tokenInfo = coinInfo
      if (this.projectObj.minimumPurchase) {
        this.projectObj.minimumPurchase = this.projectObj.minimumPurchase.replace(/,/g, '')

      }
      if (this.projectObj.maximumPurchase) {
        this.projectObj.maximumPurchase = this.projectObj.maximumPurchase.replace(/,/g, '')

      }
    },
    getEndTime(item) {
      const now = new Date().getTime()
      if(item.startTime){
        const diff = BigNumber(item.startTime.replace(/,/g, '')).minus(now)
        if(diff >=0){
          return 1
        }
      }
      if (!item.endTime) {
        return false
      }
      const diff = BigNumber(item.endTime.replace(/,/g, '')).minus(now)
      if (!diff) {
        return false
      }
      if (diff < 0) {
        return false
      }
      let seconds = Math.ceil(diff / 1000);
      let hours = Math.floor(seconds / 3600);
      hours = hours < 10 ? "0" + hours : hours;
      seconds = seconds % 3600;
      let minutes = Math.floor(seconds / 60);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds % 60;
      let secs = seconds < 10 ? "0" + seconds : seconds;
      return {
        hours,
        minutes,
        secs
      };
    },
  }
}
</script>
<style scoped lang="scss">
.DetailView {
  width: 1200px;
  margin: 20px auto;

  .header-part {
    display: flex;
    background: #1D2833;
    padding: 30px 20px;
    border-radius: 10px;

    .logo {
      width: 79px;
      height: 79px;
      border-radius: 50%;
      background: #D8D8D8;
      border: 1px solid #979797;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .header-content {
      margin-left: 10px;

      .name {
        font-size: 20px;
        font-family: Roboto-Bold, Roboto;
        font-weight: bold;
      }

      .value {
        font-size: 16px;
        font-family: Roboto-Bold, Roboto;
        font-weight: bold;
        color: #D1D1D1;

        .col {
          margin-right: 20px;
        }
      }
    }
  }

  .detail-content {
    margin-top: 20px;
    display: flex;

    .in-line {
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;

      .name {
        font-size: 18px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #ADADAD;
      }

      .value {
        font-size: 18px;
        font-family: Roboto-Bold, Roboto;
        font-weight: bold;
        color: #FFFFFF;
      }
    }

    .left-part {
      background: #1D2833;
      border-radius: 10px;
      padding: 30px 20px;
      flex-grow: 1;

    }

    .right-part {
      background: #1D2833;
      border-radius: 10px;
      padding: 30px 20px;
      width: 350px;
      margin-left: 20px;

      .title {
        font-size: 20px;
        text-align: center;
        padding-bottom: 10px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #ADADAD;
      }

      .time-box {
        text-align: center;
        font-size: 20px;
      }

      .buy-box {
        border-top: 1px solid #eee;
        margin-top: 20px;
        padding-top: 20px;
      }

      .input-header {
        display: flex;
        justify-content: space-between;

        .left {
          font-size: 20px;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #ADADAD;
        }

        .right {
          font-size: 20px;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #FFFFFF;
        }
      }

      .input-box {
        margin-top: 10px;
        height: 42px;
        position: relative;

        .ant-input {
          height: 100%;
          border-radius: 30px;
        }

        .max-btn {
          position: absolute;
          right: 6px;
          top: 5px;
          width: 80px;
          height: 30px;
          cursor: pointer;
          line-height: 30px;
          text-align: center;
          background: linear-gradient(225deg, #54D500 0%, #2AAA00 100%);
          border-radius: 25px;
        }
      }

      .input-bottom {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;

        .left {
          font-weight: 500;
          color: #ADADAD;
        }
      }

      .ant-btn {
        width: 100%;
        margin-top: 20px;
      }
    }
  }
}
</style>