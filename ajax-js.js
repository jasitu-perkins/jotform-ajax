document.addEventListener('DOMContentLoaded', function() {
    var forms = document.querySelector('.jotform-form'); // Use querySelector for efficiency
    if (forms) {
        forms.addEventListener('submit', function(event) {
            event.preventDefault();

            var formData = new FormData(this);
            var submissionUrl = this.action;

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
                this.parentNode.replaceChild(doc.body, this);
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('responseContainer').innerHTML = '<p>An error occurred. Please try again.</p>';
            });
        });
    }
});
