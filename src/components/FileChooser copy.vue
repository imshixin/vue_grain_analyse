<template>
  <div class="root">
    <el-upload class="upload" v-if="hasSelectFile" drag :on-change="onChooseFile" :auto-upload="false">
      <p style="color:blue;">Drop file here or click to upload</p>
      <template #tip>
        <p>选择一个excel文件</p>
      </template>
    </el-upload>
    <div class="tableContainer">
      <!-- <el-table :data="rows" border>
        <el-table-column v-for="i in columnCount" :prop="i"  />
      </el-table> -->
      <el-form label-width="180px">

        <el-form-item label="选择文件">
          <el-upload :on-change="onChooseFile" :auto-upload="false">
            <el-button>选择文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="选择一个工作表">
          <!-- @change="onSelectorChange" -->
          <el-select placeholder="请选择" v-model="selectDefaultValue">
            <el-option v-for="option in onSelectOptions" :key="option.value" :label="option.label"
              :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="粒径大小单元格范围">
          <el-col :span="11">
            <el-input />
          </el-col>
          <el-col :span="2">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="11">
            <el-input />
          </el-col>
        </el-form-item>
        <el-form-item label="分组名单元格范围">
          <el-col :span="11">
            <el-input />
          </el-col>
          <el-col :span="2">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="11">
            <el-input />
          </el-col>
        </el-form-item>
        <el-form-item label="数据单元格范围">
          <el-col :span="11">
            <el-input />
          </el-col>
          <el-col :span="2">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="11">
            <el-input />
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, computed, unref } from 'vue';
import { ElUpload, ElButton, ElTable, ElTableColumn, ElSelect, ElOption, ElForm, ElFormItem, ElInput, ElCol } from 'element-plus';
import { UploadFile, UploadFiles } from 'element-plus';
import * as exceljs from "exceljs"
import { isNumber, isString, toNumber, toString } from 'lodash';

interface MyWorkSheet {
  name: string,
  rowCount: number,
  columnCount: number,
  data: Array<Array<exceljs.Cell>>
}
interface CellIndex{
  row:number,
  column:number
}
const worksheets = ref<Array<exceljs.Worksheet>>([])
const hasSelectFile = ref<boolean>(false)
const columnCount = ref<number>(0);
const selectDefaultValue = ref("")
const rows = ref<Array<Array<string>>>([])

watch(worksheets, async () => {
  //设置默认表格
  rows.value = getTableData(worksheets.value[0])
})
const onSelectOptions = computed(() => {
  let arr = worksheets.value.map(v => {
    return { label: v.name, "value": v.id }
  })
  if (worksheets.value.length > 0)
    selectDefaultValue.value = arr[0].label
  return arr
})

const onChooseFile = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  console.log("size:", uploadFile.size)
  console.log("url:", uploadFile.raw)
  const workbook = new exceljs.Workbook()
  uploadFile.raw?.arrayBuffer().then((val) => {
    return workbook.xlsx.load(val)
  }).then((book) => {
    worksheets.value = book.worksheets
    hasSelectFile.value = false
  })
}
const onSelectorChange = (val: number) => {
  console.log('select new value:', val);
  rows.value = getTableData(worksheets.value.filter(v => v.id == val)[0])
}
const isFormularValue = (cell: exceljs.CellValue): cell is exceljs.CellFormulaValue => {
  return (<exceljs.CellFormulaValue>cell).formula !== undefined
}
const handleCellVaue = (cellValue: exceljs.CellValue): string => {
  if (isFormularValue(cellValue)) {
    let result = (<exceljs.CellFormulaValue>cellValue).result
    if (isNumber(result)) {
      return Math.round(result * 100) / 100 + ""
    }
    return result?.toString() || "0"
  }
  if (isNumber(cellValue)) {

    return String(Math.round(cellValue * 100) / 100)
  }
  if (isString(cellValue)) {
    return cellValue
  }
  console.log(cellValue);

  return ""
}
const getTableData = (worksheet: exceljs.Worksheet) => {
  columnCount.value = worksheets.value[0].columnCount
  let rows = [] as Array<Array<string>>
  for (let i = 1; i <= worksheet.rowCount; i++) {
    rows[i] = []
    worksheet.getRow(i).eachCell((cell, colNumber) => {

      rows[i][colNumber] = handleCellVaue(cell.value)
    })

    // cols.push([...worksheet.getRow(i).values as exceljs.CellValue[]])
  }
  return rows
}

</script>

<style scoped>
.root {
  width: 100%;
  height: 100%;
}

.upload {
  background-color: blueviolet;
  width: 100%;
  height: 100%;
}
</style>
