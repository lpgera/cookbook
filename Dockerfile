FROM --platform=$BUILDPLATFORM node:22 as FRONTEND

WORKDIR /usr/src/app

COPY package*.json ./
COPY frontend/package.json frontend/

RUN --mount=type=cache,target=/root/.npm npm ci

COPY frontend frontend

RUN npm run build -w frontend

FROM node:22 as DEPENDENCIES

WORKDIR /usr/src/app

COPY package*.json ./
COPY backend/package.json backend/

RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

COPY . .

RUN npx -w backend prisma generate

FROM node:22-slim as TARGET

RUN apt-get update && apt-get install -y openssl

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --from=DEPENDENCIES /usr/src/app ./

COPY --from=FRONTEND /usr/src/app/frontend/build frontend/build

CMD ["npm", "run", "start", "-w", "backend"]
