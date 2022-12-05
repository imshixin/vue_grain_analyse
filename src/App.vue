<template>
    <div class="app">
        <el-menu class="menu" mode="horizontal" @select="onMenuSelect" :ellipsis="false" active-text-color="black">
            <el-menu-item index="0"><a href="https://github.com/imshixin/vue_grain_analyse" title="去Github">粒径分析（grain size analyse）</a></el-menu-item>
            <div style="flex-grow: 1;"></div>
            <el-menu-item index="1" class="new-data-btn">
                <el-button type="primary" size="large">
                    <iconfont icon="#icon-tianjia" size="18" /><span>增加数据</span>
                </el-button>
            </el-menu-item>
            <el-menu-item index="2">
                <iconfont icon="#icon-qiehuanyuyan" size="23" /> 选择语言
            </el-menu-item>
            <el-dialog class="file-chooser-dialog" v-model="isShowDialog">
                <file-chooser @import-new-data="onImportNewData" />
            </el-dialog>
        </el-menu>
        <el-tabs class="main-tabs" v-model="activePaneName" type="card">
            <el-tab-pane v-for="sheet, index in importedDatas" :label="sheet.fileName" :name="index + ''"
                class="my-tab-pane" closable="true" lazy="true">
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
provide('currentTab', activePaneName)//让chart判断当前标签再刷新，防止大小异常

