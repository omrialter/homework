import { Dayjs } from "dayjs";

interface ArrivalEntry {
    date: Dayjs;
    from: Dayjs | null;
    to: Dayjs | null;
}

export const formatArrivalSummary = (data: ArrivalEntry[]) => {
    if (data.length === 0) return '';

    const sorted = [...data].sort((a, b) => a.date.diff(b.date));
    const ranges: string[] = [];
    let start = sorted[0].date;
    let end = start;

    for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i].date;
        const diff = current.diff(end, 'day');

        if (diff === 1) {
            end = current;
        } else {
            if (start.isSame(end)) {
                ranges.push(start.format('DD/MM/YYYY'));
            } else {
                ranges.push(`${start.format('DD/MM/YYYY')}-${end.format('DD/MM/YYYY')}`);
            }
            start = current;
            end = current;
        }
    }

    if (start.isSame(end)) {
        ranges.push(start.format('DD/MM/YYYY'));
    } else {
        ranges.push(`${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`);
    }

    return `סה"כ ${sorted.length} ימים, ${ranges.join(' , ')}`;
};
