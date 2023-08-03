<template>
  <div class="AuctionItem" :class="{'menu-list-item':listActive==2}">
    <BundleNFTList :dataObj="nftObj" @closeDialog="isShowBundle = false" v-if="isShowBundle"/>
    <BorrowReplayDialog :bundle_id="nftObj.bundle_id" ref="repayDialog" @closeDialog="isShowRepay = false"
                        v-show="isShowRepay"/>
    <BidHistory :nftObj="nftObj" v-show="isShowBidHistory" ref="bidHistory" @closeDialog="isShowBidHistory = false"/>
    <EmailSignDialog v-show="showSign" @closeDialog="showSign=false" @updateData="handleEmailUpdate"/>

    <div class="list-list-item" v-show="listActive==1" :class="{'active':showBottom}">
      <div class="main-content">
        <div class="logo-box" @click="showNFTs">
          <div class="square">
            <img v-if="nftObj.nft.type=='Bundle'" class="logo" src="@/assets/images/bundle.png" alt="">
            <img v-else :src="nftObj.nft ? nftObj.nft.image : ''" alt="" class="logo"/>

          </div>
          <div class="name" v-if="nftObj.nft">
            <span>{{ nftObj.nft.type }}</span>
            <span>{{ nftObj.nft.count }} </span>
          </div>
        </div>
        <div class="position-info-box">
          <template v-if="isAction">

            <div class="position-info">
              <div class="in-line">
                <div class="name">Loan ID</div>
                <div class="value">
                  <strong>#{{ nftObj.bundle_id }}</strong>
                </div>
              </div>
              <div class="in-line">
                <div class="name">Debt</div>
                <div class="value">
                  <img v-if="nftObj.underlying" class="icon coinIcon"
                       :src="require('@/assets' + nftObj.underlying.icon)" alt=""/>
                  <strong>{{ dealNum(nftObj.loan) }}</strong>
                </div>
              </div>


              <div class="in-line" :class="{ btnPointer: nftObj.auction_id != null }">
                <div class="name" v-if="nftObj.bid_price > 0" @click="showBidHistory">Latest Bid(history)</div>
                <div class="name" v-else>Starting price</div>
                <div class="value">
                  <img v-if="nftObj.underlying" class="icon coinIcon"
                       :src="require('@/assets' + nftObj.underlying.icon)" alt=""/>
                  <strong v-if="nftObj.bid_price > 0">{{ showNumAuto(nftObj.bid_price) }}</strong>
                  <strong v-else>{{ showNumAuto(nftObj.init_bid_price) }}</strong>
                </div>
              </div>
              <div class="in-line">
                <div class="name">My Bid</div>
                <div class="value">
                  <img v-if="nftObj.underlying" class="icon coinIcon"
                       :src="require('@/assets' + nftObj.underlying.icon)" alt=""/>
                  <strong>{{ nftObj.my_bid_price ? showNumAuto(nftObj.my_bid_price) : "-- --" }}</strong>
                </div>
              </div>
              <div class="in-line available-time">
                <template v-if="nftObj.status == 0">
                  <template v-if="nftObj.bidder == account && now > nftObj.end_time">
                    <div class="name">Payment Countdown</div>
                    <div class="value">
                      <div class="time-box">
                        <div class="time-item">{{ paymentCountdown.hours }}h</div>
                        <div class="time-item">{{ paymentCountdown.minutes }}m</div>
                        <div class="time-item">{{ paymentCountdown.secs }}s</div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="now > nftObj.end_time">
                    <div class="name">Auction Status</div>
                    <div class="value">{{ ["", "Ended", "Redeem", "Unsold"][nftObj.status] }}</div>
                  </template>
                  <template v-else>
                    <div class="name">Auction Countdown</div>
                    <div class="value">
                      <div class="time-box">
                        <div class="time-item">{{ countdown.hours }}h</div>
                        <div class="time-item">{{ countdown.minutes }}m</div>
                        <div class="time-item">{{ countdown.secs }}s</div>
                      </div>
                    </div>
                  </template>
                </template>
                <template v-else>
                  <div class="name">Auction Status</div>
                  <div class="value">{{ ["", "Ended", "Redeem", "Unsold"][nftObj.status] }}</div>
                </template>
              </div>
            </div>
            <img class="down-icon" :class="{'active':showBottom}" src="../../../assets/svg/down_l.svg" alt=""
                 @click="showBottom=!showBottom">
            <div v-show="showBottom" class="bottom-content" style="bottom: -130px">
              <div class="position-info">
                <div class="in-line">
                  <div class="name">Floor Price</div>
                  <div class="value">
                    <img v-if="nftObj.underlying" class="icon coinIcon"
                         :src="require('@/assets' + nftObj.underlying.icon)" alt=""/>
                    <strong>{{ dealNum(nftObj.stake_value) }}</strong>
                  </div>
                </div>
                <div class="in-line">
                  <div class="name">Total Borrowed / Repaid</div>
                  <div class="value">
                    <img class="icon coinIcon" :src="require('@/assets' + nftObj.underlying.icon)" alt=""/>
                    <strong>{{ dealNum(nftObj.total_borrowed) }}</strong> /
                    <strong>{{ dealNum(nftObj.total_repaid) }}</strong>
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
                      <div class="progress-cycle"
                           :class="{ health: nftObj.health_index > 1.2, red: nftObj.health_index < 1 }"
                           :style="'left:' + (nftObj.health_index / 3) * 100 + '%'">
                        <strong>{{ nftObj.health_index }}</strong>
                      </div>
                      <div class="progress-line1"></div>
                      <div class="progress-line2"></div>
                    </div>
                  </div>
                </div>
                <div class="in-line" style="visibility: hidden">1</div>

              </div>
            </div>
          </template>
          <template v-else>
            <div class="position-info">
              <div class="in-line">
                <div class="name">Loan ID</div>
                <div class="value">
                  <strong>#{{ nftObj.bundle_id }}</strong>
                </div>
              </div>
              <div class="in-line">
                <div class="name">Debt</div>
                <div class="value">
                  <img v-if="nftObj.underlying" class="icon coinIcon"
                       :src="require('@/assets' + nftObj.underlying.icon)" alt=""/>
                  <strong>{{ dealNum(nftObj.loan) }}</strong>
                </div>
              </div>
              <div class="in-line">
                <div class="name">Floor Price</div>
                <div class="value">
                  <img v-if="nftObj.underlying" class="icon coinIcon"
                       :src="require('@/assets' + nftObj.underlying.icon)" alt=""/>
                  <strong>{{ dealNum(nftObj.stake_value) }}</strong>
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
                    <div class="progress-cycle"
                         :class="{ health: nftObj.health_index > 1.2, red: nftObj.health_index < 1 }"
                         :style="'left:' + (nftObj.health_index / 3) * 100 + '%'">
                      <strong>{{ nftObj.health_index }}</strong>
                    </div>
                    <div class="progress-line1"></div>
                    <div class="progress-line2"></div>
                  </div>
                </div>
              </div>

            </div>
          </template>
        </div>
        <div class="btn-box">
          <!--          {{JSON.stringify({-->
          <!--          status:nftObj.status,-->
          <!--          end_time:nftObj.end_time,-->
          <!--          bidder:nftObj.bidder,-->
          <!--        })}}-->
          <template v-if="isAction">
            <!-- auctioning -->
            <template v-if="nftObj.status == 0">
              <!-- pay the balance -->
              <template v-if="nftObj.bidder == account && now > nftObj.end_time">
                <div class="list-tip-box">
                  <div class="list-tip">
                    <div class="name">Amount</div>
                    <div class="value">
                      <img v-if="nftObj.underlying" class="icon coinIcon"
                           :src="require('@/assets' + nftObj.underlying.icon)"
                           alt=""/>
                      <strong> {{ dealNum(BigNumber(nftObj.bid_price).minus(nftObj.my_margin).toFixed(6)) }} </strong>
                    </div>
                  </div>
                </div>
                <a-button class="primary-btn-sha" @click="payment"
                          :loading="isLoading"
                          v-if="now < nftObj.end_time + parseInt(extra.BID_WAIT_TIME)">Pay the Balance
                </a-button>
              </template>
              <!-- bid -->
              <button v-else-if="now < nftObj.end_time" class="primary-btn-sha" @click="handleShowBid">Bid</button>
            </template>
            <!-- Other -->
            <template v-else>
              <!-- withdraw margin with fine -->
              <div class="list-tip-box" v-if="nftObj.status == 2 && nftObj.bidder == account && nftObj.my_margin > 0">
                <div class="list-tip">
                  <div class="name">
                    Amount
                    <Tooltip placement="top" v-if="nftObj.fine > 0">
                      <template #title>
                                        <span>
                                            The Owner has redeemed the NFT in full and the platform will return your Margin with additional rewards
                                            <img v-if="nftObj.underlying" style="width: 15px; height: 15px"
                                                 :src="require('@/assets' + nftObj.underlying.icon)" alt=""/>
                                            {{ dealNum(nftObj.fine) }}.
                                        </span>
                      </template>
                      <img src="../../../assets/images/tip_icon.webp" alt="" class="tip-icon"/>
                    </Tooltip>
                  </div>
                  <div class="value">
                    <img v-if="nftObj.underlying" class="icon coinIcon"
                         :src="require('@/assets' + nftObj.underlying.icon)" alt=""/>
                    <strong>{{ dealNum(BigNumber(nftObj.my_margin).plus(nftObj.fine).toFixed(6)) }}</strong>
                  </div>
                </div>
                <a-button class="primary-btn-sha" :loading="isLoading" @click="withdrawMargin">Withdraw Margin
                </a-button>
              </div>
              <!-- withdraw margin -->
              <div class="list-tip-box" v-else-if="nftObj.my_margin > 0">
                <div class="list-tip">
                  <div class="name">Amount</div>
                  <div class="value">
                    <img v-if="nftObj.underlying" class="icon coinIcon"
                         :src="require('@/assets' + nftObj.underlying.icon)" alt=""/>
                    <strong>{{ dealNum(nftObj.my_margin) }}</strong>
                  </div>
                </div>
                <a-button class="primary-btn-sha" @click="withdrawMargin" :loading="isLoading">Withdraw Margin
                </a-button>
              </div>
            </template>
            <button
                class="primary-btn-sha"
                @click="
                        isShowRepay = true;
                        $refs.repayDialog.getData();
                    "
                v-if="showRepayBtn"
            >
              Borrower Repay
            </button>

            <!-- placeholder -->
            <div class="primary-btn-sha" style="visibility: hidden; height: 0"></div>
          </template>
          <template v-else>
            <a-button class="primary-btn-sha" :loading="isLoading" @click="notifyMe" v-if="!nftObj.is_subscribed">
              Subscribe
            </a-button>
            <a-button class="primary-btn-sha" :loading="isLoading" @click="unNotifyMe" v-if="nftObj.is_subscribed">
              Unsubscribe
            </a-button>
          </template>
        </div>

      </div>
      <div class="bottom-temp" v-if="showBottom"></div>
    </div>
    <div v-show="listActive==2">
      <div class="position-header">
        <div class="logo-box">
          <img v-if="nftObj.nft.type=='Bundle'" class="logo" src="@/assets/images/bundle.png" alt="">
          <img v-else :src="nftObj.nft ? nftObj.nft.image : ''" alt="" class="logo"/>
        </div>
        <div class="right">
          <div class="name">
            <span>{{ nftObj.nft.type }}</span>
            <span>{{ nftObj.nft.count }} </span>
          </div>
        </div>
      </div>
      <div class="position-info">
        <template v-if="isAction">
          <div class="in-line">
            <div class="name">Loan ID</div>
            <div class="value">
              <strong>#{{ nftObj.bundle_id }}</strong>
            </div>
          </div>

          <div class="in-line">
            <div class="name">Debt</div>
            <div class="value">
              <img v-if="nftObj.underlying" class="icon coinIcon" :src="require('@/assets' + nftObj.underlying.icon)"
                   alt=""/>
              <strong>{{ dealNum(nftObj.loan) }}</strong>
            </div>
          </div>
          <div class="in-line history">
            <div class="name" v-if="nftObj.bid_price > 0" @click="showBidHistory">Latest Bid(history)</div>
            <div class="name" v-else>Starting price</div>
            <div class="value">
              <img v-if="nftObj.underlying" class="icon coinIcon" :src="require('@/assets' + nftObj.underlying.icon)"
                   alt=""/>
              <strong v-if="nftObj.bid_price > 0">{{ showNumAuto(nftObj.bid_price) }}</strong>
              <strong v-else>{{ showNumAuto(nftObj.init_bid_price) }}</strong>
            </div>
          </div>
          <div class="in-line">
            <div class="name">My Bid</div>
            <div class="value">
              <img v-if="nftObj.underlying" class="icon coinIcon" :src="require('@/assets' + nftObj.underlying.icon)"
                   alt=""/>

              <strong>{{ nftObj.my_bid_price ? showNumAuto(nftObj.my_bid_price) : "-- --" }}</strong>
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
                <div class="progress-cycle" :class="{ health: nftObj.health_index > 1.2, red: nftObj.health_index < 1 }"
                     :style="'left:' + (nftObj.health_index / 3) * 100 + '%'">
                  <strong>{{ nftObj.health_index }}</strong>
                </div>
                <div class="progress-line1"></div>
                <div class="progress-line2"></div>
              </div>
            </div>
          </div>

          <div class="in-line">
            <div class="name">Floor Price</div>
            <div class="value">
              <img v-if="nftObj.underlying" class="icon coinIcon" :src="require('@/assets' + nftObj.underlying.icon)"
                   alt=""/>
              <strong>{{ dealNum(nftObj.stake_value) }}</strong>
            </div>
          </div>
          <div class="in-line">
            <div class="name">Total Borrowed / Repaid</div>
            <div class="value">
              <img class="icon coinIcon" :src="require('@/assets' + nftObj.underlying.icon)" alt=""/>
              <strong>{{ dealNum(nftObj.total_borrowed) }}</strong> /
              <strong>{{ dealNum(nftObj.total_repaid) }}</strong>
            </div>
          </div>
          <div class="in-line available-time">
            <template v-if="nftObj.status == 0">
              <div class="name">Auction Countdown</div>
              <div class="time-box">
                <div class="time-item">{{ countdown.hours }}h</div>
                <div class="time-item">{{ countdown.minutes }}m</div>
                <div class="time-item">{{ countdown.secs }}s</div>
              </div>
            </template>
            <template v-else>
              <div class="name">Auction Status</div>
              <div class="value">{{ ["", "Ended", "Redeem", "Unsold"][nftObj.status] }}</div>
            </template>
          </div>
        </template>
        <template v-else>
          <div class="position-info">
            <div class="in-line">
              <div class="name">Loan ID</div>
              <div class="value">
                <strong>#{{ nftObj.bundle_id }}</strong>
              </div>
            </div>
            <div class="in-line">
              <div class="name">Debt</div>
              <div class="value">
                <img v-if="nftObj.underlying" class="icon coinIcon" :src="require('@/assets' + nftObj.underlying.icon)"
                     alt=""/>
                <strong>{{ dealNum(nftObj.loan) }}</strong>
              </div>
            </div>
            <div class="in-line">
              <div class="name">Floor Price</div>
              <div class="value">
                <img v-if="nftObj.underlying" class="icon coinIcon" :src="require('@/assets' + nftObj.underlying.icon)"
                     alt=""/>
                <strong>{{ dealNum(nftObj.stake_value) }}</strong>
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
                  <div class="progress-cycle"
                       :class="{ health: nftObj.health_index > 1.2, red: nftObj.health_index < 1 }"
                       :style="'left:' + (nftObj.health_index / 3) * 100 + '%'">
                    <strong>{{ nftObj.health_index }}</strong>
                  </div>
                  <div class="progress-line1"></div>
                  <div class="progress-line2"></div>
                </div>
              </div>
            </div>

          </div>
        </template>
      </div>
      <div class="btn-box" v-if="isAction">
        <!-- auctioning -->
        <template v-if="nftObj.status == 0">
          <!-- pay the balance -->
          <template v-if="nftObj.bidder == account && now > nftObj.end_time">
            <div class="list-tip-box">
              <div class="list-tip">
                <div class="name">Amount</div>
                <div class="value">
                  <img v-if="nftObj.underlying" class="icon coinIcon"
                       :src="require('@/assets' + nftObj.underlying.icon)"
                       alt=""/>
                  <strong> {{ dealNum(BigNumber(nftObj.bid_price).minus(nftObj.my_margin).toFixed(6)) }} </strong>
                </div>
              </div>
            </div>
            <a-button class="primary-btn-sha" @click="payment"
                      :loading="isLoading"
                      v-if="now < nftObj.end_time + parseInt(extra.BID_WAIT_TIME)">Pay the Balance
            </a-button>
          </template>
          <!-- bid -->
          <button v-else-if="now < nftObj.end_time" class="primary-btn-sha" @click="handleShowBid">Bid</button>
        </template>
        <!-- Other -->
        <template v-else>
          <!-- withdraw margin with fine -->
          <div class="list-tip-box" v-if="nftObj.status == 2 && nftObj.bidder == account && nftObj.my_margin > 0">
            <div class="list-tip">
              <div class="name">
                Amount
                <Tooltip placement="top" v-if="nftObj.fine > 0">
                  <template #title>
                                        <span>
                                            The Owner has redeemed the NFT in full and the platform will return your Margin with additional rewards
                                            <img v-if="nftObj.underlying" style="width: 15px; height: 15px"
                                                 :src="require('@/assets' + nftObj.underlying.icon)" alt=""/>
                                            {{ dealNum(nftObj.fine) }}.
                                        </span>
                  </template>
                  <img src="../../../assets/images/tip_icon.webp" alt="" class="tip-icon"/>
                </Tooltip>
              </div>
              <div class="value">
                <img v-if="nftObj.underlying" class="icon coinIcon" :src="require('@/assets' + nftObj.underlying.icon)"
                     alt=""/>
                <strong>{{ dealNum(BigNumber(nftObj.my_margin).plus(nftObj.fine).toFixed(6)) }}</strong>
              </div>
            </div>
            <a-button class="primary-btn-sha" :loading="isLoading" @click="withdrawMargin">Withdraw Margin
            </a-button>
          </div>
          <!-- withdraw margin -->
          <div class="list-tip-box" v-else-if="nftObj.my_margin > 0">
            <div class="list-tip">
              <div class="name">Amount</div>
              <div class="value">
                <img v-if="nftObj.underlying" class="icon coinIcon" :src="require('@/assets' + nftObj.underlying.icon)"
                     alt=""/>
                <strong>{{ dealNum(nftObj.my_margin) }}</strong>
              </div>
            </div>
            <a-button class="primary-btn-sha" @click="withdrawMargin" :loading="isLoading">Withdraw Margin
            </a-button>
          </div>
        </template>
        <button
            class="primary-btn-sha"
            @click="
                        isShowRepay = true;
                        $refs.repayDialog.getData();
                    "
            v-if="showRepayBtn"
        >
          Borrower Repay
        </button>

        <!-- placeholder -->
      </div>
      <div class="btn-box" v-else>
        <a-button class="primary-btn-sha" :loading="isLoading" @click="notifyMe" v-if="!nftObj.is_subscribed">
          Subscribe
        </a-button>
        <a-button class="primary-btn-sha" :loading="isLoading" @click="unNotifyMe" v-if="nftObj.is_subscribed">
          Unsubscribe
        </a-button>
      </div>
    </div>
    <div class="position-item-m">
      <div class="position-header">
        <div class="logo-box">
          <img :src="nftObj.nft ? nftObj.nft.image : ''" alt="" class="logo"/>
        </div>
        <div class="right">
          <div class="name">
            <span>{{ nftObj.nft.type }}</span>
            <span>{{ nftObj.nft.count }} </span>
          </div>

        </div>
      </div>
      <div class="position-info">
        <div class="in-line">
          <div class="name">Loan ID</div>
          <div class="value">
            <strong>#{{ nftObj.bundle_id }}</strong>
          </div>
        </div>
        <div class="in-line">
          <div class="name">Floor Price</div>
          <div class="value">
            <img v-if="nftObj.underlying" class="icon coinIcon" :src="require('@/assets' + nftObj.underlying.icon)"
                 alt=""/>
            <strong>{{ dealNum(nftObj.stake_value) }}</strong>
          </div>
        </div>
        <div class="in-line">
          <div class="name">Debt</div>
          <div class="value">
            <img v-if="nftObj.underlying" class="icon coinIcon" :src="require('@/assets' + nftObj.underlying.icon)"
                 alt=""/>

            <strong>{{ dealNum(nftObj.loan) }}</strong>
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
              <div class="progress-cycle" :class="{ health: nftObj.health_index > 1.2, red: nftObj.health_index < 1 }"
                   :style="'left:' + (nftObj.health_index / 3) * 100 + '%'">
                <strong>{{ nftObj.health_index }}</strong>
              </div>
              <div class="progress-line1"></div>
              <div class="progress-line2"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="position-info info2">
        <template v-if="isAction">
          <div class="in-line history">
            <div class="name" v-if="nftObj.bid_price > 0" @click="showBidHistory">Latest Bid(history)</div>
            <div class="name" v-else>Starting price</div>
            <div class="value">
              <img v-if="nftObj.underlying" class="icon coinIcon" :src="require('@/assets' + nftObj.underlying.icon)"
                   alt=""/>
              <strong v-if="nftObj.bid_price > 0">{{ showNumAuto(nftObj.bid_price) }}</strong>
              <strong v-else>{{ showNumAuto(nftObj.init_bid_price) }}</strong>
            </div>
          </div>
          <div class="in-line">
            <div class="name">My Bid</div>
            <div class="value">
              <img v-if="nftObj.underlying" class="icon coinIcon" :src="require('@/assets' + nftObj.underlying.icon)"
                   alt=""/>

              <strong>{{ nftObj.my_bid_price ? showNumAuto(nftObj.my_bid_price) : "-- --" }}</strong>
            </div>
          </div>
          <div class="in-line available-time">
            <template v-if="nftObj.status == 0">
              <div class="name">Auction Countdown</div>
              <div class="time-box">
                <div class="time-item">{{ countdown.hours }}h</div>
                <div class="time-item">{{ countdown.minutes }}m</div>
                <div class="time-item">{{ countdown.secs }}s</div>
              </div>
            </template>
            <template v-else>
              <div class="name">Auction Status</div>
              <div class="value">{{ ["", "Ended", "Redeem", "Unsold"][nftObj.status] }}</div>
            </template>
          </div>
        </template>
      </div>
      <div class="btn-box" v-if="isAction">
        <!-- auctioning -->
        <template v-if="nftObj.status == 0">
          <!-- pay the balance -->
          <template v-if="nftObj.bidder == account && now > nftObj.end_time">
            <div class="list-tip-box">
              <div class="list-tip">
                <div class="name">Amount</div>
                <div class="value">
                  <img v-if="nftObj.underlying" class="icon coinIcon"
                       :src="require('@/assets' + nftObj.underlying.icon)"
                       alt=""/>
                  <strong> {{ dealNum(BigNumber(nftObj.bid_price).minus(nftObj.my_margin).toFixed(6)) }} </strong>
                </div>
              </div>
            </div>
            <a-button class="primary-btn-sha" @click="payment"
                      :loading="isLoading"
                      v-if="now < nftObj.end_time + parseInt(extra.BID_WAIT_TIME)">Pay the Balance
            </a-button>
          </template>
          <!-- bid -->
          <button v-else-if="now < nftObj.end_time" class="primary-btn-sha" @click="handleShowBid">Bid</button>
        </template>
        <!-- Other -->
        <template v-else>
          <!-- withdraw margin with fine -->
          <div class="list-tip-box" v-if="nftObj.status == 2 && nftObj.bidder == account && nftObj.my_margin > 0">
            <div class="list-tip">
              <div class="name">
                Amount
                <Tooltip placement="top" v-if="nftObj.fine > 0">
                  <template #title>
                                        <span>
                                            The Owner has redeemed the NFT in full and the platform will return your Margin with additional rewards
                                            <img v-if="nftObj.underlying" style="width: 15px; height: 15px"
                                                 :src="require('@/assets' + nftObj.underlying.icon)" alt=""/>
                                            {{ dealNum(nftObj.fine) }}.
                                        </span>
                  </template>
                  <img src="../../../assets/images/tip_icon.webp" alt="" class="tip-icon"/>
                </Tooltip>
              </div>
              <div class="value">
                <img v-if="nftObj.underlying" class="icon coinIcon" :src="require('@/assets' + nftObj.underlying.icon)"
                     alt=""/>
                <strong>{{ dealNum(BigNumber(nftObj.my_margin).plus(nftObj.fine).toFixed(6)) }}</strong>
              </div>
            </div>
            <a-button class="primary-btn-sha" :loading="isLoading" @click="withdrawMargin">Withdraw Margin
            </a-button>
          </div>
          <!-- withdraw margin -->
          <div class="list-tip-box" v-else-if="nftObj.my_margin > 0">
            <div class="list-tip">
              <div class="name">Amount</div>
              <div class="value">
                <img v-if="nftObj.underlying" class="icon coinIcon" :src="require('@/assets' + nftObj.underlying.icon)"
                     alt=""/>
                <strong>{{ dealNum(nftObj.my_margin) }}</strong>
              </div>
            </div>
            <a-button class="primary-btn-sha" @click="withdrawMargin" :loading="isLoading">Withdraw Margin
            </a-button>
          </div>
        </template>
        <button
            class="primary-btn-sha"
            @click="
                        isShowRepay = true;
                        $refs.repayDialog.getData();
                    "
            v-if="showRepayBtn"
        >
          Borrower Repay
        </button>

      </div>
      <div class="btn-box" v-else>
        <a-button class="primary-btn-sha" :loading="isLoading" @click="notifyMe" v-if="!nftObj.is_subscribed">
          Subscribe
        </a-button>
        <a-button class="primary-btn-sha" :loading="isLoading" @click="unNotifyMe" v-if="nftObj.is_subscribed">
          Unsubscribe
        </a-button>
      </div>
    </div>
    <div class="dialog animate__animated animate__fadeIn" v-show="showBid">
      <div class="dialog-mask" @click="showBid = false"></div>
      <div class="dialog-content">
        <BidDialogContent :nowTime="nowTime" @updateData="$emit('updateData')" :nftObj="nftObj" :extra="extra"
                          @closeDialog="showBid = false"/>
      </div>
    </div>
    <Popup round position="bottom" v-model:show="showBidMobile" class="">
      <BidDialogContent :nowTime="nowTime" @updateData="$emit('updateData')" :nftObj="nftObj"
                        @closeDialog="showBidMobile = false"/>
    </Popup>
  </div>
