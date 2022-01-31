const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async function (req, res) {
  try {
     // find all categories by Querying from Database and put the data into categories constant
    const categories = await Category.findAll({
      include: [
        {model: Product}
      ]
    });
    // then what ?
    res.json(categories);
  } catch (error) {
    // what's about Errors
    res.status(500).json({err: error.message});
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const data = await Category.findOne({
      where: {id: req.params.id},
      include: [{
        model: Product
      }]
    });
    if (!data) {
      return res.status(404).json("Product was not found!");
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({err: error.message});
  }
    // .then(data => res.json(data))
    // .catch(err => res.status(500).json(err.message));
});

// Create a new category
router.post('/', async (req, res) => {
  // create a new category
  try {
    // logic
    const {category_name} = req.body;
    // validate the input
    if (category_name === "" || !category_name) {
      return res.status(400).json("Invalid Category Name Data");
    }
    const data = await Category.create({category_name});
    res.status(201).json(data);
  } catch (error) {
    // handle error
    res.status(500).json({err: error.message});
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const data = await Category.update({
      category_name: req.body.category_name,
    }, {
      where: {id: req.params.id}
    });
    // senario 1 --> no body
    // senario 2 --> id not in database
    if(!req.body.category_name || req.body.category_name === "") return res.status(400).json(`Please enter a vaild data!`);
    if(!data[0]) return res.status(404).json(`No data was found!`);
    res.json(data);
  } catch (error) {
    res.status(500).json({err: error.message});
  }
});

// Delete categories by id
router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  // GET (findOne/findAll)  -- Post (create) -- PUT (update) -- DELETE (destroy)
  // const {id} = req.params;
  // try {
  //   const data = await Category.destroy({
  //     where: {id}
  //   });
  //   if(!data) return res.status(404).json("Category was not found!");
  //   res.json(data);
  // } catch (error) {
  //   res.status(500).json({err: error.message});
  // }
  try {
    const {id} = req.params;
    // Getting sure all the Products related to this category are deleted
    await Product.destroy({
      where: {category_id: id}
    });
    // then Delete the aimed Category
    const data = await Category.destroy({
      where: {id}
    });
    if(!data) return res.status(404).json("Was not Found");
    res.json(data);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
