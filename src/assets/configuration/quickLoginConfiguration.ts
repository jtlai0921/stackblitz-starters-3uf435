export const QUICK_LOGIN_STORAGE_KEY = "quickLoginConfiguration";
export const Agree_FingerFace_Version_KEY = "AgreeFingerFaceVersion";
export const Agree_PattenLock_Version_KEY = "AgreePattenLockVersion";
export const QUICK_LOGIN_CONFIGURATIONS = [
  {
    key: "defaultQuickLogin",
    header: "MENU.QUICK_LOGIN", // 快速登入
    description: "QUICKLOGIN.FACE_FINGER_LOGON", // 臉跟指尖秒登手機銀行！公務快速處理
    childs: [
      {
        type: "F",
        key: "quickLoginFace",
        agreeKey: "AgreeFingerFace",
        agreeKeyVersion: Agree_FingerFace_Version_KEY,
        passwordKey: "quickLoginFaceConfirmed",
        title: "QUICKLOGIN.FACE_FINGER_LOGIN", // 臉部辨識登入
      },
      {
        type: "T",
        key: "quickLoginFinger",
        agreeKey: "AgreeFingerFace",
        agreeKeyVersion: Agree_FingerFace_Version_KEY,
        passwordKey: "quickLoginFingerConfirmed",
        title: "QUICKLOGIN.FACE_FINGER_LOGIN", // 指紋辨識登入
      },
      {
        type: "P",
        key: "quickLoginPattenLock",
        agreeKey: "AgreePattenLock",
        agreeKeyVersion: Agree_PattenLock_Version_KEY,
        passwordKey: "quickLoginPattenLockNumber",
        title: "QUICKLOGIN.PATTERN_CODE", // 圖形驗證碼
      },
    ]
  },
  {
    key: "defaultOrderLogin",
    header: "QUICKLOGIN.TRANS_VERIFICATION", // 交易驗證
    description: "QUICKLOGIN.OPEN_FACE_FINGER_SMART", // 啟用指紋/臉部辨識，授權放行更Smart ！
    childs: [
      {
        type: "F",
        key: "orderLoginFace",
        agreeKey: "AgreeFingerFace",
        agreeKeyVersion: Agree_FingerFace_Version_KEY,
        passwordKey: "orderLoginFaceConfirmed",
        title: "QUICKLOGIN.FACE_FINGER_LOGIN", // 臉部辨識登入
      },
      {
        type: "T",
        key: "orderLoginFinger",
        agreeKey: "AgreeFingerFace",
        agreeKeyVersion: Agree_FingerFace_Version_KEY,
        passwordKey: "orderLoginFingerConfirmed",
        title: "QUICKLOGIN.FACE_FINGER_LOGIN", // 指紋辨識登入
      },
      {
        type: "P",
        key: "orderLoginPattenLock",
        agreeKey: "AgreePattenLock",
        agreeKeyVersion: Agree_PattenLock_Version_KEY,
        passwordKey: "orderLoginPattenLockNumber",
        title: "QUICKLOGIN.PATTERN_CODE", // 圖形驗證碼
      },
    ]
  }
]