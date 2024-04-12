import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const getAllProduct = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/product/all-product`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createPorductImage = async ({ pImage }) => {
  /* Most important part for uploading multiple image  */
  let formData = new FormData();
  for (const file of pImage) {
    formData.append("pImage", file);
  }
  /* Most important part for uploading multiple image  */
};

export const createProduct = async ({
  pName,
  pDescription,
  pImage,
  pStatus,
  pCategory,
  pQuantity,
  pPrice,
  pPriceOriginal,
  pOffer,
  generatedVariations,
  isVariation,
  variationNames,
}) => {
  /* Most important part for uploading multiple image  */
  let formData = new FormData();
  for (const file of pImage) {
    formData.append("pImage", file);
  }
  /* Most important part for uploading multiple image  */
  formData.append("pName", pName);
  formData.append("pDescription", pDescription);
  formData.append("pStatus", pStatus);
  formData.append("pCategory", pCategory);
  formData.append("pQuantity", pQuantity);
  formData.append("pPrice", pPrice);
  formData.append("pOffer", pOffer);
  formData.append("pPriceOriginal", pPriceOriginal);
  formData.append("generatedVariations", JSON.stringify(generatedVariations));
  formData.append("isVariation", isVariation);
  formData.append("variationNames", JSON.stringify(variationNames));
  try {
    let res = await axios.post(`${apiURL}/api/product/add-product`, formData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const editProduct = async (product) => {
  /* Most important part for updating multiple image  */
  let formData = new FormData();
  if (product.pEditImages) {
    for (const file of product.pEditImages) {
      formData.append("pEditImages", file);
    }
  }

  /* Most important part for updating multiple image  */
  formData.append("pId", product.pId);
  formData.append("pName", product.pName);
  formData.append("pDescription", product.pDescription);
  formData.append("pStatus", product.pStatus);
  formData.append("pCategory", product.pCategory._id);
  if (product.isVariation) {
    formData.append("pQuantity", 0);
  } else {
    formData.append("pQuantity", product.pQuantity);
  }
  formData.append("pPrice", product.pPrice);
  formData.append("pPriceOriginal", product.pPriceOriginal);
  formData.append("pOffer", product.pOffer);
  formData.append("pImages", product.pImages);
  formData.append("generatedVariations", JSON.stringify(product.pVariations));
  formData.append("isVariation", product.isVariation);
  formData.append("variationNames", JSON.stringify(product.variationNames));
  console.log("From edit api call", product);

  try {
    let res = await axios.post(`${apiURL}/api/product/edit-product`, formData);
    // delete old image from firebase storage
    if (res.data.success && product.pEditImages !== product.pImages) {
      await deleteProductImage(product.pImages);
    }
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (product) => {
  try {
    let pId = product._id;
    let pImage = product.pImages;
    let res = await axios.post(`${apiURL}/api/product/delete-product`, { pId });
    if (res.data.success) {
      await deleteProductImage(pImage);
    }
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const productByCategory = async (catId) => {
  try {
    let res = await axios.post(`${apiURL}/api/product/product-by-category`, {
      catId,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const productByPrice = async (price) => {
  try {
    let res = await axios.post(`${apiURL}/api/product/product-by-price`, {
      price,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const uploadProductImage = async (pImage) => {
  //loop through all the selected files and upload them to firebase storage
  let pImageURL = [];
  for (const file of pImage) {
    const fileName = `${Date.now()}-${file.name}`;
    const uploadTask = await firebase
      .storage()
      .ref(`product/${fileName}`)
      .put(file);
    const downloadURL = await uploadTask.ref.getDownloadURL();
    pImageURL.push(downloadURL);
  }
  return pImageURL;
};

export const uploadProductEditImage = async (pEditImages) => {
  //loop through all the selected files and upload them to firebase storage
  let pEditImageURL = [];
  for (const file of pEditImages) {
    const fileName = `${Date.now()}-${file.name}`;
    const uploadTask = await firebase
      .storage()
      .ref(`product/${fileName}`)
      .put(file);
    const downloadURL = await uploadTask.ref.getDownloadURL();
    pEditImageURL.push(downloadURL);
  }
  return pEditImageURL;
};

export const deleteProductImage = async (pImage) => {
  //loop through all the selected files and upload them to firebase storage
  try {
    for (const file of pImage) {
      await firebase.storage().refFromURL(file).delete();
    }
    return true;
  } catch (error) {
    console.log(error);
  }
};
