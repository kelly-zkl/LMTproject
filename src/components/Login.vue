<template>
  <div class="login-bg">
    <section class="content" style="margin: 0">
      <el-col :span="24" class="main-header" align="left">
        <span><i class="fa fa-tv" style="margin-right: 16px"></i>开站工具</span>
      </el-col>
      <el-col :span="24" align="center">
        <el-form label-width="0" label-position="left" :model="account" class="login-input">
          <el-form-item class="lan-no">
            <span style="font-size: 22px;color: #fefefe">登录</span>
          </el-form-item>
          <el-form-item class="login-box">
            <el-input placeholder="账号" v-model="account.username" :maxlength="18"
                      prefix-icon="fa fa-user"></el-input>
          </el-form-item>
          <el-form-item class="login-box">
            <el-input type="password" placeholder="密码" v-model="account.password" :maxlength="18"
                      prefix-icon="fa fa-lock" @keyup.13.native="login()"></el-input>
          </el-form-item>
          <el-form-item align="left" style="margin: 0">
            <el-checkbox v-model="savePsw" style="color: #999" @change="handleChange">记住密码</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login()" :loading="logining" style="width: 100%">登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24" class="main-footer">
        All Rights Reserved V2.0.20181015
      </el-col>
    </section>
  </div>
</template>

<script>
  import md5 from 'js-md5';

  export default {
    data() {
      return {
        logining: false,
        savePsw: false,
        account: {username: '', password: ''},
      }
    },
    methods: {
      login() {
        if (!this.account.username || !this.account.password) {
          this.$message.error('请输入账号、密码');
          return;
        }
        let param = {
          msgId: "b7518c70", type: 4192, cmd: 4529, moduleID: 255, timestamp: new Date().getTime(), data: this.account
        };
        this.logining = true;
        this.$post(param, "登录成功").then((data) => {
          this.logining = false;
          if ("000000" === data.code) {
            let user = {save: this.savePsw, acc: '', psw: ''};
            if (this.savePsw === true) {
              user.acc = this.account.username;
              user.psw = this.account.password;
            }
            localStorage.setItem("user", JSON.stringify(user));
            sessionStorage.setItem("user", JSON.stringify(user));
            this.$router.push('/deviceOverview');
          }
        }).catch((err) => {
          this.logining = false;
        });
        // let user = {save: this.savePsw, acc: '', psw: ''};
        // localStorage.setItem("user", JSON.stringify(user));
        // sessionStorage.setItem("user", JSON.stringify(user));
        // this.$router.push('/deviceOverview');
      },
      //是否记住密码
      handleChange(val) {
        let bol = JSON.parse(localStorage.getItem("user"));
        if (bol && val === false) {
          JSON.parse(localStorage.getItem("user")).save = false;
          JSON.parse(localStorage.getItem("user")).acc = '';
          JSON.parse(localStorage.getItem("user")).psw = '';
        }
      },
    },
    mounted() {
      let bol = JSON.parse(localStorage.getItem("user"));
      if (bol && bol.save === true) {
        this.savePsw = true;
        this.account = {
          username: JSON.parse(localStorage.getItem("user")).acc,
          password: JSON.parse(localStorage.getItem("user")).psw
        };
      } else {
        this.savePsw = false;
      }
    }
  }
</script>
<style scoped>
  .login-bg {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    margin-left: -8px;
    background: url("../assets/img/bg_login.jpg") no-repeat;
    background-size: cover;
  }

  @media screen and (min-width: 320px) and (max-width: 639px) {
    .main-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      margin: 0;
      background: rgba(0, 0, 0, 0.6);
      color: #ccc;
      border-top: none;
      font-size: 14px;
      padding: 10px;
    }

    .main-header {
      position: absolute;
      top: 0;
      width: 100%;
      margin: 0;
      background: rgba(0, 0, 0, 0.6);
      border-top: none;
      padding: 10px 20px;
      color: #fff;
      font-size: 18px;
    }

    .login-input {
      position: absolute;
      width: 80%;
      height: 270px;
      line-height: 270px;
      background: rgba(0, 0, 0, 0.4);
      padding: 20px;
      border-radius: 3px;
      left: 50%;
      margin-left: calc(-40% - 20px);
      top: 50%;
      margin-top: -155px;
    }
  }

  @media screen and (min-width: 640px) {
    .main-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      margin: 0;
      background: rgba(0, 0, 0, 0.6);
      color: #ccc;
      border-top: none;
      font-size: 14px;
      padding: 25px;
    }

    .main-header {
      position: absolute;
      top: 0;
      width: 100%;
      margin: 0;
      background: rgba(0, 0, 0, 0.6);
      border-top: none;
      padding: 20px 40px;
      color: #fff;
      font-size: 22px;
    }

    .login-input {
      position: absolute;
      width: 320px;
      height: 270px;
      line-height: 270px;
      background: rgba(0, 0, 0, 0.4);
      padding: 30px;
      border-radius: 3px;
      left: 50%;
      margin-left: -190px;
      top: 50%;
      margin-top: -165px;
    }
  }

  @media screen and (orientation: landscape) and (max-height: 639px) {
    .main-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      margin: 0;
      background: rgba(0, 0, 0, 0.6);
      color: #ccc;
      border-top: none;
      font-size: 14px;
      padding: 10px;
    }

    .main-header {
      position: absolute;
      top: 0;
      width: 100%;
      margin: 0;
      background: rgba(0, 0, 0, 0.6);
      border-top: none;
      padding: 10px 30px;
      color: #fff;
      font-size: 20px;
    }

    .login-input {
      position: absolute;
      width: 260px;
      height: 200px;
      line-height: 200px;
      background: rgba(0, 0, 0, 0.4);
      padding: 20px;
      border-radius: 3px;
      left: 50%;
      margin-left: -150px;
      top: 50%;
      margin-top: -110px;
    }

    .lan-no {
      width: 0;
      height: 0;
      margin: 0;
      padding: 0;
      display: none;
    }
  }
</style>
