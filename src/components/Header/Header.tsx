import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";

import { DefaultUser } from "../../constant";
import { useAuthStore } from "../../store/auth/authStore";
import { ROUTE_PATHS } from "../../routes/routePaths";
import { Config } from "../../config/AppConfig";
import { useLogout } from "../../store/auth/authServices";
import { useNotificationBadgesList } from "../../store/notification/notificationServices";

export const Header: FC = () => {
  const auth = useAuthStore();
  const logout = useLogout();
  const notificationList = useNotificationBadgesList();
  const [notificationData, setNotificationData] = useState<any>([]);

  let allNotification = notificationData.filter((a)=> a.isRead === false)

  useEffect(() => {
    notificationList
      .mutateAsync({
        skip: 0,
        limit: 10,
        source: 'dashboard'
      })
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setNotificationData(data?.records);
        }
      })
      .catch((err) => {
        console.error("exception while getting setNotificationData list", err);
      });
  }, []);

  const handleLogout = () => {
    logout
      .mutateAsync()
      .then((res) => {
        if (res.success) {
          auth.logout();
          toast.success(res?.message);
        }
      })
      .catch((err) => console.error("exception while logout", err));
  };

  return (
    <header className="header white-bg">
      <div className="sidebar-toggle-box">
        <i className="fa fa-bars" />
      </div>
      <div className="top-nav ">
        <ul className="nav pull-right top-menu">
          {/* Bell Icon for Notifications */}
          <li className="nav-item dropdown">
            <Dropdown>
              <Dropdown.Toggle
                id="notificationDropdown"
                as="a"
                className="nav-link p-3"
              >
                <i className="fa fa-bell" style={{ fontSize: "20px" }} />
                 {allNotification.length > 0 && (
                    <>
                      <span className="badge bg-danger">
                        {allNotification.length}
                      </span>{" "}
                    </>
                 )}
               
                {/* Notification Badge */}
              </Dropdown.Toggle>
              <Dropdown.Menu
                className="notification-menu"
                style={{ maxHeight: "200px", overflowY: "auto" }} // Scroll styling
              >
                {allNotification.map((notification:any) => {
                  // Check if the notification has metadata and type
                 // const metaDataType = notification.metaData?.type ?? notification?.status;

                  // Define the appropriate route based on the notification type
                 /*  const routeLink =
                    metaDataType === "SUPPORT"
                      ? "/support" // Route to Support Manager
                      : metaDataType === "BOOKING"
                      ? `/bookings`
                      : metaDataType === "NEW_SELLER_ADDED"
                      ? `/sellers`
                      : metaDataType === "NEW_BUYER_ADDED"
                      ? `/buyers`
                      : metaDataType === "NEW_REVIEW_ADDED"
                      ? `/reviews`
                      : "#"; // Default fallback route */

                  return (
                    <Dropdown.Item key={notification.id}>
                      <Link to="/notification">
                        <i className="fa fa-info-circle me-2" />
                        {notification.description}
                      </Link>
                    </Dropdown.Item>
                  );
                })}

                {/* Static item to view all notifications */}
                <Dropdown.Item className="text-center">
                  <Link to={ROUTE_PATHS.NOTIFICATION_LIST}>
                    See all notifications
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>

          {/* User Information */}
          <span className="username pt-3">
            {auth?.userDetails?.fullName} <br />
          </span>

          <Dropdown>
            <Dropdown.Toggle>
              <Link
                to="#"
                className="nav-link userset"
                data-bs-toggle="dropdown"
              >
                <img
                  alt="admin"
                  src={
                    auth?.userDetails?.avatar
                      ? Config.mediaUrl(auth?.userDetails?.avatar)
                      : DefaultUser
                  }
                  style={{ width: "30px", height: "30px", borderRadius: 25 }}
                />
              </Link>
            </Dropdown.Toggle>

            <Dropdown.Menu className="profile_menu">
              <Dropdown.Item>
                <Link className="dropdown-item" to={ROUTE_PATHS.ADMIN_PROFILE}>
                  <i className="cms me-2" data-feather="user" /> My Profile
                </Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link
                  className="dropdown-item"
                  to={ROUTE_PATHS.CHANGE_PASSWORD}
                >
                  <i className="cms me-2" data-feather="user" /> Change Password
                </Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link className="dropdown-item" to={ROUTE_PATHS.ADMIN_SETTINGS}>
                  <i className="cms me-2" data-feather="user" /> Settings
                </Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link to="/" className="dropdown-item" onClick={handleLogout}>
                  <i className="cms me-2" data-feather="user" /> Logout
                </Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </ul>
      </div>
    </header>
  );
};
