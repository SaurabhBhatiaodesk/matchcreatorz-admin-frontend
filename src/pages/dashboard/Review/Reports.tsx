import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

import { ROUTE_PATHS } from "../../../routes/routePaths";
import {
  useRatings
} from "../../../store/common/commenServices";
import { BreadCrumb, InfoDialog } from "../../../components";
import { showDate } from "../../../helper";

const Reports: FC = () => {
  const report = useRatings();

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


  const [reportData, setReportData] = useState([]);
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
        id: "reportedBy.fullName",
        accessorKey: "reportedBy.fullName",
        header: () => "Report By",
        cell: (info) => (
          <Link
            to={`${ROUTE_PATHS.BUYERS_PROFILE}${info.cell.row.original.reportedById}`}
            title={`View ${info.getValue()}'s Profile`}
          >
            {info.getValue()}
          </Link>
        ),
        enableSorting: true,
      },
      {
        id: "reportedTo.fullName",
        accessorKey: "reportedTo.fullName",
        header: () => "Report To",
        cell: (info) => (
          <Link
            to={`${ROUTE_PATHS.SELLERS_PROFILE}${info.cell.row.original.reportedToId}`}
            data-toggle="tooltip"
            title={`View ${info.getValue()}'s Profile`}
          >
            {info.getValue()}
          </Link>
        ),
        enableSorting: true,
      },
      {
        id: "reason",
        accessorKey: "reason",
        header: () => "Reason",
        cell: (info: any) => (
          <p className="lh-base" style={{ maxWidth: "180px" }}>
            {info.cell.row.original.reviewMessage?.length <= 50 ? (
              <span>{info.getValue()}</span>
            ) : (
              <span>
                {info.getValue()?.slice(0, 50)}
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
        id: "created",
        accessorKey: "created",
        header: () => "Created",
        cell: (info) => showDate(info.getValue(), "MMMM Do YYYY, h:mm:ss a"),
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: reportData,
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
    report
      .mutateAsync({
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        search: searchKey,
      })
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setReportData(data?.records);
          setPageRecors({
            totalPage: data?.totalPage,
            totalRecords: data?.records.length,
          });
        }
      })
      .catch((err) => {
        console.error(":::", err);
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

  return (
    <section id="main-content">
      <InfoDialog {...showInfo} onClose={onInfoClose} />
      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Report Manager</div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  { name: "Report", path: ROUTE_PATHS.REPORT_LIST },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="row mb-3 align-items-center">
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

export default Reports;
