const articles = [{
        id: 1,
        title: "Siêu xe là gì? Những điều cần biết",
        category: "kien-thuc",
        categoryName: "Kiến thức",
        date: "26/10/2026",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
        description: "Tìm hiểu khái niệm siêu xe, đặc điểm và những yếu tố tạo nên một chiếc xe đẳng cấp.",
        content: [{
                heading: "Siêu xe là gì?",
                text: "Siêu xe là cách gọi phổ biến dành cho những mẫu ô tô thể thao hiệu suất cao, thường có thiết kế nổi bật, khả năng vận hành mạnh mẽ và được phát triển với nhiều công nghệ tiên tiến."
            },
            {
                heading: "Đặc điểm của siêu xe",
                text: "Các đặc điểm thường gặp gồm động cơ hiệu suất cao, khả năng tăng tốc ấn tượng, thiết kế khí động học, vật liệu nhẹ và hệ thống phanh hiệu quả."
            },
            {
                heading: "Điều cần lưu ý",
                text: "Giá bán, hiệu suất và trang bị khác nhau tùy mẫu xe. Không có một tiêu chí duy nhất áp dụng cho mọi mẫu xe được gọi là siêu xe."
            }
        ]
    },
    {
        id: 2,
        title: "Công nghệ động cơ trên siêu xe",
        category: "cong-nghe",
        categoryName: "Công nghệ",
        date: "26/10/2026",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
        description: "Khám phá động cơ tăng áp, động cơ hybrid và công nghệ giúp xe đạt hiệu suất cao.",
        content: [{
                heading: "Động cơ hiệu suất cao",
                text: "Động cơ trên siêu xe được thiết kế để tạo ra công suất lớn và phản hồi nhanh. Các cấu hình có thể bao gồm V8, V10, V12 hoặc những loại động cơ khác."
            },
            {
                heading: "Công nghệ tăng áp",
                text: "Turbo tăng lượng không khí đưa vào động cơ, giúp tăng công suất. Tuy nhiên, hiệu quả thực tế phụ thuộc vào cách thiết kế và điều khiển động cơ."
            },
            {
                heading: "Siêu xe hybrid",
                text: "Một số mẫu xe kết hợp động cơ đốt trong với mô-tơ điện để cải thiện khả năng tăng tốc và hiệu quả sử dụng năng lượng."
            }
        ]
    },
    {
        id: 3,
        title: "Cách chăm sóc xe sang đúng cách",
        category: "kinh-nghiem",
        categoryName: "Kinh nghiệm",
        date: "26/10/2026",
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
        description: "Những lưu ý cơ bản khi vệ sinh, bảo dưỡng và sử dụng xe sang.",
        content: [{
                heading: "Bảo dưỡng định kỳ",
                text: "Hãy tuân thủ lịch bảo dưỡng và sử dụng vật tư đúng thông số do nhà sản xuất khuyến nghị. Điều này giúp phát hiện sớm các vấn đề kỹ thuật."
            },
            {
                heading: "Vệ sinh ngoại thất",
                text: "Sử dụng dung dịch phù hợp cho sơn ô tô, khăn mềm và dụng cụ sạch để hạn chế trầy xước bề mặt."
            },
            {
                heading: "Kiểm tra trước khi vận hành",
                text: "Nên chú ý đến lốp, phanh, đèn, mức dầu và cảnh báo trên bảng điều khiển. Khi có dấu hiệu bất thường, hãy đưa xe đến cơ sở chuyên môn."
            }
        ]
    },
    {
        id: 4,
        title: "Lamborghini và triết lý thiết kế táo bạo",
        category: "thuong-hieu",
        categoryName: "Thương hiệu",
        date: "26/10/2026",
        image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
        description: "Tìm hiểu phong cách thiết kế góc cạnh và dấu ấn riêng của Lamborghini.",
        content: [{
                heading: "Thiết kế nổi bật",
                text: "Lamborghini thường được biết đến với các đường nét góc cạnh, tỷ lệ thể thao và những chi tiết tạo hình mạnh mẽ."
            },
            {
                heading: "Hiệu suất và trải nghiệm",
                text: "Tùy mẫu xe, thương hiệu phát triển nhiều giải pháp về động cơ, khung gầm và khí động học nhằm mang lại trải nghiệm lái thể thao."
            },
            {
                heading: "Lựa chọn mẫu xe",
                text: "Khi tìm hiểu một mẫu Lamborghini, hãy so sánh phiên bản, thông số kỹ thuật, chi phí sở hữu và điều kiện sử dụng thực tế."
            }
        ]
    },
    {
        id: 5,
        title: "Những điều cần biết trước khi mua xe cũ",
        category: "kinh-nghiem",
        categoryName: "Kinh nghiệm",
        date: "26/10/2026",
        image: "https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?auto=format&fit=crop&w=800&q=80",
        description: "Các bước kiểm tra lịch sử, tình trạng xe và giấy tờ trước khi quyết định mua.",
        content: [{
                heading: "Kiểm tra lịch sử xe",
                text: "Tìm hiểu lịch sử bảo dưỡng, tai nạn, số lần chuyển chủ và đối chiếu thông tin nhận dạng xe."
            },
            {
                heading: "Kiểm tra kỹ thuật",
                text: "Nên nhờ kỹ thuật viên có chuyên môn kiểm tra động cơ, hộp số, hệ thống điện, khung gầm và tình trạng thân vỏ."
            },
            {
                heading: "Tính tổng chi phí",
                text: "Ngoài giá mua, cần tính thêm bảo hiểm, bảo dưỡng, phụ tùng, nhiên liệu và các khoản phí liên quan."
            }
        ]
    },
    {
        id: 6,
        title: "Ferrari: Di sản của tốc độ",
        category: "thuong-hieu",
        categoryName: "Thương hiệu",
        date: "26/10/2026",
        image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=800&q=80",
        description: "Tìm hiểu dấu ấn của Ferrari trong thế giới xe thể thao và đua xe.",
        content: [{
                heading: "Nguồn gốc thương hiệu",
                text: "Ferrari là thương hiệu ô tô thể thao của Italy, nổi tiếng với các mẫu xe hiệu suất cao và lịch sử gắn liền với đua xe."
            },
            {
                heading: "Dấu ấn thiết kế",
                text: "Các mẫu xe Ferrari có phong cách riêng, kết hợp thiết kế thể thao với những yêu cầu về hiệu suất và khí động học."
            },
            {
                heading: "Trải nghiệm Ferrari",
                text: "Mỗi dòng xe có thông số và đặc tính riêng. Người quan tâm nên tìm hiểu kỹ từng mẫu và phiên bản để có lựa chọn phù hợp."
            }
        ]
    }
];

