<template>
  <div class="modal" >
      <div class="modal-overlay"></div>
      <div class="modal-container">
        <div class="modal-header">
          <button class="btn btn-clear float-right" @click="close"></button>
          <div class="modal-title h5">提示</div>
        </div>
        <div class="modal-body">
          <div class="content">
            {{content}}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="yes">Yes</button>
          <button class="btn" @click="close">Close</button>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name:'Modal',
    props: ['content'],
    methods:{
      close(){
        this.$emit('close')
      },
      yes(){
        this.$emit('yes')
      }
    }
  }
</script>
