<template>
  <div>
    <section class="content">
      <h4 style="text-align: left;margin-top: 0">基本信息</h4>
      <el-form label-width="120px" label-position="left" ref="deviceMonitor" :rules="rules" :model="deviceMonitor"
               class="card-width">
        <div class="content add-appdiv">
          <el-form-item label="设备ID" align="left" required>
            <el-input v-model="deviceMonitor.devId" placeholder="请输入设备ID" :maxlength="20"
                      class="input-width"></el-input>
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
            {{deviceMonitor.version ? deviceMonitor.version : "未上报"}}
          </el-form-item>
          <el-form-item label="MAC地址" prop="mac" style="text-align: left;margin: 0">
            {{deviceMonitor.mac ? deviceMonitor.mac : "未上报"}}
          </el-form-item>
        </div>
        <div class="content add-appdiv" v-if="band4 == 1">
          <h4 style="text-align: left;border-left: #33CCFF 3px solid;margin-top: 0;padding-left: 5px">
            GPS配置
          </h4>
          <el-form-item label="GPS" style="text-align: left;margin: 0">
            <el-radio-group size="medium" v-model="gpsParam.timingMode" style="margin-right: 10px">
              <el-radio-button :label="1">GPS同步</el-radio-button>
              <el-radio-button :label="2">空口同步</el-radio-button>
            </el-radio-group>
            <el-input v-model.number="gpsParam.gpsOffset" placeholder="请输入帧头偏移" :maxlength="20"
                      style="width: 200px" v-show="gpsParam.timingMode==1"></el-input>
            <el-button @click="saveGps()" size="medium" type="primary" style="margin-left: 10px">设置
            </el-button>
          </el-form-item>
        </div>
        <!--<div class="content add-appdiv">-->
        <!--<h4 style="text-align: left;border-left: #33CCFF 3px solid;margin-top: 0;padding-left: 5px">-->
        <!--WAN口网络配置-->
        <!--</h4>-->
        <!--<el-form-item label="网络模式" align="left" style="text-align: left;margin: 0">-->
        <!--<el-radio-group v-model="wanItem" @change="handleWanClick" align="left" size="medium">-->
        <!--<el-radio-button :label="tab.type" v-for="tab in wanNames" :key="tab.type">{{tab.name}}-->
        <!--</el-radio-button>-->
        <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--</div>-->
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
                      class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="APP_KEY" style="margin-left: 20px" prop="appKey" align="left">
            <el-input v-model="deviceMonitor.appKey" placeholder="请输入APP_KEY" :maxlength="50"
                      class="input-width"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="main-footer">
        <el-button type="primary" @click="saveSet">保存设置</el-button>
      </div>
      <!--修改MAC地址-->
      <div class="popu">
        <el-dialog title="" :visible.sync="runModifyMAC" :width="dialogWidth">
          <section>
            <p style="font-size: 16px;padding-bottom: 20px">确定修改MAC地址？</p>
            <el-row>
              <el-col :span="12">
                <el-button @click="modifyMAC()" type="text" class="left">确定</el-button>
              </el-col>
              <el-col :span="12">
                <el-button @click="cancelMac()" type="text" class="right">取消
                </el-button>
              </el-col>
            </el-row>
          </section>
        </el-dialog>
      </div>
    </section>
  </div>
</template>

