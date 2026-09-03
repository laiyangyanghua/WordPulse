# 阶段 1: 构建
FROM node:20-alpine AS builder
WORKDIR /app

# 复制依赖配置并安装
COPY package*.json ./
RUN npm ci

# 复制源代码并执行全量打包构建
COPY . .
RUN npm run build

# 阶段 2: 运行镜像
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# 复制必要运行时依赖
COPY package*.json ./
RUN npm ci --omit=dev

# 从构建阶段复制打包好的产物
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
