import React, { Fragment, useContext, useState, useEffect } from "react";
import { ProductContext } from "./index";
import { createProduct, getAllProduct, uploadProductImage } from "./FetchApi";
import { getAllCategory } from "../categories/FetchApi";

const AddProductDetail = ({ categories }) => {
  const { data, dispatch } = useContext(ProductContext);

  const alert = (msg, type) => (
    <div className={`bg-${type}-200 py-2 px-4 w-full`}>{msg}</div>
  );

  const addSharedVariable = () => {
    setFdata({
      ...fData,
      sharedVariables: [...fData.sharedVariables, { name: "", values: [] }],
    });
  };

  const removeSharedVariable = (index) => {
    const updatedSharedVariables = [...fData.sharedVariables];
    updatedSharedVariables.splice(index, 1);
    setFdata({
      ...fData,
      sharedVariables: updatedSharedVariables,
    });
  };

  const generateVariations = () => {
    const permutations = permuteVariables(fData.sharedVariables);
    const generatedVariations = permutations.map((permutation) => ({
      values: permutation,
      quantity: "",
    }));
    setFdata({
      ...fData,
      generatedVariations,
    });
  };

  const updateSharedVariableName = (index, value) => {
    const updatedSharedVariables = [...fData.sharedVariables];
    updatedSharedVariables[index].name = value;
    setFdata({
      ...fData,
      sharedVariables: updatedSharedVariables,
    });
  };

  const updateSharedVariableValues = (index, values) => {
    const updatedSharedVariables = [...fData.sharedVariables];
    updatedSharedVariables[index].values = values
      .split(",")
      .map((v) => v.trim());
    setFdata({
      ...fData,
      sharedVariables: updatedSharedVariables,
    });
  };

  const updateQuantity = (index, value) => {
    const updatedGeneratedVariations = [...fData.generatedVariations];
    updatedGeneratedVariations[index].quantity = Number(value);
    setFdata({
      ...fData,
      generatedVariations: updatedGeneratedVariations,
    });
  };

  // Helper function to generate permutations
  const permuteVariables = (variables) => {
    const permutations = [];

    const generate = (index, currentPermutation) => {
      if (index === variables.length) {
        permutations.push([...currentPermutation]);
        return;
      }

      for (const value of variables[index].values) {
        currentPermutation.push(value);
        generate(index + 1, currentPermutation);
        currentPermutation.pop();
      }
    };

    generate(0, []);
    return permutations;
  };

  const extractVariableNames = (sharedVariables) => {
    console.log("Shared Variables in extract: ", sharedVariables);
    return sharedVariables.map((variable) => variable.name);
  };

  const [fData, setFdata] = useState({
    pName: "",
    pDescription: "",
    pStatus: "Active",
    pImage: null, // Initial value will be null or empty array
    pCategory: "",
    pPrice: "",
    isVariation: false,
    pPriceOriginal: "",
    pOffer: 0,
    pQuantity: "",
    success: false,
    error: false,
    sharedVariables: [],
    variations: [],
    generatedVariations: [], // Store generated variations with quantities
    variationNames: [],
  });

  const fetchData = async () => {
    let responseData = await getAllProduct();
    setTimeout(() => {
      if (responseData && responseData.Products) {
        dispatch({
          type: "fetchProductsAndChangeState",
          payload: responseData.Products,
        });
      }
    }, 1000);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    e.target.reset();

    if (!fData.pImage) {
      setFdata({ ...fData, error: "Please upload at least 2 image" });
      setTimeout(() => {
        setFdata({ ...fData, error: false });
      }, 2000);
    }

    try {
      //upload images to firebase
      fData.pImage = await uploadProductImage(fData.pImage);
      console.log(fData);
      let responseData = await createProduct({ ...fData });

      if (responseData.success) {
        fetchData();
        setFdata({
          ...fData,
          pName: "",
          pDescription: "",
          pImage: "",
          pStatus: "Active",
          pCategory: "",
          pPrice: "",
          pPriceOriginal: "",
          pQuantity: "",
          pOffer: 0,
          success: responseData.success,
          error: false,
          sharedVariables: [],
          variations: [],
          generatedVariations: [],
          isVariation: false,
          variationNames: [],
        });
        setTimeout(() => {
          setFdata({
            ...fData,
            pName: "",
            pDescription: "",
            pImage: "",
            pStatus: "Active",
            pCategory: "",
            pPrice: "",
            pPriceOriginal: "",
            pQuantity: "",
            pOffer: 0,
            success: false,
            error: false,
            sharedVariables: [],
            variations: [],
            generatedVariations: [],
            isVariation: false,
            variationNames: [],
          });
        }, 2000);
      } else if (responseData.error) {
        setFdata({ ...fData, success: false, error: responseData.error });
        setTimeout(() => {
          return setFdata({ ...fData, error: false, success: false });
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (fData && fData?.sharedVariables.length > 0) {
      const variationNames = extractVariableNames(fData.sharedVariables);
      setFdata({
        ...fData,
        variationNames: variationNames,
      });
      console.log("Variation Names in useEffect: ", fData.variationNames);
    }
  }, [fData?.sharedVariables]);

  return (
    <Fragment>
      {/* Black Overlay */}
      <div
        onClick={(e) => dispatch({ type: "addProductModal", payload: false })}
        className={`${
          data.addProductModal ? "" : "hidden"
        } fixed top-0 left-0 z-30 w-full h-full bg-black opacity-50`}
      />
      {/* End Black Overlay */}

      {/* Modal Start */}
      <div
        className={`${
          data.addProductModal ? "" : "hidden"
        } fixed inset-0 flex items-center z-30 justify-center overflow-auto`}
      >
        <div className="mt-32 md:mt-0 relative bg-white w-11/12 md:w-3/6 shadow-lg flex flex-col items-center space-y-4 overflow-auto max-h-screen px-4 py-4 md:px-8">
          <div className="flex items-center justify-between w-full pt-4 ">
            <span className="text-left font-semibold text-2xl tracking-wider">
              Add Product
            </span>
            {/* Close Modal */}
            <span
              style={{ background: "#303031" }}
              onClick={(e) =>
                dispatch({ type: "addProductModal", payload: false })
              }
              className="cursor-pointer text-gray-100 py-2 px-2 rounded-full"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          </div>
          {fData.error ? alert(fData.error, "red") : ""}
          {fData.success ? alert(fData.success, "green") : ""}
          <form className="w-full" onSubmit={(e) => submitForm(e)}>
            <div className="flex space-x-1 py-4">
              <div className="w-1/2 flex flex-col space-y-1 space-x-1">
                <label htmlFor="name">Product Name *</label>
                <input
                  value={fData.pName}
                  onChange={(e) =>
                    setFdata({
                      ...fData,
                      error: false,
                      success: false,
                      pName: e.target.value,
                    })
                  }
                  className="px-4 py-2 border focus:outline-none"
                  type="text"
                />
              </div>
              <div className="w-1/2 flex flex-col space-y-1 space-x-1">
                <label htmlFor="price">Product Price *</label>
                <input
                  value={fData.pPriceOriginal}
                  onChange={(e) =>
                    setFdata({
                      ...fData,
                      error: false,
                      success: false,
                      pPrice: e.target.value,
                      pPriceOriginal: e.target.value,
                    })
                  }
                  type="number"
                  className="px-4 py-2 border focus:outline-none"
                  id="price"
                />
              </div>
            </div>

            {/* Checkbox for product variation and customization */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="variation"
                name="variation"
                value={fData.isVariation}
                onChange={(e) => {
                  setFdata({ ...fData, isVariation: !fData.isVariation });
                }}
              />
              <label htmlFor="variation">Product Variation</label>
            </div>

            {/* Product Variation */}
            {fData.isVariation ? (
              <div className="flex flex-col space-y-1">
                <label>Shared Variables</label>
                {fData.sharedVariables.map((variable, index) => (
                  <div key={index} className="flex space-x-2 mt-2">
                    <input
                      type="text"
                      placeholder={`Variable ${index + 1} Name`}
                      value={variable.name}
                      onChange={(e) =>
                        updateSharedVariableName(index, e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder={`Variable ${
                        index + 1
                      } Values (comma-separated)`}
                      value={variable.values.join(",")}
                      onChange={(e) => {
                        updateSharedVariableValues(index, e.target.value);
                        generateVariations();
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeSharedVariable(index)}
                      className="px-2 py-1 bg-red-500 text-black rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    addSharedVariable();
                    console.log("Shared: ", fData.sharedVariables);
                    console.log("Generated: ", fData.generatedVariations);
                    console.log("Variations: ", fData.variations);
                    console.log("Variation Names: ", fData.variationNames);
                  }}
                  className="mt-2 px-2 py-1 bg-green-500 text-black rounded"
                >
                  Add Shared Variable
                </button>
                <hr className="my-4" />
                <label>Generated Variations with Quantities</label>
                <table className="w-full border-collapse border border-gray-300 mt-2">
                  <thead>
                    <tr>
                      {fData.sharedVariables.map((variable, variableIndex) => (
                        <th
                          key={variableIndex}
                          className="border border-gray-300 p-2"
                        >
                          {variable.name}
                        </th>
                      ))}
                      <th className="border border-gray-300 p-2">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fData.generatedVariations.map(
                      (generatedVariation, index) => (
                        <tr key={index}>
                          {generatedVariation.values.map(
                            (value, valueIndex) => (
                              <td
                                key={valueIndex}
                                className="border border-gray-300 p-2"
                              >
                                {value}
                              </td>
                            )
                          )}
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              placeholder="Quantity"
                              value={generatedVariation.quantity}
                              onChange={(e) =>
                                updateQuantity(index, e.target.value)
                              }
                              className="w-full p-1 border border-gray-300"
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              ""
            )}

            <div className="flex flex-col space-y-2">
              <label htmlFor="description">Product Description *</label>
              <textarea
                value={fData.pDescription}
                onChange={(e) =>
                  setFdata({
                    ...fData,
                    error: false,
                    success: false,
                    pDescription: e.target.value,
                  })
                }
                className="px-4 py-2 border focus:outline-none"
                name="description"
                id="description"
                cols={5}
                rows={2}
              />
            </div>
            {/* Most Important part for uploading multiple image */}
            <div className="flex flex-col mt-4">
              <label htmlFor="image">Product Images *</label>
              <span className="text-gray-600 text-xs">Must need 2 images</span>
              <input
                onChange={(e) =>
                  setFdata({
                    ...fData,
                    error: false,
                    success: false,
                    pImage: [...e.target.files],
                  })
                }
                type="file"
                accept=".jpg, .jpeg, .png"
                className="px-4 py-2 border focus:outline-none"
                id="image"
                multiple
              />
            </div>
            {/* Most Important part for uploading multiple image */}
            <div className="flex space-x-1 py-4">
              {fData.isVariation == false ? (
                <div className="w-1/2 flex flex-col space-y-1 space-x-1">
                  <label htmlFor="price">Product Quantity *</label>
                  <input
                    value={fData.pQuantity}
                    onChange={(e) =>
                      setFdata({
                        ...fData,
                        error: false,
                        success: false,
                        pQuantity: e.target.value,
                      })
                    }
                    type="number"
                    className="px-4 py-2 border focus:outline-none"
                    id="price"
                  />
                </div>
              ) : (
                ""
              )}

              <div className="w-1/2 flex flex-col space-y-1">
                <label htmlFor="status">Product Status *</label>
                <select
                  value={fData.pStatus}
                  onChange={(e) =>
                    setFdata({
                      ...fData,
                      error: false,
                      success: false,
                      pStatus: e.target.value,
                    })
                  }
                  name="status"
                  className="px-4 py-2 border focus:outline-none"
                  id="status"
                >
                  <option name="status" value="Active">
                    Active
                  </option>
                  <option name="status" value="Disabled">
                    Disabled
                  </option>
                </select>
              </div>
              <div className="w-1/2 flex flex-col space-y-1">
                <label htmlFor="status">Product Category *</label>
                <select
                  value={fData.pCategory}
                  onChange={(e) =>
                    setFdata({
                      ...fData,
                      error: false,
                      success: false,
                      pCategory: e.target.value,
                    })
                  }
                  name="status"
                  className="px-4 py-2 border focus:outline-none"
                  id="status"
                >
                  <option disabled value="">
                    Select a category
                  </option>
                  {categories.length > 0
                    ? categories.map(function (elem) {
                        return (
                          <option name="status" value={elem._id} key={elem._id}>
                            {elem.cName}
                          </option>
                        );
                      })
                    : ""}
                </select>
              </div>
            </div>
            <div className="flex flex-col space-y-1 w-full pb-4 md:pb-6 mt-4">
              <button
                style={{ background: "#303031" }}
                type="submit"
                className="rounded-full bg-gray-800 text-gray-100 text-lg font-medium py-2"
              >
                Create product
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

const AddProductModal = (props) => {
  useEffect(() => {
    fetchCategoryData();
  }, []);

  const [allCat, setAllCat] = useState({});

  const fetchCategoryData = async () => {
    let responseData = await getAllCategory();
    if (responseData.Categories) {
      setAllCat(responseData.Categories);
    }
  };

  return (
    <Fragment>
      <AddProductDetail categories={allCat} />
    </Fragment>
  );
};

export default AddProductModal;
