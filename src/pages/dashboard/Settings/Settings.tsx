import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useLocation, useNavigate } from "react-router-dom";
// import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import { BreadCrumb, ErrorMessage } from "../../../components";
import { ROUTE_PATHS } from "../../../routes/routePaths";
// import useValidation from "../../../helper/yupValidation";
import ResponseTimeComponent from "./ReseponseTime";
import PriceRangeComponent from "./PriceRange";
import {
  useAdminResponseTimeUpdate,
  useAdminPriceRangeUpdate,
  useAdminSetting,
  useAdminSettingUpdate,
} from "../../../store/admin/adminServices";

// import { AdmitSettings } from "../../../store/admin/adminServicesInterface";

const Settings: FC = () => {
  const { state } = useLocation();
  const adminSettings = useAdminSetting();
  const adminSettingUpdate = useAdminSettingUpdate();
  const [activeTab, setActiveTab] = useState("general");

  const navigate = useNavigate();

  const responseTime = useAdminResponseTimeUpdate();
  const usePriceRange = useAdminPriceRangeUpdate();

  const [adminSettingData, setAdminSettingData] = useState<any>();
  /*   const [addMoreInout, setAddMoreInput] = useState<string>("");
  const [addMoreData, setAddMoreData] = useState<string>(""); */

  useEffect(() => {
    adminSettings
      .mutateAsync()
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setAdminSettingData(data);
        }
      })
      .catch((err) => {
        console.error("", err);
      });
  }, [adminSettingUpdate.isSuccess]);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    getValues,
    // setValue,
  } = useForm<any>({
    mode: "all",
    // resolver: yupResolver(adminSettingValidation),
  });

  const handleAdminSettingUpdate = () => {
    adminSettingUpdate
      .mutateAsync({
        androidAppVersion: adminSettingData?.androidAppVersion,
        androidForceUpdate: adminSettingData?.androidForceUpdate,
        iosAppVersion: adminSettingData?.iosAppVersion,
        iosForceUpdate: adminSettingData?.iosForceUpdate,
        websiteVersion: adminSettingData?.websiteVersion,
        maintenanceMode: adminSettingData?.maintenanceMode,
      })
      .then((res) => {
        const { success, message } = res;
        if (success) {
          toast.success(message);
          setTimeout(() => {
            navigate(0);
          }, 1500);
        } else {
          toast.error(message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAdminOtherSettingUpdate = () => {
    adminSettingUpdate
      .mutateAsync({
        responseTime: adminSettingData?.responseTime,
        priceRange: adminSettingData?.priceRange,
        earningSellerCardVisibility:adminSettingData?.earningSellerCardVisibility,
        earningBuyerCardVisibility:adminSettingData?.earningBuyerCardVisibility,
      })
      .then((res) => {
        const { success, message } = res;
        if (success) {
          toast.success(message);
          setTimeout(() => {
            navigate(0);
          }, 1500);
        } else {
          toast.error(message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAdminCommisionSettingUpdate = () => {
    adminSettingUpdate
      .mutateAsync({
        bookingPercentageForPayment:adminSettingData?.bookingPercentageForPayment,
        bookingPercentage: adminSettingData?.bookingPercentage,
        cancellationPercentage: adminSettingData?.cancellationPercentage,

        platformFee: adminSettingData?.platformFee,
        minPercentForSettle: adminSettingData?.minPercentForSettle,
      })
      .then((res) => {
        const { success, message } = res;
        if (success) {
          toast.success(message);
          setTimeout(() => {
            navigate(0);
          }, 1500);
        } else {
          toast.error(message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDataUpdate = (key: string, value: any) => {
    setAdminSettingData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResponseTimeSubmit = () => {
    responseTime
      .mutateAsync({
        id: state?.info?.id,
        hours: getValues().hrs,
      })
      .then((res: { success: any; message: any }) => {
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
  }; //working

  const handlePriceRangeSubmit = () => {
    usePriceRange
      .mutateAsync({
        id: state?.info?.id,
        min: getValues().min,
        max: getValues().max,
      })
      .then((res: { success: any; message: any }) => {
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
  }; //working

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Admin Settings</div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  { name: "Admin Settings", path: ROUTE_PATHS.ADMIN_SETTINGS },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="mt-5 mx-3">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "general" ? "active" : ""
                }`}
                onClick={() => setActiveTab("general")}
              >
                General Settings
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "commissions" ? "active" : ""
                }`}
                onClick={() => setActiveTab("commissions")}
              >
                Commissions
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "other" ? "active" : ""}`}
                onClick={() => setActiveTab("other")}
              >
                Other Settings
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "other" ? "active" : ""}`}
                onClick={() => setActiveTab("response-time")}
              >
                Response Time
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "other" ? "active" : ""}`}
                onClick={() => setActiveTab("price-range")}
              >
                Price Range
              </button>
            </li>
          </ul>
          <div className="tab-content mt-4">
            {activeTab === "general" && (
              <form
                id="admin-setting"
                name="admin-setting"
                className="row"
                onSubmit={handleSubmit(handleAdminSettingUpdate)}
              >
                {/* Android App Settings */}
                <div className="col-md-6 mb-4">
                  <label htmlFor="androidAppVersion" className="form-label">
                    Android App Version
                  </label>
                  <input
                    id="androidAppVersion"
                    type="text"
                    className="form-control bg-light"
                    style={{ fontSize: "12px", height: "40px" }}
                    onChange={(e) =>
                      handleDataUpdate("androidAppVersion", e.target.value)
                    }
                    value={adminSettingData?.androidAppVersion}
                  />
                  <ErrorMessage
                    touched={touchedFields.androidAppVersion}
                    error={errors.androidAppVersion?.message}
                    name={undefined}
                  />
                </div>
                <div className="col-md-6 mb-4">
                  <label htmlFor="androidForceUpdate" className="form-label">
                    Android Force Update
                  </label>
                  <select
                    id="androidForceUpdate"
                    className="form-select bg-light border-white rounded-0"
                    value={adminSettingData?.androidForceUpdate ? "Yes" : "No"}
                    onChange={(e) =>
                      handleDataUpdate(
                        "androidForceUpdate",
                        e.target.value === "Yes" ? true : false
                      )
                    }
                    style={{ fontSize: "12px", height: "40px" }}
                  >
                    {["Yes", "No"].map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <ErrorMessage
                    touched={touchedFields.androidForceUpdate}
                    error={errors.androidForceUpdate?.message}
                    name={undefined}
                  />
                </div>

                {/* iOS App Settings */}
                <div className="col-md-6 mb-4">
                  <label htmlFor="iosAppVersion" className="form-label">
                    IOS App Version
                  </label>
                  <input
                    id="iosAppVersion"
                    type="text"
                    className="form-control bg-light"
                    style={{ fontSize: "12px", height: "40px" }}
                    onChange={(e) =>
                      handleDataUpdate("iosAppVersion", e.target.value)
                    }
                    value={adminSettingData?.iosAppVersion}
                  />
                  <ErrorMessage
                    touched={touchedFields.iosAppVersion}
                    error={errors.iosAppVersion?.message}
                    name={undefined}
                  />
                </div>
                <div className="col-md-6 mb-4">
                  <label htmlFor="iosForceUpdate" className="form-label">
                    IOS Force Update
                  </label>
                  <select
                    id="iosForceUpdate"
                    className="form-select bg-light rounded-0"
                    value={adminSettingData?.iosForceUpdate ? "Yes" : "No"}
                    onChange={(e) =>
                      handleDataUpdate(
                        "iosForceUpdate",
                        e.target.value === "Yes" ? true : false
                      )
                    }
                    style={{ fontSize: "12px", height: "40px" }}
                  >
                    {["Yes", "No"].map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <ErrorMessage
                    touched={touchedFields.iosForceUpdate}
                    error={errors.iosForceUpdate?.message}
                    name={undefined}
                  />
                </div>

                {/* Website Settings */}
                <div className="col-md-6 mb-4">
                  <label htmlFor="websiteVersion" className="form-label">
                    Website Version
                  </label>
                  <input
                    id="websiteVersion"
                    type="text"
                    className="form-control bg-light"
                    style={{ fontSize: "12px", height: "40px" }}
                    onChange={(e) =>
                      handleDataUpdate("websiteVersion", e.target.value)
                    }
                    value={adminSettingData?.websiteVersion}
                  />
                  <ErrorMessage
                    touched={touchedFields.websiteVersion}
                    error={errors.websiteVersion?.message}
                    name={undefined}
                  />
                </div>

                {/* Maintenance Mode */}
                <div className="col-md-6 mb-4">
                  <label htmlFor="maintenanceMode" className="form-label">
                    Maintenance Mode
                  </label>
                  <select
                    id="maintenanceMode"
                    className="form-select bg-light rounded-0"
                    style={{ fontSize: "12px", height: "40px" }}
                    value={adminSettingData?.maintenanceMode ? "Yes" : "No"}
                    onChange={(e) =>
                      handleDataUpdate(
                        "maintenanceMode",
                        e.target.value === "Yes" ? true : false
                      )
                    }
                  >
                    {["Yes", "No"].map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <ErrorMessage
                    touched={touchedFields.maintenanceMode}
                    error={errors.maintenanceMode?.message}
                    name={undefined}
                  />
                </div>

                {/* Update Button */}
                <div className="col-md-12">
                  <span
                    className="submit-btn"
                    style={{ display: "inline-block", float: "right" }}
                  >
                    <button type="submit" className="btn btn-primary">
                      Update
                    </button>
                  </span>
                </div>
              </form>
            )}

            {activeTab === "commissions" && (
              <form
                id="admin-setting"
                name="admin-setting"
                className="row"
                onSubmit={handleSubmit(handleAdminCommisionSettingUpdate)}
              >
                <div className="row">
                  {/*  <div className="col-md-6 mb-4">
                    <label
                      htmlFor="bookingPercentageForPayment"
                      className="form-label"
                    >
                      Booking Percentage ( % ) From Sellers Payment
                    </label>
                    <input
                      id="bookingPercentageForPayment"
                      type="text"
                      className="form-control bg-light"
                      style={{ fontSize: "12px", height: "40px" }}
                      onChange={(e) =>
                        handleDataUpdate(
                          "bookingPercentageForPayment",
                          e.target.value
                        )
                      }
                      value={adminSettingData?.bookingPercentageForPayment ?? 0}
                    />
                    <ErrorMessage
                      touched={touchedFields.androidAppVersion}
                      error={errors.androidAppVersion?.message}
                      name={undefined}
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <label htmlFor="bookingPercentage" className="form-label">
                      Booking Percentage ( % ) For Check-Out
                    </label>
                    <input
                      id="bookingPercentage"
                      type="text"
                      className="form-control bg-light"
                      style={{ fontSize: "12px", height: "40px" }}
                      onChange={(e) =>
                        handleDataUpdate("bookingPercentage", e.target.value)
                      }
                      value={adminSettingData?.bookingPercentage ?? 0}
                    />
                    <ErrorMessage
                      touched={touchedFields.bookingPercentage}
                      name={undefined}
                      error={errors.bookingPercentage?.message}
                    />
                  </div> */}

                  {/* <div className="col-md-6 mb-4">
                    <label
                      htmlFor="cancellationPercentage"
                      className="form-label"
                    >
                      Cancellation Percentage ( % ) For Settlement
                    </label>
                    <input
                      id="cancellationPercentage"
                      type="text"
                      className="form-control bg-light"
                      style={{ fontSize: "12px", height: "40px" }}
                      onChange={(e) =>
                        handleDataUpdate(
                          "cancellationPercentage",
                          e.target.value
                        )
                      }
                      value={adminSettingData?.cancellationPercentage ?? 0}
                    />
                    <ErrorMessage
                      touched={touchedFields.androidAppVersion}
                      name={undefined}
                      error={errors.cancellationPercentage?.message}
                    />
                  </div> */}

                  <div className="col-md-6 mb-4">
                    <label
                      htmlFor="platformFee"
                      className="form-label"
                    >
                      Platform Fee ( Fixed )
                    </label>
                    <input
                      id="platformFee"
                      type="text"
                      className="form-control bg-light"
                      style={{ fontSize: "12px", height: "40px" }}
                      onChange={(e) =>
                        handleDataUpdate(
                          "platformFee",
                          e.target.value
                        )
                      }
                      value={adminSettingData?.platformFee ?? 0}
                    />
                    <ErrorMessage
                      touched={touchedFields.platformFee}
                      name={undefined}
                      error={errors.platformFee?.message}
                    />
                  </div>

                  <div className="col-md-6 mb-4">
                    <label
                      htmlFor="minPercentForSettle"
                      className="form-label"
                    >
                      Minimum ( % ) For Settlement
                    </label>
                    <input
                      id="minPercentForSettle"
                      type="text"
                      className="form-control bg-light"
                      style={{ fontSize: "12px", height: "40px" }}
                      onChange={(e) =>
                        handleDataUpdate(
                          "minPercentForSettle",
                          e.target.value
                        )
                      }
                      value={adminSettingData?.minPercentForSettle ?? 0}
                    />
                    <ErrorMessage
                      touched={touchedFields.minPercentForSettle}
                      name={undefined}
                      error={errors.minPercentForSettle?.message}
                    />
                  </div>
                </div>

                {/* Update Button */}
                <div className="col-md-12">
                  <span
                    className="submit-btn"
                    style={{ display: "inline-block", float: "right" }}
                  >
                    <button type="submit" className="btn btn-primary">
                      Update
                    </button>
                  </span>
                </div>
              </form>
            )}

            {activeTab === "other" && (
              <form
                id="admin-setting"
                name="admin-setting"
                className="row"
                onSubmit={handleSubmit(handleAdminOtherSettingUpdate)}
              >
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label
                      htmlFor="earningSellerCardVisibility"
                      className="form-label"
                    >
                      Total earnings (Seller) Visibility
                    </label>
                    <select
                      id="earningSellerCardVisibility"
                      className="form-select bg-light border-white rounded-0"
                      value={
                        adminSettingData?.earningSellerCardVisibility
                          ? "Yes"
                          : "No"
                      }
                      onChange={(e) =>
                        handleDataUpdate(
                          "earningSellerCardVisibility",
                          e.target.value === "Yes" ? true : false
                        )
                      }
                      style={{ fontSize: "12px", height: "40px" }}
                    >
                      {["Yes", "No"].map((value, index) => (
                        <option key={index} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage
                      touched={touchedFields.androidForceUpdate}
                      error={errors.androidForceUpdate?.message}
                      name={undefined}
                    />
                  </div>

                  <div className="col-md-6 mb-4">
                    <label
                      htmlFor="earningBuyerCardVisibility"
                      className="form-label"
                    >
                      Total expenditure (Buyer) Visibility
                    </label>
                    <select
                      id="earningBuyerCardVisibility"
                      className="form-select bg-light border-white rounded-0"
                      value={
                        adminSettingData?.earningBuyerCardVisibility
                          ? "Yes"
                          : "No"
                      }
                      onChange={(e) =>
                        handleDataUpdate(
                          "earningBuyerCardVisibility",
                          e.target.value === "Yes" ? true : false
                        )
                      }
                      style={{ fontSize: "12px", height: "40px" }}
                    >
                      {["Yes", "No"].map((value, index) => (
                        <option key={index} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage
                      touched={touchedFields.androidForceUpdate}
                      error={errors.androidForceUpdate?.message}
                      name={undefined}
                    />
                  </div>

                  {/* Update Button */}
                  <div className="col-md-12">
                    <span
                      className="submit-btn"
                      style={{ display: "inline-block", float: "right" }}
                    >
                      <button type="submit" className="btn btn-primary">
                        Update
                      </button>
                    </span>
                  </div>
                </div>
              </form>
            )}

            {activeTab === "response-time" && (
              <div className="row">
                <form
                  name="responseTimeAddEdit"
                  id="responseTimeAddEdit"
                  onSubmit={handleSubmit(handleResponseTimeSubmit)}
                >
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row align-items-center mb-3">
                          <label
                            htmlFor="hrs"
                            className="col-sm-4 col-form-label fw-semibold"
                          >
                            Hours :-
                          </label>
                          <div className="col-sm-6">
                            <input
                              id="hrs"
                              type="number"
                              className="form-control bg-light border border-1 rounded-2"
                              {...register("hrs", {
                                required: "Hours is required",
                              })}
                            />
                            {/*  {errors.zipcode && (
                              <p className="text-danger">
                                {errors.zipcode.hrs}
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
                <ResponseTimeComponent id={state?.info?.id ?? 0} />
              </div>
            )}

            {activeTab === "price-range" && (
              <>
                <form
                  id="priceRangeAddEdit"
                  name="priceRangeAddEdit"
                  onSubmit={handleSubmit(handlePriceRangeSubmit)}
                >
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row align-items-center mb-3">
                          <label
                            htmlFor="min"
                            className="col-sm-4 col-form-label fw-semibold"
                          >
                            Minimum Price :-
                          </label>
                          <div className="col-sm-6">
                            <input
                              id="min"
                              type="number"
                              className="form-control bg-light border border-1 rounded-2"
                              {...register("min", {
                                required: "Minimum is required",
                              })}
                            />
                            {/*  {errors.zipcode && (
                              <p className="text-danger">
                                {errors.zipcode.min}
                              </p>
                            )} */}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="row align-items-center mb-3">
                          <label
                            htmlFor="max"
                            className="col-sm-4 col-form-label fw-semibold"
                          >
                            Maximum Price :-
                          </label>
                          <div className="col-sm-6">
                            <input
                              id="max"
                              type="number"
                              className="form-control bg-light border border-1 rounded-2"
                              {...register("max", {
                                required: "Maximum is required",
                              })}
                            />
                            {/*                             {errors.zipcode && (
                              <p className="text-danger">
                                {errors.zipcode.max}
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

                <PriceRangeComponent id={state?.info?.id ?? 0} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
