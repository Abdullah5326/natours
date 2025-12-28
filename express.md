# Express:

## What is express:

- Express is a minimal node js framework, a higher level of abstraction.
- Express contains a very robust set of features: complex routing, easier handling of requests and responses, middleware, server-side rendering etc.
- Express allows for rapid development of node js applications: we don't have to re-invent the wheel.
- Express makes it easier to organize our application into the MVC architecture.

## Creating server on express:

```js
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello world from the server', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('Yah we can post on that server');
});

const port = 3000;
app.listen(port, () => {
  console.log('The app is listening...');
});
```

## Api

Application programming interface: a piece of software that is used by other piece of software, in order to allow application to talk with each other.

## Restful api

A RESTful API is a way for two systems (like a frontend and a backend, or two different apps) to talk to each other over the internet using HTTP requests (like GET, POST, PUT, DELETE).<br>

The term REST stands for:<br>

REpresentational State Transfer

## THE REST ARCHITECTURE:

- ### 1. Separate API into logical resources:

  Object or representation of something, which has data associated to it. Any information that can be named can be resource.

  #### E.g: tours, users, reviews

  ### Note:

  Endpoints should contain only resourses(nouns), and use HTTP methods for actions

- ### 2.Exposed structured resource-based URLs:
- ### 3. Use HTTP methods(verbs):
  It mean is that use method of http like GET, POST, PUT, PATCH, DELETE.
- ### 4. Send data as JSON:
- ### 5. Be stateless:
  All state is handled on the client. This means that each request contain all information necessary to process a certain request.
  The server should not have to remeber previous requests

## URL params:

In express to read URL parameters we use in **req.params** object. This is super useful When we are working with dyanmic routes, like **/users/:id**

```js
app.get('/users/:id/:name?', (req, res) => {
  console.log(req.params.id);
});
```

### How it works

- If someone visits /users/42,
  Express will extract 42 as req.params.id
- Response : {id : 42}
- The question marks is for optional parameter which give us option to enter it or not if we don't enter it does not produce error but for the case of id it will error if we don't specify it.

### Chaning routes for different HTTP methods:

You can chain different HTTP methods (like GET, POST,PATCH, PUT, DELETE etc.) for the same route to make your code cleaner and more organized.

```js
app.route('/api/v1/tours').get(getAllTours).post(createTours);
```

## Middleware:

Middleware = Functions that run b/w req and res

- Read the request **(req)**
- Modify the request **(req)**
- End the response **(resn.send())**
- Pass to next middleware **(next())**

### Common Examples:

- 1. **express.json()** - Converts JSON to js object.
- 2. **Logger** - Logs request details
- 3. **Authentication** - Checks if user is logged in
- 4. **CORS** - Handles cross-origin requests

### Key points:

- Runs in the we write them
- Every route handler is also middleware
- Must call next() to continue the chain
- Or call res.send to end the chain

## Express router:

### What is express router

    - A tool to organize our routes in groups
    - Like mini apps indside our main app
    - Helps keep related routes together

### How to use it

```js
// 1. Create Router
const tourRouter = express.Router();
// 2. Add routes to router

tourRouter.get('/', (req, res) => {
  res.send('Home page');

  // 3. Connect router to the main page
  // 3. Connect router to the main page
  app.use('/api/v1/tours', tourRouter);
  app.use('/api/v1/tours', tourRouter);
});
```

## Params middleware:

The special middleware that runs when a specific URL parameter is present.

### Purpose:

To avoid repeating validation/logic for the same parameter across multiple routes.

### Syntax:

```js
app.param('id', (req, res, next, val) => {
  console.log(id);
  next();
});
```

### Key benefits:

- **DRY Code:** Write once, use everywhere
- **Centralized Logic:** Once place to handle parameter processing instead of using every route.
- **Clean Routes:**Route handlers stay simple and focused

### Common use cases:

- User authentication/authorization
- Database record validation
- Data preprocessing before route execution

## Enviroment variables:

### Definition:

External configuration values stored as key-value pairs.

### Purpose:

Configure app behaviour for different enviroments securely

### Access:

