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
            .then(productArray => {

            })
    }
   
    render() {

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