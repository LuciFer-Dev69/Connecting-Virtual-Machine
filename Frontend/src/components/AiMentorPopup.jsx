import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Info } from 'lucide-react';
import { API_BASE } from '../config';

const AiMentorPopup = ({ command }) => {
    const [explanation, setExplanation] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!command) return;

        const fetchExplanation = async () => {
            setLoading(true);
            setIsVisible(true);
            setExplanation(""); // Clear previous

            try {
                const response = await fetch(`${API_BASE}/ai/mentor/explain-command`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ command: command }) // Send the full command for better context
                });
                const data = await response.json();

                if (data.explanation) {
                    // Simple typing effect simulation
                    setExplanation(data.explanation);
                }
            } catch (error) {
                console.error("AI Mentor Error:", error);
            } finally {
                setLoading(false);
            }

            // Auto-hide after 10 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 8000);

            return () => clearTimeout(timer);
        };

        fetchExplanation();
    }, [command]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    style={{
                        background: 'rgba(17, 24, 39, 0.4)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        marginTop: '16px',
                        width: '100%'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(16, 185, 129, 0.1)',
                        paddingBottom: '8px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                borderRadius: '6px',
                                padding: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Cpu size={14} className="text-[#10B981]" />
                            </div>
                            <span style={{
                                fontSize: '10px',
                                fontWeight: '900',
                                color: '#10B981',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase'
                            }}>
                                AI Mentor / {command?.split(' ')[0]}
                            </span>
                        </div>
                        {loading && (
                            <motion.div
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#10B981' }}
                            />
                        )}
                        <Zap size={12} color="#10B981" style={{ opacity: 0.5 }} />
                    </div>

                    <p style={{
                        fontSize: '13px',
                        color: '#F9FAFB',
                        lineHeight: '1.5',
                        margin: 0,
                        fontFamily: 'Inter, sans-serif'
                    }}>
                        {loading ? "Analyzing command signature..." : explanation}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AiMentorPopup;
