import { FC, useEffect } from "react";

import { ROUTE_PATHS } from "../../../routes/routePaths";
import { BreadCrumb, DetailsCardInfo } from "../../../components";

import { useStatistics } from "../../../store/auth/authServices";

import { DetailsCard } from "../../../components";

import { EarningIcon, UserIcon, TravellerIcon } from "../../../constant";

const StatiscticsList: FC = () => {
  const { mutate, data } = useStatistics();

  useEffect(() => {
    mutate();
  }, []);

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Statistics Manager</div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  { name: "Statistics", path: ROUTE_PATHS.STATISTICS_LIST },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="sales-history dashboard_container">
          <div className="mainmap-section">
            <div className="row">
              <div className="col-md-12">
                <div className="salesvaluecell details_card">
                  <DetailsCard
                    backgroundColor="#e2fcff"
                    title="Total Registered Users"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.totalUsers ?? 0}`}
                    /* navigate={ROUTE_PATHS.BUYERS_LIST} */
                  />

                  <DetailsCard
                    backgroundColor="#e2fcff"
                    title="Total Revenue"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.totalRevenue ?? 0}`}
                    /* navigate={ROUTE_PATHS.BUYERS_LIST} */
                  />

                  <DetailsCard
                    backgroundColor="#e2fcff"
                    title="Total Received Reviews"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data.totalReviews ?? 0}`}
                    navigate={ROUTE_PATHS.REVIEWS_LIST}
                  />
                  <DetailsCard
                    backgroundColor="#e2fcff"
                    title="Total Booking"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data.totalBookings ?? 0}`}
                    navigate={ROUTE_PATHS.BOOKINGS_LIST}
                  />

                  <DetailsCard
                    backgroundColor="#e2fcff"
                    title="Total Active Bookings"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.totalActiveBookings ?? 0}`}
                    navigate={ROUTE_PATHS.BOOKINGS_LIST}
                  />

                  <DetailsCard
                    backgroundColor="#e2fcff"
                    title="Total Canceled Bookings"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.totalCanceledBookings ?? 0}`}
                    navigate={ROUTE_PATHS.BOOKINGS_LIST}
                  />

                  <DetailsCard
                    backgroundColor="#e2fcff"
                    title="Total (Seller)"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.totalSellers ?? 0}`}
                    navigate={ROUTE_PATHS.SELLERS_LIST}
                  />

                  <DetailsCard
                    backgroundColor="#e2fcff"
                    title="Total (Buyers)"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.totalBuyers ?? 0}`}
                    navigate={ROUTE_PATHS.BUYERS_LIST}
                  />

                  <DetailsCardInfo
                    backgroundColor="#e2fcff"
                    title="Most Booked Category"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.mostBookedCategory ?? 0}`}
                    navigate={ROUTE_PATHS.CATEGORY_LIST}
                  />

                  <DetailsCardInfo
                    backgroundColor="#e2fcff"
                    title="Least Booked Category"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.leastBookedCategory ?? 0}`}
                    /* navigate={ROUTE_PATHS.BUYERS_LIST} */
                  />

                  <DetailsCardInfo
                    backgroundColor="#e2fcff"
                    title="Highest Booking's (Seller)"
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.highestBooking ?? 0}`}
                    navigate={ROUTE_PATHS.BOOKINGS_LIST}
                  />

                  <DetailsCard
                    backgroundColor="#e2fcff"
                    title="Total Payment"
                    cardIcon={EarningIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.totalPayments ?? 0}`}
                    /* navigate={ROUTE_PATHS.BUYERS_LIST} */
                  />

                  <DetailsCardInfo
                    backgroundColor="#e2fcff"
                    title="Max Payment Received By"
                    cardIcon={TravellerIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.maxPaymentRCBySeller ?? 0}`}
                   /*  navigate={ROUTE_PATHS.BUYERS_LIST} */
                  />
                  <DetailsCardInfo
                    backgroundColor="#e2fcff"
                    title="Most Completed Job By  "
                    cardIcon={TravellerIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.mostCompleteJobBySeller ?? 0}`}
                   /*  navigate={ROUTE_PATHS.BUYERS_LIST} */
                  />

                  <DetailsCardInfo
                    backgroundColor="#e2fcff"
                    title="Most Booked (Seller) By "
                    cardIcon={UserIcon}
                    titleColor="#bcf7ff"
                    value={`${data?.data?.mostBookedSellerByBuyer ?? 0}`}
                   /*  navigate={ROUTE_PATHS.BUYERS_LIST} */
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

export default StatiscticsList;
