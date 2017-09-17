<template>
  <div class="column col-10">
    <div class="tile tile-centered">
      <div class="tile-icon">
        <button class="btn btn-action btn-primary" :class="mp4V === 100 ? null : 'loading'"><i class="icon icon-check"></i></button>
      </div>
      <div class="tile-content">
        <p class="tile-title">mp4</p>
        <p class="tile-subtitle">
          <progress class="progress" :value="mp4V" max="100"></progress>
        </p>
      </div>
    </div>
    <button class="btn" @click="killEncode" :style="{margin:'10px 0'}">取消转码</button>
    <router-link to="home">home</router-link>
  </div>
</template>

<script>
  export default {
    name: 'Detail',
    data() {
      return {
        mp4V: 0,
      }
    },
    created(){
      this.progress()
    },
    methods: {
      killEncode() {
        this.$electron.ipcRenderer.send('kill-encode', null)
        this.$router.push({path:'home'})
      },
      progress(){
        this.$electron.ipcRenderer.on('mp4-reply', (event, arg) => {
          this.mp4V = arg
        })
      }
    }
  }
</script>

<style lang="scss">
 .bar{
   margin: 10px 0;
 }
</style>
