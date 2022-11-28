<template>
  <el-scrollbar class="scroll-bar">
    <div class="extra-chart" :id="chartName" ref="extraChart">
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { debounce, isNil } from 'lodash';
import { ref, onMounted, watch, nextTick, inject, Ref, onUnmounted } from 'vue';
import { ElScrollbar } from 'element-plus';
import type { Category, GroupData } from '../scripts/tools'

const prop = defineProps<{
  index: number
  activePaneName: string,
  sizes: number[],
  categories: Category[]
}>()
const chartName = "extra-chart" + prop.index
const extraChart = ref()
const showSymbol = ref(true)
const currentTab = inject('currentTab') as Ref<string>
interface Dimension {
  width: number,
  height: number,
}
interface ChartPosition {
  x: number,
  y: number,
}
type ChartDetail = Category & ChartPosition
const chartConfig = {
  chartDim: {
    width: 250,
    height: 200
  },
  gap: 80,
  axisHeight: 20,
  margin: {
    left: 45,
    top: 15
  },
  row: 2
}
const clientDim = ref<Dimension>({
  width: 0,
  height: 0
})
const getGraphHeight = (chartDetail: ChartDetail[], chartDim: Dimension, gap: number, margin: number): number => {
  let maxY = 0
  chartDetail.forEach(v => {
    if (v.y > maxY)
      maxY = v.y
  })
  return maxY + chartDim.height + gap + margin
}
//获取对每个图标的位置坐标，确保不超出容器宽
const getChartDetail = (categories: Category[], chartDim: Dimension, clientDim: Dimension, gap: number, margin: { left: number, top: number }, row: number): ChartDetail[] => {
  let currentRowChartCount = 0//当前行的图表数
  let currentRowNo = 0//当前行数
  return categories.map((v, i) => {
    if (margin.left + chartDim.width * (currentRowChartCount + 1) + gap * (currentRowChartCount + 1) > clientDim.width) {//确保不超过容器宽
      currentRowNo += 1
      currentRowChartCount = 0
    }
    return {
      x: margin.left + chartDim.width * currentRowChartCount + gap * (currentRowChartCount++),
      y: margin.top + (chartConfig.chartDim.height + gap) * currentRowNo,
      ...v
    } as ChartDetail
  })
}

const chartDetail = ref(getChartDetail(prop.categories, chartConfig.chartDim, clientDim.value, chartConfig.gap, chartConfig.margin, chartConfig.row))
//窗口大小改变时resize图表
const resizeGraph = debounce((myChart: echarts.ECharts) => {
  if (!isNil(extraChart.value) && prop.index+''==currentTab.value&&prop.activePaneName=='extra') {
    console.log('listener size:', extraChart.value.clientWidth, extraChart.value.clientHeight )
    // console.log('Height::',getGraphHeight(chartDetail, chartConfig.chartDim, chartConfig.gap, chartConfig.margin.top));

    clientDim.value.width = extraChart.value.clientWidth
    clientDim.value.height = extraChart.value.clientHeight
    //更新图表位置
    chartDetail.value = getChartDetail(prop.categories, chartConfig.chartDim, clientDim.value, chartConfig.gap, chartConfig.margin, chartConfig.row)
    myChart.setOption(getGraphOption(chartDetail.value))
    //设置容器大小
    myChart.resize({
      width: extraChart.value.clientWidth,
      height: getGraphHeight(chartDetail.value, chartConfig.chartDim, chartConfig.gap, chartConfig.margin.top)
    })
  }else{
    console.log('extraChart.value is null');
  }
}, 10)
const getGraphOption = (chartDetail:ChartDetail[])=>{
  return {
    title: [...chartDetail.map(v => ({
      text: v.name,
      left: v.x + '',
      top: v.y + chartConfig.chartDim.height + chartConfig.axisHeight
    }))],
    tooltip: {
      type: 'line',
      trigger: 'item',
      axisPointer: {
        axis: 'x'
      }
    },
    // legend: [{
    //   orient: 'horizontal',
    //   selector: [{
    //     type: 'all',
    //     title: 'select all'
    //   }, {
    //     type: 'inverse',
    //     title: 'inverse'
    //   }],
    //   right: '5',
    //   top: '5',
    //   borderWidth: 1,
    //   borderRadius: 8,
    //   borderColor: '#00f',
    //   // data: tableHeaders.filter((v, i) => i != 0)
    // }],
    grid: [...chartDetail.map(v => ({
      left: v.x,
      top: v.y,
      width: chartConfig.chartDim.width,
      height: chartConfig.chartDim.height,
    }))],
    xAxis: [...chartDetail.map((v, index) => ({
      type: 'value',
      gridIndex: index,
      scale: true,
      splitLine: {
        show: false
      }
    }))],
    yAxis: [...chartDetail.map((v, index) => ({
      type: 'category',
      gridIndex: index,
      data: v.groupNames,
      splitLine: {
        show: true
      }
    }))],
    dataZoom: [{
      type: 'slider',
      xAxisIndex: [0],
      bottom: '2%'
    },],
    series: [...chartDetail.map((v, index) => {
      return {
        name: v.name,
        type: 'line',
        xAxisIndex: index,
        yAxisIndex: index,
        data: v.values,
        emphasis: {
          scale: 2,
          focus: 'series',
        },
        showSymbol: showSymbol.value,
        tooltip: {
          // formatter: toolTipFormatter,
          // valueFormatter:(v:number)=>v+'%'
        }
      }
    }),],
  }
}

let onWindowResize:()=>void|undefined
onMounted(() => {
  //初始化Echart
  const myChart = echarts.init(document.getElementById(chartName) as HTMLElement)
  myChart.setOption(getGraphOption(chartDetail.value))

  //切换标签后更新图表大小
  watch([() => prop.activePaneName, currentTab], () => {
    if (prop.activePaneName == 'extra') {//当前显示是额外图表时再刷新
      resizeGraph(myChart)
    }
  })
  //更改窗口大小后更新图表大小
  onWindowResize = ()=>resizeGraph(myChart)
  window.addEventListener('resize', onWindowResize)
})
//删除监听
onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
})

</script>

<style scoped>
.extra-chart {
  width: calc(100%);
  height: calc(100%);
}

/*
.scroll-bar,
::v-deep(.el-scrollbar__view) {
  position: relative;
  width: 100%;
  height: 100%;
} */
</style>
