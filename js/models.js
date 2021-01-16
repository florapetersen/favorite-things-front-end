class Product {
    constructor(attributes) {
        let whitelist = ["id", "name", "description", "link", "category_id", "category_name", "image_src"]
        whitelist.forEach(attr => this[attr] = attributes[attr])
    }

    static container() {
        return this.c ||= document.querySelector("#productsContainer")
    }

    /* Product.all() will return a promise for all of the Product objects 
    that we get from fetching to /products. This collection will be stored 
    locally in Product.collection so we can reference it after the initial 
    call to Product.all(), which will occur at the DOMContentLoaded event.
    */
    
    /* Here we want to make a fetch request to /products.
    Also, to return a promise. */
    static all() {
        console.log(this);
        return fetch("http://localhost:3000/products", {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if(res.ok) {
                    return res.json() // if things are ok, returns a promise for body content parsed as json. next promise callback will be able to consume that.
                }   else {
                    return res.text().then(error => Promise.reject(error)) // if not ok, this returns a promise so we can chain on a then and say there's an error. return a rejected promise. parse it as text; error message from API and then return that error as a rejected promise. so we skip the following then, and go to catch. 
                }
            }) /* .then will handle the promise we get back from fetch. fetch always returns 
            a promise for a response object. */
            .then(productArray => { /* when you're in a situation where you need to have access to the same context as before or later on, use an arrow function. When you're defining a function, and you know when the function gets called you want a reference to the same context you're in when you define it, use arrow function. */
                this.collection = productArray.map(attrs => new Product(attrs)) /* storing the product list we're getting back from the API in a class variable (this.collection) */
                let renderedProducts = this.collection.map(product => product.render()) /* array of product items */
                this.container().append(...renderedProducts);
                return this.collection
            })
    }

    static findById(id) {
        return this.collection.find(product => product.id == id);
    }

    /* we're using == instead of === because when it finds product id in the dataset it'll actually return as a string.
    so == is how we say it's "basically" the same instead of "exactly" the same. */

/* Product.create(formdata) will make a fetch request to create a new Product in our DB. 
It will use a successful response to create a new Product client-side, and store it in this.collection.
It will also call render() on it to create the DOM element we'll use to represent it in our web page.
It will add that DOM node to Product.container().
It will return a promise for the Product object that was created. */

    static create(formData) {
        return fetch("http://localhost:3000/products", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({product: formData}) /* form data is an object. When we send info to the server, 
            we don't want to send an object. We want to send a string. So we're converting 
            the object into string format in JSON. String can be parsed in Ruby when it gets 
            to server, and then used as a hash to create a new Product on the server-side. 
            And then we convert to a JSON string again to send back to the client. */
        })
            .then(res => {
                if(res.ok) {
                    return res.json() // if things are ok, returns a promise for body content parsed as json. next promise callback will be able to consume that.
                }   else {
                    return res.text().then(error => Promise.reject(error)) // if not ok, this returns a promise so we can chain on a then and say there's an error. return a rejected promise. parse it as text; error message from API and then return that error as a rejected promise. so we skip the following then, and go to catch. 
                }
            })
            .then(productAttributes => {
                let product = new Product(productAttributes);
                this.collection.push(product); /* this.collection = Product.collection. Because of arrow function/this thing. */
                this.container().appendChild(product.render()); /* this will give us element that represents that particular product. */
                new FlashMessage({type: 'success', message: "New product added successfully"})
                return product;
            }) /* most important diference between arrow functions and regular functions is how they relate to this keyword.
        (context of function) If you use arrow function, the context of this (what it refers to) is same one that you have when you define the function.
        Defining arrow function gives access to same context you're in, inside of function, as if you were not inside.
        Arrow functions don't have their own context. */
            .catch(error => {
                new FlashMessage({type: 'error', message: error});
            })
    }

    modalContent() {
        this.modal ||= document.createElement('div');
        
        this.productDescription ||= document.createElement('a');
        this.productDescription.classList.add(..."flex items-center no-underline hover:underline text-black".split(" "));
        this.productDescription.textContent = this.description;

        this.productLink ||= document.createElement('a');
        this.productLink.classList.add(..."flex items-center no-underline hover:underline text-black".split(" "));
        this.productLink.textContent = this.link;

        this.modal.append(this.productDescription, this.productLink);
        return this.modal
    }
    
    render() {
        this.element ||= document.createElement('article');
        this.element.classList.add(..."overflow-hidden rounded-lg shadow-lg p-4".split(" ")); /* turns into array of separate classes */

        this.imgSrc ||= document.createElement('img'); 
        this.imgSrc.classList.add(..."block h-auto w-full".split(" "));
        this.imgSrc.src = this.image_src; 
        
        this.header ||= document.createElement('header'); 
        this.header.classList.add(..."flex items-center justify-between leading-tight p-2 md:p-4".split(" "));

        this.hOne ||= document.createElement ('h1'); 
        this.hOne.classList.add(..."text-lg".split(" "));

        this.nameLink ||= document.createElement('a');
        this.nameLink.classList.add(..."no-underline hover:underline text-black selectProduct".split(" ")); 
        this.nameLink.dataset.productId = this.id;
        this.nameLink.innerHTML = `<i class="productModal" data-product-id="${this.id}">${this.name}</i>`;

        this.footer ||= document.createElement('footer'); 
        this.footer.classList.add(..."flex items-center justify-between leading-none p-2 md:p-4".split(" "));

        this.anotherHOne ||= document.createElement ('h1'); 
        this.anotherHOne.classList.add(..."text-lg".split(" "));

        this.productDescription ||= document.createElement('a');
        this.productDescription.classList.add(..."flex items-center no-underline hover:underline text-black".split(" "));
        this.productDescription.textContent = this.description;

        this.productLink ||= document.createElement('a');
        this.productLink.classList.add(..."flex items-center no-underline hover:underline text-black".split(" "));
        this.productLink.textContent = this.link;

        this.categoryLink ||= document.createElement('a');
        this.categoryLink.classList.add(..."flex items-center no-underline text-black".split(" "));
        this.categoryLink.textContent = this.category_name;

        this.element.append(this.imgSrc, this.header, this.hOne, this.nameLink, this.footer, this.anotherHOne, this.productDescription, this.productLink, this.categoryLink); /* what does this mean??? HELP */

        return this.element; 
    }
}

