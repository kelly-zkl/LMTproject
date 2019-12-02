<template>
  <div>
    <section class="content">
      <el-form label-width="110px" label-position="left" :model="deviceParam">
        <h4 style="text-align: left;margin-top: 0">设备信息</h4>
        <div class="add-appdiv card-width">
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备ID" align="left" style="margin: 0">
                {{deviceMonitor.devId ? deviceMonitor.devId : '--'}}
              </el-form-item>
              <el-form-item label="设备形态" align="left" style="margin: 0">{{devForm}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备名称" align="left" style="margin: 0">
                {{deviceMonitor.devName ? deviceMonitor.devName : '--'}}
              </el-form-item>
              <el-form-item label="设备类型" align="left" style="margin: 0">
                {{deviceMonitor.devType?deviceMonitor.devType:'--'}}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="add-appdiv card-width">
          <el-row>
            <el-col :span="12">
              <h4 style="text-align: left;margin-top: 0">版本信息</h4>
              <el-form-item label="固件版本" align="left" style="margin: 0">
                {{deviceMonitor.hw_version ? deviceMonitor.hw_version : '未上报'}}
              </el-form-item>
              <el-form-item label="软件版本" align="left" style="margin: 0">
                {{deviceMonitor.app_version ? deviceMonitor.app_version : '未上报'}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <h4 style="text-align: left;margin-top: 0">设备控制</h4>
              <el-form-item label="重启" align="left" style="margin: 0">
                <el-button type="primary" size="medium" @click="runStartDevice = true">重启</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <h4 style="text-align: left;margin-top: 0">设备状态</h4>
        <div class="add-appdiv card-width">
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备温度：" align="left" style="margin: 0"><span
                v-bind:class="boardParam.temperature > 80 ? 'text-red' : boardParam.temperature > 50 ? 'text-yellow' :'text-green'">
                  {{boardParam.temperature != null ? boardParam.temperature : '--'}}°C
                </span>
              </el-form-item>
              <el-form-item label="cpu占用率：" align="left" style="margin: 0"><span
                v-bind:class="boardParam.cpu > 0.8 ? 'text-red' : boardParam.cpu > 0.5 ? 'text-yellow' :'text-green'">
                  {{boardParam.cpu != null ? (boardParam.cpu * 100).toFixed(2) : '--'}}%
                </span>
              </el-form-item>
              <el-form-item label="内存占用率：" align="left" style="margin: 0"><span
                v-bind:class="boardParam.memory > 0.8 ? 'text-red' : boardParam.memory > 0.5 ? 'text-yellow' :'text-green'">
                  {{boardParam.memory != null ? (boardParam.memory * 100).toFixed(2) : '--'}}%
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="3G信号强度：" align="left" style="margin: 0">
                {{deviceParam.rssi3G != null ? deviceParam.rssi3G : '--'}}dbm
              </el-form-item>
              <el-form-item label="持续工作时间：" align="left" style="margin: 0">
                {{boardParam.duration != null ? boardParam.duration : '--'}}秒
              </el-form-item>
              <el-form-item label="侦码状态：" align="left" style="margin: 0">
                上报，{{boardParam.criminalCodeStatus != null ? boardParam.criminalCodeStatus : '--'}}/min(单路)
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="add-appdiv card-width">
          <el-tabs v-model="activeItem" type="card" @tab-click="handleClick">
            <el-tab-pane v-bind:label="tab.name" v-bind:name="tab.type" v-for="tab in activeName"
                         :key="tab.type"></el-tab-pane>
          </el-tabs>
          <el-row style="margin-left: 20px">
            <el-col :span="12">
              <el-form-item label="基带板温度：" align="left" style="margin: 0"><span
                v-bind:class="subParam.temperature > 80 ? 'text-red' : subParam.temperature > 50 ? 'text-yellow' :'text-green'">
                  {{subParam.temperature != null ? subParam.temperature : '--'}}°C
                </span>
              </el-form-item>
              <el-form-item label="cpu占用率：" align="left" style="margin: 0"><span
                v-bind:class="subParam.cpu > 0.8 ? 'text-red' : subParam.cpu > 0.5 ? 'text-yellow' :'text-green'">
                  {{subParam.cpu != null ? (subParam.cpu * 100).toFixed(2) : '--'}}%
                </span>
              </el-form-item>
              <el-form-item label="内存占用率：" align="left" style="margin: 0"><span
                v-bind:class="subParam.memory > 0.8 ? 'text-red' : subParam.memory > 0.5 ? 'text-yellow' :'text-green'">
                  {{subParam.memory != null ? (subParam.memory * 100).toFixed(2) : '--'}}%
                </span>
              </el-form-item>
              <el-form-item label="磁盘使用率：" align="left" style="margin: 0"><span
                v-bind:class="subParam.disk > 0.8 ? 'text-red' : subParam.disk > 0.5 ? 'text-yellow' :'text-green'">
                  {{subParam.disk != null ? (subParam.disk * 100).toFixed(2) : '--'}}%
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="输出功率：" align="left" style="margin: 0">
                {{subParam.power != null ? subParam.power : '--'}}dBm
              </el-form-item>
              <el-form-item label="抓取条数：" align="left" style="margin: 0" v-show="activeItem != 'G'">
                {{subParam.catchCount != null ? subParam.catchCount : '--'}}条
              </el-form-item>
              <el-form-item label="移动抓取条数：" align="left" style="margin: 0" v-show="activeItem == 'G'">
                {{subParam.catchCount_CMCC != null ? subParam.catchCount_CMCC : '--'}}条
              </el-form-item>
              <el-form-item label="联通抓取条数：" align="left" style="margin: 0" v-show="activeItem == 'G'">
                {{subParam.catchCount_CMUC != null ? subParam.catchCount_CMUC : '--'}}条
              </el-form-item>
              <el-form-item label="持续工作时间：" align="left" style="margin: 0">
                {{subParam.duration != null ? subParam.duration : '--'}}秒
              </el-form-item>
              <el-form-item label="同步状态：" align="left" style="margin: 0" v-show="activeItem=='M'">
                {{subParam.sync_status==0?'空口失步':subParam.sync_status==1?'空口同步':subParam.sync_status==2?'GPS失步':subParam.sync_status==3?'GPS同步':
                subParam.sync_status==5?'异频不同步':'--'}}
              </el-form-item>
              <el-form-item label="频偏校准：" align="left" style="margin: 0" v-show="activeItem!='M'&&activeItem!='G'">
                {{subParam.freqOffsetAdjustState==0?'失败':subParam.freqOffsetAdjustState==1?'成功': '--'}}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <!--重启设备-->
      <div class="popu">
        <el-dialog title="" :visible.sync="runStartDevice" :width="dialogWidth">
          <section>
            <p style="font-size: 16px;padding-bottom: 20px">确认重启设备？</p>
            <el-row>
              <el-col :span="12">
                <el-button @click="restartDevice" type="text" class="left" size="medium" :loading="loading">重启
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button @click="runStartDevice = false" type="text" class="right">取消</el-button>
              </el-col>
            </el-row>
          </section>
        </el-dialog>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        deviceParam: {},
        boardParam: {},
        subParam: {},
        deviceMonitor: {},
        devForm: '--',
        devType: '--',
        loading: false,
        runStartDevice: false,//重启设备
        activeItem: 'T',
        activeName: [{name: '电信', type: 'T'}, {name: '移动', type: 'M'}, {name: '联通', type: 'U'}],
        dialogWidth: this.$Is_Pc() ? '380px' : '300px',
        devForms: [{code: "ENHANCED_OUTDOOR_POLE", name: "增强室外抱杆型"}, {code: "CON_OUTDOOR_MOCRO", name: "室外微热点"},
          {code: "MID_OUTDOOR_POLE", name: "中功率卡口"}, {code: 'CON_OUTDOOR_POLE', name: '通用室外抱杆型'}],
        intervalid: null
      }
    },
    //页面关闭时停止刷新
    beforeDestroy() {
      clearInterval(this.intervalid);
    },
    methods: {
      //标签页的变化
      handleClick(tab, event) {
        this.activeItem = tab.name;
        this.getSubStatus();
      },
      //定时刷新设备状态
      dataTask() {
        if (!this.intervalid) {
          this.intervalid = setInterval(() => {
            this.getDeviceStatus();
          }, 30 * 1000);
        }
      },
      //重启设备
      restartDevice() {
        this.runStartDevice = false;
        let param = {msgId: "b7518c70", type: 4192, cmd: 4526, moduleID: 255, timestamp: new Date().getTime()};
        this.$emit('openLoading');
        this.$post(param).then((data) => {
          this.$emit('closeLoading');
          if ("000000" == data.code) {
            this.$message({message: '设备正在重启，请稍后...', type: 'success'});
          }
        }).catch((err) => {
          this.$message.error(err);
          this.$emit('closeLoading');
        });
      },
      //获取设备基本信息
      getDeviceParam() {
        let param = {msgId: 'b7518c70', type: 4194, cmd: 4521, moduleID: 255, timestamp: new Date().getTime()};
        this.$emit('openLoading');
        this.$post(param).then((data) => {
          this.$emit('closeLoading');
          if ("000000" == data.code) {
            this.deviceMonitor = data.data;
            if (data.data.devForm.length > 0) {
              this.devForm = this.getDevForm(data.data.devForm);
            }
            let gsm = data.data.devId.indexOf('ZDKD') == 0 ? 0 : (data.data.devId.indexOf('ZDKB') == 0 || data.data.devId.indexOf('ZDM2') == 0) ? 1 : 2;
            sessionStorage.setItem("band4", data.data.band4 ? data.data.band4 : 0);
            sessionStorage.setItem("deviceId", data.data.devId);
            sessionStorage.setItem("hasGsmModule", gsm);
            sessionStorage.setItem("hasPaModule", data.data.hasPaModule ? data.data.hasPaModule : 0);
            sessionStorage.setItem("isOld", data.data.setWifiStaticIp);
            if (data.data.hasGsmModule == 1) {
              this.activeName = [{name: '电信', type: 'T'}, {name: '移动', type: 'M'},
                {name: '联通', type: 'U'}, {name: 'GSM', type: 'G'}];
            }
            this.$emit('showDialog', false, false);
          }
        }).catch((err) => {
          this.$message.error(err);
          this.$emit('closeLoading');
        });
      },
      getDevForm(val) {
        for (let item of this.devForms) {
          if (val == item.code) {
            return item.name;
          }
        }
      },
      //获取设备状态
      getDeviceStatus() {
        let param = {msgId: "b7518c70", type: 4194, cmd: 4527, moduleID: 255, timestamp: new Date().getTime()};
        this.$post(param).then((data) => {
          if ("000000" == data.code) {
            this.deviceParam = data.data;
            this.deviceParam.deviceMonitorList.forEach((item) => {
              if ('M' == item.operationType) {
                this.boardParam = item;
              }
            });
            this.getSubStatus();
          }
        }).catch((err) => {
          this.$message.error(err);
        });
      },
      //各个基带板的参数
      getSubStatus() {
        if (this.deviceParam != null) {
          if (this.deviceParam.deviceMonitorList.length > 0) {
            this.deviceParam.deviceMonitorList.forEach((item) => {
              if (this.activeItem == item.operationType) {
                this.subParam = item;
              }
            });
          }
        }
      }
    },
    mounted() {
      this.getDeviceParam();
      this.getDeviceStatus();
      this.dataTask();
    }
  }
</script>
<style scoped>
  .text-green {
    color: #008000;
  }

  .text-yellow {
    color: #FF6A10;
  }

  .text-red {
    color: #C23531;
  }

  @media screen and (min-width: 320px) and (max-width: 799px) {
    .card-width {
      margin-left: 0;
    }
  }

  @media screen and (min-width: 800px) {
    .card-width {
      margin-left: 20px;
    }
  }
</style>
