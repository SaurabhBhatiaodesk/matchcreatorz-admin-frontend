import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IconButton } from "@mui/material";
import * as FA6Icon from "react-icons/fa6";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";

import {
  useAdminResponseTimeSetting,
  useResponseTimeDelete
} from "../../../store/admin/adminServices";
import { ConfirmDialog } from "../../../components";
import { useNavigate } from "react-router-dom";

const ResponseTimeComponent = (id : any) => {
  const navigate = useNavigate();

  const responseTimeList = useAdminResponseTimeSetting();
  const deleteRT = useResponseTimeDelete();

  const [rsData, setRSData] = useState<any>([]);

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
        id: "time",
        accessorKey: "time",
        header: () => "Hours",
        cell: (info) => info.getValue(),
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
    data: rsData,
    // debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true, //turn off client-side pagination
  });

  useEffect(() => {
    responseTimeList
      .mutateAsync()
      .then((res) => {
        setRSData(res.data.totalRecords);
      })
      .catch((err) => {
        console.error("", err);
      });
  }, []);


  const onConfirm = () => {
    if (isConfirm.type === "delete") {
      deleteRT
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
            // Refresh the page after deletion
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
    <section id="">
      <ConfirmDialog
        {...isConfirm}
        onConfirm={onConfirm}
        onCancel={onCancelAction}
      />

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
    </section>
  );
};

export default ResponseTimeComponent;
