FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx ng build --configuration=production

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist/ventas-frontend/browser ./browser
EXPOSE 3000
CMD ["serve", "-s", "browser", "-l", "3000"]
