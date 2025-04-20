import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
export const Header = () => {

    return (
        <Box sx={{
            display: "flex", height: '80px', justifyContent: 'flex-end', alignItems: 'center', px: 3, gap: 1, boxShadow: 1
        }}>
            < h3 > Header</h3>
            <AccountCircleIcon sx={{ color: "#58c3cd", fontSize: 45 }} />
        </Box >

    )
}