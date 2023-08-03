<template>
  <div class="WalletDialog">
    <div class="connect-modal-dialog">
      <div class="dialog-mask" @click.stop="$emit('closeDialog')"></div>
      <div class="dialog-content" @click.stop.prevent>
        <div class="connect-mask" :class="{connected:isConnected}" @click.stop.prevent="registerWeb3()">
          <img class="logo" src="../assets/images/metamask_icon.webp" alt="">
          <div class="connect-mask-content">
            <div class="name">
              MetaMask
            </div>
            <div class="address" v-show="isConnected">
              {{ showAccount }}
            </div>
          </div>

          <img src="../assets/svg/right.svg" alt="" v-show="isConnected" class="right">
          <div class="logout" v-show="isConnected" @click.stop="disConnect">
            Log Out
          </div>
        </div>


        <div class="balance-box">
          <div class="balance-title">
            Balance
          </div>
          <div class="balance-list">
            <div class="balance">
              <div class="name">
                <img src="../assets/svg/ethereum.svg" alt="" class="icon">
                ETH
              </div>
              <div class="value">
                {{ dealNum(ethBalance) }}
              </div>
            </div>
            <div class="balance">
              <div class="name">
                <img src="../assets/svg/usdt.svg" alt="" class="icon">
                USDT
              </div>
              <div class="value">
                {{ dealNum(usdtBalance) }}
              </div>
            </div>
          </div>
        </div>
        <div class="email-box" v-show="updateEmail||!curEmail">
          <div v-show="!isSendEmail">
            <div class="input-box">
              <input type="text" placeholder="Email" v-model="email">
              <img src="../assets/images/email_icon.webp" alt="" class="icon">
            </div>
            <div class="primary-btn" @click="sendVerifyCode">
              Verify Email
            </div>
          </div>

          <div v-show="isSendEmail ">
            <div class="input-box">
              <input type="text" placeholder="Code" v-model="code">
              <div class="resent-btn" :class="{'disable':canNotSendTime>0}" @click="sendVerifyCode">
                {{ canNotSendTime > 0 ? canNotSendTime : "Resend" }}
              </div>
            </div>
            <div class="primary-btn" @click="verify">
              Submit
            </div>
          </div>
        </div>
        <div class="email-box" v-show="curEmail&&!updateEmail">
          <div class="input-box">
            <img src="../assets/images/email_icon.webp" alt="" class="icon">
            <strong>{{ curEmail }}</strong>
          </div>
          <div class="primary-btn" @click="updateEmail=true">
            Update Email
          </div>
        </div>
      </div>
    </div>
    <SignDialog @closeDialog="showSign=false" v-show="showSign"/>

  </div>
</template>

<script>

import getWeb3 from "../utils/getWeb3";
import {mapGetters} from "vuex";
import {Network} from '@/config/constants';
// import detectEthereumProvider from '@metamask/detect-provider';
import {message} from "ant-design-vue";
import SignDialog from "@/components/SignDialog";
import bigNumberUtil from "@/utils/bigNumberUtil";

const calculator = new bigNumberUtil();
import {emailSign, sendVerifyCode, verifyCode} from "@/api/common";
import {formatTimeNormal} from "@/utils/timeUtil";

let countdown;

