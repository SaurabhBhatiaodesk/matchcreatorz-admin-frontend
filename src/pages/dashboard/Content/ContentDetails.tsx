import { FC, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";
import "react-quill/dist/quill.snow.css";

import { ROUTE_PATHS } from "../../../routes/routePaths";
import { usePageEdit, usePagesAdd } from "../../../store/common/commenServices";
import { BreadCrumb, ErrorMessage } from "../../../components";

const ContentDetails: FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const pagesEdit = usePageEdit();
  const pagesAdd = usePagesAdd();
  const isCreateMode = !state?.pageData;

  const [pageContent, setPageContent] = useState(state?.pageData?.description || "");

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    mode: "all",
    defaultValues: {
      title: state?.pageData?.title || "",
      slug: state?.pageData?.slug || "",
    },
  });

  const handleContentSubmit = (data: { title: string; slug: string }) => {
    if (isCreateMode) {
      // Create new page
      pagesAdd
        .mutateAsync({
          title: data.title,
          description: pageContent,
          slug: data.slug,
        })
        .then((res) => {
          const { success, message } = res;
          if (success) {
            toast.success(message || "Page created successfully");
            setTimeout(() => {
              navigate(ROUTE_PATHS.CONTENT_MANAGEMENT);
            }, 1500);
          } else {
            if (message) {
              toast.error(message);
            }
          }
        })
        .catch((res) => {
          console.error("pagesAdd error", res);
          toast.error("Failed to create page");
        });
    } else {
      // Edit existing page
      pagesEdit
        .mutateAsync({
          pageId: state?.pageData?.id,
          pageType: state?.pageData?.title,
          description: pageContent,
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
        })
        .catch((res) => {
          console.error("pagesEdit error", res);
        });
    }
  };

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Static Content Manager</div>
              <BreadCrumb
                data={[
                  {
                    name: "Dashboard",
                    path: ROUTE_PATHS.DASHBOARD,
                  },
                  {
                    name: "Content Management",
                    path: ROUTE_PATHS.CONTENT_MANAGEMENT,
                  },
                  {
                    name: isCreateMode ? "Create New Page" : state?.pageData?.pageType || "",
                    path: ROUTE_PATHS.CONTENT_MANAGEMENT,
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="d-flex d-flex-block">
          <form
            name="content-management"
            id="changePassword"
            onSubmit={handleSubmit(handleContentSubmit)}
            className="row"
          >
            {isCreateMode && (
              <>
                <div className="col col-12 mb-3">
                  <Form.Group>
                    <Form.Label>
                      Page Title <span className="text-danger">*</span>
                    </Form.Label>
                    <Controller
                      name="title"
                      control={control}
                      rules={{
                        required: "Page title is required",
                      }}
                      render={({ field }) => (
                        <Form.Control
                          type="text"
                          placeholder="Enter page title"
                          {...field}
                          isInvalid={!!errors.title}
                        />
                      )}
                    />
                    <ErrorMessage
                      touched={touchedFields.title}
                      error={errors.title?.message}
                      name={undefined}
                    />
                  </Form.Group>
                </div>

                <div className="col col-12 mb-3">
                  <Form.Group>
                    <Form.Label>
                      Slug <span className="text-danger">*</span>
                    </Form.Label>
                    <Controller
                      name="slug"
                      control={control}
                      rules={{
                        required: "Slug is required",
                        pattern: {
                          value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                          message: "Slug should be lowercase with hyphens (e.g., about-us)",
                        },
                      }}
                      render={({ field }) => (
                        <Form.Control
                          type="text"
                          placeholder="Enter page slug (e.g., about-us)"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
                            field.onChange(value);
                          }}
                          isInvalid={!!errors.slug}
                        />
                      )}
                    />
                    <ErrorMessage
                      touched={touchedFields.slug}
                      error={errors.slug?.message}
                      name={undefined}
                    />
                  </Form.Group>
                </div>
              </>
            )}

            <div className="col col-12">
              <h6 className="title mb-3">Description</h6>
              <ReactQuill
                value={pageContent}
                onChange={setPageContent}
                readOnly={!state?.isEdit && !isCreateMode}
              />
              <ErrorMessage
                touched={touchedFields.description}
                error={errors.description?.message}
                name={undefined}
              />
            </div>

            {(state?.isEdit || isCreateMode) && (
              <div className="col mt-4">
                <span
                  className="submit-btn"
                  style={{ display: "inline-block", float: "right" }}
                >
                  <button 
                    type="submit" 
                    className="btn btn-info"
                  >
                    {isCreateMode ? "Create Page" : "Submit"}
                  </button>
                </span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContentDetails;
