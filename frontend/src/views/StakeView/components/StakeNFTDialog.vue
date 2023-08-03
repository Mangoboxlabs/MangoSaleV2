<template>
  <div class="StakeNFTDialog">
    <div class="dialog-content-m">
      <div class="dialog-header">
        <div class="title">
          Stake NFT
        </div>
        <img src="../../../assets/svg/close.svg" alt="" class="close" @click="$emit('closeDialog')">
      </div>
      <div class="dialog-content-container">
        <div class="nav-list">
          <div class="nav-item" :class="{ active: activeIndex == 'Land' }" @click="setNav('Land')">Land</div>
          <div class="nav-item" :class="{ active: activeIndex == 'Estate' }" @click="setNav('Estate')">Estate</div>
        </div>
        <div class="nav-btn-box">
          <div class="nav-item" v-show="activeIndex=='Land'"
               :class="{'active':item.isChoosedType&&!initChooseAllLand }"
               @click="chooseIdentify(item)" v-for="(item,index) in tokensData.land" :key="index">
            <img src="../../../assets/svg/choosed.svg" alt="" class="icon">
            {{ item.name }}
          </div>
          <div class="nav-item" v-show="activeIndex=='Estate'"
               :class="{'active':item.isChoosedType&&!initChooseAllEstate }"
               @click="chooseEstateIdentify(item)" v-for="(item,index) in tokensData.estates" :key="index">
            <img src="../../../assets/svg/choosed.svg" alt="" class="icon">
            {{ item.identify }}
          </div>
        </div>
        <div class="nft-list" v-show="activeIndex=='Land'">
          <template v-for="(item,index) in  tokensData.land" :key="index">
            <div class="nft-item"
                 @click="chooseNFT(nft,item)"
                 v-show="item.isChoosedType"
                 :class="{'active':nft.choosed==true}"
                 v-for="(nft,idx) in  item.nfts"
                 :key="idx">
              <div class="square">
                <img :src="nft.image" alt="" class="icon">
              </div>
              <div class="name">
                <strong v-if="nft.name">{{ nft.name }}</strong>
                <strong v-else>{{ item.name }}#{{ nft.token_id }}</strong>
              </div>
              <div class="choose-box">
                <img src="../../../assets/svg/choosed_active.svg" alt="" class="icon">
              </div>
              <div class="type">
                {{ item.name }}
              </div>
            </div>
          </template>
        </div>
        <div class="nft-list" v-show="activeIndex=='Estate'">
          <template v-for="(item,index) in  tokensData.estates" :key="index">
            <div class="nft-item"
                 @click="chooseEstate(nft,item)"
                 v-show="item.isChoosedType"
                 :class="{'active':nft.choosed==true}"
                 v-for="(nft,idx) in  item.nfts"
                 :key="idx">
              <div class="square">
                <img :src="nft.image" alt="" class="icon">
              </div>
              <div class="name">
                <strong v-if="nft.name">{{ nft.name }}</strong>
                <strong v-else>{{ item.name }}#{{ nft.token_id }}</strong>
              </div>
              <div class="type">
                {{ item.name }}
              </div>
              <div class="choose-box">
                <img src="../../../assets/svg/choosed_active.svg" alt="" class="icon">
              </div>
            </div>
          </template>
        </div>
        <div class="nft-detail-box">
          <div class="part1" v-if="curNFT&&activeIndex=='Estate'">
            <div class="img-box">
              <img :src="curNFT.image" alt="" class="icon">
            </div>
            <div class="part1-content">
              <div class="flex-box">
                <img v-if="curTypeObj.icon" :src="require('@/assets'+curTypeObj.icon)" alt="" class="icon">

                <strong>{{ curTypeObj.name }}</strong>
              </div>
              <div class="info-list">
                <div class="item">
                  <div class="name">
                    Size
                  </div>
                  <div class="value">
                    {{ curNFT.size }}* {{ curNFT.size }}
                  </div>
                </div>
                <div class="item">

                </div>
                <div class="item">
                  <div class="name">
                    Parcels
                  </div>
                  <div class="value">
                    {{ curNFT.count }}
                  </div>
                </div>
                <div class="item">
                  <div class="name">
                    Location
                  </div>
                  <div class="value">
                    {{ curNFT.name }}
                  </div>
                </div>
              </div>

            </div>
            <a v-if="curNFT" class="primary-btn-sha" :href="curNFT.link" target="_blank">
              View map
            </a>
          </div>
          <div class="part2">
            <div class="left-part">
              <div class="flex-box">
                <div class="name">
                  Floor Price
                </div>
                <div class="value-box">
                  <img v-show="selectCoin=='ETH'" src="../../../assets/svg/ethereum.svg" alt="" class="icon">
                  <img v-show="selectCoin=='USDT'" src="../../../assets/svg/usdt.svg" alt="" class="icon">
                  {{ dealNum(collateralsValuePrice) }}
                </div>
              </div>
              <div class="flex-box">
                <div class="name boost-box">
                  Loan to Value
                  <div class="boost-btn" @click="$router.push('/governance/staking')"
                       v-if="!tbcStaking.status && tbcStaking.incr>0">
                    Boost Credit
                  </div>

                </div>
                <div class="value-box">
                  <div v-if="activeIndex=='Estate'" class="rate">{{ dealNum(curTypeObj.pledge_rate * 100) }}%</div>
                  <div v-if="activeIndex=='Land'" class="rate">{{ dealNum(pledgeRateLand * 100) }}%</div>
                  <span class="incr" v-if="tbcStaking.status&& tbcStaking.incr>0"
                        style="margin-right: 10px"> + {{ dealNum(tbcStaking.incr * 100) }}%</span>
                  <img v-show="selectCoin=='ETH'" src="../../../assets/svg/ethereum.svg" alt="" class="icon">
                  <img v-show="selectCoin=='USDT'" src="../../../assets/svg/usdt.svg" alt="" class="icon">
                  <div>{{ dealNum(canLoanValuePrice) }}</div>
                </div>
              </div>
              <div class="flex-box">
                <div class="name">
                  Borrow APR
                </div>
                <div class="value-box">
                  {{ dealNum(curBorrowApy * 100) }}%
                </div>
              </div>
            </div>
            <div class="right-part">
              <div class="flex-box">
                <div class="name">
                  Available Loan Limit
                </div>
                <div class="value-box">
                  <img v-show="selectCoin=='ETH'" src="../../../assets/svg/ethereum.svg" alt="" class="icon">
                  <img v-show="selectCoin=='USDT'" src="../../../assets/svg/usdt.svg" alt="" class="icon">
                  {{ dealNum(availableLoanLimit) }}
                </div>
              </div>


              <div class="flex-box">
                <div class="name">
                  Est. Loan Time Available
                </div>
                <div class="value-box available-time">
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
        <div class="bottom-content" v-show="activeIndex==='Land'">
          <div class="title">
            Borrow Amount
          </div>
          <div class="input-box">
            <input type="number" step="any" min="0" v-model="amount" @input="checkInput">
            <div class="right-tip">
              <div class="max-btn primary-btn" @click="setMax">
                Max
              </div>
              <div class="line"></div>
              <img src="@/assets/svg/ethereum.svg" v-show="selectCoin == 'ETH'" class="select-icon icon" alt="">
              <img src="@/assets/svg/usdt.svg" v-show="selectCoin == 'USDT'" class="select-icon icon" alt="">
              <Select
                  ref="select"
                  v-model:value="selectCoin"
                  style="width: 120px"
                  class="select-box"
              >
                <template #option="{ label,icon }">
                  <img :src="require('../../../assets/svg/'+`${icon}.svg`)" style="width: 20px;" class="icon" alt="">
                  &nbsp;&nbsp;{{ label }}
                </template>
                <SelectOption value="ETH" label="ETH" icon="ethereum">
                  ETH
                </SelectOption>
                <SelectOption value="USDT" label="USDT" icon="usdt">
                  USDT
                </SelectOption>
              </Select>

            </div>
          </div>
          <div class="operate-box">
            <a-button :loading="isLoading" class="primary-btn-sha" @click="stake">
              <span v-if="!isApproved" style="margin-right: 6px">Approve & </span>
              Staking {{ chooseCount }} NFT
            </a-button>
          </div>
        </div>
        <div class="bottom-content" v-show="activeIndex==='Estate'">
          <div class="title">
            Borrow Amount
          </div>
          <div class="input-box">
            <input type="number" step="any" min="0" v-model="amountEstate" @input="checkInput">
            <div class="right-tip">
              <div class="max-btn primary-btn" @click="setMax">
                Max
              </div>
              <div class="line"></div>
              <img src="@/assets/svg/ethereum.svg" v-show="selectCoin == 'ETH'" class="select-icon icon" alt="">
              <img src="@/assets/svg/usdt.svg" v-show="selectCoin == 'USDT'" class="select-icon icon" alt="">
              <Select
                  ref="select"
                  v-model:value="selectCoin"
                  style="width: 120px"
                  class="select-box"
              >
                <template #option="{ label,icon }">
                  <img :src="require('../../../assets/svg/'+`${icon}.svg`)" style="width: 20px;" class="icon" alt="">
                  &nbsp;&nbsp;{{ label }}
                </template>
                <SelectOption value="ETH" label="ETH" icon="ethereum">
                  ETH
                </SelectOption>
                <SelectOption value="USDT" label="USDT" icon="usdt">
                  USDT
                </SelectOption>
              </Select>

            </div>
          </div>
          <div class="operate-box">
            <a-button :loading="isLoading" class="primary-btn-sha" @click="estateStake">
                <span v-if="!isApproved" style="margin-right:6px;">
                  Approve &
                </span>
              Staking {{ curNFT ? curNFT.count : 0 }} NFT
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog pc  animate__animated animate__fadeIn">
      <div class="dialog-mask " @click="$emit('closeDialog')"></div>
      <div class="dialog-content">
        <div class="dialog-header">
          <div class="title">
            Stake NFT
          </div>
          <img src="../../../assets/svg/close.svg" alt="" class="close" @click="$emit('closeDialog')">
        </div>
        <div class="dialog-content-container">
          <div class="nav-list">
            <div class="nav-item" :class="{ active: activeIndex == 'Land' }" @click="setNav('Land')">Land</div>
            <div class="nav-item" :class="{ active: activeIndex == 'Estate' }" @click="setNav('Estate')">Estate</div>
          </div>
          <div class="nav-btn-box">
            <div class="nav-item" v-show="activeIndex=='Land'"
                 :class="{'active':item.isChoosedType&&!initChooseAllLand }"
                 @click="chooseIdentify(item)" v-for="(item,index) in tokensData.land" :key="index">
              <img src="../../../assets/svg/choosed.svg" alt="" class="icon">
              {{ item.name }}
            </div>
            <div class="nav-item" v-show=" activeIndex=='Estate'"
                 :class="{'active':item.isChoosedType&&!initChooseAllEstate}"
                 @click="chooseEstateIdentify(item)" v-for="(item,index) in  tokensData.estates"
                 :key="index">
              <img src="../../../assets/svg/choosed.svg" alt="" class="icon">
              {{ item.name }}
            </div>
          </div>
          <div class="nft-list" v-show="activeIndex=='Land'">
            <template v-for="(item,index) in  tokensData.land" :key="index">
              <div class="nft-item"
                   @click="chooseNFT(nft,item)"
                   v-show="item.isChoosedType"
                   :class="{'active':nft.choosed==true}"
                   v-for="(nft,idx) in  item.nfts"
                   :key="idx">
                <div class="square">
                  <img :src="nft.image" alt="" class="icon">
                </div>
                <div class="name">
                  <strong v-if="nft.name">{{ nft.name }}</strong>
                  <strong v-else>{{ item.name }}#{{ nft.token_id }}</strong>
                </div>
                <div class="type">
                  {{ item.name }}
                </div>
                <div class="choose-box">
                  <img src="../../../assets/svg/choosed_active.svg" alt="" class="icon">
                </div>
              </div>
            </template>
          </div>
          <div class="nft-list" v-show="activeIndex=='Estate'">
            <template v-for="(item,index) in  tokensData.estates" :key="index">
              <div class="nft-item"
                   @click="chooseEstate(nft,item)"
                   v-show="item.isChoosedType"
                   :class="{'active':nft.choosed==true}"
                   v-for="(nft,idx) in  item.nfts"
                   :key="idx">
                <div class="square">
                  <img :src="nft.image" alt="" class="icon">
                </div>
                <div class="name">
                  <strong v-if="nft.name">{{ nft.name }}</strong>
                  <strong v-else>{{ item.name }}#{{ nft.token_id }}</strong>
                </div>
                <div class="type">
                  {{ item.name }}
                </div>
                <div class="choose-box">
                  <img src="../../../assets/svg/choosed_active.svg" alt="" class="icon">
                </div>
              </div>
            </template>
          </div>
          <div class="nft-detail-box">
            <div class="part1" v-if="curNFT&&activeIndex=='Estate'">
              <div class="img-box">
                <img :src="curNFT.image" alt="" class="icon">
              </div>
              <div class="part1-content">
                <div class="flex-box">
                  <img v-if="curTypeObj.icon" :src="require('@/assets'+curTypeObj.icon)" alt="" class="icon coinIcon">

                  <strong>{{ curTypeObj.name }}</strong>
                </div>
                <div class="info-list">
                  <div class="item" v-for="(attri,index) in curNFT.attributes" :key="index">
                    <div v-for="(value,key) in attri" :key="key">
                      <div class="name">
                        {{ key }}
                      </div>
                      <div class="value">
                        {{ value }}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <a v-if="curNFT" class="primary-btn-sha" :href="curNFT.link" target="_blank">
                View map
              </a>
            </div>
            <div class="part2">
              <div class="left-part">
                <div class="flex-box">
                  <div class="name">
                    Floor Price
                  </div>
                  <div class="value-box">
                    <img v-show="selectCoin=='ETH'" src="../../../assets/svg/ethereum.svg" alt="" class="icon coinIcon">
                    <img v-show="selectCoin=='USDT'" src="../../../assets/svg/usdt.svg" alt="" class="icon coinIcon">
                    {{ dealNum(collateralsValuePrice) }}
                  </div>
                </div>
                <div class="flex-box">
                  <div class="name boost-box">
                    Loan to Value
                    <div class="boost-btn" @click="$router.push('/governance/staking')"
                         v-if="!tbcStaking.status && tbcStaking.incr>0">
                      Boost Credit
                    </div>
                  </div>
                  <div class="value-box">
                    <div v-if="activeIndex=='Estate'" class="rate">{{ dealNum(curTypeObj.pledge_rate * 100) }}%</div>
                    <div v-if="activeIndex=='Land'" class="rate">{{ dealNum(pledgeRateLand * 100) }}%</div>
                    <span class="incr" v-if="tbcStaking.status && tbcStaking.incr>0"
                          style="margin-right: 10px"> + {{ dealNum(tbcStaking.incr * 100) }}%</span>
                    <img v-show="selectCoin=='ETH'" src="../../../assets/svg/ethereum.svg" alt="" class="icon coinIcon">
                    <img v-show="selectCoin=='USDT'" src="../../../assets/svg/usdt.svg" alt="" class="icon coinIcon">
                    <div>{{ dealNum(canLoanValuePrice) }}</div>
                  </div>
                </div>
                <div class="flex-box">
                  <div class="name">
                    Borrow APR
                  </div>
                  <div class="value-box">
                    {{ dealNum(curBorrowApy * 100) }}%
                  </div>
                </div>
              </div>
              <div class="right-part">
                <div class="flex-box">
                  <div class="name">
                    Available Loan Limit
                  </div>
                  <div class="value-box">
                    <img v-show="selectCoin=='ETH'" src="../../../assets/svg/ethereum.svg" alt="" class="icon coinIcon">
                    <img v-show="selectCoin=='USDT'" src="../../../assets/svg/usdt.svg" alt="" class="icon coinIcon">
                    {{ dealNum(availableLoanLimit) }}

                  </div>
                </div>


                <div class="flex-box">
                  <div class="name">
                    Est. Loan Time Available
                  </div>
                  <div class="value-box available-time">
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
          <div class="bottom-content" v-show="activeIndex==='Land'">
            <div class="title">
              Borrow Amount
            </div>
            <div class="input-box">
              <input type="number" step="any" min="0" v-model="amount" @input="checkInput">
              <div class="right-tip">
                <div class="max-btn primary-btn" @click="setMax">
                  Max
                </div>

                <div class="line"></div>
                <img src="@/assets/svg/ethereum.svg" v-show="selectCoin == 'ETH'" class="select-icon icon" alt="">
                <img src="@/assets/svg/usdt.svg" v-show="selectCoin == 'USDT'" class="select-icon icon" alt="">
                <Select
                    ref="select"
                    v-model:value="selectCoin"
                    style="width: 120px"
                    class="select-box"
                >

                  <template #option="{ label,icon }">
                    <img :src="require('@/assets/svg/'+`${icon}.svg`)" style="width: 20px;" class="icon" alt="">
                    &nbsp;&nbsp;{{ label }}
                  </template>
                  <SelectOption value="ETH" label="ETH" icon="ethereum">
                    ETH
                  </SelectOption>
                  <SelectOption value="USDT" label="USDT" icon="usdt">
                    USDT
                  </SelectOption>
                </Select>

              </div>
            </div>
            <div class="operate-box">

              <a-button :loading="isLoading" class="primary-btn-sha" @click="stake">
                <span v-if="!isApproved" style="margin-right: 6px">Approve & </span>
                Staking {{ chooseCount }} NFT
              </a-button>
            </div>
          </div>
          <div class="bottom-content" v-show="activeIndex==='Estate'">
            <div class="title">
              Borrow Amount
            </div>
            <div class="input-box">
              <input type="number" step="any" min="0" v-model="amountEstate" @input="checkInput">
              <div class="right-tip">
                <div class="max-btn primary-btn" @click="setMax">
                  Max
                </div>
                <div class="line"></div>
                <img src="@/assets/svg/ethereum.svg" v-show="selectCoin == 'ETH'" class="select-icon icon" alt="">
                <img src="@/assets/svg/usdt.svg" v-show="selectCoin == 'USDT'" class="select-icon icon" alt="">
                <Select
                    ref="select"
                    v-model:value="selectCoin"
                    style="width: 120px"
                    class="select-box"
                >
                  <template #option="{ label,icon }">
                    <img :src="require('../../../assets/svg/'+`${icon}.svg`)" style="width: 20px;" class="icon" alt="">
                    &nbsp;&nbsp;{{ label }}
                  </template>
                  <SelectOption value="ETH" label="ETH" icon="ethereum">
                    ETH
                  </SelectOption>
                  <SelectOption value="USDT" label="USDT" icon="usdt">
                    USDT
                  </SelectOption>
                </Select>

              </div>
            </div>
            <div class="operate-box">

              <a-button :loading="isLoading" class="primary-btn-sha" @click="estateStake">
                <span v-if="!isApproved" style="margin-right:6px;">
                  Approve &
                </span>
                Staking {{ curNFT ? curNFT.count : 0 }} NFT
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bigNumberUtil from "@/utils/bigNumberUtil";

