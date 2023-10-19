export const Config = {
  'WWW_VERSION': '20137',  // WWW版本號 = Content Version
  'UAT_VERSION': '1.0.0',  // 暫未使用
  'VERSION_DATE': '201903',  // 暫未使用
  'AgreeFingerFaceVersion': '1.2.4',  // 快登條款 生物 版本號
  'AgreePattenLockVersion': '1.2.4',  // 快登條款 圖形 版本號

  // == Server Url Path == //
  'URL': 'https://tbizbank.ctbcbank.com:8443/ccmp-gw/CcmpGW', // 測試
  // == 狀態設定 == //
  'OFFLINE': true,          // [false] 模擬模式:true 模擬, false 連線
  'NATIVE_OPEN': false,        // [true] 手機模式測試(允許使用plugin)
  'ONLINE_UPDATE': false,     // [true] online update 啟動耕版檢查

  // == WWW路徑設定 == //
  'SIMULATION_JSON_PATH': 'assets/simulation/',  // 模擬電文路徑
  'REQUEST_JSON_PATH': 'assets/template/',       // telegram request body設定

  // == 業務參數設定 == //
  'LOGIN_TIMEOUT': 60 * 13, //無操作後11分鐘後登出
  'LOGIN_ALERT': 60 * 10,    //無操作後3分鐘提醒

  // == 密碼的檢核規則 == //
  // 第1及2個字元：是否允許小寫字母及強制至少n個小寫字元。
  // 第3及4個字元：是否允許大寫字母及強制至少n個大寫字元。
  // 第5及6個字元：是否允許數字及強制至少n個數字。
  // 第7及8個字元：是否允許特殊字元及強制至少n個特殊字元。
  // 第9及10個字元：密碼最小長度。00-99，最小長度大於最大長度時，取小者
  // 第11及12個字元：密碼最大長度。00-99，最小長度大於最大長度時，取大者
  // 第13個字元：密碼可允許重複字元數。
  // 第14個字元：密碼可允許連續字元數。
  // 第15個字元：新舊密碼是否可相同。
  // 第16個字元：新密碼是否可與身分統編或使用者代號相同。
  // （0：不允許，1：允許）
  'PIN_POLICY_STR': '1010100006129910',
  //驗測憑證
  'VarcertsInfo': [{ "issuer": "TAIWAN-CA", "sha1": "4E CE EF 31 28 D6 A1 22 51 53 3F 2B CD D6 9E 08 C1 A2 20 A3", "publicKey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA9/ZuHMRKC6dSDlMlR4t61A5A8+/SW7CkG/IUKf73ULC7PVoSJfS9/tGNo0t1de3sVEVQtMhlfSA58rmzsOHsUvxvL1AJaHvnFRXMWSy0aTiqItGQH8pkg83sod+pbAvBJVd21CKgl/GG9qQL1AieT9r3U/gik4WB0whyrglKdpNmX3xZ2BZoVOL3xrRLXhsd8m6rmIjtWykJSdDyniZP1+kIJ9ln4WBoF5T6h9VckH/eLG/G79too83kjmTtJjEhOEZRnin8HaTeU5apcGPG9mZatUVcMcKVAODF+3Ow4eJ4/PPt5rdoyy4eIb8px1yH/Z4+ThqpEmAg5B/D58HZWQIDAQAB" }],
  //StartErrorKey
  "StartErrorKey": "StartErrorKey",
  "StartFinish": "StartFinish",

  // HTTP Request timeout
  "timeout1": 30000,
  "timeout2": 60000,
  "timeout3": 120000,
  "timeout2List": ['CCMPTX000201Rq', 'CCMPTX000188Rq', 'CCMPTX000195Rq'],
  "timeout3List": ['CCMPTX000199Rq', 'CCMPTX000183Rq', 'CCMPTX000203Rq'],

  // 導覽頁輪播設定
  "imgInterval": 2500,
  "imgSpeed": 1000,

  // 推播服務註冊 timeout值設定(millisecond)
  "pushRegisterTimeout": 5000,

  // 舊版密碼加密演算(PINBlock + WBC)
  "pinBlockEncryption": true
}
