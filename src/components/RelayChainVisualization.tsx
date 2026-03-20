import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Zap,
  Users,
  ArrowRight,
  Award,
  BookOpen,
  Target,
  Info,
  Sparkles,
  ChevronDown,
  ChevronUp,
  GitBranch,
  Network,
  X,
  Calendar,
  MessageSquare,
  Star
} from 'lucide-react';

interface RelayNode {
  id: string;
  name: string;
  avatar: string;
  university: string;
  major: string;
  year: string;
  generation: number;
  status: 'completed' | 'active' | 'preparing';
  experiences: string[];
  passedTo?: number;
  receivedFrom?: string;
  childIds?: string[];
  sessions?: number;
  rating?: number;
  bio?: string;
}

interface RelayChainVisualizationProps {
  currentUserName: string;
  onNodeClick?: (node: RelayNode) => void;
  onStartMentoring?: () => void;
}

interface Connection {
  fromId: string;
  toId: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
}

const relayChain: RelayNode[] = [
  {
    id: '1', name: '김민준', avatar: '👨‍🎓', university: '연세대', major: '경영학과', year: '20학번',
    generation: 1, status: 'completed', experiences: ['학생회', '창업동아리', '해외인턴'],
    passedTo: 3, childIds: ['2', '5', '6'], sessions: 15, rating: 4.9,
    bio: '연세대 경영학과에 편입 후 창업 동아리와 학생회 활동을 통해 다양한 경험을 쌓았습니다. 현재는 스타트업에서 PM으로 근무 중입니다.',
  },
  {
    id: '2', name: '이서연', avatar: '👩‍🎓', university: '연세대', major: '경영학과', year: '22학번',
    generation: 2, status: 'active', experiences: ['마케팅 동아리', '봉사활동', '교환학생'],
    receivedFrom: '김민준', passedTo: 4, childIds: ['3', '4', '7', '8'], sessions: 8, rating: 4.8,
    bio: '마케팅에 관심이 많아 관련 동아리와 인턴 경험을 쌓고 있습니다. 현재는 후배들에게 편입 경험을 적극적으로 공유하고 있습니다.',
  },
  {
    id: '5', name: '박지우', avatar: '👨‍💼', university: '고려대', major: '경영학과', year: '21학번',
    generation: 2, status: 'completed', experiences: ['학생회', 'IT 동아리', '멘토링'],
    receivedFrom: '김민준', passedTo: 2, childIds: ['9', '10'], sessions: 12, rating: 4.7,
    bio: 'IT와 경영의 융합에 관심이 많아 관련 활동을 적극적으로 하고 있습니다.',
  },
  {
    id: '6', name: '최예은', avatar: '👩‍💼', university: '성균관대', major: '경영학과', year: '22학번',
    generation: 2, status: 'active', experiences: ['해외봉사', '창업경진대회'],
    receivedFrom: '김민준', passedTo: 1, childIds: ['11'], sessions: 5, rating: 4.9,
    bio: '글로벌 비즈니스에 관심이 많아 해외 봉사와 교환학생 프로그램에 참여했습니다.',
  },
  {
    id: '3', name: '정도윤', avatar: '👨‍🎓', university: '연세대', major: '경영학과', year: '24학번',
    generation: 3, status: 'active', experiences: ['스타트업 인턴', '학술동아리'],
    receivedFrom: '이서연', sessions: 2, rating: 4.6,
    bio: '스타트업 생태계에 관심이 많아 다양한 인턴 경험을 쌓고 있습니다.',
  },
  {
    id: '4', name: '강서준', avatar: '👩‍💼', university: '고려대', major: '글로벌경영', year: '24학번',
    generation: 3, status: 'preparing', experiences: ['해외봉사', '창업경진대회'],
    receivedFrom: '이서연', sessions: 1, rating: 4.5,
    bio: '편입 준비 중이며, 다양한 대외활동을 통해 경험을 쌓고 있습니다.',
  },
  {
    id: '7', name: '조유진', avatar: '👨‍💼', university: '서강대', major: '경제학과', year: '24학번',
    generation: 3, status: 'active', experiences: ['금융동아리', '학생회'],
    receivedFrom: '이서연', sessions: 3, rating: 4.7,
    bio: '금융권 취업을 목표로 관련 동아리와 인턴 활동에 집중하고 있습니다.',
  },
  {
    id: '8', name: '윤시우', avatar: '👩‍🎓', university: '성균관대', major: '경영학과', year: '24학번',
    generation: 3, status: 'preparing', experiences: ['마케팅 인턴', '봉사활동'],
    receivedFrom: '이서연', sessions: 1, rating: 4.4,
    bio: '마케팅 분야로 진로를 정하고 관련 경험을 쌓아가고 있습니다.',
  },
  {
    id: '9', name: '임채원', avatar: '👨‍🎓', university: '고려대', major: '경제학과', year: '24학번',
    generation: 3, status: 'active', experiences: ['금융 인턴', '학생회'],
    receivedFrom: '박지우', sessions: 4, rating: 4.8,
    bio: '금융 분야에 관심이 많아 관련 인턴과 자격증을 준비하고 있습니다.',
  },
  {
    id: '10', name: '한지호', avatar: '👩‍💼', university: '한양대', major: '경영학과', year: '24학번',
    generation: 3, status: 'preparing', experiences: ['창업동아리', '봉사활동'],
    receivedFrom: '박지우', sessions: 2, rating: 4.5,
    bio: '창업에 관심이 많아 관련 동아리와 경진대회에 참여하고 있습니다.',
  },
  {
    id: '11', name: '오수민', avatar: '👨‍💼', university: '성균관대', major: '글로벌경영', year: '24학번',
    generation: 3, status: 'active', experiences: ['해외인턴', '학술동아리'],
    receivedFrom: '최예은', sessions: 3, rating: 4.6,
    bio: '글로벌 비즈니스 경험을 쌓기 위해 해외 인턴십에 도전하고 있습니다.',
  },
];

