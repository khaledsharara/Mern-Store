import React, { Fragment, useState, useContext } from "react";
import { loginReq } from "./fetchApi";
import { LayoutContext } from "../index";

const Login = (props) => {
  const { data: layoutData, dispatch: layoutDispatch } = useContext(
    LayoutContext
  );

  const [data, setData] = useState({
    email: "",
    password: "",
    error: false,
    loading: true,
  });

  const alert = (msg) => <div className="text-xs text-red-500">{msg}</div>;

  const formSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, loading: true });
    try {
      console.log("email: ", data.email, "P", data.password)
      let responseData = await loginReq({
        email: data.email,
        password: data.password,
      });
      console.log("res", responseData)
      if (responseData.error) {
        console.log("in error thing")
        setData({
          ...data,
          loading: false,
          error: responseData.error,
          password: "",
        });
      } else if (responseData.token) {
        console.log("in token thing because", responseData.token)
        setData({ email: "", password: "", loading: false, error: false });
        localStorage.setItem("jwt", JSON.stringify(responseData));
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
          <h1 className="LoginText">Login</h1>
          <h1 className="welcomebacktext">Welcome Back</h1>

      {layoutData.loginSignupError ? (
        <div className="bg-red-200 px-4 py-2 rounded">
          You need to login for checkout. Haven't accont? Create new one.
        </div>
      ) : (
        ""
      )}
    <div className="LoginInputPosition">

        <form className="space-y-4" onSubmit={formSubmit}>
            <input
              onChange={(e) => {
                setData({ ...data, email: e.target.value, error: false });
                layoutDispatch({ type: "loginSignupError", payload: false });
              }}
              value={data.email}
              type="text"
              id="name"
              placeholder=" Email"
              className={`${
                !data.error ? "" : "border-red-500"
              } px-4 focus:outline-none border`}
            />

            <input
              onChange={(e) => {
                setData({ ...data, password: e.target.value, error: false });
                layoutDispatch({ type: "loginSignupError", payload: false });
              }}
              value={data.password}
              type="password"
              id="password"
              placeholder=" Password"
              className={`${
                !data.error ? "" : "border-red-500"
              } px-4 focus:outline-none border`}
            />
                      <h1 id="SignupAccounttext">
            Don't have an account ?{" "}
            <span
              onClick={()=> props.change()}
              style={{ color: "#E5E5E5", cursor: "pointer" }}
            >
              Sign up
            </span>
          </h1>
            {!data.error ? "" : alert(data.error)}
          <div id="LoginButtonDiv"
          type="submit"
          >
            <button id="LoginButton">Login</button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Login;
