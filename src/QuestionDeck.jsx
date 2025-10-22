import React, { useState, useEffect } from 'react';

const QuestionCard = ({
    questionData,
    isFlipped,
    isAnswered,
    onCardClick,
    onViewQuestion,
    players,
    doublePointsState,
    onActivateDoublePoints,
    activeDoublePointsTeamId,
    sequenceNumber,
    currentPlayerId // ===== NHẬN PROP MỚI =====
}) => {
    const [isViewBtnHovered, setViewBtnHovered] = useState(false);
    const [hoveredX2Id, setHoveredX2Id] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleButtonClick = (e, callback) => {
        e.stopPropagation();
        callback();
    };

    const cardStyles = {
        ...styles.cardContainer,
        ...( !isFlipped && !isAnswered ? styles.cardHover : {} ),
        cursor: isAnswered ? 'default' : 'pointer',
    };

    const frontFaceStyle = {
        ...styles.cardFace,
        ...styles.cardFront,
        ...(isAnswered ? styles.cardAnswered : {}),
        opacity: isFlipped ? 0 : 1,
        pointerEvents: isFlipped ? 'none' : 'auto',
    };

    const backFaceStyle = {
        ...styles.cardFace,
        ...styles.cardBack,
        opacity: isFlipped ? 1 : 0,
        pointerEvents: isFlipped ? 'auto' : 'none',
    };

    const viewButtonStyle = {
        ...styles.viewQuestionButton,
        ...(isMobile ? styles.viewQuestionButtonMobile : {}),
        ...(isViewBtnHovered ? styles.viewQuestionButtonHover : {})
    };

    // Style cho số thứ tự, mặc định màu trắng
    const numberStyle = {
        ...(isMobile ? styles.cardQuestionMarkMobile : styles.cardQuestionMark),
        color: isAnswered ? '#9ca3af' : 'white'
    };

    return (
        <div style={cardStyles} onClick={isFlipped || isAnswered ? null : onCardClick}>
            <div style={styles.cardInner}>
                {/* --- MẶT TRƯỚC THẺ --- */}
                <div style={frontFaceStyle}>
                    <div style={styles.cardGloss}></div>
                    {/* ===== HIỂN THỊ SỐ THỨ TỰ CỦA THẺ ===== */}
                    <span style={numberStyle}>
                        {isAnswered ? '✓' : sequenceNumber}
                    </span>
                    {isAnswered && <span style={isMobile ? styles.cardUsedTextMobile : styles.cardUsedText}>ĐÃ SỬ DỤNG</span>}
                </div>
                {/* --- MẶT SAU THẺ (HIỂN THỊ ĐIỂM THẬT) --- */}
                <div style={backFaceStyle}>
                    <div style={styles.cardGloss}></div>
                    <div style={styles.questionContent}>
                        <div style={styles.pointsContainer}>
                            <p style={isMobile ? styles.pointsOnBackMobile : styles.pointsOnBack}>{questionData.points}</p>
                            <p style={isMobile ? styles.pointsLabelMobile : styles.pointsLabel}>ĐIỂM</p>
                        </div>

                        {/* ===== CẬP NHẬT LOGIC NÚT X2 ===== */}
                        <div style={styles.doublePointsContainer}>
                            {isFlipped && activeDoublePointsTeamId === null && players.map(p => {
                                // ===== ĐIỀU KIỆN MỚI =====
                                // Chỉ hiển thị nút x2 nếu:
                                // 1. Đội đó CÒN lượt x2
                                // 2. Đội đó LÀ NGƯỜI CHƠI HIỆN TẠI (p.id === currentPlayerId)
                                if (!doublePointsState[p.id] || p.id !== currentPlayerId) {
                                    return null;
                                }
                                // ===========================

                                const doubleButtonStyle = {
                                    ...styles.doubleButton,
                                    ...(isMobile ? styles.doubleButtonMobile : {}),
                                    color: p.color,
                                    borderColor: p.color,
                                    ...(hoveredX2Id === p.id ? {...styles.doubleButtonHover, boxShadow: `0 0 15px ${p.color}`} : {})
                                };
                                return (
                                    <button
                                        key={p.id}
                                        title={`Đội ${p.name} nhân đôi`}
                                        style={doubleButtonStyle}
                                        onMouseEnter={() => setHoveredX2Id(p.id)}
                                        onMouseLeave={() => setHoveredX2Id(null)}
                                        onClick={(e) => handleButtonClick(e, () => onActivateDoublePoints(p.id))}
                                    >
                                        x2
                                    </button>
                                );
                            })}
                            {activeDoublePointsTeamId !== null && (
                                <p style={isMobile ? styles.doubleIndicatorMobile : styles.doubleIndicator}>x2 ĐIỂM!</p>
                            )}
                        </div>
                        {/* ================================== */}
                        
                        <button
                            style={viewButtonStyle}
                            onMouseEnter={() => setViewBtnHovered(true)}
                            onMouseLeave={() => setViewBtnHovered(false)}
                            onClick={(e) => handleButtonClick(e, () => onViewQuestion(questionData))}
                        >
                            <span style={styles.buttonText}>Xem câu hỏi</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Component chính cho bộ bài ---
// ===== NHẬN PROP MỚI: currentPlayerId =====
const QuestionDeck = ({ questions, answeredCardIds, players, doublePointsState, onActivateDoublePoints, onViewQuestion, currentPlayerId }) => {
    const [flippedCardId, setFlippedCardId] = useState(null);
    const [activeDoublePointsTeamId, setActiveDoublePointsTeamId] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (flippedCardId && answeredCardIds.includes(flippedCardId)) {
            setFlippedCardId(null);
            setActiveDoublePointsTeamId(null);
        }
    }, [answeredCardIds, flippedCardId]);

    const handleCardClick = (id) => {
        if (answeredCardIds.includes(id)) return;
        setFlippedCardId(id);
        setActiveDoublePointsTeamId(null);
    };

    const handleActivateDoublePoints = (teamId) => {
        onActivateDoublePoints(teamId, flippedCardId);
        setActiveDoublePointsTeamId(teamId);
    };

    return (
        <div style={isMobile ? styles.deckContainerMobile : styles.deckContainer}>
            {/* ===== Lấy 'index' để làm số thứ tự cho thẻ ===== */}
            {questions.map((q, index) => (
                <QuestionCard
                    key={q.id}
                    questionData={q}
                    sequenceNumber={index + 1} // Truyền số thứ tự vào
                    isFlipped={flippedCardId === q.id}
                    isAnswered={answeredCardIds.includes(q.id)}
                    onCardClick={() => handleCardClick(q.id)}
                    onViewQuestion={onViewQuestion}
                    players={players}
                    doublePointsState={doublePointsState}
                    onActivateDoublePoints={handleActivateDoublePoints}
                    activeDoublePointsTeamId={flippedCardId === q.id ? activeDoublePointsTeamId : null}
                    currentPlayerId={currentPlayerId} // ===== TRUYỀN XUỐNG CARD =====
                />
            ))}
        </div>
    );
};

