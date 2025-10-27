"use client";

import { Modal, Box, Typography, Button } from "@mui/material";
import React from "react";

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  showCloseButton?: boolean;
  width?: number;
}

export function BaseModal({
  open,
  onClose,
  title,
  children,
  showCloseButton = true,
  width = 400,
}: BaseModalProps) {
  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {
      xs: "95vw",
      sm: "90vw",
      md: Math.min(width, 600),
    },
    maxWidth: width,
    maxHeight: {
      xs: "90vh",
      sm: "85vh",
    },
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: {
      xs: 2,
      sm: 3,
      md: 4,
    },
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        {title && (
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            mb={2}
            sx={{ flexShrink: 0 }}
          >
            {title}
          </Typography>
        )}

        <Box
          id="modal-description"
          sx={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            pr: 1,
          }}
        >
          {children}
        </Box>

        {showCloseButton && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 3,
              flexShrink: 0,
              pt: 2,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Button variant="outlined" color="inherit" onClick={onClose}>
              Close
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
