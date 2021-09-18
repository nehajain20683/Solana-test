<template>
  <div class="bg">
    <p class="title">Contract INIT</p>
    <div>
      <div class="mb-1">
        <label for="2020-12-24-programId-escrow-alice">
          Source address
        </label>
        <input
          class="display-block"
          type="text"
          v-model="formState.sourceId"
        />
      </div>
      <div class="mb-1">
        <label for="2020-12-24-programId-escrow-alice">
          Destination address
        </label>
        <input
          class="display-block"
          type="text"
          v-model="formState.destinationId"
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
          @click="onTransfer"
        />
      </div>
    </div>
    <div>
      <div class="mb-1">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { transferToken } from './util/transferToken'

export default defineComponent({
  setup() {
    const formState = reactive({
      sourceId: '',
      destinationId: ''
    })


    const resetAliceUI = () => {}

    const onTransfer = async () => {
      try {
        await transferToken(formState.sourceId, formState.destinationId)
      } catch (err) {
        console.log("ERROR", err)
        alert(err.message)
      }
    }

    return {
      formState,
      resetAliceUI,
      onTransfer
    }
  },
})
</script>
