<template>
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
      <div class="customer-container">
        <div class="box" v-for="item in resultList" :key="item.id">
          <img :src="item.prizeimage" alt="" />{{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "RaffleBlock",
  props: {
    msg: String,
    prizesList: String,
  },
  data() {
    return {
      // 先在本地预制一个奖品列表
      resultList: [],
      // 后端返回的抽奖结果
      raffle: {
        winNum: 0,
      },
      index: 0, //当前转动到哪个位置，起点位置
      stepDelay: 100, //初始转动速度 0.1s一步
      stepNum: 0,
      IntervalID: "",
      UserBanace: 200, // 存款，默认200
      isTurn: true, // 是否可以抽奖，后续加上余额判断
    };
  },
  created() {
    this.getRaffleList();
  },

  methods: {
    async start() {
      this.index = 0;
      debugger;
      this.UserBanace -= 10;
      document.getElementById("startButton").disabled = true;
      await this.getRaffleRes();
      if (this.raffle.winNum >= 0 && this.raffle.winNum <= 7) {
        // 考虑网络断开的情况
        this.IntervalID = setInterval(this.rotate, this.stepDelay);
        console.log(this.raffle.winNum);
      } else {
        document.getElementById("startButton").disabled = false;
        this.UserBanace += 10;
      }
    },

    rotate() {
      // 复原老格子style
      let boxID = "box" + this.index;
      let boxOld = document.getElementById(boxID);
      boxOld.className = "box";
      if (this.index === 7) {
        this.index = -1;
      }
      // 更新当前格子style
      boxID = "box" + ++this.index;
      var boxNow = document.getElementById(boxID);
      boxNow.className = "boxActived";
      this.stepNum--;
      if (this.stepNum === 0) {
        clearInterval(this.IntervalID);
        this.index = 0;
        document.getElementById("startButton").disabled = false;
      } else {
        // 逐渐减速
        clearInterval(this.IntervalID);
        this.stepDelay = 1000 / this.stepNum;
        this.IntervalID = setInterval(this.rotate, this.stepDelay);
      }
    },

    // const element = document.querySelector(".box:nth-child(5)");
    //     element.setAttribute("id", "target");
    //     var MyComponent = Vue.extend({
    //       template:
    //         '<div class="start" id="boxcenter"><el-button class="startButton" id="startButton" @click="start" round><p>抽奖</p><p>10/次</p></el-button></div>',
    //     });
    //     new MyComponent().$mount().$appendTo("#target"); //appendTo

    // 抽奖
    async getRaffleRes() {
      const res = await axios({
        url: "/PrizeResult",
        method: "get",
        responseType: "json",
      });
      const id = res.data.Num;
      this.raffle.winNum = id;
      this.stepNum = 40 + this.raffle.winNum;
    },

    //初始化抽奖盘
    async getRaffleList() {
      // debugger;
      const res = await axios({
        url: "RaffleList",
        method: "get",
        responseType: "json",
      });
      const resultList = res.data.data.resultList;
      console.log(resultList);
      if (resultList === null) {
        console.log("获取奖品列表失败：" + error);
      } else {
        this.resultList = resultList;
        this.PrizeList = resultList;
      }
    },
  },
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  /* align-content: center; */
  align-items: center;
  /* justify-content: center; */
  background-color: rgb(27, 118, 209);
}
.container {
  display: flex;
  width: 660px;
  height: 660px;
  background-color: orange;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  border: 50px solid #ffe6a6;
  border-radius: 15%;
  margin: 30px;
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
.customer-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 30px;
  width: 180px;
  height: 180px;
  background-color: rgb(255, 255, 255);
  text-align: center;
  line-height: 50px;
  margin-right: 15px;
  margin-top: 15px;
}

/* .box:nth-child(5) {
} */

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
  color: rgb(230, 232, 217);
  border-radius: 5px;
  margin-top: 100px;
  font-size: 50px;
}
.money {
  margin-top: 20px;
  padding-left: 10px;
  font-size: 30px;
  color: rgb(230, 232, 217);
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
</style>
