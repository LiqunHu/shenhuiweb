<template>
  <div>
    <div class="col-sm-10" style="height: 20px">
      <!--<span class="pull-left" v-if="uploadFinish" style="text-align: left">上传成功！</span>-->
      <div v-if="!uploadFinish">
        <div class="progress progress-striped active" v-show="percentComplete<=100 && percentComplete>0"
             role="progressbar" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar progress-bar-success" style="width:0%"></div>
        </div>
      </div>
    </div>
    <div class="col-sm-2 pull-right">
      <label class="btn btn-info btn-xs fileupload-button">上传文件
        <input type="file" name="file" @change="onFileChange">
      </label>
    </div>
  </div>
</template>

<script type="text/babel">
const common = require('@/lib/common');
export default {
  name: 'fileupload',
  props: {
    target: {
      type: String
    },
    action: {
      type: String,
      default: 'POST'
    }
  },
  data () {
    return {
      file: null,
      percentComplete: 0,
      uploadFinish: false
    }
  },
  methods: {
    emitter (event, data) {
      this.$emit(event, data)
    },
    uploadProgress (oEvent) {
      let vm = this
      if (oEvent.lengthComputable) {
        vm.percentComplete = Math.round(oEvent.loaded * 100 / oEvent.total)
        $('.progress .progress-bar').css('width', vm.percentComplete + '%');
        if(vm.percentComplete >= 100){
           window.setTimeout(function () {vm.uploadFinish = true}, 1000)
        }
        vm.emitter('progress', vm.percentComplete)
      } else {
        // Unable to compute progress information since the total size is unknown
        vm.emitter('progress', false)
      }
    },
    onFileChange (e) {
      let vm = this

      if (!this.target || this.target === '') {
        console.log('Please provide the target url')
      } else if (!this.action || this.action === '') {
        console.log('Please provide file upload action ( POST / PUT )')
      } else if (this.action !== 'POST' && this.action !== 'PUT') {
        console.log('File upload component only allows POST and PUT Actions')
      } else {
        let files = e.target.files || e.dataTransfer.files

        if (!files.length) {
          return
        };

        /*global FormData XMLHttpRequest:true*/
        /*eslint no-undef: "error"*/

        this.file = files[0]
        let max_size = 2*1024*1024;
        if(this.file.size > max_size){
          vm.emitter('fail','文件不能大于2M')
          return
        }

        let splits = this.file.name.split(".");
        let fileFormat = splits[splits.length-1];
        let formats = ['dwg','jpg','jpeg','png','pdf','doc','docx']
        let isValid = $.inArray(fileFormat, formats)
        if(isValid == -1) {
          vm.emitter('fail','只支持dwg,jpg,jpeg,png,pdf,doc,docx格式的文件上传')
          return
        }

        let formData = new FormData()
        formData.append('file', this.file)

        var xhr = new XMLHttpRequest()

        xhr.open(this.action, this.target)
        xhr.setRequestHeader('authorization', common.getStoreData('token'))

        xhr.onloadstart = function (e) {
          vm.uploadFinish = false
          vm.emitter('start', e)
        }
        xhr.onloadend = function (e) {
          let response = JSON.parse(e.target.response)
          vm.emitter('finish', response.info)
        }
        xhr.upload.onprogress = vm.uploadProgress
        xhr.send(formData)
      }
    }
  }
}
</script>
<style scoped>
</style>
