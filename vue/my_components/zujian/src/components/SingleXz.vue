<template>
	<div class="sx_box" @click.stop="" :class="show_off?'show':''">
		<div class="sx_select" @click="show_off=!show_off">
			<span class="sx_value">{{options[i].label}}</span>
			<div class="rotate_icon"></div>
		</div>
		<div class="sx_dropdown_wraper">
			<div class="sx_dropdown_item"
			     :class="i==index?'selected':''"
			     @click="i==index"
			     v-for="item,index in options">{{item.label}}</div>
		</div>
	</div>
</template>

<script>
  export default {
    name: "SingleXz",
    props:[
      'options'
    ],
    data () {
      return {
        show_off:false,
        i:0
      }
    },
    mounted(){
      document.documentElement.onclick =  (e)=> {
        this.show_off = false
      }
    },
  }
</script>

<style lang="less" scoped>
	.sx_box {
		width: 225px;
		height: 40px;
		margin: 40px auto;
		box-sizing: border-box;
		cursor: pointer;
		position: relative;
		.sx_select{
			width: 100%;
			padding-left: 15px;
			box-sizing: border-box;
			border-radius: 4px;
			border: 1px solid #DCDFE6;
			.sx_value {
				line-height: 40px;
				font-size: 16px;
				color: #666;
			}
			.rotate_icon {
				position: absolute;
				right: 12px;
				top:  12px;
				width: 8px;
				height: 8px;
				border-right: 2px solid #999;
				border-bottom: 2px solid #999;
				transform-origin: 6px 6px;
				transform: rotate(45deg);
				transition: 0.4s;
			}
		}
		&.show .sx_select{
			border-color: #409eff;
		}
		&.show .rotate_icon{
			transform: rotate(-135deg);
		}
		.sx_dropdown_wraper{
			width: 100%;
			position: absolute;
			left: 0;
			top: 46px;
			z-index: 120;
			border: 1px solid #e4e7ed;
			border-radius: 4px;
			background-color: #fff;
			box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
			box-sizing: border-box;
			transform-origin: 0 0;
			transform: scaleY(0);
			transition: 0.4s;
			opacity: 0;
			.sx_dropdown_item{
				width: 100%;
				font-size: 14px;
				padding: 0 20px;
				position: relative;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				color: #606266;
				height: 34px;
				line-height: 34px;
				box-sizing: border-box;
				cursor: pointer;
				&:hover{
					background-color: #f5f7fa;
				}
				&.selected{
					color: #409eff;
					font-weight: 700;
				}
			}
		}
		&.show .sx_dropdown_wraper{
			transform: scaleY(1);
			opacity: 1;
		}
	}


</style>