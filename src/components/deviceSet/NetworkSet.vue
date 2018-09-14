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
          <el-radio-group v-model="wanItem" @change="handleWanClick" align="left">
            <el-radio-button :label="tab.type" v-for="tab in wanNames" :key="tab.type">{{tab.name}}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="add-appdiv card-width">
        <!--<el-tabs v-model="wanItem" @tab-click="handleWanClick">-->
        <!--<el-tab-pane v-bind:label="tab.name" v-bind:name="tab.type" v-for="tab in wanNames"-->
        <!--:key="tab.type"></el-tab-pane>-->
        <!--</el-tabs>-->
        <el-form ref="networkData" label-width="120px" label-position="left" :rules="rules"
                 :model="networkData">
          <el-form-item label="IP设置方式" align="left" v-if="wanItem == 'wired'">
            <el-radio-group v-model="networkData.ipMode" size="medium" @change="changeIpset">
              <el-radio-button :label="item.type" v-for="item in setTypes" :key="item.type" size="medium">{{item.name}}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="IP地址" align="left" prop="deviceIp">
            <el-input v-if="networkData.ipMode == 'static' && wanItem == 'wired'" placeholder="请输入IP地址"
                      :maxlength="15"
                      v-model="networkData.deviceIp" class="input-width" @change="changeIpVal"></el-input>
            <span v-else>{{networkData.deviceIp}}</span>
          </el-form-item>
          <el-form-item label="子网掩码" align="left" prop="subMask">
            <el-input v-if="networkData.ipMode == 'static' && wanItem == 'wired'" placeholder="请输入IP地址"
                      :maxlength="15"
                      v-model="networkData.subMask" class="input-width" @change="changeIpVal"></el-input>
            <span v-else>{{networkData.subMask}}</span>
          </el-form-item>
          <el-form-item label="默认网关" align="left" prop="gateway">
            <el-input v-if="networkData.ipMode == 'static' && wanItem == 'wired'" placeholder="请输入IP地址"
                      :maxlength="15"
                      v-model="networkData.gateway" class="input-width" @change="changeIpVal"></el-input>
            <span v-else>{{networkData.gateway}}</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-footer">
        <el-button @click="saveSet()" type="primary" v-show="wanItem == 'wired'">保存配置</el-button>
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
        networkData: {ipMode: 'dhcp'},
        activeItem: 'M',
        wanItem: '3Gnet',
        activeName: [{name: '移动TDD', type: 'M'}, {name: '联通FDD', type: 'U'},
          {name: '电信FDD', type: 'T'}, {name: 'WIFI', type: 'wifi'}],
        wanNames: [{name: '启用3G', type: '3Gnet'}, {name: '启用有线', type: 'wired'}],
        setTypes: [{name: '自动', type: 'dhcp'}, {name: '手动', type: 'static'}],
        rules: {
//          deviceIp: [{required: true, message: '请输入ip', trigger: "blur"}, {
//            validator: ipValidator, trigger: "change,blur"
//          }],
//          subMask: [{required: true, message: '请输入子网掩码', trigger: "blur"}, {
//            validator: ipValidator, trigger: "change,blur"
//          }],
//          gateway: [{required: true, message: '请输入默认网关', trigger: "blur"}, {
//            validator: ipValidator, trigger: "change,blur"
//          }]
        },
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
        this.wanItem = val;
        this.clearData();
        this.getIP();
        if (this.netParam.length > 0) {
          this.networkData = this.netParam[this.wanItem];
          if (this.wanItem == 'wired') {
            if (this.ipWay == this.networkData.ipMode) {
              this.networkData = this.netParam[this.wanItem];
            } else {
              this.networkData = {
                ipMode: this.networkData.ipMode, deviceIp: '0.0.0.0',
                subMask: '0.0.0.0', gateway: '0.0.0.0'
              };
            }
          }
        }
        this.setNetType();
      },
      //默认值
      clearData() {
        if (this.wanItem == 'wired') {//有线
          this.networkData = {ipMode: 'dhcp', deviceIp: '0.0.0.0', subMask: '0.0.0.0', gateway: '0.0.0.0'};
        } else {//3G
          this.networkData = {deviceIp: '0.0.0.0', subMask: '0.0.0.0', gateway: '0.0.0.0'};
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
      //ip地址设置方式
      changeIpset(val) {
        if (val == this.ipWay) {
          this.networkData = this.netParam[this.wanItem];
          this.networkData.ipMode = val;
        } else {
          this.networkData = {ipMode: val, deviceIp: '0.0.0.0', subMask: '0.0.0.0', gateway: '0.0.0.0'};
        }
      },
      //保存设置
      saveSet() {
        if (this.networkData.ipMode == 'static') {
          if (!this.changeIpVal(this.networkData.deviceIp) || !this.changeIpVal(this.networkData.subMask) ||
            !this.changeIpVal(this.networkData.gateway)) {
            return;
          }
        }
        this.$refs['networkData'].validate((valid) => {
          if (valid) {
            this.$confirm('确定要保存设置?', '提示', {type: 'info'}).then(() => {
              if (this.networkData.ipMode == 'dhcp') {
                this.networkData = {ipMode: 'dhcp'};
              }
              let param = {
                msgId: "b7518c70", type: 4193, cmd: 4525, moduleID: 255, timestamp: new Date().getTime(),
                data: this.networkData
              };
              this.$emit('openLoading');
              this.$post(param, "命令下发成功").then((data) => {
                this.$emit('closeLoading');
                if ("000000" == data.code) {
                  this.$emit('showDialog', false, true);
                  this.getIP();
                }
              }).catch((error) => {
                this.$emit('closeLoading');
              });
            }).catch(() => {
            });
          }
        });
      },
      //设置网络类型
      setNetType() {
        let type = (this.wanItem == "wired" ? 0 : 1);
        let param = {
          msgId: "b7518c70", type: 4193, cmd: 4530, moduleID: 255, timestamp: new Date().getTime(),
          data: {wireless: type}
        };
        this.$post(param, "网络类型设置下发成功");
      },
      //获取网络类型
      getNetType() {
        let param = {msgId: "b7518c70", type: 4194, cmd: 4531, moduleID: 255, timestamp: new Date().getTime()};
        this.$post(param).then((data) => {
          if ("000000" == data.code && data.data) {//"wireless": 1/0,	1为3G，0为固网
            this.wanItem = (data.data.wireless == 0 ? "wired" : "3Gnet");
            this.getIP();
          }
        }).catch((err) => {
          this.$message.error(err);
        });
      },
      //获取网络参数
      getIP() {
        let param = {msgId: "b7518c70", type: 4194, cmd: 4524, moduleID: 255, timestamp: new Date().getTime()};
        this.$emit('openLoading');
        this.$post(param).then((data) => {
          this.$emit('closeLoading');
          if ("000000" == data.code && data.data) {
            this.netParam = data.data;
            this.ipWay = data.data.wired.ipMode;
            this.networkData = this.netParam[this.wanItem];
          }
        }).catch((err) => {
          this.$message.error(err);
          this.$emit('closeLoading');
        });
      }
    },
    mounted() {
      this.clearData();
      this.getNetType();
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
