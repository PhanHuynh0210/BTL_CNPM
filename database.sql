-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 16, 2025 at 07:43 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `BTL_CNPM`
--

-- --------------------------------------------------------

--
-- Table structure for table `Bookings`
--

CREATE TABLE `Bookings` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `mssv` varchar(20) NOT NULL,
  `Day` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` enum('Confirmed','Pending','Cancelled') DEFAULT 'Pending',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `CheckInOuts`
--

CREATE TABLE `CheckInOuts` (
  `check_id` int(11) NOT NULL,
  `mssv` varchar(20) NOT NULL,
  `book_id` int(11) NOT NULL,
  `time_in` datetime DEFAULT NULL,
  `time_out` datetime DEFAULT NULL,
  `status_check` enum('Not-checked-in','Checked-in') DEFAULT 'Not-checked-in',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Devices`
--

CREATE TABLE `Devices` (
  `id` int(11) NOT NULL,
  `device_name` varchar(255) NOT NULL,
  `status` enum('Active','Inactive','Maintenance') DEFAULT 'Active',
  `room_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Devices`
--

INSERT INTO `Devices` (`id`, `device_name`, `status`, `room_id`, `createdAt`, `updatedAt`) VALUES
(8, 'đèn', 'Active', 1, '2025-04-16 19:51:05', '2025-04-16 19:51:05'),
(9, 'quạt', 'Active', 1, '2025-04-16 19:51:05', '2025-04-16 19:51:05'),
(10, 'đèn', 'Active', 2, '2025-04-16 21:25:34', '2025-04-16 21:25:34'),
(11, 'quạt', 'Active', 2, '2025-04-16 21:25:34', '2025-04-16 21:25:34'),
(12, 'máy chiếu', 'Active', 2, '2025-04-16 21:25:34', '2025-04-16 21:25:34'),
(13, 'đèn', 'Active', 3, '2025-04-16 21:26:56', '2025-04-16 21:26:56'),
(14, 'quạt', 'Active', 3, '2025-04-16 21:26:56', '2025-04-16 21:26:56'),
(15, 'máy chiếu', 'Active', 3, '2025-04-16 21:26:56', '2025-04-16 21:26:56'),
(16, 'điều hòa', 'Active', 3, '2025-04-16 21:26:56', '2025-04-16 21:26:56'),
(17, 'đèn', 'Active', 4, '2025-04-16 21:34:38', '2025-04-16 21:34:38'),
(18, 'quạt', 'Active', 4, '2025-04-16 21:34:38', '2025-04-16 21:34:38'),
(19, 'máy chiếu', 'Active', 4, '2025-04-16 21:34:38', '2025-04-16 21:34:38'),
(20, 'điều hòa', 'Active', 4, '2025-04-16 21:34:38', '2025-04-16 21:34:38'),
(21, 'đèn', 'Active', 5, '2025-04-16 21:40:48', '2025-04-16 21:40:48'),
(22, 'quạt', 'Active', 5, '2025-04-16 21:40:48', '2025-04-16 21:40:48'),
(23, 'máy chiếu', 'Active', 5, '2025-04-16 21:40:48', '2025-04-16 21:40:48'),
(24, 'điều hòa', 'Active', 5, '2025-04-16 21:40:48', '2025-04-16 21:40:48'),
(25, 'đèn', 'Active', 6, '2025-04-16 21:43:42', '2025-04-16 21:43:42'),
(26, 'quạt', 'Active', 6, '2025-04-16 21:43:42', '2025-04-16 21:43:42'),
(27, 'máy chiếu', 'Active', 6, '2025-04-16 21:43:42', '2025-04-16 21:43:42'),
(28, 'điều hòa', 'Active', 6, '2025-04-16 21:43:42', '2025-04-16 21:43:42'),
(29, 'tivi', 'Active', 6, '2025-04-16 21:43:42', '2025-04-16 21:43:42');

-- --------------------------------------------------------

--
-- Table structure for table `Feedbacks`
--

CREATE TABLE `Feedbacks` (
  `feedback_id` int(11) NOT NULL,
  `mssv` varchar(20) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `Time` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Feedbacks`
--

INSERT INTO `Feedbacks` (`feedback_id`, `mssv`, `rating`, `comment`, `Time`, `createdAt`, `updatedAt`) VALUES
(2, '23XXXXX', 4, 'Thiết bị hoạt động tốt nhưng cần bảo trì thêm.', '2025-04-06 07:55:02', '2025-04-06 07:55:02', '2025-04-06 07:55:02'),
(4, '23XXXXX', 2, 'Thiếu điều hòa, hơi nóng.', '2025-04-06 07:55:02', '2025-04-06 07:55:02', '2025-04-06 07:55:02');

-- --------------------------------------------------------

--
-- Table structure for table `Infors`
--

CREATE TABLE `Infors` (
  `id` int(11) NOT NULL,
  `contact_info` text NOT NULL,
  `Time` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Infors`
--

INSERT INTO `Infors` (`id`, `contact_info`, `Time`, `createdAt`, `updatedAt`) VALUES
(1, 'School Contact - Email: contact@hcmut.edu.vn, Phone: 028-38647256', '2025-04-06 07:55:02', '2025-04-06 07:55:02', '2025-04-06 07:55:02');

-- --------------------------------------------------------

--
-- Table structure for table `Rooms`
--

CREATE TABLE `Rooms` (
  `ID` int(11) NOT NULL,
  `capacity` int(11) NOT NULL,
  `location` varchar(255) NOT NULL,
  `status` enum('Available','Occupied','Maintenance') DEFAULT 'Available',
  `qr_code` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Rooms`
--

INSERT INTO `Rooms` (`ID`, `capacity`, `location`, `status`, `qr_code`, `createdAt`, `updatedAt`) VALUES
(1, 32, '333-H1', 'Occupied', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKySURBVO3BQW7sWAwEwSxC979yjpdcPUCQur/NYUT8wRqjWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoFw8l4ZtUTpJwh8pJEr5J5YlijVKsUYo1ysXLVN6UhDtUTpLwhMqbkvCmYo1SrFGKNcrFhyXhDpU7ktCpdEk4SUKnckcS7lD5pGKNUqxRijXKxXAqXRI6lUmKNUqxRinWKBfDJOGOJHQqf1mxRinWKMUa5eLDVL5JpUtCp9Il4QmV36RYoxRrlGKNcvGyJEyWhN+sWKMUa5RijXLxkMpfkoQ7VP6SYo1SrFGKNcrFQ0noVLokvEmlUzlROUnCSRLepPJJxRqlWKMUa5SLh1S6JHQqXRI6lS4JncodSehUnlDpktCpdEnoVE6S0Kk8UaxRijVKsUa5+DKVO5LQqdyRhBOVLgmdSqfSJeGOJHQqbyrWKMUapVijxB98UBKeUDlJwh0qTyThCZUuCZ3KE8UapVijFGuU+IMHkvAmlS4JnUqXhE6lS8KJSpeETuUkCZ3Kv1SsUYo1SrFGiT/4w5LwL6l0SehUuiR0Km8q1ijFGqVYo1w8lIRvUulUTpLQqXRJ6FS6JPwlxRqlWKMUa5SLl6m8KQknSehUOpUuCSdJOFG5IwmdSpeETuWJYo1SrFGKNcrFhyXhDpUnktCpdCpdEjqVkyR0Kp3KSRI6lTcVa5RijVKsUS6GUemS0Kk8odIl4USlU/mkYo1SrFGKNcrF/0wSOpUuCZ1Kl4ROpUtCl4RO5ZOKNUqxRinWKBcfpvJJKicqd6icqHRJ+E2KNUqxRinWKBcvS8I3JeEJlS4JncqbktCpvKlYoxRrlGKNEn+wxijWKMUapVijFGuUYo1SrFGKNUqxRinWKMUapVijFGuUYo1SrFGKNcp/lIEW4vsSCbQAAAAASUVORK5CYII=', '2025-04-16 19:51:05', '2025-04-16 19:51:05'),
(2, 30, '231-H6', 'Available', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAK5SURBVO3BQW7sWAwEwSxC979yTu+GqwcIUvvbBCPiB2uMYo1SrFGKNUqxRinWKMUapVijFGuUYo1SrFGKNUqxRinWKMUapVijXDyUhJ+kcpKEE5U7kvCTVJ4o1ijFGqVYo1y8TOVNSThJQqdykoQTlROVNyXhTcUapVijFGuUiy9Lwh0qd6icJOFE5Ykk3KHyTcUapVijFGuUi2GS0Kl0SeiS0Kn8ZcUapVijFGuUiz8uCet/xRqlWKMUa5SLL1P5JpUnVJ5Q+U2KNUqxRinWKBcvS8JPSkKn0iWhU+mS0KmcJOE3K9YoxRqlWKPEDwZJwonKZMUapVijFGuUi4eS0Kl0SehUuiR0Kl0SOpU3JaFTuSMJncpJEjqVNxVrlGKNUqxR4gcPJOEJlS4JnUqXhDepdEnoVLokdConSbhD5YlijVKsUYo1ysVDKidJuEOlS0Kn0iWhU+mS8EQS7khCp9Il4ZuKNUqxRinWKBe/TBI6lW9KwolKl4QuCZ3Kv1SsUYo1SrFGuXhZEjqVJ5LwTSpdEroknKjcodIl4U3FGqVYoxRrlPjBH5aETuVNSThROUlCp/JNxRqlWKMUa5T4wQNJ+EkqJ0noVE6S0KnckYQTlS4JJypPFGuUYo1SrFEuXqbypiTcodIloVPpVE6ScIfKv1SsUYo1SrFGufiyJNyhckcSOpVO5SQJncqJSpeE36RYoxRrlGKNcvHHqXRJuEOlS0Kn8kQSTlTeVKxRijVKsUa5+OOS0KmcJOGOJHQqJ0k4UemS0Kk8UaxRijVKsUa5+DKVb1J5IgknKneonCShU3lTsUYp1ijFGuXiZUn4SUk4UTlR6ZLQJeFEpUvCHUnoVJ4o1ijFGqVYo8QP1hjFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijVKsUb5DwbRC/k19mGXAAAAAElFTkSuQmCC', '2025-04-16 21:25:34', '2025-04-16 21:25:34'),
(3, 55, '661-H2', 'Available', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKxSURBVO3BQW7kQAwEwSxC//9yro88NSBI47VpRsQvrDGKNUqxRinWKMUapVijFGuUYo1SrFGKNUqxRinWKMUapVijFGuUYo1y8VASvpPKHUm4Q6VLwndSeaJYoxRrlGKNcvEylTcl4Y4knKg8ofKmJLypWKMUa5RijXLxYUm4Q+WOJJyodEk4UbkjCXeofFKxRinWKMUa5eKPUZmsWKMUa5RijXLxxyThROU3K9YoxRqlWKNcfJjKT6LSJeEJlZ+kWKMUa5RijXLxsiT8TypdEjqVJ5LwkxVrlGKNUqxRLh5S+U2ScIfKb1KsUYo1SrFGuXgoCZ1Kl4Q3qXQqXRJOVLoknCThTSqfVKxRijVKsUa5eEilS8ITKm9SeUKlS0Kn0iWhUzlJQqfyRLFGKdYoxRrl4qEkdCpdEjqVLgldEp5QOUlCp9IloVPpVLok3JGETuVNxRqlWKMUa5T4hQeScKJyRxI6lS4JT6g8kYQnVLokdCpPFGuUYo1SrFHiF16UhE7lJAmdSpeETuUkCXeodEnoVE6S0Kn8T8UapVijFGuU+IVfLAknKl0S3qTSJaFT6ZLQqbypWKMUa5RijXLxUBK+k0qncpKETqVLQqfSJeE3KdYoxRqlWKNcvEzlTUk4ScIdSThJwolKl4STJHQqXRI6lSeKNUqxRinWKBcfloQ7VN6kcpKETuUkCZ3KHUnoVN5UrFGKNUqxRrkYRuWTVLoknKh0Kp9UrFGKNUqxRrkYJgl3qHRJ6FS6JHQqXRK6JHQqn1SsUYo1SrFGufgwlU9S6ZLQqdyhcqLSJeEnKdYoxRqlWKNcvCwJ3ykJnUqXhBOVLgmdypuS0Km8qVijFGuUYo0Sv7DGKNYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1yj8rqg3u3/TcqgAAAABJRU5ErkJggg==', '2025-04-16 21:26:56', '2025-04-16 21:26:56'),
(4, 10, '101-H2', 'Maintenance', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAALbSURBVO3BQW7sWAwEwUxC979yjZdcPUCQur/NYYT5wRqjWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoFw+pfFMSTlS6JJyodEnoVL4pCU8Ua5RijVKsUS5eloQ3qZyodEk4UemScEcS3qTypmKNUqxRijXKxYep3JGEO5LQqXyTyh1J+KRijVKsUYo1ysUwSehUuiRMVqxRijVKsUa5+ONUuiScqJwk4S8r1ijFGqVYo1x8WBI+KQknSehUuiQ8kYTfpFijFGuUYo1y8TKVb1LpktCpdEnoVLoknKj8ZsUapVijFGsU84NBVLok/J8Ua5RijVKsUS4eUumS0Kl0SehUuiR0Kl0S7lDpktCpdEm4Q6VLwolKl4Q3FWuUYo1SrFHMD16kcpKETuUkCScqXRI6lZMkdCpdEjqVLgknKnck4YlijVKsUYo1ysXLktCpdCpdEjqVTqVLQpeETuVNKneodEnoVD6pWKMUa5RijXLxkEqXhDcloVPpktAloVM5UTlJQqfSqXRJ+JeKNUqxRinWKBcfloQTlROVO1S6JHQqXRI6lU7lJAl3JKFTeVOxRinWKMUaxfzgD1PpktCpdEm4Q+UkCScqXRI+qVijFGuUYo1ifvCAyjcl4USlS8KJSpeEO1ROktCpnCThiWKNUqxRijXKxcuS8CaVO5JwRxJOVE6S8JsUa5RijVKsUS4+TOWOJNyhcpKEE5UuCXeodEn4l4o1SrFGKdYoF39cEjqVE5UuCZ1Kl4QTlROVkyS8qVijFGuUYo1y8cepdEnoVJ5Q6ZJwonKShE6lS8ITxRqlWKMUa5SLD0vCJyXhJAmdSqdykoQ7knCi0iXhTcUapVijFGuUi5epfJPKE0noVDqVkyR0KneodEl4olijFGuUYo1ifrDGKNYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1yn/aWyQCRKcGXQAAAABJRU5ErkJggg==', '2025-04-16 21:34:38', '2025-04-16 21:34:38'),
(5, 34, '301-H2', 'Occupied', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAK+SURBVO3BQW7kQAwEwSxC//9yro88NSBIM2sTjIg/WGMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRrl4qEkfJPKSRLuUDlJwjepPFGsUYo1SrFGuXiZypuScJKEb1J5UxLeVKxRijVKsUa5+LAk3KFyh0qXhDuS0KnckYQ7VD6pWKMUa5RijXIxjEqXhE5lsmKNUqxRijXKxR+XhBOVLgknKn9ZsUYp1ijFGuXiw1Q+SaVLwh0qT6j8JsUapVijFGuUi5cl4ZuS0Kl0SehUuiR0KidJ+M2KNUqxRinWKPEHa4xijVKsUYo1ysVDSehUuiR0Kl0SOpUuCZ3Km5LQqdyRhE7lJAmdypuKNUqxRinWKBcPqTyh0iWhU3lTEjqVLgmdSpeETuUkCSdJ6FSeKNYoxRqlWKNcPJSETqVT6ZLQqXQqXRLuUOmS8EQS7khCp9Il4ZOKNUqxRinWKBdfpnKHSpeETqVLwh1JOFHpktAloVP5n4o1SrFGKdYoFx+WhDtUuiR0Km9S6ZLQJeFE5Q6VLglvKtYoxRqlWKPEH/xhSbhD5Y4knKicJKFT+aRijVKsUYo1SvzBA0n4JpWTJHQqJ0noVO5IwolKl4QTlSeKNUqxRinWKBcvU3lTEj5J5SQJnUqn8psUa5RijVKsUS4+LAl3qNyRhJMkdCpdEjqVkyScqPxPxRqlWKMUa5SLP07lJAldEjqVLgmdykkSTpJwovKmYo1SrFGKNcrFH5eETuVNSehUTpJwotIloVN5olijFGuUYo1y8WEqn6TSJaFT6ZLQJeFE5Q6VkyR0Km8q1ijFGqVYo8QfPJCEb1LpkvCESpeEO1S6JDyh8kSxRinWKMUaJf5gjVGsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5R/Ef4U87gdy2oAAAAASUVORK5CYII=', '2025-04-16 21:40:48', '2025-04-16 21:40:48'),
(6, 34, '501-H2', 'Available', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKYSURBVO3BQWrEUAwFwX7C979yJ0utPhh7hkSoKv5ijVGsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5SLh5LwTSpdEjqVLgmdyh1J+CaVJ4o1SrFGKdYoFy9TeVMSTlTuSMKJyonKm5LwpmKNUqxRijXKxYcl4Q6VJ5LQqZwk4Ykk3KHyScUapVijFGuUi38uCXckoVOZpFijFGuUYo1yMYxKl4STJHQq/1mxRinWKMUa5eLDVP4SlS4JT6j8JcUapVijFGuUi5clYbIk/GXFGqVYoxRrlPiLfywJd6hMVqxRijVKsUa5eCgJncodSehUuiTcodIl4SQJn6RykoRO5YlijVKsUYo1ysXLknCHSpeETuWOJHySykkSTpLQqbypWKMUa5RijXLxkEqXhBOVLgmdSpeEE5UTlSdU7lDpkvBNxRqlWKMUa5T4iz8kCZ1Kl4RO5Y4knKicJKFTeSIJncoTxRqlWKMUa5SLlyXhDpWTJHQqXRI6lS4JJyonSThJQqdykoRPKtYoxRqlWKPEX/xjSThR6ZJwovJEEjqVkyR0Kk8Ua5RijVKsUS4eSsI3qZyo3KFykoQ7VLoknKi8qVijFGuUYo1y8TKVNyXhRKVLQqfSqZwk4Q6VE5WTJHQqTxRrlGKNUqxRLj4sCXeo3JGEkyR0Kl0SJinWKMUapVijXPxzKidJ+KQknKh0SfikYo1SrFGKNcrFOlLpknCicqLyScUapVijFGuUiw9T+aYknCThROVE5S8r1ijFGqVYo1y8LAnflIRO5SQJncpJEt6k0iWhU3miWKMUa5RijRJ/scYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijXKD73Q8u4jelxCAAAAAElFTkSuQmCC', '2025-04-16 21:43:42', '2025-04-16 21:43:42');

-- --------------------------------------------------------

--
-- Table structure for table `SequelizeMeta`
--

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `SequelizeMeta`
--

INSERT INTO `SequelizeMeta` (`name`) VALUES
('20250405174323-create-users.js'),
('20250405180301-create-support.js'),
('20250405233322-create-room.js'),
('20250406000353-create-booking.js'),
('20250406003439-create-check-in-out.js'),
('20250406003953-create-device.js'),
('20250406004341-create-feedback.js'),
('20250406004341-create-infor.js');

-- --------------------------------------------------------

--
-- Table structure for table `Support`
--

CREATE TABLE `Support` (
  `support_id` int(11) NOT NULL,
  `mssv` varchar(20) NOT NULL,
  `support_type` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `contact_info` varchar(255) DEFAULT NULL,
  `time_sent` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('Pending','In Progress','Resolved') NOT NULL DEFAULT 'Pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Support`
--

INSERT INTO `Support` (`support_id`, `mssv`, `support_type`, `title`, `description`, `contact_info`, `time_sent`, `status`, `createdAt`, `updatedAt`) VALUES
(2, '23XXXXX', 'Phòng học', 'Phòng quá nóng', 'Phòng 102 không có quạt hoặc điều hòa, rất khó chịu khi học vào buổi chiều.', '0356789123', '2025-04-06 07:55:02', 'Pending', '2025-04-06 07:55:02', '2025-04-06 07:55:02'),
(4, '23XXXXX', 'Khác', 'Cần tư vấn sử dụng hệ thống', 'Tôi là sinh viên mới và chưa biết cách sử dụng hệ thống đặt phòng, mong được hỗ trợ.', 'student2@hcmut.edu.vn', '2025-04-06 07:55:02', 'Pending', '2025-04-06 07:55:02', '2025-04-06 07:55:02');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `mssv` varchar(20) NOT NULL,
  `FullName` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Pass` varchar(255) NOT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Sex` enum('M','F','Other') DEFAULT NULL,
  `Role` enum('Admin_IT','Student','School','Admin_IOT') NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('Online','Offline','Inactive') DEFAULT 'Offline'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`mssv`, `FullName`, `Email`, `Pass`, `Phone`, `Sex`, `Role`, `createdAt`, `updatedAt`, `status`) VALUES
('123', 'Phan Hoang', '13@gmail.com', '$2b$10$Kfh3WOOtJcwOiTBz7uIEfOY66CfecIXbc1wc.xUS6BKF7yWMRnizm', '0942228842', 'F', 'Admin_IOT', '2025-04-16 00:49:17', '2025-04-16 00:49:17', 'Offline'),
('2211316', 'phan hoàng huynh', 'huynh.phan0210cm@hcmut.edu.vn', '$2b$10$y2QYUi5VSyZ43GWeXf4HX.SuAyVabSefEx2vjTJ6xX1jqnDjpbg3.', '0948637842', 'M', 'Student', '2025-04-14 22:07:36', '2025-04-14 22:07:36', 'Offline'),
('23XXXXX', 'Phạm Thị A', 'student2@hcmut.edu.vn', 'student456', '0356789123', 'F', 'Student', '2025-04-06 07:55:02', '2025-04-06 07:55:02', 'Offline'),
('24XXXXX', 'Đỗ Văn E', 'school@hcmut.edu.vn', 'school123', '0367891234', 'M', 'School', '2025-04-06 07:55:02', '2025-04-06 07:55:02', 'Offline'),
('IOT001', 'Trần Thị B', 'admin_iot@hcmut.edu.vn', '$2b$10$YImR0VdJaUFBzvm9AlyfAer3CuGb.zSP4jzvkV1swZiFC2aPLJ9u.', '0987654321', 'F', 'Admin_IOT', '2025-04-06 07:55:02', '2025-04-06 07:55:02', 'Offline'),
('IT001', 'Nguyễn Văn A', 'admin_it@hcmut.edu.vn', 'admin123', '0123456789', 'M', 'Admin_IT', '2025-04-06 07:55:02', '2025-04-06 07:55:02', 'Online');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Bookings`
--
ALTER TABLE `Bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `mssv` (`mssv`);

--
-- Indexes for table `CheckInOuts`
--
ALTER TABLE `CheckInOuts`
  ADD PRIMARY KEY (`check_id`),
  ADD KEY `mssv` (`mssv`),
  ADD KEY `book_id` (`book_id`);

--
-- Indexes for table `Devices`
--
ALTER TABLE `Devices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `Feedbacks`
--
ALTER TABLE `Feedbacks`
  ADD PRIMARY KEY (`feedback_id`),
  ADD KEY `mssv` (`mssv`);

--
-- Indexes for table `Infors`
--
ALTER TABLE `Infors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Rooms`
--
ALTER TABLE `Rooms`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `qr_code` (`qr_code`) USING HASH;

--
-- Indexes for table `SequelizeMeta`
--
ALTER TABLE `SequelizeMeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `Support`
--
ALTER TABLE `Support`
  ADD PRIMARY KEY (`support_id`),
  ADD KEY `fk_support_mssv` (`mssv`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`mssv`),
  ADD UNIQUE KEY `mssv` (`mssv`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `Phone` (`Phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Bookings`
--
ALTER TABLE `Bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `CheckInOuts`
--
ALTER TABLE `CheckInOuts`
  MODIFY `check_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Devices`
--
ALTER TABLE `Devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `Feedbacks`
--
ALTER TABLE `Feedbacks`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Infors`
--
ALTER TABLE `Infors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Rooms`
--
ALTER TABLE `Rooms`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Support`
--
ALTER TABLE `Support`
  MODIFY `support_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Bookings`
--
ALTER TABLE `Bookings`
  ADD CONSTRAINT `Bookings_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `Rooms` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Bookings_ibfk_2` FOREIGN KEY (`mssv`) REFERENCES `Users` (`mssv`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `CheckInOuts`
--
ALTER TABLE `CheckInOuts`
  ADD CONSTRAINT `CheckInOuts_ibfk_1` FOREIGN KEY (`mssv`) REFERENCES `Users` (`mssv`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `CheckInOuts_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `Bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Devices`
--
ALTER TABLE `Devices`
  ADD CONSTRAINT `Devices_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `Rooms` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Feedbacks`
--
ALTER TABLE `Feedbacks`
  ADD CONSTRAINT `Feedbacks_ibfk_1` FOREIGN KEY (`mssv`) REFERENCES `Users` (`mssv`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Support`
--
ALTER TABLE `Support`
  ADD CONSTRAINT `fk_support_mssv` FOREIGN KEY (`mssv`) REFERENCES `Users` (`mssv`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
