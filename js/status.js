document.addEventListener("DOMContentLoaded", () => {


    const container = document.getElementById("status-grid");

    const overall = document.getElementById("overall-status");


    if (!container) return;



    fetch("status.json")


        .then(response => {


            if (!response.ok) {

                throw new Error("Failed loading status.json");

            }


            return response.json();


        })


        .then(status => {



            const overallStatus =
            calculateOverall(status.services);



            overall.innerHTML = `


            <div class="overall-status">


                <div class="status-dot ${overallStatus.state}"></div>


                <div>


                    <h2>${overallStatus.title}</h2>


                    <p>${overallStatus.affected}</p>


                </div>


            </div>


            `;



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



            overall.innerHTML = `


            <div class="overall-status">


                <div class="status-dot offline"></div>


                <div>


                    <h2>Status Unavailable</h2>


                    <p>

                    There was an error loading the Joinly system status.

                    </p>


                </div>


            </div>


            `;


        });



});





function calculateOverall(services) {


    const offline =
    services
        .filter(service => service.state === "offline")
        .map(service => service.name);



    const degraded =
    services
        .filter(service => service.state === "degraded")
        .map(service => service.name);



    const maintenance =
    services
        .filter(service => service.state === "maintenance")
        .map(service => service.name);





    if (offline.length > 0) {

        return {

            title: "Some Systems Offline",

            state: "offline",

            affected:
            `Affected systems: ${offline.join(", ")}`

        };

    }



    if (degraded.length > 0) {

        return {

            title: "Some Systems Degraded",

            state: "degraded",

            affected:
            `Affected systems: ${degraded.join(", ")}`

        };

    }



    if (maintenance.length > 0) {

        return {

            title: "Maintenance In Progress",

            state: "maintenance",

            affected:
            `Affected systems: ${maintenance.join(", ")}`

        };

    }



    return {

        title: "All Systems Operational",

        state: "operational",

        affected:
        "Everything is running normally."

    };


}





function formatStatus(status) {


    return status

        .toLowerCase()

        .replace(/^\w/, c => c.toUpperCase());


}
