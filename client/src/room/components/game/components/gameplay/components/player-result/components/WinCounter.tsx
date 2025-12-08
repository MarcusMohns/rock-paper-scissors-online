import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
type Props = {
  winCounter: (boolean | null)[];
};
const WinCounter = ({ winCounter }: Props) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        mb: 1,
      }}
    >
      {winCounter.map((win, idx) => (
        <Box
          key={`wincounter-${idx}`}
          sx={{
            width: 10,
            height: 20,
            borderRadius: 0.5,
            backgroundColor: win === null ? "grey" : win ? "green" : "red",
          }}
        ></Box>
      ))}
    </Stack>
  );
};

export default WinCounter;
