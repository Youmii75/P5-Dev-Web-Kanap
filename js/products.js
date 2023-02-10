// 1 recuperer l'ID 
// fetch le produit correspondant a l'id
const url = window.location.search;
const searchParams = new URLSearchParams(url);
const id = searchParams.get('id');

let product = null;

// recuperation de l'id plus appelle de l'API
async function viewProduct() {
  product = await fetch(`http://localhost:3000/api/products/${id}`);
  product = await product.json();

  // creation de la page produit
  // injection dans le DOM
  let image = document.createElement('img');
  image.src = product.imageUrl;
  document.getElementsByClassName('item__img')[0].appendChild(image);
  document.getElementsByClassName("item__img").innerText = product.altTxt;
  document.getElementById("title").innerText = product.name;
  document.getElementById("price").innerText = product.price;
  document.getElementById("description").innerText = product.description;

  //creation de la liste pour le choix des couleurs 
  for (const colors of product.colors) {
    let optionColor = document.createElement('option')
    optionColor.innerText = colors
    document.getElementById('colors').appendChild(optionColor)
  }
}
viewProduct()

// sauvegarde de la commande 
function updateBasket(id, color, quantity) {
  const idComposed = `${id}_${color}` //function de l'Id et de la couleur pour le localstorage
  let basketContent = JSON.parse(localStorage.getItem("panier"))

  //dans le cas ou le panier n'existe pas il faut le creer
  if (!basketContent) {
    basketContent = {};
    localStorage.setItem("panier", JSON.stringify(basketContent))
  }

  //Ajout ou modification de la commande
  let newQuantity = Number(quantity);

  if (basketContent[idComposed]) {
    newQuantity = newQuantity + Number(basketContent[idComposed].quantity);
  }
  basketContent[idComposed] = { id: id, color: color, quantity: newQuantity };
  // console.log(basketContent);
  localStorage.setItem("panier", JSON.stringify(basketContent))
}

//click du bouton pour ajouter un produit
function onClickButton() {
  const quantity = document.querySelector('#quantity').value;
  const color = document.querySelector('#colors').value;

  if (!quantity || !color) return;
  if (quantity == 0) return;

  updateBasket(`${product._id}`, color, quantity)
}

const button = document.getElementById("addToCart")
button.addEventListener("click", onClickButton)