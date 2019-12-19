<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="游记ID" width="200">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="游记名称" width="200">
        <template slot-scope="{row}">
          <span>{{ row.header }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="作者ID" width="200">
        <template slot-scope="{row}">
          <span>{{ row.userid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分配审稿人" width="200">
        <template slot-scope="{row}">
          <el-select v-model="row.checkerid">
            <el-option v-for="item in allChecker" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions">
        <template slot-scope="{row}">
          <!--          <el-button-->
          <!--            v-if="row.edit"-->
          <!--            type="success"-->
          <!--            size="small"-->
          <!--            icon="el-icon-circle-check-outline"-->
          <!--            @click="confirmEdit(row)"-->
          <!--          >-->
          <!--            Ok-->
          <!--          </el-button>-->
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="confirmEdit(row)"
          >
            提交
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { changeArticleStatus, distributeChecker, fetchAllChecker, fetchHaveNoChecker } from '@/api/newtest'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      allChecker: [],
      list: null,
      originData: [],
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await fetchHaveNoChecker()
      const items = data['Article']
      const originDataStr = JSON.stringify(items)
      this.originData = JSON.parse(originDataStr)
      const checkers = await fetchAllChecker()
      this.allChecker = checkers['data']['User']
      console.log(this.allChecker)
      this.list = items.map(v => {
        this.$set(v, 'checkerid', '暂未分配') // https://vuejs.org/v2/guide/reactivity.html
        return v
      })
      this.listLoading = false
    },
    cancelEdit(row) {
      row.title = row.originalTitle
      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      const that = this
      distributeChecker({
        'articleid': row.id,
        'checkerid': row.checkerid,
        'complete': 0,
        'content': '尚未审核'
      }).then(response => {
        changeArticleStatus(row.id, {
          'id': row.id,
          'header': row.header,
          'content': row.content,
          'date': row.date,
          'status': 1,
          'userid': row.userid
        }).then(response => {
          that.getList()
          that.$message({
            message: '审稿人分配成功',
            type: 'success'
          })
        })
      })
    }
  }
}
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
