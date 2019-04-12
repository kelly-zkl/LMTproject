<template>
  <div>
    <section class="content">
      <h4 style="text-align: left;margin-top: 0">侦码数据</h4></section>
    <el-row style="margin:0 0 10px 0">
      <el-col :span="24" align="right">
        <el-button type="primary" @click="getBlack();device = {imsi: ''};runningSetBlack= true" style="margin-top: 10px"
                   size="medium">设置黑名单
        </el-button>
        <el-button type="primary" @click="exportExcel()" style="margin-top: 10px" v-show="list.length > 0"
                   size="medium">导出Excel
        </el-button>
      </el-col>
    </el-row>
    <div class="block" style="height: 60%;background-color: #33CCFF">
      <el-table :data="list" class="center-block" stripe id="out-table"
                :default-sort="{prop: 'uptime', order: 'descending'}">
        <el-table-column align="center" type="index" label="序号" width="65"></el-table-column>
        <el-table-column align="left" prop="deviceId" label="设备ID" min-width="150" max-width="200"
                         :formatter="formatterAddress"></el-table-column>
        <el-table-column align="left" prop="imsi" label="IMSI" min-width="150" max-width="200"
                         :formatter="formatterAddress"></el-table-column>
        <el-table-column align="left" prop="isp" label="运营商" min-width="150" max-width="200"
                         :formatter="formatterAddress"></el-table-column>
        <el-table-column align="left" prop="netType" label="网络类型" min-width="150" max-width="200"
                         :formatter="formatterAddress"></el-table-column>
        <el-table-column align="left" prop="rsrp" label="RSRP" min-width="150" max-width="200"
                         :formatter="formatterAddress"></el-table-column>
        <el-table-column align="left" prop="uptime" label="获取时间" min-width="150" max-width="200"
                         :formatter="formatterAddress" sortable></el-table-column>
      </el-table>
    </div>

    <!--设置黑名单-->
    <el-dialog title="设置黑名单" :visible.sync="runningSetBlack" :width="dialogWidth" center>
      <div>
        <el-row v-show="blackList.length > 0">
          <el-col :span="24">
            <el-button size="medium" @click="deleteBlack(sels,1)" :disabled="sels.length == 0">移除</el-button>
            <span style="margin-left: 20px">已选 {{sels.length}} 个 / 共 {{blackList.length}} 个</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="16">
            <el-table :data="blackList" v-loading="listLoading1" class="center-block" stripe
                      @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" label="全选"></el-table-column>
              <el-table-column type="index" width="50" label="序号"></el-table-column>
              <el-table-column align="left" prop="imsi" label="imsi" min-width="100" max-width="200"
                               :formatter="formatterAddress"></el-table-column>
              <el-table-column align="left" label="操作" width="80">
                <template slot-scope="scope">
                  <el-button icon="el-icon-close" type="text" size="medium" style="font-size: 22px"
                             @click="deleteBlack(scope.row,2)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="8" style="padding-left: 20px">
            <el-form :model="device" :rules="rules">
              <h4 style="text-align: left;margin-top: 0">添加黑名单</h4>
              <el-form-item prop="imsi">
                <el-input v-model="device.imsi" placeholder="请输入黑名单" :maxlength="30"></el-input>
              </el-form-item>
              <el-button type="primary" size="medium" @click="addBlack">添加</el-button>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import FileSaver from 'file-saver';
  import XLSX from 'xlsx';
  import {formatDate} from '../../assets/js/util.js';

  export default {
    data() {
      let imsiValidator = (rule, value, callback) => {
        if (!/[0-9.]$/.test(value)) {
          callback(new Error("请输入正确的黑名单"));
        } else {
          callback();
        }
      };
      return {
        listLoading1: false,
        runningSetBlack: false,
        dialogWidth: this.$Is_Pc() ? '50%' : '90%',
        list: [],
        blackList: [],
        sels: [],
        rules: {
          imsi: [
            {required: true, message: '请输入黑名单', trigger: 'blur'}, {validator: imsiValidator, trigger: "change,blur"}
          ]
        },
        device: {imsi: ''},
        intervalid: null
      }
    },
    //页面关闭时停止刷新
    beforeDestroy() {
      clearInterval(this.intervalid);
    },
    methods: {
      //定时刷新侦码数据
      dataTask() {
        if (!this.intervalid) {
          this.intervalid = setInterval(() => {
            this.getData();
          }, 10 * 1000);
        }
      },
      //侦码数据
      getData() {
        let param = {msgId: "b7518c70", type: 4194, cmd: 4528, moduleID: 255, timestamp: new Date().getTime()};
        this.$post(param).then((data) => {
          if ("000000" == data.code) {
            if (data.data.metaInfo && data.data.metaInfo.content.length > 0) {//有数据时，更新列表
              let list = JSON.parse(data.data.metaInfo.content);
              if (list.length > 0) {
                let terminate = JSON.parse(sessionStorage.getItem("terminate"));
                if (terminate) {
                  terminate = terminate.concat(list);
                  sessionStorage.setItem("terminate", JSON.stringify(terminate));
                } else {
                  sessionStorage.setItem("terminate", JSON.stringify(list));
                }
              }
            }
            //无数据时，展示本地保存的数据
            let datas = JSON.parse(sessionStorage.getItem("terminate"));
            if (datas && datas.length > 0) {
              this.getList(datas);
            }
          }
        }).catch((err) => {//请求失败时，展示本地保存的数据
          this.$message.error(err);
          let terminate = JSON.parse(sessionStorage.getItem("terminate"));
          if (terminate && terminate.length > 0) {
            this.getList(terminate);
          }
        });
      },
      //数据过滤
      getList(datas) {
        this.list = [];
        let bol = JSON.parse(localStorage.getItem("black"));
        if (bol && bol.length > 0) {//有黑名单
          if (datas.length > 0) {
            datas.forEach((item) => {
              if (this.getIndex(bol, item) >= 0) {//在黑名单里
                this.list.unshift(item);
              }
            });
          }
        } else {
          this.list = datas;
        }
      },
      //查询不在名单里的imsi的index
      getNoIndex(arr, item) {
        let index = true;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].imsi == item.imsi) {
            index = false;
          }
        }
        return index;
      },
      //查询黑名单
      getBlack() {
        this.device = {imsi: ''};
        let bol = JSON.parse(localStorage.getItem("black"));
        if (bol) {
          this.blackList = bol;
        } else {
          this.blackList = [];
        }
      },
      //移除黑名单
      deleteBlack(val, flag) {
        this.$confirm('确定从黑名单中删除该imsi号?', '提示', {type: 'info'}).then(() => {
          let bol = JSON.parse(localStorage.getItem("black"));
          if (bol) {
            if (flag == 1) {
              val.forEach((item) => {
                bol.splice(this.getIndex(bol, item), 1);
              });
            } else {
              bol.splice(this.getIndex(bol, val), 1);
            }
          }
          localStorage.setItem("black", JSON.stringify(bol));
          this.getBlack();
          this.refreshData();
          this.runningSetBlack = false;
        }).catch(() => {
        });
      },
      //添加黑名单
      addBlack() {
        if (!this.device.imsi) {
          this.$message.error('请输入黑名单');
          return;
        }
        this.$confirm('确定添加该imsi号为黑名单?', '提示', {type: 'info'}).then(() => {
          let bol = JSON.parse(localStorage.getItem("black"));
          let black = {imsi: this.device.imsi};
          if (bol) {
            if (this.getIndex(bol, black) < 0) {//不存在该imsi号
              bol.unshift(black);
              localStorage.setItem("black", JSON.stringify(bol));
            } else {//>=0表示黑名单存在该imsi号
              this.$message.error('黑名单已存在该imsi号，请重新输入');
              return;
            }
          } else {
            bol = [];
            bol.push(black);
            localStorage.setItem("black", JSON.stringify(bol));
          }
          this.getBlack();
          this.refreshData();
          this.runningSetBlack = false;
        }).catch(() => {
        });
      },
      handleSelectionChange(sels) {
        this.sels = sels;
      },
      //将表格数据导出excel
      exportExcel() {
        this.$confirm('确定导出侦码数据?', '提示', {type: 'info'}).then(() => {
          /* generate workbook object from table */
          let wb = XLSX.utils.table_to_book(document.querySelector('#out-table'));
          /* get binary string as output */
          let wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'});
          try {
            FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}),
              '侦码数据-' + formatDate(new Date(), 'yyyyMMddhhmmss') + '.xlsx');
          } catch (e) {
            if (typeof console !== 'undefined') console.log(e, wbout)
          }
          return wbout
        }).catch(() => {
        });
      },
      //格式化内容   有数据就展示，没有数据就显示--
      formatterAddress(row, column) {
        if (column.property == 'uptime') {//上报时间
          return row.uptime ? formatDate(new Date(row.uptime * 1000), 'yyyy-MM-dd hh:mm:ss') : '--';
        } else if (column.property == 'isp') {//运营商
          return row.isp == 0 || row.isp == 3 ? '移动' : row.isp == 1 ? '联通' : row.isp == 2 ? '电信' : '--';
        } else if (column.property == 'rsrp') {//rsrp
          return row.rsrp == undefined ? '--' : row.rsrp;
        } else if (column.property == 'netType') {//网络类型 --> 根据运营商判断
          return this.getNetType(row.isp);
        } else {
          return row[column.property] && row[column.property] !== "null" ? row[column.property] : '--';
        }
      },
      getNetType(isp) {
        let moduleId = "未知";
        switch (isp) {
          case 0:
            moduleId = "CMCC";
            break;
          case 1:
            moduleId = "CMUC";
            break;
          case 2:
            moduleId = "CMTC";
            break;
          case 3:
            moduleId = "CMCC2";
            break;
          case 5:
            moduleId = "GSM";
            break;
          default:
            break;
        }
        return moduleId;
      },
      getIndex(arr, item) {
        let index = -1;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].imsi == item.imsi) {
            index = i;
          }
        }
        return index;
      },
      //添加或者删除黑名单后
      refreshData() {
        this.list = [];
        let terminate = JSON.parse(sessionStorage.getItem("terminate"));
        if (terminate) {
          this.getList(terminate);
        }
        // this.setBlackList();
      },
      //添加进缓存
      addImsi(imsi) {
        let bol = JSON.parse(localStorage.getItem("black"));
        let black = {imsi: imsi};
        if (bol) {
          if (this.getIndex(bol, black) < 0) {//不存在该imsi号
            bol.unshift(black);
            localStorage.setItem("black", JSON.stringify(bol));
          }
        } else {
          bol = [];
          bol.push(black);
          localStorage.setItem("black", JSON.stringify(bol));
        }
      },
      //设置黑名单
      setBlackList() {
        let bol = JSON.parse(localStorage.getItem("black"));
        let blackImsi = [];
        if (bol && bol.length > 0) {
          bol.forEach((item) => {
            blackImsi.push(item.imsi);
          })
        } else {
          blackImsi = [];
        }
        let param = {msgId: "b7518c70", type: 4193, cmd: 4539, timestamp: new Date().getTime(), blackImsi: blackImsi};
        this.$post(param, "命令下发成功").then((data) => {
        }).catch((err) => {//请求失败时，展示本地保存的数据
        });
      },
      //查询设置的黑名单
      getBlackList() {
        let param = {msgId: "b7518c70", type: 4194, cmd: 4540, timestamp: new Date().getTime()};
        this.$post(param).then((data) => {
          if ("000000" == data.code) {
            if (data.blackImsi.length > 0) {
              data.blackImsi.forEach((item) => {
                this.addImsi(item);
              })
            }
          }
        }).catch((err) => {//请求失败时，展示本地保存的数据
        });
      }
    },
    mounted() {
      let terminate = JSON.parse(sessionStorage.getItem("terminate"));
      if (terminate && terminate.length > 0) {
        this.getList(terminate);
      } else {
        this.getData();
      }
      // this.getBlackList();
      this.dataTask();
    }
  }
</script>
