import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Lazy-initialize Gemini client to handle missing key gracefully
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: Date.now(),
  });
});

// API: Generate context story from custom chosen words
app.post('/api/generate-story', async (req: Request, res: Response) => {
  try {
    const { words, genre = 'Daily Life', style = 'humorous & engaging' } = req.body;

    if (!Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ error: '请提供至少1个生词用于串联场景。' });
    }

    const ai = getGenAI();
    if (!ai) {
      // Return a graceful simulated fallback response if no API key is set
      const wordList = words.slice(0, 6);
      return res.json({
        title: `A Special Journey with ${wordList[0]}`,
        titleCn: `一段关于 ${wordList.join('、')} 的奇妙场景`,
        contentEn: `In our everyday life, learning new words like ${wordList.join(', ')} helps us understand the world better. When you combine them in this scenario, your brain creates strong episodic memory links that stick forever!`,
        contentCn: `在日常生活中，将 ${wordList.join('、')} 这些词汇串联在具体情境中，大脑会形成强烈的情景记忆回路，让背单词变得生动持久。`,
        vocabularyNotes: wordList.map((w: string) => ({
          word: w,
          meaning: '重要目标词汇',
          contextTip: `在情景中多结合前后文感受 ${w} 的自然搭配。`,
        })),
        quiz: {
          question: `Which of these words best describes the key focus of this practice?`,
          options: [wordList[0] || 'Learning', 'Distraction', 'Confusion', 'Forgetfulness'],
          answerIndex: 0,
          explanation: `在情景记忆法中，主动复现目标词汇 ${wordList[0]} 是深化记忆的最佳手段。`,
        },
        isAiGenerated: false,
        note: '当前未检测到 GEMINI_API_KEY，已启动离线保底场景模板。配置密钥后可开启全智能无限生成！',
      });
    }

    const prompt = `你是一位顶级英语教学专家和创意故事作家。请将用户给出的生词列表：${JSON.stringify(
      words
    )} 巧妙地编织进一个简短、情节生动有趣、画面感极强的微型情景故事中（题材风格：${genre}，基调：${style}）。

要求：
1. 必须在英文故事中自然融入这些生词，并保持语法地道、语境生动。
2. 英文短文大约 70~120 个英文单词，结构紧凑。
3. 提供精准地道的对应中文全文翻译，译文用括号标注对应英文生词。
4. 为每个目标生词提供词义及语境记忆提示（contextTip），指出其在故事中的巧妙用法。
5. 附带 1 道与故事情节或重点词汇相关的单选题（4个选项、正确答案索引 0-3、详细中文解析）。
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'English title of the story' },
            titleCn: { type: Type.STRING, description: 'Chinese title' },
            contentEn: { type: Type.STRING, description: 'English story paragraph with target words seamlessly integrated' },
            contentCn: { type: Type.STRING, description: 'Natural Chinese translation' },
            vocabularyNotes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                  contextTip: { type: Type.STRING },
                },
                required: ['word', 'meaning', 'contextTip'],
              },
            },
            quiz: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                answerIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ['question', 'options', 'answerIndex', 'explanation'],
            },
          },
          required: ['title', 'titleCn', 'contentEn', 'contentCn', 'vocabularyNotes'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini model returned empty response.');
    }

    const storyData = JSON.parse(text);
    return res.json({
      ...storyData,
      isAiGenerated: true,
      createdAt: Date.now(),
    });
  } catch (error: any) {
    console.error('Error generating story:', error);
    return res.status(500).json({
      error: '生成场景故事失败，请稍后重试。',
      details: error?.message || String(error),
    });
  }
});

// API: Auto-complete word metadata when user types a new word
app.post('/api/auto-complete-word', async (req: Request, res: Response) => {
  try {
    const { word } = req.body;
    if (!word || typeof word !== 'string') {
      return res.status(400).json({ error: 'Word is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        word: word.trim(),
        phonetic: `/${word.trim()}/`,
        meaning: '（请补充释义）',
        partOfSpeech: 'n./v.',
        exampleEn: `She used the word "${word.trim()}" in her essay.`,
        exampleCn: `她在文章中使用了单词“${word.trim()}”。`,
        mnemonic: `拆分词根或寻找谐音联想以加深记忆。`,
        category: 'custom',
        difficulty: 'medium',
      });
    }

    const prompt = `为英语单词 "${word.trim()}" 生成精练的学习词卡数据。包含：
1. 国际音标 (phonetic，如 /ˌser.ənˈdɪp.ə.ti/)
2. 核心中文释义 (meaning，简短精准，如 "意外发现美好事物的机缘")
3. 词性 (partOfSpeech，如 n. 或 v. 或 adj.)
4. 精彩例句 (exampleEn，地道生动)
5. 例句中文翻译 (exampleCn)
6. 记忆钩子/联想助记法 (mnemonic，生动幽默的谐音梗、词根拆解或画面联想法)
7. 推荐分类 (category: daily, workplace, travel, fantasy, emotion 中的一个)
8. 难度 (difficulty: easy, medium, hard 中的一个)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            phonetic: { type: Type.STRING },
            meaning: { type: Type.STRING },
            partOfSpeech: { type: Type.STRING },
            exampleEn: { type: Type.STRING },
            exampleCn: { type: Type.STRING },
            mnemonic: { type: Type.STRING },
            category: { type: Type.STRING },
            difficulty: { type: Type.STRING },
          },
          required: ['word', 'phonetic', 'meaning', 'partOfSpeech', 'exampleEn', 'exampleCn', 'mnemonic'],
        },
      },
    });

    const text = response.text;
    const parsed = JSON.parse(text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error auto completing word:', error);
    return res.status(500).json({ error: '自动补全单词失败', details: error?.message });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WordPulse server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
