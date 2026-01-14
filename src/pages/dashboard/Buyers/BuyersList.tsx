import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IconButton, Switch } from "@mui/material";
import * as FA6Icon from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";

import { ROUTE_PATHS } from "../../../routes/routePaths";
import {
  useBuyerStatusUpdate,
  useBuyerList,
  useBuyerDelete,
} from "../../../store/users/usersServices";
import { BreadCrumb, ConfirmDialog } from "../../../components";
import { Config } from "../../../config/AppConfig";
import { DefaultUser } from "../../../constant";
import { showDate } from "../../../helper";
import DatePicker from "react-datepicker"; // Import the date picker
import "react-datepicker/dist/react-datepicker.css"; // Import styles

const BuyersList = () => {
  const navigate = useNavigate();
  const buyersList = useBuyerList();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageRecords, setPageRecors] = useState({
    totalPage: 0,
    totalRecords: 0,
  });

  const resetPagination = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };


  const buyerAccountStatus = useBuyerStatusUpdate();
  const deleteBuyer = useBuyerDelete();

  const [buyerData, setBuyerData] = useState<any>([]);
  const [searchKey, setSearchKey] = useState<string>("");

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

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
        id: "avatar",
        accessorKey: "avatar",
        header: () => "Avatar",
        cell: (info: any) => (
          <img
            src={
              info.getValue() ? Config.mediaUrl(info.getValue()) : DefaultUser
            }
            alt={info.cell.row.original?.fullName}
            className="rounded-circle"
            width={54}
            height={54}
          />
        ),
        enableSorting: false,
      },
      {
        id: "fullName",
        accessorKey: "fullName",
        header: () => "Full Name",
        cell: (info) => info.getValue(),
      },
      {
        id: "email",
        accessorKey: "email",
        header: () => "Email",
        cell: (info) => info.getValue(),
        enableSorting: false,
      },
      {
        id: "formattedPhone",
        accessorKey: "formattedPhone",
        header: () => "Mobile No.",
        cell: (info) => info.getValue(),
        enableSorting: false,
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
        cell: (totalRecords) => (
          <>
            <Link
              to={
                ROUTE_PATHS.BUYERS_PROFILE + totalRecords.cell.row.original.id
              }
              data-toggle="tooltip"
              title="View"
              data-original-title="View"
            >
              <FA6Icon.FaEye size={18} />
            </Link>

            <Switch
              checked={!totalRecords.cell.row.original?.isSuspended}
              onChange={(e: any) =>
                setIsConfirm({
                  isVisible: true,
                  title: "Are you sure?",
                  description: e.target.checked
                    ? "Are you sure you want activate this account?"
                    : "Are you sure you want deactivate this account?",
                  type: "active",
                  id: totalRecords.cell.row.original.id,
                  status: !e.target.checked,
                })
              }
              title="Active / Deactive"
              size="small"
            />

            <IconButton
              aria-label="delete"
              title="Delete"
              size="small"
              onClick={() => {
                setIsConfirm({
                  isVisible: true,
                  title: "Are you sure?",
                  description: "Are you sure you want delete this buyer?",
                  type: "delete",
                  id: totalRecords.cell.row.original?.id,
                  status: false,
                });
              }}
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
    data: buyerData,
    getCoreRowModel: getCoreRowModel(), //for row col set
    getSortedRowModel: getSortedRowModel(), //for sort
    getFilteredRowModel: getFilteredRowModel(), //for filter
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    manualPagination: true, //turn off client-side pagination
    pageCount: pageRecords.totalPage,
  });

  useEffect(() => {
    buyersList
      .mutateAsync({
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        columnNo: 0,
        search: searchKey,
        startDate: startDate ? startDate.toISOString() : '',
        endDate: endDate ? endDate.toISOString() : ''
      })
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setBuyerData(data?.totalRecords);

          setPageRecors({
            totalPage: data?.totalPage,
            totalRecords: data?.totalRecords.length,
          });
        }
      })
      .catch((err) => {
        console.error("exception while getting buyersList list", err);
      });
  }, [
    searchKey,
    pagination.pageSize,
    table.getState().pagination.pageIndex,
    buyerAccountStatus.isSuccess,
    startDate,
    endDate,
  ]);

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

  const onBuyerAccountStatusUpdate = (id: string, status: boolean) => {
    buyerAccountStatus
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
            status: false,
          });
        }
      });
  };

  const onConfirm = () => {
    if (isConfirm.type === "active") {
      onBuyerAccountStatusUpdate(isConfirm.id, isConfirm.status);
    } else if (isConfirm.type === "delete") {
      deleteBuyer
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
    <section id="main-content">
      <ConfirmDialog
        {...isConfirm}
        onConfirm={onConfirm}
        onCancel={onCancelAction}
      />

      <div className="mainmap-section">
        <div className="wrapper">
          <div className="deshtitle-sec">
            <div className="row">
              <div className="col-md-8">
                <div className="dash-title">Buyers Manager</div>
                <BreadCrumb
                  data={[
                    { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                    { name: "Buyers", path: ROUTE_PATHS.BUYERS_LIST },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-start mx-1 mb-3">
            <Link
              to={ROUTE_PATHS.BUYERS_ADD_EDIT}
              className="btn btn-outline-primary px-5 py-2"
              role="button"
            >
              Add Buyer
            </Link>
          </div>

          <div className="row">
            <div className="col col-md-6">
              <div className="date-picker d-flex ">
                <DatePicker
                  className="form-control form-control-sm bg-white border rounded-1" // Use margin-end for spacing
                  selected={startDate}
                  onChange={(date: any) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start Date"
                />
                <DatePicker
                  className="mx-3 form-control form-control-sm bg-white border rounded-1"
                  selected={endDate}
                  onChange={(date: any) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="End Date"
                />
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

                  {table.getPageCount() === 1 &&
                    table.getState().pagination.pageIndex + 1 === 1 && (
                      <li className="paginate_button page-item active">
                        <button
                          className="page-link"
                          defaultValue={
                            table.getState().pagination.pageIndex + 1
                          }
                        >
                          {table.getState().pagination.pageIndex + 1}
                        </button>
                      </li>
                    )}

                  {table.getPageCount() >= 3 &&
                    Array.from({ length: 3 }, (_, i) => i + 1).map(
                      (pageNumber) => (
                        <li
                          key={pageNumber}
                          className={`paginate_button page-item ${
                            pageNumber ===
                            table.getState().pagination.pageIndex + 1
                              ? "active"
                              : "disabled"
                          }`}
                        >
                          <button
                            className="page-link"
                            value={pageNumber}
                            onClick={() => table.setPageIndex(pageNumber - 1)}
                          >
                            {pageNumber}
                          </button>
                        </li>
                      )
                    )}

                  {table.getPageCount() >= 1 &&
                    table.getState().pagination.pageIndex > 2 && (
                      <li className="paginate_button page-item active">
                        <button
                          className="page-link"
                          defaultValue={
                            table.getState().pagination.pageIndex + 1
                          }
                        >
                          {table.getState().pagination.pageIndex + 1}
                        </button>
                      </li>
                    )}

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
      </div>
    </section>
  );
};

export default BuyersList;
