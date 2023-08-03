<template>
  <div class="TryBankerHeader">
    <MNav v-show="showMNav" @closeDialog="showMNav=false"/>
    <div class="header-content pc">
      <img alt="logo" class="logo" @click="$router.push('/')" src="../assets/images/logo.webp">
      <!--      <div class="nav-list">-->


      <!--        <div class="nav-item" :class="{'active':$route.path=='/'}" @click="$router.push('/')">-->
      <!--          Home-->
      <!--        </div>-->
      <!--        <div class="nav-item" :class="{'active':$route.path=='/stake'}" @click="$router.push('/stake')">-->
      <!--          Staking-->
      <!--        </div>-->
      <!--        <div class="nav-item" :class="{'active':$route.path=='/lending'}" @click="$router.push('/lending')">-->
      <!--          Lending-->
      <!--        </div>-->
      <!--        <div class="nav-item" :class="{'active':$route.path.indexOf('/auction')>=0}" @click="$router.push('/auction/inauction')">-->
      <!--          Auction-->
      <!--        </div>-->
      <!--        <div class="nav-item" :class="{'active':$route.path.indexOf('/governance')>=0}"-->
      <!--             @click="$router.push('/governance/staking')">-->
      <!--          Governance-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="tabs-box">
        <div class="tabs">
          <div @click="$router.push('/')" class="tab-box tab1">
            <div class="tab " :class="{active:$route.path==='/'}">
              Home
            </div>
          </div>

          <div @click="$router.push('/stake')" class="tab-box tab2">
            <div class="tab" :class="{active:$route.path==='/stake'}">
              Staking
            </div>
            <div class="sub-menu animate__fadeIn animate__animated" v-show="isShowLng">
              <div class="sub-menu-item" @click.stop="isShowLng=false" @click="$router.push('/stake')">
                Collateral staking
              </div>
              <div class="sub-menu-item" @click.stop="isShowLng=false" @click="$router.push('/stake?type=position')">
                Position
              </div>
              <div class="sub-menu-item" @click.stop="isShowLng=false" @click="$router.push('/stake?type=market')">
                Market
              </div>
            </div>
          </div>

          <div @click="$router.push('/lending')" class="tab-box tab3">
            <div class="tab " :class="{active:$route.path==='/lending'}">
              Lending
            </div>
          </div>

          <div @click="$router.push('/auction/inauction')"
               class="tab-box tab4">
            <div class="tab " :class="{active:$route.path.indexOf('/auction')>=0}">
              Auction
            </div>
            <div class="sub-menu animate__fadeIn animate__animated" v-show="isShowLng">
              <div class="sub-menu-item" @click.stop="isShowLng=false" @click="$router.push('/auction/inauction')">
                In Auction
              </div>
              <div class="sub-menu-item" @click.stop="isShowLng=false" @click="$router.push('/auction/nearliquidation')">
                Near Liquidation
              </div>
              <div class="sub-menu-item" @click.stop="isShowLng=false" @click="$router.push('/auction/inauction?type=history')">
                History
              </div>

            </div>
          </div>

          <div @click="$router.push('/governance/staking')"
               class="tab-box tab5">
            <div class="tab " :class="{active:$route.path.indexOf('/governance')>=0}">
              Governance
            </div>
            <div class="sub-menu animate__fadeIn animate__animated" v-show="isShowLng">
              <div class="sub-menu-item" @click.stop="isShowLng=false" @click="$router.push('/governance/claim')">
                TBC Claim
              </div>
              <div class="sub-menu-item" @click.stop="isShowLng=false" @click="$router.push('/governance/staking')">
                TBC Staking
              </div>


            </div>
          </div>
          <span class="glider" :style="`transform:translateX(${curLeft}px);width:${curWidth}`"
                v-if="$route.path!='/mynft'"></span>

        </div>


      </div>
      <div class="right-part">
        <div class="lng-btn normal-btn" @click="isShowLng=true">
          <!--          <img class="icon" src="../assets/images/english_icon.webp" alt="">-->
          EN
          <div class="lng-dialog" v-show="isShowLng">
            <div class="mask" @click.stop="isShowLng=false"></div>
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
          </div>
        </div>
        <Wallet/>
        <div class="person-icon normal-btn" @click="$router.push('/mynft')">
          <img class="icon" src="../assets/images/person_icon.webp" alt="">
        </div>
        <div class="notion-icon normal-btn" @click="showNotion=true">
          <img class="icon" src="../assets/images/notion_icon.webp" alt="">
          <div class="dot" v-show="unRead>0"/>
          <div class="notion-dialog animate__animated sha" v-show="showNotion">
            <div class="dialog-mask" @click.stop="showNotion=false"></div>
            <div class="dialog-content">
              <NotionDialog/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="header-content-m">
      <img alt="logo" class="logo" @click="$router.push('/')" src="../assets/images/logo.webp">
      <div class="right">
        <div class="notion-icon normal-btn" @click="isMWalletModal=true">
          <img class="icon" src="../assets/svg/wallet.svg" alt="">
        </div>
        <div class="person-icon normal-btn" @click="$router.push('/mynft')">
          <img class="icon" src="../assets/images/person_icon.webp" alt="">
        </div>
        <div class="notion-icon normal-btn" @click="showMNotion=true">
          <img class="icon" src="../assets/images/notion_icon.webp" alt="">
          <div class="dot" v-show="unRead>0"/>
        </div>
        <img @click="showMNav=true" class="menu icon" src="../assets/svg/menu.svg" alt="">
      </div>
    </div>
    <Popup
        round
        position="bottom" v-model:show="isMWalletModal" class="">
      <WalletDialog/>
    </Popup>
    <Popup
        position="right" v-model:show="showMNotion" class="notion-m">
      <NotionDialog/>
    </Popup>
  </div>
