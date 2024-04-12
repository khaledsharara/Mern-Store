import React, { Fragment, useEffect, useReducer } from "react";
import Routes from "./components";
import "./App.css";
import { LayoutContext, layoutState, layoutReducer } from "./components/shop";
import AOS from "aos";
import "aos/dist/aos.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const [data, dispatch] = useReducer(layoutReducer, layoutState);
  //localhost:3000/

  useEffect(() => {
    AOS.init();
    AOS.refresh();

    setTimeout(() => {
      AOS.refreshHard();
    }, 3000);

    setTimeout(() => {
      AOS.refreshHard();
    }, 6000);

    setTimeout(() => {
      AOS.refreshHard();
    }, 15000);

    return () => {
      AOS.refreshHard();
      AOS.refresh();
    };
  }, []);

  return (
    <Fragment>
      <LayoutContext.Provider value={{ data, dispatch }}>
        <Routes />
      </LayoutContext.Provider>
    </Fragment>
  );
}

export default App;
