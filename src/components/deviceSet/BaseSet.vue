<template>
  <div>
    <section class="content">
      <h4 style="text-align: left;margin-top: 0">基本信息</h4>
      <el-form label-width="120px" label-position="left" ref="deviceMonitor" :rules="rules" :model="deviceMonitor"
               class="card-width">
        <div class="content add-appdiv">
          <el-form-item label="设备ID" align="left" required>
            <el-input v-model="deviceMonitor.devId" placeholder="请输入设备ID" :maxlength="20"
                      class="input-width" readonly></el-input>
          </el-form-item>
          <el-form-item label="设备名称" style="text-align: left" required>
            <el-input v-model="deviceMonitor.devName" placeholder="请输入设备名称" :maxlength="20"
                      class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="安装地址" required align="left">
            <el-cascader expand-trigger="hover" :options="provinceList" v-model="selectedOptions2"
                         :props="props" class="input-width" filterable @change="areaChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" align="left">
            <el-input v-model="deviceMonitor.location" placeholder="请输入详细地址，例：某大厦x楼/某小区x房间号"
                      :maxlength=50 class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="高度" required align="left">
            <el-input v-model="deviceMonitor.devpos.height" placeholder="请输入高度" :maxlength=5
                      @change="checkHeight" class="input-width">
              <template slot="prepend">高度</template>
              <template slot="append">米</template>
            </el-input>
          </el-form-item>
          <el-form-item label="数据卡电话号码" prop="phoneNumber" style="text-align: left">
            {{deviceMonitor.phoneNumber ? deviceMonitor.phoneNumber : "--"}}
          </el-form-item>
          <el-form-item label="固件版本" style="text-align: left">
            {{deviceMonitor.hw_version ? deviceMonitor.hw_version : "未上报"}}
          </el-form-item>
          <el-form-item label="软件版本" style="text-align: left">
            {{deviceMonitor.app_version ? deviceMonitor.app_version : "未上报"}}
          </el-form-item>
          <el-form-item label="MAC地址" prop="mac" style="text-align: left;margin: 0">
            {{deviceMonitor.mac ? deviceMonitor.mac : "未上报"}}
          </el-form-item>
        </div>
        <div class="content add-appdiv">
          <h4 style="text-align: left;border-left: #33CCFF 3px solid;margin-top: 0;padding-left: 5px">配置服务器</h4>
          <el-form-item label="IP地址" style="margin-left: 20px" prop="serverip" align="left">
            <el-input v-model="deviceMonitor.serverip" placeholder="请输入IP地址" :maxlength="15"
                      class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="端口" style="margin-left: 20px" prop="serverport" align="left">
            <el-input v-model="deviceMonitor.serverport" placeholder="请输入端口" :maxlength="10"
                      class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="APP_ID" style="margin-left: 20px" prop="appId" align="left">
            <el-input v-model="deviceMonitor.appId" placeholder="请输入APP_ID" :maxlength="50"
                      class="input-width" readonly></el-input>
          </el-form-item>
          <el-form-item label="APP_KEY" style="margin-left: 20px" prop="appKey" align="left">
            <el-input v-model="deviceMonitor.appKey" placeholder="请输入APP_KEY" :maxlength="50"
                      class="input-width" readonly></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="main-footer">
        <el-button type="primary" @click="saveSet">保存设置</el-button>
      </div>
    </section>
  </div>
</template>

