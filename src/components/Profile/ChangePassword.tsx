import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";

import { useChangePassword } from "../../store/auth/authServices";
import useValidation from "../../helper/yupValidation";
import { AppInputField } from "../Common/AppInputField";
import { useNavigate } from "react-router-dom";

export const ChangePassword: React.FC = () => {
  const { data, error, mutate } = useChangePassword();
  const { changePasswordValidation } = useValidation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    getValues,
  } = useForm({
    mode: "all",
    resolver: yupResolver(changePasswordValidation),
  });

  const handleChangePassword = () => {
    mutate({
      oldPassword: getValues().currentPassword,
      newPassword: getValues().newPassword,
      confirmPassword: getValues().confirmPassword,
    });
    if (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (data?.success) {
      toast.success(data?.message);
      navigate('/')
    } else {
      toast.error(data?.message);
    }
  }, [data]);

  return (
    <form
      name="changePassword"
      id="changePassword"
      onSubmit={handleSubmit(handleChangePassword)}
    >
      <div className=""></div>
      <div className="form-group row">
        <div className="col-md-6">
          <AppInputField
            id="currentPassword"
            type="password"
            label="Current Password"
            placeholder="Current Password"
            register={register("currentPassword")}
            touched={touchedFields.currentPassword}
            error={errors.currentPassword?.message}
            isPassword
          />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-md-6">
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
      </div>
      <div className="form-group row">
        <div className="col-md-6">
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
      </div>
      <div className="form-group row">
        <div className="col-md-6">
          <input
            type="submit"
            name="update"
            defaultValue="Save"
            className="btn btn-success"
          />

          <button className="btn btn-default" type="reset">
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};
