// Tag Routes

// Tag Route dependencies
const router = require("express").Router();
const { Tag, Product } = require('../../models');

// GET
// Find all tags and return product data
router.get("/", async (req, res) => {
    try {
        const allTags = await Tag.findAll({ include: [Product] });
        res.status(200).json(allTags);
    } catch (e) {
        res.status(400).json(e);
    }
});
// GET
// Find tag by id and return product data
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const tagById = await Tag.findOne({ where: { id }, include: [Product] });
        if (!tagById) {
            return res.status(400).json({ error: `Issue finding tag by id and returning product data` });
        }
        res.status(200).json(tagById);
    } catch (e) {
        res.status(400).json(e);
    }
});
// POST
// Create new tag
router.post("/", async (req, res) => {
    let { tag_name } = req.body;
    try {
       if (!tag_name) {
       return res.status(400).json({ error: `Tag name value required`});
       }
       tag_name = tag_name.trim();
       const newTag = await Tag.create({ tag_name });
        res.json(newTag);
    } catch (e) {
        res.status(400).json(e);
    }
});
// PUT
// Update tag name by id
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    let { tag_name } = req.body;
    try {
        await Tag.update({ tag_name }, { where: { id } });
        const tagById = await Tag.findOne({ where: { id } });
        if (!tagById) {
            return res.status(400).json({ error: `Error updating tag` });
        }
        res.json(tagById);
    } catch (e) {
        res.status(400).json(e);
    }
});
// DELETE
// Delete tag by id
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const tagById = await Tag.findOne({ where: { id } });
        if (!tagById) {
            return res.status(400).json({ error: `Error deleting tag` });
        }
        await Tag.destroy({ where: { id } });
        res.status(200).json({ Deleted: tagById });
    } catch (e) {
        res.status(400).json(e);
    }
});
module.exports = router;