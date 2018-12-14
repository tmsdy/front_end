<template>
  <div class="http404">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" :src="img404" alt="404">
        <img class="pic-404__child left" :src="img404Cloud" alt="404">
        <img class="pic-404__child mid" :src="img404Cloud" alt="404">
        <img class="pic-404__child right" :src="img404Cloud" alt="404">
            </div>
        <div class="bullshit">
          <div class="bullshit__oops">OOPS!</div>
          <div class="bullshit__headline">{{ message }}</div>
          <div class="bullshit__info">请检查您输入的网址是否正确，请点击以下按钮返回主页或者发送错误报告</div>
          <a @click="backWelcome"
            class="bullshit__return-home">返回首页</a>
        </div>
      </div>
    </div>
</template>

<script>
import img404 from '@/assets/img/404.png'
import img404Cloud from '@/assets/img/404_cloud.png'
import c from '@/config'

export default {
  data() {
    return {
      img404,
      img404Cloud,
    }
  },
  methods: {
    backWelcome() {
      this.$router.replace({ name: c.ROUTER_NAME_HOME })
    },
  },
  computed: {
    message() {
      return '这个页面不存在的..'
    },
  },
}
</script>
<style lang="stylus">
.http404 {
  background: #f0f2f5;
  margin-top: -20px;
  // height: 100%;
  // display: flex;
  // flex-direction: row;
  // align-items: center;
}

.wscn-http404 {
  position: relative;
  width: 1200px;
  margin: 20px auto 60px;
  padding: 0 100px;
  overflow: hidden;
}

.wscn-http404 .pic-404 {
  position: relative;
  float: left;
  width: 600px;
  padding: 150px 0;
  overflow: hidden;
}

.wscn-http404 .pic-404__parent {
  width: 100%;
}

.wscn-http404 .bullshit {
  position: relative;
  float: left;
  width: 300px;
  padding: 150px 0;
  overflow: hidden;
}

.wscn-http404 .pic-404__child {
  position: absolute;
}

.wscn-http404 .pic-404__child.right {
  width: 62px;
  top: 100px;
  left: 500px;
  opacity: 0;
  -webkit-animation-name: cloudRight;
  animation-name: cloudRight;
  -webkit-animation-duration: 2s;
  animation-duration: 2s;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
}

.wscn-http404 .pic-404__child.mid {
  width: 46px;
  top: 10px;
  left: 420px;
  opacity: 0;
  -webkit-animation-name: cloudMid;
  animation-name: cloudMid;
  -webkit-animation-duration: 2s;
  animation-duration: 2s;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-delay: 1.2s;
  animation-delay: 1.2s;
}

.wscn-http404 .pic-404__child.left {
  width: 80px;
  top: 17px;
  left: 220px;
  opacity: 0;
  -webkit-animation-name: cloudLeft;
  animation-name: cloudLeft;
  -webkit-animation-duration: 2s;
  animation-duration: 2s;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
}

// .bullshit__return-home {
// position: relative;
// display: inline-block;
// padding: 1.2em 2em;
// text-decoration: none;
// text-align: center;
// cursor: pointer;
// user-select: none;
// color: white;

// &::before {
// content: '';
// position: absolute;
// top: 0;
// left: 0;
// bottom: 0;
// right: 0;
// background: linear-gradient(135deg, #6e8efb, #a777e3);
// border-radius: 4px;
// transition: box-shadow 0.5s ease, transform 0.2s ease;
// will-change: transform;
// box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
// transform: translateY(var(--ty, 0)) rotateX(var(--rx, 0)) rotateY(var(--ry, 0)) translateZ(var(--tz, -12px));
// }

// &:hover::before {
// box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
// }

// &::after {
// position: relative;
// display: inline-block;
// content: attr(data-title);
// transition: transform 0.2s ease;
// font-weight: bold;
// letter-spacing: 0.01em;
// will-change: transform;
// transform: translateY(var(--ty, 0)) rotateX(var(--rx, 0)) rotateY(var(--ry, 0));
// }
// }
@keyframes cloudLeft {
  0% {
    top: 17px;
    left: 220px;
    opacity: 0;
  }

  20% {
    top: 33px;
    left: 188px;
    opacity: 1;
  }

  80% {
    top: 81px;
    left: 92px;
    opacity: 1;
  }

  100% {
    top: 97px;
    left: 60px;
    opacity: 0;
  }
}

@keyframes cloudMid {
  0% {
    top: 10px;
    left: 420px;
    opacity: 0;
  }

  20% {
    top: 40px;
    left: 360px;
    opacity: 1;
  }

  70% {
    top: 130px;
    left: 180px;
    opacity: 1;
  }

  100% {
    top: 160px;
    left: 120px;
    opacity: 0;
  }
}

@keyframes cloudRight {
  0% {
    top: 100px;
    left: 500px;
    opacity: 0;
  }

  20% {
    top: 120px;
    left: 460px;
    opacity: 1;
  }

  80% {
    top: 180px;
    left: 340px;
    opacity: 1;
  }

  100% {
    top: 200px;
    left: 300px;
    opacity: 0;
  }
}
</style>
