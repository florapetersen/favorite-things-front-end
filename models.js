class Product {
    constructor(attributes) {
        let whitelist = ["id", "name", "description", "link"]
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
        return fetch("https://localhost:3000/products", {
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
                let renderedProducts = this.collection.map(product => Product.render()) /* array of product items */
                this.container().append(...renderedProducts);
                return this.collection
            })
    }

/* <article class="overflow-hidden rounded-lg shadow-lg">
            
                            <a href="#">
                                <img alt="Placeholder" class="block h-auto w-full" src="https://cdn.shopify.com/s/files/1/0019/2217/0943/products/1_7e397d35-e3d3-4a2e-b94e-64c28d32cf1b_1200x.jpg?v=1605550787">
                            </a>
            
                            <header class="flex items-center justify-between leading-tight p-2 md:p-4">
                                <h1 class="text-lg">
                                    <a class="no-underline hover:underline text-black" href="#">
                                        Product Name
                                    </a>
                                </h1>
                            </header>

                            <footer class=
            
                            <footer class="flex items-center justify-between leading-none p-2 md:p-4">
                                <h1 class ="text-lg">
                                    <a class="flex items-center no-underline text-black">Description
                                    </a>
                                    <a class="flex items-center no-underline text-black">Link to Buy   
                                    </a>                             
                            </footer>
            
                        </article> */

    render() {
        this.element ||= document.createElement('article');
        this.element.classList.add(..."overflow-hidden rounded-lg shadow-lg".split(" ")); /* turns into array of separate classes */

        this.img_src ||= document.createElement('a'); /* is this actually supposed to be called img_src? */
        this.img_src.classList.add(..."block h-auto w-full".split(" "));
        this.img_src.src = this.image_src;
        
        this.header ||= document.createElement('header'); 
        this.header.classList.add(..."flex items-center justify-between leading-tight p-2 md:p-4".split(" "));

        this.h_one ||= document.createElement ('h1'); 
        this.h_one.classList.add(..."text-lg".split(" "));

        this.nameLink ||= document.createElement('a');
        this.nameLink.classList.add(..."no-underline hover:underline text-black".split(" ")); /* this could actually be a link but not necessarily? */
        this.nameLink.textContent = this.name;

        this.footer ||= document.createElement('footer'); 
        this.footer.classList.add(..."flex items-center justify-between leading-none p-2 md:p-4".split(" "));

        this.another_h_one ||= document.createElement ('h1'); 
        this.another_h_one.classList.add(..."text-lg".split(" "));

        this.product_description ||= document.createElement('a');
        this.product_description.classList.add(..."flex items-center no-underline hover:underline text-black".split(" "));
        this.product_description.textContent = this.description;

        this.product_link ||= document.createElement('a');
        this.product_link.classList.add(..."flex items-center no-underline hover:underline text-black".split(" "));
        this.product_link.textContent = this.link;

        this.element.append(this.img_src, this.header, this.h_one, this.nameLink, this.footer, this.another_h_one, this.product_description, this.product_link); /* what does this mean??? HELP */

        return this.element; /* ok so clearly we are returning just the initial element... the ARTICLE */
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
}