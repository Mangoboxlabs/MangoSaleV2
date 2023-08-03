<template>
  <div class="TransferDialog">
    <div class="dialog-header">
      <div class="title">Transfer NFT</div>
      <img src="../../../assets/svg/close.svg" alt="" class="close" @click="$emit('closeDialog')"/>
    </div>
    <div class="dialog-content-container">
      <!--      <div class="nav-list">-->
      <!--        <div class="nav-item" :class="{ active: activeIndex == 'Land' }" @click="setNav('Land')">Land</div>-->
      <!--        <div class="nav-item" :class="{ active: activeIndex == 'Estate' }" @click="setNav('Estate')">Estate</div>-->
      <!--      </div>-->
      <!--      <div class="nav-btn-box">-->
      <!--        <div-->
      <!--            class="nav-item"-->
      <!--            v-show="activeIndex == 'Land'"-->
      <!--            :class="{ active: item.isChoosedType && !initChooseAllLand }"-->
      <!--            @click="chooseIdentify(item)"-->
      <!--            v-for="(item, index) in tokensData.land"-->
      <!--            :key="index"-->
      <!--        >-->
      <!--          <img src="../../../assets/svg/choosed.svg" alt="" class="icon"/>-->
      <!--          {{ item.name }}-->
      <!--        </div>-->
      <!--        <div-->
      <!--            class="nav-item"-->
      <!--            v-show="activeIndex == 'Estate'"-->
      <!--            :class="{ active: item.isChoosedType && !initChooseAllEstate }"-->
      <!--            @click="chooseEstateIdentify(item)"-->
      <!--            v-for="(item, index) in tokensData.estates"-->
      <!--            :key="index"-->
      <!--        >-->
      <!--          <img src="../../../assets/svg/choosed.svg" alt="" class="icon"/>-->
      <!--          {{ item.identify }}-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="nft-list" v-show="activeIndex == 'Land'">
        <template v-for="(item, index) in tokensData.land" :key="index">
          <div
              class="nft-item"
              v-show="nft.choosed"
              :class="{ active: nft.choosed == true }"
              v-for="(nft, idx) in item.nfts"
              :key="idx"
          >
            <div class="square">
              <img :src="nft.image" alt="" class="icon"/>
            </div>
            <div class="name">
              <strong v-if="nft.name">{{ nft.name }}</strong>
              <strong v-else>{{ item.name }}#{{ nft.token_id }}</strong>
            </div>
            <div class="choose-box">
              <img src="../../../assets/svg/choosed_active.svg" alt="" class="icon"/>
            </div>
            <div class="type">
              {{ item.name }}
            </div>
          </div>
        </template>
      </div>
      <div class="nft-list" v-show="activeIndex == 'Estate'">
        <template v-for="(item, index) in tokensData.estates" :key="index">
          <div
              class="nft-item"
              v-show="nft.choosed == true"
              :class="{ active: nft.choosed == true }"
              v-for="(nft, idx) in item.nfts"
              :key="idx"
          >
            <div class="square">
              <img :src="nft.image" alt="" class="icon"/>
            </div>
            <div class="name">
              <strong v-if="nft.name">{{ nft.name }}</strong>
              <strong v-else>{{ item.name }}#{{ nft.token_id }}</strong>
            </div>
            <div class="type">
              {{ item.name }}
            </div>
            <div class="choose-box">
              <img src="../../../assets/svg/choosed_active.svg" alt="" class="icon"/>
            </div>
          </div>
        </template>
      </div>
      <div class="bottom-content">
        <div class="title">Receiving Address</div>
        <div class="input-box">
          <input type="text" placeholder="e.g. 0x1ed3... or destination.eth" v-model="address" @input="checkAddress"/>
        </div>
        <div class="tip">Make sure you're sending to the correct address as lost items can't be recovered.</div>
        <div class="operate-box" v-show="activeIndex == 'Land'">

          <a-button v-if="!address" :loading="isLoading" class="primary-btn-sha"> Please Input Address</a-button>
          <a-button v-else-if="!isRightAddress" :loading="isLoading" class="primary-btn-sha">
            Please Input Right Address
          </a-button>
          <a-button v-else :loading="isLoading" class="primary-btn-sha" @click="handleTransferLand">
            <span style="margin-right: 6px" v-if="!isApproved">
              Approve &
            </span>
            Transfer {{ chooseCount }} NFT
          </a-button>
        </div>
        <div class="operate-box" v-show="activeIndex == 'Estate'">
          <a-button v-if="!address" :loading="isLoading" class="primary-btn-sha"> Please Input Address</a-button>
          <a-button v-else-if="!isRightAddress" :loading="isLoading" class="primary-btn-sha">
            Please Input Right Address
          </a-button>
          <a-button v-else :loading="isLoading" class="primary-btn-sha" @click="handleTransferEstate">
            <span style="margin-right: 6px" v-if="!isApproved"> Approve & </span>
            Transfer {{ curNFT.count ? curNFT.count : "" }} NFT
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bigNumberUtil from "@/utils/bigNumberUtil";

