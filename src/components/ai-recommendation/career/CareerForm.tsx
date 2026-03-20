import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { BookOpen, Target, Sparkles, ArrowRight, X } from 'lucide-react';
import { SKILL_SUGGESTIONS, type CareerFormData } from '../../../lib/recommendation-data/careerData';

interface CareerFormProps {
  onSubmit: (data: CareerFormData) => void;
}

export function CareerForm({ onSubmit }: CareerFormProps) {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [gpa, setGpa] = useState('');
  const [preferredIndustry, setPreferredIndustry] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [desiredSalaryMin, setDesiredSalaryMin] = useState(5000);
  const [desiredSalaryMax, setDesiredSalaryMax] = useState(7000);
  const [experiences, setExperiences] = useState('');
  const [goals, setGoals] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = SKILL_SUGGESTIONS.filter(
    (s) =>
      s.toLowerCase().includes(skillInput.toLowerCase()) &&
      !skills.includes(s)
  );

  const addSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setSkillInput('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = () => {
    onSubmit({
      skills,
      university: university || undefined,
      major: major || undefined,
      gpa: gpa || undefined,
      yearsOfExperience,
      desiredSalaryMin,
      desiredSalaryMax,
      preferredIndustry: preferredIndustry || undefined,
      experiences: experiences || undefined,
      goals: goals || undefined,
    });
  };

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container-web py-8 space-y-6"
    >
      {/* Skill Tag Multi-Select */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          보유 기술 스택
        </h3>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="px-3 py-1 text-sm flex items-center gap-1"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={skillInput}
              onChange={(e) => {
                setSkillInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="기술 스택을 검색하세요..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            {showSuggestions && skillInput && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => addSkill(suggestion)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-indigo-50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 2x2 Grid: University, Major, GPA, Preferred Industry */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          학력 및 희망 직무
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              출신 대학
            </label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="예: 서울대학교"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              전공
            </label>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="예: 컴퓨터공학"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              학점
            </label>
            <input
              type="text"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              placeholder="예: 3.8/4.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              희망 직무
            </label>
            <input
              type="text"
              value={preferredIndustry}
              onChange={(e) => setPreferredIndustry(e.target.value)}
              placeholder="예: 프론트엔드 개발"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Years of Experience */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          경력 연차
        </h3>
        <div>
          <input
            type="number"
            min={0}
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(Number(e.target.value))}
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            인턴 경험 포함, 신입은 0으로 입력해주세요
          </p>
        </div>
      </Card>

      {/* Desired Salary Range */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          희망 연봉 범위
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              최소 (만원)
            </label>
            <input
              type="number"
              value={desiredSalaryMin}
              onChange={(e) => setDesiredSalaryMin(Number(e.target.value))}
              placeholder="5000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
          <span className="text-gray-400 mt-6 text-lg font-medium">~</span>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              최대 (만원)
            </label>
            <input
              type="number"
              value={desiredSalaryMax}
              onChange={(e) => setDesiredSalaryMax(Number(e.target.value))}
              placeholder="7000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          예: 5000~7000 (연봉 5,000만원 ~ 7,000만원)
        </p>
      </Card>

      {/* Textareas */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          경험 및 목표
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              인턴/프로젝트 경험
            </label>
            <textarea
              value={experiences}
              onChange={(e) => setExperiences(e.target.value)}
              placeholder="주요 인턴십, 프로젝트, 대외활동 경험을 작성해주세요..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              커리어 목표
            </label>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="단기/장기 커리어 목표를 작성해주세요..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
            />
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <Button
        size="lg"
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 rounded-xl py-6 text-lg"
        onClick={handleSubmit}
        disabled={skills.length === 0}
      >
        AI 분석 시작하기
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </motion.div>
  );
}
