import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';



type Props = {
    value: string;
    onChange: (value: string) => void;
};


export default function ServiceTypeToggle({ value, onChange }: Props) {


    return (

        <ToggleButtonGroup
            value={value}
            exclusive
            onChange={(_e, newValue) => {
                if (newValue !== null) {
                    onChange(newValue);
                }
            }}
            aria-label="סוג שירות"
            sx={{
                direction: 'rtl',
                gap: 1,
                width: "70%",
                display: 'flex',
                justifyContent: 'flex-end',
                '& .MuiToggleButton-root': {
                    borderRadius: '8px',
                    bgcolor: '#49d0b0',
                    color: 'black',
                    '&.Mui-selected': {
                        bgcolor: '#238b79',
                        color: 'white',
                    },
                    '&:hover': {
                        bgcolor: '#3cc8a9',
                    },
                },
            }}
        >
            <ToggleButton value="שעתי" aria-label="שעות">
                <HourglassEmptyIcon sx={{ ml: 1, color: "brown" }} /> שעתי / חד פעמי
            </ToggleButton>
            <ToggleButton value="פנסיון לילה" aria-label="לילה">
                <BedtimeIcon sx={{ ml: 1, color: "blue" }} /> פנסיון לילה
            </ToggleButton>
            <ToggleButton value="פנסיון יום" aria-label="יום">
                <WbSunnyIcon sx={{ ml: 1, color: "yellow" }} /> פנסיון יום
            </ToggleButton>
        </ToggleButtonGroup>

    );
}
