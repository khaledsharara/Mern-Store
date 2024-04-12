export const subTotal = (id, price) => {
  let subTotalCost = 0;
  let carts = JSON.parse(localStorage.getItem("cart"));
  carts.forEach((item) => {
    if (item.id === id) {
      subTotalCost = item.quantitiy * price;
    }
  });
  return subTotalCost;
};

export const quantity = (id) => {
  let product = 0;
  let carts = JSON.parse(localStorage.getItem("cart"));
  carts.forEach((item) => {
    if (item.id === id) {
      product = item.quantitiy;
    }
  });
  return product;
};

export const updateQuantity = (
  type,
  id,
  totalQuantity,
  layoutDispatch,
  fetchData,
  totalCost,
  cartList
) => {
  let cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];

  const updatedCart = cart.map((item) => {
    if (item.id === id) {
      let newQuantity = item.quantitiy;
      console.log("new Quantity", newQuantity);
      if (type === "increase" && newQuantity < totalQuantity) {
        newQuantity++;
        console.log("new increased", newQuantity);
      } else if (type === "decrease" && newQuantity > 1) {
        newQuantity--;
        console.log("new decreased", newQuantity);
      }

      return {
        ...item,
        quantitiy: newQuantity,
      };
    } else {
      return item;
    }
  });

  console.log("new cart", updatedCart);

  localStorage.setItem("cart", JSON.stringify(updatedCart));
  layoutDispatch({ type: "inCart", payload: cartList(updatedCart) });
  layoutDispatch({ type: "cartTotalCost", payload: totalCost(updatedCart) });
  fetchData();
};

// const removeCartProduct = (id) => {
//   let cart = localStorage.getItem("cart")
//     ? JSON.parse(localStorage.getItem("cart"))
//     : [];
//   if (cart.length !== 0) {
//     cart = cart.filter((item) => item.id !== id);
//     localStorage.setItem("cart", JSON.stringify(cart));
//     fetchData();
//     dispatch({ type: "inCart", payload: cartList() });
//     dispatch({ type: "cartTotalCost", payload: totalCost() });
//   }
//   if (cart.length === 0) {
//     dispatch({ type: "cartProduct", payload: null });
//     fetchData();
//     dispatch({ type: "inCart", payload: cartList() });
//   }
// };

export const totalCost = () => {
  let totalCost = 0;
  let carts = JSON.parse(localStorage.getItem("cart"));
  carts.forEach((item) => {
    totalCost += item.quantitiy * item.price;
  });
  return totalCost;
};
