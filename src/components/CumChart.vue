<template>
  <div class="cum-chart" :id="chartName" ref="cumChart">

  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { isNil } from 'lodash'
import { ref, onMounted, watch, nextTick, inject, Ref } from 'vue'
import type { GroupData } from '../scripts/tools'
const prop = defineProps<{
  groups: GroupData[],
  sizes: number[],
  activePaneName: string,
  index:number
}>()
const chartName = "cum-chart"+prop.index
const cumChart = ref<HTMLElement | null>(null)
const showSymbol = ref(true)
const currentTab = inject('currentTab') as Ref<string>
onMounted(() => {
  // myChart.dispatchAction()
  const myChart = echarts.init(document.getElementById(chartName) as HTMLElement)
  myChart.setOption({
    title: [{
      text: "grain size distribution curve",
      top: '1%',
      left: '5%'
    },],
    tooltip: {
      type: 'line',
      trigger: 'item',
      axisPointer: {
        axis: 'x'
      }
    },
    legend: [{
      orient: 'horizontal',
      selector: [{
        type: 'all',
        title: 'select all'
      }, {
        type: 'inverse',
        title: 'inverse'
      }],
      width: '',
      right: '5%',
      top: '1%',
      borderWidth: 1,
      borderRadius: 8,
      borderColor: '#000',
      // data: tableHeaders.filter((v, i) => i != 0)
    }],
    grid: [{
      // width: '100%',
      // height: '100%',
      left: '5%',
      right: '5%',
      top: '10%',
      bottom: '11%'
    },],
    xAxis: [{
      type: 'category',
      data: prop.sizes,
    },],
    yAxis: [{
      type: 'value',
      // max:20
      maxInterval: 10
    },],
    dataZoom: [{
      type: 'slider',
      xAxisIndex: [0],
      bottom: '2%'
    }, {
      type: 'inside',
      xAxisIndex: [0],
    },],
    series: [...prop.groups.map(v => {
      return {
        name: v.groupName,
        type: 'line',
        data: v.cumData,
        emphasis: {
          scale: 2,
          focus: 'series',
        },
        smooth: true,
        showSymbol: showSymbol.value,
        tooltip: {
          // formatter: toolTipFormatter,
          // valueFormatter:(v:number)=>v+'%'
        }
      }
    }),],
  })

  watch([() => prop.activePaneName,currentTab], () => {
    if (prop.activePaneName == 'cumulative') {
      nextTick(() => {
        myChart.resize()
      })
    }
  })
  if(!isNil(cumChart)){
    cumChart.value?.addEventListener('resize',() => { myChart.resize() })
  }
  window.addEventListener('resize', () => { myChart.resize() })
})

</script>

<style scoped>
.cum-chart {
  width: calc(100%);
  height: calc(100%);
}
</style>
