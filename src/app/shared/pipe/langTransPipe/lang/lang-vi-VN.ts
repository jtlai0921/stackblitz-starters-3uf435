// lang-zh.ts
export const LANG_VIVN_NAME = 'vi-VN';

let lang_obj = {
  'APP_NAME': 'Ft. Bạc Bobbi Zachs.',
  'BANK_NAME': 'Taipei CITIC Bank'
};

lang_obj['ERROR'] = {
  'ERROR_1':'Trading repeat',
  'ERROR_2':'Wrong information',
  'ERROR_3':'Password authentication failed',
  'ERROR_4':'Non-background user',
  'ERROR_5':'Background user status is abnormal',
  'ERROR_6':'Due to excess of verification limitation, please contact us for further help.',
  'ERROR_7':'LDAP authentication failed',
  'ERROR_8':'Background users have no rights',
  'ERROR_9':'User data does not exist',
  'ERROR_10':'No registered device',
  'ERROR_11':'The status of the device is not allowed to change',
  'ERROR_12':'Kinematic record',
  'ERROR_13':'No eligible data',
  'ERROR_15':'Unsupported APP',
  'ERROR_16':'Transaction without authorization',
  'ERROR_17':'Unmanageable apps',
  'ERROR_18':'An ungovernable state',
  'ERROR_19':'The person is not allowed to cancel the record',
  'ERROR_20':'Background user records already exist',
  'ERROR_22':'Background groups do not exist',
  'ERROR_23':'Group uncleared',
  'ERROR_24':'Data metasomatism',
  'ERROR_25':'Permanent device shutdown',
  'ERROR_26':'System busy or transmission error. Please try again later.',
  'ERROR_27':'Data decryption failed',
  'ERROR_28':'Connection timeout',
  'ERROR_29':'No data change',
  'ERROR_30':'System busy or transmission error. Please try again later.',
  'ERROR_31':'System busy or transmission error. Please try again later.',
  'ERROR_32':'Non-activate status, please contact us for further help.',
  'ERROR_33':'',
  'ERROR_34':'',
  'ERROR_35':'Unregistered device, go register now?',
  'ERROR_36':'Has been registered by other users',
  'ERROR_37':'Device startup failure',
  'ERROR_38':'',
  'ERROR_39':'The Token has been changed',
  'ERROR_40':'Suspended equipment',
  'ERROR_41':'Group profiles already exist',
  'ERROR_42':'Not login',
  'ERROR_43':'Unregistered device, please contact us for further help.',
  'ERROR_44':'Access denied',
  'ERROR_45':'Device registered',
  'ERROR_46':'Account opening failed',
  'ERROR_47':'Device startup code notification failed',
  'ERROR_48':'The device cannot remove itself',
  'ERROR_49':'Due to excess of verification limitation, please contact us for further help.',
  'ERROR_50':'No authorized personnel information was found',
  'ERROR_51':'Cannot find authorization information',
  'ERROR_52':'Repeat authorization',
  'ERROR_53':'There is no reason for refund',
  'ERROR_54':'No authorization is required for the data to be authorized',
  'ERROR_57':'The number of registered devices exceeds the limit',
  'ERROR_58':'Password expiration',
  'ERROR_59':'The graphic verification code is not correct',
  'ERROR_60':'APP already exists',
  'ERROR_61':'Enable code expiration',
  'ERROR_62':'Enabling code error',
  'ERROR_63':'Failed to change OTP device',
  'ERROR_64':'Transaction within the time limit',
  'ERROR_65':'No registered email for verification, please contact our customer service.',
  'ERROR_66':'User does not apply for service',
  'ERROR_67':'No registered phone number for verification, please contact our customer service.',
  'ERROR_68':'The device verification code has expired',
  'ERROR_107':'Incorrect login information, please comfirm and try again.',
  'ERROR_120':'The user does not have permission to use this feature',
  'ERROR_121':'The user does not have permission to use this account',
  'ERROR_122':'Part of the failure',
  'ERROR_123':'The inventory detail query failed',
  'ERROR_124':'Get announcement fail',
  'ERROR_125':'No exchange rate information available',
  'ERROR_126':'The loan profile query failed',
  'ERROR_127':'The loan detail query failed',
  'ERROR_128':'Structural account profile query failed',
  'ERROR_129':'Structured account detail query failed',
  'ERROR_130':'FAQID abnormal',
  'ERROR_131':'This update file does not exist',
  'ERROR_132':'Error transferring to account',
  'ERROR_133':'Error transferring an account',
  'ERROR_134':'ATM channels have not been set',
  'ERROR_135':'Transaction failure',
  'ERROR_136':'More than cutOffTime',
  'ERROR_137':'This device has no user record',
  'ERROR_138':'You has logged in another device. For security considerations, the current session has been terminated.',
  'ERROR_139':'The FTP file does not exist',
  'ERROR_140':'Same user login, original session has been terminated.',
  'ERROR_141':'The date of the reservation transaction has not arrived yet',
  'ERROR_142':'The transaction amount exceeds the maximum limit',
  'ERROR_143':'The trade date is less than today',
  'ERROR_144':'The data to be authorized needs to be re-queried',
  'ERROR_145':'The transaction date is greater than the maximum appointment day',
  'ERROR_146':'Notification status change failed',
  'ERROR_147':'Authorization failure',
  'ERROR_9997':'Push service error, check network status please',
  'ERROR_9998':'System busy or transmission error. Please try again later.',
  'ERROR_9999':'System busy or transmission error. Please try again later.',
  'ERROR_reject':'Sorry, the system is busy. Please try again later.',
  'ERROR_TIMEOUT':'System timeout error, try again later please',
  'ERROR_NET_ERROR':'Network error, check network status please',
  'ERROR_time':'Correction time',
  }
  //交易狀態
lang_obj['TXN_STATUS'] ={
  'TXN_STATUS_0': 'None',
  'TXN_STATUS_1': 'Pending Authorization',
  'TXN_STATUS_2': 'Partially Authorized',
  'TXN_STATUS_3': 'Fully authorized',
  'TXN_STATUS_4': 'Fail',
  'TXN_STATUS_5': 'Successful',
  'TXN_STATUS_6': 'Draft',
  'TXN_STATUS_7': 'Rejected by Authorizer',
  'TXN_STATUS_8': 'Modification in Progress',
  'TXN_STATUS_9': 'Deleted by Maker',
  'TXN_STATUS_10': 'Liquidated',
  'TXN_STATUS_11': 'Processing by Bank',
  'TXN_STATUS_12': 'Active',
  'TXN_STATUS_13': 'Closed',
  'TXN_STATUS_14': 'Cancelled by Bank',
  'TXN_STATUS_15': 'Reversed',
  'TXN_STATUS_23': 'Processing by Bank',
  'TXN_STATUS_24': 'Processing by Bank',
  'TXN_STATUS_25': 'Processing by Bank',
  'TXN_STATUS_26': 'Retrying',
  'TXN_STATUS_27': 'Expired for Authorization',
  'TXN_STATUS_28': 'Rejected for Modification',
  'TXN_STATUS_32': 'Rejected by Authorizer',
  'TXN_STATUS_37': 'Partially Authorized',
  'TXN_STATUS_38': 'Processing by Bank',
  'TXN_STATUS_39': 'Transaction deleted by host',
  'TXN_STATUS_40': 'Processing by Bank',
  'TXN_STATUS_41': 'Transaction processed successfully at host',
  'TXN_STATUS_42': 'Fail',
  'TXN_STATUS_43': 'LC Amendment Deleted',
  'TXN_STATUS_44': 'LC Amendment Confirmation',
  'TXN_STATUS_45': 'LC Amendment Rejected by Beneficiary',
  'TXN_STATUS_46': 'Pending for benficiary Confirmation',
  'TXN_STATUS_47': 'Insufficient Balance',
  'TXN_STATUS_48': 'Partial Fail',
  'TXN_STATUS_49': 'Completed',
  'TXN_STATUS_55': 'Expired for Authorization',
  'TXN_STATUS_200': '使用者交易取消',
}

