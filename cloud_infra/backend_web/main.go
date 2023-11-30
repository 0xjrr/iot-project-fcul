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
	Email  string `gorm:"primary_key;type:varchar(100);unique_index"`
	Age    int
	Gender string
	Device string // This is a unique identifier for the device
}

// SensorData represents the sensor data model
type SensorData struct {
	gorm.Model
	Device    string `gorm:"foreignKey:Device;constraint:OnDelete:CASCADE"`
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

	// Endpoint for fetching sensor data
	r.GET("/data", func(c *gin.Context) {
		var sensorData []SensorData
		db.Find(&sensorData)
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
		ctx.JSON(http.StatusOK, gin.H{"message": "User created successfully", "user": data})
	})

	// Run the server
	r.Run() // listen and serve on 0.0.0.0:8080
}
