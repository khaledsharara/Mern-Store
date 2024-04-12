import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

const BearerToken = () =>
  localStorage.getItem("jwt")
    ? JSON.parse(localStorage.getItem("jwt")).token
    : false;
const Headers = () => {
  return {
    headers: {
      token: `Bearer ${BearerToken()}`,
    },
  };
};

export const getAllCategory = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/category/all-category`, Headers());
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createCategory = async ({
  cName,
  cImage,
  cDescription,
  cStatus,
}) => {
  //upload image to firebase 
  cImage = await uploadCategoryImage(cImage);
  let formData = new FormData();
  formData.append("cImage", cImage);
  formData.append("cName", cName);
  formData.append("cDescription", cDescription);
  formData.append("cStatus", cStatus);

  try {
    let res = await axios.post(
      `${apiURL}/api/category/add-category`,
      formData,
      Headers()
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const editCategory = async (cId, des, status) => {
  let data = { cId: cId, cDescription: des, cStatus: status };
  try {
    let res = await axios.post(
      `${apiURL}/api/category/edit-category`,
      data,
      Headers()
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCategory = async (category) => {
  try {
    let cId = category._id;
    let cImage = category.cImage;
    let res = await axios.post(
      `${apiURL}/api/category/delete-category`,
      { cId },
      Headers()
    );
    if (res.data.success) {
      deleteCategoryImage(cImage);
    }
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const uploadCategoryImage = async (cImage) => {
  // Upload image to firebase
  let fileName = `${Date.now()}_${cImage.name}`;
  const uploadTask = await firebase
    .storage()
    .ref(`category/${fileName}`)
    .put(cImage);
  const downloadURL = await uploadTask.ref.getDownloadURL();
  return downloadURL;
};

export const deleteCategoryImage = async (cImage) => {
  // Delete image from firebase
  let imageRef = await firebase.storage().refFromURL(cImage);
  await imageRef.delete();
};