// == 共用特殊名稱處理 START == //
lang_obj['BTN'] = {
  'CANCEL': 'Hủy bỏ',
  'CLEAR': 'Xóa',
  'DELETE': 'Xoá',
  'CLOSE': 'Đóng cửa',
  // -- 同意 -- //
  'AGREE': 'Đồng ý.',
  'DISAGREE': 'Không đồng ý.',
  // -- 步驟 -- //
  'BACK': 'Quay trở lại',
  'PREVIOUS': 'Lên một bước.',
  'NEXT': 'Bước tiếp theo.',
  // -- 送出 -- //
  'CHECK': 'Xác nhận.',
  'SEARCH': 'Query',
  'SEND': 'Xác nhận.',
  'SAVE': 'Lưu',
  'SET_DEFAULT': 'Phục hồi mặc định',
  'DETERMINE': 'Chắc chắn.',
  'DETERMINE_CHOSE': 'Xác nhận sự lựa chọn',
  // -- 特殊 -- //
  'FILTER': 'Sàng lọc',
  'SELECT_ALL': '全选',
  'CANCEL_ALL': 'Bỏ chọn tất cả',
  'BOX_OPEN': 'Mở rộng',
  'BOX_CLOSE': 'Thu hợp',
  'READ': 'Đọc sách.',
  'UPGRADE': 'Nâng cấp',
  'INSTALL': 'Cài đặt',
  'RE_INSTALL': 'Cài đặt lại',
  'YES': 'Là',
  'NO': 'Không.',
  'SET': 'Đặt',
  'ERROR': 'Sai lầm.',
  'PREVIOUSPAGE': 'Trở lại trên trang',
  'PROMPT_MSG': 'Gợi ý thông tin',
  'FILL_FIELD': 'Làm ơn đã điền vào các lĩnh vực',
  'RELOAD_MORE': 'Nạp thêm...',
};

// 產品名稱
lang_obj['ACCTTYPE'] = {
  'ACCT_S': 'Tiền gửi',
  'ACCT_C': 'Ngân phiếu tiền gửi',
  'ACCT_T': 'Tiền gửi kỳ hạn',
  'ACCT_SD': 'Loại cấu trúc tiền gửi',
  'ACCT_SE': 'Để sống còn.',
  'ACCT_L': 'Tài khoản',
  'ACCT_OD': 'Lưu bị thấu chi nhánh',
}

// 啟動頁
lang_obj['STARTAPP'] = {
  'INITIALIZE': 'Khởi động các',
  'SUGGEST_UPDATE': 'Đề nghị cập nhật',
  'LATEST_VERSION_UPDATE': 'Có phiên bản mới nhất có thể cập nhật!!',
  'UPDATE': 'Cập nhật',
  'CONTINUE': 'Tiếp tục',
  'LANG_INITIALIZE': 'Ngôn ngữ khởi động',
  'CHECK_TRUST_DEVICE': 'Kiểm tra thiết bị để có thể tin tưởng',
  'APPLICATION_INITIALIZE': 'Khởi động tiến trình ứng dụng.',
  'GET_CONNECT_INFO': 'Có thông tin trực tuyến',
  'GET_SESSION': 'Tiến Session',
  'CHECK_VERSION_INFO': 'Kiểm tra thông tin phiên bản',
  'CHECK_AREA': 'Kiểm tra khu vực',
  'GET_ANNOUNCE': 'Đạt được thông báo',
}

//登出登入
lang_obj['LOGINOUT'] = {
  'CHECK_LOGOUT': 'Xác nhận tiến hành hủy?',
  'LOGOUT_FAIL': 'Đăng xuất thất bại.',
  'LOGOUT_SUCC': 'Đăng xuất thành công.',
  'LOGIN_SUCC': 'Thành công đăng nhập.',
  'HOW_EN_NUM': '- Mã số',
  'WELCOM': 'Chào mừng',
  'ID_NUM': '统编',
  'ENTER_COMID_NUM': 'Nhập một số công ty thống nhất',
  'USER_CODE': 'Người dùng danh.',
  'USER_CODE_CHECK': 'Mã số 6-12 feet.',
  'PASSWORD': 'Mật mã.',
  'AGREE_ID_CODE': 'Đồng ý giữ và người dùng danh.',
  'LEAST': 'Ít nhất.',
  'MOST': 'Nhiều nhất',
  'QUICK_LOGIN_CHECK_FAIL': 'Đăng nhập. Kiểm tra nhanh chóng thất bại.',
  'QUICK_LOGIN_ERRORMSG': 'Xác nhận đã nhiều lần thất bại, làm ơn để đăng nhập vào tài khoản mật mã.',
  'CHECK_FAIL': 'Xác nhận thất bại.',
  'QUICK_LOGIN_FAIL': 'Đăng nhập thất bại nhanh chóng.',
  'CHANGETO_PATTERN_LOCK': 'Có phải chuyển đến đồ họa đã được mở.',
  'ERROR_NUM_REACHED': 'Sai số đã đạt',
  'TIMES': ' Lần.',
  'CHANGETO_PATTERN_LOCK_MSG': 'Có phải chuyển sinh học công nhận (nếu sai số lần đạt 5 lần, thì hãy sử dụng đăng nhập vào tài khoản mật khẩu)',
  'ENTER_INFO_CHECK': 'Nhập thông tin sai lầm.',
  'ENTER_ID_NUM': 'Hãy nhập vào một số thống nhất',
  'ID_LENGTH_ERROR': 'Số của số thống nhất không chính xác và phải là 8 chữ số! ',
  'ID_CODE_ERROR ':'Số thống nhất chỉ có thể chứa các từ tiếng Anh, số',
  'ENTER_USER_CODE': 'Hãy nhập tên người dùng, mật danh',
  'USER_CODE_LENGTH_ERROR_LEAST': 'Người dùng bí danh dài có sai ít nhất là 6 người.!',
  'USER_CODE_LENGTH_ERROR_MOST': 'Chiều dài tối đa người dùng, mật danh có sai lầm, 12!',
  'USER_CODE_ENNUM': 'Người dùng chỉ có thể chứa được đặt tên trong tiếng Anh, chữ số',
  'ENTER_PASSWORD': 'Hãy nhập mật mã.',
  'ENTER_OLDPASSWORD': 'Hãy nhập mật mã gốc.',
  'ENTER_NEWPASSWORD': 'Hãy nhập mật khẩu mới',
  'ENTER_CONFIRMPASSWORD': 'Hãy nhập mật khẩu mới xác nhận.',
  'PASSWORD_LEAST_NEED': 'Trong mật mã phải chứa ít nhất.',
  'LOWER_CASE_LETTER': 'Một chữ thường!',
  'PASSWORD_NO_LOWER_CASE': 'Trong mật mã không thể chứa chữ thường!',
  "PASSWORD_ATLEAST_1_LOWER_CASE": "Mật khẩu chứa ít nhất một từ tiếng Anh chữ thường",
  'UPPER_CASE_LETTER': 'Người Hoa!',
  'PASSWORD_NO_UPPER_CASE': 'Trong mật mã không thể chứa hoa!',
  'HOW_NUM': 'Một con số.',
  'PASSWORD_NO_NUM': 'Mật mã không thể chứa trong số.',
  'HOW_SPECIAL_LETTER': 'Đặc biệt,!',
  'PASSWORD_NO_SPECIAL_LETTER': 'Mật mã không thể chứa đặc biệt trong!',
  'PASSWORD_LENGTH_ERROR_LEAST': 'Mật khẩu dài có sai lầm, ít nhất.',
  'PASSWORD_LENGTH_ERROR_MOST': 'Chiều dài tối đa mã có sai lầm,',
  'HOW_LETTER': 'Một!',
  'PASSWORD_ALLOW': 'Mật khẩu không được cho phép',
  'REPEAT_LETTER': 'Một số lặp đi lặp lại!',
  'CONTINUOUS_LETTER': 'Một số liên tục.',
  "NO_CONTINUOUS_LETTER_4": "Mật khẩu không được chứa nhiều hơn 4 chữ số liên tiếp hoặc các ký tự tiếng Anh. (Ví dụ: 1234, abcd)",
  'NEWOLD_NOTSAAME': ' mật mã không thể giống nhau',
  'NEWID_NOTSAAME': 'Mật khẩu mới không thể nhận dạng người dùng cùng với hay danh.',
  'NEW_NOTSAAME': 'Mật khẩu mới không phù hợp',
  'ACCOUNT_ACTIVE_CODE': 'Mã số tài khoản hoạt động.',
  'ENTER_STARTUP_CODE': 'Nhập mã khởi động',
  'OLD_PWD': 'Mật mã gốc.',
  'ENTER_OLD_PWD': 'Hãy nhập mật mã gốc / giao dịch đăng nhập.',
  'NEW_PWD': 'Mật khẩu mới',
  'ENTER_NEW_PWD': 'Hãy nhập mật khẩu mới giao dịch đăng nhập. /',
  'CHECK_NEW_PWD': 'Xác nhận mật khẩu mới',
  'ENTER_NEW_PWD_AGAIN': 'Hãy nhập mật khẩu đăng nhập / thỏa thuận mới một lần nữa.',
  'CHANGE_PASSWORD_CHECK': 'Chắc là thay đổi',
  'DEVICE_CONFIRMATION_CODE': 'Thiết bị mã xác nhận.',
  'ENTER_CONFIRMATION_CODE': 'Nhập mã xác nhận.',
  'LEAVE_APP_GO_OTHER': 'Bạn có chắc chắn muốn thoát khỏi ứng dụng hiện tại?',
  'CANT_READ_SERVICE': 'Không thể đọc vàng kết nối điều khiển liên quan.',
  'ACCOUNT_OPEN_ERROR': 'Số tài khoản bật thất bại!',
  'DEVICE_NOT_TRUST': 'Thiết bị hiện tại cho thiết bị thiết bị không tin, không đăng ký?',
  'REGISTER_DEVICE_ERROR': 'Phương tiện đăng ký thất bại!',
  'CANCEL_REGISTER_DEVICE': 'Thiết bị hủy bỏ đăng ký',
  'PWD_CHANGE_ERROR': 'Mật mã thay đổi thất bại!',
  'CHANGE_SUCC': 'Thay đổi thành công.',
  'TITLE': 'Đăng nhập / thỏa thuận đổi mật khẩu',
  'GOTOHOME': 'Quay trở lại trang đầu',
  'HAVED_LOGOUT': 'Ông đã đóng',
  'THANKYOU': 'Cám ơn!',
  'ACCOUNT_NOT_WORK': 'Số tài khoản chưa khởi động, hãy nhập mã khởi động',
  'ENTER_START_CODE': 'Hãy nhập mã khởi động',
  'ENTER_RECEVIED_REGISTR_CODE': 'Hãy nhập vào thiết bị của bạn đã nhận được đăng ký.',
  'ENTER_REGISTR_CODE': 'Hãy nhập vào một thiết bị mã đăng ký.',
  'PWD_CHANGE_RULE': 'Thay đổi mật khẩu mã thường xuyên và người dùng.',
  'PWD_CHANGE_RULE1': '1.Mật khẩu ít nhất xứng đáng có một mật khẩu có thể chứa 6 tối đa 12',
  'PWD_CHANGE_RULE2': '2.5.Mật mã, ít nhất phải có một chữ thường chữ tiếng Anh; mã ít nhất phải có một số',
  'PWD_CHANGE_RULE3': '3. 密碼不可含有特殊符號如%,#,!等',
  'PWD_CHANGE_RULE4': '4.Mật mã không chứa 4 bit cao hơn con số liên tục hay là tiếng Anh (ví dụ từ.:1234, abcd)',
  'PWD_CHANGE_RULE5': '.Mật mã và người dùng không phải cùng một số bí danh hay thống nhất',
  'PWD_CHANGE_RULE6': '6.Thay đổi mật khẩu không giống với lần trước.',
  'PWD_CHANGE_RULE7': 'Singapore / Thượng Hải Chi nhánh ngân hàng áp dụng',
  'PWD_CHANGE_RULE8': 'Mật mã, ít nhất phải có một chữ thường chữ tiếng Anh; mã ít nhất phải có một mã số; chiều dài cho 8 đến 12 mét.',
  'PWD_CHANGE_RULE9': '密碼不可含有特殊符號如%,#,!等；密碼最多允許2個重複字元；',
  'PWD_CHANGE_RULE10': 'Mật mã không cho tiếp tục con số hoặc chữ tiếng Anh',
  'PERSO_FILE_ERROR': 'Thông tin đăng ký thiết bị không chính xác, vui lòng liên hệ với dịch vụ khách hàng! ! ',
  'LOGIN_FAIL': 'Đăng nhập thất bại',
  'ENTER_PATTERN_LOCK': 'Vui lòng nhập khóa đồ họa',
  'TIMEOUT': 'Bạn đã không hoạt động trong một thời gian, sẽ mất [#minute] phút để đăng xuất',
  'KICK_OFF_USER': 'Tài khoản này hiện đang được sử dụng và đã bị loại bỏ',
  'PASSWORD_CHANGE_SUCCESS': 'Mật khẩu đã thay đổi thành công',
  'INPUT_ERROR': 'Nhập lỗi',
  'TIẾP TỤC': 'Bạn đã không hoạt động trong một thời gian và tiếp tục sử dụng? ',
  'LOGINOUT': 'Ngay lập tức đăng xuất',
  'CONFIRM': 'Tiếp tục sử dụng'
}

