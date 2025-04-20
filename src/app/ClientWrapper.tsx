"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import 'dayjs/locale/he';

dayjs.locale('he');

const rtlCache = createCache({
    key: "muirtl",
    stylisPlugins: [rtlPlugin],
});

const theme = createTheme({
    direction: "rtl",
});

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    return (
        <CacheProvider value={rtlCache}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="he">
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </LocalizationProvider>
        </CacheProvider>
    );
}
