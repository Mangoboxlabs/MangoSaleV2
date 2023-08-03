<template>
  <div class="AuctionView">
    <div class="action-content">
      <div class="nav-list">
        <div class="nav-item" :class="{ active: activeNav == 'inauction' }" @click="$router.push('/auction/inauction')">
          In Auction
        </div>
        <div class="nav-item" :class="{ active: activeNav == 'nearliquidation' }"
             @click="$router.push('/auction/nearliquidation')">Near Liquidation
        </div>
      </div>
      <div class="nav-list2">

        <div class="tabs-box">
          <div class="tabs">
            <div @click="chooseType('Land');activeIndex=0;current=1;endCurrent=1" :class="{active:auctionType == 'Land'}" class="tab">Land
            </div>
            <div @click="chooseType('Estate');activeIndex=1;current=1;endCurrent=1" :class="{active: auctionType == 'Estate'}" class="tab">
              Estate
            </div>
            <div @click="chooseType('Bundle');activeIndex=2;current=1;endCurrent=1" :class="{active:auctionType == 'Bundle'}" class="tab">
              Bundle
            </div>
            <span class="glider" v-show="auctionType" :style="`transform:translateX(${activeIndex*130}px)`"></span>
          </div>
        </div>
      </div>
      <div class=" flex-title">
        <div class="check-box-list">
          <div class="check-item" @click="item.check = !item.check"
               v-for="(item, index) in activeNav == 'inauction' ? checkArr : checkArr2" :key="index">
            <div class="check-icon-box">
              <div class="checked" v-show="item.check"></div>
            </div>
            <div class="name">
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="list-choose-box">
          <div class="list-choose" :class="{active:listActive==1}" @click="listActive=1">
            <img src="../../assets/svg/list.svg" alt="">
          </div>
          <div class="list-choose" :class="{active:listActive==2}" @click="listActive=2">
            <img src="../../assets/svg/listmenu.svg" alt="">
          </div>
        </div>
      </div>
      <div class="in-auction" v-show="activeNav == 'inauction'">
        <div v-show="!checkArr[1].check">
          <div :class="{'list-box':listActive==2}">
            <template v-for="(item,index) in curArr" :key="item.identify">
              <AuctionItem
                  isAction="1"
                  :listActive="listActive"
                  @updateData="getData"
                  v-if="(current-1)*activePageSize<= index && index < (current*activePageSize)"
                  :nowTime="nowTime"
                  :nftObj="item"
                  :extra="extra"
              />
            </template>
          </div>
          <div class="pagination-box">
            <div class="to-icon" @click="current>1?current--:''">
              <img class=" left normal" src="../../assets/svg/toleft.svg" alt="">
              <img class=" left active" src="../../assets/svg/toleft_active.svg" alt="">
            </div>

            Page {{ current }} of {{ BigNumber(curArr.length / activePageSize).toFixed(0, BigNumber.ROUND_UP) }}
            <div class="to-icon "
                 @click="current<BigNumber(curArr.length/activePageSize ).toFixed(0,BigNumber.ROUND_UP)?current++:''">
              <img class=" right normal" src="../../assets/svg/toleft.svg" alt="">
              <img class=" right active" src="../../assets/svg/toleft_active.svg" alt="">
            </div>
            <!--            <Pagination v-model:current="current" :pageSize="activePageSize" :total="activeArr.length"-->
            <!--                        @showSizeChange="onActiveSizeChange"/>-->
          </div>
        </div>

        <div v-show="checkArr[1].check">
          <div :class="{'list-box':listActive==2}">
            <template v-for="(item,index) in curEndArr" :key="item.identify">
              <AuctionItem
                  :nowTime="nowTime"
                  :nftObj="item"
                  :extra="extra"
                  isAction="1"
                  :listActive="listActive"
                  v-if="(this.endCurrent-1)*this.endPageSize<= index && index < (this.endCurrent*this.endPageSize)"
                  @updateData="getData"

              />
              <!--              <template v-for="(item, index) in auctionsData.near_liquidation">-->
              <!--              -->
              <!--              </template>-->

            </template>
          </div>

          <div class="pagination-box">
            <div class="to-icon" @click="endCurrent>1?endCurrent--:''">
              <img class=" left normal" src="../../assets/svg/toleft.svg" alt="">
              <img class=" left active" src="../../assets/svg/toleft_active.svg" alt="">
            </div>

            Page {{ endCurrent }} of {{ BigNumber(curEndArr.length / endPageSize).toFixed(0, BigNumber.ROUND_UP) }}
            <div class="to-icon "
                 @click="endCurrent<BigNumber(curEndArr.length / endPageSize).toFixed(0, BigNumber.ROUND_UP) ?endCurrent++:''">
              <img class=" right normal" src="../../assets/svg/toleft.svg" alt="">
              <img class=" right active" src="../../assets/svg/toleft_active.svg" alt="">
            </div>
            <!--            <Pagination v-model:current="endCurrent" :pageSize="endPageSize" :total="endArr.length"-->
            <!--                        @showSizeChange="onEndSizeChange"/>-->
          </div>
        </div>


      </div>
      <div class="near-liquidation" v-show="activeNav == 'nearliquidation'" :class="{'list-box':listActive==2}">

        <template v-for="(item, index) in auctionsData.near_liquidation">
          <AuctionItem
              v-if="(!auctionType || item.nft.type == auctionType) && (!checkArr2[0].check || isOwner(item))"
              :nowTime="nowTime"
              :nftObj="item"
              :extra="extra"
              :listActive="listActive"
              @updateData="getData"
              :key="index"
          />
        </template>

      </div>
    </div>
  </div>
