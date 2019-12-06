<template>
  <div>
    <section class="content">
      <h4 style="text-align: left;border-left: #33CCFF 3px solid;margin-top: 0;padding-left: 5px">网络诊断</h4>
      <el-form>
        <el-form-item align="left" style="text-align: left">
          <el-input placeholder="请输入IP地址" :maxlength="15" v-model="deviceIp" class="input-width"
                    @change="changeIpVal"></el-input>
          <el-button type="primary" style="margin-left: 20px" @click="startDiag()">开始诊断</el-button>
        </el-form-item>
        <el-form-item align="left" style="text-align: left;margin-left: 30px" v-show="NetDiagnoseResult.length>0">
          <span>诊断结果：</span><br>
          <span style="white-space: pre-wrap;word-wrap:break-word;word-break:break-all">{{NetDiagnoseResult}}</span>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>
<script>
  import {ipValid} from '../../assets/js/api.js'
  import axios from "axios";

  export default {
    data() {
      return {
        deviceIp: '',
        NetDiagnoseResult: ''
      }
    },
    methods: {
      //验证ip地址输入是否有误
      changeIpVal(val) {
        let isVaild = true;
        if (val.length > 0) {
          if (!ipValid(val)) {
            isVaild = false;
            this.$message.error('请输入正确的IP地址');
          }
        } else {
          this.$message.error('请输入IP地址');
          isVaild = false;
        }
        return isVaild;
      },
      //网络诊断
      startDiag() {
        if (!this.changeIpVal(this.deviceIp)) {
          return;
        }
        let param = {
          msgId: "b7518c70", type: 4192, cmd: 4544, timestamp: new Date().getTime(),
          data: {NetDiagnoseIp: this.deviceIp}
        };
        axios.defaults.timeout = 20 * 1000;
        this.$emit('openLoading');
        this.$post(param, "命令下发成功").then((data) => {
          this.$emit('closeLoading');
          if ("000000" == data.code) {
            this.NetDiagnoseResult = data.data.NetDiagnoseResult;
          }
        }).catch((error) => {
          this.$emit('closeLoading');
        });
      }
    },
    mounted() {
    }
  }
</script>
<style scoped>
  @media screen and (min-width: 320px) and (max-width: 799px) {
    .input-width {
      width: 80%
    }
  }

  @media screen and (min-width: 320px) and (max-width: 1279px) {
    .input-width {
      width: 60%
    }
  }

  @media screen and (min-width: 1280px) {
    .input-width {
      width: 40%
    }
  }
</style>
