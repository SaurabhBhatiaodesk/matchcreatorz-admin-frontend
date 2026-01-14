import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";

import { ROUTE_PATHS } from "../../../routes/routePaths";
import { useTagsDetails } from "../../../store/category/categoryServices";
import { BreadCrumb } from "../../../components";

const TagDetails: FC = () => {
  const params = useParams();

  const details = useTagsDetails();

  useEffect(() => {
    details.mutate({
      id: params?.id,
    });

    details
      .mutateAsync({
        id: params?.id,
      })
      .then((res) => {
        const { success } = res;
        if (success) {
        }
      })
      .catch((err) => {
        console.error("", err);
      });
  }, []);

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Tags Details</div>
              <BreadCrumb
                data={[
                  {
                    name: "Dashboard",
                    path: ROUTE_PATHS.DASHBOARD,
                  },
                  {
                    name: "Category",
                    path: ROUTE_PATHS.CATEGORY_LIST,
                  },
                  {
                    name: "Tags",
                    path:
                      ROUTE_PATHS.CATEGORY_PROFILE +
                      details.data?.data?.categoryId,
                  },
                  {
                    name: "Tag Details",
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
                  <h6>Name</h6>
                  <input
                    type="text"
                    placeholder="Name"
                    className="form-control bg-light"
                    value={details.data?.data?.name}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <h6>Created Date</h6>
                  <input
                    type="text"
                    placeholder="Created"
                    className="form-control bg-light"
                    value={details.data?.data?.created}
                    readOnly
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

export default TagDetails;
