
import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import io from 'socket.io-client';

const WebTerminal = ({ host, user, onExit }) => {
    const terminalRef = useRef(null);
    const socketRef = useRef(null);
    const termRef = useRef(null);
    const [connected, setConnected] = useState(false);


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

        // Ensure fit happens after opening and slightly delayed to catch container growth
        setTimeout(() => {
            fitAddon.fit();
            term.focus();
        }, 100);

        termRef.current = term;

        // Socket.io connection
        const socket = io('http://localhost:5000');
        socketRef.current = socket;

        // Auto-connect flow
        socket.on('connect', () => {
            term.write('\r\n\x1b[1;36mInitializing Secure Connection...\x1b[0m\r\n');
            // Credentials are now handled securely by the backend
            socket.emit('ssh_connect', {
                // We send basic metadata if needed, but no passwords
                clientVersion: '1.0.0'
            });
            setConnected(true);
        });

        socket.on('ssh_output', (data) => {
            term.write(data);
        });

        socket.on('ssh_error', (msg) => {
            term.write(`\r\n\x1b[31mConnection Error: ${msg}\x1b[0m\r\n`);
            setConnected(false);
        });

        socket.on('ssh_disconnect', () => {
            term.write('\r\n\x1b[33mSession Terminated.\x1b[0m\r\n');
            setConnected(false);
            if (onExit) onExit();
        });

        // Interactive Input
        term.onData((data) => {
            if (connected) { // Only send input if SSH connection is active
                socket.emit('ssh_input', data);
            }
        });

        // Handle resize if needed in future (fitAddon handles initial)
        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
            term.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, [host, user, onExit, connected]); // Added 'connected' to dependencies to ensure term.onData uses latest state

    return (
        <div
            ref={terminalRef}
            style={{
                height: "100%",
                width: "100%",
                background: "#0d0d0d"
            }}
        />
    );
};

export default WebTerminal;

