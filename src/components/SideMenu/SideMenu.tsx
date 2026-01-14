import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import * as BIIcon from "react-icons/bi";
import * as FA6Icon from "react-icons/fa6";
import * as MDIcon from "react-icons/md";

import { DashboardLogo } from "../../constant";
import { ROUTE_PATHS } from "../../routes/routePaths";

export const SideMenu: FC = () => {
  const location = useLocation();

  const handleActiveClass = (name: string) => {
    return location.pathname.includes(name) ? "active" : "";
  };

  return (
    <aside>
      <div
        id="sidebar"
        className="nav-collapse "
        style={{ overflow: "hidden", outline: "none" }}
      >
        <div className="logo-box">
          <Link to={ROUTE_PATHS.DASHBOARD} className="logo">
            <img src={DashboardLogo} className="mr-1" alt="logo" />
          </Link>
        </div>
        <ul className="sidebar-menu" id="nav-accordion">
          <li className="left-bor">
            <Link
              className={handleActiveClass(ROUTE_PATHS.DASHBOARD)}
              to={ROUTE_PATHS.DASHBOARD}
            >
              <span className="sidebar-menu-icon">
                <MDIcon.MdOutlineDashboard size="20" />
              </span>
              <span>Dashboard </span>
            </Link>
          </li>

          <li className="">
            <Link
              className={handleActiveClass(ROUTE_PATHS.BANNERS_LIST)}
              to={ROUTE_PATHS.BANNERS_LIST}
            >
              <span className="sidebar-menu-icon">
                <FA6Icon.FaImages size="20" />
              </span>
              <span>Banner Manager</span>
            </Link>
          </li>

          <li className="">
            <Link
              className={handleActiveClass(ROUTE_PATHS.BUYERS_LIST)}
              to={ROUTE_PATHS.BUYERS_LIST}
            >
              <span className="sidebar-menu-icon">
                <FA6Icon.FaUsers size="20" />
              </span>
              <span>Buyers Manager</span>
            </Link>
          </li>

          <li className="">
            <Link
              className={handleActiveClass(ROUTE_PATHS.SELLERS_LIST)}
              to={ROUTE_PATHS.SELLERS_LIST}
            >
              <span className="sidebar-menu-icon">
                <FA6Icon.FaUsersBetweenLines size="20" />
              </span>
              <span>Sellers Manager</span>
            </Link>
          </li>

          <li className="">
            <Link
              className={handleActiveClass(ROUTE_PATHS.CATEGORY_LIST)}
              to={ROUTE_PATHS.CATEGORY_LIST}
            >
              <span className="sidebar-menu-icon">
                <FA6Icon.FaVault size="20" />
              </span>
              <span>Category & Tags</span>
            </Link>
          </li>

          <li className="">
            <Link
              className={handleActiveClass(ROUTE_PATHS.BOOKINGS_LIST)}
              to={ROUTE_PATHS.BOOKINGS_LIST}
            >
              <span className="sidebar-menu-icon">
                <FA6Icon.FaRegCalendarCheck size="20" />
              </span>
              <span>Bookings Manager</span>
            </Link>
          </li>

          <li className="">
            <Link
              className={handleActiveClass(ROUTE_PATHS.NOTIFICATION_LIST)}
              to={ROUTE_PATHS.NOTIFICATION_LIST}
            >
              <span className="sidebar-menu-icon">
                <FA6Icon.FaBell size="20" />
              </span>
              <span>Broadcast</span>
            </Link>
          </li>

          <li className="">
            <Link
              className={handleActiveClass(ROUTE_PATHS.SUPPORT_LIST)}
              to={ROUTE_PATHS.SUPPORT_LIST}
            >
              <span className="sidebar-menu-icon">
                <FA6Icon.FaGroupArrowsRotate size="20" />
              </span>
              <span>Support</span>
            </Link>
          </li>

          <li className="">
            <Link
              className={handleActiveClass(ROUTE_PATHS.CONNECT_LIST)}
              to={ROUTE_PATHS.CONNECT_LIST}
            >
              <span className="sidebar-menu-icon">
                <FA6Icon.FaVault size="20" />
              </span>
              <span>Connect Manager</span>
            </Link>
          </li>

          <li className="">
            <Link
              className={handleActiveClass(ROUTE_PATHS.REVIEWS_LIST)}
              to={ROUTE_PATHS.REVIEWS_LIST}
            >
              <span className="sidebar-menu-icon">
                <FA6Icon.FaRegHardDrive size="20" />
              </span>
              <span>Reviews </span>
            </Link>
          </li>

          <li className="">
            <Link
              className={handleActiveClass(ROUTE_PATHS.REPORT_LIST)}
              to={ROUTE_PATHS.REPORT_LIST}
            >
              <span className="sidebar-menu-icon">
                <FA6Icon.FaRectangleXmark size="20" />
              </span>
              <span>Reports</span>
            </Link>
          </li>

          <li className="">
            <Link
              className={handleActiveClass(ROUTE_PATHS.CONTENT_MANAGEMENT)}
              to={ROUTE_PATHS.CONTENT_MANAGEMENT}
            >
              <span className="sidebar-menu-icon">
                <BIIcon.BiSolidBookContent size="20" />
              </span>
              <span>Static Pages </span>
            </Link>
          </li>

          <li className="">
            <Link
              className={handleActiveClass(ROUTE_PATHS.WITHDRAW_LIST)}
              to={ROUTE_PATHS.WITHDRAW_LIST}
            >
              <span className="sidebar-menu-icon">
                <FA6Icon.FaDollarSign size="20" />
              </span>
              <span>Withdraw Request</span>
            </Link>
          </li>      

          <li className="">
            <Link
              className={handleActiveClass(ROUTE_PATHS.STATISTICS_LIST)}
              to={ROUTE_PATHS.STATISTICS_LIST}
            >
              <span className="sidebar-menu-icon">
                <FA6Icon.FaStackExchange size="20" />
              </span>
              <span>Statistics Manager</span>
            </Link>
          </li>

          <li className="">
            <Link
              className={handleActiveClass(ROUTE_PATHS.TESTIMONIAL_LIST)}
              to={ROUTE_PATHS.TESTIMONIAL_LIST}
            >
              <span className="sidebar-menu-icon">
                <FA6Icon.FaPeopleLine size="20" />
              </span>
              <span>Testimonials</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};
