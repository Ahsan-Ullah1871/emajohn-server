const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pizzd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.get("/", (req, res) => {
	res.send("Hello I am Working");
});

client.connect((err) => {
	const productsCollections = client
		.db("emajohnStore")
		.collection("products");
	const orderCollections = client
		.db("emajohnStore")
		.collection("orderInfo");
	console.log("Database connected");

	app.post("/addProduct", (req, res) => {
		const product = req.body;
		productsCollections.insertOne(product).then((result) => {
			console.log(result.insertedCount);
			res.send(result.insertedCount);
		});
	});

	app.get("/products", (req, res) => {
		productsCollections.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});
	app.get("/product/:key", (req, res) => {
		productsCollections
			.find({ key: req.params.key })
			.toArray((err, documents) => {
				res.send(documents[0]);
			});
	});

	app.post("/getProductByKeys", (req, res) => {
		const ProductKeys = req.body;
		productsCollections
			.find({ key: { $in: ProductKeys } })
			.toArray((err, documents) => {
				res.send(documents);
			});
	});

	app.post("/addOrder", (req, res) => {
		const product = req.body;
		orderCollections.insertOne(product).then((result) => {
			console.log(result.insertedCount);
			res.send(result.insertedCount > 0);
		});
	});
});

app.listen(process.env.PORT || port);
