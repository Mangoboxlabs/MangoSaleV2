<template>
  <div class="StakeView">
    <EmailSignDialog v-show="showSign" @closeDialog="showSign=false" @updateData="handleEmailUpdate"/>
    <StakeNFTDialog
        v-if="showStakeNFT"
        :priceMap="priceMap"
        :availableLoanArr="availableLoanArr"

        :tokensData="tokensData"
        @updateData="getData"
        @initData="initData"
        ref="StakeDialog"
        :curIdentify="curIdentify"
        @closeDialog="initData();showStakeNFT=false;"/>
    <Popup round
           position="bottom" v-model:show="showMStakeNFT" class="stake-dialog-m">

      <StakeNFTDialog
          @closeDialog="initData();showMStakeNFT=false"
          :priceMap="priceMap"
          :availableLoanArr="availableLoanArr"

          @initData="initData"
          :tokensData="tokensData"
          @updateData="getData"
          ref="StakeDialog"
      />
    </Popup>
    <div class="stake-content">
      <div class="top-part">
        <div class="top-part-item">
          <img src="../../assets/images/stake_top_icon1.webp" alt="" class="icon">
          <div class="name">
            Available NFTs
          </div>
          <div class="value">
            {{ dealNum(stakeData.stats.nft_count) }}
          </div>
        </div>
        <div class="top-part-item">
          <img src="../../assets/images/stake_top_icon2.webp" alt="" class="icon">
          <div class="name">
            My NFT Staking
          </div>
          <div class="value">
            {{ dealNum(stakeData.stats.staking_count) }}
          </div>
        </div>
        <div class="top-part-item">
          <img src="../../assets/images/stake_top_icon3.webp" alt="" class="icon">
          <div class="name">
            My NFT Near Liquidation
          </div>
          <div class="value">
            {{ dealNum(stakeData.stats.closeToLiquidation) }}
          </div>
        </div>
        <div class="top-part-item stake-btn">
          <div class="primary-btn-sha stake-pc border" @click="stake()">
            Stake
          </div>
          <div class="primary-btn-sha stake-m border" @click="mstake()">
            Stake
          </div>
        </div>
      </div>
      <div class="stake-list">
        <div class="stake-item" v-for="(item,index) in stakeData.nft_list" :key="index">
          <div class="stake-item-header">
            <img class="bg" :src="require('@/assets'+item.background)" alt="">
            <div class="logo-box">
              <img class="logo" :src="require('@/assets'+item.icon)" alt="">
            </div>
            <div class="name">
              {{ item.name }}
            </div>
          </div>

          <div class="stake-item-content">
            <div class="stake-item-part1">
              <div class="item">
                <div class="name">
                  Total Staking
                </div>
                <div class="value-box scan-box" @click="goScan(item)">
                  <strong>
                    {{ dealNum(item.total_staking) }}
                  </strong>
                  <img style="margin-left: 10px" class="icon coinIcon" src="../../assets/svg/etherscan.svg" alt="">
                </div>
              </div>
              <div class="item">
                <div class="name">
                  Total Staked Value
                </div>
                <div class="value-box">
                  <img class="icon coinIcon" src="../../assets/svg/usdt.svg" alt="">
                  <strong>
                    {{ dealNum(item.staked_value) }}
                  </strong>
                </div>
              </div>
              <div class="item">
                <div class="name">
                  Total Borrowed
                </div>
                <div class="value-box">
                  <img class="icon coinIcon" src="../../assets/svg/usdt.svg" alt="">
                  <strong>
                    {{ dealNum(item.borrow_sum) }}
                  </strong>
                </div>
              </div>
            </div>
            <div class="stake-item-part2">
              <div class="item">
                <div class="name">
                  Floor Price
                </div>
                <div class="item-content">
                  <div class="value-box" v-for="(flItem,index) in item.floor_price" :key="index">
                    <img class="icon coinIcon" :src="require('@/assets'+flItem.icon)" alt="">
                    <strong>
                      {{ dealNum(flItem.value) }}
                    </strong>
                  </div>
                </div>
              </div>
              <div class="item">
                <div class="name">
                  Loan to Value
                </div>
                <div class="item-content loan-value-box">
                  <div class="value-box">
                    <strong>{{ dealNum(item.max_borrow_rate * 100) }}% </strong>
                    <span class="incr" v-if="item.tbc_incr_rate>0"> + {{ dealNum(item.tbc_incr_rate * 100) }}%</span>
                  </div>
                  <div class="value">
                    <div class="value-box" v-for="(bItem ,index) in item.max_borrow" :key="index"
                    >
                      <!--                        :class="{'blue':bItem.name=='ETH','green':bItem.name=='USD'}"-->
                      <img class="icon coinIcon" :src="require('@/assets'+bItem.icon)" alt="">
                      {{ dealNum(bItem.value) }}
                      <span class="incr gray" v-if="item.tbc_incr_rate>0"> + {{ dealNum(bItem.plus) }} </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="item">
                <div class="name">
                  Available NFTs
                </div>
                <div class="value-box">
                  <strong>
                    {{ dealNum(item.wallet_nft) }}
                  </strong>
                </div>
              </div>
            </div>
            <div class="primary-btn-sha stake-pc border" @click="stake(item)">
              Stake
            </div>
            <div class="primary-btn-sha stake-m border" @click="mstake(item)">
              Stake
            </div>
          </div>
        </div>
      </div>
      <div class="sub-title flex-title" id="position">
        Position
        <div class="list-choose-box">
          <div class="list-choose" :class="{active:listActive==1}" @click="listActive=1">
            <img src="../../assets/svg/list.svg" alt="">
          </div>
          <div class="list-choose" :class="{active:listActive==2}" @click="listActive=2">
            <img src="../../assets/svg/listmenu.svg" alt="">
          </div>
        </div>
      </div>


      <div class="nav-list">

        <div class="tabs-box">
          <div class="tabs">
            <div @click="activeNav=1;activeIndex1=0" :class="{active:activeNav==1}" class="tab">All</div>

            <div @click="activeNav='ETH';activeIndex1=1" :class="{active:activeNav=='ETH'}" class="tab"> ETH</div>

            <div @click="activeNav='USDT';activeIndex1=2" :class="{active:activeNav=='USDT'}" class="tab"> USDT</div>
            <span class="glider" :style="`transform:translateX(${activeIndex1*130}px)`"></span>
          </div>
        </div>
      </div>
      <div class="position-list">
        <div class="list-box" v-show="listActive==2">
          <PositionItem  :listActive="listActive" :nowTime="nowTime" @updateData="getStakeData" :availableLoanArr="availableLoanArr" :dataObj="item"
                         v-for="(item,index) in curPositions" :key="index"/>
        </div>
        <PositionItem  v-show="listActive==1" :listActive="listActive" :nowTime="nowTime" @updateData="getStakeData" :availableLoanArr="availableLoanArr" :dataObj="item"
                      v-for="(item,index) in curPositions" :key="index"/>
        <div class="nodata-box" v-show="curPositions.length==0">
          <img src="@/assets/images/nodata.png" alt="">
          <span>No Data</span>
        </div>
      </div>
      <div class="sub-title flex-title" id="market">
        Market
        <div class="list-choose-box">
          <div class="list-choose" :class="{active:listActive2==1}" @click="listActive2=1">
            <img src="../../assets/svg/list.svg" alt="">
          </div>
          <div class="list-choose" :class="{active:listActive2==2}" @click="listActive2=2">
            <img src="../../assets/svg/listmenu.svg" alt="">
          </div>
        </div>
      </div>
      <div class="nav-list">
        <div class="tabs-box">
          <div class="tabs">
            <div @click="activeMarketNav=1;activeIndex2=0" :class="{active:activeMarketNav==1}" class="tab">All</div>
            <div @click="activeMarketNav='ETH';activeIndex2=1" :class="{active:activeMarketNav=='ETH'}" class="tab">
              ETH
            </div>
            <div @click="activeMarketNav='USDT';activeIndex2=2" :class="{active:activeMarketNav=='USDT'}" class="tab">
              USDT
            </div>
            <span class="glider" :style="`transform:translateX(${activeIndex2*130}px)`"></span>
          </div>
        </div>
      </div>


      <div class="position-list">
        <div class="list-box" v-show="listActive2==2">
          <MarketItem  :listActive="listActive2" @updateData="getStakeData" :availableLoanArr="availableLoanArr" :dataObj="item"
                       v-for="(item,index) in curMarkets" :key="index"/>
        </div>
        <MarketItem  v-show="listActive2==1" :listActive="listActive2" @updateData="getStakeData" :availableLoanArr="availableLoanArr" :dataObj="item"
                    v-for="(item,index) in curMarkets" :key="index"/>
        <div class="nodata-box" v-show="curMarkets && curMarkets.length==0">
          <img src="@/assets/images/nodata.png" alt="">
          <span>No Data</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StakeNFTDialog from "@/views/StakeView/components/StakeNFTDialog";