Throught process.env.VAR_NAME in node js

### Why use them:

- Hide passwords, API keys form code
- Different settings for dev/test/production
- Switch enviroments without modifying code

### Setup process:

- 1. Create **.env** file in project root
- 2. Install dotenv: **npm install dotenv**
- 3. Load in main file: **require('dotenv').config()**
- 4. Use variables: process.env.VAR_NAME

### Common variables:

```js
NODE_ENV = development;
PORT = 3000;
DATABASE_URL = your_connection_string;
JWT_SECRET = your_secret_key;
API_KEY = your_api_key;
```

### Importand Rules:

- Add .env to .gitignore (never commit to version control)
- Use different **.env** files for different enviroments
- Provide fallback values: **process.env.PORT ||3000**

## Installing esling and prettier dependencies:

```js
npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
```

# MONGODB

Mongodb is document database with the scalability and flexibility that we want with the querying and indexing that we need.

## Key MONGODB Feature:

- **Document based:** Mongo db store data in documents (field-value pair data sturcture, NoSQL).
- **Scalable:** Very easy to distribute data across multiple machines as our users and amount of data grows.
- **Flexible:** No document data schema required, so each document have different number and type of fields.
- **Performant:** Embedded data models, indexing, sharding, flexible documents, native applications, etc.
- Free and open source under the SSPL License.
-

## Useful cmds of mongodb shell:

- **use** use play the role to change the database if the database exit on the name if not exist it create database
  ```js
  use natours-test
  ```
- **show dbs:** This command is used to show all the databases which is on our computer
- **db.tours.find():** is used access the collection in current db
- **show collections:** This cmd is used to see our colloctions
- **db.tours.insertOne or db.tours.insertMany:** is used to insert documents the first insert on and the second insert many

## What is mongoose?

👉 Mongoose is an object data modeling (ODM) library for mongodb and node js a higher level of abstraction. <br>
👉 Mongoose allows for rapid and simple development of mongodb database interactions.<br>
👉 **Features** schemas to model data and relationships, easy data validation, simple query API, middleware etc.<brd>
👉 **Mongoose schema:** where we model our data, by describing the sturcture of the data, default values and validation.<br>
👉 **Mongoose model:** a wrapper for the schema providing an interface to the data base for CRUD operations.<br>

### Syntax of schema and model:

```js
const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The name of tour is required.'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'The price of tour is required.'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);
```

## MVC architecture in node js:

- Stands for Model View Controller
- It is a design pattern used to organize code in clean and structured way especially in web apps.
- It separates the application logic into three main parts

### 🏗 1. Model:

- The model handles data and database logic
- It defines how data is structured, stored and managed.
- Example: Mongoose schema and model in MongoDB.

```js
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

module.exports = mongoose.model('User', userSchema);
```

### 🧭 2. View:

- The view is what the user sees like web pages (HTML, EJS, etc)
- It displays data that comes form the controller.

### ⚙️ 3. Controller

- The controller is the middle part between model and view.
- It receives requests, uses models to get data, and sends a resopose (or renders a view)

```js
// controllers/userController.js
const User = require('../models/User');

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render('home', { user });
};
```

## 🛠 How to implement MVC in Node.js(Example Project):

```js
project/
│
├── models/
│   └── User.js
│
├── views/
│   └── home.ejs
│
├── controllers/
│   └── userController.js
│
├── routes/
│   └── userRoutes.js
│
├── app.js
└── package.json
```

## Posting document to mongodb:

To post document to mongodb there are two ways first one is **save** and the second one is create.Use create on Model it will return a promise which contain newly created document.

```js
const newTour = await Tour.create(req.body);
res.status(201).json({
  status: 'fail',
  data: {
    newTour,
  },
});
```

## Reading documents in mongodb:

we use find method to fetch all methods from database and we use findById to see one documents

```js
const tours = await Tour.find();
const tour = await Tour.findById(req.params.id);
```

## Updating documents in mongodb:

we use findbyIdAndUpdate() method to update document

```js
updateDocument = async (name) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true,
    })
  }
}
```

- The new method will return updated document
- runValidator will run the validation scheme of schema again

