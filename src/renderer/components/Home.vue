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
    <router-link to="/detail">Go to Foo</router-link>
    <div>
      <span v-for="item of toastText" :key="item.id" class="label label-rounded label-error">{{item.text}}</span>
    </div>

    <div class="modal" :class="{active:dialogVisible}">
      <div class="modal-overlay"></div>
      <div class="modal-container">
        <div class="modal-header">
          <button class="btn btn-clear float-right" @click="toggleDialog"></button>
          <div class="modal-title h5">提示</div>
        </div>
        <div class="modal-body">
          <div class="content">
            再次确认是否需要转码
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="encodeVideo">Yes</button>
          <button class="btn" @click="toggleDialog">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    data() {
      return {
        inputpath: '',
        outpath: '',
        checkList: [],
        dialogVisible: false,
        toastText: [],
      }
    },
    computed: {
      toastKey(){
        switch (this.docState) {
          case `输入源不能为空` : return 'error1'
          case `请至少选择一个转码格式` : return 'error2'
        }
      }
    },
    methods: {
      toggleDialog() {
        if (this.inputpath.length === 0 || this.checkList.length === 0) {
          this.inputpath.length === 0 ? this.toastText.push({id:0,text:`输入源不能为空!`}) : null
          this.checkList.length === 0 ? this.toastText.push({id:1,text:`请至少选择一个转码格式!`}) : null
          return
        }
        this.toastText.length = 0
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
        // this.checkList.indexOf('mp4') !== -1 ? this.$electron.ipcRenderer.send('encode-mp4', this.inputpath) : null
        // this.checkList.indexOf('webm') !== -1 ? this.$electron.ipcRenderer.send('encode-webm', this.inputpath) : null
        // this.checkList.indexOf('ogv') !== -1 ? this.$electron.ipcRenderer.send('encode-ogv', this.inputpath) : null
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
