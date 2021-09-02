<template>
  <div>
    <div class="home">
      <div class="prize-text">幸运抽奖</div>
      <div class="money">当前金币值：{{ UserBanace }}</div>
      <div class="container">
        <div class="upper-border">
          <div class="circle corner"></div>
          <div class="circle hollow"></div>
          <div class="circle center"></div>
          <div class="circle hollow"></div>
          <div class="circle corner"></div>
        </div>
        <div class="lower-border">
          <div class="circle corner"></div>
          <div class="circle hollow"></div>
          <div class="circle center"></div>
          <div class="circle hollow"></div>
          <div class="circle corner"></div>
        </div>
        <div class="left-border">
          <div class="circle corner"></div>
          <div class="circle hollow"></div>
          <div class="circle center"></div>
          <div class="circle hollow"></div>
          <div class="circle corner"></div>
        </div>
        <div class="right-border">
          <div class="circle corner"></div>
          <div class="circle hollow"></div>
          <div class="circle center"></div>
          <div class="circle hollow"></div>
          <div class="circle corner"></div>
        </div>
        <div class="box" id="box0">
          <img src="../components/img/66矿石.png" />
          <div>{{ resultList[0].name }}</div>
        </div>
        <div class="box" id="box1">
          <img src="../components/img/随机限量徽章.png" />
          <div>{{ resultList[1].name }}</div>
        </div>
        <div class="box" id="box2">
          <img src="../components/img/掘金T恤.png" />
          <div>{{ resultList[2].name }}</div>
        </div>
        <div class="box" id="box7">
          <img src="../components/img/乐高海洋巨轮.png" />
          <div>{{ resultList[7].name }}</div>
        </div>
        <div class="start" id="boxcenter">
          <el-button class="startButton" id="startButton" @click="start" round>
            <p>抽奖</p>
            <p>40/次</p></el-button
          >
        </div>
        <div class="box" id="box3">
          <img src="../components/img/switch.png" />
          <div>{{ resultList[3].name }}</div>
        </div>
        <div class="box" id="box6">
          <img src="../components/img/yoyo抱枕.png" />
          <div>{{ resultList[6].name }}</div>
        </div>
        <div class="box" id="box5">
          <img src="../components/img/掘金马克杯.png" />
          <div>{{ resultList[5].name }}</div>
        </div>
        <div class="box" id="box4">
          <img src="../components/img/bug.png" />
          <div>{{ resultList[4].name }}</div>
        </div>
      </div>

      <!-- 中奖提示对话框 -->
      <el-dialog title="抽奖结果" :visible.sync="dialogVisible" width="30%" center>
        <span>恭喜你获得了:{{ raffle.prizename }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="historyListBox">
      <ul class="historyListClass">
        <li v-for="item in historyList" v-bind:key="item.prizename">
          恭喜 {{ item.username }} 抽中了奖品 {{ item.prizename }} {{ item.time }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'RaffleBlock',
  props: {
    msg: String,
    prizesList: String,
  },
  data() {
    return {
      // 先在本地预制一个奖品列表
      resultList: [
        {
          name: '66矿石',
          order: 1,
          probability: 12.5,
          prizeimage: '待添加 ',
        },
        {
          name: '随机限量徽章',
          order: 2,
          probability: 12.5,
          prizeimage: '待添加',
        },
        {
          name: '掘金T恤',
          order: 2,
          probability: 12.5,
          prizeimage: '待添加',
        },
        {
          name: 'switch',
          order: 3,
          probability: 12.5,
          prizeimage: '待添加',
        },
        {
          name: 'bug',
          order: 4,
          probability: 12.5,
          prizeimage: '待添加',
        },
        {
          name: '掘金马克杯',
          order: 5,
          probability: 12.5,
          prizeimage: '待添加',
        },
        {
          name: 'yoyo抱枕',
          order: 6,
          probability: 12.5,
          prizeimage: '待添加',
        },
        {
          name: '乐高海洋巨轮',
          order: 7,
          probability: 12.5,
          prizeimage: '待添加',
        },
        // {
        //   name: 'AK47 | 二西莫夫',
        //   order: 1, // 顺序
        //   probability: 0.1,
        // },
        // {
        //   name: 'AWP | 巨龙传说',
        //   order: 2,
        //   probability: 0.05,
        // },
        // {
        //   name: 'M4A4 | 咆哮',
        //   order: 3,
        //   probability: 0.03,
        // },
        // {
        //   name: '给你点个赞',
        //   order: 4,
        //   probability: 40,
        // },
        // {
        //   name: '棱彩武器箱',
        //   order: 5,
        //   probability: 40,
        // },
        // {
        //   name: 'M9刺刀 | 多普勒',
        //   order: 6,
        //   probability: 0.01,
        // },
        // {
        //   name: '运动手套 | 潘多拉魔盒',
        //   order: 7,
        //   probability: 0.01,
        // },
        // {
        //   name: '给你点个赞',
        //   order: 8,
        //   probability: 19.8,
        // },
      ],
      // 后端返回的抽奖结果
      raffle: {
        prizename: '',
        winNum: 0,
      },
      historyList: {},
      index: 0, //当前转动到哪个位置，起点位置
      stepDelay: 100, //初始转动速度 0.1s一步
      stepNum: 0,
      IntervalID: '',
      UserBanace: '读取中。。。',
      dialogVisible: false,
    }
  },
  created() {
    this.getRaffleList()
    this.getUserBanace()
    this.getHistoryList()
  },
  methods: {
    // 获取用户余额
    async getUserBanace() {
      const res = await axios({
        url: '/getUserBanace',
        method: 'get',
        responseType: 'json',
      }).catch(function (err) {
        console.log('获取用户余额失败')
      })
      this.UserBanace = res.data.UserBanace
    },
    // 更新用户余额
    async setUserBanace() {
      const res = await axios({
        url: '/setUserBanace',
        method: 'post',
        responseType: 'json',
        data: {
          UserBanace: this.UserBanace,
        },
      }).catch(function (err) {
        console.log('上传用户余额失败')
      })
      this.UserBanace = res.data.UserBanace
    },

    async start() {
      // 点击按钮检测用户余额是否充足
      await this.getUserBanace()
      if (this.UserBanace < 10) {
        alert('余额不足')
        return
      }
      this.setUserBanace()
      //this.stepNum = 40 + Math.ceil(Math.random() * 10) // 前端测试用JS模拟，抽奖结果由后端给出
      this.index = 0
      document.getElementById('startButton').disabled = true
      await this.getRaffleRes()
      if (this.raffle.winNum >= 0 && this.raffle.winNum <= 7) {
        // 考虑网络断开的情况
        this.IntervalID = setInterval(this.rotate, this.stepDelay)
        console.log(this.raffle.winNum)
      } else {
        document.getElementById('startButton').disabled = false
        this.UserBanace += 10
        alert('抽奖结果获取错误')
      }
    },
    rotate() {
      // 复原老格子style
      let boxID = 'box' + this.index
      let boxOld = document.getElementById(boxID)
      boxOld.className = 'box'
      if (this.index === 7) {
        this.index = -1
      }
      // 更新当前格子style
      boxID = 'box' + ++this.index
      var boxNow = document.getElementById(boxID)
      boxNow.className = 'boxActived'
      this.stepNum--
      if (this.stepNum === 0) {
        clearInterval(this.IntervalID)
        this.index = 0
        document.getElementById('startButton').disabled = false
        this.dialogVisible = true
        this.getHistoryList()
      } else {
        clearInterval(this.IntervalID)
        this.stepDelay = 1000 / this.stepNum
        this.IntervalID = setInterval(this.rotate, this.stepDelay)
      }
    },
    // 获取抽奖结果
    async getRaffleRes() {
      const res = await axios({
        url: '/PrizeResult',
        method: 'get',
        responseType: 'json',
      }).catch(function (error) {
        return error
      })
      console.log(res)
      this.raffle.winNum = res.data.order
      this.raffle.prizename = res.data.name
      this.stepNum = 40 + this.raffle.winNum
    },
    // 获取历史抽奖数据
    async getHistoryList() {
      const res = await axios({
        url: '/HistoryList',
        method: 'get',
        responseType: 'json',
      }).catch(function (error) {
        return error
      })
      this.historyList = res.data.historyList.historyList
    },

    // 获取抽奖列表
    async getRaffleList() {
      const res = await axios({
        url: '/RaffleList',
        method: 'get',
        responseType: 'json',
      }).catch(function (error) {
        console.log('获取奖品列表失败：' + error)
      })
      this.resultList = res.data.RaffleList.resultList
      console.log(this.resultList)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
  display: flex;
  flex-direction: column;
  /* align-content: center; */
  align-items: left;
  /* justify-content: center; */
  /* background-color: #1b55ee; */
}
.historyListBox {
  position: absolute;
  transform: translate(800px, -630px);
  background-color: #759cf3;
  width: 550px;
  height: 500px;
  border-radius: 30px;
}
.container {
  transform: scale(0.7);
  display: flex;
  width: 660px;
  height: 660px;
  background-color: #e37815;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  border: 50px solid #fadc94;
  border-radius: 15%;
  margin-top: 5%;
  margin-left: 5%;
  box-shadow: inset 16px #f5a700;
}
.container > .start {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15%;
  margin: 0%;
  width: 180px;
  height: 180px;
  /* border: 10px solid rgb(112, 176, 250); */
  background-color: rgb(255, 255, 255);
  text-align: center;
  line-height: 50px;
  margin-right: 15px;
  margin-top: 15px;
}
.box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 30px;
  /* margin: 0%; */
  /* margin: 5.33px; */
  width: 180px;
  height: 180px;
  /* border: 10px solid rgb(112, 176, 250); */
  background-color: rgb(255, 255, 255);
  /* text-align: center; */
  line-height: 50px;
  margin-right: 15px;
  margin-top: 15px;
}
.box:hover {
  /* border: 10px solid red; */
  box-shadow: inset 0 0 16px #ffa800;
  z-index: 9999;
}
.start:hover {
  /* border: 10px solid rgb(233, 186, 58); */
  z-index: 9999;
}
.boxActived {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 15%;
  margin: 0%;
  width: 180px;
  height: 180px;
  text-align: center;
  line-height: 50px;
  margin-right: 15px;
  margin-top: 15px;
  background-color: #ffa800;
  box-shadow: inset 0 0 16px #ffe6a6;
}
.startButton {
  width: 180px;
  height: 180px;
  background-color: #ffe6a6;
  box-shadow: inset 0 0 16px #ffa800;
  align-items: center;
  font-weight: bold;
  font-size: 30px;
  color: #a74b00;
  cursor: pointer;
}
.prize-text {
  position: absolute;
  color: #ffa800;
  border-radius: 5px;
  margin: 30px 500px;
  font-size: 50px;
  font-weight: 1000;
}
.money {
  position: absolute;
  transform: translate(230px, 100px);
  margin-top: 30px;
  padding-left: 10px;
  font-size: 20px;
  color: #fff;
}
.upper-border,
.lower-border,
.left-border,
.right-border {
  position: absolute;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
}
.upper-border {
  transform: translateY(-50px);
  margin-left: -25px;
  flex-direction: row;
  height: 12px;
  width: 550px;
}
.lower-border {
  transform: translateY(660px);
  margin-left: -25px;
  flex-direction: row;
  height: 12px;
  width: 550px;
}

.left-border {
  transform: translateX(-365px);
  margin-top: 50px;
  flex-direction: column;
  height: 550px;
  width: 12px;
}
.right-border {
  transform: translateX(345px);
  margin-top: 50px;
  flex-direction: column;
  height: 550px;
  width: 12px;
}
.circle {
  border-radius: 50%;
  box-sizing: border-box;
  margin-top: 10px;
  display: block;
  width: 30px;
  height: 30px;
}
.corner {
  background-color: #e37815;
}
.hollow {
  transform: translate(100%px);
  background-color: transparent;
  border: solid white 2px;
}
.center {
  background-color: white;
}
img {
  width: 80%;
  height: 60%;
}
.historyListClass {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1.5rem;
  color: #fff;
}
</style>
