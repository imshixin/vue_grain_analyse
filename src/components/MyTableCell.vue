<template>
  <div>
    <div v-if="isArray(detail)" @click="onCellClick">
      <div v-if="!isShowEdit">
        <span class="size-span">{{ detail[0] }}μm</span> - <span
          class="size-span">{{ detail[1] }}μm</span>
      </div>
      <div v-else class="input-container">
        <el-col :span="11">
          <el-input v-model="detail[0]" @blur="onCellBlur" ref="input" @change="onValueChange0">
            <template #append>μm</template>
          </el-input>
        </el-col>
        <el-col :span="1" style="text-align: center;">-</el-col>
        <el-col :span="11">
          <el-input v-model="detail[1]" @blur="onCellBlur" ref="input" @change="onValueChange1">
            <template #append>μm</template>
          </el-input>
        </el-col>
      </div>
    </div>
    <div v-else @click="onCellClick">
      <div v-if="!isShowEdit">
        <div>{{ detail }}%</div>
      </div>
      <div v-else class="input-container">
        <el-input v-model="detail" @blur="onCellBlur" ref="input" @change="onValueChange">
          <template #append>%</template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isArray, isNumber } from 'lodash';
import { ref, reactive, nextTick, unref } from 'vue';
import { CategoryDetail } from '../scripts/tools';
import { ElInput, ElCol } from 'element-plus';
const prop = defineProps<{
  scope: {
    row: CategoryDetail,
    $index: number,
  }
}>()
const detail = ref(prop.scope.row.rangeOrPercent)
const isShowEdit = ref(false)
const input = ref()
const onCellClick = () => {
  isShowEdit.value = true
  nextTick(() => input.value.focus())

}
const onCellBlur = () => {
  isShowEdit.value = false
}
const onValueChange = (v:string)=>{
  if(!isNumber(v)){
    detail.value = prop.scope.row.rangeOrPercent
  }
}
const onValueChange0 = (v:string)=>{
  if(!isNumber(v)&&isArray(prop.scope.row.rangeOrPercent)&&isArray(detail.value)){
    detail.value[0] = prop.scope.row.rangeOrPercent[0]
  }
}
const onValueChange1 = (v:string)=>{
  if(!isNumber(v)&&isArray(prop.scope.row.rangeOrPercent)&&isArray(detail.value)){
    detail.value[1] = prop.scope.row.rangeOrPercent[1]
  }
}
</script>

<style scoped>
.input-container{
  display: flex;
}
.size-span {
  border: 1px solid rgb(215 203 203);
  border-radius: 4px;
  background-color: rgb(248 248 248);
  padding: 1px 3px 1px;
  margin: 0 2px;
}
::v-deep(.el-input-group__append){
  padding: 0 3px 0;
}
</style>
