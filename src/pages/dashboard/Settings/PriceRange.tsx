import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IconButton, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import * as FA6Icon from "react-icons/fa6";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";

import {
  useAdminPriceRangeSetting,
  usePriceRangeDelete,
} from "../../../store/admin/adminServices";
import { ConfirmDialog } from "../../../components";
import { useNavigate } from "react-router-dom";

const PriceRangeComponent = (params : any) => {
  const priceRangeList = useAdminPriceRangeSetting();
  const deletePriceRange = usePriceRangeDelete();
  const navigate = useNavigate();
  const [rsData, setRSData] = useState<any>([]);

  const [isConfirm, setIsConfirm] = useState({
    isVisible: false,
    title: "",
    description: "",
    type: "",
    id: "",
    status: false,
  });

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      id: "index",
      header: () => "#",
      cell: (info) => info.row.index + 1,
      enableSorting: false,
    },
    {
      id: "minMaxVal",
      accessorKey: "minMaxVal",
      header: () => "Price Range",
      cell: (info) => info.getValue(),
    },
    {
      id: "min",
      accessorKey: "min",
      header: () => "Minimum Price",
      cell: (info) => info.getValue(),
    },
    {
      id: "max",
      accessorKey: "max",
      header: () => "Maximum Price",
      cell: (info) => info.getValue(),
    },
    {
      id: "actions",
      header: () => "Actions",
      cell: (info) => (
        <IconButton
          aria-label="delete"
          title="Delete"
          size="small"
          onClick={() => {
            setIsConfirm({
              isVisible: true,
              title: "Are you sure?",
              description: "Are you sure you want to delete this?",
              type: "delete",
              id: info.cell.row.original?.id,
              status: false,
            });
          }}
        >
          <FA6Icon.FaTrash size={18} />
        </IconButton>
      ),
      enableSorting: false,
    },
  ], []);

  const table = useReactTable({
    columns,
    data: rsData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
  });

  useEffect(() => {
    priceRangeList
      .mutateAsync()
      .then((res) => {
        setRSData(res.data.totalRecords);
      })
      .catch((err) => {
        console.error("Exception while getting price range list", err);
      });
  }, []);

  const onConfirm = () => {
    if (isConfirm.type === "delete") {
      deletePriceRange
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
        <TableContainer component={Paper} className="table-responsive">
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      colSpan={header.colSpan}
                      className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
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
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows?.length > 0 ? (
                table.getRowModel().rows.map((row: any) => (
                  <TableRow key={row.id} style={{ height: "74px" }}>
                    {row.getVisibleCells().map((cell: any) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </section>
  );
};

export default PriceRangeComponent;
