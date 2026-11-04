// Tải và quản lý yêu cầu liên hệ trên trang admin riêng.
(() => {
    const apiBase = window.LUXURY_CARS_API_URL || "http://localhost:3000";
    const contactsEndpoint = `${apiBase}/contacts`;
    const storageKey = "luxuryCarsContacts";
    const tableBody = document.getElementById("contactTableBody");
    const summary = document.getElementById("contactsSummary");
    const statusMessage = document.getElementById("contactsStatus");
    const emptyMessage = document.getElementById("emptyContacts");
    const refreshButton = document.getElementById("refreshContactsButton");
    if (!tableBody || !summary || !statusMessage || !emptyMessage || !refreshButton) return;

    let contacts = [];

    // Định dạng thời điểm gửi và chuyển mã nhu cầu/ngân sách sang nhãn dễ đọc.
    const formatDate = (value) => {
        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? "Không rõ"
            : new Intl.DateTimeFormat("vi-VN", {
                dateStyle: "medium",
                timeStyle: "short"
            }).format(date);
    };

    const getServiceLabel = (serviceType) => ({
        deposit: "Đặt cọc mua xe mới",
        test_drive: "Đăng ký lái thử VIP",
        finance: "Tư vấn trả góp & tài chính",
        bespoke: "Cá nhân hóa Bespoke / Độc bản"
    })[serviceType] || serviceType || "Chưa cung cấp";

    const getBudgetLabel = (budget) => ({
        unspecified: "Không giới hạn",
        under_20b: "Dưới 20 tỷ VNĐ",
        "20b_40b": "20 - 40 tỷ VNĐ",
        above_40b: "Trên 40 tỷ VNĐ"
    })[budget] || budget || "Chưa cung cấp";

    // Tạo ô văn bản an toàn bằng textContent, tránh diễn giải dữ liệu khách như HTML.
    const createTextCell = (value, className = "") => {
        const cell = document.createElement("td");
        cell.textContent = value || "Chưa cung cấp";
        if (className) cell.className = className;
        return cell;
    };

    // Dựng hàng thông tin khách, xe, nhu cầu, trạng thái và nút xác nhận.
    const createContactRow = (contact) => {
        const row = document.createElement("tr");
        const customerCell = document.createElement("td");
        customerCell.className = "contact-customer";

        const customerName = document.createElement("strong");
        customerName.textContent = contact.name || "Khách hàng";
        customerCell.appendChild(customerName);

        if (contact.city) {
            const city = document.createElement("span");
            city.textContent = contact.city;
            city.className = "contact-city";
            customerCell.appendChild(city);
        }

        if (contact.phone) {
            const phoneLink = document.createElement("a");
            phoneLink.href = `tel:${String(contact.phone).replace(/[^\d+]/g, "")}`;
            phoneLink.textContent = contact.phone;
            customerCell.appendChild(phoneLink);
        }

        if (contact.email) {
            const emailLink = document.createElement("a");
            emailLink.href = `mailto:${contact.email}`;
            emailLink.textContent = contact.email;
            customerCell.appendChild(emailLink);
        }

        row.append(
            customerCell,
            createTextCell(contact.carName || contact.carId),
            createTextCell(getServiceLabel(contact.serviceType)),
            createTextCell(getBudgetLabel(contact.budget)),
            createTextCell(contact.message || "Không có lời nhắn", "contact-message"),
            createTextCell(formatDate(contact.createdAt))
        );

        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");
        const confirmed = contact.status === "confirmed";
        statusBadge.className = `contact-status${confirmed ? " is-confirmed" : ""}`;
        statusBadge.textContent = confirmed ? "Đã xác nhận" : "Chờ xác nhận";
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        const actionCell = document.createElement("td");
        const confirmButton = document.createElement("button");
        confirmButton.type = "button";
        confirmButton.className = "confirm-contact-button";
        confirmButton.textContent = confirmed ? "Đã xác nhận" : "Xác nhận";
        confirmButton.disabled = confirmed;
        confirmButton.addEventListener("click", () => confirmContact(contact, confirmButton));
        actionCell.appendChild(confirmButton);

        if (confirmed) {
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-contact-button";
            deleteButton.textContent = "Xóa";
            deleteButton.addEventListener("click", () => deleteContact(contact, deleteButton));
            actionCell.appendChild(deleteButton);
        }

        row.appendChild(actionCell);
        return row;
    };

    // Sắp xếp yêu cầu mới nhất trước, cập nhật bảng và số lượng chờ xác nhận.
    const renderContacts = () => {
        contacts.sort((first, second) => {
            const firstDate = new Date(first.createdAt).getTime() || 0;
            const secondDate = new Date(second.createdAt).getTime() || 0;
            return secondDate - firstDate;
        });
        tableBody.replaceChildren(...contacts.map(createContactRow));
        const pendingCount = contacts.filter((contact) => contact.status !== "confirmed").length;
        summary.textContent = `${contacts.length} yêu cầu · ${pendingCount} chờ xác nhận`;
        emptyMessage.hidden = contacts.length > 0;
    };

    // Đọc yêu cầu từ máy chủ và gộp yêu cầu dự phòng cục bộ nếu có.
    const loadContacts = async () => {
        refreshButton.disabled = true;
        statusMessage.textContent = "Đang tải yêu cầu liên hệ...";
        statusMessage.setAttribute("role", "status");

        let onlineContacts = [];
        let onlineError = "";
        try {
            const response = await fetch(contactsEndpoint);
            if (!response.ok) {
                throw new Error(`JSON Server trả về lỗi HTTP ${response.status}.`);
            }
            const data = await response.json();
            if (!Array.isArray(data)) {
                throw new Error("Danh sách yêu cầu từ JSON Server không hợp lệ.");
            }
            onlineContacts = data.map((contact) => ({ ...contact, storageOnly: false }));
        } catch (error) {
            onlineError = error.message;
            console.error("Không thể tải yêu cầu từ JSON Server:", error);
        }

        let localContacts = [];
        let localError = "";
        try {
            const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
            if (!Array.isArray(stored)) {
                throw new Error("Danh sách liên hệ lưu trên trình duyệt không hợp lệ.");
            }
            localContacts = stored.map((contact) => ({ ...contact, storageOnly: true }));
        } catch (error) {
            localError = error.message;
            console.error("Không thể đọc yêu cầu liên hệ trong trình duyệt:", error);
        }

        const onlineIds = new Set(onlineContacts.map((contact) => String(contact.id)));
        contacts = [
            ...onlineContacts,
            ...localContacts.filter((contact) => !onlineIds.has(String(contact.id)))
        ];
        renderContacts();

        if (onlineError) {
            statusMessage.setAttribute("role", "alert");
            statusMessage.textContent = contacts.length
                ? `Không kết nối được JSON Server (${onlineError}). Đang hiển thị yêu cầu lưu trên trình duyệt này; các yêu cầu này chưa được gửi tới showroom.`
                : `Không thể tải yêu cầu liên hệ từ JSON Server: ${onlineError}${localError ? ` ${localError}` : ""}`;
        } else if (contacts.some((contact) => contact.storageOnly)) {
            statusMessage.setAttribute("role", "status");
            statusMessage.textContent = "Một số yêu cầu chỉ được lưu trên trình duyệt này và chưa gửi tới showroom.";
        } else {
            statusMessage.textContent = "";
        }
        refreshButton.disabled = false;
    };

    // Lưu trạng thái xác nhận lên API hoặc Local Storage tùy nơi lưu yêu cầu.
    const confirmContact = async (contact, button) => {
        if (contact.status === "confirmed") return;
        button.disabled = true;
        button.textContent = "Đang lưu...";

        try {
            if (contact.storageOnly) {
                const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
                if (!Array.isArray(stored)) {
                    throw new Error("Danh sách liên hệ lưu trên trình duyệt không hợp lệ.");
                }
                const index = stored.findIndex((item) => String(item.id) === String(contact.id));
                if (index < 0) {
                    throw new Error("Không tìm thấy yêu cầu trong bộ nhớ trình duyệt.");
                }
                stored[index] = { ...stored[index], status: "confirmed" };
                localStorage.setItem(storageKey, JSON.stringify(stored));
            } else {
                const response = await fetch(`${contactsEndpoint}/${encodeURIComponent(contact.id)}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "confirmed" })
                });
                if (!response.ok) {
                    throw new Error(`JSON Server trả về lỗi HTTP ${response.status}.`);
                }
            }

            contact.status = "confirmed";
            renderContacts();
            statusMessage.setAttribute("role", "status");
            statusMessage.textContent = `Đã xác nhận yêu cầu của ${contact.name || "khách hàng"}.`;
        } catch (error) {
            console.error("Không thể xác nhận yêu cầu liên hệ:", error);
            statusMessage.setAttribute("role", "alert");
            statusMessage.textContent = `Không thể lưu trạng thái xác nhận: ${error.message}`;
            button.disabled = false;
            button.textContent = "Xác nhận";
        }
    };

    const deleteContact = async (contact, button) => {
        if (contact.status !== "confirmed") return;
        if (!window.confirm(`Bạn có chắc muốn xóa yêu cầu của ${contact.name || "khách hàng"}?`)) return;

        button.disabled = true;
        button.textContent = "Đang xóa...";

        try {
            if (contact.storageOnly) {
                const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
                if (!Array.isArray(stored)) {
                    throw new Error("Danh sách liên hệ lưu trên trình duyệt không hợp lệ.");
                }
                const remainingContacts = stored.filter((item) => String(item.id) !== String(contact.id));
                if (remainingContacts.length === stored.length) {
                    throw new Error("Không tìm thấy yêu cầu trong bộ nhớ trình duyệt.");
                }
                localStorage.setItem(storageKey, JSON.stringify(remainingContacts));
            } else {
                const response = await fetch(`${contactsEndpoint}/${encodeURIComponent(contact.id)}`, {
                    method: "DELETE"
                });
                if (!response.ok) {
                    throw new Error(`JSON Server trả về lỗi HTTP ${response.status}.`);
                }
            }

            contacts = contacts.filter((item) => item !== contact);
            renderContacts();
            statusMessage.setAttribute("role", "status");
            statusMessage.textContent = `Đã xóa yêu cầu của ${contact.name || "khách hàng"}.`;
        } catch (error) {
            console.error("Không thể xóa yêu cầu liên hệ:", error);
            statusMessage.setAttribute("role", "alert");
            statusMessage.textContent = `Không thể xóa yêu cầu liên hệ: ${error.message}`;
            button.disabled = false;
            button.textContent = "Xóa";
        }
    };

    // Nút làm mới tải lại danh sách; gọi ngay khi trang khởi tạo.
    refreshButton.addEventListener("click", loadContacts);
    loadContacts();
})();