const calculator = new bigNumberUtil();
import {message, Select, SelectOption} from "ant-design-vue";
import addressMap from "@/abi/addressMap";
import {mapGetters} from "vuex";
import BigNumber from "bignumber.js";
import {getTranStatus} from "@/api/common";
import {USDByChainId} from "@/utils/constantData";
import {isProxy, toRaw} from "vue";

BigNumber.set({
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});
export default {
  name: "StakeNFTDialog",
  props: ["closeDialog",
    "availableLoanArr", "priceMap",
    "tokensData",
    "updateData"
  ],
  components: {Select, SelectOption},
  data() {
    return {
      initChooseAllLand: false,
      initChooseAllEstate: false,
      chooseCount: 0,
      availbleLoan: 0,
      calculator,
      canLoanValue: 0,
      canLoanValueEstate: 0,
      collateralsValue: 0,
      collateralsValueEstate: 0,
      isLoading: false,
      dealNum: calculator.dealNum,
      curTypeObj: {},
      curLandTypeObj: {},
      curNFT: null,
      selectCoin: "ETH",
      active: false,
      amount: undefined,
      amountEstate: undefined,
      activeIndex: "Land",
      isApproved: true,
      curBorrowApy: 0
    };
  },
  computed: {
    ...mapGetters(["account", "web3", "isConnected", "chainId", "usdtDecimal"]),

    pledgeRateLand() {
      let result = calculator.divide(this.canLoanValuePrice, this.collateralsValuePrice);
      if (this.tbcStaking.status) {
        result = calculator.subtract(result, this.tbcStaking.incr);
      }
      return result;
    },
    tbcStaking() {
      return this.$store.state.app.tbcStaking;
    },
    availableLoanLimit() {
      let loanLimit = 0, amount = 0;
      loanLimit = BigNumber(this.availbleLoan).lt(this.canLoanValuePrice) ? this.availbleLoan : this.canLoanValuePrice;
      if (this.activeIndex === "Land") {
        amount = this.amount;
        if (BigNumber(this.amount).isNaN()) {
          return loanLimit > 0 ? loanLimit : 0;
        }
      } else {
        amount = this.amountEstate;
        if (BigNumber(this.amountEstate).isNaN()) {
          return loanLimit > 0 ? loanLimit : 0;
        }
      }

      loanLimit = calculator.subtract(loanLimit, amount);
      return loanLimit;
    },
    collateralsValuePrice() {
      let result = 0;
      if (this.activeIndex != 'Estate') {
        if (this.selectCoin == "ETH") {
          return this.collateralsValue;
        }
        result = calculator.multiply(this.collateralsValue, this.priceMap["ETH"]);
      } else {
        if (this.selectCoin == "ETH") {
          return this.collateralsValueEstate;
        }
        result = calculator.multiply(this.collateralsValueEstate, this.priceMap["ETH"]);
      }
      if (this.priceMap[this.selectCoin]) {
        result = calculator.divide(result, this.priceMap[this.selectCoin]);
      }
      return result;
    },
    loanToValue() {
      return BigNumber(this.availbleLoan).lt(this.canLoanValuePrice) ? this.availbleLoan : this.canLoanValuePrice;
    },
    canLoanValuePrice() {
      let result = 0, canLoanValue = 0;
      if (this.activeIndex == "Land") {
        canLoanValue = this.canLoanValue;
      } else {
        canLoanValue = this.canLoanValueEstate;
      }
      if (this.selectCoin == "ETH") {
        result = canLoanValue > 0 ? canLoanValue : 0;
      } else {
        result = calculator.multiply(canLoanValue, this.priceMap["ETH"]);
        if (this.priceMap[this.selectCoin]) {
          result = calculator.divide(result, this.priceMap[this.selectCoin]);
        }
      }
      if (this.tbcStaking.status) {
        result = calculator.add(result, calculator.multiply(this.collateralsValuePrice, this.tbcStaking.incr));
      }


      return result > 0 ? result : 0;

    },
    countdown() {
      const diff = this.availableTime;

      if (diff < 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          secs: 0
        };
      }
      let seconds = Math.ceil(diff);
      let days = Math.floor(seconds / 86400);
      seconds = seconds % 86400;

      let hours = Math.floor(seconds / 3600);
      hours = hours < 10 ? "0" + hours : hours;
      seconds = seconds % 3600;

      let minutes = Math.floor(seconds / 60);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds % 60;

      let secs = seconds < 10 ? "0" + seconds : seconds;

      return {
        days,
        hours,
        minutes,
        secs
      };
    },
    availableTime() {
      const lqApr = this.tokensData.liquidate_rate;
      let amount = 0;
      if (this.activeIndex == "Land") {
        amount = this.amount;
      } else {
        amount = this.amountEstate;
      }
      if (!this.canLoanValuePrice || !amount || amount <= 0) {
        return 0;
      }
      const availAmount = calculator.subtract(calculator.multiply(this.collateralsValuePrice, lqApr), amount);

      let canBorrowYears = 0;
      this.tokensData.pools.forEach(item => {
        if (item.name == this.selectCoin) {
          const onYearCost = amount * item.borrow_apy;
          canBorrowYears = calculator.divide(availAmount, onYearCost);
        }
      });
      if (!canBorrowYears || canBorrowYears <= 0) {
        return 0;
      }
      return canBorrowYears * 31536000;
    },

  },
  watch: {

    initChooseAllLand() {
      if (!this.initChooseAllLand) {
        let typeObjArr = this.tokensData.land;
        for (let i = 0; i < typeObjArr.length; i++) {
          const item = typeObjArr[i];
          item.isChoosedType = !item.isChoosedType;
        }
      }
    },
    initChooseAllEstate() {
      if (!this.initChooseAllEstate) {
        let typeObjArr = this.tokensData.estates;
        for (let i = 0; i < typeObjArr.length; i++) {
          const item = typeObjArr[i];
          item.isChoosedType = !item.isChoosedType;
        }
      }
    },
    isConnected() {
      this.initData();
    },
    tokensData: {
      deep: true,
      immediate: true,
      handler() {
        this.initData();
        this.chooseCount = 0;
        this.collateralsValue = 0;
        this.canLoanValue = 0;
        for (let i = 0; i < this.tokensData.land.length; i++) {
          const typeObj = this.tokensData.land[i];
          const loanV = calculator.multiply(typeObj.pledge_rate, typeObj.floor_price);

          for (let j = 0; j < typeObj.nfts.length; j++) {
            const nft = typeObj.nfts[j];
            if (nft.choosed) {
              this.chooseCount++;
              this.collateralsValue = calculator.add(this.collateralsValue, typeObj.floor_price);
              this.canLoanValue = calculator.add(this.canLoanValue, loanV);
            }
          }
        }
      }
    },
    selectCoin(coin) {

      if (coin == "ETH") {
        this.availbleLoan = this.availableLoanArr[0];
      } else {
        this.availbleLoan = this.availableLoanArr[1];

      }
      this.tokensData.pools.forEach(item => {
        const name = item.name === "USD" ? USDByChainId[this.chainId] : item.name;
        if (name == coin) {
          this.curBorrowApy = item.borrow_apy;
        }
      });
    },
  },
  created() {
    this.initData();
  },
  methods: {
    BigNumber,
    checkInput() {


      const maxAmount = BigNumber(this.availbleLoan).lt(this.canLoanValuePrice) ? this.availbleLoan : this.canLoanValuePrice;
      if (this.activeIndex === "Land") {
        if (this.amount < 0) {
          this.amount = 0;
        }
        if (BigNumber(this.availableLoanLimit).lt(0)) {
          this.amount = BigNumber(maxAmount).toFixed(3, BigNumber.ROUND_DOWN);
        }
      }
      if (this.activeIndex === "Estate") {
        if (this.amountEstate < 0) {
          this.amountEstate = 0;
        }
        if (BigNumber(this.availableLoanLimit).lt(0)) {
          this.amountEstate = BigNumber(maxAmount).toFixed(3, BigNumber.ROUND_DOWN);
        }
      }
    },
    setNav(url) {
      this.activeIndex = url;
      this.getIsApproved();
    },
    resetData() {
      this.chooseCount = 0;
      this.collateralsValue = 0;
      this.canLoanValue = 0;
      this.canLoanValueEstate = 0;
      this.collateralsValueEstate = 0;
      this.amount = 0;
      this.curNFT = null;
    },
    initData() {
      if (!this.isConnected || !this.tokensData.pools) {
        return;
      }
      this.tokensData.pools.forEach(item => {
        if (item.name == "ETH") {
          // this.availbleLoan = item.max_borrow;
        }
      });
      this.tokensData.pools.forEach(item => {
        if (item.name == this.selectCoin) {
          this.curBorrowApy = item.borrow_apy;
        }
      });

    },
    getIsApproved() {
      let typeObjArr = this.tokensData.land;
      if (this.activeIndex !== "Land") {
        typeObjArr = this.tokensData.estates;
      }
      for (let i = 0; i < typeObjArr.length; i++) {
        const item = typeObjArr[i];
        for (let j = 0; j < item.nfts.length; j++) {
          const nft = item.nfts[j];
          if (nft.choosed && !item.isApproved) {
            this.isApproved = false;
            return false;
          }
        }
      }
      this.isApproved = true;
      return true;
    },

    async dealRes(transactionHash) {
      let statusRes = await getTranStatus(transactionHash);
      if (statusRes.data.data == 1) {
        this.$emit("updateData");
        this.isLoading = false;
        this.$emit("closeDialog");
        message.success("Transaction Success");
        this.resetData();
      } else {
        setTimeout(() => {
          this.dealRes(transactionHash);
        }, 3000);
      }
    },
    chooseIdentify(identify) {
      this.initChooseAllLand = false;
      identify.isChoosedType = !identify.isChoosedType;

      let chooseNone = true;
      this.tokensData.land.forEach(typeObj => {
        if (typeObj.isChoosedType) {
          chooseNone = false;
        }
      });
      if (chooseNone) {
        this.initChooseAllLand = true;
        this.tokensData.land.forEach(typeObj => {
          typeObj.isChoosedType = true;
        });
      }
      this.$emit("updateChooseAllLand", this.initChooseAllLand);
    },
    chooseEstateIdentify(identify) {
      this.initChooseAllEstate = false;

      identify.isChoosedType = !identify.isChoosedType;

      let chooseNone = true;
      this.tokensData.estates.forEach(typeObj => {
        if (typeObj.isChoosedType) {
          chooseNone = false;
        }
      });
      if (chooseNone) {
        this.initChooseAllEstate = true;
        this.tokensData.estates.forEach(typeObj => {
          typeObj.isChoosedType = true;
        });
      }

      this.$emit("updateChooseAllEstate", this.initChooseAllEstate);
    },

    chooseEstate(nft, nftTypeObj) {
      this.tokensData.estates.forEach(item => {
        item.nfts.forEach(nft => {
          nft.choosed = false;
        });
      });
      nft.choosed = !nft.choosed;
      this.getIsApproved();
      this.curTypeObj = nftTypeObj;


      // sandbox estates
      const loanV = calculator.multiply(nftTypeObj.pledge_rate, nftTypeObj.floor_price);
      if (nft.choosed) {
        this.curNFT = nft;
        this.collateralsValueEstate = calculator.multiply(nft.token_ids.length, nftTypeObj.floor_price);
        this.canLoanValueEstate = calculator.multiply(nft.token_ids.length, loanV);
      } else {
        this.curNFT = null;
        this.collateralsValueEstate = 0;
        this.canLoanValueEstate = 0;
      }


    },
    chooseNFT(nft, nftTypeObj) {
      nft.choosed = !nft.choosed;
      this.curLandTypeObj = nftTypeObj;

      this.chooseCount = 0;
      this.collateralsValue = 0;
      this.canLoanValue = 0;
      for (let i = 0; i < this.tokensData.land.length; i++) {
        const typeObj = this.tokensData.land[i];
        const loanV = calculator.multiply(typeObj.pledge_rate, typeObj.floor_price);

        for (let j = 0; j < typeObj.nfts.length; j++) {
          const nft = typeObj.nfts[j];
          if (nft.choosed) {
            this.chooseCount++;
            this.collateralsValue = calculator.add(this.collateralsValue, typeObj.floor_price);
            this.canLoanValue = calculator.add(this.canLoanValue, loanV);
          }
        }
      }

      this.getIsApproved();
      this.checkInput()
    },
    setMax() {
      const maxAmount = BigNumber(this.availbleLoan).lt(this.canLoanValuePrice) ? this.availbleLoan : this.canLoanValuePrice;
      if (this.activeIndex === "Land") {
        this.amount = BigNumber(maxAmount).toFixed(3, BigNumber.ROUND_DOWN);
      } else {
        this.amountEstate = BigNumber(maxAmount).toFixed(3, BigNumber.ROUND_DOWN);
      }
    },
    dealCatchErr(e) {
      this.isLoading = false;

      if (e.code == 4001) {
        message.error('User canceled  transaction');
        return;
      }
      if (e.message && e.message.indexOf("{") < 0) {
        message.error(e.message, 3);
      } else {
        const err = JSON.parse(e.message.substr(e.message.indexOf("{"), e.message.length));
        if (err.originalError) {
          message.error(err.originalError.message);
        } else {
          message.error(e.message.substr(0, e.message.indexOf("{")));
        }

      }
    },
    async handleStake({addrArr, idArr, underlying, decimals, amount}) {
      try {


        await this.$store.dispatch("stake/stake", {
          _nfts: addrArr,
          _ids: idArr,
          _underlying: underlying,
          _amount: BigNumber(calculator.multiply(amount, decimals)).toFixed(0, BigNumber.ROUND_DOWN)
        }).then(async (res) => {
          this.dealRes(res.transactionHash,);
        }).catch(e => {
          this.dealCatchErr(e);
        });
      } catch (e) {
        this.dealCatchErr(e);

      }
    },
    async stakeSame(
        {
          chooseNftTypeArr,
          chooseNftArr,
          underlying,
          decimals,
          amount
        }) {

      try {

        await this.$store.dispatch("stake/stakeSame", {
          _nft: chooseNftTypeArr[0].contract,
          _ids: chooseNftArr,
          _underlying: underlying,
          _amount: BigNumber(calculator.multiply(amount, decimals)).toFixed(0, BigNumber.ROUND_DOWN)
        }).then(async (res) => {
          this.dealRes(res.transactionHash);

        });
      } catch (e) {
        this.dealCatchErr(e);

      }
    },
    async estateStake() {
      if (!this.isConnected) {
        message.info("Please connect");
        return;
      }
      if (!this.amountEstate || this.amountEstate <= 0) {
        message.info("Please input amount");
        return;
      }
      if (this.availableLoanLimit < 0) {
        message.info("Over Available Loan Limit");
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;

      if (!this.isApproved) {
        const isP = await this.setApprovalForAllEstate();
        if (!isP) {
          return;
        }
      }
      let underlying, decimals;
      this.tokensData.pools.forEach(item => {
        if (item.name == this.selectCoin) {
          underlying = item.underlying;
          decimals = 10 ** item.decimals;
        }
      });
      let chooseNftArr = [], contractArr = [], chooseNftTypeArr = [];
      this.tokensData.estates.forEach(nftType => {
        nftType.nfts.forEach(nft => {
          if (nft.choosed) {
            chooseNftTypeArr.push(nftType);
            contractArr.push({ //set contract params
              contract: nftType.contract
            });
            chooseNftArr = nft.token_ids;
          }
        });
      });

      this.stakeSame({
        chooseNftTypeArr,
        chooseNftArr,
        underlying,
        decimals,
        amount: this.amountEstate
      });
    },

    async stake() {
      if (!this.isConnected) {
        message.info("Please connect");
        return;
      }
      if (!this.amount || this.amount <= 0) {
        message.info("Please input amount");
        return;
      }
      if (this.availableLoanLimit < 0) {
        message.info("Over Available Loan Limit");
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      const isP = await this.setApprovalForAll();
      if (!isP) {
        return;
      }
      let chooseNftArr = [], chooseTypeNum = 0,
          chooseNftTypeArr = [], addrArr = [],
          underlying = "", decimals = 10 ** 18,
          selectCoin = this.selectCoin;
      this.tokensData.pools.forEach(item => {
        if (item.name == selectCoin) {
          underlying = item.underlying;
          decimals = BigNumber(10).pow(item.decimals);
        }
      });
      this.tokensData.land.forEach(item => {
        let hasNft = false;
        item.nfts.forEach(nft => {
          if (nft.choosed) {
            hasNft = true;
            chooseNftArr.push(nft);
            addrArr.push(item.contract);
          }
        });
        if (hasNft) {
          chooseTypeNum++;
          chooseNftTypeArr.push(item);
        }
      });


      if (chooseTypeNum <= 0 || chooseNftArr.length <= 0) {
        message.info("Please choose nft");
        return;
      }
      let idArr = [];
      chooseNftArr.forEach(item => {
        idArr.push(item.token_id);
      });
      if (chooseTypeNum === 1) {
        this.stakeSame({
          chooseNftTypeArr,
          chooseNftArr: idArr,
          underlying,
          decimals,
          amount: this.amount
        });
      }
      if (chooseTypeNum > 1) {
        this.handleStake({
          addrArr, idArr, underlying, decimals, amount: this.amount
        });
      }
    },
    async setApprovalForAllEstate() {
      let contractAddr = "";
      this.tokensData.estates.forEach(item => {
        item.nfts.forEach(nft => {
          if (nft.choosed) {
            contractAddr = item.contract;
          }
        });
      });
      const isP = await this.$store.dispatch("erc721/setApprovalForAll", {
        address: contractAddr,
        approved: true,
        to: addressMap[this.chainId]["stake"]
      }).then(async () => {
        await this.$parent.getISAllowance();
        setTimeout(() => {
          this.getIsApproved();
        }, 1000);
        return true;
      }).catch(e => {
        this.dealCatchErr(e);
        return false;
      });
      return isP;
    },
    async setApprovalForAll() {
      if (!this.isConnected) {
        message.info("Please connect");
        return;
      }

      // land approve
      try {
        let chooseTypeNum = 0, chooseNftTypeArr = [];
        for (let i = 0; i < this.tokensData.land.length; i++) {
          const item = this.tokensData.land[i];
          let hasNft = false;
          for (let j = 0; j < item.nfts.length; j++) {
            const nft = item.nfts[j];
            if (nft.choosed) {
              hasNft = true;
            }
          }
          if (hasNft) {
            chooseTypeNum++;
            chooseNftTypeArr.push(item);
          }
        }

        if (chooseTypeNum <= 0) {
          message.info("Please choose nft");
          return;
        }
        if (isProxy(chooseNftTypeArr)) {
          chooseNftTypeArr = toRaw(chooseNftTypeArr);
        }
        for (const item of chooseNftTypeArr) {
          if (!item.isApproved) {
            const isP = await this.$store.dispatch("erc721/setApprovalForAll", {
              address: item.contract,
              approved: true,
              to: addressMap[this.chainId]["stake"]
            }).then(async () => {
              await this.$parent.getISAllowance();
              setTimeout(() => {
                this.getIsApproved();
                return true;
              }, 1000);
              return true;
            }).catch(e => {
              this.dealCatchErr(e);
              return false;
            });
            if (!isP) {
              return false;
            }
          }
        }
        return true;

      } catch (e) {
        console.log(e);
        this.isLoading = false;
      }

    },
  },

};
</script>

<style lang="scss" scoped>
::v-deep(.ant-select-item-option-content) {
  .icon {
    width: 15px;
    height: 15px;
  }
}

.select-icon {
  position: absolute;
  right: 100px;
  top: 5px;
}

.dialog-content-container {
  min-width: 700px;
  width: 55vw;
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 80vh;
  padding-bottom: 38px;

  ::v-deep(.ant-select-selector) {
    background: none !important;
    border: none;
  }

  ::v-deep(.select-box) {
    background: none !important;
    border: none !important;

  }

  .nav-list {
    display: flex;
    margin: 0 0 30px;
    padding: 0 30px;
    border-bottom: 1px solid #E2E2E2;

    .nav-item {
      font-size: 16px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #333333;
      padding: 16px 26px;
      cursor: pointer;

      &.active {
        color: #FFC001;
        border-bottom: 1px solid #FFC600;
      }
    }
  }

  .nav-btn-box {
    overflow-x: auto;

    display: flex;
    padding: 0 30px;

    .nav-item {
      text-transform: capitalize;
      height: 40px;
      white-space: nowrap;
      width: auto;
      padding: 0 10px;
      background: #E2E2E2;
      border-radius: 30px;
      display: flex;
      user-select: none;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-family: Roboto-SemiBold, Roboto;
      font-weight: 600;
      color: #613A00;
      margin-right: 5px;
      cursor: pointer;

      .icon {
        display: none;
        width: 20px;
        height: 20px;
        margin-right: 3px;
      }

      &.active {
        background: linear-gradient(225deg, #FFAB00 0%, #FFC600 100%);

        .icon {
          display: block;
        }
      }
    }
  }

  .nft-list {

    margin: 22px 3%;
    padding: 15px;
    overflow: auto;
    height: 150px;
    background: #F3F3F3;
    border-radius: 23px 23px 23px 23px;

    display: grid;
    grid-template-columns: repeat(5, minmax(130px, 1fr));
    align-items: start;

    &::-webkit-scrollbar {
      display: none;
    }

    .nft-item {
      margin: 0 4px 8px 4px;
      background: #FFFFFF;
      border-radius: 8px 8px 8px 8px;
      border: 2px solid #fff;
      padding: 6px;
      position: relative;
      max-width: 200px;

      &.active {
        border: 2px solid #FFC001;

        .choose-box {
          .icon {
            display: block;
          }
        }
      }

      .square {
        position: relative;

        &::before {
          content: "";
          display: block;
          padding-top: 100%;
        }

        .icon {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
        }
      }


      .choose-box {
        position: absolute;
        top: 12px;
        right: 10px;
        width: 15px;
        height: 15px;
        background: #FFFFFF;
        border-radius: 50%;

        .icon {
          width: 16px;
          height: 16px;
          display: none;
        }
      }


      .name {
        font-size: 14px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #333333;
        margin-top: 6px;
        white-space: nowrap;
        overflow: hidden;

      }

      .type {
        font-size: 12px;
        opacity: 0.6;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }

  .nft-detail-box {
    padding: 0 30px;

    .part1 {
      display: flex;
      padding-bottom: 26px;
      border-bottom: 1px solid #E2E2E2;
      align-items: center;
      width: 100%;

      .img-box {
        width: 113px;
        height: 113px;
        background: #F3F3F3;
        border-radius: 8px 8px 8px 8px;
        border: 1px solid #E2E2E2;
        padding: 4px;

        .icon {
          width: 105px;
          height: 105px;
        }
      }

      .part1-content {
        margin-left: 15px;
        flex-grow: 1;
        padding-right: 20%;

        .flex-box {
          display: flex;
          align-items: center;

          .icon {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 8px;
          }

          strong {
            font-size: 18px;
            font-family: Roboto-Black, Roboto;
            font-weight: 900;
            color: #000000;
          }
        }

        .info-list {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;

          .item {
            .name {
              font-size: 14px;
              font-family: Roboto-Medium, Roboto;
              font-weight: 500;
              color: #999999;
            }

            .value {
              margin-top: 12px;
              font-size: 14px;
              font-family: Roboto-Black, Roboto;
              font-weight: 900;
              color: #333333;
            }
          }
        }

      }

      .primary-btn-sha {
        font-size: 12px;
        font-family: RussoOneRegular, Russo One;
        font-weight: 400;
        color: #613A00;
      }
    }

    .part2 {
      display: flex;
      justify-content: space-between;

      .boost-box {
        display: flex;

        .boost-btn {
          color: #FFBD01;
          position: relative;
          cursor: pointer;
          margin-left: 7px;

          &:after {
            content: '';
            bottom: 2px;
            left: 0;
            height: 1px;
            width: 100%;
            background: #FFBD01;
            position: absolute;
          }
        }
      }

      .left-part, .right-part {
        width: 48%;

        .rate {
          margin-right: 3px;
        }
      }

      .flex-box {
        justify-content: space-between;
        padding: 6px 0;
        display: flex;
        align-items: center;

        .name {
          font-size: 14px;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #999999;
        }

        .value-box {
          display: flex;
          align-items: center;
          font-size: 14px;
          font-family: Roboto-Black, Roboto;
          font-weight: 900;

          .rate {
            margin-right: 6px;
          }

          .incr {
            margin-left: 0;
          }

          .icon {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }

          .blue {
            font-size: 14px;
            font-family: Roboto-SemiBold, Roboto;
            font-weight: 600;
            color: #6284F5;
            margin-left: 10px;
          }

        }

        .available-time {
          font-weight: bold;

          strong {
            color: #FFBD01;
            margin-right: 3px;
          }
        }
      }
    }
  }

  .bottom-content {
    padding: 0 20%;

    .title {
      font-size: 20px;
      font-family: Roboto-Bold, Roboto;
      font-weight: bold;
      color: #000000;
      padding: 30px 0 20px;
    }

    .input-box {

      position: relative;
      height: 50px;
      background: #F1F1F1;
      border-radius: 50px 50px 50px 50px;
      padding-left: 20px;
      font-family: Roboto-Black, Roboto;

      input {
        width: 100%;
        height: 100%;
        background: none;
      }

      .right-tip {
        position: absolute;
        display: flex;
        right: 0;
        top: 10px;
        align-items: center;
        padding-right: 26px;

        .max-btn {
          font-size: 12px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          height: 30px;
          line-height: 30px;
        }

        .line {
          width: 1px;
          height: 30px;
          background: #DADADA;
          margin: 0 10px;
        }

        .icon {
          width: 20px;
          height: 20px;
          margin: 0 10px;
        }

        font-size: 14px;
        font-family: Roboto-Black, Roboto;
        font-weight: 900;
        color: #333333;
      }
    }

    .operate-box {
      justify-content: space-between;
      display: flex;
      margin-top: 23px;

      .primary-btn-sha {
        width: 100%;
        height: 5.8vh;

        font-family: RussoOneRegular, Russo One;
      }
    }
  }
}

.dialog-content-m {
  display: none;
}

@media screen and (max-width: 1000px) {
  .pc {
    display: none;
  }
  .dialog-content-m {
    display: block;
  }
  .dialog-header {
    display: flex;
    padding: 3vh 30px 0;
    justify-content: space-between;

    .title {
      font-size: 5vw;
      font-family: Roboto-SemiBold, Roboto;
      font-weight: 600;
      color: #000000;
    }

    .close {
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
  }

  .dialog-content-container {
    min-width: 100%;
    width: 100%;

    .nav-list {
      margin: 1vh 0 2vh 0;
      padding: 0 5vw;

    }

    .nav-btn-box {
      padding: 0 5vw;
      overflow-x: scroll;
      overflow-y: hidden;

      .nav-item {
        font-size: 3.4vw;
        height: 10vw;

        .icon {
          width: 20px;
          height: 20px;
        }
      }
    }

    .nft-list {
      margin: 3vh 5vw;
      width: 90vw;
      height: 30vh;
      grid-template-columns: repeat(3, minmax(100px, 1fr));
    }

    .nft-detail-box {
      padding: 2vh 5vw;

      .part1 {
        .img-box {

          .icon {
            width: 100%;
          }
        }

        .part1-content {
          padding: 0 3vw;
          margin: 0;

          .flex-box {
            .icon {
              width: 20px;
              height: 20px;
            }

            strong {
              font-size: 3.4vw;
            }
          }

          .info-list {
            margin-top: 2vh;
            width: 30vw;
            display: block;

            .item {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .name {
                font-size: 3.2vw;
              }

              .value {
                margin-top: 0;
                font-size: 3.4vw;
              }
            }

          }
        }

        .primary-btn-sha {
          width: 20vw;
          min-width: 100px;
          font-size: 3.2vw;
          white-space: nowrap;
        }
      }

      .part2 {
        display: block;

        .left-part, .right-part {
          width: 100%;
        }
      }
    }

    .bottom-content {
      padding: 0 5vw;
    }
  }
}

@media screen and (min-width: 1440px) {
  .dialog-content-container {
    .nft-list {
      height: 200px;
    }
  }

}

</style>
