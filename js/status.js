document.addEventListener("DOMContentLoaded", () => {


    const container = document.getElementById("status-grid");

    const overall = document.getElementById("overall-status");


    if (!container || !overall) return;



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


                <div class="overall-content">


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


                    <div class="status-dot ${service.state}"></div>


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


                <div class="overall-content">


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





    let affected = [];



    if (offline.length > 0) {

        affected.push(
            `<strong>Offline:</strong> ${offline.join(", ")}`
        );

    }



    if (degraded.length > 0) {

        affected.push(
            `<strong>Degraded:</strong> ${degraded.join(", ")}`
        );

    }



    if (maintenance.length > 0) {

        affected.push(
            `<strong>Maintenance:</strong> ${maintenance.join(", ")}`
        );

    }





    const issueTypes =
    [
        offline.length > 0,
        degraded.length > 0,
        maintenance.length > 0
    ]
    .filter(Boolean)
    .length;





    if (issueTypes > 1) {

        return {

            title: "🚨 Multiple Incidents",

            state: "offline",

            affected: affected.join(" • ")

        };

    }





    if (offline.length > 0) {

        return {

            title: "🔥 Service Outage",

            state: "offline",

            affected: affected.join(" • ")

        };

    }





    if (degraded.length > 0) {

        return {

            title: "⚠️ Performance Degradation",

            state: "degraded",

            affected: affected.join(" • ")

        };

    }





    if (maintenance.length > 0) {

        return {

            title: "🔧 Maintenance In Progress",

            state: "maintenance",

            affected: affected.join(" • ")

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