<script>
  import json from '../../assets/city.json';
  import {
    ipValid, numValid, mobileValidator, isMac, isApp, doubleValid,
    longitudeValid, latitudeValid, noSValidator, noValidator
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
      let idValidator = (rule, value, callback) => {
        if (noValidator(value)) {
          callback(new Error("请输入正确的设备id，由英文字母、数字、下划线、横线组成"));
        } else {
          callback();
        }
      };
      let devValidator = (rule, value, callback) => {
        if (noSValidator(value)) {
          callback(new Error("请输入正确的设备名称，由汉字、数字、英文字母、下划线、横线组成"));
        } else {
          callback();
        }
      };
      return {
        runModifyMAC: false,//修改MAC地址
        isShow: true,
        band4: 0,
        wanItem: '3Gnet',
        wanNames: [{name: '启用3G', type: '3Gnet'}, {name: '启用有线', type: 'wired'}],
        deviceMonitor: {devpos: {height: '', longitude: '', latitude: ''}},
        props: {value: 'o', label: 'n', children: 'c'},
        selectedOptions2: [],
        macAddress: "",
        provinceList: json,
        dialogWidth: this.$Is_Pc() ? '380px' : '300px',
        gpsParam: {timingMode: 2, gpsOffset: 0},
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
      handleWanClick(val) {
        this.wanItem = val;
        this.setNetType();
      },
      //获取GPS参数
      getGps() {
        let param = {msgId: "b7518c70", type: 4194, cmd: 4535, moduleID: 3, timestamp: new Date().getTime()};
        this.$emit('openLoading');
        this.$post(param).then((data) => {
          this.$emit('closeLoading');
          if ("000000" == data.code && data.data) {
            this.gpsParam = data.data;
          }
        }).catch((err) => {
          this.$message.error(err);
          this.$emit('closeLoading');
        });
      },
      //设置gps
      saveGps() {
        if (this.gpsParam.timingMode == 1 && (!this.gpsParam.gpsOffset || this.gpsParam.gpsOffset.length == 0)) {
          this.$message.error('请输入帧头偏移');
          return;
        }
        let param = {
          msgId: "b7518c70", type: 4193, cmd: 4534, timestamp: new Date().getTime(), data: this.gpsParam
        };
        this.$emit('openLoading');
        this.$post(param, "命令下发成功").then((data) => {
          this.$emit('closeLoading');
        }).catch((err) => {
          this.$message.error(err);
          this.$emit('closeLoading');
        });
      },
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
      /** 验证输入的mac地址*/
      changeMAC(val) {
        let isVaild = true;
        if (val.length > 0) {
          if (!isMac(val)) {
            this.$message.error('请输入正确的mac地址');
            isVaild = false;
          }
        } else {
          this.$message.error('请输入mac地址');
          isVaild = false;
        }
        return isVaild;
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
      /** 经度验证*/
      changeLon(value) {
        let isVaild = true;
        if (value.length > 0) {
          if (!longitudeValid(value)) {
            this.$message.error('请输入正确的经度');
            isVaild = false;
          }
        }
        return isVaild;
      },
      /** 纬度验证*/
      changeLat(value) {
        let isVaild = true;
        if (value.length > 0) {
          if (!latitudeValid(value)) {
            this.$message.error('请输入正确的纬度');
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
//        if (this.deviceMonitor.devpos.latitude.length == 0 || this.deviceMonitor.devpos.longitude.length == 0) {
//          this.$message.error('请输入经纬度');
//          return;
//        }
        if (this.deviceMonitor.devpos.height.length == 0) {
          this.$message.error('请输入高度');
          return;
        }
//        if (this.deviceMonitor.devpos.longitude) {
//          if (!this.changeLon(this.deviceMonitor.devpos.longitude)) {
//            return;
//          }
//        }
//        if (this.deviceMonitor.devpos.latitude) {
//          if (!this.changeLat(this.deviceMonitor.devpos.latitude)) {
//            return;
//          }
//        }
        if (this.deviceMonitor.devpos.height) {
          if (!this.checkHeight(this.deviceMonitor.devpos.height)) {
            return;
          }
        }
//        if (this.deviceMonitor.phoneNumber) {
//          if (!this.changePhone(this.deviceMonitor.phoneNumber)) {
//            return;
//          }
//        }
        if (this.deviceMonitor.mac) {
          if (!this.changeMAC(this.deviceMonitor.mac)) {
            return;
          }
        }
        this.$refs['deviceMonitor'].validate((valid) => {
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
      },
      //修改MAC地址
      modifyMAC() {
        this.runModifyMAC = false;
        let param = {
          msgId: "b7518c70", type: 4193, cmd: 4522, moduleID: 255, timestamp: new Date().getTime(),
          data: {mac: this.deviceMonitor.mac}
        };
        this.$emit('openLoading');
        this.$post(param, "命令下发成功").then((data) => {
          this.$emit('closeLoading');
          if ("000000" == data.code) {
            this.isShow = true;
            this.macAddress = this.deviceMonitor.mac;
          }
        }).catch((error) => {
          this.$emit('closeLoading');
          this.deviceMonitor.mac = this.macAddress;
          this.isShow = true;
        });
      },
      updateMAC() {
        if (this.deviceMonitor.mac) {
          if (!this.changeMAC(this.deviceMonitor.mac)) {
            return;
          }
        }
        this.runModifyMAC = true;
      },
      cancelMac() {
        this.deviceMonitor.mac = this.macAddress;
        this.runModifyMAC = false;
        this.isShow = true;
      },
      //设置网络类型
      setNetType() {
        let type = (this.wanItem == "wired" ? 0 : 1);
        this.$emit('openLoading');
        let param = {
          msgId: "b7518c70", type: 4193, cmd: 4530, moduleID: 255, timestamp: new Date().getTime(),
          data: {wireless: type}
        };
        this.$post(param, "网络类型设置下发成功").then((data) => {
          this.$emit('closeLoading');
        }).catch((err) => {
          this.$emit('closeLoading');
        })
      },
      //获取网络类型
      getNetType() {
        let param = {msgId: "b7518c70", type: 4194, cmd: 4531, moduleID: 255, timestamp: new Date().getTime()};
        this.$post(param).then((data) => {
          if ("000000" == data.code && data.data) {//"wireless": 1/0,	1为3G，0为固网
            this.wanItem = (data.data.wireless == 0 ? "wired" : "3Gnet");
          }
        }).catch((err) => {
          this.$message.error(err);
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
            this.deviceMonitor.devpos.height = data.data.devpos.height.toFixed(2) + '';
            this.deviceMonitor.devpos.longitude = data.data.devpos.longitude + '';
            this.deviceMonitor.devpos.latitude = data.data.devpos.latitude + '';
            sessionStorage.setItem("band4", data.data.band4 ? data.data.band4 : 0);
            sessionStorage.setItem("hasGsmModule", data.data.hasGsmModule ? data.data.hasGsmModule : 0);
            sessionStorage.setItem("hasPaModule", data.data.hasPaModule ? data.data.hasPaModule : 0);

            this.getBand4();
          }
        }).catch((err) => {
          this.$message.error(err);
          this.$emit('closeLoading');
        });
      },
      getBand4() {
        this.band4 = sessionStorage.getItem("band4");
      }
    },
    mounted() {
      this.getDeviceParam();
      // this.getNetType();
      this.band4 = sessionStorage.getItem("band4");
      if (this.band4 == 1) {
        this.getGps();
      }
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
