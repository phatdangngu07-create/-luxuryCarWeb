(() => {
    const revealSelector = [
        "main > section:not(#home):not(.brand-hero)",
        "main .brand-hero-inner",
        "main .knowledge-card",
        "main .brand-card",
        "main .discovery-card",
        "main .feature-card",
        "main .editorial-card",
        "main .marque-image-wrap",
        "main [data-car-item] .card",
        "main [data-detail-section]",
        "main #login .card",
        "main #dangky .card"
    ].join(", ");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window) || !document.querySelector(revealSelector)) {
        return;
    }

    document.documentElement.classList.add("page-reveal-enabled");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    const observedTargets = new WeakSet();
    const observeRevealTargets = () => {
        document.querySelectorAll(revealSelector).forEach((target, index) => {
            if (observedTargets.has(target)) {
                return;
            }

            observedTargets.add(target);
            target.classList.add("page-reveal");
            target.style.setProperty("--page-reveal-delay", `${(index % 5) * 70}ms`);
            revealObserver.observe(target);
        });
    };

    observeRevealTargets();
    document.addEventListener("luxurycars:products-loaded", observeRevealTargets);
})();
