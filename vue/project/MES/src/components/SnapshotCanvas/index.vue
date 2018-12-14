<template>
  <div :style="{'width':width+'px','height':height+'px'}">
    <canvas width="100%"
      height="100%"
      ref="hyCanvas"
      @click="canvasMouseClick"
      @mousemove="canvasMousemove"
      @mouseleave="canvasMouseleave">
      Your browser doesn't support canvas
    </canvas>
    <div style="position:absolute;transition:all 175ms;border-radius:2px;overflow:hidden;opacity:0;display:flex;align-items:center;"
      ref="tips">
      <div style="width: 0;height: 0;border-top: 5px solid transparent;border-right: 10px solid white;border-bottom: 5px solid transparent;"></div>
      <div style="background:white;padding:5px;"
        v-html="tips"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      baseWidth: 1920,
      baseHeight: 1080,
      // Status
      curMouseX: -1,
      curMouseY: -1,
      imgLoaded: false,

      // Objs
      img: null as any,
      ctx: null as any,
      hlGrids: [] as Array<number>,
      tips: '',
    }
  },
  props: {
    // Configs
    // Apperance
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
      default: false,
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

    // Hover
    hoverTips: {
      type: Function || null,
      default: null,
    },

    // Data
    imgUrl: {
      type: String,
      required: true,
    },
    negAreas: {
      default: [] as Array<Array<number>>,
    },
    posAreas: {
      default: [] as Array<Array<number>>,
    },
    blindAreas: {
      default: [] as Array<{
        grid: number
        [x: string]: any
      }>,
    },
    rowRange: {
      default: [] as Array<number>,
    },
    detectedNotClothAreas: {
      default: [] as Array<Array<number>>,
    },
    detectedPosAreas: {
      default: [] as Array<Array<number>>,
    },
    detectedSemiPosAreas: {
      default: [] as Array<Array<number>>,
    },
    detectedNegAreas: {
      default: [] as Array<Array<number>>,
    },
    fullDetectResult: {
      default: {} as {
        Count: number
        DetectResults: any
        Cols: number
        Xs: number
        Ys: number
      },
    },
    highlightGrids: {
      default: [] as Array<number>,
    },
  },

  mounted() {
    this.init()
    this.fetchImg()
    this.updateCanvas()
  },

  methods: {
    init() {
      const canvas = this.$refs.hyCanvas as HTMLCanvasElement
      canvas.width = this.width
      canvas.height = this.height

      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      // @ts-ignore experimental technology
      ctx.imageSmoothingQuality = 'high'
      this.ctx = ctx
    },
    fetchImg() {
      this.imgLoaded = false
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.src = this.imgUrl
      img.onload = () => {
        this.imgLoaded = true
      }
      img.onerror = () => {
        // retry load image
        // setTimeout(() => {
        //   this.fetchImg();
        // }, refetchImgDelay);
      }
      this.img = img
    },
    updateCanvas() {
      if (this.imgLoaded) {
        // Img
        this.drawImage()
        this.drawImageCount(this.ctx, this.fullDetectResult.Count)
        this.drawFullImageDetectResults()
        // Vector
        this.drawRowRange(this.ctx, this.rowRange)
        this.drawNegAreas()
        this.drawPosAreas()
        this.drawBlindAreas()
        this.drawDetectedPosAreas()
        this.drawDetectedSemiPosAreas()
        this.drawDetectedNotClothAreas()
        this.drawDetectedNegAreas()
        this.drawHighlightAreas()
        // Text

        // Optionals
        if (this.showIntensity) {
          this.drawIntensity()
        }
      } else {
      }

      window.requestAnimationFrame(this.updateCanvas)
    },

    // draw gray number
    drawIntensity() {
      if (this.curMouseX !== -1 || this.curMouseY !== -1) {
        var pixelIntensity = this.ctx.getImageData(
          this.curMouseX,
          this.curMouseY,
          1,
          1,
        )
        let grayscale =
          0.2126 * pixelIntensity.data[0] +
          0.7152 * pixelIntensity.data[1] +
          0.0722 * pixelIntensity.data[2]

        const x = this.curMouseX
        const y = this.curMouseY
        const intensityStr = `x: ${x} y: ${y}, gray scale ${grayscale};`
        this.ctx.font = `${(this.width / this.baseWidth) * 60}px Arial bold`
        this.ctx.fillStyle = this.intensityColor
        this.ctx.fillText(intensityStr, 50, 75)
      }
    },
    drawNegAreas() {
      this.negAreas.forEach(negArea => {
        this.drawNeg(this.ctx, negArea)
      })
    },
    drawPosAreas() {
      this.posAreas.forEach(posArea => {
        this.drawPos(this.ctx, posArea)
      })
    },
    drawBlindAreas() {
      this.blindAreas.forEach(blindAreaObj => {
        this.ctx.fillStyle = blindAreaObj.color || this.blindColor
        const blindPos = this.gridToPos(blindAreaObj.grid)
        this.drawRect(this.ctx, [blindPos[0], 0, blindPos[1], 1])
      })
    },
    drawHighlightAreas() {
      const hlGridsPos = this.hlGrids.map(highlightGrid =>
        this.gridToPos(highlightGrid),
      )
      hlGridsPos.forEach(highlightGridPos => {
        this.ctx.fillStyle = this.highlightColor
        this.drawRect(this.ctx, [
          highlightGridPos[0],
          0,
          highlightGridPos[1],
          1,
        ])
      })
    },
    drawDetectedPosAreas() {
      this.detectedPosAreas.forEach(detectedPosArea => {
        this.drawDetectedPos(this.ctx, detectedPosArea)
      })
    },
    drawDetectedSemiPosAreas() {
      this.detectedSemiPosAreas.forEach(detectedSemiPosArea => {
        this.drawDetectedSemiPos(this.ctx, detectedSemiPosArea)
      })
    },
    drawDetectedNotClothAreas() {
      this.detectedNotClothAreas.forEach(detectedNotClothArea => {
        this.drawDetectedNotCloth(this.ctx, detectedNotClothArea)
      })
    },
    drawDetectedNegAreas() {
      this.detectedNegAreas.forEach(detectedNegArea => {
        this.drawDetectedNeg(this.ctx, detectedNegArea)
      })
    },

    drawImage() {
      this.ctx.drawImage(this.img, 0, 0, this.width, this.height)
    },

    drawFullImageDetectResults() {
      const fullImageDetectResults = this.fullDetectResult['DetectResults']
      if (fullImageDetectResults) {
        const cols = this.fullDetectResult.Cols
        // In reverse order
        const ys = this.fullDetectResult.Xs
        const xs = this.fullDetectResult.Ys
        const fullDetectResultSensitivity = this.fullDetectResultSensitivity

        for (let i = fullImageDetectResults.length - 1; i >= 0; i--) {
          const posCount = fullImageDetectResults[i]
          if (posCount <= 0) {
            continue
          }
          const xid = i % cols
          const yid = Math.floor(i / cols)
          const startX = (xs + xid * 32) / 1920
          const startY = (ys + yid * 32) / 1080
          const endX = startX + 32 / 1920
          const endY = startY + 32 / 1080

          const markArea = [startX, startY, endX, endY]
          const alpha = Math.min(1, posCount / fullDetectResultSensitivity)

          this.ctx.fillStyle = `rgb(255, 0, 0, ${alpha})`
          this.drawRect(this.ctx, markArea)
        }
      }
    },

    drawRect(ctx: CanvasRenderingContext2D, markArea: Array<number>) {
      markArea = this.mapAreaToPx(markArea)
      ctx.fillRect(
        markArea[0],
        markArea[1],
        markArea[2] - markArea[0],
        markArea[3] - markArea[1],
      )
    },

    mapAreaToPx(area: Array<number>) {
      const scaleFactor = [this.width, this.height, this.width, this.height]
      return area.map((x, idx) => Number(x) * scaleFactor[idx])
    },

    drawNeg(ctx: CanvasRenderingContext2D, markArea: Array<number>) {
      ctx.fillStyle = this.detectedNegColor
      this.drawRect(ctx, markArea)
    },
    drawRowRange(ctx: CanvasRenderingContext2D, rowRange: Array<number>) {
      if (rowRange.length === 0) return

      const line1Y = (rowRange[0] / this.baseHeight) * this.height
      const line2Y = (rowRange[1] / this.baseHeight) * this.height

      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.moveTo(0, line1Y)
      ctx.lineTo(this.width, line1Y)
      ctx.moveTo(0, line2Y)
      ctx.lineTo(this.width, line2Y)
      ctx.strokeStyle = 'red'
      ctx.stroke()
    },

    drawDetectedPos(ctx: CanvasRenderingContext2D, markArea: Array<number>) {
      ctx.fillStyle = this.detectedPosColor
      this.drawRect(ctx, markArea)
    },

    drawDetectedSemiPos(
      ctx: CanvasRenderingContext2D,
      markArea: Array<number>,
    ) {
      ctx.fillStyle = this.detectedSemiPosColor
      this.drawRect(ctx, markArea)
    },

    drawDetectedNotCloth(
      ctx: CanvasRenderingContext2D,
      markArea: Array<number>,
    ) {
      ctx.fillStyle = this.detectedNotClothColor
      this.drawRect(ctx, markArea)
    },

    drawDetectedNeg(ctx: CanvasRenderingContext2D, markArea: Array<number>) {
      ctx.fillStyle = this.detectedNegColor
      this.drawRect(ctx, markArea)
    },

    drawTips(x: number, y: number) {
      const targetGrid = this.posToGrid(x)
      const targetBlindObj = this.blindAreas.find(
        blindArea => blindArea.grid === targetGrid,
      )
      const tipsDom = this.$refs.tips as HTMLElement
      const canvasDom = this.$refs.hyCanvas as HTMLElement
      if (targetBlindObj) {
        const msg = this.hoverTips(targetBlindObj)
        tipsDom.style.left = x + 25 + 'px'
        tipsDom.style.top = y + 10 + 'px'
        tipsDom.style.opacity = '1'
        canvasDom.style.cursor = 'pointer'
        this.tips = msg
      } else {
        tipsDom.style.opacity = '0'
        canvasDom.style.cursor = 'inherit'
      }
    },

    drawPos(ctx: CanvasRenderingContext2D, markArea: Array<number>) {
      markArea = this.mapAreaToPx(markArea)
      ctx.strokeStyle = '#ff0000'

      ctx.beginPath()
      ctx.moveTo(markArea[0] - 35, markArea[1])
      ctx.lineTo(markArea[0] + 35, markArea[1])
      ctx.lineTo(markArea[2] + 35, markArea[3])
      ctx.lineTo(markArea[2] - 35, markArea[3])
      ctx.closePath()
      ctx.stroke()
    },

    drawImageCount(ctx: CanvasRenderingContext2D, count: number) {
      if (count !== undefined) {
        const intensityStr = `Samples: ${count}`
        ctx.font = `${(this.width / this.baseWidth) * 60}px Arial bold`
        ctx.fillStyle = this.intensityColor
        ctx.fillText(
          intensityStr,
          (1200 * this.width) / this.baseWidth,
          (150 * this.height) / this.baseHeight,
        )
      }
    },

    toggleHighlight(gridIndex: number) {
      if (this.multiSelect) {
        const targetIndex = this.hlGrids.findIndex(i => i === gridIndex)
        if (targetIndex === -1) {
          this.hlGrids.push(gridIndex)
        } else {
          this.hlGrids.splice(targetIndex, 1)
        }
      } else {
        if (this.hlGrids[0] === gridIndex) {
          this.hlGrids = []
        } else {
          this.hlGrids = [gridIndex]
        }
      }
    },

    posToGrid(pos: number) {
      if (pos > 1) {
        pos = pos / this.width
      }
      const perGridWidth = this.width / this.gridNum
      return Math.floor((this.width * pos) / perGridWidth)
    },
    gridToPos(grid: number) {
      const perGridWidth = this.width / this.gridNum
      return [
        (grid * perGridWidth) / this.width,
        ((grid + 1) * perGridWidth) / this.width,
      ]
    },

    // Events
    canvasMouseClick(event: MouseEvent) {
      const canvas = this.$refs.hyCanvas as HTMLCanvasElement
      const rect = canvas.getBoundingClientRect()
      const x = (event.clientX - rect.left) / canvas.clientWidth
      const y = (event.clientY - rect.top) / canvas.clientHeight

      const gridIndex = this.posToGrid(x)
      const blindData = this.blindAreas.find(
        blindObj => blindObj.grid === gridIndex,
      )

      if (this.editingMode) {
        this.toggleHighlight(gridIndex)
      }

      this.$emit('mouseclick', {
        pos: [x, y],
        gridIndex: gridIndex,
        data: blindData,
        hlGrids: this.hlGrids,
      })
    },

    canvasMousemove(event: MouseEvent) {
      const canvas = this.$refs.hyCanvas as HTMLCanvasElement
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      this.curMouseX = (x / canvas.clientWidth) * canvas.width
      this.curMouseY = (y / canvas.clientHeight) * canvas.height
      if (this.hoverTips !== null) {
        this.drawTips(this.curMouseX, this.curMouseY)
      }
      this.$emit('mousemove', event)
    },

    canvasMouseleave(event: MouseEvent) {
      this.curMouseX = -1
      this.curMouseY = -1
      const tipsDom = this.$refs.tips as HTMLElement
      tipsDom.style.opacity = '0'
    },
  },
  watch: {
    imgUrl() {
      this.fetchImg()
    },
    highlightGrids(val) {
      this.hlGrids = val
    },
    editingMode(val) {
      if (val) {
        // View -> Editing
      } else {
        // Editing -> View
        this.hlGrids = []
      }
    },
  },
})
</script>
