(function(root) {
  if (typeof root !== 'undefined' && (root.jQuery || root.Zepto || root.$)) {
    var Router = function() {
      // TODO:先不考虑页面id
      this.state = window.sessionStorage;
      var stateid = this.state.getItem("stateid");
      this.state.setItem("stateid", stateid || 1);
      this.state.setItem("currentStateID", this.state.getItem("currentStateID") || stateid);
      this.init();
      this.xhr = null;
    };

    Router.prototype.init = function() {
      var id = this.genStateID(),
        curUrl = location.href,
        // 需要设置入口页的Url，方便用户在类似xx/yy#step2 的页面刷新加载后 点击后退可以回到入口页
        entryUrl = curUrl.split('#')[0];

      // 在页面加载时，可能会包含一个非空的状态对象history.state。这种情况是会发生的，例如，如果页面中使用pushState()或replaceState()方法设置了一个状态对象，然后用户重启了浏览器。https://developer.mozilla.org/en-US/docs/Web/API/History_API#Reading_the_current_state
      history.replaceState({
        url: curUrl,
        id: id
      }, '', curUrl);
      this.setCurrentStateID(id);

      // 监听页面切换
      window.addEventListener('popstate', $.proxy(this.onpopstate, this));
    };

    //加载一个页面,传入的参数是页面id或者url
    Router.prototype.navigate = function(url, stateId) {

      // android chrome 在移动端加载页面时不会触发一次‘popstate’事件
      // this.newLoaded && (this.newLoaded = false);
      this.getPage(url, function(page) {
        var currentPageList = this.getCurrentPage();
        // 防止点击过快页面无法加载bug
        if (currentPageList.length == 0) {
          this.dispatch("pageLoadCancel");
          return;
        }

        currentPageList.parent().prepend(page);
        // 注释动画，直接删除旧页面
        /*var oldPage = currentPageList.eq(currentPageList.length -1);
        var currentStateId = this.state.getItem("currentStateID") || 1;
        this.animatePages(oldPage, page, (currentStateId > stateId));*/
        setTimeout(function() { //防止白屏
          currentPageList.removeClass("page-current")
            // page.trigger("pageAnimationStart", [page[0].id, page]);
            // page.trigger("pageAnimationEnd", [page[0].id, page]);
            // page.trigger("pageInitInternal", [page[0].id, page]);

          currentPageList.remove();
        }, 0)

        var id = "";
        if (stateId) { //如果stateId存在，就说明是back or forward 的页面
          id = stateId;
        } else { //新页面
          id = this.genStateID();
          this.pushState(url, id);
        }

        this.setCurrentStateID(id);

      });
    };

    //加载一个页面,传入的参数是页面id或者url， 无状态页面加载
    /*Router.prototype.navigateNotState = function(url, stateId) {
      // android chrome 在移动端加载页面时不会触发一次‘popstate’事件
      // this.newLoaded && (this.newLoaded = false);
      this.getPage(url, function(page) {
        var currentPageList = this.getCurrentPage();
        // 防止点击过快页面无法加载bug
        if (currentPageList.length == 0) {
          this.dispatch("pageLoadCancel");
          return;
        }
        // 将空白页面拼接到原页面后面节点，防止白屏
        page.insertAfter($(".page")[0]);
        var currentStateId = this.state.getItem("currentStateID") || 1;
        var curPageClass = 'page-current';
        var animPageClasses = [
          'page-from-center-to-left',
          'page-from-center-to-right',
          'page-from-right-to-center',
          'page-from-left-to-center'
        ].join(' ');
        // 无动画切换

        page.removeClass(animPageClasses).addClass(curPageClass).hide();

      });
    };*/

    /**
     * 页面转场效果
     *
     * 首先给要移入展示的页面添加上当前页面标识（page-current），要移出展示的移除当前页面标识；
     * 然后给移入移除的页面添加上对应的动画 class，动画结束后清除动画 class 并发送对应事件。
     *
     * 注意，不能在动画后才给移入展示的页面添加当前页面标识，否则，在快速切换的时候将会因为没有 .page-current
     * 的页面而报错（具体来说是找这类页面的 id 时报错，目前并没有确保 id 查找的健壮性）
     *
     * @param leftPage 从效果上看位于左侧的页面，jQuery/Zepto 对象
     * @param rightPage 从效果上位于右侧的页面，jQuery/Zepto 对象
     * @param {Boolean} leftToRight 是否是从左往右切换（代表是后退），默认是相当于 false
     */
    /*Router.prototype.animatePages = function(leftPage, rightPage, leftToRight) {
      var curPageClass = 'page-current';
      var animPageClasses = [
        'page-from-center-to-left',
        'page-from-center-to-right',
        'page-from-right-to-center',
        'page-from-left-to-center'
      ].join(' ');

      if (!leftToRight) {
        // 新页面从右侧切入
        rightPage.trigger("pageAnimationStart", [rightPage[0].id, rightPage]);
        setTimeout(function() {
          leftPage.removeClass(animPageClasses).removeClass(curPageClass).addClass('page-from-center-to-left');
          rightPage.removeClass(animPageClasses).addClass(curPageClass).addClass('page-from-right-to-center');
          leftPage.animationEnd(function() {
            leftPage.remove(); //删除旧页面
            leftPage.removeClass(animPageClasses);
          });
          rightPage.animationEnd(function() {
            rightPage.removeClass(animPageClasses);
            rightPage.trigger("pageAnimationEnd", [rightPage[0].id, rightPage]);
            rightPage.trigger("pageInitInternal", [rightPage[0].id, rightPage]);
          });
        }, 0)
      } else {
        rightPage.trigger("pageAnimationStart", [rightPage[0].id, rightPage]);
        setTimeout(function() {
          rightPage.removeClass(animPageClasses).addClass(curPageClass).addClass('page-from-left-to-center');
          leftPage.removeClass(animPageClasses).removeClass(curPageClass).addClass('page-from-center-to-right');
          rightPage.animationEnd(function() {
            rightPage.removeClass(animPageClasses);
            rightPage.trigger("pageAnimationEnd", [rightPage[0].id, rightPage]);
            rightPage.trigger("pageReinit", [rightPage[0].id, rightPage]);
          });
          leftPage.animationEnd(function() {
            leftPage.remove(); //删除旧页面
            leftPage.removeClass(animPageClasses);
          });
        }, 0)
      }



    };*/

    Router.prototype.getCurrentPage = function() {
      return $(".page-current");
    };

    Router.prototype.pushState = function(url, id) {
      // 获取完整的路径
      var jsReg = /javascript:/g;
      if (jsReg.test(url)) {
        url = eval(url);
      }

      history.pushState({
        url: getAbsoluteUrl(url),
        id: id
      }, '', url);
    };

    Router.prototype.onpopstate = function(d) {

      var state = d.state;
      //刷新再后退导致无法取到state
      if (!state) {
        return;
      }

      if (state.id === this.getCurrentStateID()) {
        return false;
      }

      this.navigate(state.url, state.id);

    };

    //根据url获取页面的DOM，如果是一个内联页面，则直接返回，否则用ajax加载
    Router.prototype.getPage = function(url, callback) {
      if (url[0] === "#") return callback.apply(this, [$(url)]);

      this.dispatch("pageLoadStart");

      if (this.xhr && this.xhr.readyState < 4) {
        this.xhr.onreadystatechange = function() {};
        this.xhr.abort();
        this.dispatch("pageLoadCancel");
      }

      var self = this;

      this.xhr = $.ajax({
        url: url,
        success: function(data, s, xhr) {
          var $page = self.parseXHR(xhr);

          callback && callback.apply(self, [$page]);
        },
        error: function() {
          self.dispatch("pageLoadError");
        },
        complete: function() {
          self.dispatch("pageLoadComplete");
        }
      });
    };

    Router.prototype.parseXHR = function(xhr) {
      var html = '';
      var response = xhr.responseText;
      var matches = response.match(/<body[^>]*>([\s\S.]*)<\/body>/i);
      if (matches) {
        html = matches[1];
      } else {
        html = response;
      }
      // html = response;
      html = "<div>" + html + "</div>";
      var tmp = $(html);

      var $page = tmp.find(".page");
      if (!$page[0]) $page = tmp.addClass("page");
      return $page;
    };

    Router.prototype.genStateID = function() {
      var stateid = parseInt(this.state.getItem("stateid"));
      var id = (isNaN(stateid) ? 0 : stateid) + 1;
      // var id = parseInt(this.state.getItem("stateid")) + 1;
      this.state.setItem("stateid", id);
      return id;
    };

    Router.prototype.getCurrentStateID = function() {
      return parseInt(this.state.getItem("currentStateID"));
    };

    Router.prototype.setCurrentStateID = function(id) {
      this.state.setItem("currentStateID", id);
    };

    Router.prototype.dispatch = function(event) {
      var e = new CustomEvent(event, {
        bubbles: true,
        cancelable: true
      });

      window.dispatchEvent(e);
    };

    // 初始化路由
    var router = window.Router = new Router();
    // 拦截a标签，除了.external以外的
    $(document).on("click", "a", function(e) {
      var $target = $(e.currentTarget);
      var url = $target.attr("href");
      if (!url || url === "#") return;
      url = getAbsoluteUrl(url); //将其变成绝对路径
      if (url.indexOf(location.origin) > -1) { //非外部路径
        if ($target.hasClass("external") ||
          $target[0].hasAttribute("external")
        ) return;
        e.preventDefault();
        router.navigate(url);
      } else { //外部路径，发射事件
        $target.trigger('clickOuterPage', e);
      }
    });

    //将相对路径变成绝对路径
    function getAbsoluteUrl(url) {
      // 获取完整的路径
      var jsReg = /javascript:/g;
      if (jsReg.test(url)) {
        url = eval(url);
      }
      var a = document.createElement('A');

      a.href = url; // 设置相对路径给a, 此时不会发送出请求

      url = a.href; // 此时相对路径已经变成绝对路径

      return url;
    }
  } else { //正常跳转
    
  }

})(window);