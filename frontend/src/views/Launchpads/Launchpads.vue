<template>
  <div class="launchpads">
    <h2 class="title">
      <strong>Launchpad</strong>
    </h2>
    <div class="list-header">
      <a-select
          ref="select"
          :value="selectType"
          style="width: 150px"
          @change="handleChange"
      >
        <template #option="{ label }">
          &nbsp;&nbsp;{{ label }}
        </template>
        <a-select-option value="0" label="All">All</a-select-option>
        <a-select-option value="1" label="Launchpads">Launchpads</a-select-option>
        <a-select-option value="2" label="Fair Launchpad">Fair Launchpad</a-select-option>
        <a-select-option value="3" label="Dutch Auction">Dutch Auction</a-select-option>
      </a-select>
      <a-input-search
          v-model="searchContent"
          placeholder="input search text"
          style="width: 200px"
          @search="onSearch"
      />
    </div>
    <div class="list">
      <div class="list-item"
           v-show="!showSearch || (item.projectInfoObj &&item.projectInfoObj.name&&item.projectInfoObj.name.indexOf(searchContent)>=0 )"
           @click="goDetail(item)" v-for="(item,index) in listArr" :key="index">
        <div class="list-item-header">
          <div class="icon">
            <img :src="item.projectInfoObj.logo" alt="" v-if="item.projectInfoObj">
          </div>
          <div class="right">
            <div class="name" v-if="item.projectInfoObj && item.projectInfoObj.name">
              {{ item.projectInfoObj.name }}
            </div>
            <div class="value" v-if="item.pricePresale">
              1 USDT = {{ BigNumber(item.pricePresale.replace(/\,/g, '')) }}
              {{ item.symbol }}
            </div>

            <div  class="value" v-if="item.startPrice">
              1 USDT =

              {{ BigNumber(item.startPrice.replace(/\,/g, '')) }} {{ item.symbol }} To
              {{ BigNumber(item.endPrice.replace(/\,/g, '')) }} {{ item.symbol }}
            </div>
          </div>
        </div>
        <div class="list-item-content">
          <div class="name">
            Soft <span v-if="item.type==1||item.type==3">/ Hard </span>top
          </div>
          <div class="value">
            {{ item.softCap }} <span v-if="item.type==1||item.type==3">~ {{ item.hardCap }}</span> USDT
          </div>
          <div class="percentage">
            <div class="progress-header">
              <div class="left">
                Percentage
              </div>
              <div class="right">{{ showNum(item.poolBalance / item.amount.replace(/,/g, '') * 100) }}%</div>
            </div>
            <div class="progress-box">
              <div class="progress" :style="'width:' + item.poolBalance / item.amount.replace(/,/g, '') * 100 + '%'">
              </div>
            </div>
            <div class="progress-bottom">
              <div class="left">
                {{ item.poolBalance }}
              </div>
              <div class="right" v-if="item.amount">
                {{ item.amount.replace(/\,/g, '') }}
              </div>
            </div>
          </div>
        </div>
        <a-button type="primary" v-if="item.timeObj&&item.timeObj!=1">
          <span>{{ item.timeObj.hours }}</span>:
          <span>{{ item.timeObj.minutes }}</span>:
          <span>{{ item.timeObj.secs }}</span>
        </a-button>
        <a-button type="primary" v-if="!item.timeObj">
          End
        </a-button>
        <a-button type="primary" v-if="item.timeObj == 1">
          Not Start
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import BigNumber from "bignumber.js";
import {showNum} from "@/utils/formatUtils";
import {getIpfs} from "@/utils/ipfsApi";

