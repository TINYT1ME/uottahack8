"use client";

import { Typography, Image, Tag, Card, Row, Col, Space } from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Recipe } from "@/types/types";

const { Title } = Typography;

interface RecipeCardProps {
    recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
    return (
        <Card
            style={{
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "20px",
                overflow: "hidden",
            }}
        // bodyStyle={{
        //     padding: 0,
        // }}
        >
            {/* Recipe Title */}
            <div
                style={{
                    padding: "1.5rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}
            >
                <Title
                    level={2}
                    style={{
                        textAlign: "left",
                        fontSize: "2rem",
                        fontWeight: 700,
                        color: "white",
                        letterSpacing: "-0.05rem",
                        lineHeight: 1.2,
                        margin: 0,
                    }}
                >
                    {recipe.title}
                </Title>
            </div>

            {/* Image at the top */}
            {recipe.imageUrl && (
                <div
                    style={{
                        width: "100%",
                        aspectRatio: "16/9",
                        overflow: "hidden",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Image
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        preview={false}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                        fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E"
                    />
                </div>
            )}

            {/* Tags with icons below image */}
            <div
                style={{
                    padding: "1.5rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Space size="middle" wrap>
                    {recipe.time && (
                        <Tag
                            icon={<ClockCircleOutlined />}
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                                border: "1px solid rgba(255, 255, 255, 0.3)",
                                color: "rgba(255, 255, 255, 0.9)",
                                fontSize: "1rem",
                                padding: "0.5rem 1rem",
                                borderRadius: "8px",
                            }}
                        >
                            {recipe.time}
                        </Tag>
                    )}
                    {recipe.servings && (
                        <Tag
                            icon={<UserOutlined />}
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                                border: "1px solid rgba(255, 255, 255, 0.3)",
                                color: "rgba(255, 255, 255, 0.9)",
                                fontSize: "1rem",
                                padding: "0.5rem 1rem",
                                borderRadius: "8px",
                            }}
                        >
                            {recipe.servings} {typeof recipe.servings === "number" && recipe.servings === 1 ? "serving" : "servings"}
                        </Tag>
                    )}
                </Space>
            </div>

            {/* Ingredients (left) and Instructions (right) */}
            <Row
                gutter={[24, 24]}
                style={{
                    padding: "1.5rem",
                }}
            >
                {/* Ingredients - Left Column */}
                <Col xs={24} md={12}>
                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                        <div>
                            <Title
                                level={4}
                                style={{
                                    color: "white",
                                    marginBottom: "1rem",
                                    fontSize: "1.25rem",
                                    fontWeight: 600,
                                }}
                            >
                                Ingredients
                            </Title>
                            <ul
                                style={{
                                    listStyle: "none",
                                    padding: 0,
                                    margin: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.75rem",
                                }}
                            >
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li
                                        key={index}
                                        style={{
                                            color: "rgba(255, 255, 255, 0.9)",
                                            fontSize: "1rem",
                                            lineHeight: 1.6,
                                            paddingLeft: "1.5rem",
                                            position: "relative",
                                        }}
                                    >
                                        <span
                                            style={{
                                                position: "absolute",
                                                left: 0,
                                                top: "0.5rem",
                                                width: "6px",
                                                height: "6px",
                                                borderRadius: "50%",
                                                backgroundColor: "rgba(255, 255, 255, 0.6)",
                                            }}
                                        />
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Col>

                {/* Instructions - Right Column */}
                <Col xs={24} md={12}>
                    {recipe.instructions && recipe.instructions.length > 0 && (
                        <div>
                            <Title
                                level={4}
                                style={{
                                    color: "white",
                                    marginBottom: "1rem",
                                    fontSize: "1.25rem",
                                    fontWeight: 600,
                                }}
                            >
                                Instructions
                            </Title>
                            <ol
                                style={{
                                    listStyle: "none",
                                    padding: 0,
                                    margin: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1rem",
                                }}
                            >
                                {recipe.instructions.map((instruction, index) => (
                                    <li
                                        key={index}
                                        style={{
                                            color: "rgba(255, 255, 255, 0.9)",
                                            fontSize: "1rem",
                                            lineHeight: 1.6,
                                            paddingLeft: "2.5rem",
                                            position: "relative",
                                        }}
                                    >
                                        <span
                                            style={{
                                                position: "absolute",
                                                left: 0,
                                                top: 0,
                                                width: "28px",
                                                height: "28px",
                                                borderRadius: "50%",
                                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "0.9rem",
                                                fontWeight: 600,
                                                color: "white",
                                            }}
                                        >
                                            {index + 1}
                                        </span>
                                        {instruction}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </Col>
            </Row>
        </Card>
    );
}
