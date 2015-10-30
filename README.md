# cache4js
Single sql、one sql batch params and batch sql batch params execute for nodejs.

##How to use ?   
1、install  
npm install node-db   
2、use
````javascript
'use strict';
var config = {
    "5miao_game_master": {
        "development": {
            "host": "xxx",
            "port": 3306,
            "database": "xxx",
            "user": "xxx",
            "password": "xxx",
            "connectionLimit": 10
        },
        "test": {
        },
        "production": {
        }
    },
    "test": {
        "development": {
            "host": "xxx",
            "port": 3306,
            "database": "test",
            "user": "xxx",
            "password": "xxx",
            "connectionLimit": 10
        },
        "test": {
        },
        "production": {
        }
    }
};
var db = require('node-db')(config);

// single sql execute
db.query('select * from test_1 limit 1;', function (results) {
    console.log(results);
});

// one sql batch params
db.batch('update test_1 set str = ? where id = ?;', function (results) {
    console.log(results);
}, {db_pool_name: 'test', columns: [['q', 1], ['w', 2]]});

// batch sql batch params
var sqls = ['update test_2 set date = ?;','update test_3 set num = ?;'];
db.batch(sqls, function (results) {
    console.log(results);
}, {db_pool_name: 'test', columns: [['2015-10-30'], [999]]});
````
For more details,please refer to the code.   
   
   
## Contributing   
Contributions welcome   
   
## License   
The original cache4js was distributed under the Apache 2.0 License, and so is this. I've tried to   
keep the original copyright and author credits in place, except in sections that I have rewritten   
extensively.   
   
