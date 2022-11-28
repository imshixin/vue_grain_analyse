<template>
  <div class="graph-page" ref="graphPage">
    <el-tabs type="border-card" v-model="activePaneName" tab-position="left" class="graph-tabs" >
      <el-tab-pane label="分布" name="distribution" class="my-tab-pane" lazy="true">
        <dist-chart :index="prop.index" :groups="groups" :sizes="prop.sizes" :active-pane-name="activePaneName"/>
      </el-tab-pane>
      <el-tab-pane  label="累计" name="cumulative" class="my-tab-pane" lazy="true">
        <cum-chart :index="prop.index" :groups="groups" :sizes="prop.sizes" :active-pane-name="activePaneName"/>
      </el-tab-pane>
      <el-tab-pane label="额外" name="extra" class="my-tab-pane">
        <extra-chart :index="prop.index" :categories="categories" :groups="groups" :sizes="prop.sizes" :active-pane-name="activePaneName"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import DistChart from './DistChart.vue'
import CumChart from './CumChart.vue'
import ExtraChart from './ExtraChart.vue'
import { ElTabs, ElTabPane } from 'element-plus'
import { ref, reactive, onMounted, watch, } from 'vue'
import { generateGroups, generateCategory } from '../scripts/tools'
import { GroupData, CategoryDetail} from '../scripts/tools'
// import { regression } from 'echarts-stat'

const prop = defineProps<{
  groupNames:string[],//组名
  sizes:number[],//粒径
  datas:number[][],//数据
  index:number//当前标签索引
}>()
const graphPage = ref<HTMLElement|null>(null)
const activePaneName = ref("distribution")
const groups = generateGroups(prop.datas, prop.groupNames)
//需要的粒径范围，数组表示粒径对应累计值，数字代表特征粒径
const categoryNames=['clay', 'fine silt', 'medium silt', 'coarse silt', 'fine sand', 'coarse sand', 'fine gravel', 'd50']
const reqiureCategories = [[0,2],[2,6],[6,20],[20,63],[63,200],[200,600],[600,2000],50] as ([number,number]|number)[]
const categoryDetails = categoryNames.map((v,i)=>({name:v,rangeOrPercent:reqiureCategories[i]} as CategoryDetail))
const categories = categoryDetails.map(v=>generateCategory(groups,prop.sizes,v.name,v.rangeOrPercent))
// console.log(generateCategory(groups,prop.sizes,'fine silt',[2,6]));

</script>

<style scoped>
.graph-page ,.my-tab-pane{
  width: 100%;
  height: 100%;
}

.el-tabs--left,
::v-deep(.el-tabs__content) {
  height: calc(100%);
}
::v-deep(.el-tabs--border-card>.el-tabs__content){
  padding: 0;
}
</style>
