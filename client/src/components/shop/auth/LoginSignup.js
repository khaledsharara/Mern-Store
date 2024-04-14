import React, { Fragment, useState, useContext } from "react";
import Login from "./Login";
import Signup from "./Signup";
import { LayoutContext } from "../index";

const LoginSignup = (props) => {
  const { data, dispatch } = useContext(LayoutContext);

  const [login, setLogin] = useState(true);
  const [loginValue, setLoginValue] = useState("Create an account");

  const loginModalOpen = () => {
    if (!data.loginSignupModal) {
      dispatch({ type: "loginSignupModalToggle", payload: true });
      // Close other toggles if open
      if (data.navberHamburger) {
        dispatch({ type: "hamburgerToggle", payload: false });
      }
      if (data.cartModal) {
        dispatch({ type: "cartModalToggle", payload: false });
      }
    } else {
      dispatch({ type: "loginSignupModalToggle", payload: false });
    }
  };

  const loginSignupModalToggle = () =>
    data.loginSignupModal
      ? dispatch({ type: "loginSignupModalToggle", payload: false })
      : dispatch({ type: "loginSignupModalToggle", payload: true });

  const changeLoginSignup = () => {
    if (login) {
      setLogin(false);
      setLoginValue("Login");
    } else {
      setLogin(true);
      setLoginValue("Create an account");
    }
  };

  return (
    <Fragment>
      {/* Black Overlay  */}
      <div className={`LoginScreenBlack ${data.loginSignupModal ? "active" : "inactive"}`}
            onClick={() => {
              loginModalOpen();
            }}>
        <div className="loginBox"
        onClick={(e) => {
          e.stopPropagation();
        }}>
          {/* <section
            className={` ${
              data.loginSignupModal ? "" : "hidden"
            } fixed z-40 inset-0 my-8 md:my-20 flex items-start justify-center overflow-auto`}
          > */}
              {login ? <Login change={changeLoginSignup} /> : <Signup change={changeLoginSignup} />}
              {/*  Modal Close Button */}
              <div className="absolute top-0 right-0 mx-4">
                <svg
                  onClick={(e) => {
                    loginSignupModalToggle();
                    dispatch({ type: "loginSignupError", payload: false });
                  }}
                  className="w-6 h-6 cursor-pointer"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
        </div>
      </div>
    </Fragment>
  );
};

export default LoginSignup;
