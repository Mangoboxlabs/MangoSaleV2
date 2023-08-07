<script>
import {uploadJson} from "@/utils/ipfsApi";
import {message} from "ant-design-vue";
import abiMap from "@/api/apiMap";
import {formatAddress} from "@/utils/formatUtils";
import BigNumber from "bignumber.js";
let timeOut = null
export default {
  name: "CreateLaunchpads",
  data() {
    return {
      formatAddress,
      BigNumber,
      abiMap,
      tokenContract: undefined,
      startTime: undefined,
      endTime: undefined,
      pricePresale: undefined,
      decreasePricePresale: undefined,
      startPricePresale: undefined,
      endPricePresale: undefined,
      paramsObj: {
        id: 0,
        owner: undefined,
        start_time: undefined,
        end_time: undefined,
        soft_cap: undefined,
        hard_cap: undefined,
        token: undefined,
        pay_token: undefined,
        minimum_purchase: undefined,
        maximum_purchase: undefined,
        project_info: undefined,

        amount: undefined,
      },
      tokenInfo: {},
      IPFSObj: {},
      stepIndex: 1,
      contractName: "Launchpad"
    }
  },
  created() {
    switch (this.$route.query.type) {
      case '1':
        this.contractName = "Launchpad"
        break
      case '2':
        this.contractName = "FairLaunchpad"
        break
      case '3':
        this.contractName = "DutchAuction"
        break
    }
  },
  computed: {
    account() {
      return this.$store.state.app.account
    },

  },
  watch: {
    $route() {
      if (this.$route.query.type) {
        switch (this.$route.query.type) {
          case '1':
            this.contractName = "Launchpad"
            break
          case '2':
            this.contractName = "FairLaunchpad"
            break
          case '3':
            this.contractName = "DutchAuction"
            break
        }
      }
    }
  },
  methods: {
    async checkAddress(e) {
      // console.log(this.$store.state.app.web3.utils.isAddress(address))
      let coin = await this.$store.dispatch("erc20/queryInfo", e.target.value)
      this.tokenInfo = coin
    },
    async approve() {
      return await this.$store.dispatch("erc20/approve", {
        spender: abiMap[this.contractName].address,
        value: ("1000000000000000000000").toString(),
        address: this.paramsObj.token.trim(),
      }).then(() => {
        return true
      }).catch(() => {
        return false
      })

    },
    async getAllowance() {
      let allowance = await this.$store.dispatch("erc20/allowance", {
        spender: abiMap[this.contractName].address,
        owner: this.account,
        address: this.paramsObj.token.trim(),
      })
      this.allowance = allowance.replace(/,/g, '')
    },
    checkStartPrice(e) {
      clearTimeout(timeOut)
      timeOut = setTimeout(() => {

        if (e.target.value < 1) {
          this.startPricePresale = 1
        }
        if (e.target.value < this.startPricePresale) {
          this.startPricePresale = this.endPricePresale + 1
        }

      }, 1000)
    },
    checkEndPrice(e) {
      clearTimeout(timeOut)
      timeOut = setTimeout(() => {

        if (e.target.value < 1) {
          this.endPricePresale = 1
        }
        if (e.target.value > this.startPricePresale) {
          this.endPricePresale = this.startPricePresale - 1
        }
      }, 1000)
    },
    checkPrice(e) {
      clearTimeout(timeOut)
      timeOut = setTimeout(() => {

        if (e.target.value < 1) {
          this.pricePresale = 1
        }

      }, 1000)
    },

    finish() {
      if (!this.paramsObj.owner) {
        this.paramsObj.owner = this.account
      }
      this.paramsObj.pay_token = this.paramsObj.token
      this.paramsObj.start_time = new Date(this.startTime).getTime()
      this.paramsObj.end_time = new Date(this.endTime).getTime()

      if (this.contractName == 'Launchpad') {
        this.paramsObj.price_presale = this.pricePresale
      }
      if (this.contractName == 'DutchAuction') {
        this.paramsObj.start_price = this.startPricePresale
        this.paramsObj.end_price = this.endPricePresale
        this.paramsObj.decrease_price_cycle = this.decreasePricePresale
      }

      if (!this.tokenInfo || !this.tokenInfo.name) {
        this.$eventBus.$emit('message', {
          message: "Please input right token ",
          type: "error"
        })
        return
      }
      if (!this.paramsObj.soft_cap) {
        this.$eventBus.$emit('message', {
          message: "Please input  softCap ",
          type: "error"
        })
        return
      }
      if (!this.paramsObj.minimum_purchase) {
        this.$eventBus.$emit('message', {
          message: "Please input  Minimum Purchase ",
          type: "error"
        })
        return
      }
      if (!this.paramsObj.maximum_purchase) {
        this.$eventBus.$emit('message', {
          message: "Please input  Maximum Purchase ",
          type: "error"
        })
        return
      }
      if (this.contractName == 'Launchpad' && !this.paramsObj.price_presale) {
        this.$eventBus.$emit('message', {
          message: "Please input   Price Presale ",
          type: "error"
        })
        return
      }
      if (!this.paramsObj.start_time) {
        this.$eventBus.$emit('message', {
          message: "Please choose right start time ",
          type: "error"
        })
        return
      }
      if (!this.paramsObj.end_time) {
        this.$eventBus.$emit('message', {
          message: "Please choose right end time ",
          type: "error"
        })
        return
      }

      //

      if (this.contractName == 'DutchAuction' && !this.startPricePresale) {
        this.$eventBus.$emit('message', {
          message: "Please input  Start Price Presale ",
          type: "error"
        })
        return
      }
      if (this.contractName == 'DutchAuction' && !this.decreasePricePresale) {
        this.$eventBus.$emit('message', {
          message: "Please input  Decrease Price Presale",
          type: "error"
        })
        return
      }
      if (this.contractName == 'DutchAuction' && !this.endPricePresale) {
        this.$eventBus.$emit('message', {
          message: "Please input  End Price Presale",
          type: "error"
        })
        return
      }
      this.stepIndex++

    },
    async handleSubmit() {
      const isP = await this.approve()
      if (!isP) {
        message.error("Approve fail")
        return
      }
      const hide = message.loading('Action in progress..', 0);
      const ipfsRes = await uploadJson(this.IPFSObj)
      this.paramsObj.project_info = ipfsRes.data.IpfsHash
      console.log(this.contractName)
      await this.$store.dispatch(this.contractName + "/create", this.paramsObj)
      setTimeout(hide, 1000);
      setTimeout(() => {
        this.$router.push("/Launchpads")
      }, 1000)
    }
  }
}
</script>

