<template>
  <div>
    <section class="content">
      <h4 style="text-align: left;margin-top: 0">设备配置</h4>
      <div class="add-appdiv card-width" style="position: relative">
        <el-tabs v-model="activeItem" type="card" @tab-click="handleClick">
          <el-tab-pane label="载波信息" name="band" style="margin-left: 20px" v-if="band4== 0">
            <BandSet @openLoading="openLoading" @closeLoading="closeLoading" ref="band"></BandSet>
          </el-tab-pane>
          <el-tab-pane label="载波信息" name="band4" style="margin-left: 20px" v-if="band4== 1">
            <band4 @openLoading="openLoading" @closeLoading="closeLoading" ref="band4"></band4>
          </el-tab-pane>
          <el-tab-pane label="PA信息" name="paset" style="margin-left: 20px" v-if="hasPaModule== 1">
            <PaSet @openLoading="openLoading" @closeLoading="closeLoading" ref="paset"></PaSet>
          </el-tab-pane>
          <el-tab-pane label="GSM扫频工具" name="gsm" style="margin-left: 20px" v-if="hasGsmModule== 1">
            <gsmScan @openLoading="openLoading" @closeLoading="closeLoading" ref="gsmscan"></gsmScan>
          </el-tab-pane>
          <el-tab-pane label="LTE扫频工具" name="lte" style="margin-left: 20px">
            <lteScan @openLoading="openLoading" @closeLoading="closeLoading" ref="ltescan"></lteScan>
          </el-tab-pane>
        </el-tabs>
        <!--<div style="position: absolute;top: 30px;right: 30px">-->
        <!--<span style="color: #999;font-size: 15px;margin-right: 10px">{{snifer.auto ? '已开启' : '关闭'}}</span>-->
        <!--<el-button type="primary" @click="getSniffer()">自动扫频</el-button>-->
        <!--</div>-->
      </div>
      <!--自动扫频-->
      <el-dialog title="自动扫频设置" :visible.sync="runSetSniffer" :width="dialWidth" class="gray-form">
        <el-form label-width="120px" label-position="right" :model="sniffer">
          <el-form-item label="自动扫频" align="left">
            <el-switch v-model="sniffer.snifferStart" :active-value="1" :inactive-value="0"
                       active-color="#34CBFE" inactive-color="#bbb"></el-switch>
          </el-form-item>
          <el-form-item label="扫频模式" align="left" v-show="sniffer.snifferStart==1">
            <el-radio-group v-model="sniffer.snifferMode">
              <el-radio :label="0">开机自动扫频</el-radio>
              <el-radio :label="1">定时扫频</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="sniffer.snifferStart==1 && sniffer.snifferMode == 1" align="left">
            <el-time-picker v-model="sniffer.startTime" :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                            placeholder="任意时间点" value-format="HH:mm:ss">
            </el-time-picker>
          </el-form-item>
        </el-form>
        <div class="main-footer">
          <el-button @click="setSniffer()" type="primary">保存</el-button>
        </div>
      </el-dialog>
    </section>
  </div>
</template>
<script>
  import {numValid, intValid, hexValidator, mccValidator, pciValidator} from '../../assets/js/api.js'
  import BandSet from '../deviceSet/BandSet';
  import band4 from '../deviceSet/4band';
  import PaSet from "../deviceSet/PaSet.vue";
  import gsmScan from '../deviceSet/GsmScan';
  import lteScan from '../deviceSet/LTEScan';

  export default {
    data() {
      return {
        band4: 0,
        hasGsmModule: 0,
        hasPaModule: 0,
        activeItem: 'first',
        dialWidth: this.$Is_Pc() ? '40%' : '90%',
        runSetSniffer: false,
        sniffer: {snifferStart: 0, snifferMode: 0, startTime: ''}
      }
    },
    methods: {
      handleClick(tab, event) {
        if (tab.name == 'band') {
          this.$refs.band.getBandParam();
        } else if (tab.name == 'band4') {
          if (this.hasGsmModule == 0) {//没有GSM
            this.$refs.band4.getParam()
          } else {
            this.$refs.band4.getGsmParam()
          }
        } else if (tab.name == 'paset') {
          this.$refs.paset.getParam();
          this.$refs.paset.getPaStatus();
        } else if (tab.name == 'gsm') {
          this.$refs.gsmscan.getNetworkData();
          this.$refs.gsmscan.getScanSwitch();
        } else if (tab.name == 'lte') {
          this.$refs.ltescan.getCellData();
          this.$refs.ltescan.getScanData();
        }
      },
      //调用加载
      openLoading() {
        this.$emit('openLoading');
      },
      //取消加载
      closeLoading() {
        this.$emit('closeLoading');
      },
      //设置自动扫频
      setSniffer() {
        if (this.sniffer.snifferMode == 1) {
          if (!this.sniffer.startTime) {
            this.$message.error('请选择扫频时间');
            return;
          }
        }

        let param = {msgId: "b7518c70", type: 4193, cmd: 4532, timestamp: new Date().getTime(), data: this.sniffer};
        this.runSetSniffer = false;
        this.$emit('openLoading');
        this.$post(param, "命令下发成功").then((data) => {
          this.$emit('closeLoading');
        }).catch((error) => {
          this.$emit('closeLoading');
        });
      },
      //获取自动扫频参数
      getSniffer() {
        this.$emit('openLoading');
        let param = {msgId: "b7518c70", type: 4194, cmd: 4533, timestamp: new Date().getTime()};
        this.$post(param).then((data) => {
          this.$emit('closeLoading');
          if ("000000" == data.code) {
            this.runSetSniffer = true;
            this.sniffer = data.data;
          }
        }).catch((err) => {
          this.$emit('closeLoading');
          this.$message.error(err);
          this.runSetSniffer = true;
          this.sniffer = {snifferStart: 0, snifferMode: 0, startTime: ''};
        });
      }
    },
    mounted() {
      this.band4 = sessionStorage.getItem("band4");
      this.hasGsmModule = sessionStorage.getItem("hasGsmModule");
      this.hasPaModule = sessionStorage.getItem("hasPaModule");
      if (this.band4 == 0) {
        this.activeItem = 'band';
      } else {
        this.activeItem = 'band4';
      }
    },
    components: {
      BandSet, band4, PaSet, gsmScan, lteScan
    }
  }
</script>
