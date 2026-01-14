import { FC, useEffect, useState } from "react";
import { DefaultUser } from "../../../constant";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../store/auth/authStore";
import {
  useAdminProfile,
  useUpdateAdminProfile,
} from "../../../store/auth/authServices";
import { toast } from "react-toastify";
import { useUploadUtiliy } from "../../../store/common/commenServices";
import { Config } from "../../../config/AppConfig";
import { ChangePassword, EditProfile, Loader } from "../../../components"; // Import the loader component
import { UploadMediaToS3 } from "../../../services/upload/UploadFileToS3";

const Profile: FC = () => {
  const location = useLocation();

  const { mutate, data } = useAdminProfile();
  const adminProfileUpdate = useUpdateAdminProfile();
  const uploadUtility = useUploadUtiliy();
  const { userDetails, setUserDetails } = useAuthStore();

  const [currentTab, setCurrentTab] = useState("profile");
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  useEffect(() => {
    mutate(); // Fetch profile data
    setCurrentTab(
      location.pathname.includes("profile") ? "profile" : "changePass"
    );
  }, [location.pathname, adminProfileUpdate.data?.success]);

  useEffect(() => {
    if (data?.success) {
      setUserDetails(data.data); // Update user details in auth store
    }
  }, [data]);

  useEffect(() => {
    if (adminProfileUpdate.data?.success) {
      toast.success(adminProfileUpdate.data?.message);
    } else {
      toast.error(adminProfileUpdate.data?.message);
    }
  }, [adminProfileUpdate.data?.message]);

  const handleChangeTab = (event: any) => {
    setCurrentTab(event.target.id); // Switch between tabs
  };

  const handleUpdateAdminProfile = (updatedData: any, type: string) => {
    if (updatedData) {
      if (type === "profile") {
        adminProfileUpdate.mutate({
          firstName: updatedData.firstName,
          lastName: updatedData.lastName || '',
          avatar: updatedData.avatar || "",
        });
      } else if (type === "avatar") {
        adminProfileUpdate.mutate({
          firstName: userDetails?.firstName,
          lastName: userDetails?.lastName || '',
          avatar: updatedData, // Update avatar
        });
        // Optimistically update the avatar in the UI
        setUserDetails((prevDetails: any) => ({
          ...prevDetails,
          avatar: updatedData,
        }));
      }
    }
  };

  const onMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const mediaFile = event.target.files?.[0];
    if (mediaFile) {
      if (!isValidFileType(mediaFile) || !isValidFileSize(mediaFile)) {
        return;
      }
      setLoading(true); // Show loader
      try {
        const res = await uploadUtility.mutateAsync({
          location: "admin/profile",
          type: "png",
          extension: mediaFile.name.split(".").pop(),
        });

        if (res.success && res.data?.[0]?.url) {
          const media = {
            mediaFile,
            mediaType: mediaFile.type,
            url: res.data?.[0]?.url,
          };
          const uploadRes:any = await UploadMediaToS3(media);
          if (uploadRes.status === 200) {
            handleUpdateAdminProfile(res.data?.[0]?.filename, "avatar");
          }
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setLoading(false); // Hide loader
      }
    }
  };

  const isValidFileType = (file: File) => {
    if (file.type.startsWith("image/")) {
      return true;
    } else {
      toast.error("Please upload a valid image.");
      return false;
    }
  };

  const isValidFileSize = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size <= maxSize) {
      return true;
    } else {
      toast.error("Image size should be less than 5 MB.");
      return false;
    }
  };

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-7">
              <div className="dash-title">Profile Info</div>
            </div>
          </div>
        </div>
        <div className="profile-section">
          <div className="row">
            <div className="col-md-3">
              <div className="profile-nav">
                <div className="user-heading round">
                  <div className="profile_img profile_img_edit_box">
                    <form
                      id="imageForm"
                      encType="multipart/form-data"
                      method="post"
                      acceptCharset="utf-8"
                    >
                      <Link to="#" className="update-profile-image border border-primary">
                        <img
                          id="user_profile_img"
                          src={
                            userDetails?.avatar
                              ? Config.mediaUrl(userDetails.avatar)
                              : DefaultUser
                          }
                          className="rounded-circle"
                          alt={userDetails?.fullName}
                        />
                      </Link>
                      <Link
                        to="javascript:void(0);"
                        className="camera profile-image border"
                      >
                        <input
                          type="file"
                          className="profile-image-hide"
                          id="profile-image"
                          name="profile_image"
                          accept="image/jpeg, image/png"
                          multiple={false}
                          onChange={onMediaUpload}
                        />
                        <i className="fa fa-camera" />
                      </Link>
                    </form>
                  </div>
                  <h1>{userDetails?.fullName}</h1>
                  <p>{userDetails?.email}</p>
                </div>
                <ul className="nav nav-pills nav-stacked">
                  <li
                    className={currentTab === "profile" ? "active" : ""}
                    id="profile"
                    onClick={handleChangeTab}
                    aria-hidden={true}
                  >
                    <i className="fa fa-edit" /> Edit profile
                  </li>
                  <li
                    className={currentTab === "changePass" ? "active" : ""}
                    id="changePass"
                    onClick={handleChangeTab}
                    aria-hidden={true}
                  >
                    <i className="fa fa-unlock-alt" /> Change password
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-9">
              {currentTab === "profile" && (
                <EditProfile
                  userDetails={userDetails}
                  onSubmit={(data: any) => handleUpdateAdminProfile(data, "profile")}
                />
              )}
              {currentTab === "changePass" && <ChangePassword />}
            </div>
          </div>
        </div>
        {loading && <Loader />} {/* Conditionally render loader */}
      </div>
    </section>
  );
};

export default Profile;
