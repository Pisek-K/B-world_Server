const createError = require("../utils/create-error");
const { prisma } = require("../model");


exports.createCategory = async (req, res, next) => {
  try {
    const {name} = req.body
    const category = await prisma.category.create({
      data:{
        name: name
      }
    })
    res.send(category);
  } catch (err) {
    next(err);
  }
};

exports.listCategory = async (req, res, next) => {
  try {
    const category = await prisma.category.findMany()
    res.send(category);
  } catch (err) {
    next(err);
  }
};

exports.removeCategory = async (req, res, next) => {
  try {
    const {categoryId} = req.params
    const category = await prisma.category.delete({
      where:{
        id: Number(categoryId)
      }
    })
    res.send(category);
  } catch (err) {
    next(err);
  }
};
