<template>
  <div class="DateList">
    <div class="data-list">
      <div class="data-list-header-box">
        <div class="data-list-header">
          <div class="col">
            Token
          </div>
          <div class="col">
            Total Deposited
          </div>
          <div class="col">
            Total Staked
          </div>
          <div class="col">
            Deposit APR
          </div>
          <div class="col">
            Borrow APR
          </div>
          <div class="col">
            Total Borrowed
          </div>
        </div>

      </div>
      <div class="list-item" v-for="(item,index) in dataObj" :key="index">
        <div class="col name">
          <img class="icon " :src="require('@/assets'+item.icon)" alt="">
          {{ item.name == "USD" ? USDByChainId[chainId] : item.name }}
        </div>
        <div class="col nft-stake autoShow">
          <span class="dealNum">{{ dealNum(item.deposit) }}</span>
          <span class="showNum">{{ showNum(item.deposit) }}</span>
        </div>
        <div class="col stake">
          {{ dealNum(item.staked_amount) }}
        </div>
        <div class="col ">
          {{ dealNum(item.deposit_apy * 100) }}%

        </div>
        <div class="col ">
          {{ dealNum(item.borrow_apy * 100) }}%

        </div>
        <div class="col " :class="{'token-borrow':item.name==='ETH'}">
          <div class="icon-box">
            <img class="icon coinIcon" :src="require('@/assets'+item.icon)" alt="">
            {{ dealNum(item.borrow_amount) }}
          </div>
        </div>
      </div>
    </div>

    <div class="data-list-m">
      <div class="list-item" v-for="(item,index) in dataObj" :key="index">
        <div class="list-header">
            <img class="icon " :src="require('@/assets'+item.icon)" alt="">
            {{ item.name == "USD" ? USDByChainId[chainId] : item.name }}
        </div>
        <div class="data-box">
          <div class="name">
            Total Deposited
          </div>
          <div class="value-box">
            {{ dealNum(item.deposit) }}
          </div>
        </div>
        <div class="data-box">
          <div class="name">
            Total Staked
          </div>
          <div class="value-box">
            {{ dealNum(item.staked_amount) }}
          </div>
        </div>
        <div class="data-box">
          <div class="name">
            Deposit APR
          </div>
          <div class="value-box">
            {{ dealNum(item.deposit_apy * 100) }} %
          </div>
        </div>
        <div class="data-box">
          <div class="name">
            Borrow APR
          </div>
          <div class="value-box">
            {{ dealNum(item.borrow_apy * 100) }} %
          </div>
        </div>
        <div class="data-box">
          <div class="name">
            Total Borrowed
          </div>
          <div class="value-box">
            <img class="icon coinIcon" :src="require('@/assets'+item.icon)" alt="">
            <span>{{ dealNum(item.borrow_amount) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {formatTime} from "@/utils/timeUtil";
import bigNumberUtil from "@/utils/bigNumberUtil";
import {USDByChainId} from "../../../utils/constantData";

const calculator = new bigNumberUtil();

export default {
  name: "DataList",
  props: ["dataObj"],
  computed: {
    USDByChainId() {
      return USDByChainId
    },
    ...mapGetters(["baseUrl", "chainId"])
  },
  data() {
    return {
      formatTime,
      dealNum: calculator.dealNum,
      showNum:calculator.showNum
    }
  }
}
</script>

<style lang="scss" scoped>
.DateList {
  .data-list {
    .data-list-header-box {
      padding: 40px 50px 30px;
      border-bottom: 1px solid #E2E2E2;

      .data-list-header {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        white-space: nowrap;
        font-family: Roboto-SemiBold, Roboto;
        font-weight: 600;
        color: #999999;
        line-height: 19px;
      }
    }

    .col {
      &:nth-child(1) {
        width: 17%;
      }

      &:nth-child(2) {
        width: 20%;
      }

      &:nth-child(3) {
        width: 13%;
      }

      &:nth-child(4) {
        width: 15%;
      }

      &:nth-child(5) {
        width: 20%;
      }

      &:nth-child(6) {
        width: 15%;
      }


    }

    .list-item {
      display: flex;
      justify-content: space-between;
      margin: 0 50px;
      padding: 25px 0;

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }


      .col {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-family: Roboto-SemiBold, Roboto;
        font-weight: 600;
        color: #000000;

        .icon-box {
          display: flex;
          align-items: center;

          .icon {
            margin-right: 10px;
            width: 20px;
            height: 20px;
          }
        }
      }
      .name {
        .icon {
          width: 40px;
          height: 40px;
          margin-right: 10px;
          opacity: 1;
        }

        font-size: 18px;
        font-family: Roboto-Black, Roboto;
        font-weight: 900;
        color: #000000;
        line-height: 21px;
      }

      .stake, .borrow {
        .icon {
          margin-right: 10px;

        }
      }

      .nft-stake {
        .icon {
          margin-left: 10px;

        }

      }

      .floor-price, .loan-to-value {
        display: block;

        .icon-box {
          display: flex;
          align-items: center;

          &:nth-child(2) {
            margin-top: 15px;
          }

          .icon {
            margin-right: 10px;
            width: 30px;
            height: 30px;
          }
        }
      }

      .token-borrow {
        display: block;

        .icon-box {
          display: flex;
          align-items: center;

          .icon {
            margin-right: 10px;
            width: 20px;
            height: 20px;
          }
        }

        .worth {
          margin-top: 10px;
          font-size: 14px;
          font-family: Roboto-SemiBold, Roboto;
          font-weight: 600;
          color: #999999;
          padding-left: 30px;
        }
      }
    }
  }

  .data-list-m {
    display: none;
  }

  @media screen and (max-width: 1000px) {
    .data-list {
      display: none;
    }
    .data-list-m {
      display: block;
      flex-wrap: wrap;
      padding: 0 5vw;

      .list-item {
        display: flex;
        flex-wrap: wrap;
      }

      .list-header {
        width: 100%;
        display: flex;
        margin: 2vh 0;
        font-family: Roboto-Black, Roboto;
        font-weight: 900;
        font-size: 4vw;

        .icon {
          width: 6vw;
          height: 6vw;
          margin-right: 1vw;
        }
      }

      .data-box {
        margin-left: 4.5%;
        width: 30%;
        margin-top: 2vh;
        white-space: nowrap;

        &:nth-child(3n - 4) {
          margin-left: 0;
        }

        .name {
          font-size: 3.2vw;
          font-family: Roboto-SemiBold, Roboto;
          font-weight: 600;
          color: #C0C0C0;
        }

        .value-box {
          font-size: 3.2vw;
          font-family: Roboto-SemiBold, Roboto;
          font-weight: 600;
          margin-top: 1vh;
          display: flex;
          align-items: center;

          .icon {
            width: 16px;
            height: 16px;
            margin-right: 3px;
          }

          .mul-line {
            .in-line {
              &:last-child {
                margin-top: 1vh;
              }
            }
          }
        }
      }
    }
  }
}
</style>
