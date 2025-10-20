// src/components/ProgressBar.tsx
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function ProgressBar({ percent = 0 }: { percent?: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ flex: 1 }}>
        <LinearProgress variant="determinate" value={percent} />
      </Box>
      <Typography variant="body2" sx={{ minWidth: 48 }}>
        {percent ?? 0}%
      </Typography>
    </Box>
  );
}
