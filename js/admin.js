const catalog = window.LuxuryCarsProducts;

// Mảng lưu sản phẩm
let products = [];

const fallbackImage = "/assets/images/lamboghini.jpg";
const carImageFiles = [
    "Màu cam đỏ.jpg",
    "Màu vàng .jpg",
    "Xe màu  đỏ .jpg",
    "Xe màu Cam .jpg",
    "Xe màu trắng .jpg",
    "Xe màu xám.jpg",
    "Xe màu đen .jpg",
    "Xe màu đỏ .jpg"
];

// Lấy phần tử HTML
const tableBody = document.getElementById("productTableBody");
const searchInput = document.getElementById("productSearch");
const brandFilter = document.getElementById("brandFilter");
const segmentFilter = document.getElementById("segmentFilter");

const productModal = document.getElementById("productModal");
const productForm = document.getElementById("productForm");

// Lấy các ô nhập dữ liệu
const productId = document.getElementById("productId");
const productName = document.getElementById("productName");
const productBrand = document.getElementById("productBrand");
const productEngine = document.getElementById("productEngine");
const productSegment = document.getElementById("productSegment");
const productYear = document.getElementById("productYear");
const productPower = document.getElementById("productPower");
const productSpeed = document.getElementById("productSpeed");
const productImage = document.getElementById("productImage");
const productImagePreset = document.getElementById("productImagePreset");
const productImagePreview = document.getElementById("productImagePreview");
const productDescription = document.getElementById("productDescription");

for (const fileName of carImageFiles) {
    const option = document.createElement("option");
    option.value = `/assets/images/cars/${encodeURIComponent(fileName)}`;
    option.textContent = fileName;
    productImagePreset.appendChild(option);
}

function updateProductImagePreview() {
    const imagePath = productImage.value.trim();
    productImagePreview.hidden = !imagePath;
    if (imagePath) {
        productImagePreview.src = imagePath;
    } else {
        productImagePreview.removeAttribute("src");
    }
}

function setProductImage(imagePath) {
    productImage.value = imagePath || "";
    productImagePreset.value = imagePath || "";
    updateProductImagePreview();
}

productImagePreset.addEventListener("change", function() {
    if (productImagePreset.value) {
        productImage.value = productImagePreset.value;
        updateProductImagePreview();
    }
});

productImage.addEventListener("input", function() {
    productImagePreset.value = productImage.value;
    updateProductImagePreview();
});

// 1. LẤY DỮ LIỆU TỪ JSON SERVER
async function loadProducts() {
    try {
        products = await catalog.getProducts();

        showProducts();
        updateStats();
        updateBrandFilter();
        updateProductBrandOptions();

    } catch (error) {
        alert("Không thể lấy dữ liệu!");
        console.log(error);
    }
}

