
/* @group [list_group跟table_group共用 明細收合] ----------------------------------------------------------------------------------------*/

/* 移除掉兩句 
$(this).toggleClass('active');
$(this).parent().parent().next('.sub_open_info_frame').slideToggle(200);*/

$('.sub_open').click(function () {
  $(this).parent().parent().toggleClass('data_open');
  $(this).next().slideToggle(200);
});

/* End [list_group 明細收合] ---------------------------------------------------------------------------------------- */

/* @group [swiper] ----------------------------------------------------------------------------------------*/

// swiper 信用卡
var swiper = new Swiper('.swiper-container_credit', {
  slidesPerView: 'auto',  //設置slider容器能同時顯示的slides數量
  centeredSlides: true,   //設定為true時，活動塊會居中，而不是默認狀態下的居左
  spaceBetween: 20,       //兩個區塊間距
  pagination: {
    el: '.swiper-pagination_credit',
    clickable: true,      //設置為true時，點擊分頁的指示點會控制Swiper切換
  },
});

// swiper 廣告
var swiper_ad = new Swiper('.swiper-container_ad', {
  pagination: {
    el: '.swiper-pagination_ad',
    clickable: true,
  },
});

// swiper 帳戶總覽
var swiper_account = new Swiper('.swiper-container_account', {
  pagination: {
    el: '.swiper-pagination_account',
    clickable: true,
  },
});

/* End [swiper] ---------------------------------------------------------------------------------------- */
