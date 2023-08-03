<template>
  <div class="GovernanceView">
    <div class="governance-content">
      <div class="title">
        Governance
      </div>
      <div class="nav-list">
        <div class="nav-item" :class="{'active':activeNav=='claim'}" @click="$router.push('/governance/claim')">
          TBC Claim
        </div>
        <div class="nav-item" :class="{'active':activeNav=='staking'}" @click="$router.push('/governance/staking')">
          TBC Staking
        </div>
<!--        <div class="nav-item" :class="{'active':activeNav=='proposal'}" @click="$router.push('/governance/proposal')">-->
<!--          Proposal-->
<!--        </div>-->
      </div>
      <ClaimableView v-show="activeNav=='claim'"/>
      <StakeView v-show="activeNav=='staking'"/>
      <ProposalView v-show="activeNav=='proposal'"/>
    </div>
  </div>
</template>

<script>
import StakeView from "@/views/GovernanceView/StakeView";
import ProposalView from "@/views/GovernanceView/ProposalView";
import ClaimableView from "@/views/GovernanceView/ClaimableView";
import {mapGetters} from "vuex";
import addressMap from "@/abi/addressMap";
import bigNumberUtil from "@/utils/bigNumberUtil";
const calculator = new bigNumberUtil();
import BigNumber from "bignumber.js";
export default {
  name: "GovernanceView",
  components: {StakeView, ProposalView, ClaimableView},
  data() {
    return {
      activeNav: 1
    }
  },
  computed: {
    ...mapGetters(["account", "isConnected", "chainId", "onRightChain"]),
    tbcBalance() {
      return this.$store.state.app.tbcBalance
    },

  },
  watch: {
    account() {
      this.getData()
    },
    chainId() {
      this.getData()
    },
    isConnected() {
      this.getData()
    },
    $route(){
      this.activeNav = this.$route.params.id
    }
  },
  methods: {
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
    async getData(){
      if(!this.isConnected){
        return
      }
      this.$store.dispatch("rewardPool/getRewardData")
      this.getTBCBalance()
    },

  },
  created() {
    this.getData()
    this.activeNav = this.$route.params.id
  }
}
</script>

<style lang="scss" scoped>
.GovernanceView {
  .governance-content {
    width: var(--content-width);
    margin: 0 auto;
    padding: 50px 0 100px;
  }

  .title {
    font-size: 28px;
    font-family: Roboto-SemiBold, Roboto;
    font-weight: 600;
    color: #000000;
  }

  .nav-list {
    display: flex;
    margin: 30px 0;

    border-bottom: 1px solid #E2E2E2;

    .nav-item {
      font-size: 18px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #333333;
      padding: 20px 26px;
      cursor: pointer;

      &.active {
        color: #FFC001;
        border-bottom: 1px solid #FFC600;
      }
    }
  }

  @media screen and (max-width: 1000px) {
    .title {
      font-size: 6vw;
    }
    .nav-list {
      margin-top: 0;

      .nav-item {
        padding: 2vh 3vw;
      }
    }
  }
}
</style>
