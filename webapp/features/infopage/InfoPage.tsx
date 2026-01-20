"use client";

import { Flex, Row, Col, Input, Button, Space, Divider, Splitter, Spin, Typography, Alert, notification, Tabs } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Aurora from "../homepage/components/Aurora";
import RecipeCard from "./components/RecipeCard";
import { Recipe } from "@/types/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArchetypeCard from "./components/ArchetypeCard";

import { GlutenFreeIcon, GymBroIcon, HalalIcon, KetoIcon, VeganIcon, LowSugarIcon } from "./icons";
import ShinyText from "../homepage/components/ShinyText";
import { PacmanLoader } from "react-spinners";


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
    const [originalRecipe, setOriginalRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [modifying, setModifying] = useState(false);
    const [customInputs, setCustomInputs] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [selectedArchetypes, setSelectedArchetypes] = useState<Set<number>>(new Set());
    const router = useRouter();

    const [recipeHistory, setRecipeHistory] = useState<Recipe[]>([]);
    const [activeTab, setActiveTab] = useState<string>("original");

    const [api, contextHolder] = notification.useNotification();

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
            setOriginalRecipe(parsedRecipe);
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
            api['warning']({
                title: "No preferences selected",
                description: "Please select at least one preference or archetypes",
                placement: "topRight",
            });
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
            const updatedHistory = [...recipeHistory, transformedRecipe];
            setRecipeHistory(updatedHistory);
            // Set active tab to the latest recipe
            setActiveTab("latest");
            console.log("Recipe history:", updatedHistory);
            console.log("Recipe modified successfully:", transformedRecipe);
        } catch (error) {
            console.error("Error modifying recipe:", error);
            // Optionally show an error message to the user
        } finally {
            // wait for 4 seconds
            await new Promise(resolve => setTimeout(resolve, 4000));
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
            </div>
        );
    }

    return (
        <div
            style={{
                position: "relative",
                minHeight: "100vh",
                width: "100%",
                minWidth: "110rem",
                overflow: "visible",
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

            {contextHolder}

            {/* Home Button - Top Right */}
            <Button
                type="text"
                icon={<HomeOutlined />}
                onClick={() => router.push("/")}
                style={{
                    position: "fixed",
                    top: "2rem",
                    right: "2rem",
                    zIndex: 1000,
                    border: "none",
                    background: "transparent",
                    color: "rgba(255, 255, 255, 0.8)",
                    marginRight: "2rem",
                    fontSize: "2.5rem",
                    padding: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                }}
            />

            {/* Left Column - Recipe Card */}
            {/* <Col xs={24} lg={14}> */}

            {/* Left Card */}
            <Splitter style={{ height: "100%", padding: "5rem" }}>
                <Splitter.Panel defaultSize="50%" resizable={false} >
                    <Flex vertical gap="1.5rem" style={{ width: "100%" }}>

                        {/* Recipe History Tabs */}
                        {recipe && (() => {
                            // Use originalRecipe if available, otherwise use current recipe as original
                            const original = originalRecipe || recipe;

                            // Build all recipes array: original + history
                            const allRecipes = [original, ...recipeHistory];

                            // Build tab items
                            const tabItems = allRecipes.map((r, index) => {
                                let label: string;
                                let key: string;

                                if (index === 0) {
                                    label = "Original";
                                    key = "original";
                                } else if (index === allRecipes.length - 1 && allRecipes.length > 1) {
                                    label = "Latest";
                                    key = "latest";
                                } else {
                                    label = String(index);
                                    key = String(index);
                                }

                                return {
                                    key: key,
                                    label: label,
                                    recipe: r,
                                };
                            });

                            return (
                                <Tabs
                                    activeKey={activeTab}
                                    onChange={(key) => {
                                        setActiveTab(key);
                                        const selectedTab = tabItems.find(tab => tab.key === key);
                                        if (selectedTab) {
                                            setRecipe(selectedTab.recipe);
                                        }
                                    }}
                                    items={tabItems.map(item => ({
                                        key: item.key,
                                        label: item.label,
                                    }))}

                                    style={{
                                        width: "90%",
                                        backgroundColor: "rgba(24, 25, 26, 0.29)",
                                        zIndex: 1,
                                        position: "relative",
                                        paddingLeft: "0.9rem",
                                        paddingRight: "0.9rem",
                                        borderRadius: "12px",
                                        backdropFilter: "blur(10px)",

                                        // border: "1px solid rgba(255, 255, 255, 0.2)",
                                    }}

                                    color="yellow"
                                />
                            );
                        })()}
                        <RecipeCard recipe={recipe} />


                    </Flex>
                </Splitter.Panel>

                {/* </Col> */}

                {/* Right Column - Archetype Cards, Input, and Button */}
                {/* <Col xs={24} lg={10}> */}

                {/* Right Card */}
                <Splitter.Panel defaultSize="50%" resizable={false} min="45rem">
                    <div style={{
                        marginLeft: "2rem",
                        marginTop: "1.5rem",
                        backgroundColor: "rgba(88, 105, 121, 0.6)",
                        padding: "2rem", borderRadius: "12px", overflow: "hidden",
                        minWidth: "45rem",
                        zIndex: 1,
                        position: "relative",

                    }}>
                        <Flex
                            vertical
                            gap="1.2rem"
                            style={{
                                width: "100%",
                            }}

                        >
                            <Typography.Title level={2} style={{ color: "white" }}>Your Preferences</Typography.Title>
                            {/* Archetype Cards Grid - 3 per row */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, 1fr)",
                                    gap: "1.5rem",
                                    width: "100%",
                                    position: "relative",
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
                            {modifying ? (
                                // Loading
                                <div
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.5rem",
                                    }}
                                >
                                    <PacmanLoader color="white" size={30} />
                                    {/* <ShinyText
                                        text="Modifying recipe"
                                        shineColor="rgb(67, 94, 168)"
                                        color="#dcdbdb"
                                        speed={1.3}
                                        spread={120}
                                    /> */}
                                    <Typography.Text type="secondary" style={{ color: "rgba(230, 209, 101, 0.57)" }}>Powered by Yellowcake <span style={{ color: "#4285F4" }}> & Gemini</span></Typography.Text>
                                </div>
                            ) : (
                                <Button
                                    type="primary"
                                    onClick={handleModifyRecipe}
                                    size="large"
                                    loading={modifying}
                                    disabled={modifying}
                                    color="default"
                                    variant="outlined"
                                    style={{
                                        backgroundColor: "rgba(76, 153, 175, 0.55)",
                                        // border: "none",
                                        // borderRadius: "12px",
                                        padding: "0.75rem 2rem",
                                        fontSize: "1.1rem",
                                        fontWeight: 600,
                                        height: "auto",
                                        transition: "all 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!modifying) {
                                            e.currentTarget.style.transform = "scale(1.02)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!modifying) {
                                            e.currentTarget.style.transform = "scale(1)";
                                        }
                                    }}
                                >
                                    Modify Recipe
                                </Button>
                            )}
                        </Flex>
                    </div>


                    {/* </Col> */}
                </Splitter.Panel>
            </Splitter>
        </div >
    );
}
