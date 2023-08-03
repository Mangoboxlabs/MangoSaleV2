<template>
  <div class="HomeHeader">
    <TryBankerHeader class="header" style="visibility: hidden"/>
    <div class="header-content">
      <div class="left">
        <div class="title-box">
          Unlock Your<br/>
          Estate's Value<br/>
          with <span> NFT</span><br/>
          Mortgage Lending
        </div>
        <div class="tip">
          - The Future of Real Estate Financing
        </div>
        <button class="primary-btn-sha" @click="$router.push('/stake')">
          Staking
        </button>
      </div>
      <div class="right swiper-box">
        <MySwiper></MySwiper>
      </div>
      <button class="primary-btn-sha m-btn" @click="$router.push('/stake')">
        Staking
      </button>
    </div>
  </div>
</template>

<script>
import MySwiper from "@/components/MySwiper.vue";

export default {
  name: "HomeHeader",
  components: {MySwiper},
  setup() {
    return {

    };
  },
};
</script>

<style lang="scss" scoped>

.HomeHeader {
  position: relative;
  color: #fff;
  background: url("../assets/images/banner.webp");
  background-size: 100% 100%;
  height: 50vw;
  min-height: 600px;

  .mySwiper.m {
    display: none;
  }

  .header {
    background: none !important;
  }

  .header-content {
    width: var(--content-width);
    margin: 0 auto;
    display: flex;
    padding-top: 12vh;

    .left {
      width: 40vw;

      .title-box {
        font-size: 3vw;
        font-family: RussoOneRegular, Russo One, sans-serif;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 4vw;

        span {
          color: #FFC600;
        }
      }

      .tip {
        margin-top: 40px;
        font-size: 1.6vw;
        max-font-size: 24px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #FFFFFF;
        white-space: nowrap;
      }

      @media screen and (min-width: 1920px) {
        .title-box {
          font-size: 60px;
        }
        .tip {
          font-size: 36px;
        }
      }

      .primary-btn-sha {
        margin-top: 40px;
        width: 200px;
        height: 55px;
        line-height: 55px;

        font-family: RussoOneRegular, Russo One;
      }
    }

    .m-btn {
      display: none;
    }

    .right {
      overflow: hidden;
      width:60vw;

      ::v-deep(.swiper-pagination) {
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
        }

        .swiper-pagination-bullet-active {
          padding: 1px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          transform: scale(1.3);
          background: linear-gradient(225deg, #FFAB00 0%, #FFC600 100%);
        }
      }


      ::v-deep(.swiper-slide) {
        width: auto;
        .img-box {

          width: 260px;
          height: auto;
          border: 2px solid rgba(255, 255, 255, .5);
          border-radius: 15px;
          padding: 15px;
          background: rgba(84, 84, 84, 0.5);
          position: relative;
          user-select: none;
          .logo-box {
            overflow: hidden;
            border-radius: 15px;
            transition: 0.3s;

            .logo {
              transition: 0.3s;
            }

            &:hover {
              .logo {
                transform: scale(1.3);
              }
            }
          }

          img {
            position: relative;
            z-index: 1;
            user-select: none;
          }

          .title {
            width: 70%;
            margin: 20px auto 0;
          }

          &::after {
            position: absolute;
            content: "";
            background-image: url("../assets/images/banner.webp");
            background-repeat: repeat;
            background-attachment: fixed;
            background-size: cover;
            background-position: top;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            filter: blur(10px);
            z-index: 0;
          }


        }
      }


    }
  }

  @media screen and (max-width: 1000px) {
    height: auto;
    padding-bottom: 30px;
    background: url("../assets/images/m_banner.webp");
    background-size: 100% 100%;

    .mySwiper.m {
      display: block;

      ::v-deep(.swiper-wrapper) {
        //margin-left: -50px!important;
        width: 100vw !important;
        margin-left: -5vw;
      }

    }
    .mySwiper.pc {
      display: none !important;
    }

    .header-content {
      display: block;
      width: 100%;
      padding: 20px 0;

      .left {
        width: 100%;
        padding:0 20px ;

        .title-box {
          font-size: 8vw;
          line-height: 10vw;
        }

        .tip {
          margin-top: 10px;
          font-size: 3.6vw;
        }

        .primary-btn-sha {
          display: none;
        }
      }
      .right{
        width:100%;
      }

      .swiper-box {
        display: flex;
        margin-top: 3vh;
        justify-content: center;
        overflow: hidden;

        ::v-deep(.swiper) {
          min-width: 80vw;
          height: auto;
          padding-bottom: 40px;
        }
      }

      .m-btn {
        display: block;
        margin: 0 auto;
        width: 36vw;
        height: 6vh;
        font-family: RussoOneRegular, Russo One;
      }
    }

  }

}
</style>
