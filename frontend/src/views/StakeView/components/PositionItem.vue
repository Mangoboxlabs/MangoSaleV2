<template>
  <div class="PositionItem " :class="{'menu-list-item':listActive==2}">
    <BundleNFTList :dataObj="dataObj" @closeDialog="isShowBundle = false" v-if="isShowBundle"/>
    <BorrowReplayDialog :bundle_id="dataObj.bundle_id" ref="repayDialog" @closeDialog="isShowRepay = false"
                        v-show="isShowRepay" @updateData="$emit('updateData')"/>

    <!--    borrow / repay dialog-->
    <div class="dialog" v-if="showBorrow">
      <div class="dialog-mask" @click="showBorrow = false"></div>
      <BorrowDialogContent
          ref="borrowDialog"
          :availableLoanArr="availableLoanArr"
          :countdown="countdown"
          @closeDialog="showBorrow = false"
          @updateData="$emit('updateData')"
          :dataObj="dataObj"
          :type="type"
      />
    </div>
    <Popup round position="bottom" v-model:show="showmBorrow" class="">
      <BorrowDialogContent
          ref="borrowDialog"
          :availableLoanArr="availableLoanArr"
          :countdown="countdown"
          @closeDialog="showmBorrow = false"
          @updateData="$emit('updateData')"
          :dataObj="dataObj"
          :type="type"
      />
    </Popup>

    <!--    sell dialog-->
    <div class="dialog" v-if="showSell">
      <div class="dialog-mask" @click="showBorrow = false"></div>
      <SellNFTDialogContent :countdown="countdown" @closeDialog="showSell = false" @updateData="$emit('updateData')"
                            :dataObj="dataObj"/>
    </div>

    <Popup round position="bottom" v-model:show="showMSell" class="">
      <SellNFTDialogContent
          :countdown="countdown"
          @closeDialog="showMSell = false"
          @updateData="$emit('updateData')"
          :dataObj="dataObj"
      />
    </Popup>
    <Popup round position="bottom" v-model:show="showmBorrow" class="">
      <BorrowDialogContent ref="MBorrowDialog" :availableLoanArr="availableLoanArr" @closeDialog="showmBorrow = false"
                           @updateData="$emit('updateData')" :dataObj="dataObj" :type="type"/>
    </Popup>
    <div class="dialog animate__animated animate__fadeIn" v-show="showBid">
      <div class="dialog-mask" @click="showBid = false"></div>
      <div class="dialog-content">
        <BidDialogContent :nowTime="nowTime" @updateData="$emit('updateData')" :nftObj="dataObj"
                          @closeDialog="showBid = false"/>
      </div>
    </div>
    <Popup round position="bottom" v-model:show="showMBid" class="">
      <BidDialogContent :nowTime="nowTime" @updateData="$emit('updateData')" :nftObj="dataObj"
                        @closeDialog="showMBid = false"/>
    </Popup>
    <div class="list-list-item" v-show="listActive==1" :class="{'active':showBottom}">
      <div class="main-content">
        <div class="logo-box" @click="showNFTs">
          <div class="square">
            <img v-if="dataObj.nft.type=='Bundle'" class="logo" src="@/assets/images/bundle.png" alt="">
            <img v-else :src="dataObj.nft ? dataObj.nft.image : ''" alt="" class="logo"/>
          </div>
          <div class="name">
            <span>{{ dataObj.nft.type }}</span>
            <span>{{ dataObj.nft.count }} </span>
          </div>
        </div>
        <div class="position-info-box">
          <div class="position-info">
            <div class="in-line">
              <div class="name">Loan ID</div>
              <div class="value">
                <strong>#{{ dataObj.bundle_id }}</strong>
              </div>
            </div>

            <div class="in-line">
              <div class="name">Floor Price</div>
              <div class="value">
                <img class="icon coinIcon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>
                <strong>{{ dealNum(dataObj.staked_value) }}</strong>
              </div>
            </div>
            <div class="in-line">
              <div class="name boost-box">
                Loan to Value
                <div class="boost-btn" @click="$router.push('/governance/staking')" v-if="!dataObj.is_tbc_staking">Boost
                  Credit
                </div>
              </div>
              <div class="value loan-box">
                <strong class="rate">{{
                    showNum(borrowRate)
                  }}%</strong>


                <!--            <span class="incr" v-if="tbcStaking.status && tbcStaking.incr>0"-->
                <!--                  style="margin-right: 10px"> + {{ dealNum(tbcStaking.incr * 100) }}%</span>-->
                <img class="icon coinIcon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>
                <strong> {{ dealNum(dataObj.staked_value * borrowRate) }}</strong>
              </div>
            </div>
            <div class="in-line">
              <div class="name">Total Borrowed / Repaid</div>
              <div class="value">
                <img class="icon coinIcon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>
                <strong>{{ dealNum(dataObj.total_borrowed) }}</strong> /
                <strong>{{ dealNum(dataObj.total_repaid) }}</strong>
              </div>
            </div>
          </div>
          <img class="down-icon" :class="{'active':showBottom}" src="../../../assets/svg/down_l.svg" alt="" @click="showBottom=!showBottom">

          <div v-show="showBottom" class="bottom-content">

            <div class="position-info info2">
              <div class="in-line">
                <div class="name">Debt</div>
                <div class="value">
                  <img class="icon coinIcon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>
                  <strong>{{ dealNum(debt) }}</strong>
                </div>
              </div>
              <div class="in-line">
                <div class="name">Available to Borrow</div>
                <div class="value">
                  <img class="icon coinIcon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>
                  <strong>{{ dealNumLess(dataObj.available_borrow) }}</strong>
                </div>
              </div>
              <div class="in-line healthy-box">
                <div class="name">
                  Healthy Factor
                  <Tooltip placement="top">
                    <template #title>
                      <span>NFTs will be liquidated When the liquidation factor is below 1</span>
                    </template>
                    <img src="../../../assets/images/tip_icon.webp" alt="" class="tip-icon"/>
                  </Tooltip>
                </div>
                <div class="value">
                  <div class="progress-box">
                    <div class="progress-content">
                      <div class="progress-part1"></div>
                      <div class="progress-part2"></div>
                      <div class="progress-part3"></div>
                    </div>
                    <div class="progress-cycle" :class="{ health: dataObj.health_index > 1.2 }"
                         :style="'left:' + (dataObj.health_index / 3) * 100 + '%'">
                      <strong>{{ dataObj.health_index }}</strong>
                    </div>
                    <div class="progress-line1"></div>
                    <div class="progress-line2"></div>
                  </div>
                </div>
              </div>

              <div class="in-line available-time">
                <div class="name">Est. Available Loan Time</div>
                <div class="value">
                  <div class="time-box">
                    <div class="time-item">{{ countdown.days }}d</div>
                    <div class="time-item">{{ countdown.hours }}h</div>
                    <div class="time-item">{{ countdown.minutes }}m</div>
                    <div class="time-item">{{ countdown.secs }}s</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="btn-box" :class="{ 'auction-btn': dataObj.health_index < 1 || dataObj.list_price > 0 }">
          <template v-if="dataObj.in_auction">
            <button
                class="primary-btn-sha"
                v-if="dataObj.show_repay"
                @click="
                            isShowRepay = true;
                            $refs.repayDialog.getData();
                        "
            >
              Borrower Repay
            </button>
            <button :class="{'line-btn':dataObj.show_repay,'primary-btn-sha':!dataObj.show_repay}" @click="handleOperate">
              <span>
                In Auction
              </span>
            </button>

          </template>
          <template v-else>
            <button class="primary-btn-sha" @click="showDialog(1)" v-show="dataObj.list_price <= 0">Bill</button>
            <button class="line-btn" @click="showSell = true" v-show="dataObj.list_price <= 0">
              <span class="span">
                Sell
              </span>
            </button>
            <div class="list-tip-box" v-if="dataObj.list_price > 0">
              <div class="list-tip">
                <div class="name">Listing Price</div>
                <div class="value">
                  <img class="icon coinIcon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>
                  <strong>{{ dealNum(dataObj.list_price) }}</strong>
                </div>
              </div>
            </div>
            <a-button class="primary-btn-sha" :loading="isLoading" @click="handleCancel" v-show="dataObj.list_price > 0">
              Cancel
            </a-button>
            <div class="red-tip" v-if="dataObj.list_price > 0 && BigNumber(dataObj.list_price).lt(debt)">Failed Listing
              due to lower List price than debt.
            </div>
          </template>
        </div>
      </div>
      <div class="bottom-temp" v-if="showBottom"></div>
    </div>


    <div v-show="listActive==2" class="">
      <div class="position-header">
        <div class="logo-box square">
          <img v-if="dataObj.nft.type=='Bundle'" class="logo" src="@/assets/images/bundle.png" alt="">
          <img v-else :src="dataObj.nft ? dataObj.nft.image : ''" alt="" class="logo"/>
        </div>
        <div class="right">
          <div class="name">
            <span>{{ dataObj.nft.type }}</span>
            <span>{{ dataObj.nft.count }} </span>
          </div>


        </div>
      </div>
      <div class="position-info">
        <div class="in-line">
          <div class="name">Loan ID</div>
          <div class="value">
            <strong>#{{ dataObj.bundle_id }}</strong>
          </div>
        </div>
        <div class="in-line">
          <div class="name">Debt</div>
          <div class="value">
            <img class="icon coinIcon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>
            <strong>{{ dealNum(debt) }}</strong>
          </div>
        </div>
        <div class="in-line">
          <div class="name">Floor Price</div>
          <div class="value">
            <img class="icon coinIcon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>
            <strong>{{ dealNum(dataObj.staked_value) }}</strong>
          </div>
        </div>
        <div class="in-line">
          <div class="name boost-box">
            Loan to Value
            <div class="boost-btn" @click="$router.push('/governance/staking')" v-if="!dataObj.is_tbc_staking">
              Boost Credit
            </div>
          </div>
          <div class="value loan-box">
            <strong class="rate">{{
                showNum(borrowRate)
              }}%</strong>

            <!--            <span class="incr" v-if="tbcStaking.status && tbcStaking.incr>0"-->
            <!--                  style="margin-right: 10px"> + {{ dealNum(tbcStaking.incr * 100) }}%</span>-->
            <img class="icon coinIcon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>
            <strong> {{ dealNum(dataObj.staked_value * borrowRate) }}</strong>
          </div>
        </div>
        <div class="in-line">
          <div class="name">Total Borrowed / Repaid</div>
          <div class="value">
            <img class="icon coinIcon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>
            <strong>{{ dealNum(dataObj.total_borrowed) }}</strong> /
            <strong>{{ dealNum(dataObj.total_repaid) }}</strong>
          </div>
        </div>

        <div class="in-line">
          <div class="name">Available to Borrow</div>
          <div class="value">
            <img class="icon coinIcon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>
            <strong>{{ dealNumLess(dataObj.available_borrow) }}</strong>
          </div>
        </div>

        <div class="in-line available-time">
          <div class="name">Est. Available Loan Time</div>
          <div class="value">
            <div class="time-box">
              <div class="time-item">{{ countdown.days }}d</div>
              <div class="time-item">{{ countdown.hours }}h</div>
              <div class="time-item">{{ countdown.minutes }}m</div>
              <div class="time-item">{{ countdown.secs }}s</div>
            </div>
          </div>
        </div>
        <div class="in-line healthy-box">
          <div class="name">
            Healthy Factor
            <Tooltip placement="top">
              <template #title>
                <span>NFTs will be liquidated When the liquidation factor is below 1</span>
              </template>
              <img src="../../../assets/images/tip_icon.webp" alt="" class="tip-icon"/>
            </Tooltip>
          </div>
          <div class="value">
            <div class="progress-box">
              <div class="progress-content">
                <div class="progress-part1"></div>
                <div class="progress-part2"></div>
                <div class="progress-part3"></div>
              </div>
              <div class="progress-cycle" :class="{ health: dataObj.health_index > 1.2 }"
                   :style="'left:' + (dataObj.health_index / 3) * 100 + '%'">
                <strong>{{ dataObj.health_index }}</strong>
              </div>
              <div class="progress-line1"></div>
              <div class="progress-line2"></div>
            </div>
          </div>
        </div>

      </div>
      <div class="btn-box">
        <template v-if="dataObj.in_auction">
          <button
              class="primary-btn-sha"
              v-if="dataObj.show_repay"
              @click="
                            isShowRepay = true;
                            $refs.repayDialog.getData();
                        "
          >
            Borrower Repay
          </button>
          <button class="primary-btn-sha" @click="handleOperate">In Auction</button>

        </template>
        <template v-else>

          <div class="list-tip-box" v-if="dataObj.list_price > 0">
            <div class="list-tip">
              <div class="name">Listing Price</div>
              <div class="value">
                <img class="icon coinIcon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>
                <strong>{{ dealNum(dataObj.list_price) }}</strong>
              </div>
            </div>
          </div>
          <button class="primary-btn-sha" @click="showDialog(1)" v-show="dataObj.list_price <= 0">Bill</button>
          <button class="primary-btn-sha" @click="showSell = true" v-show="dataObj.list_price <= 0">Sell</button>
          <a-button class="primary-btn-sha" @click="handleCancel" v-show="dataObj.list_price > 0">Cancel</a-button>
          <div class="red-tip" v-if="dataObj.list_price > 0 && BigNumber(dataObj.list_price).lt(debt)">Failed Listing
            due to lower List price than debt.
          </div>
        </template>
      </div>
    </div>