// 2. HIỂN THỊ SẢN PHẨM
function showProducts() {
    tableBody.innerHTML = "";

    let keyword = searchInput.value.toLowerCase();
    let brand = brandFilter.value;
    let segment = segmentFilter.value;

    for (let i = 0; i < products.length; i++) {

        let product = products[i];

        let searchText = (
            product.name + " " +
            product.brand + " " +
            product.engine
        ).toLowerCase();

        if (
            searchText.includes(keyword) &&
            (brand === "" || product.brand === brand) &&
            (segment === "" || product.segment === segment)
        ) {

            let row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    <img src="${product.image || fallbackImage}" width="60">
                    ${product.name}
                </td>

                <td>${product.brand}</td>
                <td>${product.segment}</td>
                <td>${product.engine}</td>
                <td>${product.year}</td>
                <td>${product.power} CV</td>
                <td>${product.speed} km/h</td>
                <td></td>
            `;

            // NÚT SỬA
            let editButton = document.createElement("button");

            editButton.innerText = "Sửa";

            editButton.onclick = function() {
                editProduct(product);
            };

            // NÚT XÓA
            let deleteButton = document.createElement("button");

            deleteButton.innerText = "Xóa";

            deleteButton.onclick = function() {
                deleteProduct(product.id);
            };

            let actionCell = row.lastElementChild;

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);

            tableBody.appendChild(row);
        }
    }

    // ĐẾM SẢN PHẨM
    document.getElementById("resultCount").innerText =
        tableBody.children.length + " sản phẩm";

    document.getElementById("emptyProducts").hidden =
        tableBody.children.length > 0;
}

// 3. THỐNG KÊ SẢN PHẨM
function updateStats() {

    let total = products.length;
    let supercars = 0;
    let hypercars = 0;
    let brands = [];

    for (let i = 0; i < products.length; i++) {

        if (products[i].segment === "Supercar") {
            supercars++;
        }

        if (products[i].segment === "Hypercar") {
            hypercars++;
        }

        if (!brands.includes(products[i].brand)) {
            brands.push(products[i].brand);
        }
    }

    document.getElementById("totalProducts").innerText = total;
    document.getElementById("totalBrands").innerText = brands.length;
    document.getElementById("totalSupercars").innerText = supercars;
    document.getElementById("totalHypercars").innerText = hypercars;
}

// 4. LỌC THƯƠNG HIỆU
function updateBrandFilter() {

    let selectedBrand = brandFilter.value;

    brandFilter.innerHTML =
        '<option value="">Tất cả thương hiệu</option>';

    for (let i = 0; i < products.length; i++) {

        let brand = products[i].brand;
        let found = false;

        for (let j = 0; j < brandFilter.options.length; j++) {

            if (brandFilter.options[j].value === brand) {
                found = true;
            }
        }

        if (!found) {

            let option = document.createElement("option");

            option.value = brand;
            option.textContent = brand;

            brandFilter.appendChild(option);
        }
    }

    brandFilter.value = selectedBrand;
}

function updateProductBrandOptions() {
    let selectedBrand = productBrand.value;

    productBrand.innerHTML =
        '<option value="">Chọn thương hiệu</option>';

    for (let i = 0; i < products.length; i++) {
        let brand = products[i].brand;

        if (!brand) {
            continue;
        }

        let found = false;
        for (let j = 0; j < productBrand.options.length; j++) {
            if (productBrand.options[j].value === brand) {
                found = true;
                break;
            }
        }

        if (!found) {
            let option = document.createElement("option");
            option.value = brand;
            option.textContent = brand;
            productBrand.appendChild(option);
        }
    }

    productBrand.value = selectedBrand;
}

// 5. MỞ FORM THÊM SẢN PHẨM
document.getElementById("addProductButton").onclick = function() {

    productForm.reset();
    productBrand.value = "";

    productId.value = "";
    setProductImage(fallbackImage);

    document.getElementById("modalTitle").innerText =
        "Thêm sản phẩm";

    document.getElementById("formError").innerText = "";

    productModal.classList.add("show");
};

// 6. ĐÓNG FORM
function closeModal() {
    productModal.classList.remove("show");
}

document.getElementById("closeProductModal").onclick = closeModal;

document.getElementById("cancelProductModal").onclick = closeModal;

// 7. SỬA SẢN PHẨM
function editProduct(product) {

    productId.value = product.id;
    productName.value = product.name;
    productBrand.value = product.brand;
    productEngine.value = product.engine;
    productSegment.value = product.segment;
    productYear.value = product.year;
    productPower.value = product.power;
    productSpeed.value = product.speed;
    setProductImage(product.image);
    productDescription.value = product.description;

    document.getElementById("modalTitle").innerText =
        "Cập nhật sản phẩm";

    productModal.classList.add("show");
}

// 8. THÊM VÀ CẬP NHẬT SẢN PHẨM
productForm.onsubmit = async function(event) {

    event.preventDefault();

    let product = {

        id: productId.value || Date.now().toString(),

        name: productName.value,
        brand: productBrand.value,
        engine: productEngine.value,
        segment: productSegment.value,

        year: Number(productYear.value),
        power: Number(productPower.value),
        speed: Number(productSpeed.value),

        image: productImage.value,
        description: productDescription.value
    };

    try {

        if (productId.value === "") {

            await catalog.createProduct(product);

            alert("Thêm sản phẩm thành công!");

        } else {

            await catalog.updateProduct(product);

            alert("Cập nhật sản phẩm thành công!");
        }
        closeModal();

        await loadProducts();

    } catch (error) {

        alert("Không thể lưu sản phẩm!");
        console.log(error);
    }
};

// 9. XÓA SẢN PHẨM
async function deleteProduct(id) {

    let answer = confirm(
        "Bạn có chắc chắn muốn xóa sản phẩm này không?"
    );

    if (answer) {

        try {

            await catalog.deleteProduct(id);

            alert("Xóa sản phẩm thành công!");

            await loadProducts();

        } catch (error) {

            alert("Không thể xóa sản phẩm!");
            console.log(error);
        }
    }
}

// 10. TÌM KIẾM SẢN PHẨM
searchInput.oninput = function() {
    showProducts();
};

// 11. LỌC SẢN PHẨM
brandFilter.onchange = function() {
    showProducts();
};

segmentFilter.onchange = function() {
    showProducts();
};

// 12. TẢI DỮ LIỆU KHI MỞ TRANG
loadProducts();