import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ErrorMessage } from "../../../components";
import { Config } from "../../../config/AppConfig";
import { UploadMediaToS3 } from "../../../services/upload/UploadFileToS3";
import * as FA6Icon from "react-icons/fa6";
import { DefaultUser } from "../../../constant";

import { useUploadUtiliy } from "../../../store/common/commenServices";

import { usePortfolioAddEdit } from "../../../store/users/usersServices";
import PortfolioListComponent from "./PortfolioList";

interface PortFolioProps {
  data: any | undefined;
}
const PortFolioAddPage: React.FC<PortFolioProps> = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const portfolioAddEdit = usePortfolioAddEdit();

  const uploadUtility = useUploadUtiliy();

  const [portfolioIcon, setPortfolioIcon] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    getValues,
    setValue,
  } = useForm({
    mode: "all",
  });

  const handlePortfolioSubmit = () => {
    if (state?.isEdit) {
      portfolioAddEdit
        .mutateAsync({
          userId: state?.info?.id,
          title: getValues().title,
          image: getValues().portfolio_image,
        })
        .then((res) => {
          const { success, message } = res;
          if (success) {
            toast.success(message);
            setTimeout(() => {
              navigate(0);
            }, 1500);
          } else {
            if (message) {
              toast.error(message);
            }
          }
        });
    } else {
      portfolioAddEdit
        .mutateAsync({
          title: getValues().title,
          image: getValues().image,
        })
        .then((res) => {
          const { success, message } = res;
          if (success) {
            toast.success(message);
            setTimeout(() => {
              navigate(0);
            }, 1500);
          } else {
            if (message) {
              toast.error(message);
            }
          }
        });
    }
  };

  let onMediaUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    p0?: string
  ) => {
    const mediaFiles: any = event.target.files?.[0];

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
                  //setAvatarIcon(data?.[0]?.filename);
                  setValue("profile_image", data?.[0]?.filename);
                } else if (p0 === "cover") {
                  //setCoverIcon(data?.[0]?.filename);
                  setValue("cover_image", data?.[0]?.filename);
                } else if (p0 === "portfolio") {
                  setPortfolioIcon(data?.[0]?.filename);
                  setValue("portfolio_image", data?.[0]?.filename);
                }
              }
            });
          }
        })
        .catch((e: any) => {
          console.error("upload url exception", e);
        });
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
    <div className="card">
      <div className="card-body">
        <form
          name="portfolioAddEdit"
          id="portfolioAddEdit"
          onSubmit={handleSubmit(handlePortfolioSubmit)}
        >
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <label
                    htmlFor="portfolio_image"
                    className="col-sm-4 col-form-label fw-semibold"
                  >
                    Image :-
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
                          id="portfolio_image"
                          accept="image/jpeg, image/png"
                          multiple={false}
                          onChange={(event) =>
                            onMediaUpload(event, "portfolio")
                          }
                        />
                        <FA6Icon.FaUpload />
                      </Link>
                      <div
                        className="d-block border rounded-1 p-1"
                        style={{
                          width: "120px",
                          height: "120px",
                        }}
                      >
                        <img
                          id="desktopImage"
                          src={
                            portfolioIcon
                              ? Config.mediaUrl(portfolioIcon)
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
                      name="portfolio"
                      error={errors.icon?.message}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <label
                    htmlFor="title"
                    className="col-sm-4 col-form-label fw-semibold"
                  >
                    Title :-
                  </label>
                  <div className="col-sm-6">
                    <input
                      id="title"
                      type="text"
                      className="form-control bg-light border border-1 rounded-2"
                      {...register("title", {
                        required: "Title is required",
                        maxLength: {
                          value: 15,
                          message: "Title cannot exceed 15 characters",
                        },
                      })}
                    />
                    {/* Display error message for title field */}
                    <ErrorMessage
                      touched={touchedFields.title}
                      error={errors.title?.message}
                      name=""
                    />
                  </div>
                </div>
              </div>

              <div className="col mt-4">
                <span
                  className="submit-btn"
                  style={{ display: "inline-block", float: "right" }}
                >
                  <button type="submit" className="btn btn-info">
                    Submit
                  </button>
                </span>
              </div>
            </div>
          </div>
        </form>

        <PortfolioListComponent id={state?.info?.id} />
      </div>
    </div>
  );
};

export default PortFolioAddPage;
