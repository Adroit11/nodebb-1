-- phpMyAdmin SQL Dump
-- version 3.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 30, 2013 at 09:47 PM
-- Server version: 5.5.25a
-- PHP Version: 5.4.4

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `forum`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE IF NOT EXISTS `category` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `name` varchar(50) DEFAULT '0',
  `url_slag` varchar(50) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `created_at`, `updated_at`, `name`, `url_slag`) VALUES
(1, '2013-05-20 16:37:32', '2013-05-20 16:37:32', 'General', 'general'),
(3, '2013-05-20 16:40:29', '2013-05-20 16:39:03', 'TV Show', 'tv_show');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `comment` varchar(10000) DEFAULT NULL,
  `likes` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `topic_id` int(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 COMMENT='Comments from the forum' AUTO_INCREMENT=79 ;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `username`, `comment`, `likes`, `created_at`, `topic_id`) VALUES
(28, 'admin', 'Testing One', 9, '0000-00-00 00:00:00', 2),
(54, 'admin', 'Testing', 1, '0000-00-00 00:00:00', 1),
(56, 'admin', 'Testing One', 1, '0000-00-00 00:00:00', 2),
(76, 'admin', 'Testing Two', 8, '0000-00-00 00:00:00', 1),
(77, 'admin', '<p>Testing Next</p>', 0, '2013-05-30 19:44:46', 1),
(78, 'admin', '<p>Testing Again</p>', 0, '2013-05-30 19:46:10', 2);

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE IF NOT EXISTS `likes` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `post` int(2) DEFAULT NULL,
  `like_id` int(10) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=28 ;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `post`, `like_id`, `user_id`, `created_at`) VALUES
(25, 0, 1, 'admin', '2013-05-24 00:47:48'),
(27, 0, 2, 'admin', '2013-05-24 00:53:28');

-- --------------------------------------------------------

--
-- Table structure for table `topics`
--

CREATE TABLE IF NOT EXISTS `topics` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `topic` varchar(100) DEFAULT NULL,
  `url_slag` varchar(100) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `category` varchar(100) CHARACTER SET utf8 COLLATE utf8_sinhala_ci DEFAULT NULL,
  `post` int(10) DEFAULT NULL,
  `views` int(10) DEFAULT NULL,
  `likes` int(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 COMMENT='Topics for the forum' AUTO_INCREMENT=3 ;

--
-- Dumping data for table `topics`
--

INSERT INTO `topics` (`id`, `topic`, `url_slag`, `description`, `category`, `post`, `views`, `likes`, `created_at`, `updated_at`) VALUES
(1, 'Psych', 'psych', ' ?? ???? ????, ??', 'TV Show', 24, 0, 131, '0000-00-00 00:00:00', '2013-05-30 19:44:46'),
(2, 'qwe', 'qwe', 'QWE', 'General', 2, 0, 49, '0000-00-00 00:00:00', '2013-05-30 19:46:10');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'username',
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `full_name` varchar(50) DEFAULT NULL COMMENT 'Full name user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Time the account was created',
  `status` int(2) DEFAULT NULL COMMENT '0 Registered , 1 Approved , 2 Moderator , 3 Super Moderator , 4 Administrator , 5 Banned ',
  `post_count` int(5) DEFAULT NULL COMMENT 'Number of post by the user',
  `thread_count` int(5) DEFAULT NULL COMMENT 'Number threads started by the user',
  `email` varchar(50) DEFAULT NULL COMMENT 'Email of the user',
  `about` varchar(200) DEFAULT NULL COMMENT 'Bio of the user',
  `password` varchar(200) DEFAULT NULL COMMENT 'Password of the user',
  `nick_name` varchar(100) DEFAULT NULL COMMENT 'Nick name of the user',
  `gender` varchar(10) DEFAULT NULL COMMENT 'Gender of ther user',
  `username` varchar(50) DEFAULT NULL COMMENT 'Username of th user',
  `country` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 COMMENT='Details of the user in the forum' AUTO_INCREMENT=19 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `first_name`, `last_name`, `full_name`, `created_at`, `status`, `post_count`, `thread_count`, `email`, `about`, `password`, `nick_name`, `gender`, `username`, `country`) VALUES
(1, 'Pasindu', 'De Silva', 'Pasindu De Silva', '2013-05-15 14:56:24', 4, 4, 1, 'ghosteyes17@ymail.com', 'Pasindu Never Back Down', 'asd', 'Pasi', 'Male', 'admin', NULL),
(18, NULL, NULL, 'OOOOOOO', '2013-05-15 22:21:53', NULL, NULL, NULL, 'celestine30@gmail.com', NULL, 'asdasd', NULL, NULL, 'asd', 'Please select a country');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
