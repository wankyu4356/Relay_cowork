import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { FadeIn, Stagger, CountUp } from './ui/motion';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Video,
  User,
  Edit,
  Trash2
} from 'lucide-react';
import * as api from './api';

interface MentorScheduleProps {
  onBack: () => void;
}

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  session?: {
    mentee: string;
    avatar: string;
    topic: string;
  };
}

const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];
const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

// Mock schedule data
const mockSchedule: TimeSlot[] = [
  {
    id: '1',
    day: '월',
    startTime: '14:00',
    endTime: '15:00',
    isAvailable: false,
    session: {
      mentee: '러너 B',
      avatar: '👨‍🎓',
      topic: '학업계획서 첨삭',
    },
  },
  {
    id: '2',
    day: '월',
    startTime: '16:00',
    endTime: '17:00',
    isAvailable: true,
  },
  {
    id: '3',
    day: '화',
    startTime: '10:00',
    endTime: '11:00',
    isAvailable: false,
    session: {
      mentee: '러너 C',
      avatar: '👩‍💼',
      topic: '면접 준비',
    },
  },
  {
    id: '4',
    day: '수',
    startTime: '15:00',
    endTime: '16:00',
    isAvailable: true,
  },
  {
    id: '5',
    day: '목',
    startTime: '19:00',
    endTime: '20:00',
    isAvailable: true,
  },
  {
    id: '6',
    day: '금',
    startTime: '14:00',
    endTime: '15:00',
    isAvailable: false,
    session: {
      mentee: '러너 D',
      avatar: '👨‍💼',
      topic: '자기소개서 검토',
    },
  },
  {
    id: '7',
    day: '토',
    startTime: '10:00',
    endTime: '12:00',
    isAvailable: true,
  },
];

