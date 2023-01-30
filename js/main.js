const cardsWrapperEl = document.querySelector("#cards__wrapper");
const cartQtyEl = document.querySelector(".product__quantity");
const cartListEl = document.querySelector("#cart");

document.querySelector("#cartTriggerBtn").addEventListener("click", () => {
  cartListEl.classList.toggle("show");
});

const database = JSON.parse(localStorage.getItem("products")) || [
  {
    id: "1",
    title: "Molxona",
    price: 100,
    imageUrl:
      "https://assets.asaxiy.uz/product/items/desktop/2e2c080d5490760af59d0baf5acbb84e2022042720450413643XcaqBd9OB1.jpg.webp",
    description: "Molxona judayam zo'r kitob ekan!",
  },
  {
    id: "2",
    title: "Qo'yxona",
    price: 80,
    imageUrl: "https://kitobxon.com/img_knigi/2569.jpg",
    description: "Qo'yxona judayam zo'r kitob ekan!",
  },
  {
    id: "3",
    title: "Parrandachilik",
    price: 20,
    imageUrl: "https://kitobxon.com/img_knigi/2576.jpg",
    description: "Parrandachilik sirlari yo'q ekan!",
  },
];

const cart = JSON.parse(localStorage.getItem("cart")) || {
  prods: [],
  totalPrice: 0,
  quantity: 0,
};

const likedProds = JSON.parse(localStorage.getItem("liked")) || [];

render("products");
render("cart");

function addToCart(id, price, type) {
  const foundProdIndex = cart.prods.findIndex((prod) => {
    return prod.id === id;
  });
  switch (type) {
    case "increment":
      if (foundProdIndex === -1) {
        cart.prods.push({
          id,
          qty: 1,
        });
      } else {
        cart.prods[foundProdIndex].qty += 1;
      }

      cart.totalPrice += price;
      cart.quantity += 1;

      cartQtyEl.innerHTML = cart.prods.length;
      break;
    case "decrement":
      if (foundProdIndex === -1) {
        return;
      } else {
        cart.prods[foundProdIndex].qty > 1
          ? (cart.prods[foundProdIndex].qty -= 1)
          : cart.prods.splice(foundProdIndex, 1);
      }
      break;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  render("products");
  render("cart");
}

function addToLiked(id) {
  console.log(id);
  likedProds.includes(id)
    ? likedProds.splice(likedProds.indexOf(id), 1)
    : likedProds.push(id);
  localStorage.setItem("liked", JSON.stringify(likedProds));
  render("products");
}

function render(type) {
  switch (type) {
    case "products":
      cardsWrapperEl.innerHTML = "";
      database.forEach((book) => {
        const { id, title, imageUrl, price, description } = book;
        const cardTemp = `
        <div class="card border-1 border-dark" style="width: 18rem">
          <img src="${imageUrl}" class="card-img-top" alt="${title}" />
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <h3>$${price}</h3>
            <p class="card-text">
              ${description}
            </p>
  
            <div class="d-flex align-items-center justify-content-between">
              <button class="btn btn-outline-primary" ${
                cart.prods.find((item) => item.id === Number(id))
                  ? ""
                  : `onclick="addToCart(${id}, ${price}, 'increment')"`
              }>
                <i class="fa-solid fa-cart-shopping"></i>
              </button>
  
              <span class="like__btn" onclick="addToLiked(${id})">
                ${
                  likedProds.includes(Number(id))
                    ? '<i class="fas fa-heart"></i>'
                    : '<i class="fa-regular fa-heart"></i>'
                }
              </span>
            </div>
          </div>
        </div>
      `;
        cardsWrapperEl.innerHTML += cardTemp;

        cartQtyEl.innerHTML = cart.prods.length;
      });
      break;
    case "cart":
      cartListEl.innerHTML = "";
      cart.prods.forEach((cartItem) => {
        const cartData = database.find((obj) => Number(obj.id) === cartItem.id);
        const cartItemTemp = `
          <div class="card mb-3" style="border-radius: 0">
          <div class="row g-0">
            <div class="col-md-4">
              <img
                src="${cartData.imageUrl}"
                class="img-fluid rounded-start"
                alt="${cartData.title}"
              />
            </div>
            <div class="col-md-8">
              <div
                class="card-body d-flex flex-column justify-content-between h-100"
              >
                <div>
                  <h2 class="card-title">${cartData.title}</h2>
                  <p>
                    ${cartData.description}
                  </p>
                </div>
                <div
                  class="d-flex align-items-center justify-content-between mb-0"
                >
                  <div class="input-group" style="width: 40%">
                    <button class="btn btn-outline-secondary" type="button" onclick="addToCart(${
                      cartData.id
                    }, ${cartData.price}, 'decrement')">
                      -
                    </button>
                    <input
                      type="number"
                      class="form-control"
                      placeholder=""
                      aria-label="Example text with two button addons"
                      value="${cartItem.qty}"
                      style="text-align: center"
                    />
                    <button class="btn btn-outline-secondary" type="button" onclick="addToCart(${
                      cartItem.id
                    }, ${cartData.price}, 'increment')">
                      +
                    </button>
                  </div>
                  <h3>$${cartData.price * cartItem.qty}</h3>
                </div>
              </div>
            </div>
          </div>
          </div>
        `;
        cartListEl.innerHTML += cartItemTemp;
      });
      break;
  }
}
