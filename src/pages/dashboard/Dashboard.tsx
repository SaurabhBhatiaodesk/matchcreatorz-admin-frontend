import { FC, useEffect, useState } from "react";
import DatePicker from "react-datepicker"; // Import the date picker
import "react-datepicker/dist/react-datepicker.css"; // Import styles

import { useDashboard } from "../../store/auth/authServices";
import {
  BookingIcon,
  UserIcon
} from "../../constant";
import { ROUTE_PATHS } from "../../routes/routePaths";
import { DetailsCard } from "../../components";

const Dashboard: FC = () => {
  const { mutate, data } = useDashboard();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (startDate && endDate) {
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();
      
      mutate({ startDate: formattedStartDate, endDate: formattedEndDate });
    }else{
      mutate({})
    }
  }, [startDate, endDate, mutate]); 

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-12">
              <div className="dash-title">Dashboard</div>
            </div>
          </div>
        </div>
        <div className="sales-history dashboard_container">
          <div className="mx-3 mt-3 date-picker d-flex align-items-center">
                  <DatePicker
                    className="form-control bg-light border border-1 rounded-2 me-2" // Use margin-end for spacing
                    selected={startDate}
                    onChange={(date:any) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                  />
                  <DatePicker
                    className="mx-3 form-control bg-light border border-1 rounded-2"
                    selected={endDate}
                    onChange={(date:any) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="End Date"
                  />
          </div>
          <div className="mainmap-section">
            <div className="row">
              <div className="col-md-12">
                <div className="salesvaluecell details_card">
                  <DetailsCard
                    backgroundColor="#e2fcff"
                    title="Active Jobs"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.activeJobs ?? 0}`}
                  />
                  <DetailsCard
                    backgroundColor="#e2fcff"
                    title="Canceled Jobs"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.canceledJobs ?? 0}`}
                  />
                  <DetailsCard
                    backgroundColor="#e2fcff"
                    title="Buyers"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data.totalBuyers ?? 0}`}
                    navigate={ROUTE_PATHS.BUYERS_LIST}
                  />
                  <DetailsCard
                    backgroundColor="#e2fcff"
                    title="Sellers"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data.totalSellers ?? 0}`}
                    navigate={ROUTE_PATHS.SELLERS_LIST}
                  />
                  <DetailsCard
                    backgroundColor="#e2fcff"
                    title="Active chats"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.activeChats ?? 0}`}
                  />
                  <DetailsCard
                    backgroundColor="#e2fcff"
                    title="Received Payments"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.recievedPayments ?? 0}`}
                  />
                  <DetailsCard
                    backgroundColor="#e2fcff"
                    title="Completed Jobs (Seller)"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.completedJobs ?? 0}`}
                  />
                  <DetailsCard
                    backgroundColor="#e2fcff"
                    title="Commission Earnings"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.commisionEarnings ?? 0}`}
                  />
                  <DetailsCard
                    backgroundColor="#e2fcff"
                    title="Paid Amount (Seller)"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.paidAmountToSellers ?? 0}`}
                  />
                  <DetailsCard
                    backgroundColor="#ffeded"
                    title="Bookings"
                    cardIcon={BookingIcon}
                    titleColor="#ffcfcf"
                    value={`${data?.data?.totalBookings ?? 0}`}
                    navigate={ROUTE_PATHS.BOOKINGS_LIST}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
