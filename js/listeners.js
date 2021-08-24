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
    } else if(target.matches(".deleteProduct")) {
        let product = Product.findById(target.dataset.productId);
        product.delete();
        document.location.reload();
    } else if(target.matches(".modal-close") || target.matches(".modal-overlay")) {
        e.preventDefault();
        Modal.toggle();
    } else if(target.matches(".filterCategory")) {
        e.preventDefault();
        let selected_category = Category.findById(target.dataset.categoryId);
        Product.categoryProducts(selected_category);
    } else if(target.matches(".allCategories")) {
        e.preventDefault();
        Product.all();
    }
})

document.addEventListener('submit', function(e) {
    let target = e.target; 
    if (target.matches('#newFavoriteThing')) { 
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

