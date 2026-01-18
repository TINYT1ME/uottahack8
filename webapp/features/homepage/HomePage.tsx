"use client";

import { Typography, Input, Flex, Spin } from "antd";
import Aurora from "./components/Aurora";
import TextType from "./components/TextType";
import { useState } from "react";
import { PacmanLoader } from "react-spinners";
import Paragraph from "antd/es/skeleton/Paragraph";
import ShinyText from "./components/ShinyText";
import GlassSurface from "./components/GlassSurface";
const { Title } = Typography;

export default function HomePage() {

  const [loading, setLoading] = useState(false);


  function onInputSubmit(value: string) {
    if (loading) return;
    setLoading(true);
    console.log(value);
    //const recipe = await scrapeRecipe(value);
    // router.push(`/info?url=${recipe}`);
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>
      {/* Call to Action Slogan - positioned absolutely so it doesn't affect layout */}
      <Title
        style={{
          position: "absolute",
          // top: "15%",
          top: "7rem",
          left: "50%",
          transform: loading
            ? "translateX(-50%) scale(0.95) translateY(-10px)"
            : "translateX(-50%) scale(1) translateY(0)",
          textAlign: "center",
          fontSize: "6rem",
          fontWeight: 700,
          color: "white",
          letterSpacing: "-0.2rem",
          lineHeight: 1.2,
          width: "75vw",
          maxWidth: "75vw",
          transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
          opacity: loading ? 0 : 1,
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        Make a recipe your way
      </Title>

      <Flex
        vertical
        align="center"
        justify="center"
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Loading State */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: loading
                ? "translate(-50%, -50%) scale(1)"
                : "translate(-50%, -50%) scale(0.8)",
              opacity: loading ? 1 : 0,
              visibility: loading ? "visible" : "hidden",
              transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <PacmanLoader color="white" size={30} />
            <ShinyText
              text="Fetching recipe"
              shineColor="#b455a3"
              color="#dcdbdb"
              speed={1.3}
              spread={120}
            />
            <Typography.Text type="secondary" style={{ color: "rgba(230, 209, 101, 0.57)" }}>Powered by Yellowcake</Typography.Text>
          </div>

          {/* Content State */}
          <div
            style={{
              opacity: loading ? 0 : 1,
              visibility: loading ? "hidden" : "visible",
              transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
              transform: loading ? "scale(0.95) translateY(-10px)" : "scale(1) translateY(0)",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Title level={2} style={{ marginBottom: "2rem", textAlign: "center", color: "rgba(255, 255, 255, 0.9)" }}>
              {<TextType
                text={["What are we making today?", "Something delicious on your mind?", "Trying something new?"]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
              />}
            </Title>

            <Input
              placeholder="Input recipe URL"
              size="large"
              style={{
                width: "100%",
              }}
              onPressEnter={(e) => onInputSubmit(e.currentTarget.value)}
            />
          </div>
        </div>
      </Flex>
    </div >
  );
}
