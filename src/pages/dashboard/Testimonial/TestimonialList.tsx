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
import * as FA6Icon from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";

import { ROUTE_PATHS } from "../../../routes/routePaths";
import {
  useTestimonialList,
  useTestimonialDelete
} from "../../../store/common/commenServices";
import { BreadCrumb, ConfirmDialog, InfoDialog } from "../../../components";

import { showDate } from "../../../helper";
import { IconButton } from "@mui/material";
import { Config } from "../../../config/AppConfig";
import { DefaultUser } from "../../../constant";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";

const TestimonialList = () => {
  const navigate = useNavigate();
  const testimonialList = useTestimonialList();
  const testimonialDelete = useTestimonialDelete();

  const [userData, setUserData] = useState<any>([]);

  const [showInfo, setShowInfo] = useState({
    isVisible: false,
    title: "",
    description: "",
  });

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

  const onInfoClose = () => {
    setShowInfo({
      isVisible: false,
      title: "",
      description: "",
    });
  };

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
        id: "name",
        accessorKey: "name",
        header: () => "Full Name",
        cell: (info) => info.getValue(),
      },
      {
        id: "designation",
        accessorKey: "designation",
        header: () => "Designation",
        cell: (info) => info.getValue(),
      },
      {
        id: "totalRating",
        accessorKey: "totalRating",
        header: () => "Star Rating",
        cell: (info) => {
          const rating = info.getValue(); // Get the rating value (e.g., 4.5)
    
          // Function to display stars based on rating value
          const renderStars = (rating: any) => {
            const stars = [];
            for (let i = 1; i <= 5; i++) {
              if (i <= rating) {
                stars.push(<FontAwesomeIcon key={i} icon={faStar} style={{ color: 'gold' }} 
                  width={15}
                  
                   />);
              } else if (i - rating < 1 && i - rating > 0) {
                stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} style={{ color: 'gold' }} />);
              } else {
                //stars.push(<FontAwesomeIcon key={i} icon={faStarOfLife} style={{ color: 'gold' }} />);
              }
            }
            return stars;
          };
    
          return <div>{renderStars(rating)}</div>;
        },
      },
      {
        id: "comment",
        accessorKey: "comment",
        header: () => "Description",
        cell: (info: any) => (
          <p className="lh-base" style={{ maxWidth: "180px" }}>
            {info.cell.row.original.comment.length <= 50 ? (
              <span>{info.getValue()}</span>
            ) : (
              <span>
                {info.getValue().slice(0, 50)}
                <Link
                  to="#"
                  className="text-primary fw-medium"
                  style={{fontSize: "11px"}}
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
    data: userData,
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
    testimonialList
      .mutateAsync({
        page: true ? 1 : table.getState().pagination.pageIndex + 1,
        limit: pagination.pageSize
      })
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setUserData(data?.totalRecords);
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
        console.error("", err);
      });
  }, [
    pagination.pageSize,
    table.getState().pagination.pageIndex
  ]);


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

  const onConfirm = () => {
    if (isConfirm.type === "delete") {
      testimonialDelete
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


  return (
    <section id="main-content">
      <InfoDialog {...showInfo} onClose={onInfoClose} />
      <ConfirmDialog
        {...isConfirm}
        onConfirm={onConfirm}
        onCancel={onCancelAction}
      />

      <div className="wrapper">
        <div className="deshtitle-sec mb-3">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Testimonial Manager</div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  { name: "Testimonial", path: ROUTE_PATHS.TESTIMONIAL_LIST },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col col-md-6">
            <div className="d-flex justify-content-start mb-3">
             
            </div>
          </div>
          <div className="col col-md-6">
            <div className="d-flex justify-content-end mb-3">
            <Link
                to={ROUTE_PATHS.TESTIMONIAL_ADD_UPDATE}
                className="btn btn-outline-primary"
                role="button"
              >
                Add Testimonial
              </Link>
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

export default TestimonialList;
