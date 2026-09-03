import { ChapterInfo, GameLevel } from '../types';

export const CHAPTERS: ChapterInfo[] = [
  {
    id: 1,
    title: '第1章：晨曦物语',
    subtitle: '日常起居 · 餐饮 · 城市作息',
    icon: 'Sun',
    color: 'from-amber-500 to-orange-500',
    levelRange: [1, 10],
  },
  {
    id: 2,
    title: '第2章：都市穿梭',
    subtitle: '职场办公 · 团队协作 · 效能科技',
    icon: 'Briefcase',
    color: 'from-blue-500 to-indigo-600',
    levelRange: [11, 20],
  },
  {
    id: 3,
    title: '第3章：环球漫步',
    subtitle: '出境值机 · 自然风光 · 探索旅程',
    icon: 'Plane',
    color: 'from-emerald-500 to-teal-600',
    levelRange: [21, 30],
  },
  {
    id: 4,
    title: '第4章：心灵共鸣',
    subtitle: '情绪感知 · 同理共情 · 暖心社交',
    icon: 'Heart',
    color: 'from-rose-500 to-pink-600',
    levelRange: [31, 40],
  },
  {
    id: 5,
    title: '第5章：秘境之钥',
    subtitle: '奇幻魔法 · 宇宙探幽 · 巅峰挑战',
    icon: 'Sparkles',
    color: 'from-purple-500 to-violet-600',
    levelRange: [41, 50],
  },
];

