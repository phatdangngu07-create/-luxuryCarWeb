const hero = document.querySelector("#home");
const heroVideo = hero?.querySelector(".hero-media video");

if (hero && heroVideo && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const playHeroVideo = () => {
        heroVideo.play().catch((error) => {
            console.error("Không thể phát video siêu xe:", error);
        });
    };

    heroVideo.addEventListener("playing", () => {
        hero.classList.add("is-playing");
    });
    playHeroVideo();

    heroVideo.addEventListener("ended", () => {
        hero.classList.remove("is-playing");
        heroVideo.currentTime = 0;
        window.setTimeout(playHeroVideo, 3000);
    });

    heroVideo.addEventListener("error", () => {
        console.error("Không thể tải video siêu xe:", heroVideo.error);
    });
}

const carDetailPage = document.querySelector("#carDetail");
if (carDetailPage) {
    const detailError = document.querySelector("#detailError");
    const detailSections = carDetailPage.querySelectorAll("[data-detail-section]");
    const requestedCar = new URLSearchParams(window.location.search).get("id")
        || new URLSearchParams(window.location.search).get("car")
        || "revuelto";
    const apiUrl = window.LUXURY_CARS_API_URL || "http://localhost:3000";
    const fallbackImage = "/assets/images/lamboghini.jpg";

    detailSections.forEach((section) => {
        section.hidden = true;
    });
    detailError.hidden = false;
    detailError.textContent = "Đang tải thông tin mẫu xe...";
    detailError.setAttribute("role", "status");

    const fetchRecord = async (collection, id, optional = false) => {
        const response = await fetch(`${apiUrl}/${collection}/${encodeURIComponent(id)}`);
        if (optional && response.status === 404) {
            return null;
        }
        if (!response.ok) {
            throw new Error(response.status === 404
                ? `Không tìm thấy mẫu xe có id "${id}".`
                : `JSON Server trả về lỗi HTTP ${response.status}.`);
        }
        return response.json();
    };

    const renderCarDetail = async () => {
        const [product, detail] = await Promise.all([
            fetchRecord("products", requestedCar),
            fetchRecord("vehicleDetails", requestedCar, true)
        ]);
        if (!product || typeof product !== "object") {
            throw new Error(`Không tìm thấy mẫu xe có id "${requestedCar}".`);
        }

        const values = {
            "[data-detail-name]": detail?.name || `${product.brand} ${product.name}`,
            "[data-detail-brand]": product.brand,
            "[data-detail-year]": detail?.year || product.year,
            "[data-detail-engine]": detail?.engine || product.engine || "Đang cập nhật",
            "[data-detail-power]": detail?.power || `${product.power} CV`,
            "[data-detail-torque]": detail?.torque || "Đang cập nhật",
            "[data-detail-speed]": detail?.speed || `${product.speed} km/h`,
            "[data-detail-acceleration]": detail?.acceleration || "Đang cập nhật",
            "[data-detail-highlight]": detail?.highlight || product.description || "Đang cập nhật",
            "[data-detail-technology]": detail?.technology || product.description || "Đang cập nhật"
        };

        Object.entries(values).forEach(([selector, value]) => {
            carDetailPage.querySelector(selector).textContent = String(value);
        });

        const image = carDetailPage.querySelector("[data-detail-image]");
        image.src = product.image || fallbackImage;
        image.alt = `Ảnh minh họa ${product.brand} ${product.name}`;
        image.addEventListener("error", () => {
            if (image.src.endsWith(fallbackImage)) {
                return;
            }
            image.src = fallbackImage;
        }, { once: true });

        const imageCredit = carDetailPage.querySelector("[data-detail-image-credit]");
        const imageLicense = carDetailPage.querySelector("[data-detail-image-license]");
        if (product.imageCredit && product.imageCreditUrl) {
            imageCredit.href = product.imageCreditUrl;
            imageCredit.textContent = `Ảnh: ${product.imageCredit}`;
            imageLicense.hidden = false;
            image.addEventListener("error", () => {
                imageCredit.hidden = true;
                imageLicense.hidden = true;
            }, { once: true });
        } else {
            imageCredit.hidden = true;
            imageLicense.hidden = true;
        }

        const sourceLink = carDetailPage.querySelector("[data-detail-source]");
        if (detail?.source) {
            sourceLink.href = detail.source;
            sourceLink.hidden = false;
        } else {
            sourceLink.hidden = true;
        }

        detailError.hidden = true;
        detailSections.forEach((section) => {
            section.hidden = false;
        });
        document.title = `${values["[data-detail-name]"]} - Luxury Cars`;
    };

    renderCarDetail().catch((error) => {
        console.error("Không thể tải thông tin chi tiết xe:", error);
        detailError.hidden = false;
        detailError.setAttribute("role", "alert");
        detailError.textContent = `Không thể tải thông tin mẫu xe. Hãy đảm bảo JSON Server đang chạy: ${error.message}`;
    });
}

const collectionParams = new URLSearchParams(window.location.search);
const collectionSearch = collectionParams.get("search") || "";
const searchInput = document.querySelector(".navbar-search input[name='search']");

if (collectionSearch && searchInput) {
    searchInput.value = collectionSearch;
}

const brandFilter = document.querySelector("#brandFilter");
const engineFilter = document.querySelector("#engineFilter");
const segmentFilter = document.querySelector("#segmentFilter");
const sortCars = document.querySelector("#sortCars");
const collectionFilters = [brandFilter, engineFilter, segmentFilter, sortCars].filter(Boolean);
const requestedBrand = collectionParams.get("brand") || "";
const requestedEngine = collectionParams.get("engine") || "";
const requestedSegment = collectionParams.get("segment") || "";
const requestedSort = collectionParams.get("sort") || "";

