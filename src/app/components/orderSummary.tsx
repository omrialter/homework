

"use client";
import { Dayjs } from "dayjs";
import {
    Box,
    Typography,
    Divider,
    Button,
    Stack,
} from "@mui/material";
import { formatArrivalSummary } from "../services/formatArrivalSummary";



interface SubServiceRow {
    id: number;
    serviceId: number;
    dogs: string[];
    frequency: string;
    days: { date: Dayjs; times: Dayjs[] }[];
}
interface FormData {
    customerName: string;
    serviceType: string;
    arrivalTime: { date: Dayjs; from: Dayjs | null; to: Dayjs | null }[];
    dogNames: string[];
    subServices: SubServiceRow[];
}
interface OrderSummaryProps {
    subServices: SubServiceRow[];
    formData: FormData;
}

export default function OrderSummary({
    subServices,
    formData,

}: OrderSummaryProps) {

    const allServices = [
        { id: 1, name: "מקלחת", price: 40.0 },
        { id: 2, name: "אילוף", price: 100.0 },
        { id: 3, name: "טיול", price: 25.0 },
        { id: 4, name: "תספורת", price: 70.0 },
    ];

    let total = 0;
    const serviceCounts: Record<number, number> = {};

    subServices.forEach((row) => {
        const svc = allServices.find((s) => s.id === row.serviceId);
        if (!svc) return;
        const dogCount = row.dogs.length;
        const execCount = row.days.reduce((sum, d) => sum + d.times.length, 0) || 1;
        const rowUnits = dogCount * execCount;
        total += svc.price * rowUnits;
        serviceCounts[row.serviceId] =
            (serviceCounts[row.serviceId] || 0) + rowUnits;
    });
    let daysMoney = formData.arrivalTime.length * 300
    total = total + daysMoney



    return (
        <Box
            sx={{
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 2,
                width: "50%"
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", my: 1, alignItems: "center" }}>
                <Typography variant="h6" gutterBottom>
                    סיכום הזמנה
                </Typography>

                <Typography variant="body2">
                    {formData.arrivalTime.length > 0
                        ? formatArrivalSummary(formData.arrivalTime)
                        : ""}
                </Typography>

            </Box>

            <Stack sx={{ width: "50%" }} spacing={1}>
                {/* פרטים */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between"

                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        פרטים:
                    </Typography>
                    <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2">
                            {formData.serviceType}
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                {/* לקוח */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between"

                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        לקוח:
                    </Typography>
                    <Typography variant="body2">
                        {formData.customerName}
                    </Typography>

                </Box>

                <Divider />

                {/* כלבים */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between"

                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        כלבים:
                    </Typography>
                    <Typography variant="body2">
                        {formData.dogNames.join(", ")}
                    </Typography>

                </Box>

                <Divider />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between"

                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        סה"כ לשירות:
                    </Typography>
                    <Typography variant="body2">
                        ₪{daysMoney}
                    </Typography>

                </Box>

                <Divider />

                {/* שירותים */}
                <Box>
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: "bold" }}
                        gutterBottom
                    >
                        שירותים נוספים:
                    </Typography>
                    <Stack spacing={0.5}>
                        {Object.entries(serviceCounts).map(
                            ([svcId, units]) => {
                                const svc = allServices.find(
                                    (s) => s.id === Number(svcId)
                                )!;
                                return (
                                    <Box
                                        key={svcId}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <Typography variant="body2">
                                            {units} יח' {svc.name}
                                        </Typography>
                                        <Typography variant="body2">
                                            ₪{(svc.price * units).toFixed(2)}
                                        </Typography>
                                    </Box>
                                );
                            }
                        )}
                    </Stack>
                </Box>

                <Divider />

                {/* סה"כ */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: 1,
                    }}
                >
                    <Typography variant="subtitle1" fontWeight="bold">
                        סה"כ :
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                        ₪{total.toFixed(2)}
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
}
