<template>
  <div>
    <section class="content">
      <h4 style="text-align: left;margin-top: 0">载波配置</h4>
      <el-tabs v-model="activeItem" @tab-click="handleClick">
        <el-tab-pane v-bind:label="tab.name" v-bind:name="tab.type" v-for="tab in activeName"
                     :key="tab.type"></el-tab-pane>
      </el-tabs>
      <el-form ref="opDeviceParameter" label-width="120px" label-position="right" :rules="rules"
               :model="opDeviceParameter" class="add-appdiv" style="padding: 30px 20px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="band" prop="band" align="left">
              <el-tooltip placement="bottom">
                <div slot="content">基站频段号 取值范围：<br/>电信/联通：1/3<br/>移动：[38-41]</div>
                <el-select v-model="opDeviceParameter.band" placeholder="请选择频段" style="width: 100%">
                  <el-option v-for="item in bands" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="bandWidth" prop="bandWidth" align="left">
              <el-select v-model="opDeviceParameter.bandWidth" placeholder="请选择带宽" style="width: 100%">
                <el-option v-for="item in bandwidths" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="上行频点" required>-->
            <!--<el-input v-model.number="opDeviceParameter.upFrequency" readonly></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="下行频点" prop="downFrequency">
              <el-input v-model.number="opDeviceParameter.downFrequency" @change="changeDown"
                        @blur="changeDown"></el-input>
            </el-form-item>
            <el-form-item label="帧偏移" v-show="activeItem == 'M'" prop="frameOffset">
              <el-input v-model.number="opDeviceParameter.frameOffset" :maxlength=10></el-input>
            </el-form-item>
            <el-form-item label="plmn" prop="plmn" align="left">
              <el-radio-group v-model="opDeviceParameter.plmn" align="left">
                <el-radio-button :label="tab.type" v-for="tab in plmns" :key="tab.type">{{tab.name}}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="pci" prop="pci">
              <el-tooltip placement="bottom">
                <div slot="content">物理小区标识 取值范围：[0-504]</div>
                <el-input v-model.number="opDeviceParameter.pci" :maxlength=3></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="tac">
              <el-tooltip placement="bottom">
                <div slot="content">跟踪区域码 取值范围：[0001－FFFEH]，码组0000H和FFFFH不可以使用</div>
                <el-input v-model.number="opDeviceParameter.tac" :maxlength=4 readonly></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="tac周期" prop="tacPeroid">
              <el-input v-model.number="opDeviceParameter.tacPeroid" :maxlength=4></el-input>
            </el-form-item>
            <el-form-item label="pa调节" prop="powerLevel">
              <el-input v-model.number="opDeviceParameter.powerLevel" :maxlength=3></el-input>
            </el-form-item>
            <el-form-item label="重定向载波频点" prop="redirected_earfcn">
              <el-input v-model.number="opDeviceParameter.redirected_earfcn" :maxlength=10></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="add-appdiv" style="margin-bottom: 0">
        <el-row>
          <el-col :span="2" align="left" :offset="1">
            <span style="font-size: 14px;color: #333;margin-right: 20px">跳频</span>
          </el-col>
          <el-col :span="2" align="left">
              <span style="font-size: 14px;color: #333;margin-right: 20px">
                {{opDeviceParameter.freqHopSwitch == 1 ? '已开启' : '已关闭'}}
              </span>
          </el-col>
          <el-col :span="3" align="left">
            <el-switch v-model="opDeviceParameter.freqHopSwitch" align="right" :active-value="1"
                       :inactive-value="0" active-color="#34CBFE" inactive-color="#bbb"></el-switch>
          </el-col>
          <el-col :span="8" align="left" :offset="1" v-show="opDeviceParameter.freqHopSwitch == 1">
            <span style="font-size: 14px;color: #333;margin-right: 20px">跳频周期</span>
            <el-input v-model.number="freqHopData.switchtime" :maxlength=10 style="width: 200px"></el-input>
          </el-col>
        </el-row>
        <div v-for="(tab,indx) in freqHopData.freqHopParamArray" :key="indx"
             v-show="opDeviceParameter.freqHopSwitch == 1"
             style="margin-top: 20px">
          <el-form :inline="true" align="left" label-width="80px">
            <el-form-item v-show="freqHopData.freqHopParamArray.length > 1" style="margin: 0">
              <i class="el-icon-remove" @click="minusPlmn(indx)"
                 style="color: #34CBFE;font-size: 20px;text-align: center"></i>
            </el-form-item>
            <!--<el-form-item label="上行频点" style="margin: 0">-->
            <!--<el-input v-model.number="tab.upFrequency" :maxlength=10 readonly></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="下行频点" style="margin: 0">
              <el-input v-model.number="tab.downFrequency" :maxlength=10 @change="changeTDown($event,indx)"
                        @blur="changeTDown($event,indx)" style="width: 100px"></el-input>
            </el-form-item>
            <el-form-item label="plmn" style="margin: 0">
              <el-select v-model="tab.plmn" style="width: 100px">
                <el-option :label="item.type" v-for="item in plmns" :key="item.type">{{item.name}}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="帧偏移" style="margin: 0" v-show="activeItem == 'M'">
              <el-input v-model.number="tab.frameOffset" :maxlength=10 @change="changeOffset"
                        style="width: 100px"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-row style="margin-top: 20px"
                v-show="opDeviceParameter.freqHopSwitch == 1 && freqHopData.freqHopParamArray.length < 3">
          <el-col :span="5" align="left" style="margin-left: 80px">
            <el-button type="primary" icon="el-icon-plus" @click="plusPlmn()" size="medium">增加</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="main-footer" style="margin-top: 30px">
        <el-button @click="save()" type="primary">保存配置</el-button>
      </div>
      <!--参数是否立即生效-->
      <div class="popu">
        <el-dialog title="" :visible.sync="runStartDevice" :width="dialogWidth">
          <section>
            <p style="font-size: 16px;padding-bottom: 20px">{{msg}}</p>
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
  import {numValid, intValid, hexValidator, mccValidator, pciValidator} from '../../assets/js/api.js'

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
  let pciValid = (rule, value, callback) => {
    if (!pciValidator(value)) {
      callback(new Error("请输入正确的pci：0-504"));
    } else if (parseInt(value) < 0 || parseInt(value) > 504) {
      callback(new Error("pci的范围是0-504"));
    } else {
      callback();
    }
  };

  export default {
    data() {
      return {
        dialWidth: this.$Is_Pc() ? '40%' : '90%',
        opDeviceParameter: {},
        activeItem: 'M',
        activeName: [{name: '移动', type: 'M', moduleID: 0}, {name: '联通', type: 'U', moduleID: 1},
          {name: '电信', type: 'T', moduleID: 2}],
        rules: {
          band: [{required: true, message: '请选择band值', trigger: "change,blur"}],
          bandWidth: [{required: true, message: '请选择带宽', trigger: "change,blur"}],
          downFrequency: [{required: true, message: '请输入下行频点', trigger: "change,blur"},
            {validator: numVal, trigger: "change,blur"}],
          // tac: [{required: true, message: '请输入tac', trigger: "change,blur"},
          //   {validator: hexValid, trigger: "change,blur"}],
          pci: [{required: true, message: '请输入pci', trigger: "change,blur"},
            {validator: pciValid, trigger: "change,blur"}],
          tacPeroid: [{required: true, message: '请输入TAC周期', trigger: "change,blur"},
            {validator: numVal, trigger: "change,blur"}],
          powerLevel: [{required: true, message: '请输入TAC周期', trigger: "change,blur"},
            {validator: numVal, trigger: "change,blur"}],
          plmn: [{required: true, message: '请选择plmn', trigger: "blur"}],
          redirected_earfcn: [{required: true, message: '请输入重定向载波频点', trigger: "change,blur"},
            {validator: numVal, trigger: "change,blur"}],
          frameOffset: [{required: true, message: '请输入帧偏移', trigger: "change,blur"},
            {validator: intVal, trigger: "change,blur"}]
        },
        bandwidths: [{value: 1, label: '3MHz'}, {value: 2, label: '5MHz'}, {value: 3, label: '10MHz'},
          {value: 4, label: '15MHz'}, {value: 5, label: '20MHz'}],
        bands: [{value: 38, label: 38}, {value: 39, label: 39}, {value: 40, label: 40}, {value: 41, label: 41}],
        bandParams: [],
        activeNow: 1,
        runStartDevice: false,//设置完成重启设备
        dialogWidth: this.$Is_Pc() ? '380px' : '300px',
        msg: '新的设置需要重启移动基带板才能生效',
        plmns: [{type: '460.00', name: '460.00'}, {type: '460.01', name: '460.01'}, {type: '460.11', name: '460.11'}],
        freqHopData: {
          switchtime: 5,
          freqHopParamArray: [{upFrequency: 37900, downFrequency: 37900, plmn: '460.00', frameOffset: 0}]
        },
        plmn: '460.00',
        down: 37900,
        up: 37900
      }
    },
    methods: {
      //增加跳频
      plusPlmn() {
        var item = {upFrequency: this.up, downFrequency: this.down, plmn: this.plmn, frameOffset: 0};
        this.freqHopData.freqHopParamArray.push(item);
      },
      //删除跳频
      minusPlmn(index) {
        this.freqHopData.freqHopParamArray.splice(index, 1);
      },
      //标签页的变化
      handleClick(tab, event) {
        if (tab.name == 'M') {
          this.bands = [{value: 38, label: 38}, {value: 39, label: 39}, {value: 40, label: 40}, {value: 41, label: 41}];
        } else {
          this.bands = [{value: 1, label: 1}, {value: 3, label: 3}];
        }

        if (tab.name == 'M') {
          this.plmn = '460.00';
          this.down = 37900;
          this.up = 37900;
          this.freqHopData = {
            switchtime: 5,
            freqHopParamArray: [{upFrequency: 37900, downFrequency: 37900, plmn: '460.00', frameOffset: 0}]
          };
          this.msg = '新的设置需要重启移动基带板才能生效'
        } else if (tab.name == 'U') {
          this.plmn = '460.01';
          this.down = 1650;
          this.up = 19650;
          this.freqHopData = {
            switchtime: 5,
            freqHopParamArray: [{upFrequency: 19650, downFrequency: 1650, plmn: '460.01', frameOffset: 0}]
          };
          this.msg = '新的设置需要重启联通基带板才能生效'
        } else {
          this.plmn = '460.11';
          this.down = 100;
          this.up = 18100;
          this.freqHopData = {
            switchtime: 5,
            freqHopParamArray: [{upFrequency: 18100, downFrequency: 100, plmn: '460.11', frameOffset: 0}]
          };
          this.msg = '新的设置需要重启电信基带板才能生效'
        }
        this.clearData();
        this.getBandParam();
      },
      //默认数据
      clearData() {
//        if (this.activeItem == 'M') {//移动4G38/40
//          this.opDeviceParameter = {
//            band: 38, pci: 5, tac: 1, isp: 'M', paAtt: 15, frameOffset: 0,
//            tacPeriod: 180, bandWidth: 5, upFrequency: 37900, downFrequency: 37900
//          };
//        } else if (this.activeItem == 'U') {//联通4G
//          this.opDeviceParameter = {
//            band: 3, pci: 6, tac: 1, isp: 'U', paAtt: 15,
//            tacPeriod: 180, bandWidth: 3, upFrequency: 19650, downFrequency: 1650
//          };
//        } else {//电信4G
//          this.opDeviceParameter = {
//            band: 1, pci: 7, tac: 1, isp: 'T', paAtt: 15,
//            tacPeriod: 180, bandWidth: 3, upFrequency: 18100, downFrequency: 100
//          };
//        }
        if (this.activeItem == 'M') {//移动4G38/40
          this.rules = {
            band: [{required: true, message: '请选择band值', trigger: "change,blur"}],
            bandWidth: [{required: true, message: '请选择带宽', trigger: "change,blur"}],
            downFrequency: [{required: true, message: '请输入下行频点', trigger: "change,blur"},
              {validator: numVal, trigger: "change,blur"}],
            // tac: [{required: true, message: '请输入tac', trigger: "change,blur"},
            //   {validator: hexValid, trigger: "change,blur"}],
            pci: [{required: true, message: '请输入pci', trigger: "change,blur"},
              {validator: pciValid, trigger: "change,blur"}],
            tacPeroid: [{required: true, message: '请输入TAC周期', trigger: "change,blur"},
              {validator: numVal, trigger: "change,blur"}],
            powerLevel: [{required: true, message: '请输入TAC周期', trigger: "change,blur"},
              {validator: numVal, trigger: "change,blur"}],
            plmn: [{required: true, message: '请选择plmn', trigger: "blur"}],
            redirected_earfcn: [{required: true, message: '请输入重定向载波频点', trigger: "change,blur"},
              {validator: numVal, trigger: "change,blur"}],
            frameOffset: [{required: true, message: '请输入帧偏移', trigger: "change,blur"},
              {validator: intVal, trigger: "change,blur"}]
          }
        } else {
          this.rules = {
            band: [{required: true, message: '请选择band值', trigger: "change,blur"}],
            bandWidth: [{required: true, message: '请选择带宽', trigger: "change,blur"}],
            downFrequency: [{required: true, message: '请输入下行频点', trigger: "change,blur"},
              {validator: numVal, trigger: "change,blur"}],
            // tac: [{required: true, message: '请输入tac', trigger: "change,blur"},
            //   {validator: hexValid, trigger: "change,blur"}],
            pci: [{required: true, message: '请输入pci', trigger: "change,blur"},
              {validator: pciValid, trigger: "change,blur"}],
            tacPeroid: [{required: true, message: '请输入TAC周期', trigger: "change,blur"},
              {validator: numVal, trigger: "change,blur"}],
            powerLevel: [{required: true, message: '请输入TAC周期', trigger: "change,blur"},
              {validator: numVal, trigger: "change,blur"}],
            plmn: [{required: true, message: '请选择plmn', trigger: "blur"}],
            redirected_earfcn: [{required: true, message: '请输入重定向载波频点', trigger: "change,blur"},
              {validator: numVal, trigger: "change,blur"}]
          }
        }
      },
      getModuleID() {
        let id;
        this.activeName.forEach((item) => {
          if (this.activeItem == item.type) {
            id = item.moduleID;
          }
        });
        return id;
      },
      changeOffset(val) {
        let isVaild = true;
        if (val) {
          if (!intValid(val)) {
            this.$message.error('请输入正确的帧偏移');
            isVaild = false;
          }
        } else {
          this.$message.error('请输入帧偏移');
          isVaild = false;
        }
        return isVaild;
      },
      //下行频点变化
      changeTDown(val, idx) {
        if (val.length > 0) {
          if (this.activeItem == 'M') {//移动
            this.freqHopData.freqHopParamArray[idx].upFrequency = (val ? parseInt(val) : 0);
          } else {//联通电信
            this.freqHopData.freqHopParamArray[idx].upFrequency = (val ? parseInt(val) + 18000 : 18000);
          }
        }
      },
      //下行频点变化
      changeDown(val) {
        if (val.length > 0) {
          if (this.activeItem == 'M') {//移动
            this.opDeviceParameter.upFrequency = (val ? parseInt(val) : 0);
          } else {//联通电信
            this.opDeviceParameter.upFrequency = (val ? parseInt(val) + 18000 : 18000);
          }
        }
      },
      //保存前验证
      save() {
        this.$refs['opDeviceParameter'].validate((valid) => {
          if (valid) {
            this.runStartDevice = true;
          }
        });
      },
      //保存设置
      saveSet() {
//        console.log(this.opDeviceParameter);
        this.runStartDevice = false;
        this.opDeviceParameter.freqHopData = this.freqHopData;
        if (this.activeItem !== 'M') {
          delete this.opDeviceParameter['frameOffset'];
          this.opDeviceParameter.freqHopData.freqHopParamArray.forEach((item) => {
            delete item['frameOffset'];
          })
        }
        if (this.opDeviceParameter.freqHopSwitch == 0) {
          delete this.opDeviceParameter['freqHopData'];
        }
        let param = {
          msgId: "b7518c70", type: 4193, cmd: 4257, moduleID: this.getModuleID(), timestamp: new Date().getTime(),
          opDeviceParameter: [this.opDeviceParameter], activeNow: this.activeNow
        };
        this.$emit('openLoading');
        this.$post(param, "命令下发成功").then((data) => {
          this.$emit('closeLoading');
        }).catch((error) => {
          this.$emit('closeLoading');
        });
      },
      //获取载波参数
      getBandParam() {
        let param = {msgId: "b7518c70", type: 4194, cmd: 4523, moduleID: 255, timestamp: new Date().getTime()};
        this.$emit('openLoading');
        this.$post(param).then((data) => {
          this.$emit('closeLoading');
          if ("000000" == data.code && data.opDeviceParameter.length > 0) {
            this.bandParams = data.opDeviceParameter;
            this.getData();
          }
        }).catch((err) => {
          this.$message.error(err);
          this.$emit('closeLoading');
        });
      },
      getData() {
        this.bandParams.forEach((item) => {
          if (this.activeItem == item.operationType) {
            this.opDeviceParameter = item;
            this.freqHopData = item.freqHopData;
          }
        });
      }
    },
    mounted() {
//      this.clearData();
      this.getBandParam();
    }
  }
</script>
<style scoped>
  @media screen and (min-width: 320px) and (max-width: 799px) {
    .card-width {
      margin-left: 0;
    }
  }

  @media screen and (min-width: 800px) {
    .card-width {
      margin-left: 20px;
    }
  }
</style>