export function MentorSchedule({ onBack }: MentorScheduleProps) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [schedule, setSchedule] = useState<TimeSlot[]>(mockSchedule);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const res = await api.getMentorSchedule('me');
        if (res.schedules?.length > 0) {
          interface ApiScheduleSlot {
            id?: string;
            dayOfWeek?: number;
            day?: string;
            startTime?: string;
            start_time?: string;
            endTime?: string;
            end_time?: string;
            available?: boolean;
            session?: {
              mentee: string;
              avatar?: string;
              topic?: string;
            };
          }
          setSchedule((res.schedules as ApiScheduleSlot[]).map((s, idx: number) => ({
            id: s.id || `api-${idx}`,
            day: daysOfWeek[s.dayOfWeek ?? 0] || s.day || '월',
            startTime: s.startTime || s.start_time || '',
            endTime: s.endTime || s.end_time || '',
            isAvailable: s.available !== false,
            session: s.session ? {
              mentee: s.session.mentee,
              avatar: s.session.avatar || '👤',
              topic: s.session.topic || '',
            } : undefined,
          })));
        }
      } catch {
        // keep mock data on failure
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const getScheduleForDay = (day: string) => {
    return schedule.filter(slot => slot.day === day);
  };

  const toggleSlotSelection = (day: string, time: string) => {
    const slotKey = `${day}-${time}`;
    if (selectedSlots.includes(slotKey)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slotKey));
    } else {
      setSelectedSlots([...selectedSlots, slotKey]);
    }
  };

  const isSlotSelected = (day: string, time: string) => {
    return selectedSlots.includes(`${day}-${time}`);
  };

  const getSlotData = (day: string, time: string) => {
    return schedule.find(
      slot => slot.day === day && slot.startTime === time
    );
  };

  const handleConfirmSelection = async () => {
    // Add selected slots to schedule as available
    const newSlots = selectedSlots.map((slotKey, index) => {
      const [day, time] = slotKey.split('-');
      return {
        id: `new-${Date.now()}-${index}`,
        day,
        startTime: time,
        endTime: `${parseInt(time.split(':')[0]) + 1}:00`,
        isAvailable: true,
      };
    });

    const updatedSchedule = [...schedule, ...newSlots];
    setSchedule(updatedSchedule);
    setSelectedSlots([]);

    // Save to backend
    setSaving(true);
    try {
      await api.updateMentorSchedule(updatedSchedule.map(s => ({
        dayOfWeek: daysOfWeek.indexOf(s.day),
        startTime: s.startTime,
        endTime: s.endTime,
        available: s.isAvailable,
      })));
    } catch {
      // Local state already updated, silent fail
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200/80 sticky top-0 z-10">
        <div className="container-web py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">일정 관리</h1>
                <p className="text-sm text-zinc-600">릴레이 가능 시간을 설정하세요</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('week')}
                className="rounded-xl"
              >
                주간뷰
              </Button>
              <Button
                variant={viewMode === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('day')}
                className="rounded-xl"
              >
                일간뷰
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-web py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* This Week's Sessions Summary */}
          <FadeIn>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-zinc-900 mb-1">이번 주 세션</h2>
                <p className="text-sm text-zinc-600">2월 17일 - 2월 23일</p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-iris-600 text-white">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  예약 3건
                </Badge>
                <Badge className="bg-zinc-700 text-white">
                  <Check className="w-3 h-3 mr-1" />
                  가능 7건
                </Badge>
              </div>
            </div>

            {/* Session Cards */}
            <Stagger className="grid md:grid-cols-3 gap-4">
              {schedule.filter(slot => slot.session).map((slot) => (
                <Stagger.Item key={slot.id}>
                  <Card className="p-4 border-zinc-200/80 bg-zinc-50">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-3xl">{slot.session!.avatar}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-zinc-900">{slot.session!.mentee}</div>
                        <div className="text-xs text-zinc-600">{slot.session!.topic}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-700">
                      <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg">
                        <CalendarIcon className="w-3 h-3 text-iris-600" />
                        <span className="font-medium">{slot.day}요일</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span className="font-medium tnum">{slot.startTime}</span>
                      </div>
                    </div>
                  </Card>
                </Stagger.Item>
              ))}
            </Stagger>
          </Card>
          </FadeIn>

          {/* Calendar Navigation */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentWeek(currentWeek - 1)}
                  className="rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="text-center">
                  <div className="text-2xl font-semibold tracking-tight text-zinc-900">2025년 2월</div>
                  <div className="text-sm text-zinc-600">
                    2월 17일 - 2월 23일 (이번 주)
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentWeek(currentWeek + 1)}
                  className="rounded-xl"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                가능 시간 추가
              </Button>
            </div>

            {/* Quick Stats */}
            <Stagger className="grid md:grid-cols-4 gap-4 mb-6">
              <Stagger.Item className="bg-zinc-50 rounded-xl p-4 border border-zinc-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-iris-600 rounded-lg flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold tracking-tight text-zinc-900"><CountUp value={7} /></div>
                    <div className="text-xs text-zinc-600">가능 시간</div>
                  </div>
                </div>
              </Stagger.Item>

              <Stagger.Item className="bg-zinc-50 rounded-xl p-4 border border-zinc-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-iris-600 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold tracking-tight text-zinc-900"><CountUp value={3} /></div>
                    <div className="text-xs text-zinc-600">예약 세션</div>
                  </div>
                </div>
              </Stagger.Item>

              <Stagger.Item className="bg-zinc-50 rounded-xl p-4 border border-zinc-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold tracking-tight text-zinc-900"><CountUp value={4} /></div>
                    <div className="text-xs text-zinc-600">대기중</div>
                  </div>
                </div>
              </Stagger.Item>

              <Stagger.Item className="bg-zinc-50 rounded-xl p-4 border border-zinc-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold tracking-tight text-zinc-900 tnum">5h</div>
                    <div className="text-xs text-zinc-600">이번 주</div>
                  </div>
                </div>
              </Stagger.Item>
            </Stagger>

            {/* Weekly Timetable */}
            {viewMode === 'week' && (
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header - Days */}
                  <div className="grid grid-cols-8 gap-2 mb-2">
                    <div className="text-sm font-semibold text-zinc-600 text-center py-2">
                      시간
                    </div>
                    {daysOfWeek.map((day, index) => (
                      <motion.div
                        key={day}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`text-center py-3 rounded-xl font-semibold ${
                          day === '월' || day === '화' || day === '수'
                            ? 'bg-iris-50 text-iris-700'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        <div className="text-xs text-zinc-500 mb-1 tnum">
                          2/{17 + index}
                        </div>
                        <div className="text-lg">{day}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Time Grid */}
                  <div className="space-y-1">
                    {timeSlots.map((time, timeIndex) => (
                      <motion.div
                        key={time}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: timeIndex * 0.02 }}
                        className="grid grid-cols-8 gap-2"
                      >
                        {/* Time Label */}
                        <div className="text-sm font-medium text-zinc-600 text-center py-4 flex items-center justify-center tnum">
                          {time}
                        </div>

                        {/* Day Cells */}
                        {daysOfWeek.map((day) => {
                          const slotData = getSlotData(day, time);
                          const isSelected = isSlotSelected(day, time);

                          return (
                            <div
                              key={`${day}-${time}`}
                              onClick={() => !slotData?.session && toggleSlotSelection(day, time)}
                              className={`rounded-lg border transition-all cursor-pointer min-h-[80px] p-2 ${
                                slotData?.session
                                  ? 'bg-iris-50 border-iris-200 cursor-default'
                                  : slotData?.isAvailable
                                  ? 'bg-zinc-50 border-zinc-200/80 hover:bg-zinc-100'
                                  : isSelected
                                  ? 'bg-iris-100 border-iris-400 shadow-sm'
                                  : 'bg-white border-zinc-200/80 hover:border-iris-300 hover:bg-iris-50'
                              }`}
                            >
                              {slotData?.session ? (
                                <motion.div
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="h-full flex flex-col justify-between"
                                >
                                  <div>
                                    <Badge className="bg-iris-600 text-white border-0 text-xs mb-1">
                                      예약
                                    </Badge>
                                    <div className="text-xs font-semibold text-zinc-900 mb-1">
                                      {slotData.session.mentee}
                                    </div>
                                    <div className="text-xs text-zinc-600 line-clamp-2">
                                      {slotData.session.topic}
                                    </div>
                                  </div>
                                  <div className="text-lg">{slotData.session.avatar}</div>
                                </motion.div>
                              ) : slotData?.isAvailable ? (
                                <div className="h-full flex flex-col justify-between">
                                  <Badge className="bg-zinc-700 text-white border-0 text-xs w-fit">
                                    가능
                                  </Badge>
                                  <div className="flex gap-1 justify-end">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      <Trash2 className="w-3 h-3 text-red-500" />
                                    </Button>
                                  </div>
                                </div>
                              ) : isSelected ? (
                                <div className="h-full flex items-center justify-center">
                                  <Check className="w-5 h-5 text-iris-600" />
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Day View */}
            {viewMode === 'day' && (
              <div className="space-y-3">
                {daysOfWeek.map((day, dayIndex) => {
                  const daySlots = getScheduleForDay(day);

                  return (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: dayIndex * 0.1 }}
                    >
                      <Card className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="text-center flex-shrink-0">
                            <div className="w-16 h-16 bg-iris-100 rounded-2xl flex items-center justify-center text-iris-700 font-semibold text-xl mb-2">
                              {day}
                            </div>
                            <div className="text-xs text-zinc-500 tnum">2/{17 + dayIndex}</div>
                          </div>

                          <div className="flex-1">
                            {daySlots.length > 0 ? (
                              <div className="space-y-2">
                                {daySlots.map((slot) => (
                                  <div
                                    key={slot.id}
                                    className={`p-3 rounded-xl border ${
                                      slot.session
                                        ? 'bg-iris-50 border-iris-200'
                                        : 'bg-zinc-50 border-zinc-200/80'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-zinc-500" />
                                        <span className="font-semibold text-zinc-900 tnum">
                                          {slot.startTime} - {slot.endTime}
                                        </span>
                                        {slot.session ? (
                                          <Badge className="bg-iris-600 text-white border-0">
                                            예약: {slot.session.mentee}
                                          </Badge>
                                        ) : (
                                          <Badge className="bg-zinc-700 text-white border-0">
                                            가능
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex gap-1">
                                        {!slot.session && (
                                          <>
                                            <Button variant="ghost" size="sm">
                                              <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                              <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    {slot.session && (
                                      <div className="mt-2 ml-7 text-sm text-zinc-700">
                                        {slot.session.topic}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-zinc-400">
                                설정된 일정이 없습니다
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Legend */}
          <Card className="p-4 bg-zinc-50">
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-zinc-50 border border-zinc-200/80 rounded" />
                <span className="text-zinc-700">가능 시간</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-iris-50 border border-iris-200 rounded" />
                <span className="text-zinc-700">예약 세션</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-iris-100 border border-iris-400 rounded" />
                <span className="text-zinc-700">선택됨</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white border border-zinc-200/80 rounded" />
                <span className="text-zinc-700">비어있음</span>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          {selectedSlots.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20"
            >
              <Card className="p-4 shadow-lg bg-zinc-900 text-white">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <strong>{selectedSlots.length}개</strong> 시간대 선택됨
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSlots([])}
                      className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                    >
                      <X className="w-4 h-4 mr-2" />
                      취소
                    </Button>
                    <Button
                      size="sm"
                      className="bg-white text-zinc-900 hover:bg-zinc-100"
                      onClick={handleConfirmSelection}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      가능 시간으로 등록
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}