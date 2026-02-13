
import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

/**
 * FakeTerminal - A frontend-only terminal simulator
 * Provides a context-aware simulation of a Linux terminal for specific challenges.
 * Features: Persistent filesystem state, common Linux commands, and challenge-specific logic.
 */
const FakeTerminal = ({ challenge_title, category, onExit, onCommand }) => {
    const terminalRef = useRef(null);
    const termRef = useRef(null);
    const [history, setHistory] = useState([]);

    const isBlue = category?.toLowerCase().includes("blue") || category?.toLowerCase().includes("forensics");
    const isRealLife = category?.toLowerCase().includes("real-life");

    // Virtual Filesystem State
    const [pwd, setPwd] = useState("/home/chakra");
    const [isNanoMode, setIsNanoMode] = useState(false);
    const [nanoFile, setNanoFile] = useState(null);
    const [fs, setFs] = useState(() => {
        const baseFs = {
            "/": { type: 'dir', owner: 'root', permissions: 'drwxr-xr-x' },
            "/home": { type: 'dir', owner: 'root', permissions: 'drwxr-xr-x' },
            "/home/chakra": { type: 'dir', owner: 'chakra', permissions: 'drwxr-xr-x' },
            "/home/chakra/scripts": { type: 'dir', owner: 'chakra', permissions: 'drwxr-xr-x' },
            "/var": { type: 'dir', owner: 'root', permissions: 'drwxr-xr-x' },
            "/var/log": { type: 'dir', owner: 'root', permissions: 'drwxr-xr-x' },
            "/var/log/auth.log": {
                type: 'file',
                owner: 'root',
                permissions: '-rw-r-----',
                content: "Feb 13 21:00:01 chakra sshd[1234]: Failed password for root from 192.168.1.105 port 22 ssh2"
            }
        };

        if (isRealLife) {
            // Isolation Rule: Clear generic files for Real Life
            baseFs["/home/chakra/notes.txt"] = {
                type: 'file', owner: 'chakra', permissions: '-rw-r--r--',
                content: `OPERATIVE NOTES - ${challenge_title}\n----------------------------------\n- Target Uplink: target.local\n- Mission: High-stakes corporate infiltration.\n- Warning: Sector is under active monitoring.`
            };

            if (challenge_title === "Operation Blackout") {
                baseFs["/home/chakra/scada"] = { type: 'dir', owner: 'chakra', permissions: 'drwxr-xr-x' };
                baseFs["/home/chakra/scada/modbus_traffic.pcap"] = {
                    type: 'file', owner: 'chakra', permissions: '-rw-r--r--',
                    content: "[BINARY] 01 03 00 00 00 0A C5 CD\n[INFO] Write Multiple Registers (FC 16)\n[ALARM] Critical Command Sent to PLC Unit 7"
                };
                baseFs["/home/chakra/scada/plc_map.txt"] = {
                    type: 'file', owner: 'chakra', permissions: '-rw-r--r--',
                    content: "REVERSE_ENGINEER_LOG:\nTarget: SCADA Power Grid Controller\nModbus Function Code 16 (0x10) identified as the Kill Switch.\nNeural Signature found in sector 0xFF: SIGNATURE{grid_restart_0x77}"
                };
            }

            if (challenge_title === "The Heist") {
                baseFs["/home/chakra/banking"] = { type: 'dir', owner: 'chakra', permissions: 'drwxr-xr-x' };
                baseFs["/home/chakra/banking/session_tokens.log"] = {
                    type: 'file', owner: 'chakra', permissions: '-rw-r--r--',
                    content: "ID: 99128 | TOKEN: eyJhbGciOiJIUzI1NiJ9... [REDACTED]\nID: 99129 | TOKEN: eyJhbGciOiJIUzI1NiJ9... [VALID]\nBypassing 3-person auth via Race Condition detected in /api/v2/wire-transfer"
                };
                baseFs["/home/chakra/banking/vault_keys.db"] = {
                    type: 'file', owner: 'chakra', permissions: '-rw-r--r--',
                    content: "DB_ADMIN_KEY: h_admin_access_99\nINTERNAL_FLAG: SIGNATURE{swift_race_bypass_vault}"
                };
            }

            if (challenge_title === "Chain Reaction") {
                baseFs["/home/chakra/global-tech"] = { type: 'dir', owner: 'chakra', permissions: 'drwxr-xr-x' };
                baseFs["/home/chakra/global-tech/jenkins.config.xml"] = {
                    type: 'file', owner: 'chakra', permissions: '-rw-r--r--',
                    content: "<jenkins>\n  <version>2.235.1</version>\n  <security>\n    <bypass_script>install_shell.sh</bypass_script>\n  </security>\n</jenkins>"
                };
                baseFs["/home/chakra/global-tech/install_shell.sh"] = {
                    type: 'file', owner: 'chakra', permissions: '-rwxr-xr-x',
                    content: "#!/bin/bash\n# Supply Chain Malicious Payload\necho 'Injecting shellcode into production binary...'\n# SIGNATURE{jenkins_poison_pipeline}"
                };
            }

            if (challenge_title === "Patient Zero") {
                baseFs["/home/chakra/st-marys"] = { type: 'dir', owner: 'chakra', permissions: 'drwxr-xr-x' };
                baseFs["/home/chakra/st-marys/encryption_log.txt"] = {
                    type: 'file', owner: 'chakra', permissions: '-rw-r--r--',
                    content: "ENCRYPTION_ID: DARK_SIDE_2.0\nTARGET_DB: Patients_Records_2026\nSTATUS: 100% ENCRYPTED\nRansom Amount: 50 BTC\nDECRYPTION_LOG: SIGNATURE{ransomware_reversal_key_01}"
                };
            }
        } else if (isBlue) {
            // ... (rest of the blue stuff)
            baseFs["/home/chakra/notes.txt"] = {
                type: 'file',
                owner: 'chakra',
                permissions: '-rw-r--r--',
                content: "Chakra-OS Security Monitoring Notes:\n- Monitor /var/log/auth.log for unauthorized access.\n- Check active processes with 'ps aux' for resource abuse.\n- Investigate /tmp for hidden persistence scripts."
            };
            baseFs["/home/chakra/scripts/health_check.sh"] = {
                type: 'file',
                owner: 'chakra',
                permissions: '-rwxr-xr-x',
                content: "#!/bin/bash\necho \"Checking system health...\"\nps aux | grep -v grep | head -n 10"
            };
            baseFs["/home/chakra/scripts/backup_config.php"] = {
                type: 'file',
                owner: 'chakra',
                permissions: '-rw-rw-rw-',
                content: "<?php\n// Internal Backup Script\n$db_pass = 'CHAKRA_DEFENDER{config_permission_tightened}';\n?>"
            };

            if (challenge_title === "Incident 47 – The Phantom Beacon") {
                baseFs["/home/chakra/README.txt"] = {
                    type: 'file', owner: 'chakra', permissions: '-rw-r--r--',
                    content: "INCIDENT 47 – INTERNAL ALERT\n\nSuspicious outbound traffic detected. Tasks:\n1. Identify infected machine IP\n2. Identify attacker C2 domain\n3. Determine time of compromise\n4. Recover exfiltrated secret key\n\nFlag format: FLAG{infectedIP_C2domain_key}"
                };
                baseFs["/home/chakra/logs"] = { type: 'dir', owner: 'chakra', permissions: 'drwxr-xr-x' };
                baseFs["/home/chakra/logs/firewall.log"] = {
                    type: 'file', owner: 'chakra', permissions: '-rw-r--r--',
                    content: "2026-04-12 09:14:02 ALLOW TCP 192.168.1.23 -> 34.77.182.91:443\n2026-04-12 09:14:32 ALLOW TCP 192.168.1.23 -> 34.77.182.91:443\n2026-04-12 09:15:02 ALLOW TCP 192.168.1.23 -> 34.77.182.91:443\n2026-04-12 09:15:32 ALLOW TCP 192.168.1.23 -> 34.77.182.91:443"
                };
                baseFs["/home/chakra/logs/proxy.log"] = {
                    type: 'file', owner: 'chakra', permissions: '-rw-r--r--',
                    content: "2026-04-12 09:14:02 GET https://cdn-security-update.com/checkin\n2026-04-12 09:14:32 GET https://cdn-security-update.com/checkin\n2026-04-12 09:15:02 GET https://cdn-security-update.com/checkin"
                };
                baseFs["/home/chakra/logs/auth.log"] = {
                    type: 'file', owner: 'chakra', permissions: '-rw-r--r--',
                    content: "Apr 12 08:58:12 workstation-23 user john login success\nApr 12 09:12:48 workstation-23 user john executed /tmp/update.sh\nApr 12 09:12:50 workstation-23 user john executed /tmp/beacon"
                };
                baseFs["/home/chakra/capture"] = { type: 'dir', owner: 'chakra', permissions: 'drwxr-xr-x' };
                baseFs["/home/chakra/capture/suspicious_traffic.pcap"] = {
                    type: 'file', owner: 'chakra', permissions: '-rw-r--r--',
                    content: "[BINARY_DATA]...POST /upload HTTP/1.1\nHost: cdn-security-update.com\ndata=U0VDUkVUX0tFWV9YT1IxMjM=...[BINARY_DATA]"
                };
            }
        } else {
            baseFs["/home/chakra/notes.txt"] = {
                type: 'file',
                owner: 'chakra',
                permissions: '-rw-r--r--',
                content: "Chakra-OS Security Assessment Notes:\n- Target: http://target.local\n- Goal: Identify misconfigurations and extract flags.\n- Remember: Check for exposed backups and robots.txt."
            };
            baseFs["/home/chakra/scripts/recon.sh"] = {
                type: 'file',
                owner: 'chakra',
                permissions: '-rwxr-xr-x',
                content: "#!/bin/bash\necho \"Starting recon on target.local...\"\nnmap -F target.local"
            };
        }
        return baseFs;
    });

    const [processes, setProcesses] = useState([
        { pid: 1, user: 'root', cpu: 0.0, mem: 0.1, command: '/sbin/init' },
        { pid: 502, user: 'chakra', cpu: 0.0, mem: 0.2, command: '/bin/bash' },
        { pid: 999, user: 'chakra', cpu: 98.2, mem: 0.5, command: './xmrig_miner' }
    ]);

    // We need a ref for the latest state to use inside the term.onData callback
    const stateRef = useRef({ pwd, fs, history, isNanoMode, nanoFile, processes });
    const historyIndexRef = useRef(-1);

    useEffect(() => {
        stateRef.current = { pwd, fs, history, isNanoMode, nanoFile, processes };
    }, [pwd, fs, history, isNanoMode, nanoFile, processes]);

    useEffect(() => {
        const term = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#0d0d0d',
                foreground: '#0f0',
                cursor: '#0f0',
                selection: 'rgba(255, 255, 255, 0.3)'
            },
            fontFamily: "'Fira Code', monospace",
            fontSize: 14,
            convertEol: true,
            scrollback: 5000,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        // Small delay to ensure container is in DOM and has dimensions
        setTimeout(() => {
            if (termRef.current) {
                fitAddon.fit();
            }
        }, 100);
        term.focus();

        termRef.current = term;

        const renderSinglePrompt = (currentPath) => {
            const displayPath = currentPath === "/home/chakra" ? "~" : currentPath.replace("/home/chakra/", "~/");
            term.write(`\r\x1b[1;32mchakra@chakraview\x1b[0m:\x1b[1;34m${displayPath}\x1b[0m$ `);
        };

        // Welcome Message (Only if not in nano mode)
        if (!isNanoMode) {
            term.writeln("\x1b[1;32m[+] Neural Uplink Established: chakra@chakraview\x1b[0m");
            term.writeln("\x1b[1;34m[*] Tactical Context: " + (challenge_title || "General Sandbox") + "\x1b[0m");
            term.writeln("ChakraView OS v2.4.0-STABLE (tty1)");
            term.writeln("Type 'help' for tactical commands.\r\n");
            renderSinglePrompt(pwd);
        }

        let currentLine = "";
        let cursorPos = 0;

        term.onData(e => {
            if (stateRef.current.isNanoMode) {
                if (e === '\u0018') { // Ctrl+X
                    setIsNanoMode(false);
                    setNanoFile(null);
                    term.clear();
                }
                return;
            }

            // Tab Completion
            if (e === '\t') {
                const parts = currentLine.substring(0, cursorPos).split(/\s+/);
                const lastFragment = parts[parts.length - 1];
                const currentFs = stateRef.current.fs;
                const currentPwd = stateRef.current.pwd;

                let suggestions = [];
                if (parts.length === 1) {
                    // Complete commands
                    const commands = ['help', 'ls', 'cd', 'pwd', 'cat', 'mkdir', 'touch', 'rm', 'echo', 'whoami', 'curl', 'unzip', 'nmap', 'clear', 'exit', 'ps', 'kill', 'gobuster', 'nano', 'strings', 'base64', 'mv', 'cp', 'head', 'tail'];
                    suggestions = commands.filter(c => c.startsWith(lastFragment));
                } else {
                    // Complete files/dirs
                    const entries = Object.keys(currentFs).filter(p => {
                        const parent = p.substring(0, p.lastIndexOf("/")) || "/";
                        return parent === currentPwd && p !== currentPwd;
                    }).map(p => p.substring(p.lastIndexOf("/") + 1));
                    suggestions = entries.filter(en => en.startsWith(lastFragment));
                }

                if (suggestions.length === 1) {
                    const toAppend = suggestions[0].substring(lastFragment.length);
                    const tail = currentLine.slice(cursorPos);
                    currentLine = currentLine.slice(0, cursorPos) + toAppend + tail;
                    term.write(toAppend + tail);
                    cursorPos += toAppend.length;
                    if (tail.length > 0) {
                        term.write(`\x1b[${tail.length}D`);
                    }
                } else if (suggestions.length > 1) {
                    term.write("\r\n" + suggestions.join("  ") + "\r\n");
                    renderSinglePrompt(stateRef.current.pwd);
                    term.write(currentLine);
                    if (currentLine.length > cursorPos) {
                        term.write(`\x1b[${currentLine.length - cursorPos}D`);
                    }
                }
                return;
            }

            if (e === "\u001b[A") { // UP
                const h = stateRef.current.history;
                if (h.length > 0 && historyIndexRef.current < h.length - 1) {
                    historyIndexRef.current++;
                    // Clear current line
                    for (let i = 0; i < cursorPos; i++) term.write('\b');
                    term.write('\x1b[K');
                    currentLine = h[h.length - 1 - historyIndexRef.current];
                    cursorPos = currentLine.length;
                    term.write(currentLine);
                }
                return;
            }

            if (e === "\u001b[B") { // DOWN
                const h = stateRef.current.history;
                if (historyIndexRef.current > -1) {
                    historyIndexRef.current--;
                    // Clear current line
                    for (let i = 0; i < cursorPos; i++) term.write('\b');
                    term.write('\x1b[K');
                    if (historyIndexRef.current === -1) {
                        currentLine = "";
                    } else {
                        currentLine = h[h.length - 1 - historyIndexRef.current];
                    }
                    cursorPos = currentLine.length;
                    term.write(currentLine);
                }
                return;
            }

            if (e === "\u001b[D") { // LEFT
                if (cursorPos > 0) {
                    cursorPos--;
                    term.write(e);
                }
                return;
            }

            if (e === "\u001b[C") { // RIGHT
                if (cursorPos < currentLine.length) {
                    cursorPos++;
                    term.write(e);
                }
                return;
            }

            if (e === "\u001b[H") { // HOME
                if (cursorPos > 0) {
                    term.write(`\x1b[${cursorPos}D`);
                    cursorPos = 0;
                }
                return;
            }

            if (e === "\u001b[F") { // END
                if (cursorPos < currentLine.length) {
                    term.write(`\x1b[${currentLine.length - cursorPos}C`);
                    cursorPos = currentLine.length;
                }
                return;
            }

            switch (e) {
                case '\r': // Enter
                    term.writeln("");
                    const lineToExec = currentLine;
                    currentLine = "";
                    cursorPos = 0;
                    historyIndexRef.current = -1;
                    if (lineToExec.trim()) {
                        handleCommand(lineToExec);
                    } else {
                        renderSinglePrompt(stateRef.current.pwd);
                    }
                    break;
                case '\u007F': // Backspace
                    if (cursorPos > 0) {
                        const tail = currentLine.slice(cursorPos);
                        currentLine = currentLine.slice(0, cursorPos - 1) + tail;
                        cursorPos--;
                        term.write('\b' + tail + ' \x1b[K');
                        if (tail.length > 0) {
                            term.write(`\x1b[${tail.length}D`);
                        }
                    }
                    break;
                case '\u0003': // Ctrl+C
                    term.write("^C\r\n");
                    currentLine = "";
                    cursorPos = 0;
                    historyIndexRef.current = -1;
                    renderSinglePrompt(stateRef.current.pwd);
                    break;
                default:
                    if (e >= " " && e <= "~") {
                        const tail = currentLine.slice(cursorPos);
                        currentLine = currentLine.slice(0, cursorPos) + e + tail;
                        term.write(e + tail);
                        cursorPos++;
                        if (tail.length > 0) {
                            term.write(`\x1b[${tail.length}D`);
                        }
                    }
                    break;
            }
        });

        const handleCommand = (cmdLine) => {
            // AI Mentor Integration
            if (onCommand) onCommand(cmdLine);

            // Add to history
            setHistory(prev => [...prev, cmdLine]);

            // Handle chaining with &&
            const basicCommands = cmdLine.split("&&");

            const executeOne = (singleCmd) => {
                const originalParts = singleCmd.trim().split(/\s+/).filter(Boolean);
                if (originalParts.length === 0) return;

                const isSudo = originalParts[0] === "sudo";
                const parts = isSudo ? originalParts.slice(1) : originalParts;
                const cmd = parts[0]?.toLowerCase();
                const args = parts.slice(1);

                const currentPwd = stateRef.current.pwd;
                const currentFs = stateRef.current.fs;

                const resolvePath = (path) => {
                    if (!path) return currentPwd;
                    if (path === "~") return "/home/chakra";
                    if (path === "/") return "/";

                    let absolute;
                    if (path.startsWith("/")) {
                        absolute = path;
                    } else {
                        absolute = (currentPwd === "/" ? "/" : currentPwd + "/") + path;
                    }

                    // Remove trailing slash and normalize .. and .
                    const parts = absolute.split("/").filter(Boolean);
                    const stack = [];
                    for (const p of parts) {
                        if (p === "..") stack.pop();
                        else if (p !== ".") stack.push(p);
                    }
                    return "/" + stack.join("/");
                };

                // Simplified Pipe Support (|)
                if (singleCmd.includes("|")) {
                    const segments = singleCmd.split("|").map(s => s.trim());
                    // Handle specifically for echo | base64 -d
                    if (segments[0].startsWith("echo") && segments[1].startsWith("base64 -d")) {
                        const val = segments[0].replace(/^echo\s+/, "").trim().replace(/['"]/g, "");
                        if (val === "U0VDUkVUX0tFWV9YT1IxMjM=") {
                            term.writeln("FLAG{192.168.1.23_cdn-security-update.com_SECRET_KEY_XOR123}");
                            return;
                        } else {
                            term.writeln("base64: invalid input");
                            return;
                        }
                    }
                    // Handle strings | grep
                    if (segments[0].startsWith("strings") && segments[1].startsWith("grep")) {
                        const filePart = segments[0].replace(/^strings\s+/, "").trim();
                        const queryPart = segments[1].replace(/^grep\s+/, "").trim();
                        const filePath = resolvePath(filePart);
                        if (currentFs[filePath] && currentFs[filePath].type === 'file') {
                            const matches = currentFs[filePath].content.split("\n").filter(line => line.includes(queryPart));
                            matches.forEach(m => term.writeln(m));
                            return;
                        }
                    }
                }

                switch (cmd) {
                    case 'help':
                        term.writeln("Available System Commands:");
                        term.writeln("  ls [dir]      - List directory contents");
                        term.writeln("  cd [dir]      - Change directory");
                        term.writeln("  pwd           - Print working directory");
                        term.writeln("  cat [file]    - Display file content");
                        term.writeln("  mkdir [dir]   - Create directory");
                        term.writeln("  touch [file]  - Create empty file");
                        term.writeln("  rm [path]     - Remove file or directory");
                        term.writeln("  echo [text]   - Display text");
                        term.writeln("  whoami        - Display current user");
                        term.writeln("  curl [url]    - Transfer data from URL");
                        term.writeln("  unzip [file]  - Extract zipped files");
                        term.writeln("  nmap [host]   - Network exploration tool");
                        term.writeln("  mv [src] [dest] - Move or rename files/directories");
                        term.writeln("  cp [src] [dest] - Copy files/directories");
                        term.writeln("  head [file]   - Display first lines of a file");
                        term.writeln("  tail [file]   - Display last lines of a file");
                        term.writeln("  clear         - Clear terminal screen");
                        term.writeln("  exit          - Close session");
                        break;

                    case 'ls':
                        const isAll = args.includes("-a") || args.includes("-la") || args.includes("-al");
                        const targetArg = args.find(a => !a.startsWith("-"));
                        const targetPath = resolvePath(targetArg);

                        if (currentFs[targetPath] && currentFs[targetPath].type === 'dir') {
                            const entries = Object.keys(currentFs)
                                .filter(p => {
                                    const parent = p.substring(0, p.lastIndexOf("/")) || "/";
                                    return parent === targetPath && p !== targetPath && p !== "/";
                                })
                                .map(p => {
                                    const name = p.substring(p.lastIndexOf("/") + 1);
                                    if (!isAll && name.startsWith(".")) return null;
                                    // Use Ubuntu-style colors for directories
                                    return currentFs[p].type === 'dir' ? `\x1b[1;34m${name}/\x1b[0m` : name;
                                })
                                .filter(Boolean);
                            term.writeln(entries.join("  "));
                        } else if (currentFs[targetPath] && currentFs[targetPath].type === 'file') {
                            term.writeln(targetArg);
                        } else {
                            term.writeln(`ls: cannot access '${targetArg || ""}': No such file or directory`);
                        }
                        break;

                    case 'cd':
                        const nextDir = resolvePath(args[0] || "~");
                        if (currentFs[nextDir] && currentFs[nextDir].type === 'dir') {
                            setPwd(nextDir);
                        } else {
                            term.writeln(`-bash: cd: ${args[0]}: No such file or directory`);
                        }
                        break;

                    case 'pwd':
                        term.writeln(currentPwd);
                        break;

                    case 'whoami':
                        term.writeln("chakra");
                        break;

                    case 'cat':
                        if (!args[0]) term.writeln("cat: missing file operand");
                        else {
                            const fileToRead = resolvePath(args[0]);
                            if (currentFs[fileToRead] && currentFs[fileToRead].type === 'file') {
                                term.writeln(currentFs[fileToRead].content);
                            } else {
                                term.writeln(`cat: ${args[0]}: No such file or directory`);
                            }
                        }
                        break;

                    case 'mkdir':
                        if (args[0]) {
                            const newDir = resolvePath(args[0]);
                            setFs(prev => ({ ...prev, [newDir]: { type: 'dir', owner: 'chakra', permissions: 'drwxr-xr-x' } }));
                        }
                        break;

                    case 'touch':
                        if (args[0]) {
                            const newFile = resolvePath(args[0]);
                            setFs(prev => ({ ...prev, [newFile]: { type: 'file', owner: 'chakra', permissions: '-rw-r--r--', content: "" } }));
                        }
                        break;

                    case 'rm':
                        if (args[0]) {
                            const pathToRemove = resolvePath(args[0]);
                            if (currentFs[pathToRemove]) {
                                setFs(prev => {
                                    const nextFs = { ...prev };
                                    delete nextFs[pathToRemove];
                                    // Also remove children if it was a dir? (simplified)
                                    return nextFs;
                                });
                            } else {
                                term.writeln(`rm: cannot remove '${args[0]}': No such file or directory`);
                            }
                        }
                        break;

                    case 'echo':
                        term.writeln(args.join(" "));
                        break;

                    case 'mv':
                        if (args.length < 2) {
                            term.writeln("mv: missing destination file operand");
                        } else {
                            const srcPath = resolvePath(args[0]);
                            const destPath = resolvePath(args[1]);
                            if (currentFs[srcPath]) {
                                setFs(prev => {
                                    const nextFs = { ...prev };
                                    nextFs[destPath] = nextFs[srcPath];
                                    delete nextFs[srcPath];
                                    return nextFs;
                                });
                            } else {
                                term.writeln(`mv: cannot stat '${args[0]}': No such file or directory`);
                            }
                        }
                        break;

                    case 'cp':
                        if (args.length < 2) {
                            term.writeln("cp: missing destination file operand");
                        } else {
                            const srcPath = resolvePath(args[0]);
                            const destPath = resolvePath(args[1]);
                            if (currentFs[srcPath]) {
                                setFs(prev => ({ ...prev, [destPath]: { ...prev[srcPath] } }));
                            } else {
                                term.writeln(`cp: cannot stat '${args[0]}': No such file or directory`);
                            }
                        }
                        break;

                    case 'head':
                        if (!args[0]) term.writeln("head: missing operand");
                        else {
                            const hFile = resolvePath(args[0]);
                            if (currentFs[hFile] && currentFs[hFile].type === 'file') {
                                const lines = currentFs[hFile].content.split("\n").slice(0, 10);
                                lines.forEach(l => term.writeln(l));
                            } else {
                                term.writeln(`head: cannot open '${args[0]}' for reading: No such file`);
                            }
                        }
                        break;

                    case 'tail':
                        if (!args[0]) term.writeln("tail: missing operand");
                        else {
                            const tFile = resolvePath(args[0]);
                            if (currentFs[tFile] && currentFs[tFile].type === 'file') {
                                const lines = currentFs[tFile].content.split("\n").slice(-10);
                                lines.forEach(l => term.writeln(l));
                            } else {
                                term.writeln(`tail: cannot open '${args[0]}' for reading: No such file`);
                            }
                        }
                        break;

                    case 'grep':
                        if (args.length < 2) {
                            term.writeln("Usage: grep [pattern] [file]");
                        } else {
                            const pattern = args[0].replace(/['"]/g, "");
                            const gFile = resolvePath(args[1]);
                            if (currentFs[gFile] && currentFs[gFile].type === 'file') {
                                const matches = currentFs[gFile].content.split("\n").filter(line => line.includes(pattern));
                                matches.forEach(m => term.writeln(m));
                            } else {
                                term.writeln(`grep: ${args[1]}: No such file or directory`);
                            }
                        }
                        break;

                    case 'clear':
                        term.clear();
                        break;

                    case 'ps':
                        term.writeln("USER       PID  %CPU %MEM    COMMAND");
                        stateRef.current.processes.forEach(p => {
                            const line = `${p.user.padEnd(10)} ${p.pid.toString().padEnd(4)} ${p.cpu.toFixed(1).toString().padStart(5)} ${p.mem.toFixed(1).toString().padStart(4)}    ${p.command}`;
                            term.writeln(line);
                        });
                        break;

                    case 'kill':
                        const pidToKill = parseInt(args[0]);
                        if (stateRef.current.processes.find(p => p.pid === pidToKill)) {
                            setProcesses(prev => prev.filter(p => p.pid !== pidToKill));
                            term.writeln(`Process ${pidToKill} terminated.`);
                        } else {
                            term.writeln(`bash: kill: (${args[0]}) - No such process`);
                        }
                        break;

                    case 'exit':
                        if (onExit) onExit();
                        break;

                    case 'curl':
                        const curlArgs = args.join(" ");
                        const findUrl = (str) => {
                            const match = str.match(/https?:\/\/[^\s"]+/);
                            return match ? match[0] : (args.find(a => a.includes("target.local")) || args[0] || "");
                        };
                        const url = findUrl(curlArgs);

                        if (curlArgs.includes("target.local/backup.zip")) {
                            term.writeln("Downloading backup.zip...");
                            term.writeln("100% [================================================>] 2.4MB  1.2MB/s");
                            const zipPath = (currentPwd === "/" ? "/" : currentPwd + "/") + "backup.zip";
                            setFs(prev => ({ ...prev, [zipPath]: { type: 'file', owner: 'chakra', permissions: '-rw-r--r--', content: "[Binary Data Archive]" } }));
                        } else if (curlArgs.includes("target.local/robots.txt")) {
                            if (challenge_title === "Robots.txt Leak") {
                                term.writeln("User-agent: *\nDisallow: /super-secret-folder-99/");
                            } else {
                                term.writeln("User-agent: *\nDisallow: /admin/\nDisallow: /assets/");
                            }
                        } else if (curlArgs.includes("target.local/super-secret-folder-99/")) {
                            if (challenge_title === "Robots.txt Leak") {
                                term.writeln("Welcome to the Private Stash.\n\nFLAG{robots_never_hide_secrets}");
                            } else {
                                term.writeln(`curl: (7) Failed to connect to ${url} port 80: Connection refused`);
                            }
                        } else if (curlArgs.includes("target.local/login.php")) {
                            if (curlArgs.includes("' OR 1=1 --")) {
                                term.writeln("Welcome Admin! Authentication successful.\n\nFLAG{classic_sqli_bypass}");
                            } else {
                                term.writeln("Login Failed: Invalid credentials.");
                            }
                        } else if (curlArgs.includes("target.local/admin/") || curlArgs.includes("target.local/admin")) {
                            if (curlArgs.includes("-u astranova_admin:Sup3rS3cretP@ss")) {
                                term.writeln("Welcome Admin.\nSystem status: Operational.\n\nFLAG{backup_exposure_mastered}");
                            } else {
                                term.writeln("HTTP/1.1 401 Unauthorized\nContent-Type: text/plain\n\nUnauthorized Access");
                            }
                        } else if (curlArgs.includes("target.local/api/user/v1/profile")) {
                            if (curlArgs.includes("id=1")) {
                                term.writeln("{\"id\": 1, \"name\": \"astranova_root\", \"email\": \"root@astranova.cyber\", \"flag\": \"FLAG{idor_data_exposure}\"}");
                            } else if (curlArgs.includes("id=")) {
                                const idPart = curlArgs.split("id=")[1].split(/\s|&/)[0];
                                term.writeln(`{"id": ${idPart}, "name": "User_${idPart}", "role": "customer"}`);
                            } else {
                                term.writeln("{\"error\": \"Missing user ID\"}");
                            }
                        } else if (curlArgs.includes("target.local/contact.php")) {
                            if (curlArgs.includes("<script>") && curlArgs.includes("document.cookie")) {
                                term.writeln("Message sent to admin successfully!");
                                // Simulate log file creation
                                setFs(prev => ({
                                    ...prev,
                                    "/var/log/attacker_web.log": {
                                        type: 'file', owner: 'chakra', permissions: '-rw-r--r--',
                                        content: "GET /?c=session_id=ASTRANOVA_SECRET_VAL;admin=true\nFLAG{persistent_xss_master}"
                                    }
                                }));
                            } else {
                                term.writeln("Message sent.");
                            }
                        } else if (curlArgs.includes("target.local/fetch.php?url=") || curlArgs.includes("target.local/fetch?url=")) {
                            if (curlArgs.includes("127.0.0.1/admin/internal_status")) {
                                term.writeln("<h1>Internal Dashboard</h1><p>Status: All systems go.</p>\nFLAG{ssrf_internal_breach}");
                            } else if (curlArgs.includes("127.0.0.1") || curlArgs.includes("localhost")) {
                                term.writeln("Welcome to AstraNova Internal Portal.\n[Services]: /admin/internal_status, /config/view");
                            } else {
                                term.writeln("Fetching remote content... Error: Timeout.");
                            }
                        }
                        else if (curlArgs.trim() === "") {
                            term.writeln("curl: try 'curl --help' for more information");
                        } else {
                            term.writeln(`curl: (7) Failed to connect to ${url} port 80: Connection refused`);
                        }
                        break;

                    case 'unzip':
                        const fileToUnzip = args[0];
                        const fullUnzipPath = resolvePath(fileToUnzip);
                        if (fileToUnzip === "backup.zip" && currentFs[fullUnzipPath]) {
                            term.writeln("Archive:  backup.zip");
                            term.writeln("  extracting: config.php");
                            term.writeln("  extracting: database.sql");
                            term.writeln("  extracting: README.txt");
                            const baseDir = currentPwd === "/" ? "/" : currentPwd + "/";
                            setFs(prev => ({
                                ...prev,
                                [baseDir + "config.php"]: {
                                    type: 'file', owner: 'chakra', permissions: '-rw-r--r--',
                                    content: "<?php\n$db_host = \"localhost\";\n$db_user = \"astranova_admin\";\n$db_pass = \"Sup3rS3cretP@ss\";\n$db_name = \"astranova_db\";\n\n$hidden_admin_path = \"/admin/\";\n$flag = \"FLAG{backup_exposure_mastered}\";\n?>"
                                },
                                [baseDir + "database.sql"]: {
                                    type: 'file', owner: 'chakra', permissions: '-rw-r--r--',
                                    content: "-- AstraNova SQL Dump\nSET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n-- (Fake SQL content...)"
                                },
                                [baseDir + "README.txt"]: {
                                    type: 'file', owner: 'chakra', permissions: '-rw-r--r--',
                                    content: "TODO:\n- Remove backup before deployment\n- Change production password\n- Hide admin panel before go-live"
                                }
                            }));
                        } else {
                            term.writeln(`unzip: cannot find or open ${fileToUnzip || ""}`);
                        }
                        break;

                    case 'gobuster':
                        if (args.includes("-u") && args.includes("http://target.local")) {
                            term.writeln("===============================================================");
                            term.writeln("Gobuster v3.1.0");
                            term.writeln("by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)");
                            term.writeln("===============================================================");
                            term.writeln("[+] Url:                     http://target.local");
                            term.writeln("[+] Method:                  GET");
                            term.writeln("[+] Threads:                 10");
                            term.writeln("[+] Wordlist:                /usr/share/wordlists/dirb/common.txt");
                            term.writeln("===============================================================");
                            term.writeln("/index.php            (Status: 200) [Size: 1532]");
                            term.writeln("/admin                (Status: 301) [Size: 312]");
                            term.writeln("/api                  (Status: 301) [Size: 184]");
                            term.writeln("/assets               (Status: 301) [Size: 314]");
                            term.writeln("/backup.zip           (Status: 200) [Size: 2453210]");
                            term.writeln("/contact.php          (Status: 200) [Size: 2105]");
                            term.writeln("/fetch.php            (Status: 200) [Size: 1842]");
                            term.writeln("/login.php            (Status: 200) [Size: 1564]");
                            term.writeln("/robots.txt           (Status: 200) [Size: 54]");
                            term.writeln("===============================================================");
                            term.writeln("Finished");
                        } else {
                            term.writeln("Error: the following required arguments were not provided:\n  -u <url>");
                        }
                        break;

                    case 'nano':
                        if (args[0]) {
                            const fileToEdit = resolvePath(args[0]);
                            if (currentFs[fileToEdit] && currentFs[fileToEdit].type === 'file') {
                                term.clear();
                                term.writeln(`\x1b[47;30m  GNU nano 4.8                ${args[0]}                               \x1b[0m`);
                                term.writeln("");
                                term.writeln(currentFs[fileToEdit].content);
                                // Fill blank lines to push footer down
                                for (let i = 0; i < 15; i++) term.writeln("");
                                term.writeln(`\x1b[47;30m^G Get Help  ^O Write Out ^W Where Is  ^K Cut Text  ^J Justify    ^C Cur Pos \x1b[0m`);
                                term.writeln(`\x1b[47;30m^X Exit      ^R Read File ^\\ Replace  ^U Uncut Text^T To Spell   ^_ Go To Line\x1b[0m`);
                                setIsNanoMode(true);
                            } else {
                                term.writeln(`nano: ${args[0]}: No such file or directory`);
                            }
                        } else {
                            term.writeln("nano: missing file operand");
                        }
                        break;

                    case 'strings':
                        const sPath = resolvePath(args[0]);
                        if (currentFs[sPath] && currentFs[sPath].type === 'file') {
                            term.writeln(currentFs[sPath].content);
                        } else {
                            term.writeln(`strings: '${args[0] || ""}': No such file`);
                        }
                        break;

                    case 'base64':
                        if (args.includes("-d")) {
                            // Very simple simulation for the specific challenge payload
                            if (cmdLine.includes("U0VDUkVUX0tFWV9YT1IxMjM=")) {
                                term.writeln("FLAG{192.168.1.23_cdn-security-update.com_SECRET_KEY_XOR123}");
                            } else {
                                term.writeln("Error: Invalid base64 sequence.");
                            }
                        } else {
                            term.writeln("Usage: base64 [-d] [file]");
                        }
                        break;

                    case 'nmap':
                        const target = args[0] || "127.0.0.1";
                        term.writeln(`Starting Nmap 7.80 at ${new Date().toLocaleTimeString()}`);
                        term.writeln(`Nmap scan report for ${target}`);
                        term.writeln("Host is up (0.0021s latency).");
                        term.writeln("Not shown: 997 closed ports");
                        term.writeln("PORT     STATE SERVICE");
                        term.writeln("22/tcp   open  ssh");
                        term.writeln("80/tcp   open  http");
                        term.writeln("443/tcp  open  https");
                        term.writeln("\nNmap done: 1 IP address (1 host up) scanned in 0.42 seconds");
                        break;

                    default:
                        term.writeln(`-bash: ${cmd}: command not found`);
                }
            };

            basicCommands.forEach(executeOne);
            renderSinglePrompt(stateRef.current.pwd);
        };

        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        return () => {
            term.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, [challenge_title, onExit]);

    return (
        <div style={{ position: "relative", height: "100%", width: "100%", overflow: "hidden" }}>
            <div
                ref={terminalRef}
                style={{
                    height: "100%",
                    width: "100%",
                    background: "#0d0d0d",
                    padding: "10px"
                }}
            />
        </div>
    );
};

export default FakeTerminal;
