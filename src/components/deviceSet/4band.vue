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
              <el-form-item label="band" prop="band" required align="left">
                <el-tooltip placement="bottom">
                  <div slot="content">基站频段号 取值范围：<br/>GSM：900/1800<br/>FDD：1/3<br/>TDD：[38-41]</div>
                  <el-select v-model="opDeviceParameter.band" placeholder="请选择" style="width: 100%" filterable>
                    <el-option v-for="item in bands" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="pci" prop="pci">
                <el-tooltip placement="bottom">
                  <div slot="content">物理小区标识 取值范围：[0-504]</div>
                  <el-input v-model.number="opDeviceParameter.pci" :maxlength=3></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="lac" prop="lac">
                <el-tooltip placement="bottom">
                  <div slot="content">位置区域码 取值范围：[0001－FFFEH]，码组0000H和FFFFH不可以使用</div>
                  <el-input v-model.number="opDeviceParameter.lac" :maxlength=4></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="重复上号间隔" prop="reCapFilterPeriod">
                <el-input v-model.number="opDeviceParameter.reCapFilterPeriod" :maxlength=10></el-input>
              </el-form-item>
              <el-form-item label="功率等级" prop="powerLevel" required style="text-align: left">
                <el-tooltip placement="bottom">
                  <div slot="content">功率等级衰减值：<br/>6：0dB&#12288;&#12288;5：3dB&#12288;&#12288;&nbsp;&nbsp;4：6dB
                    <br/>3：9dB&#12288;&#12288;2：12dB&#12288;&#12288;1：15dB
                  </div>
                  <el-select v-model="opDeviceParameter.powerLevel">
                    <el-option v-for="item in powers" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="bcc" prop="bcc">
                <el-tooltip placement="bottom">
                  <div slot="content">频点号 取值范围：<br/>GSM：移动band900[1-94],band1800[512-562],联通band900[96-124],band1800[686-735]
                    <br/>FDD:band1[0-599],band3[1200-1949]
                    <br/>TDD：移动-38 [37750-38249],移动-39 [38250-38649],移动-40 [38650-39649],移动-41 [39650-41589]
                  </div>
                  <el-input v-model.number="opDeviceParameter.bcc" :maxlength=5 @change="changeBcc"
                            @blur="changeBcc"></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="tac周期" prop="tacPeriod">
                <el-input v-model.number="opDeviceParameter.tacPeriod" :maxlength=4></el-input>
              </el-form-item>
              <el-form-item label="小区 ID" prop="cellId">
                <el-input v-model.number="opDeviceParameter.cellId" :maxlength=4></el-input>
              </el-form-item>
              <el-form-item label="plmn" align="left" required>
                <el-radio-group v-model="opDeviceParameter.plmn" align="left">
                  <el-radio-button :label="tab.type" v-for="tab in plmns" :key="tab.type">{{tab.name}}
                  </el-radio-button>
                </el-radio-group>
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
              <el-form-item label="tac">
                <el-tooltip placement="bottom">
                  <div slot="content">跟踪区域码 取值范围：[0001－FFFEH]，码组0000H和FFFFH不可以使用</div>
                  <el-input v-model.number="opDeviceParameter.tac" :maxlength=4 readonly></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="重定向载波频点" prop="redirected_earfcn">
                <el-input v-model.number="opDeviceParameter.redirected_earfcn" :maxlength=10></el-input>
              </el-form-item>
              <el-form-item label="同步方式" style="text-align: left;margin: 0" v-show="activeItem == 'M'">
                <el-radio-group v-model="opDeviceParameter.syncMode">
                  <el-radio-button :label="1">GPS同步</el-radio-button>
                  <el-radio-button :label="2">空口同步</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="tac周期" prop="tacPeriod">
                <el-input v-model.number="opDeviceParameter.tacPeriod" :maxlength=4></el-input>
              </el-form-item>
              <el-form-item label="bandWidth" required align="left" prop="bandWidth">
                <el-select v-model="opDeviceParameter.bandWidth" placeholder="带宽BandWidth" filterable
                           style="width: 100%">
                  <el-option v-for="item in bandwidths" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div class="add-appdiv" style="margin-bottom: 0">
        <div v-for="(tab,indx) in frequencyList" :key="indx">
          <el-form :inline="true" align="left" label-width="80px">
            <el-form-item v-show="frequencyList.length > 1" style="margin: 0 0 10px 0">
              <i class="el-icon-remove" @click="minusPlmn(indx)"
                 style="color: #34CBFE;font-size: 20px;text-align: center"></i>
            </el-form-item>
            <!--<el-form-item label="上行频点" style="margin: 0 0 10px 0">-->
            <!--<el-input v-model.number="tab.upFrequency" :maxlength=10 readonly></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="下行频点" style="margin: 0 0 10px 0">
              <el-input v-model.number="tab.downFrequency" :maxlength=10 @change="changeTDown($event,indx)"
                        @blur="changeTDown($event,indx)" style="width: 100px"></el-input>
            </el-form-item>
            <el-form-item label="pci" prop="pci" style="margin: 0 0 10px 0">
              <el-tooltip placement="bottom">
                <div slot="content">物理小区标识 取值范围：[0-504]</div>
                <el-input v-model.number="tab.pci" :maxlength=3 style="width: 80px"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="plmn" style="margin: 0 0 10px 0">
              <el-select v-model="tab.plmn" style="width: 100px">
                <el-option v-for="item in plmns" :key="item.type" :value="item.type" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="优先级" style="margin: 0 0 10px 0">
              <el-tooltip effect="dark" content="现网频点优先级" placement="bottom">
                <el-input v-model.number="tab.priority" :maxlength=10 @change="changeOffset"
                          style="width: 100px"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="rsrp" style="margin: 0 0 10px 0">
              <el-tooltip effect="dark" content="现网频点RSRP" placement="bottom">
                <el-input v-model.number="tab.rsrp" :maxlength=10 @change="changeRsrp" style="width: 100px"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="功率等级" style="margin: 0 0 10px 0">
              <el-tooltip placement="bottom">
                <div slot="content">功率等级衰减值：<br/>6：0dB&#12288;&#12288;5：3dB&#12288;&#12288;&nbsp;&nbsp;4：6dB
                  <br/>3：9dB&#12288;&#12288;2：12dB&#12288;&#12288;1：15dB
                </div>
                <el-select v-model="tab.powerLevel" style="width: 80px">
                  <el-option v-for="item in powers" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="帧偏移" style="margin: 0 0 10px 0" v-show="activeItem == 'M'">
              <el-input v-model.number="tab.frameOffset" :maxlength=10 @change="changeOffset"
                        style="width: 100px"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-row v-show="frequencyList.length < 16">
          <el-col :span="5" align="left" style="margin-left: 80px">
            <el-button type="primary" icon="el-icon-plus" @click="plusPlmn()" size="medium">增加</el-button>
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
  import {numValid, intValid, hexValidator, mccValidator, pciValidator} from '../../assets/js/api.js'

  export default {
    data() {
      let numVal = (rule, value, callback) => {
        if (!numValid(value)) {
          callback(new Error("只能输入整数"));
        } else {
          callback();
        }
      };
      let intVal = (rule, value, callback) => {
        if (!intValid(value)) {
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
      let mccValid = (rule, value, callback) => {
        if (!mccValidator(value)) {
          callback(new Error("请输入正确的mcc：000-999"));
        } else {
          callback();
        }
      };
      let pciValid = (rule, value, callback) => {
        if (!pciValidator(value)) {
          callback(new Error("请输入正确的pci：0-504"));
        } else if (parseInt(value) < 0 || parseInt(value) > 504) {
          callback(new Error("pci的范围是0-504"));
        } else {
          callback();
        }
      };
      return {
        hasGsmModule: 0,
        runStartDevice: false,
        dialogWidth: this.$Is_Pc() ? '380px' : '300px',
        activeNow: 1,
        opDeviceParameter: {},
        activeName: [{moduleID: -1, name: '移动（GSM）', type: 'GSMCMCC'},
          {moduleID: -1, name: '联通（GSM）', type: 'GSMCMUC'}, {moduleID: 0, name: '移动', type: 'M'},
          {moduleID: 1, name: '联通', type: 'U'}, {moduleID: 2, name: '电信', type: 'T'}],
        activeItem: 'GSMCMCC',
        bands: [{value: 900, label: 900}, {value: 1800, label: 1800}],
        bandwidths: [{value: 1, label: '3MHz'}, {value: 2, label: '5MHz'}, {value: 3, label: '10MHz'},
          {value: 4, label: '15MHz'}, {value: 5, label: '20MHz'}],
        rules: {
          downFrequency: [
            {required: true, message: '请输入下行频点', trigger: "blur"}, {validator: numVal, trigger: "change,blur"}],
          pci: [{required: true, message: '请输入pci', trigger: "blur"}, {validator: pciValid, trigger: "change,blur"}],
          // tac: [{required: true, message: '请输入tac', trigger: "blur"}, {validator: hexValid, trigger: "change,blur"}],
          tacPeriod: [{required: true, message: '请输入重复抓取时间', trigger: "blur"},
            {validator: numVal, trigger: "change,blur"}],
          bandWidth: [{required: true, message: '请选择带宽', trigger: "blur"}],
          redirected_earfcn: [{required: true, message: '请输入重定向载波频点', trigger: "blur"},
            {validator: numVal, trigger: "change,blur"}],
          bcc: [{required: true, message: '请输入bcc', trigger: "blur"}, {validator: numVal, trigger: "change,blur"}],
          lac: [
            {required: true, message: '请输入lac', trigger: "blur"}, {validator: hexValid, trigger: "change,blur"}],
          reCapFilterPeriod: [{required: true, message: '请输入重复上号间隔', trigger: "blur"},
            {validator: numVal, trigger: "change,blur"}],
          cellId: [{required: true, message: '请输入小区ID', trigger: "blur"},
            {validator: numVal, trigger: "change,blur"}]
        },
        plmns: [{type: '460.00', name: '460.00'}, {type: '460.01', name: '460.01'}, {type: '460.11', name: '460.11'}],
        frequencyList: [{
          upFrequency: 37900, downFrequency: 37900, plmn: '460.00', rsrp: 0,
          priority: 0, pci: 5, powerLevel: 0, frameOffset: 0
        }],
        powers: [{value: 0, label: 6}, {value: 3, label: 5}, {value: 6, label: 4}, {value: 9, label: 3},
          {value: 12, label: 2}, {value: 15, label: 1}],
        plmn: '460.00',
        down: 37900,
        up: 37900,
        deviceType: ''
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
      //TDD：移动-38 [37750-38249],移动-39 [38250-38649],移动-40 [38650-39649],移动-41 [39650-41589]
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
        }
        return isVaild;
      },
      //初始化
      clear() {
        if (this.activeItem == 'M') {//移动4G38/40
          this.opDeviceParameter = {redirected_earfcn: 37900, tac: 1, tacPeriod: 180, bandWidth: 5, syncMode: 1};
        } else if (this.activeItem == 'U') {//联通4G
          this.opDeviceParameter = {redirected_earfcn: 1650, tac: 1, tacPeriod: 180, bandWidth: 3};
        } else if (this.activeItem == 'T') {//电信4G
          this.opDeviceParameter = {redirected_earfcn: 100, tac: 1, tacPeriod: '180', bandWidth: 3};
        } else if (this.activeItem == 'GSMCMCC') {
          this.opDeviceParameter = {
            band: 900, bcc: 1, lac: 9, pci: 1, tacPeriod: 180, plmn: "460.11", reCapFilterPeriod: 300, cellId: 3
          };
        } else if (this.activeItem == 'GSMCMUC') {
          this.opDeviceParameter = {
            band: 900, bcc: 96, lac: 9, pci: 1, tacPeriod: 180, plmn: "460.11", reCapFilterPeriod: 300, cellId: 3
          };
        }
        this.defaultFrequencyList();
      },
      //跳频默认参数
      defaultFrequencyList() {
        if (this.activeItem == 'M') {//移动4G38/40
          this.plmn = '460.00';
          this.down = 37900;
          this.up = 37900;
          this.pci = 5;
          this.frequencyList = [{
            upFrequency: this.up, downFrequency: this.down, plmn: this.plmn, rsrp: 0,
            priority: 0, pci: this.pci, powerLevel: 0, frameOffset: 0
          }];
        } else if (this.activeItem == 'U') {//联通4G
          this.plmn = '460.01';
          this.down = 1650;
          this.up = 19650;
          this.pci = 6;
          this.frequencyList = [{
            upFrequency: this.up, downFrequency: this.down, plmn: this.plmn, rsrp: 0,
            priority: 0, pci: this.pci, powerLevel: 0, frameOffset: 0
          }];
        } else if (this.activeItem == 'T') {//电信4G
          this.plmn = '460.11';
          this.down = 100;
          this.up = 18100;
          this.pci = 7;
          this.frequencyList = [{
            upFrequency: this.up, downFrequency: this.down, plmn: this.plmn, rsrp: 0,
            priority: 0, pci: this.pci, powerLevel: 0, frameOffset: 0
          }];
        } else {
          this.frequencyList = [{
            upFrequency: 0, downFrequency: 0, plmn: '460.00', rsrp: 0,
            priority: 0, pci: 5, powerLevel: 0, frameOffset: 0
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
      //保存前验证
      save() {
        this.$refs['opDeviceParameter'].validate((valid) => {
          if (valid) {
            if (this.getModuleID() < 0) {
              if (this.changeBcc(this.opDeviceParameter.bcc)) {
                this.runStartDevice = true;
              }
            } else {
              this.runStartDevice = true;
            }
          }
        });
      },
      //获取载波参数
      getParam() {
        let param = {msgId: "b7518c70", type: 4194, cmd: 4523, moduleID: 255, timestamp: new Date().getTime()};
        this.$emit('openLoading');
        this.$post(param).then((data) => {
          this.$emit('closeLoading');
          if ("000000" == data.code && data.opDeviceParameter.length > 0) {
            data.opDeviceParameter.forEach((item) => {
              if (this.activeItem == item.operationType) {
                this.opDeviceParameter = item.commonParameter;
                this.frequencyList = item.Frequency;
              }
            });
          }
        }).catch((err) => {
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
                this.opDeviceParameter = item.frequency
              }
            });
            this.opDeviceParameter.tacPeriod = data.content.tacPeriod;
            this.opDeviceParameter.reCapFilterPeriod = data.content.reCapFilterPeriod;
          }
        }).catch((err) => {
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
        content.opDeviceParameter = [data];

        let param = {
          msgId: "b7518c70", type: 4193, cmd: 4539, moduleID: this.getModuleID(), timestamp: new Date().getTime(),
          content: content, activeNow: this.activeNow
        };
        this.$emit('openLoading');
        this.$post(param, "命令下发成功").then((data) => {
          this.$emit('closeLoading');
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
        data.Frequency = this.frequencyList;

        let param = {
          msgId: "b7518c70", type: 4193, cmd: 4257, moduleID: this.getModuleID(), timestamp: new Date().getTime(),
          opDeviceParameter: [data], activeNow: this.activeNow
        };
        this.$emit('openLoading');
        this.$post(param, "命令下发成功").then((data) => {
          this.$emit('closeLoading');
        }).catch((error) => {
          this.$emit('closeLoading');
        });
      }
    },
    mounted() {
      this.clear();
      this.hasGsmModule = sessionStorage.getItem("hasGsmModule");
      if (this.hasGsmModule == 0) {//没有GSM
        this.activeName = [{moduleID: 0, name: '移动', type: 'M'},
          {moduleID: 1, name: '联通', type: 'U'}, {moduleID: 2, name: '电信', type: 'T'}];
        this.activeItem = 'M';
        this.getParam();
      } else {//有GSM
        this.activeName = [{moduleID: -1, name: '移动（GSM）', type: 'GSMCMCC'},
          {moduleID: -1, name: '联通（GSM）', type: 'GSMCMUC'}, {moduleID: 0, name: '移动', type: 'M'},
          {moduleID: 1, name: '联通', type: 'U'}, {moduleID: 2, name: '电信', type: 'T'}];
        this.activeItem = 'GSMCMCC';
        this.getGsmParam();
      }
    }
  }
</script>
