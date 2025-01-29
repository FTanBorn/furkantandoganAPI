import express from "express";
import cors from "cors";
import { categories, products } from "./data.js"; // Veri dosyasını import edin

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/categories", (req, res) => {
  res.json(categories);
});

app.get("/api/products", (req, res) => {
  const { sort, category, search, inStock, minRating, minPrice, maxPrice } =
    req.query;

  let resultProducts = [...products];

  // 1. Stok Filtresi
  if (inStock === "true") {
    resultProducts = resultProducts.filter((product) => product.stock > 0);
  }

  // 2. Rating Filtresi
  if (minRating) {
    const min = parseFloat(minRating);
    if (!isNaN(min) && min >= 0 && min <= 5) {
      resultProducts = resultProducts.filter(
        (product) => product.rating >= min
      );
    }
  }

  // 3. Kategori Filtresi
  if (category) {
    resultProducts = resultProducts.filter(
      (product) => product.category === category
    );
  }

  // 4. Fiyat Aralığı Filtresi
  if (minPrice || maxPrice) {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;

    resultProducts = resultProducts.filter(
      (product) => product.price >= min && product.price <= max
    );
  }

  // 5. Arama
  if (search) {
    const searchTerm = search.toLowerCase();
    resultProducts = resultProducts.filter((product) =>
      product.title.toLowerCase().includes(searchTerm)
    );
  }

  // 6. Sıralama
  switch (sort) {
    case "price-asc":
      resultProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      resultProducts.sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      resultProducts.sort((a, b) => b.rating - a.rating);
      break;
    case "discount-desc":
      resultProducts.sort(
        (a, b) => b.discountPercentage - a.discountPercentage
      );
      break;
    case "newest":
      resultProducts.sort(
        (a, b) => new Date(b.meta.createdAt) - new Date(a.meta.createdAt)
      );
      break;
  }

  res.json(resultProducts);
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor.`);
});
