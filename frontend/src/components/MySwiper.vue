<template>
  <div class="mySwiper" id="certify">
    <section class="swiper-container loading">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <div class="img-box img2">
            <div class="logo-box">
              <img class="logo" src="../assets/images/img1.png" alt="">
            </div>
            <img style="width: 80%" class="title" src="../assets/images/img1_title.png" alt="">
          </div>
        </div>
        <div class="swiper-slide">
          <div class="img-box img3">
            <div class="logo-box">
              <img class="logo" src="../assets/images/img2.png" alt="">
            </div>
            <img style="width: 60%" class="title" src="../assets/images/img2_title.png" alt="">
          </div>
        </div>
        <div class="swiper-slide">
          <div class="img-box img4">
            <div class="logo-box">
              <img class="logo" src="../assets/images/img3.png" alt="">
            </div>
            <img style="width: 80%" class="title" src="../assets/images/img3_title.png" alt="">
          </div>
        </div>
      </div>

      <!-- If we need pagination -->
      <div class="swiper-pagination"></div>
      <!-- If we need navigation buttons -->
      <div class="swiper-button-prev swiper-button-white"></div>
      <div class="swiper-button-next swiper-button-white"></div>
    </section>
  </div>
</template>
<script>
export default {
  mounted() {
    let spaceBetween = 0;
    if (window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
      spaceBetween = 30;
    }
    /* eslint-disable*/
    let certifySwiper = new Swiper('#certify .swiper-container', {
      watchSlidesProgress: true,
      slidesPerView: 'auto',
      centeredSlides: true,
      loop: true,
      loopedSlides: 3,
      autoplay: true,
      spaceBetween,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        //clickable :true,
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
            let translate = slideProgress * modify * 100 + 'px';
            let scale = 1 - Math.abs(slideProgress) / 5;
            let zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
            slide.transform('translateX(' + translate + ') scale(' + scale + ')');
            slide.css('zIndex', zIndex);
            slide.css('opacity', 1);
            if (Math.abs(slideProgress) > 1) {
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
  }
};
</script>
<style scoped lang="scss">
/* CSS Document */

#certify {
  position: relative;
  margin: 0 auto;

}

#certify .swiper-container {
  padding-bottom: 120px;

}

#certify .swiper-slide {
  width: 260px;
  .img-box{
    width: 100%;
  }
}


#certify .swiper-pagination {
  width: 100%;
}

#certify .swiper-pagination-bullets .swiper-pagination-bullet {
  margin: 0 5px;
  border: 3px solid #fff;
  background-color: #d5d5d5;
  width: 10px;
  height: 10px;
  opacity: 1;
}


.swiper {
  width: 100%;
  padding-top: 50px;
}

.swiper-slide {
  background-position: center;
  background-size: cover;
  width: 300px;
  height: 300px;
}


.swiper-slide img {
  display: block;
  width: 100%;
}

.swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet::before, .swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet, [class^=swiper-button-] {
  transition: all 0.3s ease;
}

[class^=swiper-button-] {
  width: 44px;
  opacity: 0;
  visibility: hidden;
}

.swiper-button-prev {
  transform: translateX(50px);
}

.swiper-button-next {
  transform: translateX(-50px);
}

.swiper-container:hover .swiper-button-prev,
.swiper-container:hover .swiper-button-next {
  transform: translateX(0);
  opacity: 1;
  visibility: visible;
}

.img2::after {
  background-position: 400px 0 !important;
}

.img3::after {
  background-position: 600px 0 !important;
}

.img4::after {
  background-position: 800px 0 !important;
}


@media screen and (max-width: 1500px) {
  #certify .swiper-slide {
    width: 230px;

    .img-box {
      width: 100%;
    }
  }

}

@media screen and (max-width: 1000px) {
  #certify .swiper-slide {
    width: 180px;
    margin-top: 5vh;

    .img-box {
      width: 100%;
    }
  }
  #certify .swiper-container {
    padding-bottom: 5vh;

  }
}
</style>
