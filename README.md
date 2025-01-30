# Ürün API Kullanımı

Bu API, ürünler hakkında çeşitli sorgulamalar yapmanıza imkan verir. Aşağıda API'nin kullanımı ve çeşitli parametrelerin nasıl kullanılacağına dair detaylı açıklamalar yer almaktadır.

## Ürün Listesi Sorgulama

**Endpoint:**  
`/api/products`

### Parametreler:

- `?sort=`

  - **Değerler:**
    - `price-asc` → Fiyatı artan sırayla sıralar.
    - `price-desc` → Fiyatı azalan sırayla sıralar.
    - `rating-desc` → Yüksek puandan düşük puana doğru sıralar.
    - `discount-desc` → İndirim oranına göre azalan sırayla sıralar.
    - `newest` → En yeni ürünler üstte olacak şekilde sıralar.

- `?category=`

  - **Değerler:** Kategori adı (örneğin: "elektronik", "giyim", vb.)

- `?search=`

  - **Değerler:** Ürün adıyla yapılan arama. (örneğin: "telefon", "ayakkabı" vb.)

- `?inStock=true`

  - **Değerler:** Yalnızca stokta bulunan ürünleri döndürür.

- `?minRating=`

  - **Değerler:** Ürünlerin minimum puan değeri. (0-5 arası değer)

- `?minPrice=`

  - **Değerler:** Ürünlerin minimum fiyatı.

- `?maxPrice=`

  - **Değerler:** Ürünlerin maksimum fiyatı.

- `?limit=`

  - **Değerler:** Döndürülecek ürün sayısı.

- `?skip=`
  - **Değerler:** İlk kaç ürünü es geçmek istediğiniz.

---

## Kategoriler Listesi

**Endpoint:**  
`/api/categories`

Bu endpoint, mevcut ürün kategorilerini döndürür.

---

## Örnek Kullanım:

### 1. Fiyatı düşükten yükseğe sıralı, stokta bulunan telefonları aramak:
