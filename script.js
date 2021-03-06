(function(){
	'use strict';
	
	// #region : [Global variable area]
	/******************************************
	 * [START] Global variable area
	 ******************************************/
	/* Debug or Prod */
	function getUrl(amIprod){
		return (amIprod)?'https://actualurl/':'http://localhost:3000/';
	}
	
	var app_param = {},
		urlcollection = {   /* Ajax 통신을 위한 endpoint모음 */
			login : getUrl(false) + 'login',
			logout : getUrl(false) + 'logout',
		};
	/* url에 있는 파라미터 변수화 하기 */
	function getParam(paramName, callback) {
		var queryStr = window.location.search.substring(1);
		var paramPair = queryStr.split('&');
		paramPair.forEach(function(data, idx){
			var temp_query = data.split('=');
			app_param[temp_query[0]] = temp_query[1];
		});
		return callback(app_param);	//added
	}
	/******************************************
	 * [END] Global variable area
	 ******************************************/
	// #endregion : [Global variable area]

	// #region : [system event area]
	/******************************************
	 * [START] system event area
	 ******************************************/
	/* DOM트리가 로드되자마자 발동될 로직 */
	$(document).ready(function() {
		console.log('### document onready ###');
	})

	/* HTML파일에 필요한 모든 요소가 로드 된 후 발동될 로직*/
	$(window).on('load', function() {
		console.log('### window onload ###');
	});

	/* Page가 바뀔때마다 실행될 로직 */
	$(document).on('pagebeforeshow', function() {
		var thisDom = $(this);
		var pageId = $.mobile.activePage.attr('id');
		
		console.log('### document pagebeforeshow ### $(this):', $(this));
		console.log('### document pagebeforeshow ### pageId:', pageId);
	});

	/* popstate event의 wrapper버전. */
	$( window ).on('navigate', function(e, d) {
		console.log("### window navigated ### e:", e);
		console.log("### window navigated ### data:", d);
	});
	
	/* 마우스 클릭만 하면 실행되는. */
	$(document).mouseup(function (e) {
		var clickEvents = new ClickEvents();
		var targetDom = $(e.target);
		var pageDom = (targetDom.attr('id')=='todo-page-modify')?targetDom:targetDom.parents('#todo-page-modify');
		
		/* 수정페이지가 아니면 아무 일도 일어나지 않는다 */
		if (!pageDom || pageDom.attr('id') != 'todo-page-modify' || !$(e.target).attr('class')){
			return;
		}
		/* 수정 페이지의 드롭다운 화살표 눌렀을때 드롭다운리스트 보이고 안보이고 정하기 */
		if (
			$(e.target).attr('class').indexOf('proj-dropdown-input') == -1 &&
			$(e.target).attr('class').indexOf('proj-dropdown-area') == -1 &&
			$(e.target).attr('class').indexOf('proj-arrow-area') == -1 &&
			$(e.target).attr('class').indexOf('proj-dropdown-arrow') == -1
			// $(e.target).get(0).nodeName != 'svg'
		){
			clickEvents.hideDropdown(e, pageId, 'todo-page-modify');
		}
	});

	/* 키보드 키 입력 제어 이벤트 */
	$(document).keydown(function(e){
		console.log('### document keydown ### e:', e);
		// 게시물 검색 input box 에서 엔터(keyCode=13)를 쳤을 때 검색되도록 하기
		if(e.keyCode == 13){
			if(e.target.className == 'class'){
				// 선택된 타겟의 클래스명이 'class'일 때 발동되는 로직
			}else if(e.target.id == 'id'){
				// 선택된 타겟의 id가 'class'일 때 발동되는 로직
			}else{
				//
			}
		}
		// input, textarea Node안에서 뒤로가기 (keyCode=8) 키보드 버튼 누르면 아무 일도 안 일어나게 하기.
		// history.back()을 방지하기 위함.
		if(e.target.nodeName != "INPUT" && e.target.nodeName != "TEXTAREA"){
			if(e.keyCode === 8){
				return false;
			}
		}
	});

	/* 새로고침이나 뒤로가기 눌러서 화면이 나가지려고 할때 시스템 팝업이 뜨게 하는 로직. */
	window.addEventListener("beforeunload", function (e) {
		console.log('### window beforeunload ### e:', e);
		e.returnValue = null;     // Gecko, Trident, Chrome 34+
		// return null;              // Gecko, WebKit, Chrome <34
	});
	/******************************************
	 * [END] system event area
	 ******************************************/
	// #endregion : [system event area]
	
	// #region : [event storage]
	/******************************************
	* [START] event storage
	******************************************/
	/* Change이벤트 직접 정의하기 */
	function setChangeEvt(targetDom, pageId, nextPageId){
		var changeEvents = new ChangeEvents();
		/* targetDom의 evt는 곧 호출될 function 이름. */
		$(targetDom).on('change', function(e){ 
			var evtName = $(e.target).attr('evt');
			if(changeEvents[evtName] != undefined){ 
				changeEvents[evtName](e, pageId, nextPageId);  
			}
		});
	}
	/* Click이벤트 직접 정의하기 */
	function setClickEvt(targetDom, pageId, nextPageId){
		var clickEvents = new ClickEvents();
		/* targetDom의 evt는 곧 호출될 function 이름. */
		$(targetDom).off('click').on('click', function(e){ 
			/* 클릭된 아이템의 이벤트 이름. */
			var evtName = $(e.target).attr('evt');
			/* div의 최상위 부모를 감지해서 그 부모의 evt값을 추출하기. */
			if(!evtName){
				var candidate1 = $(e.target).parents('.proj-table-row').attr('evt');
				var candidate2 = $(e.target).parents('.proj-table-row-nomargin').attr('evt');
				evtName = (!candidate1)?candidate2:candidate1;
			}
			if($(e.target).attr('class').indexOf('proj-dropdown-arrow') > -1){
				$(e.target).parents('.proj-arrow-area').trigger('click');
				return;
			}
			/* 실제 이벤트 걸기 */
			if(clickEvents[evtName] != undefined){ 
				clickEvents[evtName](e, pageId, nextPageId);
			}
		});
	}
	/* change 이벤트 저장소 */
	function ChangeEvents(){
		return {
			/* 팝업 뒤로가기 버튼 */
			dateChanged: function dateChanged(e, currentPageId, nextpageId){
				var targetDom = $(e.target);
				var pageDom = $('#'+currentPageId);
				
			},  /* /end dateChanged */
		}
	}
	/* 클릭 이벤트 저장소 */
	function ClickEvents(){
		return {
			/* 팝업 뒤로가기 버튼 */
			popupBack: function popupBack(e, currentPageId, nextpageId){
				var targetDom = $(e.target);
				var pageDom = $('#'+currentPageId);
				history.back();
			},  /* /end popupBack */
			/* 메인페이지로 이동. */
			gotoMain: function gotoMain(e, currentPageId, nextpageId){
				var targetDom = $(e.target);
				var pageDom = $('#'+currentPageId);
				location.href="?uk="+app_param['uk'];
			},  /* /end gotoMain */
		}
	}
	/******************************************
	* [END] event storage
	******************************************/
	// #endregion : [event storage]

	// #region : [util function area]
	/******************************************
	* [START] util function area
	******************************************/
	/* 자료 암호화하기 */
	function encryptData(data, salt){
	   return CryptoJS.AES.encrypt(JSON.stringify({ 
		   encrypt: data,
		}), salt);
	}
	/* Server Connection Area : 서버에서 데이터를 받아올 때 사용되는 곳 */
	function connectToServer(url, data, method, callback){
		console.log('[connectToServer]url:', url);
		console.log('[connectToServer]data:', data);
		$.ajax({
			url: url,
			data: JSON.stringify((data)?data:''),
			type: method,
			contentType: 'application/json',
			beforeSend: function(xhr, settings){
				$.mobile.loading( "show", {
		            text: '',
		            textVisible: false,
		            theme: 'a',
		            textonly: false,
		            html: ''
			    });
			},
			success: function(data, status){
				$.mobile.loading( "hide" ); /* 로딩 DOM 없애기 */
				callback(null, data);
			},
			timeout: 10000,
			error: function(data, status, errthrown){
				console.log('[error]data', data);
				console.log('[error]status', status);
				console.log('[error]err thrown', errthrown);
				$.mobile.loading( "hide" ); /* 로딩 DOM 없애기 */
				if(status == 'timeout'){
					callback('서버응답시간을 초과하였습니다.', null)
				}else if(status == 'error'){
					callback('서버로부터 에러가 발생되었습니다.', null)
				}else{
					callback((data.responseJSON)?data.responseJSON:data.statusText, null)
				}
			}
		});
	}

	/* DateTime을 Formatting하는 곳 */
	function convertDate(param){
		var beforeDate = new Date(param);
		var h = beforeDate.getHours();
		var m = beforeDate.getMinutes();
		var s = beforeDate.getSeconds();
		var n = beforeDate.getDate();
		var y = beforeDate.getFullYear();
		var mm = beforeDate.getMonth()+1;

		mm = checkTime(mm); // month
		n = checkTime(n);   // day
		h = checkTime(h);   // hour
		m = checkTime(m);   // minute
		s = checkTime(s);   // second

		function checkTime(i)
		{
			if(i < 10)
			{
				i = "0" + i
			};
			return i;
		}
		return y + "-" + mm + "-" + n + " " + h + ":" + m + ":" + s;
	}
	/******************************************
	* [END] function area
	******************************************/
	// #endregion : [util function area]
})();