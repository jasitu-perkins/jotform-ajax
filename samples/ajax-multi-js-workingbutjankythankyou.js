document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event triggered"); // Debugging
    var forms = document.querySelectorAll('.jotform-form'); // Use querySelectorAll to handle multiple forms
    console.log("Found", forms.length, "forms to handle"); // Debugging
    forms.forEach(function(form) {
        console.log("Handling form:", form.id); // Debugging
        handleFormSubmission(form);
    });
});

var currentSubmittingFormId = null; // Global variable to track the currently submitting form
var originalButtonContent = {}; // Object to store original button content

function handleFormSubmission(form) {
    console.log("Adding event listener to form:", form.id); // Debugging
    form.addEventListener('submit', function(event) {
        console.log("Form submit event triggered for form:", form.id); // Debugging
        event.preventDefault(); // Prevent the default form submission

        // Save original content of submit buttons
        var allForms = document.querySelectorAll('.jotform-form');
        allForms.forEach(function(otherForm) {
            var submitButtons = otherForm.querySelectorAll('button[type="submit"]');
            submitButtons.forEach(function(button) {
                originalButtonContent[otherForm.id] = button.innerHTML; // Save original content
                console.log(`Saving original content for form ${otherForm.id}:`, originalButtonContent[otherForm.id]); // Debugging
            });
        });

        // Disable all submit buttons in other forms
        var otherForms = document.querySelectorAll('.jotform-form');
        otherForms.forEach(function(otherForm) {
            if (otherForm.id!== form.id) {
                var submitButtons = otherForm.querySelectorAll('button[type="submit"]');
                submitButtons.forEach(function(button) {
                    console.log(`Disabling submit button for form ${otherForm.id}:`, button.id); // Debugging
                    button.disabled = true;
                });
            }
        });

        currentSubmittingFormId = form.id; // Update the global variable

        var formData = new FormData(form);
        console.log("Form data for form", form.id, ":", formData); // Debugging
        var submissionUrl = form.action;
        console.log("Submission URL for form", form.id, ":", submissionUrl); // Debugging

        fetch(submissionUrl, {
            method: 'POST',
            body: formData
        })
   .then(response => {
            console.log("Fetch response received for form", form.id); // Debugging
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
   .then(html => {
            console.log("HTML response for form", form.id, ":", html); // Debugging
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, "text/html");

            // Replace the form's parent node with the response content
            console.log("Replacing form content for form", form.id); // Debugging
            form.parentNode.replaceChild(doc.body, form);

            // Remove disabled attribute and restore original content of submit buttons in all forms
            var allForms = document.querySelectorAll('.jotform-form');
            allForms.forEach(function(form) {
                var submitButtons = form.querySelectorAll('button[type="submit"]');
                submitButtons.forEach(function(button) {
                    console.log(`Removing disabled attribute for form ${form.id}:`, button.id); // Debugging
                    button.removeAttribute('disabled'); // Remove disabled attribute
                    console.log(`Restoring original content for form ${form.id}:`, originalButtonContent[form.id]); // Debugging
                    button.innerHTML = originalButtonContent[form.id]; // Restore original content
                });
            });
        })
   .catch(error => {
            console.error('Error for form', form.id, ':', error); // Debugging
            // Optionally, handle the error by replacing the form's parent node with an error message
            var errorMessage = document.createElement('p');
            errorMessage.textContent = 'An error occurred. Please try again.';
            form.parentNode.replaceChild(errorMessage, form);
        });
    });
}
