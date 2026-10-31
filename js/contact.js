(() => {
    const API_BASE = window.LUXURY_CARS_API_URL || "http://localhost:3000";
    const contactsEndpoint = `${API_BASE}/contacts`;
    const productsEndpoint = `${API_BASE}/products`;
    const STORAGE_KEY = "luxuryCarsContacts";

    const defaultCarList = [
        { id: "revuelto", name: "Lamborghini Revuelto (Hybrid V12)" },
        { id: "huracan-tecnica", name: "Lamborghini Huracán Tecnica (V10)" },
        { id: "296-gtb", name: "Ferrari 296 GTB (Hybrid V6)" },
        { id: "sf90-stradale", name: "Ferrari SF90 Stradale (Hybrid V8)" },
        { id: "750s", name: "McLaren 750S (V8 Twin-Turbo)" },
        { id: "911-turbo-s", name: "Porsche 911 Turbo S (Flat-6 Twin-Turbo)" },
        { id: "chiron", name: "Bugatti Chiron (W16 Quad-Turbo)" },
        { id: "db12", name: "Aston Martin DB12 (V8 Twin-Turbo)" }
    ];

    const elements = {
        form: document.querySelector("#contactForm"),
        name: document.querySelector("#contactName"),
        phone: document.querySelector("#contactPhone"),
        email: document.querySelector("#contactEmail"),
        city: document.querySelector("#contactCity"),
        car: document.querySelector("#contactCar"),
        service: document.querySelector("#contactService"),
        budget: document.querySelector("#contactBudget"),
        message: document.querySelector("#contactMessage"),
        submitBtn: document.querySelector("#submitContactBtn"),
        alert: document.querySelector("#contactAlert")
    };

    if (!elements.form) return;

    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

    const showAlert = (message, type = "danger", allowDownload = null) => {
        elements.alert.className = `alert alert-${type} mb-4`;
        elements.alert.innerHTML = message;
        if (allowDownload) {
            const downloadBtn = document.createElement("button");
            downloadBtn.type = "button";
            downloadBtn.className = "btn btn-sm btn-outline-dark mt-2 d-block";
            downloadBtn.textContent = "📥 Tải bản sao file JSON đơn hàng";
            downloadBtn.addEventListener("click", () => {
                const blob = new Blob([JSON.stringify(allowDownload, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `order-${allowDownload.id || "luxury"}.json`;
                a.click();
                URL.revokeObjectURL(url);
            });
            elements.alert.appendChild(downloadBtn);
        }
        elements.alert.classList.remove("d-none");
        elements.alert.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    const hideAlert = () => {
        elements.alert.classList.add("d-none");
        elements.alert.innerHTML = "";
    };

    // 1. Tự động điền thông tin nếu người dùng đã đăng nhập
    const prefillUser = () => {
        if (window.LuxuryCarsAuth && typeof window.LuxuryCarsAuth.getCurrentUser === "function") {
            const user = window.LuxuryCarsAuth.getCurrentUser();
            if (user) {
                if (elements.name && !elements.name.value && user.name) elements.name.value = user.name;
                if (elements.email && !elements.email.value && user.email) elements.email.value = user.email;
            }
        }
    };

    // 2. Tải danh sách xe vào Select box
    const loadCarOptions = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const requestedCar = urlParams.get("car") || "";

        let cars = defaultCarList;
        try {
            const res = await fetch(productsEndpoint);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    cars = data.map((p) => ({
                        id: p.id,
                        name: `${p.brand} ${p.name} (${p.engine})`
                    }));
                }
            }
        } catch (e) {
            // Sử dụng danh sách mặc định nếu JSON server chưa bật
        }

        elements.car.innerHTML = '<option value="">-- Vui lòng chọn mẫu siêu xe --</option>';
        cars.forEach((car) => {
            const opt = document.createElement("option");
            opt.value = car.id;
            opt.textContent = car.name;
            if (requestedCar && (car.id === requestedCar || car.id.includes(requestedCar))) {
                opt.selected = true;
            }
            elements.car.appendChild(opt);
        });

        // Nếu có mẫu xe khác không nằm trong danh sách
        const otherOpt = document.createElement("option");
        otherOpt.value = "other";
        otherOpt.textContent = "Mẫu siêu xe khác (nhập trong lời nhắn)";
        elements.car.appendChild(otherOpt);
    };

    // 3. Lưu lên JSON Server; nếu không khả dụng thì lưu dự phòng trên trình duyệt này.
    const saveContactData = async (contact) => {
        let fallbackReason = "JSON Server không khả dụng.";
        try {
            const response = await fetch(contactsEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contact)
            });

            if (response.ok) {
                return { savedOnline: true, data: await response.json() };
            }
            fallbackReason = `JSON Server trả về lỗi HTTP ${response.status}.`;
        } catch (networkError) {
            console.warn("Không kết nối được JSON Server, thử lưu trong trình duyệt:", networkError);
        }

        try {
            const storedContacts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            if (!Array.isArray(storedContacts)) {
                throw new Error("Dữ liệu liên hệ đã lưu trong trình duyệt không hợp lệ.");
            }
            storedContacts.push(contact);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(storedContacts));
        } catch (storageError) {
            console.error("Không thể lưu yêu cầu liên hệ:", storageError);
            throw new Error(`Không thể lưu yêu cầu vào JSON Server hoặc trình duyệt. ${fallbackReason} ${storageError.message}`);
        }

        return { savedOnline: false, data: contact, fallbackReason };
    };

    // 4. Bắt sự kiện gửi form
    let isSubmitting = false;
    elements.form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        hideAlert();

        const name = elements.name.value.trim();
        const phone = elements.phone.value.trim();
        const email = elements.email.value.trim();
        const city = elements.city.value;
        const carId = elements.car.value;
        const carName = elements.car.options[elements.car.selectedIndex]?.text || carId;
        const serviceType = elements.service.value;
        const budget = elements.budget.value;
        const message = elements.message.value.trim();

        // Kiểm tra dữ liệu
        if (!name) {
            showAlert("Vui lòng nhập họ và tên của bạn.");
            elements.name.focus();
            return;
        }

        const phoneClean = phone.replace(/[\s.-]/g, "");
        if (!/^[0-9]{10,11}$/.test(phoneClean)) {
            showAlert("Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại từ 10-11 chữ số.");
            elements.phone.focus();
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert("Địa chỉ email không đúng định dạng.");
            elements.email.focus();
            return;
        }

        if (!city) {
            showAlert("Vui lòng chọn tỉnh hoặc thành phố.");
            elements.city.focus();
            return;
        }

        if (!carId) {
            showAlert("Vui lòng chọn mẫu siêu xe mà quý khách quan tâm.");
            elements.car.focus();
            return;
        }

        // Tạo đối tượng dữ liệu đơn hàng
        const newContact = {
            id: `CT-${Date.now()}`,
            name,
            phone: phoneClean,
            email,
            city,
            carId,
            carName,
            serviceType,
            budget,
            message,
            status: "pending",
            createdAt: new Date().toISOString()
        };

        isSubmitting = true;
        try {
            elements.submitBtn.disabled = true;
            elements.submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>ĐANG GỬI YÊU CẦU...`;

            const { savedOnline, data, fallbackReason } = await saveContactData(newContact);

            const resultMessage = savedOnline
                ? `
                <div class="d-flex align-items-center mb-2">
                    <span class="fs-4 me-2">🎉</span>
                    <h5 class="alert-heading mb-0 fw-bold">Gửi yêu cầu mua xe thành công!</h5>
                </div>
                <p class="mb-2">Cảm ơn <strong>${escapeHtml(data.name)}</strong>, đội ngũ chuyên viên của Luxury Cars sẽ liên hệ tới số <strong>${escapeHtml(data.phone)}</strong> để tư vấn mẫu <strong>${escapeHtml(data.carName)}</strong>.</p>
                <div class="small text-muted mb-2"><strong>Hệ thống:</strong> Yêu cầu đã được lưu vào hệ thống.</div>
            `
                : `
                <div class="d-flex align-items-center mb-2">
                    <span class="fs-4 me-2">⚠️</span>
                    <h5 class="alert-heading mb-0 fw-bold">Yêu cầu đã lưu trên trình duyệt này, chưa gửi tới showroom.</h5>
                </div>
                <p class="mb-2">Dữ liệu chưa được gửi do ${escapeHtml(fallbackReason)} Chúng tôi chỉ nhận được yêu cầu khi JSON Server hoạt động và bạn gửi lại.</p>
                <p class="mb-2">Bản lưu cục bộ: cảm ơn <strong>${escapeHtml(data.name)}</strong>, số điện thoại <strong>${escapeHtml(data.phone)}</strong>, mẫu xe <strong>${escapeHtml(data.carName)}</strong>.</p>
            `;

            showAlert(resultMessage, savedOnline ? "success" : "warning", savedOnline ? null : data);
            if (savedOnline) {
                elements.form.reset();
                prefillUser();
            }

        } catch (error) {
            showAlert(`Có lỗi xảy ra trong quá trình lưu dữ liệu: ${error.message}`, "danger");
        } finally {
            isSubmitting = false;
            elements.submitBtn.disabled = false;
            elements.submitBtn.innerHTML = "GỬI YÊU CẦU MUA XE";
        }
    });

    // Khởi tạo
    prefillUser();
    loadCarOptions();
})();
