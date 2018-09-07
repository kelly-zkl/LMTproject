// 处理成json
export const JSONParse = (params) => {
  let jp = '';
  if (!!params) {
    jp = JSON.parse(params);
  }
  return jp;
};
//验证所有整数，包括0和正负数整数
export const intValid = (num) => {
  let isNum = false;
  if (/^(0|[1-9][0-9]*|-[1-9][0-9]*)$/.test(num)) {
    isNum = true;
  }
  return isNum;
};
// 验证手机号码
export const mobileValidator = (phone) => {
  let bol = true;
  if (!/^1(3|4|5|7|8)\d{9}$/.test(phone)) {
    bol = false;
  }
  return bol;
};
//只能整数
export const numValid = (num) => {
  let isNum = false;
  if (/^[0-9]*$/.test(num)) {
    isNum = true;
  }
  return isNum;
};
//小数
export const doubleValid = (num) => {
  let isNum = false;
  if (/^[1-9][0-9]*\.\d{1,2}$|^[0-9]\.\d{1,2}$|^[1-9][0-9]*$|^[0-9]$/.test(num)) {
    isNum = true;
  }
  return isNum;
};
//经度 -180.0～+180.0
export const longitudeValid = (num) => {
  let isNum = false;
  if (/^-?((0|1?[0-7]?[0-9]?)(([.][0-9]{4,})?)|180(([.][0]{4,})?))$/.test(num)) {
    isNum = true;
  }
  return isNum;
};
//纬度-90.0～+90.0
export const latitudeValid = (num) => {
  let isNum = false;
  if (/^-?((0|[1-8]?[0-9]?)(([.][0-9]{4,})?)|90(([.][0]{4,})?))$/.test(num)) {
    isNum = true;
  }
  return isNum;
};
//IP地址
export const ipValid = (num) => {
  let isNum = false;
  if (/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(num)) {
    isNum = true;
  }
  return isNum;
};
//验证MAC地址 短横线或者冒号
export const isMac = (val) => {
  let mac = false;
  if (/^([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2}|([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}$/.test(val)) {
    mac = true;
  }
  return mac;
};
//验证app_id/app_key
export const isApp = (val) => {
  let mac = false;
  if (/^[A-Za-z0-9]+$/.test(val)) {
    mac = true;
  }
  return mac;
};
//验证mcc 移动国家号：000-999 中国：460
export const mccValidator = (mcc) => {
  const reg = /^[0-9]{3}$/;
  return reg.test(mcc);
};
//验证pci 物理小区标识：0-504
export const pciValidator = (pci) => {
  const reg = /^[0-9]{1,3}$/;
  return reg.test(pci);
};
//验证16进制 0001-FFFE 且0000H和FFFFH不可以
export const hexValidator = (hex) => {
  while (hex.length < 4) {//初0成四位
    hex = "0" + hex;
  }
  const regex = /^(?!0000)(?!FFFF)[0-9A-F]{1,4}$/i; //后面的i表示不区分大小写
  if (regex.test(hex)) {
    return true;
  } else {
    return false;
  }
};

//禁止输入特殊字符(除了汉字英文、字母、下划线、横线以外的字符)
export const noSValidator = (msg) => {
  const reg = /^[^A-Za-z0-9_-\u4e00-\u9fa5]+$/;
  return reg.test(msg);
};

//禁止输入特殊字符(除了英文、字母、下划线、横线以外的字符)
export const noValidator = (msg) => {
  const reg = /^[^A-Za-z0-9_-]+$/;
  return reg.test(msg);
};
