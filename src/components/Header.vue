<script setup lang="ts">
import { ElMenu,ElMenuItem, ElButton } from 'element-plus'

const goBack = () => {
  console.log('go back')
}
</script>

<template>
  <el-menu mode="horizontal" :ellipsis="false" class="el-menu-demo" >
    <el-menu-item index="0">数据处理</el-menu-item>
    <el-menu-item index="1">打开文件</el-menu-item>
  </el-menu>
</template>


<style>

</style>
