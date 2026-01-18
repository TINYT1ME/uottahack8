"use client";

import { theme } from "antd";
import { useEffect } from "react";

export default function ThemeBackground() {
  const { token } = theme.useToken();

  useEffect(() => {
    // Apply theme background color to body
    document.body.style.backgroundColor = token.colorBgBase || "#0a0a0a";
    document.documentElement.style.backgroundColor = token.colorBgBase || "#0a0a0a";

    return () => {
      // Cleanup on unmount
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, [token.colorBgBase]);

  return null;
}