//首頁標題
lang_obj['HEADER'] = {
  'TRANSLATE': 'Thay đổi ngôn ngữ',
  'CONTACT': 'Liên lạc trực điện thoại'
}
//存款概要
lang_obj['DEPOSITSUMMARY'] = {
  'TITLE': 'Khoản tiền chủ yếu',
  'CURRENCY': 'Rand đừng',
  'PRODUCT': 'Sản phẩm không',
  'OPENING_BANK': 'Mở tài khoản ngân hàng.',
  'ACCOUNT': 'Số tài khoản',
  'AVAILABLE_BALANCE': 'Có số dư',
  'RATE': 'Lãi suất',
  'DEPOSIT_PRINCIPAL': 'Khoản tiền nợ gốc',
  'STATUS': 'Tình trạng',
  'PRINCIPAL': 'Nợ gốc',
  'LENGTH': 'Kỳ đừng',
  'MATURITY': 'Ngày hết hạn',
  'LOADMORE': 'Nạp thêm...',
  'S': 'Sống còn',
  'T': 'Định tồn',
  'C': 'Chi tiết kiệm',
  'SD': 'Loại cấu trúc',
  'POP_CHECK_CURRENCY': 'Lựa chọn tham gia để đừng',
  'ALL_COMPANY': 'Tất cả các công ty',
  'BALANCE': 'Số tiền trong tài khoản'
}
//存款明細
lang_obj['DEPOSITDETAIL'] = {
  'TITLE': 'Khoản tiền sao kê đấy.',
  'DATE': 'Ngày',
  'START_DATE': 'Từ ngày.',
  'END_DATE': 'Ngày',
  'SEARCH_TYPE': 'Kiểm tra loại',
  'TRANS_DETAIL': 'Thỏa thuận sao kê đấy.',
  'COLLECTION_DETAIL': ' sao kê đấy.',
  'BANK_STATEMENT': 'Với hóa đơn',
  'AVAILABLE_BALANCE': 'Có số dư',
  'MONTH': 'Tháng',
  'DETAIL': 'Sao kê đấy.',
  'STATUS': 'Tình trạng',
  'INTEREST_RATE': 'Lãi suất',
  'INTEREST_TYPE': 'Lãi suất không',
  'COUNT': 'Kỳ đừng',
  'TD_ISSUE_DATE': 'Có hiệu lực từ ngày.',
  'MATURITY': 'Ngày hết hạn',
  'LAST_INTEREST_PAYMENTDATE': 'Lần trước ngày phải trả lãi',
  'INTEREST_PAYMENT': 'Trả lãi suất',
  'TD_INT_ACCT_NO': 'Tài khoản phải trả lãi',
  'TAX_DEDUCTED_SRC': 'Gốc giảm mức thuế',
  'LOAN_AMT': 'Số tiền tài trợ',
  'LOAN_RATE': 'Tài chính số thành',
  'CERT_NO': 'Định biên bản số còn',
  'PRODUCT_NAME': 'Tên sản phẩm',
  'PROTECTION_RATE': 'Tỷ lệ đảm bảo',
  'CURRENT_AMT': 'Hiện tại số lượng',
  'PRINCIPAL_AMOUNT_TRANSFER_DATE': 'Ngày chuyển khoản nợ gốc',
  'PROFIT_TRANSFER_DATES': 'Ngày chuyển khoản tiền thưởng',
  'PLEDGED': 'Chất mượn',
  'PLEDGED_AMOUNT': 'Chất mượn số tiền',
  'ONE_MONTH': 'Gần một tháng.',
  'THREE_MONTHS': 'Gần tháng',
  'SIX_MONTHS': 'Gần nửa năm.',
  'TERM_DEPOSITS': 'Tiền gửi kỳ hạn',
  'STRUCTURED_DEPOSITS': 'Loại cấu trúc tiền gửi',
  'CURRENT_ACCOUNT': 'Ngân phiếu tiền gửi',
  'SAVINGS_ACCOUNT': 'Tiền gửi',
  'PRINCIPAL': 'Nợ gốc',
  'BALANCE': 'Số tiền trong tài khoản',
  'PLEASECHOOSE':'Vui lòng chọn'
}
//放款概要
lang_obj['LOANSUMMARY'] = {
  'TITLE': 'Cho vay chủ yếu',
  'BRANCH_NAME': 'Mở tài khoản ngân hàng.',
  'ACCT_NO': 'Số tài khoản',
  'QUOTA': 'Đã được phê duyệt',
  'LOAN_VAL': 'Di chuyển ngược lại số tiền',
  'DISBURSE_DT': 'Di chuyển ngược lại ngày.',
  'MATURITY_DT': 'Ngày hết hạn',
  'PRODUCT_TYPE_R': 'Vòng loại',
  'PRODUCT_TYPE_N': 'Không lưu thông loại',
  'ALL_COMPANY': 'Tất cả các công ty'
}
//放款明細
lang_obj['LOANDETAIL'] = {
  'TITLE': 'Cho vay sao kê đấy.',
  'COUNTRY': '国别',
  'CUSTOMER_NAME': 'Công ty',
  'ACCT_NO': 'Số tài khoản',
  'LOAN_ACCT': 'Tài khoản cho vay',
  'LOAN_AMT1': 'Di chuyển ngược lại số tiền',
  'DETAIL': 'Sao kê đấy.',
  'ACCT_STATUS': 'Tình trạng',
  'PROD_NAME': 'Sản phẩm không',
  'LOAN_AMT2': '授信额度',
  'ACTL_INT_RATE': 'Lãi suất',
  'INT_TYPE': 'Lãi suất không',
  'DISBURSE_DT': 'Di chuyển ngược lại ngày.',
  'MTRTY_DT': 'Ngày hết hạn',
  'CREDIT_STL_ACCT_NUM': ' số tài khoản',
  'CREDIT_STL_ACCT_NUM_CUR': ' coins đừng',
  'COMPANYINFORMATION' : 'Thông tin công ty'
}
//票據查詢
lang_obj['BILLCOLLECTION'] = {
  'TITLE': 'Hóa đơn Query',
  'BILLCOLLECTION': ' hóa đơn',
  'NOT_ENOUGH_DETAIL': 'Trong ngày đó, đội còn thiếu sao kê đấy.',
  'COUNTRY': '国别',
  'BILL_STATUS': 'Tình trạng vé',
  'DATE': 'Ngày',
  'DATE_FORM': 'Từ ngày.',
  'DATE_TO': 'Ngày',
  'COL_DATA': 'Ngày',
  'STATUS': 'Tình trạng',
  'AMOUNT': 'Số tiền',
  'CURRENT_ACCOUNT': 'Ngân phiếu tiền gửi',
  'BALANCE': 'Số tiền trong tài khoản',
  'NOT_ENOUGN': 'Không đủ số lượng',
  'BILL_DETAIL': 'Hóa đơn sao kê đấy.',
  'CHK_NO': 'Cửa hàng hối đoái',
  'CHK_AMT': 'Số tiền',
  'CHK_TOTAL': 'Ngân phiếu tổng số tiền',
  'NOTE': 'Ben dữ liệu cho biết ngày đội còn thiếu số dư sao kê đấy.',
  'STATUS_1': 'Theo',
  'STATUS_2': 'Ngân',
  'STATUS_3': '托收',
  'STATUS_4': 'Bồi thường',
  'STATUS_5': 'Vé.',
  'STATUS_6': '销账',
  'MATURITY': 'Ngày hết hạn',
  'UPDATE_DATE': 'Cập nhật lần cuối ngày',
  'ONE_MONTH': 'Gần một tháng.',
  'ONE_WEEK': 'Gần một tuần.',
  'TWO_MONTHS': 'Gần hai tháng',
  'CHK_TYPE_1': 'Kho',
  'CHK_TYPE_2': 'Hút vé',
  'CHK_TYPE_3': 'Bồi thường',
  'SEARCH_FAILED': 'Hóa đơn yêu cầu kiểm tra thất bại.',
  'GET_FAILED': 'Hóa đơn yêu cầu chủ yếu đạt được thất bại.'
}
//匯款查詢
lang_obj['WIRETRANSFER'] = {
  'TITLE': 'Tiến hành kiểm tra',
}
//交易紀錄
lang_obj['TRANSACTION'] = {
  'TITLE': 'Kỷ lục giao dịch',
  'TRANSACTION_PAST': 'App kỷ lục giao dịch',
  'TRANSACTION_FUTURE': 'Truy vấn và hủy bỏ cuộc hẹn',
  'PLACEHOLDER_KEYWORD': 'Hãy nhập vào một từ khóa tìm kiếm',
  'SELECT_ALL': '全选',
  'SELECT_NONE': 'Bỏ chọn tất cả',
  'SINGLE': 'Single bút',
  'PAYER_ACCT_NO': 'Quay ra tài khoản',
  'AMOUNT': 'Quay ra là bao nhiêu.',
  'PAYEE_ACCT_NO': 'Được chuyển sang tài khoản',
  'CYCLE': 'Chu kỳ',
  'AMOUNT_EVERYTIME': 'Single lần quay ra là bao nhiêu.',
  'EVERY_MONTH': 'Mỗi tháng.',
  'DATE': 'Ngày.',
  'EVERY_WEEK': 'Mỗi tuần.',
  'AVAILABLE_PERIOD_CNT': ' lần',
  'TIMES': 'Lần.',
  'RESERVATION_CANCEL': 'Hủy bỏ cuộc hẹn',
  'SETTING_TIME': 'Đặt thời gian.',
  'VALIDED_TIME': 'Thời gian có hiệu lực.',
  'BACK': 'Trên một trang.',
  'SETTING_DATE': 'Đặt ngày',
  'TODO': 'Ở đây thực hiện',
  'DONE': 'Đã thực hiện hoặc hủy bỏ',
  'TD_ISSUE_DATE': 'Có hiệu lực từ ngày.',
  'STATUS': 'Tình trạng',
  'AMT': 'Số tiền',
  'CANCEL': 'Hủy bỏ',
  'CONFIRM_DIALOG': 'Xác nhận của cửa sổ',
  'DO_CANCEL': 'Ngài sẽ hủy tùy bút hẹn giao dịch',
  'CANCEL_CONFIRM': 'Chắc là bị hủy bỏ',
  'KEEP': 'Tạm giữ',
  'CANCEL_SUCCESS': 'Hủy thành công.'
}
//產生OTP
lang_obj['OTP'] = {
  'TITLE': 'Tạo ra OTP',
  'DEVICE_CHANGE_INTERNET_CHECK': 'Thiết bị chuyển thất bại, xin hãy xác nhận các kết nối mạng, hay thử lại sau!!!!!!!!!!',
  'OTP_ERROR_AGAIN': 'Không thể tạo ra một số OTP, hãy khởi động lại App!!!!!!!!!!',
  'USE_OTP_CHECK': 'Hãy sử dụng như sau OTP tiến hành xác minh',
  'EFFECTIVE_REMAIN': 'Hiệu kỳ',
  'RELOAD': 'Đang nạp lại',
  'SELECT_OTP_USER': 'Hãy chọn sản xuất OTP của người dùng.',
  'AT': 'Vu',
  'OTP_SEC': 'Giây.',
  'IN_EFFECT': 'Giá trị trong',
  'NOT_OTP_CHANGE': 'Không phải là thiết bị OTP, xin đăng nhập. Sau khi làm chuyển, cám ơn.',
}
//請選擇預設區域
lang_obj['SELECTLOCATION'] = {
  'TITLE1': 'Hãy chọn khu vực mặc định',
  'TITLE2': 'Khu vực lựa chọn mặc định'
}

