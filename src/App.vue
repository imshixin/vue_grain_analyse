<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Headers from './components/Header.vue'
import MainPage from './components/MainPage.vue'
import FileChooser from './components/FileChooser.vue';
import { ElButton } from 'element-plus';

const openFileChooser = ()=>{


}
</script>

<template>
    <!-- <Headers/> -->
    <!-- <MainPage/> -->
    <!-- <el-button type="primary" @click="openFileChooser"/> -->
    <file-chooser></file-chooser>
</template>

<style scoped>

</style>
