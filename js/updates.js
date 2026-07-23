document.addEventListener("DOMContentLoaded", () => {


    const container = document.getElementById("updates-container");

    const dropdown = document.querySelector(".updates-filter-dropdown");

    const button = document.querySelector(".updates-filter-btn");

    const menu = document.querySelector(".updates-filter-menu");


    let updates = [];

    let currentFilter = "all";



    if (!container || !dropdown || !button || !menu) return;



    /*
        Open / close dropdown
    */

    button.addEventListener("click", (event) => {

        event.stopPropagation();

        dropdown.classList.toggle("active");

    });



    document.addEventListener("click", () => {

        dropdown.classList.remove("active");

    });



    dropdown.addEventListener("click", (event) => {

        event.stopPropagation();

    });





    /*
        Load updates
    */

    fetch("updates.json")


    .then(response => {


        if (!response.ok){

            throw new Error("Failed to load updates.json");

        }


        return response.json();


    })


    .then(data => {


        updates = data;


        createFilterOptions();


        renderUpdates();



    })


    .catch(error => {


        console.error(error);


        container.innerHTML = `

        <div class="update-card">

        <p>Unable to load updates.</p>

        </div>

        `;


    });






    /*
        Create dropdown options dynamically
    */

    function createFilterOptions(){


        const types = [
            ...new Set(
                updates.map(update => update.type)
            )
        ];



        types.forEach(type => {


            const option = document.createElement("a");


            option.dataset.filter = type;


            option.innerHTML = `

            <div>

                <h4>${type}</h4>

                <p>Show only ${type} updates.</p>

            </div>

            `;



            option.addEventListener("click", () => {


                currentFilter = type;


                updateButton(type);


                dropdown.classList.remove("active");


                renderUpdates();



            });



            menu.appendChild(option);



        });




        const allOption = menu.querySelector(
            '[data-filter="all"]'
        );



        allOption.addEventListener("click", () => {


            currentFilter = "all";


            updateButton("All Updates");


            dropdown.classList.remove("active");


            renderUpdates();



        });



    }






    /*
        Change dropdown button text
    */

    function updateButton(text){


        button.innerHTML = `

        ${text}

        <svg width="14" height="14" viewBox="0 0 24 24">

        <path fill="currentColor" d="M7 10l5 5 5-5z"/>

        </svg>

        `;


    }






    /*
        Render updates
    */

    function renderUpdates(){


        container.innerHTML = "";



        let filteredUpdates = updates;



        if(currentFilter !== "all"){


            filteredUpdates = updates.filter(update =>

                update.type === currentFilter

            );


        }





        filteredUpdates.forEach(update => {



            const card = document.createElement("div");


            card.className = "update-card";



            card.innerHTML = `


            <div class="update-header">


                <div>


                    <h3>${update.title}</h3>


                    <span>

                    ${update.date} • ${update.type}

                    </span>


                </div>


            </div>



            ${update.content.map(line => `

                <p>${line}</p>

            `).join("")}



            `;



            container.appendChild(card);



        });




        if(filteredUpdates.length === 0){


            container.innerHTML = `

            <div class="update-card">

                <p>No updates found for this category.</p>

            </div>

            `;


        }



    }



});
