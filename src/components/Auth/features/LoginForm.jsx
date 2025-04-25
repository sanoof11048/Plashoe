import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../userContext";
import InputBox from "../InputBox";
import axiosAuth from "../../../api/axiosAuth";

const initialValues = {
  email: "sanoof",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please Enter Valid Email")
    .required("Please Enter Your Email Address"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Please Enter Your Password"),
});

const LoginForm = ({ setIsLogin }) => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axiosAuth.post("/auth/login", values);
  
      const user = response.data;
      toast.success(user.email === "admin@gmail.com" ? "Welcome Admin" : "Login Successful");
  
      localStorage.setItem("id", user.id);
      localStorage.setItem("token", user.token);
      setUser(user);
  
      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
      if (user.email === "admin@gmail.com") {
        navigate("/dash");
      } else {
        setTimeout(() => navigate("/"), 1000);
      }

    } catch (err) {
      console.error(err);
      const error = err.response?.data;
      if (error === "User not found" || error === "Invalid password") {
        toast.error("Invalid Email or Password");
      } else if (error === "User is blocked") {
        toast.error("You are Blocked by Admin");
      } else {
        toast.error("Login Failed");
      }
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={handleSubmit}
  >
    {({ isSubmitting, errors }) => (
      <Form className="w-full animate-fade-in">
        <h1 className="text-4xl font-bold pb-6">Login</h1>
        <InputBox type="email" name="email" placeholder="Email" icon="bxs-envelope" />
        {errors.email && <small>{errors.name}</small>}
        <InputBox type="password" name="password" placeholder="Password" icon="bxs-lock-alt" />
        <button
          type="submit"
          className="btn cursor-pointer w-full bg-stone-500 text-white rounded-lg font-semibold hover:bg-stone-300 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Loading..." : "Login"}
        </button>
      </Form>
    )}
  </Formik>
  );
};

export default LoginForm;
