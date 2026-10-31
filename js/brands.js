const brands = [

    {
        id: 1,
        name: "Lamborghini",
        country: "italy",
        countryName: "ITALY",
        location: "Sant’Agata Bolognese, Ý",
        initial: "L",
        logo: "https://cdn.simpleicons.org/lamborghini",
        image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1000&q=85",
        slogan: "BOLD BY NATURE",
        description: "Được thành lập năm 1963, Lamborghini chinh phục thế giới bằng thiết kế góc cạnh, dáng xe đầy uy lực và tinh thần không thỏa hiệp. Mỗi mẫu xe là sự kết hợp giữa công nghệ hiện đại và cảm xúc lái mãnh liệt.",
        models: "Miura · Countach · Aventador · Revuelto"
    },

    {
        id: 2,
        name: "Ferrari",
        country: "italy",
        countryName: "ITALY",
        location: "Maranello, Ý",
        initial: "F",
        logo: "https://cdn.simpleicons.org/ferrari",
        image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1000&q=85",
        slogan: "RACING SPIRIT",
        description: "Di sản đường đua là trái tim của Ferrari. Những chiếc xe Maranello kết hợp động cơ giàu cảm xúc, thiết kế quyến rũ và khả năng vận hành chính xác dành cho người đam mê cầm lái.",
        models: "F40 · 458 Italia · 296 GTB · SF90 Stradale"
    },

    {
        id: 3,
        name: "McLaren",
        country: "uk",
        countryName: "UNITED KINGDOM",
        location: "Woking, Anh Quốc",
        initial: "M",
        logo: "https://cdn.simpleicons.org/mclaren",
        image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1000&q=85",
        slogan: "ENGINEERED TO EXCITE",
        description: "Sinh ra từ đường đua, McLaren theo đuổi hiệu suất bằng cấu trúc siêu nhẹ và khí động học tiên tiến. Triết lý lấy người lái làm trung tâm tạo nên những chiếc xe nhanh nhạy, chính xác và giàu công nghệ.",
        models: "F1 · P1 · 720S · 750S"
    },

    {
        id: 4,
        name: "Porsche",
        country: "germany",
        countryName: "GERMANY",
        location: "Stuttgart, Đức",
        initial: "P",
        logo: "https://cdn.simpleicons.org/porsche",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85",
        slogan: "TIMELESS PRECISION",
        description: "Porsche nổi bật với kỹ thuật Đức chuẩn xác và khả năng cân bằng giữa hiệu năng thể thao với sự tiện dụng. Dòng 911 mang dáng vẻ vượt thời gian, liên tục được cải tiến qua nhiều thế hệ.",
        models: "911 · 911 Turbo S · 918 Spyder"
    },

    {
        id: 5,
        name: "Bugatti",
        country: "france",
        countryName: "FRANCE",
        location: "Molsheim, Pháp",
        initial: "B",
        logo: "https://cdn.simpleicons.org/bugatti",
        image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1000&q=85",
        slogan: "THE ART OF SPEED",
        description: "Bugatti kết hợp tốc độ phi thường với nghệ thuật chế tác tinh xảo. Từ di sản Type 35 đến Veyron và Chiron, mỗi mẫu xe là một biểu tượng kỹ thuật được hoàn thiện với sự chăm chút tỉ mỉ.",
        models: "Type 35 · Veyron · Chiron"
    },

    {
        id: 6,
        name: "Aston Martin",
        country: "uk",
        countryName: "UNITED KINGDOM",
        location: "Gaydon, Anh Quốc",
        initial: "A",
        logo: "https://cdn.simpleicons.org/astonmartin",
        image: "https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?auto=format&fit=crop&w=1000&q=85",
        slogan: "BRITISH ELEGANCE",
        description: "Aston Martin mang phong thái thanh lịch của Anh Quốc vào thế giới xe thể thao. Nội thất thủ công cao cấp, đường nét tinh tế và hiệu năng mạnh mẽ tạo nên những chiếc grand tourer đầy cảm hứng.",
        models: "DB5 · Vantage · DBS · DB12"
    },
    {
        id: 7,
        name: "Mercedes-Benz",
        country: "germany",
        countryName: "GERMANY",
        location: "Stuttgart, Germany",
        initial: "M",
        logo: "https://cdn.simpleicons.org/mercedes",
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=85",
        description: "Mercedes-Benz kết hợp công nghệ hiện đại, hiệu suất mạnh mẽ và thiết kế sang trọng.",
        models: "AMG GT, S-Class, G-Class"
    },
    {
        id: 8,
        name: "Audi",
        country: "germany",
        countryName: "GERMANY",
        location: "Ingolstadt, Germany",
        initial: "A",
        logo: "https://cdn.simpleicons.org/audi",
        image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=85",
        description: "Audi nổi bật với thiết kế hiện đại, hệ dẫn động quattro và công nghệ tiên tiến.",
        models: "R8, RS7, e-tron GT"
    },
    {
        id: 9,
        name: "Koenigsegg",
        country: "sweden",
        countryName: "SWEDEN",
        location: "Ängelholm, Sweden",
        initial: "K",
        logo: "https://cdn.simpleicons.org/koenigsegg",
        image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1000&q=85",
        description: "Koenigsegg là thương hiệu hypercar nổi tiếng với tốc độ cực cao và công nghệ động cơ độc đáo.",
        models: "Jesko, Regera, Gemera"
    },
    {
        id: 10,
        name: "Pagani",
        country: "italy",
        countryName: "ITALY",
        location: "San Cesario sul Panaro, Italy",
        initial: "P",
        logo: "https://cdn.simpleicons.org/pagani",
        image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1000&q=85",
        description: "Pagani tạo ra những chiếc hypercar thủ công với thiết kế nghệ thuật và vật liệu công nghệ cao.",
        models: "Zonda, Huayra, Utopia"
    },
    {
        id: "maserati",
        name: "Maserati",
        country: "italy",
        countryName: "ITALY",
        location: "Modena, Italy",
        initial: "M",
        logo: "https://cdn.simpleicons.org/maserati",
        image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1000&q=85",
        description: "Maserati kết hợp phong cách Ý, âm thanh động cơ đặc trưng và trải nghiệm lái thể thao sang trọng.",
        models: "MC20, GranTurismo, Grecale"
    }

];