const calculator = new bigNumberUtil();
import {mapGetters} from "vuex";
import BigNumber from "bignumber.js";
import {getTranStatus} from "@/api/common";
import {message} from "ant-design-vue";
import addressMap from "@/abi/addressMap";
import {queryENSForETHAddress} from "@/api/ensStore";
import {isProxy, toRaw} from "vue";

BigNumber.set({
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});
export default {
  name: "TransferDialog",
  props: ["closeDialog", "availableLoanArr", "priceMap", "tokensData", "updateData"],
  components: {},
  data() {
    return {
      initChooseAllLand: true,
      initChooseAllEstate: true,
      activeIndex: "Land",
      isApproved: false,
      address: undefined,
      ethAddress: "",
      chooseCount: 0,
      chooseEstateCount: 0,
      calculator,
      curNFT: 0,
      isLoading: false,
      inputTimeout: null,
      isRightAddress: false,
    };
  },
  computed: {
    ...mapGetters(["account", "web3", "isConnected", "chainId", "usdtDecimal"]),

    tbcStaking() {
      return this.$store.state.app.tbcStaking;
    },
  },
  watch: {
    initChooseAllLand() {
      if (!this.initChooseAllLand) {
        let typeObjArr = this.tokensData.land;
        for (let i = 0; i < typeObjArr.length; i++) {
          const item = typeObjArr[i];
          item.isChoosedType = !item.isChoosedType;
        }
      }
    },
    initChooseAllEstate() {
      if (!this.initChooseAllEstate) {
        let typeObjArr = this.tokensData.estates;
        for (let i = 0; i < typeObjArr.length; i++) {
          const item = typeObjArr[i];
          item.isChoosedType = !item.isChoosedType;
        }
      }
    },
    isConnected() {
    },
  },
  created() {
    this.initData();
  },
  methods: {
    setNav(url) {
      this.activeIndex = url;
      this.getIsApproved();
    },
    async checkAddress() {
      if (this.address.toLowerCase().includes(".eth")) {
        let address = await queryENSForETHAddress(this.address);
        this.ethAddress = address;
        this.isRightAddress = true;
        return;
      }

      clearTimeout(this.inputTimeout);
      if (this.address) {
        this.inputTimeout = setTimeout(() => {
          console.log(this.web3.utils.isAddress(this.address));
          this.isRightAddress = this.web3.utils.isAddress(this.address);
          if (this.isRightAddress) {
            this.ethAddress = this.address;
          }
        }, 500);
      } else {
        this.isRightAddress = false;
      }
    },

    initData() {
      if (!this.isConnected) {
        return;
      }
      this.getIsApproved();
    },
    async setApprovalForAllEstate() {
      let contractAddr = [];
      for (let i = 0; i < this.tokensData.estates.length; i++) {
        const item = this.tokensData.estates[i];
        for (let j = 0; j < item.nfts.length; j++) {
          const nft = item.nfts[j];
          if (nft.choosed && !item.isApproved) {
            contractAddr.push(item.contract);
          }
        }
      }
      for (let i = 0; i < contractAddr.length; i++) {
        const contract = contractAddr[i];
        const res = await this.$store.dispatch("erc721/setApprovalForAll", {
          address: contract,
          approved: true,
          to: addressMap[this.chainId]["stake"]
        }).then(async () => {
          await this.$parent.getISAllowance();
          setTimeout(() => {
            this.getIsApproved();
          }, 1000);
          return true;
        }).catch(e => {
          this.dealCatchErr(e);
          return false;
        });
        if (!res) {
          return false;
        }
      }
      return true;

    },
    async setApprovalForAll() {
      if (!this.isConnected) {
        message.info("Please connect");
        return;
      }

      // land approve
      try {
        let chooseTypeNum = 0,
            chooseNftTypeArr = [];
        this.tokensData.land.forEach((item) => {
          if (item.isChoosedType) {
            let hasNft = false;
            item.nfts.forEach((nft) => {
              if (nft.choosed) {
                hasNft = true;
              }
            });
            if (hasNft) {
              chooseTypeNum++;
              chooseNftTypeArr.push(item);
            }
          }
        });
        if (chooseTypeNum <= 0) {
          message.info("Please choose nft");
          return;
        }
        for (const item of chooseNftTypeArr) {
          if (!item.isApproved) {
            this.isLoading = true;

            const res = await this.$store
                .dispatch("erc721/setApprovalForAll", {
                  address: item.contract,
                  approved: true,
                  to: addressMap[this.chainId]["stake"],
                })
                .then(async () => {
                  await this.$parent.getISAllowance();
                  setTimeout(() => {
                    this.getIsApproved();
                  }, 1000);
                  return true;
                })
                .catch((e) => {
                  this.dealCatchErr(e);
                  return false;
                });
            if (!res) {
              return false;
            }
          }
        }
        return true;
      } catch (e) {
        console.log(e);
        this.isLoading = false;
      }
    },
    getIsApproved() {
      if (this.chooseCount <= 1 && this.activeIndex == "Land") {
        this.isApproved = true;
        return true;
      }

      let typeObjArr = this.tokensData.land;
      if (this.activeIndex !== "Land") {
        typeObjArr = this.tokensData.estates;
      }
      for (let i = 0; i < typeObjArr.length; i++) {
        const item = typeObjArr[i];
        if (item.isChoosedType) {
          for (let j = 0; j < item.nfts.length; j++) {
            const nft = item.nfts[j];
            if (nft.choosed && !item.isApproved) {
              this.isApproved = false;
              return;
            }
          }
        }
      }

      this.isApproved = true;
    },
    async handleTransferEstate() {
      let _nfts = [],
          _ids = [],
          _receiver = this.ethAddress,
          nftTypeNum = 0;
      if (!this.tbcStaking.status) {
        message.warn("Staking 10000 TBC to unlockTransfer");
        return;
      }
      this.isLoading = true;

      if (!this.isApproved) {
        const isP = await this.setApprovalForAllEstate();
        if (!isP) {
          return;
        }
      }

      this.isLoading = true;
      this.tokensData.estates.forEach((nftType) => {
        if (nftType.isChoosedType) {
          let hasChoosed = false;
          nftType.nfts.forEach((nft) => {
            if (nft.choosed) {
              hasChoosed = true;
              nft.token_ids.forEach(() => {
                _nfts.push(nftType.contract);

              });
              _ids.push(...nft.token_ids);
            }
          });
          if (hasChoosed) {
            nftTypeNum++;
          }
        }
      });
      if (isProxy(_ids)) {
        _ids = toRaw(_ids);
      }
      if (_nfts.length == 0) {
        message.warn("Please select nft");
        this.isLoading = false;
        return;
      }
      if (nftTypeNum == 1) {
        this.$store
            .dispatch("stake/batchTransfer", {_nft: _nfts[0], _ids, _receiver})
            .then(async (res) => {
              this.dealRes(res.transactionHash);
            })
            .catch((e) => {
              this.dealCatchErr(e);
            });
      } else {
        this.$store
            .dispatch("stake/batchTransferNfts", {_nfts, _ids, _receiver})
            .then(async (res) => {
              this.dealRes(res.transactionHash);
            })
            .catch((e) => {
              this.dealCatchErr(e);
            });
      }
    },
    async handleTransferLand() {
      let _nfts = [],
          _ids = [],
          _receiver = this.ethAddress,
          nftTypeNum = 0;

      this.isLoading = true;
      if (!this.isApproved) {
        const isP = await this.setApprovalForAll();
        if (!isP) {
          return;
        }
      }
      this.isLoading = true;
      this.tokensData.land.forEach((item) => {
        if (item.isChoosedType) {
          let hasNft = false;
          item.nfts.forEach((nft) => {
            if (nft.choosed) {
              hasNft = true;
              _ids.push(nft.token_id);
              _nfts.push(item.contract);
            }
          });
          if (hasNft) {
            nftTypeNum++;
          }
        }
      });
      if (_nfts.length == 0) {
        message.warn("Please select nft");
        this.isLoading = false;
        return;
      }
      if (nftTypeNum == 1 && _ids.length == 1) {
        this.$store
            .dispatch("erc721/safeTransferFrom", {
              address: _nfts[0],
              from: this.account,
              to: this.ethAddress,
              tokenId: _ids[0],
            })
            .then(async (res) => {
              this.dealRes(res.transactionHash);
            })
            .catch((e) => {
              this.dealCatchErr(e);
            });
        return;
      }

      if (nftTypeNum == 1) {
        this.$store
            .dispatch("stake/batchTransfer", {_nft: _nfts[0], _ids, _receiver})
            .then(async (res) => {
              this.dealRes(res.transactionHash);
            })
            .catch((e) => {
              this.dealCatchErr(e);
            });
      } else {
        this.$store
            .dispatch("stake/batchTransferNfts", {_nfts, _ids, _receiver})
            .then(async (res) => {
              this.dealRes(res.transactionHash);
            })
            .catch((e) => {
              this.dealCatchErr(e);
            });
      }
    },
    async dealRes(transactionHash) {
      let statusRes = await getTranStatus(transactionHash);
      if (statusRes.data.data == 1) {
        this.$emit("updateData");
        this.isLoading = false;
        this.$emit("closeDialog");
        message.success("Transaction Success");
        this.resetData();
      } else {
        setTimeout(() => {
          this.dealRes(transactionHash);
        }, 3000);
      }
    },
    resetData() {
      this.address = undefined;

    },

    dealCatchErr(e) {
      this.isLoading = false;

      if (e.code == 4001) {
        message.error("User canceled  transaction");
        return;
      }
      if (e.message && e.message.indexOf("{") < 0) {
        message.error(e.message, 3);
      } else {
        const err = JSON.parse(e.message.substr(e.message.indexOf("{"), e.message.length));
        if (err.originalError) {
          message.error(err.originalError.message);
        } else {
          message.error(e.message.substr(0, e.message.indexOf("{")));
        }
      }
    },
    chooseIdentify(identify) {
      this.initChooseAllLand = false;
      identify.isChoosedType = !identify.isChoosedType;

      let chooseNone = true;
      this.tokensData.land.forEach((typeObj) => {
        if (typeObj.isChoosedType) {
          chooseNone = false;
        }
      });
      if (chooseNone) {
        this.initChooseAllLand = true;
        this.tokensData.land.forEach((typeObj) => {
          typeObj.isChoosedType = true;
        });
      }
      this.$emit("updateChooseAllLand", this.initChooseAllLand);
    },
    chooseEstate(nft, nftTypeObj) {
      nft.choosed = !nft.choosed;
      this.curTypeObj = nftTypeObj;
      if (nft.choosed) {
        this.curNFT = nft;
      } else {
        this.curNFT = null;
      }
      this.getIsApproved();
    },
    chooseEstateIdentify(identify) {
      this.initChooseAllEstate = false;

      identify.isChoosedType = !identify.isChoosedType;

      let chooseNone = true;
      this.tokensData.estates.forEach((typeObj) => {
        if (typeObj.isChoosedType) {
          chooseNone = false;
        }
      });
      if (chooseNone) {
        this.initChooseAllEstate = true;
        this.tokensData.estates.forEach((typeObj) => {
          typeObj.isChoosedType = true;
        });
      }

      this.$emit("updateChooseAllEstate", this.initChooseAllEstate);
    },
    chooseNFT(nft) {
      nft.choosed = !nft.choosed;
      this.chooseCount = 0;
      for (let i = 0; i < this.tokensData.land.length; i++) {
        const typeObj = this.tokensData.land[i];
        for (let j = 0; j < typeObj.nfts.length; j++) {
          const nft = typeObj.nfts[j];
          if (nft.choosed) {
            this.chooseCount++;
          }
        }
      }
      this.getIsApproved();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep(.ant-select-item-option-content) {
  .icon {
    width: 20px;
  }
}

.select-icon {
  position: absolute;
  right: 100px;
  top: 5px;
}

.dialog-content-container {
  min-width: 700px;
  width: 55vw;
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 80vh;
  padding-bottom: 38px;

  ::v-deep(.ant-select-selector) {
    background: none !important;
    border: none;
  }

  ::v-deep(.select-box) {
    background: none !important;
    border: none !important;
  }

  .nav-list {
    display: flex;
    margin: 0 0 30px;
    padding: 0 30px;
    border-bottom: 1px solid #e2e2e2;

    .nav-item {
      font-size: 16px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #333333;
      padding: 16px 26px;
      cursor: pointer;

      &.active {
        color: #ffc001;
        border-bottom: 1px solid #ffc600;
      }
    }
  }

  .nav-btn-box {
    overflow-x: auto;

    display: flex;
    padding: 0 30px;

    .nav-item {
      text-transform: capitalize;
      height: 40px;
      white-space: nowrap;
      width: auto;
      padding: 0 10px;
      background: #e2e2e2;
      border-radius: 30px;
      display: flex;
      user-select: none;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-family: Roboto-SemiBold, Roboto;
      font-weight: 600;
      color: #613a00;
      margin-right: 5px;
      cursor: pointer;

      .icon {
        display: none;
        width: 20px;
        height: 20px;
        margin-right: 3px;
      }

      &.active {
        background: linear-gradient(225deg, #ffab00 0%, #ffc600 100%);

        .icon {
          display: block;
        }
      }
    }
  }

  .nft-list {
    margin: 22px 3%;
    padding: 15px;
    overflow: auto;
    height: 150px;
    background: #f3f3f3;
    border-radius: 23px 23px 23px 23px;

    display: grid;
    grid-template-columns: repeat(5, minmax(130px, 1fr));
    align-items: start;

    &::-webkit-scrollbar {
      display: none;
    }

    .nft-item {
      margin: 0 4px 8px 4px;
      background: #ffffff;
      border-radius: 8px 8px 8px 8px;
      border: 2px solid #fff;
      padding: 6px;
      position: relative;
      max-width: 200px;

      &.active {
        border: 2px solid #ffc001;

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
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
        }
      }

      .choose-box {
        position: absolute;
        top: 12px;
        right: 10px;
        width: 15px;
        height: 15px;
        background: #ffffff;
        border-radius: 50%;

        .icon {
          width: 16px;
          height: 16px;
          display: none;
        }
      }

      .name {
        font-size: 14px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #333333;
        margin-top: 6px;
        white-space: nowrap;
        overflow: hidden;
      }

      .type {
        font-size: 12px;
        opacity: 0.6;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }

  .bottom-content {
    padding: 0 20%;

    .title {
      font-size: 20px;
      font-family: Roboto-Bold, Roboto;
      font-weight: bold;
      color: #000000;
      padding: 30px 0 20px;
    }

    .input-box {
      position: relative;
      height: 50px;
      background: #f1f1f1;
      border-radius: 50px 50px 50px 50px;
      padding-left: 20px;
      font-family: Roboto-Black, Roboto;

      input {
        width: 100%;
        height: 100%;
        background: none;
      }

      .right-tip {
        position: absolute;
        display: flex;
        right: 0;
        top: 10px;
        align-items: center;
        padding-right: 26px;

        .max-btn {
          font-size: 12px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          height: 30px;
          line-height: 30px;
        }

        .line {
          width: 1px;
          height: 30px;
          background: #dadada;
          margin: 0 10px;
        }

        .icon {
          width: 20px;
          height: 20px;
          margin: 0 10px;
        }

        font-size: 14px;
        font-family: Roboto-Black, Roboto;
        font-weight: 900;
        color: #333333;
      }
    }

    .tip {
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #999999;
      margin-top: 30px;
    }

    .operate-box {
      justify-content: space-between;
      display: flex;
      margin-top: 23px;

      .primary-btn-sha {
        width: 100%;
        height: 5.8vh;

        font-family: RussoOneRegular, Russo One;
      }
    }
  }
}

@media screen and (max-width: 1000px) {
  .dialog-header {
    display: flex;
    padding: 3vh 30px 0;
    justify-content: space-between;

    .title {
      font-size: 5vw;
      font-family: Roboto-SemiBold, Roboto;
      font-weight: 600;
      color: #000000;
    }

    .close {
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
  }

  .dialog-content-container {
    min-width: 100%;
    width: 100%;

    .nav-list {
      margin: 1vh 0 2vh 0;
      padding: 0 5vw;
    }

    .nav-btn-box {
      padding: 0 5vw;
      overflow-x: scroll;
      overflow-y: hidden;

      .nav-item {
        font-size: 3.4vw;
        height: 10vw;

        .icon {
          width: 20px;
          height: 20px;
        }
      }
    }

    .nft-list {
      margin: 3vh 5vw;
      width: 90vw;
      height: 30vh;
      grid-template-columns: repeat(3, minmax(100px, 1fr));
    }

    .bottom-content {
      padding: 0 5vw;
    }
  }
}

@media screen and (min-width: 1440px) {
  .dialog-content-container {
    .nft-list {
      height: 200px;
    }
  }
}
</style>