export default {
  name: "WalletDialog",
  components: {SignDialog},
  props: ["closeDialog"],
  data() {
    return {
      code: undefined,
      updateEmail: false,
      dealNum: calculator.dealNum,
      connectedLoading: false,
      networkObj: Network,
      curChain: "bscTest",
      isSendEmail: false,
      connectIdx: 0,
      connectArr: ['', 'MetaMask', 'WalletConnect', 'Fortmatic'],
      isShowConnectStatus: false,
      isShowConnect: false,
      wrongNetWork: false,
      showSign: false,
      email: undefined,
      canNotSendTime: 60
    };
  },
  computed: {
    ...mapGetters([
      'isConnected',
      'account',
      'currentTheme',
      'ethBalance',
      'usdtBalance',
      'isSign',
      'web3'
    ]),
    curEmail() {
      return this.$store.state.app.curEmail;
    },
    chainId() {
      return this.$store.state.app.chainId;
    },
    desireChainId() {
      return this.$store.state.app.desireChainId;
    },
    showAccount() {
      return this.account.substring(0, 6) + '...' + this.account.substring(38, 42);
    }
  },

  watch: {
    chainId(chainId) {
      if (chainId == this.desireChainId) {
        this.wrongNetWork = false;
      } else {
        this.wrongNetWork = true;
      }
    },

  },
  async mounted() {
    try {
      const chain = localStorage.getItem('curChain');
      if (chain && chain.length > 0) {
        this.curChain = chain;
      }
    } catch (e) {
      console.log(e);
    }
    countdown = setInterval(() => {
      this.canNotSendTime--;
    }, 1000);
  },
  beforeUnmount() {
    clearInterval(countdown);
  },
  methods: {
    async verify() {
      if (!this.code) {
        return;
      }

      const res = await verifyCode({
        email: this.email,
        code: this.code
      });
      if (res.data.code === 0) {
        await this.sign();
      } else {
        message.error(res.data.msg);
      }
    },
    async sendVerifyCode() {
      if (!this.isConnected) {
        message.info("Please connect");
        return;
      }
      if (!this.email) {
        message.info("Please input email");
        return;
      }
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.email)) {
        message.info("Please input right Email");
        return;
      }
      try {
        const res = await sendVerifyCode({
          email: this.email,
          address: this.account
        });
        if (res.data.code === 0) {
          this.isSendEmail = true;
          this.canNotSendTime = 60;
        } else {
          message.error(res.data.msg);
        }
      } catch (e) {
        console.log(e);
      }
    },
    async sign() {
      if (!this.isConnected) {
        message.info("Please connect");
        return;
      }
      if (!this.email) {
        message.info("Please input email");
        return;
      }
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.email)) {
        message.info("Please input right Email");
        return;
      }
      try {
        let datetime = formatTimeNormal(new Date());
        let data = (`datetime:${datetime}
email:${this.email}`);
        data = (this.web3.utils.utf8ToHex(data)).toString('hex');
        const sign = await window.ethereum.request({
          method: 'personal_sign',
          params: [data, this.account, ""],
        });
        this.$store.commit("app/SET_ISSIGN", true);
        const res = await emailSign({
          email: this.email,
          datetime,
          signature: sign,
          address: this.account
        });
        if (res.data.code === 0) {
          setTimeout(() => {
            this.$emit("updateData");
            this.updateEmail = false;
            this.isSendEmail = false;
            this.code = undefined;

          }, 2000);
        } else {
          message.error(res.data.msg);
        }

      } catch (e) {
        console.log(e);
      }
    },
    async switchNetwork(value) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId: value}],
        });
        this.registerWeb3();
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
          this.registerWeb3();
        } catch (addError) {
          console.log({addError});
        }
      }
    },

    async registerWeb3() {
      // const provider = await detectEthereumProvider();
      const provider = window.ethereum;
      if (provider) {
        // From now on, this should always be true:
        // provider === window.ethereum

        try {

          if (window.ethereum) {
            try {
              await window.ethereum
                  .request({method: 'eth_requestAccounts'})
                  .then((res) => {
                    console.log(res);
                  }).catch(err => {
                    console.log(err);
                  })
              this.handleConnect(provider);

            } catch (error) {
              console.error("MetaMask Account access is denied. Procedure:", error);
            }
          }
        } catch (e) {
          console.log(e);
          message.info(e);
        }
      } else {
        message.info('Install MetaMask first!');
      }

    },
    handleConnect(provider) {
      // if(this.$store.state.app.onConnecting){
      //   return
      // }

      return new Promise(resolve => {

        getWeb3(provider).then(async result => {
          this.$store.commit("app/SET_Web3", result.web3);
          try {
            await window.ethereum
                .request({method: 'eth_requestAccounts'})
                .then(async (accounts) => {
                  if (accounts && accounts.length > 0) {
                    this.$store.commit("app/SET_ACCOUNT", accounts[0]);
                  }

                  this.$store.dispatch("app/getETHBalance");
                });
          } catch (e) {
            console.log(e);
            return
          }
          try {
            window.ethereum.on('accountsChanged', async (accounts) => {
              if (accounts && accounts.length > 0) {
                this.$store.dispatch("app/getETHBalance");
                this.$store.commit("app/SET_ACCOUNT", accounts[0]);
              }
            });
            window.ethereum.on('chainChanged', async () => {
              this.$store.dispatch("app/getETHBalance");

              let chainId = await window.ethereum.request({method: 'eth_chainId'});
              this.$store.commit("app/SET_CHAINID", chainId);
            });
            const _this = this;
            window.ethereum.on('disconnect', async () => {
              _this.disConnect();
            });
          } catch (e) {
            message.info(e);
          }

          try {
            let chainId = await window.ethereum.request({method: 'eth_chainId'});
            this.$store.commit("app/SET_CHAINID", chainId);
            if ((chainId == this.desireChainId) && this.account) {
              this.$store.commit("app/SET_ISCONNECT", true);
            }
            if (!(chainId == this.desireChainId)) {
              message.error("Please choose right chain");
              this.switchNetwork(this.desireChainId);
            }
          } catch (e) {
            this.isWalletModal = false;
          }

          // if (this.account && !this.wrongNetWork && !this.isSign) {
          //   this.showSign = true
          // }

          this.$emit("closeDialog");
          this.$store.commit("app/SET_ONCONNECTING", false);
          resolve(result);
        });
      }).catch(err => {
        message.error(err);
      });
    },
    disConnect() {
      if (this.connectIdx != 1) {
        if (this.provider) this.provider.disconnect();
        this.isShowConnectStatus = false;
      }
      this.$store.commit("app/SET_ACCOUNT", "");
      this.$store.commit("app/SET_ISCONNECT", false);
      this.$store.commit("usdt/SET_Balance", 0);
      this.$store.commit("app/SET_Balance", 0);
      this.$store.commit("app/SET_Web3", null);
      this.$store.commit("app/SET_CurEmail", null);
    }
  },
};
</script>

