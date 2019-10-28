<template>
  <div>
    <section class="content">
      <h4 style="text-align: left;margin-top: 0">设备维护</h4>
      <div class="add-appdiv card-width" style="position: relative">
        <el-tabs v-model="activeItem" type="card" @tab-click="handleClick">
          <el-tab-pane label="网络配置" name="net" style="margin-left: 20px">
            <NetworkSet @openLoading="openLoading" @closeLoading="closeLoading" ref="net"></NetworkSet>
          </el-tab-pane>
          <el-tab-pane label="网络诊断" name="tool" style="margin-left: 20px">
            <DiagnosticTool @openLoading="openLoading" @closeLoading="closeLoading" ref="tool"></DiagnosticTool>
          </el-tab-pane>
          <el-tab-pane label="设备升级" name="upgrade" style="margin-left: 20px" v-if="upgrade">
            <DeviceUpgrade @openLoading="openLoading" @closeLoading="closeLoading" ref="upgrade"></DeviceUpgrade>
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>
  </div>
</template>
<script>
  import NetworkSet from '../deviceSet/NetworkSet';
  import DiagnosticTool from '../deviceSet/DiagnosticTool';
  import DeviceUpgrade from '../deviceSet/DeviceUpgrade';

  export default {
    components: {NetworkSet, DiagnosticTool, DeviceUpgrade},
    data() {
      return {
        activeItem: 'net',
        upgrade: true
      }
    },
    methods: {
      handleClick(tab, event) {
        this.clickTab();
      },
      clickTab() {
        this.$nextTick(() => {
          this.$refs.upgrade.clearTimeOut();
          this.$refs.upgrade.clearInter();
        });
        if (this.activeItem == 'net') {
          this.$nextTick(() => {
            this.$refs.net.clearData();
            this.$refs.net.getIP();
          })
        } else if (this.activeItem == 'upgrade') {
          this.$nextTick(() => {
            this.$refs.upgrade.getUpgradeStatus();
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
      }
    },
    mounted() {
      this.clickTab();
      let deviceId = sessionStorage.getItem("deviceId");
      if (deviceId.indexOf('ZDM1') == 0 || deviceId.indexOf('ZDM7') == 0) {//ZDM1和ZDM7没有升级功能
        this.upgrade = false;
      }
    }
  }
</script>
