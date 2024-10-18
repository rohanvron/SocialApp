import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state/authSlice";
import Dropzone from "react-dropzone";
import { FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import { CircularProgress } from "@mui/material";  // For loading spinner

const signupSchema = yup.object().shape({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
  picture: yup.string().required("Required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
});

const initialValuesSignup = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const [pageType, setPageType] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);  // Loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = pageType === "login";
  const isSignup = pageType === "signup";

  const login = async (values, onSubmitProps) => {
    setLoading(true);  // Set loading to true when login starts
    const loggedInResponse = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
    setLoading(false);  // set loading to false when login is done
  };

  const signup = async (formData, onSubmitProps) => {
    setLoading(true);  // set loading to true when signup starts
    try {
      const savedUserResponse = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        body: formData,
      });
      const savedUser = await savedUserResponse.json();
      onSubmitProps.resetForm();
  
      if (savedUser) {
        setPageType("login");
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
    setLoading(false);  // set loading to false when signup is done
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isSignup) {
      const formData = new FormData();
      for (let value in values) {
        if (value !== "picture") {
          formData.append(value, values[value]);
        }
      }
      if (values.picture) {
        formData.append("picture", values.picture, values.picture.name);
      }
      await signup(formData, onSubmitProps);
    } else {
      await login(values, onSubmitProps);
    }
  };

  return (
    <Formik
      initialValues={isLogin ? initialValuesLogin : initialValuesSignup}
      validationSchema={isLogin ? loginSchema : signupSchema}
      onSubmit={handleFormSubmit}
    >
      {({ errors, touched, setFieldValue, values, resetForm }) => {
        const handleImageDrop = (acceptedFiles) => {
          const file = acceptedFiles[0];
          setFieldValue("picture", file);
          setPreviewImage(URL.createObjectURL(file));
        };

        const handleImageDelete = () => {
          setFieldValue("picture", null);
          setPreviewImage(null);
        };

        return (
          <Form className="space-y-6">
            <h3 className="text-xl font-medium text-white">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </h3>
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Field
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                      className="w-full px-3 py-2 border rounded-md bg-gray-700"
                    />
                    {errors.firstName && touched.firstName && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.firstName}
                      </div>
                    )}
                  </div>
                  <div>
                    <Field
                      name="lastName"
                      type="text"
                      placeholder="Last Name"
                      className="w-full px-3 py-2 border rounded-md bg-gray-700"
                    />
                    {errors.lastName && touched.lastName && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.lastName}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={handleImageDrop}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div
                        {...getRootProps()}
                        className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer relative"
                      >
                        <input {...getInputProps()} />
                        {previewImage ? (
                          <>
                            <img src={previewImage} alt="Preview" className="mx-auto h-32 w-32 object-cover" />
                            <button
                              type="button"
                              onClick={handleImageDelete}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                              <FaTrash />
                            </button>
                          </>
                        ) : (
                          <p>Add Picture Here</p>
                        )}
                      </div>
                    )}
                  </Dropzone>
                </div>
              </>
            )}
            <Field
              name="email"
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-md bg-gray-700"
            />
            {errors.email && touched.email && (
              <div className="text-red-500 text-sm mt-1">{errors.email}</div>
            )}
            <div className="relative">
              <Field
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-3 py-2 border rounded-md bg-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && touched.password && (
              <div className="text-red-500 text-sm">{errors.password}</div>
            )}

            <button
              type="submit"
              className="w-full bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600 transition duration-300 border border-primary-300 flex justify-center items-center"
              disabled={loading} // disable button when loading
            >
              {loading ? (
                <CircularProgress size={24} className="text-white" /> // Loading spinner
              ) : (
                isLogin ? "LOGIN" : "SIGNUP"
              )}
            </button>

            <p className="text-center">
              <span
                onClick={() => {
                  setPageType(isLogin ? "signup" : "login");
                  resetForm();
                }}
                className="text-primary-300 hover:text-primary-400 cursor-pointer"
              >
                {isLogin
                  ? "Don't have an account? Sign Up here."
                  : "Already have an account? Login here."}
              </span>
            </p>
          </Form>
        );
      }}
    </Formik>
  );
};

export default LoginForm;
