import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import { Logo } from "../../../constant";
import { useAuthStore } from "../../../store/auth/authStore";
import { useLogin } from "../../../store/auth/authServices";
import { ROUTE_PATHS } from "../../../routes/routePaths";
import useValidation from "../../../helper/yupValidation";
import { AppInputField } from "../../../components";

const SignIn: FC = () => {
  const { mutate, data } = useLogin();
  const {
    setLogin,
    setUserDetails,
    setToken,
    setRememberMe,
    rememberMe,
    loginDetails,
  } = useAuthStore();
  const [rememberMeCheck, setRememberMeCheck] = useState(false);
  const { loginValidation } = useValidation();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    getValues,
    setValue,
  } = useForm({
    mode: "all",
    resolver: yupResolver(loginValidation),
  });

  const useHandleSignIn = (data: { email: string; password: string }) => {
    mutate({
      email: data.email,
      password: data.password,
    });
  };

  const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMeCheck(e.target.checked);
  };

  useEffect(() => {
    if (data) {
      if (data && data.success) {
        setLogin(true);
        setUserDetails(data.data?.user);
        setToken(data.data?.token ?? '');
        setRememberMe(getValues(), rememberMeCheck);

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    }
  }, [
    setUserDetails,
    data,
    setToken,
    getValues,
    rememberMeCheck,
    setRememberMe,
  ]);

  useEffect(() => {
    if (rememberMe) {
      setValue("email", loginDetails?.email ?? "");
      setValue("password", loginDetails?.password ?? "");
      setRememberMeCheck(rememberMe);
    }
  }, [rememberMe, loginDetails, setValue, setRememberMeCheck]);
  return (
    <div className="login-body has-js">
      <div className="container rounded">
        <form
          name="signup"
          id="signup"
          className="form-signin shadow p-5 mb-5 bg-white "
          onSubmit={handleSubmit(useHandleSignIn)}
        >
          <div className="login_logo">
            <Link to="/">
              <img src={Logo} alt="logo" />{" "}
            </Link>
          </div>
          <div className="login-wrap">
            

            <div className="pass mt-2">
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

            <div className="pass mt-2">
              <AppInputField
                id="password"
                type="password"
                label="Password"
                placeholder="Password"
                register={register("password")}
                touched={touchedFields.password}
                error={errors.password?.message}
                isPassword
              />
            </div>

            <div className="remember-forget checkboxes d-flex justify-content-between mt-3">
              <label
                className={`label_check ${rememberMeCheck ? "c_on" : "c_off"}`}
                htmlFor="remember-me"
              >
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMeCheck}
                  onChange={handleRememberMe}
                />{" "}
                Remember Password
              </label>
              <span className="pull-right text-right">
                <Link to={ROUTE_PATHS.FORGOT_PASSWORD} data-toggle="modal">
                  Forgot Password?
                </Link>
              </span>
            </div>
            <div className="btnbox">
              <button className="btn btn-lg btn-login btn-block" type="submit">
                Log In
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
