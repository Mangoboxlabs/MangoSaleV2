<template>
  <div class="MyNFTView">
    <EmailSignDialog v-show="showSign" @closeDialog="showSign=false" @updateData="handleEmailUpdate"/>
    <StakeNFTDialog
        v-show="showStakeNFT"
        :priceMap="priceMap"
        :availableLoanArr="availableLoanArr"
        :tokensData="tokensData"
        @updateData="getData"
        @initData="initData"
        @updateChooseAllLand="updateChooseAllLand"
        @updateChooseAllEstate="updateChooseAllEstate"
        ref="StakeDialog"
        @closeDialog="initData();showStakeNFT=false;    isChildUpdate = false"/>
    <Popup round
           position="bottom" v-model:show="showMStakeNFT" class="stake-dialog-m">

      <StakeNFTDialog
          @closeDialog="initData();showMStakeNFT=false;isChildUpdate = false"
          :priceMap="priceMap"
          :availableLoanArr="availableLoanArr"

          @initData="initData"
          :tokensData="tokensData"
          @updateData="getData"
          ref="StakeDialog"
      />
    </Popup>
    <div class="mynft-box">
      <div class="title">
        My NFT
      </div>
      <div class="nav-list">
        <div class="nav-item" :class="{'active':activeNav==1}" @click="activeNav=1">
          Available ( {{ tokensData.nfts_count }} )
        </div>
        <div class="nav-item" :class="{'active':activeNav==2}" @click="activeNav=2">
          Staking
        </div>
      </div>
      <div v-show="activeNav==1">
        <div class="tabs-box">
          <div class="tabs">
            <div @click="activeIndex='Land';activeIdx=0" :class="{active: activeIndex == 'Land'}" class="tab">
              Land
            </div>
            <div @click="activeIndex='Estate';activeIdx=1" :class="{active:activeIndex == 'Estate'}" class="tab">
              Estate
            </div>
            <span class="glider" :style="`transform:translateX(${activeIdx*130}px)`"></span>
          </div>
        </div>

        <div class="nav-btn-box">
          <div class="nav-item" v-show="activeIndex=='Land'"
               :class="{'active':item.isChoosedType&&!initChooseAllLand }"
               @click="chooseLandIdentify(item)" v-for="(item,index) in tokensData.land" :key="index">
            <img src="../../assets/svg/choosed.svg" alt="" class="icon">
            {{ item.name }}
          </div>
          <div class="nav-item" v-show=" activeIndex=='Estate'"
               :class="{'active':item.isChoosedType&&!initChooseAllEstate}"
               @click="chooseEstateIdentify(item)" v-for="(item,index) in  tokensData.estates"
               :key="index">
            <img src="../../assets/svg/choosed.svg" alt="" class="icon">
            {{ item.name }}
          </div>
        </div>
        <div class="nft-list-box" v-show="activeIndex=='Land'">
          <div class="nft-list">
            <template v-for="(item,index) in  tokensData.land" :key="index">
              <div class="nft-item"
                   v-show="item.isChoosedType"
                   :class="{'active':nft.choosed==true}"
                   @click="chooseNFT(nft,item)"
                   v-for="(nft,idx) in  item.nfts"
                   :key="idx">
                <div class="square">
                  <img :src="nft.image" alt="" class="icon">
                </div>
                <div class="name">
                  <strong v-if="nft.name">{{ nft.name }}</strong>
                  <strong v-else>{{ item.name }}#{{ nft.token_id }}</strong>
                </div>
                <div class="type">
                  {{ item.name }}
                </div>
                <div class="choose-box">
                  <img src="../../assets/svg/choosed_active.svg" alt="" class="icon">
                </div>

              </div>
            </template>

          </div>
          <div class="bottom-part">
            <a-button class="primary-btn-sha m" @click="stakeM">
              Stake {{ chooseLandNum }} NFT
            </a-button>
            <a-button class="primary-btn-sha pc" @click="stake">
              Stake {{ chooseLandNum }} NFT
            </a-button>
            <a-button class="primary-btn-sha m" @click="showTransfer(0)">
              Transfer {{ chooseLandNum }} NFT
            </a-button>
            <a-button class="primary-btn-sha pc" @click="showTransfer(1)">
              Transfer {{ chooseLandNum }} NFT
            </a-button>
          </div>
        </div>
        <div class="nft-list-box" v-show="activeIndex=='Estate'">
          <div class="nft-list">
            <template v-for="(item,index) in   tokensData.estates" :key="index">
              <div class="nft-item"
                   v-show="item.isChoosedType"
                   @click="chooseEstate(nft,item)"
                   :class="{'active':nft.choosed==true}"
                   v-for="(nft,idx) in  item.nfts"
                   :key="idx">
                <div class="square">
                  <img :src="nft.image" alt="" class="icon">
                </div>
                <div class="name">
                  <strong v-if="nft.name">{{ nft.name }}</strong>
                  <strong v-else>{{ nft.token_id }}</strong>
                </div>
                <div class="type">
                  {{ item.name }}
                </div>
                <div class="choose-box">
                  <img src="../../assets/svg/choosed_active.svg" alt="" class="icon">
                </div>
              </div>
            </template>
          </div>
          <div class="bottom-part">
            <a-button class="primary-btn-sha m" @click="stakeM">
              Stake NFT
            </a-button>
            <a-button class="primary-btn-sha pc" @click="stake">
              Stake NFT
            </a-button>
            <a-button class="primary-btn-sha m" @click="showTransfer(0)">
              Transfer NFT
            </a-button>
            <a-button class="primary-btn-sha pc" @click="showTransfer(1)">
              Transfer NFT
            </a-button>
          </div>
        </div>

      </div>

      <div v-show="activeNav==2">
        <div class="flex-title">
          <div class="sub-nav">
            <div class="nav-item" :class="{'active':selectCoin==1}" @click="selectCoin=1">
              All
            </div>
            <div class="nav-item" :class="{'active':selectCoin=='ETH'}" @click="selectCoin='ETH'">
              ETH
            </div>
            <div class="nav-item" :class="{'active':selectCoin=='USDT'}" @click="selectCoin='USDT'">
              USDT
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
        <div class="position-list" :class="{'list-box':listActive==2}">
          <PositionItem :listActive="listActive" @updateData="getData" :availableLoanArr="availableLoanArr" :dataObj="item"
                        v-for="(item,index) in curPositions" :key="index"/>
        </div>
      </div>
    </div>

    <div class="dialog animate__animated animate__fadeIn" v-if="isShowTransfer">
      <div class="dialog-mask" @click="isShowTransfer=false"></div>
      <div class="dialog-content">
        <TransferNFT ref="transferDialog" :tokensData="tokensData" @updateData="getData"
                     @closeDialog="isShowTransfer=false"/>
      </div>
    </div>
    <Popup round
           position="bottom" v-model:show="isShowMTransfer" class="stake-dialog-m">

      <TransferNFT ref="transferDialog" :tokensData="tokensData" @updateData="getData"
                   @closeDialog="isShowMTransfer=false"/>
    </Popup>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import PositionItem from "@/views/StakeView/components/PositionItem.vue";
