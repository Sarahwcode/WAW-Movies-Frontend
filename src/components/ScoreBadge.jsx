import React from "react";
import { Box, Typography } from "@mui/material";

export default function ScoreBadge({ score }) {
    // convert score to percentage
  const percentage =
    typeof score === "number" ? Math.round(score * 10) : 0;

  return (
    <Box
      sx={{
        position: "relative",
        width: 110,
        height: 110,
        borderRadius: "50%",
        border: "6px solid black",
        display: "grid",
        placeItems: "center",
        marginTop: "40px",
        marginBottom: "50px",
      }}
    >
      <Typography
        sx={{
          fontSize: 35,
          fontWeight: 700,
          color: "#D18B1A",
          lineHeight: 1,
        }}
      >
        {percentage}%
      </Typography>
    </Box>
  );
}