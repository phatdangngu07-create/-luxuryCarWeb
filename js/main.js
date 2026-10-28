const hero = document.querySelector("#home");
const heroVideo = hero?.querySelector(".hero-media video");

if (hero && heroVideo && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.setTimeout(() => {
        heroVideo.play().then(() => {
            hero.classList.add("is-playing");
        }).catch((error) => {
            console.error("Không thể phát video siêu xe:", error);
        });
    }, 3000);

    heroVideo.addEventListener("ended", () => {
        hero.classList.remove("is-playing");
        heroVideo.currentTime = 0;
    });

    heroVideo.addEventListener("error", () => {
        console.error("Không thể tải video siêu xe:", heroVideo.error);
    });
}

const vehicleDetails = {
    revuelto: {
        name: "Lamborghini Revuelto",
        brand: "Lamborghini",
        year: "2023",
        engine: "V12 6,5 lít plug-in hybrid",
        power: "1.015 CV",
        torque: "725 Nm (động cơ V12)",
        speed: "Trên 350 km/h",
        acceleration: "2,5 giây",
        highlight: "Hệ truyền động kết hợp động cơ V12 hút khí tự nhiên với ba mô-tơ điện, tạo nên tổng công suất công bố 1.015 CV.",
        technology: "Kiến trúc plug-in hybrid kết hợp động cơ đốt trong đặt giữa với các mô-tơ điện và pin sạc.",
        source: "https://www.lamborghini.com/en-en/models/revuelto"
    },
    "huracan-tecnica": {
        name: "Lamborghini Huracán Tecnica",
        brand: "Lamborghini",
        year: "2022",
        engine: "V10 5,2 lít hút khí tự nhiên",
        power: "640 CV",
        torque: "565 Nm",
        speed: "325 km/h",
        acceleration: "3,2 giây",
        highlight: "Phiên bản V10 dẫn động cầu sau cân bằng giữa khả năng vận hành trên đường phố và cảm hứng từ đường đua.",
        technology: "Động cơ V10 hút khí tự nhiên kết hợp hộp số ly hợp kép 7 cấp và hệ thống lái bánh sau.",
        source: "https://www.lamborghini.com/en-en/models/huracan/huracan-tecnica"
    },
    "296-gtb": {
        name: "Ferrari 296 GTB",
        brand: "Ferrari",
        year: "2021",
        engine: "V6 3,0 lít tăng áp kép plug-in hybrid",
        power: "830 CV",
        torque: "740 Nm",
        speed: "Trên 330 km/h",
        acceleration: "2,9 giây",
        highlight: "Cấu hình berlinetta hai chỗ kết hợp động cơ V6 tăng áp với mô-tơ điện trong hệ truyền động plug-in hybrid.",
        technology: "Hệ thống hybrid có thể vận hành thuần điện trong quãng ngắn; thông số phụ thuộc điều kiện và phiên bản.",
        source: "https://www.ferrari.com/en-EN/auto/296-gtb"
    },
    "sf90-stradale": {
        name: "Ferrari SF90 Stradale",
        brand: "Ferrari",
        year: "2019",
        engine: "V8 4,0 lít tăng áp kép plug-in hybrid",
        power: "1.000 CV",
        torque: "800 Nm",
        speed: "340 km/h",
        acceleration: "2,5 giây",
        highlight: "Mẫu berlinetta plug-in hybrid dẫn động bốn bánh, kết hợp động cơ V8 tăng áp kép và ba mô-tơ điện.",
        technology: "Hệ thống điện hóa hỗ trợ phân bổ lực kéo và tăng cường hiệu suất của động cơ V8.",
        source: "https://www.ferrari.com/en-EN/auto/sf90-stradale"
    },
    "750s": {
        name: "McLaren 750S",
        brand: "McLaren",
        year: "2023",
        engine: "V8 4,0 lít tăng áp kép",
        power: "750 PS",
        torque: "800 Nm",
        speed: "332 km/h",
        acceleration: "2,8 giây",
        highlight: "Triết lý trọng lượng nhẹ, bố trí động cơ giữa và hệ thống treo tập trung vào phản hồi của người lái.",
        technology: "Động cơ V8 tăng áp kép kết hợp khung gầm sợi carbon và hệ thống treo điều khiển thủy lực.",
        source: "https://cars.mclaren.com/en/750s"
    },
    "911-turbo-s": {
        name: "Porsche 911 Turbo S",
        brand: "Porsche",
        year: "2020",
        engine: "Động cơ boxer 6 xi-lanh 3,7 lít tăng áp kép",
        power: "650 PS",
        torque: "800 Nm",
        speed: "330 km/h",
        acceleration: "2,7 giây",
        highlight: "Mẫu 911 hiệu suất cao kết hợp khả năng tăng tốc mạnh với cấu hình grand touring sử dụng hàng ngày.",
        technology: "Động cơ boxer đặt phía sau, hộp số PDK 8 cấp và hệ dẫn động bốn bánh.",
        source: "https://www.porsche.com/usa/models/911/911-turbo-models/911-turbo-s/"
    },
    chiron: {
        name: "Bugatti Chiron",
        brand: "Bugatti",
        year: "2016",
        engine: "W16 8,0 lít tăng áp bốn",
        power: "1.500 PS",
        torque: "1.600 Nm",
        speed: "Tối đa 420 km/h (tùy phiên bản)",
        acceleration: "2,4 giây",
        highlight: "Hypercar grand touring sử dụng động cơ W16 tăng áp bốn và được chế tác với mức độ cá nhân hóa cao.",
        technology: "Hệ thống làm mát, truyền động bốn bánh và lốp chuyên dụng được thiết kế để đáp ứng mức hiệu năng rất cao.",
        source: "https://www.bugatti.com/models/chiron-models/chiron/"
    },
    db12: {
        name: "Aston Martin DB12",
        brand: "Aston Martin",
        year: "2023",
        engine: "V8 4,0 lít tăng áp kép",
        power: "680 PS",
        torque: "800 Nm",
        speed: "325 km/h",
        acceleration: "3,6 giây",
        highlight: "Grand tourer hiệu suất cao kết hợp động cơ V8 tăng áp kép với nội thất hướng đến hành trình dài.",
        technology: "Khung gầm và hệ thống treo điện tử được tinh chỉnh để cân bằng sự thoải mái và khả năng kiểm soát.",
        source: "https://www.astonmartin.com/en/models/db12"
    }
};

