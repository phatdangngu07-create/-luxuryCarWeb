const hero = document.querySelector("#home");
const heroVideo = hero?.querySelector(".hero-media video");

if (hero && heroVideo && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.setTimeout(() => {
        heroVideo.play().then(() => {
            hero.classList.add("is-playing");
        }).catch((error) => {
            console.error("Không thể phát video siêu xe:", error);
        });
    }, 3000);

    heroVideo.addEventListener("ended", () => {
        hero.classList.remove("is-playing");
        heroVideo.currentTime = 0;
    });

    heroVideo.addEventListener("error", () => {
        console.error("Không thể tải video siêu xe:", heroVideo.error);
    });
}

const collectionSearch = new URLSearchParams(window.location.search).get("search");
const searchInput = document.querySelector(".navbar-search input[name='search']");

if (collectionSearch && searchInput) {
    searchInput.value = collectionSearch;
}

if (collectionSearch && document.querySelector("[data-car-card]")) {
    const query = collectionSearch.trim().toLocaleLowerCase("vi");
    const cards = [...document.querySelectorAll("[data-car-card]")];
    const visibleCards = cards.filter((card) =>
        card.textContent.toLocaleLowerCase("vi").includes(query)
    );
    const status = document.querySelector("#collectionSearchStatus");

    cards.forEach((card) => {
        card.closest(".col-sm-10").hidden = !visibleCards.includes(card);
    });

    if (status) {
        status.hidden = false;
        status.textContent = visibleCards.length
            ? `Tìm thấy ${visibleCards.length} mẫu xe cho "${collectionSearch}".`
            : `Chưa tìm thấy mẫu xe phù hợp với "${collectionSearch}".`;
    }
}