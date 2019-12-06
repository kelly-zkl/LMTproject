<template>
  <div>
    <section class="content">
      <h4 style="text-align: left;margin-top: 0">设备配置</h4>
      <div class="add-appdiv card-width" style="position: relative">
        <el-tabs v-model="activeItem" type="card" @tab-click="handleClick">
          <el-tab-pane label="载波信息" name="band4" style="margin-left: 20px" v-if="band4== 1">
            <band4 @openLoading="openLoading" @closeLoading="closeLoading" ref="band4"></band4>
          </el-tab-pane>
          <el-tab-pane label="载波信息" name="band" style="margin-left: 20px" v-else>
            <BandSet @openLoading="openLoading" @closeLoading="closeLoading" ref="band"></BandSet>
          </el-tab-pane>
          <el-tab-pane label="LTE扫频工具" name="lte" style="margin-left: 20px">
            <lteScan @openLoading="openLoading" @closeLoading="closeLoading" ref="ltescan"></lteScan>
          </el-tab-pane>
          <el-tab-pane label="GSM扫频工具" name="gsm" style="margin-left: 20px" v-if="hasGsmModule== 1">
            <gsmScan @openLoading="openLoading" @closeLoading="closeLoading" ref="gsmscan"></gsmScan>
          </el-tab-pane>
          <el-tab-pane label="PA信息" name="paset" style="margin-left: 20px" v-if="hasPaModule== 1">
            <PaSet @openLoading="openLoading" @closeLoading="closeLoading" ref="paset"></PaSet>
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>
  </div>
</template>
<script>
  import BandSet from '../deviceSet/BandSet';
  import band4 from '../deviceSet/4band';
  import PaSet from "../deviceSet/PaSet.vue";
  import gsmScan from '../deviceSet/GsmScan';
  import lteScan from '../deviceSet/LTEScan';

  export default {
    data() {
      return {
        band4: 0, hasGsmModule: 0, hasPaModule: 0, activeItem: 'band'
      }
    },
    methods: {
      handleClick(tab, event) {
        this.clickTab();
      },
      clickTab() {
        if (this.activeItem == 'band') {
          this.$nextTick(() => {
            this.$refs.band.getBandParam();
          })
        } else if (this.activeItem == 'band4') {
          this.$nextTick(() => {
            if (this.hasGsmModule == 1) {//有GSM
              this.$refs.band4.getGsmParam()
            } else {
              this.$refs.band4.getParam()
            }
          })
        } else if (this.activeItem == 'paset') {
          this.$nextTick(() => {
            this.$refs.paset.getPaParam();
            this.$refs.paset.getPaStatus();
          })
        } else if (this.activeItem == 'gsm') {
          this.$nextTick(() => {
            this.$refs.gsmscan.getNetworkData();
            this.$refs.gsmscan.getScanSwitch();
          })
        } else if (this.activeItem == 'lte') {
          this.$nextTick(() => {
            this.$refs.ltescan.getCellData();
            this.$refs.ltescan.getScanData();
          })
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
      getTableItem(devCfg, type) {
        this.$emit('getTableItem', devCfg, type);
      }
    },
    mounted() {
      this.band4 = sessionStorage.getItem("band4");
      let hasGsmModule = sessionStorage.getItem("hasGsmModule");
      let hasPaModule = sessionStorage.getItem("hasPaModule");
      let devCfg = sessionStorage.getItem("devCfg");
      this.hasGsmModule = devCfg != 0 ? devCfg.indexOf('G') >= 0 ? 1 : 0 : hasGsmModule;
      this.hasPaModule = devCfg != 0 ? devCfg.indexOf('P') >= 0 ? 1 : 0 : hasPaModule;

      if (this.band4 == 1) {
        this.activeItem = 'band4';
      }

      this.clickTab();
    },
    components: {
      BandSet, band4, PaSet, gsmScan, lteScan
    }
  }
</script>