import StakeNFTDialog from "@/views/MyNFTView/components/StakeNFTDialog.vue";
import {Popup} from "vant";
import {message} from "ant-design-vue";
import addressMap from "@/abi/addressMap";
import EmailSignDialog from "@/components/EmailSignDialog.vue";
import TransferNFT from "@/views/MyNFTView/components/TransferNFT.vue";

export default {
  name: "MyNFTView",
  components: {EmailSignDialog, Popup, PositionItem, StakeNFTDialog, TransferNFT},
  data() {
    return {
      initChooseAllLand: true,
      initChooseAllEstate: true,
      priceMap: {},
      isChildUpdate: false,
      showMStakeNFT: false,
      showStakeNFT: false,
      isShowTransfer: false,
      isShowMTransfer: false,
      selectCoin: 1,
      availableLoanArr: [],
      activeIndex: "Land",
      activeIdx: 0,
      activeNav: 1,
      activeNav2: 1,
      chooseLandNum: 0,
      listActive:1,
      stakingArr: [],
      showSign: false
    };
  },
  computed: {
    ...mapGetters(["account", "web3", "isConnected", "chainId"]),
    stakeData() {
      return this.$store.state.stake.stakeData;
    },
    curEmail() {
      return this.$store.state.app.curEmail;
    },
    tokensData() {
      return this.$store.state.stake.tokensData;
    },
    onGettingData() {
      return this.$store.state.app.onGettingData;
    },
    curPositions() {
      if (this.selectCoin == 1) {
        return this.stakeData.positions;
      }

      let arr = [];
      this.stakeData.positions.forEach(item => {
        if (item.underlying.name == this.selectCoin) {
          arr.push(item);
        }
      });
      return arr;
    },
    tbcStaking() {
      return this.$store.state.app.tbcStaking;
    },
  },
  watch: {
    initChooseAllLand() {
      if (this.isChildUpdate) {
        return;
      }
      if (!this.initChooseAllLand) {
        let typeObjArr = this.tokensData.land;
        for (let i = 0; i < typeObjArr.length; i++) {
          const item = typeObjArr[i];
          item.isChoosedType = !item.isChoosedType;
        }
      }
    },
    initChooseAllEstate() {
      if (this.isChildUpdate) {
        return;
      }
      if (!this.initChooseAllEstate) {
        let typeObjArr = this.tokensData.estates;
        for (let i = 0; i < typeObjArr.length; i++) {
          const item = typeObjArr[i];
          item.isChoosedType = !item.isChoosedType;
        }
      }
    },
    account() {
      this.getData();
    },
    isConnected() {
      this.getData();

    },
    chainId() {
      this.getData();
    },
    tokensData: {
      deep: true,
      immediate: true,
      handler() {
        let count = 0;
        if (!this.tokensData.land) {
          return;
        }
        this.tokensData.land.forEach(typeObj => {
          typeObj.nfts.forEach(nft => {
            if (nft.choosed) {
              count++;
            }
          });

        });
        this.chooseLandNum = count;
      }
    }
  },

  async created() {
    this.getData();
  },
  methods: {
    showTransfer(type) {
      if (this.activeIndex == "Estate" && !this.tbcStaking.status) {
        message.warn("Staking 10000 TBC to unlockTransfer");
        return;
      }
      if (type == 1) {
        this.isShowTransfer = true;
      } else {
        this.isShowMTransfer = true;
      }
      this.$nextTick(() => {
        if (this.$refs.StakeDialog) {
          this.$refs.transferDialog.initChooseAllLand = this.initChooseAllLand;
          this.$refs.transferDialog.initChooseAllEstate = this.initChooseAllEstate;
          this.$refs.transferDialog.chooseCount = this.chooseLandNum;
          this.$refs.transferDialog.activeIndex = this.activeIndex;

          this.$refs.transferDialog.getIsApproved();
        }
      });
    },
    updateChooseAllLand(val) {
      this.initChooseAllLand = val;
      this.isChildUpdate = true;
    },
    updateChooseAllEstate(val) {
      this.initChooseAllEstate = val;
      this.isChildUpdate = true;
    },
    handleEmailUpdate(email) {
      this.showStakeNFT = true;
      this.curEmail = email;
      this.getPersonInfo();
    },
    stakeM() {
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
      this.showMStakeNFT = true;
    },
    stake() {
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
        if (this.$refs.StakeDialog) {
          this.$refs.StakeDialog.initChooseAllLand = this.initChooseAllLand;
          this.$refs.StakeDialog.initChooseAllEstate = this.initChooseAllEstate;
          this.$refs.StakeDialog.activeIndex = this.activeIndex;

          this.$refs.StakeDialog.getIsApproved();
        }
      });
    },
    chooseNFT(nft, nftTypeObj) {
      this.$refs.StakeDialog.chooseNFT(nft, nftTypeObj);
      // this.$refs.transferDialog.chooseNFT(nft, nftTypeObj)
    },
    chooseEstate(nft, nftTypeObj) {
      this.$refs.StakeDialog.activeIndex = "Estate";
      this.$refs.StakeDialog.chooseEstate(nft, nftTypeObj);
    },
    async initData() {
      await this.getISAllowance();
      if (this.tokensData.pools) {
        this.tokensData.pools.forEach(item => {
          if (item.underlying == "0x0000000000000000000000000000000000000000") {
            this.availableLoanArr[0] = item.max_borrow;
            this.priceMap[item.name] = item.price;
          } else {
            this.availableLoanArr[1] = item.max_borrow;
          }
        });
      }
    },
    async getISAllowance() {
      if (!this.isConnected) {
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
    chooseEstateIdentify(identify) {
      identify.isChoosedType = !identify.isChoosedType;
      this.initChooseAllEstate = false;
      let chooseNone = true;
      this.tokensData.estates.forEach(typeObj => {
        if (typeObj.isChoosedType) {
          chooseNone = false;
        }
      });
      if (chooseNone) {
        this.initChooseAllEstate = true;
        this.tokensData.estates.forEach(typeObj => {
          typeObj.isChoosedType = true;
        });
      }
    },

    chooseLandIdentify(identify) {
      identify.isChoosedType = !identify.isChoosedType;
      this.initChooseAllLand = false;

      let chooseNone = true;
      this.tokensData.land.forEach(typeObj => {
        if (typeObj.isChoosedType) {
          chooseNone = false;
        }
      });
      if (chooseNone) {
        this.initChooseAllLand = true;
        this.tokensData.land.forEach(typeObj => {
          typeObj.isChoosedType = true;
        });
      }
    },
    getPersonInfo() {
      this.$store.dispatch("app/getPersonInfo");
    },
    async getStakeData() {
      await this.$store.dispatch("stake/getStakeData");
      this.stakingArr = this.stakeData;
    },
    async getData() {
      if (!this.isConnected) {
        return;
      }
      // await this.$store.dispatch("stake/getTokenData");
      if (!(this.tokensData.nfts_count > 0)) {
        await this.$store.dispatch("stake/getTokenData");
      }

      for (let i = 0; i < this.tokensData.land.length; i++) {
        const item = this.tokensData.land[i];
        item.isChoosedType = true;
      }
      for (let i = 0; i < this.tokensData.estates.length; i++) {
        const item = this.tokensData.estates[i];
        item.isChoosedType = true;
      }
      this.getStakeData();
      this.initData();
    },
  }
};
</script>

