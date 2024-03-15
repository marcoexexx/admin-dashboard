import { Box } from "@mui/material";

export default function BlockedUserErrorPage() {
  return (
    <div>
      <div>
        {/* <img src={OppsImag} className="px-12" /> */}
      </div>

      <h1>You are blocked</h1>

      <Box component="img" src="/static/palm-recognition.svg" width={500} />
    </div>
  );
}
