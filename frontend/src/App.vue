<template>
  <div class="app-container">
    <TryBankerHeader :class="{inHome:$route.path=='/'}"/>
    <router-view class="content"/>
    <TryBankerFooter/>
  </div>
</template>
<script>
import TryBankerFooter from "@/components/TryBankerFooter";
import {mapGetters} from "vuex"
export default {
  components:{TryBankerFooter},
  computed:{
    ...mapGetters(["account","isConnected","chainId"])
  },
  watch:{
    account(){
      this.getBalance()
    },
    chainId(){
      this.getBalance()
    },
    isConnected(){
      this.getBalance()
    }
  },
  methods:{
    async getBalance(){
      if(this.$store.state.app.isConnected){
        await this.$store.dispatch("usdt/getMyDecimals")
        this.$store.dispatch("usdt/getMyBalance")
      }
    }
  },
  beforeMount(){
    this.getBalance()
  }
}
</script>

<style lang="scss" scoped>
.TryBankerHeader.inHome {
  background: none !important;
  position: absolute;
  z-index: 10;
}
.app-container{
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--app-bg);

  .content{
    flex-grow: 1;
  }
}
</style>
