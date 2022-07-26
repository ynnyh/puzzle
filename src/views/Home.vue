<template>
  <div class="container">
    <div v-if="start" class="game-cont">
      <div class="box">
        <div v-for="item in list" :key="item.id + random" class="part" @click="move(item)" :ref="'part-' + item.id">
          <img :src="item.url" alt="" class="img">
          <!-- 下面一行是开挂提示，放开则显示数字顺序 -->
          <!-- <div class="text">{{ item.id + 1 }}</div> -->
        </div>
      </div>
      <p>时间：<span class="times">{{ time }}</span>s</p>
      <p>步数：<span class="times">{{ steps }}</span>步</p>
      <p><button class="clickSpan" @click="reset"><b>重新开始</b></button></p>
    </div>
    <div v-else class="start game-cont">
      <img src="../assets/pic.jpg" alt="" class="start-img">
      <p><button class="clickSpan" @click="handlePlay"><b>开始游戏</b></button></p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Puzzle',
  data () {
    return {
      images: [
        { id: 0, url: require('../assets/GridImage-1.png') },
        { id: 1, url: require('../assets/GridImage-2.png') },
        { id: 2, url: require('../assets/GridImage-3.png') },
        { id: 3, url: require('../assets/GridImage-4.png') },
        { id: 4, url: require('../assets/GridImage-5.png') },
        { id: 5, url: require('../assets/GridImage-6.png') },
        { id: 6, url: require('../assets/GridImage-7.png') },
        { id: 7, url: require('../assets/GridImage-8.png') },
      ],
      list: [],
      time: 0,
      empty: 8, // 空白位置下标, 默认在最后
      selectedSub: [], // 选中的下标
      start: false, //是否开始游戏
      win: false,
      random: 0, // 设计一个随机数与id结合，实现每次开始游戏都以随机数加id形成新的key，让页面重载
      timeFunc: null, // 定时任务，方便清除,
      steps: 0, // 记录移动步数
    }
  },
  mounted () {
    this.list = this.choosePic();
  },
  destroyed () {
    if(this.timeFunc) clearInterval(this.timeFunc);
  },
  methods: {
    handlePlay() {
      this.start = true;
      // 开始计时
      this.timeFunc = setInterval(this.startGame, 1000);
    },
    choosePic () {
      this.random = Math.ceil(Math.random() * 10000);
      const imgs = [...this.images];
      const choosePics = [];
      this.selectedSub = []
      for (let i = 0; i < 8; i++) {
        const num = parseInt(Math.random() * imgs.length);
        this.selectedSub.push(imgs[num].id);
        choosePics.push(imgs[num]);
        imgs.splice(num, 1);
      }
      this.selectedSub.push(8) // 最后放入空白处下标
      if (this.solvability(this.selectedSub, 3)) {
        return choosePics
      } else {
        this.reset();
        return this.choosePic();
      }
    },
    ifSuccess () {
      // 判断是否成功
      let step = 0;
      for (let i = 0; i < 9; i++) {
        if (this.selectedSub[i] === i) step += 1;
      }
      if (step === 9) {
        this.win = true;
        clearInterval(this.timeFunc);
        setTimeout(() => {
          alert('你赢了');
          this.start = false;
          this.reset();
          // 后续处理逻辑
        }, 1000)
      }
    },
    startGame () {
      this.time += 1;
    },
    move (param) {
      // 判断是否在空白位置的上下左右四个位置的点击
      // 上 empty - 3
      // 下 empty + 3
      // 左 empty - 1
      // 右 empty + 1
      // 根据点击的元素找到在选择列表里的下标，判断是否在空白处的上下左右位置
      const index = this.selectedSub.findIndex(item => item === param.id);
      // 判断index和空白下标的大小
      if (index < this.empty) {
        // 判断是在空白下标的上方还是左边
        if (this.empty - index === 1) { // 逻辑不够完善，没有考虑边界，要考虑左边一侧没有左侧的情况
          if (this.empty === 0 || this.empty === 3 || this.empty === 6) return;
          this.steps += 1;
          // 在空白下标左边
          // 将空白下标和index转换位置
          let arr = [...this.selectedSub];
          arr[index] = arr.splice(this.empty, 1, arr[index])[0];
          this.selectedSub = [...arr];
          this.empty = index;
          // 执行移动动画
          const distance = this.$refs[`part-${param.id}`][0].offsetWidth;
          const left = this.$refs[`part-${param.id}`][0].style.left;
          if (left) {
            this.$refs[`part-${param.id}`][0].style.left = (+left.split('px')[0] + distance + 'px');
          } else {
            this.$refs[`part-${param.id}`][0].style.left = distance + 'px';
          }
        } else if (this.empty - index === 3) { // 考虑边界，0,1，2没有上方位置
          if (this.empty === 0 || this.empty === 1 || this.empty === 2) return;
          this.steps += 1;
          let arr = [...this.selectedSub];
          arr[index] = arr.splice(this.empty, 1, arr[index])[0]
          this.selectedSub = [...arr];
          this.empty = index;
          // 执行移动动画
          const distance = this.$refs[`part-${param.id}`][0].offsetHeight;
          const top = this.$refs[`part-${param.id}`][0].style.top;
          if (top) {
            this.$refs[`part-${param.id}`][0].style.top = (+top.split('px')[0] + distance + 'px');
          } else {
            this.$refs[`part-${param.id}`][0].style.top = distance + 'px';
          }
          // 在空白下标上方
        } // 其余点击不予相应
      } else {
        // 判断是在空白下标的下方还是右边
        if (index - this.empty === 1) {
          if (this.empty === 2 || this.empty === 5 || this.empty === 8) return;
          this.steps += 1;
          // 将空白下标和index转换位置
          let arr = [...this.selectedSub]
          arr[index] = arr.splice(this.empty, 1, arr[index])[0]
          this.selectedSub = [...arr]
          this.empty = index;
          // 执行移动动画
          const distance = this.$refs[`part-${param.id}`][0].offsetWidth;
          const left = this.$refs[`part-${param.id}`][0].style.left;
          if (left) {
            this.$refs[`part-${param.id}`][0].style.left = (+left.split('px')[0] - distance + 'px')
          } else {
            this.$refs[`part-${param.id}`][0].style.left = -distance + 'px'
          }
        } else if (index - this.empty === 3) {
          if (this.empty === 6 || this.empty === 7 || this.empty === 8) return;
          this.steps += 1;
          let arr = [...this.selectedSub]
          arr[index] = arr.splice(this.empty, 1, arr[index])[0]
          this.selectedSub = [...arr]
          this.empty = index;
          // 执行移动动画
          const distance = this.$refs[`part-${param.id}`][0].offsetHeight;
          const top = this.$refs[`part-${param.id}`][0].style.top;
          if (top) {
            this.$refs[`part-${param.id}`][0].style.top = (+top.split('px')[0] - distance + 'px');
          } else {
            this.$refs[`part-${param.id}`][0].style.top = -distance + 'px';
          }
        }
      }
      this.ifSuccess();
    },
    solvability (order, size) {
      // 判断随机数据是否有解
      let a;
      let count = 0;
      let m = 0;
      let n = 0;
      
      const len = order.length;
      size = size || 3;
      for ( let i = 0; i < len; i++) {
        a = order[i];
        if (a == size * size - 1) {
          m = parseInt(i / size);
          n = parseInt(i % size);
        }
              
        for(let j = i + 1; j < len; j++) {
          if(order[j] < a) {
            count++;
          }
        }
      }
      count += m;
      count += n;
      return count % 2 == 0;
    },
    reset () {
      this.selectedSub = [];
      this.empty = 8;
      this.time = 0;
      this.steps = 0;
      this.list = [...this.choosePic()];
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-content: center;
  .game-cont {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    .box {
      width: 90vw;
      height: 90vw;
      max-width: 600px;
      max-height: 600px;
      margin: 0 auto;
      /* border: 1px solid #ccc; */
      box-shadow: 1px 1px 5px #ccc;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 10px;
      .part {
        width: 33.33%;
        box-sizing: border-box;
        border: 1px solid #ccc;
        position: relative;
        left: 0;
        top: 0;
        transition: all 1s;
        .img {
          display: block;
          width: 100%;
          object-fit: cover;
        }
        .text {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 16px;
          color: red;
        }
      }
    }
    p {
      width: 100%;
      text-align: center;
      font-weight: bold;
      line-height: 5vh;
      margin: 0;
      .clickSpan {
        height: 5vh;
        width: 15vw;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 14px;
        line-height: 5vh;
        background-color: blueviolet;
        text-align: center;
        color: #fff;
        cursor: pointer;
        margin-top: 16px;
      }
    }
  }
  .start {
    .start-img {
      width: 90vw;
      height: 90vw;
      max-width: 600px;
      max-height: 600px;
    }
  }
}
</style>
