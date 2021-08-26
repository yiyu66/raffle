<template>
  <div class="home">
    <!-- <h1>{{ msg }}</h1> -->
    <!-- <h1>{{ prizesList }}</h1> -->
    <!-- <ul>
        <li
          :ref="`item${val.order}`"
          :data-index="val.order"
          :class="val.order >= 1 ? 'rw' : ''"
          v-for="val in resultList"
          :key="val.prize_id"
        >
        <li :data-index="val.order" v-for="val in resultList" :key="val.order">
          <div v-if="val.order !== -9">
            <div class="name">{{ val.name }}</div>
          </div>
          <div v-else class="start" @click.stop.prevent="startGo"></div>
        </li>
      </ul> -->
    <div>
      <p style="font-size: 3em; color: blue; margin: 30px">用户余额:{{ UserBanace }}</p>
    </div>
    <div class="container">
      <div class="box" id="box0">{{ resultList[0].name }}</div>
      <div class="box" id="box1">{{ resultList[1].name }}</div>
      <div class="box" id="box2">{{ resultList[2].name }}</div>
      <div class="box" id="box7">{{ resultList[7].name }}</div>
      <div class="start" id="boxcenter">
        <el-button type="primary" id="startButton" @click="start" round>
          <p>开始抽奖</p>
          <p>10/次</p></el-button
        >
      </div>
      <div class="box" id="box3">{{ resultList[3].name }}</div>
      <div class="box" id="box6">{{ resultList[6].name }}</div>
      <div class="box" id="box5">{{ resultList[5].name }}</div>
      <div class="box" id="box4">{{ resultList[4].name }}</div>
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
          name: '奖品1',
          order: 1, // 顺序
          probability: 12.5,
        },
        {
          name: '奖品1',
          order: 2,
          probability: 12.5,
        },
        {
          name: '奖品1',
          order: 3,
          probability: 12.5,
        },
        {
          name: '奖品1',
          order: 4,
          probability: 12.5,
        },
        {
          name: '奖品1',
          order: 5,
          probability: 12.5,
        },
        {
          name: '奖品1',
          order: 6,
          probability: 12.5,
        },
        {
          name: '奖品1',
          order: 7,
          probability: 12.5,
        },
        {
          name: '奖品1',
          order: 8,
          probability: 12.5,
        },
      ],
      // 后端返回的抽奖结果
      raffle: {
        winNum: 0,
      },
      index: 0, //当前转动到哪个位置，起点位置
      stepDelay: 100, //初始转动速度 0.1s一步
      stepNum: 0,
      IntervalID: '',
      UserBanace: 200, // 存款，默认200
      isTurn: true, // 是否可以抽奖，后续加上余额判断
    }
  },
  created() {
    this.getRaffleList()
  },
  methods: {
    // 要考虑一个网络断开的情况、点击开始抽奖的时候禁用box
    start() {
      //this.stepNum = 40 + Math.ceil(Math.random() * 10) // 前端测试用JS模拟，抽奖结果由后端给出
      this.index = 0
      this.UserBanace -= 10
      document.getElementById('startButton').disabled = true
      this.getRaffleRes()
      this.IntervalID = setInterval(this.rotate, this.stepDelay)
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
        // alert('恭喜你中奖了！') // UI待修改
      } else {
        // 逐渐减速
        clearInterval(this.IntervalID)
        this.stepDelay = 1000 / this.stepNum
        this.IntervalID = setInterval(this.rotate, this.stepDelay)
      }
    },
    async getRaffleRes() {
      const res = await axios({
        url: 'http://localhost:3000/PrizeResult',
        method: 'get',
        responseType: 'json',
      })
        .then(function (response) {
          return response.data.Num
        })
        .catch(function (error) {
          console.log(error)
        })
      console.log('后台返回的抽奖结果是' + res)
      this.raffle.winNum = res
      this.stepNum = 40 + this.raffle.winNum
    },
    async getRaffleList() {
      const res = await axios({
        url: 'http://localhost:3000/RaffleList',
        method: 'get',
        responseType: 'json',
      })
        .then(function (response) {
          return response.data.resultList
        })
        .catch(function (error) {
          console.log('获取奖品列表失败：' + error)
        })
      this.resultList = res
      // this.PrizeList = res
      // console.log(this.PrizeList)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
  display: flex;
  /* align-content: center; */
  align-items: center; /* 垂直居中 */
  justify-content: center;
  background-color: #ccffff;
  margin: 0%;
}
.container {
  display: flex;
  width: 700px;
  height: 700px;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  border: 5px solid #6699cc;
  border-radius: 8%;
}
.container > .start {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15%;
  margin: 0%;
  width: 180px;
  height: 180px;
  border: 10px solid rgb(112, 176, 250);
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
  border-radius: 15%;
  margin: 0%;
  width: 180px;
  height: 180px;
  border: 10px solid rgb(112, 176, 250);
  background-color: rgb(255, 255, 255);
  text-align: center;
  line-height: 50px;
  margin-right: 15px;
  margin-top: 15px;
}
.box:hover {
  border: 10px solid red;
  z-index: 9999;
}
.start:hover {
  border: 10px solid rgb(233, 186, 58);
  z-index: 9999;
}

.boxActived {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15%;
  margin: 0%;
  width: 180px;
  height: 180px;
  border: 10px solid rgb(238, 85, 131);
  background-color: rgb(255, 255, 255);
  text-align: center;
  line-height: 50px;
  margin-right: 15px;
  margin-top: 15px;
}
</style>
