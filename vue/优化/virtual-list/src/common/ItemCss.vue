<template>
  <div class="item" :style="itemStyle">
    <div class="index">
      #{{ index }}
    </div>
    <div class="card">
      <div class="card-avatar" :class="{'no-avatar': !avatar}" :style="{'background-color': !avatar && info.color}">
        <span v-if="!avatar">{{ getAbbrName(info.name) }}</span>
        <img v-else class="card-avatar-img" :src="info.avatar" alt="AVATAR">
      </div>
      <div class="card-info">
        <div class="card-info-item name" :style="{color: info.color}">
          {{ info.name }}
        </div>
        <div class="card-info-item time">
          Registered: {{ info.time }}
        </div>
      </div>
      <div v-if="variable" class="card-height">
        {{ height }}px
      </div>
    </div>
  </div>
</template>

<script>
import { getQuery } from './util'

export default {
  name: 'ItemCss',

  props: {
    height: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    },
    variable: Boolean,
    info: {
      type: Object,
      default: () => ({
        name: '',
        time: '',
        avatar: '',
        color: ''
      })
    }
  },

  data() {
    return {
      avatar: getQuery('avatar') !== null
    }
  },
  mounted() {
    if (this.index < 5) {
      console.log('item mounted')
    }
  },
  computed: {
    itemStyle() {
      return {
        'height': `${this.height}px`,
        'line-height': `${this.height}px`
      }
    }
  },

  methods: {
    getAbbrName(name) {
      const arr = name.split(' ')
      if (arr.length > 1) {
        return arr[0][0] + arr[1][0]
      } else {
        return name.substr(0, 2)
      }
    }
  }
}
</script>

<style>
.item {
  box-sizing: border-box;
  display: flex;
}
.index {
  flex: 1;
  text-align: center;
}
.card {
  position: relative;
  flex: 4;
  display: flex;
  align-items: center;
  border-bottom: 1px dashed #cecece;
}
.card-info {
  display: flex;
  flex-direction: column;
  padding-left: 40px;
}
.card-info-item {
  flex: 1;
  height: 50%;
  line-height: 1;
  position: relative;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 300px;
  overflow: hidden;
}
.card-info-item.name {
  padding-bottom: 3px;
}
.card-info-item.time {
  padding-top: 3px;
  color: #a9a9a9;
}
.card-height {
  position: absolute;
  right: 30px;
  font-style: italic;
  color: #999;
  font-weight: 100;
  font-family: sans-serif;
  font-size: 12px;
}
.card-avatar {
  width: 40px;
  height: 40px;
  background: #efefef;
  color: #4169e1;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
}
.card-avatar.no-avatar {
  background: #ff6347;
  color: #ffffff;
}
.card-avatar-img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
</style>
