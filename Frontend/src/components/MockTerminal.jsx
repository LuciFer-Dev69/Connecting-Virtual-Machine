import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

const MockTerminal = ({ onSolved }) => {
    const [history, setHistory] = useState([]);
    const [currentInput, setCurrentInput] = useState("");
    const [cmdHistory, setCmdHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    // Simulated File System
    const fileSystem = {
        "/": { type: "dir", children: ["home", "bin", "etc", "var"] },
        "/home": { type: "dir", children: ["chakra"] },
        "/home/chakra": {
            type: "dir",
            children: ["-", "readme.txt"],
            files: {
                "-": "chakra{dashed_filename_master}",
                "readme.txt": "The password for the next level is in the file '-'. Good luck!"
            }
        },
        "/bin": { type: "dir", children: ["ls", "cat", "cd", "pwd", "whoami", "find", "su"] },
        "/etc": { type: "dir", children: ["passwd"] },
    };

    const [cwd, setCwd] = useState("/home/chakra");
    const [user, setUser] = useState("chakra");
    const [isBooting, setIsBooting] = useState(true);

    useEffect(() => {
        // Simulated Boot Sequence / SSH Connection
        let timer1, timer2, timer3;
        timer1 = setTimeout(() => setHistory(["Connecting to pwnbox.chakra.ctf:22..."]), 500);
        timer2 = setTimeout(() => setHistory(prev => [...prev, "Connection established."]), 1500);
        timer3 = setTimeout(() => {
            setHistory(prev => [
                ...prev,
                "Welcome to ChakraOS PwnBox v1.0 (GNU/Linux 5.4.0-153-generic x86_64)",
                "",
                " * Documentation:  https://help.chakra.ctf",
                " * Management:     https://landscape.chakra.ctf",
                " * Support:        https://chakra.ctf/support",
                "",
                "System information as of " + new Date().toUTCString(),
                "",
                "0 updates can be installed immediately.",
                "0 of these updates are security updates.",
                "",
                "Last login: " + new Date().toLocaleString() + " from 192.168.1.105",
                "Type 'help' for available commands.",
                ""
            ]);
            setIsBooting(false);
        }, 3000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (cmd) => {
        const trimmed = cmd.trim();
        if (!trimmed) {
            setHistory(prev => [...prev, `${user}@pwnbox:${cwd}$ `]);
            return;
        }

        setCmdHistory(prev => [...prev, trimmed]);
        setHistoryIndex(-1);

        const newHistory = [...history, `${user}@pwnbox:${cwd}$ ${trimmed}`];
        const args = trimmed.split(" ");
        const command = args[0];

        // Command Logic
        switch (command) {
            case "help":
                newHistory.push("Available commands: ls, cd, cat, pwd, clear, whoami, file, find, su, exit");
                break;

            case "clear":
                setHistory([]);
                return;

            case "exit":
                setHistory(prev => [...prev, "logout", "Connection to pwnbox.chakra.ctf closed."]);
                setIsBooting(true); // Disable input effectively
                return;

            case "pwd":
                newHistory.push(cwd);
                break;

            case "whoami":
                newHistory.push(user);
                break;

            case "ls":
                // Logic to support simple flags like -la (ignored) and path
                let targetPath = cwd;
                if (args[1] && !args[1].startsWith("-")) {
                    targetPath = resolvePath(cwd, args[1]) || cwd;
                }
                const dirContent = getDirContents(targetPath);
                if (dirContent) {
                    newHistory.push(dirContent.join("  "));
                } else {
                    newHistory.push(`ls: cannot access '${args[1]}': No such file or directory`);
                }
                break;

            case "cat":
                if (!args[1]) {
                    newHistory.push("cat: missing operand");
                } else {
                    const target = args[1];
                    if (target === "-") {
                        newHistory.push("cat: -: input from stdin (Press Ctrl+C to stop - logic simulated)");
                        newHistory.push("Hint: '-' typically stands for stdin. Use a relative path like './-' to access the file.");
                    } else {
                        const content = readFile(cwd, target);
                        if (content) {
                            newHistory.push(content);
                            if (content.includes("chakra{")) {
                                onSolved && onSolved(content);
                            }
                        } else {
                            newHistory.push(`cat: ${target}: No such file or directory`);
                        }
                    }
                }
                break;

            case "cd":
                if (!args[1]) {
                    setCwd("/home/chakra");
                } else {
                    const newPath = resolvePath(cwd, args[1]);
                    if (newPath) {
                        setCwd(newPath);
                    } else {
                        newHistory.push(`cd: ${args[1]}: No such file or directory`);
                    }
                }
                break;

            case "file":
                if (!args[1]) {
                    newHistory.push("Usage: file <filename>");
                } else {
                    const fTarget = args[1];
                    if (fTarget === "-") {
                        newHistory.push("-: ASCII text, with very short line");
                    } else if (exists(cwd, fTarget)) {
                        newHistory.push(`${fTarget}: ASCII text`);
                    } else {
                        newHistory.push(`${fTarget}: cannot open '${fTarget}' (No such file or directory)`);
                    }
                }
                break;

            case "find":
                // Mock find command
                if (!args[1] || args[1] === ".") {
                    // List everything recursively from cwd (mocked)
                    newHistory.push(".");
                    const children = getDirContents(cwd);
                    children.forEach(c => newHistory.push(`./${c}`));
                } else if (args[1] === "/") {
                    newHistory.push("/");
                    newHistory.push("/home");
                    newHistory.push("/home/chakra");
                    newHistory.push("/bin");
                    newHistory.push("/etc");
                } else {
                    newHistory.push(`find: '${args[1]}': No such file or directory`);
                }
                break;

            case "su":
                if (!args[1]) {
                    newHistory.push("su: user root does not exist or password required");
                } else {
                    newHistory.push(`Password: `);
                    newHistory.push(`su: Authentication failure`);
                }
                break;

            default:
                newHistory.push(`${command}: command not found`);
        }

        setHistory(newHistory);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleCommand(currentInput);
            setCurrentInput("");
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (cmdHistory.length > 0) {
                const newIndex = historyIndex + 1;
                if (newIndex < cmdHistory.length) {
                    setHistoryIndex(newIndex);
                    setCurrentInput(cmdHistory[cmdHistory.length - 1 - newIndex]);
                }
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setCurrentInput(cmdHistory[cmdHistory.length - 1 - newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setCurrentInput("");
            }
        } else if (e.key === "Tab") {
            e.preventDefault();
            // Simple autocomplete logic could go here
        }
    };

    // Helper Functions (Same as before)
    const getDirContents = (path) => {
        if (fileSystem[path]) return fileSystem[path].children;
        return [];
    };

    const readFile = (path, filename) => {
        const cleanName = filename.replace("./", "");
        if (fileSystem[path] && fileSystem[path].files && fileSystem[path].files[cleanName]) {
            return fileSystem[path].files[cleanName];
        }
        return null;
    };

    const resolvePath = (current, target) => {
        if (target === "..") {
            const parts = current.split("/");
            parts.pop();
            const up = parts.join("/") || "/";
            return fileSystem[up] ? up : current;
        }
        if (target === ".") return current;
        if (target === "/") return "/";
        if (target.startsWith("/")) {
            return fileSystem[target] ? target : null;
        }
        const join = current === "/" ? `/${target}` : `${current}/${target}`;
        return fileSystem[join] ? join : null;
    };

    const exists = (path, name) => {
        const clean = name.replace("./", "");
        if (fileSystem[path] && fileSystem[path].files && fileSystem[path].files[clean]) return true;
        if (fileSystem[path] && fileSystem[path].children.includes(clean)) return true;
        return false;
    };

    return (
        <div
            className="mock-terminal"
            onClick={() => !isBooting && inputRef.current?.focus()}
            style={{
                background: "#0d0d0d",
                color: "#0f0",
                fontFamily: "'Fira Code', monospace",
                padding: "20px",
                borderRadius: "8px",
                height: "500px",
                overflowY: "auto",
                border: "1px solid #333",
                boxShadow: "0 0 15px rgba(0, 255, 0, 0.15)",
                fontSize: "14px",
                lineHeight: "1.5"
            }}
        >
            {history.map((line, i) => (
                <div key={i} style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{line}</div>
            ))}
            {!isBooting && (
                <div style={{ display: "flex" }}>
                    <span style={{ marginRight: "10px", color: "#51cf66", whiteSpace: "nowrap" }}>{user}@pwnbox:{cwd}$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#fff",
                            flex: 1,
                            outline: "none",
                            fontFamily: "inherit",
                            fontSize: "inherit"
                        }}
                        autoFocus
                        autoComplete="off"
                        spellCheck="false"
                    />
                </div>
            )}
            <div ref={bottomRef} />
        </div>
    );
};

export default MockTerminal;
