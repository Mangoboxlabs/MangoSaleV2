"use strict";(self["webpackChunkmangosale"]=self["webpackChunkmangosale"]||[]).push([[822],{76822:function(e,t,a){a.r(t),a.d(t,{default:function(){return c}});var s=function(){var e=this,t=e._self._c;return t("div",{staticClass:"CreateToken"},[t("h1",[e._v("Create Token")]),t("div",{staticClass:"panel-box"},[t("div",{staticClass:"title"},[e._v(" Token ")]),t("div",{staticClass:"input-box"},[t("div",{staticClass:"name"},[e._v(" Name ")]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.tokenParams.name,expression:"tokenParams.name"}],attrs:{type:"text",placeholder:"Token Name"},domProps:{value:e.tokenParams.name},on:{input:function(t){t.target.composing||e.$set(e.tokenParams,"name",t.target.value)}}})]),t("div",{staticClass:"input-box"},[t("div",{staticClass:"name"},[e._v(" Symbol ")]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.tokenParams.symbol,expression:"tokenParams.symbol"}],attrs:{type:"text",placeholder:"Token Symbol"},domProps:{value:e.tokenParams.symbol},on:{input:function(t){t.target.composing||e.$set(e.tokenParams,"symbol",t.target.value)}}})]),t("div",{staticClass:"input-box"},[t("div",{staticClass:"name"},[e._v(" Decimals ")]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.tokenParams.decimals,expression:"tokenParams.decimals"}],attrs:{type:"number",placeholder:"Token Decimals"},domProps:{value:e.tokenParams.decimals},on:{input:function(t){t.target.composing||e.$set(e.tokenParams,"decimals",t.target.value)}}})]),t("div",{staticClass:"input-box"},[t("div",{staticClass:"name"},[e._v(" Supply ")]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.tokenParams.initial_supply,expression:"tokenParams.initial_supply"}],attrs:{type:"number",placeholder:"Token Supply"},domProps:{value:e.tokenParams.initial_supply},on:{input:function(t){t.target.composing||e.$set(e.tokenParams,"initial_supply",t.target.value)}}})])]),t("div",{staticClass:"panel-box"},[t("div",{staticClass:"title"},[e._v(" Transfer Fee ")]),t("div",{staticClass:"inline-input-box"},[t("div",{staticClass:"name"},[e._v(" Burn Tax ")]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.tokenParams.burn_tax,expression:"tokenParams.burn_tax"}],attrs:{type:"text",placeholder:""},domProps:{value:e.tokenParams.burn_tax},on:{input:function(t){t.target.composing||e.$set(e.tokenParams,"burn_tax",t.target.value)}}})]),t("div",{staticClass:"inline-input-box"},[t("div",{staticClass:"name"},[e._v(" Marketing Tax ")]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.tokenParams.marketing_tax,expression:"tokenParams.marketing_tax"}],attrs:{type:"text",placeholder:"Marketing Tax"},domProps:{value:e.tokenParams.marketing_tax},on:{input:function(t){t.target.composing||e.$set(e.tokenParams,"marketing_tax",t.target.value)}}})]),t("h3",{staticStyle:{"font-size":"22px"}},[e._v("Marketing Wallet")]),t("div",{staticClass:"inline-input-box"},[t("div",{staticClass:"name"},[e._v(" Address ")]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.tokenParams.marketing_address,expression:"tokenParams.marketing_address"}],attrs:{type:"text",placeholder:"Marketing Wallet Add"},domProps:{value:e.tokenParams.marketing_address},on:{input:function(t){t.target.composing||e.$set(e.tokenParams,"marketing_address",t.target.value)}}})])]),t("div",{staticClass:"panel-box"},[t("div",{staticClass:"title"},[e._v(" Functional Limitation ")]),t("div",{staticClass:"inline-input-box"},[t("div",{staticClass:"name"},[e._v(" Transfer limit ")]),t("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:e.isShow1,callback:function(t){e.isShow1=t},expression:"isShow1"}})],1),t("div",{directives:[{name:"show",rawName:"v-show",value:e.isShow1,expression:"isShow1"}],staticClass:"inline-input-box"},[t("div",{staticClass:"name"},[e._v(" Max Amounts ")]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.tokenParams.transfer_limit,expression:"tokenParams.transfer_limit"}],attrs:{type:"text",placeholder:"Marketing Wallet Add"},domProps:{value:e.tokenParams.transfer_limit},on:{input:function(t){t.target.composing||e.$set(e.tokenParams,"transfer_limit",t.target.value)}}})]),t("div",{staticClass:"inline-input-box"},[t("div",{staticClass:"name"},[e._v(" Wallet limit ")]),t("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:e.isShow2,callback:function(t){e.isShow2=t},expression:"isShow2"}})],1),t("div",{directives:[{name:"show",rawName:"v-show",value:e.isShow2,expression:"isShow2"}],staticClass:"inline-input-box"},[t("div",{staticClass:"name"},[e._v(" Wallet limit ")]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.tokenParams.wallet_limit,expression:"tokenParams.wallet_limit"}],attrs:{type:"text",placeholder:"Marketing Wallet Add"},domProps:{value:e.tokenParams.wallet_limit},on:{input:function(t){t.target.composing||e.$set(e.tokenParams,"wallet_limit",t.target.value)}}})])]),t("div",{staticClass:"mangobox-button",on:{click:e.createToken}},[e._v(" CREAT ")])])},i=[],n=(a(57658),a(78863)),o={name:"CreateToken",data(){return{isShow1:!1,isShow2:!1,tokenParams:{erc20_code_hash:n.Z.Erc20Hash.address,version:0,initial_supply:void 0,name:void 0,symbol:void 0,decimals:void 0,owner:"",burn_tax:0,marketing_tax:0,marketing_address:"",transfer_limit:0,wallet_limit:0}}},computed:{account(){return this.$store.state.app.account}},watch:{account(){this.getUserTokens()}},created(){this.getUserTokens()},methods:{async getUserTokens(){let e=await this.$store.dispatch("tokenFactory/getUserTokens",this.$store.state.app.account);this.list=e},async createToken(){this.tokenParams.name?this.tokenParams.symbol&&this.tokenParams.decimals?this.tokenParams.initial_supply?(this.tokenParams.version=this.list.length+1,this.tokenParams.owner=this.$store.state.app.account,this.$store.state.app.account?(await this.$store.dispatch("tokenFactory/newErc20",this.tokenParams),this.$router.push("/Token")):this.$eventBus.$emit("message",{message:"Please connect  ",type:"error"})):this.$eventBus.$emit("message",{message:"Please token supply ",type:"error"}):this.$eventBus.$emit("message",{message:"Please token symbol ",type:"error"}):this.$eventBus.$emit("message",{message:"Please token name ",type:"error"})}}},r=o,l=a(1001),m=(0,l.Z)(r,s,i,!1,null,"23110e3c",null),c=m.exports}}]);
//# sourceMappingURL=822.615ea0bc.js.map