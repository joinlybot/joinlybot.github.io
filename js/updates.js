document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("updates-container");

    const dropdown = document.getElementById("update-filter");
    const button = document.getElementById("update-filter-btn");
    const menu = document.getElementById("update-filter-menu");

    if (!container || !dropdown || !button || !menu) return;

    fetch("updates.json")
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load updates.json");
            }

            return response.json();

        })
        .then(updates => {

            // Sort newest first
            updates.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Get unique types
            const types = [...new Set(updates.map(update => update.type))].sort();

            // Build dropdown
            types.forEach(type => {

                const link = document.createElement("a");

                link.href = "#";
                link.dataset.filter = type;

                link.innerHTML = `

                    <div>

                        <h4>${type}</h4>

                        <p>Show only ${type} updates.</p>

                    </div>

                `;

                menu.appendChild(link);

            });

            function render(filter = "all") {

                container.innerHTML = "";

                const filteredUpdates = filter === "all"
                    ? updates
                    : updates.filter(update => update.type === filter);

                if (filteredUpdates.length === 0) {

                    container.innerHTML = `

                        <div class="variable-card update-card">

                            <h3>No updates found</h3>

                            <p>There are currently no updates in this category.</p>

                        </div>

                    `;

                    return;

                }

                filteredUpdates.forEach(update => {

                    const card = document.createElement("div");

                    card.className = "variable-card update-card";

                    card.innerHTML = `

                        <div class="update-header">

                            <div>

                                <h3>${update.title}</h3>

                                <span>${update.date}</span>

                            </div>

                            <span class="badge">

                                ${update.type}

                            </span>

                        </div>

                        ${Array.isArray(update.content)
                            ? update.content.join("<br>")
                            : update.content}

                    `;

                    container.appendChild(card);

                });

            }

            // Initial render
            render();

            // Toggle dropdown
            button.addEventListener("click", e => {

                e.stopPropagation();

                dropdown.classList.toggle("active");

            });

            // Handle dropdown clicks (works for dynamically-added items)
            menu.addEventListener("click", e => {

                const link = e.target.closest("a");

                if (!link) return;

                e.preventDefault();

                const filter = link.dataset.filter;

                // Update button text
                button.childNodes[0].textContent =
                    filter === "all" ? "All Updates\n\n" : `${filter}\n\n`;

                render(filter);

                dropdown.classList.remove("active");

            });

            // Close when clicking elsewhere
            document.addEventListener("click", e => {

                if (!dropdown.contains(e.target)) {

                    dropdown.classList.remove("active");

                }

            });

        })
        .catch(error => {

            console.error("Failed to load updates:", error);

            container.innerHTML = `

                <div class="variable-card update-card">

                    <h3>Unable to load updates</h3>

                    <p>
                        There was an error loading the Joinly development log.
                    </p>

                </div>

            `;

        });

});
