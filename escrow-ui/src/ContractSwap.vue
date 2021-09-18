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
        <label for="2020-12-24-programId-escrow-alice">
          Token A address
        </label>
        <input
          class="display-block"
          type="text"
          v-model="formState.tokenA"
        />
      </div>
      <div class="mb-1">
        <label for="2020-12-24-programId-escrow-alice">
          Contract Token A address
        </label>
        <input
          class="display-block"
          type="text"
          v-model="formState.contractTokenA"
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
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
// import { swapTokenFromContract } from './util/contractSwap'
import { initSwapCont } from './util/initSwapToken'

export default defineComponent({
  setup() {
    const formState = reactive({
      programId: '',
      tokenA: '',
      contractTokenA: '',
    })


    const resetAliceUI = () => {
      formState.programId = ''
      formState.tokenA = ''
      formState.contractTokenA = ''
    }

    const onContractInit = async () => {
      try {
      await initSwapCont()
      // await swapTokenFromContract(formState.tokenA, formState.programId, formState.contractTokenA)
        alert("COMPLETE")
      } catch (err) {
        console.log("ERROR", err)
        alert(err.message)
      }
    }

    return {
      formState,
      resetAliceUI,
      onContractInit
    }
  },
})
</script>
