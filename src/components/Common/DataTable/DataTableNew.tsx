import { FC, useCallback, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import {
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

type DataTableProps = {
  columns: any;
  data: any;
  searchKey?: string;
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChnagePageIndex: (pageIndex: number) => void;
  onChnagePageSize: (pageSize: number) => void;
  pageIndex: number;
  pageSize: number;
  totalPage?: number;
  totalRecords?: number;
};

export const DataTable: FC<DataTableProps> = (props) => {
  const {
    columns,
    data,
    searchKey,
    onChnagePageIndex,
    onChnagePageSize,
    onSearch,
    pageIndex = 0,
    pageSize = 10,
    totalPage = 0,
    // totalRecords = 0,
  } = props;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: pageIndex,
    pageSize: pageSize,
  });

  const table = useReactTable({
    columns,
    data,
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
    pageCount: totalPage,
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  });

  useEffect(() => {
    onChnagePageSize(table.getState().pagination.pageSize);
  }, [table.getState().pagination.pageSize]);

  useEffect(() => {
    onChnagePageIndex(table.getState().pagination.pageIndex);
  }, [table.getState().pagination.pageIndex]);

  const handlePageSize = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      table.setPageSize(Number(e.target.value));
    },
    []
  );

  return (
    <div className="container-fluid">
      <div className="row mb-3 align-items-center">
        <div className="col col-md-6">
          <div className="d-flex align-items-center">
            <span className="mr-2" style={{ marginRight: "3px" }}>
              Show entries{" "}
            </span>
            <select
              className="form-select form-select-sm rounded-1"
              onChange={handlePageSize}
              value={table.getState().pagination.pageSize}
              style={{ height: "30px", width: "10%", fontSize: "12px" }}
            >
              {[10, 25, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col col-md-6">
          <div className="d-flex flex-row justify-content-end">
            <input
              type="search"
              className="form-control form-control-sm bg-white border rounded-1"
              placeholder="Search here"
              onChange={onSearch}
              value={searchKey}
              style={{ height: "30px", width: "50%", fontSize: "12px" }}
            />
          </div>
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
                {table.getState().pagination.pageIndex + 1}{" "}
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
                    className="border p-2 rounded-1 w-10"
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

              {table.getState().pagination.pageIndex + 1 === 1 &&
                table.getPageCount() === 1 && (
                  <li className="paginate_button page-item active">
                    <button
                      className="page-link"
                      defaultValue={table.getState().pagination.pageIndex + 1}
                    >
                      {table.getState().pagination.pageIndex + 1}
                    </button>
                  </li>
                )}

              {table.getPageCount() >= 3 &&
                [1, 2, 3].map((pageNumber) => (
                  <li
                    key={pageNumber}
                    className={`"paginate_button page-item  ${
                      pageNumber === table.getState().pagination.pageIndex + 1
                        ? "active"
                        : "disabled"
                    } "`}
                  >
                    <button
                      className="page-link"
                      value={table.getState().pagination.pageIndex + 1}
                      onClick={() => "table.setPageIndex(pageNumber)"}
                    >
                      {pageNumber}
                    </button>
                  </li>
                ))}

              {table.getState().pagination.pageIndex > 2 && (
                <li className="paginate_button page-item active">
                  <button
                    className="page-link"
                    defaultValue={table.getState().pagination.pageIndex + 1}
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
  );
};
