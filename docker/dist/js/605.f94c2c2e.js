"use strict";(self["webpackChunkmangosale"]=self["webpackChunkmangosale"]||[]).push([[605],{68605:function(a,t,e){e.r(t),e.d(t,{default:function(){return d}});var s=function(){var a=this,t=a._self._c;return t("div",{staticClass:"tokenAdmin"},[t("h2",[a._v("Adjust Tax Free")]),t("div",{staticClass:"panel-box"},[t("h3",[a._v(" 1. Transfer Tax：3.5% ")]),t("div",{staticClass:"inline-input-box"},[t("div",{staticClass:"name"},[a._v(" Burn Tax ")]),t("input",{directives:[{name:"model",rawName:"v-model",value:a.tokenParams.burn_tax,expression:"tokenParams.burn_tax"}],attrs:{type:"text"},domProps:{value:a.tokenParams.burn_tax},on:{input:function(t){t.target.composing||a.$set(a.tokenParams,"burn_tax",t.target.value)}}})]),t("div",{staticClass:"inline-input-box"},[t("div",{staticClass:"name"},[a._v(" Marketing Tax ")]),t("input",{directives:[{name:"model",rawName:"v-model",value:a.tokenParams.marketing_tax,expression:"tokenParams.marketing_tax"}],attrs:{type:"text"},domProps:{value:a.tokenParams.marketing_tax},on:{input:function(t){t.target.composing||a.$set(a.tokenParams,"marketing_tax",t.target.value)}}})]),t("h3",[a._v(" 2. Marketing Wallet ")]),t("div",{staticClass:"inline-input-box"},[t("div",{staticClass:"name"},[a._v(" Address ")]),t("input",{directives:[{name:"model",rawName:"v-model",value:a.tokenParams.marketing_address,expression:"tokenParams.marketing_address"}],attrs:{type:"text"},domProps:{value:a.tokenParams.marketing_address},on:{input:function(t){t.target.composing||a.$set(a.tokenParams,"marketing_address",t.target.value)}}})])]),t("div",{staticClass:"mangobox-button",on:{click:a.setConfigure}},[a._v(" SUBMIT ")])])},n=[],r=e(78863),i=e(15941),o={name:"TokenAdmin",data(){return{tokenParams:{erc20_code_hash:r.Z.Erc20Hash.address,version:0,initial_supply:1e8,name:"TT",symbol:"T",decimals:10,owner:"",burn_tax:0,marketing_tax:0,marketing_address:"",transfer_limit:0,wallet_limit:0}}},methods:{setConfigure(){this.$store.dispatch("erc20/setConfigure",this.tokenParams)}},created(){i.log(this.$route.params),this.tokenParams=this.$route.params}},m=o,l=e(1001),u=(0,l.Z)(m,s,n,!1,null,"8ea51034",null),d=u.exports}}]);
//# sourceMappingURL=605.f94c2c2e.js.map