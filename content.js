if (location.hostname.includes("printables.com")) {
        const STORAGE_KEY = "hiddenCards";

        function initializeCard(card, hiddenCards, id) {
            if (card.dataset.initialized) return;
            card.dataset.initialized = "true";

            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Add Comment";
            input.value = hiddenCards[id]?.comment || "";

            input.style.cssText = `
                width: 100%;
                padding: 8px;
                text-align: center;
                box-sizing: border-box;
                margin-bottom: 8px;
            `;

            const wrapper = document.createElement("div");
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
            const cards = document.querySelectorAll('article.card[data-testid="model"]');

            cards.forEach((card) => {
                const link = card.querySelector('a.card-image');
                if (!link || !link.href) return;

                const id = link.href;
                initializeCard(card, hiddenCards, id);
            });
        };

        processCards();

        const observer = new MutationObserver(processCards);
        observer.observe(document.body, { childList: true, subtree: true });
    });
}
