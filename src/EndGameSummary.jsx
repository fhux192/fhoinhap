// EndGameSummary.js
import React from 'react';
import Confetti from 'react-confetti';

const EndGameSummary = ({ players, positions, onRestart }) => {
    // --- KHÔNG THAY ĐỔI: Giữ nguyên phần lấy kích thước cửa sổ ---
    const [windowSize, setWindowSize] = React.useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    React.useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    // --- HẾT PHẦN KHÔNG THAY ĐỔI ---

    const rankedPlayers = players
        .map(player => ({
            ...player,
            score: positions[player.id]
        }))
        .sort((a, b) => b.score - a.score);

    const winner = rankedPlayers[0];

    return (
        <div style={styles.overlay} className="modal-overlay-enter">
            {/* ===== NÂNG CẤP HIỆU ỨNG CONFETTI ===== */}
            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                numberOfPieces={500}         // Tăng số lượng mảnh giấy cho dày hơn
                recycle={true}              // Bật chế độ lặp lại, pháo hoa sẽ bắn liên tục
                wind={0.05}                 // Thêm hiệu ứng gió nhẹ để giấy bay lượn
                gravity={0.1}               // Giảm trọng lực để giấy rơi chậm hơn, bay bổng hơn
                // Tùy chỉnh màu sắc, thêm cả màu của người chiến thắng!
                colors={['#feca57', '#e2e8f0', '#ffc107', '#ffffff', winner.color]}
                tweenDuration={10000}       // Thời gian để giấy bay từ trên xuống dưới
            />

            <div style={styles.summaryModal} className="summary-enter">
                <h1 style={styles.title}>CHÚC MỪNG!</h1>
                <div style={styles.winnerSection}>
                    <span style={styles.crown}>👑</span>
                    <span style={{ ...styles.winnerPawn, backgroundColor: winner.color }}>{winner.pawn}</span>
                    <h2 style={styles.winnerText}>Người chiến thắng là</h2>
                    <h3 style={{ ...styles.winnerName, color: winner.color }}>{winner.name}</h3>
                </div>

                <h4 style={styles.rankingTitle}>Bảng xếp hạng chung cuộc</h4>
                <div style={styles.rankingList}>
                    {rankedPlayers.map((player, index) => (
                        <div key={player.id} style={{...styles.rankRow, ...(index === 0 ? styles.rank1 : {})}}>
                            <span style={styles.rankPosition}>{index + 1}</span>
                            <span style={{...styles.rankPawn, backgroundColor: player.color}}>{player.pawn}</span>
                            <span style={styles.rankName}>{player.name}</span>
                            <span style={styles.rankScore}>{player.score} điểm</span>
                        </div>
                    ))}
                </div>

                <button style={styles.restartButton} onClick={onRestart}>
                    Chơi lại
                </button>
            </div>
        </div>
    );
};

// --- CSS styles không thay đổi ---
const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 },
    summaryModal: { backgroundColor: '#1e293b', color: '#e2e8f0', borderRadius: '20px', padding: '30px', width: '90%', maxWidth: '600px', boxShadow: '0 10px 40px rgba(0,0,0,0.6)', border: '1px solid #334155', textAlign: 'center' },
    title: { fontSize: '2.5rem', fontWeight: 'bold', color: '#feca57', margin: '0 0 20px 0', textTransform: 'uppercase' },
    winnerSection: { padding: '20px', backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: '15px', marginBottom: '25px', position: 'relative' },
    crown: { fontSize: '3rem', position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)' },
    winnerPawn: { fontSize: '4rem', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '15px auto 10px auto' },
    winnerText: { fontSize: '1.2rem', color: '#94a3b8', margin: 0, fontWeight: 400 },
    winnerName: { fontSize: '2rem', margin: '5px 0 0 0', fontWeight: 'bold' },
    rankingTitle: { fontSize: '1.2rem', color: '#94a3b8', borderTop: '1px solid #334155', paddingTop: '20px', margin: '0 0 15px 0' },
    rankingList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    rankRow: { display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '8px' },
    rank1: { backgroundColor: 'rgba(254, 202, 22, 0.2)', border: '1px solid #feca57' },
    rankPosition: { fontSize: '1.2rem', fontWeight: 'bold', color: '#94a3b8', width: '40px' },
    rankPawn: { fontSize: '1.5rem', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' },
    rankName: { flex: 1, textAlign: 'left', paddingLeft: '15px', fontSize: '1.1rem', fontWeight: '500' },
    rankScore: { fontSize: '1.1rem', fontWeight: 'bold' },
    restartButton: { marginTop: '30px', padding: '12px 30px', border: 'none', borderRadius: '10px', backgroundColor: '#feca57', color: '#1a1a2e', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }
};

export default EndGameSummary;