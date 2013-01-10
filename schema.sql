SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

CREATE TABLE IF NOT EXISTS `attendance` (
  `P_KEY` int(11) NOT NULL AUTO_INCREMENT,
  `eid` int(10) NOT NULL,
  `pid` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `inout` int(1) NOT NULL DEFAULT '0' COMMENT '0:in 1:out 2:override',
  PRIMARY KEY (`P_KEY`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS `events` (
  `eid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `speaker` varchar(25) NOT NULL,
  `postID` int(10) NOT NULL,
  `begins` varchar(10) DEFAULT NULL,
  `ends` varchar(10) DEFAULT NULL,
  `type` varchar(1) NOT NULL,
  `campus` varchar(3) NOT NULL,
  `location_name` varchar(100) NOT NULL,
  `lat` varchar(100) NOT NULL COMMENT 'Latitude of Location',
  `lng` varchar(100) NOT NULL COMMENT 'Longitude of Location',
  PRIMARY KEY (`eid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS `ci_sessions` (
  `session_id` VARCHAR(40) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL DEFAULT 0 ,
  `ip_address` VARCHAR(16) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL DEFAULT 0 ,
  `user_agent` VARCHAR(150) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL ,
  `last_activity` INT UNSIGNED NOT NULL DEFAULT 0 ,
  `user_data` TEXT CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL ,
  PRIMARY KEY (`session_id`) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_bin;

CREATE TABLE IF NOT EXISTS `login_attempts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `ip_address` VARCHAR(40) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL ,
  `login` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL ,
  `time` TIMESTAMP NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_bin;

CREATE TABLE IF NOT EXISTS `user_autologin` (
  `key_id` CHAR(32) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL ,
  `user_id` INT UNSIGNED NOT NULL DEFAULT 0 ,
  `user_agent` VARCHAR(150) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL ,
  `last_ip` VARCHAR(40) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL ,
  `last_login` TIMESTAMP NOT NULL ,
  PRIMARY KEY (`key_id`, `user_id`) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_bin;

CREATE TABLE IF NOT EXISTS `user_profiles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(200) NULL DEFAULT '' ,
  `gender` CHAR(1) NULL DEFAULT '' ,
  `dob` DATE NULL ,
  `country` CHAR(2) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT '' ,
  `website` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT '' ,
  `modified` TIMESTAMP NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `name` (`name` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_bin;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `username` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL ,
  `password` VARCHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL ,
  `email` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL ,
  `activated` TINYINT(1) NOT NULL DEFAULT 1 ,
  `banned` TINYINT(1) NOT NULL DEFAULT 0 ,
  `ban_reason` VARCHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL ,
  `new_password_key` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL ,
  `new_password_requested` DATETIME NULL ,
  `new_email` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL ,
  `new_email_key` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL ,
  `approved` TINYINT(1) NULL COMMENT 'For acct approval.' ,
  `meta` VARCHAR(2000) NULL DEFAULT '' ,
  `last_ip` VARCHAR(40) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL ,
  `last_login` DATETIME NOT NULL ,
  `created` DATETIME NOT NULL ,
  `modified` TIMESTAMP NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `username` (`username` ASC) ,
  INDEX `email` (`email` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_bin;

CREATE TABLE IF NOT EXISTS `permissions` (
  `permission_id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `permission` VARCHAR(100) NOT NULL ,
  `description` VARCHAR(160) NULL ,
  `parent` VARCHAR(100) NULL ,
  `sort` TINYINT UNSIGNED NULL ,
  PRIMARY KEY (`permission_id`) )
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `role` VARCHAR(50) NOT NULL ,
  `full` VARCHAR(50) NOT NULL ,
  `default` TINYINT(1) NOT NULL ,
  PRIMARY KEY (`role_id`) )
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `role_permissions` (
  `role_id` SMALLINT UNSIGNED NOT NULL ,
  `permission_id` SMALLINT UNSIGNED NOT NULL ,
  PRIMARY KEY (`role_id`, `permission_id`) ,
  INDEX `role_id_idx` (`role_id` ASC) ,
  INDEX `task_id_idx` (`permission_id` ASC) )
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` INT UNSIGNED NOT NULL ,
  `role_id` SMALLINT UNSIGNED NOT NULL ,
  PRIMARY KEY (`user_id`, `role_id`) ,
  INDEX `user_id_idx` (`user_id` ASC) ,
  INDEX `role_id_idx` (`role_id` ASC) )
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `overrides` (
  `user_id` INT UNSIGNED NOT NULL ,
  `permission_id` SMALLINT UNSIGNED NOT NULL ,
  `allow` TINYINT(1) UNSIGNED NOT NULL ,
  PRIMARY KEY (`user_id`, `permission_id`) ,
  INDEX `user_id_idx` (`user_id` ASC) ,
  INDEX `task_id_idx` (`permission_id` ASC) )
ENGINE = InnoDB;