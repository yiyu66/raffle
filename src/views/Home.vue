<template>
  <div class="home">
    <h1>首页</h1>
    <RaffleBlock msg="抽奖系统主页" prizesList="" />
  </div>
</template>

<script>
// @ is an alias to /src
import RaffleBlock from "@/components/RaffleBlock.vue";

export default {
  name: "Home",
  components: {
    RaffleBlock,
  },
};
</script>