</template>

<script>
import AuctionItem from "@/views/AuctionView/components/AuctionItem";
import {mapGetters} from "vuex";
import addressMap from "@/abi/addressMap";
// import {Pagination} from "ant-design-vue";
import BigNumber from "bignumber.js";

let countdown;
export default {
  name: "AuctionView",
  components: {AuctionItem,},
  data() {
    return {
      nowTime: new Date().getTime(),
      curNft: {nft: {}},
      showMBid: false,
      activeNav: "inauction",
      activeIndex: 0,
      current: 1,
      endCurrent: 1,
      totalActive: 20,
      endPageSize: 10,
      activePageSize: 10,
      listActive: 1,
      activeArr: [],
      endArr: [],
      auctionType: undefined,
      checkArr: [{name: "My NFT"}, {name: "History"}],
      checkArr2: [{name: "My NFT"}],
      isMy:false
    };
  },
  computed: {
    curEndArr(){
      let arr = []
      this.endArr.forEach((item,)=>{

          if( (!this.auctionType || item.nft.type == this.auctionType) && (!this.checkArr[0].check || this.isOwner(item))){
            arr.push(item)
          }

      })

      return arr
    },
    curArr(){
      let arr = []
      this.activeArr.forEach((item,)=>{
          if( (!this.auctionType || item.nft.type == this.auctionType) && (!this.checkArr[0].check || this.isOwner(item))){
            arr.push(item)
          }
      })
      return arr
    },
    BigNumber() {
      return BigNumber;
    },
    ...mapGetters(["account", "web3", "isConnected", "chainId", "usdtDecimal"]),
    auctionsData() {
      return this.$store.state.auctionNFT.auctionsData;
    },
    extra() {
      return this.$store.state.auctionNFT.extra;
    },
  },
  watch: {
    checkArr:{
      deep: true,
      immediate: true,
      handler() {
        this.current = 1
        this.endCurrent = 1
      }
    },
    isConnected() {
      this.getData();
    },
    account() {
      this.getData();
    },
    chainId() {
      this.getData();
    },
    $route() {
      this.activeNav = this.$route.params.type;

      if (this.$route.query.type === "history") {
        this.checkArr[1].check = true;
      }
    },
    auctionsData() {
      let activeArr = [], endArr = [];
      this.auctionsData.auctions.forEach(item => {
        const now = parseInt(new Date().getTime() / 1000);
        let history;
        if (item.status == 0) {
          history = false;
          //wait pay
          if (item.bidder == this.account) {
            if (now > item.end_time + parseInt(this.extra.BID_WAIT_TIME)) {
              history = true;
            }
          } else if (now > item.end_time) {
            history = true;
          }
        } else {
          history = true;
          if (item.my_margin > 0) {
            history = false;
          }
        }
        if (!history) {
          activeArr.push(item);
        } else {
          endArr.push(item);
        }
      });
      this.activeArr = activeArr;
      this.endArr = endArr;
    }
  },
  methods: {
    onActiveSizeChange(cur, pagesize) {
      this.current = cur;
      this.activePageSize = pagesize;
    },
    onEndSizeChange(cur, pagesize) {
      this.endCurrent = cur;
      this.endPageSize = pagesize;
    },
    chooseType(type) {
      if (this.auctionType == type) {
        this.auctionType = undefined;
        return;
      }
      this.auctionType = type;
    },
    async allowance() {
      let res = await this.$store.dispatch("erc20/allowance", {
        owner: this.account,
        spender: addressMap[this.chainId]["auctionNFT"],
        address: addressMap[this.chainId]["usdt"],
      });
      this.$store.commit("auctionNFT/SET_ALLOWANCE", res);
    },
    showEnd(item) {
      const now = parseInt(new Date().getTime() / 1000);
      let history;
      if (item.status == 0) {
        history = false;
        //wait pay
        if (item.bidder == this.account) {
          if (now > item.end_time + parseInt(this.extra.BID_WAIT_TIME)) {
            history = true;
          }
        } else if (now > item.end_time) {
          history = true;
        }
      } else {
        history = true;
        if (item.my_margin > 0) {
          history = false;
        }
      }
      const checked = !!this.checkArr[1].check;
      return (!checked && !history) || (checked && history);
    },
    isOwner(item) {
      return item.owner == this.account;
    },
    getAuctionData() {
      this.$store.dispatch("auctionNFT/getAuctionsData", {
        // type: this.auctionType,
        // is_history: this.checkArr[1].check,
      });
    },
    async getData() {
      if (!this.isConnected) {
        return;
      }
      this.getAuctionData();
      await this.allowance();
    },
  },
  created() {
    const query = this.$route.query;
    if (query.is_my_nft) {
      this.checkArr[0].check = true;
    }
    this.activeNav = this.$route.params.type;
  },
  mounted() {
    this.getData();
    countdown = setInterval(() => {
      this.nowTime = new Date().getTime();
    }, 1000);

    this.getAuctionDataIntervalId = setInterval(() => {
      this.getAuctionData();
    }, 6000);

    if (this.$route.query.type === "history") {
      this.checkArr[1].check = true;
    }
  },
  beforeUnmount() {
    clearInterval(this.getAuctionDataIntervalId);
    clearInterval(countdown);
  },
};
</script>

