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
      <div class="box" id="box0">
        <img src="./img/ak47-asiimov.jpg" />{{ resultList[0].name }}
      </div>
      <div class="box" id="box1">
        <img src="./img/awp-dragon.jpeg" />{{ resultList[1].name }}
      </div>
      <div class="box" id="box2">
        <img src="./img/m4a4-howl.jpeg" />{{ resultList[2].name }}
      </div>
      <div class="box" id="box7">
        <img src="./img/nothing.jpeg" />{{ resultList[7].name }}
      </div>
      <div class="start" id="boxcenter">
        <el-button
          class="startButton"
          id="startButton"
          @click="rotateWheel"
          round
        >
          <p>抽奖</p>
          <p>10/次</p></el-button
        >
      </div>
      <div class="box" id="box3">
        <img src="./img/nothing.jpeg" />{{ resultList[3].name }}
      </div>
      <div class="box" id="box6">
        <img src="./img/pandora-gloves.jpeg" />{{ resultList[6].name }}
      </div>
      <div class="box" id="box5">
        <img src="./img/m9-doppler.jpeg" />{{ resultList[5].name }}
      </div>
      <div class="box" id="box4">
        <img src="./img/fracture-case.jpeg" />{{ resultList[4].name }}
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
      resultList: [
        {
          name: "AK47 | 二西莫夫",
          order: 1, // 顺序
          probability: 0.1,
        },
        {
          name: "AWP | 巨龙传说",
          order: 2,
          probability: 0.05,
        },
        {
          name: "M4A4 | 咆哮",
          order: 3,
          probability: 0.03,
        },
        {
          name: "给你点个赞",
          order: 4,
          probability: 40,
        },
        {
          name: "棱彩武器箱",
          order: 5,
          probability: 40,
        },
        {
          name: "M9刺刀 | 多普勒",
          order: 6,
          probability: 0.01,
        },
        {
          name: "运动手套 | 潘多拉魔盒",
          order: 7,
          probability: 0.01,
        },
        {
          name: "给你点个赞",
          order: 8,
          probability: 19.8,
        },
      ],
      // 后端返回的抽奖结果
      raffle: {
        winNum: 2,
      },
      index: 0, //当前转动到哪个位置，起点位置
      stepDelay: 100, //初始转动速度 0.1s一步
      stepNum: 0,
      IntervalID: "",
      UserBanace: 200, // 存款，默认200
      isTurn: true, // 是否可以抽奖，后续加上余额判断
      pointerIndex: -1,
    };
  },
  created() {
    this.getRaffleList();
  },
  methods: {
    rotateWheel() {
      timeStamps = buildArray();
      currentIndex = 0;
      currentSteps = 1;
      spin = setInterval(animate, 150);
      finishedSpin = false;
      function animate() {
        if (finishedSpin) {
          clearInterval(spin);
        } else if (
          currentIndex === timeStamps.length - 1 &&
          currentSteps === timeStamps[currentIndex]
        ) {
          finishedSpin = true;
          prizeText =
            clockwisePrizes[pointerIndex].getElementsByTagName("p")[0]
              .innerHTML;
          prizeImage =
            clockwisePrizes[pointerIndex].getElementsByTagName("img")[0].src;
          prizeTextElement = document.getElementById("prize-content");
          prizeImageElement = document.getElementById("prize-image");
          prizeWindow = document.getElementsByClassName("prize-window")[0];
          prizeImageElement.src = prizeImage;
          prizeTextElement.innerHTML = prizeText;
          prizeWindow.className = "prize-window show";
        } else if (currentSteps === timeStamps[currentIndex]) {
          movePrize();
          currentIndex++;
          currentSteps = 1;
        } else {
          currentSteps++;
        }
      }
    },
    getText(prize) {
      return prize.innerHTML;
    },
    reset() {
      for (i = 0; i < allPrizes.length; i++) {
        allPrizes[i].className = "prize";
      }
      pointerIndex = -1;
    },
    movePrize() {
      if (pointerIndex === -1) {
        pointerIndex = 0;
      } else {
        clockwisePrizes[pointerIndex].className = "prize";
        pointerIndex++;
      }
      if (pointerIndex === allPrizes.length) {
        pointerIndex = 0;
      }
      clockwisePrizes[pointerIndex].className = "prize chosen";
    },
    buildArray() {
      timeStamps = new Array();
      let i = 0;
      let step = 8;
      let finalPrize = Math.random() * 20;
      for (i = 0; i < 3; i++) {
        timeStamps[i] = step;
        step /= 2;
      }
      for (; i < 30 + finalPrize; i++) {
        timeStamps[i] = 1;
      }
      for (; i < 34 + finalPrize; i++) {
        timeStamps[i] = step;
        step *= 2;
      }
      return timeStamps;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  text-align: center;
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
