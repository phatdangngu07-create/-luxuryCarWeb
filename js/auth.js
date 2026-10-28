(() => {
    const STORAGE_USERS_KEY = "luxuryCarsUsers";
    const STORAGE_CURRENT_USER_KEY = "luxuryCarsCurrentUser";
    const STORAGE_MIGRATION_KEY = "luxuryCarsUsersMigrated";
    const USERS_ENDPOINT = `${window.LUXURY_CARS_API_URL || "http://localhost:3000"}/users`;
    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

    const requestUsers = async (options) => {
        let response;
        try {
            response = await fetch(USERS_ENDPOINT, options);
        } catch (error) {
            throw new Error("Không kết nối được JSON Server. Hãy chạy `npm run dev` trong thư mục json_server rồi thử lại.");
        }

        if (!response.ok) {
            throw new Error(`JSON Server trả về lỗi ${response.status}. Vui lòng kiểm tra dịch vụ tài khoản.`);
        }

        return response.json();
    };

    const getUsers = async () => {
        const users = await requestUsers();
        if (!Array.isArray(users)) {
            throw new Error("Dữ liệu tài khoản từ JSON Server không hợp lệ.");
        }
        return users;
    };

    const migrateLegacyUsers = async () => {
        if (localStorage.getItem(STORAGE_MIGRATION_KEY) === "true") return;

        const legacyRaw = localStorage.getItem(STORAGE_USERS_KEY);
        if (!legacyRaw) {
            localStorage.setItem(STORAGE_MIGRATION_KEY, "true");
            return;
        }

        let legacyUsers;
        try {
            legacyUsers = JSON.parse(legacyRaw);
        } catch (error) {
            throw new Error("Danh sách tài khoản cũ trong trình duyệt không đọc được. Hãy kiểm tra dữ liệu localStorage trước khi đăng nhập.");
        }

        if (!Array.isArray(legacyUsers)) {
            throw new Error("Danh sách tài khoản cũ trong trình duyệt không hợp lệ.");
        }

        const serverUsers = await getUsers();
        const knownEmails = new Set(
            serverUsers
                .filter((user) => typeof user.email === "string")
                .map((user) => user.email.trim().toLowerCase())
        );

        for (const user of legacyUsers) {
            if (
                typeof user?.name !== "string" ||
                typeof user.email !== "string" ||
                typeof user.password !== "string"
            ) {
                continue;
            }

            const email = user.email.trim().toLowerCase();
            if (!email || knownEmails.has(email)) continue;

            await requestUsers({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: user.name.trim(),
                    email,
                    password: user.password,
                    role: "user",
                    createdAt: user.createdAt || new Date().toISOString()
                })
            });
            knownEmails.add(email);
        }

        localStorage.removeItem(STORAGE_USERS_KEY);
        localStorage.setItem(STORAGE_MIGRATION_KEY, "true");
    };

    const getCurrentUser = () => {
        try {
            const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            console.error("Lỗi khi đọc phiên đăng nhập:", error);
            return null;
        }
    };

    const setCurrentUser = (user) => {
        if (!user) {
            localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
        } else {
            // Không lưu mật khẩu vào session người dùng hiện tại
            const safeUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || "user"
            };
            localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(safeUser));
        }
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
        window.location.reload();
    };

    const registerUser = async ({ name, email, password }) => {
        await migrateLegacyUsers();
        const users = await getUsers();
        const trimmedEmail = email.trim().toLowerCase();

        // Kiểm tra trùng email
        const existed = users.find((u) => u.email?.toLowerCase() === trimmedEmail);
        if (existed) {
            throw new Error("Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.");
        }

        const newUser = {
            name: name.trim(),
            email: trimmedEmail,
            password: password,
            role: "user",
            createdAt: new Date().toISOString()
        };

        const createdUser = await requestUsers({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        });
        setCurrentUser(createdUser);
        return createdUser;
    };

    const loginUser = async ({ email, password }) => {
        await migrateLegacyUsers();
        const users = await getUsers();
        const trimmedEmail = email.trim().toLowerCase();

        const user = users.find(
            (u) => u.email?.toLowerCase() === trimmedEmail && u.password === password
        );

        if (!user) {
            throw new Error("Email hoặc mật khẩu không chính xác. Vui lòng thử lại!");
        }

        setCurrentUser(user);
        return user;
    };

    // Xuất API toàn cục
    window.LuxuryCarsAuth = {
        getUsers,
        getCurrentUser,
        setCurrentUser,
        logout,
        registerUser,
        loginUser
    };

    // =========================================================
    // CẬP NHẬT GIAO DIỆN NAVBAR KHI ĐÃ ĐĂNG NHẬP
    // =========================================================
    const updateNavbarAuth = () => {
        const currentUser = getCurrentUser();
        const loginLink = document.querySelector('a[href*="login.html"]');
        const registerLink = document.querySelector('a[href*="register.html"]');

        if (!loginLink && !registerLink) return;

        const navContainer = (loginLink || registerLink).closest(".navbar-nav");
        if (!navContainer) return;

        if (currentUser) {
            // Đã đăng nhập: ẩn nút Đăng nhập & Đăng ký, hiển thị menu tài khoản
            const loginItem = loginLink?.closest(".nav-item");
            const registerItem = registerLink?.closest(".nav-item");

            if (loginItem) loginItem.remove();
            if (registerItem) registerItem.remove();

            const initial = (currentUser.name || "U").charAt(0).toUpperCase();
            const isAdmin = currentUser.role === "admin";

            const userDropdown = document.createElement("li");
            userDropdown.className = "nav-item dropdown nav-user-account";
            userDropdown.innerHTML = `
                <button class="nav-link dropdown-toggle d-flex align-items-center gap-2 border-0 bg-transparent" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <span class="user-badge" style="display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:#dc2c2c;color:#fff;font-size:0.75rem;font-weight:700;">${initial}</span>
                    <span class="user-name text-truncate" style="max-width:140px;">${escapeHtml(currentUser.name)}</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                    <li class="dropdown-header">
                        <div class="fw-bold text-dark">${escapeHtml(currentUser.name)}</div>
                        <small class="text-secondary">${escapeHtml(currentUser.email)}</small>
                        ${isAdmin ? '<div class="badge bg-danger mt-1 d-inline-block">Quản trị viên</div>' : ''}
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    ${isAdmin ? '<li><a class="dropdown-item" href="admin.html">⚙️ Quản lý sản phẩm</a></li>' : ''}
                    <li><button type="button" class="dropdown-item text-danger" id="globalLogoutBtn">🚪 Đăng xuất</button></li>
                </ul>
            `;

            navContainer.appendChild(userDropdown);

            userDropdown.querySelector("#globalLogoutBtn")?.addEventListener("click", (e) => {
                e.preventDefault();
                logout();
            });
        }
    };

    // =========================================================
    // XỬ LÝ TRANG ĐĂNG KÝ (register.html)
    // =========================================================
    const initRegisterPage = () => {
        const form = document.querySelector("#dangky form") || document.querySelector("form#registerForm");
        if (!form) return;

        const nameInput = document.querySelector("#registerName");
        const emailInput = document.querySelector("#registerEmail");
        const passInput = document.querySelector("#registerPassword");
        const confirmPassInput = document.querySelector("#confirmPassword");
        const submitBtn = form.querySelector('button[type="submit"]');

        // Tạo khung thông báo nếu chưa có
        let alertBox = document.querySelector("#registerAlert");
        if (!alertBox) {
            alertBox = document.createElement("div");
            alertBox.id = "registerAlert";
            alertBox.className = "alert d-none mb-3";
            alertBox.setAttribute("role", "alert");
            form.prepend(alertBox);
        }

        const showAlert = (message, type = "danger") => {
            alertBox.className = `alert alert-${type} mb-3`;
            alertBox.innerHTML = message;
            alertBox.classList.remove("d-none");
            alertBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
        };

        const hideAlert = () => {
            alertBox.classList.add("d-none");
            alertBox.innerHTML = "";
        };

        form.addEventListener("submit", async (e) => {
            e.preventDefault(); // NGĂN CHẶN LỖI POST CHUYỂN TRANG
            hideAlert();

            const name = nameInput?.value.trim() || "";
            const email = emailInput?.value.trim() || "";
            const password = passInput?.value || "";
            const confirmPassword = confirmPassInput?.value || "";

            // Validate dữ liệu
            if (!name) {
                showAlert(" Vui lòng nhập họ và tên của bạn.");
                nameInput?.focus();
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert("Email không hợp lệ. Vui lòng kiểm tra lại định dạng email.");
                emailInput?.focus();
                return;
            }

            if (password.length < 8) {
                showAlert(" Mật khẩu cần có ít nhất 8 ký tự.");
                passInput?.focus();
                return;
            }

            if (password !== confirmPassword) {
                showAlert(" Mật khẩu nhập lại không trùng khớp. Vui lòng kiểm tra lại.");
                confirmPassInput?.focus();
                return;
            }

            // Tiến hành đăng ký
            try {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Đang xử lý đăng ký...`;
                }

                await registerUser({ name, email, password });

                showAlert(" <strong>Đăng ký thành công!</strong> Đang tự động đăng nhập và chuyển hướng về trang chủ...", "success");

                // Đọc query param redirect nếu có
                const urlParams = new URLSearchParams(window.location.search);
                const redirectTarget = urlParams.get("redirect") || "index.html";

                window.setTimeout(() => {
                    window.location.href = redirectTarget;
                }, 1200);

            } catch (error) {
                showAlert(` ${error.message}`, "danger");
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = "Đăng ký";
                }
            }
        });
    };

    // =========================================================
    // XỬ LÝ TRANG ĐĂNG NHẬP (login.html)
    // =========================================================
    const initLoginPage = () => {
        const form = document.querySelector("#login form") || document.querySelector("form#loginForm");
        if (!form) return;

        const emailInput = document.querySelector("#loginEmail");
        const passInput = document.querySelector("#loginPassword");
        const submitBtn = form.querySelector('button[type="submit"]');

        let alertBox = document.querySelector("#loginAlert");
        if (!alertBox) {
            alertBox = document.createElement("div");
            alertBox.id = "loginAlert";
            alertBox.className = "alert d-none mb-3";
            alertBox.setAttribute("role", "alert");
            form.prepend(alertBox);
        }

        const showAlert = (message, type = "danger") => {
            alertBox.className = `alert alert-${type} mb-3`;
            alertBox.innerHTML = message;
            alertBox.classList.remove("d-none");
        };

        const hideAlert = () => {
            alertBox.classList.add("d-none");
            alertBox.innerHTML = "";
        };

        // Gắn nút gợi ý tài khoản mẫu nếu có
        document.querySelectorAll(".btn-fill-demo").forEach((btn) => {
            btn.addEventListener("click", () => {
                if (emailInput) emailInput.value = btn.dataset.email || "";
                if (passInput) passInput.value = btn.dataset.password || "";
                hideAlert();
            });
        });

        form.addEventListener("submit", async (e) => {
            e.preventDefault(); // NGĂN CHẶN LỖI POST CHUYỂN TRANG
            hideAlert();

            const email = emailInput?.value.trim() || "";
            const password = passInput?.value || "";

            if (!email) {
                showAlert(" Vui lòng nhập địa chỉ email.");
                emailInput?.focus();
                return;
            }

            if (!password) {
                showAlert(" Vui lòng nhập mật khẩu.");
                passInput?.focus();
                return;
            }

            try {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Đang đăng nhập...`;
                }

                const user = await loginUser({ email, password });

                showAlert(` <strong>Xin chào, ${escapeHtml(user.name)}!</strong> Đăng nhập thành công. Đang chuyển hướng...`, "success");

                const urlParams = new URLSearchParams(window.location.search);
                const redirectTarget = urlParams.get("redirect") || (user.role === "admin" ? "admin.html" : "index.html");

                window.setTimeout(() => {
                    window.location.href = redirectTarget;
                }, 1000);

            } catch (error) {
                showAlert(` ${error.message}`, "danger");
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = "Đăng nhập";
                }
            }
        });
    };


    // =========================================================
    // XỬ LÝ TRANG QUẢN TRỊ (admin.html)
    // =========================================================
    const initAdminPage = () => {
        const adminProfile = document.querySelector(".profile");
        if (!adminProfile) return;

        const currentUser = getCurrentUser();
        const profileStrong = adminProfile.querySelector("strong");
        const profileSmall = adminProfile.querySelector("small");
        const profileAvatar = adminProfile.querySelector(".avatar");
        const topAvatar = document.querySelector(".top-avatar");

        if (currentUser) {
            if (profileStrong) profileStrong.textContent = currentUser.name;
            if (profileSmall) profileSmall.textContent = currentUser.email;
            const initChar = currentUser.name.charAt(0).toUpperCase();
            if (profileAvatar) profileAvatar.textContent = initChar;
            if (topAvatar) topAvatar.textContent = initChar;
        }

        const adminNav = document.querySelector(".sidebar-nav");
        if (adminNav && !document.querySelector("#adminLogoutLink")) {
            const logoutItem = document.createElement("a");
            logoutItem.className = "nav-item text-danger";
            logoutItem.href = "#";
            logoutItem.id = "adminLogoutLink";
            logoutItem.innerHTML = '<span aria-hidden="true">🚪</span> Đăng xuất';
            logoutItem.addEventListener("click", (e) => {
                e.preventDefault();
                logout();
            });
            adminNav.appendChild(logoutItem);
        }
    };

    // Khởi chạy khi DOM sẵn sàng
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            updateNavbarAuth();
            initRegisterPage();
            initLoginPage();
            initAdminPage();
        });
    } else {
        updateNavbarAuth();
        initRegisterPage();
        initLoginPage();
        initAdminPage();
    }
})();