<style lang="scss" scoped>
.action-content {
  width: var(--content-width);
  margin: 0 auto;
  padding-bottom: 70px;

  .pagination-box {
    padding-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    .active {
      display: none;
    }

    .to-icon {
      img {
        width: 26px;
        height: 26px;
      }

      cursor: pointer;
      margin: 0 10px;
      opacity: 0.6;

      &:hover {
        opacity: 1;

        .active {
          display: block;
        }

        .normal {
          display: none;
        }
      }
    }

    .left {
      margin-top: -2px;
    }

    .right {
      transform: rotate(180deg);
      margin-top: -4px;

    }
  }

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

  .nodata-box {
    margin-top: 20px;
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

  .nav-list {
    display: flex;
    margin: 30px 0;

    border-bottom: 1px solid #e2e2e2;

    .nav-item {
      font-size: 18px;
      font-family: RoBoto-Medium, Roboto;
      font-weight: 500;
      color: #333333;
      padding: 20px 26px;
      cursor: pointer;

      user-select: none;

      &.active {
        color: #ffc001;
        border-bottom: 1px solid #ffc600;
      }
    }
  }

  .nav-list2 {
    display: flex;

    .nav-item {
      min-width: 100px;
      height: 40px;
      display: flex;
      font-size: 16px;

      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      background: #e2e2e2;
      border-radius: 30px;
      margin-right: 10px;
      font-family: RoBoto-Medium, Roboto;

      &.active {
        background: linear-gradient(225deg, #ffab00 0%, #ffc600 100%);
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #333333;
      }
    }
  }

  .check-box-list {
    display: flex;
    margin-top: 30px;

    .check-item {
      display: flex;
      align-items: center;
      margin-right: 50px;
      user-select: none;
      cursor: pointer;

      .check-icon-box {
        margin-right: 10px;
        width: 26px;
        height: 26px;
        border-radius: 5px 5px 5px 5px;
        border: 1px solid #ffad01;
        display: flex;
        justify-content: center;
        align-items: center;

        .checked {
          width: 20px;
          height: 20px;
          background: #ffad01;
          border-radius: 3px 3px 3px 3px;
        }
      }
    }
  }

  @media screen and (max-width: 1000px) {
    .tabs-box {
      .tabs {
        transform: scale(0.8);
        margin-left: -40px;
      }
    }
    .check-box-list {
      padding: 0 3vw;

      .check-item {
        margin: 0 20px 0 0px;
      }
    }
  }
}
</style>
