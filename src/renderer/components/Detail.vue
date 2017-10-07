<template>
  <div class="column col-10">
    <div class="tile tile-centered" v-for="item in checkListR" :key="item.title" >
      <div class="tile-icon">
        <button class="btn btn-action btn-primary" :class="item.done === true ? null : 'loading'"><i class="icon icon-check"></i></button>
      </div>
      <div class="tile-content">
        <p class="tile-title">{{item.title}}</p>
        <p class="tile-subtitle">
          <progress class="progress" :value="item.v" max="100"></progress>
        </p>
      </div>
    </div>

    <button class="btn" @click="showDialog" :style="{margin:'10px 0'}" v-if="AllDone===false">取消转码</button>
    <button class="btn" @click="goHomepage" :style="{margin:'10px 0'}" v-else>返回</button>
    <Modal :class="{active:dialogVisible}" v-on:close="closeDialog" v-on:yes="killEncode" content="是否要取消转码" />
  </div>
</template>

<script>
  import Modal from '@/components/Modal'
  export default {
    name: 'Detail',
    data() {
      return {
        checkList:[
          {title:'mp4',v:'',done:false},
          {title:'webm',v:'',done:false},
          {title:'ogv',v:'',done:false},
        ],
        AllDone:false,
        dialogVisible: false,
      }
    },
    created(){
      this.progress()
      this.$electron.ipcRenderer.once('All-done', (event, arg) => {
          this.AllDone = true
      })
    },
    components: {
      Modal
    },
    computed: {
      checkListR() {
        return this.checkList.filter(function (item) {
          return item.v !== ''
        })
      }
    },
    methods: {
      showDialog(){
        this.dialogVisible = true
      },
      closeDialog(){
        this.dialogVisible = false
      },
      killEncode() {
        this.$electron.ipcRenderer.send('kill-encode', null)
        this.$router.push({path:'home'})
      },
      goHomepage() {
        this.$router.push({path:'home'})
      },
      progress(){
        this.$electron.ipcRenderer.on('mp4-reply', (event, arg) => {
          this.checkList[0].v = arg
        })
        this.$electron.ipcRenderer.on('mp4-done', (event, arg) => {
          this.checkList[0].done = true
        })

        this.$electron.ipcRenderer.on('webm-reply', (event, arg) => {
          this.checkList[1].v = arg
        })
        this.$electron.ipcRenderer.on('webm-done', (event, arg) => {
          this.checkList[1].done = true
        })

        this.$electron.ipcRenderer.on('ogv-reply', (event, arg) => {
          this.checkList[2].v = arg
        })
        this.$electron.ipcRenderer.on('ogv-done', (event, arg) => {
          this.checkList[2].done = true
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
