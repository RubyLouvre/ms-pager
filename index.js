
var avalon = require('avalon2')
require('./style.scss')
avalon.component('ms-pager', {
    template: require('./template.html'),
    defaults: {
        getHref: function (a) {
            return '#page-' + this.toPage(a)
        },
        getTitle: function (title) {
            return title
        },
        isDisabled: function (name, page) {
            return this.$buttons[name] = (this.currentPage === page)
        },
        $buttons: {},
        showPages: 5,
        pages: [],
        totalPages: 15,
        currentPage: 1,
        firstText: 'First',
        prevText: 'Previous',
        nextText: 'Next',
        lastText: 'Last',
        onPageClick: avalon.noop,
        toPage: function (p) {
            var cur = this.currentPage
            var max = this.totalPages
            switch (p) {
                case 'first':
                    return 1
                case 'prev':
                    return Math.max(cur - 1, 0)
                case 'next':
                    return Math.min(cur + 1, max)
                case 'last':
                    return max
                default:
                    return p
            }
        }, 

        cbProxy: function (e, p) {
            if (this.$buttons[p] || p === this.currentPage) {
                e.preventDefault()
                return //disabled, active不会触发
            }
            var cur = this.toPage(p)
            this.render(cur)
            return this.onPageClick(e, p)
        },
        render: function(cur){
            var obj = getPages.call(this, cur)
            this.pages = obj.pages
            this.currentPage = obj.currentPage
        },
        rpage: /(?:#|\?)page\-(\d+)/,
        onInit: function () {
            var cur = this.currentPage
            var match = this.rpage && location.href.match(this.rpage)
            if (match && match[1]) {
                var cur = ~~match[1]
                if (cur < 0 || cur > this.totalPages) {
                    cur = 1
                }
            }
            var that = this
            this.$watch('totalPages', function(){
                setTimeout(function(){
                    that.render(that.currentPage)
                },4)
            })
            this.render(cur)
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
        end = s;
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