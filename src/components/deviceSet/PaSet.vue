<template>
  <div>
    <section>
      <h4 style="text-align: left;margin-top: 0">PA信息</h4>
      <div class="content add-appdiv">
        <el-form :inline="true" v-for="(item,idx) in paParam" :key="item.index" align="left">
          <el-form-item style="margin: 0 0 10px 0"
                        :label="idx==0?'TDD1900：功放开关':idx==1?'TDD2600：功放开关':idx==2?'FDD2100：功放开关':idx==3?'FDD1800：功放开关':'GSM：功放开关'"
                        align="left">
            <el-switch v-model="item.dlSwitch" active-color="#34CBFE" inactive-color="#bbb" :active-value="1"
                       :inactive-value="0"></el-switch>
          </el-form-item>
          <!--<el-form-item label="功放等级" align="left" style="margin-left: 15px">-->
          <!--<el-radio-group v-model="item.dlPower">-->
          <!--<el-radio-button :label="0">6</el-radio-button>-->
          <!--<el-radio-button :label="3">5</el-radio-button>-->
          <!--<el-radio-button :label="6">4</el-radio-button>-->
          <!--<el-radio-button :label="9">3</el-radio-button>-->
          <!--<el-radio-button :label="12">2</el-radio-button>-->
          <!--<el-radio-button :label="15">1</el-radio-button>-->
          <!--</el-radio-group>-->
          <!--</el-form-item>-->
        </el-form>
        <el-row style="margin-top: 15px">
          <el-col :span="10">
            <el-button type="primary" @click="saveParam()" style="margin-left: 0">保存配置</el-button>
          </el-col>
        </el-row>
      </div>
      <h4 style="text-align: left;margin-top: 0" v-show="paWorkStatus.length>0">PA工作状态</h4>
      <div class="content add-appdiv" v-show="paWorkStatus.length>0">
        <el-row v-for="(item,idx) in paWorkStatus" :key="item.index" style="margin-top: 10px">
          <el-col :span="5" align="left">
            <span style="font-size: 14px;color: #5F6165">{{idx==0?'TDD1900：':idx==1?'TDD2600：':idx==2?'FDD2100：':idx==3?'FDD1800：':'GSM：'}}输入功率<span
              style="margin-left: 15px">{{item.paInputPower}}</span></span>
          </el-col>
          <el-col :span="4" align="left">
            <span style="font-size: 14px;color: #5F6165">输出功率
              <span style="margin-left: 15px">{{item.paOutputPower}}</span>
            </span>
          </el-col>
          <el-col :span="4" align="left">
            <span style="font-size: 14px;color: #5F6165">PA开关
              <span style="margin-left: 15px">{{item.paSwitch == 1 ? '开' : '关'}}</span>
            </span>
          </el-col>
          <el-col :span="4" align="left">
            <span style="font-size: 14px;color: #5F6165">
              PA温度<span v-bind:class="item.paTemp > 80 ? 'text-red' : item.paTemp > 50 ? 'text-yellow' :'text-green'"
                        style="ont-size: 14px;margin-left: 15px">{{item.paTemp}}</span></span>
          </el-col>
          <el-col :span="4" align="left">
            <span style="font-size: 14px;color: #5F6165">驻波比
              <span style="margin-left: 15px">{{item.swr}}</span>
            </span>
          </el-col>
        </el-row>
      </div>
    </section>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        paParam: [{dlSwitch: 0, dlPower: 0, index: 0}, {dlSwitch: 0, dlPower: 0, index: 1},
          {dlSwitch: 0, dlPower: 0, index: 2}, {dlSwitch: 0, dlPower: 0, index: 3},
          {dlSwitch: 0, dlPower: 0, index: 4}],
        paWorkStatus: []
      }
    },
    methods: {
      //获取PA设置
      getParam() {
        let param = {msgId: "b7518c70", type: 4194, cmd: 4537, moduleID: 3, timestamp: new Date().getTime()};
        this.$emit('openLoading');
        this.$post(param).then((data) => {
          this.$emit('closeLoading');
          if ("000000" == data.code && data.data.length > 0) {
            this.paParam = data.data;
          }
        }).catch((err) => {
          this.$message.error(err);
          this.$emit('closeLoading');
        });
      },
      //查询PA状态
      getPaStatus() {
        let param = {msgId: "b7518c70", type: 4194, cmd: 4538, moduleID: 3, timestamp: new Date().getTime()};
        this.$emit('openLoading');
        this.$post(param).then((data) => {
          this.$emit('closeLoading');
          if ("000000" == data.code && data.data.length > 0) {
            this.paWorkStatus = data.data;
          }
        }).catch((err) => {
          this.$message.error(err);
          this.$emit('closeLoading');
        });
      },
      //PA设置
      saveParam() {
        let param = {
          msgId: "b7518c70", type: 4193, cmd: 4536, moduleID: 3, timestamp: new Date().getTime(),
          data: this.paParam
        };
        this.$emit('openLoading');
        this.$post(param, "命令下发成功").then((data) => {
          this.$emit('closeLoading');
        }).catch((err) => {
          this.$message.error(err);
          this.$emit('closeLoading');
        });
      }
    },
    mounted() {
      this.getParam();
      this.getPaStatus();
    }
  }
</script>
<style scoped>
  .text-green {
    color: #00aa00;
  }

  .text-yellow {
    color: #ff8a00;
  }

  .text-red {
    color: #ff0000;
  }
</style>
