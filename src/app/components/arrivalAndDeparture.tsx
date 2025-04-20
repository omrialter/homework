"use client";

import { Box, Typography, IconButton } from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Dayjs } from "dayjs";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from "react";






export default function AriveNDeparture(
    { onChange }: { onChange: (data: { date: Dayjs; from: Dayjs | null; to: Dayjs | null }[]) => void }
) {

    const [selectedDates, setSelectedDates] = useState<
        { date: Dayjs; from: Dayjs | null; to: Dayjs | null }[]
    >([]);

    useEffect(() => {
        onChange(selectedDates);
    }, [selectedDates]);


    //הכפתורים בהתחלה
    const [selected, setSelected] = useState("בחירת ימים")



    const handleDateSelect = (newDate: Dayjs | null) => {
        if (!newDate) return;
        const exists = selectedDates.some((d) => d.date.isSame(newDate, "day"));
        if (!exists) {
            const updated = [...selectedDates, { date: newDate, from: null, to: null }];
            updated.sort((a, b) => a.date.diff(b.date));
            setSelectedDates(updated);
        }
    };

    const handleTimeChange = (index: number, type: "from" | "to", value: Dayjs | null) => {
        const updated = [...selectedDates];
        updated[index][type] = value;
        setSelectedDates(updated);
    };

    const handleRemove = (index: number) => {
        setSelectedDates((prev) => {
            const filtered = prev.filter((_, i) => i !== index);
            return [...filtered].sort((a, b) => a.date.diff(b.date));
        });
    };


    const toggleButtonStyle = {
        width: "50%", bgcolor: '#3cc8a9', color: 'white',
        '&.Mui-selected': {
            bgcolor: 'white',
            color: '#3cc8a9',
        },
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

            <ToggleButtonGroup
                sx={{ width: "25%", display: "flex", borderRadius: '8px', border: '3px solid #49d0b0', p: 0 }}
                exclusive
                value={selected}
                onChange={(e, val) => { if (val !== null) setSelected(val); }}
            >
                <ToggleButton
                    value="בחירת ימים" aria-label="בחירת ימים"
                    sx={{ ...toggleButtonStyle, borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}
                >
                    בחירת ימים
                </ToggleButton>

                <ToggleButton
                    value="חזרות" aria-label="חזרות"
                    sx={{ ...toggleButtonStyle, borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                >
                    חזרות
                </ToggleButton>
            </ToggleButtonGroup>


            <Box sx={{ display: "flex", gap: 2 }}>

                <DateCalendar
                    sx={{ width: "40%", border: "1px solid #ccc", borderRadius: 2, p: 2 }}
                    onChange={handleDateSelect}
                    disablePast
                />


                <Box sx={{ width: "60%", display: "flex", flexDirection: "column", gap: 1 }}>
                    {selectedDates.map((entry, index) => (
                        <Box
                            key={entry.date.toString()}
                            sx={{

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                px: 1,
                            }}
                        >

                            <Typography sx={{ width: "140px", fontWeight: 500 }}>
                                {entry.date.format("dddd DD/MM/YYYY")}
                            </Typography>

                            <TimePicker
                                value={entry.to}
                                onChange={(value) => handleTimeChange(index, "to", value)}
                                slotProps={{ textField: { size: "small", sx: { width: 110, bgcolor: "lightgray" } } }}
                            />

                            <Typography>עד</Typography>

                            <TimePicker
                                value={entry.from}
                                onChange={(value) => handleTimeChange(index, "from", value)}
                                slotProps={{ textField: { size: "small", sx: { width: 110, bgcolor: "lightgray" } } }}
                            />



                            <IconButton onClick={() => handleRemove(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>

                    ))}
                </Box>
            </Box>
        </Box>
    );
}
