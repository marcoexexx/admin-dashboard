import React from "react";

import { MuiButton } from "@/components/ui";

export default function InvalidAuthSessionPage() {
  const handleLogin = (_: React.MouseEvent<HTMLButtonElement>) => {
    window.location.href = "/auth/login";
  };

  return (
    <div>
      <div>
        {/* <img src={OppsImag} className="px-12" /> */}
      </div>

      <h1>Invalid Auth Session</h1>

      <div>
        <p>Please login again</p>
      </div>

      <div>
        <MuiButton onClick={handleLogin}>Login</MuiButton>
      </div>
    </div>
  );
}