class Category {
    constructor(attributes) {
        let whitelist = ["id", "name"]
        whitelist.forEach(attr => this[attr] = attributes[attr])
    }

    static container() {
        return this.c ||= document.querySelector("#categoriesContainer")
    }

    static all() {
        console.log(this);
        return fetch("http://localhost:3000/categories", {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if(res.ok) {
                    return res.json()
                }   else {
                    return res.text().then(error => Promise.reject(error))
                }
            })
            .then(categoryArray => {
                this.collection = categoryArray.map(attrs => new Category(attrs))
                let renderedCategories = this.collection.map(category => category.render())
                this.container().append(...renderedCategories);
                this.collection.map(group => group.categoryOptions());
                return this.collection
            })
    }

    categoryOptions(){
        this.option ||= document.createElement("option")
        this.option.value = this.id
        this.option.textContent = this.name
        document.getElementById("category_id").appendChild(this.option)
    }

    /* <li class="my-2 px-4 bg-white grid grid-cols-12 sm:grid-cols-6">
              <a href="#" class="py-4 col-span-10 sm:col-span-4">Activewear</a>
              <a href="#" class="my-4 text-right"><i class="fa fa-pencil-alt"></i></a>
              <a href="#" class="my-4 text-right"><i class="fa fa-trash-alt"></i></a>
            </li> */
    
    render() {
        this.element ||= document.createElement('ul');
        this.element.classList.add(..."list-none".split(" "));
        
        this.listElement ||= document.createElement('li');
        this.listElement.classList.add(..."my-2 px-4 bg-white grid grid-cols-12 sm:grid-cols-6".split(" "));

        this.categoryLink ||= document.createElement('a');
        this.categoryLink.classList.add(..."no-underline hover:underline py-1 col-span-10 sm:col-span-4 selectCategory".split(" "));
        this.categoryLink.textContent = this.name;
        this.categoryLink.dataset.categoryId = this.id;

        this.elementTwo ||= document.createElement('a');
        this.elementTwo.classList.add(..."my-4 text-right".split(" "));

        this.elementThree ||= document.createElement('i');
        this.elementThree.classList.add(..."fa fa-pencil-alt".split(" "));

        this.elementFour ||= document.createElement('a');
        this.elementFour.classList.add(..."my-4 text-right".split(" "));

        this.elementFive ||= document.createElement('i');
        this.elementFive.classList.add(..."fa fa-trash-alt".split(" "));

        this.element.append(this.listElement, this.categoryLink, this.elementTwo, this.elementThree, this.elementFour, this.elementFive);

        return this.element;
        
    }
}

class FlashMessage {
    constructor({type, message}) {
        this.message = message;
        // color = red if error and blue if not //
        this.color = type == "error" ? 'bg-red-200' : 'bg-blue-100";'
        this.render();
    }

    static container() {
        return this.c ||= document.querySelector('#flash')
    }

    render() {
        this.toggleMessage();
        window.setTimeout(this.toggleMessage.bind(this), 5000);
    }

    toggleMessage() {
        FlashMessage.container().textContent = this.message;
        FlashMessage.container().classList.toggle(this.color);
        FlashMessage.container().classList.toggle("opacity-0");
    }
}

class Modal {
    static init() {
        this.body ||= document.body;
        this.modal ||= document.querySelector('.modal');
        this.title ||= document.querySelector('#modal-title');
        this.content ||= document.querySelector('#modal-content')
    }
    
    static populate({title, content}) {
        this.title.innerText = title;
        this.content.innerHTML = "";
        this.content.append(content);
    }

    static toggle() {
        this.modal.classList.toggle('opacity-0');
        this.modal.classList.toggle('pointer-events-none');
        this.body.classList.toggle('modal-active');
    }


}