(() => {
    const storageKey = "luxuryCarsProducts";
    const fallbackImage = "/assets/images/lamboghini.jpg";
    const defaultProducts = [
        {
            id: "revuelto",
            name: "Revuelto",
            brand: "Lamborghini",
            engine: "Hybrid V12",
            segment: "Hypercar",
            speed: 350,
            power: 1015,
            year: 2023,
            description: "Siêu xe thể thao với thiết kế góc cạnh và phong cách đặc trưng của Lamborghini.",
            image: fallbackImage,
            detailId: "revuelto"
        },
        {
            id: "huracan-tecnica",
            name: "Huracán",
            brand: "Lamborghini",
            engine: "V10",
            segment: "Supercar",
            speed: 325,
            power: 640,
            year: 2022,
            description: "Dòng xe nổi bật với dáng vẻ thể thao, đường nét sắc sảo và trải nghiệm lái giàu cảm xúc.",
            image: fallbackImage,
            detailId: "huracan-tecnica"
        },
        {
            id: "296-gtb",
            name: "296 GTB",
            brand: "Ferrari",
            engine: "Hybrid V6",
            segment: "Supercar",
            speed: 330,
            power: 830,
            year: 2021,
            description: "Mẫu berlinetta hai chỗ mang ngôn ngữ thiết kế hiện đại và dấu ấn đặc trưng của Ferrari.",
            image: fallbackImage,
            detailId: "296-gtb"
        },
        {
            id: "sf90-stradale",
            name: "SF90 Stradale",
            brand: "Ferrari",
            engine: "Hybrid V8",
            segment: "Hypercar",
            speed: 340,
            power: 1000,
            year: 2019,
            description: "Siêu xe mang phong cách khí động học cùng thiết kế giàu tính biểu tượng của Ferrari.",
            image: fallbackImage,
            detailId: "sf90-stradale"
        },
        {
            id: "750s",
            name: "750S",
            brand: "McLaren",
            engine: "V8",
            segment: "Supercar",
            speed: 332,
            power: 750,
            year: 2023,
            description: "Thiết kế nhẹ và tối giản kết hợp với diện mạo đậm chất xe thể thao Anh Quốc.",
            image: fallbackImage,
            detailId: "750s"
        },
        {
            id: "911-turbo-s",
            name: "911 Turbo S",
            brand: "Porsche",
            engine: "Flat-6",
            segment: "Supercar",
            speed: 330,
            power: 650,
            year: 2020,
            description: "Thiết kế 911 kinh điển kết hợp dáng vẻ mạnh mẽ của phiên bản Turbo S.",
            image: fallbackImage,
            detailId: "911-turbo-s"
        },
        {
            id: "chiron",
            name: "Chiron",
            brand: "Bugatti",
            engine: "W16",
            segment: "Hypercar",
            speed: 420,
            power: 1500,
            year: 2016,
            description: "Mẫu grand tourer hiệu suất cao gây ấn tượng bởi tỷ lệ thiết kế và sự chăm chút thủ công.",
            image: fallbackImage,
            detailId: "chiron"
        },
        {
            id: "db12",
            name: "DB12",
            brand: "Aston Martin",
            engine: "V8",
            segment: "Grand tourer",
            speed: 325,
            power: 680,
            year: 2023,
            description: "Grand tourer kết hợp phong thái thanh lịch với dáng vẻ thể thao hiện đại.",
            image: fallbackImage,
            detailId: "db12"
        }
    ];

    const validateProducts = (products) => {
        if (!Array.isArray(products) || products.some((product) =>
            !product ||
            typeof product.id !== "string" ||
            typeof product.name !== "string" ||
            typeof product.brand !== "string" ||
            typeof product.engine !== "string" ||
            typeof product.segment !== "string" ||
            typeof product.description !== "string" ||
            typeof product.image !== "string" ||
            !Number.isFinite(Number(product.year)) ||
            !Number.isFinite(Number(product.speed)) ||
            !Number.isFinite(Number(product.power))
        )) {
            throw new Error("Dữ liệu sản phẩm trong trình duyệt không hợp lệ.");
        }

        return products;
    };

    const getProducts = () => {
        const savedProducts = localStorage.getItem(storageKey);
        if (savedProducts === null) {
            saveProducts(defaultProducts);
            return defaultProducts.map((product) => ({ ...product }));
        }

        return validateProducts(JSON.parse(savedProducts));
    };

    const saveProducts = (products) => {
        localStorage.setItem(storageKey, JSON.stringify(validateProducts(products)));
    };

    const renderCollection = () => {
        const grid = document.querySelector("#collectionCarGrid");
        if (!grid) {
            return;
        }

        const products = getProducts();
        const knownDetails = new Set(defaultProducts.map((product) => product.detailId));
        grid.replaceChildren();

        products.forEach((product) => {
            const item = document.createElement("div");
            item.className = "col-12 col-sm-6 col-lg-3";
            item.dataset.carItem = "";
            item.dataset.brand = product.brand;
            item.dataset.engine = product.engine.toLocaleLowerCase("en").replace("flat-6", "flat6");
            item.dataset.segment = {
                Supercar: "supercar",
                Hypercar: "hypercar",
                "Grand tourer": "gt"
            }[product.segment] || product.segment.toLocaleLowerCase("en");
            item.dataset.speed = String(product.speed);
            item.dataset.power = String(product.power);
            item.dataset.year = String(product.year);

            const card = document.createElement("article");
            card.className = "card h-100 shadow-sm";
            card.dataset.carCard = "";

            const image = document.createElement("img");
            image.className = "card-img-top";
            image.src = product.image || fallbackImage;
            image.alt = `Ảnh minh họa ${product.brand} ${product.name}`;
            image.loading = "lazy";
            image.addEventListener("error", () => {
                if (image.dataset.fallbackAttempted) {
                    return;
                }
                image.dataset.fallbackAttempted = "true";
                image.src = fallbackImage;
            });

            const body = document.createElement("div");
            body.className = "card-body d-flex flex-column";

            const brand = document.createElement("p");
            brand.className = "car-brand-label";
            brand.textContent = product.brand;

            const title = document.createElement("h2");
            title.className = "card-title h4";
            title.textContent = product.name;

            const description = document.createElement("p");
            description.className = "card-text text-secondary";
            description.textContent = product.description;

            const link = document.createElement("a");
            link.className = "btn btn-danger mt-auto align-self-start";
            link.textContent = "Xem chi tiết";
            link.href = product.detailId && knownDetails.has(product.detailId)
                ? `car_detail.html?car=${encodeURIComponent(product.detailId)}`
                : `collection.html?search=${encodeURIComponent(product.name)}`;

            body.append(brand, title, description, link);
            card.append(image, body);
            item.append(card);
            grid.append(item);
        });

        const brandFilter = document.querySelector("#brandFilter");
        if (brandFilter) {
            const knownBrands = new Set([...brandFilter.options].map((option) => option.value));
            [...new Set(products.map((product) => product.brand))].forEach((brand) => {
                if (knownBrands.has(brand)) {
                    return;
                }
                const option = document.createElement("option");
                option.value = brand;
                option.textContent = brand;
                brandFilter.append(option);
            });
        }
    };

    window.LuxuryCarsProducts = { storageKey, defaultProducts, getProducts, saveProducts };

    try {
        renderCollection();
    } catch (error) {
        console.error("Không thể tải danh mục siêu xe đã lưu:", error);
    }
})();
