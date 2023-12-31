<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import PlayerView from './components/PlayerView.vue'
import SettingView from './components/SettingView.vue'
import ReSettings5Line from './components/icons/ReSettings5Line.vue'
import ThMoreAltVue from './components/icons/ThMoreAlt.vue'
import TiRefreshVue from './components/icons/TiRefresh.vue'
import RePaletteLine from './components/icons/RePaletteLine.vue'
import ColorView from './components/ColorView.vue'

import { Container, Draggable } from 'vue-dndrop'

const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }

  return result
}

const showSettings = ref<boolean>(false)
const showElements = ref<boolean>(false)
const showColorSel = ref<boolean>(false)

const storagePathP1 = `glcP1Hue.Color`
const storagePathP2 = `glcP2Hue.Color`
const p1Ref = ref<typeof PlayerView | null>(null)
const p2Ref = ref<typeof PlayerView | null>(null)
const p1Hue = ref<number>(32)
const p2Hue = ref<number>(222)

const resetPlayers = () => {
  p1Ref.value?.resetLife()
  p2Ref.value?.resetLife()
  showSettings.value = false
}

onMounted(() => {
  p1Hue.value = Number.parseFloat(localStorage.getItem(storagePathP1) ?? '32')
  p2Hue.value = Number.parseFloat(localStorage.getItem(storagePathP2) ?? '222')
})

const fields = ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const redMark = ref(10)
const blueMark = ref(0)

function onDrop(dropResult, index) {
  if (dropResult.addedIndex === null) {
    return
  }
  console.log('tesst')
  console.log(dropResult)
  console.log(dropResult.element.id)

  console.log(index)
  if (dropResult.element.id === 'redToken') {
    redMark.value = index
  }
  if (dropResult.element.id === 'blueToken') {
    blueMark.value = index
  }
  // items = applyDrag(items, dropResult)
}

const sliderRef = ref({ min: 0, max: 10, value: [0, 10] })
const sliderCom = computed({
  get() {
    return { min: blueMark.value, max: redMark.value }
  },
  set(val) {
    console.log(val)
    blueMark.value = val.min
    redMark.value = val.max
  },
})
const sliderSet = (val) => {
  blueMark.value = val[0]
  redMark.value = val[1]
}
</script>

<template>
  <main class="w-screen h-screen">
    <!-- <div
      id="openSettings"
      class="openSetting"
      v-if="!showElements"
      @click.stop="showElements = !showElements"
    >
      <ThMoreAltVue />
    </div> -->
    <div class="grid grid-cols-11" style="height: 30dvh">
      <div v-for="(value, index) in fields" :key="index" class="relative">
        <Container
          @drop="(e) => onDrop(e, index)"
          group-name="col"
          class="relative top-0 left-0 w-full h-full"
          ><div class="absolute top-0 left-0 w-full h-full">{{ value }}</div>

          <Draggable
            v-if="redMark === index"
            class="bg-red-500 draggable-item h-full w-full absolute top-0 left-0 opacity-50"
            id="redToken"
            >&nbsp;
          </Draggable>
          <Draggable
            v-if="blueMark === index"
            class="bg-blue-600 draggable-item h-full w-full relative top-0 left-0 opacity-50"
            id="blueToken"
            >&nbsp;
          </Draggable>
        </Container>
      </div>
    </div>
    <q-range
      :min="0"
      :max="10"
      marker-labels
      v-model="sliderCom"
      style="height: 20dvh"
    />
    <div v-if="showElements" class="openSetting grid grid-cols-3">
      <ReSettings5Line
        @click.stop="
          () => {
            showSettings = !showSettings
            showElements = false
          }
        "
      />
      <RePaletteLine
        @click.stop="
          () => {
            showColorSel = !showColorSel
            showElements = false
          }
        "
      />
      <TiRefreshVue
        @click.stop="
          () => {
            resetPlayers()
            showElements = false
          }
        "
      />
    </div>
    <SettingView
      v-show="showSettings"
      @update:close="(value) => (showSettings = !value)"
    />
    <ColorView
      v-if="showColorSel"
      @update:close="() => (showColorSel = false)"
      v-model:p1-hue="p1Hue"
      v-model:p2-hue="p2Hue"
    />
    <PlayerView
      class="PlayerView p1Background"
      style="height: 50dvh"
      player-name="first"
      ref="p1Ref"
    />
    <!-- <PlayerView
      class="PlayerView p2Background"
      style="height: 50dvh"
      player-name="second"
      ref="p2Ref"
    /> -->
  </main>
</template>

<style>
.PlayerView {
  font-size: min(28vh, 30vw);
}
.p1Background {
  background-color: #6b8b3d;
}
.p2Background {
  background-color: hsl(v-bind(p2Hue), 95%, 44%);
}
</style>
<style scoped>
.openSetting {
  position: absolute;
  top: 50dvh;
  right: 50dvw;
  transform: translate(50%, -50%);
  z-index: 5;
  font-size: min(14vh, 14vw);
}
</style>
