<template>
  <div class="HomeHeader">
    <TryBankerHeader class="header"/>
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
        <div id="certify">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <div class="img-box ">
                  <div class="logo-box">
                    <img class="logo" src="../assets/images/img1.png" alt="">
                  </div>
                  <img style="width: 80%" class="title" src="../assets/images/img1_title.png" alt="">
                </div>
              </div>
              <div class="swiper-slide">

                <div class="img-box ">
                  <div class="logo-box">
                    <img class="logo" src="../assets/images/img2.png" alt="">
                  </div>
                  <img style="width: 70%" class="title" src="../assets/images/img2_title.png" alt="">
                </div>
              </div>
              <div class="swiper-slide">

                <div class="img-box ">
                  <div class="logo-box">
                    <img class="logo" src="../assets/images/img2.png" alt="">
                  </div>
                  <img style="width: 70%" class="title" src="../assets/images/img2_title.png" alt="">
                </div>
              </div>

            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
        <!--     :coverflow-effect="'coverflowEffect'"   -->
        <!--        <swiper-->
        <!--            :initial-slide="1"-->
        <!--            :effect="'overflow'"-->
        <!--            :pagination="{ clickable: true }"-->
        <!--            :scrollbar="{ draggable: true }"-->
        <!--            :slides-per-view="3"-->
        <!--            :centeredSlides="true"-->
        <!--            :space-between="-10"-->
        <!--            :centered-slides="true"-->
        <!--            :autoplay="true"-->
        <!--            :modules="modules"-->

        <!--            loop-->
        <!--            @slideChange="onProgress"-->
        <!--            @swiper="onProgress"-->
        <!--            class="mySwiper pc">-->
        <!--          <swiper-slide class="img1">-->
        <!--            <div class="img-box ">-->
        <!--              <div class="logo-box">-->
        <!--                <img class="logo" src="../assets/images/img1.png" alt="">-->
        <!--              </div>-->
        <!--              <img style="width: 80%" class="title" src="../assets/images/img1_title.png" alt="">-->
        <!--            </div>-->
        <!--          </swiper-slide>-->
        <!--          <swiper-slide class="img2">-->
        <!--            <div class="img-box ">-->
        <!--              <div class="logo-box">-->
        <!--                <img class="logo" src="../assets/images/img2.png" alt="">-->
        <!--              </div>-->
        <!--              <img style="width: 70%" class="title" src="../assets/images/img2_title.png" alt="">-->
        <!--            </div>-->
        <!--          </swiper-slide>-->
        <!--          <swiper-slide  class="img3">-->
        <!--            <div class="img-box ">-->
        <!--              <div class="logo-box">-->
        <!--                <img class="logo" src="../assets/images/img3.png" alt="">-->
        <!--              </div>-->
        <!--              <img style="width: 80%" class="title" src="../assets/images/img3_title.png" alt="">-->
        <!--            </div>-->
        <!--          </swiper-slide>-->

        <!--        </swiper>-->
        <swiper
            :initial-slide="1"
            :effect="'overflow'"
            :pagination="{ clickable: true }"
            :scrollbar="{ draggable: true }"
            :centeredSlides="true"
            :slides-per-view="3"
              :space-between="-26"
            :centered-slides="true"
            :autoplay="true"
            :modules="modules"
            loop
            @slideChange="onSlideChange"
            @swiper="onSwiper"
            class="mySwiper m">
          <swiper-slide>
            <div class="img-box ">
              <div class="logo-box">
                <img class="logo" src="../assets/images/img1.png" alt="">
              </div>
              <img style="width: 80%" class="title" src="../assets/images/img1_title.png" alt="">
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="img-box ">
              <div class="logo-box">
                <img class="logo" src="../assets/images/img2.png" alt="">
              </div>
              <img style="width: 70%" class="title" src="../assets/images/img2_title.png" alt="">
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="img-box ">
              <div class="logo-box">
                <img class="logo" src="../assets/images/img3.png" alt="">
              </div>
              <img style="width: 80%" class="title" src="../assets/images/img3_title.png" alt="">
            </div>
          </swiper-slide>

        </swiper>
      </div>
      <button class="primary-btn-sha m-btn" @click="$router.push('/stake')">
        Staking
      </button>
    </div>
  </div>
</template>

