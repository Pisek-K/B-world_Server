const { prisma, cloudinary } = require("../model");
const createError = require("../utils/create-error");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


exports.createProduct = async (req, res, next) => {
  try {
    const { title, description, price, quantity, images, categoryId } = req.body;

    console.log("Images received:", images);

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });
    console.log("Product created:", product);
    res.send(product);
  } catch (err) {
    console.error("Error creating product:", err);
    next(err);
  }
};

exports.listProduct = async (req, res, next) => {
  try {
    const { count } = req.params;
    const products = await prisma.product.findMany({
      take: parseInt(count),
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    next(err);
  }
};

exports.readProduct = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const products = await prisma.product.findFirst({
      where: {
        id: +itemId
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    next(err);
  }
};

exports.removeProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findFirst({
      where: {
        id: +id,
      },
      include: {
        images: true,
      },
    });
    if (!product) {
      return createError(400, "Product not found");
    }

    const deletedImage = product.images.map(
      (image) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(image.public_id, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        })
    );

    await Promise.all(deletedImage);

    await prisma.product.delete({
      where: {
        id: +id,
      },
    });
    res.send("Deleted successfully");
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { title, description, price, quantity, images, categoryId } =
      req.body;
    const { id } = req.params;

    await prisma.image.deleteMany({
      where: {
        productId: +id,
      },
    });

    const product = await prisma.product.update({
      where: {
        id: +id,
      },
      data: {
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });
    res.send(product);
  } catch (err) {
    next(err);
  }
};

exports.listbyProduct = async (req, res, next) => {
  try {
    const { sort, order, limit } = req.body;
    const product = await prisma.product.findMany({
      take: limit,
      orderBy: { [sort]: order },
      include: {
        category: true,
      },
    });
    res.send(product);
  } catch (err) {
    next(err);
  }
};

const handleQuery = async (req, res, query) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    next(err);
  }
};

const handlePrice = async (req, res, priceRange) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: priceRange[0],
          lte: priceRange[1],
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    next(err);
  }
};

const handleCategory = async (req, res, categoryId) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryId.map((id) => Number(id)),
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    next(err);
  }
};

exports.searchFilters = async (req, res, next) => {
  try {
    const { query, category, price } = req.body;
    if (query) {
      console.log("query -->", query);
      await handleQuery(req, res, query);
    }
    if (category) {
      console.log("category -->", category);
      await handleCategory(req, res, category);
    }
    if (price) {
      console.log("price -->", price);
      await handlePrice(req, res, price);
    }
  } catch (err) {
    next(err);
  }
};

exports.uploadImages = async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `Best-${Date.now()}`,
      resource_type: "auto",
      folder: "BWorldStore",
    });
    res.send(result);
  } catch (err) {
    next(err);
  }
};

exports.removeImages = async (req, res, next) => {
  try {
    const { public_id } = req.body;
    cloudinary.uploader.destroy(public_id, (result) => {
      res.send("Remove image succesfull");
    });
  } catch (err) {
    next(err);
  }
};
