import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import QuestionDeck from './QuestionDeck';
import QuestionModal from './QuestionModal';
import MultipleChoiceModal from './MultipleChoiceModal';
import MultiSelectModal from './MultiSelectModal';
import TrueFalsePairModal from './TrueFalsePairModal';
import EndGameSummary from './EndGameSummary';
import './animations.css';

const PLAYERS_CONFIG = [
    { id: 1, name: 'Nhóm số 1', pawn: '🚀', color: '#ff4757', shadow: '0 0 15px #ff4757' },
    { id: 2, name: 'Hoa Bằng Lăng', pawn: '🚗', color: '#1e90ff', shadow: '0 0 15px #1e90ff' },
    { id: 3, name: 'Tổ Hợp', pawn: '🛸', color: '#9b59b6', shadow: '0 0 15px #9b59b6' },
];

const NUMBER_OF_STEPS = 20;

const sampleQuestions = [
  {
    "id": 1,
    "points": 3,
    "question": "Hiện tượng “tư duy nhóm” (Groupthink) là gì và nó dẫn đến hậu quả tiêu cực nào?"
  },
  {
    "id": 2,
    "points": 3,
    "question": "Sự khác biệt cơ bản giữa một nhà lãnh đạo (leader) và một nhà quản lý (manager) là gì?"
  },
  {
    "id": 3,
    "points": 2,
    "type": "multiple_choice",
    "question": "Một trong những vai trò chính của việc lập kế hoạch trong nhóm là gì?",
    "options": [
      "Tạo ra sự cạnh tranh giữa các thành viên",
      "Giảm thiểu bất định và rủi ro",
      "Loại bỏ hoàn toàn nhu cầu giao tiếp",
      "Chỉ tập trung vào các mục tiêu dài hạn"
    ],
    "correctAnswer": 1
  },
  {
    "id": 4,
    "points": 3,
    "type": "multi_select",
    "question": "Trong mô hình S.M.A.R.T, chữ 'R' và 'T' đại diện cho điều gì? (Chọn 2 đáp án)",
    "options": [
      "Realistic (Thực tế)",
      "Relevant (Liên quan)",
      "Time-bound (Có thời hạn)",
      "Trustworthy (Đáng tin cậy)"
    ],
    "correctAnswer": [1, 2]
  },
  {
    "id": 5,
    "points": 1,
    "type": "multiple_choice",
    "question": "OKR là viết tắt của cụm từ tiếng Anh nào?",
    "options": [
      "Objectives and Key Results",
      "Official Key Responsibilities",
      "Organizational Knowledge Repository",
      "Operational Key Routines"
    ],
    "correctAnswer": 0
  },
  {
    "id": 6,
    "points": 3,
    "question": "Trong phương pháp 5W1H, yếu tố \"Why\" (Tại sao) có vai trò quan trọng để làm gì?"
  },
  {
    "id": 7,
    "points": 3,
    "type": "multi_select",
    "question": "Ba nhiệm vụ chính nào kết hợp lại để tạo nên một nhà lãnh đạo? (Chọn 3 đáp án)",
    "options": [
      "Tạo tầm nhìn",
      "Tạo cảm hứng",
      "Tạo ảnh hưởng",
      "Quản lý ngân sách",
      "Lập kế hoạch chi tiết"
    ],
    "correctAnswer": [0, 1, 2]
  },
  {
    "id": 8,
    "points": 2,
    "type": "true_false_pair",
    "question": "Xác định tính đúng/sai của hai mệnh đề sau:",
    "statements": [
      {
        "id": 0,
        "text": "Một nhà quản lý giỏi thì chắc chắn cũng là một nhà lãnh đạo.",
        "correctAnswer": false
      },
      {
        "id": 1,
        "text": "\"Key Results\" (Kết quả then chốt) trong OKR là các kết quả định tính, mang tính truyền cảm hứng.",
        "correctAnswer": false
      }
    ]
  },
  {
    "id": 9,
    "points": 3,
    "question": "Quy trình thực hiện kỹ năng quản lý nhóm gồm 5 bước. Hãy cho biết bước thứ 3 trong quy trình đó là gì?"
  },
  {
    "id": 10,
    "points": 2,
    "question": "Bước đầu tiên mà người quản lý cần làm khi giải quyết mâu thuẫn trong nhóm là gì?"
  },
  {
    "id": 11,
    "points": 2,
    "type": "multiple_choice",
    "question": "Mô hình S.M.A.R.T. được sử dụng để làm gì?",
    "options": [
      "Giải quyết xung đột trong nhóm",
      "Xây dựng mục tiêu rõ ràng và khả thi",
      "Phân chia ngân sách dự án",
      "Đánh giá hiệu suất cuối kỳ của thành viên"
    ],
    "correctAnswer": 1
  },
  {
    "id": 12,
    "points": 3,
    "type": "multiple_choice",
    "question": "Phong cách lãnh đạo nào phù hợp nhất cho việc thảo luận và lấy ý kiến từ các thành viên?",
    "options": [
      "Độc đoán (Autocratic)",
      "Dân chủ (Democratic)",
      "Tự do (Laissez-faire)",
      "Chỉ đạo (Directive)"
    ],
    "correctAnswer": 1
  }
]

