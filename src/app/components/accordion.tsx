"use client";
import { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Box, TextField } from '@mui/material';
import { Dayjs } from "dayjs";
import BuutonToggle from "./togelbuttons";
import AriveNDeparture from './arrivalAndDeparture';
import DogInput from './dogInput';
import { formatArrivalSummary } from "../services/formatArrivalSummary";
import ServicesComp from "./servicesComp";
import OrderSummary from "./orderSummary";

interface SubServiceRow {
    id: number;
    serviceId: number;
    dogs: string[];
    frequency: string;
    days: { date: Dayjs; times: Dayjs[] }[];
}

export function MyAccordion() {
    const steps = ["לקוח", "שירות", "הגעה ועזיבה", "כלבים", "תתי שירותים", "סיכום הזמנה"];
    const [completed, setCompleted] = useState<boolean[]>(Array(steps.length).fill(false));
    const [expandedPanels, setExpandedPanels] = useState<number[]>([0]);
    const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
    const [activeStep, setActiveStep] = useState(0);

    const [arrivalData, setArrivalData] = useState<{ date: Dayjs; from: Dayjs | null; to: Dayjs | null }[]>([]);
    const [dogNames, setDogNames] = useState<string[]>([]);
    const [subServices, setSubServices] = useState<SubServiceRow[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);


    const [formData, setFormData] = useState({
        customerName: '',
        serviceType: '',
        arrivalTime: arrivalData,
        dogNames: dogNames,
        subServices: subServices,
        totalPrice: totalPrice
    });

    const isStepValid = (step = activeStep) => {
        switch (step) {
            case 0:
                return formData.customerName.trim() !== '';
            case 1:
                return formData.serviceType.trim() !== '';
            case 2:
                return (
                    arrivalData.length > 0 &&
                    arrivalData.every((entry) => entry.from && entry.to)
                );
            case 3:
                return dogNames.length > 0;
            case 4:
                return formData.subServices.length > 0;
            case 5:
                return true;
            default:
                return false;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePanel = (index: number) => {
        if (index === activeStep || completed[index] || isStepValid(index)) {
            setExpandedPanels((prev) =>
                prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
            );

            if (index === activeStep) {
                setCurrentPanelIndex(index);
            }
        }
    };

    const handleNext = () => {
        if (!isStepValid(currentPanelIndex)) return;

        if (currentPanelIndex < steps.length - 1) {
            const updated = [...completed];
            updated[currentPanelIndex] = true;
            setCompleted(updated);
            const nextStep = currentPanelIndex + 1;
            setActiveStep(nextStep);
            setCurrentPanelIndex(nextStep);
            setExpandedPanels((prev) => [...new Set([...prev, nextStep])]);
            setExpandedPanels((prev) => prev.filter((i) => i !== currentPanelIndex));
        }
    };

    const handleBack = () => {
        if (currentPanelIndex > 0) {
            const prevStep = currentPanelIndex - 1;
            setActiveStep(prevStep);
            setCurrentPanelIndex(prevStep);
            setExpandedPanels((prev) => [
                ...new Set([
                    ...prev.filter((i) => i !== currentPanelIndex),
                    prevStep
                ])
            ]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isStepValid(currentPanelIndex)) {
            alert("Form submitted!");
            console.log(formData);
        }
    };

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            subServices: subServices,
        }));
    }, [subServices]);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            arrivalTime: arrivalData,
        }));
    }, [arrivalData]);


    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            dogNames: dogNames,
        }));
    }, [dogNames]);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            totalPrice: totalPrice,
        }));
    }, [totalPrice]);




    return (
        <Box>
            <h2 className="font-bold text-lg p-2">הוספת אירוע</h2>

            <form onSubmit={handleSubmit}>
                {steps.map((label, index) => (
                    <Accordion
                        key={index}
                        expanded={expandedPanels.includes(index)}
                        onChange={() => togglePanel(index)}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ bgcolor: '#f3f4f6' }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                }}
                            >
                                <Typography component="span">
                                    {completed[index] ? "✔️" : ""} {label}
                                </Typography>

                                {index === 2 && arrivalData.length > 0 && (
                                    <Typography sx={{ fontSize: '0.875rem', color: 'gray', px: 2 }}>
                                        {formatArrivalSummary(arrivalData)}
                                    </Typography>
                                )}
                            </Box>
                        </AccordionSummary>

                        <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {index === 0 && (
                                <TextField
                                    sx={{ width: "70%" }}
                                    label="שם לקוח"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    fullWidth

                                />
                            )}
                            {index === 1 && (
                                <BuutonToggle value={formData.serviceType}
                                    onChange={(newValue) =>
                                        setFormData((prev) => ({ ...prev, serviceType: newValue }))
                                    } />
                            )}
                            {index === 2 && (
                                <AriveNDeparture onChange={(data) => setArrivalData(data)} />
                            )}
                            {index === 3 && (
                                <DogInput dogNames={dogNames} setDogNames={setDogNames} />
                            )}
                            {index === 4 && (
                                <ServicesComp
                                    dogNames={dogNames}
                                    subServices={subServices}
                                    arrivalData={arrivalData}
                                    setSubServices={setSubServices} />
                            )}
                            {index === 5 && (
                                <OrderSummary
                                    subServices={subServices}
                                    formData={formData}

                                />
                            )}

                            {index === currentPanelIndex && expandedPanels.includes(index) && (
                                <Box mt={2} display="flex" justifyContent="flex-end" sx={{ gap: 1 }}>
                                    {index !== 0 && (
                                        <Button sx={{ color: "#49d0b0" }} variant="outlined" onClick={handleBack}>
                                            קודם
                                        </Button>
                                    )}
                                    {index === steps.length - 1 ? (
                                        <Button sx={{ bgcolor: "#49d0b0" }} variant="contained" type="submit">
                                            שלח
                                        </Button>
                                    ) : (
                                        <Button
                                            sx={{ bgcolor: "#49d0b0", color: "white" }}
                                            variant="outlined"
                                            onClick={handleNext}
                                        >
                                            הבא
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </form>
        </Box>
    );
}
