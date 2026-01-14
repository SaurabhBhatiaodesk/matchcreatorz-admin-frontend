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
import { Switch } from "@mui/material";
import * as FA6Icon from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";

import { ROUTE_PATHS } from "../../../routes/routePaths";
import {
  useCategoryStatusUpdate,
  useCategoryList,
} from "../../../store/category/categoryServices";
import { BreadCrumb, ConfirmDialog } from "../../../components";
import { showDate } from "../../../helper";
const CategoryList = () => {
  const categoryList = useCategoryList();
  const categoryStatus = useCategoryStatusUpdate();

  const [sellerData, setSellerData] = useState<any>([]);
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
        accessorKey: "title",
        header: () => "Category Title",
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
              to={ROUTE_PATHS.CATEGORY_PROFILE + info.cell.row.original.id}
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
                    ? "Are you sure you want activate this category?"
                    : "Are you sure you want deactivate this category?",
                  type: "active",
                  id: info.cell.row.original.id,
                  status: !e.target.checked,
                })
              }
              title="Active / Deactive"
              size="small"
            />

            <Link
              to={ROUTE_PATHS.CATEGORY_ADD_UPDATE}
              state={{
                isEdit: true,
                category: {
                  id: info.cell.row.original.id,
                  title: info.cell.row.original.title,
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
    categoryList
      .mutateAsync({
        page: table.getState().pagination.pageIndex + 1,
        limit: pagination.pageSize,
        order: "desc",
        search: '',
      })
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setSellerData(data?.records);
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
  }, [
    pagination.pageSize,
    table.getState().pagination.pageIndex,
    categoryStatus.isSuccess,
  ]);


  const onPalsAccountStatusUpdate = (id: string, status: boolean) => {
    categoryStatus
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
      onPalsAccountStatusUpdate(isConfirm.id, isConfirm.status);
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
              <div className="dash-title">Category Manager</div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  { name: "Category", path: ROUTE_PATHS.CATEGORY_LIST },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col col-md-6">
            <div className="d-flex justify-content-start mb-3">
              <Link
                to={ROUTE_PATHS.CATEGORY_ADD_UPDATE}
                className="btn btn-outline-primary"
                role="button"
              >
                Add Category
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

export default CategoryList;
