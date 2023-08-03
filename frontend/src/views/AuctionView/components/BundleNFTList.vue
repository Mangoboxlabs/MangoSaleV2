<template>
  <div class="dialog bundle-list animate__animated animate__fadeIn">
    <div class="dialog-mask" @click="$emit('closeDialog')"/>
    <div class="dialog-content">
      <div class="dialog-header">
        <div class="title">
        </div>
        <img src="@/assets/svg/close.svg" alt="" class="close" @click="$emit('closeDialog')">
      </div>
      <div class="nft-list" >
        <div class="nft-item" v-for="(nft,index) in nftList" :key="index" @click="openNFTURL(nft)">
          <div class="square">
            <img :src="nft.image" alt="" class="icon">
          </div>
          <div class="name">
            <strong v-if="nft.name">{{ nft.name }}</strong>
            <strong v-else>#{{ nft.token_id }}</strong>
          </div>
          <div class="type">
            {{nft.project_name}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {ChainIdMapById} from "@/utils/constantData";
import {mapGetters} from "vuex";

export default {
  name: "BundleNFTList",
  props: ["dataObj", "closeDialog"],
  data() {
    return {
      nftList: []
    }
  },
  computed:{
    ...mapGetters(["account","isConnected","chainId"])
  },
  async beforeCreate() {
    if (!this.dataObj.nft.type) {
      return
    }
    try {
      this.nftList = await this.$store.dispatch("stake/getBundleTokensByID", this.dataObj.bundle_id)
    } catch (e) {
      console.log(e)
    }
  },
  methods:{
    openNFTURL(item) {
      console.log(item)
      window.open(`https://opensea.io/assets/${ChainIdMapById[this.chainId]}/${item.contract}/${item.token_id}`, "_blank")
    },
  }
}
</script>
<style scoped lang="scss">
.bundle-list {
  .dialog-content{

  }
}

.nft-list {
  margin: 20px 20px 0;
  padding: 15px;
  width: 610px;
  overflow: auto;
  height: 250px;
  background: #F3F3F3;
  display: grid;
  grid-template-columns: repeat(5, minmax(110px, 1fr));
  align-items: start;
  border-radius: 23px 23px 23px 23px;

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

    &.active {
      border: 2px solid #FFC001;

      .choose-box {
        .icon {
          display: block;
        }
      }
    }

    .square{
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
        filter: drop-shadow(#FFC600 5000px -2px);
        height: 16px;
        transform: translate(-5000px, 2px);
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
    .type{
      font-size: 12px;
      opacity: 0.6;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
@media screen and (min-width: 1450px){
    .nft-list {
      height: 300px;
    }

}
</style>
