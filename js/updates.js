document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("updates-container");

    if (!container) return;


    fetch("updates.json")
        .then(response => response.json())
        .then(updates => {


            // Newest updates first
            updates.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });


            updates.forEach(update => {


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
