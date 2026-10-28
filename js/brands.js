const brandFilters = document.querySelectorAll(".brand-filter-button");
const brandCards = [...document.querySelectorAll(".brand-card[data-country]")];
const brandResultCount = document.querySelector("#brandResultCount");
const brandEmpty = document.querySelector("#brandEmpty");

document.querySelectorAll(".brand-logo img").forEach((image) => {
    const logoBadge = image.closest(".brand-logo");
    const updateLogo = () => {
        const hasLogo = image.naturalWidth > 0;
        logoBadge.classList.toggle("has-logo", hasLogo);
        image.hidden = !hasLogo;
    };

    image.addEventListener("load", updateLogo);
    image.addEventListener("error", updateLogo);
    if (image.complete) {
        updateLogo();
    }
});

document.querySelectorAll(".brand-car-image img[data-fallback]").forEach((image) => {
    image.addEventListener("error", () => {
        if (image.dataset.fallbackAttempted) {
            return;
        }

        image.dataset.fallbackAttempted = "true";
        image.src = image.dataset.fallback;
    });
});

brandFilters.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedCountry = button.dataset.filter;
        let visibleCount = 0;

        brandFilters.forEach((filterButton) => {
            const isSelected = filterButton === button;
            filterButton.classList.toggle("active", isSelected);
            filterButton.setAttribute("aria-pressed", String(isSelected));
        });

        brandCards.forEach((card) => {
            const isVisible = selectedCountry === "all" || card.dataset.country === selectedCountry;
            card.hidden = !isVisible;
            visibleCount += Number(isVisible);
        });

        brandResultCount.textContent = `${String(visibleCount).padStart(2, "0")} thương hiệu`;
        brandEmpty.hidden = visibleCount > 0;
    });
});
