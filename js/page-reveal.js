(() => {
    const revealTargets = document.querySelectorAll([
        "main > section:not(#home):not(.brand-hero)",
        "main .brand-hero-inner",
        "main .knowledge-card",
        "main .brand-card",
        "main .discovery-card",
        "main .feature-card",
        "main .editorial-card",
        "main .marque-image-wrap",
        "main [data-car-item]",
        "main [data-detail-section]",
        "main #login .card",
        "main #dangky .card"
    ].join(", "));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window) || revealTargets.length === 0) {
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

    revealTargets.forEach((target, index) => {
        target.classList.add("page-reveal");
        target.style.setProperty("--page-reveal-delay", `${(index % 5) * 70}ms`);
        revealObserver.observe(target);
    });
})();