## Importing all data objects to mongodb from json file:

For the purpose to upload all objects to db we use create method and give the array of objects.The mongodb work on it and create seperate documents for each in db.

## Deleting all data from mongodb:

for this we use deleteMany method to delete all the documents from model

## Advance methods of Api:

### Filtering:

There are several ways for filtering documents but the two are given below:

#### 01. Using find method:

```js
db.students.find({ age: 20 });
// This return all documents where age is 20.
```

#### 02. Using .where method:

The .where() method let us filter documents using js expressions-- it's more flexible but slower that query filters.

```js
db.students.find().where('age').gt(18).lt(30);
// Returns all the students whose age is greater than 18 and less than 30.
```

## Sorting :

Sorting means arranging the documents in specific order either ascending or descending based on one or more fields.
<br>
MongoDB allows sorting using the .sort method on query.

```js
let query = Tours.find(req.query);
if (req.query.sort) {
  query = query.sort('price'); // Assending order
  query = query.sort('-price'); //desending order
}
```

### Sorting by Multiple Fields:

```js
let query = Tours.find(req.query);
if (req.query.sort) {
  query = query.sort('price rating'); // for multiple fields
}
// This documents first sort by price but if there is a documents having two fields same price then mongodb use the second field.
```

## Limit:

The limit() method in mongoose is used to restrict number of documents returned by a query.<br>
It helps when we want to receive only few results instead of all documents.

### Syntax:

```js
Model.find().limit(number_of_fields);
Tour.find().limit(5);
// This will return 5  documents
```

## Limiting Fields:

Limiting fields means choosing which fields(properties) we want to include or exclude in the result when fetching documents from mongodb
<br>
It helps make our API faster and cleaner by sending only necessary data.

### Syntax:

```js
Model.find().select('name price');
// This will return only the name and price fields from each document.
```

### Exlclude Fields:

To exclude a field, use a minus (-) before the field name:

```js
Model.find().select('-__v');
```

#### Hiding field in schema:

use the select method for field and set to false so the specific will not show to the client.

## Pagination:

We use two methods to work with pagination the first is skip value and the second one is the number of documents we want

```js
// Pagination
const page = req.query.page * 1 || 1;
const limit = req.query.limit * 1 || 100;
const skip = (page - 1) * limit;
if (req.query.page) {
  const numOfDocuments = await Tour.countDocuments();
  if (skip <= numOfDocuments)
    throw new Error('The page is not exist please try lower number of page');
}
query = query.skip(skip).limit(limit);
```

- The skip method will skip the document to the specified number and the limit show the documents after the skipped documents.

## Aliasing in Mongoose:

Aliasing im mongoose means giving a different name(alias) to a field that when we send or received data, we can use that alias instead of actual field name in the database.

### Why we use it:

- We want to show cleaner field name to API users.
- We don't want to expose internal database field names
- When we want shorter name in frontend but keeps descriptive in the backend

### Aliasing in API URLs:

```js
app.get('/api/v1/tours/top-5-cheap', (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price, -ratingsAvg';
  next();
});
```

## Aggregation Pipeline:

Aggregation pipeline in mongodb is step by step data processing system where documents pass through multiple stages and each stage transforms the data.

### Definintion:

Aggregation pipeline is a sequence of stages like $match, $group, $sort, $project, $limiit etc . used to filter, group, and transform data inside mongodb.

### How it works:

Data flows like below <br>
Stage 1 → Stage 2 → Stage 3 → Final Result <br>
Each stage modifies the documents before sending them to the next stage.

### Common Stages:

- $match: filter documents(like find)
- $group: group data
- $sort: sort data
- $project: select specific fields
- $limit: limit number of documents
- $skip: skip documents

### Example:

```
Model.aggregate([
  { $match: { age: { $gt: 18 } } },
  { $sort: { age: -1 } },
  { $limit: 5 }
]);

```

### 1.$match Stage:

it is used to filter documents based on a condition.
it works just like find().

### Purpose:

Select only those documents that match the given conditon.

### Example:

```
{ $match: { age: { $gt: 18 } } }
// This keeps only documents where age > 18

```

