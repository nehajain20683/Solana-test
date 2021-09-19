<template>
  <div class="bg">
    <p class="title">Contract INIT</p>
    <div>
      <div class="mb-1">
        <label for="2020-12-24-programId-escrow-alice">
          Contract programId
        </label>
        <input
          class="display-block"
          type="text"
          v-model="formState.programId"
        />
      </div>
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
        Contract Key:
        <div>{{ contractState.contractKey ?? '--' }}</div>
      </div>
      <div class="mb-1">
        Decoded State
      </div>
      <div class="mb-1">
        Token A account for Contract:
        <div>{{ contractState.tokenAOfContract ?? '--' }}</div>
      </div>
      <div class="mb-1">
        Token B account for Contract:
        <div>{{ contractState.tokenBOfContract ?? '--' }}</div>
      </div>
      <div class="mb-1">
        Token C account for Contract:
        <div>{{ contractState.tokenCOfContract ?? '--' }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { initSwapCont } from './util/initSwapContract'

interface ContractState {
  contractKey: null | string
  tokenAOfContract: null | string
  tokenBOfContract: null | string
  tokenCOfContract: null | string
}

export default defineComponent({
  setup() {
    const formState = reactive({
      programId: '',
    })

    const contractState: ContractState = reactive({
      contractKey: null,
      tokenAOfContract: null,
      tokenBOfContract: null,
      tokenCOfContract: null,
    })

    const resetAliceUI = () => {
      formState.programId = ''
      Object.keys(contractState).forEach(
        (key) => (contractState[key as keyof ContractState] = null),
      )
    }

    const onContractInit = async () => {
      try {
      await initSwapCont()
      alert("Contract init")
      } catch (err) {
        console.log("ERROR", err)
        alert(err.message)
      }
    }

    return {
      formState,
      resetAliceUI,
      onContractInit,
      contractState,
    }
  },
})
</script>
