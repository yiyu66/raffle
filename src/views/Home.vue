<template>
  <div class="home">
    <div class="background"><img :src="imgSrc" width="100%" height="100%" alt="" /></div>
    <RaffleBlock msg="抽奖系统主页" prizesList="" />
  </div>
</template>

<script>
// @ is an alias to /src
import RaffleBlock from '@/components/RaffleBlock.vue'

export default {
  data(){
    return{
       imgSrc: require('../components/img/background.f2441ca.png'),
    }
  },
  name: 'Home',
  components: {
    RaffleBlock,
  },
}
</script>

<style scoped>
.background {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-size: 100% 100%;
}
</style>