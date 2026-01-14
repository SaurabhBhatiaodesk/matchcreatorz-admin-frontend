import { FC, useCallback, useEffect, useMemo, useState } from "react";
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
import { Link } from "react-router-dom";
import * as FA6Icon from "react-icons/fa6";

import { ROUTE_PATHS } from "../../../routes/routePaths";
import { useBookingsList } from "../../../store/users/usersServices";
import { showDate } from "../../../helper";
import { BreadCrumb } from "../../../components";

const BookingList: FC = () => {
  const bookingList = useBookingsList();

  const [bookingData, setBookingData] = useState<any>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [pageRecords, setPageRecors] = useState({
    totalPage: 0,
    totalRecords: 0,
  });

  const [selectedSubStatus, setSelectedSubStatus] = useState("");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const resetPagination = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

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
        id: "id",
        accessorKey: "id",
        header: () => "Booking ID",
        cell: (info) => `#${info.getValue()}`, // Updated to show the booking ID with `#`
        enableSorting: false,
      },
      {
        id: "category.title",
        accessorKey: "category.title",
        header: () => "Category",
        cell: (info) => info.getValue(),
        enableSorting: false,
      },
      {
        id: "title",
        accessorKey: "title",
        header: () => "Title",
        cell: (info) => info.getValue(),
        enableSorting: false,
      },
      {
        id: "paymentStatus",
        accessorKey: "paymentStatus",
        header: () => "Payment Status",
        cell: (info) => info.getValue(),
        enableSorting: false,
      },
      {
        id: "seller.fullName",
        accessorKey: "seller.fullName",
        header: () => "Seller",
        cell: (info) => (
          <Link
            to={`${ROUTE_PATHS.SELLERS_PROFILE}${info.cell.row.original.id}`}
            data-toggle="tooltip"
            title={`View ${info.getValue()}'s Profile`}
          >
            {info.getValue()}
          </Link>
        ),
        enableSorting: true,
      },
      {
        id: "buyer.fullName",
        accessorKey: "buyer.fullName",
        header: () => "Buyer",
        cell: (info) => (
          <Link
            to={`${ROUTE_PATHS.BUYERS_PROFILE}${info.cell.row.original.id}`}
            title={`View ${info.getValue()}'s Profile`}
          >
            {info.getValue()}
          </Link>
        ),
        enableSorting: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: () => "Status",
        cell: (info: any) => (
          <span
            className={`${StatusColor(info.getValue())} fw-medium`}
          >
            {info.getValue()}
          </span>
        ),
        enableSorting: false,
      },
      {
        id: "created",
        accessorKey: "created",
        header: () => "Created",
        cell: (info) => showDate(info.getValue(), "MMM,DD YYYY, h:mm A"),
      },
      {
        id: "actions",
        header: () => "Actions",
        cell: (info) => (
          <>
            <Link
              to={ROUTE_PATHS.BOOKING_DETAILS + "/" + info.cell.row.original.id}
              data-toggle="tooltip"
              title="View"
              data-original-title="View"
            >
              <FA6Icon.FaEye size={18} />
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
    data: bookingData,
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
    bookingList
      .mutateAsync({
        page: searchKey ? 1 : table.getState().pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: "desc",
        status: selectedStatus || "", // Main status
        subStatus: selectedSubStatus ?? "",
        search: searchKey,
      })
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setBookingData(data?.records);
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
        console.error("exception while getting country list", err);
      });
  }, [
    searchKey,
    selectedSubStatus,
    selectedStatus,
    pagination.pageSize,
    table.getState().pagination.pageIndex,
  ]);

  const handleFilterValue = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>, type: string) => {
      const value = e.target.value;
      if (type === "Status") {
        setSelectedStatus(value);
        if (value !== "Active") {
          setSelectedSubStatus(""); // Reset sub-status if status is not "Active"
        }
      } else if (type === "SubStatus") {
        setSelectedSubStatus(value); // Set sub-status
      }
    },
    []
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value) {
      setSearchKey(e.currentTarget.value);
      resetPagination();
    } else {
      setSearchKey("");
    }
  }, []);

  const clearSearch = () => {
    setSearchKey("");
  };

  const StatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-warning";
      case "ACTIVE":
        return "text-primary";
      case "COMPLETE":
        return "text-success";
      default:
        return "";
    }
  };

  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Bookings Manager</div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  { name: "Bookings", path: ROUTE_PATHS.BOOKINGS_LIST },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="row mb-3 align-items-center">
            <div className="col col-md-6">
              <div className="d-flex flex-row mb-3">
                <div className="d-flex align-items-center">
                  {/* Main status select */}
                  <select
                    className="form-select form-select-sm rounded-1"
                    onChange={(e) => {
                      handleFilterValue(e, "Status");
                    }}
                    value={selectedStatus}
                    style={{
                      height: "30px",
                      width: "100%",
                      fontSize: "12px",
                      marginLeft: 10,
                    }}
                  >
                    <option value="ALL">
                      ALL
                    </option>
                    {[
                      { label: "Active", value: "Active" },
                      { label: "Canceled", value: "Cancelled" },
                      { label: "Completed", value: "Completed" },
                      { label: "In-dispute", value: "In-dispute" },
                    ].map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>

                  {/* Conditional rendering for sub-status dropdown if "Active" is selected */}
                  {selectedStatus === "Active" && (
                    <select
                      className="form-select form-select-sm rounded-1"
                      onChange={(e) => handleFilterValue(e, "SubStatus")}
                      value={selectedSubStatus}
                      style={{
                        height: "30px",
                        width: "100%",
                        fontSize: "12px",
                        marginLeft: 10,
                      }}
                    >
                      <option value="">Select Sub-Status</option>
                      {[
                        { label: "Pending", value: "PENDING" },
                        { label: "Ongoing", value: "ONGOING" },
                        {
                          label: "Amidst Cancellation",
                          value: "Amidst Cancellation",
                        },
                        {
                          label: "Amidst Completion Process",
                          value: "Amidst Completion Process",
                        },
                      ].map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
            <div className="col col-md-6">
              <div className="d-flex justify-content-end position-relative">
                <input
                  type="search"
                  className="form-control form-control-sm bg-white border rounded-1 py-2 px-5"
                  placeholder="Search here"
                  aria-controls="dynamic-table1"
                  value={searchKey} // Bind the value to a state
                  onChange={handleSearch}
                  style={{ height: "30px", width: "50%", fontSize: "12px" }}
                />
                {searchKey && (
                  <button
                    className="btn btn-clear position-absolute"
                    onClick={clearSearch}
                    style={{
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "34px",
                    }}
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>
          </div>

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
      </div>
    </section>
  );
};

export default BookingList;
