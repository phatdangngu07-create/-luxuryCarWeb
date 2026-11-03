// Tải danh sách xe từ API, dựng thẻ sản phẩm và cung cấp dữ liệu cho bộ lọc.
(() => {
    const grid = document.querySelector("#collectionCarGrid");
    const loadStatus = document.querySelector("#collectionLoadStatus");
    const brandFilter = document.querySelector("#brandFilter");
    const catalog = window.LuxuryCarsProducts;
    const fallbackImage = "/assets/images/lamboghini.jpg";

    if (!grid) return;

    grid.replaceChildren();

    // Tạo lại tùy chọn thương hiệu nhưng giữ bộ lọc được chọn từ URL/giao diện.
    const populateBrands = (products) => {
        if (!brandFilter) return;

        const selectedBrand = new URLSearchParams(window.location.search).get("brand")
            || brandFilter.value;
        brandFilter.replaceChildren(new Option("Tất cả thương hiệu", ""));

        [...new Set(products.map((product) => product.brand).filter(Boolean))]
            .sort((first, second) => first.localeCompare(second, "vi"))
            .forEach((brand) => brandFilter.add(new Option(brand, brand)));

        brandFilter.value = selectedBrand;
    };

    // Dựng thẻ xe và các thuộc tính dữ liệu mà bộ lọc/sắp xếp sẽ sử dụng.
    const createCarCard = (product) => {
        const brand = String(product.brand || "");
        const name = String(product.name || "");
        const engine = String(product.engine || "").toLowerCase().replace(/-/g, "");
        const segmentValue = String(product.segment || "").toLowerCase();
        const segment = segmentValue === "grand tourer" ? "gt" : segmentValue;
        const item = document.createElement("div");
        item.className = "col-12 col-sm-6 col-lg-3";
        item.dataset.carItem = "";
        item.dataset.brand = brand;
        item.dataset.engine = engine;
        item.dataset.segment = segment;
        item.dataset.speed = String(Number(product.speed) || 0);
        item.dataset.power = String(Number(product.power) || 0);
        item.dataset.year = String(Number(product.year) || 0);

        const card = document.createElement("article");
        card.className = "card h-100 shadow-sm";
        card.dataset.carCard = "";

        const image = document.createElement("img");
        image.className = "card-img-top";
        image.src = product.image || fallbackImage;
        image.alt = `Ảnh minh họa ${brand} ${name}`.trim();
        image.loading = "lazy";
        image.decoding = "async";
        image.addEventListener("error", () => {
            if (image.src.endsWith(fallbackImage)) {
                image.hidden = true;
            } else {
                image.src = fallbackImage;
            }
        });

        const body = document.createElement("div");
        body.className = "card-body d-flex flex-column";

        const brandLabel = document.createElement("p");
        brandLabel.className = "car-brand-label";
        brandLabel.textContent = brand;

        const title = document.createElement("h2");
        title.className = "card-title h4";
        title.textContent = name;

        const description = document.createElement("p");
        description.className = "card-text text-secondary";
        description.textContent = String(product.description || "");

        const detailLink = document.createElement("a");
        detailLink.className = "btn btn-danger mt-auto align-self-start";
        detailLink.href = `car_detail.html?id=${encodeURIComponent(product.id)}`;
        detailLink.textContent = "Xem chi tiết";

        body.append(brandLabel, title, description, detailLink);
        card.append(image, body);
        item.append(card);
        return item;
    };

    // Tải sản phẩm, hiển thị danh sách và phát sự kiện để hiệu ứng quan sát cập nhật.
    const loadProducts = async () => {
        try {
            if (!catalog || typeof catalog.getProducts !== "function") {
                throw new Error("Không tìm thấy trình tải dữ liệu sản phẩm.");
            }

            const products = await catalog.getProducts();
            populateBrands(products);
            grid.replaceChildren(...products.map(createCarCard));
            grid.hidden = false;
            loadStatus.hidden = true;
            document.dispatchEvent(new CustomEvent("luxurycars:products-loaded"));
        } catch (error) {
            console.error("Không thể tải danh sách xe:", error);
            loadStatus.hidden = false;
            loadStatus.setAttribute("role", "alert");
            loadStatus.textContent = `Không thể tải danh sách xe. Hãy đảm bảo JSON Server đang chạy: ${error.message}`;
        }
    };

    loadProducts();
})();
