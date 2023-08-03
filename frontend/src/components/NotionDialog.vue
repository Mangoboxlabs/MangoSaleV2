<template>
  <div class="NotionDialog">
    <div class="header">
      <div class="name">
        Notifications
      </div>
      <div class="right" @click="read">
        All Read
      </div>
    </div>
    <div class="notion-list">
      <div class="notion" v-for="(item,index) in messageArr" :key="index">
        <div class="notion-header">
          <div class="circle" v-if="item.status ==0"></div>
          <div class="title" :class="{active: item.status ==0}">
            {{ item.title }}
          </div>
        </div>
        <div class="notion-content">
          {{ item.content }}
        </div>
        <div class="time">
          {{ formatTime(new Date(item.created_at)) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {formatTime} from "../utils/timeUtil";
import {readMessage} from "@/api/common";
import {mapGetters} from "vuex";

export default {
  name: "NotionDialog",
  data() {
    return {
      notionList: []
    }
  },
  computed: {
    ...mapGetters(["account", "isConnected", "chainId"]),
    messageArr() {
      return this.$store.state.app.messageArr;
    },
  },
  methods: {
    formatTime,
    async read() {
      await readMessage(this.account)
      setTimeout(() => {
        this.$store.dispatch("app/getPersonInfo")
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.NotionDialog {
  color: #111;
  padding: 20px 5%;
  z-index: 100;

  .header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;

    .right {
      color: #999999;
    }
  }

  .notion-list {
    max-height: 500px;
    overflow-y: auto;
    overscroll-behavior: contain;

    .notion {
      margin-bottom: 20px;
      width: 100%;
      padding: 10px;
      border-radius: 15px 15px 15px 15px;
      border: 1px solid #EAEAEA;

      .notion-header {
        display: flex;
        align-items: center;

        .circle {
          width: 10px;
          height: 10px;
          background: #FF5963;
          margin-right: 10px;
          border-radius: 50%;
        }

        .title {
          color: #BBBBBB;

          &.active {
            color: #333;
          }
        }
      }

      .notion-content {
        font-size: 14px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #BBBBBB;
        text-align: left;
        line-height: 18px;
      }

      .time {
        font-size: 14px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #BBBBBB;
        text-align: left;
      }
    }
  }
}

@media screen and (max-width: 1000px) {
  .NotionDialog {
    width: 66vw;
    height: 100vh;
    border-radius: 0;

    .notion {

    }

  }
}
</style>