<script>
  import json from '../../assets/city.json';
  import {
    ipValid, numValid, isMac, isApp, doubleValid, noSValidator, noValidator
  } from '../../assets/js/api.js'

  export default {
    data() {
      let numValidator = (rule, value, callback) => {
        if (!numValid(value)) {
          callback(new Error("只能输入数字"));
        } else {
          callback();
        }
      };
      let ipValidator = (rule, value, callback) => {
        if (!ipValid(value)) {
          callback(new Error("请输入正确的IP"));
        } else {
          callback();
        }
      };
      let appValidator = (rule, value, callback) => {
        if (!isApp(value)) {
          callback(new Error("正确格式为英文字母、数字"));
        } else {
          callback();
        }
      };
      return {
        isShow: true,
        deviceMonitor: {devpos: {height: ''}}, props: {value: 'o', label: 'n', children: 'c'},
        selectedOptions2: [], macAddress: "", provinceList: json,
        rules: {
          serverip: [{required: true, message: '请输入IP地址', trigger: 'blur'},
            {validator: ipValidator, trigger: "change,blur"}],
          serverport: [{required: true, message: '请输入端口', trigger: 'blur'},
            {validator: numValidator, trigger: "change,blur"}],
          appId: [{required: true, message: '请输入APP_ID', trigger: 'blur'},
            {validator: appValidator, trigger: "change,blur"}],
          appKey: [{required: true, message: '请输入APP_KEY', trigger: 'blur'},
            {validator: appValidator, trigger: "change,blur"}]
        }
      }
    },
    methods: {
      //省市县变化
      areaChange(value) {
        this.selectedOptions2 = value;
        if (value.length == 1) {
          this.deviceMonitor.provinceCode = value[0];
        } else if (value.length == 2) {
          this.deviceMonitor.provinceCode = value[0];
          this.deviceMonitor.cityCode = value[1];
        } else if (value.length == 3) {
          this.deviceMonitor.provinceCode = value[0];
          this.deviceMonitor.cityCode = value[1];
          this.deviceMonitor.areaCode = value[2];
        } else if (value.length == 4) {
          this.deviceMonitor.provinceCode = value[0];
          this.deviceMonitor.cityCode = value[1];
          this.deviceMonitor.areaCode = value[2];
          this.deviceMonitor.townCode = value[3];
        }
      },
      /**只能输入小数点后2位--》高度*/
      checkHeight(value) {//^[0-9]+(\.[0-9]{1,3})?$
        let isVaild = true;
        if (value.length > 0) {
          if (!doubleValid(value)) {
            this.$message.error('请输入正确的高度,小数点后2位');
            isVaild = false;
          }
        }
        return isVaild;
      },
      //保存设置
      saveSet() {
        if (this.deviceMonitor.devId.length == 0) {
          this.$message.error('请输入设备ID');
          return;
        }
        if (this.deviceMonitor.devName.length == 0) {
          this.$message.error('请输入设备名称');
          return;
        }
        if (this.selectedOptions2.length == 0 || this.deviceMonitor.location.length == 0) {
          this.$message.error('请完善安装地址');
          return;
        }
        if (this.deviceMonitor.devpos.height.length == 0) {
          this.$message.error('请输入高度');
          return;
        }
        if (this.deviceMonitor.devpos.height) {
          if (!this.checkHeight(this.deviceMonitor.devpos.height)) {
            return;
          }
        }
        this.$nextTick(() => {
          this.$refs.deviceMonitor.validate((valid) => {
            if (valid) {
              this.$confirm('确定保存设置?', '提示', {type: 'info'}).then(() => {
                this.deviceMonitor.serverport = parseInt(this.deviceMonitor.serverport + "");
                let param = {
                  msgId: "b7518c70", type: 4193, cmd: 4256, moduleID: 255, timestamp: new Date().getTime(),
                  data: this.deviceMonitor
                };
                this.$emit('openLoading');
                this.$post(param, "命令下发成功").then((data) => {
                  this.$emit('closeLoading');
                  if ("000000" == data.code) {
                    this.$emit('showDialog', false, true);
                  }
                }).catch((err) => {
                  this.$emit('closeLoading');
                });
              }).catch(() => {
              });
            }
          });
        });
      },
      //获取设备基本信息
      getDeviceParam() {
        let param = {msgId: 'b7518c70', type: 4194, cmd: 4521, moduleID: 255, timestamp: new Date().getTime()};
        this.$emit('openLoading');
        this.$post(param).then((data) => {
          this.$emit('closeLoading');
          if ("000000" == data.code) {
            this.macAddress = data.data.mac;
            this.deviceMonitor = data.data;
            if (data.data.townCode) {
              this.selectedOptions2 = [data.data.provinceCode, data.data.cityCode, data.data.areaCode, data.data.townCode];
            } else {
              this.selectedOptions2 = [];
            }
            this.deviceMonitor.devpos.height = parseInt(data.data.devpos.height + '').toFixed(2) + '';
            let gsm = data.data.devId.indexOf('ZDKD') == 0 ? 0 : (data.data.devId.indexOf('ZDKB') == 0 || data.data.devId.indexOf('ZDM2') == 0) ? 1 : 2;
            sessionStorage.setItem("band4", data.data.band4 ? data.data.band4 : 1);
            sessionStorage.setItem("deviceId", data.data.devId);
            sessionStorage.setItem("hasGsmModule", gsm);
            sessionStorage.setItem("hasPaModule", data.data.hasPaModule ? data.data.hasPaModule : 0);
            sessionStorage.setItem("isOld", data.data.setWifiStaticIp);
            sessionStorage.setItem("devCfg", data.data.devCfg ? data.data.devCfg : 0);
          }
        }).catch((err) => {
          console.log(err);
          this.$message.error(err);
          this.$emit('closeLoading');
        });
      }
    },
    mounted() {
      this.getDeviceParam();
    }
  }
</script>
<style scoped>
  @media screen and (min-width: 320px) and (max-width: 799px) {
    .card-width {
      margin-left: 0;
    }

    .input-width {
      width: 80%
    }
  }

  @media screen and (min-width: 800px) {
    .card-width {
      margin-left: 20px;
    }

    .input-width {
      width: 60%
    }
  }
</style>
