<template>
  <div class="SignDialog dialog animate__animated animate__fadeIn">
    <div class="dialog-mask" @click="$emit('closeDialog')"></div>
    <div class="dialog-content animate__fadeIn animate__animated ">
      <div class="dialog-header">
        <div class="title">
        </div>
        <img src="../assets/svg/close.svg" alt="" class="close" @click="$emit('closeDialog')">
      </div>
      <div class="dialog-container">
        <div class="title">
          Add e-mail to Subscribe NFTs Status
        </div>
        <div class="info">
          Authorize signatures to allow email to
          receive the latest NFT Auction notifications.
        </div>
        <div v-show="!isSendEmail">
          <div class="input-box">
            <input type="text" placeholder="Email" v-model="email">
            <img src="../assets/images/email_icon.webp" alt="" class="icon">

          </div>
          <div class="primary-btn-sha" @click="sendVerifyCode">
            Verify Email
          </div>
        </div>

        <div v-show="isSendEmail ">
          <div class="input-box">
            <input type="text" placeholder="Code" v-model="code">
            <img src="../assets/images/email_icon.webp" alt="" class="icon">
            <div class="resent-btn" :class="{'disable':canNotSendTime>0}" @click="sendVerifyCode">
              {{canNotSendTime>0?canNotSendTime:"Resend"}}
            </div>
          </div>
          <div class="primary-btn-sha" @click="verify">
            Submit
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {message} from "ant-design-vue";
import {emailSign, sendVerifyCode, verifyCode} from "@/api/common";
import {formatTimeNormal} from "@/utils/timeUtil";
let countdown
export default {
  name: "SignDialog",
  props: ["updateData", "closeDialog"],
  computed: {
    ...mapGetters([
      'isConnected',
      'account',
      'currentTheme',
      'web3'
    ]),
  },
  data() {
    return {
      canNotSendTime:60,
      isSendEmail: false,
      email: undefined,
      code: undefined
    }
  },
  methods: {

    async verify() {

      if (!this.code) {
        return
      }

      const res = await verifyCode({
        email: this.email,
        code: this.code
      })
      if (res.data.code === 0) {
        await this.sign()
      } else{
        message.error(res.data.msg)
      }
    },
    async sendVerifyCode() {
      if (!this.isConnected) {
        message.info("Please connect")
        return
      }
      if (!this.email) {
        message.info("Please input email")
        return
      }
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.email)) {
        message.info("Please input right Email")
        return
      }
      try {
        const res = await sendVerifyCode({
          email: this.email,
          address: this.account
        })
        if (res.data.code === 0) {
          this.isSendEmail = true
          this.canNotSendTime = 60
        } else{
          message.error(res.data.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async sign() {
      if (!this.isConnected) {
        message.info("Please connect")
        return
      }
      if (!this.email) {
        message.info("Please input email")
        return
      }
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.email)) {
        message.info("Please input right Email")
        return
      }
      try {
        let datetime = formatTimeNormal(new Date())
        let data = (`datetime:${datetime}
email:${this.email}`)
        data = (this.web3.utils.utf8ToHex(data)).toString('hex')
        const sign = await window.ethereum.request({
          method: 'personal_sign',
          params: [data, this.account, ""],
        });
        this.$store.commit("app/SET_ISSIGN", true)
        const res = await  emailSign({
          email: this.email,
          datetime,
          signature: sign,
          address: this.account
        })
        if(res.data.code === 0){
          this.$emit("closeDialog")
          this.$emit("updateData", this.email)
        }else{
          message.error(res.data.msg)
        }

      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted() {
    countdown = setInterval(() => {
      this.canNotSendTime--
    }, 1000)
  },
  beforeUnmount() {
    clearInterval(countdown)
  }
}
</script>

<style lang="scss" scoped>
.SignDialog {
  .dialog-container {
    width: 460px;
    padding: 0 20px;
    text-align: center;
  }

  .title {
    margin-top: 30px;
    font-size: 22px;
    font-family: Roboto-SemiBold, Roboto;
    font-weight: 600;
    color: #000000;
  }

  .input-box {
    position: relative;
    width: 100%;
    height: 60px;
    background: #F1F1F1;
    border-radius: 50px 50px 50px 50px;
    padding-left: 50px;
    margin-bottom: 35px;
    .resent-btn{
      position: absolute;
      right: 30px;
      top: 20px;
      font-size: 16px;
      cursor: pointer;
      &.disable{
        opacity: 0.3;
        cursor: not-allowed;
      }
    }
    .icon {
      width: 60px;
      height: 60px;
      position: absolute;
      top: 3px;
      left: 0px;
    }

    input {
      border-radius: 50px;
      width: 100%;
      background: none;
      height: 100%;

      &::placeholder {
        color: #C3C3C3;
      }
    }
  }

  .info {
    font-size: 16px;
    font-family: Roboto-Medium, Roboto;
    font-weight: 500;
    color: #333333;
    margin: 20px 5% 40px 5%;
    width: 90%;

    span {
      color: #FFAD01;
    }
  }

  .primary-btn-sha {
    width: 100%;
    font-family: RussoOneRegular, Russo One;
  }

  @media screen and (max-width: 1000px) {
    .dialog-container {
      width: 92vw;
    }
    .info {
      width: 100%;
      margin: 2vh 0 3vh 0;
    }

  }
}

</style>
