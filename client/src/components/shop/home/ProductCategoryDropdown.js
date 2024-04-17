import React, { Fragment, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { HomeContext } from "./index";
import { getAllCategory } from "../../admin/categories/FetchApi";
import { getAllProduct, productByPrice } from "../../admin/products/FetchApi";
import "./style.css";
import AOS from "aos";
import Slider from "react-slick";
import Skeleton from "react-loading-skeleton";

const apiURL = process.env.REACT_APP_API_URL;

const CategoryList = () => {
  const history = useHistory();
  const { data } = useContext(HomeContext);
  const [categories, setCategories] = useState(null);
  const [dragging, setDragging] = useState(false); // State to track dragging

  const fetchData = async () => {
    try {
      let responseData = await getAllCategory();
      if (responseData && responseData.Categories) {
        console.log(responseData.Categories);
        setCategories(responseData.Categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: itemsshown(),
    slidesToScroll: 1,
    swipeToSlide: true,
    nextArrow: <SampleNextArrow className="nextarrow" />,
    prevArrow: <SamplePrevArrow className="prevarrow" />,
    beforeChange: () => setDragging(true), // Set dragging to true before change
    afterChange: () => setDragging(false), // Set dragging to false after change
  };

  return (
    <div className="bordersborder1">
      <div className="eeeborders">
        <h1 className="shopnowstyle">SHOP NOW</h1>
        <div className="catcontainer">
          <Slider {...settings}>
            {categories && categories.length > 0 ? (
              categories.map((item, index) => (
                <div
                  className="containersize"
                  key={index}
                  onClick={(e) => {
                    if (!dragging) {
                      history.push(`/products/category/${item._id}`);
                    }
                  }}
                >
                  <div data-aos="zoom-in" className="catphotos">
                    <img src={`${item.cImage}`} className="girlpic" />
                    <h1 className="shoptext">{item.cName}</h1>
                  </div>
                </div>
              ))
            ) : ("")
            }
            {(!categories || categories.length == 0) && Array(3).fill(
                <div
                  className="containersize"
                >
                  <div data-aos="zoom-in" className="catphotos">
                    <Skeleton className="girlpic"/>
                  </div>
                </div>
              )}
          </Slider>
        </div>
      </div>
    </div>
  );
};


function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className="shopnowarrowsright"
      style={{
        ...style,
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className="shopnowarrowsleft"
      style={{
        ...style,
      }}
      onClick={onClick}
    />
  );
}
// const Shopnowcarousel = () => {
//   const settings = {
//     infinite: true,
//     speed: 500,
//     slidesToShow: itemsshown(),
//     slidesToScroll: 1,
//     nextArrow: <SampleNextArrow className="nextarrow" />,
//     prevArrow: <SamplePrevArrow className="prevarrow" />,
//   };
//   return (
//     <div className="bordersborder1" >
//       <div className="eeeborders">
//         <h1 className="shopnowstyle">SHOP NOW</h1>
//         <div className="catcontainer">
//           <Slider {...settings}>
//           {categories && categories.length > 0 ? (
//             categories.map((item, index) => {
//             <div className="containersize" key={index} onClick={(e) =>
//               history.push(`/products/category/${item._id}`)
//             }>
//               <div data-aos="zoom-in" className="catphotos">
//               <img src={`${item.cImage}`} className="girlpic" />
//               <h1 classname="shoptext">{item.cName}</h1>
//               </div>
//             </div>}

//           ) ): ("")}
//           </Slider>
//         </div>{" "}
//       </div>
//     </div>
//   );
// };

function itemsshown() {
  var w = window.innerWidth;

  if (window.matchMedia("(min-width: 790px)").matches) {
    return 4;
  } else {
    return 2;
  }
}

// const FilterList = () => {
//   const { data, dispatch } = useContext(HomeContext);
//   const [range, setRange] = useState(0);

//   const rangeHandle = (e) => {
//     setRange(e.target.value);
//     fetchData(e.target.value);
//   };

//   const fetchData = async (price) => {
//     if (price === "all") {
//       try {
//         let responseData = await getAllProduct();
//         if (responseData && responseData.Products) {
//           dispatch({ type: "setProducts", payload: responseData.Products });
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     } else {
//       dispatch({ type: "loading", payload: true });
//       try {
//         setTimeout(async () => {
//           let responseData = await productByPrice(price);
//           if (responseData && responseData.Products) {
//             console.log(responseData.Products);
//             dispatch({ type: "setProducts", payload: responseData.Products });
//             dispatch({ type: "loading", payload: false });
//           }
//         }, 700);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };

//   const closeFilterBar = () => {
//     fetchData("all");
//     dispatch({ type: "filterListDropdown", payload: !data.filterListDropdown });
//     setRange(0);
//   };

//   return (
//     <div className={`${data.filterListDropdown ? "" : "hidden"} my-4`}>
//       <hr />
//       <div className="w-full flex flex-col">
//         <div className="font-medium py-2">Filter by price</div>
//         <div className="flex justify-between items-center">
//           <div className="flex flex-col space-y-2  w-2/3 lg:w-2/4">
//             <label htmlFor="points" className="text-sm">
//               Price (between 0 and 10 EGP):{" "}
//               <span className="font-semibold text-yellow-700">{range} EGP</span>{" "}
//             </label>
//             <input
//               value={range}
//               className="slider"
//               type="range"
//               id="points"
//               min="0"
//               max="1000"
//               step="10"
//               onChange={(e) => rangeHandle(e)}
//             />
//           </div>
//           <div onClick={(e) => closeFilterBar()} className="cursor-pointer">
//             <svg
//               className="w-8 h-8 text-gray-700 hover:bg-gray-200 rounded-full p-1"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Search = () => {
//   const { data, dispatch } = useContext(HomeContext);
//   const [search, setSearch] = useState("");
//   const [productArray, setPa] = useState(null);

//   const searchHandle = (e) => {
//     setSearch(e.target.value);
//     fetchData();
//     dispatch({
//       type: "searchHandleInReducer",
//       payload: e.target.value,
//       productArray: productArray,
//     });
//   };

//   const fetchData = async () => {
//     dispatch({ type: "loading", payload: true });
//     try {
//       setTimeout(async () => {
//         let responseData = await getAllProduct();
//         if (responseData && responseData.Products) {
//           setPa(responseData.Products);
//           dispatch({ type: "loading", payload: false });
//         }
//       }, 700);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const closeSearchBar = () => {
//     dispatch({ type: "searchDropdown", payload: !data.searchDropdown });
//     fetchData();
//     dispatch({ type: "setProducts", payload: productArray });
//     setSearch("");
//   };

//   return (
//     <div
//       className={`${
//         data.searchDropdown ? "" : "hidden"
//       } my-4 flex items-center justify-between`}
//     >
//       <input
//         value={search}
//         onChange={(e) => searchHandle(e)}
//         className="px-4 text-xl py-4 focus:outline-none"
//         type="text"
//         placeholder="Search products..."
//       />
//       <div onClick={(e) => closeSearchBar()} className="cursor-pointer">
//         <svg
//           className="w-8 h-8 text-gray-700 hover:bg-gray-200 rounded-full p-1"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M6 18L18 6M6 6l12 12"
//           />
//         </svg>
//       </div>
//     </div>
//   );
// };

const ProductCategoryDropdown = (props) => {
  return (
    <Fragment>
      <CategoryList />
      {/* <FilterList />
      <Search /> */}
    </Fragment>
  );
};

export default ProductCategoryDropdown;
