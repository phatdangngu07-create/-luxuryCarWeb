(() => {
    const catalog = window.LuxuryCarsProducts;
    const fallbackImage = "/assets/images/lamboghini.jpg";
    const pageSize = 6;
    const elements = {
        notice: document.querySelector("#adminNotice"),
        tableBody: document.querySelector("#productTableBody"),
        empty: document.querySelector("#emptyProducts"),
        search: document.querySelector("#productSearch"),
        brandFilter: document.querySelector("#brandFilter"),
        segmentFilter: document.querySelector("#segmentFilter"),
        count: document.querySelector("#resultCount"),
        pageInfo: document.querySelector("#pageInfo"),
        previous: document.querySelector("#previousPage"),
        next: document.querySelector("#nextPage"),
        modal: document.querySelector("#productModal"),
        modalTitle: document.querySelector("#modalTitle"),
        form: document.querySelector("#productForm"),
        formError: document.querySelector("#formError"),
        imageInput: document.querySelector("#productImage"),
        imagePreview: document.querySelector("#imagePreview"),
        imagePreviewLabel: document.querySelector("#imagePreviewLabel"),
        toast: document.querySelector("#adminToast")
    };

    if (!catalog || !elements.tableBody || !elements.form) {
        console.error("Không thể khởi tạo trang quản lý sản phẩm: thiếu dữ liệu hoặc thành phần giao diện.");
        return;
    }

    let products = [];
    let currentPage = 1;
    let toastTimer;

    const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(Number(value));

    const showToast = (message) => {
        elements.toast.textContent = message;
        elements.toast.classList.add("show");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => elements.toast.classList.remove("show"), 2800);
    };

    const showError = (message) => {
        elements.notice.textContent = message;
        elements.notice.classList.add("is-error");
        elements.notice.setAttribute("role", "alert");
        document.querySelectorAll("#addProductButton, #exportProductsButton, #productSearch, #brandFilter, #segmentFilter")
            .forEach((control) => {
                control.disabled = true;
            });
    };

    const updateStats = () => {
        document.querySelector("#totalProducts").textContent = String(products.length);
        document.querySelector("#totalBrands").textContent = String(new Set(products.map((product) => product.brand)).size);
        document.querySelector("#totalSupercars").textContent = String(products.filter((product) => product.segment === "Supercar").length);
        document.querySelector("#totalHypercars").textContent = String(products.filter((product) => product.segment === "Hypercar").length);
        document.querySelector("#sidebarProductCount").textContent = String(products.length);
    };

    const updateBrandFilter = () => {
        const selectedBrand = elements.brandFilter.value;
        elements.brandFilter.replaceChildren(new Option("Tất cả thương hiệu", ""));
        [...new Set(products.map((product) => product.brand))]
            .sort((first, second) => first.localeCompare(second, "vi"))
            .forEach((brand) => elements.brandFilter.add(new Option(brand, brand)));
        elements.brandFilter.value = products.some((product) => product.brand === selectedBrand) ? selectedBrand : "";
    };

    const makeCell = (text, className) => {
        const cell = document.createElement("td");
        if (className) {
            cell.className = className;
        }
        cell.textContent = text;
        return cell;
    };

    const renderRows = () => {
        const searchTerm = elements.search.value.trim().toLocaleLowerCase("vi");
        const selectedBrand = elements.brandFilter.value;
        const selectedSegment = elements.segmentFilter.value;
        const filteredProducts = products.filter((product) => {
            const matchesSearch = !searchTerm ||
                `${product.name} ${product.brand} ${product.engine}`.toLocaleLowerCase("vi").includes(searchTerm);
            return matchesSearch &&
                (!selectedBrand || product.brand === selectedBrand) &&
                (!selectedSegment || product.segment === selectedSegment);
        });
        const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
        currentPage = Math.min(currentPage, pageCount);
        const pageProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        elements.tableBody.replaceChildren();

        pageProducts.forEach((product) => {
            const row = document.createElement("tr");
            const productCell = document.createElement("td");
            const productContent = document.createElement("div");
            productContent.className = "product-cell";

            const image = document.createElement("img");
            image.className = "product-image";
            image.src = product.image || fallbackImage;
            image.alt = `Ảnh ${product.brand} ${product.name}`;
            image.loading = "lazy";
            image.addEventListener("error", () => {
                if (image.dataset.fallbackAttempted) {
                    return;
                }
                image.dataset.fallbackAttempted = "true";
                image.src = fallbackImage;
            });

            const name = document.createElement("div");
            const title = document.createElement("p");
            title.className = "product-title";
            title.textContent = product.name;
            const subtitle = document.createElement("p");
            subtitle.className = "product-subtitle";
            subtitle.textContent = `Mã xe: ${product.id}`;
            name.append(title, subtitle);
            productContent.append(image, name);
            productCell.append(productContent);
            row.append(productCell);

            const brand = makeCell(product.brand);
            const segment = makeCell(product.segment);
            segment.append(document.createElement("span"));
            segment.lastElementChild.className = "category-pill";
            segment.lastElementChild.textContent = product.segment;
            const engine = makeCell(product.engine);
            const year = makeCell(String(product.year));
            const power = makeCell(`${formatNumber(product.power)} CV`);
            const speed = makeCell(`${formatNumber(product.speed)} km/h`);
            const actions = document.createElement("td");
            const actionGroup = document.createElement("div");
            actionGroup.className = "actions";
            const editButton = document.createElement("button");
            editButton.className = "action-btn";
            editButton.type = "button";
            editButton.dataset.action = "edit";
            editButton.dataset.id = product.id;
            editButton.setAttribute("aria-label", `Sửa ${product.brand} ${product.name}`);
            editButton.title = "Sửa sản phẩm";
            editButton.textContent = "✎";
            const deleteButton = document.createElement("button");
            deleteButton.className = "action-btn delete";
            deleteButton.type = "button";
            deleteButton.dataset.action = "delete";
            deleteButton.dataset.id = product.id;
            deleteButton.setAttribute("aria-label", `Xóa ${product.brand} ${product.name}`);
            deleteButton.title = "Xóa sản phẩm";
            deleteButton.textContent = "×";
            actionGroup.append(editButton, deleteButton);
            actions.append(actionGroup);
            row.append(brand, segment, engine, year, power, speed, actions);
            elements.tableBody.append(row);
        });

        elements.empty.hidden = filteredProducts.length > 0;
        elements.count.textContent = `${filteredProducts.length} sản phẩm`;
        elements.pageInfo.textContent = `${currentPage} / ${pageCount}`;
        elements.previous.disabled = currentPage <= 1;
        elements.next.disabled = currentPage >= pageCount;
        updateStats();
    };

    const refresh = async () => {
        products = await catalog.getProducts();
        updateBrandFilter();
        renderRows();
    };

    const openModal = (product) => {
        elements.form.reset();
        elements.formError.hidden = true;
        elements.formError.textContent = "";
        elements.modalTitle.textContent = product ? "Cập nhật sản phẩm" : "Thêm sản phẩm";
        document.querySelector("#saveProductButton").textContent = product ? "Lưu thay đổi" : "Lưu sản phẩm";

        if (product) {
            document.querySelector("#productId").value = product.id;
            document.querySelector("#productName").value = product.name;
            document.querySelector("#productBrand").value = product.brand;
            document.querySelector("#productEngine").value = product.engine;
            document.querySelector("#productSegment").value = product.segment;
            document.querySelector("#productYear").value = product.year;
            document.querySelector("#productPower").value = product.power;
            document.querySelector("#productSpeed").value = product.speed;
            elements.imageInput.value = product.image;
            document.querySelector("#productDescription").value = product.description;
        } else {
            elements.imageInput.value = fallbackImage;
        }

        updateImagePreview();
        elements.modal.classList.add("show");
        elements.modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        document.querySelector("#productName").focus();
    };

    const closeModal = () => {
        elements.modal.classList.remove("show");
        elements.modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    };

    const updateImagePreview = () => {
        const imagePath = elements.imageInput.value.trim() || fallbackImage;
        elements.imagePreview.src = imagePath;
        elements.imagePreviewLabel.textContent = imagePath;
    };

    const slugify = (value) => value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("en")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    elements.imagePreview.addEventListener("error", () => {
        if (elements.imagePreview.dataset.fallbackAttempted) {
            elements.imagePreviewLabel.textContent = "Không tải được ảnh. Kiểm tra đường dẫn.";
            return;
        }
        elements.imagePreview.dataset.fallbackAttempted = "true";
        elements.imagePreview.src = fallbackImage;
    });
    elements.imagePreview.addEventListener("load", () => {
        delete elements.imagePreview.dataset.fallbackAttempted;
    });
    elements.imageInput.addEventListener("input", updateImagePreview);

    document.querySelector("#addProductButton").addEventListener("click", () => openModal());
    document.querySelector("#closeProductModal").addEventListener("click", closeModal);
    document.querySelector("#cancelProductModal").addEventListener("click", closeModal);
    elements.modal.addEventListener("click", (event) => {
        if (event.target === elements.modal) {
            closeModal();
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && elements.modal.classList.contains("show")) {
            closeModal();
        }
    });

    [elements.search, elements.brandFilter, elements.segmentFilter].forEach((control) => {
        control.addEventListener("input", () => {
            currentPage = 1;
            renderRows();
        });
        control.addEventListener("change", () => {
            currentPage = 1;
            renderRows();
        });
    });
    elements.previous.addEventListener("click", () => {
        currentPage -= 1;
        renderRows();
    });
    elements.next.addEventListener("click", () => {
        currentPage += 1;
        renderRows();
    });

    elements.tableBody.addEventListener("click", async (event) => {
        const button = event.target.closest("button[data-action]");
        if (!button) {
            return;
        }

        const product = products.find((item) => item.id === button.dataset.id);
        if (!product) {
            showError("Không tìm thấy sản phẩm cần thao tác. Hãy tải lại trang.");
            return;
        }

        if (button.dataset.action === "edit") {
            openModal(product);
        } else if (button.dataset.action === "delete" &&
            window.confirm(`Bạn có chắc muốn xóa ${product.brand} ${product.name}?`)) {
            try {
                await catalog.deleteProduct(product.id);
                await refresh();
                showToast("Đã xóa sản phẩm.");
            } catch (error) {
                showError(`Không thể lưu thay đổi: ${error.message}`);
            }
        }
    });

    elements.form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!elements.form.reportValidity()) {
            return;
        }

        const formData = new FormData(elements.form);
        const existingId = String(formData.get("id") || "");
        const name = String(formData.get("name")).trim();
        const brand = String(formData.get("brand")).trim();
        const duplicate = products.some((product) =>
            product.id !== existingId &&
            product.name.toLocaleLowerCase("vi") === name.toLocaleLowerCase("vi") &&
            product.brand.toLocaleLowerCase("vi") === brand.toLocaleLowerCase("vi")
        );

        if (duplicate) {
            elements.formError.textContent = "Mẫu xe này đã có trong danh mục của thương hiệu.";
            elements.formError.hidden = false;
            return;
        }

        const product = {
            id: existingId || `${slugify(brand)}-${slugify(name)}-${Date.now().toString(36)}`,
            name,
            brand,
            engine: String(formData.get("engine")),
            segment: String(formData.get("segment")),
            year: Number(formData.get("year")),
            power: Number(formData.get("power")),
            speed: Number(formData.get("speed")),
            image: String(formData.get("image")).trim(),
            description: String(formData.get("description")).trim()
        };
        const previousProduct = products.find((item) => item.id === existingId);
        if (previousProduct?.detailId) {
            product.detailId = previousProduct.detailId;
        }

        try {
            if (existingId) {
                await catalog.updateProduct(product);
            } else {
                await catalog.createProduct(product);
            }
            await refresh();
            closeModal();
            showToast(existingId ? "Đã cập nhật sản phẩm." : "Đã thêm sản phẩm.");
        } catch (error) {
            elements.formError.textContent = `Không thể lưu sản phẩm: ${error.message}`;
            elements.formError.hidden = false;
        }
    });

    document.querySelector("#exportProductsButton").addEventListener("click", () => {
        const file = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
        const downloadUrl = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "luxury-cars-products.json";
        link.click();
        URL.revokeObjectURL(downloadUrl);
        showToast("Đã xuất danh sách sản phẩm.");
    });

    refresh().catch((error) => {
        console.error("Không thể tải sản phẩm:", error);
        showError(`Không thể tải dữ liệu sản phẩm: ${error.message}`);
    });
})();

