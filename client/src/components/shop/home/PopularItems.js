import React, { Fragment, useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import OrderSuccessMessage from "./OrderSuccessMessage";
import { HomeContext } from "./";
import { sliderImages } from "../../admin/dashboardAdmin/Action";
import { prevSlide, nextSlide } from "./Mixins";
import { getAllProduct } from "../../admin/products/FetchApi";
import { isWishReq, unWishReq, isWish } from "./Mixins";
import ProductQuickView from "../productDetails/ProductQuickView";
import Slider from "react-slick";

import "aos/dist/aos.css";
import AOS from "aos";
import Skeleton from "react-loading-skeleton";

const apiURL = process.env.REACT_APP_API_URL;

const PopularItems = (props) => {
  const { data, dispatch } = useContext(HomeContext);
  const { products } = data;
  const history = useHistory();

  const [quickViewProductId, setQuickViewProductId] = useState(null);

  /* WhisList State */
  const [wList, setWlist] = useState(
    JSON.parse(localStorage.getItem("wishList"))
  );

  useEffect(() => {
    fetchData();
    console.log("fetching");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      let responseData = await getAllProduct();
      setTimeout(() => {
        if (responseData && responseData.Products) {
          dispatch({ type: "setProducts", payload: responseData.Products });
          dispatch({ type: "loading", payload: false });
        }
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("products is", products?.[0]);
  }, [products]);

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <>
      <div>
        <h1 className="fontstyle">POPULAR ITEMS</h1>
        <div className="fontstyleline"></div>
      </div>
      <div style={{ marginTop: "2%", marginBottom: "2%" }}>
        <div className="w-full">
          {/* <div className="productbordersize"> */}
          <Slider {...settings}>
            {products && products.length > 0 &&
              products.map((product, index) => (
                <Productsquare key={index } item={product} />
              ))}
              {!products || products.length == 0 && Array(3).fill(    <div
      data-aos="fade-up"
      style={{
        width: "95%",
        position: "relative",
        display: "inline-block",
        marginLeft: "1.5%",
      }}
    >
      <div
        className="photodivproduct"
      >
        <div className="PhotoDivsmaller">
          <Skeleton className="Photo1smaller"/>
        </div>
      </div>
    </div>)}
          </Slider>
        </div>
      </div>
    </>
  );
};

const Productsquare = ({ item }) => {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);
  const history = useHistory();
  return (
    <div
      data-aos="fade-up"
      style={{
        width: "95%",
        position: "relative",
        display: "inline-block",
        marginLeft: "1.5%",
      }}
    >
      <div
        className="photodivproduct"
        onClick={() => history.push(`/products/${item._id}`)}
      >
        <div className="PhotoDivsmaller">
          <img
            src={`${item.pImages[0]}`}
            className="Photo1smaller"
            id="photoprop"
            onMouseOver={(e) => (e.target.src = `${item.pImages[0]}`)}
            onMouseLeave={(e) => (e.target.src = `${item.pImages[0]}`)}
          />
        </div>
      </div>
      <div style={{ marginLeft: "10px", marginTop: "9px" }}>
        <h1
          className="producttext"
          style={{ display: "inline-block", position: "relative" }}
        >
          {" "}
          {item.pName}{" "}
        </h1>
        <input type="checkbox" className="heartlist"></input>

        <h1 className="pricetext"> {item.pPrice} </h1>
      </div>
    </div>
  );
};

export default PopularItems;
