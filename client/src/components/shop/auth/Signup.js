import React, { Fragment, useState } from "react";
import { signupReq } from "./fetchApi";

const Signup = (props) => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    cPassword: "",
    error: false,
    loading: false,
    success: false,
  });

  const alert = (msg, type) => (
    <div className={`text-sm text-${type}-500`}>{msg}</div>
  );

  const formSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, loading: true });
    if (data.cPassword !== data.password) {
      return setData({
        ...data,
        error: {
          cPassword: "Password doesn't match",
          password: "Password doesn't match",
        },
      });
    }
    try {
      let responseData = await signupReq({
        name: data.name,
        email: data.email,
        password: data.password,
        cPassword: data.cPassword,
      });
      if (responseData.error) {
        setData({
          ...data,
          loading: false,
          error: responseData.error,
          password: "",
          cPassword: "",
        });
      } else if (responseData.success) {
        setData({
          success: responseData.success,
          name: "",
          email: "",
          password: "",
          cPassword: "",
          loading: false,
          error: false,
        });
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
    <h1 className="SignupText">Sign Up</h1>
    <div className="SignupPosition">
      <form onSubmit={formSubmit}>
      <input
      onChange={(e) =>
        setData({
          ...data,
          success: false,
          error: {},
          name: e.target.value,
        })
      }
      value={data.name}
      type="text"
      id="name"
      placeholder=" Name"
      className={`${
        data.error.name ? "border-red-500" : ""
      } px-4 py-2 focus:outline-none border`}
    />
    {!data.error?.name ? "" : alert(data.error.name, "red")}


    <input
      onChange={(e) =>
        setData({
          ...data,
          success: false,
          error: {},
          email: e.target.value,
        })
      }
      value={data.email}
      type="email"
      id="email"
      placeholder=" Email"
      className={`${
        data.error.email ? "border-red-500" : ""
      } px-4 py-2 focus:outline-none border`}
    />
    {!data.error?.email ? "" : alert(data.error.email, "red")}

    <input
      onChange={(e) =>
        setData({
          ...data,
          success: false,
          error: {},
          password: e.target.value,
        })
      }
      value={data.password}
      type="password"
      id="password"
      placeholder=" Password"
      className={`${
        data.error.password ? "border-red-500" : ""
      } px-4 py-2 focus:outline-none border`}
    />
    {!data.error?.password ? "" : alert(data.error.password, "red")}
    <input
      onChange={(e) =>
        setData({
          ...data,
          success: false,
          error: {},
          cPassword: e.target.value,
        })
      }
      value={data.cPassword}
      type="password"
      id="cPassword"
      placeholder=" Confirm Password"
      className={`${
        data.error.cPassword ? "border-red-500" : ""
      } px-4 py-2 focus:outline-none border`}
    />
    {!data.error?.cPassword ? "" : alert(data.error.cPassword, "red")}
    <h1 id="LoginAccounttext">
      Have an account ?{" "}
      <span
        onClick={() => {
          props.change()}}
        style={{ color: "#E5E5E5", cursor: "pointer" }}
      >
        {" "}
        Login
      </span>
    </h1>
    <div id="SignupButtonDiv">
      <button id="SignupButton"
    type="submit"
    > Signup</button>
    </div>
      </form>
    </div>

  </Fragment>
  );
};

export default Signup;
