import { FC } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import useValidation from "../../helper/yupValidation";
import { ErrorMessage } from "../Common/ErrorMessage";

type EditProfileProps = {
  userDetails: any;
  onSubmit: (data: any) => void;
};

export const EditProfile: FC<EditProfileProps> = (props) => {
  const { userDetails, onSubmit } = props;

  const { profileValidation } = useValidation();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    // getValues,
  } = useForm({
    mode: "all",
    resolver: yupResolver(profileValidation),
  });

  return (
    <form
      name="updateAdminProfile"
      id="updateAdminProfile"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className=""></div>
      <div className="form-group row">
        <div className="col-md-6">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            {...register("firstName")}
            defaultValue={userDetails?.firstName}
            placeholder="First Name"
            className="form-control"
          />

          <ErrorMessage
            touched={touchedFields.firstName}
            error={errors.firstName?.message}
            name={undefined}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            {...register("lastName")}
            defaultValue={userDetails?.lastName}
            placeholder="Last Name"
            className="form-control"
          />
          <ErrorMessage
            touched={touchedFields.lastName}
            error={errors.lastName?.message}
            name={undefined}
          />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-md-6">
          <label htmlFor="user_email">Email</label>
          <input
            type="email"
            name="user_email"
            defaultValue={userDetails?.email}
            id="user_email"
            placeholder="User Email"
            className="form-control"
            readOnly
          />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-md-12">
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


