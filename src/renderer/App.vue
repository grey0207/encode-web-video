<template>
  <el-row>
    <el-col :span="2">
      <div class="grid-content"></div>
    </el-col>
    <el-col :span="20">
      <div class="grid-content">
        <div class="upload-area" @click="input_file" @dragover.prevent @dragend.prevent @drop="drop">
          <i class="el-icon-upload"></i>
          <p>将文件拖到此处，或
            <em>点击上传</em>
          </p>
        </div>
        <p>
          <el-input placeholder="输入源：" v-model="inputpath">
            <el-button slot="append" @click="input_file">选择路径</el-button>
          </el-input>
        </p>
        <p>
          <el-input placeholder="输出路径：" v-model="outpath">
            <el-button slot="append" @click="outpathSelect">选择路径</el-button>
          </el-input>
        </p>
        <p>转码格式：
          <el-checkbox-group v-model="checkList" :style="{display:'inline'}">
            <el-checkbox label="mp4"></el-checkbox>
            <el-checkbox label="webm"></el-checkbox>
            <el-checkbox label="ogv"></el-checkbox>
          </el-checkbox-group>
        </p>
        <p>
          <el-button type="warning" @click="dialogVisible = true">开始转码</el-button>
        </p>
        <el-dialog title="提示" :visible.sync="dialogVisible" size="tiny">
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="encodeVideo">确 定</el-button>
          </span>
        </el-dialog>
        <p>pct: {{now}}</p>
        <el-progress type="circle" :percentage="now"></el-progress>
        <el-progress type="circle" :percentage="0"></el-progress>
        <el-progress type="circle" :percentage="0"></el-progress>
      </div>
    </el-col>
    <el-col :span="2">
      <div class="grid-content"></div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      inputpath: '',
      outpath: '',
      checkList: [],
      dialogVisible: false,
      mp4P: 0,
    }
  },
  computed: {
    now: function () {
      return 0
    }
  },
  methods: {
    drop(e) {
      e.preventDefault()
      this.inputpath = e.dataTransfer.files[0].path
      return false;
    },
    input_file() {
      this.inputpath = this.$electron.remote.dialog.showOpenDialog({
        filters: [
          { name: 'Movies', extensions: ['mkv', 'avi', 'mp4', 'mov', 'webm'] },
          { name: 'All Files', extensions: ['*'] }
        ], properties: ['openFile']
      })[0]
    },
    outpathSelect() {
      this.outpath = this.$electron.remote.dialog.showOpenDialog({
        properties: ['openDirectory']
      })[0]
    },
    encodeVideo() {
      this.dialogVisible = false
      if(this.inputpath.length === 0){
        console.log(`输入源不能为空`)
        return
      }
      if(this.checkList.length === 0){
        console.log(`请至少选择一个转码格式`)
        return
      }
      console.log(`开始编码${this.inputpath}`)
      this.checkList.indexOf('mp4') !== -1 ?this.$electron.ipcRenderer.send('encode-mp4', this.inputpath):null
      this.checkList.indexOf('webm') !== -1 ?this.$electron.ipcRenderer.send('encode-webm', this.inputpath):null
      this.checkList.indexOf('ogv') !== -1 ?this.$electron.ipcRenderer.send('encode-ogv', this.inputpath):null
    }
  }
}
</script>

<style lang="scss">
  *{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  .grid-content{
    min-height: 36px;
  }
  .upload-area{
      text-align: center;
      padding: 20px;
      background-color: #fff;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      box-sizing: border-box;
      width: 100%;
      height: 180px;
      text-align: center;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      p{
        font-size: 12px;
        color:#97a8be; 
        em{
          color: #20a0ff;
        }
      }
  }
  .el-icon-upload{
    font-size: 67px;
    color: #97a8be;
    margin: 40px 0 16px;
    line-height: 50%;
  }
</style>
