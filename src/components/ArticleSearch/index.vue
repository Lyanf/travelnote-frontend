<template>
  <el-card>
    <div slot="header">
      <span>条件检索</span>
    </div>
    <el-row gutter="50">
      <el-col span="5">
        <el-input v-model="header" placeholder="请输入标题" />
      </el-col>
      <el-col span="5">
        <el-input v-model="name" placeholder="作者" />
      </el-col>
      <el-col span="10">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-col>
      <el-col span="4">
        <el-button type="primary" @click="searchClicked">检索</el-button>
        <el-button v-if="showExport" type="primary" @click="$emit('exportEvent')">导出</el-button>
      </el-col>
      <el-col span="4" />
    </el-row>
  </el-card>
</template>
<script>
var dateFormat = require('dateformat')
export default {
  name: 'ArticleSearch',
  props: ['showExport'],
  data: function() {
    return {
      header: '',
      name: '',
      date: ''
    }
  },
  methods: {
    searchClicked() {
      const obj = {}
      const t = {}
      t['header'] = this.header
      t['name'] = this.name
      t['date'] = this.date
      console.log(typeof t['date'])
      console.log(t['date'])
      for (const i in t) {
        if (t[i] !== '' && t[i] != null) {
          obj[i] = t[i]
        }
      }
      if (obj.hasOwnProperty('date')) {
        const date1 = dateFormat(t['date'][0], 'yyyy,mm,dd')
        const date2 = dateFormat(t['date'][1], 'yyyy,mm,dd')
        // t['date'] = [1, 2]
        obj['date'][0] = date1
        obj['date'][1] = date2
      }
      this.$emit('searchEvent', obj)
    }
  }
}
</script>
