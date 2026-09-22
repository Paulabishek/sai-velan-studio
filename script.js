// Mobile menu

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});


// Close mobile menu after clicking a link

document.querySelectorAll("#navMenu a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
    });
});


// Contact form

const enquiryForm = document.getElementById("enquiryForm");
const formMessage = document.getElementById("formMessage");

enquiryForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const submitButton =
        enquiryForm.querySelector(".submit-btn");

    submitButton.disabled = true;
    submitButton.innerHTML = "SENDING...";

    const formData = new FormData(enquiryForm);

    const data = Object.fromEntries(formData.entries());

    try {

        const response = await fetch("/api/enquiry", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {

            formMessage.textContent = result.message;
            formMessage.style.color = "#c9a86a";

            enquiryForm.reset();

        } else {

            formMessage.textContent =
                result.message || "Please try again.";

            formMessage.style.color = "#ff7b7b";
        }

    } catch (error) {

        console.error(error);

        formMessage.textContent =
            "Unable to send enquiry. Please call us directly.";

        formMessage.style.color = "#ff7b7b";

    }

    submitButton.disabled = false;

    submitButton.innerHTML =
        'SEND ENQUIRY <span>→</span>';
});


// Simple reveal animation

const revealElements =
    document.querySelectorAll(
        ".service-card, .portfolio-item, .trend-content, .contact-info"
    );

const observer = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform =
                    "translateY(0)";

                observer.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.1
    }
);


revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform =
        "translateY(30px)";

    element.style.transition =
        "opacity .8s ease, transform .8s ease";

    observer.observe(element);

});
