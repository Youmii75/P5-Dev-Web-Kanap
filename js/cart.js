// creer un objet panier a partir du localstorage contenant le panier
let basketContent
function loadBasketContent() { //initialisation du basket
    basketContent = JSON.parse(localStorage.getItem("panier"))
    //dans le cas ou le panier n'existe pas il faut le creer
    if (!basketContent) {
        basketContent = {};
        localStorage.setItem("panier", JSON.stringify(basketContent))
    }
}
loadBasketContent()

function saveBasketContent() {
    if (!basketContent) {
        basketContent = {};
    }
    localStorage.setItem("panier", JSON.stringify(basketContent))
}

// recuperation de l'id
async function viewProduct(id) {
    let productInfo = await fetch(`http://localhost:3000/api/products/${id}`);
    return await productInfo.json();
}
//creation du tableau
async function getProductBasket() {
    let productBasket = []
    for (let id in basketContent) {
        const productInfo = await viewProduct(basketContent[id].id)
        productBasket.push({ idc: id, id: productInfo._id, name: productInfo.name, image: productInfo.imageUrl, alt: productInfo.altTxt, price: productInfo.price, color: basketContent[id].color, qty: basketContent[id].quantity })
    }
    return productBasket;
}

// calcul du total de produits
function totalOfProducts() {
    let total = 0
    for (let id in basketContent) {
        total += Number(basketContent[id].quantity)
    }
    return total
}

// calcul du prix total des articles
async function totalOfPrice() {
    let total = 0
    const articles = await getProductBasket()
    for (let i = 0; i < articles.length; i++) {
        total += articles[i].price * articles[i].qty
    }
    return total
}

// creer une boucle sur tableau pour generer l'html et l'injecter dans le DOM
async function updateViewBasket() {
    const articles = await getProductBasket()
    let display = '';
    for (let i = 0; i < articles.length; i++) {
        display += `
                    <article class="cart__item" data-id="${articles[i].idc}" data-color="${articles[i].color}">
                        <div class="cart__item__img">
                            <img src="${articles[i].image}" alt="${articles[i].alt}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${articles[i].name}</h2>
                                <p>${articles[i].color}</p>
                                <p>${articles[i].price} €</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${articles[i].qty}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                        </div>
                    </article>
                    `
    }
    // mettre a jour le total des produits et du prix
    document.querySelector('#cart__items').innerHTML = display
    document.querySelector("#totalQuantity").innerHTML = totalOfProducts()
    document.querySelector("#totalPrice").innerHTML = await totalOfPrice()
}
updateViewBasket()

// 4.2 modifier les quantites
// 4.3 creation du boutton supprimer plus rafraichissement de la page
async function addEventProductBasket() {
    await updateViewBasket()
    document.querySelector("#cart__items").addEventListener("click", async (event) => {
        if (event.target.matches(".deleteItem")) {

            // mis en place du message pour la supression d'un produit
            let itemDelete = confirm("Voulez vous vraiment supprimer cet article de votre panier?")
            if (itemDelete === true) {
                delete basketContent[event.target.closest("article").attributes.getNamedItem("data-id").value]
                await saveBasketContent()
                await updateViewBasket()
            }
        }
    })

    //mis en place de la fonction ajout et suppression de produit
    document.querySelector("#cart__items").addEventListener("change", async (event) => {
        if (event.target.matches(".itemQuantity")) {
            let qtyValue = event.target.value
            if (qtyValue == "" || qtyValue == 0) { qtyValue = 1 }
            basketContent[event.target.closest("article").attributes.getNamedItem("data-id").value].quantity = Number(qtyValue)
            await saveBasketContent()
            await updateViewBasket()
        }
    })
}
addEventProductBasket()

// organisation du formulaire
let firstName = document.getElementById('firstName');
let lastName = document.getElementById('lastName');
let address = document.getElementById('address');
let city = document.getElementById('city');
let email = document.getElementById('email')
let button = document.getElementById('order')

// verification des informations client
button.addEventListener('click', validateFields);

// info RegExp
async function validateFields(click) {
    click.preventDefault()
    let isOk = true
    if ((/^(?=.{2,20}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/).test(firstName.value) === false || firstName.value === "") {
        msgError("firstNameErrorMsg", 'Veuillez utiliser que des lettres');
        isOk = false
    }
    else cleanError('firstNameErrorMsg');
    if ((/^(?=.{2,20}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/g).test(lastName.value) === false || lastName.value === "") {
        msgError("lastNameErrorMsg", 'Veuillez utiliser que des lettres');
        isOk = false
    }
    else cleanError('lastNameErrorMsg');
    if ((/^(?=.{2,40}$)(?:\w+[_+-.,!@#$%^&*();\/|<>"]\w+)*$/).test(address.value) === true || address.value === "") {
        msgError("addressErrorMsg", 'Veuillez utiliser que des lettres et des chiffres');
        isOk = false
    }
    else cleanError('addressErrorMsg');
    if ((/^(?=.{2,20}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/).test(city.value) === false || city.value === "") {
        msgError("cityErrorMsg", 'Veuillez utiliser que des lettres');
        isOk = false
    }
    else cleanError('cityErrorMsg');
    if ((/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/).test(email.value) === false || email.value === "") {
        msgError("emailErrorMsg", 'Veuillez utiliser @ pour valider votre adresse mail.');
        isOk = false
    } // la RegEx email du w3c est recommandée https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
    else {
        cleanError("emailErrorMsg", 'emailErrorMsg')
    };
    if (isOk) {

        let isComplete = confirm("Voulez vous valider votre panier ?");
        if (isComplete === true) {
            await generateNumberOrder()
        }
    }
}

function cleanError(location) {
    document.getElementById(location).innerText = ""
}

//mesage d'erreur 
function msgError(location, msg) {
    document.getElementById(location).innerText = `Verifiez votre saisie. ${msg}`
}

//creation de la commande finale a envoyer
async function generateNumberOrder() {
    const idsProducts = []
    for (let id in basketContent) {
        idsProducts.push(basketContent[id].id)
    }

    const payload = await JSON.stringify({
        contact: {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value,
        },
        products: idsProducts
    })

    fetch("http://localhost:3000/api/products/order", {
        method: 'POST',
        headers: {
            Accept: 'application/json; charset=UTF-8',
            'Content-Type': 'application/json'
        },
        body: payload
    })
        .then((response) => { return response.json() })
        .then((data) => {
            location.href = `confirmation.html?id=${data.orderId}`,
                localStorage.clear();
        })
        .catch(() => {
            alert(`Une erreur est survenue`)
        })
}