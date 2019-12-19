<template>
  <div class="app-container">
    <el-table v-loading="false" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="id" width="200">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" label="name">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.name" class="edit-input" size="small" />
          </template>
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" label="password">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.password" class="edit-input" size="small" />
          </template>
          <span>{{ row.password }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" label="permission">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.permission" class="edit-input" size="small" />
          </template>
          <span>{{ row.permission }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            Ok
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="js">
import { fetchAllUser, updateUser } from '@/api/newtest'

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
      list: [],
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
      console.log('现在开始')
      this.listLoading = true
      let { data } = await fetchAllUser()
      data = data['User']
      const items = data
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalTitle = v.title //  will be used when user click the cancel botton
        return v
      })
      this.list = data
      console.log(this.list.length)
      console.log(this.list)
      this.listLoading = false
    },
    confirmEdit(row) {
      row.edit = false
      // row.originalTitle = row.title
      updateUser(row.id, {
        'id': row.id,
        'password': row.password,
        'name': row.name,
        'permission': row.permission
      })
      this.$message({
        message: '修改成功！',
        type: 'success'
      })
      console.log(this.list)
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
