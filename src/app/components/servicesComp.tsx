"use client"
import 'dayjs/locale/he'
import { useState, useEffect } from "react";
import { Dialog, Table, TableHead, TableRow, TableCell, TableBody, Button, Select, MenuItem, Box, FormControl, InputLabel, Typography, IconButton } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { formatArrivalSummary } from "../services/formatArrivalSummary";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { calculateSummary } from "../services/calculator";



const allServices = [
    { id: 1, name: "מקלחת", price: 40.00 },
    { id: 2, name: "אילוף", price: 100.00 },
    { id: 3, name: "טיול", price: 25.00 },
    { id: 4, name: "תספורת", price: 70.00 },
];

interface SubServiceRow {
    id: number;
    serviceId: number;
    dogs: string[];
    frequency: string;
    days: { date: Dayjs; times: Dayjs[] }[];
}

interface ServicesCompProps {
    arrivalData: { date: Dayjs; from: Dayjs | null; to: Dayjs | null }[];
    dogNames: string[];
    subServices: SubServiceRow[];
    setSubServices: React.Dispatch<React.SetStateAction<SubServiceRow[]>>;

}

export default function ServicesComp({ dogNames, subServices, setSubServices, arrivalData }: ServicesCompProps) {


    const [newRow, setNewRow] = useState<SubServiceRow>({
        id: Date.now(),
        serviceId: 3,
        dogs: dogNames,
        frequency: "",
        days: [] as { date: Dayjs; times: Dayjs[] }[],
    });

    const [calendarOpen, setCalendarOpen] = useState(false);

    const allHazarot = [
        { id: 1, name: "כל יום" },
        { id: 2, name: "מס פעמים" },
        { id: 3, name: "בסוף אירוע" },
    ];

    const handleAdd = () => {
        if (!newRow.serviceId) {
            window.alert("אנא בחר תת שירות לפני ההוספה.");
            return;
        }
        if (newRow.days.length < 1) {
            window.alert("נא להגדיר תזמון")
            return;
        }
        if (newRow.days.some(day => day.times.length < 1) && newRow.frequency !== "בסוף אירוע") {
            window.alert("נא לבחור כמות פעמים")
            return;
        }
        if (
            newRow.days.some(
                day => day.times.length === 0 || day.times.some(time => !time)
            )
        ) {
            window.alert("אנא מלא שעה לכל תאריך שנבחר");
            return;
        }

        setSubServices(prev => [...prev, { ...newRow, id: Date.now() }]);

        setNewRow({
            id: Date.now(),
            serviceId: 3,
            dogs: dogNames,
            frequency: "",
            days: [],
        });
    };

    const deleteRow = (rowId: number) => {
        const newArray = subServices.filter(row => row.id !== rowId)
        setSubServices(newArray)
    }

    const duplicateRow = (_rowId: number) => {
        const originalIndex = subServices.findIndex(row => row.id === _rowId);
        if (originalIndex === -1) return;

        const originalRow = subServices[originalIndex];

        const newRow: SubServiceRow = {
            ...originalRow,
            id: Date.now(),
        };

        const updated = [...subServices];
        updated.splice(originalIndex + 1, 0, newRow);

        setSubServices(updated);
    };

    const handleDeleteDog = (rowId: number, dogName: string) => {
        setSubServices(prev =>
            prev.map(row =>
                row.id === rowId
                    ? { ...row, dogs: row.dogs.filter(d => d !== dogName) }
                    : row
            )
        );
    };

    useEffect(() => {
        if (dogNames.length > 0) {
            setNewRow((prev) => {

                const hasDifferentDogs =
                    prev.dogs.length !== dogNames.length ||
                    !prev.dogs.every((dog) => dogNames.includes(dog));

                if (hasDifferentDogs) {
                    return { ...prev, dogs: dogNames };
                }
                return prev;
            });
        }
    }, [dogNames]);

    return (
        <Box sx={{ overflowX: 'auto', pt: 2 }}>

            {/* תיבת חיפוש */}

            <Box sx={{ display: "flex", justifyContent: "flex-start", width: "33%" }}>
                <Box sx={{
                    display: "flex", alignItems: "center", border: "1px solid #82cdd4", borderRadius: "12px",
                    px: 1.5, py: 0.5,
                }}>
                    <input
                        placeholder="חיפוש"
                        dir="rtl"
                        style={{ border: "none", outline: "none", width: "100%", background: "transparent", fontSize: "16px" }}
                    />
                    <IconButton sx={{ mx: 1, color: "#90a4ae" }}>
                        <SearchIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* לייט בוקס לוח שנה */}
            <Dialog open={calendarOpen} onClose={() => setCalendarOpen(false)}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                        onChange={(date) => {
                            if (!date) return;
                            setNewRow(prev => {
                                const exists = prev.days.some(d => d.date.isSame(date, "day"));
                                if (exists) {
                                    return { ...prev, days: prev.days.filter(d => !d.date.isSame(date, "day")) };
                                }
                                return {
                                    ...prev,
                                    days: [...prev.days, { date, times: [] }]
                                };
                            });
                        }}
                        shouldDisableDate={day =>
                            !arrivalData.some(d => d.date.isSame(day, "day"))
                        }
                    />
                </LocalizationProvider>
            </Dialog>

            <Table sx={{ mt: 1 }}>
                <TableHead sx={{
                    bgcolor: '#f3f4f6'
                }}>
                    <TableRow>
                        <TableCell sx={{ borderTopLeftRadius: "8px", fontWeight: "bold", fontSize: "1rem", width: "30px" }}>שיכפול</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", width: "30px" }}>תת שירות</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", width: "30px" }}>כלבים</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>חזרות</TableCell>
                        <TableCell sx={{ borderTopRightRadius: "8px", fontWeight: "bold", fontSize: "1rem", textAlign: "start" }}>תזמון</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>

                    {/* TABLE */}

                    {subServices.map((item) => {
                        return (
                            <TableRow key={item.id}>

                                {/* duplictae button */}

                                <TableCell sx={{ maxWidth: "70px", px: 1 }}>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <Button size="small" variant="outlined" sx={{ color: "#58c3cc" }}>נוסף</Button>
                                        <ContentCopyIcon onClick={() => { duplicateRow(item.id) }} sx={{ color: "#58c3cc", cursor: 'pointer' }} />
                                    </Box>
                                </TableCell>

                                {/* service type */}
                                <TableCell >
                                    <FormControl>
                                        <InputLabel>בחר שירות</InputLabel>
                                        <Select
                                            size="small"
                                            value={item.serviceId}
                                            onChange={(e) => {

                                                const newServiceId = Number(e.target.value);
                                                setSubServices(prev =>
                                                    prev.map(row =>
                                                        row.id === item.id ? { ...row, serviceId: newServiceId } : row
                                                    )
                                                )
                                            }

                                            }
                                        >
                                            {allServices.map((service) => (
                                                <MenuItem key={service.id} value={service.id}>
                                                    {service.name} ₪{service.price}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                </TableCell>

                                {/* dogs */}

                                <TableCell >
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        {item.dogs.map((dog, i) => (
                                            <Button key={i} size="small"
                                                variant="outlined" sx={{ borderRadius: "6px" }}
                                                onClick={() => handleDeleteDog(item.id, dog)}
                                            >{dog} x</Button>
                                        ))}
                                    </Box>
                                    {item.dogs.length < dogNames.length && (
                                        <Button size="small" variant="text" color="secondary"
                                            sx={{
                                                mt: 0.5, fontSize: '0.75rem',
                                                borderRadius: '4px',
                                                textDecoration: 'underline',
                                                alignSelf: 'start',
                                                mr: 3,
                                            }}
                                            onClick={() =>
                                                setSubServices(prev =>
                                                    prev.map(row =>
                                                        row.id === item.id ? { ...row, dogs: dogNames } : row
                                                    )
                                                )
                                            }
                                        >
                                            איפוס
                                        </Button>
                                    )}
                                </TableCell>

                                <TableCell>

                                    <Typography sx={{ color: "#58c3cc", fontWeight: "bold" }}>
                                        {item.frequency}
                                    </Typography>

                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1, color: "red" }}>
                                        {
                                            item.frequency === "כל יום" ? (
                                                <Typography variant="body2" sx={{ mt: 1, color: "red" }}>
                                                    {/* format the full range from first to last */}
                                                    {item.days[0].date
                                                        .locale("he")
                                                        .format("dddd, D MMMM")}{" "}
                                                    -{" "}
                                                    {item.days[item.days.length - 1].date
                                                        .locale("he")
                                                        .format("dddd, D MMMM")}
                                                    {/* join all the times once */}

                                                    {", " + item.days[0].times
                                                        .map(t => t.format("HH:mm"))
                                                        .join(" , ")}
                                                </Typography>
                                            ) : (item.days.map((dayObj, i) => (
                                                <Box
                                                    key={i}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                        p: 0.5

                                                    }}
                                                >
                                                    {/* date */}
                                                    <Typography variant="body2">
                                                        {dayObj.date.locale('he').format('dddd, D MMMM')}
                                                    </Typography>

                                                    {/* first time (or join all times) */}
                                                    <Typography variant="body2" color="red">
                                                        {dayObj.times
                                                            .map(t => t.format("HH:mm"))
                                                            .join(" , ")}
                                                    </Typography>
                                                </Box>
                                            )))
                                        }
                                    </Box>
                                </TableCell>

                                <TableCell sx={{ display: "flex" }}>
                                    <Button size="small" color="error" variant="contained">📅</Button>

                                    <IconButton onClick={() => { deleteRow(item.id) }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>

                            </TableRow>
                        )
                    })}

                    {/* FORM ROW */}

                    <TableRow>

                        {/* Add button */}
                        <TableCell >
                            <Button size="small" variant="outlined" sx={{ color: "white", bgcolor: "#58c3cc" }} onClick={handleAdd}>הוספה</Button>
                        </TableCell>

                        {/* Service-Type */}
                        <TableCell>
                            <Box sx={{ display: "flex", flexDirection: "column", maxWidth: "140px", width: "100%", }}>
                                <FormControl>
                                    <InputLabel>בחר שירות</InputLabel>
                                    <Select
                                        size="small"
                                        value={newRow.serviceId}
                                        onChange={(e) =>
                                            setNewRow({ ...newRow, serviceId: Number(e.target.value) })
                                        }
                                    >
                                        {allServices.map((service) => (
                                            <MenuItem key={service.id} value={service.id}>
                                                {service.name} ₪{service.price}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </TableCell>

                        {/* Dogs */}
                        <TableCell  >
                            <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                                {newRow.dogs.map((dog, i) => (
                                    <Button key={i} size="small"
                                        variant="outlined" sx={{ borderRadius: "6px" }}
                                        onClick={() => {
                                            if (newRow.dogs.length === 1) {
                                                window.alert("לא ניתן להסיר את הכלב האחרון.");
                                                return;
                                            }
                                            setNewRow((prev) => ({
                                                ...prev,
                                                dogs: prev.dogs.filter((d) => d !== dog),
                                            }));
                                        }}
                                    >{dog} x</Button>
                                ))}
                            </Box>
                            {newRow.dogs.length < dogNames.length && (
                                <Button size="small" variant="text" color="secondary"
                                    sx={{
                                        mt: 0.5, fontSize: '0.75rem',
                                        borderRadius: '4px',
                                        textDecoration: 'underline',
                                        alignSelf: 'start',
                                        mr: 3,
                                    }}
                                    onClick={() =>
                                        setNewRow((prev) => ({ ...prev, dogs: dogNames }))
                                    }
                                >
                                    איפוס
                                </Button>
                            )}
                        </TableCell>

                        {/* חזרות */}

                        <TableCell>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <FormControl>
                                    <InputLabel>בחר סוג</InputLabel>
                                    <Select
                                        size="small"
                                        value={newRow.frequency}
                                        label="בחר חזרות"
                                        onChange={(e) => {
                                            const newFrequency = e.target.value;
                                            // turn each arrivalDay into {date,times}
                                            const allArrivalDays = arrivalData.map(d => ({
                                                date: d.date,
                                                times: []
                                            }));

                                            let days: { date: Dayjs; times: Dayjs[] }[] = [];
                                            if (newFrequency === "כל יום") {
                                                days = allArrivalDays;
                                            } else if (newFrequency === "בסוף אירוע") {
                                                days = [allArrivalDays[allArrivalDays.length - 1]]
                                            }

                                            setNewRow(prev => ({
                                                ...prev,
                                                frequency: newFrequency,
                                                days,
                                            }));
                                        }}
                                    >
                                        {allHazarot.map(hz => (
                                            <MenuItem key={hz.id} value={hz.name}>
                                                {hz.name}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                </FormControl>

                                {/* מס פעמים */}
                                {newRow.frequency === "מס פעמים" && (
                                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
                                        {newRow.days.map((dayObj, i) => {
                                            const arrivalInfo = arrivalData.find(a => a.date.isSame(dayObj.date, 'day'));

                                            const minTime = arrivalInfo?.from ?? undefined;
                                            const maxTime = arrivalInfo?.to ?? undefined;

                                            return (
                                                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() =>
                                                            setNewRow(prev => ({
                                                                ...prev,
                                                                days: prev.days.filter((_, j) => j !== i),
                                                            }))
                                                        }
                                                        sx={{ textTransform: "none", fontSize: "0.8rem" }}
                                                    >
                                                        {dayObj.date.format("DD/MM")} ×
                                                    </Button>

                                                    <FormControl size="small" sx={{ width: 64 }}>
                                                        <InputLabel>פעמים</InputLabel>
                                                        <Select
                                                            value={dayObj.times.length || ""}
                                                            label="פעמים"
                                                            onChange={e => {
                                                                const count = Number(e.target.value);
                                                                setNewRow(prev => ({
                                                                    ...prev,
                                                                    days: prev.days.map((d, j) =>
                                                                        j === i ? { ...d, times: Array(count).fill(null) } : d
                                                                    ),
                                                                }));
                                                            }}
                                                        >
                                                            {[1, 2, 3, 4].map(n => (
                                                                <MenuItem key={n} value={n}>{n}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>

                                                    {dayObj.times.map((timeVal, idx) => (
                                                        <TimePicker
                                                            key={idx}
                                                            value={timeVal}
                                                            minTime={minTime}
                                                            maxTime={maxTime}
                                                            onChange={(newVal) => {
                                                                if (newVal === null) return;
                                                                setNewRow(prev => ({
                                                                    ...prev,
                                                                    days: prev.days.map((d, j) =>
                                                                        j === i
                                                                            ? {
                                                                                ...d,
                                                                                times: d.times.map((t, k) =>
                                                                                    k === idx ? newVal! : t
                                                                                ),
                                                                            }
                                                                            : d
                                                                    ),
                                                                }));
                                                            }}
                                                            slotProps={{
                                                                textField: {
                                                                    size: 'small',
                                                                    sx: { width: 100 }
                                                                }
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                )}


                                {/* בסוף אירוע */}
                                {newRow.frequency === "בסוף אירוע" && (
                                    <Box>
                                        <Typography sx={{ fontSize: '0.875rem', color: 'gray', px: 2 }}>
                                            {formatArrivalSummary([arrivalData[arrivalData.length - 1]])}
                                        </Typography>

                                        {(() => {
                                            const lastArrival = arrivalData[arrivalData.length - 1];
                                            const minTime = lastArrival?.from ?? undefined;
                                            const maxTime = lastArrival?.to ?? undefined;

                                            return (
                                                <TimePicker
                                                    value={newRow.days[0]?.times[0] ?? null}
                                                    minTime={minTime}
                                                    maxTime={maxTime}
                                                    onChange={(newVal) => {
                                                        if (newVal === null) return;
                                                        setNewRow(prev => ({
                                                            ...prev,
                                                            days: prev.days.map(d => ({
                                                                ...d,
                                                                times: [newVal]
                                                            })),
                                                        }));
                                                    }}
                                                    slotProps={{
                                                        textField: {
                                                            size: "small",
                                                            sx: { width: 110, bgcolor: "lightgray" }
                                                        }
                                                    }}
                                                />
                                            );
                                        })()}
                                    </Box>
                                )}

                                {/* כל יום */}
                                {newRow.frequency === "כל יום" && (
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>

                                        <Typography sx={{ fontSize: '0.875rem', color: 'gray', px: 2 }}>
                                            {formatArrivalSummary(arrivalData)}
                                        </Typography>

                                        {/* pick how many times per day  */}

                                        <FormControl size="small" sx={{ width: 80 }}>
                                            <InputLabel>פעמים ליום</InputLabel>
                                            <Select
                                                value={newRow.days[0]?.times.length || ""}
                                                label="פעמים ליום"
                                                onChange={e => {
                                                    const count = Number(e.target.value);
                                                    setNewRow(prev => ({
                                                        ...prev,
                                                        days: prev.days.map(d => ({ ...d, times: Array(count).fill(null) })),
                                                    }));
                                                }}
                                            >
                                                {[1, 2, 3, 4].map(n => (
                                                    <MenuItem key={n} value={n}>{n}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        {/* a single row of time inputs (same for all days)  */}
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            {newRow.days[0]?.times.map((timeVal, idx) => {
                                                const firstDay = newRow.days[0];
                                                const arrivalInfo = arrivalData.find(a => a.date.isSame(firstDay.date, 'day'));

                                                return (
                                                    <TimePicker
                                                        key={idx}
                                                        value={timeVal}
                                                        minTime={arrivalInfo?.from ?? undefined}
                                                        maxTime={arrivalInfo?.to ?? undefined}
                                                        onChange={(newVal) => {
                                                            if (newVal === null) return;
                                                            setNewRow(prev => ({
                                                                ...prev,
                                                                days: prev.days.map(d => ({
                                                                    ...d, times: d.times.map((t, k) => (k === idx ? newVal : t))
                                                                }))
                                                            }))

                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                size: "small",
                                                                sx: { width: 110, bgcolor: "lightgray" }
                                                            }
                                                        }}
                                                    />
                                                )
                                            }
                                            )}


                                        </Box>
                                    </Box>
                                )}

                            </Box>
                        </TableCell>
                        <TableCell>

                            <Button color="error" variant="contained" onClick={() => setCalendarOpen(true)}>📅</Button>
                        </TableCell>

                    </TableRow>

                </TableBody>
            </Table>
        </Box >
    );
}

