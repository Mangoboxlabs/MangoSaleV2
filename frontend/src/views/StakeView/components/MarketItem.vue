<template>
  <div class="PositionItem" :class="{'menu-list-item':listActive==2}">
    <BundleNFTList :dataObj="dataObj" @closeDialog="isShowBundle=false" v-if="isShowBundle"/>
    <div class="dialog" v-if="showBuy">
      <div class="dialog-mask" @click="showBuy=false"></div>
      <BuyNFTDialogContent
          ref="borrowDialog"
          :countdown="countdown"
          :availableLoanArr="availableLoanArr"
          @closeDialog="showBuy=false"
          @updateData="$emit('updateData')"
          :dataObj="dataObj"
          :type="type"/>
    </div>

    <Popup round
           position="bottom" v-model:show="showMBuy" class="">
      <BuyNFTDialogContent
          ref="MBorrowDialog"
          :countdown="countdown"
          @closeDialog="showMBuy=false"
          :availableLoanArr="availableLoanArr"
          @updateData="$emit('updateData')"
          :dataObj="dataObj"
          :type="type"/>
    </Popup>
    <div class="list-list-item" v-show="listActive==1" :class="{'active':showBottom}">
      <div class="main-content">
        <div class="logo-box" @click="showNFTs">
          <div class="square">
            <img v-if="dataObj.nft.type=='Bundle'" class="logo" src="@/assets/images/bundle.png" alt="">
            <img v-else :src="dataObj.nft ? dataObj.nft.image : ''" alt="" class="logo"/>
          </div>
          <div class="name">
            <span>{{ dataObj.nft.type }}</span>
            <span>{{ dataObj.nft.count }} </span>
          </div>
        </div>
        <div class="position-info-box">
          <div class="position-info">
            <div class="in-line">
              <div class="name">
                Loan ID
              </div>
              <div class="value">
                <strong>#{{dataObj.bundle_id}}</strong>
              </div>
            </div>

            <div class="in-line">
              <div class="name">
                Floor Price
              </div>
              <div class="value">
                <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
                <strong>{{ dealNum(dataObj.staked_value) }}</strong>
              </div>
            </div>
            <div class="in-line">
              <div class="name boost-box">
                Loan to Value
                <div class="boost-btn" @click="$router.push('/governance/staking')" v-if="!tbcStaking.status">Boost
                  Credit
                </div>
              </div>
              <div class="value loan-box">
                <strong class="rate">{{ showNum(borrowRate) }}%</strong>
                <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
                <strong> {{ dealNum(dataObj.staked_value * borrowRate) }}</strong>
              </div>
            </div>
            <div class="in-line">
              <div class="name">
                Total Borrowed / Repaid
              </div>
              <div class="value">
                <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
                <strong>{{ dealNum(dataObj.borrow_sum) }}</strong> /
                <strong>{{ dealNum(dataObj.reply_sum) }}</strong>

              </div>
            </div>

          </div>

          <img class="down-icon" :class="{'active':showBottom}" src="../../../assets/svg/down_l.svg" alt="" @click="showBottom=!showBottom">

          <div v-show="showBottom" class="bottom-content">
            <div class="position-info info2">
              <div class="in-line">
                <div class="name">
                  Debt
                </div>
                <div class="value">
                  <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
                  <strong>{{ dealNum(debt) }}</strong>
                </div>
              </div>
              <div class="in-line">
                <div class="name">
                  Available to Borrow
                </div>
                <div class="value">
                  <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
                  <strong>{{ dealNum(dataObj.available_borrow) }}</strong>
                </div>
              </div>
              <div class="in-line healthy-box">
                <div class="name">
                  Healthy Factor
                  <Tooltip placement="top">
                    <template #title>
                      <span>NFTs will be liquidated When the liquidation factor is below 1</span>
                    </template>
                    <img src="../../../assets/images/tip_icon.webp" alt="" class="tip-icon">
                  </Tooltip>
                </div>
                <div class="value">
                  <div class="progress-box">
                    <div class="progress-content">
                      <div class="progress-part1"></div>
                      <div class="progress-part2"></div>
                      <div class="progress-part3"></div>
                    </div>
                    <div class="progress-cycle" :class="{'health': dataObj.health_index> 1.2 }"
                         :style="'left:' + (dataObj.health_index / 3) * 100 + '%'">
                      <strong>{{ dataObj.health_index }}</strong>
                    </div>
                    <div class="progress-line1"></div>
                    <div class="progress-line2"></div>
                  </div>
                </div>
              </div>

              <div class="in-line available-time">
                <div class="name">
                  Est. Available Loan Time
                </div>
                <div class="value">
                  <div class="time-box">
                    <div class="time-item">
                      {{ countdown.days }}d
                    </div>
                    <div class="time-item">
                      {{ countdown.hours }}h
                    </div>
                    <div class="time-item">
                      {{ countdown.minutes }}m
                    </div>
                    <div class="time-item">
                      {{ countdown.secs }}s
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
        <div class="btn-box">
          <div class="list-tip-box">
            <div class="list-tip">
              <div class="name">
                Listing Price
              </div>
              <div class="value">
                <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
                <strong>{{ dealNum(dataObj.list_price) }}</strong>
              </div>

            </div>

          </div>
          <button class="primary-btn-sha" @click="showDialog()">
            Buy
          </button>
        </div>

      </div>
      <div class="bottom-temp" v-if="showBottom"></div>
    </div>
    <div v-show="listActive==2">
      <div class="position-header">
        <div class="logo-box square">
          <img v-if="dataObj.nft.type=='Bundle'" class="logo" src="@/assets/images/bundle.png" alt="">
          <img v-else :src="dataObj.nft ? dataObj.nft.image : ''" alt="" class="logo"/>
        </div>
        <div class="right">
          <div class="name">
            <span>{{ dataObj.nft.type }}</span>
            <span>{{ dataObj.nft.count }} </span>
          </div>
        </div>
      </div>
      <div class="position-info">
        <div class="in-line">
          <div class="name">
            Loan ID
          </div>
          <div class="value">
            <strong>#{{dataObj.bundle_id}}</strong>
          </div>
        </div>


        <div class="in-line">
          <div class="name">
            Debt
          </div>
          <div class="value">
            <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
            <strong>{{ dealNum(debt) }}</strong>
          </div>
        </div>
        <div class="in-line">
          <div class="name">
            Floor Price
          </div>
          <div class="value">
            <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
            <strong>{{ dealNum(dataObj.staked_value) }}</strong>
          </div>
        </div>
        <div class="in-line">
          <div class="name boost-box">
            Loan to Value
            <div class="boost-btn" @click="$router.push('/governance/staking')" v-if="!tbcStaking.status">Boost
              Credit
            </div>
          </div>
          <div class="value loan-box">
            <strong class="rate">{{ showNum(borrowRate) }}%</strong>
            <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
            <strong> {{ dealNum(dataObj.staked_value * borrowRate) }}</strong>
          </div>
        </div>
        <div class="in-line">
          <div class="name">
            Total Borrowed / Repaid
          </div>
          <div class="value">
            <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
            <strong>{{ dealNum(dataObj.borrow_sum) }}</strong> /
            <strong>{{ dealNum(dataObj.reply_sum) }}</strong>
          </div>
        </div>


        <div class="in-line">
          <div class="name">
            Available to Borrow
          </div>
          <div class="value">
            <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
            <strong>{{ dealNum(dataObj.available_borrow) }}</strong>
          </div>
        </div>

        <div class="in-line available-time">
          <div class="name">
            Est. Available Loan Time
          </div>
          <div class="value">
            <div class="time-box">
              <div class="time-item">
                {{ countdown.days }}d
              </div>
              <div class="time-item">
                {{ countdown.hours }}h
              </div>
              <div class="time-item">
                {{ countdown.minutes }}m
              </div>
              <div class="time-item">
                {{ countdown.secs }}s
              </div>
            </div>
          </div>
        </div>
        <div class="in-line healthy-box">
          <div class="name">
            Healthy Factor
            <Tooltip placement="top">
              <template #title>
                <span>NFTs will be liquidated When the liquidation factor is below 1</span>
              </template>
              <img src="../../../assets/images/tip_icon.webp" alt="" class="tip-icon">
            </Tooltip>
          </div>
          <div class="value">
            <div class="progress-box">
              <div class="progress-content">
                <div class="progress-part1"></div>
                <div class="progress-part2"></div>
                <div class="progress-part3"></div>
              </div>
              <div class="progress-cycle" :class="{'health': dataObj.health_index> 1.2 }"
                   :style="'left:' + (dataObj.health_index / 3) * 100 + '%'">
                <strong>{{ dataObj.health_index }}</strong>
              </div>
              <div class="progress-line1"></div>
              <div class="progress-line2"></div>
            </div>
          </div>
        </div>

      </div>
      <div class="btn-box">
        <div class="list-tip-box">
          <div class="list-tip">
            <div class="name">
              Listing Price
            </div>
            <div class="value">
              <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
              <strong>{{ dealNum(dataObj.list_price) }}</strong>
            </div>

          </div>

        </div>
        <button class="primary-btn-sha" @click="openMBorrowDialog()">
          Buy
        </button>
      </div>
    </div>
    <div class="position-item-m">
      <div class="position-header">
        <div class="logo-box square">
          <img v-if="dataObj.nft.type=='Bundle'" class="logo" src="@/assets/images/bundle.png" alt="">
          <img v-else :src="dataObj.nft ? dataObj.nft.image : ''" alt="" class="logo"/>
        </div>
        <div class="right">
          <div class="name">
            <span>{{ dataObj.nft.type }}</span>
            <span>{{ dataObj.nft.count }} </span>
          </div>

        </div>
      </div>
      <div class="position-info">
        <div class="in-line">
          <div class="name">
            Loan ID
          </div>
          <div class="value">
            <strong>#{{dataObj.bundle_id}}</strong>
          </div>
        </div>
        <div class="in-line">
          <div class="name">
            Debt
          </div>
          <div class="value">
            <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
            <strong>{{ dealNum(debt) }}</strong>
          </div>
        </div>
        <div class="in-line">
          <div class="name">
            Floor Price
          </div>
          <div class="value">
            <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
            <strong>{{ dealNum(dataObj.staked_value) }}</strong>
          </div>
        </div>
        <div class="in-line">
          <div class="name boost-box">
            Loan to Value
            <div class="boost-btn" @click="$router.push('/governance/staking')" v-if="!tbcStaking.status">Boost
              Credit
            </div>
          </div>
          <div class="value loan-box">
            <strong class="rate">{{ showNum(borrowRate) }}%</strong>
            <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
            <strong> {{ dealNum(dataObj.staked_value * borrowRate) }}</strong>
          </div>
        </div>
        <div class="in-line">
          <div class="name">
            Total Borrowed / Repaid
          </div>
          <div class="value">
            <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
            <strong>{{ dealNum(dataObj.borrow_sum) }}</strong> /
            <strong>{{ dealNum(dataObj.reply_sum) }}</strong>
          </div>
        </div>

        <div class="in-line">
          <div class="name">
            Available to Borrow
          </div>
          <div class="value">
            <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
            <strong>{{ dealNum(dataObj.available_borrow) }}</strong>
          </div>
        </div>

        <div class="in-line available-time">
          <div class="name">
            Est. Available Loan Time
          </div>
          <div class="value">
            <div class="time-box">
              <div class="time-item">
                {{ countdown.days }}d
              </div>
              <div class="time-item">
                {{ countdown.hours }}h
              </div>
              <div class="time-item">
                {{ countdown.minutes }}m
              </div>
              <div class="time-item">
                {{ countdown.secs }}s
              </div>
            </div>
          </div>
        </div>
        <div class="in-line healthy-box">
          <div class="name">
            Healthy Factor
            <Tooltip placement="top">
              <template #title>
                <span>NFTs will be liquidated When the liquidation factor is below 1</span>
              </template>
              <img src="../../../assets/images/tip_icon.webp" alt="" class="tip-icon">
            </Tooltip>
          </div>
          <div class="value">
            <div class="progress-box">
              <div class="progress-content">
                <div class="progress-part1"></div>
                <div class="progress-part2"></div>
                <div class="progress-part3"></div>
              </div>
              <div class="progress-cycle" :class="{'health': dataObj.health_index> 1.2 }"
                   :style="'left:' + (dataObj.health_index / 3) * 100 + '%'">
                <strong>{{ dataObj.health_index }}</strong>
              </div>
              <div class="progress-line1"></div>
              <div class="progress-line2"></div>
            </div>
          </div>
        </div>

      </div>
      <div class="btn-box">
        <div class="list-tip-box">
          <div class="list-tip">
            <div class="name">
              Listing Price
            </div>
            <div class="value">
              <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
              <strong>{{ dealNum(dataObj.list_price) }}</strong>
            </div>

          </div>

        </div>
        <button class="primary-btn-sha" @click="openMBorrowDialog()">
          Buy
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {Tooltip} from "ant-design-vue"
import BuyNFTDialogContent from "./BuyNFTDialogContent.vue";

