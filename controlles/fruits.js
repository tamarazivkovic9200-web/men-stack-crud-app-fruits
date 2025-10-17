// controllers/fruits.js

const Fruit = require('../models/fruit');

const index = async (req, res) => {
  const foundFruits = await Fruit.find();
  res.render('fruits/index.ejs', { fruits: foundFruits });
};

const newFruit =
const 

module.exports = {
    index, 
}