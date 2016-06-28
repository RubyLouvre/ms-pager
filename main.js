var avalon = require('avalon2')
require('./index')
avalon.define({
    $id: 'test'
})

module.exports = avalon //注意这里必须返回avalon,用于webpack output配置

