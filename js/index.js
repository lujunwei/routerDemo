(function() {
  FastClick.attach(document.body);
  // 
  var moneyIconel = $(".money-icon img");
  moneyIconel.on("load", function() {
  	moneyIconel.removeClass("swing");
  	setTimeout(function() {
  		moneyIconel.addClass("swing");
  	}, 0);

  	setTimeout(function() {
  		$(".invite-btn").addClass("myBreath");
  	}, 1100);
  });

 	function myAnimate() {	//动画
  	setTimeout(function() {
  		$(".invite-btn").addClass("myBreath");
  	}, 100);
 	}

 	// 接触监听动画结束
	moneyIconel[0].removeEventListener('webkitAnimationEnd', myAnimate);
	moneyIconel[0].removeEventListener('mozAnimationEnd', myAnimate);
  moneyIconel[0].removeEventListener('oAnimationEnd', myAnimate);
  moneyIconel[0].removeEventListener('animationend', myAnimate);

  // 监听动画结束
	moneyIconel[0].addEventListener('webkitAnimationEnd', myAnimate);
	moneyIconel[0].addEventListener('mozAnimationEnd', myAnimate);
  moneyIconel[0].addEventListener('oAnimationEnd', myAnimate);
  moneyIconel[0].addEventListener('animationend', myAnimate);
	
   //查看规则
	// $(".check-rule-btn").on('click', function() {
	// 	// Router.navigate("./inviteRule.html")
	// 	// window.location.href = '../html/inviteRule.html';
	// });

	// 邀请好友
	$(".invite-btn").on('click', function() {
		if(isLogin() && !isLimited()) {	//登录状态且没超过分享人数
			inviteFriend();
		}
	});

	// 继续邀请
	$(".keep-invite-btn").on("click", function() {
		inviteFriend();
	});

	// 马上投资
	$(".invest-btn").on("click", function() {
		console.log("马上投资")
	});

	// 邀请好友
	function inviteFriend() {
		if(GetQueryString('type') == 'mobileapp') {	// app
			window.Jsbridge && window.Jsbridge.toAppInviteFriend();
    }else{	//触屏版
    	$(".show").removeClass("show");
    	$(".share, .mask").addClass("show").removeClass("hide");
    }
	}

	// 领取已赚取红包
	$(".exchange-btn").on('click', function() {
		// TODO:领取已赚取红包
		if(isLogin() && isExchanged()) {
			console.log("领取已赚取红包");
			// 领取完了之后显示
			$(".show").removeClass("show");
    		$(".exchanged-tip, .mask").addClass("show").removeClass("hide");
		}
	});

	// 点击马上登录
	$(".ligon-btn").on("click", function() {
		// TODO:跳转至登录页面
		console.log("马上登录")
	});

	// 点击遮罩层隐藏
	$(".mask").on("click", function() {
		$(".show").removeClass("show").addClass("hide")
	});

	// 点击提示关闭按钮
	$(".tip-close-button").on("click", function() {
		$(".show").removeClass("show").addClass("hide")
	});
	// 判断是否有红包领取，并做出相应的界面变化
	// return Boolean false，代表当前无红包可领取
	// true，代表当前有红包领取
	function isExchanged() {	
		var isExchanged = true;	
		$(".show").removeClass("show");
		if(isExchanged) {
			$(".mask, .exchange-tip.tip").addClass("hide").removeClass("show");
		} else {
			$(".mask, .exchange-tip.tip").addClass("show").removeClass("hide");
		}
		return isExchanged;
	}
	//判断是否超过分享人数40人，并做出相应的界面变化
	function isLimited() {
		// 判断是否登录
		var isLimited = true;
		$(".show").removeClass("show");
		if(!isLimited) {
			$(".mask, .limit-tip.tip").addClass("hide").removeClass("show");
		} else {
			$(".mask, .limit-tip.tip").addClass("show").removeClass("hide");
		}
		return isLimited;
	}

	// 判断是否登录，并做出相应的界面变化
	// TODO:判断是否登录逻辑完善
	function isLogin() {
		// 判断是否登录
		var isLogin = true;
		$(".show").removeClass("show");
		if(!isLogin) {
			$(".mask, .login-tip.tip").addClass("show").removeClass("hide");
		} else {
			$(".mask, .login-tip.tip").addClass("hide").removeClass("show");
		}
		return isLogin;
	};
	// 获取参数
	function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
	}
})();