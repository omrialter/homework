"use client";

import { Box } from "@mui/material";
import { Sidebar } from "./Sidebar";
import { Header } from "./header";
import type { ReactNode } from "react";

export default function LayoutShell({ children }: { children: ReactNode }) {
    return (
        <Box sx={{ display: "flex", width: "100%" }}>
            <Box sx={{ width: "10%" }}>
                <Sidebar />
            </Box>

            <Box
                component="main"
                sx={{
                    width: "90%",
                    flexGrow: 1, minHeight: "100vh", px: 0
                }} >
                <Header />
                {children}
            </Box>
        </Box>
    );
}
