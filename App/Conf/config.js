module.exports = {
  //配置项: 配置值
  port: 9000, //监听的端口
  db_type: 'mysql', // 数据库类型
  db_host: '127.0.0.1', // 服务器地址
  db_port: '3306', // 端口
  db_name: 'blog', // 数据库名
  db_user: 'root', // 用户名
  db_pwd: '', // 密码
  db_prefix: 'that_', // 数据库表前缀

  app_group_list: ['Home', 'Admin', 'Restful', 'Milk'], //分组列表
  deny_group_list: [],
  default_group: 'Home', //默认分组
  URL_CASE_INSENSITIVE:true
};