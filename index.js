var avalon = require('avalon2')
require('./style.scss')
function getHashStr(name) {
    var url = location.hash; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?")) {
        var str = url.substr(url.indexOf("?") + 1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest[name];
}
function getPages(currentPage) {
    var pages = []
    var s = this.showPages
    var total = this.totalPages
    var half = Math.floor(s / 2)
    var start = currentPage - half + 1 - s % 2
    var end = currentPage + half
    
    // handle boundary case
    if (start <= 0) {
        start = 1;
        end = s > total ? total : s;
    }
    if (end > total) {
        start = total - s + 1
        end = total
    }
    
    var itPage = start;
    while (itPage <= end) {
        pages.push(itPage)
        itPage++
    }
    
    return {currentPage: currentPage, pages: pages};
}
avalon.component('ms-pager', {
    template: require('./template.icon.html'),
    defaults: {
        /*默认ID*/
        $id        : 'ms-pager',
        /**
         * 配置复杂型单页
         * 默认为false
         * 如#/page=2
         * hash配置子页，后面还需配置分页信息时启用
         * 如#/game?page=2
         * 表示单页应用进入子页面game页,当前页为2
         * */
        is_more    : false,
        getHref    : function (a) {
            if (this.is_more) {
                if (location.hash) {
                    var search = location.hash,
                        page   = getHashStr('page');
                    if (page) { // 存在就替换
                        search = search.replace('page=' + page, 'page=' + this.toPage(a));
                        return search;
                    }
                    else { // 不存在就叠加
                        return location.hash + '?page=' + this.toPage(a)
                    }
                }
                else {
                    return '#?page=' + this.toPage(a)
                }
            }
            else {
                return '#page-' + this.toPage(a)
            }
        },
        getTitle   : function (title) {
            return title
        },
        isDisabled : function (name, page) {
            return this.$buttons[name] = (this.currentPage === page)
        },
        $buttons   : {},
        showPages  : 5,
        pages      : [],
        totalPages : 1,
        currentPage: 1,
        firstText  : '首页',
        prevText   : '上一页',
        nextText   : '下一页',
        lastText   : '最后一页',
        onPageClick: avalon.noop,
        toPage     : function (p) {
            var cur = this.currentPage
            var max = this.totalPages
            switch (p) {
                case 'first':
                    return 1
                case 'prev':
                    return Math.max(cur - 1, 1)/*从第一页开始*/
                case 'next':
                    return Math.min(cur + 1, max)
                case 'last':
                    return max
                default:
                    return p
            }
        },
        
        cbProxy: function (e, p) {
            var that = this;
            /**
             * 最关键修复
             * 延迟页码变更，
             * 防止当pages改变时，
             * 导致点击href不一致
             * */
            setTimeout(function () {
                var cur = that.toPage(p);
                if (that.$buttons[p] || p === that.currentPage) {
                    if (cur === 1) {
                        return that.onPageClick(e, cur);
                    }
                    e.preventDefault()
                    return //disabled, active不会触发
                }
                that.render(cur);
                return that.onPageClick(e, cur);
            }, 4)
        },
        render : function (cur) {/*更新页码*/
            var obj = getPages.call(this, cur);
            this.currentPage = obj.currentPage;
            this.pages = obj.pages;
        },
        /*此处供正常单页应用*/
        rpage  : function () {
            return this.is_more ? /(?:#|\?)page\=(\d+)/ : /(?:#|\?)page\-(\d+)/;
        },
        cur    : function () { /*正确获取匹配页码*/
            var cur = this.currentPage;
            var match = this.rpage && location.href.match(this.rpage());
            if (match && match[1]) {
                var cur = ~~match[1]
                if (cur < 0 || cur > this.totalPages) {
                    cur = 1
                }
            }
            return cur;
        },
        onInit : function () {
            var that = this;
            this.$watch('totalPages', function () {
                /**复杂单页应用，切换选项卡，重置页码
                 * 但切换选项卡或者数据页数变化时，重置页码
                 * */
                that.render(that.cur())
            });
            this.$watch('currentPage', function () {
                /**复杂单页应用，切换选项卡，重置页码
                 * 切换选项卡，从页码1开始
                 * */
                that.render(that.cur());
            });
            /*进入页面预载入页码*/
            that.render(that.cur());
        }
    }
})



//https://github.com/brantwills/Angular-Paging
