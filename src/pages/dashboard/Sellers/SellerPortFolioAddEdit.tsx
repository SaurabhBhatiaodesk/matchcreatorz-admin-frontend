import { FC, useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate, 
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ROUTE_PATHS } from "../../../routes/routePaths";
import { BreadCrumb  } from "../../../components";
import { UploadMediaToS3 } from "../../../services/upload/UploadFileToS3";
import * as FA6Icon from "react-icons/fa6";
import { DefaultUser } from "../../../constant";
import {
  useUploadUtiliy,
} from "../../../store/common/commenServices";

import {
  useFAQAddEdit,
  usePortfolioAddEdit,
  useFAQList,
} from "../../../store/users/usersServices";
import { Config } from "../../../config/AppConfig";

const AddEdit: FC = () => {
  const { state } = useLocation();

 

  const navigate = useNavigate();
  
  const faqGetData = useFAQList();
  const [faqData, setFaqData] = useState([]);
  const faqAddEdit = useFAQAddEdit();
  const portfolioAddEdit = usePortfolioAddEdit();

  const uploadUtility = useUploadUtiliy();

  const [activeTab, setActiveTab] = useState(state.info.obj.page);

  const [portfolioIcon, setPortfolioIcon] = useState(state.info.obj.image);

  useEffect(() => {
    faqGetData
      .mutateAsync({
        id: state?.info?.id,
      })
      .then((res) => {
        setFaqData(res.data.faq);
      })
      .catch((err) => {
        console.error("", err);
      });
  }, []);

  const {
    register,
    handleSubmit,
   /*  formState: { errors  }, */
    getValues,
    setValue,
  } = useForm({
    mode: "all",
  });


  const handleFaqSubmit = () => {
    faqAddEdit
      .mutateAsync({
        id: state?.info?.id,
        userId: state?.info?.obj?.userId,
        question: getValues().question,
        answer: getValues().answer,
      })
      .then((res) => {
        const { success, message } = res;
        if (success) {
          toast.success(message);
          navigate(0);
        } else {
          if (message) {
            toast.error(message);
          }
        }
      });
  }; //working

  const handlePortfolioSubmit = () => {
    if (state?.isEdit) {
      portfolioAddEdit
        .mutateAsync({
          id: state?.info?.id,
          userId: state?.info?.obj?.userId,
          title: getValues().title,
          image: getValues().portfolio_image,
        })
        .then((res) => {
          const { success, message } = res;
          if (success) {
            toast.success(message);
            navigate(0);
          } else {
            if (message) {
              toast.error(message);
            }
          }
        });
    } else {
      portfolioAddEdit
        .mutateAsync({
          id: state?.info?.id,
          userId: state?.info?.obj?.userId,
          title: getValues().title,
          image: getValues().image,
        })
        .then((res) => {
          const { success, message } = res;
          if (success) {
            toast.success(message);
            navigate(0);
          } else {
            if (message) {
              toast.error(message);
            }
          }
        });
    }
  };

  let onMediaUpload = (event: React.ChangeEvent<HTMLInputElement>, p0?: string) => {
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
                if(p0 === 'avatar'){
                  setAvatarIcon(data?.[0]?.filename); 
                  setValue("profile_image", data?.[0]?.filename); 
                }else if(p0 === 'cover'){
                  setCoverIcon(data?.[0]?.filename);  
                  setValue("cover_image", data?.[0]?.filename); 
                }else if(p0 === 'portfolio'){
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
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">
                {state?.isEdit ? "Edit" : "Add"}
              </div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  {
                    name: "Seller",
                    path: ROUTE_PATHS.SELLERS_LIST,
                  },
                  {
                    name: "Portfolio",
                    path: ROUTE_PATHS.SELLERS_PROFILE +'/'+ state?.info?.id,
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
            </li>
          </ul>
          <div className="">
             {activeTab === "portfolio" && (
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
                                    onChange={(event) => onMediaUpload(event, 'portfolio')}

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
                             {/*  <ErrorMessage
                                errors={errors}
                                name="portfolio_image"
                                render={(message : any) => (
                                  <p className="text-danger">{message}</p>
                                )}
                              /> */}
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
                                id="id"
                                type="hidden"
                                defaultValue={state.info.id}
                              />
                              <input
                                id="title"
                                type="text"
                                className="form-control bg-light border border-1 rounded-2"
                                defaultValue={state.info.obj.title}
                                {...register("title", {
                                  required: "Title is required",
                                })}
                              />
                             {/*  <ErrorMessage
                                errors={errors}
                                name="title"
                                render={(message : any) => (
                                  <p className="text-danger">{message}</p>
                                )}
                              /> */}
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
                </div>
              </div>
            )}

            {activeTab === "faq" && (
              <>
                <form
                  name="faqAddEdit"
                  id="faqAddEdit"
                  onSubmit={handleSubmit(handleFaqSubmit)}
                >
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row align-items-center mb-3">
                          <label
                            htmlFor="question"
                            className="col-sm-4 col-form-label fw-semibold"
                          >
                            Question :-
                          </label>
                          <div className="col-sm-6">
                            <input
                              id="question"
                              type="text"
                              className="form-control bg-light border border-1 rounded-2"
                              defaultValue={state.info.obj.question}
                              {...register("question", {
                                required: "Question is required",
                              })}
                            />
                            {/* {errors.zipcode && (
                              <p className="text-danger">
                                {errors?.zipcode?.message}
                              </p>
                            )} */}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row align-items-center mb-3">
                          <label
                            htmlFor="answer"
                            className="col-sm-4 col-form-label fw-semibold"
                          >
                            Answer :-
                          </label>
                          <div className="col-sm-6">
                            <input
                              id="answer"
                              type="text"
                              className="form-control bg-light border border-1 rounded-2"
                              defaultValue={state.info.obj.answer}
                              {...register("answer", {
                                required: "Answer is required",
                              })}
                            />
                            {/* {errors?.zipcode && (
                              <p className="text-danger">
                                {errors?.answer}
                              </p>
                            )} */}
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
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddEdit;
function setCoverIcon(_filename: any) {
  throw new Error("Function not implemented.");
}

function setAvatarIcon(_filename: any) {
  throw new Error("Function not implemented.");
}