lang_obj['PROBLEM'] = {
  'TITLE': 'Vấn đề thông thường.'
}

lang_obj['AUTH'] = {
  'TITLE': 'Cho phép để cho đi.',
  'ENTIRE_SAL_TRANSFER':'A01 Chuyển tiền lương',
  'ENTIRE_BATCH_TRANSFER':'A03 chuyển khoản trọn bộ',
  'ENTIRE_TWD_TRANSFER':'B01 Tổng hợp thanh toán tiền Đài',
  'ENTIRE_TWD__AMT_PAYMENT':'B04 Tổng hợp thanh toán tiền Đài',
  'ENTIRE_BATCH_BILL':'D01 Cheque Issueance',
  'ENTIRE_TWD_BATCH_TRANSFER':'B05 Batch Remittance',
  'ENTIRE_CUR_SECURITY':'F09 FCY Stock Agent Transaction',
  'ENTIRE_CUR_SECURITY_2':'F10 FCY Stock Agent Transaction',
  'ENTIRE_CUR_BATCH_SECURITY':'F01 chuyển tiền ngoại tệ',
  'ENTIRE_CUR_BATCH_SECURITY_2':'F02 chuyển tiền ngoại tệ',
  'ENTIRE_FCY_BULK_REMIT':'F03 FCY Bulk Remittance',
  'ENTIRE_CUR_AMOUNT_PAYMENT':'F04 chuyển khoản tổng hợp ngoại tệ',
  'ENTIRE_PAYMENT':'F05 thanh toán',
  'ENTIRE_GLOBAL_FORMAT':'F06 Payment (Global Layout)',
  'ENTIRE_OVERSEA_FORMAT':'L01 Local Remittance (Global layout)',
  'ENTIRE_TRANSFER_NOTIFICATION':'N01 thông báo chuyển tiền',
  'ENTIRE_SECURITY_DEDUCTION':'U01 Stocks Transfer',
  'ENTIRE_SECURITY_DEDUCTION_2':'U03 Stocks Transfer',
  'ENTIRE_AMT_COLLECT':'Y01 thành tiền nhờ thu',
  'ENTIRE_ACH_DEDUCTION_PAYMENT':'Y02 ACH nhờ thu / chi',
  'ENTIRE_ACH_FORMAT':'Y05 ACH Format',
  'ENTIRE_BENEFICIARY_UPLOAD':'Beneficiary Upload',
}

// 帳戶總覽
lang_obj['HOME'] = {
  'TITLE': 'Quan sát toàn bộ tài khoản',
  'ALL_COMPANY': 'Tất cả các công ty',
  'ACCORDING_ACCT': 'Đừng theo sản phẩm',
  'ACCORDING_CUR': 'Theo tiền Đừng',
  'ACCORDING_COMPANY': 'Theo Công ty đừng',
  'ACCORDING_AREA': 'Theo khu vực.',
  'DEPOSIT': 'Tiền gửi',
  'LOAN': 'Cho vay',
  'ABOUT': '约当',
  'DEPOSIT_LOAN_PROPOR': 'Giữ hơn',
  'DEPOSIT_AMOUNT': 'Tổng số tiền cho vay',
  'LOAN_AMOUNT': 'Tổng số tiền trong tài khoản',
  'UNIT': 'Đơn vị',
  'ABOUT_LOCAL_CUR': ' đơn vị tiền tệ',
}

// 個人設定
lang_obj['USERSETTING'] = {
  'TITLE': 'Thiết lập cá nhân',
  'APP_SET': 'App sử dụng đặt',
  'NOTICE_SET': 'Thông báo đặt',
  'INFO_CHANGE': 'Dữ liệu thay đổi',
}

// 通知設定
lang_obj['NOTIFICATIONSETTING'] = {
  'TITLE': 'App thông báo thiết lập dự án',
  'TITLE_L2_AUTH': 'Cho phép để cho đi.',
  'AUTH_PENDING': 'Thông báo cho phép',
  'AUTH_COMPLETED': 'Thông báo cho phép hoàn thành.',
  'AUTH_INCOMPLETE_BEFORE_MATURITY': 'Hẹn ngày trước khi hết hạn giấy phép thông báo chưa hoàn thành.',
  'TITLE_L2_TRXN': 'Và số dư tài khoản giao dịch',
  'TRXN_STOP_PAYMENT': ' thông báo',
  'TRXN_RESERVED_PAYMENT': 'Hẹn thanh toán trước ngày thông báo',
  'TRXN_RESULT': 'Kết quả thông báo giao dịch',
  'USING_CA_EXPIRED': 'Biên bản thông báo hết hạn'
}

// 預設幣別
lang_obj['DEFAULTCURRENCY'] = {
  'TITLE': 'Mặc định để đừng',
  'CHOSE_CUR': 'Hãy chọn một cách mặc định để đừng',
  'SEARCH_LETTER': 'Hãy nhập vào một từ khóa tìm kiếm'
}

// 最新公告
lang_obj['BULLENTIN'] = {
  'TO_TOP': '置顶',
  'SYSTEM': 'Hệ thống.'
}

// 聯絡客服
lang_obj['CONTACT_US'] = {
  'PHONE': 'Điện thoại.',
  'FAX': 'Fax.',
  'DIAL_ERROR': 'Quay số thất bại!!!!!!!!!!'
}

// 使用者代號變更
lang_obj['USERCODECHANGE'] = {
  'TITLE': 'Bí danh của người dùng thay đổi',
  'OLD_USERID': 'Mật mã gốc người dùng.',
  'NEW_USERID': 'Bí danh của người dùng mới.',
  'ENTER_NEW_USERID': 'Hãy nhập tên người dùng, mật danh mới.',
  'CONFIRM_NEW_USERID': 'Xác nhận mật danh người dùng mới.',
  'ENTER_NEW_USERID_AGAIN': 'Hãy nhập vào một lần nữa mới có biệt danh người dùng.',
  'NEW_USERID_NOBLANK': 'Người dùng không thể rỗng mới danh.',
  'CONFIRM_NEW_USERID_NOBLANK': 'Người dùng không thể xác nhận mã mới để trống',
  'OLD_NEW_REPEAT': ' người dùng bí danh lặp đi lặp lại',
  'NEW_USERID_NOTSAME': 'Người dùng mới bí danh và xác định danh mới không phù hợp với người dùng.',
  'NEW_USERID_LENGTH': 'Xin hãy xác nhận danh. Chiều dài của người dùng.',
  "NEW_USERID_SIGN": "Vui lòng xác nhận rằng mã người dùng chỉ có thể bằng tiếng Anh hoặc số",
}

