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
		db.Create(&user)
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
	r.Run(":" + port) // listen and serve on 0.0.0.0:8080
}
