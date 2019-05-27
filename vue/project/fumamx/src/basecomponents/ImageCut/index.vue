<template>
    <div class="ImageCut" ref="ImageCut">
        <div class="container" ref="container">
            <!--<div>
                    <img id="image" alt="Picture">
                </div>-->
        </div>
        <div class="btn">
            <span @click="cancel">取消</span>
            <span @click="cropClick">确定</span>
        </div>
    </div>
</template>

<script>
import 'cropperjs/dist/cropper.min.css'
import Cropper from 'cropperjs'
function getRoundedCanvas (sourceCanvas) {
  var canvas = document.createElement('canvas')
  var context = canvas.getContext('2d')
  var width = sourceCanvas.width
  var height = sourceCanvas.height

  canvas.width = width
  canvas.height = height

  context.imageSmoothingEnabled = true
  context.drawImage(sourceCanvas, 0, 0, width, height)
  context.globalCompositeOperation = 'destination-in'
  context.beginPath()
  context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true)
  context.fill()

  return canvas
}
export default {
  name: 'ImageCut',
  data () {
    return {
      isImageCut: false,
      cropper: null,
      getDataURL: ''
    }
  },
  created () {

  },
  mounted () {
    // var image = document.getElementById('image');
    // var croppable = false;
    // var cropper = new Cropper(image, {
    //     aspectRatio: 1,
    //     viewMode: 1,
    //     ready: function() {
    //         croppable = true;
    //     }
    // });

    /*
        var getDataURL = function() {
            var croppedCanvas;
            var roundedCanvas;

            if (!croppable) {
                return;
            }

            // Crop
            croppedCanvas = cropper.getCroppedCanvas();

            // Round
            roundedCanvas = getRoundedCanvas(croppedCanvas);

            // Show
            return roundedCanvas.toDataURL();
        }; */
  },
  methods: {
    show (url) {
      let _this = this
      _this.$refs['ImageCut'].style.display = 'block'
      let container = _this.$refs['container']
      container.innerHTML = ''
      let image = document.createElement('img')
      image.className = 'image'
      let div = document.createElement('div').appendChild(image)
      container.appendChild(div)
      image.src = url
      image.onload = function (e) {
        _this.croppable = false
        _this.cropper = new Cropper(image, {
          aspectRatio: 1,
          viewMode: 1,
          ready: function () {
            _this.croppable = true
          }
        })
      }
    },
    cropClick () {
      let _this = this
      var croppedCanvas
      var roundedCanvas
      if (!_this.croppable) {
        return
      }
      // Crop
      croppedCanvas = _this.cropper.getCroppedCanvas()
      // Round
      roundedCanvas = getRoundedCanvas(croppedCanvas)
      // Show
      this.$emit('listenImgUrl', roundedCanvas.toDataURL())
      this.cancel()
    },
    cancel () {
      this.$refs['ImageCut'].style.display = 'none'
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.ImageCut {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0px;
    top: 0px;
    z-index: 10;
    overflow: hidden;
    display: none;
    .container {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        background-color: #cccccc;
    }
    .btn {
        position: absolute;
        top: 15px;
        right: 15px;
        >span {
            margin: 5px 0 0 10px;
            padding: 6px 15px;
            background: #008cee;
            color: #fff;
            border-radius: 3px;
            opacity: .8;
        }
        >span:first-child {
            background-color: #999;
        }
        >span:hover {
            opacity: 1;
            cursor: pointer;
        }
    }
}
</style>
