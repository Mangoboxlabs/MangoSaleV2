<template>
  <div class="mongobox-header">

    <div class="nav-box">
      <div class="left">
        <img @click="$router.push('/')" class="logo" src="../assets/logo.webp" alt=""/>
        <ul>
          <li class="nav-item-box" >
            <div class="w-font" @click="isShowNav1=true" :class="{'active': $route.path  == '/Token'||$route.path  == '/CreateToken'}">
              Tokens
              <div class="nav-list" :class="{active:isShowNav1}">
                <div class="nav-item" @click="$router.push('/Token');isShowNav1=false"  @click.stop>
                  My Token
                </div>
                <div class="nav-item " @click="$router.push('/CreateToken');isShowNav1=false"  @click.stop>
                  Create Token
                </div>
              </div>
            </div>
          </li>
          <li class="nav-item-box">
            <div class="w-font"  @click="isShowNav2=true" :class="{'active': $route.path  == '/Launchpads'||$route.path  == '/CreateLaunchpads'||$route.path  == '/CreateDutchAuction'||$route.path  == '/CreateFairLaunchpads'||$route.path  == '/LaunchpadsDetail'}">
              Launchpads
              <div class="nav-list" :class="{active:isShowNav2}">
                <div class="nav-item" @click="$router.push('/CreateLaunchpads?type=1');isShowNav2=false"  @click.stop>
                  Create Launchpads
                </div>
                <div class="nav-item" @click="$router.push('/CreateLaunchpads?type=2');isShowNav2=false"  @click.stop>
                  Create Fair Launchpad
                </div>
                <div class="nav-item" @click="$router.push('/CreateLaunchpads?type=3');isShowNav2=false"  @click.stop>
                  Create Dutch Auction
                </div>
                <div class="nav-item"  @click="$router.push('/Launchpads');isShowNav2=false"  @click.stop>
                  Launchpads List
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <polkaConnect/>
    </div>
    <div class="mask" v-show="isShowNav1||isShowNav2||isShowNav3" @click="isShowNav3=false,isShowNav1=false,isShowNav2=false">
    </div>
  </div>
</template>

<script>
import polkaConnect from "@/components/polkaConnect";

export default {
  name: "mangobox-header",
  components: {
    polkaConnect
  },
  data() {
    return {
      activeNav: 1,
      isShowNav1: false,
      isShowNav2: false,
      isShowNav3:false
    }
  },
  computed: {
    headerHeight() {
      return this.$route.path === '/' ? 300 : 60
    }
  },

}
</script>

<style lang="scss" scoped>
.mongobox-header {
padding-top: 10px;
  font-weight: bold;
  position: relative;
  width: 100%;
  z-index: 1;
  .mask {
    width: 100vw;
    height: 100vh;
    z-index: 0;
    position: fixed;
    top: 0;
    left: 0;
  }

  .nav-box {
    display: flex;
    height: 60px;
    justify-content: space-between;
    align-items: center;
    width: 1200px;
    margin: 0 auto;
    z-index: 1;
    position: relative;
    .nav-list{
      display: none;
    }
    .nav-item-box{
      &:hover{
        .nav-list{
          display: block;
        }
      }
      .nav-list{
        &.active{
          display: block;
        }
      }
    }
    .left {
      display: flex;
      align-items: center;
    }

    .logo {
      width: 140px;
      height: 26px;
    }

    ul {
      display: flex;
      height: 100%;
      align-items: center;

      li {
        height: 100%;
        position: relative;
        cursor: pointer;
        margin: 10px 40px;
        display: block;
        &:nth-child(3){
          .nav-list{
            width: 150px!important;
          }
        }
        .w-font {
          height: 34px;
          position: relative;
          top: 0;
          left: 0;
          transition: 0s;
          padding: 6px 20px;
          border: 1px;

          .nav-list {
            min-width: 130px;
            padding: 20px 20px;
            background: #1D2833;
            box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.3);
            border-radius: 15px;
            position: absolute;
            top: 33px;
            left: -20px;

            .nav-item {
              margin-top: 20px;
              white-space: nowrap;
              &:first-child{
                margin-top: 0;
              }
            }
          }
        }

        .active {
          background: #063E2E;
          border-radius: 20px;
          border: 1px solid #00C289;
        }


      }

    }
  }

}
</style>
