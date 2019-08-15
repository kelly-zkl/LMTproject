<template>
  <section class="content">
    <h4 style="text-align: left;margin-top: 0">载波配置</h4>
    <el-tabs v-model="activeItem" @tab-click="handleClick">
      <el-tab-pane :label="tab.name" v-for="tab in activeName" :key="tab.type" :name="tab.type"></el-tab-pane>
    </el-tabs>
    <div v-if="getModuleID()<0">
      <el-form ref="opDeviceParameter" label-width="120px" label-position="left" :rules="rules"
               :model="opDeviceParameter">
        <div class="center-block add-appdiv" style="margin-top: 10px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="BAND" prop="band" align="left">
                <el-tooltip placement="bottom">
                  <div slot="content">基站频段号 取值范围：<br/>GSM：900/1800</div>
                  <el-select v-model="opDeviceParameter.band" placeholder="请选择" style="width: 100%" filterable>
                    <el-option v-for="item in bands" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-tooltip>
              </el-form-item>
              <!--<el-form-item label="pci" prop="pci">-->
              <!--<el-tooltip placement="bottom">-->
              <!--<div slot="content">物理小区标识 取值范围：[0-503]</div>-->
              <!--<el-input v-model.number="opDeviceParameter.pci" :maxlength=3></el-input>-->
              <!--</el-tooltip>-->
              <!--</el-form-item>-->
              <el-form-item label="LAC" prop="lac">
                <el-tooltip placement="bottom">
                  <div slot="content">位置区域码 取值范围：[0001－FFFE]，码组0000H和FFFFH不可以使用</div>
                  <el-input v-model.number="opDeviceParameter.lac" :maxlength=4></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="重复上报间隔" prop="reCapFilterPeriod">
                <el-tooltip placement="bottom" content="重复上报间隔 取值范围：0-3600">
                  <el-input v-model.number="opDeviceParameter.reCapFilterPeriod" :maxlength=4>
                    <template slot="append">秒</template>
                  </el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="功率衰减" prop="powerLevel" style="text-align: left">
                <el-tooltip placement="bottom" content="功率衰减 取值范围：0-50">
                  <el-input v-model.number="opDeviceParameter.powerLevel" :maxlength=2></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="最小接入电平" prop="qRxLevMin">
                <el-tooltip placement="bottom" content="最小接入电平 取值范围：-70-0">
                  <el-input v-model.number="opDeviceParameter.qRxLevMin" :maxlength=3></el-input>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="BCCH" prop="bcc">
                <el-tooltip placement="bottom">
                  <div slot="content">频点号 取值范围：
                    <br/>移动：band900[1-94],band1800[512-562]
                    <br/>联通：band900[96-124],band1800[686-735]
                  </div>
                  <el-input v-model.number="opDeviceParameter.bcc" :maxlength=3 @change="changeBcc"
                            @blur="changeBcc"></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="TAC周期" prop="tacPeriod">
                <el-tooltip placement="bottom" content="TAC周期 取值范围：1-86400">
                  <el-input v-model.number="opDeviceParameter.tacPeriod" :maxlength=5></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="CI" prop="cellId">
                <el-input v-model.number="opDeviceParameter.cellId" :maxlength=4></el-input>
              </el-form-item>
              <el-form-item label="PLMN" align="left" prop="plmn">
                <el-radio-group v-model="opDeviceParameter.plmn" align="left">
                  <el-radio-button :label="tab.type" v-for="tab in plmns" :key="tab.type">{{tab.name}}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="无线电" align="left">
                <el-switch v-model="radioSwitch" active-color="#34CBFE"
                           inactive-color="#C1C1C1" :active-value="1" :inactive-value="0"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div v-else>
      <el-form ref="opDeviceParameter" label-width="120px" label-position="left" :rules="rules"
               :model="opDeviceParameter">
        <div class="center-block add-appdiv" style="margin-top: 10px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="TAC" prop="tac">
                <el-tooltip placement="bottom">
                  <div slot="content">跟踪区域码 取值范围：[0001－FFFE]，码组0000H和FFFFH不可以使用</div>
                  <el-input v-model.number="opDeviceParameter.tac" :maxlength=4 readonly></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="TAC下限" prop="tacMin">
                <el-tooltip class="item" effect="dark" content="TAC下限 取值范围:0-65530" placement="bottom">
                  <el-input v-model.number="opDeviceParameter.tacMin" :maxlength=5></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="重复上报间隔" prop="imsiReportInterval" align="left">
                <el-tooltip placement="bottom" content="重复上报间隔 取值范围：0-3600">
                  <el-input v-model.number="opDeviceParameter.imsiReportInterval" :maxlength=4>
                    <template slot="append">秒</template>
                  </el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="重定向载波频点" prop="redirected_earfcn">
                <el-input v-model.number="opDeviceParameter.redirected_earfcn" :maxlength=5></el-input>
              </el-form-item>
              <el-form-item label="最小接入电平" prop="qRxLevMin" style="text-align: left">
                <el-tooltip placement="bottom" content="最小接入电平 取值范围：-70-0">
                  <el-input v-model.number="opDeviceParameter.qRxLevMin" :maxlength=3></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="异频频点" prop="interFreq" style="text-align: left;margin: 0">
                <el-tooltip placement="bottom" content="异频频点 取值范围：大于0">
                  <el-input v-model.number="opDeviceParameter.interFreq" :maxlength=15></el-input>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="TAC周期" prop="tacPeriod">
                <el-tooltip placement="bottom" content="TAC周期 取值范围：1-86400">
                  <el-input v-model.number="opDeviceParameter.tacPeriod" :maxlength=5></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="TAC上限" prop="tacMax">
                <el-tooltip class="item" effect="dark" content="TAC上限 取值范围:0-65530" placement="bottom">
                  <el-input v-model.number="opDeviceParameter.tacMax" :maxlength=5></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="测量上报间隔" prop="measRptInterval">
                <el-tooltip placement="bottom" content="测量上报间隔 取值范围：0-10">
                  <el-input v-model.number="opDeviceParameter.measRptInterval" :maxlength=2>
                    <template slot="append">秒</template>
                  </el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="BANDWIDTH" align="left" prop="bandWidth">
                <el-select v-model="opDeviceParameter.bandWidth" placeholder="带宽BandWidth" filterable
                           style="width: 100%">
                  <el-option v-for="item in bandwidths" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="同步方式" prop="syncMode" style="text-align: left" v-show="activeItem == 'M'">
                <el-select v-model="opDeviceParameter.syncMode" placeholder="同步模式" filterable style="width: 100%">
                  <el-option v-for="item in syncModes" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="无线电" align="left" prop="radioSwitch">
                <el-switch v-model="opDeviceParameter.radioSwitch" active-color="#34CBFE"
                           inactive-color="#C1C1C1" :active-value="1" :inactive-value="0"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div class="add-appdiv" style="margin-bottom: 0">
        <div v-for="(tab,indx) in frequencyList" :key="indx">
          <el-form :inline="true" align="left" label-width="80px" style="text-align: left">
            <el-form-item v-show="frequencyList.length > 1" style="margin: 0 0 10px 0">
              <i class="el-icon-remove" @click="minusPlmn(indx)"
                 style="color: #34CBFE;font-size: 20px;text-align: center"></i>
            </el-form-item>
            <el-form-item label="下行频点" style="margin: 0 0 10px 0">
              <el-tooltip placement="bottom">
                <div slot="content" v-if="has34">频点号 取值范围<br/>
                  <br/>FDD:band1[25-575],band3[1225-1925],band5[2425-2625],band8[3475-3775]<br/>
                  <br/>TDD:band34[36225-36325],band38[37750-38249],band39[38275-38625],<br/>
                  &#12288;&#12288;band40[38675-39625],band41[39675-41565]
                </div>
                <div slot="content" v-else>频点号 取值范围<br/>
                  <br/>FDD:band1[25-575],band3[1225-1925]<br/>
                  <br/>TDD:band38[37750-38249],band39[38275-38625],<br/>
                  &#12288;&#12288;band40[38675-39625],band41[39675-41565]
                </div>
                <el-input v-model.number="tab.downFrequency" :maxlength=5 @change="changeTDown($event,indx)"
                          @blur="changeTDown($event,indx)" style="width: 100px" size="small"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="pci" prop="pci" style="margin: 0 0 10px 0">
              <el-tooltip placement="bottom">
                <div slot="content">物理小区标识 取值范围：[0-503]</div>
                <el-input v-model.number="tab.pci" :maxlength=3 style="width: 80px" size="small"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="优先级" style="margin: 0 0 10px 0">
              <el-tooltip effect="dark" content="现网频点优先级" placement="bottom">
                <el-input v-model.number="tab.priority" :maxlength=10 @change="changeOffset"
                          style="width: 100px" size="small"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="RSRP" style="margin: 0 0 10px 0">
              <el-tooltip effect="dark" content="现网频点RSRP" placement="bottom">
                <el-input v-model.number="tab.rsrp" :maxlength=10 @change="changeRsrp" style="width: 100px"
                          size="small"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="功率衰减" style="margin: 0 0 10px 0">
              <el-tooltip placement="bottom" content="功率衰减 取值范围：0-50">
                <el-input v-model.number="tab.powerLevel" :maxlength=2 style="width: 80px" size="small"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="帧偏移" style="margin: 0 0 10px 0" v-show="activeItem == 'M'">
              <el-input v-model.number="tab.frameOffset" :maxlength=10 @change="changeOffset"
                        style="width: 100px" size="small"></el-input>
            </el-form-item>
            <el-form-item label="PLMN" style="margin: 0 0 10px 0">
              <el-select v-model="tab.plmn" align="left" multiple collapse-tags size="small" style="width: 150px">
                <el-option v-for="item in plmns" :label="item.name" :key="item.type" :value="item.type"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <el-row v-show="frequencyList.length < 16" style="text-align: left">
          <el-col :span="5" align="left" style="margin-left: 80px;text-align: left">
            <el-button type="primary" icon="el-icon-plus" @click="plusPlmn()" size="small">增加</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="block" style="margin-top: 30px">
      <el-button @click="save" type="primary">保存配置</el-button>
    </div>

    <!--参数是否立即生效-->
    <div class="popu">
      <el-dialog title="" :visible.sync="runStartDevice" :width="dialogWidth">
        <section>
          <p style="font-size: 16px;padding-bottom: 20px">新的设置需要重启移动基带板才能生效</p>
          <el-row>
            <el-col :span="8">
              <el-button @click="activeNow = 1;saveGsm()" type="text" class="left" v-show="getModuleID()<0">立即生效
              </el-button>
              <el-button @click="activeNow = 1;updateParam()" type="text" class="left" v-show="getModuleID()>=0">立即生效
              </el-button>
            </el-col>
            <el-col :span="8">
              <el-button @click="activeNow = 0;saveGsm()" type="text" class="left" v-show="getModuleID()<0">稍后生效
              </el-button>
              <el-button @click="activeNow = 0;updateParam()" type="text" class="left" v-show="getModuleID()>=0">稍后生效
              </el-button>
            </el-col>
            <el-col :span="8">
              <el-button @click="runStartDevice = false" type="text" class="right">取消</el-button>
            </el-col>
          </el-row>
        </section>
      </el-dialog>
    </div>
  </section>
