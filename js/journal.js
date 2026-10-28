const journalGrid = document.querySelector("#journalGrid");
const reduceJournalMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (journalGrid && !reduceJournalMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("journal-motion-enabled");

    const journalObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    journalGrid.querySelectorAll(".journal-card").forEach((card) => {
        journalObserver.observe(card);
    });
}
