<template>
  <div class="CreateProposalView">
    <div class="header">
      <img src="../../assets/svg/back.svg" @click="$emit('close')" alt="" class="icon">
      <div class="title">
        New Proposal
      </div>
    </div>
    <div class="form-content">
      <div class="name">
        Title
      </div>
      <div class="input-box">
        <input type="text">
      </div>
      <div class="name">
        Description
      </div>
      <div class="input-box">
        <Textarea type="text" class="desc-text" :maxlength="400" show-count/>
      </div>
      <Upload list-type="picture-card"
              class="avatar-uploader"
      >
        <img v-if="imageUrl" :src="imageUrl" alt="avatar"/>
        <div v-else>
<!--          <loading-outlined v-if="loading"></loading-outlined>-->
<!--          <plus-outlined v-else></plus-outlined>-->
          <div class="ant-upload-text">Upload</div>
        </div>

      </Upload>
      <div class="name">
        Select
      </div>
      <div class="select-proposal">
        +
      </div>
      <div class="name">
        Time
      </div>
      <div class="choose-time">
        <DatePicker format="YYYY-MM-DD"></DatePicker>
        <TimePicker format="HH:mm"></TimePicker>
        -
        <DatePicker format="YYYY-MM-DD"></DatePicker>
        <TimePicker format="HH:mm"></TimePicker>
      </div>
      <div class="primary-btn-sha">
        Create Proposal
      </div>
    </div>
  </div>
</template>

<script>
import {Textarea, Upload, DatePicker, TimePicker} from "ant-design-vue"

export default {
  name: "CreateProposalView",
  components: {Textarea, Upload, DatePicker, TimePicker},
  data() {
    return {
      imageUrl: ""
    }
  }
}
</script>

<style lang="scss" scoped>
.CreateProposalView {
  width: 620px;
  margin: 0 auto;

  ::v-deep(.ant-input-textarea) {
    padding: 0;
    position: relative;

    textarea {
      width: 100%;
      height: 240px;
      background: #FFFFFF;
      border-radius: 20px 20px 20px 20px;
      border: 1px solid #E2E2E2;
    }
  }

  ::v-deep(.ant-input-textarea-show-count::after) {
    position: absolute;
    right: 20px;
    bottom: 10px;
  }

  .header {
    display: flex;

    .icon {
      width: 36px;
      margin-right: 10px;
      cursor: pointer;
    }

    .title {
      font-size: 26px;
      font-family: Roboto-SemiBold, Roboto;
      font-weight: 600;
      color: #000000;
    }
  }

  .form-content {
    .name {
      font-size: 20px;
      font-family: Roboto-Bold, Roboto;
      font-weight: bold;
      margin: 30px 0 20px 0;
    }

    .input-box {
      input {
        width: 100%;
        height: 60px;
        background: #FFFFFF;
        border-radius: 50px 50px 50px 50px;
        border: 1px solid #E2E2E2;
      }

      .desc-text {

      }

    }

    .avatar-uploader {
      margin-top: 10px;
      width: 100px;
      height: 100px;
      background: #FFFFFF;
      border-radius: 20px 20px 20px 20px;
      border: 1px solid #E2E2E2;
    }

    .select-proposal {
      width: 100%;
      height: 60px;
      background: #FFFFFF;
      border-radius: 50px 50px 50px 50px;
      border: 1px solid #E2E2E2;
      font-size: 26px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #999999;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .choose-time {
      ::v-deep(.ant-picker-suffix) {
        display: none;
      }
    }

    .primary-btn-sha {
      font-size: 20px;
      font-family: RussoOneRegular, Russo One;
      font-weight: 400;
      height: 50px;
      margin-top: 40px;
      line-height: 50px;
    }
  }
}

@media screen and (max-width: 1000px) {
  .CreateProposalView {
    width: 100%;
    padding-top: 0;
  }
}
</style>
