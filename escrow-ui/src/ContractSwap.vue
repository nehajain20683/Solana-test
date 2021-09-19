<template>
  <div class="bg">
    <p class="title">SWAP TOKENS</p>
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
        <label for="2020-12-24-programId-escrow-alice">Program Account ID</label>
        <input class="display-block" type="text" v-model="formState.programAccount" />
        <p>Deployed contract account on devnet - 6zcSB1syqfHvaCvg1NA8Dpycsh2dCaWjHCzCkVTPFhZq</p>
      </div>
      <hr />

      <h3>List of tokens available (all tokens have 18 decimal places)</h3>
      <ol>
        <li>Token Acc - Cga3rxzAeevcULSf7dnKwUwyecFcjD2kD1khTDyyfdfA | PDA ACC - 9UwH2UtLvasyHPpDgh5TJWSbZ8QGyAjbwGFbME9miNw7</li>
        <li>Token Acc - C3p41Ndvc58UskTTs9WkjPvG6NiMPGCbvUavG6vXrVhN | PDA ACC - EEexpwitPM3rbRS1VUDfvarX4YRjaWM6CmGh5x21sXTE</li>
        <li>Token Acc - G5dvrN8xkzkWfoCWvFwsuFJfQHaPkyutPr5iwMbU4pbZ | PDA ACC - 6mBoC6f89T2pY6CuXxPDpJQyH1FZHPwxtiBPLcykbn6A</li>
        <li>Token Acc - E5GAwErW127bs1EaYXXLb3zRvHYVVdp4hZvMPsvW9wuU | PDA ACC - 4vVRMUvLt4EvfJAvFgNs6wvZwfLaL9J6R87mh65xaeaf</li>
        <li>Token Acc - CwvFgzUxUgMnTb9zCYBfCKgDMUeWNM8zvhDfBdFMrCJt | PDA ACC - 9eiCUEhdX9sy7QstHsmqBJKS5P7hGuXLg9LGUn3WTsmq</li>
      </ol>

      <hr />

      <h3>User accounts</h3>
      <div class="mb-1">
        <label for="2020-12-24-programId-escrow-alice">User token 1 account address- (token to send)</label>
        <input class="display-block" type="text" v-model="formState.userToken1" />
      </div>
      <div class="mb-1">
        <label
          for="2020-12-24-programId-escrow-alice"
        >User token 2 account address- (token to receive)</label>
        <input class="display-block" type="text" v-model="formState.userToken2" />
      </div>
      <div class="mb-1">
        <label
          for="2020-12-24-programId-escrow-alice"
        >User token 3 account address- (token to receive)</label>
        <input class="display-block" type="text" v-model="formState.userToken3" />
      </div>
      <div class="mb-1">
        <label
          for="2020-12-24-programId-escrow-alice"
        >User token 4 account address- (token to receive)</label>
        <input class="display-block" type="text" v-model="formState.userToken4" />
      </div>
      <div class="mb-1">
        <label
          for="2020-12-24-programId-escrow-alice"
        >User token 5 account address- (token to receive)</label>
        <input class="display-block" type="text" v-model="formState.userToken5" />
      </div>
      <hr />

      <h3>PDA token addresses for respective tokens</h3>
      <div class="mb-1">
        <label for="2020-12-24-programId-escrow-alice">PDA token 1 account address</label>
        <input class="display-block" type="text" v-model="formState.pdaAccount1" />
      </div>
      <p>total % should be 100%</p>
      <div class="mb-1">
        <label for="2020-12-24-programId-escrow-alice">PDA token 2 account address</label>
        <input class="display-block" type="text" v-model="formState.pdaAccount2" />
      </div>
      <div class="mb-1">
        <label for="2020-12-24-programId-escrow-alice">PDA token 3 account address</label>
        <input class="display-block" type="text" v-model="formState.pdaAccount3" />
      </div>
      <div class="mb-1">
        <label for="2020-12-24-programId-escrow-alice">PDA token 4 account address</label>
        <input class="display-block" type="text" v-model="formState.pdaAccount4" />
      </div>
      <div class="mb-1">
        <label for="2020-12-24-programId-escrow-alice">PDA token 5 account address</label>
        <input class="display-block" type="text" v-model="formState.pdaAccount5" />
      </div>

      <hr />

      <h3>Token send amount and percentage distribution</h3>
      <div class="mb-1">
        <label for="2020-12-24-programId-escrow-alice">User token 1 amount to send</label>
        <input class="display-block" type="text" v-model="formState.tokenSendAmount" />
      </div>
      <div class="mb-1">
        <label for="2020-12-24-programId-escrow-alice">User token 2 percentage division</label>
        <input class="display-block" type="text" v-model="formState.percentageOfTokenToReceive2" />
      </div>
      <div class="mb-1">
        <label for="2020-12-24-programId-escrow-alice">User token 3 percentage division</label>
        <input class="display-block" type="text" v-model="formState.percentageOfTokenToReceive3" />
      </div>
      <div class="mb-1">
        <label for="2020-12-24-programId-escrow-alice">User token 4 percentage division</label>
        <input class="display-block" type="text" v-model="formState.percentageOfTokenToReceive4" />
      </div>
      <div class="mb-1">
        <label for="2020-12-24-programId-escrow-alice">User token 5 percentage division</label>
        <input class="display-block" type="text" v-model="formState.percentageOfTokenToReceive5" />
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
import { swapTokenFromContract } from "./util/contractSwap";

