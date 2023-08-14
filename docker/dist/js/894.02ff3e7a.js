"use strict";(self["webpackChunkmangosale"]=self["webpackChunkmangosale"]||[]).push([[894],{50894:function(t,e,s){s.r(e),s.d(e,{default:function(){return _}});var a=function(){var t=this,e=t._self._c;return e("div",{staticClass:"DetailsView"},[e("detailHeader",{attrs:{projectObj:t.project}}),e("div",{staticClass:"DetailsView-content"},[e("div",{staticClass:"left-content"},[e("div",{staticClass:"row"},[e("div",{staticClass:"name"},[t._v(" VOLUME ")]),e("div",{staticClass:"value"},[t._v(" "+t._s(t.volume)+" ")])]),e("div",{staticClass:"row"},[e("div",{staticClass:"name"},[t._v(" IN TREASURY ")]),e("div",{staticClass:"value"},[t._v(" "+t._s(t.volume)+" ")])]),t._m(0),e("div",{staticClass:"row"},[e("div",[t._v(" IN WALLET ")]),e("strong",[t._v(" "+t._s(t.myTokenBalance)+" ")])]),e("div",{directives:[{name:"show",rawName:"v-show",value:!t.tokenAddress&&t.tokenOwner==t.$store.state.app.account,expression:"!tokenAddress && tokenOwner==$store.state.app.account"}],staticClass:"mangobox-button",staticStyle:{"margin-top":"30px",padding:"10px 0"},on:{click:function(e){t.isShowCreate=!0}}},[t._v(" Create Token ")]),e("h2",{directives:[{name:"show",rawName:"v-show",value:!t.tokenAddress&&t.tokenOwner!=t.$store.state.app.account,expression:"!tokenAddress && tokenOwner!=$store.state.app.account"}],staticClass:"not-begun"},[t._v(" Fund-raising has not begun ")]),e("div",{directives:[{name:"show",rawName:"v-show",value:t.tokenAddress,expression:"tokenAddress"}],staticClass:"token-panel"},[e("h4",{staticClass:"sub-title"},[t._v(" Tokens ")]),e("div",{staticClass:"row"},[e("div",{staticClass:"name"},[t._v(" Total supply ")]),e("div",{staticClass:"value"},[t._v(" "+t._s(t.tokenSupply)+"tokens ")])]),e("div",{staticClass:"row"},[e("div",{staticClass:"name"},[t._v(" Your balance ")]),e("div",{staticClass:"value"},[t._v(" "+t._s(t.myBalance)+" tokens ")]),e("div",{staticClass:"mangobox-button",staticStyle:{padding:"6px 10px"},on:{click:function(e){t.isShowManageToken=!0}}},[t._v(" Manage Token ")])]),e("h4",{staticClass:"sub-title"},[t._v(" Funding cycle #"+t._s(parseInt(t.currentCycleInfo.number)+1)+" ")]),e("div",{staticClass:"row"},[e("div",{staticClass:"name"},[t._v(" Distribution limit ")]),e("div",{staticClass:"value"},[t._v(" "+t._s(t.currentCycleInfo.baseOn?t.currentCycleInfo.baseOn:"Zero")+" ")])]),e("div",{staticClass:"row"},[e("div",{staticClass:"name"},[t._v(" Duration ")]),e("div",{staticClass:"value"},[t._v(" "+t._s(0==t.currentCycleInfo.duration?"Not set":t.currentCycleInfo.duration)+" ")])]),e("div",{staticClass:"row"},[e("div",{staticClass:"name"},[t._v(" weight ")]),e("div",{staticClass:"value"},[t._v(" "+t._s(t.weight)+" ")])])])]),e("div",{directives:[{name:"show",rawName:"v-show",value:t.tokenAddress,expression:"tokenAddress"}],staticClass:"right-content"},[e("div",{staticClass:"row",staticStyle:{position:"relative"}},[e("div",{staticClass:"input-box"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.amount,expression:"amount"}],attrs:{type:"text"},domProps:{value:t.amount},on:{input:function(e){e.target.composing||(t.amount=e.target.value)}}})]),e("strong",{staticStyle:{position:"absolute",left:"270px",top:"8px"}},[t._v("USDT")]),e("div",{staticClass:"mangobox-button",staticStyle:{padding:"0 30px"},on:{click:t.pay}},[t._v(" PAY ")])]),e("div",[t._v(" Receive "),e("strong",[t._v(" "+t._s(t.distributeAmountNumber)+t._s(t.coinInfo.name)+"/1USDT")])]),e("h3",{staticClass:"sub-title"},[t._v(" Activity ")]),e("div",{staticClass:"paid-list"},t._l(t.PayRecord,(function(s,a){return e("div",{key:a,staticClass:"paid-item"},[e("div",{staticClass:"row paid-item-header"},[e("div",[t._v(" Paid ")]),e("div",[t._v(" "+t._s(s.time)+" ")])]),e("div",{staticClass:"row paid-item-content"},[e("div",{staticClass:"value"},[t._v(" $"+t._s(s.value)+" ")]),e("div",[t._v(" "+t._s(s.payer.substr(0,6)+"..."+s.payer.substr(s.payer.length-5,s.payer.length))+" ")])])])})),0)])]),e("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowCreate,expression:"isShowCreate"}],staticClass:"create-token-dialog"},[e("div",{staticClass:"mask"}),e("div",{staticClass:"content animate__animated animate__bounceInLeft",on:{click:function(t){t.stopPropagation()}}},[e("h1",[t._v("Create Token")]),e("h3",[t._v("Token Name")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.tokenName,expression:"tokenName"}],attrs:{type:"text",placeholder:"Token Name"},domProps:{value:t.tokenName},on:{input:function(e){e.target.composing||(t.tokenName=e.target.value)}}}),e("h3",[t._v("Token Symbol")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.tokenSymbol,expression:"tokenSymbol"}],attrs:{type:"text",placeholder:"Token Symbol"},domProps:{value:t.tokenSymbol},on:{input:function(e){e.target.composing||(t.tokenSymbol=e.target.value)}}}),e("div",{staticClass:"operate-btns"},[e("div",{staticClass:"mangobox-button",on:{click:t.issueTokenFor}},[t._v(" Create ")]),e("div",{staticClass:"mangobox-button",on:{click:function(e){t.isShowCreate=!1}}},[t._v(" Cancel ")])])])]),e("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowMint,expression:"isShowMint"}],staticClass:"create-token-dialog"},[e("div",{staticClass:"mask"}),e("div",{staticClass:"content animate__animated animate__bounceInLeft",on:{click:function(t){t.stopPropagation()}}},[e("h1",[t._v("Mint Token")]),e("h3",[t._v("Mint Amount")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.mintAmount,expression:"mintAmount"}],attrs:{type:"text",placeholder:"amount"},domProps:{value:t.mintAmount},on:{input:function(e){e.target.composing||(t.mintAmount=e.target.value)}}}),e("div",{staticClass:"operate-btns"},[e("div",{staticClass:"mangobox-button",on:{click:t.mintFor}},[t._v(" Mint ")]),e("div",{staticClass:"mangobox-button",on:{click:function(e){t.isShowMint=!1}}},[t._v(" Cancel ")])])])]),e("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowManageToken,expression:"isShowManageToken"}],staticClass:"create-token-dialog"},[e("div",{staticClass:"mask"}),e("div",{staticClass:"content"},[e("div",{staticClass:"close",on:{click:function(e){t.isShowManageToken=!1}}},[t._v(" x ")]),e("h1",[t._v(" Manage your token")]),e("div",{staticClass:"operate-box",on:{click:function(e){t.isShowBurn=!0}}},[e("h3",{staticClass:"title"},[t._v(" Burn Token ")]),e("div",{staticClass:"info"},[t._v(" Burn your Token. You won't receive USDT in return because this project has no overflow. ")]),t._m(1)]),e("div",{staticClass:"operate-box",on:{click:function(e){t.isShowClaim=!0}}},[e("h3",{staticClass:"title"},[t._v(" Claim Token as ERC-20 ")]),e("div",{staticClass:"info"},[t._v(" Move your Token from the Mangobox contract to your wallet. ")]),t._m(2)]),e("div",{staticClass:"operate-btns"},[e("div",{staticClass:"mangobox-button",on:{click:function(e){t.isShowManageToken=!1}}},[t._v(" Cancel ")])])])]),e("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowBurn,expression:"isShowBurn"}],staticClass:"create-token-dialog"},[e("div",{staticClass:"mask"}),e("div",{staticClass:"content animate__animated animate__bounceInLeft",on:{click:function(t){t.stopPropagation()}}},[e("h1",[t._v("Burn Token")]),e("h3",[t._v("Mint Amount")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.burnAmount,expression:"burnAmount"}],attrs:{type:"text",placeholder:"burn amount"},domProps:{value:t.burnAmount},on:{input:function(e){e.target.composing||(t.burnAmount=e.target.value)}}}),e("input",{directives:[{name:"model",rawName:"v-model",value:t.burnMemo,expression:"burnMemo"}],attrs:{type:"text",placeholder:"Memo(optional)"},domProps:{value:t.burnMemo},on:{input:function(e){e.target.composing||(t.burnMemo=e.target.value)}}}),e("div",{staticClass:"operate-btns"},[e("div",{staticClass:"mangobox-button",on:{click:t.redeemTokensOf}},[t._v(" Burn ")]),e("div",{staticClass:"mangobox-button",on:{click:function(e){t.isShowBurn=!1}}},[t._v(" Cancel ")])])])]),e("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowClaim,expression:"isShowClaim"}],staticClass:"create-token-dialog"},[e("div",{staticClass:"mask"}),e("div",{staticClass:"content animate__animated animate__bounceInLeft",on:{click:function(t){t.stopPropagation()}}},[e("h1",[t._v("Claim Token")]),e("h3",[t._v("Mint Amount")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.claimAmount,expression:"claimAmount"}],attrs:{type:"text",placeholder:"Claim amount"},domProps:{value:t.claimAmount},on:{input:function(e){e.target.composing||(t.claimAmount=e.target.value)}}}),e("div",{staticClass:"operate-btns"},[e("div",{staticClass:"mangobox-button",on:{click:t.claimFor}},[t._v(" Claim ")]),e("div",{staticClass:"mangobox-button",on:{click:function(e){t.isShowClaim=!1}}},[t._v(" Cancel ")])])])])],1)},i=[function(){var t=this,e=t._self._c;return e("div",{staticClass:"row"},[e("div",{staticClass:"name"},[t._v(" DISTRIBUTED ")]),e("div",{staticClass:"value"},[t._v(" 100% OVERFLOW ")])])},function(){var t=this,e=t._self._c;return e("div",{staticClass:"icon"},[e("img",{attrs:{src:s(1816),alt:""}})])},function(){var t=this,e=t._self._c;return e("div",{staticClass:"icon"},[e("img",{attrs:{src:s(1816),alt:""}})])}],o=(s(57658),function(){var t=this,e=t._self._c;return e("div",{staticClass:"detail-header",style:"height:"+t.headerHeight+"px;!important"},[e("div",{staticClass:"nav-box"},[e("img",{staticClass:"logo",attrs:{src:s(17247),alt:""},on:{click:function(e){return t.$router.push("/")}}}),e("ul",[e("li",{on:{click:function(e){return t.$router.push("/projects")}}},[e("span",{staticClass:"w-font"},[t._v("Projects")]),e("span",{staticClass:"re-active"},[t._v("Projects")])]),t._m(0),e("li",[e("polkaConnect")],1)])]),e("div",{staticClass:"detail-content"},[e("img",{staticClass:"icon",attrs:{src:t.projectObj.icon,alt:""}}),e("div",{staticClass:"right-content"},[e("h1",{staticClass:"name"},[t._v(" "+t._s(t.projectObj.name)+" ")]),e("div",{staticClass:"row"},[e("div",{staticClass:"id"},[e("strong",[t._v("Project")]),e("strong",[t._v("#"+t._s(t.projectObj.id))])]),e("div",{staticClass:"webside"},[e("a",{attrs:{href:t.projectObj.webside,target:"_blank"}},[t._v(" "+t._s(t.projectObj.webside)+" ")])]),e("div",{directives:[{name:"show",rawName:"v-show",value:t.projectObj.twitter,expression:"projectObj.twitter"}],staticClass:"twitter"},[e("a",{attrs:{href:t.projectObj.twitter,target:"_blank"}},[e("img",{attrs:{src:s(61850),alt:""}}),t._v(" "+t._s(t.projectObj.twitter?t.projectObj.twitter.replace("https://twitter.com/",""):""))])])]),e("div",{staticClass:"description"},[t._v(" "+t._s(t.projectObj.description)+" ")])])])])}),n=[function(){var t=this,e=t._self._c;return e("li",[e("span",{staticClass:"w-font"},[t._v("FAQ")]),e("span",{staticClass:"re-active"},[t._v("FAQ")])])}],r=s(23946),c={name:"detail-header",props:{projectObj:Object},components:{polkaConnect:r.Z},data(){return{}},computed:{headerHeight(){return this.$route.path,300}}},l=c,d=s(1001),u=(0,d.Z)(l,o,n,!1,null,"4b960d8f",null),m=u.exports,v=s(36797),h=s.n(v),p=s(78863),C={name:"DetailsView",components:{detailHeader:m},data(){return{moment:h(),tokenOwner:"",mintAmount:void 0,project:{},isShowManageToken:!1,isShowCreate:!1,isShowMint:!1,isShowBurn:!1,isShowClaim:!1,burnAmount:void 0,burnMemo:void 0,claimAmount:void 0,volume:0,myBalance:0,tokenSupply:0,projectId:null,tokenName:void 0,tokenSymbol:void 0,amount:void 0,PayRecord:[],tokenAddress:void 0,myTokenBalance:0,currentCycleInfo:{},weight:0,distributeAmountNumber:0,coinInfo:{}}},methods:{queryCoinInfo(){this.$store.dispatch("MBToken/queryInfo",this.tokenAddress).then((t=>{this.coinInfo=t}))},distributeAmount(){this.$store.dispatch("MBERC20PaymentTerminal/distributeAmount",this.projectId).then((t=>{this.distributeAmountNumber=t}))},tokenBalanceOf(){this.$store.dispatch("MBToken/balanceOf",{coinAddr:this.tokenAddress,owner:this.$store.state.app.account}).then((t=>{this.myTokenBalance=t,this.isShowBurn=!1}))},redeemTokensOf(){this.$store.dispatch("MBERC20PaymentTerminal/redeemTokensOf",{_holder:this.$store.state.app.account,_projectId:this.projectId,_tokenCount:this.burnAmount,_token:this.tokenAddress,_minReturnedTokens:0,_beneficiary:this.$store.state.app.account,_memo:this.burnMemo}).then((()=>{this.isShowBurn=!1,this.balanceOf(this.$store.state.app.account).then((t=>{this.myBalance=t}))}))},claimFor(){this.$store.dispatch("MBTokenStore/claimFor",{_projectId:this.projectId,_holder:this.$store.state.app.account,_amount:this.claimAmount}).then((()=>{this.isShowClaim=!1,this.tokenBalanceOf()}))},getProjectsWeight(){this.$store.dispatch("MBFundingCycleStore/getProjectsWeight",this.projectId).then((t=>{t&&(this.weight=t.replace(/,/g,"")),this.weight>0&&(this.weight=parseInt(this.weight)/10**18)}))},currentOf(){this.$store.dispatch("MBFundingCycleStore/currentOf",this.projectId).then((t=>{this.currentCycleInfo=t}))},getProjectTokenAddress(){this.$store.dispatch("MBTokenStore/getProjectTokenAddress",this.projectId).then((t=>{this.tokenAddress=t,t&&(this.tokenBalanceOf(),this.queryCoinInfo())}))},tokenOwnerOf(){this.$store.dispatch("MBProjects/ownerOf",this.projectId).then((t=>{this.tokenOwner=t}))},pay(){this.$store.dispatch("MBERC20PaymentTerminal/pay",{_projectId:this.projectId,_amount:this.amount,_token:this.$store.state.app.account,_beneficiary:this.$store.state.app.account,_minReturnedTokens:0,_preferClaimedTokens:!1,_memo:"",_metadata:""}).then((()=>{this.getPayRecords(),this.balanceOf(this.$store.state.app.account).then((t=>{this.myBalance=t}))}))},getPayRecords(){this.$store.dispatch("MBERC20PaymentTerminal/getPayRecords",this.projectId).then((t=>{this.PayRecord=t,this.PayRecord.forEach((t=>{const e=t.time.replace(/,/g,"").trim();t.time=this.moment(new Date(parseInt(e))).format("MMMM Do YYYY, h:mm:ss a")})),this.PayRecord.reverse()}))},getBalanceOf(t){return this.$store.dispatch("MBSingleTokenPaymentTerminalStore/getBalanceOf",{_account:p.Z.MBERC20PaymentTerminal.address,_projectId:t})},balanceOf(t){return t||(t="5DyQtzR89WGjAchokxH5Ntc2mxC9ruaUGi4nKYZCSq6VUMg1"),this.$store.dispatch("MBTokenStore/balanceOf",{_holder:t,_projectId:this.projectId})},issueTokenFor(){if(this.tokenName&&this.tokenSymbol&&this.tokenName.length>0&&this.tokenSymbol.length>0)return this.$store.dispatch("MBController/issueTokenFor",{_projectId:this.projectId,_name:this.tokenName,_symbol:this.tokenSymbol}).then((()=>{this.isShowCreate=!1,setTimeout((()=>{this.getProjectTokenAddress(),this.currentOf()}),500)}));this.$eventBus.$emit("message",{message:"Please Input tokenName && tokenSymbol",type:"error"})},mintFor(){this.mintAmount>0?this.$store.dispatch("MBTokenStore/mintFor",{_holder:this.$store.state.app.account,_projectId:this.projectId,_amount:this.mintAmount,_preferClaimedTokens:!1}).then((()=>{this.isShowMint=!1})):this.$eventBus.$emit("message",{message:"Please Input Mint Amount",type:"error"})}},created(){this.projectId=this.$route.query.id,this.project=this.$route.query,this.getBalanceOf(this.projectId).then((t=>{this.volume=t})),this.balanceOf().then((t=>{this.volume=t})),this.balanceOf(this.$store.state.app.account).then((t=>{this.myBalance=t})),this.getPayRecords(),this.getProjectTokenAddress(),this.tokenOwnerOf(),this.currentOf(),this.distributeAmount(),this.getProjectsWeight()},mounted(){}},k=C,A=(0,d.Z)(k,a,i,!1,null,"079e86cb",null),_=A.exports},1816:function(t){t.exports="data:image/webp;base64,UklGRvQAAABXRUJQVlA4WAoAAAAQAAAAHwAAHwAAQUxQSD4AAAABFyAQSELffI2ICAdEbdto6q9ACmnQynjRHYSI/k/AfBQYAoUVGAKFFRgChRX4SVfnChh0da6AQVfnDhgEr1ZQOCCQAAAAEAYAnQEqIAAgAD6RJKBNJaEjohQAsBIJbADDqY3+AfiBpgHyAXP/pUv66fAB5AAUL2tpvt61l6ioAP7zuv//mMSyf+wX2xwpr7f+/aZCCIFstCn/gf/EOHbsX/sF9scKbA3oPhsOQpCuhcf8r1IVyeOCBYdRJzwh7/Pxn/75p0BB0H49vYAi9SUvw/MQMEAA"},61850:function(t){t.exports="data:image/webp;base64,UklGRiQCAABXRUJQVlA4WAoAAAAQAAAAHwAAHwAAQUxQSEEBAAABkHLb2prHQ7plRleP+XSZuZa5lZVg6zCyzHWtY+4wz+iJGqas9coyRT8i7/PknYiYAAiTmrcc5XnK2WpOgkFr5ZqE1ytWIPuOAt7ZAT6SwY+iCzJ6IXDJsMvskPEdjU3/0QZg3QV6t/CbiM59dxawQtph5kcXgNHlqlsfrSDlVhdqv9dUwR/6Mqq5TeknfSYKXhPRX/hDsaOk799jBgE0bf55p0EVsXuO7vJbKQBEleu6OEfpqCYvA9IRTnnMBuTrnMfRkOyVQHGjo6WCPuKVw7np4GM+C5wtjp40cSMk3GoW0GGpboCkzUnXvnfvTkYboY2ZJul1ElZ8RCfF0PZ+IvEKYN1piNTLqeXjK5LfWQBsxqgN/0dzH6G/MHUB3jXjQrpjYgdy+y7InY2g1sqt5HbFgsGU/j1HeZ5y9vpTIAQAVlA4ILwAAADQBQCdASogACAAPpFCm0olo6IhqAgAsBIJbACdMoRwN6Bw5hotgA3AG5M6VJ7A37Y+jkBNuKAAAP7e1j6ohp11UXZ/ww/ww9YbvKZmVl4t7VdtZ4scvN4KoYCkoYvTGbxQhDFC4EoMZz/7+4ijBdaTDk83jRsKva3fdBMM2Gn3vGeocRfAa/D3z0NTJYlW3XwXg9lajEbLVExeI8phdrUeV035GLteJgWkCktKvuL9YzqibfY1GyMHOZ1cAA=="}}]);
//# sourceMappingURL=894.02ff3e7a.js.map