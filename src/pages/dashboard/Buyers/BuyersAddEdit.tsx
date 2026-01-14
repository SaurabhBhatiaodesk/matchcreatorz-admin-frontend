import { FC, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ROUTE_PATHS } from "../../../routes/routePaths";
import { BreadCrumb } from "../../../components";

import { useCountriesList } from "../../../store/common/commenServices";

import { useBuyersAddEdit } from "../../../store/users/usersServices";

const BuyerAddEdit: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const buyersAddEdit = useBuyersAddEdit();
  const [countries, setCountries] = useState([]);
  const countryList = useCountriesList();
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    countryList
      .mutateAsync()
      .then((res) => {
        setCountries(res.data.country);
      })
      .catch((err) => {
        console.error("Exception while getting country list", err);
      });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm({
    mode: "all",
  });

  const handleBuyerCreateSubmit = () => {
    setIsSubmitting(false);
    try {
      buyersAddEdit
        .mutateAsync({
          fullName: getValues().fullName,
          countryId: getValues().countryId,
          countryCode: selectedCountryCode,
          formattedPhone: selectedCountryCode + getValues().phone,
          phone: getValues().phone,
          email: getValues().email,
          bio: getValues().bio,
          gender: getValues().gender,
          country: getValues().country,
          city: getValues().city,
          zipcode: getValues().zipcode,
          address: getValues().address,
          password: getValues().password,
        })
        .then((res) => {
          const { success, message } = res;
          if (success) {
            setIsSubmitting(true);
            toast.success(message);
            setTimeout(() => {
              navigate(-1);
            }, 1500);
          } else {
            if (message) {
              toast.error(message);
            }
            setIsSubmitting(false); // Re-enable button if submission fails
          }
        });
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error during submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCountryChange = (e: any) => {
    const selectedCountry: any = countries.find(
      (country: any) => country.code === e.target.value
    );
    setSelectedCountryCode(selectedCountry ? selectedCountry.code : "");
  };

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Add Buyer</div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  {
                    name: "Buyer",
                    path: ROUTE_PATHS.BUYERS_LIST,
                  },
                  {
                    name: "Add",
                    path: "",
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="d-flex-block">
          <form
            name="countryAddEdit"
            id="countryAddEdit"
            onSubmit={handleSubmit(handleBuyerCreateSubmit)}
          >
            <div className="row mt-2">
              <div className="col-12">
                <h6 className="title mb-3">Buyer Add</h6>
              </div>

              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    {/* Full Name */}
                    <div className="row align-items-center mb-3">
                      <label
                        htmlFor="fullName"
                        className="col-sm-4 col-form-label fw-semibold"
                      >
                        Full Name :-
                      </label>
                      <div className="col-sm-6">
                        <input
                          id="fullName"
                          type="text"
                          defaultValue={searchParams.get("fullName") || ""}
                          className="form-control bg-light border border-1 rounded-2"
                          {...register("fullName", {
                            required: "Full Name is required",
                            validate: {
                              wordLimit: (value) =>
                                value.trim().split(/\s+/).length <= 3 ||
                                "Full Name must be 3 words or fewer",
                            },
                            maxLength: {
                              value: 20,
                              message: "Full Name cannot exceed 20 characters",
                            },
                          })}
                        />
                        {errors.fullName && (
                          <p className="text-danger">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Country Code */}
                    <div className="row align-items-center mb-3">
                      <label
                        htmlFor="countryCode"
                        className="col-sm-4 col-form-label fw-semibold"
                      >
                        Country Code :-
                      </label>
                      <div className="col-sm-6">
                        <select
                          id="countryCode"
                          className="form-control bg-light border border-1 rounded-2"
                          {...register("countryCode", {
                            required: "Country Code is required",
                          })}
                          onChange={handleCountryChange}
                        >
                          {countries.map((country: any, index: any) => (
                            <option
                              key={country.code}
                              value={country.code}
                              selected={index === 0}
                              disabled={index === 0}
                            >
                              {index === 0
                                ? "Select Country Code"
                                : country.code}
                            </option>
                          ))}
                        </select>
                        {errors.countryCode && (
                          <p className="text-danger">
                            {errors.countryCode.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Mobile No. */}
                    <div className="row align-items-center mb-3">
                      <label
                        htmlFor="phone"
                        className="col-sm-4 col-form-label fw-semibold"
                      >
                        Mobile No. :-
                      </label>
                      <div className="col-sm-6">
                        <input
                          id="phone"
                          type="text"
                          className="form-control bg-light border border-1 rounded-2"
                          {...register("phone", {
                            required: "Mobile No. is required",
                            maxLength: {
                              value: 12,
                              message: "Mobile No. cannot exceed 12 characters",
                            },
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "Mobile No. must contain only numbers",
                            },
                          })}
                        />
                        {errors.phone && (
                          <p className="text-danger">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="row align-items-center mb-3">
                      <label
                        htmlFor="email"
                        className="col-sm-4 col-form-label fw-semibold"
                      >
                        Email :-
                      </label>
                      <div className="col-sm-6">
                        <input
                          id="email"
                          type="text"
                          className="form-control bg-light border border-1 rounded-2"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value:
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                              message: "Enter a valid email address",
                            },
                          })}
                        />
                        {errors.email && (
                          <p className="text-danger">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="row align-items-center mb-3">
                      <label
                        htmlFor="bio"
                        className="col-sm-4 col-form-label fw-semibold"
                      >
                        Bio :-
                      </label>
                      <div className="col-sm-6">
                        <input
                          id="bio"
                          type="text"
                          className="form-control bg-light border border-1 rounded-2"
                          {...register("bio", {
                            required: "Bio is required",
                            maxLength: {
                              value: 50,
                              message: "Bio cannot exceed 50 characters",
                            },
                          })}
                        />
                        {errors.bio && (
                          <p className="text-danger">{errors.bio.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="row align-items-center mb-3">
                      <label
                        htmlFor="gender"
                        className="col-sm-4 col-form-label fw-semibold"
                      >
                        Gender :-
                      </label>
                      <div className="col-sm-6">
                        <select
                          id="gender"
                          className="form-control bg-light border border-1 rounded-2"
                          {...register("gender", {
                            required: "Gender is required",
                          })}
                        >
                          <option value="" selected disabled>
                            Select Gender
                          </option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.gender && (
                          <p className="text-danger">{errors.gender.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    {/* Country */}
                    <div className="row align-items-center mb-3">
                      <label
                        htmlFor="countryId"
                        className="col-sm-4 col-form-label fw-semibold"
                      >
                        Country :-
                      </label>
                      <div className="col-sm-6">
                        <select
                          id="countryId"
                          className="form-control bg-light border border-1 rounded-2"
                          {...register("countryId", {
                            required: "Country is required",
                          })}
                        >
                          {countries.map((country: any, index: any) => (
                            <option
                              key={country?.id}
                              value={country?.id}
                              selected={index === 0}
                              disabled={index === 0}
                            >
                              {index === 0
                                ? "Select Country"
                                : country?.countryName}
                            </option>
                          ))}
                        </select>
                        {errors.countryId && (
                          <p className="text-danger">
                            {errors.countryId.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* City */}
                    <div className="row align-items-center mb-3">
                      <label
                        htmlFor="city"
                        className="col-sm-4 col-form-label fw-semibold"
                      >
                        City :-
                      </label>
                      <div className="col-sm-6">
                        <input
                          id="city"
                          type="text"
                          className="form-control bg-light border border-1 rounded-2"
                          {...register("city", {
                            required: "City is required",
                            maxLength: {
                              value: 20,
                              message: "City cannot exceed 20 characters",
                            },
                          })}
                        />
                        {errors.city && (
                          <p className="text-danger">{errors.city.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Zipcode */}
                    <div className="row align-items-center mb-3">
                      <label
                        htmlFor="zipcode"
                        className="col-sm-4 col-form-label fw-semibold"
                      >
                        Zipcode :-
                      </label>
                      <div className="col-sm-6">
                        <input
                          id="zipcode"
                          type="text"
                          className="form-control bg-light border border-1 rounded-2"
                          {...register("zipcode", {
                            required: "Zipcode is required",
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "Zipcode must contain only numbers",
                            },
                            maxLength: {
                              value: 8,
                              message: "Zipcode cannot exceed 8 characters",
                            },
                          })}
                        />
                        {errors.zipcode && (
                          <p className="text-danger">
                            {errors.zipcode.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Password */}
                    <div className="row align-items-center mb-3">
                      <label
                        htmlFor="password"
                        className="col-sm-4 col-form-label fw-semibold"
                      >
                        Password :-
                      </label>
                      <div className="col-sm-6">
                        <input
                          id="password"
                          type="password"
                          className="form-control bg-light border border-1 rounded-2"
                          {...register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 8,
                              message: "Password must be at least 8 characters",
                            },
                          })}
                        />
                        {errors.password && (
                          <p className="text-danger">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="row align-items-center mb-3">
                      <label
                        htmlFor="confirmPassword"
                        className="col-sm-4 col-form-label fw-semibold"
                      >
                        Confirm Password :-
                      </label>
                      <div className="col-sm-6">
                        <input
                          id="confirmPassword"
                          type="password"
                          defaultValue={
                            searchParams.get("confirmPassword") || ""
                          }
                          className="form-control bg-light border border-1 rounded-2"
                          {...register("confirmPassword", {
                            required: "Confirm Password is required",
                            validate: (value) =>
                              value === watch("password") ||
                              "Passwords do not match",
                          })}
                        />
                        {errors.confirmPassword && (
                          <p className="text-danger">
                            {errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 mt-4">
                <span
                  className="submit-btn"
                  style={{ display: "inline-block", float: "right" }}
                >
                  <button
                    type="submit"
                    className="btn btn-info px-5 d-flex justify-content-center align-items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting" : "Submit"}
                  </button>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BuyerAddEdit;
