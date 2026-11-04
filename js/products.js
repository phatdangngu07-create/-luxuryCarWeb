// API sản phẩm dùng chung cho trang thư viện và trang quản trị.
const API_URL = `${window.LUXURY_CARS_API_URL || "http://localhost:3000"}/products`;

// Đọc và kiểm tra danh sách sản phẩm trước khi trả cho giao diện.
async function getProducts() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`JSON Server trả về lỗi HTTP ${response.status}.`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
        throw new Error("Dữ liệu sản phẩm từ JSON Server không hợp lệ.");
    }
    return data;
}

// Tạo sản phẩm mới trên JSON Server.
async function createProduct(product) {
    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });
}

// Thay thế bản ghi sản phẩm theo ID.
async function updateProduct(product) {
    await fetch(API_URL + "/" + product.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });
}

// Xóa bản ghi sản phẩm theo ID.
async function deleteProduct(id) {
    await fetch(API_URL + "/" + id, {
        method: "DELETE"
    });
}

// Công khai các thao tác dữ liệu để các script trang gọi dùng.
window.LuxuryCarsProducts = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};