// 新增大額交易通知
lang_obj['EXCESSAMOUNT'] = {
  'TITLE'               : 'Thêm đi bán báo',
  'SELECTACOUNT'        : 'Hãy chọn tài khoản',
  'ALLACOUNT'           : 'Tất cả các tài khoản',
  'SETAMOUNTLAUNCH'     : 'Làm ơn bật châm ngòi cho một thỏa thuận số tiền',
  'TRANSFERAMOUNT'      : 'Quay ra là bao nhiêu.' ,
  'EXCEED'              : 'Hơn',
  'NOTICEME'            : 'Khi gọi cho tôi.',
  'SAVESETINGS'         : 'Lưu thiết lập.',
  'TYPEINDATA'          : 'Nhập số',
  'ADDNOTIFICATION'     : 'Có tin báo',
  'NOTIFICATIONHAVESET' : 'Thông báo đã đặt',
  'AMOUNTNOTICE'        : 'Với thông báo số dư tài khoản. Số lượng',
  'EDIT'                : 'Biên tập.'

}

// 新增餘額上下限通知
lang_obj['BALANCENOTICE'] = {
  'TITLE'           : 'Thêm thông báo số Dư Giới hạn trên và dưới',
  'ACCOUNT_BALANCE'  : 'Số tiền trong tài khoản',
  'EXCEED'          : 'Hơn',
  'BELOW'           : 'Dưới'
}

//新增匯率到價通知ExchangeRatePrice
lang_obj['EXCHAGERATEPRICE'] = {
  'TITLE'               : 'Thêm tỷ giá hối đoái đến thông báo hóa trị',
  'EXCHANGECURRENCY'    : 'Đổi tiền không'
}

//個人設定Personal setting
lang_obj['PERSONALSETTIG'] = {
  'TITLE': 'Thiết lập cá nhân'
}

// 裝置管理員
lang_obj['DEVICE_MANAGE'] = {
  'DEVICE_MANAGER': 'Trình quản lý thiết bị',
  'REGISTERED_DEVICE': 'Thiết bị đã đăng ký.',
  'OTP_DEVICE': 'Thiết bị OTP',
  'GET_USER_REGISTER_ERROR': 'Người dùng đăng ký đạt được tất cả danh sách thiết bị thất bại.',
  'LOCAL_OTP_DEVICE': 'Cỗ máy đã trở thành thiết bị OTP của anh.',
  'LOCAL_RANDOM_GET_OTP': 'Sử dụng thiết bị này tạo ra mã ngẫu nhiên (OTP), nhanh chóng cho phép, an toàn cho đi!',
  'SET_LOACL_OTP_DEVICE': 'Thiết lập máy này cho các thiết bị OTP',
  'REGISTERED_DEVICE_ERROR': 'Đăng ký OTP thiết bị thất bại.',
  'REGISTERED_DEVICE_SUCCESS': 'Đăng ký thành công thiết bị OTP',
  'LOCAL_REGISTERED_INFO': 'Chiếc máy này đăng ký thông tin',
  'BINDING_DATE': 'Ngày tổ hợp',
  'DEVICE_NAME': 'Tên thiết bị',
  'YOU_REGISTERED_DEVICE': 'Anh đã đăng kí thiết bị của',
  'REGISTERED_DATE': 'Đăng ký ngày.',
  'DEVICE': 'Thiết bị',
  'STATUS': 'Tình trạng',
  'OTP': 'OTP',
  'DELETE': 'Xoá',
  'NORMAL': 'Bình thường.',
  'TEMPORARY': 'Tạm cấm',
  'PERMANENT_DISABLE': 'Vĩnh Viễn sẽ tắt.',
  'REGISTERED_DELETE': 'Ghi chú ghi xóa',
  'WAIT_VERIFICATION': 'Chờ xác nhận',
  'UNKNOWN': 'Unknown',
  'DEVICE_SERIAL': 'Chuỗi thiết bị.',
  'WHETHER_UNREGISTERED_DEVICE': 'Thiết bị này được đăng ký hay không.',
  'DEVICE_DELETE_ERROR': 'Thiết bị gỡ bỏ thất bại.',
  'DEVICE_DELETE_SUCCESS': 'Thiết bị gỡ bỏ thành công.',
  'IS_OTP_DEVICE': 'Thiết bị OTP',
  'NON_OTP_DEVICE': 'Dân OTP thiết bị'
}

// 快速登入
lang_obj['QUICKLOGIN'] = {
  'TITLE': 'Với thỏa thuận nhanh chóng xác nhận đăng nhập.',
  'CHANDE_DEFAULT': 'Thay đổi mặc định',
  'DEFAULT_QUICK': '預設使用',
  'DEFAULT': 'Mặc định',
  'READ_TERMS': 'Làm ơn sử dụng khoản',
  'QUICK_BIO_LOGIN_TERMS': 'Nhanh chóng nhận ra các điều khoản sử dụng đăng nhập và sinh học đăng nhập.',
  'HAVE_READ_TERMS': 'Tôi đã và đồng ý nhanh chóng nhận ra các điều khoản sử dụng đăng nhập và sinh học đăng nhập.',
  'PREVIOUS_PAGE': 'Trên một trang.',
  'AGREE_SETTING': 'Đồng ý và thiết lập',
  'CHOSE_DEFAULT_QUICK_LOGIN': 'Hãy chọn mặc định nhanh chóng đăng nhập.',
  'DRAW_PATTERN_LOCK': 'Xin hãy vẽ khóa',
  'DRAW_PATTERN_LOCK_AGAIN': 'Làm ơn lại vẽ khóa',
  'PATTERN_LOCK_ERROR_AGAIN': 'Hai lần không phù hợp với vẽ lại, làm ơn',
  'OPEN_BIO': 'Hoạt động sinh học rõ ràng.',
  'BIO_ERROR': 'Sinh vật nhận diện xác nhận thất bại.',
  'CHANGE_DEFAULT_TO': 'Có thể nhanh chóng cách mặc định của đăng nhập, thay đổi cho',
  'READ_AND_AGREE_TERMS': 'Làm ơn và đồng ý các điều khoản sử dụng',
  'FACE_FINGER_LOGON': 'Với ngón tay lên mặt. Điện thoại công vụ ngân hàng xử lý nhanh!',
  'FACE_LOGIN': 'Nhận dạng khuôn mặt đăng nhập.',
  'FINGER_LOGIN': 'Dấu vân tay, nhận diện đăng nhập.',
  'PATTERN_CODE': 'Graphics CAPTCHA',
  'TRANS_VERIFICATION': 'Thỏa thuận xác nhận',
  'OPEN_FACE_FINGER_SMART': 'Bật dấu vân tay / nhận dạng khuôn mặt, cho phép bật đèn xanh thông minh hơn.',
  'MODIFY_PATTERN_LOCK': 'Thay đổi đồ họa CAPTCHA',
  'MODIFY': 'Thay đổi',
  'DRAW_ORIGINAL_PATTERN_LOCK': 'Hãy nhập vào hình khóa',
  'VERIFY_PATTERN_LOCK_ERROR': 'Graphics Khóa xác nhận sai lầm',
  'DRAW_NEW_PATTERN_LOCK': 'Hãy nhập vào đồ họa mới khóa',
  'DRAW_NEW_PATTERN_LOCK_AGAIN': 'Làm ơn trở lại nhập vào đồ họa mới khóa',
  'MODIFY_PATTERN_LOCK_ERROR_NO_MATCH': 'Đồ thị hai lần không phù hợp với đồ họa mới, hãy tái nhập khóa',
  'MODIFY_PATTERN_LOCK_SUCCESS': 'Graphics khóa thay đổi thành công.'
}

