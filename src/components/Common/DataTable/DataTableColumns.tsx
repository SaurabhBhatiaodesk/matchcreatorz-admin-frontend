import { Switch } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";

import { showDate } from "../../../helper";
import { Config } from "../../../config/AppConfig";
import { DefaultUser } from "../../../constant";

const columnHelper = createColumnHelper<any>();

export const PalsListColumns = [
  columnHelper.accessor((row) => row.index, {
    id: "index",
    header: () => "#",
    cell: (info) => info.row.index + 1,
    enableSorting: false,
  }),
  columnHelper.accessor((row) => row.avatar, {
    id: "avatar",
    header: () => "Avatar",
    cell: (info) => (
      <img
        src={info.getValue() ? Config.mediaUrl(info.getValue()) : DefaultUser}
        alt={
          info.cell.row.original?.firstName +
          " " +
          info.cell.row.original?.lastName
        }
        className="rounded-circle"
        width={74}
        height={74}
      />
    ),
    enableSorting: false,
  }),
  columnHelper.accessor((row) => row.firstName, {
    id: "firstName",
    header: () => "First Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: "lastName",
    header: () => "Last Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.email, {
    id: "email",
    header: () => "Email",
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),

  columnHelper.accessor((row) => row.formattedPhone, {
    id: "formattedPhone",
    header: () => "Mobile No.",
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),

  columnHelper.accessor((row) => row.created, {
    id: "created",
    header: () => "Created",
    cell: (info) => showDate(info.getValue(), "MMMM Do YYYY, h:mm:ss a"),
    enableSorting: false,
  }),

  columnHelper.accessor("isSuspended", {
    header: () => "Status",
    cell: (info) => (
      <Switch
        checked={!info.cell.row.original.isSuspended}
        // onChange={(e: any) => onActive(e, item?._id)}
        size="small"
      />
    ),
    enableSorting: false,
  }),

  columnHelper.accessor("isVerified", {
    header: () => "Verified",
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
  columnHelper.accessor("actions", {
    header: () => "Actions",
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
];

export const TravellersListColumns = [
  columnHelper.accessor("index", {
    cell: (info) => info.getValue(),
    header: () => "#",
  }),
  columnHelper.accessor((row) => row.avatar, {
    id: "avatar",
    cell: (info) => info.getValue(),
    header: () => "Avatar",
  }),
  columnHelper.accessor((row) => row.firstName, {
    id: "firstName",
    cell: (info) => info.getValue(),
    header: () => "First Name",
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: "lastName",
    cell: (info) => info.getValue(),
    header: () => "Last Name",
  }),
  columnHelper.accessor((row) => row.email, {
    id: "email",
    cell: (info) => info.getValue(),
    header: () => "Email",
  }),

  columnHelper.accessor((row) => row.formattedPhone, {
    id: "formattedPhone",
    cell: (info) => info.getValue(),
    header: () => "Mobile No.",
  }),

  columnHelper.accessor((row) => row.created, {
    id: "created",
    cell: (info) => info.getValue(),
    header: () => "Created",
  }),

  columnHelper.accessor("isActive", {
    cell: (info) => info.getValue(),
    header: () => "Status",
  }),

  columnHelper.accessor("actions", {
    cell: (info) => info.getValue(),
    header: () => "Actions",
  }),
];

export const PlacesListColumns = [
  columnHelper.accessor("index", {
    cell: (info) => info.getValue(),
    header: () => "#",
  }),

  columnHelper.accessor((row) => row.firstName, {
    id: "title",
    cell: (info) => info.getValue(),
    header: () => "Place Name",
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: "palName",
    cell: (info) => info.getValue(),
    header: () => "Pal Name",
  }),
  columnHelper.accessor((row) => row.email, {
    id: "country",
    cell: (info) => info.getValue(),
    header: () => "Country",
  }),

  columnHelper.accessor((row) => row.email, {
    id: "city",
    cell: (info) => info.getValue(),
    header: () => "City",
  }),
];