const styles = {
    deckContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '12px',
        padding: '15px',
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '900px',
        margin: '1rem auto',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
    },
    deckContainerMobile: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        padding: '10px',
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        borderRadius: '12px',
        width: '100%',
        margin: '0.5rem auto',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
    },
    cardContainer: {
        aspectRatio: '5 / 7',
        position: 'relative',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        minHeight: '100px',
    },

    cardInner: {
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '10px',
        boxShadow: 'inset 0 0 2px rgba(255, 255, 255, 0.2)',
        overflow: 'hidden',
    },
    cardFace: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        transition: 'opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        flexDirection: 'column',
    },
    cardGloss: {
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '100%',
        height: '200%',
        transform: 'rotate(15deg)',
    },
    cardFront: {
        background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
    },
    cardAnswered: {
        background: 'linear-gradient(135deg, #1f2937, #4b5563)',
    },
    cardBack: {
        background: 'linear-gradient(135deg, #111827, #1e293b)',
        padding: '10px',
    },
    cardQuestionMark: {
        fontFamily: '"Arial Black", Gadget, sans-serif',
        fontSize: '3.5rem',
        fontWeight: '900',
        textShadow: '0 5px 15px rgba(0, 0, 0, 0.4)',
        zIndex: 1,
    },
    cardQuestionMarkMobile: {
        fontFamily: '"Arial Black", Gadget, sans-serif',
        fontSize: '2.8rem',
        fontWeight: '900',
        textShadow: '0 5px 15px rgba(0, 0, 0, 0.4)',
        zIndex: 1,
    },
    cardUsedText: {
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'rgba(255, 255, 255, 0.7)',
        zIndex: 1,
    },
    cardUsedTextMobile: {
        fontSize: '0.6rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'rgba(255, 255, 255, 0.7)',
        zIndex: 1,
    },
    questionContent: {
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
    },
    pointsContainer: {
        textAlign: 'center',
    },
    pointsOnBack: {
        fontFamily: '"Arial Black", Gadget, sans-serif',
        fontSize: '2rem',
        margin: 0,
        fontWeight: '900',
        background: 'linear-gradient(135deg, #fef08a, #facc15)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        textShadow: '0 2px 5px rgba(250, 204, 21, 0.3)',
    },
    pointsOnBackMobile: {
        fontFamily: '"Arial Black", Gadget, sans-serif',
        fontSize: '1.6rem',
        margin: 0,
        fontWeight: '900',
        background: 'linear-gradient(135deg, #fef08a, #facc15)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        textShadow: '0 2px 5px rgba(250, 204, 21, 0.3)',
    },
    pointsLabel: {
        margin: '-2px 0 5px 0',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        color: 'rgba(255, 255, 255, 0.6)',
        letterSpacing: '0.15em',
    },
    pointsLabelMobile: {
        margin: '-2px 0 0 0',
        fontSize: '0.6rem',
        fontWeight: 'bold',
        color: 'rgba(255, 255, 255, 0.6)',
        letterSpacing: '0.1em',
    },
    doublePointsContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '6px',
        minHeight: '28px',
        width: '100%',
    },
    doubleButton: {
        background: 'rgba(0,0,0,0.3)',
        border: '1.5px solid',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
    },
    doubleButtonMobile: {
        width: '26px',
        height: '26px',
        fontSize: '0.8rem',
    },
    doubleButtonHover: {
        /* (Bạn có thể thêm style hover tại đây nếu muốn, ví dụ: transform: 'scale(1.1)') */
    },
    doubleIndicator: {
        fontSize: '0.8rem',
        margin: 0,
        color: '#ef4444',
        fontWeight: 'bold',
    },
    doubleIndicatorMobile: {
        fontSize: '0.7rem',
        margin: 0,
        color: '#ef4444',
        fontWeight: 'bold',
    },
    viewQuestionButton: {
        padding: '6px 10px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #10b981, #2ed573)',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '0.8rem',
        width: '100%',
        marginTop: 'auto',
        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
        transition: 'all 0.3s ease',
        transform: 'translateY(0) scale(1)',
    },
    viewQuestionButtonMobile: {
        padding: '5px 8px',
        fontSize: '0.7rem',
        borderRadius: '6px',
    },
    viewQuestionButtonHover: {
        background: 'linear-gradient(135deg, #059669, #10b981)',
        boxShadow: '0 6px 20px rgba(16, 185, 129, 0.5)',
    },
    buttonText: {
        position: 'relative',
        zIndex: 1,
    }
};

export default QuestionDeck;