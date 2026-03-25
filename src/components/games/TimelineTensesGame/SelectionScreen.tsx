'use client';

import { motion } from 'framer-motion';
import { BookOpen, Trophy, Target, Sparkles, Clock, Zap, Layers, RotateCcw, CheckCircle, Star, ChevronRight } from 'lucide-react';
import type { TenseCategory, SentenceForm, TimelineTensesQuestion } from '@/types/activity';
import type { TimelinePracticeMode } from './timelineTensesUtils';
import { filterTimelineQuestions } from './timelineTensesUtils';
import type { CategoryProgress } from './hooks/useTimelineTensesState';

interface SelectionScreenProps {
  state: {
    selectedCategory: TenseCategory | 'all';
    selectedPracticeMode: TimelinePracticeMode;
    selectedSentenceForm: SentenceForm | 'all';
    categoryProgress: Record<string, CategoryProgress>;
    questionBank: TimelineTensesQuestion[];
  };
  onSelectCategory: (category: TenseCategory | 'all') => void;
  onSelectPracticeMode: (mode: TimelinePracticeMode) => void;
  onSelectSentenceForm: (form: SentenceForm | 'all') => void;
  onStartRound: () => void;
  onResetProgress: () => void;
}

const CATEGORY_CONFIG: Array<{
  id: TenseCategory;
  label: string;
  subtitle: string;
  icon: string;
  description: string;
  color: string;
  section: 'base' | 'advanced' | 'mastery';
}> = [
  {
    id: 'simple',
    label: 'Simple Tenses',
    subtitle: 'Base Layer',
    icon: '⚡',
    description: 'Past, Present, and Future Simple moments',
    color: 'blue',
    section: 'base',
  },
  {
    id: 'continuous',
    label: 'Continuous Tenses',
    subtitle: 'Flowing Actions',
    icon: '⏳',
    description: 'Actions in progress across time',
    color: 'green',
    section: 'base',
  },
  {
    id: 'perfect',
    label: 'Perfect Tenses',
    subtitle: 'Connections',
    icon: '🔗',
    description: 'Completed actions with current links',
    color: 'purple',
    section: 'advanced',
  },
  {
    id: 'perfect-continuous',
    label: 'Perfect Continuous',
    subtitle: 'Ongoing Records',
    icon: '🔄',
    description: 'Duration leading up to a point',
    color: 'amber',
    section: 'advanced',
  },
  {
    id: 'mixed',
    label: 'Mixed Mastery',
    subtitle: 'Real Context',
    icon: '🎛️',
    description: 'Sentences with multiple related events',
    color: 'rose',
    section: 'mastery',
  },
];