<!--    <div v-show="listActive==1" class="position-item">-->
<!--      <div class="logo-box" @click="showNFTs">-->
<!--        <div class="square">-->
<!--          <img :src="dataObj.nft.image" alt="" class="logo"/>-->
<!--        </div>-->
<!--        <div class="name">-->
<!--          <span>{{ dataObj.nft.type }}</span>-->
<!--          <span>{{ dataObj.nft.count }} </span>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="position-info">-->
<!--        <div class="in-line">-->
<!--          <div class="name">Loan ID</div>-->
<!--          <div class="value">-->
<!--            <strong>#{{ dataObj.bundle_id }}</strong>-->
<!--          </div>-->
<!--        </div>-->

<!--        <div class="in-line">-->
<!--          <div class="name">Floor Price</div>-->
<!--          <div class="value">-->
<!--            <img class="icon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>-->
<!--            <strong>{{ dealNum(dataObj.staked_value) }}</strong>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="in-line">-->
<!--          <div class="name boost-box">-->
<!--            Loan to Value-->
<!--            <div class="boost-btn" @click="$router.push('/governance/staking')" v-if="!dataObj.is_tbc_staking">Boost-->
<!--              Credit-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="value loan-box">-->
<!--            <strong class="rate">{{-->
<!--                showNum(borrowRate)-->
<!--              }}%</strong>-->


