$(document).on("pagecreate", ".jqm-demos", function (event) {
    var search,
        page = $(this),
        that = this,
        searchUrl = ($(this).hasClass("jqm-home")) ? "_search/" : "../_search/",
        searchContents = $(".jqm-search ul.jqm-list").find("li:not(.ui-collapsible)"),
        version = $.mobile.version || "dev",
        words = version.split("-"),
        ver = words[0],
        str = words[1] || "",
        text = ver;

    // Insert jqm version in header
    if (str.indexOf("rc") == -1) {
        str = str.charAt(0).toUpperCase() + str.slice(1);
    } else {
        str = str.toUpperCase().replace(".", "");
    }

    if ($.mobile.version && str) {
        text += " " + str;
    }

    $(".jqm-version").html(text);

    // Global navmenu panel
    $(".jqm-navmenu-panel ul").listview();

    $(document).on("panelopen", ".jqm-search-panel", function () {
        $(this).find("input").focus();
    })

    $(".jqm-navmenu-link").on("click", function () {
        page.find(".jqm-navmenu-panel:not(.jqm-panel-page-nav)").panel("open");
    });

    // Turn off autocomplete / correct for demos search
    $(this).find(".jqm-search input").attr("autocomplete", "off").attr("autocorrect", "off");

    // Global search
    $(".jqm-search-link").on("click", function () {
        page.find(".jqm-search-panel").panel("open");
    });

    // Initalize search panel list and filter also remove collapsibles
    $(this).find(".jqm-search ul.jqm-list").html(searchContents).listview({
        inset: false,
        theme: null,
        dividerTheme: null,
        icon: false,
        autodividers: true,
        autodividersSelector: function (li) {
            return "";
        },
        arrowKeyNav: true,
        enterToNav: true,
        highlight: true,
        submitTo: searchUrl
    }).filterable();

    // Initalize search page list and remove collapsibles
    $(this).find(".jqm-search-results-wrap ul.jqm-list").html(searchContents).listview({
        inset: true,
        theme: null,
        dividerTheme: null,
        icon: false,
        arrowKeyNav: true,
        enterToNav: true,
        highlight: true
    }).filterable();

    // Fix links on homepage to point to sub directories
    if ($(event.target).hasClass("jqm-home")) {
        $(this).find("a").each(function () {
            $(this).attr("href", $(this).attr("href").replace("../", ""));
        });
    }

    // Search results page get search query string and enter it into filter then trigger keyup to filter
    if ($(event.target).hasClass("jqm-demos-search-results")) {
        search = $.mobile.path.parseUrl(window.location.href).search.split("=")[1];
        setTimeout(function () {
            e = $.Event("keyup");
            e.which = 65;
            $(that).find(".jqm-content .jqm-search-results-wrap input").val(search).trigger(e).trigger("change");
        }, 0);
    }
});


/**
 * 加载新闻
 * @param title
 * @param url
 */


/**
 * 载入新闻
 */
$(document).on("pagecreate", function () {

    //主机地址
    const apiHost = 'https://api.dzurl.top';

    //初始化
    $("#newsMain").find('#item_div').hide();


    /**
     * 载入新闻
     * @param title
     * @param url
     * @returns {Promise<unknown>}
     */
    let loadNews = function (type, url, page) {
        return new Promise((resolve, reject) => {
            console.log('load -> ', type);
            $('#item_parent').clone().removeAttr('id').text(type).appendTo($("#newsMain"))

            $.ajax({
                url: url,
                dataType: "json",
                method: 'POST',
                crossDomain: true,
            }).then(function (response) {
                for (let i in response['ret']) {
                    let item = response['ret'][i];

                    //子项
                    let child = $('#item_children').clone().removeAttr('id');

                    //修改a的标题
                    let a = child.find('a');
                    a.text(item.title);
                    a.data('url', item.url);
                    a.data('title', item.title);
                    a.data('type', type);
                    a.data('page', page);

                    child.appendTo($("#newsMain"))

                }
                //刷新，重新加载样式
                $("#newsMain").listview("refresh");
                resolve();
            });
        })
    }


    //当前设备是否手机
    let isMobile = navigator.userAgent.match(/mobile/i);


    //载入新闻
    loadNews('微博', apiHost + '/news/weibo', 'https://s.weibo.com/weibo?Refer=new_time&q=')
        .then(() => {
            return loadNews('百度', apiHost + '/news/baidu', isMobile ? 'https://wap.baidu.com/s?word=' : 'https://www.baidu.com/s?wd=');
        })
        .then(() => {
            return loadNews('知乎', apiHost + '/news/zhihu', 'https://www.zhihu.com/search?type=content&q=');
        })
        .then(() => {
            return loadNews('搜狗', apiHost + '/news/sogou', isMobile ? 'https://wap.sogou.com/web/searchList.jsp?keyword=' : 'https://www.sogou.com/web?query=');
        })
        .then(() => {
            // 监视所有的按钮
            $('#newsMain').find('a').click((event) => {
                //取出当前的a
                let me = $(event.currentTarget);
                //取出标题并编码
                let keyWord = encodeURI(me.data('title'));
                let page = me.data('page');
                let url = page + keyWord;
                let type = me.data('type');

                if (type == '知乎') {
                    window.open(url)
                } else {
                    //修改将要弹出的页面
                    let iframe = $('#popup_webpage').find('iframe');
                    iframe.attr('src', url);
                    iframe.attr('height', $(window).height() * 0.8);
                    iframe.attr('width', $(window).width() * 0.8);
                    //触发弹出页面
                    $("#popup_btn").click()
                }
            });
        })


});
