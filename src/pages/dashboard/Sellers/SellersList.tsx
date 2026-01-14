import { useCallback, useEffect, useMemo, useState } from "react";
import {
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
  useSellerStatusUpdate,
  useSellersList,
  useSellerDelete,
  useSellerProfileStatus,
} from "../../../store/users/usersServices";
import { BreadCrumb, ConfirmDialog } from "../../../components";
import { Config } from "../../../config/AppConfig";
import { DefaultUser } from "../../../constant";
import { showDate } from "../../../helper";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  useAllTagsList,
  useCategoryList,
} from "../../../store/category/categoryServices";

import { useAdminResponseTimeSetting } from "../../../store/admin/adminServices";

const SellersList = () => {
  const navigate = useNavigate();
  const sellerList = useSellersList();
  const categoryList = useCategoryList();
  const tagsList = useAllTagsList();
  const responseTimeList = useAdminResponseTimeSetting();

  const [fetchTags, setTagsData] = useState([]);
  const [fetchCategory, setCategoryData] = useState([]);
  const [fetchResponseTime, setResponseTimeData] = useState([]);

  const [selectedResponseTime, setSelectedResponseTime] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedProfileStatus, setSelectedProfileStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState("");

  const [sellerData, setSellerData] = useState<any>([]);
  const [searchKey, setSearchKey] = useState<string>("");

  const showMailPopup = (onSendMail: any) => {
    // Create a modal for entering the message body using Bootstrap 4 classes
    const modal = document.createElement("div");
    modal.innerHTML = `
      <div id="mailPopup" class="modal fade show" tabindex="-1" role="dialog" style="display: block; background: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Send Rejection Email</h5>
              <button type="button" class="close" id="cancelButton" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
             <div class="modal-body">
              <input id="messageSubject" class="form-control" value="Profile rejected by admin" placeholder="Enter Subject" />
            </div>
            <div class="modal-body">
              <textarea id="messageBody" class="form-control" rows="5" placeholder="Enter rejection message"></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" id="sendButton" class="btn btn-primary">Send</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Handle the send button click
    document.getElementById("sendButton").onclick = () => {
      const messageBody = document.getElementById("messageBody").value;
      const messageSubject = document.getElementById("messageSubject").value;

      if (messageBody.trim() && messageSubject.trim()) {
        onSendMail(messageBody, messageSubject); // Pass both message body and subject
        document.body.removeChild(modal); // Remove the modal after sending
      } else {
        alert("Email body and subject cannot be empty!");
      }
    };

    // Handle the cancel button click
    document.getElementById("cancelButton").onclick = () => {
      document.body.removeChild(modal); // Close the modal without sending
    };
  };

  const [pageRecords, setPageRecors] = useState({
    totalPage: 0,
    totalRecords: 0,
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const resetPagination = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const sellerAccountStatus = useSellerStatusUpdate();
  const deleteSeller = useSellerDelete();
  const profileStatusSeller = useSellerProfileStatus();

  const [isConfirm, setIsConfirm] = useState({
    isVisible: false,
    title: "",
    description: "",
    type: "",
    id: "",
    status: false,
  });
  const columns = useMemo(
    () => [
      {
        id: "index",
        header: () => "#",
        cell: (info: any) => info.row.index + 1,
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
            alt={info.cell.row.original.fullName}
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
        cell: (info: any) => info.getValue(),
      },
      {
        id: "email",
        accessorKey: "email",
        header: () => "Email",
        cell: (info: any) => info.getValue(),
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
        id: "profile-status",
        header: () => "Profile Status",
        cell: (info: any) => {
          const status = info.cell.row.original?.profileStatus;

          if (status === "PENDING") {
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
                        "Are you sure you want to approve this profile?",
                      type: "approve",
                      id: info.cell.row.original?.id,
                      status: true,
                    })
                  }
                >
                  Approve
                </button>

                {/* Reject Button */}
                <button
                  className="mx-3 btn btn-danger"
                  onClick={() =>
                    showMailPopup(
                      (messageBody: string, messageSubject: string) => {
                        profileStatusSeller
                          .mutateAsync({
                            id: info.cell.row.original?.id,
                            body: messageBody,
                            subject: messageSubject,
                          })
                          .then((res) => {
                            const { success, message } = res;
                            if (success) {
                              toast.success(message);
                              setTimeout(() => {
                                navigate(0);
                              }, 1500);
                            }
                            toast.success(message);
                            setTimeout(() => {
                              navigate(0);
                            }, 1500);
                          });
                      }
                    )
                  }
                >
                  Reject
                </button>
              </>
            );
          } else if (status === "APPROVED") {
            return (
              <>
                <button className="btn btn-success" disabled>
                  Approved
                </button>
              </>
            );
          } else if (status === "REJECTED") {
            return (
              <>
                <button className="btn btn-danger" disabled>
                  Rejected
                </button>
              </>
            );
          }
        },
        enableSorting: false,
      },
      {
        id: "actions",
        header: () => "Actions",
        cell: (info) => (
          <>
            <Link
              to={ROUTE_PATHS.SELLERS_PROFILE + info.cell.row.original.id}
              data-toggle="tooltip"
              title="View"
            >
              <FA6Icon.FaEye size={18} />
            </Link>

            <Switch
              checked={!info.cell.row.original?.isSuspended}
              onChange={(e) =>
                setIsConfirm({
                  isVisible: true,
                  title: "Are you sure?",
                  description: e.target.checked
                    ? "Are you sure you want to Activate this account?"
                    : "Are you sure you want to Deactivate this account?",
                  type: "active",
                  id: info.cell.row.original.id,
                  status: !e.target.checked,
                })
              }
              title="Active / Deactive"
              size="small"
            />

            <Link
              to={ROUTE_PATHS.SELLERS_EDIT}
              state={{
                isEdit: true,
                info: {
                  id: info.cell.row.original.id,
                  obj: { ...info.cell.row.original },
                },
              }}
              data-toggle="tooltip"
              title="Edit"
            >
              <FA6Icon.FaPenToSquare size={18} />
            </Link>

            <IconButton
              aria-label="delete"
              title="Delete"
              size="small"
              onClick={() =>
                setIsConfirm({
                  isVisible: true,
                  title: "Are you sure?",
                  description: "Are you sure you want delete this seller?",
                  type: "delete",
                  id: info.cell.row.original?.id,
                  status: false,
                })
              }
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
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
    manualPagination: true,
    pageCount: pageRecords.totalPage,
  });

  useEffect(() => {
    sellerList
      .mutateAsync({
        skip: table.getState().pagination.pageIndex,
        limit: pagination.pageSize,
        sortBy: "desc",
        search: searchKey,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        categoryId: selectedCategory,
        tagId: selectedTags,
        responseTime: selectedResponseTime,
        totalRating: selectedRating,
        profileStatus: selectedProfileStatus,
      })
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setSellerData(data?.records);
          setPageRecors({
            totalPage: data?.totalPage,
            totalRecords: data?.totalRecords,
          });
        }
      });

    tagsList.mutateAsync({ page: 1, limit: 500, search: "" }).then((res) => {
      setTagsData(res.data?.records);
    });

    categoryList.mutateAsync({ page: 1, limit: 500 }).then((res) => {
      let categeory = res.data?.records?.filter(
        (a: any) => a.isSuspended === 0
      );
      setCategoryData(categeory);
    });

    responseTimeList
      .mutateAsync()
      .then((res) => setResponseTimeData(res.data.totalRecords));
  }, [
    searchKey,
    pagination.pageSize,
    table.getState().pagination.pageIndex,
    sellerAccountStatus.isSuccess,
    deleteSeller.isSuccess,
    startDate,
    endDate,
    selectedTags,
    selectedCategory,
    selectedRating,
    selectedResponseTime,
    selectedProfileStatus
  ]);

  const handleCategoryChange = useCallback(
    (e:any) => {
      setSelectedCategory(e.target.value);
      resetPagination();
    },
    []
  );

  const handleTagChange = useCallback(
    (e:any) => {
      setSelectedTags(e.target.value);
      resetPagination();
    },
    []
  );

  const handleResponseTimeChange = useCallback(
    (e:any) => {
      setSelectedResponseTime(e.target.value);
      resetPagination();
    },
    []
  );

  const handleRatingChange = useCallback(
    (e:any) => {
      setSelectedRating(e.target.value);
      resetPagination();
    },
    []
  );

  const handleProfileStatusChange = useCallback(
    (e) => {
      setSelectedProfileStatus(e.target.value);
      resetPagination();
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

  const onSellerAccountStatusUpdate = (id: string, status: boolean) => {
    sellerAccountStatus
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
      onSellerAccountStatusUpdate(isConfirm.id, isConfirm.status);
    } else if (isConfirm.type === "delete") {
      deleteSeller
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
    } else if (isConfirm.type === "approve") {
      profileStatusSeller
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

      <div className="wrapper">
        <div className="deshtitle-sec">
          <div className="row">
            <div className="col-md-8">
              <div className="dash-title">Sellers Manager</div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  { name: "Sellers", path: ROUTE_PATHS.SELLERS_LIST },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-2">
            <div className="d-flex justify-content-start mb-3">
              <Link
                to={ROUTE_PATHS.SELLERS_ADD_UPDATE}
                className="btn btn-outline-primary px-5 py-2"
                role="button"
              >
                Add Seller
              </Link>
            </div>
          </div>
          <div className="col-3">
            <div className="d-flex justify-content-start mb-3">
              <div className="date-picker d-flex">
                <DatePicker
                  className="form-control form-control-sm bg-white border rounded-1"
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
          </div>
          <div className="col-3"></div>
          <div className="col-6"></div>
        </div>

        <div className="row">
          <div className="col col-md-2">
            <select
              id="categoryId"
              className="form-control bg-light border border-1 rounded-2"
              onChange={handleCategoryChange}
            >
              <option value="">All Category</option>
              {fetchCategory.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div className="col col-md-2">
            <select
              id="tagId"
              className="form-control bg-light border border-1 rounded-2"
              onChange={handleTagChange}
            >
              <option value="">All Tags</option>
              {fetchTags.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col col-md-1">
            <select
              id="ratings"
              className="form-control bg-light border border-1 rounded-2"
              onChange={handleRatingChange}
            >
              <option value="">All Ratings</option>
              {[...Array(5).keys()].map((i: any) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="col col-md-1">
            <select
              id="profileStatus"
              className="form-control bg-light border border-1 rounded-2"
              onChange={handleProfileStatusChange}
            >
              <option value="ALL">All Sellers</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              
            </select>
          </div>

          <div className="col col-md-2">
            <select
              id="responseTime"
              className="form-control bg-light border border-1 rounded-2"
              onChange={handleResponseTimeChange}
            >
              <option value="">All Response Time</option>
              {fetchResponseTime.map((rt: any) => (
                <option key={rt.id} value={rt.time}>
                  {rt.time} Hours
                </option>
              ))}
            </select>
          </div>

          <div className="col col-md-4">
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

        {/* Table Section */}
        <div className="row">
          <Table responsive striped hover>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={
                        header.column.getCanSort() ? "cursor-pointer" : ""
                      }
                      onClick={header.column.getToggleSortingHandler()}
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
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} style={{ height: "74px" }}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
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

        {/* Pagination Section */}
        <div className="row">
          <div className="col-sm-12 col-md-5 align-items-center d-flex">
            <div className="dataTables_info">
              <label>
                Showing{" "}
                <strong>
                  {table.getPageCount() >= 1
                    ? table.getState().pagination.pageIndex + 1
                    : "0"}
                </strong>{" "}
                of {table.getPageCount().toLocaleString()} Pages
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
                  className={`paginate_button page-item ${
                    !table.getCanPreviousPage() ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link rounded-start-1"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {"<<"}
                  </button>
                </li>
                <li
                  className={`paginate_button page-item previous ${
                    !table.getCanPreviousPage() ? "disabled" : ""
                  }`}
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
                  className={`paginate_button page-item next ${
                    !table.getCanNextPage() ? "disabled" : ""
                  }`}
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
                  className={`paginate_button page-item ${
                    !table.getCanNextPage() ? "disabled" : ""
                  }`}
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

export default SellersList;
