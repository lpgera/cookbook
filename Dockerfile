FROM --platform=$BUILDPLATFORM node:18 as FRONTEND

WORKDIR /usr/src/app

COPY package*.json ./
COPY frontend/package.json frontend/

RUN npm ci

COPY frontend frontend

RUN npm run build -w frontend

FROM node:18 as DEPENDENCIES

WORKDIR /usr/src/app

COPY package*.json ./
COPY backend/package.json backend/

RUN npm ci --omit=dev

COPY . .

FROM node:18-alpine as TARGET

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --from=DEPENDENCIES /usr/src/app ./

COPY --from=FRONTEND /usr/src/app/frontend/build frontend/build

CMD ["npm", "run", "start", "-w", "backend"]
