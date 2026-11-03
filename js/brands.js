// Dữ liệu nội dung tĩnh cho thẻ thương hiệu: xuất xứ, hình ảnh, mô tả và mẫu xe.
const brands = [{
        name: "Lamborghini",
        country: "italy",
        countryName: "ITALY",
        location: "Sant’Agata Bolognese, Ý",
        logo: "https://cdn.simpleicons.org/lamborghini",
        image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1000&q=85",
        description: "Được thành lập năm 1963, Lamborghini chinh phục thế giới bằng thiết kế góc cạnh, dáng xe đầy uy lực và tinh thần không thỏa hiệp.",
        models: "Miura · Countach · Aventador · Revuelto",
        slogan: "BOLD BY NATURE"
    },
    {
        name: "Ferrari",
        country: "italy",
        countryName: "ITALY",
        location: "Maranello, Ý",
        logo: "https://cdn.simpleicons.org/ferrari",
        image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1000&q=85",
        description: "Di sản đường đua là trái tim của Ferrari. Những chiếc xe kết hợp động cơ giàu cảm xúc, thiết kế quyến rũ và khả năng vận hành chính xác.",
        models: "F40 · 458 Italia · 296 GTB · SF90 Stradale",
        slogan: "RACING SPIRIT"
    },
    {
        name: "McLaren",
        country: "uk",
        countryName: "UNITED KINGDOM",
        location: "Woking, Anh Quốc",
        logo: "https://cdn.simpleicons.org/mclaren",
        image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1000&q=85",
        description: "Sinh ra từ đường đua, McLaren theo đuổi hiệu suất bằng cấu trúc siêu nhẹ và khí động học tiên tiến.",
        models: "F1 · P1 · 720S · 750S",
        slogan: "ENGINEERED TO EXCITE"
    },
    {
        name: "Porsche",
        country: "germany",
        countryName: "GERMANY",
        location: "Stuttgart, Đức",
        logo: "https://cdn.simpleicons.org/porsche",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85",
        description: "Porsche nổi bật với kỹ thuật Đức chuẩn xác và khả năng cân bằng giữa hiệu năng thể thao với sự tiện dụng.",
        models: "911 · 911 Turbo S · 918 Spyder",
        slogan: "TIMELESS PRECISION"
    },
    {
        name: "Bugatti",
        country: "france",
        countryName: "FRANCE",
        location: "Molsheim, Pháp",
        logo: "https://cdn.simpleicons.org/bugatti",
        image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1000&q=85",
        description: "Bugatti kết hợp tốc độ phi thường với nghệ thuật chế tác tinh xảo. Mỗi mẫu xe là một biểu tượng kỹ thuật.",
        models: "Type 35 · Veyron · Chiron",
        slogan: "THE ART OF SPEED"
    },
    {
        name: "Aston Martin",
        country: "uk",
        countryName: "UNITED KINGDOM",
        location: "Gaydon, Anh Quốc",
        logo: "https://cdn.simpleicons.org/astonmartin",
        image: "https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?auto=format&fit=crop&w=1000&q=85",
        description: "Aston Martin mang phong thái thanh lịch của Anh Quốc vào thế giới xe thể thao với nội thất cao cấp và hiệu năng mạnh mẽ.",
        models: "DB5 · Vantage · DBS · DB12",
        slogan: "BRITISH ELEGANCE"
    }
];


// Tham chiếu các vùng hiển thị và nút lọc của trang thương hiệu.
const brandGrid = document.getElementById("brandGrid");
const brandResultCount = document.getElementById("brandResultCount");
const brandEmpty = document.getElementById("brandEmpty");
const filterButtons = document.querySelectorAll(".brand-filter-button");


// Dựng thẻ thương hiệu, cập nhật tổng số và trạng thái danh sách rỗng.
function showBrands(list) {
    brandGrid.innerHTML = "";

    for (let i = 0; i < list.length; i++) {
        const brand = list[i];

        brandGrid.innerHTML += `
            <article class="brand-card" data-country="${brand.country}">

                <div class="brand-card-top">
                    <span>0${i + 1} / 06</span>
                    <span class="brand-country-tag">${brand.countryName}</span>
                </div>

                <div class="brand-logo">
                    <img src="${brand.logo}" alt="Logo ${brand.name}">
                </div>

                <h3>${brand.name}</h3>

                <p class="brand-location">${brand.location}</p>

                <a class="brand-car-image"
                   href="collection.html?brand=${encodeURIComponent(brand.name)}">

                    <img src="${brand.image}" alt="Siêu xe ${brand.name}">

                    <span class="brand-image-label">${brand.slogan}</span>
                </a>

                <p class="brand-description">
                    ${brand.description}
                </p>

                <div class="brand-models">
                    <span>MẪU XE TIÊU BIỂU</span>
                    <p>${brand.models}</p>
                </div>

                <a class="brand-card-link"
                   href="collection.html?brand=${encodeURIComponent(brand.name)}">
                    Khám phá ${brand.name} →
                </a>

            </article>
        `;
    }

    brandResultCount.innerText = list.length + " thương hiệu";

    if (list.length === 0) {
        brandEmpty.hidden = false;
    } else {
        brandEmpty.hidden = true;
    }
}


// Chọn toàn bộ thương hiệu hoặc chỉ những thương hiệu của một quốc gia.
function filterBrands(country) {
    let result = [];

    if (country === "all") {
        result = brands;
    } else {
        for (let i = 0; i < brands.length; i++) {
            if (brands[i].country === country) {
                result.push(brands[i]);
            }
        }
    }

    showBrands(result);
}


// Cập nhật trạng thái nút đang chọn và hiển thị kết quả lọc tương ứng.
for (let i = 0; i < filterButtons.length; i++) {
    filterButtons[i].onclick = function() {

        const country = this.getAttribute("data-filter");

        for (let j = 0; j < filterButtons.length; j++) {
            filterButtons[j].classList.remove("active");
        }

        this.classList.add("active");

        filterBrands(country);
    };
}


// Khởi tạo trang với đầy đủ thương hiệu trước khi người dùng lọc.
showBrands(brands);