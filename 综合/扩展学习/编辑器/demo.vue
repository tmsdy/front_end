<template>
  <div class="">
    <div id="toolbar">
      <span class="ql-formats">
        <select class="ql-font"></select>
        <select class="ql-size"></select>
      </span>
      <span class="ql-formats">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <button class="ql-strike"></button>
      </span>
      <span class="ql-formats">
        <select class="ql-color"></select>
        <select class="ql-background"></select>
      </span>
      <span class="ql-formats">
        <button class="ql-script" value="sub"></button>
        <button class="ql-script" value="super"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-header" value="1"></button>
        <button class="ql-header" value="2"></button>
        <button class="ql-blockquote"></button>
        <button class="ql-code-block"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>
        <button class="ql-indent" value="-1"></button>
        <button class="ql-indent" value="+1"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-direction" value="rtl"></button>
        <select class="ql-align"></select>
      </span>
      <span class="ql-formats">
        <button class="ql-link"></button>
        <button class="ql-image"></button>
        <button class="ql-video"></button>
        <button class="ql-formula"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-clean"></button>
      </span>
    </div>
    <div id="editor">
      <p>Hello World!</p>
      <p>Some initial <strong>bold</strong> text</p>
      <p><br></p>
    </div>
    <img ref="my_image" class="img_item" src="https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike180%2C5%2C5%2C180%2C60/sign=8cd29262982397ddc274905638ebd9d2/cf1b9d16fdfaaf511a342a3a855494eef11f7a64.jpg" />
  </div>
</template>

<script>
function drawImage(ImgD,FitWidth,FitHeight){
     var image=new Image();
     image.src=ImgD.src;
     if(image.width>0 && image.height>0){
         if(image.width/image.height>= FitWidth/FitHeight){
             if(image.width>FitWidth){
                 ImgD.width=FitWidth;
                 ImgD.height=(image.height*FitWidth)/image.width;
             }else{
                 ImgD.width=image.width; 
                ImgD.height=image.height;
             }
         } else{
             if(image.height>FitHeight){
                 ImgD.height=FitHeight;
                 ImgD.width=(image.width*FitHeight)/image.height;
             }else{
                 ImgD.width=image.width; 
                ImgD.height=image.height;
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
    const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'], //开关按钮
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }], //自定义按钮值
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }], // 上标/下标
      [{ 'indent': '-1' }, { 'indent': '+1' }], // 减少缩进/缩进
      [{ 'direction': 'rtl' }], // 文本方向
      [{ 'size': ['small', false, 'large', 'huge'] }], // 自定义下拉
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }], //使用主题的默认下拉
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'], //移除格式化
      ['image'],
      ['video'],
    ];
    var quill = new Quill('#editor', {
      modules: {
        imageResize: {},
        toolbar: toolbarOptions
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
.img_item{
  width: 300px;
  height: 260px
}
</style>

