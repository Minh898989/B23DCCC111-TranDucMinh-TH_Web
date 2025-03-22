import { useState, useEffect } from "react";
import "./style.css";

type Chon = "Kéo" | "Búa" | "Bao";
type KetQua = "Hòa" | "Người chơi thắng" | "Máy tính thắng";

const choices: Chon[] = ["Kéo", "Búa", "Bao"];

const mayChon = (): Chon => {
    return choices[Math.floor(Math.random() * choices.length)];
};

const Win = (player: Chon, computer: Chon): KetQua => {
    if (player === computer) return "Hòa";
    if (
        (player === "Kéo" && computer === "Bao") ||
        (player === "Búa" && computer === "Kéo") ||
        (player === "Bao" && computer === "Búa")
    ) {
        return "Người chơi thắng";
    }
    return "Máy tính thắng";
};

const Tuti = () => {
    const [history, setHistory] = useState<string[]>([]);

    useEffect(() => {
        const storedHistory = localStorage.getItem("gameHistory");
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    }, []);

    const playGame = (nguoiChon: Chon) => {
        
        const MayChon = mayChon();
        const ketqua = Win(nguoiChon, MayChon);
        
        const record = `Người chơi: ${nguoiChon} - Máy tính: ${MayChon} => ${ketqua}`;
        const newHistory = [...history, record];
        setHistory(newHistory);
        localStorage.setItem("gameHistory", JSON.stringify(newHistory));
    };

    return (
        <div className="container">
            <h1 className="title">Trò chơi Kéo - Búa - Bao</h1>
            <div className="choices">
                {choices.map((choice) => (
                    <button 
                        key={choice} 
                        className="choice-button" 
                        onClick={() => playGame(choice)}
                    >
                        {choice}
                    </button>
                ))}
            </div>
            <h2 className="history-title">Lịch sử đối đầu:</h2>
            <ul className="history-list">
                {history.map((record, index) => (
                    <li key={index} className="history-item">{record}</li>
                ))}
            </ul>
        </div>
    );
};

export default Tuti;
