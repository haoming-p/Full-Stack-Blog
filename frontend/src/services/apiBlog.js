import axiosInstance from "./axiosInstance";

export async function getBlogs(page) {
  try {
    const response = await axiosInstance.get(`blog_list/?page=${page}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("API Error:", err.message);
    throw new Error(err.message);
  }
}

export async function getBlog(slug) {
  try {
    const response = await axiosInstance.get(`blogs/${slug}`);
    return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function registerUser(data) {
  try {
    const response = await axiosInstance.post("register_user/", data);
    return response.data;
  } catch (err) {
    console.log(err);
    if (err.status == 400) {
      throw new Error("Username already exists");
    }
    throw new Error(err);
  }
}

export async function signin(data) {
  try {
    const response = await axiosInstance.post("token/", data);
    return response.data;
  } catch (err) {
    if (err.status === 401) {
      throw new Error("invalid credentials");
    }
    throw new Error(err);
  }
}

// username
export async function getUsername() {
  try {
    const token = localStorage.getItem("access");
    console.log('access:', token)
    const response = await axiosInstance.get("get_username",{
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
    console.log('getUsername response', response.data)
    return response.data;
  } catch (err) {
    console.error("Error in getUsername:", err.response?.data || err.message);
    throw new Error(err.message);
  }
}

// create blog
export async function createBlog(data) {
  try{
    const response = await axiosInstance.post('create_blog/', data)
    return response.data
  } catch(err){
    throw new Error(err.message)
  }
}

// update blog
export async function updateBlog(data, id){
  try{
    const response = await axiosInstance.put(`update_blog/${id}/`, data)
    return response.data
  }

  catch(err){
    if(err.response){
      throw new Error(err.response?.data?.message || "Failed to update blog" )
    }

    throw new Error(err.message)
  }
}

// delete
export async function deleteBlog(id){
  try{
    const response = await axiosInstance.delete(`delete_blog/${id}/`)
    return response.data
  }
  catch(err){
    if(err.response){
      throw new Error(err.response?.data?.message || "Failed to delete blog" )
    }
    throw new Error(err.message)
  }
}

// userinfo
export async function getUserInfo(username){
  try{
    const response = await axiosInstance.get(`get_userinfo/${username}`)
    return response.data
  }
  catch(err){
    throw new Error(err.message)
  }
}

// update userinfo
export async function updateProfile(data){
  try{
    const response = await axiosInstance.put(`update_user/`, data)
    return response.data
  }
  catch(err){
    throw new Error(err.message)
  }
}