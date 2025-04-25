import { Dayjs } from "dayjs";


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



export const calculateSummary = (subServices: SubServiceRow[], days: number) => {
    let subM = 0;
    let stayM = 300 * days;

    const serviceCounts: Record<number, number> = {};

    subServices.forEach((row) => {
        const service = allServices.find((s) => s.id === row.serviceId);
        if (!service) return;

        const dogCount = row.dogs.length;
        // sum up every selected time across all days
        const timesTotal = row.days.reduce((sum, d) => sum + d.times.length, 0);
        // if somehow you have no days, default to 1 execution
        const executions = timesTotal > 0 ? timesTotal : 1;

        // total price for this row
        const rowCount = dogCount * executions;
        subM += service.price * rowCount;

        // accumulate unit‐counts per service
        serviceCounts[row.serviceId] =
            (serviceCounts[row.serviceId] || 0) + rowCount;
    });

    let total = subM + stayM



    return { total, serviceCounts };
};