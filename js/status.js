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



            const overallStatus = calculateOverall(status.services);



            title.textContent = overallStatus.title;



            if (overall) {


                overall.innerHTML = `

                    <div class="status-dot ${overallStatus.state}"></div>

                    <h2>${overallStatus.title}</h2>

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





function calculateOverall(services) {


    const states = services.map(service => service.state);



    if (states.includes("offline")) {


        return {

            title: "Some Systems Offline",

            state: "offline"

        };


    }



    if (states.includes("degraded")) {


        return {

            title: "Some Systems Degraded",

            state: "degraded"

        };


    }



    if (states.includes("maintenance")) {


        return {

            title: "Maintenance In Progress",

            state: "maintenance"

        };


    }



    return {

        title: "All Systems Operational",

        state: "operational"

    };


}





function formatStatus(status) {


    return status

        .toLowerCase()

        .replace(/^\w/, c => c.toUpperCase());


}
