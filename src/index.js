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
  const {
    sort,
    category,
    search,
    inStock,
    minRating,
    minPrice,
    maxPrice,
    limit,
    skip,
  } = req.query;

  let resultProducts = [...products];

  // Filtreler
  if (inStock === "true")
    resultProducts = resultProducts.filter((p) => p.stock > 0);
  if (minRating)
    resultProducts = resultProducts.filter(
      (p) => p.rating >= parseFloat(minRating)
    );
  if (category)
    resultProducts = resultProducts.filter((p) => p.category === category);
  if (search)
    resultProducts = resultProducts.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );
  if (minPrice || maxPrice)
    resultProducts = resultProducts.filter(
      (p) =>
        p.price >= (parseFloat(minPrice) || 0) &&
        p.price <= (parseFloat(maxPrice) || Infinity)
    );

  // Sıralama
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

  // Sayfalama (skip) ve Limit
  const skipValue = parseInt(skip) || 0;
  const limitValue = parseInt(limit) || resultProducts.length; // Varsayılan olarak tüm ürünler
  const paginatedProducts = resultProducts.slice(
    skipValue,
    skipValue + limitValue
  );

  // Toplam ürün sayısını da yanıta ekle
  res.json({
    total: resultProducts.length,
    products: paginatedProducts,
  });
});
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor.`);
});
