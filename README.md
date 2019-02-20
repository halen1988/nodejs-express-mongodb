# 使用说明

## 启动

* 单机调试

```bash
node web/app.js
```
如果要加运行环境变量调试，则：
```bash
export profile=dev && node web/app.js
```

* 集群模式

```bash
node run.js -e dev -p 8888 -n 4
```
其中-e是运行环境，-p是运行端口， -n是集群节点数

##  目录说明

* lib目录放通用类库
* logs目录存放日志
* processer存放非web应用脚本，预留的目录
* test目录存放测试脚本
* web目录存放web项目
* settings-X.json 分别为开发、测试、生产环境的配置文件，集群运行时用-e来区分环境，各种环境下的配置可以不同
* run.js为启动文件

### web目录的说明

* public目录存放静态文件，里面的文件可以直接访问，例如：/js/jquery-3.2.1.min.js, 注意：目录前不需要加public。
* routes目录存放控制层文件，用法见[expressjs](https://expressjs.com/en/starter/basic-routing.html) 官网及本项目的demo。
* views目录存放模板文件，模板是EJS, 文件为html文件，用法参考[ejs](http://ejs.co/)官网说明及本项目demo。
