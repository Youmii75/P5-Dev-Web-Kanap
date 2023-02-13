//recuperation des informations de l'API
const accueil = () => {
    fetch("http://localhost:3000/api/products")
        .then(response => response.json())
        .then(products => {
            let display = '';
            products.forEach(article => {
                display += `
                <a href="./product.html?id=${article._id}">
                    <article>
                        <img src="${article.imageUrl}" alt="${article.altTxt}">
                        <h3 class="productName">${article.name}</h3>
                        <p class="productDescription">${article.description}</p>
                    </article>
                </a>
                `
            })
            document.querySelector('#items').innerHTML = display
        })
        .catch(error => console.log(error))

}
accueil()

