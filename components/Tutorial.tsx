
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';

interface Step {
    targetId: string;
    title: string;
    content: string;
}

interface TutorialProps {
    steps: Step[];
    onClose: () => void;
    pageKey: string; // Unique key to store "seen" state in localStorage
}

const Tutorial: React.FC<TutorialProps> = ({ steps, onClose, pageKey }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        // Check if seen
        const seen = localStorage.getItem(`tutorial_seen_${pageKey}`);
        if (seen) {
            onClose();
            return;
        }

        const updatePosition = () => {
            const el = document.getElementById(steps[currentStep].targetId);
            if (el) {
                setTargetRect(el.getBoundingClientRect());
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        // Delay slightly to ensure render
        const timer = setTimeout(updatePosition, 500);
        window.addEventListener('resize', updatePosition);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updatePosition);
        };
    }, [currentStep, steps, pageKey, onClose]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        localStorage.setItem(`tutorial_seen_${pageKey}`, 'true');
        onClose();
    };

    if (!targetRect) return null;

    return (
        <div className="fixed inset-0 z-[200] overflow-hidden">
            {/* Dark Backdrop with "hole" */}
            <div className="absolute inset-0 bg-black/80 mix-blend-hard-light pointer-events-none"></div>
            
            {/* Spotlight Hole using Box Shadow hack for simplicity or SVG clip-path for complexity. 
                Here we use a simpler approach: strict overlay with z-index manipulation if possible, 
                or just an absolute positioned clear box with huge borders. */}
            <div 
                className="absolute transition-all duration-500 ease-in-out border-[1000px] border-black/70 rounded-xl pointer-events-none"
                style={{
                    top: targetRect.top - 1000 - 10,
                    left: targetRect.left - 1000 - 10,
                    width: targetRect.width + 20,
                    height: targetRect.height + 20,
                }}
            ></div>

            {/* Glowing Border around target */}
            <div 
                className="absolute border-2 border-royalGold rounded-xl animate-pulse shadow-[0_0_30px_rgba(240,185,11,0.5)] transition-all duration-500 pointer-events-none"
                style={{
                    top: targetRect.top - 10,
                    left: targetRect.left - 10,
                    width: targetRect.width + 20,
                    height: targetRect.height + 20,
                }}
            ></div>

            {/* Tooltip Card - Responsive positioning & Scroll */}
            <div 
                className="absolute z-[210] max-w-sm w-full transition-all duration-500 flex flex-col justify-center"
                style={{
                    top: window.innerWidth < 768 ? '50%' : targetRect.bottom + 20,
                    left: window.innerWidth < 768 ? '50%' : Math.max(20, Math.min(window.innerWidth - 340, targetRect.left)),
                    transform: window.innerWidth < 768 ? 'translate(-50%, -50%)' : 'none',
                    maxHeight: '80vh'
                }}
            >
                <div className="glass-panel p-6 rounded-2xl border border-royalGold/30 relative shadow-2xl animate-slide-up bg-[#000810] overflow-y-auto max-h-[60vh]">
                    <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                        <X size={16} />
                    </button>
                    
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-royalGold text-royalBlue text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                            {currentStep + 1}
                        </span>
                        <h4 className="font-bold text-white text-lg">{steps[currentStep].title}</h4>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        {steps[currentStep].content}
                    </p>
                    
                    <div className="flex justify-between items-center sticky bottom-0 bg-[#000810]/95 backdrop-blur py-2 border-t border-white/5">
                        <div className="flex gap-1">
                            {steps.map((_, i) => (
                                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === currentStep ? 'bg-royalGold' : 'bg-white/10'}`}></div>
                            ))}
                        </div>
                        <button 
                            onClick={handleNext}
                            className="bg-royalGold hover:bg-yellow-500 text-royalBlue px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                        >
                            {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'} 
                            {currentStep === steps.length - 1 ? <Check size={14} /> : <ArrowRight size={14} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tutorial;