function GameBoard({ playerPositions }) {
    const [pawnCoords, setPawnCoords] = useState({});
    const pathRefs = useRef([]);

    useLayoutEffect(() => {
        const newCoords = {};
        PLAYERS_CONFIG.forEach(player => {
            const step = playerPositions[player.id];
            const pathElement = pathRefs.current[player.id];
            if (pathElement && pathElement.children[step]) {
                const cellElement = pathElement.children[step];
                const pawnSize = 40;
                const top = cellElement.offsetTop + (cellElement.offsetHeight / 2) - (pawnSize / 2);
                const left = cellElement.offsetLeft + (cellElement.offsetWidth / 2) - (pawnSize / 2);
                newCoords[player.id] = { top, left };
            }
        });
        setPawnCoords(newCoords);
    }, [playerPositions]);

    return (
        <div style={styles.gameBoard}>
            {PLAYERS_CONFIG.map(player => {
                const currentPosition = playerPositions[player.id];
                return (
                    <div key={player.id} style={styles.playerTrack}>
                        <div style={{...styles.playerInfoCard, borderImage: `linear-gradient(to bottom, ${player.color}, #333) 1`}}>
                            <span style={styles.pawnIcon}>{player.pawn}</span>
                            <div style={styles.playerInfoText}>
                                <div style={styles.playerName}>{player.name}</div>
                                <div style={{...styles.playerPosition, color: player.color}}>Vị trí: {currentPosition}</div>
                            </div>
                        </div>
                        <div style={styles.path} ref={el => (pathRefs.current[player.id] = el)}>
                            {Array.from({ length: NUMBER_OF_STEPS }).map((_, i) => {
                                const isOccupied = currentPosition === i;
                                const cellStyle = isOccupied ?
                                    { ...styles.cell, ...styles.activeCell, boxShadow: player.shadow, borderColor: player.color } :
                                    styles.cell;
                                return (
                                    <div key={i} style={cellStyle}>
                                        {isOccupied && <span style={styles.cellNumber}>{i === 0 ? 'BĐ' : i}</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
            {PLAYERS_CONFIG.map(player => {
                const coords = pawnCoords[player.id];
                return coords ? (
                    <div key={player.id} style={{ ...styles.pawn, top: coords.top, left: coords.left }}>
                        {player.pawn}
                    </div>
                ) : null;
            })}
        </div>
    );
}

function App() {
    const initialPlayerPositions = { 1: 0, 2: 0, 3: 0 };
    const initialDoublePoints = { 1: true, 2: true, 3: true };

    const [playerPositions, setPlayerPositions] = useState(initialPlayerPositions);
    const [answeredCardIds, setAnsweredCardIds] = useState([]);
    const [modal, setModal] = useState({ isOpen: false, question: null });
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const [, setIsPreparing] = useState(false);
    const [doublePointsRemaining, setDoublePointsRemaining] = useState(initialDoublePoints);
    const [activeDoublePointsTeamId, setActiveDoublePointsTeamId] = useState(null);
    const [activeCardId, setActiveCardId] = useState(null);
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        if (answeredCardIds.length > 0 && answeredCardIds.length === sampleQuestions.length) {
            setTimeout(() => {
                setIsGameOver(true);
            }, 500);
        }
    }, [answeredCardIds]);

    const handleActivateDoublePoints = (teamId, cardId) => {
        if (!doublePointsRemaining[teamId]) return;
        setActiveDoublePointsTeamId(teamId);
        setActiveCardId(cardId);
    };

    const handleViewQuestion = (question) => {
        setIsPreparing(true);
        setTimeout(() => {
            setIsPreparing(false);
            setModal({ isOpen: true, question: question });
            setIsAnimatingOut(false);
        }, 100);
    };

    const handleSkipQuestion = () => {
        if (!modal.question) return;
        setAnsweredCardIds(prevIds => [...prevIds, modal.question.id]);
        if (activeCardId === modal.question.id && activeDoublePointsTeamId !== null) {
            setDoublePointsRemaining(prev => ({
                ...prev,
                [activeDoublePointsTeamId]: false
            }));
        }
        setIsAnimatingOut(true);
        setTimeout(() => {
            setModal({ isOpen: false, question: null });
            setActiveDoublePointsTeamId(null);
            setActiveCardId(null);
            setIsAnimatingOut(false);
        }, 300);
    };

    const handleQuestionAnswered = (points, questionId, awardedTeamId, doublePointsActivatorId) => {
        setPlayerPositions(prevPositions => {
            const newPosition = prevPositions[awardedTeamId] + points;
            const finalPosition = newPosition >= NUMBER_OF_STEPS ? NUMBER_OF_STEPS - 1 : newPosition;
            return { ...prevPositions, [awardedTeamId]: finalPosition };
        });
        setAnsweredCardIds(prevIds => [...prevIds, questionId]);
        if (doublePointsActivatorId !== null) {
            setDoublePointsRemaining(prev => ({ ...prev, [doublePointsActivatorId]: false }));
        }
        setIsAnimatingOut(true);
        setTimeout(() => {
            setModal({ isOpen: false, question: null });
            setActiveDoublePointsTeamId(null);
            setActiveCardId(null);
            setIsAnimatingOut(false);
        }, 300);
    };

    const handleRestartGame = () => {
        setPlayerPositions(initialPlayerPositions);
        setAnsweredCardIds([]);
        setDoublePointsRemaining(initialDoublePoints);
        setIsGameOver(false);
    };

    return (
        <div style={styles.app}>
            <h1 style={styles.header}>🏁 Trò chơi Hội Nhập 🏁</h1>
            <div style={styles.doublePointsStatus}>
                <h3>Lượt nhân đôi điểm còn lại:</h3>
                <div style={styles.doublePointsBadges}>
                    {PLAYERS_CONFIG.map(player => (
                        <div key={player.id} style={{ ...styles.doublePointsBadge, backgroundColor: doublePointsRemaining[player.id] ? player.color : '#6b7280', opacity: doublePointsRemaining[player.id] ? 1 : 0.5 }}>
                            {player.pawn} {player.name}: {doublePointsRemaining[player.id] ? 'Còn lượt' : 'Đã dùng'}
                        </div>
                    ))}
                </div>
            </div>
            <QuestionDeck
                questions={sampleQuestions}
                answeredCardIds={answeredCardIds}
                players={PLAYERS_CONFIG}
                doublePointsState={doublePointsRemaining}
                onActivateDoublePoints={handleActivateDoublePoints}
                onViewQuestion={handleViewQuestion}
            />
            <GameBoard playerPositions={playerPositions} />



            {modal.isOpen && (
                <div
                    style={styles.overlay}
                    className={isAnimatingOut ? 'modal-overlay-exit' : 'modal-overlay-enter'}
                    onClick={handleSkipQuestion}
                >
                    {(() => {
                        const props = {
                            onClose: handleSkipQuestion,
                            question: modal.question,
                            players: PLAYERS_CONFIG,
                            onCorrectAnswer: handleQuestionAnswered,
                            activeDoublePointsTeamId: activeCardId === modal.question?.id ? activeDoublePointsTeamId : null,
                            isAnimatingOut: isAnimatingOut,
                        };
                        switch (modal.question.type) {
                            case 'true_false_pair': return <TrueFalsePairModal {...props} />;
                            case 'multi_select': return <MultiSelectModal {...props} />;
                            case 'multiple_choice': return <MultipleChoiceModal {...props} />;
                            default: return <QuestionModal {...props} />;
                        }
                    })()}
                </div>
            )}

            {isGameOver && (
                <EndGameSummary
                    players={PLAYERS_CONFIG}
                    positions={playerPositions}
                    onRestart={handleRestartGame}
                />
            )}
        </div>
    );
}

const styles = {
    preparingOverlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(5px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 2000,
        color: 'white',
        animation: 'fadeIn 0.3s'
    },
    preparingContent: {
        textAlign: 'center',
    },
    preparingSpinner: {
        border: '4px solid rgba(255, 255, 255, 0.3)',
        borderTop: '4px solid #feca57',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px auto',
    },
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(5px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000
    },
    app: {
        backgroundColor: '#1a1a2e',
        backgroundImage: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 74%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        padding: '10px'
    },
    header: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#e0e0e0',
        marginBottom: '30px'
    },
    doublePointsStatus: {
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        color: '#e0e0e0',
        borderRadius: '22px',
        padding:'20px',
        paddingTop: '0px',
        marginBottom: '0px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
    },
    doublePointsBadges: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        flexWrap: 'wrap',
        marginTop: '10px'
    },
    doublePointsBadge: {
        padding: '8px 16px',
        borderRadius: '30px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        transition: 'all 0.3s ease'
    },
    gameBoard: {
        width: '100%',
        maxWidth: '1200px',
        backgroundColor: 'rgba(22, 33, 62, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '24px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: '20px'
    },
    playerTrack: {
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        borderRadius: '16px',
        padding: '15px',
        width: '30%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    playerInfoCard: {
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        borderRadius: '12px',
        padding: '10px 15px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: '#e0e0e0',
        borderTop: '4px solid',
        borderImageSlice: 1,
        marginBottom: '15px',
        justifyContent: 'center'
    },
    playerInfoText: {
        textAlign: 'center'
    },
    pawnIcon: {
        fontSize: '2.5rem'
    },
    playerName: {
        fontWeight: 'bold',
        fontSize: '1.1rem'
    },
    playerPosition: {
        fontSize: '0.9rem',
        fontWeight: 'bold'
    },
    path: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        padding: '10px',
        backgroundColor: 'rgba(10, 15, 30, 0.5)',
        borderRadius: '20px',
        justifyContent: 'center',
        gap: '5px'
    },
    cell: {
        width: '50px',
        height: '50px',
        margin: '5px',
        borderRadius: '100%',
        backgroundColor: '#16213e',
        border: '2px solid #4a4a68',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 1px 1px rgba(255,255,255,0.1)',
        cursor: 'default',
        transition: 'all 0.3s ease',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    activeCell: {
        transform: 'scale(1.1)'
    },
    cellNumber: {
        color: '#fff',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        textShadow: '0 0 5px #000'
    },
    pawn: {
        fontSize: '2.5rem',
        position: 'absolute',
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: 10,
        filter: 'drop-shadow(0px 5px 10px rgba(0,0,0,0.4))',
        pointerEvents: 'none'
    },
};

export default App;