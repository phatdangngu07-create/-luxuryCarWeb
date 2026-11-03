// Điều khiển các tương tác dùng chung trên trang chủ, thư viện xe và hồ sơ xe.
// Phần tử được truy vấn theo ID để đoạn mã chỉ chạy ở trang có thành phần tương ứng.

// Phát lại video hero trên trang chủ; tôn trọng tùy chọn giảm chuyển động của người dùng.
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

// Tải và dựng các thẻ xe được đánh dấu nổi bật trong dữ liệu JSON.
const featuredProductsGrid = document.querySelector("#featuredProductsGrid");
if (featuredProductsGrid) {
    const featuredProductsStatus = document.querySelector("#featuredProductsStatus");
    const fallbackImage = "/assets/images/lamboghini.jpg";

    const createFeaturedCard = (product) => {
        const column = document.createElement("div");
        column.className = "col-md-4";

        const card = document.createElement("article");
        card.className = "feature-card";

        const image = document.createElement("img");
        image.src = product.image || fallbackImage;
        image.alt = `Ảnh minh họa ${product.brand} ${product.name}`.trim();
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
        body.className = "feature-card-body";

        const brand = document.createElement("p");
        brand.className = "car-brand-label";
        brand.textContent = String(product.brand || "");

        const title = document.createElement("h3");
        title.textContent = String(product.name || "");

        const description = document.createElement("p");
        description.textContent = String(product.description || "");

        const detailLink = document.createElement("a");
        detailLink.className = "card-text-link";
        detailLink.href = `car_detail.html?id=${encodeURIComponent(product.id)}`;
        detailLink.append("Xem thông tin chi tiết ", document.createTextNode("\u2192"));

        body.append(brand, title, description, detailLink);
        card.append(image, body);
        column.append(card);
        return column;
    };

    const loadFeaturedProducts = async () => {
        try {
            const products = await window.LuxuryCarsProducts.getProducts();
            const featuredProducts = products.filter((product) => product.featured === true);
            featuredProductsGrid.replaceChildren(...featuredProducts.map(createFeaturedCard));

            if (featuredProductsStatus) {
                featuredProductsStatus.hidden = featuredProducts.length > 0;
                featuredProductsStatus.textContent = featuredProducts.length
                    ? ""
                    : "Chưa có mẫu xe nổi bật. Hãy đánh dấu xe là nổi bật trong dữ liệu JSON.";
            }
        } catch (error) {
            console.error("Không thể tải danh sách xe nổi bật:", error);
            if (featuredProductsStatus) {
                featuredProductsStatus.hidden = false;
                featuredProductsStatus.setAttribute("role", "alert");
                featuredProductsStatus.textContent = `Không thể tải xe nổi bật. Hãy đảm bảo JSON Server đang chạy: ${error.message}`;
            }
        }
    };

    loadFeaturedProducts();
}

