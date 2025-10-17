import React, { useState, useEffect, useRef } from 'react';

const MultipleChoiceModal = ({ onClose, question, players, onCorrectAnswer, activeDoublePointsTeamId, isAnimatingOut }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [timeLeft, setTimeLeft] = useState(60);
    const timerRef = useRef(null);

    const handleTimeUp = () => {
        setIsAnswered(true);
        setIsCorrect(false);
    };

    useEffect(() => {
        setIsAnswered(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(60);
        timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);

        return () => clearInterval(timerRef.current);
    }, [question]);

    useEffect(() => {
        if (timeLeft <= 0) {
            clearInterval(timerRef.current);
            handleTimeUp();
        }
    }, [timeLeft]);

    const isDouble = activeDoublePointsTeamId !== null;
    const points = isDouble ? question.points * 2 : question.points;

    const handleOptionClick = (index) => {
        if (isAnswered) return;
        clearInterval(timerRef.current);
        setSelectedAnswer(index);
        setIsAnswered(true);
        const correct = index === question.correctAnswer;
        setIsCorrect(correct);
    };

    const handleAwardPoints = (teamId) => {
        onCorrectAnswer(points, question.id, teamId, activeDoublePointsTeamId);
    };

    const getOptionStyle = (index) => {
        if (!isAnswered) {
            return styles.optionButton;
        }
        if (index === question.correctAnswer) {
            return { ...styles.optionButton, ...styles.correctOption };
        }
        if (index === selectedAnswer && index !== question.correctAnswer) {
            return { ...styles.optionButton, ...styles.incorrectOption };
        }
        return { ...styles.optionButton, opacity: 0.6 };
    };

    return (
        <div
            className={isAnimatingOut ? 'modal-content-exit' : 'modal-content-enter'}
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
        >
            <div style={styles.header}>
                <span style={{...styles.timer, color: timeLeft <= 10 ? '#ff4757' : 'white'}}>
                    ⏰ {timeLeft}s
                </span>
                <span style={{ ...styles.points, backgroundColor: isDouble ? '#ff4757' : '#feca57' }}>
                    {points} ĐIỂM {isDouble && '(x2)'}
                </span>
                <button style={styles.closeButton} onClick={onClose}>&times;</button>
            </div>

            <div style={styles.content}>
                <p style={styles.questionText}>{question.question}</p>
                <p style={styles.instructionText}>Chọn một đáp án đúng</p>
                <div style={styles.optionsContainer}>
                    {question.options.map((option, index) => {
                        // ===== ĐÂY LÀ PHẦN SỬA LỖI QUAN TRỌNG =====
                        const itemAnimation = {
                            animation: isAnimatingOut ? 'none' : `fadeInUpItem 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                            animationDelay: `${300 + index * 120}ms`,
                            // Dòng `opacity: 0` đã được XÓA BỎ ở đây
                            animationFillMode: 'backwards',
                        };

                        const finalStyle = { ...getOptionStyle(index), ...itemAnimation };

                        return (
                            <button
                                key={index}
                                style={finalStyle}
                                onClick={() => handleOptionClick(index)}
                                disabled={isAnswered}
                            >
                                <span style={styles.optionLabel}>
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span style={styles.optionText}>
                                    {option}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div style={styles.footer}>
                {isAnswered && isCorrect && (
                    <>
                        <p style={{...styles.feedbackText, color: '#2ed573'}}>Chính xác!</p>
                        <p style={styles.awardText}>Thưởng điểm cho đội:</p>
                        <div style={styles.answerButtonsContainer}>
                            {players.map(player => (
                                <button key={player.id} style={{ ...styles.awardButton, backgroundColor: player.color }} onClick={() => handleAwardPoints(player.id)}>
                                    {player.pawn} {player.name}
                                </button>
                            ))}
                        </div>
                    </>
                )}
                {isAnswered && !isCorrect && (
                     <p style={{...styles.feedbackText, color: '#ff4757'}}>
                        {timeLeft <= 0 ? "Đã hết giờ!" : "Không chính xác!"}
                     </p>
                )}
            </div>
        </div>
    );
};

const styles = {
    modal: { backgroundColor: '#16213e', color: 'white', borderRadius: '16px', padding: '20px', width: '90%', maxWidth: '800px', boxShadow: '0 5px 25px rgba(0,0,0,0.5)', border: '1px solid #4a4a68', display: 'flex', flexDirection: 'column', gap: '15px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #4a4a68', paddingBottom: '10px' },
    timer: { fontSize: '1.5rem', fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace", transition: 'color 0.3s' },
    points: { padding: '5px 15px', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a2e' },
    closeButton: { background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' },
    content: { padding: '10px 0' },
    questionText: { fontSize: '1.5rem', textAlign: 'center', margin: '0 0 10px 0', fontWeight: 'bold' },
    instructionText: { fontSize: '1rem', color: '#ccc', textAlign: 'center', margin: '0 0 20px 0' },
    optionsContainer: { display: 'flex', flexDirection: 'column', gap: '10px' },
    optionButton: {
        background: 'rgba(255, 255, 255, 0.05)', border: '2px solid #4a4a68',
        color: 'white', padding: '15px', borderRadius: '12px',
        fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s ease',
        display: 'flex', alignItems: 'center', gap: '15px', textAlign: 'left',
    },
    optionLabel: {
        fontWeight: 'bold', fontSize: '1rem', color: '#1a1a2e', backgroundColor: '#feca57',
        borderRadius: '50%', width: '30px', height: '30px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    optionText: { flex: 1 },
    correctOption: { borderColor: '#2ed573', backgroundColor: 'rgba(46, 213, 115, 0.2)', cursor: 'default' },
    incorrectOption: { borderColor: '#ff4757', backgroundColor: 'rgba(255, 71, 87, 0.2)', cursor: 'default' },
    footer: { paddingTop: '10px', borderTop: '1px solid #4a4a68', textAlign: 'center', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    feedbackText: { fontSize: '1.4rem', fontWeight: 'bold', margin: '10px 0' },
    awardText: { margin: '10px 0', color: '#ccc' },
    answerButtonsContainer: { display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' },
    awardButton: { padding: '10px 15px', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '200px', justifyContent: 'center' }
};

export default MultipleChoiceModal;