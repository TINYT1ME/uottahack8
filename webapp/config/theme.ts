import type { ThemeConfig } from "antd";

export const themeConfig: ThemeConfig = {
  token: {
    // Color Palette
    colorPrimary: "#3A29FF", // Primary brand color
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff3232",
    colorInfo: "#1890ff",
    
    // Text Colors
    colorText: "#ffffff", // Default text color (white for dark backgrounds)
    colorTextSecondary: "rgba(255, 255, 255, 0.65)", // Secondary text
    colorTextTertiary: "rgba(255, 255, 255, 0.45)", // Tertiary text
    colorTextQuaternary: "rgba(255, 255, 255, 0.25)", // Quaternary text
    
    // Background Colors
    colorBgBase: "#0a0a0a", // Base background color (dark to complement Aurora)
    colorBgContainer: "rgba(255, 255, 255, 0.1)", // Container background (semi-transparent)
    colorBgElevated: "rgba(255, 255, 255, 0.15)", // Elevated container background
    colorBgLayout: "transparent", // Layout background (transparent to show Aurora)
    
    // Border
    colorBorder: "rgba(255, 255, 255, 0.2)",
    colorBorderSecondary: "rgba(255, 255, 255, 0.1)",
    
    // Font Family - Using Geist Sans from your layout
    fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontFamilyCode: "var(--font-geist-mono), 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
    
    // Font Sizes
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,
    
    // Font Weights
    fontWeightStrong: 600,
    
    // Border Radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 4,
    
    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    
    // Input
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
  },
  components: {
    // Typography customization
    Typography: {
      colorText: "#ffffff",
      colorTextHeading: "#ffffff",
      fontWeightStrong: 600,
    },
    // Input customization
    Input: {
      colorBgContainer: "rgba(255, 255, 255, 0.1)",
      colorText: "#ffffff",
      colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
      colorBorder: "rgba(255, 255, 255, 0.2)",
      activeBorderColor: "#3A29FF",
      hoverBorderColor: "rgba(255, 255, 255, 0.4)",
      paddingBlock: 12,
      paddingInline: 16,
    },
    // Button customization (if you add buttons later)
    Button: {
      colorPrimary: "#3A29FF",
      colorPrimaryHover: "#5245FF",
      colorPrimaryActive: "#2A1FCC",
    },
  },
};
