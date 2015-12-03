/**
 * Created by jun.li on 10/30.
 */
'use strict';
var mysql = require('mysql');

function DBPool() {
    //var env = process.env.NODE_ENV || "development";
    return {
        initPool: function (config) {
            var db_pool = {}, idx = 0;
            for (var key in config) {
                (++idx === 1) && (config.default_db = key);
                var temp = config[key];
                //var temp = config[key][env];
                temp && (db_pool[key] = mysql.createPool(temp));
            }
            return db_pool;
        },
        getConnection: function (config) {
            return mysql.createConnection(config);
        }
    }
}

module.exports = DBPool();
