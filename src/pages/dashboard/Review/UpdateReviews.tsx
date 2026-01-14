import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ROUTE_PATHS } from "../../../routes/routePaths";
import { BreadCrumb, ErrorMessage } from "../../../components";
import { useReviewUpdate } from "../../../store/common/commenServices";

interface ReviewFormInputs {
  title: string;
}

const ReviewUpdate: FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const reviewUpdate = useReviewUpdate();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    getValues,
  } = useForm<ReviewFormInputs>({
    mode: "all",
    defaultValues: {
      title: state?.info?.obj?.reviewMessage || "",
    }
  });

  const handlReviewSubmit = () => {
    if (state?.isEdit) {
      reviewUpdate
        .mutateAsync({
          id: state?.info?.obj?.id || "",
          reviewMessage: getValues("title"), // Correct usage of getValues for 'title'
        })
        .then((res) => {
          const { success, message } = res;
          if (success) {
            toast.success(message);
            navigate(ROUTE_PATHS.REVIEWS_LIST); // Navigate to reviews list after success
          } else {
            if (message) {
              toast.error(message);
            }
          }
        });
    }
  };

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">
                {state?.isEdit ? "Update" : "Add"} Review
              </div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  {
                    name: "Review & Report",
                    path: ROUTE_PATHS.REVIEWS_LIST,
                  },
                  {
                    name: state?.isEdit ? "Update" : "Add",
                    path: "",
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="d-flex d-flex-block">
          <form
            name="reviewAddEdit"
            id="reviewAddEdit"
            onSubmit={handleSubmit(handlReviewSubmit)}
          >
            <div className="row mt-2">
              <div className="col col-12">
                <h6 className="title mb-3">
                  {state?.isEdit
                    ? "Update Review Message"
                    : "Add Review Message"}
                </h6>
              </div>

              <div className="col col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row align-items-center mb-3">
                      <label
                        htmlFor="title"
                        className="col-sm-4 col-form-label fw-semibold"
                      >
                        Message:
                      </label>
                      <div className="col-sm-12">
                        <textarea
                          id="title"
                          className="form-control bg-light border border-1 rounded-2"
                          defaultValue={state?.info?.obj?.reviewMessage ?? ""}
                          rows={5} // Set rows as per your preference
                          maxLength={100} // Limit the input to 100 characters
                          {...register("title", {
                            required: "Review message is required",
                            maxLength: {
                              value: 100,
                              message:
                                "Review message cannot exceed 100 characters",
                            },
                          })}
                        />
                        {errors.title && (
                          <span className="text-danger">
                            {errors.title.message}
                          </span>
                        )}
                        <ErrorMessage
                          touched={touchedFields.title}
                          error={errors.title?.message}
                          name={undefined}
                        />
                      </div>
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
    </section>
  );
};

export default ReviewUpdate;