let timmer = null
export default {
  name: "LaunchpadsView",
  data() {
    return {
      showNum,
      selectType: "All",
      searchContent: "",
      listArr: [],
      allArr: [],
      arr1: [],
      arr2: [],
      arr3: [],
      BigNumber,
      showSearch: false
    }
  },

  methods: {

    goDetail(item) {
      this.$router.push({name: "LaunchpadsDetail", params: item})
    },
    async getPoolBalance(item, name) {
      let res = await this.$store.dispatch(name + "/getPresaleCharge", {
        id: item.id,
      })
      console.log(res)
      return BigNumber(item.amount.replace(/,/g, '')).minus(res).toLocaleString()
    },
    getEndTime(item) {
      const now = new Date().getTime()

      if (item.startTime) {
        const diff = BigNumber(item.startTime.replace(/,/g, '')).minus(now)
        if (diff >= 0) {
          return 1
        }
      }
      if (!item.endTime) {
        return false
      }
      const diff = BigNumber(item.endTime.replace(/,/g, '')).minus(now)
      if (!diff) {
        return false
      }
      if (diff < 0) {
        return false
      }
      let seconds = Math.ceil(diff / 1000);
      let hours = Math.floor(seconds / 3600);
      hours = hours < 10 ? "0" + hours : hours;
      seconds = seconds % 3600;
      let minutes = Math.floor(seconds / 60);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds % 60;
      let secs = seconds < 10 ? "0" + seconds : seconds;
      return {
        hours,
        minutes,
        secs
      };
    },
    handleChange(val) {
      switch (val) {
        case  '0':
          this.listArr = this.allArr;
          break
        case  '1':
          this.listArr = this.arr1;
          break
        case  '2':
          this.listArr = this.arr2;
          break
        case  '3':
          this.listArr = this.arr3;
          break
      }
      this.selectType = val
    },
    onSearch() {
      this.showSearch = true
    },
    async getData() {
      if (!this.$store.state.app.isConnected) {
        return
      }
      let resArr = []
      const res1 = await this.$store.dispatch("Launchpad/getAllPresale")
      const res2 = await this.$store.dispatch("FairLaunchpad/getAllPresale")
      const res3 = await this.$store.dispatch("DutchAuction/getAllPresale")

      if (res1 && res1.length > 0) {
        res1.reverse()
        res1.forEach(async item => {
          const projectInfo = await getIpfs(item.projectInfo)
          item.poolBalance = await this.getPoolBalance(item, "Launchpad")
          const coinInfo = await this.$store.dispatch("erc20/queryInfo", item.token)
          item.symbol = coinInfo.symbol
          item.type = 1
          if (projectInfo) {
            item.projectInfoObj = projectInfo.data
          }
        })
        resArr = resArr.concat(res1)
        this.arr1 = res1
      }
      if (res2 && res2.length > 0) {
        res2.reverse()
        res2.forEach(async item => {
          const projectInfo = await getIpfs(item.projectInfo)
          item.poolBalance = await this.getPoolBalance(item, "FairLaunchpad")
          const coinInfo = await this.$store.dispatch("erc20/queryInfo", item.token)
          item.symbol = coinInfo.symbol
          item.type = 2
          item.projectInfoObj = projectInfo
        })
        resArr = resArr.concat(res2)
        this.arr2 = res2
      }
      if (res3 && res3.length > 0) {
        res3.reverse()
        res3.forEach(async item => {
          const projectInfo = await getIpfs(item.projectInfo)
          item.poolBalance = await this.getPoolBalance(item, "DutchAuction")
          const coinInfo = await this.$store.dispatch("erc20/queryInfo", item.token)
          item.symbol = coinInfo.symbol
          item.type = 3
          item.projectInfoObj = projectInfo
        })
        resArr = resArr.concat(res3)
        this.arr3 = res3
      }
      this.allArr = resArr
      this.listArr = resArr
    }
  },
  computed: {
    account() {
      return this.$store.state.app.account
    },

  },
  watch: {
    isConnected() {
      this.getData()
    },
    account() {
      this.getData()
    }
  },
  mounted() {
    this.getData()
    timmer = setInterval(() => {
      let tempArr = [...this.listArr]
      tempArr.forEach(item => {
        item.timeObj = this.getEndTime(item)
      })
      this.listArr = tempArr
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(timmer)
  }
}
</script>
<style scoped lang="scss">
.launchpads {
  width: 1200px;
  margin: 20px auto;

  .list-header {
    display: flex;
    padding: 20px 0;
    justify-content: space-between;
    width: 100%;
  }

  .list {
    display: grid;
    grid-template-columns: repeat(4, minmax(260px, 1fr));
    gap: 10px;

    .list-item {
      padding: 20px;
      border-radius: 20px;
      background: #1D2833;

      .list-item-header {
        display: flex;
        overflow: hidden;

        .icon {
          width: 60px;
          height: 60px;
          background: #D8D8D8;
          border: 1px solid #979797;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .right {

          padding-left: 10px;
          display: flex;
          justify-content: center;
          flex-direction: column;

          .name {
            font-size: 20px;
            font-family: Roboto-Bold, Roboto;
            font-weight: bold;
          }

          .value {
            font-size: 14px;
            font-family: Roboto-Bold, Roboto;
            font-weight: bold;
            color: #00C289;
            white-space: nowrap;
          }
        }
      }

      .list-item-content {
        .name {
          font-size: 20px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          margin-top: 20px;
          opacity: 0.3;
        }

        .value {
          font-size: 20px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #FFFFFF;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;

          .left {
            font-size: 20px;
            font-family: Roboto-Bold, Roboto;
            font-weight: bold;
            opacity: 0.3;
          }

          .right {
            font-size: 20px;
            font-family: Roboto-Bold, Roboto;
            font-weight: bold;
            color: #FFFFFF;
          }
        }

        .progress-box {
          width: 100%;
          height: 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          margin: 10px 0;

          .progress {
            width: 141px;
            height: 10px;
            background: #00C289;
            border-radius: 5px;
          }
        }

        .progress-bottom {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
        }
      }

      .ant-btn {
        width: 100%;
        margin-top: 20px;
        background: #00C289;;
      }
    }
  }
}

</style>