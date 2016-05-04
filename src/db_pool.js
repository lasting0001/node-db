/**
 * Created by jun.li on 10/30.
 */
'use strict';
var mysql = require('mysql');

function DBPool() {
    return {
        initPool: function (config) {
            var db_pool = {}, idx = 0, temp = {}, temp_pool;
            for (var key in config) {
                (++idx === 1) && (config.default_db = key);
                temp = config[key];
                temp_pool = mysql.createPool(temp);
                temp && (db_pool[key] = temp_pool);
                temp && (db_pool[idx - 1] = temp_pool);
            }
            return db_pool;
        },
        getConnection: function (config) {
            return mysql.createConnection(config);
        }
    }
}

module.exports = DBPool();
