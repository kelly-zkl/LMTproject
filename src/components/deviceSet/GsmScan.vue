<template>
  <div>
    <section class="content">
      <el-form label-width="120px" label-position="left" ref="gsmSniffer" :model="gsmSniffer" :rules="rules">
        <h4 style="text-align: left;margin-top: 0">GSM扫频配置</h4>
        <div class="center-block add-appdiv">
          <el-form-item label="扫频模式" align="left" style="margin: 20px 0 0 15px" prop="snifferMode">
            <el-select v-model="gsmSniffer.snifferMode" placeholder="请选择" filterable>
              <el-option v-for="item in snifferModes" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选频模式" align="left" style="margin: 20px 0 0 15px" prop="selectFreqMode">
            <el-select v-model="gsmSniffer.selectFreqMode" placeholder="请选择" filterable>
              <el-option v-for="item in autoBccModes" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="自动扫频时间" style="margin: 20px 0 0 15px" align="left" prop="runTime"
                        v-show="gsmSniffer.snifferMode==1">
            <el-time-picker v-model="gsmSniffer.runTime" :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                            placeholder="选择时间" value-format="HH:mm:ss">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="自动扫频间隔" style="margin: 20px 0 0 15px" align="left" prop="snifferCycle"
                        v-show="gsmSniffer.snifferMode==1">
            <el-row>
              <el-col :span="8">
                <el-input-number v-model="gsmSniffer.snifferCycle" :min="1" :maxlength=3
                                 style="width: 95%"></el-input-number>
              </el-col>
              <el-col :span="2">天</el-col>
            </el-row>
          </el-form-item>
          <el-form-item align="left" style="margin: 20px 0 0 15px">
            <el-button type="primary" @click="save()" size="medium">保存配置</el-button>
          </el-form-item>
        </div>
      </el-form>
      <h4 style="text-align: left">扫频数据</h4>
      <el-tabs v-model="activeItem" @tab-click="handleClick" style="margin-left: 20px">
        <el-tab-pane :label="tab.name" v-for="tab in activeName" :key="tab.type" :name="tab.type"></el-tab-pane>
      </el-tabs>
      <el-table :data="networkData" v-loading="listLoading" stripe style="margin-bottom: 30px">
        <el-table-column align="center" type="index" label="序号" width="65"></el-table-column>
        <el-table-column align="left" label="pci" prop="pci" :formatter="formatterAddress"></el-table-column>
        <el-table-column align="left" label="频点" prop="bcc" :formatter="formatterAddress"></el-table-column>
        <el-table-column align="left" label="c1" prop="c1" :formatter="formatterAddress"></el-table-column>
        <el-table-column align="left" label="c2" prop="c2" :formatter="formatterAddress"></el-table-column>
        <el-table-column align="left" label="rsrp" prop="rsrp" :formatter="formatterAddress"></el-table-column>
        <el-table-column align="left" label="邻区列表" prop="nCellInfo" :formatter="formatterAddress"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="cells=scope.row.nCellInfo;runCellList=true">查看邻区列表</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--邻区列表-->
      <el-dialog title="邻区列表" :visible.sync="runCellList" center>
        <el-table :data="cells" stripe>
          <el-table-column align="center" type="index" label="序号" width="65"></el-table-column>
          <el-table-column align="left" label="pci" prop="pci" :formatter="formatterAddress"></el-table-column>
          <el-table-column align="left" label="频点" prop="bcc" :formatter="formatterAddress"></el-table-column>
          <el-table-column align="left" label="c1" prop="c1" :formatter="formatterAddress"></el-table-column>
          <el-table-column align="left" label="c2" prop="c2" :formatter="formatterAddress"></el-table-column>
          <el-table-column align="left" label="rsrp" prop="rsrp" :formatter="formatterAddress"></el-table-column>
        </el-table>
      </el-dialog>

      <!--参数是否立即生效-->
      <div class="popu">
        <el-dialog title="" :visible.sync="runStartDevice" :width="dialogWidth">
          <section>
            <p style="font-size: 16px;padding-bottom: 20px">新的设置需要重启移动基带板才能生效</p>
            <el-row>
              <el-col :span="8">
                <el-button @click="activeNow = 1;setScanTime()" type="text" class="left">立即生效</el-button>
              </el-col>
              <el-col :span="8">
                <el-button @click="activeNow = 0;setScanTime()" type="text" class="left">稍后生效</el-button>
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
  import {formatDate} from '../../assets/js/util.js';

  export default {
    data() {
      return {
        dialogWidth: this.$Is_Pc() ? '380px' : '300px',
        runStartDevice: false,
        runCellList: false,
        networkData: [],
        cells: [],
        activeNow: 1,
        gsmSniffer: {
          snifferMode: 0, selectFreqMode: 10, snifferCycle: 1,
          runTime: new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()
        },
        listLoading: false,
        activeItem: "GSMCMCC",
        activeName: [{name: '移动(GSM)', type: 'GSMCMCC'}, {name: '联通(GSM)', type: 'GSMCMUC'}],
        autoBccModes: [{value: 10, label: '手动配置'}, {value: 2, label: '周围宏站选次弱'}, {value: 8, label: '宏站邻区选次弱'}],
        snifferModes: [{value: 0, label: '手动'}, {value: 1, label: '自动'}],
        rules: {
          snifferMode: [{required: true, message: '请输入选择扫频模式', trigger: "blur"}],
          selectFreqMode: [{required: true, message: '请输入选择选频模式', trigger: "blur"}],
          runTime: [{required: true, message: '请输入扫频时间', trigger: "blur"}],
          snifferCycle: [{required: true, message: '请输入扫频周期', trigger: "blur"}]
        }
      }
    },
    methods: {
      //保存前验证
      save() {
        this.$refs['gsmSniffer'].validate((valid) => {
          if (valid) {
            this.runStartDevice = true;
          }
        });
      },
      //设置时间
      setScanTime() {
        this.runStartDevice = false;
        this.$refs['gsmSniffer'].validate((valid) => {
          if (valid) {
            let data = Object.assign({}, this.gsmSniffer);
            if (data.snifferMode == 0) {
              delete data['runTime'];
              delete data['snifferCycle'];
            } else {
              let content = {};
              let value2 = data.runTime.split(":");

              let runTime = {};
              runTime.hour = parseInt(value2[0]);
              runTime.minute = parseInt(value2[1]);
              runTime.second = parseInt(value2[2]);
              content.runTime = runTime;

              content.snifferCycle = data.snifferCycle;
              data.autoSnifferParam = content;
              delete data['runTime'];
              delete data['snifferCycle'];
            }
            let param = {
              msgId: "b7518c70", type: 4193, cmd: 4541, moduleID: 0, timestamp: new Date().getTime(),
              content: data, activeNow: this.activeNow
            };
            this.$emit('openLoading');
            this.$post(param, "命令下发成功").then((data) => {
              this.$emit('closeLoading');
            }).catch((error) => {
              this.$emit('closeLoading');
            });
          }
        })
      },
      handleClick(tab, event) {
        this.networkData = [];
        this.getNetworkData();
      },
      //格式化内容   有数据就展示，没有数据就显示--
      formatterAddress(row, column) {
        if (column.property == 'upTime') {
          return row.upTime ? row.upTime !== 0 ? formatDate(new Date(row.upTime * 1000), 'yyyy-MM-dd hh:mm:ss') : '--' : '--';
        } else if (column.property == 'nCellInfo') {
          return row.nCellInfo ? row.nCellInfo.length + '个' : '0个';
        } else {
          return row[column.property];
        }
      },
      //扫频数据列表
      getNetworkData() {
        this.listLoading = true;
        this.networkData = [];
        let param = {msgId: "b7518c70", type: 4194, cmd: 4543, moduleID: 255, timestamp: new Date().getTime()};
        this.$post(param).then((data) => {
          setTimeout(() => {
            this.listLoading = false
          }, 500);
          if ("000000" == data.code && data.content.snifferCell.length > 0) {
            data.content.snifferCell.forEach((item) => {
              if (this.activeItem == item.network) {
                item.snifferResult.forEach((cell) => {
                  this.networkData.push(cell.cellInfo);
                });
              }
            });
          }
        }).catch((err) => {
          this.$message.error(err);
          this.listLoading = false;
          this.networkData = [];
        });
      },
      //获取扫频设置
      getScanSwitch() {
        let param = {msgId: "b7518c70", type: 4194, cmd: 4542, moduleID: 255, timestamp: new Date().getTime()};
        this.$emit('openLoading');
        this.$post(param).then((data) => {
          this.$emit('closeLoading');
          if ("000000" == data.code && data.content) {
            let runTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
            let snifferCycle = 1;
            if (data.content.autoSnifferParam) {
              snifferCycle = data.content.autoSnifferParam.snifferCycle ? data.content.autoSnifferParam.snifferCycle : 1;
              if (data.content.autoSnifferParam.runTime) {
                runTime = data.content.autoSnifferParam.runTime.hour + ":" + data.content.autoSnifferParam.runTime.minute + ":" + data.content.autoSnifferParam.runTime.second;
              }
            }
            let param = {
              snifferMode: data.content.snifferMode, selectFreqMode: data.content.selectFreqMode,
              runTime: runTime, snifferCycle: snifferCycle
            };
            this.gsmSniffer = param;
          }
        }).catch((err) => {
          this.$message.error(err);
          this.$emit('closeLoading');
        });
      }
    },
    mounted() {
      this.getNetworkData();
      this.getScanSwitch();
    }
  }
</script>
