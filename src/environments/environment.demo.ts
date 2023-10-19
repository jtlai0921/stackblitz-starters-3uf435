/**
 * 環境變數 demo
 * 提供模擬版設定
 * NATIVE=false, ONLINE=false
 */
export const environment = {
  PRODUCTION: false,
  SERVER_URL: 'http://localhost:4200/', // Server位置(UAT測試)
  API_URL: 'api', // api入口(電文路徑)
  // [包版模式設定]
  ONLINE: false, // 是否連線測試
  SERVER_CERT_CHECK: false,
  NATIVE: false, // 是否build到手機上測試
  DIRECTUPDATE: true, // 是否啟動版本同步機制,DirectUpdate檢查
  CHALLENGE_RESPONSE_FLAG: false, // 啟動challenge response模式
  // -------------------- [開發專用設定] -------------------- //
  APP_ERROR_COSE_SHOW: true, // 是否顯示app error code (handle error)
  // LOG level: OFF > ERROR > WARN > INFO > DEBUG > LOG
  // 當array時(開發用)，可吐出多種step('LOG_LEVEL allow string')
  LOG_LEVEL: ['LOG', 'Cache', 'Telegram', 'Security', 'TelegramBase', 'LoadApp', 'Init'],
  LOG_SHOW_ERROR: false, // 設定為true時會在log-util.ts顯示錯誤檔案
  SIMULATION_TIME: 1000, // 模擬電文模擬秒數
  // -------------------- [通訊設定] -------------------- //
  HTTP_TIMEOUT: 180000,
  // [停機公告機制]
  SERVER_ANNO_URL: 'http://localhost:4200/app_disabled.json', // 停機公告檔案路徑(server), 空值則為關閉此機制
  CLIENT_ANNO_URL: './assets/data/terms/maintain.json', // 停機公告檔案路徑(client), 空值則為關閉此機制
  // -------------------- [業務功能設定] -------------------- //
  AUTOLOGOUT_TIME: 300,  // 自動登出時間(秒)
  WARNING_BEFORE_LOGOUT_TIME: 60,  // 自動登出前提示時間(秒)
  // -------------------- [Challenge Response] -------------------- //
  REGISTER: 'challenge/register.rest',
  HAND_SHAKE: 'challenge/handshake.rest',
  EXCHANGE_KEY: 'challenge/exchange.rest',
  DOWNLOAD_PATCH: 'downloadpatch/*.rest?t=/*',
  AUTHORIZATION_KEY: 'hitrust_auth',
  AUTH_TOKEN_KEY: 'auth_token',
  // -------------------- [特定參數設定] -------------------- //
  GOOGLE_MAP_API_KEY: ''
};
