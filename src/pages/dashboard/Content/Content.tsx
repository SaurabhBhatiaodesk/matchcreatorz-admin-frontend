import { FC, useEffect } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as FA6Icon from "react-icons/fa6";

import { ROUTE_PATHS } from "../../../routes/routePaths";
import { usePagesList } from "../../../store/common/commenServices";
import { BreadCrumb } from "../../../components";

const Content: FC = () => {
  const pagesList = usePagesList();

  useEffect(() => {
    pagesList.mutate({
      page: 1,
      limit: 10,
    });
  }, []);

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-7">
              <div className="dash-title">Static Content Management</div>
              <BreadCrumb
                data={[
                  {
                    name: "Dashboard",
                    path: ROUTE_PATHS.DASHBOARD,
                  },
                  {
                    name: "Static Pages Management",
                    path: ROUTE_PATHS.CONTENT_MANAGEMENT,
                  },
                ]}
              />
            </div>
            <div className="col-md-5 text-end">
              <Link
                to={ROUTE_PATHS.CONTENT_MANAGEMENT_DETAILS.replace(":pageName", "create")}
                className="btn btn-outline-primary"
                state={{
                  isEdit: false,
                  pageData: null,
                }}
              >
                Create New Page
              </Link>
            </div>
          </div>
        </div>
        <div className="row">
          <Table id="place-data-table" responsive striped hover>
            <thead>
              <tr>
                <th>#</th>
                <th>CMS Pages</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pagesList?.data?.data?.records &&
              pagesList?.data?.data?.records?.length > 0 ? (
                pagesList?.data?.data?.records?.map((item: any, index: number) => {
                  return (
                    <tr key={`${item?._id}`}>
                      <td>{index + 1}</td>
                      <td>{item?.title}</td>
                      <td className="hide_on_print">
                        <Link
                          to={ROUTE_PATHS.CONTENT_EDIT + item?.slug}
                          state={{
                            isEdit: true,
                            pageData: item,
                          }}
                          data-toggle="tooltip"
                          title="Edit"
                          data-original-title="Edit"
                        >
                          <FA6Icon.FaPenToSquare size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default Content;