import bigNumberUtil from "@/utils/bigNumberUtil";
import {Popup} from "vant"
import BundleNFTList from "@/views/AuctionView/components/BundleNFTList.vue";

const calculator = new bigNumberUtil();
let countdownObj = null
export default {
  name: "PositionItem",
  props: ["dataObj", "updateData", "availableLoanArr","listActive"],
  components: {BundleNFTList, Tooltip, BuyNFTDialogContent, Popup},
  data() {
    return {
      isShowBundle: false,
      showBuy: false,
      showMBuy: false,
      dealNum: calculator.dealNum,
      goneTime: 0,
      showBottom:false,
      type: 1
    }
  },
  computed: {
    tbcStaking() {
      return this.$store.state.app.tbcStaking;
    },
    borrowRate(){
      if(!this.tbcStaking.status || this.tbcStaking.incr == 0){
        return this.dataObj.max_borrow_rate * 100
      }else{
        return calculator.add(this.dataObj.max_borrow_rate, this.tbcStaking.incr) * 100
      }
    },
    countdown() {
      const diff = this.dataObj.available_time - this.goneTime

      if (diff < 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          secs: 0
        }
      }
      let seconds = Math.ceil(diff);
      let days = Math.floor(seconds / 86400);
      seconds = seconds % 86400

      let hours = Math.floor(seconds / 3600);
      hours = hours < 10 ? "0" + hours : hours;
      seconds = seconds % 3600

      let minutes = Math.floor(seconds / 60);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds % 60

      let secs = seconds < 10 ? "0" + seconds : seconds;

      return {
        days,
        hours,
        minutes,
        secs
      };
    },
    debt() {
      return this.dataObj.borrow_sum
    }
  },
  methods: {
    showNum(num) {
      let res = Number(Number(num) * 100).toFixed(0) / 100;
      return res.toLocaleString();
    },
    showNFTs() {
      this.isShowBundle = true

    },
    openMBorrowDialog() {
      this.showMBuy = true
    },
    showDialog() {
      this.showBuy = true

    }
  },
  beforeCreate() {
    countdownObj = setInterval(() => {
      this.goneTime++
    }, 1000)
  },
  beforeUnmount() {
    clearInterval(countdownObj)
  },
}
</script>

