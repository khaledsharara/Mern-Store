import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const DashboardData = async () => {
  try {
    let res = await axios.post(`${apiURL}/api/customize/dashboard-data`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getSliderImages = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/customize/get-slide-image`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const postUploadImage = async (image) => {
  try {
    //upload image to firebase
    let imageUrl = await uploadSliderImage(image);
    let res = await axios.post(`${apiURL}/api/customize/upload-slide-image`, {
      image: imageUrl,
    });
    console.log("res data", res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const postDeleteImage = async (id) => {
  try {
    let res = await axios.post(`${apiURL}/api/customize/delete-slide-image`, {
      id,
    });
    if (res.data.success) {
      let storageRef = firebase.storage().refFromURL(res.data.imageName);
      storageRef.delete();
    }
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const uploadSliderImage = async (image) => {
  console.log("image", image);
  const fileName = `${Date.now()}-${image.name}`;
  const uploadTask = await firebase
    .storage()
    .ref(`sliderImages/${fileName}`)
    .put(image);
  const downloadURL = await uploadTask.ref.getDownloadURL();
  return downloadURL;
};

export const getAllCoupons = async () => {
  try {
    const response = await axios.get(`${apiURL}/api/coupons/get-all-coupons`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createCoupon = async (coupon) => {
  try {
    const response = await axios.post(`${apiURL}/api/coupons/create-coupon`, {
      Code: coupon.Code,
      type: coupon.type,
      value: coupon.value,
      buyGetValue: coupon.buyGetValue,
      allowedProducts: coupon.allowedProducts,
      minimumTotal: coupon.minimumTotal,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCoupon = async (couponId) => {
  try {
    const response = await axios.delete(
      `${apiURL}/api/coupons/delete-coupon/${couponId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
