import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import * as FA6Icon from "react-icons/fa6";

import { ROUTE_PATHS } from "../../../routes/routePaths";
import { DefaultUser } from "../../../constant";
import { useSellersDetails } from "../../../store/users/usersServices";
import { Config } from "../../../config/AppConfig";
import { BreadCrumb } from "../../../components";
import { getYears } from "../../../helper";
import WalletPageList from "./WalletPage";
import ConnectPageList from "./ConnectPage";
import Reviews from "./ReviewPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
const SellersDetails: FC = () => {
  const params = useParams();
  const sellersProfile: any = useSellersDetails();
  const [activeTab, setActiveTab] = useState<string>("personalDetails");

  useEffect(() => {
    sellersProfile.mutate({ id: params?.id });
  }, [params?.id]);

  const renderPersonalDetails = () => (
    <div className="form-pal-details">
      {/* <h4>Personal Details</h4> */}

      <div className="row">
        {/* Avatar */}
        <div className="col-6">
          <div className="justify-content-start mt-4 mb-4 p-2">
            <label>Avatar</label>
            <div className="profile-img-container">
              <img
                src={
                  sellersProfile.data?.data?.avatar
                    ? Config.mediaUrl(sellersProfile.data?.data?.avatar)
                    : DefaultUser
                }
                alt={sellersProfile.data?.data?.fullName}
                className="profile-img"
              />
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="col-6">
          <div className="justify-content-center mt-4 mb-4 p-2">
            <label>Cover Image</label>
            <div className="profile-img-container">
              <img
                src={
                  sellersProfile.data?.data?.banner
                    ? Config.mediaUrl(sellersProfile.data?.data?.banner)
                    : DefaultUser
                }
                alt={sellersProfile.data?.data?.fullName}
                className="profile-img"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Full Name */}
        <div className="col-md-6">
          <div className="form-group">
            <h6>Full Name</h6>
            <input
              type="text"
              placeholder="Full Name"
              className="form-control bg-light"
              value={sellersProfile.data?.data?.fullName}
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
                value={sellersProfile.data?.data?.email || "N/A"}
                readOnly
              />
              {sellersProfile.data?.data?.isEmailVerified ? (
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
                <option>
                  {sellersProfile.data?.data?.countryCode || "N/A"}
                </option>
              </select>
              <input
                type="text"
                placeholder="Phone Number"
                className="form-control countryphone bg-light"
                value={sellersProfile.data?.data?.phone || "N/A"}
                readOnly
              />
              {sellersProfile.data?.data?.isPhoneVerified ? (
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

        {/* Age */}
        {sellersProfile.data?.data?.dob && (
          <>
            {/* DOB */}
            <div className="col-md-6">
              <div className="form-group">
                <h6>DOB</h6>
                <input
                  type="text"
                  placeholder="DOB"
                  className="form-control bg-light"
                  value={sellersProfile.data?.data?.dob || "N/A"}
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-6">
                <div className="form-group">
                  <h6>Age</h6>
                  <input
                    type="text"
                    placeholder="Age"
                    className="form-control bg-light"
                    value={
                      sellersProfile.data?.data?.dob
                        ? `${getYears(sellersProfile?.data?.data?.dob)} years`
                        : "Date of birth not provided"
                    }
                    readOnly
                  />
                </div>
              </div>
             
          </>
        )}

        {/* Gender */}
        <div className="col-md-6">
          <div className="form-group">
            <h6>Gender</h6>
            <input
              type="text"
              placeholder="Gender"
              className="form-control bg-light"
              value={sellersProfile.data?.data?.gender || "N/A"}
              readOnly
            />
          </div>
        </div>

        {/* Country */}
        <div className="col-md-6">
          <div className="form-group">
            <h6>Country</h6>
            <input
              type="text"
              placeholder="Country Name"
              className="form-control bg-light"
              value={sellersProfile.data?.data?.country?.countryName || "N/A"}
              readOnly
            />
          </div>
        </div>

        {/* State */}
        <div className="col-md-6">
          <div className="form-group">
            <h6>State</h6>
            <input
              type="text"
              placeholder="State Name"
              className="form-control bg-light"
              value={sellersProfile.data?.data?.state?.stateName || "N/A"}
              readOnly
            />
          </div>
        </div>

        {/* City */}
        <div className="col-md-6">
          <div className="form-group">
            <h6>City</h6>
            <input
              type="text"
              placeholder="City Name"
              className="form-control bg-light"
              value={sellersProfile.data?.data?.city || "N/A"}
              readOnly
            />
          </div>
        </div>

        {/* Address */}
        {sellersProfile.data?.data?.address ? (
          <>
            <div className="col-md-6">
              <div className="form-group">
                <h6>Address</h6>
                <input
                  type="text"
                  placeholder="Address"
                  className="form-control bg-light"
                  value={sellersProfile.data?.data?.address || "N/A"}
                  readOnly
                />
              </div>
            </div>
          </>
        ) : (
          <></>
        )}

        {/* Zipcode */}
        <div className="col-md-6">
          <div className="form-group">
            <h6>Zipcode</h6>
            <input
              type="text"
              placeholder="Zipcode"
              className="form-control bg-light"
              value={sellersProfile.data?.data?.zipcode || "N/A"}
              readOnly
            />
          </div>
        </div>

        {/* Bio */}
        <div className="col-md-6">
          <div className="form-group">
            <h6>Bio</h6>
            <p className="p-2 lh-base bg-light" style={{ minHeight: "46px" }}>
              {sellersProfile.data?.data?.bio || "N/A"}{" "}
            </p>
          </div>
        </div>
        {/* Ratting */}
        <div className="col-md-6">
          <div className="form-group">
            <h6>Average Rating</h6>
            <p className="pt-2">
              {renderStars(sellersProfile.data?.data?.avgRating) || "N/A"}
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <h6>Wallet Amount</h6>
            <input
              type="text"
              placeholder="Wallet Amount"
              className="form-control bg-light"
              value={sellersProfile.data?.data?.walletAmount || "N/A"}
              readOnly
            />
          </div>
        </div>

        {sellersProfile.data?.data?.totalEarningAmount ? (
          <>
            <div className="col-md-6">
              <div className="form-group">
                <h6>Total Earning</h6>
                <input
                  type="text"
                  placeholder="Total Earning"
                  className="form-control bg-light"
                  value={sellersProfile.data?.data?.totalEarningAmount || "N/A"}
                  readOnly
                />
              </div>
            </div>
          </>
        ) : (
          <></>
        )}

        {sellersProfile.data?.data?.totalCompletedJobs ? (
          <>
            <div className="col-md-6">
              <div className="form-group">
                <h6>Completed Jobs</h6>
                <input
                  type="text"
                  placeholder="Completed Jobs"
                  className="form-control bg-light"
                  value={sellersProfile.data?.data?.totalCompletedJobs || "N/A"}
                  readOnly
                />
              </div>
            </div>
          </>
        ) : (
          <></>
        )}

        {sellersProfile.data?.data?.totalConnects ? (
          <>
            <div className="col-md-6">
              <div className="form-group">
                <h6>Total Connects</h6>
                <input
                  type="text"
                  placeholder="Total Connects"
                  className="form-control bg-light"
                  value={sellersProfile.data?.data?.totalConnects || "N/A"}
                  readOnly
                />
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="row mt-4">
      <h4>Documents</h4>
      <div className="row row-cols-1 row-cols-md-3">
        {/* Resume Section */}
        {sellersProfile.data?.data?.resume ? (
          <div className="col col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">Resume</h5>
                <p className="card-text">
                  {sellersProfile.data?.data?.resumeName ||
                    "Resume not available"}
                </p>
                <a
                  href={Config.mediaUrl(sellersProfile.data?.data?.resume)}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="col">
            <span>Resume not available.</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderOtherDetails = () => (
    <div className="row mt-4">
      <div className="row row-cols-1 row-cols-md-3">
        {/* Category */}
        <div className="col-md-6">
          <div className="form-group">
            <h6>Category</h6>
            <input
              type="text"
              placeholder="Category"
              className="form-control bg-light"
              value={sellersProfile.data?.data?.category?.title || "N/A"}
              readOnly
            />
          </div>
        </div>

        {/* Tags */}
        <div className="col-md-6">
          <div className="form-group">
            <h6>Tags</h6>
            <input
              type="text"
              placeholder="Tags"
              className="form-control bg-light"
              value={
                sellersProfile.data?.data?.tags
                  ?.map((t: any) => t.tag_name)
                  .join(", ") || "N/A"
              }
              readOnly
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="col-md-6">
          <div className="form-group">
            <h6>Price Range</h6>
            <input
              type="text"
              placeholder="Price Range"
              className="form-control bg-light"
              value={sellersProfile.data?.data?.priceRange || "N/A"}
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
              value={
                sellersProfile.data?.data?.responseTime + " Hours" || "N/A"
              }
              readOnly
            />
          </div>
        </div>

        {/* Portfolios */}
        <div className="col-md-12 mt-4">
          <h6>Portfolios</h6>
          {sellersProfile.data?.data?.portfolios &&
          sellersProfile.data?.data?.portfolios.length > 0 ? (
            <div className="row">
              {sellersProfile.data?.data?.portfolios.map(
                (portfolio: any, index: any) => (
                  <div key={index} className="col-md-4 mb-4">
                    <div className="card">
                      <img
                        src={Config.mediaUrl(portfolio.image)}
                        className="card-img-top"
                        alt={portfolio.title}
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{portfolio.title}</h5>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <p>No portfolios available.</p>
          )}
        </div>

        {/* FAQs */}
        <div className="col-md-12 mt-4">
          <h6>FAQs</h6>
          {sellersProfile.data?.data?.faqs &&
          sellersProfile.data?.data?.faqs.length > 0 ? (
            <div className="accordion" id="faqAccordion">
              {sellersProfile.data?.data?.faqs.map((faq: any, index: any) => (
                <div key={index} className="accordion-item">
                  <h2 className="accordion-header" id={`heading${index}`}>
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      aria-expanded="true"
                      aria-controls={`collapse${index}`}
                    >
                      {faq.question}
                    </button>
                  </h2>
                  <div
                    id={`collapse${index}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading${index}`}
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">{faq.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No FAQs available.</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderWalletTransaction = () => (
    <div className="row mt-4">
      {/* <h4>Wallet Transactions</h4> */}
      <div className="row">
        {sellersProfile.data?.data?.walletAmount >= 0 ? (
          <>
            <WalletPageList id={sellersProfile.data?.data?.id} />
          </>
        ) : (
          <div className="col">
            <span>Wallet Transactions not available.</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderConnectTransaction = () => (
    <div className="row mt-4">
      {/* <h4>Wallet Transactions</h4> */}
      <div className="row">
        {sellersProfile.data?.data?.walletAmount >= 0 ? (
          <>
            <ConnectPageList id={sellersProfile.data?.data?.id} />
          </>
        ) : (
          <div className="col">
            <span>Wallet Transactions not available.</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderReviewPage = () => <Reviews id={sellersProfile.data?.data?.id} />;

  const renderStars = (rating: any) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            style={{ color: "gold" }}
            width={15}
          />
        );
      } else if (i - rating < 1 && i - rating > 0) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faStarHalfAlt}
            style={{ color: "gold" }}
          />
        );
      } else {
        //stars.push(<FontAwesomeIcon key={i} icon={faStarOfLife} style={{ color: 'gold' }} />);
      }
    }
    return stars;
  };

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Sellers Details</div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  { name: "Sellers", path: ROUTE_PATHS.SELLERS_LIST },
                  { name: "Seller Details", path: "" },
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
                    activeTab === "other-details" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("other-details")}
                >
                  Other Details
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    activeTab === "documents" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("documents")}
                >
                  Documents
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
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    activeTab === "connect" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("connect")}
                >
                  Connect Transactions
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    activeTab === "review" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("review")}
                >
                  Reviews
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
                  activeTab === "documents" ? "show active" : ""
                }`}
                id="documents"
                role="tabpanel"
              >
                {renderDocuments()}
              </div>
              <div
                className={`tab-pane fade ${
                  activeTab === "other-details" ? "show active" : ""
                }`}
                id="other-details"
                role="tabpanel"
              >
                {renderOtherDetails()}
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
              <div
                className={`tab-pane fade ${
                  activeTab === "connect" ? "show active" : ""
                }`}
                id="connect"
                role="tabpanel"
              >
                {renderConnectTransaction()}
              </div>
              <div
                className={`tab-pane fade ${
                  activeTab === "review" ? "show active" : ""
                }`}
                id="review"
                role="tabpanel"
              >
                {renderReviewPage()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellersDetails;