import PositionItem from "@/views/StakeView/components/PositionItem";
import {Popup} from "vant";
import {mapGetters} from "vuex";
import bigNumberUtil from "@/utils/bigNumberUtil";
import EmailSignDialog from "@/components/EmailSignDialog";
import {message} from "ant-design-vue";
import addressMap from "@/abi/addressMap";
import {EthscanUrlByChainId} from "@/utils/constantData";
import {USDByChainId} from "@/utils/constantData";
import MarketItem from "@/views/StakeView/components/MarketItem.vue";

const calculator = new bigNumberUtil();
let countdown = null;
export default {
  name: "StakeView",
  components: {StakeNFTDialog, PositionItem, Popup, EmailSignDialog, MarketItem},
  data() {
    return {
      nowTime: new Date().getTime(),
      USDByChainId,
      showSign: false,
      dealNum: calculator.dealNum,
      activeNav: 1,
      activeMarketNav: 1,
      activeIndex2: 0,
      activeIndex1: 0,
      curIdentify: undefined,
      showMStakeNFT: false,
      showStakeNFT: false,
      availableLoanArr: [0, 0,],
      priceMap: {},
      identifyArr: [],
      onGettingData: false,
      listActive:1,
      listActive2:1,
    };
  },
  created() {
    this.getData();

  },
  computed: {
    ...mapGetters(["account", "web3", "isConnected", "chainId"]),
    onRightChain() {
      return this.$store.state.app.onRightChain;
    },
    curEmail() {
      return this.$store.state.app.curEmail;
    },
    tbcStaking() {
      return this.$store.state.app.tbcStaking;
    },
    tokensData() {
      return this.$store.state.stake.tokensData;
    },
    stakeData() {
      return this.$store.state.stake.stakeData;
    },
    curMarkets() {
      if (this.activeMarketNav == 1) {
        return this.stakeData.markets;
      }

      let arr = [];
      this.stakeData.markets.forEach(item => {
        if (item.underlying.name == this.activeMarketNav) {
          arr.push(item);
        }
      });
      return arr;
    },
    curPositions() {
      if (this.activeNav == 1) {
        return this.stakeData.positions;
      }

      let arr = [];
      this.stakeData.positions.forEach(item => {
        if (item.underlying.name == this.activeNav) {
          arr.push(item);
        }
      });
      return arr;
    }
  },
  watch: {
    account() {
      this.getData();
    },
    isConnected() {
      this.getData();

    },
    chainId() {
      this.getData();
    },
    $route() {
      if (this.$route.query.type === "market") {
        document.documentElement.scrollTo({
          top: document.getElementById("market").getBoundingClientRect().top,
          behavior: 'smooth'
        });
      }
      if (this.$route.query.type === "position") {
        document.documentElement.scrollTo({
          top: document.getElementById("position").getBoundingClientRect().top,
          behavior: 'smooth'
        });
      }
    }
  },
  methods: {
    goScan(item) {
      if (!this.onRightChain) {
        return;
      }
      window.open(EthscanUrlByChainId[this.chainId] + 'token/' + item.address + '?a=' + addressMap[this.chainId].stake);
    },
    handleEmailUpdate() {
      this.showStakeNFT = true;
      // this.stakeData.email = email;
      this.$store.dispatch("app/getPersonInfo");
    },

    dealOpenInit(item) {
      if (this.$refs.StakeDialog && !item) {
        this.$refs.StakeDialog.initChooseAllLand = true;
        this.$refs.StakeDialog.initChooseAllEstate = true;
      }
      if (item && item.name) {
        this.curIdentify = item.name;
        this.$refs.StakeDialog.initChooseAllLand = false;
        this.$refs.StakeDialog.initChooseAllEstate = false;

        if (this.$refs.StakeDialog) {
          this.$refs.StakeDialog.activeIndex = "Land";
        }
      } else {
        return;
      }

      this.identifyArr.forEach(item => {
        if (item.name == this.curIdentify) {
          item.isChoosedType = true;
        }
        this.tokensData.land.forEach(item => {
          if (item.name == this.curIdentify) {
            item.isChoosedType = true;
          } else {
            item.isChoosedType = false;
          }
        });
      });
    },
    stake(item) {

      if (!this.isConnected) {
        message.info("Please connect");
        return;
      }
      // if (this.onGettingData) {
      //   //message.info("Getting data")
      //   return;
      // }
      this.curIdentify = undefined;
      // if (!this.curEmail) {
      //   this.showSign = true;
      //   return;
      // }

      this.showStakeNFT = true;
      this.$nextTick(() => {
        this.dealOpenInit(item);
      });

    },
    mstake(item) {
      if (!this.isConnected) {
        message.info("Please connect");
        return;
      }
      // if (this.onGettingData) {
      //   //message.info("Getting data")
      //   return;
      // }
      this.curIdentify = undefined;
      // if (!this.curEmail) {
      //   this.showSign = true;
      //   return
      // }
      this.showMStakeNFT = true;

      this.$nextTick(() => {
        this.dealOpenInit(item);
      });
    },
    async getStakeData() {

      this.onGettingData = true;
      await this.$store.dispatch("stake/getStakeData");
      this.onGettingData = false;
    },
    async getData() {
      this.getStakeData();

      if (!this.isConnected) {
        return;
      }

      // if (!(this.tokensData.nfts_count > 0)) {
      //   await this.$store.dispatch("stake/getTokenData");
      // }
      await this.$store.dispatch("stake/getTokenData");

      this.initData();
      await this.getISAllowance();


    },
    async getISAllowance() {
      if (!this.isConnected) {
        message.info("Please connect");
        return;
      }
      for (const item of this.tokensData.land) {
        const res = await this.$store.dispatch("erc721/isApprovedForAll", {
          address: item.contract,
          owner: this.account,
          operator: addressMap[this.chainId]["stake"]
        });
        item.isApproved = res;
      }
      for (const item of this.tokensData.estates) {
        const res = await this.$store.dispatch("erc721/isApprovedForAll", {
          address: item.contract,
          owner: this.account,
          operator: addressMap[this.chainId]["stake"]
        });
        item.isApproved = res;
      }
    },
    initData() {
      if (this.tokensData.pools) {
        this.tokensData.pools.forEach(item => {
          if (item.underlying == "0x0000000000000000000000000000000000000000") {
            this.availableLoanArr[0] = item.max_borrow;
          } else {
            this.availableLoanArr[1] = item.max_borrow;
          }
          this.priceMap[item.name] = item.price;
        });
      }
      this.identifyArr = [];
      if (this.$refs.StakeDialog) {
        this.$refs.StakeDialog.canLoanValue = 0;
        this.$refs.StakeDialog.collateralsValue = 0;
      }

      if (this.tokensData.land && this.tokensData.land.length > 0) {
        let identifyArrTemp = [];
        this.tokensData.land.forEach(item => {
          if (identifyArrTemp.indexOf(item.name) < 0) {
            identifyArrTemp.push(item.name);
          }
          item.isChoosedType = true;
          // item.nfts.forEach(nft => {
          //   nft.choosed = false;
          // });
        });


        identifyArrTemp.forEach(item => {
          this.identifyArr.push({name: item, isChoosedType: false});
        });
      }

      if (this.tokensData.estates.length > 0) {
        let identifyArrTemp = [];
        this.tokensData.estates.forEach((item,) => {
          item.isChoosedType = true;
          if (identifyArrTemp.indexOf(item.name) < 0) {
            identifyArrTemp.push(item.name);
          }

        });

      }
    }
  },
  mounted() {
    countdown = setInterval(() => {
      this.nowTime = new Date().getTime();
    }, 1000);
    if (this.$route.query.type === "market") {
      document.documentElement.scrollTo({
        top: document.getElementById("market").getBoundingClientRect().top,
        behavior: 'smooth'
      });
    }
    if (this.$route.query.type === "position") {
      document.documentElement.scrollTo({
        top: document.getElementById("position").getBoundingClientRect().top,
        behavior: 'smooth'
      });
    }
  },
  beforeUnmount() {
    clearInterval(countdown);
  },

};
</script>