if (brandFilter && requestedBrand) {
    brandFilter.value = requestedBrand;
}
if (engineFilter && requestedEngine) {
    engineFilter.value = requestedEngine;
}
if (segmentFilter && requestedSegment) {
    segmentFilter.value = requestedSegment;
}
if (sortCars && requestedSort) {
    sortCars.value = requestedSort;
}

const collectionGrid = document.querySelector("#collectionCarGrid");
if (collectionGrid) {
    const status = document.querySelector("#collectionSearchStatus");

    const updateCollection = () => {
        const carItems = [...collectionGrid.querySelectorAll("[data-car-item]")];
        const query = collectionSearch.trim().toLocaleLowerCase("vi");
        const brand = brandFilter?.value || "";
        const engine = engineFilter?.value || "";
        const segment = segmentFilter?.value || "";
        const visibleItems = carItems.filter((item) => {
            const card = item.querySelector("[data-car-card]");
            const matchesSearch = !query || card.textContent.toLocaleLowerCase("vi").includes(query);
            const matchesBrand = !brand || item.dataset.brand === brand;
            const matchesEngine = !engine || item.dataset.engine.split(" ").includes(engine);
            const matchesSegment = !segment || item.dataset.segment === segment;

            item.hidden = !(matchesSearch && matchesBrand && matchesEngine && matchesSegment);
            return matchesSearch && matchesBrand && matchesEngine && matchesSegment;
        });

        const sortKey = sortCars?.value;
        if (sortKey) {
            const sortedItems = [...carItems].sort((first, second) =>
                Number(second.dataset[sortKey]) - Number(first.dataset[sortKey])
            );
            sortedItems.forEach((item) => collectionGrid.append(item));
        } else {
            carItems.forEach((item) => collectionGrid.append(item));
        }

        const hasFilters = query || brand || engine || segment;
        if (status) {
            status.hidden = !hasFilters;
            status.textContent = visibleItems.length
                ? `Tìm thấy ${visibleItems.length} mẫu xe phù hợp.`
                : "Không tìm thấy mẫu xe phù hợp. Hãy thử thay đổi điều kiện tìm kiếm.";
        }
    };

    collectionFilters.forEach((filter) => filter.addEventListener("change", updateCollection));
    updateCollection();
    document.addEventListener("luxurycars:products-loaded", updateCollection);
}


// =========================================================
// 3D CAR SHOWROOM INTERACTIVE LOGIC
// =========================================================
const carViewer = document.querySelector("#carViewer");
if (carViewer) {
    // Lưu màu đang được chọn
    let selectedColor = null;
    const initialActiveDot = document.querySelector(".color-dot.active");
    if (initialActiveDot && initialActiveDot.dataset.color) {
        selectedColor = initialActiveDot.dataset.color.split(",").map(Number);
    }

    // Hàm nhận diện thông minh vật liệu sơn xe cho mọi mô hình (Porsche, Ferrari, Lamborghini...)
    const isPaintMaterial = (mat) => {
        const name = (mat.name || "").toLowerCase();
        // Loại trừ các bộ phận không phải vỏ sơn xe
        if (/(glass|window|windshield|tire|tyre|wheel|rim|interior|seat|carbon|leather|chrome|disc|caliper|brake|plate|license|grid|grill|carpet|plastic|light|lamp|lens|mirror|emiss|details|engine|exhaust|underside)/i.test(name)) {
            return false;
        }
        // Khớp các từ khóa thường dùng cho sơn vỏ xe
        return /(carpaint|paint|body|chassis|exterior|coat|shell|karosserie|color|colour)/i.test(name);
    };

    const applyCarColor = (colorValues) => {
        if (!carViewer.model || !carViewer.model.materials) return;

        // Tìm tất cả vật liệu sơn xe phù hợp
        let targetMaterials = carViewer.model.materials.filter(isPaintMaterial);

        // Fallback: nếu mô hình đặt tên đặc biệt, lọc các vật liệu kim loại không phải kính/lốp
        if (targetMaterials.length === 0) {
            targetMaterials = carViewer.model.materials.filter((mat) => {
                const name = (mat.name || "").toLowerCase();
                return !/(glass|window|tire|tyre|wheel|rim|rubber|light|lens|license|plate)/i.test(name) && mat.pbrMetallicRoughness;
            });
        }

        console.log("🎨 Đã áp dụng màu sơn cho các vật liệu:", targetMaterials.map(m => m.name));

        targetMaterials.forEach((mat) => {
            if (mat.pbrMetallicRoughness) {
                mat.pbrMetallicRoughness.setBaseColorFactor(colorValues);
            }
            // Đồng bộ ánh xạ phát xạ nếu có
            if (typeof mat.setEmissiveFactor === "function") {
                mat.setEmissiveFactor([colorValues[0] * 0.1, colorValues[1] * 0.1, colorValues[2] * 0.1]);
            }
        });
    };

    // Khi mô hình 3D tải xong, áp dụng màu đang chọn
    carViewer.addEventListener("load", () => {
        console.log("🚗 Mô hình 3D đã tải xong. Danh sách vật liệu:", carViewer.model.materials.map(m => m.name));
        if (selectedColor) {
            applyCarColor(selectedColor);
        }
    });

    // Bắt sự kiện click chọn màu sơn ngoại thất
    const colorDots = document.querySelectorAll(".color-dot");
    colorDots.forEach((dot) => {
        dot.addEventListener("click", () => {
            colorDots.forEach((d) => d.classList.remove("active"));
            dot.classList.add("active");
            if (dot.dataset.color) {
                selectedColor = dot.dataset.color.split(",").map(Number);
                applyCarColor(selectedColor);
            }
        });
    });
}
