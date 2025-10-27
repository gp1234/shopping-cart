// components/VirtualizedTable.tsx
"use client";
import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Box, Typography, Paper, useTheme, useMediaQuery } from "@mui/material";

type Column = {
  key: string;
  label: string;
  width?: number;
  flex?: number;
  hideOnMobile?: boolean;
};
type VirtualizedTableProps<T> = {
  data: T[];
  columns: Column[];
  height?: number;
  renderActions?: (item: T) => React.ReactNode;
};

export default function VirtualizedTable<T>({
  data,
  columns,
  height = 600,
  renderActions,
}: VirtualizedTableProps<T>) {
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 8,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const visibleColumns = React.useMemo(() => {
    return columns.filter((column) => !(column.hideOnMobile && isMobile));
  }, [columns, isMobile]);
  return (
    <Paper
      sx={{ height, width: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box
        sx={{
          display: "flex",
          borderBottom: "1px solid #ccc",
          backgroundColor: "#fafafa",
          fontWeight: 600,
          px: 2,
        }}
      >
        {visibleColumns.map((col) => (
          <Typography
            key={col.key}
            sx={{
              width: col.width || "auto",
              flex: col.flex || "none",
              py: 1.5,
            }}
          >
            {col.label}
          </Typography>
        ))}
        {renderActions && (
          <Typography
            sx={{
              width: { xs: 100, sm: 200 },
              py: 1.5,
              textAlign: { xs: "center", sm: "center" },
            }}
          >
            Actions
          </Typography>
        )}
      </Box>

      <Box
        ref={parentRef}
        sx={{ flex: 1, overflow: "auto", position: "relative" }}
      >
        <Box
          sx={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const item = data[virtualRow.index];
            return (
              <Box
                key={virtualRow.key}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #eee",
                  px: 2,
                }}
              >
                {visibleColumns.map((col) => (
                  <Typography
                    key={col.key}
                    sx={{
                      width: col.width || "auto",
                      flex: col.flex || "none",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {(item as any)[col.key]}
                  </Typography>
                ))}
                {renderActions && (
                  <Box
                    sx={{
                      width: { xs: 100, sm: 200 },
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    {renderActions(item)}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
}
