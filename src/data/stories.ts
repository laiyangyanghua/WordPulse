import { StoryScene } from '../types';

export const BUILTIN_STORIES: StoryScene[] = [
  {
    id: 'story-1',
    title: 'The Enigma in the Rainy Cafe',
    titleCn: '雨夜咖啡馆的神秘邂逅',
    category: 'daily',
    tag: '温情生活',
    intro: '在暴雨如注的黄昏，一杯热饮与一段耳语，揭开了一场命中注定的意外美好。',
    targetWordIds: ['w-daily-1', 'w-daily-2', 'w-daily-3', 'w-daily-4', 'w-daily-5'],
    targetWords: ['serendipity', 'beverage', 'coincidence', 'aroma', 'whisper'],
    contentEn:
      'On a stormy rainy evening in London, Leo stepped into a cozy antique coffee shop. The rich aroma of cinnamon and roasted coffee instantly wrapped around him. He ordered a warm spiced beverage and sat near the glowing fireplace. Suddenly, someone sat across his table — it was his childhood best friend Mia, whom he hadn’t seen in ten years! What an astonishing coincidence. Mia smiled gently, leaned in close to whisper a secret about her lost sketchbook, and Leo realized this serendipity would change his entire week.',
    contentCn:
      '在伦敦一个暴风雨交加的傍晚，利奥走进了一家温馨的复古咖啡馆。肉桂与烘焙咖啡的浓郁香气（aroma）瞬间将他包裹。他点了一杯暖心香料热饮（beverage），坐在温暖的壁炉旁。突然，一个人坐在了他的对面——竟然是他十年未见的高中挚友米娅！这真是一场令人惊叹的奇妙巧合（coincidence）。米娅温柔地笑了笑，凑近耳语（whisper）了一个关于她丢失画册的小秘密。利奥深知，这场美好的意外邂逅（serendipity）将彻底点亮他的一整个星期。',
    vocabularyNotes: [
      {
        word: 'aroma',
        meaning: '芳香，香气',
        contextTip: '文中用来形容咖啡馆中扑鼻而来的浓郁香气，具有温馨的画面感。',
      },
      {
        word: 'beverage',
        meaning: '饮料',
        contextTip: '泛指咖啡、茶、果汁等所有饮品，比单纯用 drink 更地道正式。',
      },
      {
        word: 'coincidence',
        meaning: '巧合，同时发生',
        contextTip: '用于十年不见的老友在咖啡馆偶遇的桥段，突显戏剧性的机缘。',
      },
      {
        word: 'whisper',
        meaning: '低语，耳语',
        contextTip: '动作描写，营造两人分享私密话题时的亲近感。',
      },
      {
        word: 'serendipity',
        meaning: '意外发现美好事物的机缘',
        contextTip: '故事核心精神，指不期而至的美好相遇与生活中的小确幸。',
      },
    ],
    quiz: {
      question: 'Why did Leo feel this meeting was pure "serendipity"?',
      options: [
        'Because he lost his wallet and found it under the table',
        'Because he unexpectedly reunited with his long-lost best friend in a rainy cafe',
        'Because the coffee shop offered free beverages on rainy days',
        'Because the aroma gave him inspiration to write a book',
      ],
      answerIndex: 1,
      explanation: 'Serendipity 指“意外的美好机缘”。在暴雨天意外重逢十年未见的老友，正是最完美的诠释！',
    },
  },
  {
    id: 'story-2',
    title: 'The Ten-Minute Breakthrough',
    titleCn: '十分钟逆袭的职场提案',
    category: 'workplace',
    tag: '职场思维',
    intro: '面对迫在眉睫的系统崩溃与截止时间，技术主管如何力挽狂澜达成团队共识？',
    targetWordIds: ['w-work-1', 'w-work-2', 'w-work-3', 'w-work-4', 'w-work-5'],
    targetWords: ['bottleneck', 'innovative', 'consensus', 'milestone', 'leverage'],
    contentEn:
      'The engineering team was exhausted. Their legacy server was facing a severe bottleneck that threatened to crash during product launch. Standing before the board, Sarah presented an innovative cloud partitioning strategy. Instead of panic, she showed the team how to leverage intelligent auto-scaling algorithms. After a spirited debate, the stakeholders reached a unanimous consensus. When the system went live seamlessly at midnight, it marked the most unforgettable milestone in their company’s history.',
    contentCn:
      '工程团队已经精疲力竭。他们老旧的服务器正面临严重的性能瓶颈（bottleneck），眼看就要在发布会上崩溃。站在董事会面前，莎拉展示了一套创新的（innovative）云端分区策略。她没有慌乱，而是教团队如何充分利用（leverage）智能弹性扩缩容算法。经过一番热烈讨论，利益相关者们终于达成了一致共识（consensus）。当系统在午夜平稳无误地上线时，这标志着公司历史上最令人难忘的一个重大里程碑（milestone）。',
    vocabularyNotes: [
      {
        word: 'bottleneck',
        meaning: '瓶颈，阻碍因素',
        contextTip: '形象指代卡住整个系统吞吐量或项目进度的核心卡点。',
      },
      {
        word: 'innovative',
        meaning: '创新的，革新性的',
        contextTip: '形容打破传统陈规、用新方法解决顽疾的方案。',
      },
      {
        word: 'leverage',
        meaning: '充分利用，发挥杠杆作用',
        contextTip: '职场与高阶口语高频词，意为“借助现成资源实现几何级效果”。',
      },
      {
        word: 'consensus',
        meaning: '共识，一致意见',
        contextTip: 'reach a consensus 是固定黄金搭配，表示各方达成统一决议。',
      },
      {
        word: 'milestone',
        meaning: '里程碑，关键转折点',
        contextTip: '用于庆祝重大阶段性成果（如系统成功上线、拿到融资等）。',
      },
    ],
    quiz: {
      question: 'What strategy did Sarah propose to solve the system bottleneck?',
      options: [
        'Buying hundreds of expensive hardware computers',
        'Postponing the product launch for half a year',
        'An innovative cloud partitioning strategy leveraging auto-scaling',
        'Cancelling the presentation completely',
      ],
      answerIndex: 2,
      explanation: 'Sarah 提出了创新的云分区架构并 leverage（利用）了弹性扩容算法，解决了 bottleneck。',
    },
  },
  {
    id: 'story-3',
    title: 'The Alchemy of the Starlight Portal',
    titleCn: '星光传送门的炼金魔法',
    category: 'fantasy',
    tag: '奇幻冒险',
    intro: '在古老魔法学院的地下秘室，见习巫师点燃了寻找时空奥秘的微光。',
    targetWordIds: ['w-fan-1', 'w-fan-2', 'w-fan-3', 'w-fan-4', 'w-fan-5'],
    targetWords: ['enchantment', 'alchemy', 'invisible', 'portal', 'ingredient'],
    contentEn:
      'Deep inside the underground academy library, apprentice Felix opened a glowing grimoire. He was studying ancient alchemy to unlock the secrets of interdimensional travel. To brew the legendary serum, he required one final sacred ingredient: moonlit stardust. As he chanted the ancient enchantment, the magical runes shimmered and an invisible force ripped through the chamber air. Right before his eyes, a swirling blue portal appeared, leading directly into a galaxy of floating crystal islands.',
    contentCn:
      '在魔法学院地下图书馆的深处，见习巫师菲利克斯翻开了一本泛着微光的魔法古籍。他正在钻研古代炼金术（alchemy），渴望解开跨维度穿梭的秘密。为了调制出那款传奇药剂，他还需要最后一样神圣原料（ingredient）：月光星尘。当他低声吟唱起古老的附魔咒语（enchantment），魔法符文闪烁发光，一股隐形的（invisible）能量撕裂了密室的空气。就在他的眼前，一道旋转的蓝色时空传送门（portal）轰然开启，直通浮空水晶岛屿星系。',
    vocabularyNotes: [
      {
        word: 'alchemy',
        meaning: '炼金术，奇妙转化',
        contextTip: '充满奇幻色彩的高级词汇，常用于魔法、物质合成等背景。',
      },
      {
        word: 'ingredient',
        meaning: '原料，成分',
        contextTip: '不仅可用于烹饪食材，在魔法药剂或工业配方中也极常用。',
      },
      {
        word: 'enchantment',
        meaning: '魔法，附魔咒语，魅力',
        contextTip: '既指法师施展的魔法，也可喻指让人神魂颠倒的迷人氛围。',
      },
      {
        word: 'invisible',
        meaning: '隐形的，看不见的',
        contextTip: 'in- (否定) + visible (可见的)，形容肉眼无法察觉的力量。',
      },
      {
        word: 'portal',
        meaning: '传送门，时空入口',
        contextTip: '科幻/奇幻中连接两个世界的维度入口。',
      },
    ],
    quiz: {
      question: 'What appeared right in front of Felix after chanting the enchantment?',
      options: [
        'A ferocious dragon breathing green fire',
        'A swirling blue portal leading to crystal islands',
        'A cup of black coffee on his desk',
        'An empty broken bottle of potion',
      ],
      answerIndex: 1,
      explanation: '吟唱完 enchantment 咒语后，一道旋转的蓝色时空传送门（portal）浮现在眼前。',
    },
  },
  {
    id: 'story-4',
    title: 'The Highland Expedition',
    titleCn: '苏格兰高地的如画探险',
    category: 'travel',
    tag: '旅行探索',
    intro: '航班延误并未浇灭探险者的热情，一趟如诗如画的高地徒步之旅就此展开。',
    targetWordIds: ['w-travel-1', 'w-travel-5', 'w-travel-6', 'w-travel-7', 'w-travel-8'],
    targetWords: ['boarding', 'picturesque', 'souvenir', 'delayed', 'expedition'],
    contentEn:
      'Though our morning flight was delayed due to highland mist, the excitement never faded. Once boarding was complete, the turboprop plane soared above emerald glens. We kicked off our five-day hiking expedition across the rugged wilderness. Along the trail, we stopped by picturesque stone villages where sheep grazed lazily beside crystal streams. Before heading home, I picked up a hand-carved wooden compass as a cherished souvenir to commemorate this journey.',
    contentCn:
      '尽管我们的早班飞机因为高地大雾被延误（delayed）了，但大家的兴奋丝毫没有消退。登机（boarding）完毕后，涡桨飞机在翡翠般的峡谷上空翱翔。我们开启了穿越崎岖荒野的五日徒步探险（expedition）。沿途，我们驻足在一个个如诗如画的（picturesque）石头古村落，小羊在清澈溪流旁慵懒吃草。返程前，我挑了一个手工雕刻的木质罗盘作为珍贵的纪念品（souvenir），用以纪念这段壮丽旅途。',
    vocabularyNotes: [
      {
        word: 'delayed',
        meaning: '延误的，推迟的',
        contextTip: '旅行与出行中最常见的状态词，如航班/火车延误。',
      },
      {
        word: 'boarding',
        meaning: '登机，上船',
        contextTip: 'boarding pass (登机牌), boarding gate (登机口)。',
      },
      {
        word: 'expedition',
        meaning: '探险考察，远征',
        contextTip: '相比普通 trip，expedition 带有探索未知、挑战自然的探险精神。',
      },
      {
        word: 'picturesque',
        meaning: '风景如画的',
        contextTip: '写作描写自然风光或古朴小镇的高分绝佳形容词。',
      },
      {
        word: 'souvenir',
        meaning: '纪念品，伴手礼',
        contextTip: '旅行中留作纪念的小礼物或手工艺品。',
      },
    ],
    quiz: {
      question: 'What did the traveler buy as a souvenir before heading home?',
      options: [
        'A box of highland tea bags',
        'A wool scarf with tartan patterns',
        'A hand-carved wooden compass',
        'A ticket for the next flight',
      ],
      answerIndex: 2,
      explanation: '主人公买了一个手工雕刻的木质罗盘（hand-carved wooden compass）作为 souvenir 纪念品。',
    },
  },
  {
    id: 'story-5',
    title: 'Echoes of Nostalgia and Hope',
    titleCn: '旧时光的回响与韧性之光',
    category: 'emotion',
    tag: '心灵情感',
    intro: '面对人生的波折与迷茫，同理心与乐观心态如何唤醒内心深处的韧性？',
    targetWordIds: ['w-emo-1', 'w-emo-2', 'w-emo-3', 'w-emo-4', 'w-emo-6'],
    targetWords: ['nostalgia', 'resilience', 'empathy', 'euphoria', 'optimism'],
    contentEn:
      'Looking at the faded family album in the attic brought an overwhelming wave of nostalgia. Life had tested David with setbacks, but his inner resilience never faltered. Through genuine empathy, he listened to his friends’ struggles and supported them through dark hours. His infectious optimism always reminded everyone that storms will pass. When his new community art project finally succeeded, a sense of profound euphoria warmed everyone’s heart.',
    contentCn:
      '在阁楼翻看泛黄的家庭相册，勾起了一阵浓烈温暖的怀旧之情（nostalgia）。生活曾用挫折考验过大卫，但他内心的坚韧（resilience）从未动摇。凭借真诚的同理心（empathy），他倾听朋友们的困境，并在黑暗时刻陪伴他们。他富有感染力的乐观心态（optimism）时刻提醒大家风雨终将过去。当他的全新社区艺术项目终于取得成功时，一种由衷的狂喜与欣慰（euphoria）温暖了在场所有人的心。',
    vocabularyNotes: [
      {
        word: 'nostalgia',
        meaning: '怀旧之情，思乡',
        contextTip: '翻看老照片、听老歌时涌上心头的复古温存情感。',
      },
      {
        word: 'resilience',
        meaning: '韧性，复原力',
        contextTip: '在心理学和日常中用来形容人跌入低谷后重新站起的能力。',
      },
      {
        word: 'empathy',
        meaning: '同理心，共情',
        contextTip: '比 sympathy (同情) 更深层次，指真正走进他人内心、设身处地感受对方。',
      },
      {
        word: 'optimism',
        meaning: '乐观主义',
        contextTip: '积极看待未来、相信一切都会变好的阳光心态。',
      },
      {
        word: 'euphoria',
        meaning: '极度愉悦，狂喜',
        contextTip: '形容目标达成或巅峰体验时那种全身心通透的巨大幸福感。',
      },
    ],
    quiz: {
      question: 'What quality helped David bounce back from life setbacks without faltering?',
      options: [
        'His large financial fortune',
        'His inner emotional resilience and infectious optimism',
        'His strict exercise routine',
        'Moving away to another country',
      ],
      answerIndex: 1,
      explanation: '大卫内心的坚韧复原力（resilience）与乐观（optimism）支撑他度过了人生的挫折与考验。',
    },
  },
];