<!--            &lt;!&ndash;            <span class="incr" v-if="tbcStaking.status && tbcStaking.incr>0"&ndash;&gt;-->
<!--            &lt;!&ndash;                  style="margin-right: 10px"> + {{ dealNum(tbcStaking.incr * 100) }}%</span>&ndash;&gt;-->
<!--            <img class="icon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>-->
<!--            <span> {{ dealNum(dataObj.staked_value * borrowRate) }}</span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="in-line">-->
<!--          <div class="name">Total Borrowed / Repaid</div>-->
<!--          <div class="value">-->
<!--            <img class="icon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>-->
<!--            <strong>{{ dealNum(dataObj.total_borrowed) }}</strong> /-->
<!--            <strong>{{ dealNum(dataObj.total_repaid) }}</strong>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class="position-info info2">-->
<!--        <div class="in-line">-->
<!--          <div class="name">Debt</div>-->
<!--          <div class="value">-->
<!--            <img class="icon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>-->
<!--            <strong>{{ dealNum(debt) }}</strong>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="in-line">-->
<!--          <div class="name">Available to Borrow</div>-->
<!--          <div class="value">-->
<!--            <img class="icon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>-->
<!--            <strong>{{ dealNumLess(dataObj.available_borrow) }}</strong>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="in-line healthy-box">-->
<!--          <div class="name">-->
<!--            Healthy Factor-->
<!--            <Tooltip placement="top">-->
<!--              <template #title>-->
<!--                <span>NFTs will be liquidated When the liquidation factor is below 1</span>-->
<!--              </template>-->
<!--              <img src="../../../assets/images/tip_icon.webp" alt="" class="tip-icon"/>-->
<!--            </Tooltip>-->
<!--          </div>-->
<!--          <div class="value">-->
<!--            <div class="progress-box">-->
<!--              <div class="progress-content">-->
<!--                <div class="progress-part1"></div>-->
<!--                <div class="progress-part2"></div>-->
<!--                <div class="progress-part3"></div>-->
<!--              </div>-->
<!--              <div class="progress-cycle" :class="{ health: dataObj.health_index > 1.2 }"-->
<!--                   :style="'left:' + (dataObj.health_index / 3) * 100 + '%'">-->
<!--                <strong>{{ dataObj.health_index }}</strong>-->
<!--              </div>-->
<!--              <div class="progress-line1"></div>-->
<!--              <div class="progress-line2"></div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