const articleGrid = document.getElementById("articleGrid");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const emptyMessage = document.getElementById("emptyMessage");
const detailSection = document.getElementById("detailSection");

let selectedCategory = "all";

function renderArticles() {
    const keyword = searchInput.value.trim().toLowerCase();

    const filteredArticles = articles.filter(function(article) {
        const matchesCategory =
            selectedCategory === "all" ||
            article.category === selectedCategory;

        const searchText =
            article.title + " " +
            article.description + " " +
            article.categoryName;

        const matchesKeyword = searchText.toLowerCase().includes(keyword);

        return matchesCategory && matchesKeyword;
    });

    articleGrid.innerHTML = "";

    filteredArticles.forEach(function(article) {
        const card = document.createElement("article");
        card.className = "article-card";

        const imageBox = document.createElement("div");
        imageBox.className = "article-image";

        const image = document.createElement("img");
        image.src = article.image;
        image.alt = article.title;
        image.loading = "lazy";

        image.addEventListener("error", function() {
            imageBox.style.display = "none";
        });

        imageBox.appendChild(image);

        const info = document.createElement("div");
        info.className = "article-info";

        const category = document.createElement("span");
        category.className = "article-category";
        category.textContent = article.categoryName;

        const title = document.createElement("h3");
        title.textContent = article.title;

        const description = document.createElement("p");
        description.textContent = article.description;

        const button = document.createElement("button");
        button.className = "read-more";
        button.textContent = "ĐỌC BÀI VIẾT →";
        button.addEventListener("click", function() {
            showDetail(article.id);
        });

        info.append(category, title, description, button);
        card.append(imageBox, info);
        articleGrid.appendChild(card);
    });

    emptyMessage.style.display =
        filteredArticles.length === 0 ? "block" : "none";
}

function showDetail(articleId) {
    const article = articles.find(function(item) {
        return item.id === articleId;
    });

    if (!article) return;

    document.getElementById("detailCategory").textContent =
        article.categoryName;

    document.getElementById("detailTitle").textContent =
        article.title;

    document.getElementById("detailDate").textContent =
        "Ngày đăng: " + article.date;

    const body = document.getElementById("detailBody");
    body.innerHTML = "";

    article.content.forEach(function(section) {
        const heading = document.createElement("h3");
        heading.textContent = section.heading;

        const paragraph = document.createElement("p");
        paragraph.textContent = section.text;

        body.append(heading, paragraph);
    });

    detailSection.classList.add("show");
    detailSection.scrollIntoView({ behavior: "smooth" });
}

filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        filterButtons.forEach(function(item) {
            item.classList.remove("active");
        });

        button.classList.add("active");
        selectedCategory = button.dataset.category;
        renderArticles();
    });
});

searchInput.addEventListener("input", renderArticles);

document.getElementById("closeDetail").addEventListener("click", function() {
    detailSection.classList.remove("show");
    document.getElementById("articles").scrollIntoView({
        behavior: "smooth"
    });
});

renderArticles();