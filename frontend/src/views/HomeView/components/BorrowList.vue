<template>
  <div class="DepositList">
    <div class="data-list">
      <div class="data-list-header-box">
        <div class="data-list-header">
          <div class="col">
            Chain
          </div>
          <div class="col">
            USDT APR
          </div>
          <div class="col">
            ETH APR
          </div>
          <div class="col deposit-op">
            <div class="deposit">
              Borrow
            </div>
          </div>
        </div>
      </div>
      <div class="list-item">
        <div class="col name">
          <img class="icon" src="../../../assets/svg/ethereum.svg" alt="">
          Ethereum
        </div>
        <div class=" ">
          <div class="col usdt-apr">
            {{ chainData[0] && chainData[0][0] ?
              dealNum(BigNumber((chainData[0][1].borrow_apy * 100)).minus(chainData[0][1].loan_reward_rate * 100)): 0 }}%
          </div>
          <div class="detail-apy">
            <div class="name">
              Interest APR
            </div>
            <div class="info">
              Paid in USDT
            </div>
            <div class="val">
              {{ chainData[0] && chainData[0][0] ? dealNum(chainData[0][1].borrow_apy * 100) : 0 }}%
            </div>
          </div>
          <div class="detail-apy">
            <div class="name">
              Reward APR
            </div>
            <div class="info">
              Earned in TBC
            </div>
            <div class="val">
              {{ chainData[0] && chainData[0][0] ? dealNum(chainData[0][1].loan_reward_rate * 100) : 0  }}%
            </div>
          </div>
        </div>

        <div class="">
          <div class="col eth-apr">
            {{ chainData[0] && chainData[0][0] ?
              dealNum(BigNumber((chainData[0][0].borrow_apy * 100)).minus(chainData[0][0].loan_reward_rate * 100)): 0 }}%
          </div>
          <div class="detail-apy">
            <div class="name">
              Interest APR
            </div>
            <div class="info">
              Paid in ETH
            </div>
            <div class="val">
              {{ chainData[0] && chainData[0][0] ? dealNum(chainData[0][0].borrow_apy * 100) : 0 }}%
            </div>
          </div>
          <div class="detail-apy">
            <div class="name">
              Reward APR
            </div>
            <div class="info">
              Earned in TBC
            </div>
            <div class="val">
              {{ chainData[0] && chainData[0][0] ? dealNum(chainData[0][0].loan_reward_rate * 100) : 0  }}%
            </div>
          </div>
        </div>
        <div class="col deposit-op">
          <div class="primary-btn-sha" @click="goStake(ChainIdMapByName['Sepolia'])">
            Borrow
          </div>
        </div>
      </div>
      <div class="list-item">
        <div class="col name">
          <img class="icon" src="../../../assets/svg/polygon.svg" alt="">

          Polygon
        </div>

        <div class=" ">
          <div class="usdt-apr col">
            {{ chainData[1] && chainData[1][1] ?
              dealNum(BigNumber((chainData[1][1].borrow_apy * 100)).minus(chainData[1][1].loan_reward_rate * 100)): 0 }}%
          </div>
          <div class="detail-apy">
            <div class="name">
              Interest APR
            </div>
            <div class="info">
              Paid in USDT
            </div>
            <div class="val">
              {{ chainData[0] && chainData[1][1] ? dealNum(chainData[1][1].borrow_apy * 100) : 0 }}%
            </div>
          </div>
          <div class="detail-apy">
            <div class="name">
              Reward APR
            </div>
            <div class="info">
              Earned in TBC
            </div>
            <div class="val">
              {{ chainData[1] && chainData[1][1] ? dealNum(chainData[1][1].loan_reward_rate * 100) : 0  }}%
            </div>
          </div>
        </div>
        <div class="">
          <div class="col eth-apr">
            {{ chainData[1] && chainData[1][1] ?
              dealNum(BigNumber((chainData[1][0].borrow_apy * 100)).minus(chainData[1][0].loan_reward_rate * 100)): 0 }}%
          </div>
          <div class="detail-apy">
            <div class="name">
              Interest APR
            </div>
            <div class="info">
              Paid in ETH
            </div>
            <div class="val">
              {{ chainData[1] && chainData[1][0] ? dealNum(chainData[1][0].borrow_apy * 100) : 0 }}%
            </div>
          </div>
          <div class="detail-apy">
            <div class="name">
              Reward APR
            </div>
            <div class="info">
              Earned in TBC
            </div>
            <div class="val">
              {{ chainData[1] && chainData[1][0] ? dealNum(chainData[1][0].loan_reward_rate * 100) : 0 }}%
            </div>
          </div>
        </div>
        <div class="col deposit-op">
          <div class="primary-btn-sha" @click="goStake(ChainIdMapByName['Mumbai'])">
            Borrow
          </div>
        </div>
      </div>
    </div>
    <div class="data-list-m">
      <div class="data-item-m">
        <div class="list-header">
          <img src="../../../assets/svg/ethereum.svg" alt="" class="icon">
          Ethereum chain
        </div>
        <div class="data-box">
          <div class="name">
            USDT APR
          </div>
          <div class="value-box g-c">
            {{ chainData[0] ? dealNum(chainData[0][1].borrow_apy * 100) : 0 }}%
          </div>
        </div>
        <div class="data-box">
          <div class="name">
            ETH APR
          </div>
          <div class="value-box b-c">
            {{ chainData[0]  ? dealNum(chainData[0][0].borrow_apy * 100) : 0 }}%
          </div>
        </div>
        <div class="data-box">
          <div class="primary-btn" @click="goStake(ChainIdMapByName['Sepolia'])">
            Borrow
          </div>
        </div>

      </div>
      <div class="data-item-m">
        <div class="list-header">
          <img src="../../../assets/svg/polygon.svg" alt="" class="icon">
          Polygon chain
        </div>
        <div class="data-box">
          <div class="name">
            USDT APR
          </div>
          <div class="value-box g-c">
            {{ chainData[1] ? dealNum(chainData[1] [1].borrow_apy * 100) : 0 }}%
          </div>
        </div>
        <div class="data-box">
          <div class="name">
            ETH APR
          </div>
          <div class="value-box b-c">
            {{ chainData[1]? dealNum(chainData[1][0].borrow_apy * 100) : 0 }}%
          </div>
        </div>
        <div class="data-box ">
          <div class="primary-btn" @click="goStake(ChainIdMapByName['Sepolia'])">
            Borrow
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import bigNumberUtil from "@/utils/bigNumberUtil";

