<template>
  <div>
    <section class="content">
      <!--<h4 style="text-align: left;margin-top: 0">LAN</h4>-->
      <!--<el-tabs v-model="activeItem" @tab-click="handleLanClick" type="card" class="card-width">-->
      <!--<el-tab-pane v-bind:label="tab.name" v-bind:name="tab.type" v-for="tab in activeName"-->
      <!--:key="tab.type"></el-tab-pane>-->
      <!--</el-tabs>-->
      <!--<el-form ref="networkData" label-width="120px" label-position="left" :rules="rules"-->
      <!--:model="networkData1" class="card-width">-->
      <!--<div class="add-appdiv">-->
      <!--<el-form-item label="IP地址" align="left" prop="lan_ip">-->
      <!--<el-input placeholder="请输入IP地址" :maxlength="15" v-model="networkData1.lan_ip"-->
      <!--class="input-width"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="子网掩码" align="left" prop="lan_subnetmask">-->
      <!--<el-input placeholder="请输入IP地址" :maxlength="15" v-model="networkData1.lan_subnetmask"-->
      <!--class="input-width"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="默认网关" align="left" prop="lan_defaultgateway">-->
      <!--<el-input placeholder="请输入IP地址" :maxlength="15" v-model="networkData1.lan_defaultgateway"-->
      <!--class="input-width"></el-input>-->
      <!--</el-form-item>-->
      <!--</div>-->
      <!--</el-form>-->
      <h4 style="text-align: left;border-left: #33CCFF 3px solid;margin-top: 0;padding-left: 5px">WAN</h4>
      <el-form>
        <el-form-item label="启用网络" align="left">
          <el-radio-group v-model="networkData.ipMode" @change="handleWanClick" align="left">
            <el-radio-button :label="tab.type" v-for="tab in wanNames" :key="tab.type">{{tab.name}}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="add-appdiv card-width" v-if="networkData.ipMode == 'static'">
        <el-form ref="networkData" label-width="120px" label-position="left" :model="networkData">
          <!--<el-form-item label="IP设置方式" align="left">-->
          <!--<el-radio-group v-model="networkData.ipMode" size="medium" @change="changeIpset">-->
          <!--<el-radio-button :label="item.type" v-for="item in setTypes" :key="item.type" size="medium">{{item.name}}-->
          <!--</el-radio-button>-->
          <!--</el-radio-group>-->
          <!--</el-form-item>-->
          <el-form-item label="IP地址" align="left" prop="deviceIp" v-if="networkData.ipMode == 'static'">
            <el-input placeholder="请输入IP地址" :maxlength="15" v-model="networkData.deviceIp" class="input-width"
                      @change="changeIpVal"></el-input>
          </el-form-item>
          <el-form-item label="子网掩码" align="left" prop="subMask" v-if="networkData.ipMode == 'static'">
            <el-input placeholder="请输入IP地址" :maxlength="15" v-model="networkData.subMask" class="input-width"
                      @change="changeIpVal"></el-input>
          </el-form-item>
          <el-form-item label="默认网关" align="left" prop="gateway" v-if="networkData.ipMode == 'static'">
            <el-input placeholder="请输入IP地址" :maxlength="15" v-model="networkData.gateway" class="input-width"
                      @change="changeIpVal"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-footer">
        <el-button @click="save()" type="primary" v-show="networkData.ipMode == 'static'">保存配置</el-button>
      </div>
      <!--参数是否立即生效-->
      <div class="popu">
        <el-dialog title="" :visible.sync="runStartDevice" :width="dialogWidth">
          <section>
            <p style="font-size: 16px;padding-bottom: 20px">新的设置需要重启设备才能生效</p>
            <el-row>
              <el-col :span="8">
                <el-button @click="activeNow = 1;saveSet()" type="text" class="left">立即生效</el-button>
              </el-col>
              <el-col :span="8">
                <el-button @click="activeNow = 0;saveSet()" type="text" class="left">稍后生效</el-button>
              </el-col>
              <el-col :span="8">
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
  import {ipValid, numValid} from '../../assets/js/api.js'

  export default {
    data() {
      let ipValidator = (rule, value, callback) => {
        if (!ipValid(value)) {
          callback(new Error("请输入正确的IP"));
        } else {
          callback();
        }
      };
      return {
        runStartDevice: false,//设置完成重启设备
        dialogWidth: this.$Is_Pc() ? '380px' : '300px',
        networkData: {ipMode: 'none'},
        activeNow: 1,
        activeItem: 'M',
        activeName: [{name: '移动TDD', type: 'M'}, {name: '联通FDD', type: 'U'},
          {name: '电信FDD', type: 'T'}, {name: 'WIFI', type: 'wifi'}],
        wanNames: [{name: '启用3G', type: 'none'}, {name: '启用有线自动', type: 'dhcp'},
          {name: '启用有线手动', type: 'static'}],
        setTypes: [{name: '自动', type: 'dhcp'}, {name: '手动', type: 'static'}],
        netParam: {},
        ipWay: ''
      }
    },
    methods: {
      //LAN标签页的变化
      handleLanClick(tab, event) {
      },
      //WAN标签页的变化
      handleWanClick(val) {
        this.networkData.ipMode = val;
        this.clearData();
        if (this.networkData.ipMode != 'static') {
          this.save();
        }
      },
      //默认值
      clearData() {
        if (this.networkData.ipMode == this.ipWay) {
          this.networkData = Object.assign({}, this.netParam);
          this.networkData.ipMode = val;
        } else {
          if (this.networkData.ipMode == 'dhcp') {//有线
            this.networkData = {ipMode: 'dhcp'};
          } else if (this.networkData.ipMode == 'none') {//3G
            this.networkData = {ipMode: 'none'};
          } else {
            this.networkData = {ipMode: 'static', deviceIp: '0.0.0.0', subMask: '255.255.255.0', gateway: '0.0.0.0'};
          }
        }
      },
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
      //保存前验证
      save() {
        if (this.networkData.ipMode == 'static') {
          if (!this.changeIpVal(this.networkData.deviceIp) || !this.changeIpVal(this.networkData.subMask) ||
            !this.changeIpVal(this.networkData.gateway)) {
            return;
          }
        }
        this.runStartDevice = true;
      },
      //保存设置
      saveSet() {
        this.runStartDevice = false;
        if (this.networkData.ipMode == 'none') {//3G
          this.networkData = {ipMode: 'none'};
        }
        if (this.networkData.ipMode == 'dhcp') {
          this.networkData = {ipMode: 'dhcp'};
        }
        let param = {
          msgId: "b7518c70", type: 4193, cmd: 4525, moduleID: 255, timestamp: new Date().getTime(),
          data: this.networkData, activeNow: this.activeNow
        };
        this.$emit('openLoading');
        this.$post(param, "命令下发成功").then((data) => {
          this.$emit('closeLoading');
          if ("000000" == data.code) {
            this.getIP();
          }
        }).catch((error) => {
          this.$emit('closeLoading');
        });
      },
      //获取网络参数
      getIP() {
        let param = {msgId: "b7518c70", type: 4194, cmd: 4524, moduleID: 255, timestamp: new Date().getTime()};
        this.$emit('openLoading');
        this.$post(param).then((data) => {
          this.$emit('closeLoading');
          if ("000000" == data.code && data.data) {
            this.netParam = Object.assign({}, data.data);
            this.ipWay = data.data.ipMode;
            this.networkData = Object.assign({}, data.data);
          }
        }).catch((err) => {
          this.$message.error(err);
          this.$emit('closeLoading');
        });
      }
    },
    mounted() {
      this.clearData();
      this.getIP();
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
