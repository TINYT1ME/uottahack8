"use client";

import { Typography, Input, Flex, Spin } from "antd";
import Aurora from "./components/Aurora";
import TextType from "./components/TextType";
import { useState } from "react";
import { PacmanLoader } from "react-spinners";
import Paragraph from "antd/es/skeleton/Paragraph";
const { Title } = Typography;

export default function HomePage() {

  const [loading, setLoading] = useState(false);


  function onInputSubmit(value: string) {
    if (loading) return;
    setLoading(true);
    console.log(value);
    // router.push(`/info?url=${value}`);
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
            }}
          >
            <PacmanLoader color="white" size={30} />
            {/* <Typography.Text type="secondary">Fetching recipe...</Typography.Text> */}
          </div>

          {/* Content State */}
          <div
            style={{
              opacity: loading ? 0 : 1,
              visibility: loading ? "hidden" : "visible",
              transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
              transform: loading ? "scale(0.95) translateY(-10px)" : "scale(1) translateY(0)",
              width: "100%",
            }}
          >
            <Title level={1} style={{ marginBottom: "2rem", textAlign: "center" }}>
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
    </div>
  );
}
