import { FC, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ROUTE_PATHS } from "../../../routes/routePaths";
import { BreadCrumb, Loader } from "../../../components";
import { Config } from "../../../config/AppConfig";
import { UploadMediaToS3 } from "../../../services/upload/UploadFileToS3";
import * as FA6Icon from "react-icons/fa6";
import { DefaultUser } from "../../../constant";

import {
  useUploadUtiliy,
  useTestimonialAdd,
} from "../../../store/common/commenServices";

const TestimonialAddEdit: FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const testimoniaAddEdit = useTestimonialAdd();
  const uploadUtility = useUploadUtiliy();

  const [avatarIcon, setAvatarIcon] = useState(state?.info?.obj.avatar);
  const [isUploading, setIsUploading] = useState(false); // State for upload loading

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    mode: "all",
  });

  const handleTestmonialFormSubmit = () => {
    testimoniaAddEdit
      .mutateAsync({
        name: getValues().name,
        designation: getValues().designation,
        totalRating: getValues().totalRating,
        comment: getValues().comment,
        avatar: getValues().avatar,
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
  };

  let onMediaUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    p0?: string
  ) => {
    const mediaFiles: any = event.target.files?.[0];

    if (mediaFiles) {
      if (!isValidFileType(mediaFiles) || !isValidFileSize(mediaFiles)) {
        return;
      }

      setIsUploading(true); // Set loading to true

      try {
        const uploadRes = await uploadUtility.mutateAsync({
          count: 1,
          type: "png",
          location: p0 ?? "users",
        });

        const { success, data } = uploadRes;
        if (success) {
          let media = {
            mediaFile: mediaFiles,
            mediaType: mediaFiles.type,
            url: data?.[0]?.url,
          };
          const mediaUploadRes: any = await UploadMediaToS3(media);

          if (mediaUploadRes.status === 200) {
            if (p0 === "avatar") {
              setAvatarIcon(data?.[0]?.filename);
              setValue("avatar", data?.[0]?.filename);
            }
          }
        }
      } catch (e) {
        console.error("", e);
      } finally {
        setIsUploading(false); // Set loading to false
      }
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
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size <= maxSize) {
      return true;
    } else {
      toast.error("Image size should be less than 10 MB.");
      return false;
    }
  };

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Add Testimonial</div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  {
                    name: "Testimonial",
                    path: ROUTE_PATHS.TESTIMONIAL_LIST,
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
          <div className="">
            <form
              name="testimonialAddEdit"
              id="testimonialAddEdit"
              onSubmit={handleSubmit(handleTestmonialFormSubmit)}
            >
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Avatar Upload */}
                      <div className="row align-items-center mb-3">
                        <label
                          htmlFor="avatar"
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
                                name="avatar"
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
                                id="avatarIcon"
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
                          {/* Validation message for avatar (optional if needed) */}
                        </div>
                      </div>

                      {/* Full Name */}
                      <div className="row align-items-center mb-3">
                        <label
                          htmlFor="name"
                          className="col-sm-4 col-form-label fw-semibold"
                        >
                          Full Name :-
                        </label>
                        <div className="col-sm-6">
                          <input
                            id="name"
                            type="text"
                            className="form-control bg-light border border-1 rounded-2"
                            defaultValue={state?.info?.obj?.name || ""}
                            {...register("name", {
                              required: "Full Name is required",
                              maxLength: {
                                value: 20,
                                message:
                                  "Full Name cannot exceed 20 characters",
                              },
                            })}
                          />
                          {errors.name && (
                            <p className="text-danger">{errors.name.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Designation */}
                      <div className="row align-items-center mb-3">
                        <label
                          htmlFor="designation"
                          className="col-sm-4 col-form-label fw-semibold"
                        >
                          Designation :-
                        </label>
                        <div className="col-sm-6">
                          <input
                            id="designation"
                            type="text"
                            className="form-control bg-light border border-1 rounded-2"
                            defaultValue={state?.info?.obj?.designation || ""}
                            {...register("designation", {
                              required: "Designation is required",
                              maxLength: {
                                value: 20,
                                message:
                                  "Designation cannot exceed 20 characters",
                              },
                            })}
                          />
                          {errors.designation && (
                            <p className="text-danger">
                              {errors.designation.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Total Rating */}
                      <div className="row align-items-center mb-3">
                        <label
                          htmlFor="totalRating"
                          className="col-sm-4 col-form-label fw-semibold"
                        >
                          Total Rating :-
                        </label>
                        <div className="col-sm-6">
                          <select
                            id="totalRating"
                            className="form-control bg-light border border-1 rounded-2"
                            defaultValue={state?.info?.obj?.totalRating || ""}
                            {...register("totalRating", {
                              required: "Rating is required",
                            })}
                          >
                            <option value="">Select Rating</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                          {errors.totalRating && (
                            <p className="text-danger">
                              {errors.totalRating.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="row align-items-center mb-3">
                        <label
                          htmlFor="comment"
                          className="col-sm-4 col-form-label fw-semibold"
                        >
                          Description :-
                        </label>
                        <div className="col-sm-6">
                          <textarea
                            id="comment"
                            className="form-control bg-light border border-1 rounded-2"
                            defaultValue={state?.info?.obj?.comment || ""}
                            {...register("comment", {
                              required: "Description is required",
                              maxLength: {
                                value: 300,
                                message:
                                  "Description cannot exceed 300 characters",
                              },
                            })}
                            rows={4}
                          />
                          {errors.comment && (
                            <p className="text-danger">
                              {errors.comment.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col mt-4">
                      <span
                        className="submit-btn"
                        style={{ display: "inline-block", float: "right" }}
                      >
                        {isUploading ? (
                          <Loader />
                        ) : (
                          <button
                            type="submit"
                            className="btn btn-info"
                            disabled={isUploading} // Disable button if uploading
                          >
                            Submit
                          </button>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialAddEdit;
