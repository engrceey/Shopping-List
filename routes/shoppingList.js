const { Router } = require("express");
const router = Router();
const ShoppingList = require("../models/ShoppingList");
const Auth = require('../middleware/auth')

router.get("/", Auth, async (req, res) => {
  try {
    const productList = await ShoppingList.find();
    if (!productList) {
      res.status(404).json("List is Empty");
    }
    res.status(200).json({ productList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occoured, we're working on it" });
  }
});

router.get("/:id",Auth, async (req, res) => {
  try {
    const product = await ShoppingList.findById(req.params.id);

    if (!product) {
      res.status(404).json("Item not available");
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
});

router.get('/mylist',Auth, async (req,res) => {

    try {
        const products = await ShoppingList.find({user: req.user.id})
        if (!products) {
            res.status(404).json("No Item for this user")
        }
        res.status(200).json(products);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Something went wrong, we're working on it" })
    }

})

router.post("/addItem", Auth, async (req, res) => {

  const { role } = req.user;

  if (role !== 'admin') {
    return res.sendStatus(403);
}

  try {

    const newItem = new ShoppingList({
      productName: req.body.productName,
      quantity: req.body.quantity,
      description: req.body.description,
      price: req.body.price,
    });

    await newItem.save();
    res.status(201).json({ message: "New Item added to list" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
});

module.exports = router;
