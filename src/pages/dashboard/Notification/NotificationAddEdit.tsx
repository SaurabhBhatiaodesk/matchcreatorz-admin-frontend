import { FC, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ROUTE_PATHS } from "../../../routes/routePaths";
import { BreadCrumb, ErrorMessage } from "../../../components";
import Select from "react-select"; // Import react-select

import { useNotificationSend } from "../../../store/notification/notificationServices";
import { useUsersList } from "../../../store/users/usersServices";

const NotificationAddEdit: FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const notificationSend = useNotificationSend();
  const categoryEdit = useNotificationSend();

  const usersList = useUsersList();

  const [userSelection, setUserSelection] = useState("all");
  const [specificUsers, setSpecificUsers] = useState<any[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<any[]>([]);

  // Fetch the users list
  useEffect(() => {
    usersList
      .mutateAsync({
        page: 1,
        limit: 500,
        columnNo: 0,
      })
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setSpecificUsers(data?.records);
        }
      })
      .catch((err) => {
        console.error("exception while getting user list", err);
      });
  }, []);

  // Handle user selection change for the radio button
  const handleUserSelectionChange = (event: any) => {
    setUserSelection(event.target.value);
  };

  // Handle specific user selection change in the multi-select
  const handleSpecificUserChange = (selectedOptions: any) => {
    setSelectedUserIds(selectedOptions.map((option: any) => option.value));
  };

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    getValues,
  } = useForm({
    mode: "all",
  });

  // Handle form submission
  const handleNotificationSubmit = () => {
    const formData = {
      title: getValues().title,
      description: getValues().description,
      userId: userSelection === "specific" ? selectedUserIds : null,
    };

    if (state?.isEdit) {
      categoryEdit
        .mutateAsync({
          id: state?.category?.id,
          ...formData,
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
      notificationSend.mutateAsync(formData).then((res) => {
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
    }
  };

  // Transform users data for react-select
  const userOptions = specificUsers.map((user: any) => ({
    value: user.id,
    label: user.fullName,
  }));

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-12">
              <div className="dash-title">
                {state?.isEdit ? "Edit" : "Send"} Notification
              </div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  {
                    name: "Notification",
                    path: ROUTE_PATHS.NOTIFICATION_LIST,
                  },
                  {
                    name: state?.isEdit ? "Edit" : "Send",
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
            onSubmit={handleSubmit(handleNotificationSubmit)}
          >
            <div className="row mt-2">
              <div className="col col-12">
                <h6 className="title mb-3">
                  {state?.isEdit ? "Category Edit" : "Send Broadcast"}
                </h6>
              </div>

              <div className="col col-12">
                <div className="card">
                  <div className="card-body">
                    {/* Radio Buttons for User Selection */}
                    <div className="row align-items-center mb-3">
                      <label className="col-sm-4 col-form-label fw-semibold">
                        Send To :-
                      </label>
                      <div className="col-sm-6">
                        <div className="form-check">
                          <input
                            type="radio"
                            id="allUsers"
                            name="userSelection"
                            value="all"
                            className="form-check-input"
                            checked={userSelection === "all"}
                            onChange={handleUserSelectionChange}
                          />
                          <label
                            htmlFor="allUsers"
                            className="form-check-label"
                          >
                            All Users
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            type="radio"
                            id="specificUsers"
                            name="userSelection"
                            value="specific"
                            className="form-check-input"
                            checked={userSelection === "specific"}
                            onChange={handleUserSelectionChange}
                          />
                          <label
                            htmlFor="specificUsers"
                            className="form-check-label"
                          >
                            Specific Users
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Multi-select Dropdown for Specific Users */}
                    {userSelection === "specific" && (
                      <div className="row align-items-center mb-3">
                        <label
                          htmlFor="specificUsers"
                          className="col-sm-4 col-form-label fw-semibold"
                        >
                          Select Users :-
                        </label>
                        <div className="col-sm-6">
                          <Select
                            id="specificUsers"
                            isMulti
                            options={userOptions}
                            value={userOptions.filter((option) =>
                              selectedUserIds.includes(option.value)
                            )}
                            onChange={handleSpecificUserChange}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Title Input */}
                  <div className="card-body">
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
                          defaultValue={state?.category?.title || ""}
                          {...register("title", {
                            required: "Title is required",
                            maxLength: {
                              value: 80,
                              message: "Title cannot exceed 80 characters",
                            },
                          })}
                        />
                        {errors.title && (
                          <span className="text-danger">
                            {errors.title.message}
                          </span>
                        )}
                        <ErrorMessage
                          touched={touchedFields.cityName}
                          error={errors.cityName?.message}
                          name={undefined}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description Input */}
                  <div className="card-body">
                    <div className="row align-items-center mb-3">
                      <label
                        htmlFor="description"
                        className="col-sm-4 col-form-label fw-semibold"
                      >
                        Description :-
                      </label>
                      <div className="col-sm-6">
                        <textarea
                          id="description"
                          className="form-control bg-light border border-1 rounded-2"
                          defaultValue={state?.category?.description || ""}
                          rows={5}
                          {...register("description", {
                            required: "Description is required",
                            maxLength: {
                              value: 40,
                              message:
                                "Description cannot exceed 40 characters",
                            },
                          })}
                        />
                        {errors.description && (
                          <span className="text-danger">
                            {errors.description.message}
                          </span>
                        )}
                        <ErrorMessage
                          touched={touchedFields.cityName}
                          error={errors.cityName?.message}
                          name={undefined}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NotificationAddEdit;
