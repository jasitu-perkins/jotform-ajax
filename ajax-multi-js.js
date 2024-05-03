document.addEventListener('DOMContentLoaded', function() {
    var forms = document.querySelectorAll('.jotform-form');
    forms.forEach(function(form) {
        handleFormSubmission(form);
    });
});

var originalButtonContent = {};

function handleFormSubmission(form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Save original content of submit buttons and disable all submit buttons in other forms
        document.querySelectorAll('.jotform-form').forEach(function(otherForm) {
            otherForm.querySelectorAll('button[type="submit"]').forEach(function(button) {
                if (!originalButtonContent[otherForm.id]) {
                    originalButtonContent[otherForm.id] = button.innerHTML;
                }
                if (otherForm.id!== form.id) {
                    button.disabled = true;
                }
            });
        });

        var formData = new FormData(form);
        var submissionUrl = form.action;

        fetch(submissionUrl, {
            method: 'POST',
            body: formData
        })
       .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
       .then(html => {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, "text/html");

            // Create a new div, set its ID and class, and insert the parsed HTML
            var newDiv = document.createElement('div');
            newDiv.setAttribute('id', 'stage');
            newDiv.setAttribute('class', 'thankyou');
            newDiv.innerHTML = doc.body.innerHTML;

            // Replace the form's content with the new div
            form.parentNode.replaceChild(newDiv, form);

            // Restore original content and remove disabled attribute of submit buttons in all forms
            document.querySelectorAll('.jotform-form').forEach(function(form) {
                form.querySelectorAll('button[type="submit"]').forEach(function(button) {
                    button.removeAttribute('disabled');
                    button.innerHTML = originalButtonContent[form.id] || '';
                });
            });
        })
       .catch(error => {
            var errorMessage = document.createElement('p');
            errorMessage.textContent = 'An error occurred. Please try again.';
            form.parentNode.replaceChild(errorMessage, form);
        });
    });
}
