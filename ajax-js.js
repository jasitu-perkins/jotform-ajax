document.addEventListener('DOMContentLoaded', function() {
    var forms = document.getElementsByClassName('jotform-form');
    if (forms.length > 0) {
        var form = forms[0]; // Target the first form with the class 'jotform-form'
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            var formData = new FormData(this); // Collect form data
            var submissionUrl = this.action; // Get the submission URL from the form's action attribute

            // Use the Fetch API to send the form data to JotForm
            fetch(submissionUrl, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Assuming a successful submission, fetch the Thank You page HTML
                return fetch(submissionUrl).then(response => response.text());
            })
            .then(html => {
                // Parse the HTML string into a document object
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');

                // Extract the desired content from the Thank You page
                // For example, if you want to display the entire body content:
                var content = doc.body.innerHTML;

                // Insert the content into your page
                document.getElementById('responseContainer').innerHTML = content;
            })
            .catch(error => {
                // Handle any errors
                console.error('Error:', error);
                document.getElementById('responseContainer').innerHTML = '<p>An error occurred. Please try again.</p>';
            });
        });
    } else {
        console.error('Form element not found');
    }
});