import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { ROUTE_PATHS } from "../../../routes/routePaths";
import { BreadCrumb, ErrorMessage } from "../../../components";

import { useCategoryAddEdit } from "../../../store/category/categoryServices";

const CategoryAddEdit: FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const categoryAddEdit = useCategoryAddEdit();
  const categoryEdit = useCategoryAddEdit();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    getValues,
  } = useForm({
    mode: "all",
  });

  const handleCategorySubmit = () => {
    if (state?.isEdit) {
      categoryEdit
        .mutateAsync({
          id: state?.category?.id,
          title: getValues().title,
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
      categoryAddEdit
        .mutateAsync({
          title: getValues().title,
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
    }
  };

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">
                {state?.isEdit ? "Edit" : "Add"} Category
              </div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  {
                    name: "Category",
                    path: ROUTE_PATHS.CATEGORY_LIST,
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

        <div className="d-flex d-flex-block">
          <form
            name="countryAddEdit"
            id="countryAddEdit"
            onSubmit={handleSubmit(handleCategorySubmit)}
          >
            <div className="row mt-2">
              <div className="col col-12">
                <h6 className="title mb-3">
                  {state?.isEdit ? "Category Edit" : "Category Add"}
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
                        Title :-
                      </label>
                      <div className="col-sm-6">
                        <input
                          id="title"
                          type="text"
                          className="form-control bg-light border border-1 rounded-2"
                          defaultValue={state?.category?.title || ""}
                          {...register("title")}
                        />
                        <ErrorMessage
                          touched={touchedFields.cityName}
                          name={undefined}
                          error={errors.cityName?.message}
                        />
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
                <div className="col mt-4">
                  <span
                    className="submit-btn"
                    style={{ display: "inline-block", float: "right" }}
                  >
                    {" "}
                    <button type="submit" className="btn btn-info">
                      Submit
                    </button>{" "}
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

export default CategoryAddEdit;
