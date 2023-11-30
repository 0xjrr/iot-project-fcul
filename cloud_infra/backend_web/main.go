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
	Name   string
	Email  string `gorm:"type:varchar(100);unique_index"`
	Age    int
	Gender string
}

// SensorData represents the sensor data model
type SensorData struct {
	gorm.Model
	UserID    uint `gorm:"index;constraint:OnDelete:CASCADE"`
	AccelX    float64
	AccelY    float64
	AccelZ    float64
	GyroX     float64
	GyroY     float64
	GyroZ     float64
	Activity  bool
	Timestamp time.Time
}

func main() {
	// Connect to the database
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	db.AutoMigrate(&User{}, &SensorData{})

	// Set up Gin
	r := gin.Default()

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

	// Endpoint for fetching sensor data
	r.GET("/data", func(c *gin.Context) {
		var sensorData []SensorData
		db.Find(&sensorData)
		c.JSON(http.StatusOK, sensorData)
	})

	// Run the server
	r.Run() // listen and serve on 0.0.0.0:8080
}
