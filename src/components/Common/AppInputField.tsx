import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorMessage } from "./ErrorMessage";


type AppInputFieldProps = {
  id: string;
  type:
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
  label?: string;
  value?: any;
  register?: any;
  placeholder?: string;
  touched?: any;
  error?: string;
  isPassword?: boolean;
  isDisabled?: boolean;
  // onFocus?: () => void;
  // onBlur?: () => void;
};

export const AppInputField: FC<AppInputFieldProps> = (props) => {
  const {
    id,
    type,
    label,
    placeholder,
    touched,
    error,
    isPassword,
    value,
    register,
    isDisabled,
    // onFocus,
    // onBlur,
  } = props;

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  return (
    <div className="input-container">
      {label && (
        <div className="input-label-container">
          <label className="form-label" htmlFor={id}>
            {label}
          </label>
        </div>
      )}
      <div
        className={`form-control d-flex justify-content-between align-items-center bg-light border rounded ${
          touched && error ? "border-danger" : ""
        }`}
        style={{ backgroundColor: error ? "red" : "green", height: "54px" }}
      >
        <input
          id={id}
          type={isPasswordVisible ? "text" : type}
          className="bg-light border-0"
          style={{ width: isPassword ? "95%" : "100%", height: "100%", backgroundColor: "white" }}
          placeholder={placeholder || ""}
          defaultValue=""
          value={value}
          autoComplete={id}
          {...register}
          // onFocus={onFocus}
          // onBlur={onBlur}
          disabled={isDisabled}
        />

        {isPassword && (
          <Link
            to="#"
            className="btn btn-light rounded-0 align-right align-self-right"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <i className="fa fa-eye"></i>
            ) : (
              <i className="fa fa-eye-slash"></i>
            )}
          </Link>
        )}
      </div>
      {touched && error && (
        <div className="">
          <ErrorMessage touched={touched} name={undefined} error={error} />
        </div>
      )}
    </div>
  );
};
