import { FC, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ROUTE_PATHS } from "../../../routes/routePaths";
import { BreadCrumb, ErrorMessage } from "../../../components";
import { useConnectAddEdit } from "../../../store/connect/connectServices";

const ConnectAddEdit: FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const connectAddEdit = useConnectAddEdit();
  const connectEdit = useConnectAddEdit();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    mode: "all",
  });

  const [descriptionLength, setDescriptionLength] = useState(
    state?.connect?.description?.length || 0
  );

  const handleConnectSubmit = async (data: any) => {
    const { planName, price, connects, description } = data;

    try {
      if (state?.isEdit) {
        const res = await connectEdit.mutateAsync({
          id: state?.connect?.id,
          planName,
          price,
          connects,
          description,
        });
        const { success, message } = res;
        if (success) {
          toast.success(message);
          setTimeout(() => {
            navigate(-1);
          }, 1500);
        } else {
          toast.error(message);
        }
      } else {
        const res = await connectAddEdit.mutateAsync({
          planName,
          price,
          connects,
          description,
        });
        const { success, message } = res;
        if (success) {
          toast.success(message);
          setTimeout(() => {
            navigate(-1);
          }, 1500);
        } else {
          toast.error(message);
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescriptionLength(event.target.value.length);
  };

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">
                {state?.isEdit ? "Edit" : "Add"} Connect
              </div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  { name: "Connect", path: ROUTE_PATHS.CONNECT_LIST },
                  { name: state?.isEdit ? "Edit" : "Add", path: "" },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-3"></div>
          <div className="row">
            <div className="">
              <form
                name="connectAddEdit"
                id="connectAddEdit"
                onSubmit={handleSubmit(handleConnectSubmit)}
              >
                <div className="row mt-2">
                  <div className="col-12">
                    <h6 className="title mb-3">
                      {state?.isEdit ? "Connect Edit" : "Connect Add"}
                    </h6>
                  </div>

                  <div className="col-12">
                    <div className="card">
                      <div className="card-body">
                        {/* Connect Title Field */}
                        <div className="row align-items-center mb-3">
                          <label
                            htmlFor="planName"
                            className="col-sm-4 col-form-label fw-semibold"
                          >
                            Connect Title:
                          </label>
                          <div className="col-sm-8">
                            <input
                              id="planName"
                              type="text"
                              className="form-control bg-light border border-1 rounded-2"
                              defaultValue={state?.connect?.planName || ""}
                              {...register("planName", {
                                required: "Connect Title is required",
                                maxLength: {
                                  value: 10,
                                  message:
                                    "Connect Title must be at most 10 characters",
                                },
                              })}
                            />
                            <ErrorMessage
                              touched={touchedFields.planName}
                              error={errors.planName?.message}
                              name={undefined}
                            />
                          </div>
                        </div>

                        {/* Price Field */}
                        <div className="row align-items-center mb-3">
                          <label
                            htmlFor="price"
                            className="col-sm-4 col-form-label fw-semibold"
                          >
                            Price:
                          </label>
                          <div className="col-sm-8">
                            <input
                              id="price"
                              type="text"
                              className="form-control bg-light border border-1 rounded-2"
                              defaultValue={state?.connect?.price || ""}
                              {...register("price", {
                                required: "Price is required",
                                maxLength: {
                                  value: 5,
                                  message:
                                    "Price must be at most 5 characters",
                                },
                                pattern: {
                                  value: /^[0-9]*$/,
                                  message: "Price must be a valid number",
                                },
                              })}
                            />
                            <ErrorMessage
                              touched={touchedFields.price}
                              error={errors.price?.message}
                              name={undefined}
                            />
                          </div>
                        </div>

                        {/* Connects Field */}
                        <div className="row align-items-center mb-3">
                          <label
                            htmlFor="connects"
                            className="col-sm-4 col-form-label fw-semibold"
                          >
                            Connects:
                          </label>
                          <div className="col-sm-8">
                            <input
                              id="connects"
                              type="text"
                              className="form-control bg-light border border-1 rounded-2"
                              defaultValue={state?.connect?.connects || ""}
                              {...register("connects", {
                                required: "Connects is required",
                                maxLength: {
                                  value: 10,
                                  message:
                                    "Connects must be at most 10 characters",
                                },
                                pattern: {
                                  value: /^[0-9]*$/,
                                  message: "Connects must be a valid number",
                                },
                              })}
                            />
                            <ErrorMessage
                              touched={touchedFields.connects}
                              error={errors.connects?.message}
                              name={undefined}
                            />
                          </div>
                        </div>

                        {/* Description Field */}
                        <div className="row align-items-center mb-3">
                          <label
                            htmlFor="description"
                            className="col-sm-4 col-form-label fw-semibold"
                          >
                            Description:
                          </label>
                          <div className="col-sm-8">
                            <textarea
                              id="description"
                              className="form-control bg-light border border-1 rounded-2"
                              defaultValue={state?.connect?.description || ""}
                              rows={5}
                              maxLength={100}
                              {...register("description", {
                                required: "Description is required",
                                maxLength: {
                                  value: 100,
                                  message:
                                    "Description must be at most 100 characters",
                                },
                              })}
                              onChange={handleDescriptionChange}
                            />
                            <ErrorMessage
                              touched={touchedFields.description}
                              error={errors.description?.message}
                              name={undefined}
                            />
                            <div className="text-end mt-2">
                              <small>{descriptionLength}/100 characters</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-4 d-flex justify-content-end">
                      <button type="submit" className="btn btn-info">
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-3"></div>
        </div>
      </div>
    </section>
  );
};

export default ConnectAddEdit;
