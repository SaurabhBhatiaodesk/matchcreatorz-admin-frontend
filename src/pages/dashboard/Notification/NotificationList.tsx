import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IconButton } from "@mui/material";
import * as FA6Icon from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";

import { ROUTE_PATHS } from "../../../routes/routePaths";
import {
  useNotificationList,
  useNotificationDelete
} from "../../../store/notification/notificationServices";
import { BreadCrumb, ConfirmDialog } from "../../../components";
import { showDate } from "../../../helper";
import { toast } from "react-toastify";

const NotificationList = () => {
  const navigate = useNavigate();
  const notificationList = useNotificationList();
  const deleteNotification = useNotificationDelete();
  const [usersData, setUsersData] = useState<any>([]);
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
        id: "subject",
        accessorKey: "subject",
        header: () => "Title",
        cell: (info) => info.getValue(),
      },
      {
        id: "description",
        accessorKey: "description",
        header: () => "Description",
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

            <IconButton
              aria-label="delete"
              title="Delete"
              size="small"
              onClick={() => {
                setIsConfirm({
                  isVisible: true,
                  title: "Are you sure?",
                  description: "Are you sure you want delete this?",
                  type: "delete",
                  id: info.cell.row.original?.id,
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
    data: usersData,
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
    notificationList
      .mutateAsync({
        page: table.getState().pagination.pageIndex ,
        limit: pagination.pageSize,
        order: "desc",
        columnNo: 0,
        source: 'notification'
       /*  search: searchKey, */
      })
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setUsersData(data?.records);
          setPageRecors({
            totalPage: data?.totalPage,
            totalRecords: data?.totalRecords,
          });
        }
      })
      .catch((err) => {
        console.error("exception while getting category list", err);
      });
  }, [
   /*  searchKey, */
    pagination.pageSize,
    table.getState().pagination.pageIndex
  ]);

  const onConfirm = () => {
    if (isConfirm.type === "delete") {
      deleteNotification
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
            setTimeout(() => {
              navigate(0);
            }, 1500);
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

      <div className="wrapper">
        <div className="deshtitle-sec mb-3">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Notification Manager</div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  { name: "Notification", path: ROUTE_PATHS.CATEGORY_LIST },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="row">
        <div className="row mb-3 align-items-center">
            <div className="col col-md-12">
              <div className="d-flex justify-content-end mb-3">
                <Link
                  to={ROUTE_PATHS.NOTIFICATION_ADD}
                  className="btn btn-outline-primary"
                  role="button"
                >
                  Send Broadcast
                </Link>
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

export default NotificationList;
