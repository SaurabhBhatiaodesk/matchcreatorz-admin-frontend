import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as FA6Icon from "react-icons/fa6";

import { ROUTE_PATHS } from "../../../routes/routePaths";
import {
  useRatingsReviews,
  useReviewDelete,
} from "../../../store/common/commenServices";
import { ConfirmDialog, InfoDialog } from "../../../components";
import { IconButton, Rating } from "@mui/material";
import { toast } from "react-toastify";

const Reviews = (params: any) => {
  const ratingReviws = useRatingsReviews();

  const deleteReviws = useReviewDelete();

  const navigate = useNavigate();

  const [showInfo, setShowInfo] = useState({
    isVisible: false,
    title: "",
    description: "",
  });

  const onInfoClose = () => {
    setShowInfo({
      isVisible: false,
      title: "",
      description: "",
    });
  };

  const [isConfirm, setIsConfirm] = useState({
    isVisible: false,
    title: "",
    description: "",
    type: "",
    id: "",
    status: false,
  });

  const [ratinsReviewsData, setRatinsReviewsData] = useState([]);
  const [pageRecords, setPageRecors] = useState({
    totalPage: 0,
    totalRecords: 0,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "index",
        accessorKey: "index",
        header: () => "#",
        cell: (info) => info.row.index + 1,
        enableSorting: false,
      },
      {
        id: "from.fullName",
        accessorKey: "from.fullName",
        header: () => "Buyer",
        cell: (info) => (
          <Link
            to={`${ROUTE_PATHS.BUYERS_PROFILE}${info.cell.row.original.from.id}`}
            title={`View ${info.getValue()}'s Profile`}
          >
            {info.getValue()}
          </Link>
        ),
        enableSorting: true,
      },
      {
        id: "to.fullName",
        accessorKey: "to.fullName",
        header: () => "Seller",
        cell: (info) => (
          <Link
            to={`${ROUTE_PATHS.SELLERS_PROFILE}${info.cell.row.original.to.id}`}
            data-toggle="tooltip"
            title={`View ${info.getValue()}'s Profile`}
          >
            {info.getValue()}
          </Link>
        ),
        enableSorting: true,
      },
      {
        id: "booking.id",
        accessorKey: "booking.id",
        header: () => "Booking ID",
        cell: (info) => (
          <Link
            // to={`${ROUTE_PATHS.BOOKINGS_LIST}/${info.getValue()}`}
            to={`${ROUTE_PATHS.BOOKINGS_LIST}`}
            data-toggle="tooltip"
            title={`View Booking #${info.getValue()}`}
          >
            {info.getValue()}
          </Link>
        ),
        enableSorting: true,
      },
      {
        id: "totalStar",
        accessorKey: "totalStar",
        header: () => "Total Ratings",
        cell: (info: any) => (
          <Rating
            name="read-only"
            value={info.getValue()}
            precision={0.5}
            readOnly
          />
        ),
        enableSorting: true,
      },
      {
        id: "reviewMessage",
        accessorKey: "reviewMessage",
        header: () => "Review Message",
        cell: (info: any) => (
          <p className="lh-base" style={{ maxWidth: "180px" }}>
            {info.cell.row.original.reviewMessage.length <= 50 ? (
              <span>{info.getValue()}</span>
            ) : (
              <span>
                {info.getValue().slice(0, 50)}
                <Link
                  to="#"
                  className="text-primary fw-medium"
                  style={{ fontSize: "11px" }}
                  onFocus={() => {}}
                  onClick={() =>
                    setShowInfo({
                      isVisible: true,
                      title: info.cell.row.original.fullName,
                      description: info.getValue(),
                    })
                  }
                >
                  {" read more"}
                </Link>
              </span>
            )}
          </p>
        ),
        enableSorting: false,
      },
      {
        id: "actions",
        header: () => "Actions",
        cell: (info) => (
          <>
            <Link
              to={ROUTE_PATHS.REVIEW_UPDATE}
              state={{
                isEdit: true,
                info: {
                  id: info.cell.row.original.id,
                  obj: { ...info.cell.row.original },
                },
              }}
              data-toggle="tooltip"
              title="Edit"
            >
              <FA6Icon.FaPenToSquare size={18} />
            </Link>
            <IconButton
              aria-label="delete"
              title="Delete"
              size="small"
              onClick={() =>
                setIsConfirm({
                  isVisible: true,
                  title: "Are you sure",
                  description: " you want to delete this Review?",
                  type: "delete",
                  id: info.cell.row.original?.id,
                  status: false,
                })
              }
            >
              <FA6Icon.FaTrash size={18} />
            </IconButton>
          </>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: ratinsReviewsData,
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
    if (params?.id) {
      ratingReviws
        .mutateAsync({
          userId: params.id ?? "",
          page: table.getState().pagination.pageIndex + 1,
          limit: pagination.pageSize,
          order: "desc",
          columnNo: 0,
          userName: '',
        })
        .then((res) => {
          const { success, data } = res;
          if (success) {
            setRatinsReviewsData(data?.records);
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
          console.error(":::", err);
        });
    }
  }, [params?.id, pagination.pageSize, table.getState().pagination.pageIndex]);
  

  const onConfirm = () => {
    if (isConfirm.type === "delete") {
      deleteReviws
        .mutateAsync({
          id: isConfirm.id,
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
              status: false,
            });
            navigate(0);
          }
        });
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

  return (
    <section id="">
      <InfoDialog {...showInfo} onClose={onInfoClose} />
      <ConfirmDialog
        {...isConfirm}
        onConfirm={onConfirm}
        onCancel={onCancelAction}
      />
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

        <div className="row">
          <div className="col-sm-12 col-md-5 align-items-center d-flex">
            <div
              className="dataTables_info"
              id="dynamic-table_info"
              aria-live="polite"
            >
              <label className="">
                Showing{" "}
                <strong>
                  {table.getPageCount() >= 1
                    ? table.getState().pagination.pageIndex + 1
                    : "0"}{" "}
                  of {table.getPageCount().toLocaleString()}
                </strong>{" "}
                Pages
              </label>
            </div>
          </div>
          <div className="col-sm-12 col-md-7 justify-content-end d-flex">
            <div className="dataTables_paginate paging_simple_numbers">
              <ul className="pagination align-items-center">
                <li style={{ marginRight: "6px" }}>
                  <span className="flex items-center">
                    Go to page:{" "}
                    <input
                      type="number"
                      value={table.getState().pagination.pageIndex + 1}
                      onChange={(e) => {
                        const page = e.target.value
                          ? Number(e.target.value) - 1
                          : 0;
                        table.setPageIndex(page);
                      }}
                      className="border p-2 rounded-1 w-10 bg-white"
                    />
                  </span>
                </li>
                <li
                  className={`"paginate_button page-item ${
                    !table.getCanPreviousPage() ? "disabled" : ""
                  } "`}
                >
                  <button
                    className="page-link  rounded-start-1"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {"<<"}
                  </button>
                </li>
                <li
                  className={`"paginate_button page-item previous ${
                    !table.getCanPreviousPage() ? "disabled" : ""
                  } "`}
                >
                  <button
                    className="page-link"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </button>
                </li>
                <li
                  className={`"paginate_button page-item next ${
                    !table.getCanNextPage() ? "disabled" : ""
                  } "`}
                >
                  <button
                    className="page-link"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </button>
                </li>
                <li
                  className={`"paginate_button page-item ${
                    !table.getCanNextPage() ? "disabled" : ""
                  } "`}
                >
                  <button
                    className="page-link rounded-1"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    {">>"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </section>
  );
};

export default Reviews;
