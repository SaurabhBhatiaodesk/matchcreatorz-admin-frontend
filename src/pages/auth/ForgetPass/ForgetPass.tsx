import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import { Logo } from "../../../constant";
import { useForgotPassword } from "../../../store/auth/authServices";
import useValidation from "../../../helper/yupValidation";
import { AppInputField } from "../../../components";

const ForgetPass: React.FC = () => {
  const navigate = useNavigate();
  const { data, error, mutate } = useForgotPassword();
  const { forgotPasswordValidation } = useValidation();
  
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    getValues,
  } = useForm({
    mode: "all",
    resolver: yupResolver(forgotPasswordValidation),
  });

  const handleForgotPass = () => {
    setIsLoading(true); // Set loading to true when submitting
    mutate(getValues().email);
    if (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (data?.success) {
      toast.success(data?.message);
      navigate("/");
    } else if (data) {
      toast.error(data?.message);
    }
    setIsLoading(false); // Set loading to false after response
  }, [data]);

  return (
    <div className="login-body has-js">
      <div className="container rounded">
        <form
          name="signup"
          id="signup"
          className="form-signin shadow p-5 mb-5 bg-white"
          onSubmit={handleSubmit(handleForgotPass)}
        >
          <div className="login_logo">
            <Link to="/">
              <img src={Logo} alt="logo" />
            </Link>
          </div>
          <div className="login-wrap">
            <div className="pass mt-2 mb-3">
              <AppInputField
                id="email"
                type="email"
                label="Email"
                placeholder="Email"
                register={register("email")}
                touched={touchedFields.email}
                error={errors.email?.message}
              />
            </div>
            <div className="remember-forget checkboxes d-flex justify-content-between">
              <span className="pull-right text-right">
                <Link to="/login" data-toggle="modal">
                  Back to Signin?
                </Link>
              </span>
            </div>
            <div className="btnbox">
              <button
                type="submit"
                className="btn btn-lg btn-login btn-block"
                disabled={isLoading} // Disable button when loading
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPass;
