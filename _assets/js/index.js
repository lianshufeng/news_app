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
    $("#newsMain").find('li').remove();


    /**
     * 载入新闻
     * @param title
     * @param url
     * @returns {Promise<unknown>}
     */
    let loadNews = function (title, url) {
        return new Promise((resolve, reject) => {
            console.log('加载 : ' + title);
            $("#newsMain").append('<li data-role="list-divider">' + title + '</li>')

            $.ajax({
                url: url,
                dataType: "json",
                method: 'GET',
                crossDomain: true,
            }).then(function (response) {
                for (let i in response['ret']) {
                    let item = response['ret'][i];
                    let html = '<li><a href="#">' + item.title + '</a></li>';
                    $("#newsMain").append(html);
                }
                //刷新，重新加载样式
                $("#newsMain").listview("refresh");
                resolve();
            });
        })
    }


    //载入新闻
    loadNews('微博', apiHost + '/news/weibo')
        .then(() => {
            return loadNews('百度', apiHost + '/news/weibo')
        })
        .then(() => {
            return loadNews('知乎', apiHost + '/news/zhihu')
        })
        .then(() => {
            return loadNews('搜狗', apiHost + '/news/sogou')
        })


});