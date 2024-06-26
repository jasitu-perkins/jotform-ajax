document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");
    var forms = document.querySelectorAll('.jotform-form');
    forms.forEach(function(form) {
        console.log(`Handling form submission for form id: ${form.id}`);
        handleFormSubmission(form);
    });
});

var originalButtonContent = {};

function handleFormSubmission(form) {
    console.log(`Adding submit event listener to form id: ${form.id}`);
    form.addEventListener('submit', function(event) {
        console.log("Form submitted");
        event.preventDefault();

        // Save original content of submit buttons and disable all submit buttons in other forms
        console.log("Saving original button content and disabling others");
        document.querySelectorAll('.jotform-form').forEach(function(otherForm) {
            otherForm.querySelectorAll('button[type="submit"]').forEach(function(button) {
                if (!originalButtonContent[otherForm.id]) {
                    originalButtonContent[otherForm.id] = button.innerHTML;
                    console.log(`Saved original content for form id: ${otherForm.id} - Content: ${originalButtonContent[otherForm.id]}`);
                }
                if (otherForm.id!== form.id) {
                    button.disabled = true;
                    console.log(`Disabled submit button for form id: ${otherForm.id}`);
                }
            });
        });

        var formData = new FormData(form);
        var submissionUrl = form.action;

        console.log(`Submitting form data to URL: ${submissionUrl} using POST method`);
        fetch(submissionUrl, {
            method: 'POST',
            body: formData
        })
     .then(response => {
            console.log(`Response status: ${response.status}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                console.log("Response OK, reading response body...");
                return response.text();
            }
        })
     .then(html => {
            console.log("Received HTML response", html); // Log the entire HTML response here
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, "text/html");

            // Create a new div, set its ID and class, and insert the parsed HTML
            var newDiv = document.createElement('div');
            newDiv.setAttribute('id', 'stage');
            newDiv.setAttribute('class', 'thankyou');
            newDiv.innerHTML = doc.body.innerHTML;

            // Replace the form's content with the new div
            form.parentNode.replaceChild(newDiv, form);
            console.log("Replaced form with thank you page");
        })
     .catch(error => {
            console.error("Error during form submission:", error);
            var errorMessage = document.createElement('p');
            errorMessage.textContent = 'An error occurred. Please try again.';
            form.parentNode.replaceChild(errorMessage, form);
        });
    });
}
