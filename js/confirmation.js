let url = new URL(window.location.href);
let id = url.searchParams.get("id");

document.getElementById("orderId").innerHTML = `${id}`;