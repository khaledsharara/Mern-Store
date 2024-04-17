import React, { Fragment, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../index";
import { cartListProduct } from "./FetchApi";
import { isAuthenticate } from "../auth/fetchApi";
import { cartList } from "../productDetails/Mixins";
import { subTotal, quantity, totalCost, updateQuantity } from "./Mixins";

const apiURL = process.env.REACT_APP_API_URL;

const CartModal = () => {
  const history = useHistory();

  const { data, dispatch } = useContext(LayoutContext);
  const products = data.cartProduct;

  const cartModalOpen = () =>
    dispatch({ type: "cartModalToggle", payload: !data.cartModal });

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQuantityUpdate = (type, id, totalQuantity) => {
    updateQuantity(
      type,
      id,
      totalQuantity,
      dispatch,
      fetchData,
      totalCost,
      cartList
    );
  };

  const fetchData = async () => {
    try {
      let responseData = await cartListProduct();
      if (responseData && responseData.Products) {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "cartTotalCost", payload: totalCost() });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeCartProduct = (id) => {
    let cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    if (cart.length !== 0) {
      cart = cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(cart));
      fetchData();
      dispatch({ type: "inCart", payload: cartList() });
      dispatch({ type: "cartTotalCost", payload: totalCost() });
    }
    if (cart.length === 0) {
      dispatch({ type: "cartProduct", payload: null });
      fetchData();
      dispatch({ type: "inCart", payload: cartList() });
    }
  };

  return (
    <Fragment>
      <div
      className={`fullscreenmenucart ${data.cartModal ? "active" : "inactive"}`}
      onClick={() => {
        cartModalOpen();
        showitems();
      }}
        >
      

          <div className="flex flex-col cartsidebar " onClick={(e) => {
          e.stopPropagation();
        }}>
            <div className="contentdivcart">
              <div id="usernamedivcart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="white"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                <h1>Shopping Cart</h1>
                {products ? <div className="shopchartline"></div> : <div className="shopchartlineEmpty"></div>}
              </div>
            </div>
            <div className=" overflow-y-auto">
              
                {products &&
                        products.length !== 0 &&
                      products.map((item, index) => {
                        return (
                          <Fragment key={index}>
                            <div className="productfulldiv" id="totalproductdiv">
                                  <div className="productimagediv">
                                    <img src={`${item.pImages[0]}`} className="productimage" />
                                  </div>
                                  <div className="productstextdiv">
                                    <h1 className="productnametext">{item.pName}</h1>
                                    <h1 className="productpricetext">EGP{subTotal(item._id, item.pPrice)}</h1>
                                    <div className="quantitydiv">
                                      <button onClick={() =>
                                            handleQuantityUpdate(
                                              "decrease",
                                              item._id,
                                              item.pQuantity
                                            )
                                          } id="minusquantity">
                                        -
                                      </button>
                                      <h1 id="quantnum">{quantity(item._id)}</h1>
                                      <button onClick={() =>
                                            handleQuantityUpdate(
                                              "increase",
                                              item._id,
                                              item.pQuantity
                                            )
                                          } id="addquantity">
                                        +
                                      </button>
                                    </div>
                                  </div>
                                  <div className="closingicondiv">
                                    <button
                                  onClick={(e) => removeCartProduct(item._id)}
                                  >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="gray"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="#1b1b1b"
                                        class="w-10 h-10"
                                      >
                                            <path
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                          </Fragment>
                        );})}
            </div>
                    {products === null ? <div className="navbarcontentendcart">
            <h1 className="cartendbuttonstyle"> No Products in Cart</h1>
          </div> : <div className="navbarcontentendcartProducts">
              <div className="grandtotaldiv">
                <div className="grandtotalline"></div>
                <h1 className="totaltextstyle" id="grandtotalplacement">
                  Grand Total
                </h1>
                <h1 className="totaltextstyle" id="priceplacement">
                EGP{data.cartTotalCost}
                </h1>
                <div className="grandtotalline"></div>
              </div>
              <div className="buttondivs">
                <button id="ContiuneshoppingButton" onClick={()=>cartModalOpen()}>Contiune Shopping</button>
                <button id="CheckoutButton" onClick={(e) => {
                      history.push("/checkout");
                      cartModalOpen();
                    }}>Checkout</button>
              </div>
            </div>}
      
          </div>
          </div>
    </Fragment>
  );
};

function showitems() {
  if (document.getElementsByClassName("fullscreenmenucart.inactive")) {
    document.getElementById("menuicon").style.display = "inline-block";
    if (window.matchMedia("(max-width: 800px)").matches) {
      document.getElementById("accounticon").style.display = "none";
    } else {
      document.getElementById("accounticon").style.display = "inline-block";
    }
    document.getElementById("shopingcart").style.display = "inline-block";
  }
}

export default CartModal;