### Use cases:

- Filter data early
- Reduce documents before processing.
- Improve performance

### 2. $group stage:

is used to group documents based on a field and apply operations like sum count, avg, max, min etc.

### Purpose:

Combine multiple documents into singel summary output.

### Important:

\_id inside group tells how to group the data.

### Common operators:

- $sum: add numbers
- avg: average
- $max: maximum value
  $min: minimum value
  $count: count (using {$sum: 1})

### Example:

```
{
  $group: {
    _id: "$category",
    totalPrice: { $sum: "$price" }
  }
}
```

### Match stage used with group:

When you use $match before $group, then:

✔️ Only the documents that pass the $match filter

will go into the $group stage.

So:

If you have 100 documents

$match filters them to 10 documents

Then $group will summarize only those 10 documents
(not the whole 100)

## Sort Stage:

Sort arranges documents in ascending(1) or descending (-1) order

### Syntax:

```
{
  $sort: {price: 1}// For assending order
  $sort: {price: -1} // For desending order

}

```

## Unwind stage:

it takes an array field and create a separate document for each element of the array.

### Example:

```
// Documents:
{
  "name": "Tour A",
  "startDates": ["jan", "Feb", "Mar"],
}
// Unwind
{
  $unwind: "$startDates"
}

//Result:
{name: "TourA", startDates: "jan"}
{name: "TourA", startDates: "Feb"}
{name: "TourA", startDates: "Mar"}

```

## Project:

$project is used to choose which fields to show or hide in the final output.

### Example:

```
{
$project: {
  name: 1,// (to show the field)
  _id: 0, // (To hide the field)
}
}

```

### Purpose

- Hide unnecessary fields.
- Rename fields
- Create new computed fields

### Example: Rename price → cost:

```
{
  $project: {
    name: 1,
    cost: '$price',
    _id: 0
  }
}
```

## Addfields Stage:

adds new fields to each documents or modifies existing fields.

### Syntax:

{
$addFields: {
    discountPrice: { $multiply: ['$price', 0.9] }
}
}

## Virtual Properties in mongoose:

Virtual properties are fields that exist in a document but are not saved in the database<br>
They are calculated automatically from existing data.

### Why virtuals?

- To write less bussiness logic in our controller as possible as.

  ```
  userSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
  });

  ```

### Why virtual are useful:

- To combine multiple fields(first + last name)
- To calculate values(like discount, price, age, duration)
- To avoid storing unnecessary data in the database
- To make API responses cleaner

### Important Notes:

- Virtuals do not exist in database
- Virtual only exist when we get or convert to json
- We must enable them in schema
- don't apply query methods on it like find etc.

## Document middleware:

Document middleware (also callec pre and post hooks) are functions in mongoose that run before or after a document is saved, validated, removed or updated.<br>
They allow us to do something automatically whenever a document is created or modified.

### Types of document middleware:

