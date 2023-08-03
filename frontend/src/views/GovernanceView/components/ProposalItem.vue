<template>
  <div class="ProposalItem">
    <div class="proposal-item-header">
      <div class="left">
        <img src="../../../assets/images/coin-logo.webp" alt="" class="icon">
        <div class="address">
          0x0a63…006C
        </div>
      </div>
      <div class="right">
        End Feb 11, 2023, 1:55 PM
      </div>
    </div>
    <div class="proposal-item-content">
      <div class="title">
        Adjust the amount of rewards for ThyBanker platform activities
      </div>
      <div class="content">
        Dear ThyBanker users,
        ThyBanker will reduce the amount of TBC rewards for the following platform activities. The reduced amount will
        not be released into the token’s circulating supply. For the …
      </div>
      <div class="proposal-progress">
        <div class="name">
          Proposal1
        </div>
        <div class="progress-box">
          <div class="progress"></div>
        </div>
        <div class="value">50%</div>
      </div>
      <div class="proposal-progress">
        <div class="name">
          Proposal2
        </div>
        <div class="progress-box">
          <div class="progress"></div>
        </div>
        <div class="value">50%</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProposalItem"
}
</script>

<style lang="scss" scoped>
.ProposalItem {
  width: 100%;
  background: #FFFFFF;
  box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.05);
  border-radius: 20px 20px 20px 20px;
  opacity: 1;
  border: 1px solid #E2E2E2;
  margin-bottom: 20px;

  .proposal-item-header {
    padding: 20px 40px;
    border-bottom: 1px solid #D2D2D2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #000000;

      .icon {
        width: 30px;
        height: 30px;
        margin-right: 10px;
        opacity: 1;
      }

    }

    .right {
      font-size: 16px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #999999;
    }
  }

  .proposal-item-content {
    padding: 20px 40px;

    .title {
      font-size: 18px;
      font-family: Roboto-Bold, Roboto;
      font-weight: bold;
    }

    .content {
      margin-top: 20px;
      font-size: 14px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      padding-bottom: 20px;
    }

    .proposal-progress {
      margin-top: 10px;
      display: flex;
      align-items: center;

      .name {
        font-size: 14px;
        font-family: Roboto-Bold, Roboto;
        font-weight: bold;
        color: #333333;
      }

      .progress-box {
        margin: 0 10px;
        width: 70%;
        height: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #E2E2E2;
        border-radius: 38px 38px 38px 38px;
        position: relative;
        padding: 1px;

        .progress {
          position: absolute;
          height: 13px;
          width: 50%;
          background: linear-gradient(225deg, #FFAB00 0%, #FFC600 100%);
          border-radius: 23px 23px 23px 23px;
          left: 1px;
          top: 1px;
        }
      }

      .value {
        font-size: 14px;
        font-family: Roboto-Bold, Roboto;
        font-weight: bold;
        color: #FFC001;
      }
    }
  }
}
@media screen and (max-width: 1000px) {
  .ProposalItem{
    .proposal-item-header{
      padding: 3vh 5vw;
      .left{
        font-size: 3.6vw;
      }
      .right{
        font-size: 3.6vw;
      }
    }
    .proposal-item-content{
      padding: 3vh 5vw;
      .title{
        font-size: 3.8vw;
      }
      .content{
        font-size: 3.2vw;
      }
      .proposal-progress{
        .name,.value{
          font-size: 3.4vw;
        }
      }
    }
  }
}

</style>
