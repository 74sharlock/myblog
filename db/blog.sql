/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50520
Source Host           : localhost:3306
Source Database       : blog

Target Server Type    : MYSQL
Target Server Version : 50520
File Encoding         : 65001

Date: 2015-08-18 13:25:48
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `that_article`
-- ----------------------------
DROP TABLE IF EXISTS `that_article`;
CREATE TABLE `that_article` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `author` varchar(255) NOT NULL DEFAULT '0',
  `createtime` varchar(255) NOT NULL,
  `modifytime` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of that_article
-- ----------------------------
INSERT INTO `that_article` VALUES ('1', 'sharlock', '1434711545123', '1434711545123', '12121', '23423423423', '342342');
INSERT INTO `that_article` VALUES ('2', 'sharlock', '1434711816136', '1434711816136', '这是一个主标题', '这是内容,这是内容,这是内容,这是内容,这是内容,这是内容,这是内容,这是内容,这是内容,这是内容,', '这是副标题');
INSERT INTO `that_article` VALUES ('3', 'sharlock', '1434711852187', '1434711852187', '阿斯顿和骄傲的哭', '收费水电费谁电风扇', '谁打的');
INSERT INTO `that_article` VALUES ('4', 'sharlock', '1434711874320', '1434711874320', '又一篇文章', '王八蛋呢王八蛋呢王八蛋呢王八蛋呢王八蛋呢,王八蛋呢王八蛋呢王八蛋呢王八蛋呢', '副标题');
INSERT INTO `that_article` VALUES ('5', 'sharlock', '1434711886961', '1434711886961', '规划局个精光', '高合金钢', '规划局规划将');
INSERT INTO `that_article` VALUES ('6', 'sharlock', '1434712454863', '1434712454863', '谁非的爽肤水', '豆腐干豆腐', '电饭锅电饭锅的');
INSERT INTO `that_article` VALUES ('7', 'sharlock', '1434712489569', '1434712489569', '王八', '王八蛋', '小王八');
INSERT INTO `that_article` VALUES ('8', 'sharlock', '1434712556172', '1434712556172', '放水电费是', '豆腐干豆腐', '电饭锅');
INSERT INTO `that_article` VALUES ('9', 'sharlock', '1434712703833', '1434712703833', '水电费水电费', '说东方闪电', '说东方闪电');
INSERT INTO `that_article` VALUES ('10', 'sharlock', '1435027323768', '1435027323768', '控件风格的', '放到收发室', '哈哈哈哈');
INSERT INTO `that_article` VALUES ('11', 'sharlock', '1435027340168', '1435027340168', '说东方闪电', '大范甘迪', '大范甘迪');
INSERT INTO `that_article` VALUES ('12', 'sharlock', '1439782383548', '1439782383548', '8.17', '第三方水电费水电费', '啊圣诞树');

-- ----------------------------
-- Table structure for `that_user`
-- ----------------------------
DROP TABLE IF EXISTS `that_user`;
CREATE TABLE `that_user` (
  `id` int(255) unsigned NOT NULL AUTO_INCREMENT COMMENT '会员id',
  `account` varchar(255) NOT NULL COMMENT '会员账号',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `username` varchar(255) NOT NULL COMMENT '用户名',
  `nickname` varchar(255) DEFAULT NULL COMMENT '昵称',
  `mail` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `tel` varchar(255) DEFAULT NULL COMMENT '电话',
  `address` varchar(255) DEFAULT NULL COMMENT '地址',
  `sex` int(1) unsigned NOT NULL DEFAULT '0' COMMENT '性别',
  `qq` varchar(255) DEFAULT NULL COMMENT 'qq',
  `createtime` varchar(255) NOT NULL COMMENT '会员注册时间',
  `lastlogintime` varchar(255) NOT NULL COMMENT '最后登录时间',
  `status` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '用户状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of that_user
-- ----------------------------
INSERT INTO `that_user` VALUES ('0', 'sharlock', 'e10adc3949ba59abbe56e057f20f883e', 'sharlock', 'sharlock', '905711341@qq.com', '13015531953', '地球', '1', '905711341', '1434611044363', '1434611045363', '0');
