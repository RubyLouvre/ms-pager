var webpack = require('webpack');

var path = require('path');
var fs = require('fs');

fs.readFile('./node_modules/avalon2/dist/avalon.modern.js', function(e, data){
    fs.writeFile('./dist/avalon.js', data)
})

function heredoc(fn) {
    return fn.toString().replace(/^[^\/]+\/\*!?\s?/, '').
            replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><')
}
var api = heredoc(function () {
    /*
     avalon的分页组件
    getHref: 生成页面的href
    getTitle: 生成页面的title
    showPages: 5 显示页码的个数
    totalPages: 15, 总数量 
    currentPage: 1, 当前面
    firstText: 'First',
    prevText: 'Previous',
    nextText: 'Next',
    lastText: 'Last',
    onPageClick: 点击页码的回调
     
     使用
     兼容IE6-8
     ```
     <wbr ms-widget="[{is:'ms-pager'}, @config]"/>
     ```
     只支持现代浏览器(IE9+)
     ```
     <ms-pager ms-widget="@config">
     </ms-pager>
     ```   
     */
})
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var cssExtractor = new ExtractTextPlugin('/[name].css');

module.exports = {
    entry: {
        index: './main'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'ms_pager'
    }, //页面引用的文件
    plugins: [
        new webpack.BannerPlugin('分页 by 司徒正美\n' + api)
    ],
  //排除不处理的目录
    module: {
        loaders: [
            //http://react-china.org/t/webpack-extracttextplugin-autoprefixer/1922/4
            // https://github.com/b82/webpack-basic-starter/blob/master/webpack.config.js 
            {test: /\.html$/, loader: 'raw!html-minify'},
            {test: /\.scss$/, loader: cssExtractor.extract( 'css!sass')},
            {test: /\.(ttf|eot|svg|woff2?)((\?|#)[^\'\"]+)?$/, loader: 'file-loader?name=[name].[ext]'}


        ]
    },
    'html-minify-loader': {
        empty: true, // KEEP empty attributes
        cdata: true, // KEEP CDATA from scripts
        comments: true, // KEEP comments
        dom: {// options of !(htmlparser2)[https://github.com/fb55/htmlparser2]
            lowerCaseAttributeNames: false, // do not call .toLowerCase for each attribute name (Angular2 use camelCase attributes)
        }
    },
    plugins: [
        cssExtractor
    ],
    resolve: {
        extensions: ['.js', '', '.css']
    }
}