<template>
  <div class="CreateLaunchpads">
    <h2><strong>Create {{ this.contractName }}</strong></h2>
    <div v-show="stepIndex===1" class="create-panel part1">
      <div class="input-part">
        <div class="name">
          Token Contract Address
        </div>
        <a-input @input="checkAddress" v-model="paramsObj.token" placeholder="Address"/>
        <div class="token-info" v-if="tokenInfo">
          <div class="col">
            <div class="name">
              Name
            </div>
            <div class="value">
              {{ tokenInfo.name }}
            </div>
          </div>
          <div class="col">
            <div class="name">
              Decimal
            </div>
            <div class="value">
              {{ tokenInfo.decimals }}
            </div>
          </div>
          <div class="col">
            <div class="name">
              TotalSupply
            </div>
            <div class="value">
              {{ tokenInfo.totalSupply }}
            </div>
          </div>
        </div>
      </div>
      <a-button type="primary" @click="$router.push('/CreateToken')">
        Create Token
      </a-button>
      <div class="input-part" style="margin-top: 30px">
        <div class="name">
          Currency: USDT
        </div>
        <div class="info">
          Users can only pay for your tokens with USDT.
        </div>
      </div>
      <div class="input-part" v-if="contractName=='Launchpad'">
        <div class="name">
          Price Presale(min: 1)
        </div>
        <a-input @input="checkPrice" v-model="pricePresale" placeholder="Price"/>
        <div class="info">
          If I spend 1 USDT how many CTT tokens will I receive?
        </div>
      </div>
      <div class="com-input-part" v-if="contractName=='DutchAuction'">
        <div class="input-part">
          <div class="name">
            Start Price Presale
          </div>
          <a-input @input="checkStartPrice" v-model="startPricePresale" placeholder="Price"/>
          <div class="info">
            If I spend 1 USDT how many CTT tokens will I receive?(min:1)
          </div>
        </div>
        <div class="input-part">
          <div class="name">
            End Price Presale
          </div>
          <a-input @input="checkEndPrice" v-model="endPricePresale" placeholder="Price"/>
          <div class="info">
            End Price Presale should less than Start Price Presale
          </div>
        </div>

      </div>
      <div class="input-part" v-if="contractName=='DutchAuction'">
        <div class="name">
          Decrease Price Presale
        </div>
        <a-input v-model="decreasePricePresale" placeholder="0"/>
        S
        <div class="info">
          In seconds
        </div>
      </div>
      <div class="com-input-part">
        <div class="input-part">
          <div class="name">
            Soft Cap
          </div>
          <a-input v-model="paramsObj.soft_cap" placeholder="Cap"/>
          <div class="info">
            The minimum amount of
            USDT to raise funds, below
            this amount, the presale will
            fail.
          </div>
        </div>
        <div class="input-part" v-if="contractName!='FairLaunchpad'">
          <div class="name">
            Hard Cap
          </div>
          <a-input v-model="paramsObj.hard_cap" placeholder="Cap"/>
          <div class="info">
            Maximum amount raised in USDT.
          </div>
        </div>
      </div>

      <div class="com-input-part">
        <div class="input-part">
          <div class="name">
            Minimum purchase price
          </div>
          <a-input v-model="paramsObj.minimum_purchase" placeholder="0"/>
          <div class="info">
            Minimum amount of USDT
            purchased by a user.
          </div>
        </div>
        <div class="input-part">
          <div class="name">
            Maximum purchase price
          </div>
          <a-input v-model="paramsObj.maximum_purchase" placeholder="0"/>
          <div class="info">
            Maximum amount raised in USDT.
          </div>
        </div>
      </div>

      <div class="input-part">
        <div class="name">
          Amount
        </div>
        <a-input v-model="paramsObj.amount" placeholder="0"/>
        <div class="info">
          The pre-sale amount of the token.
        </div>
      </div>


      <div class="com-input-part">
        <div class="input-part">
          <div class="name">
            Start Time(UTC)
          </div>
          <a-date-picker show-time placeholder="Select Time" v-model="startTime"/>
        </div>

      </div>
      <div class="com-input-part">
        <div class="input-part">
          <div class="name">
            End Time(UTC)
          </div>
          <a-date-picker show-time placeholder="Select Time" v-model="endTime"/>
        </div>

      </div>

      <a-button class="next-btn" type="primary" @click="stepIndex++">
        Next
      </a-button>
    </div>

    <div v-show="stepIndex===2" class="create-panel part2">
      <div class="input-part">
        <div class="name">
          Name
        </div>
        <a-input v-model="IPFSObj.name" placeholder=""/>
      </div>
      <div class="input-part">
        <div class="name">
          Img Url
        </div>
        <a-input v-model="IPFSObj.logo" placeholder=""/>
      </div>
      <div class="input-part">
        <div class="name">
          Website
        </div>
        <a-input v-model="IPFSObj.website" placeholder=""/>
      </div>

      <div class="input-part">
        <div class="name">
          Github
        </div>
        <a-input v-model="IPFSObj.github" placeholder=""/>
      </div>
      <div class="input-part">
        <div class="name">
          Telegram
        </div>
        <a-input v-model="IPFSObj.telegram" placeholder=""/>
      </div>
      <div class="input-part">
        <div class="name">
          Twitter
        </div>
        <a-input v-model="IPFSObj.twitter" placeholder=""/>
      </div>
      <div class="btn-box">
        <a-button type="dashed" @click="stepIndex--">
          Previous
        </a-button>
        <a-button type="primary" class="finish-btn" @click="finish">
          Finish
        </a-button>
      </div>
    </div>

    <div v-show="stepIndex===3" class="create-panel part3">
      <div class="info-box">
        <div class="in-line">
          <div class="name">
            Presale Address
          </div>
          <div class="value">
            {{ formatAddress(abiMap[contractName].address) }}
          </div>
        </div>
        <div class="in-line">
          <div class="name">
            Token Name
          </div>
          <div class="value">
            {{ IPFSObj.name }}
          </div>
        </div>
        <div class="in-line">
          <div class="name">
            Token Address
          </div>
          <div class="value">
            {{ formatAddress(paramsObj.token) }}
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
        <div class="in-line" v-if="$route.query.type==1">
          <div class="name">
            Presale Rate
          </div>
          <div class="value" v-if="paramsObj.price_presale">
            1 USDT = {{ BigNumber(10 ** 6).div(BigNumber(paramsObj.price_presale.replace(/\,/g, ''))) }}
            {{ tokenInfo.symbol }}
          </div>
        </div>

        <div class="in-line">
          <div class="name">
            Soft Cap
          </div>
          <div class="value" v-if="$route.query.type!=0">
            {{
              paramsObj.soft_cap
            }}
          </div>
        </div>
        <div class="in-line" v-if="$route.query.type==1">
          <div class="name">
            Hard Cap
          </div>
          <div class="value">
            {{
              paramsObj.hard_cap
            }}
          </div>
        </div>
      </div>
      <div class="btn-box">
        <a-button type="dashed" @click="stepIndex--">
          Previous
        </a-button>
        <a-button class="submit-btn" type="primary" @click="handleSubmit()">
          Approve & Submit
        </a-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.CreateLaunchpads {
  width: 1200px;
  margin: 0 auto;
  padding-bottom: 60px;

  .btn-box {
    .ant-btn:last-child {
      margin-left: 20px;
    }
  }

  .part3 {
    .info-box {
      width: 600px;

      .in-line {
        width: 100%;
        display: flex;
        padding: 10px 0;
        justify-content: space-between;

        .name {
          font-size: 16px;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #ADADAD;
        }

        .value {
          font-size: 20px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #FFFFFF;
        }
      }
    }
  }

  .create-panel {
    margin-top: 20px;
    padding: 30px;
    background: #1D2833;
    border-radius: 10px;

    .token-info {
      display: flex;
      margin-top: 20px;

      .col {
        font-family: Roboto-Bold, Roboto;
        margin-right: 20px;

        .name {
          color: #999;
          font-size: 18px;
        }

        .value {
          font-size: 18px;
        }
      }
    }

    .input-part {
      margin-top: 20px;

      &:first-child {
        margin-top: 0;
      }

      .name {
        padding-bottom: 10px;
        font-size: 20px;
        font-family: Roboto-Bold, Roboto;
        font-weight: bold;
      }

      .info {
        margin-top: 10px;
        font-family: Roboto-Bold, Roboto;
        font-weight: bold;
        color: #707070;
      }

      input {
        width: 600px;
      }
    }

    .com-input-part {
      margin-top: 20px;
      display: flex;
      align-items: flex-start;

      .input-part {
        margin-top: 0;
        width: 300px;

        input {
          width: 90%;
        }
      }
    }

    .ant-btn {
      width: 200px;
      margin-top: 20px;
    }
  }
}
</style>