const datas = [[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0.06, 0],
[0.06, 0.06, 0, 0.08, 0.07, 0.09, 0.07],
[0.08, 0.07, 0.02, 0.09, 0.08, 0.11, 0.09],
[0.09, 0.08, 0.05, 0.11, 0.1, 0.13, 0.11],
[0.1, 0.09, 0.06, 0.12, 0.11, 0.14, 0.12],
[0.11, 0.1, 0.09, 0.14, 0.12, 0.17, 0.14],
[0.12, 0.1, 0.1, 0.16, 0.14, 0.19, 0.15],
[0.13, 0.11, 0.11, 0.17, 0.14, 0.21, 0.16],
[0.14, 0.12, 0.11, 0.19, 0.15, 0.24, 0.17],
[0.15, 0.12, 0.12, 0.2, 0.15, 0.25, 0.17],
[0.15, 0.13, 0.12, 0.21, 0.15, 0.26, 0.16],
[0.15, 0.13, 0.12, 0.21, 0.14, 0.26, 0.15],
[0.14, 0.13, 0.12, 0.21, 0.13, 0.25, 0.14],
[0.13, 0.13, 0.12, 0.21, 0.12, 0.24, 0.14],
[0.12, 0.13, 0.12, 0.21, 0.12, 0.23, 0.14],
[0.1, 0.12, 0.14, 0.22, 0.13, 0.23, 0.16],
[0.09, 0.11, 0.16, 0.24, 0.16, 0.25, 0.2],
[0.09, 0.1, 0.2, 0.27, 0.2, 0.29, 0.25],
[0.1, 0.09, 0.24, 0.31, 0.25, 0.37, 0.32],
[0.12, 0.09, 0.29, 0.37, 0.3, 0.49, 0.4],
[0.15, 0.09, 0.34, 0.44, 0.35, 0.64, 0.47],
[0.19, 0.1, 0.39, 0.51, 0.38, 0.81, 0.52],
[0.23, 0.13, 0.42, 0.58, 0.4, 0.97, 0.53],
[0.26, 0.18, 0.45, 0.63, 0.39, 1.09, 0.51],
[0.27, 0.24, 0.49, 0.65, 0.36, 1.16, 0.47],
[0.27, 0.3, 0.56, 0.66, 0.35, 1.16, 0.45],
[0.24, 0.36, 0.69, 0.67, 0.37, 1.09, 0.5],
[0.22, 0.4, 0.94, 0.69, 0.48, 0.99, 0.7],
[0.22, 0.4, 1.32, 0.79, 0.71, 0.94, 1.11],
[0.3, 0.36, 1.89, 0.99, 1.09, 1.02, 1.79],
[0.53, 0.29, 2.64, 1.36, 1.63, 1.36, 2.77],
[0.95, 0.23, 3.56, 1.92, 2.33, 2.04, 4.02],
[1.62, 0.27, 4.59, 2.69, 3.12, 3.11, 5.43],
[2.57, 0.48, 5.66, 3.66, 3.95, 4.53, 6.88],
[3.78, 0.97, 6.68, 4.78, 4.72, 6.21, 8.19],
[5.2, 1.83, 7.55, 5.97, 5.38, 7.92, 9.19],
[6.69, 3.11, 8.19, 7.12, 5.87, 9.39, 9.72],
[8.12, 4.78, 8.52, 8.11, 6.19, 10.35, 9.7],
[9.29, 6.7, 8.5, 8.81, 6.37, 10.56, 9.12],
[10.02, 8.67, 8.12, 9.11, 6.46, 9.89, 8.02],
[10.19, 10.38, 7.39, 8.92, 6.5, 8.39, 6.55],
[9.74, 11.51, 6.36, 8.21, 6.51, 6.29, 4.88],
[8.69, 11.8, 5.1, 7.03, 6.47, 3.98, 3.21],
[7.16, 11.11, 3.72, 5.5, 6.29, 1.67, 1.67],
[5.36, 9.48, 2.38, 3.82, 5.9, 0.01, 0.34],
[3.53, 7.17, 1.15, 2.13, 5.22, 0, 0],
[1.74, 4.61, 0.11, 0.52, 4.22, 0, 0],
[0.33, 2.04, 0, 0, 3, 0, 0],
[0, 0.01, 0, 0, 1.74, 0, 0],
[0, 0, 0, 0, 0.48, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],]
const groupNames = ['L-036', 'L-009', 'L-041', 'L-002', 'L-012', 'L-000', 'L-003']
const sizes = [0.01, 0.011, 0.013, 0.015, 0.017, 0.019, 0.022, 0.024, 0.028, 0.032, 0.036, 0.041, 0.046, 0.053, 0, 0.068, 0.077, 0.088, 0.1, 0.113, 0.128, 0.146, 0.166, 0.188, 0.214, 0.243, 0.276, 0.314, 0.357, 0.405, 0.46, 0.523, 0.594, 0.675, 0.767, 0.872, 0.991, 1.125, 1.279, 1.453, 1.651, 1.875, 2.131, 2.421, 2.75, 3.125, 3.55, 4.034, 4.583, 5.207, 5.916, 6.722, 7.637, 8.677, 9.858, 11.201, 12.726, 14.458, 16.427, 18.664, 21.205, 24.092, 27.373, 31.1, 35.335, 40.146, 45.613, 51.823, 58.88, 66.897, 76.006, 86.355, 98.114, 111.473, 126.652, 143.897, 163.49, 185.752, 211.044, 239.78, 272.43, 309.525, 351.67, 399.555, 453.96, 515.772, 586.001, 665.793, 756.449, 859.45, 976.475, 1109.435, 1260.499, 1432.133, 1627.136, 1848.692, 2100.416, 2386.415, 2711.357]
importedDatas.push({fileName:'Course.xlsx',groupNames,datas,sizes})
activePaneName.value = '0'
const onImportNewData = (data: DataSheet) => {

    console.log(data);
    importedDatas.push(data)
    isShowDialog.value = false
    // nextTick(()=>{
    activePaneName.value = importedDatas.length - 1 + ''
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

::v-deep(.el-dialog) {
    min-width: 460px;
    max-width: 680px;
    /* --el-dialog-width: 410px; */
}

.main-tabs {
    height: calc(100vh - 57px);
}

.el-menu {
    align-items: center;
}

li.new-data-btn {
    height: auto;
    align-self: stretch;
}

.main-tabs::v-deep>.el-tabs__content {
    box-sizing: content-box;
    /* padding: 8px; */
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
    height: calc(100% - 41px - 15px);
}

.my-tab-pane {
    height: 100%;
}
</style>
