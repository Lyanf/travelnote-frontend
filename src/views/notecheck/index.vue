<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="稿件ID" width="200">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" label="稿件标题">
        <template slot-scope="{row}">
          <span>{{ row.header }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" label="作者ID">
        <template slot-scope="{row}">
          <span>{{ row.userid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" label="文章状态">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions">
        <template slot-scope="{row}">
          <el-button
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmDelete(row)"
          >
            删除
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="confirmTop(row)"
          >
            置顶
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchAllArticle } from '@/api/newtest.js'
import { changeArticleStatus, deleteArticle } from '@/api/newtest'

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
      list: null,
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
      // TODO:应该变成已经通过审核的文章
      const { data } = await fetchAllArticle()
      this.list = data['Article']
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
    confirmDelete(row) {
      deleteArticle(row.id)
      this.$message({
        message: '文章已经被删除',
        type: 'success'
      })
    },
    confirmTop(row) {
      changeArticleStatus(row.id, {
        'id': row.id,
        'header': row.header,
        'content': row.content,
        'date': row.date,
        'status': 4,
        'userid': row.userid
      })
      this.$message({
        message: '文章已经被置顶',
        type: 'success'
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
