if (location.hostname.includes("printables.com")) {
    const STORAGE_KEY = "hiddenCards";

    function initializeCard(card, hiddenCards, id) {
        if (card.dataset.initialized) return;
        card.dataset.initialized = "true";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Add Comment";
        input.value = hiddenCards[id]?.comment || "";

        input.style.width = "100%";
        input.style.padding = "8px";
        input.style.textAlign = "center";
        input.style.boxSizing = "border-box";

        const wrapper = document.createElement("div");
        wrapper.style.marginBottom = "8px";
        wrapper.appendChild(input);
        card.prepend(wrapper);

        input.addEventListener("input", () => {
            hiddenCards[id] = { comment: input.value };
            chrome.storage.local.set({ [STORAGE_KEY]: hiddenCards });
        });
    }

    chrome.storage.local.get(STORAGE_KEY, (data) => {
        const hiddenCards = data[STORAGE_KEY] || {};

        const processCards = () => {
            const cards = document.querySelectorAll('.card.svelte-j1lj8e');

            cards.forEach((card) => {
                const link = card.querySelector("a.card-image.svelte-197pvmn");

                if (link && link.href) {
                    const id = link.href;
                    initializeCard(card, hiddenCards, id);
                }
            });
        };

        processCards();
        const observer = new MutationObserver(() => {
            processCards();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
}
