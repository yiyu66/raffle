<template>
  <div class="container">
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
          <el-input placeholder="设置初始矿石数" v-model="initialMoney">
            <el-button slot="append" @click="setInitialMoney(initialMoney)">确定</el-button>
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
        <el-table-column prop="probability" label="中奖概率(%)"> </el-table-column>
        <el-table-column prop="mg_state" label="选择(最多8个)">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template v-slot="scope">
            <!--操作按钮  -->
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.name)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.name)"
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
      <el-form :model="addForm" ref="addFormRef" label-width="70px">
        <el-form-item label="奖品名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="中奖概率(%)" prop="probability">
          <el-input v-model="addForm.probability"></el-input>
        </el-form-item>
        <el-form-item label="奖品图片" prop="image">
          <el-input v-model="addForm.image"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addprize">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改中奖概率对话框 -->
    <el-dialog title="中奖概率" :visible.sync="editdialogVisible" @close="editDialogClosed" width="50%">
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="中奖概率(%)">
          <el-input v-model="editForm.probability"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPrizeInfo">确 定</el-button>
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
        pagesize: 5,
      },
      initialMoney:'',
      PrizeList: [],
      total: 0,
      addDialogVisible: false,
      PrizeInfo: {},
      selectedPrizeId: '',
      addForm: {},
      editdialogVisible: false,
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
        url: '/RaffleList', // 暂时共用一个接口
        method: 'get',
        responseType: 'json',
      }).catch(function (error) {
          console.log('获取奖品列表失败')
        })
      this.PrizeList = res.data.RaffleList.resultList
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
        url: '/updatePrizeState',
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
    // 添加奖品
    async addprize() {
      const formObj = JSON.stringify(this.addForm)
      const res = await axios({
        url: '/addprize',
        method: 'post',
        responseType: 'json',
        data: {
          formObj,
        },
      })
        .then(function (response) {
          return response
        })
        .catch(function (error) {
          return error
        })
      console.log(res.data)
      this.addDialogVisible = false
      this.getPrizeList()
    },
    // 删除奖品
    async removeUserById(id) {
      const deleteRes = await this.$confirm('永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)

      if (deleteRes !== 'confirm') {
        this.$message.info('已经取消删除')
      } else {
        const res = await axios({
          url: '/deletePrize',
          method: 'delete',
          responseType: 'json',
          data: { id },
        })
        console.log(res.data)
      }

      this.getPrizeList()
    },
    async setInitialMoney(initialMoney) {
        const res = await axios({
          url: '/setInitialMoney',
          method: 'post',
          responseType: 'json',
          data: { initialMoney },
        })
        console.log(res.data)
    },

    async showEditDialog(id) {
      this.editForm.name = id
      this.editdialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    async editPrizeInfo() {
      const formObj = JSON.stringify(this.editForm)
      const res = await axios({
        url: '/updateProbability',
        method: 'post',
        responseType: 'json',
        data: {
          formObj,
        },
      })
      console.log(res.data)
      this.editdialogVisible = false
      this.getPrizeList()
    },
  },
}
</script>

<style scoped>
.container {
  margin: 30px;
}
</style>
