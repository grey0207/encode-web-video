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
        <p>输入源：{{path}}</p>
        <label for="">转码格式：</label>
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="mp4"></el-checkbox>
          <el-checkbox label="webm"></el-checkbox>
          <el-checkbox label="ogv"></el-checkbox>
        </el-checkbox-group>
        <p>输出质量：</p>
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </el-col>
    <el-col :span="2">
      <div class="grid-content"></div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      path: '',
      checkList: [],
      options:[
        {value:'high',label:'高清'},
        {value:'middle',label:'标准'},
        {value:'low',label:'轻量'},
       ],
      value:''
    }
  },
  methods: {
    drop(e) {
      e.preventDefault()
      this.path = e.dataTransfer.files[0].path
      return false;
    },
    input_file() {
      this.path = this.$electron.remote.dialog.showOpenDialog({
        filters: [
          { name: 'Movies', extensions: ['mkv', 'avi', 'mp4', 'mov', 'webm'] },
          {name: 'All Files', extensions: ['*']}
        ], properties: ['openFile']
      })[0]
    }
  }
}
</script>

<style lang="scss">
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
