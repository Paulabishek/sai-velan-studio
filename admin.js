let allEnquiries = [];


// LOAD ENQUIRIES

async function loadEnquiries() {

    const table =
        document.getElementById("enquiryTable");

    table.innerHTML = `
        <tr>
            <td colspan="6">
                Loading enquiries...
            </td>
        </tr>
    `;

    try {

        const response =
            await fetch("/api/enquiries");

        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                "Unable to load enquiries"
            );

        }


        allEnquiries =
            result.enquiries || [];


        updateStatistics();

        displayEnquiries(allEnquiries);


    } catch (error) {

        console.error(error);

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load enquiries.
                </td>
            </tr>
        `;

    }

}


// STATISTICS

function updateStatistics() {

    const total =
        allEnquiries.length;


    const weddings =
        allEnquiries.filter(
            enquiry =>
                enquiry.service ===
                "Wedding Photography" ||
                enquiry.service ===
                "Wedding Cinematography"
        ).length;


    const portraits =
        allEnquiries.filter(
            enquiry =>
                enquiry.service ===
                "Portrait"
        ).length;


    const other =
        total -
        weddings -
        portraits;


    document.getElementById(
        "totalEnquiries"
    ).textContent = total;


    document.getElementById(
        "weddingEnquiries"
    ).textContent = weddings;


    document.getElementById(
        "portraitEnquiries"
    ).textContent = portraits;


    document.getElementById(
        "otherEnquiries"
    ).textContent = other;

}


// DISPLAY ENQUIRIES

function displayEnquiries(enquiries) {

    const table =
        document.getElementById(
            "enquiryTable"
        );


    if (enquiries.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    No enquiries found.
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML = "";


    enquiries
        .slice()
        .reverse()
        .forEach(enquiry => {

            const row =
                document.createElement("tr");


            const phone =
                String(
                    enquiry.phone || ""
                );


            const whatsappNumber =
                phone.replace(/\D/g, "");


            const received =
                enquiry.createdAt
                    ? new Date(
                        enquiry.createdAt
                    ).toLocaleString()
                    : "-";


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHtml(
                            enquiry.name || "-"
                        )}
                    </strong>
                </td>


                <td>
                    ${escapeHtml(phone)}
                </td>


                <td>
                    ${escapeHtml(
                        enquiry.service || "-"
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        enquiry.date || "-"
                    )}
                </td>


                <td>
                    ${received}
                </td>


                <td>

                    <a
                        class="action-btn call-btn"
                        href="tel:${phone}"
                    >
                        Call
                    </a>


                    <a
                        class="action-btn whatsapp-btn"
                        href="https://wa.me/${whatsappNumber}"
                        target="_blank"
                    >
                        WhatsApp
                    </a>

                </td>

            `;


            table.appendChild(row);

        });

}


// SEARCH

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        function () {

            const search =
                this.value
                    .toLowerCase()
                    .trim();


            const filtered =
                allEnquiries.filter(
                    enquiry => {

                        return (

                            String(
                                enquiry.name || ""
                            )
                                .toLowerCase()
                                .includes(search)

                            ||

                            String(
                                enquiry.phone || ""
                            )
                                .toLowerCase()
                                .includes(search)

                            ||

                            String(
                                enquiry.service || ""
                            )
                                .toLowerCase()
                                .includes(search)

                        );

                    }
                );


            displayEnquiries(filtered);

        }
    );


// REFRESH

document
    .getElementById("refreshBtn")
    .addEventListener(
        "click",
        loadEnquiries
    );


// LOGOUT PLACEHOLDER

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        () => {

            window.location.href =
                "/";

        }
    );


// BASIC HTML ESCAPING

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// START

loadEnquiries();