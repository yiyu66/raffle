<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>奖品管理</el-breadcrumb-item>
      <el-breadcrumb-item>奖品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->

      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getPrizeList">
            <el-button slot="append" icon="el-icon-search" @click="getPrizeList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加奖品</el-button>
        </el-col>
      </el-row>
      <!-- 奖品列表区域 -->
      <el-table :data="PrizeList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="name" label="奖品名称"> </el-table-column>
        <el-table-column prop="prizeimage" label="奖品图片"> </el-table-column>
        <el-table-column prop="mg_state" label="选择(最多8个)">
          <!-- 最多选8个 -->
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template v-slot="scope">
            <!--操作按钮  -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加奖品的对话框 -->
    <el-dialog title="添加奖品" :visible.sync="addDialogVisible" width="30%" @close="addDiadlogClosed">
      <!-- 内容主体 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="奖品名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="奖品图片" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addprize">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      // 奖品列表参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5, // 每页显示多少项
      },
      PrizeList: [],
      total: 0,
      addDialogVisible: false,
      PrizeInfo: {},
      selectedPrizeId: '', // 已选中的id
      // 添加表单数据
      addForm: {},
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入奖品名称',
            trigger: 'blur',
          },
        ],
        password: [{ required: true, message: '请输入奖品图片', trigger: 'blur' }],
      },
      // 查询奖品数据
      editForm: {},
    }
  },
  created() {
    this.getPrizeList()
  },
  methods: {
    // 更新奖品列表
    async getPrizeList() {
      const res = await axios({
        url: 'http://localhost:3000/PrizeList',
        method: 'get',
        responseType: 'json',
      })
        .then(function (response) {
          return response.data.resultList
        })
        .catch(function (error) {
          console.log('获取奖品列表失败')
        })
      this.PrizeList = res
      console.log(this.PrizeList);
    },
    // 翻页功能函数
    handleSizeChange(newpageSize) {
      this.queryInfo.pagesize = newpageSize
      this.getPrizeList()
    },
    handleCurrentChange(newpageNum) {
      this.queryInfo.pagenum = newpageNum
      this.getPrizeList()
    },
    // 更新奖品状态，后台接口待添加
    async userStateChange() {
      const res = await axios({
        url: 'http://localhost:3000/updatePrizeState',
        method: 'post',
        responseType: 'json',
        data: {
          // 被选中的8个奖品列表
        },
      })
        .then(function (response) {
          return response.data
        })
        .catch(function (error) {
          return this.$message.erro('获取奖品列表失败')
        })
      console.log(res)
    },
    //   监听对话框关闭
    addDiadlogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加奖品 --- 这里不需要验证表单了，后续可以删掉
    addprize() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const res = await axios({
          url: 'http://localhost:3000/PrizeList',
          method: 'get',
          responseType: 'json',
        })
          .then(function (response) {
            return response.data
          })
          .catch(function (error) {
            return this.$message.erro('添加奖品失败')
          })
      })
      this.addDialogVisible = false
      this.getPrizeList()
    },
    // 删除奖品
    async removeUserById(id) {
      const deleteRes = await this.$confirm('永久删除该奖品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          console.log(deleteRes)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })

      const res = await axios({
        url: 'http://localhost:3000/deletePrize',
        method: 'delete',
        responseType: 'json',
        data: {},
      })
        .then(function (response) {
          this.$message.success('删除成功')
          return response.data
        })
        .catch(function (error) {
          return this.$message.erro('删除奖品失败')
        })
      this.getPrizeList()
    },
  },
}
</script>

<style lang="less" scoped>
</style>
