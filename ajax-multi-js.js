function handleFormSubmission(form) {
    console.log("Adding event listener to form:", form.id); // Debugging
    form.addEventListener('submit', function(event) {
        console.log("Form submit event triggered for form:", form.id); // Debugging
        event.preventDefault();

        var formData = new FormData(this);
        console.log("Form data for form", form.id, ":", formData); // Debugging
        var submissionUrl = this.action;
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
            this.parentNode.replaceChild(doc.body, this);
        })
        .catch(error => {
            console.error('Error for form', form.id, ':', error); // Debugging
            // Optionally, handle the error by replacing the form's parent node with an error message
            var errorMessage = document.createElement('p');
            errorMessage.textContent = 'An error occurred. Please try again.';
            this.parentNode.replaceChild(errorMessage, this);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event triggered"); // Debugging
    var forms = document.querySelectorAll('.jotform-form'); // Use querySelectorAll to handle multiple forms
    console.log("Found", forms.length, "forms to handle"); // Debugging
    forms.forEach(function(form) {
        console.log("Handling form:", form.id); // Debugging
        handleFormSubmission(form);
    });
});
