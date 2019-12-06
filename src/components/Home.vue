<template>
  <el-container class="main-container" v-loading="loading" element-loading-text="加载中..."
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <el-header>
      <section>
        <el-row class="header-width">
          <el-col :span="12" align="left">
            <span class="header-btn" @click="isCollNav">
              <i class="fa fa-bars" style="margin-right: 16px"></i>开站工具
            </span>
          </el-col>
          <el-col :span="12" align="right">
            <el-button type="text" style="height:60px;color: #fff;font-size: 25px"
                       class="fa fa-power-off" @click="loginOut">
            </el-button>
          </el-col>
        </el-row>
        <!--设备未连接-->
        <div class="popu">
          <el-dialog title="" :visible.sync="runConnectDevice" :width="dialogWidth">
            <section>
              <p style="font-size: 16px;padding-bottom: 20px">未连接到设备！</p>
              <el-row>
                <el-col :span="12">
                  <el-button @click="connectDevice" type="text" class="left">重新连接</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button @click="runConnectDevice = false" type="text" class="right">知道了</el-button>
                </el-col>
              </el-row>
            </section>
          </el-dialog>
        </div>
        <!--重启设备-->
        <div class="popu">
          <el-dialog title="" :visible.sync="runStartDevice" :width="dialogWidth">
            <section>
              <p style="font-size: 16px;padding-bottom: 20px">{{msg}}</p>
              <el-row>
                <el-col :span="12">
                  <el-button @click="restartDevice" type="text" class="left">立即重启</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button @click="runStartDevice = false" type="text" class="right">稍后重启</el-button>
                </el-col>
              </el-row>
            </section>
          </el-dialog>
        </div>
      </section>
    </el-header>
    <el-container class="main-content">
      <!--左侧菜单栏-->
      <el-aside :width="collapseWidth" v-bind:class="isCollapse ? 'content-aside-close' : 'content-aside'">
        <el-menu :default-active="$route.path" :collapse="isCollapse" unique-opened router mode="vertical"
                 background-color="#333" text-color="#ccc" active-text-color="#33CCFF">
          <template v-for="item in $router.options.routes" v-if="!item.hidden">
            <el-submenu :index="item.index" v-if="!item.leaf" style="text-align: left">
              <template slot="title">
                <i :class="item.icon" style="margin-right: 16px;font-size: 16px"></i>
                <span slot="title">{{item.name}}</span>
              </template>
              <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path"
                            v-if="!child.hidden" style="padding-left: 55px">{{child.name}}
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"
                          style="text-align: left">
              <i :class="item.icon" style="margin-right: 16px;font-size: 16px"></i>
              <span>{{item.children[0].name}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <!--main-->
      <el-main class="content-main">
        <div>
          <el-col :span="24">
            <transition name="fade" mode="out-in">
              <router-view @showDialog="showDialog" @openLoading="openLoading"
                           @closeLoading="closeLoading" @getTableItem="getTableItem"></router-view>
            </transition>
          </el-col>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  import md5 from 'js-md5';

  export default {
    data() {
      return {
        userName: JSON.parse(sessionStorage.getItem("user")).acc || '--',
        loading: false, isCollapse: false,
        runConnectDevice: false,//未连接到设备
        runStartDevice: false,//设置完成重启设备
        collapseWidth: '160px',
        dialogWidth: this.$Is_Pc() ? '380px' : '300px',
        msg: '新的设置需要重启设备才能生效'
      }
    },
    methods: {
      //loading加载
      openLoading() {
//        this.loading = this.$loading({
//          lock: true, text: 'Loading', spinner: 'el-icon-loading',
//          background: 'rgba(0, 0, 0, 0.7)'
//        });
        this.loading = true;
      },
      closeLoading() {
//        this.loading.close();
        this.loading = false;
      },
      //连接设备/重新连接
      connectDevice() {
        this.runConnectDevice = false;
      },
      //重启设备
      restartDevice() {
        this.runStartDevice = false;
        let param = {msgId: "b7518c70", type: 4192, cmd: 4526, moduleID: 255, timestamp: new Date().getTime()};
        this.openLoading();
        this.$post(param).then((data) => {
          if ("000000" === data.code) {
            this.$message({message: '设备正在重启，请稍后...', type: 'success'});
            this.closeLoading();
          }
        }).catch((err) => {
          this.$message.error(err);
          this.closeLoading();
        });
      },
      //菜单栏左侧缩小/放大功能
      isCollNav() {
        if (this.isCollapse) {
          this.isCollapse = false;
          this.collapseWidth = '60px';
        } else {
          this.isCollapse = true;
          this.collapseWidth = '160px';
        }
      },
      //退出
      loginOut() {
        this.$confirm('确认退出吗?', '提示', {type: 'info'}).then(() => {
          sessionStorage.removeItem("user");
          this.$router.push("/login");
        }).catch(() => {
        });
      },
      //显示对应的dialog
      showDialog(conntect, start, text) {
        this.runConnectDevice = conntect;
        this.runStartDevice = start;
        if (text) {
          this.msg = text;
        }
      },
      //获取设备的子卡数量
      getTableItem(devCfg, val) {
        let tableItems = [];
        if (devCfg.indexOf('G') >= 0) {
          if (val == 0) {
            tableItems.push({moduleID: -1, name: '移动（GSM）', type: 'GSMCMCC'});
            tableItems.push({moduleID: -1, name: '联通（GSM）', type: 'GSMCMUC'});
          } else {
            tableItems.push({name: 'GSM', type: 'G'});
          }
        }
        if (devCfg.indexOf('M') >= 0) {
          tableItems.push({moduleID: 0, name: '移动', type: 'M'});
        }
        if (devCfg.indexOf('U') >= 0) {
          tableItems.push({moduleID: 1, name: '联通', type: 'U'});
        }
        if (devCfg.indexOf('T') >= 0) {
          tableItems.push({moduleID: 2, name: '电信', type: 'T'});
        }
        return tableItems;
      }
    },
    mounted() {
      this.$Is_Pc() ? this.isCollapse = false : this.isCollapse = true;
    }
  }
</script>
<style scoped lang="scss">
  .bar {
    width: 50%;
    display: inline-block;
  }

  .el-header {
    height: 60px;
    line-height: 60px;
    background-color: #262626;
  }

  .content-aside-close {
    flex: 0 0 60px;
    width: 60px;
    background-color: #333;
  }

  .content-aside {
    flex: 0 0 160px;
    width: 160px;
    background-color: #333;
  }

  .main-content {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  @media screen and (min-width: 320px) and (max-width: 739px) {
    .content-main {
      padding-right: 20px;
      background-color: #ECF0F5;
      flex: 1;
      overflow-y: auto;
    }
    .header-width {
      width: 100%;
    }
    .header-btn {
      height: 60px;
      color: #fff;
      font-size: 18px;
      background: rgba(0, 0, 0, 0);
      padding: 0;
      cursor: pointer;
    }
    .main-container {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 740px;
      margin-left: -8px;
    }
  }

  @media screen and (min-width: 740px) {
    .content-main {
      padding-right: 5%;
      background-color: #ECF0F5;
      flex: 1;
      overflow-y: auto;
    }
    .header-width {
      width: 95%;
    }
    .header-btn {
      height: 60px;
      color: #fff;
      font-size: 20px;
      background: rgba(0, 0, 0, 0);
      cursor: pointer;
      padding: 0
    }
    .main-container {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      margin-left: -8px;
    }
  }

</style>
