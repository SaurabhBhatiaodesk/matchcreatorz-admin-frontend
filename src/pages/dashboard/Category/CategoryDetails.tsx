import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as FA6Icon from "react-icons/fa6";
import { flexRender } from "@tanstack/react-table";
import { Table } from "react-bootstrap";
import { ROUTE_PATHS } from "../../../routes/routePaths";
import {
  useCategoryDetails,
  useTagsList,
  useTagsStatusUpdate,
} from "../../../store/category/categoryServices";
import { BreadCrumb, ConfirmDialog } from "../../../components";
import {
  ColumnDef,
  PaginationState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Switch } from "@mui/material";
import { showDate } from "../../../helper";
import { toast } from "react-toastify";

const CategoryDetails: FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const categoryData = useCategoryDetails();
  const tagsStatus = useTagsStatusUpdate();
  const tagData = useTagsList();

  const [sellerData, setPalsData] = useState<any>([]);

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
              to={ROUTE_PATHS.TAGS_ADD + info.cell.row.original?.id}
              state={{
                isEdit: true,
                tag: {
                  id: info.cell.row.original.id,
                  name: info.cell.row.original.name,
                  categoryId: params.id,
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
    categoryData.mutate({
      id: params?.id,
    });
  }, []);

  const onTagsStatusUpdate = (id: string, status: boolean) => {
    tagsStatus
      .mutateAsync({
        id: id,
        status: status,
      })
      .then((res) => {
        const { success, message } = res;
        if (success) {
          toast.success(message);
          setIsConfirm({
            isVisible: false,
            title: "",
            description: "",
            type: "",
            id: "",
            status: !status,
          });
          setTimeout(() => {
            navigate(0);
          }, 1500);
        }
      })
      .catch((err) => {
        console.error("exception while getting category list", err);
      });
  };

  const onConfirm = () => {
    if (isConfirm.type === "active") {
      onTagsStatusUpdate(isConfirm.id, isConfirm.status);
    }
  };

  const onCancelAction = useCallback(() => {
    setIsConfirm({
      isVisible: false,
      title: "",
      description: "",
      type: "",
      id: "",
      status: false,
    });
  }, []);

  useEffect(() => {
    categoryData.mutate({
      id: params?.id,
    });

    tagData
      .mutateAsync({
        page: 1 ?? table.getState().pagination.pageIndex + 1,
        limit: pagination.pageSize,
        order: "desc",
        id: params?.id,
      })
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setPalsData(data?.records);
          setPageRecors({
            totalPage: data?.totalPage,
            totalRecords: data?.totalRecords,
          });
          setPagination((prev) => ({
            ...prev,
            pageIndex: data?.page - 1,
          }));
        }
      })
      .catch((err) => {
        console.error("exception while getting category list", err);
      });
  }, []);

  return (
    <section id="main-content">
      <ConfirmDialog
        {...isConfirm}
        onConfirm={onConfirm}
        onCancel={onCancelAction}
      />
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Category Details</div>
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
                    name: "Category Details",
                    path: "",
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="form-pal-details">
            {/* <h4>Category Details</h4> */}
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <h6>Title</h6>
                  <input
                    type="text"
                    placeholder="Title"
                    className="form-control bg-light"
                    value={categoryData.data?.data?.title}
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
                    {categoryData.data?.data?.created || "N/A"}{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="wrapper">
          <div className="deshtitle-sec">
            <div className="dash-title">Tags List</div>
          </div>

          <div className="row">
            <div className="col col-md-6">
              <div className="d-flex justify-content-start mb-3">
                <Link
                  to={ROUTE_PATHS.TAGS_ADD + categoryData.data?.data?.id}
                  className="btn btn-outline-primary"
                  role="button"
                >
                  Add Tag
                </Link>
              </div>
            </div>
            <div className="col col-md-6">
              <div className="d-flex justify-content-end mb-3"></div>
            </div>
          </div>

          <div className="row">
            <Table responsive striped hover>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          key={header.id}
                          colSpan={header.colSpan}
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <i className="fa fa-sort-up"></i>,
                            desc: <i className="fa fa-sort-down"></i>,
                          }[header.column.getIsSorted() as string] ?? null}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows?.length > 0 ? (
                  table.getRowModel().rows.map((row) => {
                    return (
                      <tr key={row.id} style={{ height: "74px" }}>
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryDetails;