<style lang="scss" scoped>
.position-item {
  display: flex;
  background: #FFFFFF;
  box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.05);
  border-radius: 20px 20px 20px 20px;
  border: 1px solid #E2E2E2;
  padding: 20px;
  justify-content: space-between;
  margin-bottom: 10px;
  width: var(--content-width);

  .healthy-box {
    .value {
      margin-top: -15px;
    }
  }
  .logo-box {
    cursor: pointer;
    .square{
      overflow: hidden;
      border-radius: 12px;
    }
    .logo {
      width: 120px;
      border-radius: 12px;
      height: 120px;
      transition: 0.3s;
      &:hover{
        transform: scale(1.3);
      }
    }

    .name {
      margin-top: 5px;
      font-size: 16px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #333333;
      line-height: 30px;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }

  .loan-box {
    font-weight: 900;

  }

  .position-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 0;
    &.info2 {
      .in-line{
        .name {
          width: 170px;
        }
      }

    }

    .tip-icon {

      margin-left: 5px;
    }

    .in-line {
      display: flex;
      width: 280px;
      justify-content: flex-start;
      align-items: center;


      .name {
        width:200px;
        font-size: 12px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #999999;
        white-space: nowrap;
      }

      .boost-box {
        display: flex;

        .boost-btn {
          color: #ffbd01;
          position: relative;
          cursor: pointer;
          margin-left: 7px;

          &:after {
            content: "";
            bottom: 2px;
            left: 0;
            height: 1px;
            width: 100%;
            background: #ffbd01;
            position: absolute;
          }
        }
      }

      .value {
        width: 80px;
      }

      .loan-box {
        font-weight: 900;
        position: relative;

        .rate {
          position: absolute;
          left: -40px;
          color: #999999;
        }
      }

      .value {
        font-size: 12px;
        white-space: nowrap;

        .icon {
          width: 15px;
          height: 15px;
          margin-right: 10px;
        }
      }
    }


    .available-time {
      font-weight: bold;
      white-space: nowrap;

      strong {
        color: #FFBD01;
        margin-right: 3px;
      }
    }
  }

  .btn-box {

    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;

    .list-tip-box {
      text-align: center;
      width: 100%;
      padding-bottom: 10px;
      .list-tip {
        .name {
          font-size: 12px;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #999999;
        }

        .value {
          font-size: 12px;
          margin: 6px 0;

          span {
            margin-left: 10px;
          }

          .icon {
            width: 15px;
            height: 15px;
            margin-right: 8px;
          }
        }

      }
    }

    .primary-btn-sha {
      font-family: RussoOneRegular, Russo One;
      width: 8vw;
      height: 40px;
      font-size: 12px;
    }
  }
}

