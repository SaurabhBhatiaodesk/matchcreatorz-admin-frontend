import { FC, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as FA6Icon from "react-icons/fa6";
import { ROUTE_PATHS } from "../../../routes/routePaths";
import { BreadCrumb, ErrorMessage } from "../../../components";
import {
  useBannersAdd,
  useUploadUtiliy,
} from "../../../store/common/commenServices";
import { Config } from "../../../config/AppConfig";
import { UploadMediaToS3 } from "../../../services/upload/UploadFileToS3";
import { DefaultUser } from "../../../constant";
import { Loader } from "../../../components/Common/Loader"; // Import the fullscreen loader

const BannersAddEdit: FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const bannerAdd = useBannersAdd();
  const uploadUtility = useUploadUtiliy();

  const [desktopImage, setDesktopImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [isFormValid, setIsFormValid] = useState<boolean>(false); // Form validation state

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, touchedFields: formTouchedFields },
    getValues,
    setValue,
    watch,
  } = useForm({
    mode: "all",
  });

  // Watch for changes in bannerURL and desktopImage to update form validity
  const watchBannerURL = watch("bannerURL");
  const watchDesktopImage = desktopImage;

  useEffect(() => {
    // Check if both banner URL and image are provided
    setIsFormValid(!!watchBannerURL && !!watchDesktopImage);
  }, [watchBannerURL, watchDesktopImage]);

  const handleBannerSubmit = async () => {
    try {
      const { bannerURL, desktopImage } = getValues();
      const response = await bannerAdd.mutateAsync({
        url: bannerURL,
        image: desktopImage,
      });

      const { success, message } = response;
      if (success) {
        toast.success(message);
        navigate(ROUTE_PATHS.BANNERS_LIST);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("An error occurred while submitting the banner.");
    }
  };

  const onMediaUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const mediaFile = event.target.files?.[0];
    if (mediaFile && isValidFileType(mediaFile) && isValidFileSize(mediaFile)) {
      setLoading(true); // Show loader
      try {
        const uploadRes = await uploadUtility.mutateAsync({
          location: "banner",
          type: mediaFile.name.split(".").pop(),
          count: 1,
        });

        const { success, data } = uploadRes;
        if (success && data?.[0]?.url) {
          const media = {
            mediaFile,
            mediaType: mediaFile.type,
            url: data[0].url,
          };
          const uploadResponse:any = await UploadMediaToS3(media);
          if (uploadResponse.status === 200 && type === "desktopImage") {
            setDesktopImage(data[0].filename);
            setValue("desktopImage", data[0].filename);
          }
        }
      } catch (e) {
        console.error("Upload exception:", e);
        toast.error("Failed to upload the image.");
      } finally {
        setLoading(false); // Hide loader
      }
    }
  };

  const isValidFileType = (file: File) => {
    const validImageTypes = ["image/jpeg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG or PNG).");
      return false;
    }
    return true;
  };

  const isValidFileSize = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5 MB.");
      return false;
    }
    return true;
  };

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Banner Manager</div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  { name: "Banners", path: ROUTE_PATHS.BANNERS_LIST },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="d-flex d-flex-block">
        <form
      name="bannerAddEdit"
      id="bannerAddEdit"
      onSubmit={handleSubmit(handleBannerSubmit)}
    >
      <div className="row mt-2">
        <div className="col col-12">
          <h6 className="title mb-3">
            <span>
              {state?.isEdit ? 'Edit Banner' : 'Add Banner'}
              <BreadCrumb
                data={[
                  {
                    name: 'The banner size should be (1320 x 542)',
                    path: '#',
                  },
                ]}
              />
            </span>
          </h6>
        </div>
        <div className="col col-12">
          <div className="card" style={{ minWidth: '1024px' }}>
            <div className="card-body">
              {/* Banner Name / URL */}
              <div className="row align-items-center mb-3">
                <label
                  htmlFor="bannerURL"
                  className="col-sm-4 col-form-label fw-semibold"
                >
                  Banner URL:
                </label>
                <div className="col-sm-6">
                  <input
                    id="bannerURL"
                    type="text"
                    className="form-control bg-light border border-1 rounded-2"
                    {...register('bannerURL', { required: 'Banner URL is required' })}
                  />
                  <ErrorMessage
                    touched={formTouchedFields.bannerURL}
                    error={formErrors.bannerURL?.message}
                    name={undefined}
                  />
                </div>
              </div>

              {/* Banner Image */}
              <div className="row align-items-center mb-3">
                <label
                  htmlFor="desktopImage"
                  className="col-sm-4 col-form-label fw-semibold"
                >
                  Banner Image:
                </label>

                <div className="col-sm-6">
                  <div className="d-flex">
                    <Link
                      to="javascript:void(0);"
                      className="camera desktopImage"
                    >
                      <input
                        type="file"
                        className="profile-image-hide"
                        id="desktopImage"
                        name="desktopImage"
                        accept="image/jpeg, image/png"
                        multiple={false}
                        onChange={(event) =>
                          onMediaUpload(event, 'desktopImage')
                        }
                      />
                      <FA6Icon.FaUpload />
                    </Link>

                    <div
                      className="d-block border rounded-1 p-1"
                      style={{ width: '120px', height: '120px' }}
                    >
                      <img
                        id="desktopImage"
                        src={
                          desktopImage
                            ? Config.mediaUrl(desktopImage)
                            : DefaultUser
                        }
                        className="rounded-1"
                        width="100%"
                        height="100%"
                        alt="Banner"
                      />
                    </div>
                  </div>

                  <ErrorMessage
                    touched={formTouchedFields.icon}
                    error={formErrors.icon?.message}
                    name={undefined}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

            {/* Submit button */}
            <div>
              <div className="col mt-4">
                <span
                  className="submit-btn"
                  style={{ display: "inline-block", float: "right" }}
                >
                  <button
                    type="submit"
                    className="btn btn-info"
                    disabled={!isFormValid || loading} // Disable the button if form is invalid or loading
                  >
                    {state?.isEdit ? "Update" : "Submit"}
                  </button>
                </span>
              </div>
            </div>
          </form>
        </div>

        {loading && <Loader />} {/* Conditionally render loader */}
      </div>
    </section>
  );
};

export default BannersAddEdit;
