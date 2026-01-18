"use client";

import { Flex, Spin, Row, Col, Input, Button, Space } from "antd";
import Aurora from "../homepage/components/Aurora";
import RecipeCard from "./components/RecipeCard";
import { Recipe } from "@/types/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArchetypeCard from "./components/ArchetypeCard";
import {
    UserOutlined,
    HeartOutlined,
    FireOutlined,
    ThunderboltOutlined,
    AppleOutlined,
    CoffeeOutlined,
} from "@ant-design/icons";

interface Archetype {
    icon: React.ReactNode;
    name: string;
    preferences: string[];
}

const archetypes: Archetype[] = [
    {
        icon: <UserOutlined />,
        name: "Vegan",
        preferences: ["Plant-based", "No dairy", "No eggs"],
    },
    {
        icon: <HeartOutlined />,
        name: "Healthy",
        preferences: ["Low calorie", "High protein", "Nutritious"],
    },
    {
        icon: <FireOutlined />,
        name: "Spicy",
        preferences: ["Hot peppers", "Bold flavors", "Heat"],
    },
    {
        icon: <ThunderboltOutlined />,
        name: "Quick",
        preferences: ["Fast prep", "30 min or less", "Simple"],
    },
    {
        icon: <AppleOutlined />,
        name: "Fresh",
        preferences: ["Seasonal", "Organic", "Farm-to-table"],
    },
    {
        icon: <CoffeeOutlined />,
        name: "Comfort",
        preferences: ["Hearty", "Warming", "Satisfying"],
    },
];

export default function InfoPage() {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [customInputs, setCustomInputs] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Read recipe from sessionStorage
        const storedRecipe = sessionStorage.getItem("recipe");

        if (!storedRecipe) {
            // No recipe found, redirect to home
            router.push("/");
            return;
        }

        try {
            const parsedRecipe: Recipe = JSON.parse(storedRecipe);
            setRecipe(parsedRecipe);
        } catch (error) {
            console.error("Error parsing recipe from sessionStorage:", error);
            router.push("/");
        } finally {
            setLoading(false);
        }
    }, [router]);

    const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            setCustomInputs([...customInputs, inputValue.trim()]);
            setInputValue("");
        }
    };

    // Call llm here
    const handleModifyRecipe = () => {
        // TODO: Implement recipe modification logic
        console.log("Modify recipe clicked");
        console.log("Custom inputs:", customInputs);
    };

    if (loading || !recipe) {
        return (
            <div
                style={{
                    position: "relative",
                    minHeight: "100vh",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        position: "fixed",
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
                <Spin size="large" style={{ position: "relative", zIndex: 1 }} />
            </div>
        );
    }

    return (
        <div
            style={{
                position: "relative",
                minHeight: "100vh",
                width: "100%",
                overflow: "auto",
            }}
        >
            <div
                style={{
                    position: "fixed",
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

            <Row
                gutter={[32, 32]}
                style={{
                    position: "relative",
                    zIndex: 1,
                    minHeight: "100vh",
                    paddingTop: "4rem",
                    paddingRight: "15rem",
                    paddingBottom: "2rem",
                    paddingLeft: "7rem",
                    width: "100%",
                }}
            >
                {/* Left Column - Recipe Card */}
                <Col xs={24} lg={14}>
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "600px",
                        }}
                    >
                        <RecipeCard recipe={recipe} />
                    </div>
                </Col>

                {/* Right Column - Archetype Cards, Input, and Button */}
                <Col xs={24} lg={10}>
                    <Flex
                        vertical
                        gap="1.2rem"
                        style={{
                            width: "100%",
                        }}
                    >
                        {/* Archetype Cards Grid - 3 per row */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "1.5rem",
                                width: "100%",
                            }}
                        >
                            {archetypes.map((archetype, index) => (
                                <ArchetypeCard
                                    key={index}
                                    icon={archetype.icon}
                                    name={archetype.name}
                                    preferences={archetype.preferences}
                                />
                            ))}
                        </div>

                        {/* Custom Input */}
                        <div
                            style={{
                                width: "100%",
                            }}
                        >
                            <Input
                                placeholder="Add custom preference (press Enter)"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleInputKeyPress}
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    backdropFilter: "blur(10px)",
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                    borderRadius: "12px",
                                    padding: "0.75rem 1rem",
                                    color: "white",
                                    fontSize: "1rem",
                                }}
                                styles={{
                                    input: {
                                        color: "white",
                                    },
                                }}
                            />
                            {customInputs.length > 0 && (
                                <div
                                    style={{
                                        marginTop: "1rem",
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "0.5rem",
                                    }}
                                >
                                    {customInputs.map((input, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                                                border: "1px solid rgba(255, 255, 255, 0.3)",
                                                borderRadius: "8px",
                                                padding: "0.5rem 1rem",
                                                color: "rgba(255, 255, 255, 0.9)",
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            {input}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Modify Recipe Button */}
                        <Button
                            type="primary"
                            onClick={handleModifyRecipe}
                            size="large"
                            style={{
                                backgroundColor: "rgba(76, 175, 80, 0.8)",
                                border: "none",
                                borderRadius: "12px",
                                padding: "0.75rem 2rem",
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                height: "auto",
                                transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "rgba(76, 175, 80, 1)";
                                e.currentTarget.style.transform = "scale(1.02)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "rgba(76, 175, 80, 0.8)";
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            Modify Recipe
                        </Button>
                    </Flex>
                </Col>
            </Row>
        </div>
    );
}