const brandGrid = document.getElementById("brandGrid");
const brandFilters = document.querySelectorAll(".brand-filter-button");
const brandResultCount = document.getElementById("brandResultCount");
const brandEmpty = document.getElementById("brandEmpty");
const totalBrands = document.getElementById("totalBrands");


if (totalBrands) {
    totalBrands.textContent = String(brands.length).padStart(2, "0");
}

function renderBrands(brandList) {

    brandGrid.innerHTML = "";

    brandList.forEach((brand, index) => {

        const card = document.createElement("article");

        card.className = "brand-card";
        card.dataset.country = brand.country;

        card.innerHTML = `
            <div class="brand-card-top">
                <span>
                    ${String(index + 1).padStart(2, "0")} /
                    ${String(brandList.length).padStart(2, "0")}
                </span>

                <span class="brand-country-tag">
                    ${brand.countryName}
                </span>
            </div>

            <div class="brand-logo" data-initial="${brand.initial}">
                <img src="${brand.logo}"
                     alt="Logo ${brand.name}"
                     loading="lazy">
            </div>

            <h3>${brand.name}</h3>

            <p class="brand-location">
                ${brand.location}
            </p>

            <a class="brand-car-image"
               href="/html/collection.html?brand=${encodeURIComponent(brand.name)}"
               aria-label="Xem xe ${brand.name}">

                <img src="${brand.image}"
                     alt="Siêu xe ${brand.name}"
                     loading="lazy"
                     decoding="async">

                <span class="brand-image-label">
                    ${brand.slogan}
                </span>
            </a>

            <p class="brand-description">
                ${brand.description}
            </p>

            <div class="brand-models">
                <span>MẪU XE TIÊU BIỂU</span>
                <p>${brand.models}</p>
            </div>

            <a class="brand-card-link"
               href="/html/collection.html?brand=${encodeURIComponent(brand.name)}">

                Khám phá ${brand.name}
                <span>→</span>
            </a>
        `;

        brandGrid.appendChild(card);
    });

    brandResultCount.textContent =
        `${String(brandList.length).padStart(2, "0")} thương hiệu`;

    brandEmpty.hidden = brandList.length !== 0;

    handleImages();
}

function handleImages() {

    document.querySelectorAll(".brand-logo img").forEach((image) => {

        const logoBox = image.closest(".brand-logo");

        function checkLogo() {

            const hasLogo = image.naturalWidth > 0;

            logoBox.classList.toggle("has-logo", hasLogo);
            image.hidden = !hasLogo;
        }

        image.addEventListener("load", checkLogo);
        image.addEventListener("error", checkLogo);

        if (image.complete) {
            checkLogo();
        }
    });

    document.querySelectorAll(".brand-car-image img").forEach((image) => {

        image.addEventListener("error", function() {

            if (this.dataset.fallbackAttempted) {
                return;
            }

            this.dataset.fallbackAttempted = "true";
            this.src = "/assets/images/lamboghini.jpg";
        });
    });
}


brandFilters.forEach((button) => {

    button.addEventListener("click", function() {

        const selectedCountry = this.dataset.filter;

        brandFilters.forEach((filterButton) => {

            const isActive = filterButton === this;

            filterButton.classList.toggle("active", isActive);

            filterButton.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });

        const filteredBrands = selectedCountry === "all" ?
            brands :
            brands.filter((brand) => brand.country === selectedCountry);

        renderBrands(filteredBrands);
    });
});


renderBrands(brands);