package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// User represents the user model
type User struct {
	gorm.Model
	Name       string       `gorm:"not null"`
	Email      string       `gorm:"primary_key; unique_index"`
	Age        int          `gorm:"not null"`
	Gender     string       `gorm:"not null"`
	Weight     int          `gorm:"not null"`
	Height     float64      `gorm:"not null"`
	Device     string       `gorm:"primaryKey;unique;not null;index"` // This is a unique identifier for the device
	SensorData []SensorData `gorm:"foreignKey:Device;references:Device;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// SensorData represents the sensor data model
type SensorData struct {
	gorm.Model
	Device    string    `gorm:"primaryKey"`
	AccelX    float64   `gorm:"not null"`
	AccelY    float64   `gorm:"not null"`
	AccelZ    float64   `gorm:"not null"`
	GyroX     float64   `gorm:"not null"`
	GyroY     float64   `gorm:"not null"`
	GyroZ     float64   `gorm:"not null"`
	Activity  bool      `gorm:"not null"`
	Timestamp time.Time `gorm:"not null"`
}

type ActivityData struct {
	Activity          string  `json:"activity"`
	Minutes           float64 `json:"minutes"`
	Speed             float64 `json:"speed"`
	ActivityMeters    float64 `json:"activity_meters"`
	CaloriesPerMinute float64 `json:"calories_per_minute"`
}

type ActivityGroupData struct {
	TimeGrouping          string  `json:"time_grouping"`
	WalkingDistanceMeters float64 `json:"walking_distance_meters"`
	RunningDistanceMeters float64 `json:"running_distance_meters"`
	WalkingCalories       float64 `json:"walking_calories"`
	RunningCalories       float64 `json:"running_calories"`
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*") // Allow all origins, or specify
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not specified
	}

	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbName := os.Getenv("DB_NAME")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPass, dbHost, dbPort, dbName)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Migrate the schema
	db.AutoMigrate(&User{}, &SensorData{})

	// Set up Gin
	r := gin.Default()
	r.Use(CORSMiddleware())

	r.GET("/", func(c *gin.Context) {

		c.JSON(http.StatusOK, gin.H{"message": "Hey"})
	})

	// Endpoint for creating a new user
	r.POST("/user", func(c *gin.Context) {
		var user User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		result := db.Create(&user)
		if result.Error != nil {
			// Log the error and return a response indicating the failure
			log.Printf("Error creating user: %v\n", result.Error)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating user"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "User created successfully", "user": user})
	})

	r.GET("/users", func(c *gin.Context) {
		var users []User
		result := db.Find(&users) // Query all users
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}
		c.JSON(http.StatusOK, users)
	})

	// Endpoint for fetching sensor data with sensor name filter
	r.GET("/data", func(c *gin.Context) {
		var sensorData []SensorData

		// Check for a sensor name query parameter
		sensorName := c.Query("sensorName")
		if sensorName != "" {
			// Filter by sensor name
			db.Where("device = ?", sensorName).Find(&sensorData)
		} else {
			// No filter, get all sensor data
			db.Find(&sensorData)
		}

		c.JSON(http.StatusOK, sensorData)
	})

	r.GET("/data/:sensorName", func(c *gin.Context) {
		var sensorData []SensorData
		device := c.Param("sensorName")
		db.Where("device = ?", device).Find(&sensorData)
		c.JSON(http.StatusOK, sensorData) // Return the sensor data as JSON response
	})

	r.GET("/data/activity", func(c *gin.Context) {
		var results []ActivityData

		// Extract sensor device name from query parameter
		device := c.Query("sensorName")
		if device == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Device parameter is required"})
			return
		}

		// SQL query
		query := `	SELECT CASE WHEN activity = 1 THEN 'running' ELSE 'walking' END AS Activity,
							seconds_t / 60                                 AS Minutes,
							( activity + 1 ) * meterspersecond             AS Speed,
							( activity + 1 ) * meterspersecond * seconds_t AS ActivityMeters,
							0.035 * weight + ( Pow(( activity + 1 ) * meterspersecond, 2) / height )
											* 0.029
											* weight                      AS CaloriesPerMinute
					FROM   (SELECT activity,
									Count(*) AS seconds_t
							FROM   (SELECT Max(activity)   activity,
											Time(timestamp) AS recorded_time,
											Date(timestamp) AS recorded_date
									FROM   sensor_data
									WHERE  device = ?
									GROUP  BY recorded_date,
											recorded_time) activity_table
							GROUP  BY activity) new,
							(SELECT meterspersecond,
									users.weight,
									users.height
							FROM   WalkingSpeed,
									users
							WHERE  users.age >= WalkingSpeed.agemin
									AND users.age <= WalkingSpeed.agemax
									AND users.gender = WalkingSpeed.gender
									AND users.device = ?) ms `

		// Execute the query
		if err := db.Raw(query, device, device).Scan(&results).Error; err != nil {
			log.Printf("Error querying activity data: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error querying activity data"})
			return
		}

		// Return the results
		c.JSON(http.StatusOK, results)
	})

	r.GET("/data/activity-grouping", func(c *gin.Context) {
		var results []ActivityGroupData

		// Extract sensor device name and time grouping from query parameters
		device := c.Query("sensorName")
		timeGrouping := c.Query("timeGrouping")

		if device == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Device parameter is required"})
			return
		}

		// Prepare the SQL query based on time grouping
		var query string
		switch timeGrouping {
		case "day":
			query = `SELECT 
			a.TimeGrouping,
			a.Walking_seconds * b.WalkingSpeedMetersPerSecond AS WalkingDistanceMeters,
			a.Running_seconds * b.RunningSpeedMetersPerSecond AS RunningDistanceMeters,
			a.Walking_minutes * b.WalkingCaloriesPerMinute AS WalkingCalories,
			a.Running_minutes * b.RunningCaloriesPerMinute AS RunningCalories
		FROM 
		(SELECT 
			CONCAT(DAY(recorded_date), ' ', MONTHNAME(recorded_date), ' ', YEAR(recorded_date)) AS TimeGrouping,  
			SUM(CASE WHEN activity = 0 THEN 1 ELSE 0 END) AS Walking_seconds,
			SUM(CASE WHEN activity = 1 THEN 1 ELSE 0 END) AS Running_seconds,
			SUM(CASE WHEN activity = 0 THEN 1 ELSE 0 END)/60 AS Walking_minutes,
			SUM(CASE WHEN activity = 1 THEN 1 ELSE 0 END)/60 AS Running_minutes
		FROM (SELECT Max(activity)   activity,
							   Time(timestamp) AS recorded_time,
							   Date(timestamp) AS recorded_date
						FROM   sensor_data
						WHERE  device = ?
						GROUP  BY recorded_date,
								  recorded_time) activity_table
		GROUP BY TimeGrouping
		) a, (
		SELECT 
			SUM(CASE WHEN Activity = 'walking' THEN SpeedMetersperSecond ELSE 0 END) AS WalkingSpeedMetersPerSecond,
			SUM(CASE WHEN Activity = 'walking' THEN CaloriesPerMinute ELSE 0 END) AS WalkingCaloriesPerMinute,
			SUM(CASE WHEN Activity = 'running' THEN SpeedMetersperSecond ELSE 0 END) AS RunningSpeedMetersPerSecond,
			SUM(CASE WHEN Activity = 'running' THEN CaloriesPerMinute ELSE 0 END) AS RunningCaloriesPerMinute
		FROM 
			(SELECT CASE WHEN activity = 1 THEN 'running' ELSE 'walking' END AS Activity,
			   ( activity + 1 ) * meterspersecond             AS SpeedMetersperSecond,
			   0.035 * weight + ( Pow(( activity + 1 ) * meterspersecond, 2) / height )
								* 0.029
								* weight                      AS CaloriesPerMinute
		FROM   (SELECT activity,
					   Count(*) AS seconds_t
				FROM   (SELECT Max(activity)   activity,
							   Time(timestamp) AS recorded_time,
							   Date(timestamp) AS recorded_date
						FROM   sensor_data
						WHERE  device = ?
						GROUP  BY recorded_date,
								  recorded_time) activity_table
				GROUP  BY activity) new,
			   (SELECT meterspersecond,
					   users.weight,
					   users.height
				FROM   WalkingSpeed,
					   users
				WHERE  users.age >= WalkingSpeed.agemin
					   AND users.age <= WalkingSpeed.agemax
					   AND users.gender = WalkingSpeed.gender
					   AND users.device = ?) ms ) as stats_table
		) b`
		case "month":
			query = `SELECT 
			a.TimeGrouping,
			a.Walking_seconds * b.WalkingSpeedMetersPerSecond AS WalkingDistanceMeters,
			a.Running_seconds * b.RunningSpeedMetersPerSecond AS RunningDistanceMeters,
			a.Walking_minutes * b.WalkingCaloriesPerMinute AS WalkingCalories,
			a.Running_minutes * b.RunningCaloriesPerMinute AS RunningCalories
		FROM 
		(SELECT 
			CONCAT(MONTHNAME(recorded_date), ' ', YEAR(recorded_date)) AS TimeGrouping,  
			SUM(CASE WHEN activity = 0 THEN 1 ELSE 0 END) AS Walking_seconds,
			SUM(CASE WHEN activity = 1 THEN 1 ELSE 0 END) AS Running_seconds,
			SUM(CASE WHEN activity = 0 THEN 1 ELSE 0 END)/60 AS Walking_minutes,
			SUM(CASE WHEN activity = 1 THEN 1 ELSE 0 END)/60 AS Running_minutes
		FROM (SELECT Max(activity)   activity,
							   Time(timestamp) AS recorded_time,
							   Date(timestamp) AS recorded_date
						FROM   sensor_data
						WHERE  device = ?
						GROUP  BY recorded_date,
								  recorded_time) activity_table
		GROUP BY TimeGrouping
		) a, (
		SELECT 
			SUM(CASE WHEN Activity = 'walking' THEN SpeedMetersperSecond ELSE 0 END) AS WalkingSpeedMetersPerSecond,
			SUM(CASE WHEN Activity = 'walking' THEN CaloriesPerMinute ELSE 0 END) AS WalkingCaloriesPerMinute,
			SUM(CASE WHEN Activity = 'running' THEN SpeedMetersperSecond ELSE 0 END) AS RunningSpeedMetersPerSecond,
			SUM(CASE WHEN Activity = 'running' THEN CaloriesPerMinute ELSE 0 END) AS RunningCaloriesPerMinute
		FROM 
			(SELECT CASE WHEN activity = 1 THEN 'running' ELSE 'walking' END AS Activity,
			   ( activity + 1 ) * meterspersecond             AS SpeedMetersperSecond,
			   0.035 * weight + ( Pow(( activity + 1 ) * meterspersecond, 2) / height )
								* 0.029
								* weight                      AS CaloriesPerMinute
		FROM   (SELECT activity,
					   Count(*) AS seconds_t
				FROM   (SELECT Max(activity)   activity,
							   Time(timestamp) AS recorded_time,
							   Date(timestamp) AS recorded_date
						FROM   sensor_data
						WHERE  device = ?
						GROUP  BY recorded_date,
								  recorded_time) activity_table
				GROUP  BY activity) new,
			   (SELECT meterspersecond,
					   users.weight,
					   users.height
				FROM   WalkingSpeed,
					   users
				WHERE  users.age >= WalkingSpeed.agemin
					   AND users.age <= WalkingSpeed.agemax
					   AND users.gender = WalkingSpeed.gender
					   AND users.device = ?) ms ) as stats_table
		) b`
		default:
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid time grouping"})
			return
		}

		// Execute the query
		if err := db.Raw(query, device, device, device).Scan(&results).Error; err != nil {
			log.Printf("Error querying activity summary data: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error querying activity summary data"})
			return
		}

		// Return the results
		c.JSON(http.StatusOK, results)
	})

	// Endpoint for inserting sensor data
	r.POST("/data", func(ctx *gin.Context) {
		var data SensorData
		if err := ctx.ShouldBindJSON(&data); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		db.Create(&data)
		ctx.JSON(http.StatusOK, gin.H{"message": "Data created successfully", "data": data})
	})

	// Run the server
	r.Run(":" + port) // listen and serve on 8080
}