<style lang="scss" scoped>

.StakeView {
  .tabs-box {

    .tabs {
      display: flex;
      position: relative;
      user-select: none;
    }

    .tabs * {
      z-index: 2;
    }

    .tab {
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(#666, 0.1);
      width: 120px;
      height: 40px;
      margin-right: 10px;
      font-weight: 500;
      border-radius: 99px;
      cursor: pointer;
      font-size: 16px;

      &.active {
        color: #111;
        background: none;
      }

      &:hover {
        color: #333333;
        background-color: #FFAB00;
        opacity: 0.7;
      }
    }

    .glider {
      position: absolute;
      display: flex;
      width: 120px;
      height: 40px;

      background: linear-gradient(225deg, #ffab00 0%, #ffc600 100%);
      z-index: 1;
      border-radius: 99px;
      transition: 0.25s ease-out;
    }
  }

  .nav-list {
    width: var(--content-width);
    margin: 0 auto;
    display: flex;

    .nav-item {
      width: 10vw;
      min-width: 120px;
      max-width: 200px;
      height: 50px;
      border-radius: 30px 30px 30px 30px;
      margin-right: 10px;

      font-weight: 500;
      font-size: 18px;
      line-height: 50px;
      user-select: none;
      text-align: center;
      font-family: Roboto-Medium, Roboto;
      color: #333333;
      background: #E2E2E2;
      cursor: pointer;

      &.active {
        background: linear-gradient(225deg, #FFAB00 0%, #FFC600 100%);
      }
    }
  }

  .sub-title {
    width: var(--content-width);
    margin: 0 auto;
    font-size: 30px;
    font-family: Roboto-SemiBold, Roboto;
    font-weight: 600;
    color: #000000;
    line-height: 35px;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .stake-content {
    padding-bottom: 100px;

    .top-part {
      background: url("../../assets/images/stake_top_bg.webp") no-repeat;
      background-size: 100% 100%;
      width: var(--content-width);
      height: 20vw;
      max-height: 360px;
      box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.05);
      border-radius: 20px;
      opacity: 1;
      margin: 30px auto 50px;
      padding: 3vw 6vw;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .top-part-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: Roboto-Medium, Roboto;

        .primary-btn-sha {
          width: 160px;
          height: 50px;
          background: linear-gradient(225deg, #FFAB00 0%, #FFC600 100%);
          border-radius: 30px 30px 30px 30px;
          line-height: 50px;
        }

        .icon {
          width: 66px;
          height: 66px;
          opacity: 1;
        }

        .name {
          font-size: 16px;
          font-weight: 500;
          color: #C0C0C0;
          margin: 20px 0;
        }

        .value {
          font-size: 28px;
          font-weight: 900;
          line-height: 40px;
          background: linear-gradient(225deg, #FFAB00 0%, #FFC600 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }

    .stake-list {
      width: var(--content-width);
      margin: 50px auto;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;

      .stake-item {
        width: 32%;
        margin-left: 2%;
        background: #FFFFFF;
        box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.05);
        border-radius: 20px 20px 20px 20px;
        border: 1px solid #E2E2E2;
        padding-bottom: 40px;

        &:nth-child(3n+1) {
          margin-left: 0;
        }

        &:nth-child(n+4) {
          margin-top: 10px;
        }

        .stake-item-content {
          margin: 0 auto;

          .value {
            .value-box {
              margin-top: 3px !important;
              white-space: nowrap;
            }
          }
        }

        .stake-item-header {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;

          .bg {
            width: 100%;
          }

          .logo-box {
            margin-top: -50px;
            z-index: 1;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: #fff;
            user-select: none;
            padding: 4px;

            .logo {
              width: 100%;
              height: 100%;
            }

          }

          .name {
            margin-top: 20px;
            font-size: 20px;
            font-family: Roboto-Black, Roboto;
            font-weight: 900;
            color: #000000;
            line-height: 28px;
          }
        }

        .stake-item-part1, .stake-item-part2 {
          display: flex;
          margin: 20px 6% 0;
          padding-bottom: 15px;
          border-bottom: 1px solid #E2E2E2;
          justify-content: space-between;

          .item {
            text-align: justify;

            .name {
              white-space: nowrap;
              font-size: 12px;
              font-family: Roboto-Medium, Roboto;
              font-weight: 500;
              color: #999999;
            }

            .icon {
              width: 15px;
              height: 15px;
            }

            .scan-box {
              cursor: pointer;
            }

            .value-box {
              margin-top: 10px;
              font-size: 12px;
              font-family: Roboto-Black, Roboto;
              font-weight: 900;
              color: #333333;
              display: flex;
              align-items: center;

              .icon {
                margin-right: 10px;
              }
            }
          }
        }

        .stake-item-part2 {
          border: none;

          .item {

            .item-content {
              .blue {
                color: #6284F5;
              }

              .green {
                color: #27A17C;
              }

              .value-box {
                &:nth-child(n+2) {
                  margin-top: 3px;
                }

              }
            }
          }
        }

        .primary-btn-sha {
          font-family: RussoOneRegular, Russo One;
          margin: 0 6%;
          font-weight: 400;

        }
      }
    }

    .position-list {
      width: var(--content-width);
      margin: 30px auto 0px;

    }
  }
}

.nodata-box {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
  background: #fff;
  border-radius: 20px;
  width: 100%;
  padding: 60px 0;

  img {
    width: 100px;
    height: 100px;
  }

  span {
    opacity: 0.5;
  }
}

.stake-m {
  display: none;
}

@media screen and (max-width: 1000px) {
  .tabs-box {
    .tabs {
      transform: scale(0.8);
      margin-left: -40px;
    }
  }
  .StakeView {
    .stake-content {
      .top-part {
        height: 42vh;
        position: relative;
        background: url("../../assets/images/stake_top_bg_m.webp") no-repeat;
        background-size: 100% 100%;

        .stake-btn {
          position: absolute;
          bottom: 2vh;
          left: calc(50% - 15vw);
          font-family: Roboto-Bold, Roboto;

          .primary-btn-sha {
            height: 6vh;
            width: 30vw;

            color: #613A00;
            font-weight: bold;
            line-height: 6vh;
          }
        }

        .top-part-item {
          width: 33.3%;

          .icon {
            width: 10vw;
            height: 10vw;
          }

          .name {
            display: flex;
            text-align: center;
            white-space: normal;
            font-size: 3.4vw;
            height: 5vh;
          }

          .value {
            text-align: center;
            font-size: 5.2vw;
          }
        }
      }

      .stake-list {
        display: block;

        .stake-item {
          width: 100%;
          margin-bottom: 3vh;
          position: relative;
          margin-left: 0;

          .stake-item-header {

            .logo-box {
              position: absolute;
              width: 20vw;
              height: 20vw;
              left: 6vw;
              top: calc(168px - 10vw);
            }

            .bg {
              height: 120px;
            }

            .name {
              position: absolute;
              left: 28vw;
              top: 106px;
              font-size: 4vw;
            }
          }

          .stake-item-content {
            padding-top: 7vw;

            .stake-m {
              width: auto;
            }

            .stake-item-part1, .stake-item-part2 {
              margin: 3vh 5vw 0;
              padding-bottom: 2vh;

              .item {
                width: 33.3%;
                white-space: nowrap;

                .loan-value-box {
                  display: block;

                  .value {
                    display: block;
                    margin-top: 6px;
                  }

                  .value-box {
                    margin-right: 6px;
                  }
                }
              }
            }
          }
        }
      }

      .sub-title {
        margin-left: 3vw;
      }

      .nav-list {
        margin: 0 3vw;
        justify-content: space-between;

        .nav-item {
          font-size: 4vw;
          width: 28vw;
          min-width: 100px;
        }
      }
    }
  }

  .stake-m {
    display: block;
    font-weight: bold !important;
    color: #613A00;
    line-height: 6vh;
    height: 6vh !important;
    width: 12vw;
  }
  .stake-pc {
    display: none !important;
  }
}

@media screen and (min-width: 1920px) {
  .StakeView {
    .stake-content {
      .stake-list {
        .stake-item {
          .stake-item-part1, .stake-item-part2 {
            .item {
              text-align: justify;

              .name {
                font-size: 14px;

              }

              .icon {
                width: 20px;
                height: 20px;
              }

              .scan-box {
                cursor: pointer;
              }

              .value-box {
                font-size: 14px;
              }
            }
          }

        }
      }

    }
  }


}
</style>
