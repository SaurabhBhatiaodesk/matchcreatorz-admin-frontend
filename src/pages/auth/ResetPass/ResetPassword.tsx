import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";

import { Logo } from "../../../constant";
import { useResetPassword } from "../../../store/auth/authServices";
import useValidation from "../../../helper/yupValidation";
import { AppInputField } from "../../../components";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const validateString = useLocation()
    .pathname.split("/reset-password/")
    .reverse();

  const { data, error, mutate } = useResetPassword();
  const { resetPasswordValidation } = useValidation();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    getValues,
  } = useForm({
    mode: "all",
    resolver: yupResolver(resetPasswordValidation),
  });

  const handleResetPassword = () => {
    mutate({
      newPassword: getValues().newPassword,
      confirmPassword: getValues().confirmPassword,
      validateString: validateString[0],
    });
    if (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (data?.success) {
      toast.success(data?.message);
      navigate("/");
    } else {
      toast.error(data?.message);
    }
  }, [data]);

  return (
    <div className="login-body has-js">
      <div className="container rounded">
        <form
          name="resetPassword"
          id="resetPassword"
          className="form-signin shadow p-5 mb-5 bg-white "
          onSubmit={handleSubmit(handleResetPassword)}
        >
          <div className="login_logo">
            <Link to="#">
              <img src={Logo} alt="logo" />{" "}
            </Link>
          </div>
          <div className="login-wrap">
            <div className="pass mt-2">
              <AppInputField
                id="newPassword"
                type="password"
                label="New Password"
                placeholder="New Password"
                register={register("newPassword")}
                touched={touchedFields.newPassword}
                error={errors.newPassword?.message}
                isPassword
              />
            </div>

            <div className="pass mt-2">
              <AppInputField
                id="confirmPassword"
                type="password"
                label="Confirm New Password"
                placeholder="Confirm New Password"
                register={register("confirmPassword")}
                touched={touchedFields.confirmPassword}
                error={errors.confirmPassword?.message}
                isPassword
              />
            </div>

            <div className="btnbox">
              <input
                type="submit"
                name="Reset Password"
                defaultValue="Reset Password"
                className="btn btn-lg btn-login btn-block"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