</template>

<script>
import {Popup} from "vant";
import Wallet from "@/components/Wallet";
import MNav from "@/components/MNav";
import WalletDialog from "@/components/WalletDialog";
import NotionDialog from "@/components/NotionDialog";

export default {
  name: "TryBankerHeader",
  components: {Wallet, MNav, Popup, WalletDialog, NotionDialog,},
  data() {
    return {
      showMNav: false,
      showNotion: false,
      showMNotion: false,
      activeNav: 1,
      isShowLng: false,
      isMWalletModal: false,
      showSign: false,
      curWidth: 0,
      curLeft: 0
    };
  },
  computed: {
    unRead() {
      return this.$store.state.app.unRead;
    }
  },
  watch: {
    $route(route) {
      const val = route.path;
      if (val === '/') {
        this.activeNav = 0;
      }
      if (val === '/stake') {
        this.activeNav = 1;
      }
      if (val === '/lending') {
        this.activeNav = 2;
      }
      if (val.indexOf('/auction') >= 0) {
        this.activeNav = 3;
      }
      if (val.indexOf('/governance') >= 0) {
        this.activeNav = 4;
      }
      const el = document.getElementsByClassName("tab" + (this.activeNav + 1))[0];
      this.curWidth = window.getComputedStyle(el).width;
      this.curLeft = el.offsetLeft;
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

.TryBankerHeader {
  width: 100vw;
  background: #2D2A27;
  color: #fff;

  .icon {
    opacity: 1;
  }

  .tabs-box {

    .tabs {
      display: flex;
      position: relative;
    }

    .tabs * {
      z-index: 2;
    }

    .tab-box {
      height: 100%;
      border-radius: 99px;
      padding: 30px 0;
      position: relative;

      .sub-menu {
        padding: 10px 20px;
        display: none;
        position: absolute;
        left: 0px;
        top: 80px;
        min-width: 140px;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 3px 10px #999999;

        .sub-menu-item {
          color: #333;
          cursor: pointer;
          padding: 10px 0;
          white-space: nowrap;
          &:hover {
            font-weight: bold;
          }
        }
      }

      &:hover {
        .tab {
          background: rgba(255, 255, 255, 0.1);
        }

        .sub-menu {
          display: block !important;
        }
      }
    }

    .tab {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      height: 36px;
      line-height: 36px;
      font-weight: 500;
      border-radius: 99px;
      cursor: pointer;

      &.active {
        color: #FFC001;
      }

      &:hover {
        opacity: 0.7;
      }
    }


    .glider {
      position: absolute;
      display: flex;
      width: 100px;
      height: 36px;
      margin: 30px 0;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 30px;
      z-index: 1;
      transition: 0.25s ease-out;
    }

    @media (max-width: 1300px) {
      .tabs {
        transform: scale(0.6);
      }
    }
  }

  .lng-dialog {
    z-index: 10;
    position: absolute;
    top: 50px;
    left: -40px;

    .mask {
      position: fixed;
      width: 100vw;
      height: 100vh;
      left: 0;
      top: 0;
      z-index: -1;
    }

    .dialog-content {
      position: relative;
      z-index: 10;
      width: 210px;
      background: #FFFFFF;
      box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.05);
      border-radius: 20px 20px 20px 20px;
      opacity: 1;
      border: 1px solid #E2E2E2;

      .lng-item {
        color: #000;
        display: flex;
        border-radius: 15px 15px 15px 15px;
        border: 1px solid #EAEAEA;
        align-items: center;
        padding: 10px;
        margin: 5px 10px;

        .icon {
          width: 30px;
          height: 30px;
        }

      }
    }
  }

  .header-content {
    width: var(--content-width);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;

    .logo {
      width: 140px;
      height: auto;
      margin-top: -16px;
    }

    @media screen and (min-width: 1920px) {
      .logo {
        width: 160px;
        height: auto;
      }
    }

    .nav-list {
      display: flex;
      transition: color 0.15s ease-in;

      .nav-item {
        min-width: 80px;
        width: 6vw;
        max-width: 150px;

        height: 36px;
        line-height: 36px;
        text-align: center;
        cursor: pointer;
        user-select: none;

        &.active {
          background: linear-gradient(225deg, #FFAB00 0%, #FFC600 100%);
          border-radius: 30px 30px 30px 30px;
          opacity: 1;
          font-size: 14px;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #333333;
        }


      }
    }

    .right-part {
      display: flex;
      align-items: center;

    }

    .lng-btn {
      margin-right: 10px;
      display: flex;
      align-items: center;
      position: relative;

      .icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        opacity: 1;
      }
    }

    .notion-icon {
      position: relative;

      .dot {
        position: absolute;
        top: 0px;
        right: 0px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #fa3e3e;
      }
    }

    .notion-icon, .person-icon {
      margin-left: 10px;
      text-align: center;
      width: 36px;
      height: 36px;
      padding: 0;
      line-height: 40px;
      position: relative;
      cursor: pointer;

      .notion-dialog {
        position: absolute;
        top: 70px;
        left: -160px;
        z-index: 10;

        .dialog-mask {
          position: fixed;
          z-index: 0;
          width: 100vw;
          height: 100vh;
          left: 0;
          top: 0;
        }

        .dialog-content {
          position: relative;
          z-index: 10;
          width: 320px;
          background: #fff;
          box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.05);
          border-radius: 20px 20px 20px 20px;
          border: 1px solid #E2E2E2;
        }
      }

      .icon {
        width: 16px;
        height: 16px;
        opacity: 1;
      }
    }

    .wallet {

    }
  }

  .header-content-m {
    display: none;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    padding: 20px 30px;

    .logo {
      width: 24vw;
      height: auto;
    }

    .right {
      display: flex;
      align-items: center;

    }

    .menu {
      width: 30px;
      height: 30px;
      margin-left: 10px;
    }

    .notion-icon, .person-icon {
      margin-left: 10px;
      text-align: center;
      width: 36px;
      height: 36px;
      padding: 0;
      line-height: 40px;

      .icon {
        width: 16px;
        height: 16px;
      }
    }
  }

  @media screen and (max-width: 1000px) {
    .notion-m {
      height: 100%;
      border-radius: 0;
    }
    .pc {
      display: none;
    }
    .header-content-m {
      display: flex;
    }
  }
}
</style>
