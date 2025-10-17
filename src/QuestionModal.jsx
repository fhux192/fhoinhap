import React from 'react';

const QuestionModal = ({ onClose, question, players, onCorrectAnswer, activeDoublePointsTeamId, isAnimatingOut }) => {

    const isDouble = activeDoublePointsTeamId !== null;
    const points = isDouble ? question.points * 2 : question.points;

    const handleAnswerClick = (teamId) => {
        onCorrectAnswer(points, question.id, teamId, activeDoublePointsTeamId);
        // onClose(); // ===== XÓA DÒNG NÀY ĐI =====
    };

    return (
        <div
            className={isAnimatingOut ? 'modal-content-exit' : 'modal-content-enter'}
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
        >
            {/* ... nội dung còn lại của modal không đổi ... */}
            <div style={styles.header}>
                <span style={{...styles.points, backgroundColor: isDouble ? '#ff4757' : '#feca57'}}>
                    {points} ĐIỂM {isDouble && '(x2)'}
                </span>
                <button style={styles.closeButton} onClick={onClose}>&times;</button>
            </div>

            <div style={styles.content}>
                <p style={styles.questionText}>{question.question}</p>
            </div>

            <div style={styles.footer}>
                <p style={styles.awardText}>Thưởng cho đội (demo):</p>
                <div style={styles.answerButtonsContainer}>
                    {players.map(player => (
                        <button
                            key={player.id}
                            style={{...styles.answerButton, backgroundColor: player.color}}
                            onClick={() => handleAnswerClick(player.id)}
                        >
                            {player.pawn} {player.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ... styles không đổi ...
const styles = {
    modal: {
        backgroundColor: '#1e293b', color: '#e2e8f0', borderRadius: '16px',
        padding: '25px', width: '90%', maxWidth: '800px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid #334155',
        display: 'flex', flexDirection: 'column', gap: '20px'
    },
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    points: {
        padding: '5px 15px', borderRadius: '20px', fontSize: '1.2rem',
        fontWeight: 'bold', color: '#1a1a2e'
    },
    closeButton: {
        background: 'none', border: 'none', color: '#94a3b8',
        fontSize: '2.5rem', cursor: 'pointer', lineHeight: 1,
        transition: 'color 0.2s',
    },
    content: {
        padding: '20px 0',
        borderTop: '1px solid #334155',
        borderBottom: '1px solid #334155',
    },
    questionText: {
        fontSize: '1.8rem',
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 1.6,
        margin: 0,
        color: '#f1f5f9',
    },
    footer: {
        paddingTop: '10px',
    },
    awardText: {
        textAlign: 'center',
        margin: '0 0 10px 0',
        color: '#94a3b8'
    },
    answerButtonsContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        flexWrap: 'wrap'
    },
    answerButton: {
        padding: '10px 15px',
        marginTop: '5px',
        border: 'none',
        width: '240px',
        maxWidth: '240px',
        justifyContent: 'center',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    }
};

export default QuestionModal;