<!--        <div class="in-line available-time">-->
<!--          <div class="name">Est. Available Loan Time</div>-->
<!--          <div class="value">-->
<!--            <div class="time-box">-->
<!--              <div class="time-item">{{ countdown.days }}d</div>-->
<!--              <div class="time-item">{{ countdown.hours }}h</div>-->
<!--              <div class="time-item">{{ countdown.minutes }}m</div>-->
<!--              <div class="time-item">{{ countdown.secs }}s</div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="btn-box" :class="{ 'auction-btn': dataObj.health_index < 1 || dataObj.list_price > 0 }">-->
<!--        <template v-if="dataObj.in_auction">-->
<!--          <button class="primary-btn-sha" @click="handleOperate">In Auction</button>-->
<!--          <button-->
<!--              class="primary-btn-sha"-->
<!--              v-if="dataObj.show_repay"-->
<!--              @click="-->
<!--                            isShowRepay = true;-->
<!--                            $refs.repayDialog.getData();-->
<!--                        "-->
<!--          >-->
<!--            Borrower Repay-->
<!--          </button>-->
<!--        </template>-->
<!--        <template v-else>-->
<!--          <button class="primary-btn-sha" @click="showDialog(1)" v-show="dataObj.list_price <= 0">Borrow</button>-->
<!--          <button class="primary-btn-sha" @click="showDialog(2)" v-show="dataObj.list_price <= 0">Repay</button>-->
<!--          <button class="primary-btn-sha" @click="showSell = true" v-show="dataObj.list_price <= 0">Sell</button>-->
<!--          <div class="list-tip-box" v-if="dataObj.list_price > 0">-->
<!--            <div class="list-tip">-->
<!--              <div class="name">Listing Price</div>-->
<!--              <div class="value">-->
<!--                <img class="icon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>-->
<!--                <strong>{{ dealNum(dataObj.list_price) }}</strong>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <a-button class="primary-btn-sha" :loading="isLoading" @click="handleCancel" v-show="dataObj.list_price > 0">-->
<!--            Cancel-->
<!--          </a-button>-->
<!--          <div class="red-tip" v-if="dataObj.list_price > 0 && BigNumber(dataObj.list_price).lt(debt)">Failed Listing-->
<!--            due to lower List price than debt.-->
<!--          </div>-->
<!--        </template>-->
<!--      </div>-->
<!--    </div>-->
    <div class="position-item-m">
      <div class="position-header">
        <div class="logo-box square">
          <img v-if="dataObj.nft.type=='Bundle'" class="logo" src="@/assets/images/bundle.png" alt="">
          <img v-else :src="dataObj.nft ? dataObj.nft.image : ''" alt="" class="logo"/>
        </div>
        <div class="right">
          <div class="name">
            <span>{{ dataObj.nft.type }}</span>
            <span>{{ dataObj.nft.count }} </span>
          </div>

          <div class="list-tip-box" v-if="dataObj.list_price > 0">
            <div class="list-tip">
              <div class="name">Listing Price</div>
              <div class="value">
                <img class="icon coinIcon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>
                <strong>{{ dealNum(dataObj.list_price) }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="position-info">
        <div class="in-line">
          <div class="name">Loan ID</div>
          <div class="value">
            <strong>#{{ dataObj.bundle_id }}</strong>
          </div>
        </div>
        <div class="in-line">
          <div class="name">Debt</div>
          <div class="value">
            <img class="icon coinIcon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>
            <strong>{{ dealNum(debt) }}</strong>
          </div>
        </div>
        <div class="in-line">
          <div class="name">Floor Price</div>
          <div class="value">
            <img class="icon coinIcon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>
            <strong>{{ dealNum(dataObj.staked_value) }}</strong>
          </div>
        </div>
        <div class="in-line">
          <div class="name boost-box">
            Loan to Value
            <div class="boost-btn" @click="$router.push('/governance/staking')" v-if="!dataObj.is_tbc_staking">
              Boost Credit
            </div>
          </div>
          <div class="value loan-box">
            <strong class="rate">{{
                showNum(borrowRate)
              }}%</strong>

            <!--            <span class="incr" v-if="tbcStaking.status && tbcStaking.incr>0"-->
            <!--                  style="margin-right: 10px"> + {{ dealNum(tbcStaking.incr * 100) }}%</span>-->
            <img class="icon coinIcon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>
            <strong> {{ dealNum(dataObj.staked_value * borrowRate) }}</strong>
          </div>
        </div>
        <div class="in-line">
          <div class="name">Total Borrowed / Repaid</div>
          <div class="value">
            <img class="icon coinIcon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>
            <strong>{{ dealNum(dataObj.total_borrowed) }}</strong> /
            <strong>{{ dealNum(dataObj.total_repaid) }}</strong>
          </div>
        </div>

        <div class="in-line">
          <div class="name">Available to Borrow</div>
          <div class="value">
            <img class="icon coinIcon" :src="require('@/assets' + dataObj.underlying.icon)" alt=""/>
            <strong>{{ dealNumLess(dataObj.available_borrow) }}</strong>
          </div>
        </div>

        <div class="in-line available-time">
          <div class="name">Est. Available Loan Time</div>
          <div class="value">
            <div class="time-box">
              <div class="time-item">{{ countdown.days }}d</div>
              <div class="time-item">{{ countdown.hours }}h</div>
              <div class="time-item">{{ countdown.minutes }}m</div>
              <div class="time-item">{{ countdown.secs }}s</div>
            </div>
          </div>
        </div>
        <div class="in-line healthy-box">
          <div class="name">
            Healthy Factor
            <Tooltip placement="top">
              <template #title>
                <span>NFTs will be liquidated When the liquidation factor is below 1</span>
              </template>
              <img src="../../../assets/images/tip_icon.webp" alt="" class="tip-icon"/>
            </Tooltip>
          </div>
          <div class="value">
            <div class="progress-box">
              <div class="progress-content">
                <div class="progress-part1"></div>
                <div class="progress-part2"></div>
                <div class="progress-part3"></div>
              </div>
              <div class="progress-cycle" :class="{ health: dataObj.health_index > 1.2 }"
                   :style="'left:' + (dataObj.health_index / 3) * 100 + '%'">
                <strong>{{ dataObj.health_index }}</strong>
              </div>
              <div class="progress-line1"></div>
              <div class="progress-line2"></div>
            </div>
          </div>
        </div>

      </div>
      <div class="btn-box">
        <template v-if="dataObj.in_auction">
          <button
              class="primary-btn-sha"
              v-if="dataObj.show_repay"
              @click="
                            isShowRepay = true;
                            $refs.repayDialog.getData();
                        "
          >
            Borrower Repay
          </button>
          <button class="primary-btn-sha" @click="handleOperate">In Auction</button>

        </template>
        <template v-else>
          <div class="list-tip-box">
            <div class="list-tip">
              <div class="name">
                Listing Price
              </div>
              <div class="value">
                <img class="icon coinIcon" :src="require('@/assets'+dataObj.underlying.icon)" alt="">
                <strong>{{ dealNum(dataObj.list_price) }}</strong>
              </div>

            </div>

          </div>
          <button class="primary-btn-sha" @click="showMDialog(1)" v-show="dataObj.list_price <= 0">Bid</button>
<!--          <button class="primary-btn-sha" @click="showMDialog(2)" v-show="dataObj.list_price <= 0">Repay</button>-->
          <button class="primary-btn-sha" @click="showMSell = true" v-show="dataObj.list_price <= 0">Sell</button>
          <a-button class="primary-btn-sha" @click="handleCancel" v-show="dataObj.list_price > 0">Cancel</a-button>
          <div class="red-tip" v-if="dataObj.list_price > 0 && BigNumber(dataObj.list_price).lt(debt)">Failed Listing
            due to lower List price than debt.
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {message, Tooltip} from "ant-design-vue";
import BorrowDialogContent from "./BorrowDialogContent";
import BorrowReplayDialog from "@/views/AuctionView/components/BorrowReplayDialog.vue";
import bigNumberUtil from "@/utils/bigNumberUtil";
import {Popup} from "vant";
import BundleNFTList from "@/views/AuctionView/components/BundleNFTList.vue";
import SellNFTDialogContent from "@/views/StakeView/components/SellNFTDialogContent.vue";
import {getTranStatus} from "@/api/common";
import BigNumber from "bignumber.js";
import BidDialogContent from "@/views/AuctionView/components/BidDialogContent.vue";

const calculator = new bigNumberUtil();
let countdownObj = null;
export default {
  name: "PositionItem",
  props: ["dataObj", "updateData", "nowTime", "availableLoanArr", "listActive"],
  components: {
    BidDialogContent,
    BundleNFTList,
    Tooltip,
    BorrowDialogContent,
    BorrowReplayDialog,
    Popup,
    SellNFTDialogContent,
  },
  data() {
    return {
      calculator,
      isShowBundle: false,
      showBottom:false,
      showBorrow: false,
      showmBorrow: false,
      showSell: false,
      showMSell: false,
      isShowRepay: false,
      isLoading: false,
      dealNum: calculator.dealNum,
      dealNumLess: calculator.dealNumLess,
      goneTime: 0,
      type: 1,
      showBid: false,
      showMBid: false,
      BigNumber,
    };
  },
  computed: {
    borrowRate() {
      if (!this.tbcStaking.status || this.tbcStaking.incr == 0) {
        return this.dataObj.max_borrow_rate * 100;
      } else {
        return calculator.add(this.dataObj.max_borrow_rate, this.tbcStaking.incr) * 100;
      }
    },
    tbcStaking() {
      return this.$store.state.app.tbcStaking;
    },
    debt() {
      return this.dataObj.borrow_sum;
    },
    countdown() {
      const diff = this.dataObj.available_time - this.goneTime;

      if (diff < 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          secs: 0,
        };
      }
      let seconds = Math.ceil(diff);
      let days = Math.floor(seconds / 86400);
      seconds = seconds % 86400;

      let hours = Math.floor(seconds / 3600);
      hours = hours < 10 ? "0" + hours : hours;
      seconds = seconds % 3600;

      let minutes = Math.floor(seconds / 60);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds % 60;

      let secs = seconds < 10 ? "0" + seconds : seconds;

      return {
        days,
        hours,
        minutes,
        secs,
      };
    },
  },
  beforeCreate() {
    countdownObj = setInterval(() => {
      this.goneTime++;
    }, 1000);
  },
  beforeUnmount() {
    clearInterval(countdownObj);
  },
  methods: {
    showNum(num) {
      let res = Number(Number(num) * 100).toFixed(0) / 100;
      return res.toLocaleString();
    },
    async dealRes(transactionHash) {
      let statusRes = await getTranStatus(transactionHash);
      if (statusRes.data.data == 1) {
        setTimeout(() => {
          this.isLoading = false;
          this.$emit("updateData");
          message.success("Transaction Success");
        }, 3000);
      } else {
        setTimeout(() => {
          this.dealRes(transactionHash);
        }, 3000);
      }
    },
    dealCatchErr(e) {
      this.isLoading = false;
      if (e.code === 4001) {
        message.error("User canceled  transaction");
        return;
      }
      if (e.message && e.message.indexOf("{") < 0) {
        message.error(e.message);
      } else {
        const err = JSON.parse(e.message.substr(e.message.indexOf("{"), e.message.length));
        if (err.originalError) {
          message.error(err.originalError.message);
        } else {
          message.error(e.message.substr(0, e.message.indexOf("{")));
        }
      }
    },
    handleCancel() {

      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      this.$store
          .dispatch("stakingProof/cancelList", {
            _tokenId: this.dataObj.bundle_id,
          })
          .then((res) => {
            this.dealRes(res.transactionHash);
          })
          .catch((e) => {
            this.dealCatchErr(e);
          });
    },
    showNFTs() {
      this.isShowBundle = true;
    },
    openMBorrowDialog(type) {
      this.showmBorrow = true;
      this.$nextTick(() => {
        this.$refs["MBorrowDialog"].activeIndex = type;
      });
    },
    showMDialog(type) {
      this.showmBorrow = true;
      this.$nextTick(() => {
        this.$refs["borrowDialog"].activeIndex = type;
      });
    },
    showDialog(type) {
      this.showBorrow = true;
      this.$nextTick(() => {
        this.$refs["borrowDialog"].activeIndex = type;
      });
    },
    handleOperate() {
      this.$router.push("/auction/inauction?is_my_nft=true");
      document.documentElement.scrollTop = document.body.scrollTop = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.position-item {
  display: flex;
  background: #ffffff;
  box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  border: 1px solid #e2e2e2;
  padding: 20px;
  justify-content: space-between;
  margin-bottom: 10px;
  width: var(--content-width);

  .healthy-box {
    .value {
      margin-top: -15px;
    }
  }

  .logo-box {
    cursor: pointer;

    .square {
      overflow: hidden;
      border-radius: 12px;
    }

    .logo {
      width: 120px;
      border-radius: 12px;
      height: 120px;
      transition: 0.3s;

      &:hover {
        transform: scale(1.3);
      }
    }

    .name {
      margin-top: 5px;
      font-size: 16px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #333333;
      line-height: 30px;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }

  .position-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 0;

    &.info2 {
      .in-line {
        .name {
          width: 170px;
        }
      }

    }

    .tip-icon {

      margin-left: 5px;
    }

    .in-line {
      display: flex;
      width: 280px;
      justify-content: flex-start;
      align-items: center;


      .name {
        width: 200px;
        font-size: 12px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #999999;
        white-space: nowrap;
      }

      .boost-box {
        display: flex;

        .boost-btn {
          color: #ffbd01;
          position: relative;
          cursor: pointer;
          margin-left: 7px;

          &:after {
            content: "";
            bottom: 2px;
            left: 0;
            height: 1px;
            width: 100%;
            background: #ffbd01;
            position: absolute;
          }
        }
      }

      .value {
        width: 80px;
      }

      .loan-box {
        font-weight: 900;
        position: relative;

        .rate {
          position: absolute;
          left: -40px;
          color: #999999;
        }
      }

      .value {
        font-size: 12px;
        white-space: nowrap;

        .icon {
          width: 15px;
          height: 15px;
          margin-right: 10px;
        }
      }
    }

    .available-time {
      font-weight: bold;
      white-space: nowrap;

      strong {
        color: #ffbd01;
        margin-right: 3px;
      }
    }
  }

  .list-tip-box {
    text-align: center;

    .list-tip {
      .name {
        font-size: 12px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #999999;
      }

      .value {
        font-size: 12px;
        margin: 6px 0;

        span {
          margin-left: 10px;
        }

        .icon {
          width: 15px;
          height: 15px;
          margin-right: 10px;
        }
      }
    }
  }

  .red-tip {
    color: #ee7373;
    font-size: 12px;
    line-height: 16px;
    margin: 10px 0;
    max-width: 140px;
    text-align: center;
  }

  .btn-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;

    .list-tip-box {
      text-align: center;
      width: 100%;
      padding-bottom: 10px;

      .list-tip {
        .name {
          font-size: 12px;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #999999;
        }

        .value {
          font-size: 12px;
          margin: 6px 0;

          span {
            margin-left: 10px;
          }

          .icon {
            width: 15px;
            height: 15px;
            margin-right: 10px;
          }
        }
      }
    }

    &.auction-btn {
      justify-content: center;

      .primary-btn-sha:first-child {
        margin-bottom: 30px;
      }

      .primary-btn-sha:last-child {
        margin-bottom: 0px;
      }
    }

    .primary-btn-sha {
      font-family: RussoOneRegular, Russo One;
      width: 8vw;
      height: 38px;
      font-size: 12px;
      line-height: 14px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.position-item-m {
  display: none;
}

@media screen and (max-width: 1000px) {
  .position-item {
    display: none;
  }
  .position-item-m {
    margin-top: 10px;
    background: #ffffff;
    box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.05);
    border-radius: 20px 20px 20px 20px;
    border: 1px solid #e2e2e2;
    padding: 20px;
    display: block;


    .btn-box {
      width: 100%;
      display: flex;
      justify-content: center;

      .primary-btn-sha {
        margin-left: 5vw;
        padding: 0 7vw;
        height: 5vh;
        max-height: 100px;
        font-size: 12px;
        font-family: RussoOneRegular, Russo One;

        &:first-child {
          margin-left: 0;
        }
      }
    }

    .position-header {
      padding-bottom: 3vh;
      display: flex;
      border-bottom: 1px solid #e2e2e2;

      .logo-box {
        .logo {
          width: 30vw;
          height: 30vw;
          border-radius: 5px;
        }
      }

      .right {
        padding-left: 3vw;
        flex: 1;
      }

      .name {
        margin-top: 20px;
        font-size: 20px;
        font-family: Roboto-Black, Roboto;
        font-weight: 900;
        color: #333333;
      }
    }

    .position-info {
      margin: 3vh 0 0 0;

      .loan-box {
        .rate {
          margin-right: 10px;
        }
      }

      &.info2 {
        .in-line {
          idth: 300px;
        }

        .value {
          margin-left: 2vw;
        }
      }

      .tip-icon {

        margin-left: 5px;
      }

      .in-line {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        width: 100%;

        .name {
          font-size: 12px;
          width: 50%;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #999999;
        }
        .loan-box {
          position: relative;

          .rate {
            position: absolute;
            left: -30px;
            opacity: 0.5;
          }
        }
        .value {
          font-size: 12px;
          min-width: 120px;
          span {
            margin-left: 10px;
          }

          .icon {
            width: 20px;
            height: 20px;
            margin-right: 8px;
          }
        }
      }

      .healthy-box {
        padding-bottom: 30px;
      }

      .available-time {
        font-weight: bold;

        strong {
          color: #ffbd01;
          margin-right: 3px;
        }
      }
    }
  }
}

@media screen and (min-width: 1920px) {
  .position-item {
    .btn-box {
      .primary-btn-sha {
        font-size: 14px;
        height: 42px;
      }

      .list-tip-box {
        .list-tip {
          .name {
            font-size: 14px;
          }

          .value {
            font-size: 14px;

            .icon {
              width: 20px;
              height: 20px;
              margin-right: 10px;
            }
          }

        }
      }
    }

    .position-info {
      .in-line {
        width: 300px;

        .name {
          width: 220px;
          font-size: 14px;
        }

        .value {
          font-size: 14px;

          .icon {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }
        }
      }
    }
  }

}
</style>
