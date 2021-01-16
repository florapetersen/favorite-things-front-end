document.addEventListener('DOMContentLoaded', function(e) {
    Product.all();
    Category.all();
    Modal.init();
})

document.addEventListener('click', function(e) {
    let target = e.target;
    if(target.matches(".selectProduct")) {
        let product = Product.findById(target.dataset.productId);
        product.show()
    } else if(target.matches(".productModal")) {
        e.preventDefault();
        let product = Product.findById(target.dataset.productId);
        Modal.populate({title: `${product.name}`, content: product.modalContent()})
        Modal.toggle()
    } else if(target.matches(".modal-close") || target.matches(".modal-overlay")) {
        e.preventDefault();
        Modal.toggle();
    }
})

/* we're relying on all events propagating to the document.
We will capture the target of the event and use that to determine
how we should respond when that particular thing gets clicked on.
Rather than having separate click event listeners, you have a single one
and check what the target of the event (CSS selector was that matched it)
and then call the right method. */



document.addEventListener('submit', function(e) {
    let target = e.target; /* the target of a submit event is always the form that you submitted */
    if (target.matches('#newFavoriteThing')) { /* how do you know this is CSS, not HTML? */
        e.preventDefault();
        let formData = {}
        target.querySelectorAll('input').forEach(function(input) {
            formData[input.name] = input.value;
        })
        target.querySelectorAll('select').forEach(function(select) {
            formData[select.name] = select.value;
        })
        Product.create(formData);
    }
})

document.addEventListener('keydown', function(evt) {
    evt = evt || window.event
    var isEscape = false
    if ("key" in evt) {
      isEscape = (evt.key === "Escape" || evt.key === "Esc")
    } else {
      isEscape = (evt.keyCode === 27)
    }
    if (isEscape && document.body.classList.contains('modal-active')) {
      Modal.toggle()
    }
  });