const carDetailPage = document.querySelector("#carDetail");
if (carDetailPage) {
    const requestedCar = new URLSearchParams(window.location.search).get("car") || "revuelto";
    const detail = vehicleDetails[requestedCar];
    const detailError = document.querySelector("#detailError");

    if (!detail) {
        detailError.hidden = false;
        detailError.textContent = "Không tìm thấy mẫu xe này. Hãy quay lại thư viện để chọn một mẫu xe có sẵn.";
        carDetailPage.querySelectorAll("[data-detail-section]").forEach((section) => {
            section.hidden = true;
        });
    } else {
        const detailFields = {
            "[data-detail-name]": detail.name,
            "[data-detail-brand]": detail.brand,
            "[data-detail-year]": detail.year,
            "[data-detail-engine]": detail.engine,
            "[data-detail-power]": detail.power,
            "[data-detail-torque]": detail.torque,
            "[data-detail-speed]": detail.speed,
            "[data-detail-acceleration]": detail.acceleration,
            "[data-detail-highlight]": detail.highlight,
            "[data-detail-technology]": detail.technology
        };

        Object.entries(detailFields).forEach(([selector, value]) => {
            carDetailPage.querySelector(selector).textContent = value;
        });
        carDetailPage.querySelectorAll("[data-detail-image]").forEach((image) => {
            image.alt = `Ảnh minh họa ${detail.name}`;
        });
        const sourceLink = carDetailPage.querySelector("[data-detail-source]");
        sourceLink.href = detail.source;
        document.title = `${detail.name} - Luxury Cars`;
    }
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
