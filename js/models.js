class Product {
    constructor(attributes) {
        let whitelist = ["id", "name", "description", "link", "category_id", "category_name", "image_src"]
        whitelist.forEach(attr => this[attr] = attributes[attr])
    }

    static container() {
        return this.c ||= document.querySelector("#productsContainer")
    }

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
                    return res.json()
                }   else {
                    return res.text().then(error => Promise.reject(error))  
                }
            })
            .then(productArray => { 
                this.collection = productArray.map(attrs => new Product(attrs)) 
                let renderedProducts = this.collection.map(product => product.render()) 
                this.container().append(...renderedProducts);
                return this.collection
            })
    }

    static findById(id) {
        return this.collection.find(product => product.id == id);
    }

    static create(formData) {
        return fetch("http://localhost:3000/products", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({product: formData})
        })
            .then(res => {
                if(res.ok) {
                    return res.json() 
                }   else {
                    return res.text().then(error => Promise.reject(error))
                }
            })
            .then(productAttributes => {
                let product = new Product(productAttributes);
                this.collection.push(product); 
                this.container().appendChild(product.render()); 
                new FlashMessage({type: 'success', message: "New product added successfully"})
                return product;
            })
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

    static categoryProducts(category) {
        let categoryProductsArray = this.collection.filter(product => product.category_id === category.id);
        let renderedCategoryProducts = categoryProductsArray.map(product => product.render());
        this.container().innerHTML = "";
        this.container().append(...renderedCategoryProducts);
    }

    
    render() {
        this.element ||= document.createElement('article');
        this.element.classList.add(..."overflow-hidden rounded-lg shadow-lg p-4".split(" ")); 

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

        this.categoryLink ||= document.createElement('a');
        this.categoryLink.classList.add(..."flex items-center no-underline text-black".split(" "));
        this.categoryLink.textContent = this.category_name;

        this.element.append(this.imgSrc, this.header, this.hOne, this.nameLink, this.categoryLink);

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

    static findById(id) {
        return this.collection.find(category => category.id == id);
    }
    
    render() {
        this.element ||= document.createElement('ul');
        this.element.classList.add(..."list-none".split(" "));
        
        this.listElement ||= document.createElement('li');
        this.listElement.classList.add(..."my-2 px-4 bg-white grid grid-cols-12 sm:grid-cols-6".split(" "));

        this.categoryLink ||= document.createElement('a');
        this.categoryLink.classList.add(..."no-underline hover:underline py-1 col-span-10 sm:col-span-4 selectCategory".split(" "));
        this.categoryLink.dataset.categoryId = this.id;
        this.categoryLink.innerHTML = `<i class="filterCategory" data-category-id="${this.id}">${this.name}</i>`;

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