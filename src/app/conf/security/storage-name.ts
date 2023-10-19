/**
 * 控管儲存到storage的key name
 */

/**
 * local storage
 */
export const LOCAL_STORAGE_NAME_LIST = {
    // 快速登入設定資訊暫存
    QUICK_LOGIN_STATUS: 'QuickStatus',
    // 登入記住我資訊
    REMEMBER_DATA: 'Remember'
};

/**
 * session storage
 */
export const SESSION_STORAGE_NAME_LIST = {
    // challenge response auth info
    CHALLENGE: 'CR_Status',
    CHALLENGE_AUTH_1: 'server_auth',
    CHALLENGE_AUTH_2: 'hitrust_auth'
};