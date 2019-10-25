<template>
  <div>
    <section class="content">
      <div>
        <el-form ref="upgrage" label-width="100px" label-position="left" :model="upgrage">
          <el-form-item label="操作说明" style="text-align: left;margin-bottom:20px" class="upgrade-tip">
            <div>1、tftpd32.exe和升级包要放在同级目录下；在升级前双击tftpd32.exe打开程序即可，无需其他操作</div>
            <div>2、本地IP需在cmd中，ipconfig查询后手动输入，默认为192.168.99.110</div>
            <div class="upgrade_result">
              <pre>{{upgrade_result}}</pre>
            </div>
          </el-form-item>
          <el-form-item label="升级文件" prop="fileName" style="text-align: left;margin-bottom: 0">
            <el-input v-model="upgrage.fileName" placeholder="请选择升级文件" readonly style="width: 400px">
              <el-upload ref="upload" class="upload" slot="append" action="/ubus" name="file"
                         :on-change="handleChange" :on-remove="handleRemove"
                         :auto-upload="false" :show-file-list="false">
                <el-button type="primary">选择文件</el-button>
              </el-upload>
            </el-input>
            <div class="el-upload__tip" style="margin: 0 0 7px 0">只能上传.tar.gz的压缩包文件</div>
          </el-form-item>
          <el-form-item label="升级版本" prop="version" style="text-align: left">
            <el-input v-model="upgrage.version" readonly style="width: 400px" placeholder="升级版本"></el-input>
          </el-form-item>
          <el-form-item label="本地IP" prop="hostIp" style="text-align: left">
            <el-input v-model="upgrage.hostIp" style="width: 400px" placeholder="本地IP" :maxlength="15"></el-input>
          </el-form-item>
          <el-form-item style="text-align: left">
            <el-button type="primary" size="medium" @click="upgrade()" :loading="btnDisabled">确认升级</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>
<script>

  let SparkMD5 = require("spark-md5");
  import {ipValid} from '../../assets/js/api.js'

  export default {
    data() {
      return {
        upgrage: {fileName: '', version: '', hostIp: '192.168.99.110', md5: ''},
        btnDisabled: false, upgrade_result: null
      }
    },
    methods: {
      getUpgradeStatus() {
        let param = {msgId: "b7518c70", type: 4194, cmd: 4701, moduleID: 255, timestamp: new Date().getTime()};
        this.$post(param).then((data) => {
          if ("000000" == data.code) {
            this.upgrade_result = JSON.stringify(data.data, null, 4);
            sessionStorage.setItem("upgrade_result", JSON.stringify(data.data));
            //0x1050-成功 0x1052-失败 0x1051-升级中 0-未升级
            if (data.data.result !== 0x1051) {
              this.btnDisabled = false;
              if (data.data.result == 0x1050) {
                this.$message({message: '升级成功', type: 'success'});
              } else if (data.data.result == 0x1052) {
                this.$message({message: '升级失败', type: 'success'});
              }
            } else {//升级中
              if (data.data.msgStr.length > 0) {
                this.$message({message: data.data.msgStr, type: 'success'});
              }
              setTimeout(() => {
                this.getUpgradeStatus();
              }, 10 * 1000);
            }
          }
        }).catch((error) => {
        });
      },
      //升级
      upgrade() {
        if (this.upgrage.fileName.length == 0 || this.upgrage.version.length == 0) {
          this.$message.error('请选择升级包文件');
          return;
        }
        if (this.upgrage.hostIp.length == 0) {
          this.$message.error('请输入IP地址');
          return;
        }
        if (!ipValid(this.upgrage.hostIp)) {
          this.$message.error('请输入正确的IP地址');
          return;
        }
        let param = {
          msgId: "b7518c70", type: 4192, cmd: 4401, moduleID: 0,
          timestamp: new Date().getTime(), content: this.upgrage
        };
        this.$emit('openLoading');
        this.$post(param, "命令下发成功").then((data) => {
          this.$emit('closeLoading');
          if ("000000" == data.code) {
            this.btnDisabled = true;
            this.getUpgradeStatus();
          }
        }).catch((error) => {
          this.$emit('closeLoading');
        });
      },
      //选择文件==删除
      handleRemove(file, fileList) {
        this.upgrage.fileName = '';
        this.upgrage.version = '';
      },
      //选择文件
      handleChange(file, fileList) {
        if (file.name.indexOf('.tar.gz') < 0) {
          this.$message.error('请选择正确的升级包文件');
          return;
        }
        this.upgrage.fileName = file.name;
        this.upgrage.version = this.upgrage.fileName.substr(0, this.upgrage.fileName.length - 7);
        this.getFileMd5(file.raw);
      },
      /** 计算文件的MD5值  */
      getFileMd5(file) {
        let _this = this;
        // 获取文件
        // 创建文件读取对象，此对象允许Web应用程序异步读取存储在用户计算机上的文件内容
        let fileReader = new FileReader();
        // 指定文件分块大小(2M)
        let chunkSize = 2 * 1024 * 1024;
        // 计算文件分块总数
        let chunks = Math.ceil(file.size / chunkSize);
        // 指定当前块指针
        let currentChunk = 0;

        // 创建MD5计算对象
        let spark = new SparkMD5.ArrayBuffer();

        // 记录开始时间
        let startTime = new Date().getTime();

        // FileReader分片式读取文件
        this.loadNext(fileReader, file, currentChunk, chunkSize);

        // 当读取操作成功完成时调用
        fileReader.onload = function () {
          // 输出加载信息
          // console.log('读取文件：' + (currentChunk + 1) + '/' + chunks + '...');

          // 将文件内容追加至spark中
          spark.append(this.result);
          currentChunk += 1;

          // 判断文件是否都已经读取完
          if (currentChunk < chunks) {
            _this.loadNext(fileReader, file, currentChunk, chunkSize);
          } else {
            let file_md5 = spark.end();
            // 计算spack中内容的MD5值,并返回
            console.log('MD5值为：' + file_md5);
            // console.log('计算时长 ：' + (new Date().getTime() - startTime));
            _this.upgrage.md5 = file_md5;
            return spark.end();
          }
        };
      },
      // FileReader分片式读取文件
      loadNext(fileReader, file, currentChunk, chunkSize) {
        // 根据浏览器获取文件分割方法
        let blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;
        // 计算开始读取的位置
        let start = currentChunk * chunkSize;
        // 计算结束读取的位置
        let end = start + chunkSize >= file.size ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }
    },
    mounted() {
      let msg = JSON.parse(sessionStorage.getItem("upgrade_result"));
      this.upgrade_result = JSON.stringify(msg, null, 4);
    }
  }
</script>
<style scoped>
  .upgrade-tip div {
    color: #999;
    font-weight: bold;
  }

  .upgrade_result {
    position: absolute;
    color: #88158F;
    font-weight: bold;
    left: 460px;
    top: 80px;
  }

  .upgrade_result pre {
    color: #88158F;
  }
</style>
