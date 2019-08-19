<template>
  <div class="">
    <div id="editor">
      <p>Hello World!</p>
      <p>Some initial <strong>bold</strong> text</p>
      <p><br></p>
    </div>
  </div>
</template>

<script>
function drawImage(ImgD, FitWidth, FitHeight) {
  var image = new Image();
  image.src = ImgD.src;
  if (image.width > 0 && image.height > 0) {
    if (image.width / image.height >= FitWidth / FitHeight) {
      if (image.width > FitWidth) {
        ImgD.width = FitWidth;
        ImgD.height = (image.height * FitWidth) / image.width;
      } else {
        ImgD.width = image.width;
        ImgD.height = image.height;
      }
    } else {
      if (image.height > FitHeight) {
        ImgD.height = FitHeight;
        ImgD.width = (image.width * FitHeight) / image.height;
      } else {
        ImgD.width = image.width;
        ImgD.height = image.height;
      }
    }
  }
}
export default {
  name: 'demo',
  data() {
    return {
      msg: 'hello feifei'
    }
  },
  mounted() {
    console.log(this.$refs.my_image)
    // const toolbarOptions = [
    //   ['bold', 'italic', 'underline', 'strike'], //开关按钮
    //   ['blockquote', 'code-block'],
    //   [{ 'header': 1 }, { 'header': 2 }], //自定义按钮值
    //   [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    //   [{ 'script': 'sub' }, { 'script': 'super' }], // 上标/下标
    //   [{ 'indent': '-1' }, { 'indent': '+1' }], // 减少缩进/缩进
    //   [{ 'direction': 'rtl' }], // 文本方向
    //   [{ 'size': ['small', false, 'large', 'huge'] }], // 自定义下拉
    //   [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    //   [{ 'color': [] }, { 'background': [] }], //使用主题的默认下拉
    //   [{ 'font': [] }],
    //   [{ 'align': [] }],
    //   ['clean'], //移除格式化
    //   ['image'],
    //   ['video'],

    // ];
    const toolbarOptions = {
      handlers: {
        'table-body': function (val) {
          this.quill.getModule('table').insertTable(2, 2) // this引用工具栏实例, val表示按钮是否处于活动状态active
        },
        'table-insert-rows': function () {
          this.quill.getModule('table').insertRowBelow()
        },
        'table-insert-columns': function () {
          this.quill.getModule('table').insertColumnRight()
        },
        'table-delete-rows': function () {
          this.quill.getModule('table').deleteRow()
        },
        'table-delete-columns': function () {
          this.quill.getModule('table').deleteColumn()
        },
        'table-delete-body': function () {
          this.quill.getModule('table').deleteTable()
        }
      }
    }
    var quill = new Quill('#editor', {
      modules: {
        // imageResize: {},
        toolbar: toolbarOptions
        // toolbar: {
        //   container: toolbarOptions
        // }
        // toolbar: "#toolbar"
      },
      theme: 'snow'
    });
  },
  methods: {

  },
  components: {

  }
}
</script>
<style>
.img_item {
  width: 300px;
  height: 260px;
}
</style>

