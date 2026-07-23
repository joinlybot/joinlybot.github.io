document.addEventListener("DOMContentLoaded", () => {

    const grid = document.getElementById("status-grid");

    const title = document.getElementById("status-title");

    const overallTitle = document.getElementById("overall-title");

    const overallDot = document.getElementById("overall-dot");


    if (!grid) return;


    fetch("status.json")

        .then(response => response.json())

        .then(status => {


            title.textContent = status.overall.title;

            overallTitle.textContent = status.overall.title;


            overallDot.className = "status-dot " + status.overall.status;



            status.services.forEach(service => {


                const card = document.createElement("div");


                card.className = "status-card";


                card.innerHTML = `

                <div class="status-title">

                    <span>${service.name}</span>

                    <div class="${service.status}"></div>

                </div>


                <p>${formatStatus(service.status)}</p>

                `;


                grid.appendChild(card);


            });


        })


        .catch(error => {


            console.error("Failed to load status:", error);


            title.textContent = "Status unavailable";

            overallTitle.textContent = "Unable to load status";


            grid.innerHTML = `

            <div class="status-card">

                <h3>Status Error</h3>

                <p>Unable to load system status.</p>

            </div>

            `;


        });



});



function formatStatus(status) {

    return status

        .replace("-", " ")

        .replace(/\b\w/g, char => char.toUpperCase());

}
