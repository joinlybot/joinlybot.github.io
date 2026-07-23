document.addEventListener("DOMContentLoaded", () => {


    const container = document.getElementById("updates-container");

    const filterDropdown = document.getElementById("update-filter");

    const filterButton = document.getElementById("update-filter-btn");

    const filterMenu = document.getElementById("update-filter-menu");


    if (!container || !filterDropdown || !filterButton || !filterMenu) return;



    const buttonText = filterButton.querySelector(".filter-text");



    fetch("updates.json")


        .then(response => {


            if (!response.ok) {

                throw new Error("Failed to load updates.json");

            }


            return response.json();


        })


        .then(updates => {



            updates.sort((a, b) => {


                return new Date(b.date) - new Date(a.date);


            });





            const types = [

                ...new Set(updates.map(update => update.type))

            ].sort();





            types.forEach(type => {



                const option = document.createElement("a");


                option.href = "#";

                option.dataset.filter = type;



                option.innerHTML = `

                    <h4>${type}</h4>

                    <p>Show ${type.toLowerCase()} updates.</p>

                `;



                filterMenu.appendChild(option);



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



                        ${
                            Array.isArray(update.content)

                            ? update.content.join("<br>")

                            : update.content
                        }

                    `;



                    container.appendChild(card);



                });



            }







            filterMenu.addEventListener("click", event => {



                const item = event.target.closest("a");



                if (!item) return;



                event.preventDefault();



                const value = item.dataset.filter;



                buttonText.textContent = value;



                filterDropdown.classList.remove("active");



                render(value);



            });







            filterButton.addEventListener("click", event => {



                event.stopPropagation();



                filterDropdown.classList.toggle("active");



            });








            document.addEventListener("click", event => {



                if (!filterDropdown.contains(event.target)) {



                    filterDropdown.classList.remove("active");



                }



            });








            render();



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
