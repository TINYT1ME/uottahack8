"use client";

import { Flex, Spin, Row, Col, Input, Button, Space } from "antd";
import Aurora from "../homepage/components/Aurora";
import RecipeCard from "./components/RecipeCard";
import { Recipe } from "@/types/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArchetypeCard from "./components/ArchetypeCard";

import { GlutenFreeIcon, GymBroIcon, HalalIcon, KetoIcon, VeganIcon, LowSugarIcon } from "./icons";


interface Archetype {
    icon: React.ReactNode;
    name: string;
    preferences: string[];
}

const archetypes: Archetype[] = [
    {
        icon: <VeganIcon />,
        name: "Vegan",
        preferences: ["Plant-based", "No dairy", "No eggs"],
    },
    {
        icon: <GymBroIcon />,
        name: "Gym Bro",
        preferences: ["Low calorie", "High protein", "Nutritious"],
    },
    {
        icon: <KetoIcon />,
        name: "Keto",
        preferences: ["High fat", "Low carb", "No sugar"],
    },
    {
        icon: <GlutenFreeIcon />,
        name: "Gluten-Free",
        preferences: ["No gluten", "No wheat", "No barley"],
    },
    {
        icon: <LowSugarIcon />,
        name: "Low sugar",
        preferences: ["Less sugar", "Sweetener substitues", "Diabetic Friendly"],
    },
    {
        icon: <HalalIcon />,
        name: "Halal",
        preferences: ["No pork", "No alcohol", "No shellfish"],
    },
];

export default function InfoPage() {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [modifying, setModifying] = useState(false);
    const [customInputs, setCustomInputs] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [selectedArchetypes, setSelectedArchetypes] = useState<Set<number>>(new Set());
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

    const handleArchetypeToggle = (index: number) => {
        setSelectedArchetypes((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };


    // Call llm here
    const handleModifyRecipe = async () => {
        if (!recipe) return;

        console.log("Modify recipe clicked");
        console.log("Custom inputs:", customInputs);
        const selectedArchetypeNames = Array.from(selectedArchetypes).map(
            (index) => archetypes[index].name
        );
        console.log("Selected archetypes:", selectedArchetypeNames);

        // Merge archetype names with custom inputs
        const allPreferences = [...selectedArchetypeNames, ...customInputs];

        if (allPreferences.length === 0) {
            console.log("No preferences selected");
            return;
        }

        setModifying(true);
        try {
            const response = await fetch("/api/modify-recipe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipe: recipe,
                    preferences: allPreferences,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to modify recipe");
            }

            const modifiedRecipe = await response.json();

            // Transform the response to match Recipe type
            const transformedRecipe: Recipe = {
                imageUrl: modifiedRecipe.imageUrl || recipe.imageUrl,
                title: modifiedRecipe.recipe_name || modifiedRecipe.title || recipe.title,
                description: modifiedRecipe.description || recipe.description,
                ingredients: modifiedRecipe.ingredients || recipe.ingredients,
                instructions: modifiedRecipe.instructions || recipe.instructions,
                servings: modifiedRecipe.servings || recipe.servings,
                time: modifiedRecipe.time || recipe.time,
                sourceUrl: modifiedRecipe.sourceUrl || recipe.sourceUrl,
            };

            setRecipe(transformedRecipe);
            console.log("Recipe modified successfully:", transformedRecipe);
        } catch (error) {
            console.error("Error modifying recipe:", error);
            // Optionally show an error message to the user
        } finally {
            setModifying(false);
        }
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
                                    isSelected={selectedArchetypes.has(index)}
                                    onClick={() => handleArchetypeToggle(index)}
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
                            loading={modifying}
                            disabled={modifying}
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
                                if (!modifying) {
                                    e.currentTarget.style.backgroundColor = "rgba(76, 175, 80, 1)";
                                    e.currentTarget.style.transform = "scale(1.02)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!modifying) {
                                    e.currentTarget.style.backgroundColor = "rgba(76, 175, 80, 0.8)";
                                    e.currentTarget.style.transform = "scale(1)";
                                }
                            }}
                        >
                            {modifying ? "Modifying..." : "Modify Recipe"}
                        </Button>
                    </Flex>
                </Col>
            </Row>
        </div>
    );
}
