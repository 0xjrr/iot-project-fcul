CREATE TABLE WalkingSpeed (
    AgeMin INT,
    AgeMax INT,
    Gender VARCHAR(6),
    MetersPerSecond DECIMAL(3, 2)
);

INSERT INTO WalkingSpeed (AgeMin, AgeMax, Gender, MetersPerSecond) VALUES
(20, 29, 'Male', 1.36),
(20, 29, 'Female', 1.34),
(30, 39, 'Male', 1.43),
(30, 39, 'Female', 1.34),
(40, 49, 'Male', 1.43),
(40, 49, 'Female', 1.39),
(50, 59, 'Male', 1.43),
(50, 59, 'Female', 1.31),
(60, 69, 'Male', 1.34),
(60, 69, 'Female', 1.24),
(70, 79, 'Male', 1.26),
(70, 79, 'Female', 1.13),
(80, 89, 'Male', 0.97),
(80, 89, 'Female', 0.94);
