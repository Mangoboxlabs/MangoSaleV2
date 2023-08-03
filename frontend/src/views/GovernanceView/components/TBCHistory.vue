<template>
  <div class="TBCHistory">
    <div class="position-detail history"  :class="{'active':activeStake==3}">
      <div class="position-detail-header">
        <div class="left">
          <div class="title">
            History( {{positionsList.history.length}} )
          </div>
          <img src="@/assets/svg/down.svg" alt="" class="icon">
        </div>
      </div>
      <div v-show="activeStake==3">
        <template v-for="(item,index) in positionsList.history" :key="index">
          <div class="position-detail-part" v-if="index<positionsList.history.length">
            <div class="position-detail-info">
              <div class="info-item">
                <div class="name">
                  Stake Period
                </div>
                <div class="value">
                  {{ item.day }}-Day
                </div>
              </div>
              <div class="info-item">
                <div class="name">
                  Duration
                </div>
                <div class="value">
                  23 Day
                </div>
              </div>
              <div class="info-item">
                <div class="name">
                  Maturity Date
                </div>
                <div class="value">
                  Mar 290, 2019
                </div>
              </div>
              <div class="info-item">
                <div class="name">
                  Staked Principal
                </div>
                <div class="value">
                  2,000,000 TBC
                </div>
              </div>
              <div class="info-item">
                <div class="name">
                  Rewards
                </div>
                <div class="value">
                  5,350 TBC
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div v-if="positionsExtra.count" class="more-btn" @click="onLoadMore() "
           v-show="positionsList.history.length > positionsExtra.count.history">
        More
      </div>
    </div>
  </div>
</template>

<script>
import {getPositionsMore} from "@/api/govStakingApi";

export default {
  name: "TBCHistory",
  props:["activeStake"],
  data(){
    return {
    }
  },
  computed:{
    positionsList() {
      return this.$store.state.TBCStake.positionsList
    },
    positionsExtra() {
      return this.$store.state.TBCStake.positionsExtra
    },
  },
  methods:{
    onLoadMore() {
      this.loadingMore = true
      getPositionsMore({
        address: this.account,
        chain: this.chainType,
        limit: '10',
        skip: this.positionsList.history.length,
        type: "history",
      }).then(({data, code}) => {
        let tempObj = this.positionsList
        if (code == 0) {
          tempObj.history = tempObj.history.concat(data);
        }
        this.$store.commit("TBCStake/SET_Positions", tempObj)
      }).finally(() => {
        this.loadingMore = false;
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.position-detail {
  width: 544px;
  cursor: pointer;
  background: #FFFFFF;
  box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.1);
  border-radius: 20px 20px 20px 20px;
  padding: 30px;
  border: 1px solid #E2E2E2;
  margin-top: 20px;
  transition: 0.3s;

  &.active {
    cursor: default;

    .position-detail-header {
      .left {
        .icon {
          transform: rotate(180deg);
        }
      }
    }
  }

  .position-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;


    .left {
      display: flex;
      align-items: center;

      .title {
        font-size: 20px;
        font-family: Roboto-Black, Roboto;
        font-weight: 900;
        color: #000000;
      }

      .icon {
        margin-left: 10px;
        width: 20px;
      }
    }

    .right {
      cursor: pointer;
      display: flex;
      font-size: 18px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #333333;
    }
  }

  .position-detail-part {
    border-radius: 15px 15px 15px 15px;
    border: 1px solid #D2D2D2;
    padding: 30px 20px;
    margin-top: 20px;
    transition: 0.3s;

    .position-detail-info {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .info-item {
        width: 30%;
        margin-bottom: 20px;
        white-space: nowrap;

        .name {

          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #999999;
        }

        .value {
          overflow-x: hidden;
          margin-top: 6px;

          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #000000;
        }
      }
    }

    .operate-box {
      display: flex;
      justify-content: space-between;

      .primary-btn-sha {
        width: 48%;
        height: 50px;
        font-family: RussoOneRegular, Russo One;
      }
    }

    .automatic-bottom {
      display: flex;
      justify-content: space-between;

      font-family: Roboto-Bold, Roboto;
      color: #000000;
      border-top: 1px solid #D2D2D2;
      padding-top: 20px;

      .left {
        display: flex;
        align-items: center;
        font-weight: bold;

        .icon {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }
      }

      .right {
        display: flex;
        align-items: center;
        font-weight: 500;

        .switch {
          margin-left: 10px;
        }
      }
    }
  }

  .more-btn {
    margin: 20px auto;
    width: 100px;
    height: 30px;
    border-radius: 50px 50px 50px 50px;
    border: 1px solid #D2D2D2;

    text-align: center;
    font-family: Roboto-Medium, Roboto;
    cursor: pointer;
    line-height: 30px;
    font-weight: 500;
    color: #999999;
  }
}

@media screen and (max-width: 1000px) {
  .position-detail {
    width: 100%;

    .position-detail-part {
      padding: 3vh 3vw;

      .position-detail-info {
        .info-item {
          .name {
            font-size: 3.2vw;
          }

          .value {
            overflow-x: hidden;
            font-size: 3.6vw;
          }
        }
      }

      .automatic-bottom {
        .left {
          font-size: 3.4vw;

          .icon {
            width: 20px;
            height: 20px;
          }
        }

        .right {
          font-size: 3.2vw;
        }
      }

    }
  }
}
</style>
