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