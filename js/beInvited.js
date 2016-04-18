(function() {
	FastClick.attach(document.body);

	// 查看活动规则
	$(".rule-btn").on('click', function() {
		$(".rule").addClass("show-rule").removeClass("hide-rule");
	});

	// 隐藏活动规则
	$(".hide-rule-btn").on('click', function() {
		$(".rule").addClass("hide-rule").removeClass("show-rule");
	});

	// 监听手机号码的输入
	$(".exchange-phone").on('input', function(e) {
		var event = e || window.event;
		var currentTarget = $(e.currentTarget);
		var phoneNum = currentTarget.val();
		if (phoneNum.length == 11) {
			// TODO:检查手机号码是否注册过，或者领取过
			var status = "";
			uiSetPhoneStatus(status);
		}
	});

	// 领取红包
	$(".exchange-btn").on('click', function() {
		// TODO:领取已赚取红包
		var descriptionEl = $(".exchange-description");
		var phoneNum = $(".exchange-phone").val(); //手机号码
		var pwd = $(".password-input").val(); //密码
		var imgCode = $(".img-code-input").val(); //图形验证码
		var messageCode = $(".message-code-input").val(); //短信验证码
		var pwdRex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/; //密码正则
		if (checkPhoneNum(phoneNum)) { //号码有效
			// TODO:判断号码的状态
			var status = "";
			if (uiSetPhoneStatus(status)) { //号码未注册
				if (pwd.trim().match(pwdRex)) {
					if (imgCode.trim() !== "" && messageCode.trim() !== "") {
						$(".mask, .exchange-tip.tip").addClass("show").removeClass("hide");
						console.log("领取红包");
					} else {
						descriptionEl.addClass("show").removeClass("hide").html("请完善领取信息");
						alert("请完善领取信息")
					}
				} else {
					descriptionEl.addClass("show").removeClass("hide").html("请输入正确的密码格式");
					alert("请输入正确的密码格式")
				}
			}
		} else {
			descriptionEl.addClass("show").removeClass("hide").html("号码有误，请重新输入");
			alert("号码有误，请重新输入")
		}
	});

	// 点击切换图形验证码
	$(".img-code-img").on("click", function() {
		console.log("切换图形验证码")
	});

	// 点击获取手机短信验证码
	$(".get-message-code").on("click", function() {
			console.log("获取手机短信验证码")
		})
		// 点击马上领取
	$(".registe-btn").on("click", function() {
		// TODO:跳转至领取页面
		console.log("马上领取")
	});

	// 分享给好友
	$(".share-btn").on("click", function() {
		inviteFriend();
	});

	// 分享
	function inviteFriend() {

		$(".show").removeClass("show");
		$(".share, .mask").addClass("show").removeClass("hide");

	}

	// 点击遮罩层隐藏
	$(".mask").on("click", function() {
		$(".show").removeClass("show").addClass("hide")
	});

	// 点击提示关闭按钮
	$(".tip-close-button").on("click", function() {
		$(".show").removeClass("show").addClass("hide")
	});

	// 根据该手机号码领取与否的状态，修改界面
	function uiSetPhoneStatus(status) {
		var descriptionEl = $(".exchange-description");
		var registeAreaDomEl = $(".registe-area");
		if (status == "exchanged") { //已经兑换
			descriptionEl.addClass("show").removeClass("hide").html("每个用户只能领取一次");
			$(".registe-area").css({
				"display": " none"
			});
			return false;
		} else if (status == "registed") { //已经注册
			descriptionEl.addClass("show").removeClass("hide").html("该红包只有新用户才能领取哦");
			$(".registe-area").css({
				"display": " none"
			});
			return false;
		} else {
			descriptionEl.addClass("hide").removeClass("show");
			$(".registe-area").css({
				"display": " block"
			});
			return true;
		}
	}
	// 检查手机号码正则
	function checkPhoneNum(phoneNum) {
		var patTel = new RegExp("^(13|14|15|17|18)[0-9]{9}$", "i");
		if (!phoneNum.match(patTel)) {
			return false;
		} else {
			return true;
		}
	}
})();