export function RelayChainVisualization({ currentUserName, onNodeClick, onStartMentoring }: RelayChainVisualizationProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [expandedGen, setExpandedGen] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'network'>('tree');
  const [selectedNode, setSelectedNode] = useState<RelayNode | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const nodeElsRef = useRef<Map<string, HTMLElement>>(new Map());
  const rafRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const generations = [1, 2, 3];

  const getNodesByGeneration = (gen: number) => relayChain.filter(node => node.generation === gen);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'from-green-400 to-emerald-500';
      case 'active': return 'from-indigo-400 to-purple-500';
      case 'preparing': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return { text: '합격 완료', icon: Award, color: 'bg-green-500' };
      case 'active': return { text: '경험 전달중', icon: Zap, color: 'bg-indigo-500' };
      case 'preparing': return { text: '준비중', icon: Target, color: 'bg-blue-500' };
      default: return { text: '', icon: Info, color: 'bg-gray-500' };
    }
  };

  const isCurrentUser = (name: string) => name === currentUserName;

  // Register node element ref
  const registerNode = useCallback((id: string, el: HTMLElement | null) => {
    if (el) {
      nodeElsRef.current.set(id, el);
    } else {
      nodeElsRef.current.delete(id);
    }
  }, []);

  // Calculate all connections from DOM positions
  const recalcConnections = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    if (wrapperRect.width === 0 || wrapperRect.height === 0) return;

    const newConns: Connection[] = [];

    relayChain.forEach((node) => {
      if (!node.childIds || node.childIds.length === 0) return;
      const parentEl = nodeElsRef.current.get(node.id);
      if (!parentEl) return;
      const parentRect = parentEl.getBoundingClientRect();

      node.childIds.forEach((childId) => {
        const childEl = nodeElsRef.current.get(childId);
        if (!childEl) return;
        const childRect = childEl.getBoundingClientRect();

        newConns.push({
          fromId: node.id,
          toId: childId,
          from: {
            x: parentRect.left - wrapperRect.left + parentRect.width / 2,
            y: parentRect.top - wrapperRect.top + parentRect.height / 2,
          },
          to: {
            x: childRect.left - wrapperRect.left + childRect.width / 2,
            y: childRect.top - wrapperRect.top + childRect.height / 2,
          },
        });
      });
    });

    setSvgDimensions({ width: wrapperRect.width, height: wrapperRect.height });
    setConnections(newConns);
  }, []);

  // Schedule position recalculations after render and animations
  useEffect(() => {
    // Clear previous timers
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    cancelAnimationFrame(rafRef.current);

    // Staggered recalculations to handle motion animation delays
    const delays = [100, 300, 600, 1000, 1500];
    delays.forEach((delay) => {
      timerRef.current.push(setTimeout(() => {
        rafRef.current = requestAnimationFrame(recalcConnections);
      }, delay));
    });

    // ResizeObserver for dynamic size changes
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(recalcConnections);
    });
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => {
      timerRef.current.forEach(clearTimeout);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [viewMode, expandedGen, recalcConnections]);

  // Get connected node IDs for hover highlight
  const getConnectedNodeIds = (nodeId: string): Set<string> => {
    const connected = new Set<string>();
    connected.add(nodeId);
    relayChain.forEach((node) => {
      if (node.id === nodeId && node.childIds) {
        node.childIds.forEach((cid) => connected.add(cid));
      }
      if (node.childIds?.includes(nodeId)) {
        connected.add(node.id);
      }
    });
    return connected;
  };

  const isConnectionHighlighted = (conn: Connection): boolean => {
    if (!hoveredNode) return true;
    return conn.fromId === hoveredNode || conn.toId === hoveredNode;
  };

  const isNodeHighlighted = (nodeId: string): boolean => {
    if (!hoveredNode) return false;
    return getConnectedNodeIds(hoveredNode).has(nodeId);
  };

  const isNodeDimmed = (nodeId: string): boolean => {
    if (!hoveredNode) return false;
    return !getConnectedNodeIds(hoveredNode).has(nodeId);
  };

  const stats = {
    total: relayChain.length,
    completed: relayChain.filter(n => n.status === 'completed').length,
    active: relayChain.filter(n => n.status === 'active').length,
    generations: generations.length,
    totalPassed: relayChain.reduce((sum, n) => sum + (n.passedTo || 0), 0),
  };

  const handleNodeClick = (node: RelayNode) => {
    setSelectedNode(node);
    onNodeClick?.(node);
  };

  // Build SVG path for a connection
  const buildPath = (conn: Connection, isHorizontal: boolean): string => {
    const { from, to } = conn;
    if (isHorizontal) {
      // Network view: horizontal flow (left to right columns)
      const midX = (from.x + to.x) / 2;
      return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
    } else {
      // Tree view: vertical flow (top to bottom rows)
      const midY = (from.y + to.y) / 2;
      return `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
    }
  };

  // Render SVG overlay with connections
  const renderSVGConnections = (isHorizontal: boolean) => {
    if (connections.length === 0 || svgDimensions.width === 0) return null;

    return (
      <svg
        width={svgDimensions.width}
        height={svgDimensions.height}
        className="absolute top-0 left-0 pointer-events-none"
        style={{ zIndex: 10, overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="connGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="connGradientHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1" />
          </linearGradient>
          <filter id="connGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="connGlowStrong">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {connections.map((conn) => {
          const path = buildPath(conn, isHorizontal);
          const highlighted = isConnectionHighlighted(conn);
          const isActive = hoveredNode && (conn.fromId === hoveredNode || conn.toId === hoveredNode);

          return (
            <g
              key={`${conn.fromId}-${conn.toId}`}
              style={{
                transition: 'opacity 0.3s ease',
                opacity: highlighted ? 1 : 0.1,
              }}
            >
              {/* Glow background */}
              <path
                d={path}
                stroke={isActive ? '#6366f1' : '#a78bfa'}
                strokeWidth={isActive ? 8 : 5}
                fill="none"
                strokeLinecap="round"
                opacity={isActive ? 0.2 : 0.1}
                filter={isActive ? 'url(#connGlowStrong)' : 'url(#connGlow)'}
              />
              {/* Main line */}
              <path
                d={path}
                stroke={isActive ? 'url(#connGradientHighlight)' : 'url(#connGradient)'}
                strokeWidth={isActive ? 3 : 2}
                fill="none"
                strokeLinecap="round"
              />
              {/* Animated dot */}
              <circle
                r={isActive ? 4 : 3}
                fill={isActive ? '#6366f1' : '#818cf8'}
                opacity={isActive ? 1 : 0.7}
              >
                <animateMotion
                  dur={isActive ? '2s' : '4s'}
                  repeatCount="indefinite"
                  path={path}
                />
              </circle>
              {/* Connection endpoint dots */}
              <circle cx={conn.from.x} cy={conn.from.y} r={isActive ? 5 : 3} fill={isActive ? '#6366f1' : '#818cf8'} opacity={isActive ? 0.8 : 0.4} />
              <circle cx={conn.to.x} cy={conn.to.y} r={isActive ? 5 : 3} fill={isActive ? '#6366f1' : '#818cf8'} opacity={isActive ? 0.8 : 0.4} />
            </g>
          );
        })}
      </svg>
    );
  };

  // Render a node card
  const renderNodeCard = (node: RelayNode, compact: boolean = false) => {
    const status = getStatusBadge(node.status);
    const StatusIcon = status.icon;
    const isHovered = hoveredNode === node.id;
    const highlighted = isNodeHighlighted(node.id);
    const dimmed = isNodeDimmed(node.id);

    if (compact) {
      return (
        <Card
          ref={(el: HTMLElement | null) => registerNode(node.id, el)}
          className={`p-4 card-modern cursor-pointer transition-all duration-300 ${
            isCurrentUser(node.name)
              ? 'ring-2 ring-indigo-500 ring-offset-2 shadow-xl'
              : ''
          } ${highlighted ? 'ring-2 ring-indigo-400 shadow-xl scale-[1.02]' : ''} ${dimmed ? 'opacity-40 scale-[0.98]' : ''}`}
          style={{ transition: 'all 0.3s ease' }}
          onClick={() => handleNodeClick(node)}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
          data-node-id={node.id}
        >
          {isCurrentUser(node.name) && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-lg text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                나
              </Badge>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${getStatusColor(node.status)} rounded-xl flex items-center justify-center text-xl shadow-lg flex-shrink-0 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
              {node.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900 truncate">{node.name}</div>
              <div className="text-xs text-gray-600 truncate">{node.university}</div>
              <div className="text-xs text-gray-500">{node.major}</div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Badge className={`${status.color} text-white border-0 text-xs`}>
              {status.text}
            </Badge>
            {node.passedTo && node.passedTo > 0 && (
              <div className="text-xs text-indigo-600 font-medium">
                {node.passedTo}명 전달
              </div>
            )}
          </div>
        </Card>
      );
    }

    return (
      <Card
        ref={(el: HTMLElement | null) => registerNode(node.id, el)}
        className={`p-5 card-modern cursor-pointer transition-all duration-300 relative overflow-hidden ${
          isCurrentUser(node.name)
            ? 'ring-2 ring-indigo-500 ring-offset-2 shadow-2xl scale-[1.02]'
            : ''
        } ${highlighted ? 'ring-2 ring-indigo-400 shadow-xl scale-[1.02]' : ''} ${dimmed ? 'opacity-40 scale-[0.98]' : ''} ${isHovered ? 'shadow-2xl scale-[1.03]' : ''}`}
        style={{ transition: 'all 0.3s ease' }}
        onClick={() => handleNodeClick(node)}
        onMouseEnter={() => setHoveredNode(node.id)}
        onMouseLeave={() => setHoveredNode(null)}
        data-node-id={node.id}
      >
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 to-purple-50/60 transition-opacity duration-300" />
        )}
        <div className="relative z-10">
          {isCurrentUser(node.name) && (
            <div className="absolute -top-3 -right-3">
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-lg animate-pulse">
                <Sparkles className="w-3 h-3 mr-1" />
                나
              </Badge>
            </div>
          )}
          <div className="flex items-start gap-3 mb-4">
            <div className={`relative w-14 h-14 bg-gradient-to-br ${getStatusColor(node.status)} rounded-2xl flex items-center justify-center text-2xl shadow-xl transform transition-transform duration-300 ${isHovered ? 'scale-110 rotate-3' : ''}`}>
              {node.avatar}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${status.color} rounded-full border-2 border-white`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900 truncate mb-1">{node.name}</div>
              <div className="text-xs text-gray-600 truncate">{node.university}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Badge className={`${status.color} text-white border-0 text-xs flex items-center gap-1`}>
              <StatusIcon className="w-3 h-3" />
              {status.text}
            </Badge>
          </div>
          <div className="space-y-2 text-sm mb-3">
            <div className="flex items-center gap-2 text-gray-700">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span className="truncate font-medium">{node.major}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {node.experiences.slice(0, 2).map((exp, i) => (
              <Badge key={i} className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 text-xs px-2 py-0.5">
                {exp}
              </Badge>
            ))}
            {node.experiences.length > 2 && (
              <Badge className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5">
                +{node.experiences.length - 2}
              </Badge>
            )}
          </div>
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            {node.receivedFrom && (
              <div className="flex items-center gap-1 text-purple-600 font-medium">
                <ArrowRight className="w-3 h-3" />
                <span>경험 받음</span>
              </div>
            )}
            {node.passedTo && node.passedTo > 0 && (
              <div className="flex items-center gap-1 text-indigo-600 font-medium">
                <Zap className="w-3 h-3" />
                <span>{node.passedTo}명 전달</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 rounded-2xl mb-4 shadow-md">
          <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
          <span className="font-semibold text-indigo-900">릴레이 체인 시각화</span>
        </div>
        <h2 className="text-4xl font-bold gradient-text mb-3">경험의 흐름</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          익명으로 연결되는 경험의 바통. 선배에게 받은 경험을 후배에게 전달하며 릴레이는 계속됩니다.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        {[
          { icon: Users, value: stats.total, label: '총 러너', colors: 'from-indigo-100 to-purple-100', textColor: 'text-gray-900', iconColor: 'text-indigo-600', delay: 0.1 },
          { icon: Award, value: stats.completed, label: '합격 완료', colors: 'from-green-100 to-emerald-100', textColor: 'text-green-700', iconColor: 'text-green-600', delay: 0.2 },
          { icon: Zap, value: stats.active, label: '경험 전달중', colors: 'from-indigo-100 to-cyan-100', textColor: 'text-indigo-700', iconColor: 'text-indigo-600', delay: 0.3 },
          { icon: GitBranch, value: stats.generations, label: '세대', colors: 'from-blue-100 to-sky-100', textColor: 'text-blue-700', iconColor: 'text-blue-600', delay: 0.4 },
          { icon: Network, value: stats.totalPassed, label: '총 전달', colors: 'from-purple-100 to-pink-100', textColor: 'gradient-text', iconColor: 'text-purple-600', delay: 0.5 },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: stat.delay }}
          >
            <Card className="p-6 text-center card-modern hover-lift">
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.colors} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
              </div>
              <div className={`text-3xl font-bold ${stat.textColor} mb-1`}>{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Visualization */}
      <Card className="p-8 card-modern">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">릴레이 네트워크</h3>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'tree' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('tree')}
              className="rounded-xl"
            >
              <GitBranch className="w-4 h-4 mr-2" />
              트리뷰
            </Button>
            <Button
              variant={viewMode === 'network' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('network')}
              className="rounded-xl"
            >
              <Network className="w-4 h-4 mr-2" />
              네트워크
            </Button>
          </div>
        </div>

        {/* Hover Legend */}
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-3 text-sm text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              <strong>{relayChain.find(n => n.id === hoveredNode)?.name}</strong> 님의 릴레이 연결이 하이라이트되고 있습니다
            </span>
          </motion.div>
        )}

        <div className="overflow-x-auto pb-4">
          {/* Wrapper with ref for position calculations */}
          <div className="min-w-[900px] relative" ref={wrapperRef}>
            {/* SVG Connections Overlay - rendered for both views */}
            {renderSVGConnections(viewMode === 'network')}

            {/* Tree View */}
            {viewMode === 'tree' && (
              <div className="space-y-6 relative" style={{ zIndex: 1 }}>
                {generations.map((gen, genIndex) => {
                  const nodes = getNodesByGeneration(gen);
                  const isExpanded = expandedGen === gen || expandedGen === null;

                  return (
                    <motion.div
                      key={gen}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: genIndex * 0.15 }}
                      className="space-y-4"
                    >
                      {/* Generation Header */}
                      <div
                        className="flex items-center justify-between cursor-pointer group"
                        onClick={() => setExpandedGen(expandedGen === gen ? null : gen)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${
                            gen === 1 ? 'from-purple-400 to-pink-500' :
                            gen === 2 ? 'from-indigo-400 to-purple-500' :
                            'from-blue-400 to-cyan-500'
                          } rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                            {gen}
                          </div>
                          <div>
                            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-md mb-2">
                              {gen === 1 ? '1세대 - 선배의 선배' : gen === 2 ? '2세대 - 나와 동료' : '3세대 - 내 후배'}
                            </Badge>
                            <div className="text-sm text-gray-600">
                              {nodes.length}명의 러너 • {nodes.reduce((sum, n) => sum + (n.passedTo || 0), 0)}회 전달
                            </div>
                          </div>
                        </div>
                        {isExpanded ?
                          <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" /> :
                          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        }
                      </div>

                      {/* Nodes Grid */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                            onAnimationComplete={() => {
                              // Recalculate after expand/collapse animation
                              setTimeout(recalcConnections, 50);
                              setTimeout(recalcConnections, 300);
                            }}
                          >
                            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
                              {nodes.map((node, nodeIndex) => (
                                <motion.div
                                  key={node.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: nodeIndex * 0.05 }}
                                >
                                  {renderNodeCard(node)}
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Network View */}
            {viewMode === 'network' && (
              <div className="grid md:grid-cols-3 gap-12 relative" style={{ zIndex: 1 }}>
                {generations.map((gen, genIndex) => {
                  const nodes = getNodesByGeneration(gen);

                  return (
                    <motion.div
                      key={gen}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: genIndex * 0.1 }}
                      className="space-y-4"
                    >
                      <div className="text-center mb-6">
                        <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-lg text-sm px-4 py-2">
                          {gen === 1 ? '1세대 (선배의 선배)' : gen === 2 ? '2세대 (나와 동료)' : '3세대 (내 후배)'}
                        </Badge>
                      </div>
                      <div className="space-y-4">
                        {nodes.map((node, nodeIndex) => (
                          <motion.div
                            key={node.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: genIndex * 0.15 + nodeIndex * 0.08 }}
                            className="relative"
                          >
                            {renderNodeCard(node, true)}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedNode && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNode(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <Card className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto">
                <div className="relative p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-t-3xl">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedNode(null)}
                    className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center text-5xl shadow-2xl">
                      {selectedNode.avatar}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-2">{selectedNode.name}</h2>
                      <div className="space-y-1 text-white/90">
                        <p className="text-lg">{selectedNode.university} • {selectedNode.major}</p>
                        <p>{selectedNode.year}</p>
                      </div>
                      <div className="mt-4">
                        <Badge className={`${getStatusBadge(selectedNode.status).color} text-white border-0 shadow-lg`}>
                          {getStatusBadge(selectedNode.status).text}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
                      <div className="text-2xl font-bold text-indigo-600">{selectedNode.sessions || 0}</div>
                      <div className="text-sm text-gray-600 mt-1">총 세션</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
                      <div className="text-2xl font-bold text-amber-600 flex items-center justify-center gap-1">
                        {selectedNode.rating || 0}
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                      <div className="text-sm text-gray-600 mt-1">평점</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                      <div className="text-2xl font-bold text-green-600">{selectedNode.passedTo || 0}</div>
                      <div className="text-sm text-gray-600 mt-1">경험 전달</div>
                    </div>
                  </div>
                  {selectedNode.bio && (
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Info className="w-5 h-5 text-indigo-500" />
                        소개
                      </h3>
                      <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">{selectedNode.bio}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-500" />
                      경험 & 활동
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedNode.experiences.map((exp, i) => (
                        <Badge key={i} className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200 px-3 py-1.5">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {selectedNode.receivedFrom && (
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Network className="w-5 h-5 text-indigo-500" />
                        릴레이 연결
                      </h3>
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border-2 border-purple-200">
                        <div className="flex items-center gap-2 text-purple-700">
                          <ArrowRight className="w-4 h-4" />
                          <span className="font-medium">{selectedNode.receivedFrom}</span>
                          <span className="text-gray-600">님으로부터 경험을 전달받았습니다</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="pt-4 flex gap-3">
                    <Button className="flex-1 btn-primary rounded-xl h-12">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      메시지 보내기
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-xl h-12 hover:bg-indigo-50 hover:border-indigo-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      세션 예약하기
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