</template>
<script>
  import {numValid, intValid, hexValidator, plmnValidator, pciValidator} from '../../assets/js/api.js'

  let numVal = (rule, value, callback) => {
    if (!numValid(value)) {
      callback(new Error("只能输入整数"));
    } else {
      callback();
    }
  };
  let hexValid = (rule, value, callback) => {
    if (!hexValidator(value)) {
      callback(new Error("只能输入0001－FFFE"));
    } else {
      callback();
    }
  };
  let pciValid = (rule, value, callback) => {
    if (!pciValidator(value)) {
      callback(new Error("请输入正确的pci：0-503"));
    } else if (parseInt(value) < 0 || parseInt(value) > 503) {
      callback(new Error("pci的范围是0-503"));
    } else {
      callback();
    }
  };
  export default {
    data() {
      return {
        hasGsmModule: 0, runStartDevice: false,
        dialogWidth: this.$Is_Pc() ? '380px' : '300px',
        activeNow: 1, has34: true, activeItem: 'GSMCMCC',
        opDeviceParameter: {}, frequencyList: [], rules: {},
        activeName: [{moduleID: -1, name: '移动（GSM）', type: 'GSMCMCC'},
          {moduleID: -1, name: '联通（GSM）', type: 'GSMCMUC'}, {moduleID: 0, name: '移动', type: 'M'},
          {moduleID: 1, name: '联通', type: 'U'}, {moduleID: 2, name: '电信', type: 'T'}],
        bands: [{value: 900, label: 900}, {value: 1800, label: 1800}],
        bandwidths: [{value: 1, label: '3MHz'}, {value: 2, label: '5MHz'}, {value: 3, label: '10MHz'},
          {value: 4, label: '15MHz'}, {value: 5, label: '20MHz'}],
        plmns: [{type: '460.00', name: '460.00'}, {type: '460.01', name: '460.01'}, {type: '460.11', name: '460.11'}],
        syncModes: [{value: 1, label: 'gps同步'}, {value: 2, label: '空口同步'}, {value: 3, label: '异频空口同步'}],
        plmn: ['460.00'], down: 37900, up: 37900, pci: 5, deviceType: '', radioSwitch: 0
      }
    },
    methods: {
      handleClick(tab, event) {
        this.clear();
        if (this.getModuleID() >= 0) {//4G
          this.getParam();
        } else {//GSM
          this.getGsmParam();
        }
      },
      //增加跳频
      plusPlmn() {
        this.frequencyList.push({
          upFrequency: this.up, downFrequency: this.down, plmn: this.plmn, rsrp: 0,
          priority: 0, pci: this.pci, powerLevel: 0, frameOffset: 0
        });
      },
      //删除跳频
      minusPlmn(index) {
        this.frequencyList.splice(index, 1);
      },
      //下行频点变化
      changeTDown(val, idx) {
        if (val.length > 0) {
          if (this.activeItem == 'M') {//小站移动
            this.frequencyList[idx].upFrequency = (val ? parseInt(val) : 0);
          } else {//联通电信
            this.frequencyList[idx].upFrequency = (val ? parseInt(val) + 18000 : 18000);
          }
        }
      },
      changeRsrp(val) {
        let isVaild = true;
        if (val) {
          if (!intValid(val)) {
            this.$message.error('请输入正确的rsrp');
            isVaild = false;
          }
        }
        return isVaild;
      },
      changeOffset(val) {
        let isVaild = true;
        if (val) {
          if (!numValid(val)) {
            this.$message.error('请输入正确的优先级');
            isVaild = false;
          }
        }
        return isVaild;
      },
      //bcc取值范围 GSM：移动[1-94][512-562],联通[96-124][686-735]FDD：[0-599][1200-1949]
      //TDD：移动-38 [37750-38249],移动-39 [38249-38649],移动-40 [38650-39649],移动-41 [39650-41589]
      changeBcc(val) {
        let isVaild = true;
        if (this.activeItem == 'GSMCMCC') {//移动2G
          if (this.opDeviceParameter.band == 900) {//[1-94]
            if (parseInt(val) < 1 || parseInt(val) > 94) {
              this.$message.error('bcc的范围为[1-94]');
              isVaild = false;
            }
          } else {//[512-562]
            if (parseInt(val) < 512 || parseInt(val) > 562) {
              this.$message.error('bcc的范围为[512-562]');
              isVaild = false;
            }
          }
        } else if (this.activeItem == 'GSMCMUC') {//联通2G
          if (this.opDeviceParameter.band == 900) {//[96-124]
            if (parseInt(val) < 96 || parseInt(val) > 124) {
              this.$message.error('bcc的范围为[96-124]');
              isVaild = false;
            }
          } else {//[686-735]
            if (parseInt(val) < 686 || parseInt(val) > 735) {
              this.$message.error('bcc的范围为[686-735]');
              isVaild = false;
            }
          }
        } else if (this.activeItem === 'M') {//移动4G band34[36225-36325],band38[37750-38249],band39[38275-38625],band40[38675-39625],band41[39675-41565]
          if (this.has34) {//有band34
            if (parseInt(val) < 36225 || (parseInt(val) > 36325 && parseInt(val) < 37750) || (parseInt(val) > 38249 && parseInt(val) < 38275)
              || (parseInt(val) > 38625 && parseInt(val) < 38675) || (parseInt(val) > 39625 && parseInt(val) < 39675) || parseInt(val) > 41565) {
              this.$message.error('下行频点的范围为band34[36225-36325],band38[37750-38249],band39[38275-38625],band40[38675-39625],band41[39675-41565]');
              isVaild = false;
            }
          } else {//没有band34
            if (parseInt(val) < 37750 || (parseInt(val) > 38249 && parseInt(val) < 38275) || (parseInt(val) > 38625 && parseInt(val) < 38675)
              || (parseInt(val) > 39625 && parseInt(val) < 39675) || parseInt(val) > 41565) {
              this.$message.error('下行频点的范围为band38[37750-38249],band39[38275-38625],band40[38675-39625],band41[39675-41565]');
              isVaild = false;
            }
          }
        } else {//联通4G、电信4G band1[25-575],band3[1225-1925],band5[2425-2625],band8[3475-3775]
          if (this.has34) {//有band5、band8
            if (parseInt(val) < 25 || (parseInt(val) > 575 && parseInt(val) < 1225) || (parseInt(val) > 1925 && parseInt(val) < 2425)
              || (parseInt(val) > 2625 && parseInt(val) < 3475) || parseInt(val) > 3775) {
              this.$message.error('下行频点的范围为band1[25-575],band3[1225-1925],band5[2425-2625],band8[3475-3775]');
              isVaild = false;
            }
          } else {//没有band5、band8
            if (parseInt(val) < 25 || (parseInt(val) > 575 && parseInt(val) < 1225) || parseInt(val) > 1925) {
              this.$message.error('下行频点的范围为band1[25-575],band3[1225-1925]');
              isVaild = false;
            }
          }
        }
        return isVaild;
      },
      //初始化
      clear() {
        if (this.activeItem == 'GSMCMUC' || this.activeItem == 'GSMCMCC') {//2G
          this.rules = {
            band: [{required: true, message: '请选择band', trigger: "blur"}],
            lac: [{required: true, message: '请输入lac', trigger: "blur"}, {validator: hexValid, trigger: "change,blur"}],
            bcc: [{required: true, message: '请输入bcc', trigger: "blur"}, {validator: numVal, trigger: "change,blur"}],
            tacPeriod: [{required: true, message: '请输入重复抓取时间', trigger: "blur"},
              {validator: numVal, trigger: "change,blur"}],
            cellId: [{required: true, message: '请输入小区ID', trigger: "blur"},
              {validator: numVal, trigger: "change,blur"}],
            reCapFilterPeriod: [{required: true, message: '请输入重复上报间隔', trigger: "blur"},
              {validator: numVal, trigger: "change,blur"}],
            plmn: [{required: true, message: '请选择plmn', trigger: "blur"}],
            powerLevel: [{required: true, message: '请输入功率衰减', trigger: "blur"}],
            qRxLevMin: [{required: true, message: '请输入最小接入电平', trigger: "blur"}]
          }
        } else {//4G
          this.rules = {
            tacPeriod: [{required: true, message: '请输入重复抓取时间', trigger: "blur"},
              {validator: numVal, trigger: "change,blur"}],
            tacMin: [{required: true, message: '请输入tac下限', trigger: "blur"},
              {validator: numVal, trigger: "change,blur"}],
            tacMax: [{required: true, message: '请输入tac上限', trigger: "blur"},
              {validator: numVal, trigger: "change,blur"}],
            bandWidth: [{required: true, message: '请选择带宽', trigger: "blur"}],
            redirected_earfcn: [{required: true, message: '请输入重定向载波频点', trigger: "blur"},
              {validator: numVal, trigger: "change,blur"}],
            imsiReportInterval: [{required: true, message: '请输入重复上报间隔', trigger: "blur"},
              {validator: numVal, trigger: "change,blur"}],
            syncMode: [{required: true, message: '请选择同步模式', trigger: "blur"}],
            qRxLevMin: [{required: true, message: '请输入最小接入电平', trigger: "blur"}],
            interFreq: [{required: true, message: '请输入异频频点', trigger: "blur"}],
            measRptInterval: [{required: true, message: '请输入测量上报间隔', trigger: "blur"}],
            radioSwitch: [{required: true, message: '请选择无线电开关', trigger: "blur"}]
          };
          if (this.activeItem !== 'M') {//移动4G
            delete this.rules['syncMode'];
          }
        }
        this.opDeviceParameter = {};
        this.defaultFrequencyList();
      },
      //跳频默认参数
      defaultFrequencyList() {
        if (this.activeItem == 'M') {//移动4G38/40
          this.plmn = ['460.00'];
          this.down = 37900;
          this.up = 37900;
          this.pci = 5;
          this.frequencyList = [{
            upFrequency: this.up, downFrequency: this.down, plmn: this.plmn, rsrp: 0,
            priority: 0, pci: this.pci, powerLevel: 0, frameOffset: 0
          }];
        } else if (this.activeItem == 'U') {//联通4G
          this.plmn = ['460.01'];
          this.down = 1650;
          this.up = 19650;
          this.pci = 6;
          this.frequencyList = [{
            upFrequency: this.up, downFrequency: this.down, plmn: this.plmn, rsrp: 0,
            priority: 0, pci: this.pci, powerLevel: 0, frameOffset: 0
          }];
        } else if (this.activeItem == 'T') {//电信4G
          this.plmn = ['460.11'];
          this.down = 100;
          this.up = 18100;
          this.pci = 7;
          this.frequencyList = [{
            upFrequency: this.up, downFrequency: this.down, plmn: this.plmn, rsrp: 0,
            priority: 0, pci: this.pci, powerLevel: 0, frameOffset: 0
          }];
        } else {
          this.frequencyList = [{
            upFrequency: 0, downFrequency: 0, plmn: ['460.00'], rsrp: 0,
            priority: 0, pci: 504, powerLevel: 0, frameOffset: 0
          }];
        }
      },
      getModuleID() {
        let idx = -1;
        for (let item of this.activeName) {
          if (this.activeItem == item.type) {
            idx = item.moduleID;
          }
        }
        return idx;
      },
      //验证tac周期 1-86400
      changeTacPeriod(val) {
        if (val == undefined) {
          this.$message.error('请输入TAC周期');
          return false;
        }
        let isVaild = true;
        if (parseInt(val) < 1 || parseInt(val) > 86400) {
          this.$message.error('TAC周期的范围为[1-86400]');
          isVaild = false;
        }
        return isVaild;
      },
      //验证重复上报间隔 0-3600
      changereCapFilterPeriod(val) {
        if (val == undefined) {
          this.$message.error('请输入重复上报间隔');
          return false;
        }
        let isVaild = true;
        if (parseInt(val) < 0 || parseInt(val) > 3600) {
          this.$message.error('重复上报间隔的范围为[0-3600]');
          isVaild = false;
        }
        return isVaild;
      },
      //验证PCI 0-503
      changePCI(val) {
        if (val == undefined) {
          this.$message.error('请输入PCI');
          return false;
        }
        let isVaild = true;
        if (parseInt(val) < 0 || parseInt(val) > 503) {
          this.$message.error('PCI的范围为[0-503]');
          isVaild = false;
        }
        return isVaild;
      },
      //验证功率衰减 0-50
      changePowerLevel(val) {
        if (val == undefined) {
          this.$message.error('请输入功率衰减');
          return false;
        }
        let isVaild = true;
        if (parseInt(val) < 0 || parseInt(val) > 50) {
          this.$message.error('功率衰减的范围为[0-50]');
          isVaild = false;
        }
        return isVaild;
      },
      //验证最小接入电平 -70-0
      changeqRxLevMin(val) {
        if (val == undefined) {
          this.$message.error('请输入最小接入电平');
          return false;
        }
        let isVaild = true;
        if (parseInt(val) < -70 || parseInt(val) > 0) {
          this.$message.error('最小接入电平的范围为[-70-0]');
          isVaild = false;
        }
        return isVaild;
      },
      //验证异频频点 大于0
      changeInterFreq(val) {
        if (val == undefined) {
          this.$message.error('请输入异频频点');
          return false;
        }
        let isVaild = true;
        if (parseInt(val) < 0) {
          this.$message.error('异频频点的范围为大于0');
          isVaild = false;
        }
        return isVaild;
      },
      //验证测量上报间隔 0-10
      changeMeasRptInterval(val) {
        if (val == undefined) {
          this.$message.error('请输入测量上报间隔');
          return false;
        }
        let isVaild = true;
        if (parseInt(val) < 0 || parseInt(val) > 10) {
          this.$message.error('测量上报间隔的范围为[0-10]');
          isVaild = false;
        }
        return isVaild;
      },
      //保存前验证
      save() {
        this.$nextTick(() => {
          this.$refs.opDeviceParameter.validate((valid) => {
            if (valid) {
              this.setParamValidate();
            }
          });
        });
      },
      setParamValidate() {
        if (this.getModuleID() < 0) {
          if (!this.radioSwitch) {
            this.$message.error('请选择无线电开关状态');
            return;
          }
          if (this.changeTacPeriod(this.opDeviceParameter.tacPeriod) && this.changeBcc(this.opDeviceParameter.bcc) && this.changeqRxLevMin(this.opDeviceParameter.qRxLevMin)
            && this.changereCapFilterPeriod(this.opDeviceParameter.reCapFilterPeriod) && this.changePowerLevel(this.opDeviceParameter.powerLevel)) {
            this.runStartDevice = true;
          }
        } else {
          let plmnVlue = true;
          if (!this.changeTacPeriod(this.opDeviceParameter.tacPeriod) || !this.changereCapFilterPeriod(this.opDeviceParameter.imsiReportInterval)
            || !this.changeqRxLevMin(this.opDeviceParameter.qRxLevMin) || !this.changeMeasRptInterval(this.opDeviceParameter.measRptInterval)
            || !this.changeInterFreq(this.opDeviceParameter.interFreq)) {
            plmnVlue = false;
            return;
          }
          if (this.activeItem == 'M') {
            if (!this.opDeviceParameter.syncMode) {
              plmnVlue = false;
              this.$message.error('请选择同步模式');
              return;
            }
          }
          if (this.opDeviceParameter.tacMin < 0 || this.opDeviceParameter.tacMin > 65530 || this.opDeviceParameter.tacMax < 0 || this.opDeviceParameter.tacMax > 65530) {
            plmnVlue = false;
            this.$message.error('tac上/下限的取值范围是0-65530');
            return;
          }
          if (this.opDeviceParameter.tacMax - this.opDeviceParameter.tacMin < 10) {
            plmnVlue = false;
            this.$message.error('tac上/下限相差应大于10');
            return;
          }
          this.frequencyList.forEach((item) => {
            if (!(item.plmn instanceof Array)) {
              item.plmn = [];
            }
          });
          for (let i = 0; i < this.frequencyList.length; i++) {
            let item = this.frequencyList[i];
            if (!this.changeBcc(item.downFrequency) || !this.changePCI(item.pci) || !this.changePowerLevel(item.powerLevel)) {
              plmnVlue = false;
              return;
            }
            if (item.plmn.length == 0) {
              plmnVlue = false;
              this.$message.error('请选择plmn');
              return;
            }
          }
          if (plmnVlue) {
            this.runStartDevice = true;
          }
        }
      },
      //获取载波参数
      getParam() {
        this.frequencyList.forEach((item) => {
          if (!(item.plmn instanceof Array)) {
            item.plmn = [];
          }
        });
        let param = {msgId: "b7518c70", type: 4194, cmd: 4523, moduleID: 255, timestamp: new Date().getTime()};
        this.$emit('openLoading');
        this.$post(param).then((data) => {
          this.$emit('closeLoading');
          if ("000000" == data.code && data.opDeviceParameter.length > 0) {
            data.opDeviceParameter.forEach((item) => {
              if (this.activeItem == item.operationType) {
                this.opDeviceParameter = item.commonParameter;
                for (let i = 0; i < item.Frequency.length; i++) {
                  let item1 = item.Frequency[i];
                  let pararr = [];
                  if (item1.plmn) {
                    pararr.push(item1.plmn);
                  }
                  if (item1.plmn2) {
                    pararr.push(item1.plmn2);
                  }
                  if (item1.plmn3) {
                    pararr.push(item1.plmn3);
                  }
                  if (item1.plmn4) {
                    pararr.push(item1.plmn4);
                  }
                  if (item1.plmn5) {
                    pararr.push(item1.plmn5);
                  }
                  item1.plmn = pararr;
                  item.Frequency[i] = item1;
                }
                this.frequencyList = item.Frequency;
              }
            });
            this.$nextTick(() => {
              this.$refs.opDeviceParameter.clearValidate();
            })
          } else {
            this.clear();
            this.$nextTick(() => {
              this.$refs.opDeviceParameter.clearValidate();
            })
          }
        }).catch((err) => {
          this.clear();
          this.$nextTick(() => {
            this.$refs.opDeviceParameter.clearValidate();
          });
          this.$message.error(err);
          this.$emit('closeLoading');
        });
      },
      //获取GSM参数
      getGsmParam() {
        let param = {msgId: "b7518c70", type: 4194, cmd: 4540, moduleID: 255, timestamp: new Date().getTime()};
        this.$emit('openLoading');
        this.$post(param).then((data) => {
          this.$emit('closeLoading');
          if ("000000" == data.code && data.content.opDeviceParameter.length > 0) {
            data.content.opDeviceParameter.forEach((item) => {
              if (this.activeItem == item.network) {
                this.opDeviceParameter = item.frequency;
                this.radioSwitch = item.radioSwitch
              }
            });
            this.opDeviceParameter.tacPeriod = data.content.tacPeriod;
            this.opDeviceParameter.reCapFilterPeriod = data.content.reCapFilterPeriod;
            this.$nextTick(() => {
              this.$refs.opDeviceParameter.clearValidate();
            })
          } else {
            this.clear();
            this.$nextTick(() => {
              this.$refs.opDeviceParameter.clearValidate();
            })
          }
        }).catch((err) => {
          this.clear();
          this.$nextTick(() => {
            this.$refs.opDeviceParameter.clearValidate();
          });
          this.$message.error(err);
          this.$emit('closeLoading');
        });
      },
      //保存GSM参数
      saveGsm() {
        this.runStartDevice = false;

        let content = {};
        let data = {};
        let device = Object.assign({}, this.opDeviceParameter);
        content.tacPeriod = device.tacPeriod;
        content.reCapFilterPeriod = device.reCapFilterPeriod;
        delete device['tacPeriod'];
        delete device['reCapFilterPeriod'];
        data.frequency = device;
        data.network = this.activeItem;
        data.radioSwitch = this.radioSwitch;
        content.opDeviceParameter = [data];

        let param = {
          msgId: "b7518c70", type: 4193, cmd: 4539, moduleID: this.getModuleID(), timestamp: new Date().getTime(),
          content: content, activeNow: this.activeNow
        };
        this.$emit('openLoading');
        this.$post(param, "命令下发成功").then((data) => {
          this.$emit('closeLoading');
          this.getGsmParam();
        }).catch((error) => {
          this.$emit('closeLoading');
        });
      },
      //保存/更新参数
      updateParam() {
        this.runStartDevice = false;
        let data = {};
        data.commonParameter = this.opDeviceParameter;
        data.operationType = this.activeItem;
        if (this.activeItem !== 'M') {
          delete this.frequencyList['frameOffset'];
          delete data.commonParameter['syncMode'];
        }
        for (var i = 0; i < this.frequencyList.length; i++) {
          var item = this.frequencyList[i];
          if (item.plmn2) {
            delete item['plmn2'];
          }
          if (item.plmn3) {
            delete item['plmn3'];
          }
          if (item.plmn4) {
            delete item['plmn4'];
          }
          if (item.plmn5) {
            delete item['plmn5'];
          }
          if (item.plmn.length > 1) {
            for (var j = 1; j < item.plmn.length; j++) {
              var item1 = item.plmn[j];
              var paStr = 'plmn' + (j + 1);
              item[paStr] = item1;
            }
            item.plmn = item.plmn[0];
          } else {
            item.plmn = item.plmn[0];
          }
          this.frequencyList[i] = item;
        }
        data.Frequency = this.frequencyList;

        let param = {
          msgId: "b7518c70", type: 4193, cmd: 4257, moduleID: this.getModuleID(), timestamp: new Date().getTime(),
          opDeviceParameter: [data], activeNow: this.activeNow
        };
        this.$emit('openLoading');
        this.$post(param, "命令下发成功").then((data) => {
          this.$emit('closeLoading');
          this.getParam();
        }).catch((error) => {
          this.$emit('closeLoading');
        });
      }
    },
    mounted() {
      this.hasGsmModule = sessionStorage.getItem("hasGsmModule");
      if (this.hasGsmModule == 0) {//只有2个标签
        this.activeName = [{moduleID: 0, name: '移动', type: 'M'}, {moduleID: 1, name: '联通', type: 'U'}];
        this.activeItem = 'M';
      } else if (this.hasGsmModule == 1) {//有GSM
        this.activeName = [{moduleID: -1, name: '移动（GSM）', type: 'GSMCMCC'},
          {moduleID: -1, name: '联通（GSM）', type: 'GSMCMUC'}, {moduleID: 0, name: '移动', type: 'M'},
          {moduleID: 1, name: '联通', type: 'U'}, {moduleID: 2, name: '电信', type: 'T'}];
        this.activeItem = 'GSMCMCC';
      } else {//没有GSM
        this.activeName = [{moduleID: 0, name: '移动', type: 'M'},
          {moduleID: 1, name: '联通', type: 'U'}, {moduleID: 2, name: '电信', type: 'T'}];
        this.activeItem = 'M';
      }
      let deviceId = sessionStorage.getItem("deviceId");
      if (deviceId.indexOf('ZDK') == 0) {//卡口
        this.has34 = true;
      } else {//微热点 ZDM 没有band5、band8、band34
        this.has34 = false;
      }
    }
  }
</script>
