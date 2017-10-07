<template>
  <div class="column col-10">
    <div class="input-group">
      <input type="text" class="form-input" placeholder="输入源" v-model="inputpath" @dragover.prevent @dragend.prevent @drop="drop" />
      <button class="btn btn-primary input-group-btn" @click="input_file">选择路径</button>
    </div>
    <div class="input-group">
      <input type="text" class="form-input" placeholder="输出路径" v-model="outpath" />
      <button class="btn btn-primary input-group-btn" @click="outpathSelect">选择路径</button>
    </div>
    <div>
      <span class="h5">转码格式：</span>
      <div class="form-group">
        <label class="form-checkbox">
          <input type="checkbox" value="mp4" v-model="checkList" />
          <i class="form-icon"></i> mp4
        </label>
        <label class="form-checkbox">
          <input type="checkbox" value="webm" v-model="checkList" />
          <i class="form-icon"></i> webm
        </label>
        <label class="form-checkbox">
          <input type="checkbox" value="ogv" v-model="checkList" />
          <i class="form-icon"></i> ogv
        </label>
      </div>
    </div>

    <button class="btn" @click="toggleDialog" :style="{margin:'10px 0'}">开始转码</button>
    <div>
      <span v-for="item of labelText" :key="item.id" class="label label-rounded label-error" :style="{margin:'5px'}">{{item.text}}</span>
    </div>

    <Modal :class="{active:dialogVisible}" v-on:close="toggleDialog" v-on:yes="encodeVideo" content="确认是否需要转码" />
  </div>
</template>

<script>
  import Modal from '@/components/Modal'
  export default {
    name: 'Home',
    data() {
      return {
        inputpath: '',
        outpath: '',
        checkList: [],
        dialogVisible: false,
        labelText: [],
      }
    },
    components: {
      Modal
    },
    methods: {
      toggleDialog() {
        if (this.inputpath.length === 0 || this.checkList.length === 0 || this.outpath.length === 0) {
          this.labelText.length = 0
          this.inputpath.length === 0 ? this.labelText.push({id:0,text:`输入源不能为空!`}) : null
          this.outpath.length === 0 ? this.labelText.push({id:1,text:`输出源不能为空!`}) : null
          this.checkList.length === 0 ? this.labelText.push({id:2,text:`请至少选择一个转码格式!`}) : null
          return
        }
        this.labelText.length = 0
        this.dialogVisible = !this.dialogVisible
      },
      drop(e) {
        e.preventDefault()
        this.inputpath = e.dataTransfer.files[0].path
        return false;
      },
      input_file() {
        this.$electron.remote.dialog.showOpenDialog({
          filters: [
            { name: 'Movies', extensions: ['mkv', 'avi', 'mp4', 'mov', 'webm'] },
            { name: 'All Files', extensions: ['*'] }
          ], properties: ['openFile']
        },path => this.inputpath = path === undefined ? '' : path[0])
      },
      outpathSelect() {
        this.$electron.remote.dialog.showOpenDialog({
          properties: ['openDirectory']
        },path => this.outpath = path === undefined ? '' : path[0])
      },
      encodeVideo() {
        this.dialogVisible = false
        console.log(`开始编码${this.inputpath}`)
        this.$router.push({path:'detail'})
        this.$electron.ipcRenderer.send('encode',this.checkList,this.inputpath,this.outpath)
      },
    }
  }
</script>

<style lang="scss">
  .input-group{
    margin: 10px 0;
  }
  .label-rounded{
    margin-right: 5px;
  }
</style>
