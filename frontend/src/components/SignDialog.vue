<template>
  <div class="SignDialog dialog animate__animated animate__fadeIn">
    <div class="dialog-mask"></div>
    <div class="dialog-content animate__fadeIn animate__animated ">
      <div class="dialog-header">
        <div class="title">
        </div>
        <img src="../assets/svg/close.svg" alt="" class="close" @click="$emit('closeDialog')">
      </div>
      <div class="dialog-container">
        <img src="../assets/images/logo.webp" alt="" class="logo">
        <div class="title">
          Welcome to ThyBanker
        </div>
        <div class="info">
          By connecting your wallet and using ThyBanker,
          you agree to our <span>Disclaimer</span>  and  <span>Privacy Policy</span>
        </div>
        <div class="primary-btn-sha" @click="sign">
          Accept and Sign
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "SignDialog",
  computed: {
    ...mapGetters([
      'isConnected',
      'account',
      'currentTheme'
    ]),
  },
  methods:{
    async sign(){
      try {
        /**sign**/
        console.log("Sing")
        const from = this.account;
        // For historical reasons, you must submit the message to sign in hex-encoded UTF-8.
        // This uses a Node.js-style buffer shim in the browser.
        const msg = `0x${ "Sign Test".toString('hex')}`;
        const sign = await window.ethereum.request({
          method: 'personal_sign',
          params: [msg, from, 'Example password'],
        });
        console.log(sign)
        this.$store.commit("app/SET_ISSIGN",true)
        this.$emit("closeDialog")
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.SignDialog{
  .dialog-container{
    width: 460px;
    padding: 0 20px;
    text-align: center;
  }
  .logo{
    width: 160px;
    height: 50px;
    margin-top: 20px;
  }
  .title{
    margin-top: 30px;
    font-size: 24px;
    font-family: Roboto-SemiBold, Roboto;
    font-weight: 600;
    color: #000000;
  }
  .info{
    font-size: 16px;
    font-family: Roboto-Medium, Roboto;
    font-weight: 500;
    color: #333333;
    margin: 20px 5% 60px 5%;
    width: 90%;
    span{
      color: #FFAD01;
    }
  }
  .primary-btn-sha{
    width: 100%;
    font-family: RussoOneRegular, Russo One;
  }
  @media screen and (max-width: 1000px) {
    .dialog-container {
      width: 92vw;
    }
    .info{
      width: 100%;
      margin: 2vh 0 3vh 0;
    }

  }
}

</style>
