import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import * as FA6Icon from "react-icons/fa6";

import { ROUTE_PATHS } from "../../../routes/routePaths";
import { DefaultUser } from "../../../constant";
import { useBuyerDetails } from "../../../store/users/usersServices";
import { Config } from "../../../config/AppConfig";
import { BreadCrumb } from "../../../components";
import { getYears } from "../../../helper";
import WalletPageList from "./WalletPage";

const BuyerDetails: FC = () => {
  const params = useParams();

  const details = useBuyerDetails();

  const [activeTab, setActiveTab] = useState<string>("personalDetails");

  useEffect(() => {
    details.mutate({ id: params?.id });
  }, [params?.id]);

  const renderPersonalDetails = () => (
    <div className="form-pal-details">
      <div className="row  justify-content-center mt-4 mb-4 p-2">
        <div className="d-flex flex-row">
          <div className="col-md-6">
            <h6>Avatar</h6>
            <div className="row justify-content-left mt-4 mb-4 p-2">
              <div className="profile-img-container">
                <img
                  src={
                    details.data?.data?.avatar
                      ? Config.mediaUrl(details.data?.data?.avatar)
                      : DefaultUser
                  }
                  alt={details.data?.data?.fullName}
                  className="profile-img"
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <h6>Cover Image</h6>
            <div className="row justify-content-left mt-4 mb-4 p-2">
              <div className="profile-img-container">
                <img
                  src={
                    details.data?.data?.banner
                      ? Config.mediaUrl(details.data?.data?.banner)
                      : DefaultUser
                  }
                  alt={details.data?.data?.fullName}
                  className="profile-img"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row  justify-content-center mt-4 mb-4 p-2">
          <div className="col-md-6">
            <div className="form-group">
              <h6>Full Name</h6>
              <input
                type="text"
                placeholder="First Name"
                className="form-control bg-light"
                value={details.data?.data?.fullName}
                readOnly
              />
            </div>
          </div>
          {/* Email ID */}
          <div className="col-md-6">
            <div className="form-group">
              <h6>Email ID</h6>
              <div className="d-flex align-items-center">
                <input
                  type="email"
                  placeholder="Email"
                  className="form-control bg-light"
                  value={details.data?.data?.email || "N/A"}
                  readOnly
                />
                {details.data?.data?.isEmailVerified ? (
                  <i
                    className="fa fa-check text-success ml-2"
                    title="Email Verified"
                  ></i>
                ) : (
                  <i
                    className="fa fa-times text-danger ml-2"
                    title="Email Not Verified"
                  ></i>
                )}
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div className="col-md-6">
            <div className="form-group">
              <h6>Phone Number</h6>
              <div className="countrycodephone d-flex align-items-center">
                <select className="form-control countrycode bg-light" disabled>
                  <option>{details.data?.data?.countryCode || "N/A"}</option>
                </select>
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="form-control countryphone bg-light"
                  value={details.data?.data?.phone || "N/A"}
                  readOnly
                />
                {details.data?.data?.isPhoneVerified ? (
                  <i
                    className="fa fa-check text-success ml-2"
                    title="Phone Verified"
                  ></i>
                ) : (
                  <i
                    className="fa fa-times text-danger ml-2"
                    title="Phone Not Verified"
                  ></i>
                )}
              </div>
            </div>
          </div>
          {details.data?.data?.dob ? (
            <>
              <div className="col-md-6">
                <div className="form-group">
                  <h6>DOB</h6>

                  <input
                    type="text"
                    placeholder="DOB"
                    className="form-control  bg-light"
                    value={details.data?.data?.dob || "N/A"}
                    readOnly
                  />
                </div>
              </div>
            </>
          ) : (
            <> </>
          )}

          {details.data?.data?.dob && (
            <div className="col-md-6">
              <div className="form-group">
                <h6>Age</h6>

                <input
                  type="text"
                  placeholder="DOB"
                  className="form-control  bg-light"
                  value={`${getYears(details.data?.data?.dob)} years`}
                  readOnly
                />
              </div>
            </div>
          )}

          <div className="col-md-6">
            <div className="form-group">
              <h6>Gender</h6>

              <input
                type="text"
                placeholder="DOB"
                className="form-control  bg-light"
                value={details.data?.data?.gender || "N/A"}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <h6>Country</h6>
              <input
                type="text"
                placeholder="Country Name"
                className="form-control  bg-light"
                value={details.data?.data?.country?.countryName || "N/A"}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <h6>State</h6>
              <input
                type="text"
                placeholder="Country Name"
                className="form-control  bg-light"
                value={details.data?.data?.state?.stateName || "N/A"}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <h6>City</h6>
              <input
                type="text"
                placeholder="Country Name"
                className="form-control  bg-light"
                value={details.data?.data?.city || "N/A"}
                readOnly
              />
            </div>
          </div>

          {details.data?.data?.address ? (
            <>
              <div className="col-md-6">
                <div className="form-group">
                  <h6>Address</h6>
                  <input
                    type="text"
                    placeholder="Country Name"
                    className="form-control  bg-light"
                    value={details.data?.data?.address || "N/A"}
                    readOnly
                  />
                </div>
              </div>
            </>
          ) : (
            <> </>
          )}
          <div className="col-md-6">
            <div className="form-group">
              <h6>Bio</h6>
              <input
                type="text"
                placeholder="Country Name"
                className="form-control  bg-light"
                value={details.data?.data?.bio || "N/A"}
                readOnly
              />
            </div>
          </div>

          {/* Zipcode */}
          <div className="col-md-6">
            <div className="form-group">
              <h6>Zipcode</h6>
              <input
                type="text"
                placeholder="Zipcode"
                className="form-control bg-light"
                value={details.data?.data?.zipcode || "N/A"}
                readOnly
              />
            </div>
          </div>

          {/* Response Time */}
          <div className="col-md-6">
            <div className="form-group">
              <h6>Response Time</h6>
              <input
                type="text"
                placeholder="Response Time"
                className="form-control bg-light"
                value={details.data?.data?.responseTime + " Hours" || "N/A"}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <h6>Total Wallet Amount</h6>
              <input
                type="text"
                placeholder="First Name"
                className="form-control bg-light"
                value={details.data?.data?.walletAmount ?? 0}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-6"></div>
        </div>
      </div>
    </div>
  );

  const renderWalletTransaction = () => (
    <div className="row mt-4">
      <div className="row">
        {details.data?.data?.walletAmount >= 0 ? (
          <>
            <WalletPageList id={details.data?.data?.id} />
          </>
        ) : (
          <div className="col">
            <span>Wallet Transactions not available.</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Buyer Details</div>
              <BreadCrumb
                data={[
                  {
                    name: "Dashboard",
                    path: ROUTE_PATHS.DASHBOARD,
                  },
                  {
                    name: "Buyers",
                    path: ROUTE_PATHS.BUYERS_LIST,
                  },
                  {
                    name: "Buyer Details",
                    path: "",
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-body">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    activeTab === "personalDetails" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("personalDetails")}
                >
                  Personal Details
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    activeTab === "locations" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("locations")}
                >
                  Wallet Transactions
                </button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div
                className={`tab-pane fade ${
                  activeTab === "personalDetails" ? "show active" : ""
                }`}
                id="personalDetails"
                role="tabpanel"
              >
                {renderPersonalDetails()}
              </div>
              <div
                className={`tab-pane fade ${
                  activeTab === "locations" ? "show active" : ""
                }`}
                id="locations"
                role="tabpanel"
              >
                {renderWalletTransaction()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuyerDetails;
