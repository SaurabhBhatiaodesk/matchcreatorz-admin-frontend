import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type ConfirmDialogProps = {
  isVisible: boolean;
  title?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onConfirm?: any;
  onCancel?: () => void;
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
  const {
    isVisible,
    title,
    description,
    cancelLabel,
    confirmLabel,
    onConfirm,
    onCancel,
  } = props;

  return (
    <div className="confirm-dialog-container">
      <Dialog
        open={isVisible || false}
        TransitionComponent={Transition}
        keepMounted
        onClose={onCancel}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className="">{title || "Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>{cancelLabel || "Cancel"}</Button>
          <Button onClick={onConfirm}>{confirmLabel || "Confirm"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
