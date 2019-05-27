<template>
    <div class="tagTreeComponents">
        <div class="tags" @click="showTree()">
            <div class="tag" v-for="(item,index) in departments" :key="index">{{item.deptName}}</div>
            <div class="close" @click="close()">×</div>
        </div>
        <div class="department MXscroll" v-show="departmentBox">
            <el-tree :data="data" node-key="dCode" :props="treeprops" ref="addTree" show-checkbox :check-strictly="true" @check-change="checkChange"></el-tree>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    treeprops: {
      type: Object,
      default: function () {
        return {}
      }
    },
    change: {
      type: Function,
      default: function () {

      }
    }
  },
  data () {
    return {
      departmentBox: false,
      departments: []
    }
  },
  mounted () {
    let _this = this
    document.addEventListener('click', function (e) {
      if (e.target.className != 'tags' && e.target.className != 'close') {
        _this.departmentBox = false
      }
      if (e.target.className == 'tag') {
        _this.departmentBox = true
      }
    }, false)
  },
  methods: {
    showTree () {
      this.departmentBox = true
    },
    checkChange (data, node, element) {
      let treeData = this.$refs.addTree.getCheckedNodes()
      this.departments = treeData
      // this.change(treeData);
      this.$emit('change', treeData)
    },
    close () {
      this.departments = []
      this.$refs.addTree.setCheckedKeys([])
    },
    // 通过 node 设置,设置节点选中，接收节点数组
    setCheckedNodes (checkedNodes) {
      this.$refs.addTree.setCheckedNodes(checkedNodes)
    },
    // 通过 key 设置,设置节点选中，接收节点key数组
    setCheckedKeys (Keys) {
      this.$refs.addTree.setCheckedKeys(Keys)
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.tagTreeComponents {
    .tags {
        border: 1px #ccc solid;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #bfcbd9;
        box-sizing: border-box;
        color: #1f2d3d;
        width: 100%;
        min-height: 32px;
        padding-right: 20px;
        padding-bottom: 2px;
        outline: 0;
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .tag {
            display: block;
            float: left;
            height: 25px;
            line-height: 25px;
            padding: 0px 3px;
            background-color: rgba(0, 0, 0, 0.1);
            border: 1px #ccc solid;
            border-radius: 3px;
            font-size: 12px;
            margin-top: 2px;
            margin-left: 5px;
        }
        .close {
            width: 30px;
            height: 36px;
            position: absolute;
            right: 0px;
            text-align: center;
            top: 0px;
        }
    }
    .department {
        border:1px solid #ddd;
        border-top:none;
        // width: 100%;
        // position: absolute;
        max-height: 150px;
        overflow-y: auto;
        // margin-bottom: 20px;
        z-index: 1;
    }
}
</style>
