import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  useConnectTransactionList,
  useAddConnect,
  useGetConnectList,
} from "../../../store/users/usersServices";
import { showDate } from "../../../helper";

const ConnectPageList = (params: any) => {

  const navigate = useNavigate();
  const connectTransactionList = useConnectTransactionList();
  const addConnect = useAddConnect();

  const connectPlansList = useGetConnectList();

  const [fetchConnectPlans, setConnectPlansData] = useState([]);

  const [transcationData, setTranscationData] = useState<any>([]);

  const [selectedOption, setSelectedOption] = useState("");

  const [pageRecords, setPageRecors] = useState({
    totalPage: 0,
    totalRecords: 0,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [showModal, setShowModal] = useState(false);
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "index",
        header: () => "#",
        cell: (info) => info.row.index + 1,
        enableSorting: false,
      },
      {
        id: "transactionId",
        accessorKey: "transactionId",
        header: () => "Txn ID",
        cell: (info) => info.getValue(),
      },
      {
        id: "amount",
        accessorKey: "amount",
        header: () => "Amount",
        cell: (info) => info.getValue(),
      },
      {
        id: "type",
        accessorKey: "type",
        header: () => "Txn Type",
        cell: (info) => info.getValue(),
      },
      {
        id: "connectId",
        accessorKey: "connectId",
        header: () => "Connect Id",
        cell: (info) => info.getValue(),
      },
      {
        id: "paymentStatus",
        accessorKey: "paymentStatus",
        header: () => "Payment Status",
        cell: (info) => info.getValue(),
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
    data: transcationData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    manualPagination: true,
    pageCount: pageRecords.totalPage,
  });

  useEffect(() => {
    connectTransactionList
      .mutateAsync({
        id: params.id,
        skip: table.getState().pagination.pageIndex,
        limit: pagination?.pageSize
      })
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setTranscationData(data?.records);
          setPageRecors({
            totalPage: data?.totalPage,
            totalRecords: data?.records,
          });
        }
      })
      .catch((err) => {
        console.error(":::", err);
      });

    connectPlansList.mutateAsync().then((res) => {
      setConnectPlansData(res.data);
    });
  }, [pagination.pageSize, table.getState().pagination.pageIndex]);

  const handleAddConnect = () => {
    addConnect
      .mutateAsync({ userId: params.id, connectId : selectedOption })
      .then((res) => {
        if (res.success) {
          toast.success("Connect added successfully!");
          setShowModal(false);
          navigate(0);
        } else {
          toast.error("Failed to add Connect.");
        }
      })
      .catch((err) => {
        console.error("Error adding Connect:", err);
        toast.error("An error occurred.");
      });
  };

  return (
    <section id="">
      <div className="p-3">
        <div className="row">
          <div className="col col-md-6">
            <div className="d-flex justify-content-start mb-3">
              <Button
                onClick={() => setShowModal(true)}
                variant="outline-primary"
              >
                Add Connect
              </Button>
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
                    className="page-link rounded-start-1"
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

      {/* Add Connect Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Add Connect</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      {/* Connect Plans - Bootstrap List Group */}
      <Form.Group className="mb-3" controlId="selectOption">
        <Form.Label>Select Plan</Form.Label>
        <div className="list-group">
          {fetchConnectPlans.map((plan : any) => (
            <label
              key={plan.id}
              className={`list-group-item list-group-item-action ${
                selectedOption === plan.id ? "active" : ""
              }`}
              onClick={() => setSelectedOption(plan.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">{plan.planName}</h6>
                  {/* Highlighted Connects */}
                  <span className="text-dark" style={{ fontSize: '0.9rem' }}>
                    {plan.connects} Connects
                  </span>
                </div>
                {/* Highlighted Price */}
                <span className="badge bg-warning text-dark" style={{ fontSize: '1rem' }}>
                  $ {plan.price}
                </span>
              </div>
            </label>
          ))}
        </div>
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
    <Button variant="primary" onClick={handleAddConnect}>
      Add Connect
    </Button>
  </Modal.Footer>
</Modal>

    </section>
  );
};

export default ConnectPageList;
