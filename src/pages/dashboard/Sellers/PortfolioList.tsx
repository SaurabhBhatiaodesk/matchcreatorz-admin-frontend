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
import { Link, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";

import { ROUTE_PATHS } from "../../../routes/routePaths";
import {
  usePortfolioList,
  usePortfolioDelete,
} from "../../../store/users/usersServices";
import { ConfirmDialog } from "../../../components";
import { Config } from "../../../config/AppConfig";
import { DefaultUser } from "../../../constant";
import { showDate } from "../../../helper";

const PortfolioListComponent = (params: any) => {
  const navigate = useNavigate();

  const portfolioList = usePortfolioList();
  const deletePortfolio = usePortfolioDelete();

  const [portfolioData, setPortfolioData] = useState<any>([]);

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
        id: "image",
        accessorKey: "image",
        header: () => "Image",
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
        id: "title",
        accessorKey: "title",
        header: () => "Title",
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

            <Link
              to={ROUTE_PATHS.SELLERS_PORTFOLIO_EDIT}
              state={{
                isEdit: true,
                info: {
                  id: info.cell.row.original.id,
                  obj: { ...info.cell.row.original, page: "portfolio" },
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
    data: portfolioData,
    // debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true, //turn off client-side pagination
  });

  useEffect(() => {
    portfolioList
      .mutateAsync({
        id: params.id,
      })
      .then((res) => {
        setPortfolioData(res.data.portfolio);
      })
      .catch((err) => {
        console.error(":::", err);
      });
  }, []);

  const onConfirm = () => {
    if (isConfirm.type === "delete") {
      deletePortfolio
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

export default PortfolioListComponent;
