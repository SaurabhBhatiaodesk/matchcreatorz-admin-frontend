import { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import * as FA6Icon from "react-icons/fa6";
import { toast } from "react-toastify";

import { ROUTE_PATHS } from "../../../routes/routePaths";
import { BreadCrumb, ConfirmDialog } from "../../../components";
import {
  useBannerDelete,
  useBannersList,
} from "../../../store/common/commenServices";
import { Config } from "../../../config/AppConfig";
import { IconButton } from "@mui/material";

const BannersList: FC = () => {
  const navigate = useNavigate();
  const banners = useBannersList();
  const bannerDelete = useBannerDelete();

  const [bannersData, setBannersData] = useState<any>();
  const [isConfirm, setIsConfirm] = useState({
    isVisible: false,
    title: "",
    description: "",
    type: "",
    id: "",
    status: false,
  });

  useEffect(() => {
    banners.mutateAsync({ page: 0, limit: 10 }).then((res: any) => {
      const { success, data } = res;
      if (success) {
        setBannersData(data?.totalRecords);
      }
    });
  }, [bannerDelete.isSuccess]);

  const onConfirm = () => {
    if (isConfirm.type === "delete") {
      bannerDelete.mutateAsync({ bannerId: isConfirm.id }).then((res) => {
        const { success, message } = res;

        if (success) {
          toast.success(message);
          setIsConfirm({
            isVisible: false,
            title: "",
            description: "",
            type: "",
            id: "",
            status: false,
          });
          // Show the toast notification and wait for a brief moment before continuing
          setTimeout(() => {
            navigate(0);
          }, 2000); // Adjust the delay time (in milliseconds) as needed
        }
        
      });
    }
  };

  const onActionCancel = () => {
    setIsConfirm({
      isVisible: false,
      title: "",
      description: "",
      type: "",
      id: "",
      status: false,
    });
  };

  return (
    <section id="main-content" className="p-4">
      <ConfirmDialog
        {...isConfirm}
        onConfirm={onConfirm}
        onCancel={onActionCancel}
      />

      <div className="wrapper">
        <div className="deshtitle-sec mb-4">
          <div className="row">
            <div className="col-md-8">
              <h2 className="dash-title">Banner Manager</h2>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  { name: "Banners", path: ROUTE_PATHS.BANNERS_LIST },
                ]}
              />
            </div>
            <div className="col-md-4 text-end">
              <Link
                to={ROUTE_PATHS.BANNERS_ADD}
                className="btn btn-outline-primary"
              >
                Add Banner
              </Link>
            </div>
          </div>
        </div>

        <div className="row">
          {bannersData &&
            bannersData.map((banner: any) => (
              <div className="col-md-4 mb-4 " key={banner.id}>
                {" "}
                {/* Responsive column layout */}
                <div className="card shadow-sm rounded-3 shadow">
                  {" "}
                  {/* Card for each banner */}
                  <div className="card-body d-flex justify-content-between align-items-center shadow">
                    <div className="rolling-text-container">
                      <h5 className="rolling-text"></h5>{" "}
                      {/* Rolling text effect */}
                      {banner.url}
                    </div>
                    <IconButton
                      aria-label="delete"
                      title="Delete"
                      size="small"
                      onClick={() => {
                        setIsConfirm({
                          isVisible: true,
                          title: "Are you sure?",
                          description:
                            "Are you sure you want to delete this banner?",
                          type: "delete",
                          id: banner?.id,
                          status: false,
                        });
                      }}
                    >
                      <FA6Icon.FaTrash size={14} />
                    </IconButton>
                  </div>
                  <Table striped bordered hover className="mb-0">
                    {" "}
                    {/* Added borders and hover effect */}
                    <tbody>
                      <tr>
                        <td className="p-0">
                          {" "}
                          {/* Removed padding for better image alignment */}
                          <div className="d-flex justify-content-center align-items-center">
                            {" "}
                            {/* Center the image */}
                            <div
                              className="border rounded-1"
                              style={{
                                width: "100%",
                                height: "174px",
                                overflow: "hidden",
                              }}
                            >
                              <img
                                src={Config.mediaUrl(banner.image)} // Use your image URL function
                                className="w-100 h-100 object-fit-cover" // Ensure the image covers the container without distortion
                                alt="Banner"
                                style={{ objectFit: "cover" }} // Ensures the image fills the container while maintaining aspect ratio
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            ))}
        </div>
      </div>

      <style>{`
        .rolling-text-container {
          white-space: nowrap; /* Prevent text from wrapping */
          overflow: hidden; /* Hide overflow */
          width: 100%; /* Set a fixed width for the container */
          position: relative;
        }

        .rolling-text {
          display: inline-block; /* Allow scrolling */
          animation: scroll 10s linear infinite; /* Scroll animation */
          position: absolute;
          left: 100%; /* Start from the right */
          animation-delay: 2s; /* Delay before starting the scroll */
        }

        @keyframes scroll {
          0% {
            transform: translateX(0); /* Start position */
          }
          100% {
            transform: translateX(-100%); /* End position */
          }
        }
      `}</style>
    </section>
  );
};

export default BannersList;
