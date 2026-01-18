"use client";

import { Card, Typography } from "antd";
import { ReactNode, useState } from "react";

const { Text } = Typography;

interface ArchetypeCardProps {
    icon: ReactNode;
    name: string;
    preferences: string[];
}

export default function ArchetypeCard({ icon, name, preferences }: ArchetypeCardProps) {
    const [isSelected, setIsSelected] = useState(false);

    const handleClick = () => {
        setIsSelected(!isSelected);
    };

    return (
        <Card
            onClick={handleClick}
            style={{
                width: "200px",
                height: "200px",
                backgroundColor: isSelected
                    ? "rgba(76, 175, 80, 0.3)"
                    : "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: isSelected
                    ? "2px solid rgba(76, 175, 80, 0.6)"
                    : "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: "scale(1)",
            }}
            hoverable
            onMouseEnter={(e) => {
                if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }
            }}
            onMouseLeave={(e) => {
                if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                }
            }}
            styles={{
                body: {
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    height: "100%",
                    gap: "0.5rem",
                },
            }}
        >
            {/* Icon */}
            <div
                style={{
                    fontSize: "2.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isSelected ? "rgba(76, 175, 80, 1)" : "white",
                    transition: "color 0.3s ease",
                }}
            >
                {icon}
            </div>

            {/* Name */}
            <Text
                style={{
                    color: "white",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    textAlign: "center",
                    margin: 0,
                }}
            >
                {name}
            </Text>

            {/* Preferences List */}
            <ul
                style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    width: "100%",
                    flex: 1,
                    justifyContent: "flex-start",
                    alignItems: "center",
                }}
            >
                {preferences.map((preference, index) => (
                    <li
                        key={index}
                        style={{
                            color: "rgba(255, 255, 255, 0.85)",
                            fontSize: "0.85rem",
                            lineHeight: 1.4,
                            textAlign: "center",
                        }}
                    >
                        {preference}
                    </li>
                ))}
            </ul>
        </Card>
    );
}
