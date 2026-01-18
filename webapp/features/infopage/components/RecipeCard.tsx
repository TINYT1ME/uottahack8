// typescript
                            'use client'
                            import React from 'react'
                            import { Recipe } from '../../../types/types'
                            import { Card } from 'antd'

                            interface Props {
                                recipe: Recipe
                                className?: string
                            }

                            export default function RecipeCard({ recipe, className }: Props) {
                                const {
                                    imageUrl = 'https://picsum.photos/800/450',
                                    title = 'Succulent Mihai Jalbu',
                                    description = 'Shoutout Mihai Jalbu for being the best TA ever and making Uottahack possible!',
                                    servings = 4,
                                    time = '30 mins',
                                    ingredients = [],
                                    instructions = [],
                                } = (recipe || {});

                                const glassBg = "rgba(255, 255, 255, 0.1)"
                                const glassBorder = "1px solid rgba(255, 255, 255, 0.2)"
                                const lightText = "rgba(255,255,255,0.95)"
                                const mutedLight = "rgba(255,255,255,0.85)"

                                const cardStyle: React.CSSProperties = {
                                    width: 700,
                                    minHeight: 440,
                                    backgroundColor: glassBg,
                                    border: glassBorder,
                                    backdropFilter: "blur(10px)",
                                    boxShadow: '0 6px 18px rgba(7, 12, 20, 0.06)',
                                    padding: 0,
                                    borderRadius: "20px",
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                                }

                                const coverContainer: React.CSSProperties = {
                                    position: 'relative',
                                    height: 220,
                                    overflow: 'hidden',
                                    backgroundColor: glassBg,
                                    border: glassBorder,
                                }

                                const coverImageStyle: React.CSSProperties = {
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                    transition: 'transform 0.36s cubic-bezier(.2,.9,.2,1)',
                                }

                                const overlayStyle: React.CSSProperties = {
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.46)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    padding: '16px 18px',
                                    color: lightText,
                                }

                                const titleStyle: React.CSSProperties = {
                                    margin: 0,
                                    fontSize: 40,
                                    fontWeight: 700,
                                    letterSpacing: '-0.5px',
                                    color: lightText,
                                }

                                const subtitleStyle: React.CSSProperties = {
                                    marginTop: 0,
                                    fontSize: 12,
                                    opacity: 0.9,
                                    color: mutedLight,
                                }

                                const pillsContainerStyle: React.CSSProperties = {
                                    padding: '10px 18px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 24,
                                    alignItems: 'flex-start',
                                    flexWrap: 'nowrap',
                                    backgroundColor: glassBg,
                                    border: glassBorder,
                                    width: '100%',
                                }

                                const pillBlockStyle: React.CSSProperties = {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 6,
                                    alignItems: 'flex-start',
                                }

                                const pillTitleStyle: React.CSSProperties = {
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: mutedLight,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                }

                                const pillStyle: React.CSSProperties = {
                                    backgroundColor: glassBg,
                                    border: glassBorder,
                                    padding: '6px 12px',
                                    borderRadius: 8,
                                    fontWeight: 600,
                                    fontSize: 16,
                                    color: lightText,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    whiteSpace: 'nowrap',
                                    alignSelf: 'stretch',
                                }

                                // Layout colonne (Ingrédients puis Instructions)
                                const bodyStyle: React.CSSProperties = {
                                    padding: 18,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 18,
                                    alignItems: 'stretch',
                                }

                                const leftColStyle: React.CSSProperties = {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 10,
                                    minWidth: 0,
                                }

                                const sectionTitleStyle: React.CSSProperties = {
                                    fontSize: 18,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    color: lightText,
                                    letterSpacing: '0.06em',
                                }

                                const ingredientListStyle: React.CSSProperties = {
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 8,
                                    padding: 0,
                                    margin: 0,
                                }

                                const ingredientItemStyle: React.CSSProperties = {
                                    listStyle: 'none',
                                    fontSize: 18,
                                    color: lightText,
                                    backgroundColor: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    padding: '6px 10px',
                                    borderRadius: 8,
                                    maxWidth: '100%',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    boxShadow: '0 1px 0 rgba(16,24,40,0.02)',
                                }

                                const numberBadgeStyle: React.CSSProperties = {
                                    width: 22,
                                    height: 22,
                                    borderRadius: 12,
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    color: lightText,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 12,
                                    fontWeight: 700,
                                    flex: '0 0 22px',
                                    boxShadow: '0 1px 0 rgba(0,0,0,0.15) inset',
                                }

                                const itemTextStyle: React.CSSProperties = {
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: 'block',
                                    lineHeight: 1.4,
                                }

                                const instructionListStyle: React.CSSProperties = {
                                    marginLeft: 4,
                                    paddingLeft: 16,
                                    fontSize: 20,
                                    color: lightText,
                                    lineHeight: 1.6,
                                    maxHeight: 300,
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 8,
                                    padding: 0,
                                }

                                const instructionItemStyle: React.CSSProperties = {
                                    marginBottom: 0,
                                    listStyle: 'none',
                                    display: 'flex',
                                    alignItems: 'center', // centrer badge et texte verticalement
                                    gap: 10,
                                    padding: '6px 0',
                                }

                                return (
                                    <Card
                                        hoverable
                                        bordered={false}
                                        className={className}
                                        bodyStyle={{ padding: 0 }}
                                        style={cardStyle}
                                        onMouseEnter={(e) => {
                                            const img = (e.currentTarget.querySelector('img') as HTMLImageElement)
                                            if (img) img.style.transform = 'scale(1.03)'
                                        }}
                                        onMouseLeave={(e) => {
                                            const img = (e.currentTarget.querySelector('img') as HTMLImageElement)
                                            if (img) img.style.transform = 'scale(1)'
                                        }}
                                    >
                                        <div style={coverContainer}>
                                            <img draggable={false} alt={title} src={imageUrl} style={coverImageStyle} />

                                            <div style={overlayStyle}>
                                                <h3 style={titleStyle}>{title}</h3>
                                                <div style={subtitleStyle}>{description}</div>
                                            </div>
                                        </div>

                                        <div style={pillsContainerStyle}>
                                            <div style={pillBlockStyle}>
                                                <div style={pillTitleStyle}>Portions</div>
                                                <div style={pillStyle}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle', color: mutedLight }}>
                                                        <circle cx="12" cy="12" r="6" stroke={mutedLight} strokeWidth="1.25" />
                                                        <path d="M8 12h8" stroke={mutedLight} strokeWidth="1.25" strokeLinecap="round" />
                                                    </svg>
                                                    <span style={{ verticalAlign: 'middle' }}>{servings} portions</span>
                                                </div>
                                            </div>

                                            <div style={pillBlockStyle}>
                                                <div style={pillTitleStyle}>Temps</div>
                                                <div style={pillStyle}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle', color: mutedLight }}>
                                                        <path d="M12 7v6l4 2" stroke={mutedLight} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke={mutedLight} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <span style={{ verticalAlign: 'middle' }}>{time}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={bodyStyle}>
                                            <div style={leftColStyle}>
                                                <div style={sectionTitleStyle}>Ingrédients</div>
                                                <ul style={ingredientListStyle}>
                                                    {Array.isArray(ingredients) && ingredients.length > 0 ? (
                                                        ingredients.map((ing, i) => (
                                                            <li key={i} style={ingredientItemStyle}>
                                                                <span style={itemTextStyle}>{ing}</span>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li style={{ fontSize: 14, color: mutedLight }}>Aucun ingrédient</li>
                                                    )}
                                                </ul>

                                                <div style={{ height: 8 }} />

                                                <div style={sectionTitleStyle}>Instructions</div>
                                                <ol style={instructionListStyle}>
                                                    {Array.isArray(instructions) && instructions.length > 0 ? (
                                                        instructions.map((step, i) => (
                                                            <li key={i} style={instructionItemStyle}>
                                                                <span style={numberBadgeStyle} aria-hidden>{i + 1}</span>
                                                                <span style={itemTextStyle}>{step}</span>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li style={{ fontSize: 18, color: mutedLight }}>Aucune instruction</li>
                                                    )}
                                                </ol>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            }