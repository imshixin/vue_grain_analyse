<template>
    <div class="app">
        <el-menu class="menu" mode="horizontal" @select="onMenuSelect" :ellipsis="false" active-text-color="black">
            <el-menu-item index="0">粒径分析（grain size analyse）</el-menu-item>
            <div style="flex-grow: 1;"></div>
            <el-menu-item index="1" class="new-data-btn">
                <el-button type="primary" size="large" plain><iconfont icon="#icon-tianjia" size="18"/><span>增加数据</span></el-button>
            </el-menu-item>
            <el-menu-item index="2"><iconfont icon="#icon-qiehuanyuyan" size="26"/> 选择语言</el-menu-item>
            <el-dialog class="file-chooser-dialog" v-model="isShowDialog">
                <file-chooser @import-new-data="onImportNewData"/>
            </el-dialog>
        </el-menu>
        <el-tabs class="main-tabs" v-model="activePaneName" type="card" >
            <el-tab-pane v-for="sheet,index in importedDatas" :label="sheet.fileName" :name="index+''" class="my-tab-pane" closable="true" lazy="true">
                <graph-page v-bind="sheet" :index="index"></graph-page>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import FileChooser from './components/FileChooser.vue';
import GraphPage from './components/GraphPage.vue'
import iconfont from './components/Iconfont.vue';
import { ElButton, ElDialog, ElMenu, ElMenuItem, ElTabs, ElTabPane } from 'element-plus';
import { provide, reactive, ref } from 'vue';
import { DataSheet } from './scripts/tools';

const importedDatas = reactive([] as DataSheet[])
const isShowDialog = ref(false)
const activePaneName = ref("")
provide('currentTab',activePaneName)//让chart判断当前标签再刷新，防止大小异常

const onImportNewData = (data:DataSheet)=>{

    console.log(data);
    importedDatas.push(data)
    isShowDialog.value=false
    // nextTick(()=>{
        activePaneName.value=importedDatas.length-1+''
    // })
}
const onMenuSelect = (key: string, keyPath: string[]) => {
    switch (key) {
        case '1':
            isShowDialog.value = true
            break
    }
}
</script>

<style scoped>
li.el-menu-item,
li.el-menu-item.is-active {
    border-bottom: none !important;
    user-select: none;
    background-color: rgb(255, 255, 255);
}

::v-deep(.el-dialog){
    --el-dialog-width: 410px;
}
.main-tabs {
    height: calc(100vh - 57px);
}
.el-menu{
    align-items: center;
}
.main-tabs::v-deep > .el-tabs__content {
    box-sizing: content-box;
    /* padding: 8px; */
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
    height: calc(100% - 41px - 15px);
}
.my-tab-pane{
    height: 100%;
}
</style>
