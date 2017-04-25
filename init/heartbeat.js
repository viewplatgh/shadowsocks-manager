const _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger('heartbeat');
const config = appRequire('services/config').all();

let shadowsocksServices = undefined;

let checkAccount = undefined;
let checkFreeAccount = undefined;
let saveFlow = undefined;
let generateFlow = undefined;
let alipay = undefined;

switch (config.type) {
  case 's':
    shadowsocksServices = appRequire('services/shadowsocks');
    break;
  case 'm':
    if (config.plugins['account'].use) {
      checkAccount = appRequire('plugins/account/checkAccount');
    }
    if (config.plugins['freeAccount'].use) {
      checkFreeAccount = appRequire('plugins/freeAccount/server/account');
    }
    if (config.plugins['flowSaver'].use) {
      saveFlow = appRequire('plugins/flowSaver');
      generateFlow = appRequire('plugins/flowSaver/generateFlow');
    }
    if (config.plugins['alipay'].use) {
      alipay = appRequire('plugins/alipay');
    }
    break;
  default:
    break;
}

const handleIfAvailable = (mld) => {
  if (mld) {
    mld.handleInterval();
  }
};

const startTime = new Date();

const beatForever = () => {
  _.forEach([
    shadowsocksServices,
    checkAccount,
    checkFreeAccount,
    saveFlow,
    generateFlow,
    alipay
  ], handleIfAvailable);

  const nowTime = new Date();
  const timeDelta = nowTime - startTime;
  const times = Math.floor(timeDelta / 5000);
  const daysD = Math.floor(timeDelta / (1000 * 60 * 60 * 24));
  const hoursD = Math.floor(timeDelta / (1000 * 60 * 60));
  const minsD = Math.floor(timeDelta / (1000 * 60));
  const secsD = Math.floor(timeDelta / 1000);

  logger.info(
    `Heartbeating ${times} times, system is running OK for ${daysD} days ${hoursD} hours ${minsD} minutes ${secsD} seconds`
  );
  setTimeout(beatForever, 5000);
};

beatForever();
