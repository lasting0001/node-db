/**
 * Created by jun.li on 10/30.
 */
'use strict';
var db_pool = require('./db_pool');

function NodeDBShell(config) {
    var config_local = config;
    var pool = db_pool.initPool(config_local);
    var NodeDB = function () {
        return {
            query: function (sql, callBack, params) {
                params = params || {};
                callBack = callBack || function (results, params) {
                        console.error('dbQuery 无回调方法sql：' + sql);
                    };
                var db_pool_name = params.db_pool_name || config_local.default_db;
                if (!sql) {
                    console.error('Util dbQuery sql参数错误:' + sql + ',db_pool_name:' + db_pool_name);
                    callBack(null, params);
                    return;
                }
                params.sql = sql;
                var db_pool = pool[db_pool_name];
                if (!db_pool) {
                    console.error('Util dbQuery 连接池错误 db_pool:' + db_pool);
                    callBack(null, params);
                    return;
                }
                db_pool.getConnection(function (err, conn) {
                    if (err) {
                        console.error('getConnection error,sql:' + sql + ':', err);
                        callBack(null, params);
                        return;
                    }
                    var query = conn.query(sql, params.columns || [], function (err, results) {
                        conn.release();
                        if (err) {
                            console.error('query error,sql:' + sql + ':', err);
                            callBack(null, params);
                            return;
                        }
                        callBack(results, params);
                    });
                    console.log(query.sql);
                });
            },
            batch: function (sqls, callBack, params) {
                params = params || {};
                callBack = callBack || function (results, params) {
                        console.error('dbBatch 无回调方法sql：' + sql);
                    };
                if (!sqls || sqls.length == 0) {
                    return callBack(null);
                }
                if (typeof sqls === 'string') {
                    sqls = [sqls];
                }
                var columns = params.columns || [];
                var db_pool_name = params.db_pool_name || config_local.default_db;
                callBack = callBack || function (results, params) {
                    };
                var conn = db_pool.getConnection(config_local[db_pool_name]);
                conn && conn.beginTransaction(function (err) {
                    if (err) {
                        conn.destroy();
                        console.error('beginTransaction', err);
                        return callBack(null);
                    }
                    for (var i = 0, len = columns.length; i < len; i++) {
                        if (conn.destroyed) {
                            break;
                        }
                        conn.query(sqls[i] || sqls[0], columns[i] || [], function (err, results) {
                            if (err) {
                                conn.rollback();
                                conn.destroy();
                                console.error('query', err);
                                callBack(null);
                            }
                        });
                    }
                    conn.destroyed || conn.commit(function (err) {
                        if (err) {
                            conn.rollback();
                            conn.destroy();
                            console.error('commit', err);
                            return callBack(null);
                        }
                        conn.destroy();
                        callBack(true);
                    });
                });
            },
            end: function () {
                for (var key in pool) {
                    pool[key].end();
                }
            },
            restart: function (config) {
                this.end();
                pool = db_pool.initPool(config || config_local);
            }
        }
    };

    return new NodeDB();
}


module.exports = NodeDBShell;