"use client"

import { Box } from "@mui/material"

import { MyAccordion } from "./components/accordion"


export default function Home() {
  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ width: "75%", p: 1 }}>
        <MyAccordion />
      </Box>
      <Box sx={{ width: "25%", bgcolor: "lightgray", my: 1 }}>
      </Box>
    </Box>
  );
}
