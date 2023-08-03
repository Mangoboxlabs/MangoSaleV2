<template>
  <div class="MNav">
    <Popup
        @click-overlay="onClickOverlay"
        round
        position="bottom" v-model:show="isShowLng" class="lng-pop">
      <div class="dialog-content animate__fadeIn animate__animated ">
        <div class="lng-item" @click.stop="isShowLng=false">
          <img class="icon" src="../assets/images/english_icon.webp" alt="">
          English
        </div>
        <div class="lng-item" @click.stop="isShowLng=false">
          <img class="icon" src="../assets/images/english_icon.webp" alt="">
          English
        </div>
        <div class="lng-item" @click.stop="isShowLng=false">
          <img class="icon" src="../assets/images/english_icon.webp" alt="">
          English
        </div>
      </div>
    </Popup>
    <Popup
        round
        position="bottom" v-model:show="isShowChain" class="lng-pop">
      <div class="dialog-content animate__fadeIn animate__animated ">
        <div class="lng-item" @click.stop="isShowChain=false" @click="switchNetwork(ChainIdMapByName['Sepolia'])">
          <div class="icon-box">
            <img src="../assets/svg/ethereum.svg" alt="" class="icon">
          </div>
          Ethereum
          <img src="../assets/svg/choosed.svg" alt="" class="choosed">
        </div>
        <div class="lng-item" @click.stop="isShowChain=false" @click="switchNetwork(ChainIdMapByName['Mumbai'])">
          <div class="icon-box">
            <img src="../assets/svg/matic.svg" alt="" class="icon">
          </div>
          Polygon
          <img src="../assets/svg/choosed.svg" alt="" class="choosed">
        </div>
      </div>
    </Popup>
    <div class="mask" @click="$emit('closeDialog')"></div>
    <div class="MNav-content animate__fadeInRight animate__animated">
      <img src="../assets/svg/close.svg" @click="$emit('closeDialog')" alt="" class="close">
      <div class="nav-list">
        <div class="nav-list">
          <div class="nav-item" :class="{'active':$route.path=='/'}" @click="goPage('/')">
            Home
          </div>
          <div class="nav-item" :class="{'active':$route.path=='/stake'}" @click="goPage('/stake')">
            Staking
          </div>
          <div class="nav-item" :class="{'active':$route.path=='/lending'}" @click="goPage('/lending')">
            Lending
          </div>
          <div class="nav-item" :class="{'active':$route.path=='/auction/inauction'}"
               @click="goPage('/auction/inauction')">
            Auction
          </div>
          <div class="nav-item" :class="{'active':$route.path.indexOf('/governance')>=0}"
               @click="goPage('/governance/staking')">
            Governance
          </div>
        </div>
      </div>
      <div class="btn-box">
        <div class="chain-btn normal-btn" @click="isShowChain=true">
          <img class="icon" src="../assets/svg/ethereum.svg" alt="">
          Ethereum
        </div>

        <div class="lng-btn normal-btn" @click="isShowLng=true">
          <img class="icon" src="../assets/images/english_icon.webp" alt="">
          English
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Popup} from 'vant';
import {ChainIdMapByName} from "@/utils/constantData";

export default {
  name: "MNav",
  components: {Popup},
  data() {
    return {
      isShowLng: false,
      isShowChain: false,
      ChainIdMapByName,
    };
  },
  methods: {
    goPage(path){
      this.$router.push(path)
      this.$emit("closeDialog")
    },
    onClickOverlay() {
      this.isShowLng = false;
    },
    async switchNetwork(value) {

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId: value}],
        });
        this.connectWallet();
        this.showChooseChain = false;

      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        try {
          let paramsArry = [
            {
              chainId: this.networkObj[value].chainId,
              chainName: this.networkObj[value].chainName,
              rpcUrls: this.networkObj[value].rpcUrls,
              nativeCurrency: this.networkObj[value].nativeCurrency,
              blockExplorerUrls: this.networkObj[value].blockExplorerUrls ? this.networkObj[value].blockExplorerUrls : null,
            },
          ];
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: paramsArry,
          });
          this.connectWallet();
        } catch (addError) {
          console.log({addError});
        }
        this.showChooseChain = false;

      }
    },

  }
};
</script>

<style lang="scss" scoped>
.MNav {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  z-index: 100;

  .mask {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .lng-pop {
    z-index: 11;
  }

  .dialog-content {
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.05);
    border: 1px solid #E2E2E2;

    .lng-item {
      color: #000;
      display: flex;
      border-radius: 15px 15px 15px 15px;
      border: 1px solid #EAEAEA;
      align-items: center;
      padding: 10px;
      margin: 5px 10px;

      .icon-box {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 0px 10px #eee;
        margin-right: 10px;

        .icon {
          width: 20px;
          height: 20px;
        }
      }

      .icon {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }

    }
  }

  .MNav-content {
    position: fixed;
    right: 0;
    z-index: 10;
    top: 0;
    height: 100%;
    width: 60vw;
    background: #FFFFFF;
    color: #000000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 3vh;
    padding-top: 10vw;

    .close {
      position: absolute;
      width: 8vw;
      height: 8vw;
      right: 2vw;
      top: 3vh;
    }

    .nav-list {
      padding-left: 2vw;

      .nav-item {
        font-size: 4.2vw;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        padding: 3vh 0 3vh 0;
        border-bottom: 1px solid #E2E2E2;
      }
    }

    .lng-btn, .chain-btn {
      display: flex;
      align-items: center;
      position: relative;
      max-width: 200px;
      width: 60%;
      border: 1px solid #E2E2E2;
      color: #000000;
      margin: 0 auto;

      .icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
    }

    .chain-btn {
      margin-bottom: 20px;
    }
  }
}
</style>
