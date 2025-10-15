// App.js
import React, { useState, useLayoutEffect, useRef } from 'react';
import QuestionDeck from './QuestionDeck';
import QuestionModal from './QuestionModal';

// ===== THAY ĐỔI NẰM Ở ĐÂY =====
const PLAYERS_CONFIG = [
    { id: 1, name: 'Nhóm số 1', pawn: '🚀', color: '#ff4757', shadow: '0 0 15px #ff4757' },
    { id: 2, name: 'Hoa Bằng Lăng', pawn: '🚗', color: '#1e90ff', shadow: '0 0 15px #1e90ff' },
    { id: 3, name: 'Tổ Hợp', pawn: '🛸', color: '#9b59b6', shadow: '0 0 15px #9b59b6' }, // Đã thay đổi
];

const NUMBER_OF_STEPS = 20;
const STEPS_PER_ROW = 10;
const sampleQuestions = [
  { id: 1, points: 2, question: 'Mô hình S.M.A.R.T. được sử dụng để làm gì trong việc lập kế hoạch?' },
  { id: 2, points: 3, question: 'Giai đoạn "Storming" (Sóng gió) trong mô hình phát triển nhóm của Tuckman có đặc điểm gì?' },
  { id: 3, points: 1, question: 'OKR là viết tắt của cụm từ tiếng Anh nào?' },
  { id: 4, points: 3, question: '"Ủy quyền" (Delegation) hiệu quả trong quản lý nghĩa là gì?' },
  { id: 5, points: 2, question: 'Mục đích chính của việc đưa ra phản hồi xây dựng (constructive feedback) là gì?' },
  { id: 6, points: 3, question: 'Phong cách lãnh đạo nào trao nhiều quyền tự chủ nhất cho các thành viên trong nhóm?' },
  { id: 7, points: 3, question: 'Sự khác biệt cơ bản giữa một nhà lãnh đạo (leader) và một nhà quản lý (manager) là gì?'},
  { id: 8, points: 1, question: 'Ma trận Eisenhower giúp ưu tiên công việc dựa trên hai tiêu chí nào?'},
  { id: 9, points: 3, question: 'Tại sao việc xác định rõ "Why" (Lý do) của mục tiêu lại quan trọng đối với động lực của nhóm?'},
  { id: 10, points: 2, question: 'Một kế hoạch hành động (action plan) tốt cần bao gồm những yếu tố cơ bản nào?'},
  { id: 11, points: 3, question: '"Micromanagement" (Quản lý vi mô) là gì và tác hại của nó đến nhóm như thế nào?'},
  { id: 12, points: 3, question: 'Để giải quyết xung đột trong nhóm, kỹ năng nào của người lãnh đạo được xem là quan trọng nhất?'},
];

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
    const [playerPositions, setPlayerPositions] = useState({ 1: 0, 2: 0, 3: 0 });
    const [answeredCardIds, setAnsweredCardIds] = useState([]);
    const [modal, setModal] = useState({ isOpen: false, question: null });

    const [doublePointsRemaining, setDoublePointsRemaining] = useState({
        1: true,
        2: true,
        3: true
    });

    const [activeDoublePointsTeamId, setActiveDoublePointsTeamId] = useState(null);
    const [activeCardId, setActiveCardId] = useState(null);

    const handleActivateDoublePoints = (teamId, cardId) => {
        if (!doublePointsRemaining[teamId]) {
            console.log(`Đội ${teamId} đã hết lượt nhân đôi điểm!`);
            return;
        }

        setActiveDoublePointsTeamId(teamId);
        setActiveCardId(cardId);
        console.log(`Đội ${teamId} đã kích hoạt NHÂN ĐÔI ĐIỂM cho thẻ ${cardId}!`);
    };

    const handleViewQuestion = (question) => {
        setModal({ isOpen: true, question: question });
    };

    const handleCloseModal = () => {
        setModal({ isOpen: false, question: null });
        setActiveDoublePointsTeamId(null);
        setActiveCardId(null);
    };

    const handleQuestionAnswered = (points, questionId, awardedTeamId, doublePointsActivatorId) => {
        setPlayerPositions(prevPositions => {
            const newPosition = prevPositions[awardedTeamId] + points;
            const finalPosition = newPosition >= NUMBER_OF_STEPS ? NUMBER_OF_STEPS - 1 : newPosition;
            return { ...prevPositions, [awardedTeamId]: finalPosition };
        });

        setAnsweredCardIds(prevIds => [...prevIds, questionId]);

        if (doublePointsActivatorId !== null) {
            setDoublePointsRemaining(prev => ({
                ...prev,
                [doublePointsActivatorId]: false
            }));
            console.log(`Đội ${doublePointsActivatorId} đã SỬ DỤNG lượt nhân đôi điểm (bất kể đội nào nhận điểm).`);
        }

        setActiveDoublePointsTeamId(null);
        setActiveCardId(null);
    };

    return (
        <div style={styles.app}>
            <h1 style={styles.header}>🏁 Chặng Đua Hội Nhập 🏁</h1>

            <div style={styles.doublePointsStatus}>
                <h3>Lượt nhân đôi điểm còn lại:</h3>
                <div style={styles.doublePointsBadges}>
                    {PLAYERS_CONFIG.map(player => (
                        <div
                            key={player.id}
                            style={{
                                ...styles.doublePointsBadge,
                                backgroundColor: doublePointsRemaining[player.id] ? player.color : '#6b7280',
                                opacity: doublePointsRemaining[player.id] ? 1 : 0.5
                            }}
                        >
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

            <QuestionModal
                isOpen={modal.isOpen}
                onClose={handleCloseModal}
                question={modal.question}
                players={PLAYERS_CONFIG}
                onCorrectAnswer={handleQuestionAnswered}
                activeDoublePointsTeamId={activeCardId === modal.question?.id ? activeDoublePointsTeamId : null}
            />
        </div>
    );
}


// (Phần styles giữ nguyên, không cần thay đổi)
const styles = {
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