- 1. pre('save"): runs before saving documnent
- 2. post("save"): runs after saving
- 3. pre("validated"): runs before validation
- 4. post("validate"): runs after validation.

## Query Middleware:

Query middleware runs before or after a query is executed.<br>
A query means:

- .find()
- .findOne()
- .findById()
- .updateOne()
- .deleteMany()
- etc

  So query middleware allows us to modify or filter the query automatically before it runs.

```
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// Meaning:
// Before any query that starts with find
// Add a condition to hide a secret tours
```

### Why we use query middleware:

- To hide secret/ soft-deleted documents
- To filter out inactive users automatically
- to add default sorting or filtering
- to log query execution time
- to populate fields automatically

### Types:

- #### 1. tourSchema.pre("find") or pre(/^find/):

  runs before executing the find type query

- #### 2. tourSchema.post("/^find/"):
  run afte the query finishes.

### Validation in mongoose:

validation means checking that data users enter is correct and allowed before saving in the database.

<br> Mongoose automatically checks the following things like:

- A field is required
- A string has a minimum and maximum length
- A number is inside of valid range using max and min property
- A value matches a specific pattern (regular expression)

if the data goes wrong the mongoose thrown an error and does not save the document in the database

### Custom Validation:

Custom valid means when the built in validators are not enough for validation.

<br> We write function that return bool which means:

- true : data is valid
- false : data is invalid

### Syntax:

```
price: {
  type: Number,
  validate: {
    validator: function (val) {
      return val > 0; // custom rule
    },
    message: 'Price must be greater than 0'
  }
}

```

## Handling unmatch route:

use app.all if in routes no route is matched

### Syntax:

```
app.all('/*splat', handler)

```

## Types of error in Node js Backend:

### 1) Programmable errors(or developer errors):

- These are the errors that produced because of the mistake in the code
- Logical errors, typos, wrong function usage, invalide code assumptions.

```
const x = undefined;
console.log(x.toUpperCase()); // TypeError: Cannot read property 'toUpperCase' of undefined

```

- Calling a method on an undefined variable
- Forgetting to import a required module
- Using wrong parameters in a function

### Operational Errors(or Runtime Errors):

- These are the errors that occur during normal operation of the application due to external factors.
- Network issues, database downtime, missing files, permission issues, invalid user input

```
const fs = require('fs');
fs.readFile('/path/to/file.txt', (err, data) => {
  if (err) {
    console.error('Operational error: File not found');
  } else {
    console.log(data.toString());
  }
});


```

- Database connection fails
- File not found
- API endpoint unreachable

### Handling:

operational error should be handled gracefully using try catch, callbacks or error handling middleware.

## Global Error Middleware:

In express the error handling middleware is a special middleware functon that has 4 parameters

- Because it has four parameter express knows this middleware is specially for handling errors

### This middleware catches:

- Errors thrown inside routes
- next(new Error("message"))
- Any js runtime error that occurs in the express pipiline

### Working:

express is a pipline and middleware work through after one middleware executed express go to another middleware using next but if the use next(err) then express igonore all the routes and go to the error handling middleware

## JWT(JSON Web Tokens):

It is a secure, compact way to send user data b/w the client and backend.<br>
It is commonly used for login (authentication) and protecting routes(authoriztion) in node js

### What is JWT:

JWT is a digitally signed token that the server gives to the user when they log in successfully.

- The user log in using email/password
- server verifies them
- Server gives a signed token (JWT).
- The user sends this token in every future request to prove their identity.

### What does a JWT look like?

A JWT has 3 parts:

```
xxxxxxxx.yyyyyyyy.zzzzzzzzzzz
```

- **1)Header**: tells which algorithm is used(HS256I).
- **2) Payload:** contains user dta like:

  ```
  { "id": "12345", "role": "admin" }

  ```

- **3) Signature**: the most imp part is t is generated using

```
HMACSHA256(header + payload + SECRET_KEY)
```

This SECRET_KEY stays only on backend

## Mongoose populate method:

In mongoose populate is a powerful method use to repalace a reference to another document with the actual document data.It is mainly used when we relationship b/w collections

## Example:

```const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'  // Reference to User collection
  }
});

const Post = mongoose.model('Post', postSchema);

<!-- inController
 -->
 const post = await Post.findOne({ title: 'My First Post' }).populate({
  path: "guides",
  select: "-__v -passwordChangeAt"
 });
console.log(post);

// use the query middleware to do the populate it best practice

```

## Virtual Populate:

Virtual populate in mongoose is a special technique that let us to create a relationship b/w two models without storing the parent or child IDs in the document itself.<br>
It means: The relationship exists only in mongoose (virtually) not in mongodb

### Syntax:

```
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

<!-- ref: which model to connect -->
<!-- foreignField: which field in review has the parent tour ID -->
<!-- local: which field in Tour to match with (_id) -->
```

## Indexes in MONGODB:

An index is special data structure that mongodb creates to make searching fast.

- Without index: we flip every page to find a topic (slow)
- With Index: we jump directly to the page (fast)

### Why we use indexes:

Because without indexes, MongoDB must scan every document in the collection this is callecd collection scan which is slow

-Index make queries fast, especially for

- Searching
- Sorting
- Filtering
- Unique Constraints
- Geoopatial queries
