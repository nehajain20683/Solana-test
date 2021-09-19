<template>
  <div class="bg">
    <p class="title">ADD TOKEN TO CONTRACT</p>
    <div>
      <h3>User details</h3>
      <div class="mb-1">
        <label for="2020-12-24-programId-escrow-alice">User private in Uint8Array</label>
        <input class="display-block" type="text" v-model="formState.userPrivKey" />
      </div>
      <div class="mb-1">
        <label for="2020-12-24-programId-escrow-alice">Program ID</label>
        <input class="display-block" type="text" v-model="formState.programId" />
        <p>Deployed contract on devnet - CiJkL1zKPSfaA9nahzqQk8VYtbyp5WdYxDQhQfMoosnR</p>
      </div>
      <div class="mb-1">
        <label for="2020-12-24-programId-escrow-alice">ID of the new token to add</label>
        <input class="display-block" type="text" v-model="formState.tokenId" />
      </div>
      <div class="mb-1">
        <label
          for="2020-12-24-programId-escrow-alice"
        >User token account ID [Should atleast have 1000000000000000 tokens (18 decimal places) ]</label>
        <input class="display-block" type="text" v-model="formState.tokenUserId" />
      </div>
      <hr />

      <div class="mb-1">
        <input
          style="margin-right: 5px;"
          class="cursor-pointer border-none bg-btn normal-font-size"
          type="submit"
          value="Reset UI"
          @click="resetAliceUI"
        />
        <input
          class="cursor-pointer border-none bg-btn normal-font-size"
          type="submit"
          value="Init escrow"
          @click="onContractInit"
        />
      </div>
    </div>
    <div>
      <div class="mb-1">
        Transaction hash
        <div>{{ tokenSwapState.transactionHash ? tokenSwapState.transactionHash : "" }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { addToken } from "./util/addTokenToContract";

interface TokenSwapState {
  transactionHash: null | string;
}

export default defineComponent({
  setup() {
    const formState = reactive({
      userPrivKey: "",
      programId: "",
      tokenId: "",
      tokenUserId: ""
    });

    const tokenSwapState: TokenSwapState = reactive({
      transactionHash: null
    });

    const resetAliceUI = () => {
      formState.userPrivKey = "";
      formState.programId = "";
      formState.tokenId = "";
      formState.tokenUserId = "";
      Object.keys(tokenSwapState).forEach(
        key => (tokenSwapState[key as keyof TokenSwapState] = null)
      );
    };

    const onContractInit = async () => {
      try {
        const { response } = await addToken(
          formState.userPrivKey,
          formState.programId,
          formState.tokenUserId,
          formState.tokenId
        );
        console.log("txnHash -  ", response);
        tokenSwapState.transactionHash = response;
        alert(`Transaction complete with txnHash - ${response}`);
      } catch (err) {
        console.log("ERROR", err);
        alert(err.message);
      }
    };

    return {
      formState,
      resetAliceUI,
      tokenSwapState,
      onContractInit
    };
  }
});
</script>
