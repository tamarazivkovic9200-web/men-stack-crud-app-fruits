const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const Fruit = require('./models/fruit.js')

const app = express()
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");
const Fruit = require('../models/fruit');
const fruitsCtrl = require('./controllers/fruits');


//midleware pretvara kovertuje podatke iz  browsera ka serveru i obrnuto
app.use(express.urlencoded({ extended: false }));
mongoose.connect(process.env.MONGODB_URI);
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new
 app.use(express.static(path.join(__dirname, "public")));

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);

});

app.get('/', async (req, res) => {
    res.render('landingpage.ejs')
})

app.get('/fruits/new', (req, res) => {
    res.render('fruits/new.ejs')
})

app.post('/fruits', async (req, res) => {

    if (req.body.isReadyToEat === 'on') {
        req.body.isReadyToEat = true
    } else {
        req.body.isReadyToEat = false
    }
    await Fruit.create(req.body);
    res.redirect('/fruits')
})

app.get('/fruits', async (req, res) => {
    const allFruits = await Fruit.find();
    console.log(allFruits)
    res.render('fruits/index.ejs', {
        fruits: allFruits
    })
})

app.get("/fruits/:fruitId", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId)
    res.render("fruits/show.ejs", { fruit: foundFruit });
});

app.delete("/fruits/:fruitId", async (req, res) => {
  await Fruit.findByIdAndDelete(req.params.fruitId);
  res.redirect("/fruits");
});

app.get("/fruits/:fruitId/edit", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/edit.ejs", {
    fruit: foundFruit,
  });

  app.put("/fruits/:fruitId", async (req, res) => {
  // Handle the 'isReadyToEat' checkbox data
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  
  // Update the fruit in the database
  await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);

  // Redirect to the fruit's show page to see the updates
  res.redirect(`/fruits/${req.params.fruitId}`);
});

});
app.listen(3000, () => {
    console.log('Listening on port 3000')
})