// 帳戶交易
lang_obj['AGREEDACCOUNT'] = {
  'TITLE': 'Tài khoản giao dịch',
  'TRANS_USER': 'Đầu tư',
  'TRANS_CONTENT': 'Thỏa thuận',
  'TRANS_DATE': 'Thỏa thuận ngày.',
  'TRANS_DATE_HINT': 'Hãy chọn thỏa thuận ngày.',
  'REL_ACCT': 'Quay ra tài khoản',
  'REL_ACCT_HINT': 'Hãy chọn quay ra tài khoản',
  'AMOUNT': 'Quay ra là bao nhiêu.',
  'AMOUNT_HINT': 'Hãy nhập số tiền quay ra',
  'PAYEE_ACCT': 'Được chuyển sang tài khoản',
  'PAYEE_ACCT_HINT': 'Hãy chọn được chuyển sang tài khoản',
  'MEMO': '附言',
  'MEMO_HINT': 'Tối đa 7 chữ',
  'FEE': 'Phí',
  'FEE_HINT': '(theo thực tế cho phép)',
  'DOLLOR': ' [#DOLLOR]元',
  'CONFIRM_INFO': 'Xin hãy xác nhận nội dung như sau',
  'INPUT_PASSWORD_TITLE': 'Hãy nhập mật khẩu',
  'INPUT_PASSWORD_HINT': 'Mã số 6-12 feet.',
  'INPUT_PASSWORD_CONFIRM': 'Chắc chắn.',
  'INPUT_PASSWORD_CANCEL': 'Hủy bỏ',
  'ADD_TEMP': 'Tham gia vào ống tạm thời',
  'PREVIOUS': 'Lên một bước.',
  'NEXT': 'Bước tiếp theo.',
  'CONFIRM': 'Xác nhận giao dịch',
  'NOTIFY': 'Thông báo thu người.',
  'DETAIL': 'Để xem sao kê đấy.',
  'SUCCESS': 'Giao dịch thành công.',
  'FAILED': 'Giao dịch thất bại.',
  'MONDAY': 'Thứ 2.',
  'TUESDAY': 'Thứ hai',
  'WEDNESDAY': 'Thứ ba',
  'THURSDAY': 'Tuần 4',
  'FRIDAY': 'Tuần 5',
  'SATURDAY': 'Tuần 6',
  'SUNDAY': 'Tuần trước ngày.',
  'MONTHLY_AMOUNT': ' 每月[#DATE]日，共扣款[#COUNT]次',
  'WEEKLY_AMOUNT': ' 每周[#WEEK]，共扣款[#COUNT]次',
  'INPUT_INVALID': 'Nhập thông tin sai lầm.',
  'DATE_EMPTY': 'Hãy chọn thỏa thuận ngày.',
  'REL_ACCT_EMPTY': 'Hãy chọn quay ra tài khoản',
  'PAYEE_ACCT_EMPTY': 'Hãy chọn được chuyển sang tài khoản',
  'AMONT_NUMERIC': 'Quay ra số tiền đó phải là số',
  'AMOUNT_OUT_OF_LIMIT': 'Quay ra số tiền vượt quá giới hạn',
  'AMOUNT_LESS_THEN_ZERO': 'Quay ra số tiền phải lớn hơn 0.',
  'AMOUNT_EMPTY': 'Hãy nhập số tiền quay ra',
  'TRANS_FAILED': 'Chuyển khoản giao dịch thất bại.',
}

// 匯率查詢
lang_obj['EXCHANGE_RATE'] = {
  'TITLE': 'Tỷ giá hối đoái Query',
  'RATE_TYPE_S': 'Tức thì tỷ giá hối đoái',
  'RATE_TYPE_C': 'Tỷ lệ bằng tiền mặt.',
  'INPUT_CURRENCY_HINT': 'Hãy nhập vào từ khoá',
  'CUSTOM_CURRENCIES': 'Tự lập để đừng hiển thị',
  'CURRENCY_CODE_FROM': 'Ngoại tệ',
  'BUY_RATE_S': 'Lập tức mua chuyển',
  'SELL_RATE_S': 'Lập tức bán chuyển',
  'BUY_RATE_C': 'Mua chuyển tiền',
  'SELL_RATE_C': 'Tiền bán chuyển',
  'MEMO_TITLE': 'Không bút:',
  'MEMO_LINE_1': '(1), Ben - tham khảo bảng, thực tế là tỷ giá hối đoái xin với nhân viên ngân hàng.',
  'MEMO_LINE_2': '(2) CNY nhân dân tệ (ở bờ CNH tỷ giá nhân dân tệ (ngoài khơi), tỷ giá hối đoái). Doanh nghiệp muốn sử dụng CNY (ở bờ tỷ giá hối đoái), hãy chuẩn bị mấy tài liệu liên quan nghề phục vụ lễ tân.',
  'ERROR': 'Sai lầm.',
  'CANNOT_GET_RATE_DATA': 'Không thể lấy dữ liệu tỷ giá hối đoái của ngài, hãy kiểm tra tình trạng mạng hay thử lại sau.',
  "ERROR_TITLE": "Số tiền chuyển đổi đầu vào không chính xác",
  "ERROR_MESSAGE": "Số tiền chuyển đổi chỉ có thể là số",

}

// 自設顯示幣別
lang_obj['CUSTOM_CURRENCY'] = {
  'TITLE': 'Tự lập để đừng hiển thị',
  'EXIT_TITLE': 'Sắp rời khỏi trang',
  'EXIT_CONTENT': 'Tất cả những thay đổi này sẽ không được lưu giữ, xin hãy xác nhận có rời khỏi trang?',
  'EXIT_CONFIRM': 'Lưu',
  'EXIT_CANCEL': 'Không lưu trữ và rời khỏi',
  'CURRENCY': 'Rand đừng',
  'MODIFY': 'Hoạt động',
  'MOVE': 'Di chuyển.',
  'CONFIRM': 'Chắc chắn là lưu',
  'PAGE_TYPE_QUERY': 'Tức thì tỷ giá hối đoái',
  'PAGE_TYPE_CONVERTER': 'Thiết bị chuyển đổi tỷ giá hối đoái',
}

// 匯率換算器
lang_obj['EXCHANGE_CONVERTER'] = {
  'TITLE': 'Thiết bị chuyển đổi tỷ giá hối đoái',
  'INPUT_HINT': 'Nhập số tiền chuyển đổi'
}

// 利率查詢
lang_obj['INTEREST_RATE'] = {
  'TITLE': 'Lãi suất Query'
}

