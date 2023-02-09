package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DefaultBangalore struct {
	Lat string
	Lng string
}

type IconMarker struct {
	UrlImgMarker string
	Size         []string
	Animation    string
	Draggable    string
	Numbering    string
}

type DataMap struct {
	MapId            string
	Zoom             string
	LogoUrl          string
	DisableDefaultUI string
	AllMarkers       string
	DefaultBangalore
	IconMarker
}

type Page struct {
	Id           string `json:"id" bson:"_id,omitempty"`
	Private      bool   `json:"private" bson:"private"`
	Href         string `json:"href" bson:"href"`
	UrlImgMarker string `json:"urlImgMarker" bson:"urlImgMarker"`
	Bangalore    `json:"bangalore" bson:"bangalore"`
	DataPopup    `json:"dataPopup" bson:"dataPopup"`
}

type DataPopup struct {
	Title  string `json:"title" bson:"title"`
	Text   string `json:"text" bson:"text"`
	UrlImg string `json:"urlImg" bson:"urlImg"`
	Links  []Link `json:"links" bson:"links"`
}
type Link struct {
	Url    string `json:"url" bson:"url"`
	Name   string `json:"name" bson:"name"`
	LinkId string `json:"linkId" bson:"linkId"`
}
type Bangalore struct {
	Lat float64 `json:"lat" bson:"lat"`
	Lng float64 `json:"lng" bson:"lng"`
}

type dtoPagePost struct {
	Private      bool   `json:"private" bson:"private"`
	Href         string `json:"href" bson:"href"`
	UrlImgMarker string `json:"urlImgMarker" bson:"urlImgMarker"`
	Bangalore    `json:"bangalore" bson:"bangalore"`
	DataPopup    `json:"dataPopup" bson:"dataPopup"`
}

type dtoPageGet struct {
	Id           string `json:"id" bson:"_id,omitempty"`
	Private      bool   `json:"private" bson:"private"`
	Href         string `json:"href" bson:"href"`
	UrlImgMarker string `json:"urlImgMarker" bson:"urlImgMarker"`
	Bangalore    `json:"bangalore" bson:"bangalore"`
	DataPopup    `json:"dataPopup" bson:"dataPopup"`
}

type dtoPageUpdate struct {
	Id           string    `json:"id" bson:"_id,omitempty"`
	Private      bool      `json:"private" bson:"private"`
	Href         string    `json:"href" bson:"href"`
	UrlImgMarker string    `json:"urlImgMarker" bson:"urlImgMarker"`
	Bangalore    Bangalore `json:"bangalore" bson:"bangalore"`
	DataPopup    DataPopup `json:"dataPopup" bson:"dataPopup"`
}

var collection *mongo.Collection

func main() {

	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println(err)
	}
	router := gin.Default()
	gin.SetMode(gin.ReleaseMode)
	router.Use(cors.Default())

	api := router.Group("/api")
	{
		api.POST("/post-general-data", postGeneralData)
		api.POST("/post-pages-data", postPagesData)
		api.GET("/get-general-data", getGeneralData)
		api.GET("/get-pages-data", getPagesData)
		api.PATCH("/update-page-data", updatePageData)
		api.DELETE("/delete-page-id", deletePage)
	}

	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)

	db, err := newClient(ctx, os.Getenv("DB_USERNAME"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"))

	if err != nil {

		fmt.Println(err)
	}
	collection = db.Collection("dataPages")

	defer db.Client().Disconnect(ctx)

	srv := http.Server{
		Addr:           ":8000",
		Handler:        router,
		MaxHeaderBytes: 1 << 10,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
	}
	err = srv.ListenAndServe()
	if err != nil {
		fmt.Println(err)
	}
}

func deletePage(c *gin.Context) {

	var id string
	err := c.BindJSON(&id)
	if err != nil {
		fmt.Println(err)
	}
	objectId, err := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": objectId}

	res, err := collection.DeleteOne(context.Background(), filter)
	if res.DeletedCount == 0 {
		fmt.Println("not fauld")
		c.IndentedJSON(http.StatusNotFound, id)
	}
	c.IndentedJSON(http.StatusOK, id)
}

func updatePageData(c *gin.Context) {
	var page dtoPageUpdate
	ctx, _ := context.WithTimeout(c.Request.Context(), 30*time.Second)
	if err := c.BindJSON(&page); err != nil {
		fmt.Println(err)
	}
	id, err := primitive.ObjectIDFromHex(page.Id)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(id)
	filter := bson.M{"_id": id}

	pageBytes, err := bson.Marshal(page)
	var updadtePageObj bson.M
	err = bson.Unmarshal(pageBytes, &updadtePageObj)
	delete(updadtePageObj, "_id")
	update := bson.M{
		"$set": updadtePageObj,
	}
	collection.UpdateOne(ctx, filter, update)
	c.IndentedJSON(http.StatusCreated, page)
}

func getGeneralData(c *gin.Context) {

}

func getPagesData(c *gin.Context) {
	var allPages []dtoPageGet
	// var result dtoPageGet
	ctx, err := context.WithTimeout(c.Request.Context(), 30*time.Second)
	if err != nil {
		fmt.Println(err)
	}
	cur, _ := collection.Find(ctx, bson.D{})
	// for cur.Next(ctx) {
	cur.All(ctx, &allPages)
	// err := cur.Decode(&result)
	if err != nil {
		fmt.Println(err)
	}
	// allPages = append(allPages, result)

	// }

	if err != nil {
		fmt.Println(err)
	}
	cur.Close(ctx)

	c.IndentedJSON(http.StatusOK, allPages)

}

func postGeneralData(c *gin.Context) {
	var data DataMap

	if err := c.BindJSON(&data); err != nil {
		fmt.Println(err)
	}

	fmt.Println(data)
	c.IndentedJSON(http.StatusCreated, data)
}

func postPagesData(c *gin.Context) {
	var page dtoPagePost

	if err := c.BindJSON(&page); err != nil {
		fmt.Println(err)
	}
	res, err := collection.InsertOne(context.TODO(), page)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(res)
	c.IndentedJSON(http.StatusCreated, res)
}

func newClient(ctx context.Context, username, password, database string) (*mongo.Database, error) {
	mongoDBURL := fmt.Sprintf("mongodb+srv://%s:%s@cluster0.mgdx7q8.mongodb.net/?retryWrites=true&w=majority", username, password)
	clientOptions := options.Client().ApplyURI(mongoDBURL)

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		fmt.Println(err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		fmt.Println(err)
	}

	return client.Database(database), err
}
