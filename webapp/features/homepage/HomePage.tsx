"use client";

import { Typography, Input, Flex } from "antd";
import Aurora from "./components/Aurora";
import TextType from "./components/TextType";
import { useState } from "react";
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
        <Title level={1} style={{ marginBottom: "2rem" }}>
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
            maxWidth: "500px",
          }}
          onPressEnter={(e) => onInputSubmit(e.currentTarget.value)}
        //   onPressEnter={onInputSubmit}
        />
      </Flex>
    </div>
  );
}
