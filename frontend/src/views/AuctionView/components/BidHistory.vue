<template>
    <div class="BidHistory dialog">
        <div class="dialog-mask" @click="$emit('closeDialog')"></div>
        <div class="dialog-content animate__fadeIn animate__animated">
            <div class="dialog-header">
                <div class="title">Bid History</div>
                <img src="../../../assets/svg/close.svg" alt="" class="close" @click="$emit('closeDialog')" />
            </div>
            <div class="bid-list">
                <div class="list-item" v-for="(item, index) in bidHistoryList" :key="index">
                    <div class="col">
                        <img v-if="nftObj.underlying" class="icon" :src="require('@/assets' + nftObj.underlying.icon)" alt="" />
                        {{ dealNum(item.bid_price) }}
                    </div>
                    <div class="col" @click="toTrash(item.trans_hash)" style="cursor: pointer; color: #0057ff">
                        {{ format(item.created_at * 1000, "MM/DD HH:mm") }}
                    </div>
                    <div class="col" @click="toAddress(item.user)" style="cursor: pointer; color: #0057ff">
                        <!-- <img src="@/assets/svg/etherscan.svg" class="dot" /> -->
                        <template v-if="account == item.user"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;you </template>
                        <template v-else>
                            {{ formatAddress(item.user) }}
                        </template>
                        <!-- <img src="@/assets/imgs/link.svg"> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { format } from "../../../utils/timeUtil";
import bigNumberUtil from "@/utils/bigNumberUtil";
import { mapGetters } from "vuex";
import { EthscanUrlByChainId } from "@/utils/constantData";
const calculator = new bigNumberUtil();

export default {
    props: ["closeDialog", "nftObj"],
    data() {
        return {
            dealNum: calculator.dealNum,
            bidHistoryList: [],
        };
    },

    computed: {
        ...mapGetters(["account", "chainId"]),
    },
    methods: {
        format,
        async getBidHistory() {
            if (this.nftObj.auction_id != null) {
                this.bidHistoryList = await this.$store.dispatch("auctionNFT/getBidHistory", this.nftObj.auction_id);
            }
        },
        toTrash(hash) {
            window.open(EthscanUrlByChainId[this.chainId] + "/tx/" + hash, "_blank");
        },
        toAddress(address) {
            window.open(EthscanUrlByChainId[this.chainId] + "/address/" + address, "_blank");
        },
        formatAddress(addr) {
            if (!addr) {
                return "";
            }
            return addr.substring(0, 4) + "..." + addr.substring(addr.length - 4, addr.length);
        },
    },
};
</script>
<style scoped lang="scss">
.BidHistory {
    .dialog-content {
        position: absolute;
        z-index: 1;
        background: #ffffff;
        border-radius: 30px 30px 30px 30px;
        padding: 30px 0;
        width: 510px;

        .bid-list {
            padding: 0 30px;

            .list-item {
                display: flex;
                justify-content: space-between;
                padding: 20px 0;
                border-bottom: 1px solid #d2d2d2;
                font-family: Roboto-Black, Roboto;
                font-weight: 900;
                color: #333333;
                .col {
                    display: flex;
                    align-items: center;
                    .icon {
                        width: 20px;
                        margin-right: 6px;
                        height: 20px;
                    }
                    .dot {
                        margin-right: 6px;
                        width: 22px;
                        height: 22px;
                        background: #d9d9d9;
                        border-radius: 50%;
                    }
                }
                &:last-child {
                    border: none;
                }
            }
        }

        .dialog-header {
            display: flex;
            padding: 0 30px 20px;
            justify-content: space-between;
            border-bottom: 1px solid #d2d2d2;

            .title {
                font-size: 20px;
                font-family: Roboto-SemiBold, Roboto;
                font-weight: 600;
                color: #000000;
                line-height: 35px;
            }

            .close {
                width: 30px;
                height: 30px;
                cursor: pointer;
            }
        }
    }
}
</style>