.position-item-m {
  display: none;
}


@media screen and (max-width: 1000px) {
  .position-item {
    display: none;
  }


  .position-item-m {
    margin-top: 10px;
    background: #ffffff;
    box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.05);
    border-radius: 20px 20px 20px 20px;
    border: 1px solid #e2e2e2;
    padding: 20px;
    display: block;


    .btn-box {
      width: 100%;
      display: flex;
      justify-content: center;

      .primary-btn-sha {
        margin-left: 5vw;
        padding: 0 7vw;
        height: 5vh;
        max-height: 100px;
        font-size: 12px;
        font-family: RussoOneRegular, Russo One;

        &:first-child {
          margin-left: 0;
        }
      }
    }

    .position-header {
      padding-bottom: 3vh;
      display: flex;
      border-bottom: 1px solid #e2e2e2;

      .logo-box {
        .logo {
          width: 30vw;
          height: 30vw;
          border-radius: 5px;
        }
      }

      .right {
        padding-left: 3vw;
        flex: 1;
      }

      .name {
        margin-top: 20px;
        font-size: 20px;
        font-family: Roboto-Black, Roboto;
        font-weight: 900;
        color: #333333;
      }
    }

    .position-info {
      margin: 3vh 0 0 0;

      .loan-box {
        .rate {
          margin-right: 10px;
        }
      }

      &.info2 {
        .in-line {
          idth: 300px;
        }

        .value {
          margin-left: 2vw;
        }
      }

      .tip-icon {

        margin-left: 5px;
      }

      .in-line {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        width: 100%;

        .name {
          font-size: 12px;
          width: 50%;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #999999;
        }
        .loan-box {
          position: relative;

          .rate {
            position: absolute;
            left: -30px;
            opacity: 0.5;
          }
        }
        .value {
          font-size: 12px;
          min-width: 120px;
          span {
            margin-left: 10px;
          }

          .icon {
            width: 20px;
            height: 20px;
            margin-right: 8px;
          }
        }
      }

      .healthy-box {
        padding-bottom: 30px;
      }

      .available-time {
        font-weight: bold;

        strong {
          color: #ffbd01;
          margin-right: 3px;
        }
      }
    }
  }
}

@media screen and (min-width: 1920px) {
  .position-item {
    .btn-box {
      .primary-btn-sha {
        font-size: 14px;
        height: 42px;
      }

      .list-tip-box {
        .list-tip {
          .name {
            font-size: 14px;
          }

          .value {
            font-size: 14px;

            .icon {
              width: 20px;
              height: 20px;
              margin-right: 10px;
            }
          }

        }
      }
    }

    .position-info {
      .in-line {
        width: 300px;

        .name {
          width: 220px;
          font-size: 14px;
        }

        .value {
          font-size: 14px;

          .icon {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }
        }
      }
    }
  }

}
</style>