<style lang="scss" scoped>

.connect-modal-dialog {
  width: 100%;

  .dialog-mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    background: rgba(0, 0, 0, 0.3);

  }

  .dialog-content {
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.05);
    border-radius: 20px 20px 20px 20px;
    border: 1px solid #E2E2E2;
    padding: 20px 20px 40px;
    z-index: 10;
    position: relative;

    .connect-mask {
      padding: 6px 0 6px;
      border-radius: 15px;
      border: 1px solid #EAEAEA;
      position: relative;
      &.connected{
        padding-bottom: 30px;
      }
      .logout {
        position: absolute;
        color: #999;
        left: calc(50% - 20px);
        bottom: 10px;
      }

      .right {
        position: absolute;
        width: 20px;
        right: 16px;
      }

      .logo {
        width: 70px;
        height: 70px;
      }

      font-family: Roboto-Medium, Roboto;
      display: flex;
      align-items: center;

      .connect-mask-content {
        .name {
          font-size: 16px;
          font-weight: 500;
          text-align: left;
          color: #000000;
          line-height: 19px;
        }

        .address {
          margin-top: 10px;
          font-weight: 500;
          color: #999999;
        }
      }
    }

    .email-box {
      padding: 10px;
      margin-top: 40px;
      border-radius: 15px;
      border: 1px solid #EAEAEA;

      .input-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;

        .resent-btn {
          width: 60px;
          height: 60px;
          font-size: 16px;
          color: #333;
          cursor: pointer;
          position: relative;
          top: 20px;

          &.disable {
            opacity: 0.3;
            cursor: not-allowed;
          }
        }

        strong {
          color: #333;
          width: 200px;
        }

        .icon {
          width: 60px;
          height: 60px;
          margin-right: 10px;
          opacity: 1;
        }

        input {
          width: 200px;
          height: 40px;
          background: #EAEAEA;
          border-radius: 10px 10px 10px 10px;
          color: #333;
          border: none;
          padding: 0 10px;

          &::placeholder {
            color: #C3C3C3;
          }
        }

      }

      .primary-btn {
        margin-top: 15px;
        border-radius: 10px;
        width: 100%;
        font-size: 14px;
        font-family: Roboto-Bold, Roboto;
        font-weight: bold;
        color: #613A00;
      }
    }

    .balance-box {
      width: 100%;

      .balance-title {
        font-size: 16px;
        color: #999999;
        margin: 30px 0 20px;
        text-align: left;
      }

      .balance-list {
        color: #000;

        .balance {
          font-weight: bold;
          align-items: center;
          font-size: 14px;
          display: flex;
          justify-content: space-between;
          font-family: Roboto-SemiBold, Roboto;

          &:last-child {
            margin-top: 10px;
          }

          .name {
            display: flex;
            align-items: center;

            .icon {
              width: 30px;
              margin-right: 6px;
            }
          }

        }
      }
    }
  }

  @media screen and (max-width: 1000px) {
    .dialog-mask {
      display: none;
    }
  }
}

.connectWallet {
  .connect-btn {
    width: 190px;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    line-height: 16px;
    padding: 0 10px;

    .left-part {
      width: 60%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dot {
      width: 8px;
      height: 8px;
      background: #D8D8D8;
      border-radius: 50%;

      &.active {
        background: #52DF9B;
      }
    }

    .line {
      margin: 0 5px;
      height: 100%;
      width: 1px;
      background: rgba(255, 255, 255, 0.5);
    }

    .icon {
      width: 20px;
      height: 20px;
    }
  }

}
</style>
