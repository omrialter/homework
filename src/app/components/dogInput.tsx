"use client"
import { Box, TextField, Button, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';


interface DogInputProps {
    dogNames: string[];
    setDogNames: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function DogInput({ dogNames, setDogNames }: DogInputProps) {


    const addADog = () => {
        if (newDog.trim() === "") return;
        if (dogNames.includes(newDog)) return;
        setDogNames([...dogNames, newDog.trim()]);
        setNewDog(""); // clear the input
    };

    const [newDog, setNewDog] = useState("");

    const deleteADog = (_name: string) => {
        const newArray = dogNames.filter(item => item !== _name);
        setDogNames(newArray);
    }





    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2 }} >

                <TextField
                    sx={{ width: "30%" }}
                    label="שם כלב"
                    name="dog"
                    value={newDog}
                    fullWidth
                    onChange={(e) => setNewDog(e.target.value)}
                />


                <Button
                    variant="contained"
                    onClick={addADog}
                    sx={{ fontSize: "1.5rem", minWidth: "48px", padding: "8px" }}
                >
                    +
                </Button>


            </Box>


            <List sx={{ width: "30%", bgcolor: 'background.paper', borderRadius: 2 }}>
                {dogNames.map((dog, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            border: '2px solid #49d0b0',
                            borderRadius: 2,
                            padding: 1,
                            my: 1
                        }}
                    >
                        <ListItemText primary={dog} />
                        <IconButton onClick={() => { deleteADog(dog) }}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>

        </Box>
    )
}
