"use client"
import { useState, useEffect } from "react";
import { Dialog, Table, TableHead, TableRow, TableCell, TableBody, Button, Select, MenuItem, Box, FormControl, InputLabel, Typography, IconButton } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";



const allServices = [
    { id: 1, name: "מקלחת", price: 40.00 },
    { id: 2, name: "אילוף בסיסי", price: 100.00 },
    { id: 3, name: "טיול", price: 25.00 },
    { id: 4, name: "תספורת", price: 70.00 },
];

interface SubServiceRow {
    id: number;
    serviceId: number;
    dogs: string[];
    frequency: string;
    schedule: string;
    days: { date: Dayjs; times: number }[];
}

interface ServicesCompProps {
    arrivalData: { date: Dayjs; from: Dayjs | null; to: Dayjs | null }[];
    dogNames: string[];
    subServices: SubServiceRow[];
    setSubServices: React.Dispatch<React.SetStateAction<SubServiceRow[]>>;
}

export default function ServicesComp({ dogNames, subServices, setSubServices, arrivalData }: ServicesCompProps) {

    const [selectedServiceId, setSelectedServiceId] = useState<number | "">("");



    const [newRow, setNewRow] = useState<SubServiceRow>({
        id: Date.now(),
        serviceId: 0,
        dogs: dogNames,
        frequency: "בסוף אירוע",
        schedule: "",
        days: [] as { date: Dayjs; times: number }[],
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

        setSubServices(prev => [...prev, { ...newRow, id: Date.now() }]);


        setNewRow({
            id: Date.now(),
            serviceId: 0,
            dogs: dogNames,
            frequency: "בסוף אירוע",
            schedule: "",
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

    const calculateSummary = () => {
        let total = 0;
        const serviceCounts: Record<number, number> = {};

        subServices.forEach((row) => {
            const service = allServices.find((s) => s.id === row.serviceId);
            if (!service) return;

            const dogCount = row.dogs.length;
            const frequencyCount =
                row.days.reduce((sum, d) => sum + d.times, 0) || 1;

            const rowTotal = service.price * dogCount * frequencyCount;
            total += rowTotal;

            serviceCounts[row.serviceId] =
                (serviceCounts[row.serviceId] || 0) + dogCount * frequencyCount;
        });

        return { total, serviceCounts };
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
                                    days: [...prev.days, { date, times: 1 }]
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
                        <TableCell sx={{ borderTopLeftRadius: "8px", fontWeight: "bold", fontSize: "1rem" }}>שיכפול</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>תת שירות</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>כלבים</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>חזרות</TableCell>
                        <TableCell sx={{ borderTopRightRadius: "8px", fontWeight: "bold", fontSize: "1rem", textAlign: "start" }}>תזמון</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>

                    {/* TABLE */}

                    {subServices.map((item) => {
                        const service = allServices.find(s => s.id === item.serviceId);
                        return (
                            <TableRow key={item.id}>

                                {/* duplictae button */}

                                <TableCell sx={{ maxWidth: "80px", px: 1 }}>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <Button variant="outlined" sx={{ color: "#58c3cc" }}>נוסף</Button>
                                        <ContentCopyIcon onClick={() => { duplicateRow(item.id) }} sx={{ color: "#58c3cc", cursor: 'pointer' }} />
                                    </Box>
                                </TableCell>

                                {/* service type */}
                                <TableCell >
                                    <FormControl>
                                        <InputLabel>בחר שירות</InputLabel>
                                        <Select
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

                                {/* לסדר תצוגה */}
                                <TableCell>
                                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
                                        {item.days.map((dayObj, i) => (
                                            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, border: "solid black 1px" }}>
                                                {/* remove-day button */}
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() =>
                                                        setNewRow((prev) => ({
                                                            ...prev,
                                                            days: prev.days.filter((_, j) => j !== i),
                                                        }))
                                                    }
                                                    sx={{ textTransform: "none", fontSize: "0.8rem" }}
                                                >
                                                    {dayObj.date.format("DD/MM")} ×
                                                </Button>


                                                <FormControl size="small" sx={{ width: 64 }}>
                                                    <InputLabel>פעמים</InputLabel>
                                                    <Select
                                                        value={dayObj.times}
                                                        label="פעמים"
                                                        onChange={(e) => {
                                                            const t = Number(e.target.value);
                                                            setNewRow((prev) => ({
                                                                ...prev,
                                                                days: prev.days.map((d, j) =>
                                                                    j === i
                                                                        ? { ...d, times: t }
                                                                        : d
                                                                ),
                                                            }));
                                                        }}
                                                    >
                                                        {[1, 2, 3, 4].map((n) => (
                                                            <MenuItem key={n} value={n}>{n}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        ))}
                                    </Box>



                                </TableCell>

                                <TableCell>
                                    <Button color="error" variant="contained">📅</Button>

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
                        <TableCell>
                            <Button variant="outlined" sx={{ color: "white", bgcolor: "#58c3cc" }} onClick={handleAdd}>הוספה</Button>
                        </TableCell>

                        {/* Service-Type */}
                        <TableCell>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <FormControl>
                                    <InputLabel>בחר שירות</InputLabel>
                                    <Select
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
                        <TableCell >
                            <Box sx={{ display: "flex", gap: 1 }}>
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

                        <TableCell>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <FormControl>
                                    <InputLabel>בחר סוג</InputLabel>
                                    <Select
                                        value={newRow.frequency}
                                        label="בחר חזרות"
                                        onChange={(e) => {
                                            const newFrequency = e.target.value;
                                            // turn each arrivalDay into {date,times}
                                            const allArrivalDays = arrivalData.map(d => ({
                                                date: d.date,
                                                times: 1
                                            }));

                                            setNewRow(prev => ({
                                                ...prev,
                                                frequency: newFrequency,
                                                days: newFrequency === "כל יום" ? allArrivalDays : []
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

                                {newRow.days.length > 0 && (
                                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
                                        {newRow.days.map((dayObj, i) => (
                                            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                {/* remove-day button */}
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() =>
                                                        setNewRow((prev) => ({
                                                            ...prev,
                                                            days: prev.days.filter((_, j) => j !== i),
                                                        }))
                                                    }
                                                    sx={{ textTransform: "none", fontSize: "0.8rem" }}
                                                >
                                                    {dayObj.date.format("DD/MM")} ×
                                                </Button>

                                                {/* per-day times selector */}
                                                <FormControl size="small" sx={{ width: 64 }}>
                                                    <InputLabel>פעמים</InputLabel>
                                                    <Select
                                                        value={dayObj.times}
                                                        label="פעמים"
                                                        onChange={(e) => {
                                                            const t = Number(e.target.value);
                                                            setNewRow((prev) => ({
                                                                ...prev,
                                                                days: prev.days.map((d, j) =>
                                                                    j === i
                                                                        ? { ...d, times: t }
                                                                        : d
                                                                ),
                                                            }));
                                                        }}
                                                    >
                                                        {[1, 2, 3, 4].map((n) => (
                                                            <MenuItem key={n} value={n}>{n}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        ))}
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
            <Button onClick={(() => {
                console.log(calculateSummary())
                console.log(subServices)
            })}>חישוב יחידות</Button>
        </Box >
    );
}

