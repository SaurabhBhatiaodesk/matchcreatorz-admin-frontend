import { FC , useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as FA6Icon from "react-icons/fa6"; 
import { ROUTE_PATHS } from "../../../routes/routePaths";
import { useConnectDetails } from "../../../store/connect/connectServices";
import { BreadCrumb  } from "../../../components";
import { ColumnDef, PaginationState, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Switch } from "@mui/material";
import { showDate } from "../../../helper"; 

const ConnectsDetails: FC = () => {
  const params = useParams();
  const connectData = useConnectDetails();

  const [sellerData, setSellersData] = useState<any>([]); 

  const [pageRecords, setPageRecors] = useState({
    totalPage: 0,
    totalRecords: 0,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [isConfirm, setIsConfirm] = useState({
    isVisible: false,
    title: "",
    description: "",
    type: "",
    id: "",
    status: false,
  });

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "index",
        header: () => "#",
        cell: (info) => info.row.index + 1,
        enableSorting: false,
      },
      {
        id: "name",
        accessorKey: "name",
        header: () => "Tag Name",
        cell: (info) => info.getValue(),
      },
      {
        id: "created",
        accessorKey: "created",
        header: () => "Created",
        cell: (info) => showDate(info.getValue(), "MMMM Do YYYY, h:mm:ss a"),
      },

      {
        id: "actions",
        header: () => "Actions",
        cell: (info) => (
          <>
            <Link
              to={ROUTE_PATHS.TAGS_PROFILE + info.cell.row.original.id}
              data-toggle="tooltip"
              title="View"
              data-original-title="View"
            >
              <FA6Icon.FaEye size={18} />
            </Link>

            <Switch
              checked={!info.cell.row.original?.isSuspended}
              onChange={(e: any) =>
                setIsConfirm({
                  isVisible: true,
                  title: "Are you sure?",
                  description: e.target.checked
                    ? "Are you sure you want activate this tag?"
                    : "Are you sure you want deactivate this tag?",
                  type: "active",
                  id: info.cell.row.original.id,
                  status: !e.target.checked,
                })
              }
              title="Active / Deactive"
              size="small"
            />

            <Link
              to={ROUTE_PATHS.TAGS_ADD+info.cell.row.original?.id}
              state={{
                isEdit: true,
                tag: {
                  id: info.cell.row.original.id,
                  name: info.cell.row.original.name,
                  connectId: params.id,
                },
              }}
              data-toggle="tooltip"
              title="Edit"
              data-original-title="Edit"
            >
              <FA6Icon.FaPenToSquare size={18} />
            </Link>
          </>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: sellerData,
    // debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
    },
    manualPagination: true, //turn off client-side pagination
    pageCount: pageRecords.totalPage,
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  });

  useEffect(() => {
    connectData.mutate({
      id: params?.id,
    });
  }, []);


  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Connect Details</div>
              <BreadCrumb
                data={[
                  {
                    name: "Dashboard",
                    path: ROUTE_PATHS.DASHBOARD,
                  },
                  { 
                    name: "Conenct",
                    path: ROUTE_PATHS.CONNECT_LIST,
                  },
                  {
                    name: "Conenct Details",
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
                  <h6>Connect Title</h6>
                  <input
                    type="text"
                    placeholder="Title"
                    className="form-control bg-light"
                    value={connectData.data?.data?.planName}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <h6>Price</h6>
                  <input
                    type="text"
                    placeholder="Price"
                    className="form-control bg-light"
                    value={connectData.data?.data?.price}
                    readOnly
                  />
                </div>
              </div>


              <div className="col-md-6">
                <div className="form-group">
                  <h6>No of connects</h6>
                  <input
                    type="text"
                    placeholder="connects"
                    className="form-control bg-light"
                    value={connectData.data?.data?.connects}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <h6>Description</h6>
                  <input
                    type="text"
                    placeholder="description"
                    className="form-control bg-light"
                    value={connectData.data?.data?.description}
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
                    {connectData.data?.data?.created || "N/A"}{" "}
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

export default ConnectsDetails;


