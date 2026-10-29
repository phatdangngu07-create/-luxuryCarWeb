(() => {
    const productsEndpoint = `${window.LUXURY_CARS_API_URL || "http://localhost:3000"}/products`;
    const fallbackImage = "/assets/images/lamboghini.jpg";
    const carImages = {
        revuelto: {
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Lamborghini_Revuelto_DSC_6984.jpg/1280px-Lamborghini_Revuelto_DSC_6984.jpg",
            imageCredit: "Alexander Migl",
            imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Lamborghini_Revuelto_DSC_6984.jpg"
        },
        "huracan-tecnica": {
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Lamborghini_Huracan_Tecnica.jpg/1280px-Lamborghini_Huracan_Tecnica.jpg",
            imageCredit: "MrWalkr",
            imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Lamborghini_Huracan_Tecnica.jpg"
        },
        "296-gtb": {
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Ferrari_296_GTB_1X7A6377.jpg/1280px-Ferrari_296_GTB_1X7A6377.jpg",
            imageCredit: "Alexander Migl",
            imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Ferrari_296_GTB_1X7A6377.jpg"
        },
        "sf90-stradale": {
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/2021_Ferrari_SF90_Stradale_3.jpg/1280px-2021_Ferrari_SF90_Stradale_3.jpg",
            imageCredit: "Calreyn88",
            imageCreditUrl: "https://commons.wikimedia.org/wiki/File:2021_Ferrari_SF90_Stradale_3.jpg"
        },
        "750s": {
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/2024_McLaren_750S_2.jpg/1280px-2024_McLaren_750S_2.jpg",
            imageCredit: "Calreyn88",
            imageCreditUrl: "https://commons.wikimedia.org/wiki/File:2024_McLaren_750S_2.jpg"
        },
        "911-turbo-s": {
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Porsche_992_Turbo_S_1X7A0363.jpg/1280px-Porsche_992_Turbo_S_1X7A0363.jpg",
            imageCredit: "Alexander Migl",
            imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Porsche_992_Turbo_S_1X7A0363.jpg"
        },
        chiron: {
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Bugatti_Chiron%2C_GIMS_2018%2C_Le_Grand-Saconnex_%281X7A1765%29.jpg/1280px-Bugatti_Chiron%2C_GIMS_2018%2C_Le_Grand-Saconnex_%281X7A1765%29.jpg",
            imageCredit: "Matti Blume",
            imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Bugatti_Chiron,_GIMS_2018,_Le_Grand-Saconnex_(1X7A1765).jpg"
        },
        db12: {
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Aston_Martin_DB12_1X7A1921.jpg/1280px-Aston_Martin_DB12_1X7A1921.jpg",
            imageCredit: "Alexander-93",
            imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Aston_Martin_DB12_1X7A1921.jpg"
        }
    };
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
            ...carImages.revuelto,
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
            ...carImages["huracan-tecnica"],
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
            ...carImages["296-gtb"],
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
            ...carImages["sf90-stradale"],
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
            ...carImages["750s"],
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
            ...carImages["911-turbo-s"],
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
            ...carImages.chiron,
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
            ...carImages.db12,
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

    const request = async (url = productsEndpoint, options) => {
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options?.headers
            }
        });
        if (!response.ok) {
            throw new Error(`JSON Server trả về lỗi HTTP ${response.status}.`);
        }

        if (response.status === 204) {
            return null;
        }
        return response.json();
    };

    const getProducts = async () => validateProducts(await request());
    const createProduct = async (product) => {
        const newProduct = { ...product };
        delete newProduct.id;
        return request(productsEndpoint, {
            method: "POST",
            body: JSON.stringify(newProduct)
        });
    };
    const updateProduct = async (product) => request(`${productsEndpoint}/${encodeURIComponent(product.id)}`, {
        method: "PUT",
        body: JSON.stringify(product)
    });
    const deleteProduct = async (productId) => request(`${productsEndpoint}/${encodeURIComponent(productId)}`, {
        method: "DELETE"
    });

    const showCollectionError = (error) => {
        console.error("Không thể tải danh mục siêu xe từ JSON Server:", error);
        document.querySelector("#collectionCarGrid")?.replaceChildren();
        const status = document.querySelector("#collectionSearchStatus");
        if (status) {
            status.hidden = false;
            status.textContent = `Không thể tải danh mục xe. Hãy đảm bảo JSON Server đang chạy: ${error.message}`;
            status.setAttribute("role", "alert");
        }
    };

    const renderCollection = async () => {
        const grid = document.querySelector("#collectionCarGrid");
        if (!grid) {
            return;
        }

        const products = await getProducts();
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

            const imageCredit = document.createElement("small");
            imageCredit.className = "d-block px-3 pt-2 text-secondary";
            if (product.imageCredit && product.imageCreditUrl) {
                const creditLink = document.createElement("a");
                creditLink.href = product.imageCreditUrl;
                creditLink.target = "_blank";
                creditLink.rel = "noopener noreferrer";
                creditLink.textContent = `Ảnh: ${product.imageCredit}`;

                const licenseLink = document.createElement("a");
                licenseLink.href = "https://creativecommons.org/licenses/by-sa/4.0/";
                licenseLink.target = "_blank";
                licenseLink.rel = "noopener noreferrer";
                licenseLink.textContent = "CC BY-SA 4.0";

                imageCredit.append(creditLink, document.createTextNode(" · "), licenseLink);
                image.addEventListener("error", () => {
                    imageCredit.hidden = true;
                }, { once: true });
            }

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
            link.href = `car_detail.html?id=${encodeURIComponent(product.id)}`;

            body.append(brand, title, description, link);
            card.append(image);
            if (imageCredit.childNodes.length) {
                card.append(imageCredit);
            }
            card.append(body);
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

        document.dispatchEvent(new CustomEvent("luxurycars:products-loaded"));
    };

    window.LuxuryCarsProducts = {
        defaultProducts,
        getProducts,
        createProduct,
        updateProduct,
        deleteProduct
    };

    renderCollection().catch(showCollectionError);
})();