// 約定轉帳日期選擇
lang_obj['POPUP_TRANSQUERY'] = {
  'TXN_TYPE_1': '- Thỏa thuận',
  'TXN_TYPE_2': 'Chu kỳ giao dịch',
  'DATE_PICKER_TITLE': 'Hãy chọn ngày',
  'MEMO_HINT': 'Hãy tự đặt tên (7 từ thỏa thuận hạn)',
  'MONTHLY': 'Mỗi tháng.',
  'MONTHLY_INPUT_HINT': '1-31 nhập số',
  'WEEKLY': 'Mỗi tuần.',
  'MONDAY': 'Thứ 2.',
  'TUESDAY': 'Thứ hai',
  'WEDNESDAY': 'Thứ ba',
  'THURSDAY': 'Tuần 4',
  'FRIDAY': 'Tuần 5',
  'SATURDAY': 'Tuần 6',
  'SUNDAY': 'Tuần trước ngày.',
  'DATE_FROM': 'Từ ngày.',
  'DATE_TO': 'Ngày',
  'CANCEL': 'Hủy bỏ',
  'CONFIRM': 'Chắc chắn.',
  'NOTICE_1': '(1) đặt trong một năm dài nhất',
  'NOTICE_2': '(2) đặt ngày nếu có cơn vô đối của ngày kể từ ngày sau khi thì tự động kéo dài thời gian hẹn ngày 31 tháng, ví dụ như chuyển tiền, vì không có ngày 31 tháng, sẽ tự động kéo dài thời gian đến 3/1',
  'YEAR': 'Năm',
  'MONTH': 'Tháng.',
  'INPUT_INVALID': 'Nhập thông tin sai lầm.',
  'MONTHLY_DATE_EMPTY': 'Hãy nhập vào một thỏa thuận ngày mỗi tháng.',
  'MONTHLY_DATE_NUMERIC': 'Theo thỏa thuận cho thuần số ngày mỗi tháng.',
  'MONTHLY_DATE_RANGE_INVALID': 'Theo thỏa thuận ngày cho 1~31 ngày mỗi tháng.',
  'WEEKLY_DATE_EMPTY': 'Hãy chọn thỏa thuận ngày mỗi tuần.',
  'PERIOD_TYPE_EMPTY': 'Làm ơn đừng chọn thời gian giao dịch',
  'DATE_FROM_EMPTY': 'Hãy chọn từ ngày.',
  'DATE_FROM_FORMAT_INVALID': 'Ngày nay định dạng ngày sai lầm.',
  'DATE_TO_EMPTY': 'Hãy chọn ngày',
  'DATE_TO_FORMAT_INVALID': 'Ngày định dạng ngày sai lầm.',
  'DATE_TO_BEFORE_DATE_FROM': 'Ngày phải lớn hơn từ ngày.',
}

// APP交易紀錄
lang_obj['TRANS_LOG'] = {
  'TITLE': 'Kỷ lục giao dịch',
  'ALL_COUNTRY': 'Trên toàn thế giới.',
  'ALL_COMPANY': 'Tất cả các công ty',
  'ALL_ACCOUNT': 'Tất cả các tài khoản',
  'QUERY_REMIT': 'Tiến hành kiểm tra',
  'QUERY_CHK': 'Hóa đơn Query',
  'TRANS_LOG': 'Kỷ lục giao dịch',
  'APP_TRANS_LOG': 'App kỷ lục giao dịch',
  'PRE_DESIGNATED_TRANSFER': 'Truy vấn và hủy bỏ cuộc hẹn',
  'MONTH': 'Tháng',
  'YEAR':'Năm',
  'CURRENCY': 'Rand đừng',
}

// APP交易紀錄詳細資料
lang_obj['TRANS_LOG_DETAIL'] = {
  'TITLE': 'Thỏa thuận ghi lại dữ liệu chi tiết',
}

// 預設登入頁
lang_obj['DEFALUT_LOGIN_PAGE'] = {
  'TITLE': 'Đăng nhập trang mặc định',
  'SUBTITLE': 'Hãy chọn những trang đầu tiên sau khi đăng nhập.',
  'GET_REMOTE_DATA_FAILED': 'Không thể để người dùng đăng nhập trang đặt mặc định của bạn, xin hãy xác nhận kết nối Internet, hay thử lại sau ()!!!!!!!!!!',
}

//國別
lang_obj['countryCode'] = {
  'ALL': 'Trên toàn thế giới.',
  'GL': 'GL trên toàn thế giới.',
  'TW': 'Đài Loan.',
  'CN': 'Trung Quốc',
  'HK': 'Hồng Kông.',
  'IN': 'Ấn Độ.',
  'JP': 'Nhật Bản',
  'NY': 'New York.',
  'SG': 'Singapore.',
  'VN': 'Việt Nam',
  'US': 'Mỹ.'
}

//交易類型
lang_obj['TXN_CODE'] = {
  'ALL': 'Tất cả các loại',
  'SDT': 'Single bút khoảng.',
  'PDT': 'Chu kỳ khoảng.',
  'LRT': 'Chuyển trong nước.',
  'FRT': 'Nước ngoài chuyển',
  'INT': 'Chuyển tự'
}

//主選單
lang_obj['MENU'] = {
  'BACK': 'Trở về trước, pp.',
  'LOGOUT': 'Gốm',
  'LOGIN': 'Đăng nhập.',
  'QUICK_LOGIN': 'Nhanh chóng đăng nhập.',
  'LOGIN_DEMO': '- hoàn cảnh Demo đăng nhập.',
  'LOGIN_NOT_ENABLED': 'Số tài khoản không bật',
  'LOGIN_UNREGIST': 'Chưa đăng ký tài khoản',
  'LOGIN_CHANGE_PWD': 'Râu thay đổi mật khẩu.',
  'LOGIN_IDENTITY_ONE': 'Một máy đơn nhận diện dấu vân tay.',
  'LOGIN_IDENTITY_MULIT': 'Một máy nhiều người nhận ra dấu vân tay.',
  'OTP_GENERATE': 'Tạo ra OTP',
  'OTP_GENERATE_ONE': 'OTP đơn gắn thiết bị',
  'OTP_GENERATE_MULIT': 'Nhiều người OTP gắn thiết bị',
  'NOTICE': 'Thông báo thông tin.',
  'AUTH_RELEASE': 'Cho phép để cho đi.',
  'ACT_QUERY': 'Tài khoản truy vấn',
  'TRANSFER_DETAIL': 'Hẹn chuyển sao kê đấy.',
  'ACT_TRANS': 'Tài khoản giao dịch',
  'SETTING': 'Thiết lập cá nhân',
  'HOME': 'Trang nhất',
  'AUTH': 'Cho phép',
  'SEARCH': 'Query',
  'TRANSCATION': 'Thỏa thuận',
  'FINANCE': 'Thông tin tài chính.',
  'BULLENTIN': 'Thông báo mới nhất. ',
  'POSITION': 'Truy vấn.',
  'FAQ': 'Đáp thông thường.',
  'CONTACT_US': 'Liên lạc trực điện thoại',
  'TRANSLATE': 'Thay đổi ngôn ngữ',
  'VERSION': 'Phiên bản',
  'DEPOSIT_DETAIL': 'Tài khoản truy vấn',
  'OTP_GENERATE_SHORT':'OTP',
  'NO_PERMISSION': 'Quyền này chưa được bật, vui lòng liên hệ với quản trị viên cấp quyền của bạn' 

}

lang_obj['SUB_MENU'] = {
  'AUTH': 'Đã cho phép',
  'NONAUTH': 'Cho phép',
  'DEPOSITSUMMARY': 'Khoản tiền chủ yếu',
  'DEPOSITDETAIL': 'Khoản tiền sao kê đấy.',
  'LOANSUMMARY': 'Cho vay chủ yếu',
  'LOANDETAIL': 'Cho vay sao kê đấy.',
  'INQUIRY': 'Tiến hành kiểm tra',
  'BILLCOLLECTION': 'Hóa đơn Query',
  'TRANSACTION': 'Kỷ lục giao dịch',
  'AGREEACCOUNT': 'Thỏa thuận chuyển giao',
  'QUICKLOGIN': 'Với thỏa thuận nhanh chóng đăng nhập.',
  'CHANGPATTERTNLOCK': 'Thay đổi đồ họa CAPTCHA',
  'DEVICE_MANAGE': 'Trình quản lý thiết bị',
  'DEFAULTLOGIN': 'Đăng nhập trang mặc định',
  'DEFAULTCURRENCY': 'Mặc định để đừng',
  'TRANSLATE': 'Thay đổi ngôn ngữ',
  'NOTIFICATIONSETTING': 'Thông báo đặt',
  'CHANGEUSERID': 'Thay đổi người dùng danh.',
  'CHANGEPASSWORD': 'Thay đổi thỏa thuận / Đăng nhập mật mã.',
  'CHANGECERTIFICATE': 'Thay đổi mật khẩu chứng nhận',
  'EXCHANGE_RATE': 'Tỷ giá hối đoái Query',
  'EXCHANGE_CONVERTER': 'Thiết bị chuyển đổi tỷ giá hối đoái',
  'INTEREST_RATE': 'Lãi suất Query',
}
export const LANG_VIVN_TRANS = lang_obj;
