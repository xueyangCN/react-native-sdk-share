import { DeviceEventEmitter,NativeModules,Platform,NativeEventEmitter } from 'react-native';
const { RNShare } = NativeModules;
const NativeShareEmitter = new NativeEventEmitter(RNShare);

export function registerApp(registerAppID,callback) {
    RNShare.registerApp(registerAppID,callback);
}

export function isWXAppInstalled(callback) {
    RNShare.isWXAppInstalled(callback);
}

export function shareToTimeline(data,successCallback,failCallback) {

    isWXAppInstalled((isInstalled) => {
        if (isInstalled) {
            RNShare.shareToTimeline(data);
            addListenerWithEventName('WeChat_Resp',successCallback,failCallback);
        }else {
            excuteCallback(failCallback,'微信未安装');
        }
    });
}

export function shareToSession(data,successCallback,failCallback) {

    isWXAppInstalled((isInstalled) => {
        if (isInstalled) {
            RNShare.shareToSession(data, callback);
            addListenerWithEventName('WeChat_Resp',successCallback,failCallback);
        }else {
            excuteCallback(failCallback,'微信未安装');
        }
    });
}

function addListenerWithEventName(eventName,successCallback,failCallback) {
    if (Platform.OS === 'ios') {
        NativeShareEmitter.addListener(eventName, (value) => {
            if (value.errCode === 0) {
                excuteCallback(successCallback,value);
            } else {
                excuteCallback(failCallback,value);
            }
        });
    }else {
        DeviceEventEmitter.addListener(eventName, (value) => {
            if (value.errCode === 0) {
                excuteCallback(successCallback,value);
            } else {
                excuteCallback(failCallback,value);
            }
        });
    }
}

function excuteCallback(callback,value) { callback && callback(value); }
