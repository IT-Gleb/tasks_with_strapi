FROM node:22-alpine AS base

# --- ШАГ 1: Установка зависимостей ---
FROM base AS deps
# Для работы некоторых библиотек (например, sharp) может потребоваться libc6-compat
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копируем файлы манифестов для установки зависимостей
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN echo "first fase 1"
RUN \
  if [ -f "package-lock.json" ]; then npm ci; \
  elif [ -f "yarn.lock" ]; then yarn --frozen-lockfile; \
  elif [ -f "pnpm-lock.yaml" ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# --- ШАГ 2: Сборка приложения ---
RUN echo "Сборка приложения"
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Читаем аргумент из docker-compose и превращаем его в ENV для сборщика Next.js
ARG NEXT_PUBLIC_STRAPI_CLIENT_API_URL
ENV NEXT_PUBLIC_STRAPI_CLIENT_API_URL=$NEXT_PUBLIC_STRAPI_CLIENT_API_URL

# Отключаем телеметрию Next.js во время сборки
ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f "package-lock.json" ]; then npm run build; \
  elif [ -f "yarn.lock" ]; then yarn build; \
  elif [ -f "pnpm-lock.yaml" ]; then corepack enable pnpm && pnpm build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# RUN if [ -f package-lock.json ]; then npm run build; else echo "Lockfile not found" && exit 1; fi  

# --- ШАГ 3: Финальный легковесный образ для продакшена ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Создаем безопасного системного пользователя для запуска процесса
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 myappjs

# Копируем только необходимые статические ресурсы и standalone-сервер
COPY --from=builder /app/public ./public

# Автоматически создаваемая папка standalone содержит минимальный код сервера
COPY --from=builder --chown=myappjs:nodejs /app/.next/standalone ./
#COPY --from=builder --chown=myappjs:nodejs /app/.next ./next
COPY --from=builder --chown=myappjs:nodejs /app/.next/static ./.next/static
# COPY --from=builder --chown=myappjs:nodejs /app/package.json ./

USER myappjs

EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Запуск приложения через встроенный сервер node
CMD ["node", "server.js"]
# CMD ["npm", "run", "start"]
#CMD ["node", "node_modules/.bin/next", "start"]