export const GAME_LEVELS: GameLevel[] = [
  // ==========================================
  // 🌟 第 1 章：日常起居与饮食 (Levels 1 - 10)
  // ==========================================
  {
    levelNumber: 1,
    chapterId: 1,
    title: '晨起微风',
    subtitle: '熟悉最基础的日常轻词，体验轻松顺畅消除',
    category: 'daily',
    pairCount: 4,
    targetWordIds: ['w-daily-19', 'w-daily-7', 'w-daily-2', 'w-daily-4'], // breeze, routine, beverage, aroma
  },
  {
    levelNumber: 2,
    chapterId: 1,
    title: '美味早餐',
    subtitle: '厨房里升腾的香气与美味料理',
    category: 'daily',
    pairCount: 4,
    targetWordIds: ['w-daily-12', 'w-daily-10', 'w-daily-6', 'w-daily-2'], // recipe, appetite, gourmet, beverage
  },
  {
    levelNumber: 3,
    chapterId: 1,
    title: '阳光漫步',
    subtitle: '清晨街道的慢节奏散步与健康补给',
    category: 'daily',
    pairCount: 4,
    targetWordIds: ['w-daily-18', 'w-daily-17', 'w-daily-19', 'w-daily-7'], // stroll, hydration, breeze, routine
  },
  {
    levelNumber: 4,
    chapterId: 1,
    title: '快捷通勤',
    subtitle: '现代城市上班族的便捷交通与早餐外卖',
    category: 'daily',
    pairCount: 4,
    targetWordIds: ['w-daily-8', 'w-daily-22', 'w-daily-9', 'w-daily-16'], // commute, convenient, takeout, workout
  },
  {
    levelNumber: 5,
    chapterId: 1,
    title: '周末采购',
    subtitle: '在生鲜超市寻找优惠打折好物',
    category: 'daily',
    pairCount: 4,
    targetWordIds: ['w-daily-11', 'w-daily-13', 'w-daily-14', 'w-daily-15'], // groceries, discount, bargain, receipt
  },
  {
    levelNumber: 6,
    chapterId: 1,
    title: '居家整理',
    subtitle: '洗衣服做家务，整理整洁温馨的家',
    category: 'daily',
    pairCount: 4,
    targetWordIds: ['w-daily-23', 'w-daily-24', 'w-daily-25', 'w-daily-21'], // chore, laundry, leftovers, budget
  },
  {
    levelNumber: 7,
    chapterId: 1,
    title: '午后小憩',
    subtitle: '伴随着耳畔轻语与午后打盹的小确幸',
    category: 'daily',
    pairCount: 4,
    targetWordIds: ['w-daily-26', 'w-daily-5', 'w-daily-1', 'w-daily-4'], // nap, whisper, serendipity, aroma
  },
  {
    levelNumber: 8,
    chapterId: 1,
    title: '好友小聚',
    subtitle: '周末聚会谈天说地，欢声笑语充满房间',
    category: 'daily',
    pairCount: 4,
    targetWordIds: ['w-daily-27', 'w-daily-28', 'w-daily-29', 'w-daily-30'], // hangout, compliment, awkward, hilarious
  },
  {
    levelNumber: 9,
    chapterId: 1,
    title: '数字生活',
    subtitle: '管理手机推送通知、订阅账单与退款预算',
    category: 'daily',
    pairCount: 4,
    targetWordIds: ['w-daily-20', 'w-daily-31', 'w-daily-32', 'w-daily-21'], // notification, subscription, refund, budget
  },
  {
    levelNumber: 10,
    chapterId: 1,
    title: '【第1章终极试炼】晨曦交响',
    subtitle: '6对卡片极速消除，检验第1章日常高频核心词汇',
    category: 'daily',
    pairCount: 6,
    targetWordIds: ['w-daily-1', 'w-daily-2', 'w-daily-3', 'w-daily-4', 'w-daily-6', 'w-daily-19'],
  },

  // ==========================================
  // 💼 第 2 章：职场办公与效能 (Levels 11 - 20)
  // ==========================================
  {
    levelNumber: 11,
    chapterId: 2,
    title: '职场新起点',
    subtitle: '设定项目重大里程碑与汇报展示',
    category: 'workplace',
    pairCount: 4,
    targetWordIds: ['w-work-4', 'w-work-8', 'w-work-9', 'w-work-11'], // milestone, presentation, deadline, feedback
  },
  {
    levelNumber: 12,
    chapterId: 2,
    title: '会议日程',
    subtitle: '按议程高效讨论，凝聚团队一致共识',
    category: 'workplace',
    pairCount: 4,
    targetWordIds: ['w-work-10', 'w-work-3', 'w-work-13', 'w-work-8'], // agenda, consensus, collaboration, presentation
  },
  {
    levelNumber: 13,
    chapterId: 2,
    title: '攻克瓶颈',
    subtitle: '突破业务瓶颈，充分发挥技术杠杆作用',
    category: 'workplace',
    pairCount: 4,
    targetWordIds: ['w-work-1', 'w-work-5', 'w-work-6', 'w-work-2'], // bottleneck, leverage, scalable, innovative
  },
  {
    levelNumber: 14,
    chapterId: 2,
    title: '追求卓越',
    subtitle: '以一丝不苟的态度树立行业标杆基准',
    category: 'workplace',
    pairCount: 4,
    targetWordIds: ['w-work-7', 'w-work-16', 'w-work-12', 'w-work-15'], // meticulous, benchmark, efficiency, strategy
  },
  {
    levelNumber: 15,
    chapterId: 2,
    title: '商务斡旋',
    subtitle: '在商务谈判中达成互利共赢的共识',
    category: 'workplace',
    pairCount: 4,
    targetWordIds: ['w-work-14', 'w-work-3', 'w-work-15', 'w-work-4'], // negotiation, consensus, strategy, milestone
  },
  {
    levelNumber: 16,
    chapterId: 2,
    title: '效能提速',
    subtitle: '倾听用户反馈，大幅消除流程瓶颈',
    category: 'workplace',
    pairCount: 4,
    targetWordIds: ['w-work-11', 'w-work-12', 'w-work-1', 'w-work-6'], // feedback, efficiency, bottleneck, scalable
  },
  {
    levelNumber: 17,
    chapterId: 2,
    title: '创新引擎',
    subtitle: '前沿创新思维与团队跨界深度协作',
    category: 'workplace',
    pairCount: 4,
    targetWordIds: ['w-work-2', 'w-work-5', 'w-work-13', 'w-work-10'], // innovative, leverage, collaboration, agenda
  },
  {
    levelNumber: 18,
    chapterId: 2,
    title: '紧迫倒计时',
    subtitle: '在最后截止期限前保持严谨细致',
    category: 'workplace',
    pairCount: 4,
    targetWordIds: ['w-work-9', 'w-work-7', 'w-work-16', 'w-work-15'], // deadline, meticulous, benchmark, strategy
  },
  {
    levelNumber: 19,
    chapterId: 2,
    title: '高维战略',
    subtitle: '全局战略规划与团队协同作战',
    category: 'workplace',
    pairCount: 4,
    targetWordIds: ['w-work-15', 'w-work-14', 'w-work-13', 'w-work-12'], // strategy, negotiation, collaboration, efficiency
  },
  {
    levelNumber: 20,
    chapterId: 2,
    title: '【第2章终极试炼】职场精英',
    subtitle: '6对职场核心高阶词汇，挑战零失误快速通关',
    category: 'workplace',
    pairCount: 6,
    targetWordIds: ['w-work-1', 'w-work-2', 'w-work-3', 'w-work-4', 'w-work-5', 'w-work-6'],
  },

  // ==========================================
  // ✈️ 第 3 章：环球漫步与探险 (Levels 21 - 30)
  // ==========================================
  {
    levelNumber: 21,
    chapterId: 3,
    title: '整装待发',
    subtitle: '检查护照、托运行李与酒店预订',
    category: 'travel',
    pairCount: 4,
    targetWordIds: ['w-travel-10', 'w-travel-11', 'w-travel-3', 'w-travel-14'], // passport, luggage, baggage, reservation
  },
  {
    levelNumber: 22,
    chapterId: 3,
    title: '航站楼值机',
    subtitle: '在航站楼登机口听候广播，通过海关检查',
    category: 'travel',
    pairCount: 4,
    targetWordIds: ['w-travel-1', 'w-travel-13', 'w-travel-4', 'w-travel-7'], // boarding, terminal, customs, delayed
  },
  {
    levelNumber: 23,
    chapterId: 3,
    title: '异国风光',
    subtitle: '抵达如画般的浪漫旅行目的地',
    category: 'travel',
    pairCount: 4,
    targetWordIds: ['w-travel-5', 'w-travel-12', 'w-travel-9', 'w-travel-6'], // picturesque, scenery, destination, souvenir
  },
  {
    levelNumber: 24,
    chapterId: 3,
    title: '完美旅行线',
    subtitle: '按照行程规划打卡如画风景与预订餐厅',
    category: 'travel',
    pairCount: 4,
    targetWordIds: ['w-travel-2', 'w-travel-14', 'w-travel-9', 'w-travel-5'], // itinerary, reservation, destination, picturesque
  },
  {
    levelNumber: 25,
    chapterId: 3,
    title: '雨林远征',
    subtitle: '克服航班延误，展开深入自然的探险考察',
    category: 'travel',
    pairCount: 4,
    targetWordIds: ['w-travel-8', 'w-travel-7', 'w-travel-3', 'w-travel-12'], // expedition, delayed, baggage, scenery
  },
  {
    levelNumber: 26,
    chapterId: 3,
    title: '纪念物语',
    subtitle: '挑选当地精美手工伴手礼，妥善收纳于行李',
    category: 'travel',
    pairCount: 4,
    targetWordIds: ['w-travel-6', 'w-travel-4', 'w-travel-10', 'w-travel-11'], // souvenir, customs, passport, luggage
  },
  {
    levelNumber: 27,
    chapterId: 3,
    title: '候机中转',
    subtitle: '在现代化的国际航站楼等待下一程登机',
    category: 'travel',
    pairCount: 4,
    targetWordIds: ['w-travel-13', 'w-travel-7', 'w-travel-1', 'w-travel-14'], // terminal, delayed, boarding, reservation
  },
  {
    levelNumber: 28,
    chapterId: 3,
    title: '绝美地貌',
    subtitle: '穿越高山峡谷，领略大自然的壮美景色',
    category: 'travel',
    pairCount: 4,
    targetWordIds: ['w-travel-5', 'w-travel-12', 'w-travel-8', 'w-travel-9'], // picturesque, scenery, expedition, destination
  },
  {
    levelNumber: 29,
    chapterId: 3,
    title: '跨洋旅程',
    subtitle: '带上护照与缜密行程，踏上全新国度',
    category: 'travel',
    pairCount: 4,
    targetWordIds: ['w-travel-2', 'w-travel-4', 'w-travel-10', 'w-travel-3'], // itinerary, customs, passport, baggage
  },
  {
    levelNumber: 30,
    chapterId: 3,
    title: '【第3章终极试炼】环球航线',
    subtitle: '6对出境旅行与地理探险核心词汇满分通关',
    category: 'travel',
    pairCount: 6,
    targetWordIds: ['w-travel-1', 'w-travel-2', 'w-travel-3', 'w-travel-4', 'w-travel-5', 'w-travel-6'],
  },

  // ==========================================
  // 🎭 第 4 章：心灵共鸣与情感 (Levels 31 - 40)
  // ==========================================
  {
    levelNumber: 31,
    chapterId: 4,
    title: '温暖同理',
    subtitle: '设身处地的同理心与温柔真诚的关怀',
    category: 'emotion',
    pairCount: 4,
    targetWordIds: ['w-emo-3', 'w-emo-7', 'w-emo-10', 'w-emo-6'], // empathy, compassion, affection, optimism
  },
  {
    levelNumber: 32,
    chapterId: 4,
    title: '不屈韧性',
    subtitle: '以乐观心态与强大心理韧性面对人生起伏',
    category: 'emotion',
    pairCount: 4,
    targetWordIds: ['w-emo-2', 'w-emo-9', 'w-emo-6', 'w-emo-3'], // resilience, enthusiasm, optimism, empathy
  },
  {
    levelNumber: 33,
    chapterId: 4,
    title: '岁月怀想',
    subtitle: '老歌与旧照片勾起的淡淡怀旧之情',
    category: 'emotion',
    pairCount: 4,
    targetWordIds: ['w-emo-1', 'w-emo-5', 'w-emo-10', 'w-emo-7'], // nostalgia, melancholy, affection, compassion
  },
  {
    levelNumber: 34,
    chapterId: 4,
    title: '平复焦虑',
    subtitle: '深呼吸缓解焦虑不安，重拾内在力量',
    category: 'emotion',
    pairCount: 4,
    targetWordIds: ['w-emo-8', 'w-emo-2', 'w-emo-6', 'w-emo-9'], // anxiety, resilience, optimism, enthusiasm
  },
  {
    levelNumber: 35,
    chapterId: 4,
    title: '狂喜绽放',
    subtitle: '胜利与成功瞬间引爆的无上欢愉狂喜',
    category: 'emotion',
    pairCount: 4,
    targetWordIds: ['w-emo-4', 'w-emo-9', 'w-emo-10', 'w-emo-6'], // euphoria, enthusiasm, affection, optimism
  },
  {
    levelNumber: 36,
    chapterId: 4,
    title: '心灵倾听',
    subtitle: '在朋友焦虑时给予耐心的陪伴与同情',
    category: 'emotion',
    pairCount: 4,
    targetWordIds: ['w-emo-3', 'w-emo-7', 'w-emo-8', 'w-emo-1'], // empathy, compassion, anxiety, nostalgia
  },
  {
    levelNumber: 37,
    chapterId: 4,
    title: '燃情岁月',
    subtitle: '以饱满的热情投入到热爱的事业当中',
    category: 'emotion',
    pairCount: 4,
    targetWordIds: ['w-emo-2', 'w-emo-9', 'w-emo-4', 'w-emo-8'], // resilience, enthusiasm, euphoria, anxiety
  },
  {
    levelNumber: 38,
    chapterId: 4,
    title: '雨后微光',
    subtitle: '穿过淡淡的忧伤，迎来温暖的阳光',
    category: 'emotion',
    pairCount: 4,
    targetWordIds: ['w-emo-1', 'w-emo-10', 'w-emo-5', 'w-emo-7'], // nostalgia, affection, melancholy, compassion
  },
  {
    levelNumber: 39,
    chapterId: 4,
    title: '心向阳光',
    subtitle: '积极乐观地对待每一个崭新的清晨',
    category: 'emotion',
    pairCount: 4,
    targetWordIds: ['w-emo-9', 'w-emo-4', 'w-emo-6', 'w-emo-2'], // enthusiasm, euphoria, optimism, resilience
  },
  {
    levelNumber: 40,
    chapterId: 4,
    title: '【第4章终极试炼】心灵交响',
    subtitle: '6对情绪心理高频精妙词汇，挑战高连击通关',
    category: 'emotion',
    pairCount: 6,
    targetWordIds: ['w-emo-1', 'w-emo-2', 'w-emo-3', 'w-emo-4', 'w-emo-5', 'w-emo-6'],
  },

  // ==========================================
  // 🧙 第 5 章：秘境之钥与奇幻巅峰 (Levels 41 - 50)
  // ==========================================
  {
    levelNumber: 41,
    chapterId: 5,
    title: '魔法觉醒',
    subtitle: '古老森林中弥漫着神秘的水晶法术之光',
    category: 'fantasy',
    pairCount: 4,
    targetWordIds: ['w-fan-1', 'w-fan-10', 'w-fan-12', 'w-fan-6'], // enchantment, spell, crystal, mysterious
  },
  {
    levelNumber: 42,
    chapterId: 5,
    title: '星际星门',
    subtitle: '穿越发光的星际传送门与古代天文学奥秘',
    category: 'fantasy',
    pairCount: 4,
    targetWordIds: ['w-fan-4', 'w-fan-3', 'w-fan-7', 'w-fan-1'], // portal, invisible, astronomy, enchantment
  },
  {
    levelNumber: 43,
    chapterId: 5,
    title: '炼金秘境',
    subtitle: '掌握古代炼金术的秘密配方原料',
    category: 'fantasy',
    pairCount: 4,
    targetWordIds: ['w-fan-2', 'w-fan-5', 'w-fan-12', 'w-fan-10'], // alchemy, ingredient, crystal, spell
  },
  {
    levelNumber: 44,
    chapterId: 5,
    title: '巨龙神话',
    subtitle: '远古神话中翱翔火山群峰的传奇神龙',
    category: 'fantasy',
    pairCount: 4,
    targetWordIds: ['w-fan-11', 'w-fan-9', 'w-fan-1', 'w-fan-6'], // dragon, legendary, enchantment, mysterious
  },
  {
    levelNumber: 45,
    chapterId: 5,
    title: '隐身斗篷',
    subtitle: '披上隐形斗篷踏入未知传送门',
    category: 'fantasy',
    pairCount: 4,
    targetWordIds: ['w-fan-3', 'w-fan-4', 'w-fan-2', 'w-fan-5'], // invisible, portal, alchemy, ingredient
  },
  {
    levelNumber: 46,
    chapterId: 5,
    title: '群星轨迹',
    subtitle: '以水晶符文引导古代星象运转法则',
    category: 'fantasy',
    pairCount: 4,
    targetWordIds: ['w-fan-7', 'w-fan-12', 'w-fan-10', 'w-fan-6'], // astronomy, crystal, spell, mysterious
  },
  {
    levelNumber: 47,
    chapterId: 5,
    title: '时空故障',
    subtitle: '在飞船引擎故障时寻找传奇星际钥匙',
    category: 'fantasy',
    pairCount: 4,
    targetWordIds: ['w-fan-8', 'w-fan-4', 'w-fan-9', 'w-fan-7'], // malfunction, portal, legendary, astronomy
  },
  {
    levelNumber: 48,
    chapterId: 5,
    title: '传世金剑',
    subtitle: '手持传奇武器迎战守护宝藏的巨龙',
    category: 'fantasy',
    pairCount: 4,
    targetWordIds: ['w-fan-9', 'w-fan-11', 'w-fan-10', 'w-fan-12'], // legendary, dragon, spell, crystal
  },
  {
    levelNumber: 49,
    chapterId: 5,
    title: '魔法融合',
    subtitle: '将炼金药剂与隐形咒语完美调和',
    category: 'fantasy',
    pairCount: 4,
    targetWordIds: ['w-fan-2', 'w-fan-5', 'w-fan-1', 'w-fan-3'], // alchemy, ingredient, enchantment, invisible
  },
  {
    levelNumber: 50,
    chapterId: 5,
    title: '【传奇神殿 · 巅峰无损消除】',
    subtitle: '全游戏第50关终极试炼！6对高阶词汇，争夺全星荣耀',
    category: 'fantasy',
    pairCount: 6,
    targetWordIds: ['w-fan-1', 'w-fan-2', 'w-fan-3', 'w-fan-4', 'w-fan-5', 'w-fan-11'],
  },
];
