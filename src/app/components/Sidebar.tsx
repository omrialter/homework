"use client";
import { usePathname } from "next/navigation"
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import TableViewIcon from '@mui/icons-material/TableView';
import LogoutIcon from '@mui/icons-material/Logout';



const navItems = [
    { text: "דשבורד", icon: <DashboardIcon />, urlsign: "/" },
    { text: "לקוחות", icon: <PeopleIcon />, urlsign: "/customers" },
    { text: "משמרות", icon: <CalendarMonthIcon />, urlsign: "/shifts" },
    { text: "הזמנות", icon: <TableViewIcon />, urlsign: "/orders" },
    { text: "הגדרות", icon: <SettingsIcon />, urlsign: "/orders" },
    { text: "התנתק", icon: <LogoutIcon />, urlsign: "/#" },
];

export function Sidebar() {
    const pathname = usePathname();


    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: "10%",
                    boxSizing: "border-box",
                    backgroundColor: "#58c3cc",
                    color: "#fff",
                    borderTopRightRadius: "24px",
                    direction: "rtl",
                },
            }}
        >

            <div className="text-center text-2xl p-4">LOGO</div>

            <List>
                {navItems.map((item, index) => {
                    const isActive = pathname === item.urlsign;

                    return (
                        <ListItemButton
                            key={index}
                            sx={{
                                borderRadius: "8px",
                                justifyContent: "center",
                                backgroundColor: isActive ? "#f3f9fd" : "transparent",
                                color: isActive ? "white" : "inherit",
                                '&:hover': {
                                    backgroundColor: isActive ? "#f3f4f6" : "#4bb5c3",
                                },
                            }}
                        >
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    textAlign: "center",
                                    m: 0,
                                    color: isActive ? "black" : "white",
                                }}
                            />
                            <ListItemIcon
                                sx={{
                                    color: isActive ? "black" : "white",
                                    minWidth: "auto",
                                    ml: 3,
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                        </ListItemButton>
                    );
                })}
            </List>

            <Divider />
        </Drawer>
    );
}
