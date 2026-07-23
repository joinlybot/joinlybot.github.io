document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("status-grid");

    const overallContainer = document.getElementById("overall-status");

    const title = document.getElementById("status-title");


    if (!container) return;


    fetch("status.json")

        .then(response => response.json())

        .then(status => {



            title.textContent = status.overall.title;



            overallContainer.innerHTML = `

            <div class="overall-status">

               <div class="status-dot ${status.overall.status.toLowerCase()}"></div>

                <h2>${status.overall.title}</h2>

            </div>

            `;



            status.services.forEach(service => {


                const card = document.createElement("div");


                card.className = "status-card";


                card.innerHTML = `

                <div class="status-title">

                    <span>${service.name}</span>

                    <div class="${service.status.toLowerCase()}"></div>

                </div>


                <p>${formatStatus(service.status)}</p>


                `;


                container.appendChild(card);


            });



        })

        .catch(error => {


            console.error("Failed to load status:", error);



            title.textContent = "Status unavailable";



            container.innerHTML = `


            <div class="status-card">


                <h3>Unable to load status</h3>


                <p>

                There was an error loading the Joinly system status.

                </p>


            </div>


            `;


        });



});



function formatStatus(status) {

    return status
        .toLowerCase()
        .replace(/^\w/, c => c.toUpperCase());

}
