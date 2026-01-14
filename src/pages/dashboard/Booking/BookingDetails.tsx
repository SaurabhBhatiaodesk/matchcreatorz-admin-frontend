import { FC, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ROUTE_PATHS } from "../../../routes/routePaths";
import {
  useBookingsDetails,
  useBookingsUpdateStatus,
} from "../../../store/users/usersServices";
import { BreadCrumb } from "../../../components";
import { Config } from "../../../config/AppConfig";
import { toast } from "react-toastify";

const BookingDetails: FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const bookingData = useBookingsDetails();
  const bookingUpdateStatus = useBookingsUpdateStatus();
  const [activeTab, setActiveTab] = useState<string>("details"); // To track the active tab
  let booking = bookingData?.data?.data;
  const [settleAmount, setSettleAmount] = useState(0);
  const [refundAmount, setRefundAmount] = useState(0);
  const [selectedBookingStatus, setSelectedBookingStatus] = useState("");
  const price = booking?.price ?? 0; // Example price

  const handleSettleAmountChange = (settleValue: any) => {
    const settle = parseFloat(settleValue);
    // Ensure settle amount does not exceed price
    if (settle > price) {
      alert("Settlement amount cannot be greater than the booking's amount.");
      return;
    }
    // Calculate the refund amount
    const calculatedRefund = price - settle;
    setSettleAmount(settle);
    setRefundAmount(calculatedRefund > 0 ? calculatedRefund : 0);
  };

  const handleRefundAmountChange = (refundValue: any) => {
    const refund = parseFloat(refundValue);
    // Ensure refund amount does not exceed price
    if (refund > price) {
      alert("Refund amount cannot be greater than the booking's amount.");
      return;
    }
    // Calculate the settle amount
    const calculatedSettle = price - refund;
    setRefundAmount(refund);
    setSettleAmount(calculatedSettle > 0 ? calculatedSettle : 0);
  };

  const handleSettleBooking = (
    bookingId: string,
    settleAmount: number,
    refundAmount: number,
    bookingStatus: string
  ) => {
    bookingUpdateStatus
      .mutateAsync({
        id: bookingId,
        settleAmount: settleAmount,
        refundAmount: refundAmount,
        status: "settled",
        bookingStatus: bookingStatus,
      })
      .then((res: any) => {
        const { success, message } = res;
        if (success) {
          toast.success(message);
          setTimeout(() => {
            navigate(0);
          }, 1500);
        }
      });
  };

  useEffect(() => {
    if (params?.id) {
      bookingData.mutate({ id: params?.id });
    }
  }, [params?.id]);

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Booking Details</div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  { name: "Booking", path: ROUTE_PATHS.BOOKINGS_LIST },
                  { name: "Booking Details", path: "" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "details" ? "active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Booking Details
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "payment" ? "active" : ""}`}
              onClick={() => setActiveTab("payment")}
            >
              Payment Details
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "docs" ? "active" : ""}`}
              onClick={() => setActiveTab("docs")}
            >
              Documents & Images
            </a>
          </li>
        </ul>

        <div className="container-fluid">
          <div className="form-pal-details">
            <div className="row pt-4">
              {/* Render sections based on the active tab */}

              {/* Booking Basic Details */}
              {activeTab === "details" && (
                <>
                  {[
                    { label: "BookingID", value: booking?.id },
                    { label: "Title", value: booking?.title },
                    { label: "Category", value: booking?.category?.title },
                    { label: "Country", value: booking?.country?.countryName },
                    { label: "Service ID", value: booking?.serviceId },
                    { label: "Price", value: booking?.price },
                    { label: "Total Amount", value: booking?.totalAmount },
                    { label: "Status", value: booking?.status },
                    { label: "Payment Status", value: booking?.paymentStatus },
                    { label: "Reason", value: booking?.reason },
                    {
                      label: "Created Date",
                      value: booking?.created
                        ? new Date(booking?.created).toLocaleString()
                        : null,
                    },
                  ]
                    .filter(
                      ({ value }) => value !== null && value !== undefined
                    ) // Skip if value is null or undefined
                    .map(({ label, value }, index) => (
                      <div className="col-md-4" key={index}>
                        <div className="form-group">
                          <h6>{label}</h6>
                          <input
                            type="text"
                            placeholder={label}
                            className="form-control bg-light"
                            value={value || "N/A"}
                            readOnly
                          />
                        </div>
                      </div>
                    ))}

                  {booking?.tags?.length > 0 && (
                    <div className="col-md-12">
                      <div className="form-group">
                        <h6>Tags</h6>
                        {booking?.tags?.map((tag: any) => (
                          <span
                            key={tag.id}
                            className="badge badge-primary m-1"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {booking?.buyer && (
                    <div className="col-md-6">
                      <div className="form-group">
                        <h6>Buyer</h6>
                        <Link
                          to={`${ROUTE_PATHS.BUYERS_PROFILE}${booking?.buyer?.id}`}
                          title={`View ${booking?.buyer?.fullName}'s Profile`}
                        >
                          {booking?.buyer?.fullName}
                        </Link>
                        <p>
                          ({booking?.buyer?.country?.countryName},{" "}
                          {booking?.buyer?.state?.stateName})
                        </p>
                      </div>
                    </div>
                  )}

                  {booking?.seller && (
                    <div className="col-md-6">
                      <div className="form-group">
                        <h6>Seller</h6>
                        <Link
                          to={`${ROUTE_PATHS.SELLERS_PROFILE}${booking?.seller?.id}`}
                          title={`View ${booking?.seller?.fullName}'s Profile`}
                        >
                          {booking?.seller?.fullName}
                        </Link>
                        <p>
                          ({booking?.seller?.country?.countryName},{" "}
                          {booking?.seller?.state?.stateName})
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Payment Details */}
              {activeTab === "payment" && (
                <>
                  <div className="col-12">
                    <table className="table table-bordered">
                      <tbody>
                        {booking?.price != 0 && (
                          <tr>
                            <th>Amount</th>
                            <td>{booking?.price}</td>
                          </tr>
                        )}
                        {booking?.platformFee != 0 && (
                          <tr>
                            <th>Platform Fee</th>
                            <td>{booking?.platformFee}</td>
                          </tr>
                        )}
                        {booking?.settlementAmountProposed != 0 && (
                          <tr>
                            <th>Settlement Amount</th>
                            <td>{booking?.settlementAmountProposed}</td>
                          </tr>
                        )}
                        {booking?.counterAmountProposed != 0 && (
                          <tr>
                            <th>Counter Amount</th>
                            <td>{booking?.counterAmountProposed}</td>
                          </tr>
                        )}
                        {booking?.refundAmount != 0 && (
                          <tr>
                            <th>Refund Amount</th>
                            <td>{booking?.refundAmount}</td>
                          </tr>
                        )}
                        <tr>
                          <th>Total Amount</th>
                          <td>{booking?.totalAmount}</td>
                        </tr>
                        <tr>
                          <th>Grand Total</th>
                          <td>{booking?.totalAmount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <>
                    {booking?.disputeByType && (
                      <>
                        <div className="col-12">
                          <label className="">Disputed Details</label>
                          <table className="table table-bordered">
                            <tbody>
                              {booking?.disputeByType && (
                                <tr>
                                  <th>Dispute By {booking?.disputeByType}</th>
                                  <td>{booking?.buyer?.fullName}</td>
                                </tr>
                              )}
                              {booking?.disputeReason && (
                                <tr>
                                  <th>Dispute Reason</th>
                                  <td>{booking?.disputeReason}</td>
                                </tr>
                              )}
                              {booking?.settlementAmountProposed != 0 && (
                                <tr>
                                  <th>Settlement Amount Proposed</th>
                                  <td>{booking?.settlementAmountProposed}</td>
                                </tr>
                              )}
                              {booking?.counterAmountProposed != 0 && (
                                <tr>
                                  <th>Counter Amount Proposed</th>
                                  <td>{booking?.counterAmountProposed}</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {booking?.status === "In-dispute" ? (
                          <>
                            <div className="col-12">
  <div className="row">
    <div className="col-md-6">
      <div className="form-group">
        <label htmlFor="settleAmount">
          Settlement Amount
        </label>
        <input
          type="number"
          className="form-control"
          id="settleAmount"
          value={settleAmount}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (value < 0) {
              // Optionally show an error message
              alert("Settlement Amount cannot be negative");
            } else if (value <= booking?.totalAmount || isNaN(value)) {
              handleSettleAmountChange(value);
            } else {
              // Optionally show an error message
              alert("Settlement Amount cannot exceed Refund Amount");
            }
          }}
        />
      </div>
    </div>

    <div className="col-md-6">
      <div className="form-group">
        <label htmlFor="refundAmount">
          Refund Amount
        </label>
        <input
          type="number"
          className="form-control"
          id="refundAmount"
          value={refundAmount}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (value < 0) {
              // Optionally show an error message
              alert("Refund Amount cannot be negative");
            } else if (value <= booking?.totalAmount || isNaN(value)) {
              handleRefundAmountChange(value);
            }
          }}
        />
      </div>
    </div>
  </div>
</div>


                            <div className="col-12 mt-3 pt-3">
                              <table className="table table-bordered">
                                <tbody>
                                  <tr>
                                    <th>Booking Status</th>
                                    <td>
                                      <select
                                        className="form-control"
                                        value={selectedBookingStatus} // Controlled select value
                                        onChange={(e) => {
                                          const status = e.target.value;
                                          setSelectedBookingStatus(status);
                                        }}
                                      >
                                        <option value="">
                                          Select Booking Status
                                        </option>
                                        <option value="completed">
                                          Completed
                                        </option>
                                        <option value="canceled">
                                          Canceled
                                        </option>
                                      </select>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="col-12">
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="settleAmount">
                                      Settlement Amount
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      id="settleAmount"
                                      value={booking?.settlementAmount}
                                      disabled
                                    />
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="refundAmount">
                                      Refund Amount
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      id="refundAmount"
                                      value={booking?.refundAmount}
                                      disabled
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-12 mt-3 pt-3">
                              <table className="table table-bordered">
                                <tbody>
                                  <tr>
                                    <th>Booking Status</th>
                                    <td>
                                      <select className="form-control">
                                        <option value="completed">
                                          {booking?.status}
                                        </option>
                                      </select>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {/* Settle, Booking Completed, and Canceled Buttons */}
                        {booking?.status === "In-dispute" && (
                          <div className="col-12 pt-3 text-right">
                            <button
                              className="btn btn-success mr-2"
                              onClick={() =>
                                handleSettleBooking(
                                  booking?.id,
                                  settleAmount,
                                  refundAmount,
                                  selectedBookingStatus // Pass bookingStatus here
                                )
                              }
                              disabled={
                                !selectedBookingStatus ||
                                !settleAmount ||
                                !refundAmount
                              } // Disable if no status or amounts are set
                            >
                              Settlement Amount
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </>
                </>
              )}

              {/* Documents & Images */}
              {activeTab === "docs" && (
                <div className="col-12">
                  <h6>Documents</h6>
                  <div className="row">
                    {booking?.documents?.map((doc: any, index: number) => (
                      <div className="col-md-4 mb-4" key={index}>
                        <div className="card h-100">
                          <div className="card-body">
                            <h5 className="card-title">Document</h5>
                            <a
                              href={Config.mediaUrl(doc.url)}
                              className="btn btn-primary"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Document
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h6 className="mt-4">Images</h6>
                  <div className="row">
                    {booking?.images?.map((image: any, index: number) => (
                      <div className="col-md-4 mb-4" key={index}>
                        <div className="card">
                          <img
                            src={Config.mediaUrl(image.url)}
                            className="card-img-top"
                            alt={image.title}
                            style={{ height: "180px", objectFit: "cover" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {booking?.completionProof?.map((proof: any) => (
                    <>
                      <h6>Completion Proof </h6>
                      <div className="row">
                        <div className="col-md-4 mb-4">
                          <div className="card">
                            <img
                              src={Config.mediaUrl(proof.url)}
                              className="card-img-top"
                              alt={proof.url}
                              style={{ height: "180px", objectFit: "cover" }}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingDetails;
