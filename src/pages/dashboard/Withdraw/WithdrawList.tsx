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
import * as FA6Icon from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";

import { ROUTE_PATHS } from "../../../routes/routePaths";
import {
  useWithdrawStatusUpdate,
  useWithdrawList,
} from "../../../store/common/commenServices";
import { BreadCrumb, ConfirmDialog } from "../../../components";
import { showDate } from "../../../helper";

const WithdrawList = () => {
  const navigate = useNavigate();
  const withdrawList = useWithdrawList();
  const withdrawStatus = useWithdrawStatusUpdate();

  const [withdrawData, setWithdrawData] = useState<any>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [pageRecords, setPageRecors] = useState({
    totalPage: 0,
    totalRecords: 0,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const resetPagination = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const [isConfirm, setIsConfirm] = useState({
    isVisible: false,
    title: "",
    description: "",
    type: "",
    id: "",
    status: "",
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
        id: "firstName",
        accessorKey: "firstName",
        header: () => "Name",
        cell: (info) => {
          const userId = info.cell.row.original.userId; // Ensure this is the correct way to access userId
          const value = info.getValue(); // Ensure this correctly retrieves the cell value

          return (
            <Link to={`${ROUTE_PATHS.SELLERS_PROFILE}${userId}`}>
              {value ?? ""}
            </Link>
          );
        },
      },
      {
        id: "amount",
        accessorKey: "amount",
        header: () => "Amount",
        cell: (info) => {
          const value = info.getValue();
          return value !== null && value !== undefined ? `$${info.getValue()}` : "N/A";
        },
      },      
      {
        id: "status",
        accessorKey: "status",
        header: () => "Status",
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
        cell: (info) => {
          const status = info.cell.row.original.status;
          if (status === "Pending") {
            if (status === "Pending") {
              return (
                <>
                  {/* Approve Button */}
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      setIsConfirm({
                        isVisible: true,
                        title: "Are you sure?",
                        description:
                          "Are you sure you want to approve this request?",
                        type: "approve",
                        id: info.cell.row.original?.id,
                        status: "APPROVED",
                      })
                    }
                  >
                    Approve
                  </button>

                  {/* Reject Button */}
                  <button
                    className="mx-3 btn btn-danger"
                    onClick={() =>
                      setIsConfirm({
                        isVisible: true,
                        title: "Are you sure?",
                        description:
                          "Are you sure you want to reject this request?",
                        type: "reject",
                        id: info.cell.row.original?.id,
                        status: "REJECTED",
                      })
                    }
                  >
                    Reject
                  </button>
                </>
              );
            }
          } else if (status === "Approved") {
            return (
              <>
                <button className="btn btn-success" disabled>
                  Approved
                </button>
              </>
            );
          } else if (status === "Rejected") {
            return (
              <>
                <button className="btn btn-danger" disabled>
                  Rejected
                </button>
              </>
            );
          }
          return null;
        },
        enableSorting: false,
      },
      {
        id: "actions",
        header: () => "Details",
        cell: (info) => (
          <>
            <Link
              to={ROUTE_PATHS.WITHDRAW_INFO + info.cell.row.original?.id}
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
    data: withdrawData,
    // debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
    withdrawList
      .mutateAsync({
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        order: "desc",
        search: searchKey,
      })
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setWithdrawData(data?.records);
          setPageRecors({
            totalPage: data?.totalPage,
            totalRecords: data?.totalRecords,
          });
        }
      })
      .catch((err) => {
        console.error("exception while getting withdraw request list", err);
      });
  }, [searchKey, pagination.pageSize, table.getState().pagination.pageIndex]);

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

  const onWithdrawStatusUpdate = (id: string, status: string) => {
    withdrawStatus
      .mutateAsync({
        id: id,
        status: status,
      })
      .then((res) => {
        const { success, message } = res;
        if (success) {
          toast.success(message);
          navigate(0);
          setIsConfirm({
            isVisible: false,
            title: "",
            description: "",
            type: "",
            id: "",
            status: "",
          });
        }
      });
  };

  const onConfirm = () => {
    if (isConfirm.type === "approve") {
      onWithdrawStatusUpdate(isConfirm.id, isConfirm.status);
    }
    if (isConfirm.type === "reject") {
      onWithdrawStatusUpdate(isConfirm.id, isConfirm.status);
    }
  };

  const onCancelAction = useCallback(() => {
    setIsConfirm({
      isVisible: false,
      title: "",
      description: "",
      type: "",
      id: "",
      status: "",
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
        <div className="deshtitle-sec mb-3">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Withdraw Manager</div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  { name: "Withdraw", path: ROUTE_PATHS.WITHDRAW_LIST },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col col-md-6"></div>
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

export default WithdrawList;
