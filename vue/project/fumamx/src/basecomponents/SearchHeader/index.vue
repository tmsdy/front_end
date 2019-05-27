<template>
    <div class="SearchHeader">
        <input type="text" class="searchInput" placeholder="搜索 ..." @click="showBody">
        <transition name="slide-fade">
            <div class="searchBody" v-show="isActive">
                <h4>你可能想找
                    <small>（点击以下按钮操作）</small>：</h4>
                <ul>
                    <li>
                        查邮件
                    </li>
                    <li>
                        查邮件
                    </li>
                    <li>
                        查邮件
                    </li>
                    <li>
                        查邮件
                    </li>
                    <li>
                        查邮件
                    </li>
                    <li>
                        查邮件
                    </li>
                    <li>
                        查邮件
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script>
/**
 * 描述：通用=>顶部搜索模块
 * 作者：向士健
 * 时间：2017/7/3
 */
export default {
  name: 'SearchHeader',
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      isActive: false
    }
  },
  created () {

  },
  mounted () {
    // 点击其他隐藏
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) this.isActive = false
    })
  },
  methods: {
    showBody: function () {
      this.isActive = !this.isActive
    }
  },
  components: {
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.SearchHeader {
    width: 230px;
    height: 100%;
    float: right;
    position: relative;

    .searchInput {
        background-color: #ccc;
        width: 100%;
        height: 24px;
        position: absolute;
        top: 50%;
        margin-top: -12px;
        text-indent: 10px;
        border-radius: 4px;
        border: 1px solid transparent;
        outline: 0;
        font-size: 12px;
    }

    .searchBody {
        width: 300px;
        min-height: 100px;
        background-color: #fff;
        position: absolute;
        top: 48px;
        z-index: 10;
        padding: 10px 15px;
        border-radius: 5px;
        box-shadow: 1px 2px 7px #777;
        >h4 {
            font-weight: normal;
            color: #666;
            padding-bottom: 3px;
        }
        >ul li {
            display: inline-block;
            margin: 10px 8px 5px 0;
        }
        >ul li a {
            color: #fff;
            background: #475E69;
            padding: 3px 10px;
            border-radius: 4px;
            font-size: 13px;
        }
        >ul li a:hover {
            background-color: #222D32;
        }
    }
}
</style>
