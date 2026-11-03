// Tải RSS thị trường xe, lọc và dựng danh sách tin cùng phần xem tóm tắt.
(() => {
    const journalGrid = document.querySelector("#journalGrid");
    const journalStatus = document.querySelector("#journalStatus");
    const articleDetail = document.querySelector("#journalArticleDetail");
    if (!journalGrid || !journalStatus || !articleDetail) return;

    const feedUrl = "https://vnexpress.net/rss/oto-xe-may.rss";
    const feedApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
    const fallbackImage = "/assets/images/lamboghini.jpg";
    const marketKeywords = /thị trường|doanh số|doanh thu|bán chạy|giá xe|giá bán|giảm giá|tăng giá|mở bán|ra mắt|xe mới|xe điện|điện hóa|hybrid|mẫu xe|hãng xe|bàn giao|nhà máy|lắp ráp|nhập khẩu|sản lượng|ô tô điện|xe hybrid/i;
    const trafficIncidentKeywords = /tai nạn|đâm liên hoàn|va chạm|tông trúng|mất lái|cháy xe|cao tốc/i;
    let articles = [];

    // Loại HTML và giải mã nội dung mô tả RSS thành văn bản thuần.
    const parseDescription = (description) => {
        let text = String(description || "");
        for (let attempt = 0; attempt < 3; attempt += 1) {
            const parsed = new DOMParser().parseFromString(text, "text/html");
            parsed.querySelectorAll("img, a").forEach((element) => {
                if (element.tagName === "IMG") {
                    element.remove();
                } else {
                    element.replaceWith(document.createTextNode(element.textContent || ""));
                }
            });
            const decoded = (parsed.body.textContent || "").replace(/\s+/g, " ").trim();
            if (decoded === text || !/&(?:amp|lt|gt|quot|#\d+);/i.test(decoded)) {
                return decoded;
            }
            text = decoded;
        }
        return text;
    };

    // Chỉ cho phép liên kết HTTPS từ feed trước khi dùng làm ảnh hoặc nguồn.
    const safeHttpsUrl = (value) => {
        try {
            const url = new URL(value);
            return url.protocol === "https:" ? url.href : "";
        } catch {
            return "";
        }
    };

    // Trả về cả giá trị máy đọc được và nhãn ngày giờ theo tiếng Việt.
    const formatDate = (value) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return null;
        return {
            dateTime: date.toISOString(),
            label: new Intl.DateTimeFormat("vi-VN", {
                dateStyle: "long",
                timeStyle: "short"
            }).format(date)
        };
    };

    // Dựng thẻ tin với hình, nguồn, ngày đăng, tóm tắt và liên kết mở bài.
    const createCard = (article, index) => {
        const column = document.createElement("div");
        column.className = "col-md-6 col-xl-4";

        const card = document.createElement("article");
        card.className = "journal-card";

        const imageWrap = document.createElement("div");
        imageWrap.className = "journal-card-image";

        const image = document.createElement("img");
        const imageUrl = safeHttpsUrl(article.thumbnail);
        image.src = imageUrl || fallbackImage;
        image.alt = `Ảnh minh họa: ${article.title}`;
        image.loading = "lazy";
        image.decoding = "async";
        image.addEventListener("error", () => {
            if (image.src.endsWith(fallbackImage)) {
                image.hidden = true;
            } else {
                image.src = fallbackImage;
            }
        });

        const label = document.createElement("span");
        label.className = "journal-image-label";
        label.textContent = "TIN MỚI";
        imageWrap.append(image, label);

        const content = document.createElement("div");
        content.className = "journal-card-content";

        const category = document.createElement("p");
        category.className = "journal-category";
        category.textContent = `THỊ TRƯỜNG XE · ${article.source}`;

        const heading = document.createElement("h2");
        heading.textContent = article.title;

        const summary = document.createElement("p");
        summary.textContent = article.summary || "Mở phần tóm tắt để xem thông tin và bài viết gốc từ nguồn tin.";

        const articleDate = formatDate(article.pubDate);
        if (articleDate) {
            const time = document.createElement("time");
            time.className = "journal-published-date";
            time.dateTime = articleDate.dateTime;
            time.textContent = articleDate.label;
            content.append(category, heading, time, summary);
        } else {
            content.append(category, heading, summary);
        }

        const readLink = document.createElement("a");
        readLink.className = "card-text-link";
        readLink.href = `?article=${encodeURIComponent(article.link)}`;
        readLink.dataset.articleIndex = String(index);
        readLink.textContent = "Xem nội dung ";
        readLink.append(document.createTextNode("\u2192"));
        content.append(readLink);

        card.append(imageWrap, content);
        column.append(card);
        return column;
    };

    // Đóng phần tóm tắt, khôi phục danh sách và xóa tham số bài khỏi URL.
    const closeArticle = () => {
        articleDetail.hidden = true;
        articleDetail.replaceChildren();
        journalGrid.hidden = false;
        const url = new URL(window.location.href);
        url.searchParams.delete("article");
        window.history.replaceState(null, "", url);
    };

    // Hiển thị tóm tắt, thông tin nguồn và liên kết đọc bài gốc.
    const showArticle = (article) => {
        if (!article) {
            closeArticle();
            journalStatus.hidden = false;
            journalStatus.textContent = "Không tìm thấy bài viết trong danh sách tin mới.";
            return;
        }

        journalGrid.hidden = true;
        journalStatus.hidden = true;
        articleDetail.replaceChildren();
        articleDetail.hidden = false;

        const backLink = document.createElement("button");
        backLink.type = "button";
        backLink.className = "journal-back-link";
        backLink.textContent = "← Quay lại danh sách tin";
        backLink.addEventListener("click", closeArticle);

        const category = document.createElement("p");
        category.className = "journal-category";
        category.textContent = `TIN THỊ TRƯỜNG XE · ${article.source}`;

        const heading = document.createElement("h1");
        heading.textContent = article.title;

        const articleDate = formatDate(article.pubDate);
        if (articleDate) {
            const time = document.createElement("time");
            time.className = "journal-published-date";
            time.dateTime = articleDate.dateTime;
            time.textContent = articleDate.label;
            articleDetail.append(backLink, category, heading, time);
        } else {
            articleDetail.append(backLink, category, heading);
        }

        if (article.thumbnail) {
            const imageUrl = safeHttpsUrl(article.thumbnail);
            if (imageUrl) {
                const image = document.createElement("img");
                image.className = "journal-detail-image";
                image.src = imageUrl;
                image.alt = `Ảnh minh họa: ${article.title}`;
                articleDetail.append(image);
            }
        }

        const summaryHeading = document.createElement("h2");
        summaryHeading.textContent = "Tóm tắt bài viết";
        articleDetail.append(summaryHeading);

        const summary = document.createElement("p");
        summary.textContent = article.summary
            || "Nguồn RSS không cung cấp đoạn tóm tắt cho bài viết này. Bạn có thể đọc nội dung đầy đủ tại trang báo gốc.";
        articleDetail.append(summary);

        const source = document.createElement("p");
        source.className = "journal-source-note";
        source.textContent = `Nguồn: ${article.source}. Nội dung đầy đủ được đăng tại trang báo gốc.`;
        articleDetail.append(source);

        const sourceLink = document.createElement("a");
        sourceLink.className = "btn btn-danger";
        sourceLink.href = article.link;
        sourceLink.target = "_blank";
        sourceLink.rel = "noopener noreferrer";
        sourceLink.textContent = "Đọc bài đầy đủ tại nguồn ";
        sourceLink.append(document.createTextNode("\u2197"));
        articleDetail.append(sourceLink);
    };

    // Đồng bộ giao diện chi tiết với tham số article khi tải trang/quay lại.
    const updateArticleFromUrl = () => {
        const requestedArticle = new URLSearchParams(window.location.search).get("article");
        if (!requestedArticle) {
            articleDetail.hidden = true;
            articleDetail.replaceChildren();
            journalGrid.hidden = false;
            return;
        }
        showArticle(articles.find((article) => article.link === requestedArticle));
    };

    // Thêm hiệu ứng xuất hiện khi cuộn, trừ khi người dùng giảm chuyển động.
    const observeCards = () => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion || !("IntersectionObserver" in window)) return;

        document.documentElement.classList.add("journal-motion-enabled");
        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    currentObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        journalGrid.querySelectorAll(".journal-card").forEach((card) => observer.observe(card));
    };

    // Mở bài ngay trong trang và cập nhật lịch sử trình duyệt không reload.
    journalGrid.addEventListener("click", (event) => {
        const link = event.target.closest("a[data-article-index]");
        if (!link) return;

        event.preventDefault();
        const article = articles[Number(link.dataset.articleIndex)];
        const url = new URL(window.location.href);
        url.searchParams.set("article", article.link);
        window.history.pushState(null, "", url);
        showArticle(article);
        articleDetail.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    window.addEventListener("popstate", updateArticleFromUrl);

    // Lấy feed, làm sạch dữ liệu, lọc tin xe và hiển thị tối đa 12 bài mới nhất.
    const loadLatestNews = async () => {
        try {
            const response = await fetch(feedApiUrl, { cache: "no-store" });
            if (!response.ok) {
                throw new Error(`Nguồn tin trả về lỗi HTTP ${response.status}.`);
            }

            const feed = await response.json();
            if (feed.status !== "ok" || !Array.isArray(feed.items)) {
                throw new Error("Nguồn tin không trả về danh sách bài viết hợp lệ.");
            }

            articles = feed.items
                .map((item) => {
                    const link = safeHttpsUrl(item.link);
                    if (!link) return null;

                    let source = "VnExpress";
                    try {
                        source = new URL(link).hostname.replace(/^www\./, "");
                    } catch {
                        // Keep the readable default source name.
                    }

                    return {
                        link,
                        title: parseDescription(item.title) || "Tin tức thị trường xe",
                        summary: parseDescription(item.description),
                        pubDate: item.pubDate,
                        thumbnail: item.thumbnail,
                        source
                    };
                })
                .filter((article) => {
                    if (!article) return false;
                    const searchableText = `${article.title} ${article.summary}`;
                    return marketKeywords.test(searchableText) && !trafficIncidentKeywords.test(searchableText);
                })
                .sort((first, second) => new Date(second.pubDate) - new Date(first.pubDate))
                .slice(0, 12);

            if (articles.length === 0) {
                journalStatus.textContent = "Hiện chưa có tin thị trường xe phù hợp từ nguồn RSS.";
                return;
            }

            journalGrid.replaceChildren(...articles.map(createCard));
            journalStatus.hidden = true;
            observeCards();
            updateArticleFromUrl();
        } catch (error) {
            console.error("Không thể tải tin tức thị trường xe:", error);
            journalStatus.setAttribute("role", "alert");
            journalStatus.textContent = `Không thể tải tin mới. Hãy thử tải lại trang sau: ${error.message}`;
        }
    };

    loadLatestNews();
})();