// Tải ba tin thị trường mới nhất cho khu vực tin tức xem trước trên trang chủ.
(() => {
    const journalGrid = document.querySelector("#homeJournalGrid");
    const journalStatus = document.querySelector("#homeJournalStatus");
    if (!journalGrid || !journalStatus) return;

    const feedUrl = "https://vnexpress.net/rss/oto-xe-may.rss";
    const feedApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
    const marketKeywords = /thị trường|doanh số|doanh thu|bán chạy|giá xe|giá bán|giảm giá|tăng giá|mở bán|ra mắt|xe mới|xe điện|điện hóa|hybrid|mẫu xe|hãng xe|bàn giao|nhà máy|lắp ráp|nhập khẩu|sản lượng|ô tô điện|xe hybrid/i;
    const trafficIncidentKeywords = /tai nạn|đâm liên hoàn|va chạm|tông trúng|mất lái|cháy xe|cao tốc/i;

    // Chuyển phần mô tả RSS có HTML/entity thành văn bản thuần để hiển thị an toàn.
    const cleanText = (value) => {
        let text = String(value || "");
        for (let attempt = 0; attempt < 3; attempt += 1) {
            const parsed = new DOMParser().parseFromString(text, "text/html");
            parsed.querySelectorAll("img, a").forEach((element) => {
                if (element.tagName === "IMG") {
                    element.remove();
                } else {
                    element.replaceWith(document.createTextNode(element.textContent || ""));
                }
            });
            const decoded = (parsed.body.textContent || "").replace(/\s+/g, " ").trim();
            if (decoded === text || !/&(?:amp|lt|gt|quot|#\d+);/i.test(decoded)) return decoded;
            text = decoded;
        }
        return text;
    };

    // Tạo thẻ tin với nguồn, ngày đăng, tóm tắt và liên kết tới trang bài viết.
    const createNewsCard = (article) => {
        const column = document.createElement("div");
        column.className = "col-md-4";

        const card = document.createElement("article");
        card.className = "editorial-card";

        const category = document.createElement("span");
        category.className = "editorial-category";
        category.textContent = `TIN MỚI · ${article.source}`;

        const heading = document.createElement("h3");
        heading.textContent = article.title;

        const published = new Date(article.pubDate);
        if (!Number.isNaN(published.getTime())) {
            const time = document.createElement("time");
            time.className = "editorial-published-date";
            time.dateTime = published.toISOString();
            time.textContent = new Intl.DateTimeFormat("vi-VN", {
                dateStyle: "medium",
                timeStyle: "short"
            }).format(published);
            card.append(category, heading, time);
        } else {
            card.append(category, heading);
        }

        const summary = document.createElement("p");
        summary.textContent = article.summary || "Mở bài viết để xem tóm tắt và thông tin từ nguồn tin.";

        const link = document.createElement("a");
        link.className = "card-text-link";
        link.href = `journal.html?article=${encodeURIComponent(article.link)}`;
        link.textContent = "Xem nội dung ";
        link.append(document.createTextNode("\u2192"));

        card.append(summary, link);
        column.append(card);
        return column;
    };

    // Lấy feed, lọc tin xe liên quan và hiển thị thông báo lỗi/rỗng phù hợp.
    const loadLatestNews = async () => {
        try {
            const response = await fetch(feedApiUrl, { cache: "no-store" });
            if (!response.ok) {
                throw new Error(`Nguồn tin trả về lỗi HTTP ${response.status}.`);
            }

            const feed = await response.json();
            if (feed.status !== "ok" || !Array.isArray(feed.items)) {
                throw new Error("Nguồn tin không trả về danh sách bài viết hợp lệ.");
            }

            const articles = feed.items
                .map((item) => {
                    let link;
                    try {
                        const url = new URL(item.link);
                        if (url.protocol !== "https:") return null;
                        link = url.href;
                    } catch {
                        return null;
                    }

                    let source = "VnExpress";
                    try {
                        source = new URL(link).hostname.replace(/^www\./, "");
                    } catch {
                        // Keep the readable default source name.
                    }

                    return {
                        link,
                        title: cleanText(item.title) || "Tin tức thị trường xe",
                        summary: cleanText(item.description),
                        pubDate: item.pubDate,
                        source
                    };
                })
                .filter((article) => {
                    if (!article) return false;
                    const searchableText = `${article.title} ${article.summary}`;
                    return marketKeywords.test(searchableText) && !trafficIncidentKeywords.test(searchableText);
                })
                .sort((first, second) => new Date(second.pubDate) - new Date(first.pubDate))
                .slice(0, 3);

            if (articles.length === 0) {
                journalStatus.textContent = "Hiện chưa có tin thị trường xe phù hợp từ nguồn RSS.";
                return;
            }

            journalGrid.replaceChildren(...articles.map(createNewsCard));
            journalStatus.hidden = true;
        } catch (error) {
            console.error("Không thể tải tin mới trên trang chủ:", error);
            journalStatus.setAttribute("role", "alert");
            journalStatus.textContent = `Không thể tải tin thị trường xe. Hãy thử tải lại trang sau: ${error.message}`;
        }
    };

    loadLatestNews();
})();

// Nạp dữ liệu xe và thông tin kỹ thuật tùy chọn cho trang chi tiết theo ID URL.
const carDetailPage = document.querySelector("#carDetail");
if (carDetailPage) {
    const detailError = document.querySelector("#detailError");
    const detailSections = carDetailPage.querySelectorAll("[data-detail-section]");
    const requestedCar = new URLSearchParams(window.location.search).get("id")
        || new URLSearchParams(window.location.search).get("car")
        || "revuelto";
    const apiUrl = window.LUXURY_CARS_API_URL || "http://localhost:3000";
    const fallbackImage = "/assets/images/lamboghini.jpg";
    const galleryPhotos = {
        revuelto: [
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Lamborghini_Revuelto_DSC_6985.jpg/960px-Lamborghini_Revuelto_DSC_6985.jpg", "Alexander Migl"],
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Lamborghini_Revuelto_DSC_6987.jpg/960px-Lamborghini_Revuelto_DSC_6987.jpg", "Alexander Migl"],
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Lamborghini_Revuelto_IMG_0562.jpg/960px-Lamborghini_Revuelto_IMG_0562.jpg", "Alexander-93"]
        ],
        "huracan-tecnica": [
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/Lamborghini_Huracan_Tecnica_12.jpg/960px-Lamborghini_Huracan_Tecnica_12.jpg", "Calreyn88"],
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Lamborghini_Hurac%C3%A1n_Tecnica_1X7A7430.jpg/960px-Lamborghini_Hurac%C3%A1n_Tecnica_1X7A7430.jpg", "Alexander-93"],
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Lamborghini_Hurac%C3%A1n_Tecnica_IMG_7298.jpg/960px-Lamborghini_Hurac%C3%A1n_Tecnica_IMG_7298.jpg", "Alexander-93"]
        ],
        "296-gtb": [
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/Ferrari_296_GTB_1X7A6379.jpg/960px-Ferrari_296_GTB_1X7A6379.jpg", "Alexander Migl"],
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Ferrari_296_GTB_DSC_6997.jpg/960px-Ferrari_296_GTB_DSC_6997.jpg", "Alexander Migl"],
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Ferrari_296_GTB_DSC_7011.jpg/960px-Ferrari_296_GTB_DSC_7011.jpg", "Alexander Migl"]
        ],
        "sf90-stradale": [
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Ferrari_SF90%2C_BAS_24%2C_Brussels_%28P1170486-RR%29.jpg/960px-Ferrari_SF90%2C_BAS_24%2C_Brussels_%28P1170486-RR%29.jpg", "Matti Blume"],
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/Ferrari_SF90%2C_BAS_24%2C_Brussels_%28P1170502-RR%29.jpg/960px-Ferrari_SF90%2C_BAS_24%2C_Brussels_%28P1170502-RR%29.jpg", "Matti Blume"],
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Ferrari_SF90_Stradale_Monaco.jpg/960px-Ferrari_SF90_Stradale_Monaco.jpg", "Calreyn88"]
        ],
        "750s": [
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/2024_McLaren_750S_3.jpg/960px-2024_McLaren_750S_3.jpg", "Calreyn88"],
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/2024_McLaren_750S_4.jpg/960px-2024_McLaren_750S_4.jpg", "Calreyn88"],
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/2024_McLaren_750S_5.jpg/960px-2024_McLaren_750S_5.jpg", "Calreyn88"]
        ],
        "911-turbo-s": [
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/Porsche_992_Turbo_S_1X7A0411.jpg/960px-Porsche_992_Turbo_S_1X7A0411.jpg", "Alexander Migl"],
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Porsche_992_Turbo_S_1X7A0413.jpg/960px-Porsche_992_Turbo_S_1X7A0413.jpg", "Alexander Migl"],
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/Porsche_992_Turbo_S_1X7A6046.jpg/960px-Porsche_992_Turbo_S_1X7A6046.jpg", "Alexander Migl"]
        ],
        chiron: [
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Bugatti_Chiron%2C_IAA_2017%2C_Frankfurt_%281Y7A2855%29.jpg/960px-Bugatti_Chiron%2C_IAA_2017%2C_Frankfurt_%281Y7A2855%29.jpg", "Matti Blume"],
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Bugatti_Chiron%2C_IAA_2017%2C_Frankfurt_%281Y7A2857%29.jpg/960px-Bugatti_Chiron%2C_IAA_2017%2C_Frankfurt_%281Y7A2857%29.jpg", "Matti Blume"],
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Bugatti_Chiron_110_Ans%2C_GIMS_2019%2C_Le_Grand-Saconnex_%28GIMS9979%29.jpg/960px-Bugatti_Chiron_110_Ans%2C_GIMS_2019%2C_Le_Grand-Saconnex_%28GIMS9979%29.jpg", "Matti Blume"]
        ],
        db12: [
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Aston_Martin_DB12_1X7A1922.jpg/960px-Aston_Martin_DB12_1X7A1922.jpg", "Alexander-93"],
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Aston_Martin_DB12_1X7A1925.jpg/960px-Aston_Martin_DB12_1X7A1925.jpg", "Alexander-93"],
            ["https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Aston_Martin_DB12_1X7A1927.jpg/960px-Aston_Martin_DB12_1X7A1927.jpg", "Alexander-93"]
        ]
    };

    detailSections.forEach((section) => {
        section.hidden = true;
    });
    detailError.hidden = false;
    detailError.textContent = "Đang tải thông tin mẫu xe...";
    detailError.setAttribute("role", "status");

    // Đọc một bản ghi từ JSON Server; cho phép thiếu bản ghi chi tiết bổ sung.
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

    // Điền nội dung, ảnh, nguồn tham khảo và đường dẫn đặt mua lên trang.
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
        const thumbnails = carDetailPage.querySelector("[data-detail-thumbnails]");
        const photos = [
            { url: product.image || fallbackImage },
            ...(Array.isArray(product.gallery) ? product.gallery : (galleryPhotos[requestedCar] || []).map(([url]) => ({ url })))
        ].slice(0, 4);

        // Đồng bộ ảnh lớn và trạng thái nút khi người dùng chọn ảnh thu nhỏ.
        const showPhoto = (photo, selectedButton) => {
            image.src = photo.url;
            image.alt = `Ảnh ${product.brand} ${product.name}`;

            thumbnails.querySelectorAll("button").forEach((button) => {
                button.setAttribute("aria-pressed", String(button === selectedButton));
            });
        };

        thumbnails.replaceChildren();
        photos.slice(1).forEach((photo, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.setAttribute("aria-label", `Xem ảnh ${index + 2} của ${product.brand} ${product.name}`);
            button.setAttribute("aria-pressed", "false");

            const thumbnail = document.createElement("img");
            thumbnail.src = photo.url;
            thumbnail.alt = "";
            thumbnail.loading = "lazy";
            thumbnail.addEventListener("error", () => {
                button.hidden = true;
            }, { once: true });

            button.append(thumbnail);
            button.addEventListener("click", () => showPhoto(photo, button));
            thumbnails.append(button);
        });

        image.addEventListener("error", () => {
            if (image.src.endsWith(fallbackImage)) {
                return;
            }
            image.src = fallbackImage;
        });
        showPhoto(photos[0], null);

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
        const orderCarBtn = carDetailPage.querySelector("#orderCarBtn");
        if (orderCarBtn) {
            orderCarBtn.href = `contact.html?car=${encodeURIComponent(requestedCar)}`;
        }
        document.title = `${values["[data-detail-name]"]} - Luxury Cars`;
    };

    renderCarDetail().catch((error) => {
        console.error("Không thể tải thông tin chi tiết xe:", error);
        detailError.hidden = false;
        detailError.setAttribute("role", "alert");
        detailError.textContent = `Không thể tải thông tin mẫu xe. Hãy đảm bảo JSON Server đang chạy: ${error.message}`;
    });
}

// Đọc tham số tìm kiếm/lọc từ URL để khôi phục trạng thái thư viện xe.
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

if (requestedBrand) {
    document.querySelector(".collection-filters")?.setAttribute("hidden", "");

    const collectionEyebrow = document.querySelector("#collectionEyebrow");
    const collectionTitle = document.querySelector("#collectionTitle");
    const collectionDescription = document.querySelector("#collectionDescription");
    if (collectionEyebrow) {
        collectionEyebrow.textContent = `THƯƠNG HIỆU ${requestedBrand}`;
    }
    if (collectionTitle) {
        collectionTitle.textContent = `Siêu xe ${requestedBrand}`;
    }
    if (collectionDescription) {
        collectionDescription.textContent = `Khám phá các mẫu xe nổi bật và đặc trưng của ${requestedBrand}.`;
    }
}

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

// Lọc, sắp xếp và cập nhật trạng thái rỗng trên lưới xe có sẵn trong HTML.
const collectionGrid = document.querySelector("#collectionCarGrid");
if (collectionGrid) {
    const status = document.querySelector("#collectionSearchStatus");
    const emptyState = document.querySelector("#collectionEmptyState");

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
        if (emptyState) {
            emptyState.hidden = visibleItems.length > 0 || Boolean(hasFilters);
        }
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
// Điều khiển bộ chọn màu sơn của mô hình 3D trên trang chủ.
const carViewer = document.querySelector("#carViewer");
if (carViewer) {
    // Lưu màu đang được chọn
    let selectedColor = null;
    const initialActiveDot = document.querySelector(".color-dot.active");
    if (initialActiveDot && initialActiveDot.dataset.color) {
        selectedColor = initialActiveDot.dataset.color.split(",").map(Number);
    }

    // Hàm nhận diện thông minh vật liệu sơn xe cho mọi mô hình (Porsche, Ferrari, Lamborghini...)
    // Nhận diện vật liệu sơn thân xe và loại trừ kính/lốp/chi tiết không đổi màu.
    const isPaintMaterial = (mat) => {
        const name = (mat.name || "").toLowerCase();
        // Loại trừ các bộ phận không phải vỏ sơn xe
        if (/(glass|window|windshield|tire|tyre|wheel|rim|interior|seat|carbon|leather|chrome|disc|caliper|brake|plate|license|grid|grill|carpet|plastic|light|lamp|lens|mirror|emiss|details|engine|exhaust|underside)/i.test(name)) {
            return false;
        }
        // Khớp các từ khóa thường dùng cho sơn vỏ xe
        return /(carpaint|paint|body|chassis|exterior|coat|shell|karosserie|color|colour)/i.test(name);
    };

    // Áp màu RGB lên vật liệu phù hợp, kể cả khi mô hình tải sau thao tác chọn màu.
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
