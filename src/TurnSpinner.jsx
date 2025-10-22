import React, { useState } from 'react';

const TurnSpinner = ({ players, onClose, onOrderDecided }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);

    const [spinCount, setSpinCount] = useState(0);
    const [availablePlayers, setAvailablePlayers] = useState(players);
    const [finalOrder, setFinalOrder] = useState([]);
    const [currentWinner, setCurrentWinner] = useState(null);

    const segmentAngle = 360 / availablePlayers.length;
    const gradientString = availablePlayers
        .map((p, i) => `${p.color} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`)
        .join(', ');

    const wheelStyle = {
        ...styles.spinnerWheel,
        background: `conic-gradient(${gradientString})`,
        transform: `rotate(${rotation}deg)`,
        transition: isSpinning ? 'transform 4s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
    };

    const handleSpin = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setCurrentWinner(null);

        const winnerIndex = Math.floor(Math.random() * availablePlayers.length);
        const winningPlayer = availablePlayers[winnerIndex];

        const targetSegmentCenter = (winnerIndex * segmentAngle) + (segmentAngle / 2);
        const targetAngle = 360 - targetSegmentCenter;
        const randomJitter = (Math.random() - 0.5) * (segmentAngle * 0.8);
        const totalRotation = (360 * 5) + targetAngle + randomJitter;

        setRotation(totalRotation);

        setTimeout(() => {
            setIsSpinning(false);
            setCurrentWinner(winningPlayer);
            setRotation(totalRotation % 360);

            const newOrder = [...finalOrder, winningPlayer];
            setFinalOrder(newOrder);

            if (spinCount === 0) {
                const remaining = players.filter(p => p.id !== winningPlayer.id);
                setAvailablePlayers(remaining);
                setSpinCount(1);
            } else if (spinCount === 1) {
                const lastPlayer = availablePlayers.find(p => p.id !== winningPlayer.id);
                const completeOrder = [...newOrder, lastPlayer];

                setFinalOrder(completeOrder);
                setAvailablePlayers([]);
                setSpinCount(2);

                const orderIds = completeOrder.map(p => p.id);
                onOrderDecided(orderIds);
            }

        }, 4100);
    };

    // ----- Cập nhật Text cho Button (để logic gọn gàng hơn) -----
    let titleText = "Chọn Lượt Chơi";
    let buttonText = "Quay!";

    if (!isSpinning) {
        if (spinCount === 1) {
            titleText = "Chọn Vị Trí Thứ 2";
            buttonText = "Quay lần 2";
        } else if (spinCount === 2) {
            titleText = "Thứ Tự Chơi";
            buttonText = "Bắt đầu chơi!";
        }
    } else {
        buttonText = "Đang quay...";
    }
    // --------------------------------------------------------

    const handleButtonClick = () => {
        if (spinCount === 2) {
            onClose();
        } else {
            handleSpin();
        }
    };

    return (
        <div style={styles.modalBackdrop}>
            <div
                style={styles.modalContent}
                className={'modal-content-enter'}
            >
                <div style={styles.header}>
                    <h2 style={styles.title}>{titleText}</h2>
                    <button style={styles.closeButton} onClick={onClose} disabled={isSpinning || spinCount !== 2}>&times;</button>
                </div>

                {/* ===== YÊU CẦU 1: THÊM CHÚ THÍCH ===== */}
                <div style={styles.legendContainer}>
                    {players.map(p => (
                        <span key={p.id} style={{...styles.legendItem, color: p.color, borderColor: p.color}}>
                            {p.pawn} {p.name}
                        </span>
                    ))}
                </div>
                {/* ==================================== */}

                <div style={styles.spinnerContainer}>
                    <div style={styles.spinnerPointer}></div>
                    <div style={wheelStyle}>
                        {availablePlayers.map((player, index) => {
                            const angle = (index * segmentAngle) + (segmentAngle / 2);
                            const iconStyle = {
                                ...styles.playerIcon,
                                transform: `rotate(${angle}deg) translate(0, -${availablePlayers.length <= 2 ? 70 : 90}px) rotate(-${angle}deg)`
                            };
                            return (
                                <div key={player.id} style={iconStyle}>
                                    {player.pawn}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={styles.footer}>
                    {/* ===== YÊU CẦU 2: SỬA LAYOUT HIỂN THỊ KẾT QUẢ ===== */}
                    <div style={styles.resultContainer}>
                        {isSpinning && (
                            <h3 style={styles.resultText}>Đang quay...</h3>
                        )}
                        {!isSpinning && spinCount === 0 && (
                            <h3 style={styles.resultText}>Nhấn để quay</h3>
                        )}
                        {!isSpinning && spinCount === 1 && (
                            <h3 style={{...styles.resultText, color: currentWinner.color}}>
                                {currentWinner.name} chơi đầu tiên!
                            </h3>
                        )}
                        {!isSpinning && spinCount === 2 && (
                            <div style={styles.finalOrderList}>
                                {finalOrder.map((p, index) => (
                                    <div key={p.id} style={{...styles.orderItem, animationDelay: `${index * 100}ms`}}>
                                        <span style={styles.orderNumber}>{index + 1}.</span>
                                        <span style={{color: p.color, fontWeight: 'bold'}}>
                                            {p.pawn} {p.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* =============================================== */}

                    <button
                        style={{
                            ...styles.spinButton,
                            opacity: isSpinning ? 0.6 : 1,
                            backgroundColor: spinCount === 2 ? '#2ed573' : '#feca57'
                        }}
                        onClick={handleButtonClick}
                        disabled={isSpinning}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    modalBackdrop: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(5px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#1e293b',
        color: '#e2e8f0',
        borderRadius: '16px',
        padding: '25px',
        width: '90%',
        maxWidth: '450px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        border: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px', // Giảm gap
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #334155',
        paddingBottom: '15px'
    },
    title: {
        margin: 0,
        fontSize: '1.5rem',
        color: '#f1f5f9'
    },
    closeButton: {
        background: 'none', border: 'none', color: '#94a3b8',
        fontSize: '2.5rem', cursor: 'pointer', lineHeight: 1,
        transition: 'color 0.2s',
    },
    // ===== STYLE MỚI CHO CHÚ THÍCH =====
    legendContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        flexWrap: 'wrap',
        paddingBottom: '15px',
        borderBottom: '1px solid #334155'
    },
    legendItem: {
        fontSize: '0.9rem',
        fontWeight: 'bold',
        padding: '4px 10px',
        borderRadius: '12px',
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid',
    },
    // ==================================
    spinnerContainer: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '280px', // Giảm chiều cao một chút
        marginTop: 0,
    },
    spinnerPointer: {
        width: 0,
        height: 0,
        borderLeft: '20px solid transparent',
        borderRight: '20px solid transparent',
        borderTop: '30px solid #feca57',
        position: 'absolute',
        top: '-10px',
        zIndex: 3,
        filter: 'drop-shadow(0 -2px 2px rgba(0,0,0,0.5))'
    },
    spinnerWheel: {
        width: '280px',
        height: '280px',
        borderRadius: '50%',
        border: '8px solid #16213e',
        boxShadow: '0 0 20px rgba(0,0,0,0.5), inset 0 0 15px rgba(0,0,0,0.3)',
        position: 'relative',
        zIndex: 2,
    },
    playerIcon: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transformOrigin: '0 0',
        fontSize: '2rem',
        width: '40px',
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '-20px 0 0 -20px',
    },
    footer: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 0, // Xóa gap ở đây
        marginTop: 0,
    },
    // ===== STYLE MỚI CHO KẾT QUẢ =====
    resultContainer: {
        minHeight: '90px', // Đặt chiều cao tối thiểu để layout ổn định
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px 0',
    },
    resultText: {
        margin: 0,
        fontSize: '1.4rem',
        fontWeight: 'bold',
        transition: 'color 0.3s'
        // Xóa height: '30px'
    },
    finalOrderList: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'center',
    },
    orderItem: {
        fontSize: '1.2rem',
        padding: '5px 15px',
        borderRadius: '8px',
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        width: '80%',
        textAlign: 'left',
        // Thêm animation
        opacity: 0,
        animation: 'fadeInUpItem 0.5s forwards',
    },
    orderNumber: {
        display: 'inline-block',
        width: '30px',
        color: '#cbd5e1',
        fontWeight: 'normal',
    },
    // ===================================
    spinButton: {
        padding: '12px 25px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#feca57',
        color: '#1a1a2e',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '1.2rem',
        transition: 'opacity 0.2s, background-color 0.2s',
        marginTop: '15px', // Thêm margin top
    }
};

export default TurnSpinner;