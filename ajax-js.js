document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.jotform-form');

    if (forms.length > 0) {
        forms.forEach(handleFormSubmit);
    }

    function handleFormSubmit(form) {
        form.addEventListener('submit', handleSubmit.bind(null, form)); // Pass the form element to handleSubmit
    }

    async function handleSubmit(form, event) { // Adjusted parameters to include form and event
        event.preventDefault();
        const formData = new FormData(form); // Use the form parameter instead of event.target
        const submissionUrl = form.action; // Use the form parameter instead of event.target

        try {
            const response = await fetch(submissionUrl, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const html = await response.text();
            const doc = parseHtmlAndReplaceForm(html, form); // Pass the form parameter instead of event.target
        } catch (error) {
            handleError(form, error.message); // Pass the form and error message to handleError
        }
    }

    function handleError(form, message) { // Adjusted parameters to include form
        console.error(message);
        form.innerHTML = `<p>${message}</p>`; // Use the form parameter instead of event.target
    }

    function parseHtmlAndReplaceForm(html, form) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const divElement = document.createElement('div');
        Array.from(doc.body.attributes).forEach(attr => {
            divElement.setAttribute(attr.name, attr.value);
        });
        divElement.innerHTML = doc.body.innerHTML;

        // Extract and apply CSS directly to the divElement
        const styleElements = doc.head.getElementsByTagName('style');
        Array.from(styleElements).forEach(style => {
            const css = style.textContent;
            if (css) {
                const styleSheet = document.createElement('style');
                styleSheet.type = 'text/css';
                styleSheet.appendChild(document.createTextNode(css));
                divElement.appendChild(styleSheet);
            }
        });

        form.parentNode.replaceChild(divElement, form);
    }

    // Function to dynamically add CSS from a string or inline CSS
    function addCssFromInlineString(css) {
        var head = document.getElementsByTagName('head')[0];
        var s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        if (s.styleSheet) {   // IE
            s.styleSheet.cssText = css;
        } else {                // the world
            s.appendChild(document.createTextNode(css));
        }
        head.appendChild(s);
    }
});
