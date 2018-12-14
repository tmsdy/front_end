<template>
  <div style="display: flex;">
    <snapshot-canvas :width="width"
      :height="height"
      :grid-num="gridNum"
      :refetch-img-delay="refetchImgDelay"
      :multi-select="multiSelect"
      :editing-mode="editingMode"
      :show-intensity="showIntensity"
      :full-detect-result-sensitivity="fullDetectResultSensitivity"
      :detected-neg-color="detectedNegColor"
      :detected-pos-color="detectedPosColor"
      :detected-semi-pos-color="detectedSemiPosColor"
      :detected-not-cloth-color="detectedNotClothColor"
      :row-range-color="rowRangeColor"
      :intensity-color="intensityColor"
      :highlight-color="highlightColor"
      :blind-color="blindColor"
      :hover-tips="hoverTips"
      :img-url="imgUrl"
      :neg-areas="negAreas"
      :pos-areas="posAreas"
      :blind-areas="blindAreas"
      :row-range="rowRange"
      :detected-not-cloth-areas="detectedNotClothAreas"
      :detected-pos-areas="detectedPosAreas"
      :detected-semi-pos-areas="detectedSemiPosAreas"
      :detected-neg-areas="detectedNegAreas"
      :full-detect-result="fullDetectResult"
      :highlight-grids="hlGrids"
      @mouseclick="onClick"></snapshot-canvas>
    <div style="width:200px;padding:15px;display: flex;flex-direction: column;justify-content: space-between;">
      <div style="height:150px;flex: 1;"
        v-html="details"
        v-show="hlGrids.length"></div>
      <div v-show="hlGrids.length">
        <select class="form-control"
          style="margin-bottom: 20px;"
          v-model="blindTime">
          <option v-for="time in blindTimeOptions"
            :key="time.value"
            :value="time.value">{{time.label}}</option>
        </select>
        <div style="display: flex;justify-content: space-between;margin-bottom: 20px;">
          <button class="btn btn-white"
            @click="deleteBlindArea">删除</button>
          <button class="btn btn-primary"
            @click="submitBlindArea">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SnapshotCanvas from '@/components/SnapshotCanvas/index.vue'
type EventData = {
  pos: Array<number>
  gridIndex: number
  data: Array<number>
  hlGrids: Array<number>
}

export default Vue.extend({
  data() {
    return {
      details: '',
      hlGrids: this.highlightGrids,
      blindTime: -1,
    }
  },
  props: {
    width: {
      default: 1920,
    },
    height: {
      default: 1080,
    },
    gridNum: {
      default: 60,
    },
    refetchImgDelay: {
      default: 2000,
    },
    multiSelect: {
      default: true,
    },
    editingMode: {
      default: false,
    },
    showIntensity: {
      default: false,
    },
    fullDetectResultSensitivity: {
      default: 1,
    },
    // Colors
    detectedPosColor: {
      default: 'rgba(255, 0, 0, 0.4)',
    },
    detectedSemiPosColor: {
      default: 'rgba(255, 173, 78, 0.4)',
    },
    detectedNotClothColor: {
      default: 'rgba(128, 128, 128, 0.4)',
    },
    detectedNegColor: {
      default: 'rgba(0, 255, 0, 0.03)',
    },
    rowRangeColor: {
      default: 'rgba(255, 0, 0, 1)',
    },
    intensityColor: {
      default: 'rgba(0, 255, 0, 1)',
    },
    highlightColor: {
      default: 'rgba(154, 204, 94, 1)',
    },
    blindColor: {
      default: 'rgba(154, 204, 94, 0.5)',
    },

    blindTimeOptions: {
      default: () => [
        {
          value: '-1',
          label: '永久',
        },
        {
          value: '1',
          label: '1 小时',
        },
        {
          value: '2',
          label: '2 小时',
        },
        {
          value: '3',
          label: '3 小时',
        },
        {
          value: '4',
          label: '4 小时',
        },
      ],
    },

    // Data
    imgUrl: {
      type: String,
      required: true,
    },
    negAreas: {
      default: () => [],
    },
    posAreas: {
      default: () => [],
    },
    blindAreas: {
      default: () => [],
    },
    rowRange: {
      default: () => [],
    },
    detectedNotClothAreas: {
      default: () => [],
    },
    detectedPosAreas: {
      default: () => [],
    },
    detectedSemiPosAreas: {
      default: () => [],
    },
    detectedNegAreas: {
      default: () => [],
    },
    fullDetectResult: {
      default: () => () => {},
    },
    highlightGrids: {
      default: [] as Array<number>,
    },
    // funcs
    getDetails: {
      default: (event: EventData) => '',
    },
    hoverTips: {
      default: () => () => '',
    },
  },

  methods: {
    onClick(event: EventData) {
      this.hlGrids = event.hlGrids

      this.details = this.getDetails(event)
      this.$emit('mouseclick', event)
    },
    deleteBlindArea() {
      this.$emit('delete', this.hlGrids, this.blindTime)
      this.hlGrids = []
    },
    submitBlindArea() {
      this.$emit('submit', this.hlGrids, this.blindTime)
      this.hlGrids = []
    },
  },
  watch: {
    highlightGrids(val) {
      this.hlGrids = val
    },
  },
  components: {
    SnapshotCanvas,
  },
})
</script>
