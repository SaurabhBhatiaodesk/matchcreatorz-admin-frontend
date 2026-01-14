import { FC, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ROUTE_PATHS } from "../../../routes/routePaths";
import { BreadCrumb, ErrorMessage } from "../../../components";
import { Config } from "../../../config/AppConfig";
import { UploadMediaToS3 } from "../../../services/upload/UploadFileToS3";
import * as FA6Icon from "react-icons/fa6";
import { DefaultUser } from "../../../constant";
import {
  useCountriesList,
  useUploadUtiliy,
} from "../../../store/common/commenServices";

import { useSellersAddEdit } from "../../../store/users/usersServices";

import EditTabs from "./EditTabPage";
import PortFolioAddPage from "./PortFolioPage";
import OtherDetailsComponent from "./OtherDetails";
import FaqAddPage from "./FaqAddPage";

const SellerAddEdit: FC = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const sellersAddEdit = useSellersAddEdit();

  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("seller");

  const uploadUtility = useUploadUtiliy();

  const [coverIcon, setCoverIcon] = useState(state?.info?.obj.banner);

  const [avatarIcon, setAvatarIcon] = useState(state?.info?.obj.avatar);

  const [countries, setCountries] = useState([]);

  const countryList = useCountriesList();
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    state?.info?.obj?.countryCode || ""
  );



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
    formState: { errors, touchedFields },
    getValues,
    setValue,
  } = useForm({
    mode: "all",
  });

  const handleSellerFormSubmit = () => {
    setIsSubmitting(true);
    if (state?.isEdit) {
      sellersAddEdit
        .mutateAsync({
          userId: state?.info?.id,
          id: state?.info?.id,
          avatar: getValues().profile_image ?? state?.info?.obj?.avatar,
          banner: getValues().cover_image ?? state?.info?.obj?.cover,
          fullName: getValues().fullName ?? state?.info?.obj?.fullName,
          countryCode: getValues().countryCode ?? state?.info?.obj?.countryCode,
          formattedPhone:
            getValues().countryCode && getValues().phone
              ? getValues().countryCode + getValues().phone
              : state?.info?.obj?.countryCode + state?.info?.obj?.phone,
          phone: getValues().phone ?? state?.info?.obj?.phone,
          email: getValues().email ?? state?.info?.obj?.email,
          bio: getValues().bio ?? state?.info?.obj?.bio,
          gender: getValues().gender ?? state?.info?.obj?.gender,
          zipcode: getValues().zipcode ?? state?.info?.obj?.zipcode,
          city: getValues().city ?? state?.info?.obj?.city,
          countryId: getValues().countryId ?? state?.info?.obj?.countryId,
          password: getValues().password,
        })
        .then((res) => {
          const { success, message } = res;
          if (success) {
            toast.success(message);
            setTimeout(() => {
              navigate(-1);
            }, 1500);
          } else {
            if (message) {
              toast.error(message);
            }
          }
        });
    } else {
      sellersAddEdit
        .mutateAsync({
          fullName: getValues().fullName,
          countryCode: selectedCountryCode,
          formattedPhone: selectedCountryCode + getValues().phone,
          phone: getValues().phone,
          email: getValues().email,
          bio: getValues().bio,
          gender: getValues().gender,
          country: getValues().country,
          countryId: getValues().countryId,
          city: getValues().city,
          zipcode: getValues().zipcode,
          password: getValues().password,
          avatar: getValues().profile_image,
          banner: getValues().cover_image,
        })
        .then((res) => {
          const { success, message } = res;

          if (success) {
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
    }
  };

  const handleCountryChange = (e: any) => {
    const selectedCountry: any = countries.find(
      (country: any) => country.code === e.target.value
    );
    setSelectedCountryCode(selectedCountry ? selectedCountry.code : "");
  };

  let onMediaUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    p0?: string
  ) => {
    const mediaFiles: any = event.target.files?.[0];
    setIsLoading(true);

    try {
      if (mediaFiles) {
        if (!isValidFileType(mediaFiles) || !isValidFileSize(mediaFiles)) {
          return;
        }
        uploadUtility
          .mutateAsync({
            count: 1,
            type: "png",
            location: p0 ?? "users",
            // extension: mediaFiles.name.split(".").pop(),
          })
          .then((res: any) => {
            const { success, data } = res;
            if (success) {
              let media = {
                mediaFile: mediaFiles,
                mediaType: mediaFiles.type,
                url: data?.[0]?.url,
              };
              UploadMediaToS3(media).then((res: any) => {
                if (res.status === 200) {
                  if (p0 === "avatar") {
                    setAvatarIcon(data?.[0]?.filename);
                    setValue("profile_image", data?.[0]?.filename);
                  } else if (p0 === "cover") {
                    setCoverIcon(data?.[0]?.filename);
                    setValue("cover_image", data?.[0]?.filename);
                  }
                }
              });
            }
          })
          .catch((e: any) => {
            console.error("upload url exception", e);
          });
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const isValidFileType = (file: File) => {
    if (file.type.startsWith("image/")) {
      return true;
    } else {
      toast.error("Please upload a valid image");
      return false;
    }
  };

  const isValidFileSize = (file: File) => {
    const maxSize = 10 * 1024 * 1024; // 5MB
    if (file.size <= maxSize) {
      return true;
    } else {
      toast.error("Image size should be less then 5 MB.");
      return false;
    }
  };

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">
                {state?.isEdit ? "Edit" : "Add"} Seller
              </div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  {
                    name: "Seller",
                    path: ROUTE_PATHS.SELLERS_LIST,
                  },
                  {
                    name: state?.isEdit ? "Edit" : "Add",
                    path: "",
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="d-flex-block">
          {/* Tabs Navigation */}
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "seller" ? "active" : ""}`}
                onClick={() => setActiveTab("seller")}
              >
                Seller
              </button>
            </li>
            {state?.isEdit && (
              <>
                <EditTabs
                  isEdit={state?.isEdit}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </>
            )}
          </ul>
          <div className="">
            {activeTab === "seller" && (
              <form
                name="countryAddEdit"
                id="countryAddEdit"
                onSubmit={handleSubmit(handleSellerFormSubmit)}
              >
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12">
                        <h6 className="title mb-3 mt-2"></h6>
                      </div>

                      <div className="col-md-6">
                        <div className="row align-items-center mb-3">
                          <label
                            htmlFor="profile_image"
                            className="col-sm-4 col-form-label fw-semibold"
                          >
                            Avatar :-
                          </label>
                          <div className="col-sm-6">
                            <div className="d-flex">
                              <Link
                                to="javascript:void(0);"
                                className="camera profile-image"
                              >
                                <input
                                  type="file"
                                  className="profile-image-hide"
                                  id="profile-image"
                                  name="profile_image"
                                  accept="image/jpeg, image/png"
                                  multiple={false}
                                  onChange={(event) =>
                                    onMediaUpload(event, "avatar")
                                  }
                                />
                                <FA6Icon.FaUpload />
                              </Link>
                              <div
                                className="d-block border rounded-1 p-1"
                                style={{ width: "120px", height: "120px" }}
                              >
                                <img
                                  id="desktopImage"
                                  src={
                                    avatarIcon
                                      ? Config.mediaUrl(avatarIcon)
                                      : DefaultUser
                                  }
                                  className="rounded-1"
                                  width="100%"
                                  height="100%"
                                />
                              </div>
                            </div>
                            <ErrorMessage
                              touched={touchedFields.icon}
                              name="profile_image"
                              error={errors.icon?.message}
                            />
                          </div>
                        </div>

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
                              className="form-control bg-light border border-1 rounded-2"
                              defaultValue={state?.info?.obj?.fullName || ""}
                              {...register("fullName", {
                                required: "Full Name is required",
                                validate: {
                                  wordLimit: (value) =>
                                    value.trim().split(/\s+/).length <= 3 ||
                                    "Full Name must be 3 words or fewer",
                                },
                                maxLength: {
                                  value: 20,
                                  message:
                                    "Full Name cannot exceed 20 characters",
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
                              value={selectedCountryCode} // Set the currently selected country code
                              onChange={(e) => {
                                handleCountryChange(e); // Handle the change event
                                setSelectedCountryCode(e.target.value); // Update the selected country code state
                              }}
                            >
                              <option value="" disabled>
                                Select Country Code
                              </option>
                              {countries.map((country: any) => (
                                <option key={country.code} value={country.code}>
                                  {country.code}
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
                              defaultValue={state?.info?.obj?.phone || ""}
                              {...register("phone", {
                                required: "Mobile No. is required",
                                pattern: {
                                  value: /^[0-9]+$/,
                                  message:
                                    "Mobile No. must contain only numbers",
                                },
                                maxLength: {
                                  value: 12,
                                  message:
                                    "Mobile No. cannot exceed 12 characters",
                                },
                                minLength: {
                                  value: 10,
                                  message:
                                    "Mobile No. must be at least 10 characters",
                                },
                              })}
                              onInput={(e: any) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                              }}
                            />
                            {/* Show error message */}
                            {errors.phone && (
                              <p className="text-danger">
                                {errors.phone.message}
                              </p>
                            )}
                          </div>
                        </div>

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
                              defaultValue={state?.info?.obj?.email || ""}
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
                              <p className="text-danger">
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                        </div>

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
                              defaultValue={state?.info?.obj?.bio || ""}
                              {...register("bio", {
                                required: "Bio is required",
                                maxLength: {
                                  value: 50,
                                  message: "Bio cannot exceed 50 characters",
                                },
                              })}
                            />
                            {errors.bio && (
                              <p className="text-danger">
                                {errors.bio.message}
                              </p>
                            )}
                          </div>
                        </div>

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
                              defaultValue={state?.info?.obj?.gender || ""}
                              {...register("gender", {
                                required: "Gender is required",
                              })}
                            >
                              <option value="" disabled>
                                Select Gender
                              </option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                            {errors.gender && (
                              <p className="text-danger">
                                {errors.gender.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="row align-items-center mb-3">
                          <label
                            htmlFor="cover_image"
                            className="col-sm-4 col-form-label fw-semibold"
                          >
                            Cover Image :-
                          </label>
                          <div className="col-sm-6">
                            <div className="d-flex">
                              <Link
                                to="javascript:void(0);"
                                className="camera profile-image"
                              >
                                <input
                                  type="file"
                                  className="profile-image-hide"
                                  id="cover-image"
                                  name="cover_image"
                                  accept="image/jpeg, image/png"
                                  multiple={false}
                                  onChange={(event) =>
                                    onMediaUpload(event, "cover")
                                  }
                                />
                                <FA6Icon.FaUpload />
                              </Link>

                              <div
                                className="d-block border rounded-1 p-1"
                                style={{ width: "120px", height: "120px" }}
                              >
                                <img
                                  id="desktopImage"
                                  src={
                                    coverIcon
                                      ? Config.mediaUrl(coverIcon)
                                      : DefaultUser
                                  }
                                  className="rounded-1"
                                  width="100%"
                                  height="100%"
                                />
                              </div>
                            </div>

                            <ErrorMessage
                              touched={touchedFields.icon}
                              error={errors.icon?.message}
                              name="cover_image"
                            />
                          </div>
                        </div>

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
                                  selected={country?.id === state?.info?.obj?.countryId}
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
                              defaultValue={state?.info?.obj?.city || ""}
                              {...register("city", {
                                required: "City is required",
                                maxLength: {
                                  value: 20,
                                  message: "City cannot exceed 20 characters",
                                },
                              })}
                            />
                            {errors.city && (
                              <p className="text-danger">
                                {errors.city.message}
                              </p>
                            )}
                          </div>
                        </div>

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
                              defaultValue={state?.info?.obj?.zipcode || ""}
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
                                minLength: {
                                  value: 5,
                                  message:
                                    "Zipcode must be at least 5 characters",
                                },
                              })}
                              onInput={(e: any) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                              }}
                            />
                            {/* Show error message */}
                            {errors.zipcode && (
                              <p className="text-danger">
                                {errors.zipcode.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <>
                          {!state?.isEdit && (
                            <>
                              {/* Password Field */}
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
                                    defaultValue={
                                      state?.info?.obj?.password || ""
                                    }
                                    {...register("password", {
                                      required: "Password is required",
                                    })}
                                  />
                                  {errors.password && (
                                    <p className="text-danger">
                                      {errors.password.message}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Confirm Password Field */}
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
                                    className="form-control bg-light border border-1 rounded-2"
                                    defaultValue={
                                      state?.info?.obj?.confirmPassword || ""
                                    }
                                    {...register("confirmPassword", {
                                      required: "Confirm Password is required",
                                    })}
                                  />
                                  {errors.confirmPassword && (
                                    <p className="text-danger">
                                      {errors.confirmPassword.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      </div>

                      {/* Loader for image uploading */}
                      {isLoading && (
                        <div
                          className="loader"
                          style={{ textAlign: "center", margin: "20px 0" }}
                        >
                          <span>Loading...</span>{" "}
                          {/* Replace this with a spinner or loading component */}
                        </div>
                      )}

                      <div className="col mt-4">
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
                  </div>
                </div>
              </form>
            )}

            {activeTab === "seller-other-details" && (
              <OtherDetailsComponent data={state?.info} />
            )}

            {activeTab === "portfolio" && (
              <PortFolioAddPage data={state?.info?.id} />
            )}

            {activeTab === "faq" && (
              <>
                <FaqAddPage data={state?.info?.id} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerAddEdit;
