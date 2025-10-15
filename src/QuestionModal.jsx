import React from 'react';

const QuestionModal = ({ isOpen, onClose, question, players, onCorrectAnswer, activeDoublePointsTeamId }) => {
    if (!isOpen) {
        return null;
    }

    const isDouble = activeDoublePointsTeamId !== null;
    const points = isDouble ? question.points * 2 : question.points;

    const handleAnswerClick = (teamId) => {
        onCorrectAnswer(points, question.id, teamId, activeDoublePointsTeamId);
        onClose();
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
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
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modal: {
        backgroundColor: '#16213e',
        color: 'white',
        borderRadius: '16px',
        padding: '20px',
        width: '80%',
        maxWidth: '1000px',
        boxShadow: '0 5px 25px rgba(0,0,0,0.5)',
        border: '1px solid #4a4a68'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #4a4a68',
        paddingBottom: '10px'
    },
    points: {
        padding: '5px 15px',
        borderRadius: '20px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#1a1a2e'
    },
    closeButton: {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '2rem',
        cursor: 'pointer'
    },
    content: {
        padding: '10px 0'
    },
    questionText: {
        fontSize: '1.2rem',
        textAlign: 'center',
        margin: 0
    },
    footer: {
        paddingTop: '10px',
        borderTop: '1px solid #4a4a68'
    },
    awardText: {
        textAlign: 'center',
        margin: '0 0 10px 0',
        color: '#ccc'
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