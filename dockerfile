FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY frontend/ ./frontend/
COPY backend/  ./backend/

RUN npm run setup

# ────────────────────────────────────────
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app
#RUN npm run start
# Only copy the built backend + embedded frontend
COPY --from=builder /app/backend .
COPY --from=builder /app/frontend/dist ./dist/dist


# Install prod deps only (important!)
RUN npm install  


EXPOSE 3001



# Most common patterns – pick one:
#CMD ["node", "index.js"]
CMD ["node", "dist/index.js"]
#CMD ["npm", "start"]