<script>
import {Pagination, Autoplay} from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

export default {
  name: "HomeHeader",
  components: {},
  mounted() {
    /*eslint-disable*/
    new Swiper('#certify .swiper-container', {
      watchSlidesProgress: true,
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween:10,
      loop: true,
      loopedSlides: 3,
      autoplay: true,
      pagination: {
        el: '.swiper-pagination',
        clickable :true,
      },
      on: {
        progress: function () {
          for (let i = 0; i < this.slides.length; i++) {
            var slide = this.slides.eq(i);
            var slideProgress = this.slides[i].progress;
            let modify = 1;
            if (Math.abs(slideProgress) > 1) {
              modify = (Math.abs(slideProgress) - 1) * 0.3 + 1;
            }
            let translate = slideProgress * modify * 260 + 'px';
            let scale = 1 - Math.abs(slideProgress) / 5;
            let zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
            slide.transform('translateX(' + translate + ') scale(' + scale + ')');
            slide.css('zIndex', zIndex);
            slide.css('opacity', 1);
            if (Math.abs(slideProgress) > 3) {
              slide.css('opacity', 0);
            }
          }
        },
        setTransition: function (swiper, transition) {
          for (var i = 0; i < this.slides.length; i++) {
            var slide = this.slides.eq(i);
            slide.transition(transition);
          }

        }
      }

    });
  },
  setup() {
    const onSwiper = () => {
    };
    const onSlideChange = () => {
    };
    const onProgress = (item) => {
      for (let i = 0; i < item.slides.length; i++) {
        var slide = item.slides.eq(i);
        var slideProgress = item.slides[i].progress;
        let modify = 1;
        if (Math.abs(slideProgress) > 1) {
          modify = (Math.abs(slideProgress) - 1) * 0.3 + 1;
        }
        let translate = slideProgress * modify * 10 + 'px';
        let scale = 1 - Math.abs(slideProgress) / 5;
        let zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
        slide.transform('translateX(' + translate + ') scale(' + scale + ')');

        slide.css('opacity', 1);
        if (Math.abs(slideProgress) > 3) {
          slide.css('opacity', 0);
        }
      }
    };
    return {
      onSwiper,
      onSlideChange,
      onProgress,
      modules: [Pagination, Autoplay],
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
      display: flex;
      justify-content: flex-end;
      overflow: hidden;

      #certify {
        width: 50vw;
        height: 30vw;
        padding-top: 50px;
        padding-bottom: 100px;
        padding-right: 10px;
        @media screen and (max-width: 1000px) {
          margin: 0 auto;
          width: 100%;
          padding-left: 0;
          padding-right: 0;
        }
      }

      ::v-deep(.img2 ) {
        .img-box::after {
          background-position: 400px 0 !important;
        }
      }

      .img3 {
        .img-box::after {
          background-position: 600px 0 !important;
        }
      }

      .img4 {
        .img-box::after {
          background-position: 800px 0 !important;
        }
      }

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
        width:auto;
        .logo {
          width: 200px !important;
          height: 255px;
          @media screen and (min-width: 1620px) {
            width: 240px !important;
            height: 305px;
          }
          @media screen and (min-width: 1920px) {
            width: 280px !important;
            height: 350px;
          }
          @media screen and (max-width: 1000px) {
            width: 160px !important;
            height: auto;
          }

        }


        .img-box {
          border: 2px solid rgba(255, 255, 255, .5);

          border-radius: 15px;
          padding: 15px;
          background: rgba(84, 84, 84, 0.5);

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

        -webkit-filter: brightness(50%);
        filter: brightness(80%);
        text-align: center;
        font-size: 18px;
        color: #000000;
        /* Center slide text vertically */
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;

        align-items: center;


      }

      ::v-deep(.swiper-slide-prev), ::v-deep(.swiper-slide-next) {
        .img-box {
          transform: scale(0.8);
        }

        z-index: 5 !important;
      }

      ::v-deep(.swiper-slide-active) {
        .img-box {
          transform: scale(1);
        }

        -webkit-transform: scale(1);

        z-index: 10;
        -webkit-filter: brightness(1);
        filter: brightness(1)
      }

      ::v-deep(.swiper-slide img) {
        width: 100%;
        height: 100%;
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
      padding: 20px;

      .left {
        width: 100%;

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
