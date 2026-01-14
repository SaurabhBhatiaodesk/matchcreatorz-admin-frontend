import { FC, useState } from "react";
import { Table } from "react-bootstrap";
import {
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Switch } from "@mui/material";

import { Config } from "../../../config/AppConfig";
import { DefaultUser } from "../../../constant";
import { showDate } from "../../../helper";
// import { ActionColumn } from "../ActionColumn";

type DataTableProps = {
  columns: any;
  data: any;
  onSearch?: (e: any) => void;
  onSelectDataPerPage?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onView?: any;
  onVerify?: any;
  onActive?: any;
  currentPage?: number;
  rowsPerPage?: number;
  totalPage?: number;
  totalRecords?: number;
};

export const DataTable: FC<DataTableProps> = (props) => {
  const {
    columns,
    data,
    // onView,
    onSelectDataPerPage,
    onSearch,
    onVerify,
    onActive,
    currentPage = 1,
    rowsPerPage = 10,
    // totalPage = 1,
    // totalRecords= 0,
  } = props;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: currentPage - 1,
    pageSize: rowsPerPage,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
    },
  });

  return (
    <div className="container-fluid">
      <div className="row mb-3 align-items-center">
        <div className="col col-md-6">
          <div className="d-flex align-items-center">
            <span className="mr-2">Shows per page </span>
            <select
              className="form-select form-select-sm rounded-1"
              name="data-table-select"
              aria-controls="data-table"
              aria-label="data-table"
              onChange={onSelectDataPerPage}
              value={rowsPerPage}
              style={{ height: "30px", width: "10%", fontSize: "12px" }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        {onSearch && (
          <div className="col col-md-6">
            <div className="d-flex flex-row justify-content-end">
              <input
                type="search"
                className="form-control form-control-sm bg-white border rounded-1"
                placeholder="Search here"
                aria-controls="dynamic-table1"
                onChange={onSearch}
                style={{ height: "30px", width: "50%", fontSize: "12px" }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="row">
        <Table id="data-table" responsive striped hover>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item: any, index: number) => {
                return (
                  <tr key={`#${item?._id}`}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={
                          item?.avatar
                            ? Config.mediaUrl(item?.avatar)
                            : DefaultUser
                        }
                        alt={item?.firstName + " " + item?.lastName}
                        className="rounded-circle"
                        width={74}
                        height={74}
                      />
                    </td>
                    <td>{item?.firstName}</td>
                    <td>{item?.lastName}</td>
                    <td>{item?.email}</td>
                    <td>{item?.formattedPhone || "N/A"}</td>
                    <td>
                      {showDate(item?.created, "MMMM Do YYYY, h:mm:ss a")}
                    </td>

                    <td>
                      <Switch
                        checked={!item?.isSuspended}
                        onChange={(e: any) => onActive(e, item?._id)}
                        size="small"
                      />
                    </td>
                    {onVerify && (
                      <td>
                        <Switch
                          checked={item?.isReviewed}
                          onChange={(e: any) => onVerify(e, item?._id)}
                          size="small"
                        />
                      </td>
                    )}
                    <td className="hide_on_print">
                      {/* <ActionColumn
                        onPressView={onView + item?._id}
                        // isEditable
                        // onPressEdit={{
                        //   path: ROUTE_PATHS.PAL_EDIT + item?._id,
                        //   state: {
                        //     isEdit: true,
                        //   },
                        // }}
                      /> */}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns?.length} className="text-center">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      {/* <div className="row">
        <div className="col-sm-12 col-md-5 align-items-center d-flex">
          <div
            className="dataTables_info"
            id="dynamic-table_info"
            aria-live="polite"
          >
            <label className="">
              Showing {currentPage} of {totalPage} entries
            </label>
          </div>
        </div>
        <div className="col-sm-12 col-md-7 justify-content-end d-flex">
          <div
            className="dataTables_paginate paging_simple_numbers"
            id="dynamic-table_paginate"
          >
            <ul className="pagination">
              <li className="paginate_button page-item">
                <Link
                  to="#"
                  className="page-link"
                  onClick={() => table.firstPage()}
                  aria-disabled={!table.getCanPreviousPage()}
                >
                  {"<<"}
                </Link>
              </li>
              <li
                className="paginate_button page-item previous disabled"
                id="dynamic-table_previous"
              >
                <Link
                  to="#"
                  onClick={() => table.previousPage()}
                  aria-disabled={!table.getCanPreviousPage()}
                  className="page-link"
                >
                  Previous
                </Link>
              </li>
              <li className="paginate_button page-item active">
                <a
                  href="#"
                  aria-controls="dynamic-table"
                  data-dt-idx={1}
                  tabIndex={0}
                  className="page-link"
                >
                  1
                </a>
              </li>
              <li className="paginate_button page-item disabled">
                <a
                  href="#"
                  aria-controls="dynamic-table"
                  data-dt-idx={1}
                  tabIndex={1}
                  className="page-link"
                >
                  2
                </a>
              </li>
              <li className="paginate_button page-item disabled">
                <a
                  href="#"
                  aria-controls="dynamic-table"
                  data-dt-idx={1}
                  tabIndex={2}
                  className="page-link"
                >
                  3
                </a>
              </li>
              <li
                className="paginate_button page-item next disabled"
                id="dynamic-table_next"
              >
                <a
                  href="#"
                  aria-controls="dynamic-table"
                  data-dt-idx={2}
                  tabIndex={0}
                  className="page-link"
                >
                  Next
                </a>
              </li>
              <li
                className="paginate_button  page-item"
                onClick={() => table.firstPage()}
                // disabled={!table.getCanPreviousPage()}
              >
                <Link to="#" className="page-link">
                  {">>"}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div> */}
    </div>
  );
};