const calculator = new bigNumberUtil();
import {ChainIdMapByName} from "@/utils/constantData";
import {mapGetters} from "vuex";
import BigNumber from "bignumber.js";
export default {
  name: "BorrowList",
  data() {
    return {
      BigNumber,
      dealNum: calculator.dealNum,
      ChainIdMapByName,
      chainData:[[{},{}],[{},{}]]
    }
  },

  computed: {
    ...mapGetters(["account","isConnected","chainId"]),
    homeData() {
      return this.$store.state.app.homeData
    }
  },
  created(){
    this.initData()
  },
  watch:{
    isConnected(){
      this.initData()
    },
    homeData(){
      this.initData()
    }
  },
  methods: {
    initData(){
      this.homeData.networks.forEach((networks,index)=>{
        let rateBox = []
        networks.pool_list.forEach(pool=>{
          rateBox.push({
            borrow_apy:pool.borrow_apy,
            loan_reward_rate:pool.loan_reward_rate
          })
        })
        this.chainData[index] = rateBox
      })

    },
    goStake(chainId) {
      this.$store.commit("app/SET_DesireChainId", chainId)
      this.$router.push("/stake")
      document.documentElement.scrollTop = document.body.scrollTop = 0;
    }
  }
}
</script>

<style lang="scss" scoped>
.DepositList {
  .data-list {
    .data-list-header-box {
      padding: 40px 50px 30px;
      border-bottom: 1px solid #E2E2E2;
      .sub-title{
        font-size: 24px;
        font-family: Roboto-SemiBold, Roboto;
        font-weight: 600;
        color: #000000;
      }
      .data-list-header {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        font-family: Roboto-SemiBold, Roboto;
        font-weight: 600;
        color: #999999;
        line-height: 19px;
        >div:nth-child(1), >div:nth-child(4){
          width: 20%;
        }
        >div:nth-child(2), >div:nth-child(3){
          width: 30%;
        }
        .deposit-op {
          display: flex;
          justify-content: flex-end;
          .deposit{
            width: 140px;
            text-align: center;
          }
        }
      }
    }


    .list-item {
      display: flex;
      justify-content: space-between;
      margin: 0 50px;
      padding: 35px 0;
      border-bottom: 1px solid #E2E2E2;

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .usdt-apr {
        color: #27A17C;
      }

      .eth-apr {
        color: #6284F5;
      }

      .name {
        .icon {
          width: 40px;
          opacity: 1;
          height: 40px;
          margin-right: 10px;
        }

        font-size: 14px;
        font-family: Roboto-Black, Roboto;
        font-weight: 900;
        color: #000000;
        line-height: 21px;
      }
      >div:nth-child(1), >div:nth-child(4){
        width: 20%;
      }
      >div:nth-child(2), >div:nth-child(3){
        width: 30%;
      }
      .deposit-op {
        justify-content: flex-end;
      }
      .col {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-family: Roboto-SemiBold, Roboto;
        font-weight: 600;
        line-height: 19px;

      }

      .deposit-op {
        text-align: center;
      }

      .primary-btn-sha {
        width: 140px;
        height: 50px;
        line-height: 50px;
        font-size: 14px;


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

      .data-item-m {
        display: flex;
        flex-wrap: wrap;
        padding: 0 5vw;
        border-bottom: 1px solid #EAEAEA;
        padding-bottom: 2vh;

        &:last-child {
          border-bottom: none;
          padding-bottom: 0vh;

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
          margin-top: 3vh;
          white-space: nowrap;

          &:nth-child(3n - 4) {
            margin-left: 0;
          }

          .name {
            font-size: 3.2vw;
            font-family: Roboto-SemiBold, Roboto;
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
              width: 20px;
              height: 20px;
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
}
</style>