<style lang="scss" scoped>
.MyNFTView {
  padding-bottom: 30px;

  .mynft-box {
    width: var(--content-width);
    margin: 0 auto;
  }

  .nav-list {
    display: flex;
    margin: 30px 0;
    border-bottom: 1px solid #E2E2E2;
    user-select: none;

    .nav-item {
      font-size: 18px;
      font-family: Roboto-Bold, Roboto;
      font-weight: bold;
      color: #333333;
      padding: 20px 26px;
      cursor: pointer;

      &.active {
        color: #FFC001;
        border-bottom: 1px solid #FFC600;
      }
    }
  }

  .tabs-box {

    .tabs {
      display: flex;
      position: relative;
      user-select: none;
      margin: 30px 0;
    }

    .tabs * {
      z-index: 2;
    }

    .tab {
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(#666, 0.1);
      color: #613A00;
      font-family: Roboto-Bold, Roboto;
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

  .sub-nav {
    display: flex;
    margin: 30px 0;

    .nav-item {
      cursor: pointer;
      width: 120px;
      height: 40px;
      background: #E2E2E2;
      border-radius: 50px 50px 50px 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      color: #613A00;
      font-family: Roboto-Bold, Roboto;

      margin-right: 10px;

      &.active {
        background: linear-gradient(225deg, #FFAB00 0%, #FFC600 100%);
      }
    }
  }

  .nav-btn-box {
    display: flex;

    .nav-item {
      padding: 0 12px;
      height: 40px;
      background: rgba(#666, 0.1);
      border-radius: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-family: Roboto-SemiBold, Roboto;
      font-weight: 600;
      color: #613A00;
      margin-right: 10px;
      cursor: pointer;

      .icon {
        display: none;
        width: 30px;
        height: 30px;
        margin-right: 6px;
      }

      &.active {
        background: linear-gradient(225deg, #FFAB00 0%, #FFC600 100%);

        .icon {
          display: block;
        }
      }
    }
  }

  .nft-list-box {
    margin-top: 30px;
    background: #FFFFFF;
    box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.05);
    border-radius: 20px 20px 20px 20px;
    border: 1px solid #E2E2E2;

    .bottom-part {
      width: 100%;
      display: flex;
      justify-content: center;

      .primary-btn-sha.m {
        display: none;
      }

      .primary-btn-sha {
        width: 200px;
        margin: 20px 10px;
      }
    }
  }

  .nft-list {
    max-height: 60vh;
    overflow-y: auto;
    min-height: 20vh;
    display: grid;
    grid-template-columns: repeat(6, minmax(130px, 1fr));
    gap: 10px;
    padding: 3%;

    .nft-item {
      max-width: 200px;
      margin-bottom: 10px;
      margin-left: 0.5%;
      background: #FFFFFF;
      border-radius: 10px 10px 10px 10px;
      border: 1px solid #E2E2E2;
      position: relative;
      padding: 10px;
      cursor: pointer;

      .square {
        overflow: hidden;

        img {
          transition: 0.3s;
        }
      }

      &:hover {
        .square {
          img {
            transform: scale(1.3);
          }
        }
      }

      .choose-box {
        position: absolute;
        top: 16px;
        right: 14px;
        width: 15px;
        height: 15px;
        background: #FFFFFF;
        border-radius: 50%;

        .icon {
          width: 16px;
          height: 16px;
          display: none;
        }
      }

      &.active {
        border: 2px solid #FFC001;

        .choose-box {
          .icon {
            display: block;
          }
        }
      }

      .square {
        position: relative;

        &::before {
          content: "";
          display: block;
          padding-top: 100%;
        }

        .icon {
          width: 100%;
          position: absolute;
          height: 100%;
          top: 0;
        }
      }


      .name {
        font-size: 14px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #333333;
        margin: 15px 0 5px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .type {
        font-size: 12px;
        white-space: nowrap;
        opacity: 0.6;
        overflow: hidden;

      }

      .is-choose {
        position: absolute;
        right: 5px;
        top: 5px;
        width: 19px;
        height: 19px;
        border-radius: 100%;
        background: #FFFFFF;

        .icon {
          width: 20px;
          height: 20px;
          filter: drop-shadow(#FFC600 10000px -2px);
          transform: translateX(-10000px);
        }
      }
    }
  }

  .title {
    font-size: 30px;
    font-family: Roboto-SemiBold, Roboto;
    font-weight: 600;
    margin-top: 50px;
    color: #000000;
  }
}

@media screen and (max-width: 1000px) {
  .MyNFTView {
    .nft-list-box {
      .bottom-part {
        flex-direction: column;
        align-items: center;
        margin-top: 20px;

        .primary-btn-sha.m {
          margin: 0 0 20px;
        }
      }
    }
  }


  .primary-btn-sha.m {
    display: block !important;
    height: 40px;
  }
  .primary-btn-sha.pc {
    display: none;
  }
  .MyNFTView {
    .title {
      margin: 3vh 0 0 3vw;
      font-size: 6vw;
    }

    .sub-nav .nav-item {
      width: 100px;
    }

    .sub-nav, .nav-btn-box {
      overflow-x: auto;

      .nav-item {
        height: 10vw;
        line-height: 10vw;
        font-size: 3.4vw;
        white-space: nowrap;

        .icon {
          width: 20px;
          height: 20px;
        }
      }
    }

    .nav-list {
      .nav-item {
        font-size: 14px;
      }
    }

    .nft-list {
      padding: 3vw;
      display: grid;
      grid-template-columns: repeat(3, minmax(100px, 1fr));
      gap: 3px;

      .nft-item {
        margin-bottom: 2vh;
        margin-right: 2vw;
        width: 27vw;
        max-width: 200px;
        height: auto;
        padding: 2vw;

        .icon {
          width: 22vw;
          height: 22vw;
        }

        .name {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