interface TokenSwapState {
  transactionHash: null | string;
}

export default defineComponent({
  setup() {
    const formState = reactive({
      userPrivKey: "",
      programId: "",
      programAccount: "",
      userToken1: "",
      userToken2: "",
      userToken3: "",
      userToken4: "",
      userToken5: "",
      pdaAccount1: "",
      pdaAccount2: "",
      pdaAccount3: "",
      pdaAccount4: "",
      pdaAccount5: "",
      tokenSendAmount: 0,
      percentageOfTokenToReceive2: 0,
      percentageOfTokenToReceive3: 0,
      percentageOfTokenToReceive4: 0,
      percentageOfTokenToReceive5: 0
    });

    const tokenSwapState: TokenSwapState = reactive({
      transactionHash: null
    });

    const resetAliceUI = () => {
      (formState.userPrivKey = ""),
        (formState.programId = ""),
        (formState.programAccount = ""),
        (formState.userToken1 = ""),
        (formState.userToken2 = ""),
        (formState.userToken3 = ""),
        (formState.userToken4 = ""),
        (formState.userToken5 = ""),
        (formState.pdaAccount1 = ""),
        (formState.pdaAccount2 = ""),
        (formState.pdaAccount3 = ""),
        (formState.pdaAccount4 = ""),
        (formState.pdaAccount5 = ""),
        (formState.tokenSendAmount = 0),
        (formState.percentageOfTokenToReceive2 = 0),
        (formState.percentageOfTokenToReceive3 = 0),
        (formState.percentageOfTokenToReceive4 = 0),
        (formState.percentageOfTokenToReceive5 = 0);
        Object.keys(tokenSwapState).forEach(
        key => (tokenSwapState[key as keyof TokenSwapState] = null)
      );
    };

    const onContractInit = async () => {
      try {
        const { response } = await swapTokenFromContract(
          formState.userPrivKey,
          formState.programId,
          formState.userToken1,
          formState.userToken2,
          formState.userToken3,
          formState.userToken4,
          formState.userToken5,
          formState.pdaAccount1,
          formState.pdaAccount2,
          formState.pdaAccount3,
          formState.pdaAccount4,
          formState.pdaAccount5,
          formState.programAccount,
          formState.tokenSendAmount,
          formState.percentageOfTokenToReceive2,
          formState.percentageOfTokenToReceive3,
          formState.percentageOfTokenToReceive4,
          formState.percentageOfTokenToReceive5
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
