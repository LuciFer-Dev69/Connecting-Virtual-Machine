
import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import io from 'socket.io-client';

const WebTerminal = ({ host, user, onExit, challenge_id }) => {
    const terminalRef = useRef(null);
    const socketRef = useRef(null);
    const termRef = useRef(null);
    const [connected, setConnected] = useState(false);


    const [suggestion, setSuggestion] = useState("");
    const [commandBuffer, setCommandBuffer] = useState("");
    const [history, setHistory] = useState([]);

    const getMentorSuggestion = async (cmdHistory) => {
        try {
            const res = await fetch(`http://localhost:5000/api/ai/mentor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: cmdHistory, lab_name: host })
            });
            const data = await res.json();
            setSuggestion(data.suggestion);
        } catch (err) {
            console.error("AI Mentor error:", err);
        }
    };

    const connectedRef = useRef(false);

    useEffect(() => {
        // Initialize terminal
        const term = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#0d0d0d',
                foreground: '#0f0'
            },
            fontFamily: "'Fira Code', monospace",
            fontSize: 14,
            convertEol: true,
            scrollback: 5000,
            allowProposedApi: true
        });
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);

        setTimeout(() => {
            fitAddon.fit();
            term.focus();
        }, 100);

        termRef.current = term;

        const socket = io('http://localhost:5000');
        socketRef.current = socket;

        socket.on('connect', () => {
            term.write('\r\n\x1b[1;36mInitializing Secure Connection...\x1b[0m\r\n');
            socket.emit('ssh_connect', {
                clientVersion: '1.0.0',
                challenge_id: challenge_id
            });
            setConnected(true);
            connectedRef.current = true;
        });

        socket.on('ssh_output', (data) => {
            term.write(data);
        });

        socket.on('ssh_error', (msg) => {
            term.write(`\r\n\x1b[31mConnection Error: ${msg}\x1b[0m\r\n`);
            setConnected(false);
            connectedRef.current = false;
        });

        socket.on('ssh_disconnect', () => {
            term.write('\r\n\x1b[33mSession Terminated.\x1b[0m\r\n');
            setConnected(false);
            connectedRef.current = false;
            if (onExit) onExit();
        });

        // Interactive Input & Command Tracking
        let currentCmd = "";
        term.onData((data) => {
            if (connectedRef.current) {
                socket.emit('ssh_input', data);

                // Track commands for AI
                if (data === '\r' || data === '\n') {
                    if (currentCmd.trim()) {
                        setHistory(prev => {
                            const newHistory = [...prev, currentCmd.trim()].slice(-5);
                            getMentorSuggestion(newHistory);
                            return newHistory;
                        });
                    }
                    currentCmd = "";
                } else if (data === '\x7f') { // Backspace
                    currentCmd = currentCmd.slice(0, -1);
                } else {
                    currentCmd += data;
                }
            }
        });

        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
            term.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, [host, user, onExit]);

    return (
        <div style={{ position: "relative", height: "100%", width: "100%" }}>
            <div
                ref={terminalRef}
                style={{
                    height: "100%",
                    width: "100%",
                    background: "#0d0d0d"
                }}
            />
            {suggestion && (
                <div style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    maxWidth: "300px",
                    background: "rgba(255, 0, 68, 0.9)",
                    border: "1px solid var(--red)",
                    color: "#fff",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                    zIndex: 100,
                    animation: "slideIn 0.3s ease-out",
                    backdropFilter: "blur(4px)"
                }}>
                    <div style={{ fontWeight: "800", marginBottom: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>AI MENTOR</span>
                        <button onClick={() => setSuggestion("")} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "14px" }}>×</button>
                    </div>
                    {suggestion}
                </div>
            )}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(50px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default WebTerminal;

