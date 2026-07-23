document.addEventListener("DOMContentLoaded", () => {


    const container = document.getElementById("status-grid");

    const overall = document.querySelector(".overall-status");

    const title = document.getElementById("status-title");


    if (!container) return;



    fetch("status.json")


        .then(response => {


            if (!response.ok) {

                throw new Error("Failed loading status.json");

            }


            return response.json();


        })


        .then(status => {



            title.textContent = status.overall.title;



            if (overall) {


                overall.innerHTML = `

                    <div class="status-dot ${status.overall.state}"></div>

                    <h2>${status.overall.title}</h2>

                `;


            }



            status.services.forEach(service => {



                const card = document.createElement("div");


                card.className = "status-card";



                card.innerHTML = `


                <div class="status-title">


                    <span>${service.name}</span>


                    <div class="${service.state}"></div>


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
