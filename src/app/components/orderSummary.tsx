// "use client"
// import { Dayjs } from "dayjs";
// import { Button, Typography, Box } from "@mui/material";

// const allServices = [
//     { id: 1, name: "מקלחת", price: 40.00 },
//     { id: 2, name: "אילוף", price: 100.00 },
//     { id: 3, name: "טיול", price: 25.00 },
//     { id: 4, name: "תספורת", price: 70.00 },
// ];

// interface SubServiceRow {
//     id: number;
//     serviceId: number;
//     dogs: string[];
//     frequency: string;
//     days: { date: Dayjs; times: Dayjs[] }[];
// }
// interface formData {
//     customerName: string;
//     serviceType: string;
//     arrivalTime: { date: Dayjs; from: Dayjs | null; to: Dayjs | null }[];
//     dogNames: string[];
//     subServices: SubServiceRow[];
// }
// interface OrderSummaryProps {
//     subServices: SubServiceRow[];
//     formData: formData
// }


// export default function OrderSummary({ subServices, formData }: OrderSummaryProps) {
//     let total = 0;
//     const serviceCounts: Record<number, number> = {};

//     subServices.forEach((row) => {
//         const service = allServices.find((s) => s.id === row.serviceId);
//         if (!service) return;

//         const dogCount = row.dogs.length;
//         // sum up every selected time across all days
//         const timesTotal = row.days.reduce((sum, d) => sum + d.times.length, 0);
//         // if somehow you have no days, default to 1 execution
//         const executions = timesTotal > 0 ? timesTotal : 1;

//         // total price for this row
//         const rowCount = dogCount * executions;
//         total += service.price * rowCount;

//         // accumulate unit‐counts per service
//         serviceCounts[row.serviceId] =
//             (serviceCounts[row.serviceId] || 0) + rowCount;
//     });

//     return (
//         <Box>
//             <Typography variant="h4">Order summary !!!</Typography>
//             <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
//                 <Typography sx={{ fontWeight: "bold" }}>לקוח: </Typography>
//                 {formData.customerName}
//             </Box>
//             <hr />
//             <Box sx={{ display: "flex", gap: 1 }}>
//                 <Typography sx={{ fontWeight: "bold" }}>כלבים:</Typography>
//                 {formData.dogNames.map((dog, i) => {
//                     return <Typography key={i}>{dog}</Typography>
//                 })}
//             </Box>
//             <hr />

//             <Typography>סך הכל : ₪{total}</Typography>

//         </Box>

//     )
// }

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

const allServices = [
    { id: 1, name: "מקלחת", price: 40.0 },
    { id: 2, name: "אילוף", price: 100.0 },
    { id: 3, name: "טיול", price: 25.0 },
    { id: 4, name: "תספורת", price: 70.0 },
];

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
    // calculate total & counts
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



    return (
        <Box
            sx={{
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 1,
                mx: "auto",
                width: "100%"
            }}
        >
            <Typography variant="h6" gutterBottom>
                סיכום הזמנה
            </Typography>

            <Stack spacing={1}>
                {/* פרטים */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        פרטים:
                    </Typography>
                    <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2">
                            {formData.serviceType}
                        </Typography>
                        <Typography variant="body2">
                            {formData.arrivalTime.length > 0
                                ? formatArrivalSummary(formData.arrivalTime)
                                : ""}
                        </Typography>
                    </Box>
                    <Button size="small" variant="outlined">
                        עדכון
                    </Button>
                </Box>

                <Divider />

                {/* לקוח */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        לקוח:
                    </Typography>
                    <Typography variant="body2">
                        {formData.customerName}
                    </Typography>
                    <Button size="small" variant="outlined">
                        עדכון
                    </Button>
                </Box>

                <Divider />

                {/* כלבים */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        כלבים:
                    </Typography>
                    <Typography variant="body2">
                        {formData.dogNames.join(", ")}
                    </Typography>
                    <Button size="small" variant="outlined">
                        עדכון
                    </Button>
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
                                            justifyContent: "space-between",
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
                    <Button size="small" variant="outlined" sx={{ mt: 1 }}>
                        עדכון
                    </Button>
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
