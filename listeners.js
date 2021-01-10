/* just for reference: */

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

