import React, { Fragment, useState } from "react";
import Layout from "../layout";
import { sendEmail } from "./FetchApi";

const ContactUsComponent = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const { name, email, message } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailData = {
      name,
      email,
      message,
    };

    try {
      setSubmitted(true);
      const response = await sendEmail(emailData);

      // Handle success or display a success message
      console.log(response);
    } catch (error) {
      // Handle error or display an error message
      console.error(error);
    }
  };

  {
    return (
      <div>
        <section className="text-gray-700 body-font relative">
          <div className="container px-5 py-24 mx-auto">
            {submitted === false ? (
              <>
                <div className="flex flex-col text-center w-full mb-12">
                  <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                    Contact Us
                  </h1>
                  <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                    Got any issues? Have any inquiries? Have any suggestions?
                    Let us know!
                  </p>
                </div>
                <div className="lg:w-1/2 md:w-2/3 mx-auto">
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap -m-2">
                      <div className="p-2 w-1/2">
                        <div className="relative">
                          <label
                            htmlFor="name"
                            className="leading-7 text-sm text-gray-600"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={handleChange}
                            className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                          />
                        </div>
                      </div>
                      <div className="p-2 w-1/2">
                        <div className="relative">
                          <label
                            htmlFor="email"
                            className="leading-7 text-sm text-gray-600"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                          />
                        </div>
                      </div>
                      <div className="p-2 w-full">
                        <div className="relative">
                          <label
                            htmlFor="message"
                            className="leading-7 text-sm text-gray-600"
                          >
                            Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={message}
                            onChange={handleChange}
                            className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                          ></textarea>
                        </div>
                      </div>
                      <div className="p-2 w-full">
                        <button
                          className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center space-y-2 h-screen my-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-green-600 w-24 h-24"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h1 className="text-5xl font-bold">Thank You !</h1>
                  <p className="text-2xl">
                    Thank you for your interest! We'll contact you shortly.
                  </p>
                </div>
              </>
            )}
            <div className="p-2 w-full pt-8 mt-8 text-center lg:w-1/2 md:w-2/3 mx-auto">
              <div className="flex items-center mb-5">
                <div className="flex-1 bg-gray-400 h-px" />
                <p className="mx-2 text-indigo-700"> or </p>
                <div className="flex-1 bg-gray-400 h-px" />
              </div>
              <h1 className="sm:text-2xl text-xl font-medium title-font mb-4 text-gray-900">
                Contact us on social media!
              </h1>
              <div className="flex flex-wrap justify-center gap-10 mt-5">
                <a
                  class="bg-blue-500 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded-full"
                  href="https://facebook.com"
                >
                  <svg
                    className="w-32 h-32 fill-current"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="-6 -6 36 36"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  class="bg-pink-600 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded-full"
                  href="https://instagram.com"
                >
                  <svg
                    className="w-32 h-32 fill-current"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="-4 -4 24 24"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
};

const ContactUs = () => {
  return (
    <Fragment>
      <Layout children={<ContactUsComponent />} />
    </Fragment>
  );
};

export default ContactUs;
