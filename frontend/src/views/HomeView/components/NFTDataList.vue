<template>
  <div class="DateList">
    <div class="data-list">
      <div class="data-list-header-box">
        <div class="data-list-header">
          <div class="col">
            Collection
          </div>
          <div class="col">
            NFT Staked
          </div>
          <div class="col">
            Staked Times
          </div>
          <div class="col">
            Total Staked
          </div>
          <div class="col">
            Floor Price
          </div>
          <div class="col">
            Loan to Value
            <Tooltip placement="top">
              <template #title>
                <span>Maximum borrowing amount per series of NFTs. Stake 100,000 TBC users to enjoy an additional 10% borrowing limit.
                </span>
              </template>
              <img src="../../../assets/images/tip_icon.webp" alt="" class="coinIcon tip-icon"/>
            </Tooltip>
          </div>
          <div class="col">
            Total Borrowed
          </div>
        </div>
      </div>
      <div class="list-item" v-for="(item,index) in dataObj" :key="index">
        <div class="col name">
          <img class="icon " :src="require('@/assets'+item.icon)" alt="">
          {{ item.name }}
        </div>
        <div class="col nft-stake" @click="goScan(item)">
          {{ dealNum(item.total_staking) }}
          <img v-if="networkName=='Polygon'" class="icon coinIcon" style="margin-left: 6px"
               src="../../../assets/svg/polygonscan.png" alt="">
          <img v-else class="icon coinIcon" style="margin-left: 6px" src="../../../assets/svg/etherscan.svg" alt="">
        </div>
        <div class="col">
          {{ (item.staked_times) }}
        </div>
        <div class="col stake">
          <img class="icon coinIcon" :src="require('@/assets/svg/usdt.svg')" alt="">
          {{ dealNum(item.staked_value) }}
        </div>
        <div class="col floor-price">
          <div class="icon-box" v-for="(flItem,index) in item.floor_price" :key="index">
            <img class="icon coinIcon" :src="require('@/assets'+flItem.icon)" alt="">
            {{ dealNum(flItem.value) }}
          </div>
        </div>
        <div class="col loan-to-value">
          <div class="value">
            {{ dealNum(item.max_borrow_rate) * 100 }}%
            <span class="incr" v-if="item.tbc_incr_rate>0"> + {{ dealNum(item.tbc_incr_rate) * 100 }}%</span>
          </div>
          <div class="right">
            <div class="icon-box" v-for="(flItem,index) in item.max_borrow" :key="index">
              <img class="icon coinIcon" :src="require('@/assets'+flItem.icon)" alt="">
              {{ dealNum(flItem.value) }}
              <span class="incr gray" v-if="item.tbc_incr_rate>0"> + {{ dealNum(flItem.plus) }}</span>
            </div>
          </div>
        </div>
        <div class="col borrow">
          <img class="icon coinIcon" src="../../../assets/svg/usdt.svg" alt="">
          {{ dealNum(item.borrow_sum) }}
        </div>
      </div>

    </div>
    <div class="data-list-m">
      <div class="list-item" v-for="(item,index) in dataObj" :key="index">
        <div class="item-header">
          <img class="icon " :src="require('@/assets'+item.icon)" alt="">
          <div class="name">
            {{ item.name }}
          </div>
        </div>
        <div class="data-box">
          <div class="name">
            NFT Staked
          </div>
          <div class="col nft-stake" @click="goScan(item)">
            {{ dealNum(item.total_staking) }}
            <img v-if="networkName=='Polygon'" class="icon coinIcon" style="margin-left: 3px"
                 src="../../../assets/svg/polygonscan.png" alt="">
            <img v-else class="icon coinIcon" style="margin-left: 3px" src="../../../assets/svg/etherscan.svg" alt="">

          </div>
        </div>
        <div class="data-box">
          <div class="name">
            staked Times
          </div>
          <div class="value-box">
            {{ (item.staked_times) }}
          </div>
        </div>
        <div class="data-box">
          <div class="name">
            Total Staked
          </div>
          <div class="value-box">
            <img src="../../../assets/svg/usdt.svg" alt="" class="icon coinIcon">
            {{ dealNum(item.staked_value) }}
          </div>
        </div>
        <div class="data-box">
          <div class="name">
            Floor Price
          </div>
          <div class="value-box">
            <div class="mul-line">
              <div class="in-line" v-for="(flItem,index) in item.floor_price" :key="index">
                <img class="icon coinIcon" :src="require('@/assets'+flItem.icon)" alt="">
                {{ dealNum(flItem.value) }}
              </div>
            </div>
          </div>
        </div>
        <div class="data-box">
          <div class="name">
            Loan to Value
          </div>
          <div class="value-box">
            <span style="margin-right: 6px">
              {{ dealNum(item.max_borrow_rate) * 100 }}%
            </span>
            <div class="mul-line">
              <div class="in-line" v-for="(flItem,index) in item.max_borrow" :key="index">
                <img class="icon coinIcon" :src="require('@/assets'+flItem.icon)" alt="">
                {{ dealNum(flItem.value) }}
              </div>
            </div>
          </div>
        </div>
        <div class="data-box">
          <div class="name">
            Total Borrowed
          </div>
          <div class="value-box">
            <img src="../../../assets/svg/usdt.svg" alt="" class="icon coinIcon">
            {{ dealNum(item.borrow_sum) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bigNumberUtil from "@/utils/bigNumberUtil";

const calculator = new bigNumberUtil();
import {mapGetters} from "vuex";
import {formatTime} from "@/utils/timeUtil";
import {EthscanUrlByChainId} from "@/utils/constantData";
import addressMap from "@/abi/addressMap";
import {Tooltip} from "ant-design-vue";

export default {
  name: "DataList",
  props: ["dataObj", "networkName"],
  components: {Tooltip},
  computed: {
    ...mapGetters(["account", "isConnected", "chainId"]),
    onRightChain() {
      return this.$store.state.app.onRightChain;
    }
  },
  data() {
    return {
      formatTime,
      dealNum: calculator.dealNum
    };
  },
  methods: {
    goScan(item) {
      if (!this.onRightChain) {
        return;
      }
      console.log(EthscanUrlByChainId[this.chainId]);
      window.open(EthscanUrlByChainId[this.chainId] + 'token/' + item.address + '?a=' + addressMap[this.chainId].stake);
    }
  }
};
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
        font-family: Roboto-SemiBold, Roboto;
        font-weight: 600;
        color: #999999;

      }
    }

    .col {
      &:nth-child(1) {
        width: 17%;
      }

      &:nth-child(2) {
        width: 12%;
      }

      &:nth-child(3) {
        width: 12%;
      }

      &:nth-child(4) {
        width: 12%;
      }

      &:nth-child(5) {
        width: 12%;
      }

      &:nth-child(6) {
        width: 15%;
      }

      &:nth-child(7) {
        width: 13%;
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
        line-height: 19px;

        &.nft-stake {
          cursor: pointer;

          .icon {
            margin-left: 10px;
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

        font-size: 16px;
        font-family: Roboto-Black, Roboto;
        font-weight: 900;
        color: #000000;
        line-height: 21px;
      }

      .stake, .borrow {
        .icon {
          margin-right: 10px;
          width: 20px;
          height: 20px;
        }
      }


      .floor-price, .loan-to-value {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;

        .icon-box {
          display: flex;
          align-items: center;

          &:nth-child(2) {
            margin-top: 15px;
          }

          .icon {
            margin-right: 10px;
            width: 20px;
            height: 20px;
          }
        }
      }

      .loan-to-value {

        .value {
          margin-bottom: 10px;
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
          font-size: 16px;
          font-family: Roboto-SemiBold, Roboto;
          font-weight: 600;
          color: #999999;
          padding-left: 40px;
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
      padding: 0 5vw;

      .list-item {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding-bottom: 20px;
        border-bottom: 1px solid #EAEAEA;

        &:last-child {
          border-bottom: none;

        }

        .item-header {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 3vh 0 0;

          .icon {
            width: 8vw;
            height: 8vw;
            margin-right: 10px;
          }

          .name {
            font-size: 4.2vw;
            font-family: Roboto-Black, Roboto;
            font-weight: 900;
          }

        }
      }

      .data-box {
        width: 30%;
        margin-top: 3vh;

        .name {
          font-size: 3.2vw;
          color: #C0C0C0;
          font-family: Roboto-SemiBold, Roboto;
          font-weight: 600;
        }

        .nft-stake {
          cursor: pointer;

          .icon {
            margin-left: 10px;
            width: 16px;
            height: 16px;
          }
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
