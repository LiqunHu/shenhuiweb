/*
 Navicat Premium Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 50722
 Source Host           : localhost
 Source Database       : mvnndata

 Target Server Type    : MySQL
 Target Server Version : 50722
 File Encoding         : utf-8

 Date: 06/09/2018 13:13:17 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `seqmysql`;
CREATE TABLE `seqmysql` (
  `seqname` varchar(50) NOT NULL,
  `currentValue` bigint(20) NOT NULL,
  `increment` int(11) NOT NULL DEFAULT '1',
  `max` bigint(20) NOT NULL DEFAULT '99999999',
  PRIMARY KEY (`seqname`)
);

INSERT INTO `seqmysql` VALUES ('userIDSeq', '0', '1', '99999999');

-- ----------------------------
--  Procedure structure for `Pro_AddMenu`
-- ----------------------------
DROP PROCEDURE IF EXISTS `Pro_AddMenu`;
delimiter ;;
CREATE PROCEDURE `Pro_AddMenu`(IN pmenuName VARCHAR(100), IN fmenuName VARCHAR(100), IN funcPath VARCHAR(100), IN funcName VARCHAR(100))
BEGIN
	DECLARE v_fmenu_id BIGINT;

	DECLARE v_api_id BIGINT;

	DECLARE v_api_name VARCHAR(300);

	DECLARE v_api_function VARCHAR(100);

	SELECT systemmenu_id INTO v_fmenu_id FROM tbl_common_systemmenu WHERE systemmenu_name = pmenuName;

	INSERT INTO tbl_common_api(api_name , api_kind , api_path, api_function, auth_flag, show_flag, created_at, updated_at)
	VALUES(fmenuName , '1' , funcPath, funcName, '1', '1', now(), now());

	SELECT api_id , api_name , api_function INTO v_api_id , v_api_name , v_api_function FROM tbl_common_api WHERE api_function = funcName;

	INSERT INTO tbl_common_systemmenu( systemmenu_name , api_id , api_function , node_type , parent_id , created_at , updated_at) VALUES( v_api_name , v_api_id , v_api_function , '01' , v_fmenu_id , now() , now());

END
 ;;
delimiter ;

-- ----------------------------
--  Function structure for `currval`
-- ----------------------------
DROP FUNCTION IF EXISTS `currval`;
delimiter ;;
CREATE FUNCTION `currval`(seq_name VARCHAR(50)) RETURNS int(11)
BEGIN
  DECLARE current INTEGER;
  SET current = 0;
  SELECT currentValue INTO current
  FROM seqmysql
  WHERE seqname = seq_name;
  RETURN current;
END
 ;;
delimiter ;

-- ----------------------------
--  Function structure for `nextval`
-- ----------------------------
DROP FUNCTION IF EXISTS `nextval`;
delimiter ;;
CREATE FUNCTION `nextval`(seq_name VARCHAR(50)) RETURNS int(11)
BEGIN
  UPDATE seqmysql
    SET currentValue = CASE
    WHEN currentValue + increment > max THEN 1
    ELSE currentValue + increment
    END
  WHERE seqname =  seq_name;
  RETURN currval(seq_name);
END
 ;;
delimiter ;

-- ----------------------------
--  Function structure for `setval`
-- ----------------------------
DROP FUNCTION IF EXISTS `setval`;
delimiter ;;
CREATE FUNCTION `setval`(seq_name VARCHAR(50), value INTEGER) RETURNS int(11)
BEGIN
   UPDATE seqmysql
   SET currentValue = value
   WHERE seqname = seq_name;
   RETURN currval(seq_name);
END
 ;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
