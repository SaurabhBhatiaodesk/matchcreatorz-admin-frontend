import { FC, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as FA6Icon from "react-icons/fa6";
import { useTagsList , useUploadUtiliy } from "../../../store/common/commenServices";
import { ErrorMessage } from "../../../components";
import { useSellersAddEdit } from "../../../store/users/usersServices";

interface OtherDetailsProps {
  data: any | undefined; // Adjust the type based on your needs
}

const OtherDetailsComponent: FC<OtherDetailsProps> = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const sellersAddEdit = useSellersAddEdit();
  const [isLoading, setIsLoading] = useState(false);
  const tagsList = useTagsList();
  const uploadUtility = useUploadUtiliy();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setValue,
    watch,
  } = useForm({
    mode: "all",
  });

  const selectedCategoryId = watch("categoryId");

  useEffect(() => {
    // Fetch tags when categoryId changes
    if (selectedCategoryId) {
      tagsList
        .mutateAsync({ categoryId: selectedCategoryId })
        .then(() => {})
        .catch((err) => {
          console.error("Error fetching tags", err);
        });
    }
  }, [selectedCategoryId]);

  const handleOtherDetailsFormSubmit = (formData: any) => {
    const dataToSubmit = {
      userId: state?.info?.id,
      id: state?.info?.id,
      //categoryId: formData.categoryId,
      resume: formData.resume ?? state?.info?.obj?.resume,
      responseTime: formData.responseTime ?? state?.info?.obj?.responseTime,
    };

    if (!formData.resume || !formData.responseTime) {
      toast.error("Please fill in all required fields.");
      return;
    }

    sellersAddEdit
      .mutateAsync(dataToSubmit)
      .then((res: any) => {
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
  };

  const onMediaUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const mediaFiles = event.target.files?.[0];
    setIsLoading(true);

    if (mediaFiles) {
      uploadUtility
        .mutateAsync({
          count: 1,
          type: "pdf",
          location: "resume",
        })
        .then((res: any) => {
          if (res.success) {
            if (type === "resume") {
              setValue("resume", res.data[0].filename);
            }
          }
        })
        .catch((error) => {
          console.error("Error uploading media", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };


  return (
    <form id="otherDetailsAddEdit" onSubmit={handleSubmit(handleOtherDetailsFormSubmit)}>
      <div className="card-body">
        <div className="row">
          <div className="col-12">
            <h6 className="title mb-3 mt-2">
              {state?.isEdit ? "Edit Other Details" : "Add Other Details"}
            </h6>
          </div>

          {/* Resume Upload */}
          <div className="col-md-6">
            <div className="row align-items-center mb-3">
              <label htmlFor="profile_resume" className="col-sm-4 col-form-label fw-semibold">
                Resume :-
              </label>
              <div className="col-sm-6">
                <div className="d-flex">
                  <Link to="javascript:void(0);" className="camera profile-resume">
                    <input
                      type="file"
                      className="profile-resume-hide"
                      id="profile-resume"
                      name="profile_resume"
                      accept="application/pdf"
                      onChange={(event) => onMediaUpload(event, "resume")}
                    />
                    <FA6Icon.FaUpload />
                  </Link>
                </div>
                <ErrorMessage touched={touchedFields.resume} name="profile_resume" error={errors.resume?.message} />
                {errors.resume && <p className="text-danger">{errors.resume.message}</p>}
              </div>
            </div>

            {/* Category Select */}
           {/*  <div className="row align-items-center mb-3">
              <label htmlFor="categoryId" className="col-sm-4 col-form-label fw-semibold">
                Category :-
              </label>
              <div className="col-sm-6">
                <select
                  id="categoryId"
                  className="form-control bg-light border rounded-2"
                  {...register("categoryId", { required: "Category is required" })}
                  onChange={handleCategoryChange}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
                <ErrorMessage touched={touchedFields.categoryId} name="categoryId" error={errors.categoryId?.message} />
                {errors.categoryId && <p className="text-danger">{errors.categoryId.message}</p>}
              </div>
            </div> */}

            {/* Response Time */}
            <div className="row align-items-center mb-3">
              <label htmlFor="responseTime" className="col-sm-4 col-form-label fw-semibold">
                Response Time :-
              </label>
              <div className="col-sm-6">
                <input
                  id="responseTime"
                  type="text"
                  className="form-control bg-light border rounded-2"
                  defaultValue={state?.info?.obj?.responseTime || ""}
                  {...register("responseTime", { required: "Response Time is required" })}
                />
                {errors.responseTime && <p className="text-danger">{errors.responseTime.message}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="col mt-4">
            <button type="submit" className="btn btn-info float-right" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default OtherDetailsComponent;
