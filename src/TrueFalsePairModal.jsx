import React, { useState, useEffect, useRef } from 'react';

// ===== THAY ĐỔI: Nhận thêm prop `currentPlayerId` =====
const TrueFalsePairModal = ({ onClose, question, players, onCorrectAnswer, activeDoublePointsTeamId, isAnimatingOut, currentPlayerId }) => {

    // ===== THAY ĐỔI: State `answers` sẽ được khởi tạo động =====
    const [answers, setAnswers] = useState({});
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);

    // ===== THAY ĐỔI: Thời gian sẽ dựa trên số lượng mệnh đề (20 giây/mệnh đề) =====
    const [timeLeft, setTimeLeft] = useState(20 * question.statements.length);
    const timerRef = useRef(null);

    const handleTimeUp = () => {
        setIsAnswered(true);
        setIsCorrect(false);
    };

    useEffect(() => {
        // ===== THAY ĐỔI: Khởi tạo `answers` dựa trên số lượng mệnh đề =====
        const initialAnswers = {};
        question.statements.forEach((_, index) => {
            initialAnswers[index] = null;
        });
        setAnswers(initialAnswers);
        // ========================================================

        setIsAnswered(false);
        setIsCorrect(null);

        // ===== THAY ĐỔI: Tính toán thời gian động =====
        const totalTime = 20 * question.statements.length;
        setTimeLeft(totalTime);
        // ========================================

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

    const handleOptionClick = (statementIndex, choice) => {
        if (isAnswered) return;
        setAnswers(prev => ({ ...prev, [statementIndex]: choice }));
    };

    const handleCheckAnswer = () => {
        // ===== THAY ĐỔI: Kiểm tra tất cả mệnh đề đã được trả lời chưa =====
        const allAnswered = question.statements.every((_, index) => answers[index] !== null);
        if (!allAnswered) return;
        // ==========================================================

        clearInterval(timerRef.current);
        setIsAnswered(true);

        // ===== THAY ĐỔI: Duyệt qua tất cả mệnh đề để kiểm tra đáp án =====
        let allCorrect = true;
        for (let i = 0; i < question.statements.length; i++) {
            if (answers[i] !== question.statements[i].correctAnswer) {
                allCorrect = false;
                break;
            }
        }
        setIsCorrect(allCorrect);
        // ===========================================================
    };

    const handleAwardPoints = (teamId) => {
        onCorrectAnswer(points, question.id, teamId, activeDoublePointsTeamId);
    };

    // ===== THAY ĐỔI: Tìm người chơi hiện tại =====
    const currentPlayer = players.find(p => p.id === currentPlayerId);

    const getGliderStyle = (statementIndex) => {
        const style = { ...styles.glider };
        const userChoice = answers[statementIndex];
        if (userChoice === null) {
            style.opacity = 0;
        } else {
            style.transform = userChoice === true ? 'translateX(0%)' : 'translateX(100%)';
        }
        if (!isAnswered) {
            if (userChoice === true) style.backgroundColor = '#10b981';
            else if (userChoice === false) style.backgroundColor = '#ef4444';
        } else {
            // Kiểm tra đáp án của TỪNG mệnh đề
            const isChoiceCorrect = userChoice === question.statements[statementIndex].correctAnswer;
            style.backgroundColor = isChoiceCorrect ? '#2ed573' : '#ff4757';
        }
        return style;
    };

    const getToggleTextStyle = (statementIndex, choice) => {
        const style = { ...styles.toggleButtonText };
        if (answers[statementIndex] === choice) style.color = '#ffffff';
        return style;
    };

    // ===== THAY ĐỔI: Biến để kiểm tra nút "Kiểm tra đáp án" =====
    const allStatementsAnswered = question.statements.every((_, index) => answers[index] !== null);

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
                <p style={styles.questionTitle}>{question.question}</p>
                {question.statements.map((statement, index) => {
                    const itemAnimation = {
                        animation: isAnimatingOut ? 'none' : `fadeInUpItem 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                        animationDelay: `${300 + index * 150}ms`,
                        animationFillMode: 'backwards',
                    };

                    const finalStyle = { ...styles.statementBlock, ...itemAnimation };

                    return (
                        <div key={statement.id} style={finalStyle}>
                            <p style={styles.statementText}>{index + 1}. {statement.text}</p>
                            <div style={styles.toggleContainer}>
                                <div style={getGliderStyle(index)}></div>
                                <button style={styles.toggleButton} onClick={() => handleOptionClick(index, true)} disabled={isAnswered}>
                                    <span style={getToggleTextStyle(index, true)}>Đúng</span>
                                </button>
                                <button style={styles.toggleButton} onClick={() => handleOptionClick(index, false)} disabled={isAnswered}>
                                    <span style={getToggleTextStyle(index, false)}>Sai</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={styles.footer}>
                {!isAnswered && (
                    // ===== THAY ĐỔI: Logic disable nút =====
                    <button
                        style={{...styles.checkAnswerButton, opacity: allStatementsAnswered ? 1 : 0.5}}
                        onClick={handleCheckAnswer}
                        disabled={!allStatementsAnswered}
                    >
                        Kiểm tra đáp án
                    </button>
                )}
                {isAnswered && isCorrect && (
                    <>
                        <p style={{...styles.feedbackText, color: '#2ed573'}}>Chính xác!</p>
                        <p style={styles.awardText}>Thưởng điểm cho đội:</p>
                        <div style={styles.answerButtonsContainer}>
                            {currentPlayer ? (
                                <button key={currentPlayer.id} style={{ ...styles.awardButton, backgroundColor: currentPlayer.color }} onClick={() => handleAwardPoints(currentPlayer.id)}>
                                    {currentPlayer.pawn} {currentPlayer.name}
                                </button>
                            ) : (
                                <p>Lỗi: Không tìm thấy người chơi.</p>
                            )}
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
    modal: { backgroundColor: '#1e293b', color: 'white', borderRadius: '16px', padding: '25px', width: '90%', maxWidth: '700px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '15px' },
    timer: { fontSize: '1.5rem', fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace", transition: 'color 0.3s' },
    points: { padding: '5px 15px', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a2e' },
    closeButton: { background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' },
    content: { padding: '10px 0' },
    questionTitle: { fontSize: '1.5rem', textAlign: 'center', margin: '0 0 25px 0', fontWeight: 'bold', color: '#cbd5e1' },
    statementBlock: { marginBottom: '20px', padding: '20px', backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', borderLeft: '4px solid #94a3b8' },
    statementText: { fontSize: '1.1rem', margin: '0 0 15px 0', lineHeight: 1.5 },
    toggleContainer: { display: 'flex', position: 'relative', width: '200px', margin: '0 auto', backgroundColor: '#334155', borderRadius: '30px', padding: '4px' },
    glider: { position: 'absolute', top: '4px', left: '4px', height: 'calc(100% - 8px)', width: 'calc(50% - 4px)', borderRadius: '30px', transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.3s' },
    toggleButton: { flex: 1, padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', zIndex: 1 },
    toggleButtonText: { fontSize: '1rem', fontWeight: 'bold', color: '#94a3b8', transition: 'color 0.3s' },
    footer: { paddingTop: '15px', borderTop: '1px solid #334155', textAlign: 'center', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    checkAnswerButton: { padding: '12px 25px', border: 'none', borderRadius: '8px', backgroundColor: '#feca57', color: '#1a1a2e', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', transition: 'opacity 0.2s' },
    feedbackText: { fontSize: '1.4rem', fontWeight: 'bold', margin: '10px 0' },
    awardText: { margin: '10px 0', color: '#cbd5e1' },
    answerButtonsContainer: { display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' },
    awardButton: { padding: '10px 15px', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '200px', justifyContent: 'center' }
};

export default TrueFalsePairModal;