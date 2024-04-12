import React, { Fragment, useEffect, useContext, useState } from "react";
import OrderSuccessMessage from "./OrderSuccessMessage";
import { HomeContext } from "./";
import { sliderImages } from "../../admin/dashboardAdmin/Action";
import { prevSlide, nextSlide } from "./Mixins";

const apiURL = process.env.REACT_APP_API_URL;

const Slider = (props) => {
  const { data, dispatch } = useContext(HomeContext);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    sliderImages(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {data.sliderImages.length > 0 ? (
        <div className="backphotossize">
          <img
            src={`${data.sliderImages[0].slideImage}`}
            alt="sliderImage"
            className="backphotos"
            onLoad={console.log("load")}
          ></img>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Slider;
