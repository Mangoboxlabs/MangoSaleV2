<template>
  <div class="ProposalView">
    <div class="proposal-list" v-show="!isShowProposal">
      <template v-for="(item,index) in proposalArr" :key="index">
        <ProposalItem :proposal="item"/>
      </template>
    </div>
    <div class="new-proposal" v-show="!isShowProposal" @click="isShowProposal = true">
      <img src="../../assets/images/new_proposal.webp" alt="" class="icon">
      New Proposal
    </div>
    <CreateProposalView v-show="isShowProposal" @close="isShowProposal=false"/>
  </div>
</template>

<script>
import ProposalItem from "@/views/GovernanceView/components/ProposalItem";
import CreateProposalView from "@/views/GovernanceView/CreateProposalView";

export default {
  name: "ProposalView",
  components: {ProposalItem, CreateProposalView},
  data() {
    return {
      activeNav1: 1,
      isShowProposal: false,
      proposalArr: [{}, {}]
    }
  }
}
</script>

<style lang="scss" scoped>
.ProposalView {
  display: flex;
  justify-content: space-between;

  .proposal-list {
    width: calc(75vw - 300px);
  }

  .new-proposal {
    width: 260px;
    height: 100px;
    background: #FFFFFF;
    box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.05);
    border-radius: 20px 20px 20px 20px;
    border: 1px solid #E2E2E2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-family: Roboto-Bold, Roboto;
    font-weight: bold;
    color: #000000;
    cursor: pointer;

    .icon {
      width: 24px;
      height: 26px;
      margin-right: 20px;
      opacity: 1;
    }
  }
}

@media screen and (max-width: 1000px) {
  .ProposalView {
    display: block;
    position: relative;
    .new-proposal{
      top: 0;
      width: 100%;
      position: absolute;
    }
    .proposal-list {
      padding-top: 120px;
      width: 100%;
    }
  }
}

</style>
