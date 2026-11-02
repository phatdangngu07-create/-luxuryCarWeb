// Đường dẫn dữ liệu
const API_URL = "http://localhost:3000/products";

// Lấy danh sách sản phẩm
async function getProducts() {
    let response = await fetch(API_URL);
    let data = await response.json();

    return data;
}

// Thêm sản phẩm
async function createProduct(product) {
    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });
}

// Cập nhật sản phẩm
async function updateProduct(product) {
    await fetch(API_URL + "/" + product.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });
}

// Xóa sản phẩm
async function deleteProduct(id) {
    await fetch(API_URL + "/" + id, {
        method: "DELETE"
    });
}

// Đưa các hàm ra ngoài
window.LuxuryCarsProducts = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};