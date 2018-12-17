<template>
  <div>

    <el-tabs :tab-position="tabPosition"
      style="height: 200px;">
      <el-tab-pane label="分类管理">
          <el-tree 
            :data="categories"
            :default-expand-all="true"
            :show-checkbox="true"
            :draggable="true">
            <!-- slot-scope: 根据el-tree的data类循环生成span，在循环生成过程中传入两个变量：node,data -->
            <span class="custom-tree-node" slot-scope="{node,data}">
                <span>{{data.label}}</span>
                <span>
                    <el-button
                        type="text"
                        size="mini"
                        @click.stop="addCategory(data.id)">
                        添加新分类    
                    </el-button>
                    <el-button
                        type="text"
                        size="mini"
                        @click.stop="removeCategory(node,data)">
                        删除新分类    
                    </el-button>
                </span>
            </span>

          </el-tree>
      </el-tab-pane>
      <el-tab-pane label="添加分类">添加分类</el-tab-pane>
    </el-tabs>
    
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Category extends Vue {
  categories: Array<any> = [
    {
      id: 1,
      label: "一级 1",
      children: [
        {
          id: 4,
          label: "二级 1-1",
          children: [
            {
              id: 9,
              label: "三级 1-1-1"
            },
            {
              id: 10,
              label: "三级 1-1-2"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      label: "一级 2",
      children: [
        {
          id: 5,
          label: "二级 2-1"
        },
        {
          id: 6,
          label: "二级 2-2"
        }
      ]
    },
    {
      id: 3,
      label: "一级 3",
      children: [
        {
          id: 7,
          label: "二级 3-1"
        },
        {
          id: 8,
          label: "二级 3-2"
        }
      ]
    }
  ];
  addCategory(){

  }
  removeCategory(){

  }
}
</script>

<style>
.el-tree-node__content {
  padding: 10px;
}
.custom-tree-node {
  display: inline-flex;
  width: 100%;
  justify-content: space-between;
}
</style>
