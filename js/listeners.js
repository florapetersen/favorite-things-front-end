document.addEventListener('click', function(e) {
    console.dir(e.target)
})

/* we're relying on all events propagating to the document.
We will capture the target of the event and use that to determine
how we should respond when that particular thing gets clicked on.
Rather than having separate click event listeners, you have a single one
and check what the target of the event (CSS selector was that matched it)
and then call the right method. */

document.addEventListener('DOMContentLoaded', function(e) {
    Product.all();
})

document.addEventListener('submit', function(e) {
    let target = e.target; /* the target of a submit event is always the form that you submitted */
    if (target.matches('#newFavoriteThing')) { /* how do you know this is CSS, not HTML? */
        e.preventDefault();
        let formData = {}
        target.querySelectorAll('input').forEach(function(input) {
            formData[input.name] = input.value;
        })
        Product.create(formData);
    }
})

