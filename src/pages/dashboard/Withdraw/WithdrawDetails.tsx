import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ROUTE_PATHS } from "../../../routes/routePaths";
import { useWithdrawDetails } from "../../../store/common/commenServices";
import { BreadCrumb } from "../../../components";


const WithdrawDetails: FC = () => {
  const params = useParams();
  const withdrawData = useWithdrawDetails();

  useEffect(() => {
    withdrawData.mutate({id: params?.id});
  }, [params?.id]);

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Withdraw Details</div>
              <BreadCrumb
                data={[
                  {
                    name: "Dashboard",
                    path: ROUTE_PATHS.DASHBOARD,
                  },
                  { 
                    name: "Withdraw",
                    path: ROUTE_PATHS.WITHDRAW_LIST,
                  },
                  {
                    name: "Withdraw Details",
                    path: "",
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="form-pal-details">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <h6>Account Number</h6>
                  <input
                    type="text"
                    placeholder="Account Number"
                    className="form-control bg-light"
                    value={withdrawData.data?.data?.accountNumber}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <h6>IBAN</h6>
                  <input
                    type="text"
                    placeholder="IBAN"
                    className="form-control bg-light"
                    value={withdrawData.data?.data?.iban}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <h6>First Name</h6>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="form-control bg-light"
                    value={withdrawData.data?.data?.firstName}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <h6>Last Name</h6>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="form-control bg-light"
                    value={withdrawData.data?.data?.lastName}
                    readOnly
                  />
                </div>
              </div>   

              <div className="col-md-6">
                <div className="form-group">
                  <h6>SWIFT</h6>
                  <input
                    type="text"
                    placeholder="SWIFT"
                    className="form-control bg-light"
                    value={withdrawData.data?.data?.swift}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <h6>Status</h6>
                  <input
                    type="text"
                    placeholder="Status"
                    className="form-control bg-light"
                    value={withdrawData.data?.data?.status}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <h6>Amount</h6>
                  <input
                    type="text"
                    placeholder="Amount"
                    className="form-control bg-light"
                    value={withdrawData.data?.data?.amount}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <h6>Created Date</h6>
                  <p
                    className="p-2 lh-base bg-light"
                    style={{ minHeight: "46px" }}
                  >
                    {withdrawData.data?.data?.created || "N/A"}{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WithdrawDetails;