(() => {
    const revealTargets = document.querySelectorAll("#adminNotice, .stat-card, #products, .footer");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window) || revealTargets.length === 0) {
        return;
    }

    document.documentElement.classList.add("admin-scroll-motion-enabled");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealTargets.forEach((target) => {
        target.classList.add("admin-scroll-reveal");
        revealObserver.observe(target);
    });
})();
// =========================================================
// QUẢN LÝ ĐƠN LIÊN HỆ MUA HÀNG TRONG ADMIN
// =========================================================
(() => {
    const contactsEndpoint = `${window.LUXURY_CARS_API_URL || "http://localhost:3000"}/contacts`;
    const tableBody = document.querySelector("#contactTableBody");
    const emptyState = document.querySelector("#emptyContacts");
    const countBadge = document.querySelector("#sidebarContactCount");
    const refreshBtn = document.querySelector("#refreshContactsBtn");

    if (!tableBody) return;

    const renderContacts = async () => {
        let contacts = [];
        try {
            const res = await fetch(contactsEndpoint);
            if (res.ok) {
                contacts = await res.json();
            } else {
                throw new Error("HTTP " + res.status);
            }
        } catch (e) {
            // Fallback đọc từ LocalStorage
            try {
                contacts = JSON.parse(localStorage.getItem("luxuryCarsContacts") || "[]");
            } catch (err) {
                contacts = [];
            }
        }

        if (countBadge) countBadge.textContent = String(contacts.length);

        tableBody.replaceChildren();
        if (contacts.length === 0) {
            if (emptyState) emptyState.hidden = false;
            return;
        }

        if (emptyState) emptyState.hidden = true;

        // Sắp xếp đơn mới nhất lên đầu
        const sorted = [...contacts].reverse();
        sorted.forEach((c) => {
            const row = document.createElement("tr");
            row.style.borderBottom = "1px solid #f0f2f8";

            const timeStr = c.createdAt ? new Date(c.createdAt).toLocaleString("vi-VN") : "Gần đây";
            const serviceLabel = {
                deposit: "Đặt cọc mua xe",
                test_drive: "Lái thử VIP",
                finance: "Tư vấn tài chính",
                bespoke: "Cá nhân hóa Bespoke"
            }[c.serviceType] || c.serviceType || "Tư vấn chung";

            row.innerHTML = `
                <td style="padding:0.75rem;"><strong style="color:#20243a;">${c.name || "Khách hàng"}</strong></td>
                <td style="padding:0.75rem;"><a href="tel:${c.phone}" style="color:#dc2c2c; font-weight:600; text-decoration:none;">${c.phone || "---"}</a></td>
                <td style="padding:0.75rem;"><a href="mailto:${c.email}" style="color:#6c5ce7; text-decoration:none;">${c.email || "---"}</a></td>
                <td style="padding:0.75rem;">${c.city || "TP. HCM"}</td>
                <td style="padding:0.75rem;"><span style="font-weight:600;">${c.carName || c.carId || "Chưa chọn"}</span></td>
                <td style="padding:0.75rem;"><span class="badge" style="background:#eaf1ff; color:#4385f5; padding:0.25rem 0.6rem; border-radius:4px; font-size:0.78rem;">${serviceLabel}</span></td>
                <td style="padding:0.75rem; color:#7e8499; font-size:0.8rem;">${timeStr}</td>
            `;
            tableBody.appendChild(row);
        });
    };

    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => {
            renderContacts();
        });
    }

    renderContacts();
})();
