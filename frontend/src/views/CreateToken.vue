<template>
  <div class="CreateToken">
    <h1>Create Token</h1>
    <div class="panel-box">
      <div class="title">
        Token
      </div>
      <div class="input-box">
        <div class="name">
          Name
        </div>
        <input type="text" v-model="tokenParams.name" placeholder="Token Name">
      </div>
      <div class="input-box">
        <div class="name">
          Symbol
        </div>
        <input type="text" v-model="tokenParams.symbol" placeholder="Token Symbol">
      </div>
      <div class="input-box">
        <div class="name">
          Decimals
        </div>
        <input type="number" v-model="tokenParams.decimals" placeholder="Token Decimals">
      </div>
      <div class="input-box">
        <div class="name">
          Supply
        </div>
        <input type="number" placeholder="Token Supply" v-model="tokenParams.initial_supply">
      </div>
    </div>
    <div class="panel-box">
      <div class="title">
        Transfer Fee
      </div>

      <div class="inline-input-box">
        <div class="name">
          Burn Tax
        </div>
        <input type="text" placeholder=""  v-model="tokenParams.burn_tax">
      </div>
      <div class="inline-input-box">
        <div class="name">
          Marketing Tax
        </div>
        <input type="text" placeholder="Marketing Tax" v-model="tokenParams.marketing_tax">
      </div>

      <h3 style="font-size: 22px">Marketing Wallet</h3>
      <div class="inline-input-box">
        <div class="name">
          Address
        </div>
        <input type="text" placeholder="Marketing Wallet Add"  v-model="tokenParams.marketing_address">
      </div>
    </div>
    <div class="panel-box">
      <div class="title">
        Functional Limitation
      </div>
      <div class="inline-input-box">
        <div class="name">
          Transfer limit
        </div>
        <el-switch
            v-model="isShow1"
            active-color="#13ce66"
            inactive-color="#ff4949">
        </el-switch>
      </div>
      <div class="inline-input-box" v-show="isShow1">
        <div class="name">
          Max Amounts
        </div>
        <input type="text" placeholder="Marketing Wallet Add"  v-model="tokenParams.transfer_limit">
      </div>
      <div class="inline-input-box">
        <div class="name">
          Wallet limit
        </div>
        <el-switch
            v-model="isShow2"
            active-color="#13ce66"
            inactive-color="#ff4949">
        </el-switch>
      </div>
      <div class="inline-input-box" v-show="isShow2">
        <div class="name">
          Wallet limit
        </div>
        <input type="text" placeholder="Marketing Wallet Add"  v-model="tokenParams.wallet_limit">
      </div>
    </div>
    <div class="mangobox-button" @click="createToken">
      CREATE
    </div>
  </div>
</template>

<script>
import abiMap from "../api/apiMap";
export default {
  name: "CreateToken",
  data() {
    return {
      isShow1:false,
      isShow2:false,
      tokenParams:{
        erc20_code_hash: abiMap.Erc20Hash.address,
        version: parseInt(new Date().getTime() /1000).toString(),
        initial_supply: undefined,
        name:undefined,
        symbol:undefined,
        decimals:undefined,
        owner:"",
        burn_tax:0,
        marketing_tax:0,
        marketing_address:"",
        transfer_limit:0,
        wallet_limit:0
      }
    }
  },
  computed: {
    account() {
      return this.$store.state.app.account
    }
  },
  watch: {
    account() {
      this.getUserTokens()
    }
  },
  created() {
    this.getUserTokens()
  },
  methods: {
    async getUserTokens() {
      let res = await this.$store.dispatch("tokenFactory/getUserTokens", this.$store.state.app.account)
      console.log(res)

      this.list = res
    },
    async createToken() {
      if(!this.tokenParams.name){
        this.$eventBus.$emit('message', {
          message: "Please token name ",
          type: "error"
        })
        return
      }
      if(!this.tokenParams.symbol){
        this.$eventBus.$emit('message', {
          message: "Please token symbol ",
          type: "error"
        })
        return
      }
      if(!this.tokenParams.decimals){
        this.$eventBus.$emit('message', {
          message: "Please token symbol ",
          type: "error"
        })
        return
      }
      if(!this.tokenParams.initial_supply){
        this.$eventBus.$emit('message', {
          message: "Please token supply ",
          type: "error"
        })
        return
      }

      console.log(this.tokenParams.version)
      this.tokenParams.owner = this.$store.state.app.account
      if(!this.$store.state.app.account){
        this.$eventBus.$emit('message', {
          message: "Please connect  ",
          type: "error"
        })
        return
      }
      //erc20_code_hash, version, initial_supply, name, symbol, decimals, owner
      await this.$store.dispatch("tokenFactory/newErc20", this.tokenParams)
      this.$router.push("/Token")
    }
  }
}
</script>

<style lang="scss" scoped>
.CreateToken {
  width: 1200px;
  margin: 20px auto;
  .inline-input-box{
    width: 600px;
   justify-content: space-between;
  }
  .mangobox-button {
    width: 240px;
    height: 50px;
    margin-top: 2em;
  }

}
</style>
