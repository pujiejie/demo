const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const getType = require("./getType");
const uri = require('url')

// 项目服务端 静态资源 API服务器 登录接口 注册接口 新增人员

// 第一步 设计地址和请求方式 第二步 解析参数 第三步 正则验证 第四步 密码加密 第五步 数据入库
// 登录
// 第一步 设计地址和请求方式 第二布 解析参数 第三步 正则验证 第四步 去数据库对比账号 
// 数据库没有这个账号 返回一个json { status: 1, message: '账号不存在' }  
// 数据库存在这个账号 去做密码的验证 密码正确 返回前端 登录成功 送一个VIP卡 下次来打折 Token

// 购买技师 
const app = http.createServer(async (request, response) => {
    
    // 纯url 没有get参数
    let url = request.url;
    let method = request.method; // GET POST PUT DELETE
    const param = uri.parse(url, true);
    url = param.pathname;
    query = param.query;

    let extname = path.extname(url);

    if (url == '/' || url == '/index' || url == '/index.html') {
        // 返回首页
        try {
            const data = await fs.readFile(path.resolve("WWW", "index.html"));
            response.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
            response.write(data);
            response.end();
        } catch (e) {
            response.writeHead(503, { 'Content-Type': 'text/plain;charset=utf-8' });
            response.write("服务器炸了你等等在看");
            response.end();
        }
        // 静态资源的访问
    } else if (url == '/hello' && method == "GET") {
        // 解析前端参数 username password 解析出来以后 给前端返回json
        response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        response.write(JSON.stringify(query));
        response.end();
    } else if (url == '/hello' && method == "POST") {
        let contentType = request.headers["content-type"]
        let data = "";
        request.on('data', chunk => {
            data += chunk;
        })
        request.on("end", () => {
            if (contentType == "application/x-www-form-urlencoded") {
                let obj = {};
                let arr1 = data.split('&');
                arr1.forEach(item => {
                    let arr2 = item.split('=');
                    obj[arr2[0]] = arr2[1];
                })
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.write(JSON.stringify(obj));
                response.end();
            } else if (contentType == "application/json") {
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.write(data);
                response.end();
            }
        })
    } else if (extname) {
        try {
            const type = await getType(extname);
            // 你肯定要拿静态资源
            const data = await fs.readFile(path.join(__dirname, "WWW", url));
            response.writeHead(200, { 'Content-Type': type });
            response.write(data);
            response.end();
        } catch (e) {
            response.writeHead(503, { 'Content-Type': 'text/plain;charset=utf-8' });
            response.write("服务器炸了你等等在看");
            response.end();
        }
    } else {
        response.writeHead(404, { 'Content-Type': 'text/plain;charset=utf-8' });
        response.write("404 Not Found");
        response.end();
    }
})

/*


    非关系型数据库 文档 对象 { name: 10, age: 20 } { name: 10, age: 20 } { name: 1, age: 21, gender: 20 }

    API find() insert()


    关系型数据库 表 行 列 列表项
    id name age gender a address
    1 Tom 20 0 
    2 Jerry 21 1


    id u_id p_id
    1 1 1 6Byte
    2 1 1
    3 1 1

    表存储数据 细分 

    省市区
    id name
    1 陕西

    多表 用户表 收获地址 购物车 省市区

    表连接


    旧项目改新项目


    mysql 命令
        show databases;
        use 数据库名;
        show tables;
        describe 数据库名; 查询表结构

    SQL 语句

        条件
        ==
        <>
        >
        <
        >=
        <=
        and
        or


    DQL
        select * from 表名;
        select 字段1,字段2 from 表名;
    DML
        表的数据的增删改

        insert into 表(field1,field2) values(value1,value2);

        insert into user(id,username,password) values(1,"administrator","asdjgajhdgadj");
        insert into user(username,password) values("administrator","asdjgajhdgadj");

        delete from user where 字段=值;
        delete from user where id=1;

        update 表 set 字段1=新值,字段2=新值 where id=1;
        update user set username="mysql" where id=2;
    DDL
        创建数据库
            create database if not exists demo character set utf8;
        删除数据库
            drop database if exists demo;
        创建表
            create table user(
                id int(11) auto_increment primary key,
                username char(20) unique not null,
                password varchar(40) not null,
                phone int(11) unique
            )
        删除表
            drop table user;



    关系型数据库 都用的是SQL



    INT 4Bytes

    Char 定长字符串 0-255
    Varchar 变长字符串 0-65535

    DATETIME YYYY-MM-DD HH-MM-SS
    TIMESTAMP YYYY-MM-DD HH-MM-SS 可以设置为当前时间戳

    blob
    保存合同文件 0101 碳基


    字段数据类型 字段约束
                auto_increment 自增约束
                primary key 主键约束 身份证 唯一约束 非空约束
                not null 非空约束
                unique 唯一约束
                default 0 默认约束
                foreign key 外键约束

*/

app.listen(8080);
