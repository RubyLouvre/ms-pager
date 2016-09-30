
var avalon = require('avalon2')
require('./style.scss')
avalon.component('ms-pager', {
    template: require('./template.icon.html'),
    defaults: {
        getHref    : function (a) {
            return '#page-' + this.toPage(a)
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
        totalPages : 15,
        currentPage: 1,
        firstText  : 'First',
        prevText   : 'Previous',
        nextText   : 'Next',
        lastText   : 'Last',
        onPageClick: avalon.noop,
        toPage     : function (p) {
            var cur = this.currentPage;
            var max = this.totalPages;
            switch (p) {
                case 'first':
                    return 1
                case 'prev':
                    return Math.max(cur - 1, 1)
                case 'next':
                    return Math.min(cur + 1, max)
                case 'last':
                    return max
                default:
                    return p
            }
        },
        
        cbProxy: function (e, p) {
            var cur = this.toPage(p);
            this.render(cur);
            if (this.$buttons[p] || p === this.currentPage) { // 调整顺序然页码正常显示
                e.preventDefault()
                return //disabled, active不会触发
            }
            return this.onPageClick(e, cur);
        },
        render : function (cur) {
            var obj = getPages.call(this, cur)
            console.log(obj);
            
            
            var that = this;
            setTimeout(function () { // 修复
                that.currentPage = obj.currentPage;
                that.pages = obj.pages;
            }, 4)
        },
        rpage  : /(?:#|\?)page\-(\d+)/,
        onInit : function () {
            var cur = this.currentPage
            var match = this.rpage && location.href.match(this.rpage)
            if (match && match[1]) {
                var cur = ~~match[1]
                if (cur < 0 || cur > this.totalPages) {
                    cur = 1
                }
            }
            var that = this
            this.$watch('totalPages', function () {
                setTimeout(function () {
                    that.render(that.currentPage)
                }, 4)
            })
            this.cbProxy(window.event, cur);
            console.log(cur);
        }
    }
})
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
//https://github.com/brantwills/Angular-Paging