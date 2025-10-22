import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import QuestionDeck from './QuestionDeck';
import QuestionModal from './QuestionModal';
import MultipleChoiceModal from './MultipleChoiceModal';
import MultiSelectModal from './MultiSelectModal';
import TrueFalsePairModal from './TrueFalsePairModal';
import EndGameSummary from './EndGameSummary';
import TurnSpinner from './TurnSpinner';
import './animations.css';

const PLAYERS_CONFIG = [
    { id: 1, name: 'Nhóm số 1', pawn: '🚀', color: '#ff4757', shadow: '0 0 15px #ff4757' },
    { id: 2, name: 'Hoa Bằng Lăng', pawn: '🚗', color: '#1e90ff', shadow: '0 0 15px #1e90ff' },
    { id: 3, name: 'Tổ Hợp', pawn: '🛸', color: '#9b59b6', shadow: '0 0 15px #9b59b6' },
];

const NUMBER_OF_STEPS = 20;

const sampleQuestions = [
  // CÂU HỎI 1 (MC - 5 lựa chọn, 1 đáp án)
  {
    "id": 1,
    "points": 2, // 5 lựa chọn, 1 đáp án = 2 điểm
    "type": "multiple_choice",
    "question": "Mô hình S.M.A.R.T. thường được sử dụng để làm gì?",
    "options": [
      "Thiết lập mục tiêu rõ ràng và khả thi",
      "Giải quyết mâu thuẫn trong nhóm",
      "Phân chia ngân sách dự án",
      "Bầu ra một nhóm trưởng",
      "Theo dõi tiến độ hàng ngày"
    ],
    "correctAnswer": 0
  },
  // CÂU HỎI 2 (Multi-select - 5 lựa chọn, 3 đáp án)
  {
    "id": 10,
    "points": 3, // Multi-select = 3 điểm
    "type": "multi_select",
    "question": "Trong mô hình S.M.A.R.T, chữ 'S', 'M' và 'T' đại diện cho điều gì? (Chọn 3 đáp án)",
    "options": [
      "Specific (Cụ thể)",
      "Measurable (Đo lường được)",
      "Simple (Đơn giản)",
      "Team-work (Làm việc nhóm)",
      "Time-bound (Có thời hạn)"
    ],
    "correctAnswer": [0, 1, 4]
  },
  // CÂU HỎI 3 (T/F Pair - 3 mệnh đề)
  {
    "id": 5,
    "points": 3, // 3 mệnh đề = 3 điểm
    "type": "true_false_pair",
    "question": "Xác định tính đúng/sai của ba mệnh đề sau:",
    "statements": [
      {
        "id": 0,
        "text": "Một trong 3 nhiệm vụ chính của lãnh đạo là 'tạo tầm nhìn'.",
        "correctAnswer": true
      },
      {
        "id": 1,
        "text": "Nhiệm vụ chính của lãnh đạo là 'lập kế hoạch chi tiết' và 'quản lý ngân sách'.",
        "correctAnswer": false
      },
      {
        "id": 2,
        "text": "Lãnh đạo (Leader) và Quản lý (Manager) là hai vai trò hoàn toàn giống nhau.",
        "correctAnswer": false
      }
    ]
  },
  // CÂU HỎI 4 (MC - 4 lựa chọn, 1 đáp án)
  {
    "id": 3,
    "points": 2, // 4 lựa chọn, 1 đáp án = 2 điểm
    "type": "multiple_choice",
    "question": "Sự khác biệt cơ bản giữa Lãnh đạo (Leader) và Quản lý (Manager) là gì?",
    "options": [
      "Lãnh đạo 'tìm đường', Quản lý 'đi đường'",
      "Lãnh đạo 'đi đường', Quản lý 'tìm đường'",
      "Lãnh đạo tập trung vào chi tiết, Quản lý tập trung vào tầm nhìn",
      "Không có sự khác biệt nào"
    ],
    "correctAnswer": 0
  },
  // CÂU HỎI 5 (Multi-select - 6 lựa chọn, 3 đáp án)
  {
    "id": 9,
    "points": 3, // Multi-select = 3 điểm
    "type": "multi_select",
    "question": "Ba nhiệm vụ chính nào kết hợp lại để tạo nên một nhà lãnh đạo? (Chọn 3 đáp án)",
    "options": [
      "Tạo tầm nhìn",
      "Tạo cảm hứng",
      "Tạo ảnh hưởng",
      "Theo dõi tiến độ hàng ngày",
      "Giải quyết mâu thuẫn",
      "Báo cáo công việc chi tiết"
    ],
    "correctAnswer": [0, 1, 2]
  },
  // CÂU HỎI 6 (MC - 6 lựa chọn, 1 đáp án)
  {
    "id": 4,
    "points": 3, // 6 lựa chọn, 1 đáp án = 3 điểm (khó hơn)
    "type": "multiple_choice",
    "question": "Hiện tượng 'Tư duy nhóm' (Groupthink) là gì?",
    "options": [
      "Một buổi họp nhóm để sáng tạo ý tưởng mới (Brainstorming)",
      "Khi các thành viên quá sợ mâu thuẫn và đồng ý với nhau quá dễ",
      "Khi nhóm trưởng phân chia công việc một cách công bằng",
      "Một phương pháp bỏ phiếu dân chủ trong nhóm",
      "Khi cả nhóm cùng nhau ghét một ý tưởng",
      "Khi các thành viên tranh cãi quá gay gắt"
    ],
    "correctAnswer": 1
  },
  // CÂU HỎI 7 (T/F Pair - 2 mệnh đề)
  {
    "id": 8,
    "points": 1, // 2 mệnh đề dễ = 1 điểm
    "type": "true_false_pair",
    "question": "Xác định tính đúng/sai của hai mệnh đề sau:",
    "statements": [
      {
        "id": 0,
        "text": "Một nhà quản lý (Manager) giỏi thì chắc chắn cũng là một nhà lãnh đạo (Leader) giỏi.",
        "correctAnswer": false
      },
      {
        "id": 1,
        "text": "Mục tiêu chung giúp cả nhóm đi đúng hướng.",
        "correctAnswer": true
      }
    ]
  },
  // CÂU HỎI 8 (Multi-select - 4 lựa chọn, 2 đáp án)
  {
    "id": 11,
    "points": 3, // Multi-select = 3 điểm
    "type": "multi_select",
    "question": "Những công việc nào sau đây thuộc về Kỹ năng Quản lý (Management)? (Chọn 2 đáp án)",
    "options": [
      "Tạo ra một tầm nhìn chiến lược mới cho tổ chức",
      "Giám sát tiến độ và đốc thúc các thành viên",
      "Truyền cảm hứng để mọi người vượt qua khó khăn",
      "Phân công công việc và giải quyết các mâu thuẫn"
    ],
    "correctAnswer": [1, 3]
  },
  // CÂU HỎI 9 (T/F Pair - 2 mệnh đề)
  {
    "id": 6,
    "points": 2, // 2 mệnh đề = 2 điểm
    "type": "true_false_pair",
    "question": "Xác định tính đúng/sai của hai mệnh đề sau:",
    "statements": [
      {
        "id": 0,
        "text": "Một kế hoạch tốt là một kế hoạch cứng nhắc và không bao giờ được thay đổi.",
        "correctAnswer": false
      },
      {
        "id": 1,
        "text": "Kỹ năng quản lý nhóm bao gồm việc theo dõi tiến độ và giải quyết mâu thuẫn.",
        "correctAnswer": true
      }
    ]
  },
  // CÂU HỎI 10 (MC - 4 lựa chọn, 1 đáp án)
  {
    "id": 2,
    "points": 2, // 4 lựa chọn, 1 đáp án = 2 điểm
    "type": "multiple_choice",
    "question": "Vai trò chính của việc 'Lập kế hoạch' trong nhóm là gì?",
    "options": [
      "Truyền cảm hứng cho tất cả thành viên",
      "Loại bỏ hoàn toàn mọi rủi ro có thể xảy ra",
      "Cung cấp một 'bản đồ' rõ ràng để giảm bất định",
      "Chỉ tập trung vào các mục tiêu dài hạn"
    ],
    "correctAnswer": 2
  },
  // CÂU HỎI 11 (T/F Pair - 1 mệnh đề)
  {
    "id": 7,
    "points": 1, // 1 mệnh đề = 1 điểm
    "type": "true_false_pair",
    "question": "Xác định tính đúng/sai của mệnh đề sau về 5W1H:",
    "statements": [
      {
        "id": 0,
        "text": "Chữ 'Why' (Tại sao) giúp nhóm hiểu rõ mục đích của công việc.",
        "correctAnswer": true
      }
    ]
  },
  // CÂU HỎI 12 (Multi-select - 5 lựa chọn, 3 đáp án)
  {
    "id": 12,
    "points": 3, // Multi-select = 3 điểm
    "type": "multi_select",
    "question": "Phương pháp 5W1H bao gồm những câu hỏi nào? (Chọn 3 đáp án)",
    "options": [
      "What (Cái gì?)",
      "When (Khi nào?)",
      "Which (Cái nào?)",
      "How (Như thế nào?)",
      "How many (Bao nhiêu?)"
    ],
    "correctAnswer": [0, 1, 3]
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

    const [isGameStarted, setIsGameStarted] = useState(false);

    const [turnOrder, setTurnOrder] = useState([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (answeredCardIds.length > 0 && answeredCardIds.length === sampleQuestions.length) {
            setTimeout(() => {
                setIsGameOver(true);
            }, 500);
        }
    }, [answeredCardIds]);

    const handleOrderDecided = (orderIds) => {
        setTurnOrder(orderIds);
        setCurrentPlayerIndex(0);
    };

    const handleStartGame = () => {
        if (turnOrder.length === 0) {
            alert("Bạn phải quay để chọn lượt trước!");
            return;
        }
        setIsGameStarted(true);
    };

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

        setCurrentPlayerIndex(prevIndex => (prevIndex + 1) % turnOrder.length);

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

        setCurrentPlayerIndex(prevIndex => (prevIndex + 1) % turnOrder.length);

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

        setIsGameStarted(false);
        setTurnOrder([]);
        setCurrentPlayerIndex(0);
    };

    const currentPlayerId = isGameStarted ? turnOrder[currentPlayerIndex] : null;

    return (
        <div style={styles.app}>

            {!isGameStarted && (
                <TurnSpinner
                    players={PLAYERS_CONFIG}
                    onOrderDecided={handleOrderDecided}
                    onClose={handleStartGame}
                />
            )}

            {isGameStarted && (
                <>
                    <h1 style={styles.header}>🏁 Trò chơi Hội Nhập 🏁</h1>

                    <div style={styles.doublePointsStatus}>
                        {(() => {
                            const currentPlayer = PLAYERS_CONFIG.find(p => p.id === currentPlayerId);
                            if (!currentPlayer) return null;

                            return (
                                <div style={styles.turnIndicator}>
                                    Đến lượt:
                                    <span style={{...styles.turnPlayer, color: currentPlayer.color, textShadow: currentPlayer.shadow}}>
                                        {currentPlayer.pawn} {currentPlayer.name}
                                    </span>
                                </div>
                            );
                        })()}

                        <div style={styles.doublePointsHeader}>
                            <h3>Lượt nhân đôi điểm còn lại:</h3>
                        </div>

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
                        currentPlayerId={currentPlayerId}
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
                                    // ===== THAY ĐỔI: TRUYỀN currentPlayerId XUỐNG =====
                                    currentPlayerId: currentPlayerId,
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
                </>
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
    turnIndicator: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '15px',
        color: '#f1f5f9',
        borderBottom: '1px solid #4a4a68',
        paddingBottom: '15px'
    },
    turnPlayer: {
        marginLeft: '10px',
    },
    doublePointsStatus: {
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        color: '#e0e0e0',
        borderRadius: '22px',
        padding: '15px 25px 20px 25px',
        marginBottom: '0px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    doublePointsHeader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        marginBottom: '15px',
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