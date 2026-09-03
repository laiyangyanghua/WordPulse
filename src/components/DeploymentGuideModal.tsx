import React, { useState } from 'react';
import { 
  Server, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  FolderGit2, 
  Globe
} from 'lucide-react';
import { sound } from '../services/sound';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    sound.playSelect();
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const nginxSnippet = `server {
    listen 80;
    server_name your-domain.com; # 替换为您的域名或公网 IP

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl space-y-4 animate-slide-up pb-safe">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">云服务器部署指南</h3>
              <p className="text-[11px] text-slate-400">支持 阿里云 / 腾讯云 / Linux VPS / PM2</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Instructions */}
        <div className="space-y-3 text-xs">
          
          {/* Step 1 */}
          <div className="bg-slate-850 p-3 rounded-2xl border border-slate-700/80 space-y-1">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Node.js 环境准备</span>
            </div>
            <p className="text-[11px] text-slate-400">
              在 Linux 服务器安装 <code className="text-indigo-300 font-mono">Node.js 18+ 或 20+</code>。
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-850 p-3 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
                <span>执行一键编译与启动</span>
              </div>
              <button
                onClick={() => copyToClipboard('npm install && npm run build && npm start', 1)}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 active:scale-95"
              >
                {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === 1 ? '已复制' : '复制代码'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-2.5 rounded-xl font-mono text-[11px] text-emerald-400 overflow-x-auto border border-slate-800">
              npm install{'\n'}
              npm run build{'\n'}
              npm start # 默认监听端口 3000
            </pre>
          </div>

          {/* Step 3: PM2 daemon */}
          <div className="bg-slate-850 p-3 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">3</span>
                <span>生产后台常驻 (PM2 守护)</span>
              </div>
              <button
                onClick={() => copyToClipboard('pm2 start dist/server.cjs --name "wordpulse"', 2)}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 active:scale-95"
              >
                {copiedIndex === 2 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === 2 ? '已复制' : '复制命令'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-2.5 rounded-xl font-mono text-[11px] text-indigo-300 overflow-x-auto border border-slate-800">
              npm install -g pm2{'\n'}
              pm2 start dist/server.cjs --name "wordpulse"
            </pre>
          </div>

          {/* Step 4: Nginx */}
          <div className="bg-slate-850 p-3 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">4</span>
                <span>Nginx 域名反向代理 (选配)</span>
              </div>
              <button
                onClick={() => copyToClipboard(nginxSnippet, 3)}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 active:scale-95"
              >
                {copiedIndex === 3 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === 3 ? '已复制' : '复制'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-2 rounded-xl font-mono text-[10px] text-slate-300 overflow-x-auto border border-slate-800">
              {nginxSnippet}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-indigo-600 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md"
          >
            知道了，返回应用
          </button>
        </div>
      </div>
    </div>
  );
};
