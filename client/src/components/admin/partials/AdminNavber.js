import React, { Fragment, useContext, useEffect } from "react";
import "../../../App.css";
import { useHistory, useLocation } from "react-router-dom";
import react, { useState } from "react";

const AdminNavber = (props) => {
  const history = useHistory();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    switchnav(location.pathname);
    setOpen(false);
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishList");
    window.location.href = "/";
  };

  return (
    <div>
      <div className="navbar1">
        <div>
          <button
            id="menuicon"
            className=" w-12 h-10 inline-block	float-right  my-1.5 mr-4"
            onClick={() => setOpen(!open)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
            >
              <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        <div className="cursor-pointer" onClick={(e) => history.push("/")}>
          <h7 className="Websitename mt-3"> ZAM </h7>
        </div>
      </div>
      <div className={`fullscreenmenu ${open ? "active" : "inactive"}`}>
        <div className="halfscreen" onClick={() => setOpen(!open)}></div>
        {/* this is for the side bar*/}
        <div className="sidebar">
          <div className="contentdiv">
            <div id="usernamediv">
              <h1>Admin</h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path
                  fillRule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div
              className="navbarcontent cursor-pointer"
              id="homenav"
              onClick={(e) => {
                history.push("/");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="gray"
                id="homeicon"
                className="animationsicon"
              >
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
              </svg>

              <h1 id="homenavtext">Home</h1>
            </div>
            <div
              className="navbarcontent cursor-pointer"
              id="shopnav"
              onClick={(e) => {
                history.push("/");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="gray"
                id="shopicon"
                className="animationsicon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>

              <h1 id="shopnavtext">Shop</h1>
            </div>
            <div
              className="navbarcontent cursor-pointer"
              id="wishlistnav"
              onClick={(e) => {
                history.push("/wish-list");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="gray"
                id="wishlisticon"
                className="animationsicon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>

              <h1 id="wishlistnavtext">Wishlist</h1>
            </div>
            <div
              className="navbarcontent cursor-pointer"
              id="contactnav"
              onClick={(e) => {
                history.push("/contact-us");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="gray"
                id="contacticon"
                className="animationsicon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>

              <h1 id="contactnavtext"> Contact us</h1>
            </div>

            <div
              className="navbarcontent cursor-pointer"
              id="settingnav"
              onClick={(e) => {
                history.push("/admin/dashboard");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="gray"
                id="settingicon"
                className="animationsicon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>

              <h1 id="settingnavtext"> Dashboard</h1>
            </div>

            <div className="loginbutton">
              <button
                type="button"
                className="loginbuttonstyle cursor-pointer"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function switchnav(page) {
  switch (page) {
    case "home":
      document.getElementById("homenav").style.backgroundColor = "#282727";
      document.getElementById("homenav").style.color = "white";

      document.getElementById("homenav").style.borderRadius = "30px";
      break;
    case "shop":
      document.getElementById("shopnav").style.backgroundColor = "#282727";
      document.getElementById("shopnav").style.color = "white";

      document.getElementById("shopnav").style.borderRadius = "30px";
      break;

    case "wishlist":
      document.getElementById("wishlistnav").style.backgroundColor = "#282727";
      document.getElementById("wishlistnav").style.color = "white";

      document.getElementById("wishlistnav").style.borderRadius = "30px";
      break;

    case "contact":
      document.getElementById("contactnav").style.backgroundColor = "#282727";
      document.getElementById("contactnav").style.color = "white";

      document.getElementById("contactnav").style.borderRadius = "30px";
      break;
    case "/admin/dashboard":
      document.getElementById("settingnav").style.backgroundColor = "#282727";
      document.getElementById("settingnav").style.color = "white";

      document.getElementById("settingnav").style.borderRadius = "30px";
      break;
  }
}

export default AdminNavber;