</template>


<script>
import {message, Tooltip} from "ant-design-vue";
import bigNumberUtil from "@/utils/bigNumberUtil";
import {mapGetters} from "vuex";
import {Popup} from "vant";
import {getTranStatus} from "@/api/common";
import BidDialogContent from "@/views/AuctionView/components/BidDialogContent";
import {subscript, unSubscript} from "@/api/auctionApi";
import BigNumber from "bignumber.js";

const calculator = new bigNumberUtil();
import BundleNFTList from "@/views/AuctionView/components/BundleNFTList.vue";
import BorrowReplayDialog from "@/views/AuctionView/components/BorrowReplayDialog.vue";
import BidHistory from "@/views/AuctionView/components/BidHistory.vue";
import EmailSignDialog from "@/components/EmailSignDialog.vue";

export default {
  name: "AuctionItem",
  props: ["nftObj", "isAction", "nowTime", "updateData", "extra", "listActive"],
  components: {EmailSignDialog, Tooltip, BidDialogContent, Popup, BundleNFTList, BorrowReplayDialog, BidHistory},
  data() {
    return {
      BigNumber,
      isShowRepay: false,
      showBid: false,
      showBidMobile: false,
      isShowBundle: false,
      dealNum: calculator.dealNum,
      showNumAuto: calculator.showNumAuto,
      showSign: false,
      isShowBidHistory: false,
      isLoading: false,
      signOperate: undefined,
      showBottom: false
    };
  },
  computed: {
    ...mapGetters(["isConnected", "account", "chainId", "currentTheme", "web3"]),
    now() {
      return parseInt(this.nowTime / 1000);
    },
    countdown() {
      const now = this.nowTime;
      const end = this.nftObj.end_time * 1000;
      const diff = calculator.subtract(end, now);
      if (diff < 0) {
        return "End";
      }
      let seconds = Math.ceil(diff / 1000);
      let hours = Math.floor(seconds / 3600);
      hours = hours < 10 ? "0" + hours : hours;
      seconds = seconds % 3600;
      let minutes = Math.floor(seconds / 60);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds % 60;
      let secs = seconds < 10 ? "0" + seconds : seconds;
      return {
        hours,
        minutes,
        secs
      };
    },
    paymentCountdown() {
      const now = this.nowTime;
      const end = (this.nftObj.end_time + parseInt(this.extra.BID_WAIT_TIME)) * 1000;
      const diff = calculator.subtract(end, now);
      if (diff < 0) {
        return "End";
      }
      let seconds = Math.ceil(diff / 1000);
      let hours = Math.floor(seconds / 3600);
      hours = hours < 10 ? "0" + hours : hours;
      seconds = seconds % 3600;
      let minutes = Math.floor(seconds / 60);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds % 60;
      let secs = seconds < 10 ? "0" + seconds : seconds;
      return {
        hours,
        minutes,
        secs
      };
    },

    showRepayBtn() {
      let isOwner = this.nftObj.owner == this.account;
      if (!isOwner) {
        return false;
      }
      if (this.nftObj.auction_id == null) {
        let method = this.nftObj.method;
        if (method && method != "bid") {
          return false;
        }
        return true;
      }
      if (!this.extra) {
        return false;
      }
      let now = parseInt(new Date().getTime() / 1000);
      if (BigNumber(this.extra.MIN_BID_TIME).plus(this.nftObj.start_time).gt(now)) {
        return true;
      }
      return false;
    },
    curEmail() {
      return this.$store.state.app.curEmail;
    },
  },
  methods: {
    handleShowBid() {
      // if (!this.curEmail) {
      //   this.showSign = true;
      //   this.signOperate = 1;
      //   return;
      // }
      this.showBid = true;
    },
    handleEmailUpdate(email) {
      this.curEmail = email;
      if (this.signOperate == 1) {
        this.handleShowBid();
      } else {
        this.notifyMe();
      }
      this.getPersonInfo();
    },
    showBidHistory() {
      this.isShowBidHistory = true;
      this.$refs.bidHistory.getBidHistory();
    },
    showNFTs() {
      this.isShowBundle = true;
    },
    async unNotifyMe() {
      if (this.isLoading) {
        return;
      }

      this.isLoading = true;
      try {
        unSubscript({chain: this.chainId, address: this.account, bundle_id: this.nftObj.bundle_id}).then((res) => {
          if (res.data.code == 0) {
            message.success("Unsubscribe success");
            this.$emit("updateData");
          } else {
            message.error(res.data.msg);
          }
          this.isLoading = false;
        });
      } catch (e) {
        console.log(e);
        this.isLoading = false;
      }
    },
    async notifyMe() {
      if (this.isLoading) {
        return;
      }
      if (!this.curEmail) {
        this.showSign = true;
        this.signOperate = 2;
        return;
      }
      this.isLoading = true;
      try {
        subscript({chain: this.chainId, address: this.account, bundle_id: this.nftObj.bundle_id}).then((res) => {
          if (res.data.code == 0) {
            message.success("Subscribe success");
            this.$emit("updateData");
          } else {
            message.error(res.data.msg);
          }
          this.isLoading = false;
        });
      } catch (e) {
        console.log(e);
        this.isLoading = false;
      }
    },
    async dealRes(transactionHash) {
      let statusRes = await getTranStatus(transactionHash);
      if (statusRes.data.data == 1) {
        setTimeout(() => {
          this.isLoading = false;
          this.$emit("closeDialog");
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
        message.error('User canceled  transaction');
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
    withdrawMargin() {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      //withdraw
      this.$store
          .dispatch("auctionNFT/withdrawMargin", {
            _bundleId: this.nftObj.bundle_id
          })
          .then((res) => {
            this.dealRes(res.transactionHash);
          })
          .catch((e) => {
            this.dealCatchErr(e);
          });
    },
    payment() {
      //payment
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      this.$store
          .dispatch("auctionNFT/payment", {
            value: 0,
            _auctionId: this.nftObj.auction_id
          })
          .then((res) => {
            this.dealRes(res.transactionHash);
          })
          .catch((e) => {
            this.dealCatchErr(e);
          });
    }
  }
};
</script>

<style lang="scss" scoped>
.btnPointer {
  cursor: pointer;
}

.list-list-item {
  .btn-box {
    height: 65px;
    justify-content: flex-start;

    .primary-btn-sha:first-child {
      margin-top: 0;
    }
  }
}

.AuctionItem {
  margin-top: 30px;
  .list-list-item{
    .healthy-box{
      margin-left: 50px;
    }
  }
  ::v-deep(.primary-btn-sha span) {
    font-size: 14px !important;
    white-space: normal !important;
  }

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
        display: flex;
        align-items: center;
        justify-content: center;

        .tip-icon {
          margin-left: 5px;
        }
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
          margin-right: 8px;
        }
      }
    }
  }

  .time-box {
    .time-item:last-child {
      display: block;
    }
  }

  .nft-list {
    display: flex;
    margin: 22px 30px;
    padding: 15px;
    overflow: auto;
    height: 150px;
    background: #f3f3f3;
    flex-wrap: wrap;
    border-radius: 23px 23px 23px 23px;

    &::-webkit-scrollbar {
      display: none;
    }

    .nft-item {
      width: 90px;
      max-width: 200px;
      margin: 0 4px 8px 4px;
      height: 113px;
      background: #ffffff;
      border-radius: 8px 8px 8px 8px;
      border: 2px solid #fff;
      padding: 6px;
      position: relative;

      &.active {
        border: 2px solid #ffc001;

        .choose-box {
          .icon {
            display: block;
          }
        }
      }

      &:nth-child(6n) {
        margin-right: 0;
      }

      .choose-box {
        position: absolute;
        top: 12px;
        right: 10px;
        width: 15px;
        height: 15px;
        background: #ffffff;
        border-radius: 50%;

        .icon {
          width: 16px;
          filter: drop-shadow(#ffc600 5000px -2px);
          height: 16px;
          transform: translate(-5000px, 2px);
          display: none;
        }
      }

      .icon {
        width: 75px;
        height: 75px;
      }

      .name {
        font-size: 10px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #333333;
        margin-top: 6px;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }

  .position-item {
    display: flex;
    background: #ffffff;
    box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.05);
    border-radius: 20px 20px 20px 20px;
    border: 1px solid #e2e2e2;
    padding: 20px;
    justify-content: space-between;

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
          min-width: 320px !important;
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

        justify-content: flex-start;
        align-items: center;

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

        .name {
          min-width: 180px;
          font-size: 12px;
          font-family: Roboto-Medium, Roboto;
          font-weight: 500;
          color: #999999;
          white-space: nowrap;
        }

        .loan-box {
          font-weight: 900;
          position: relative;

          .rate {
            position: absolute;
            left: -30px;
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

    .healthy-box {
      .value {
        margin-top: -15px;
      }
    }

    .btn-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
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

      .primary-btn-sha:first-child {
        margin-bottom: 30px;
      }

      .primary-btn-sha:nth-last-child(2) {
        margin-bottom: 0px;
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
          font-size: 12px;
          font-family: RussoOneRegular, Russo One;
          flex: 1;

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
}
</style>
