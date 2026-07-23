document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("updates-container");
    const filter = document.getElementById("update-filter");

    if (!container || !filter) return;

    fetch("updates.json")
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load updates.json");
            }

            return response.json();

        })
        .then(updates => {

            // Sort newest updates first
            updates.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });

            // Get every unique update type
            const types = [...new Set(updates.map(update => update.type))].sort();

            // Populate dropdown
            types.forEach(type => {

                const option = document.createElement("option");

                option.value = type;
                option.textContent = type;

                filter.appendChild(option);

            });

            function render(selectedType = "all") {

                container.innerHTML = "";

                const filteredUpdates =
                    selectedType === "all"
                        ? updates
                        : updates.filter(update => update.type === selectedType);

                if (filteredUpdates.length === 0) {

                    container.innerHTML = `
                        <div class="variable-card update-card">

                            <h3>No updates found</h3>

                            <p>
                                There are currently no updates in this category.
                            </p>

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

            // Re-render when filter changes
            filter.addEventListener("change", () => {

                render(filter.value);

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
