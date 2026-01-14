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
import { IconButton, Switch } from "@mui/material";
import * as FA6Icon from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";

import { ROUTE_PATHS } from "../../../routes/routePaths";
import {
  useConnectStatusUpdate,
  useConnectList,
  useConnectDelete,
} from "../../../store/connect/connectServices";
import { BreadCrumb, ConfirmDialog } from "../../../components";
import { showDate } from "../../../helper";

const ConnectList = () => {
  const navigate = useNavigate();
  const connectList = useConnectList();
  const connectStatus = useConnectStatusUpdate();
  const deleteConnect = useConnectDelete();

  const [sellerData, setSelleData] = useState<any>([]);
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
        id: "title",
        accessorKey: "planName",
        header: () => "Connects Title",
        cell: (info) => info.getValue(),
      },
      {
        id: "price",
        accessorKey: "price",
        header: () => "Connects Price",
        cell: (info) => info.getValue(),
      },
      {
        id: "connects",
        accessorKey: "connects",
        header: () => "No of connects",
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
              to={ROUTE_PATHS.CONNECT_PROFILE + info.cell.row.original.id}
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
                    ? "Are you sure you want activate this connects?"
                    : "Are you sure you want deactivate this connects?",
                  type: "active",
                  id: info.cell.row.original.id,
                  status: !e.target.checked,
                })
              }
              title="Active / Deactive"
              size="small"
            />

            <Link
              to={ROUTE_PATHS.CONNECT_ADD_UPDATE}
              state={{
                isEdit: true,
                connect: {
                  id: info.cell.row.original.id,
                  planName: info.cell.row.original.planName,
                  price: info.cell.row.original.price,
                  connects: info.cell.row.original.connects,
                  description: info.cell.row.original.description
                },
              }}
              data-toggle="tooltip"
              title="Edit"
              data-original-title="Edit"
            >
              <FA6Icon.FaPenToSquare size={18} />
            </Link>

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
    connectList
      .mutateAsync({
        page: table.getState().pagination.pageIndex + 1,
        limit: pagination.pageSize,
        order: "desc",
        columnNo: 0,
        search: '',
      })
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setSelleData(data?.records);
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
        console.error("exception while getting connect list", err);
      });
  }, [
    pagination.pageSize,
    table.getState().pagination.pageIndex,
    connectStatus.isSuccess,
  ]);


  const onConnectAccountStatusUpdate = (id: string, status: boolean) => {
    connectStatus
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
      onConnectAccountStatusUpdate(isConfirm.id, isConfirm.status);
    }else if (isConfirm.type === "delete") {
      deleteConnect
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
              <div className="dash-title">Connects Manager</div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  { name: "Connects", path: ROUTE_PATHS.CONNECT_LIST },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col col-md-6">
            <div className="d-flex justify-content-start mb-3">
              <Link
                to={ROUTE_PATHS.CONNECT_ADD_UPDATE}
                className="btn btn-outline-primary"
                role="button"
              >
                Add Connect
              </Link>
            </div>
          </div>
          <div className="col col-md-6">
            <div className="d-flex justify-content-end mb-3">
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

export default ConnectList;
