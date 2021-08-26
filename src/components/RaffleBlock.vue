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
    <div class="prize-text">
        幸运抽奖
    </div>
    <div class="money">
        当前金币值：∞
    </div>
    <div class="wheel-container" style="width: 500px; height:500px">
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
        <div class="prize-container">
            <div class="prize">
                <img src="./img/ak47-asiimov.jpg" class="image">
                <p>AK47 | 二西莫夫</p>
            </div>
            <div class="prize">
                <img src="./img/awp-dragon.jpeg" class="image">
                <p>AWP | 巨龙传说</p>
            </div>
            <div class="prize">
                <img src="./img/m4a4-howl.jpeg" class="image">
                <p>M4A4 | 咆哮</p>
            </div>
            <div class="prize">
                <img src="./img/nothing.jpeg" class="image">
                <p>给你点个赞</p>
            </div>
            <div class="lottery">
                <p>抽奖</p>
            </div>
            <div class="prize">
                <img src="./img/nothing.jpeg" class="image">
                <p>给你点个赞</p>
            </div>
            <div class="prize">
                <img src="./img/m9-doppler.jpeg" class="image">
                <p>M9刺刀 | 多普勒</p>
            </div>
            <div class="prize">
                <img src="./img/pandora-gloves.jpeg" class="image">
                <p>运动手套 | 潘多拉魔盒</p>
            </div>
            <div class="prize">
                <img src="./img/fracture-case.jpeg" class="image">
                <p>棱彩武器箱</p>
            </div>
        </div>
        <div class="prize-window">
            <p>恭喜你，你获得了</p>
            <img id="prize-image" src="">
            <p id="prize-content"></p>
        </div>
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
  background-color: rgb(27, 118, 209);
}

.prize-text, .money, .wheel-container {
    margin-left: 500px;
    color: rgb(230, 232, 217);
}

.prize-text::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 20px;
    background-color: orange;
    border-radius: 5px;
}

.prize-text {
    margin-top: 100px;
    font-size: 30px;
}

.money {
    margin-top: 20px;
    padding-left: 10px;
    font-size: 20px;
}

.wheel-container {
    margin-top: 50px;
    width: 100%;
    height: 100%;
    border-radius: 30px;
    background-color: #fadd95;
    box-shadow: inset 0 0 16px orange;
}

.upper-border, .lower-border, .left-border, .right-border {
    position: absolute;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
}

.upper-border, .lower-border {
    margin-left: -25px;
    flex-direction: row;
    height: 12px;
    width: 550px;
}

.left-border, .right-border {
    margin-top: -30px;
    flex-direction: column;
    height: 550px;
    width: 12px;
}

.upper-border {
    margin-top: 5px;
}

.lower-border {
    margin-top: 445px;
}

.left-border {
    margin-left: 15px;
}

.right-border {
    margin-left: 455px;
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

.prize-container, .prize-window, .prize-window.show {
    position: absolute;
    margin: 50px;
    width: 400px;
    height: 400px;
    border-radius: 30px;
    background-color: orange;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    flex-direction: column;
    align-content: space-between;
}

.prize, .lottery {
    margin: 5.33px;
    border-radius: 30px;
    background-color: white;
    width: 30%;
    height: 30%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.lottery {
    background-color: #ffe6a6;
    box-shadow: inset 0 0 16px #ffa800;
}

.image {
    width: 80%;
    height: 60%;
    align-items: center;
    justify-content: center;
    display: flex;
}

.prize p, .prize-window p {
    color: #d25f00;
    font-size: 10px;
    align-items: center;
}

.lottery p {
    align-items: center;
    font-weight: bold;
    font-size: large;
    color: #a74b00;
    cursor: pointer;
}

.prize.chosen {
    background-color: #ffa800;
    box-shadow: inset 0 0 16px #ffe6a6;
}

.prize-window {
    background-color: white;
    display: none;
}

.prize-window.show {
    background-color: white;
    display: block;
    text-align: center;
}

.prize-window p {
    font-size: 30px;
}

#prize-content  {
    font-weight: bold;
}

#prize-image {
    margin-left: auto;
    margin-right: auto;
    width: 120px;
    height:120px;
}
</style>