export function SelectionScreen({
  state,
  onSelectCategory,
  onSelectPracticeMode,
  onSelectSentenceForm,
  onStartRound,
  onResetProgress,
}: SelectionScreenProps) {
  const { selectedCategory, selectedPracticeMode, selectedSentenceForm, categoryProgress, questionBank } = state;

  const summary = {
    completed: Object.values(categoryProgress).filter(p => p.completed).length,
    total: CATEGORY_CONFIG.length,
    mastered: Object.values(categoryProgress).filter(p => p.level >= 3).length,
    overallProgress: Math.round((Object.values(categoryProgress).filter(p => p.completed).length / CATEGORY_CONFIG.length) * 100) || 0,
  };

  const availableQuestionCount = filterTimelineQuestions(
    questionBank,
    selectedCategory,
    selectedPracticeMode,
    selectedSentenceForm
  ).length;

  const sentenceForms: Array<{ id: SentenceForm | 'all', label: string }> = [
    { id: 'all', label: 'Any' },
    { id: 'affirmative', label: 'Affirmative' },
    { id: 'negative', label: 'Negative' },
    { id: 'question', label: 'Questions' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="text-center pt-4"
      >
        <div className="flex justify-between items-start mb-4">
            <div className="w-11" /> {/* Spacer */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-primary-dark"
            >
                <BookOpen size={18} />
                <span className="text-sm font-semibold tracking-wide uppercase">Tense Visualization</span>
            </motion.div>
            <div className="w-11" /> {/* Right spacer to maintain center alignment */}
        </div>

        <h1 className="font-display text-4xl sm:text-5xl text-text mb-2 tracking-tight">
          Timeline Game
        </h1>
        <p className="text-text-muted text-base max-w-xl mx-auto mb-6">
          Become a <span className="font-semibold text-primary">Time Traveler</span> of grammar!
        </p>

        {/* Visual Mastery Path */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-xl mx-auto mb-10 overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 rounded-3xl bg-white/50 dark:bg-[#162b3d]/50 border border-border/40 shadow-sm relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-20 -translate-y-1/2 -z-10" />

            {/* Stage 1: Interpret */}
            <div className="flex flex-col items-center gap-1 group">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Clock size={18} />
                </div>
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Interpret</div>
                <div className="text-[9px] text-text-muted/60 opacity-0 group-hover:opacity-100 transition-opacity">Timeline → Verb</div>
            </div>

            <ChevronRight className="text-border/40" size={16} />

            {/* Stage 2: Visualize */}
            <div className="flex flex-col items-center gap-1 group">
                <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <Zap size={18} />
                </div>
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Visualize</div>
                <div className="text-[9px] text-text-muted/60 opacity-0 group-hover:opacity-100 transition-opacity">Sentence → Timeline</div>
            </div>

            <ChevronRight className="text-border/40" size={16} />

            {/* Stage 3: Master */}
            <div className="flex flex-col items-center gap-1 group">
                <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-primary-dark group-hover:scale-110 transition-transform">
                    <Trophy size={18} />
                </div>
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Master</div>
                <div className="text-[9px] text-text-muted/60 opacity-0 group-hover:opacity-100 transition-opacity">Real Records</div>
            </div>
          </div>
        </motion.div>

        {/* Stats Dashboard */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-3 gap-3 sm:gap-4 mb-6"
        >
            <StatsCard icon={<Target size={20} />} value={`${summary.completed}/${summary.total}`} label="Patterns" color="primary" delay={0.25} />
            <StatsCard icon={<Star size={20} />} value={`${summary.mastered}/${summary.total}`} label="Mastered" color="secondary" delay={0.3} />
            <StatsCard icon={<Trophy size={20} />} value={`${summary.overallProgress}%`} label="Complete" color="accent" delay={0.35} />
        </motion.div>

        {/* Progress Bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="relative mb-12">
            <div className="h-3 bg-bg-gray rounded-full overflow-hidden shadow-inner">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${summary.overallProgress}%` }}
                    transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
                    className="h-full rounded-full relative overflow-hidden"
                    style={{ background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-accent) 100%)' }}
                >
                    <motion.div
                        className="absolute inset-0 w-full h-full"
                        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)' }}
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1.5 }}
                    />
                </motion.div>
            </div>
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-1 pointer-events-none">
                {[0, 20, 40, 60, 80, 100].map(milestone => (
                    <motion.div
                        key={milestone}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 + milestone * 0.005 }}
                        className={`w-2 h-2 rounded-full transition-colors ${summary.overallProgress >= milestone ? 'bg-white shadow-sm' : 'bg-border/60'}`}
                    />
                ))}
            </div>
        </motion.div>

        {/* Training Console */}
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto bg-white/50 dark:bg-[#162b3d]/50 backdrop-blur-sm p-6 rounded-[2rem] border border-border dark:border-white/5 shadow-inner mb-12"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Interaction Style */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1 text-text-muted">
                        <Zap size={14} className="text-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest">Interaction Style</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {[
                            { id: 'read-the-timeline', label: 'Interpret', icon: <Clock size={16} />, desc: 'Timeline → Verb' },
                            { id: 'build-the-timeline', label: 'Visualize', icon: <Sparkles size={16} />, desc: 'Sentence → Timeline' },
                            { id: 'mixed-practice', label: 'Survivor', icon: <Layers size={16} />, desc: 'Random Mix' }
                        ].map(mode => (
                            <button
                                key={mode.id}
                                onClick={() => onSelectPracticeMode(mode.id as TimelinePracticeMode)}
                                className={`group flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                                    selectedPracticeMode === mode.id
                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-white/50 dark:bg-[#162b3d]/50 border-border/40 text-text-muted hover:border-primary/40'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        selectedPracticeMode === mode.id ? 'bg-white/20' : 'bg-bg-gray text-text-muted'
                                    }`}>
                                        {mode.icon}
                                    </div>
                                    <div className="text-left">
                                        <div className="font-display font-bold text-sm leading-tight">{mode.label}</div>
                                        <div className={`text-[10px] ${selectedPracticeMode === mode.id ? 'text-white/80' : 'text-text-muted'}`}>
                                            {mode.desc}
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${selectedPracticeMode === mode.id ? 'text-white' : ''}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Vertical Divider for MD+ */}
                <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-px bg-border/20 -translate-x-1/2" />

                {/* Sentence Form */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1 text-text-muted">
                        <Layers size={14} className="text-secondary" />
                        <span className="text-xs font-bold uppercase tracking-widest">Sentence Form</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {sentenceForms.map(form => (
                            <button
                                key={form.id}
                                onClick={() => onSelectSentenceForm(form.id)}
                                className={`p-4 rounded-xl border-2 transition-all text-center leading-none ${
                                    selectedSentenceForm === form.id
                                        ? 'bg-secondary border-secondary text-white shadow-lg shadow-secondary/20'
                                        : 'bg-white/50 dark:bg-[#162b3d]/50 border-border/40 text-text-muted hover:border-secondary/40'
                                }`}
                            >
                                <div className="font-display font-bold text-sm">{form.label}</div>
                                <div className={`text-[10px] mt-1 ${selectedSentenceForm === form.id ? 'text-white/80' : 'text-text-muted'}`}>
                                    {form.id === 'all' ? 'Any' : form.id === 'question' ? '?' : '+/-'}
                                </div>
                            </button>
                        ))}
                    </div>
                    
                    <div className="pt-2 px-1">
                        <p className="text-[10px] text-text-muted leading-relaxed">
                            <span className="font-semibold text-secondary">Tip:</span> Mixed practice with questions provides the most realistic challenge.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
      </motion.header>

      {/* Sections */}
      <div className="space-y-12">
        <TenseSection
          title="Tense Journey: Chapter 1"
          subtitle="Foundational aspects and discrete moments"
          items={CATEGORY_CONFIG.filter(c => c.section === 'base')}
          selectedId={selectedCategory}
          progress={categoryProgress}
          onSelect={onSelectCategory}
          delay={0.5}
        />
        
        <TenseSection
          title="Tense Journey: Chapter 2"
          subtitle="Flowing connections and perfect states"
          items={CATEGORY_CONFIG.filter(c => c.section === 'advanced')}
          selectedId={selectedCategory}
          progress={categoryProgress}
          onSelect={onSelectCategory}
          delay={0.6}
        />

        <TenseSection
          title="Mastery: The Final Frontier"
          subtitle="Real-world context with mixed tenses"
          items={CATEGORY_CONFIG.filter(c => c.section === 'mastery')}
          selectedId={selectedCategory}
          progress={categoryProgress}
          onSelect={onSelectCategory}
          delay={0.7}
        />
      </div>

      {/* Start Action */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <div className="pointer-events-auto bg-white/80 dark:bg-[#162b3d]/80 backdrop-blur-md p-4 rounded-3xl border border-border shadow-2xl flex items-center gap-6 max-w-2xl w-full">
            <div className="flex-1">
                <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Current Filter</div>
                <div className="font-display text-base text-text flex items-center gap-2">
                    <span className="font-bold text-primary">
                        {CATEGORY_CONFIG.find(c => c.id === selectedCategory)?.label || 'All Tenses'}
                    </span>
                    <span className="text-border">|</span>
                    <span className="text-text-muted">
                        {selectedSentenceForm === 'all' ? 'Any Form' : selectedSentenceForm}
                    </span>
                </div>
            </div>

            <button
                onClick={onStartRound}
                disabled={availableQuestionCount === 0}
                className="group px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
                Start Training
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </motion.div>

      {/* Utilities */}
      <div className="flex justify-center pt-8 opacity-40 hover:opacity-100 transition-opacity">
          <button
            onClick={onResetProgress}
            className="flex items-center gap-2 text-xs font-medium text-text-muted hover:text-error transition-colors"
          >
            <RotateCcw size={14} />
            Reset Learning Data
          </button>
      </div>
    </div>
  );
}

function StatsCard({ icon, value, label, color, delay }: {
  icon: React.ReactNode; value: string; label: string;
  color: 'primary' | 'secondary' | 'accent'; delay: number;
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-[#3d6b47] dark:text-secondary border-secondary/20',
    accent: 'bg-accent/30 text-primary-dark border-accent/40',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`p-4 sm:p-5 rounded-2xl border text-center ${colorClasses[color]}`}
    >
      <div className="flex justify-center mb-2 opacity-80">{icon}</div>
      <div className="font-display text-2xl sm:text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs sm:text-sm opacity-70 font-medium">{label}</div>
    </motion.div>
  );
}

function TenseSection({ title, subtitle, items, selectedId, progress, onSelect, delay }: {
  title: string; subtitle: string; items: typeof CATEGORY_CONFIG;
  selectedId: TenseCategory | 'all'; progress: Record<string, CategoryProgress>;
  onSelect: (id: TenseCategory | 'all') => void; delay: number;
}) {
    const completedCount = items.filter(item => progress[item.id]?.completed).length;
    const allCompleted = completedCount === items.length;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 rounded-full bg-primary" />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h2 className="font-display text-xl sm:text-2xl text-text">{title}</h2>
                        {allCompleted && (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-secondary">
                                <Sparkles size={18} />
                            </motion.span>
                        )}
                    </div>
                    <p className="text-sm text-text-muted">{subtitle}</p>
                </div>
                <div className="text-sm text-text-muted font-medium">{completedCount}/{items.length}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {items.map((item, idx) => (
                    <TenseCard 
                        key={item.id}
                        item={item}
                        isSelected={selectedId === item.id}
                        progress={progress[item.id]}
                        onClick={() => onSelect(item.id === selectedId ? 'all' : item.id)}
                        delay={delay + idx * 0.08}
                    />
                ))}
            </div>
        </motion.section>
    );
}

function TenseCard({ item, isSelected, progress, onClick, delay }: {
    item: typeof CATEGORY_CONFIG[0]; isSelected: boolean;
    progress?: CategoryProgress; onClick: () => void; delay: number;
}) {
    const accuracy = progress?.accuracy ?? 0;
    const level = progress?.level ?? 0;
    const completed = progress?.completed ?? false;
    const mastered = level >= 3;

    return (
        <motion.button
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                isSelected 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : completed 
                        ? 'border-secondary/20 bg-secondary/5' 
                        : 'border-border bg-white dark:bg-[#162b3d] opacity-90'
            }`}
        >
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                    isSelected ? 'bg-primary text-white' : 'bg-bg-gray text-text-muted'
                }`}>
                    {item.icon}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                        <h3 className="font-display font-bold text-text truncate">{item.label}</h3>
                        {mastered && <Star size={14} className="text-accent fill-accent" />}
                        {completed && !mastered && <CheckCircle size={14} className="text-secondary" />}
                    </div>
                    <p className="text-xs text-text-muted line-clamp-1">{item.subtitle}</p>
                    
                    {progress && progress.attempts > 0 && (
                        <div className="mt-3 flex items-center justify-between">
                            <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                Lvl {level}
                            </div>
                            <span className="text-[10px] font-medium text-text-muted">
                                Best: {accuracy}%
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {progress && progress.attempts > 0 && (
                <div className="mt-3 h-1 bg-border/20 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${accuracy}%` }}
                        className={`h-full ${mastered ? 'bg-accent' : completed ? 'bg-secondary' : 'bg-primary'}`}
                    />
                </div>
            )}
        </motion.button>
    );
}
