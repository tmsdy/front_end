<template>

    <div class="mx_wrap" @click.stop="" :class="show_off?'show':''">

      <div class="mx_box" @click="show_off=!show_off">
        <div class="mx_inner">
            <div class="mx_selected"  v-for="item,index in options" v-if="item._selected">
              <span class="gray_text">{{item.label}}</span>
              <img class="del_icon" @click="options[index]._selected=false" src="./../assets/images/del.png">
            </div>
        </div>
        <div class="rotate_icon"></div>
      </div>

      <div class="mx_dropdown_wraper" >
        <div class="mx_dropdown_item" @click="selectItem(index)" :class="item._selected?'selected':''" v-for="item,index in options" data-index="index">
          <span class="selected_text">{{item.label}}</span>
          <img class="right_icon" src="./../assets/images/selected.png" >
        </div>
      </div>

    </div>

</template>

<script>
export default {
  name: 'MultipleXz',
  props:[
    'options'
  ],
  data () {
    return {
      show_off:false
    }
  },
  mounted(){
    document.documentElement.onclick =  (e)=> {
      this.show_off = false
    }
  },
  methods:{
    selectItem(index){
      this.options[index]._selected = !this.options[index]._selected ;
      this.show_off = false
    }
  }
}
</script>

<style lang="less" scoped>

  .mx_wrap{
    width: 240px;
    margin: 40px auto;
    .mx_box {
      width: 100%;
      min-height: 40px;
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      box-sizing: border-box ;
      line-height: 40px;
      display: flex;
      align-items: center;
      .mx_inner{
        width: 208px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding-bottom: 3px;
        .mx_selected{
          height: 24px;
          display: flex;
          align-items: center;
          padding: 0 4px 0 8px;
          border-radius: 4px;
          margin: 3px 0 0 6px;
          background-color: #f0f2f5;
          .gray_text {
            max-width: 58px;
            font-size: 12px;
            color: #909399;
            margin-right: 6px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .del_icon {
            width: 16px;
            height: 16px;
          }
        }
      }
      .rotate_icon {
        width: 8px;
        height: 8px;
        margin-left: 6px;
        border-right: 2px solid #cdcdcd;
        border-bottom: 2px solid #cdcdcd;
        transform-origin: 6px 6px;
        transform: rotate(45deg);
        transition: 0.4s;
      }
    }
    &.show .mx_box{
      border-color: #409eff;
    }
    &.show .rotate_icon{
      transform: rotate(-135deg);
    }

    .mx_dropdown_wraper{
      width: 240px;
      margin-top: 10px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      box-sizing: border-box;
      transform-origin: 0 0;
      transform: scaleY(0);
      transition: 0.4s;
      opacity: 0;
      .mx_dropdown_item{
        width: 100%;
        padding: 0 20px;
        height: 34px;
        line-height: 34px;
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        align-items: center;
        .selected_text{
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #606266;
          margin-right: auto;
        }
        .right_icon {
          width: 14px;
          height: 14px;
          opacity: 0;
          transition: 0.3s;
        }
        &:hover{
          background-color: #f5f7fa;
        }
        &.selected .selected_text{
          color: #409eff;
          font-weight: 700;
        }
        &.selected .right_icon{
          opacity: 1;
        }
      }
    }
    &.show .mx_dropdown_wraper{
      transform: scaleY(1);
      opacity: 1;
    }
  }


</style>
