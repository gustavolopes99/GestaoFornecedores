# Stage 1: Build a aplicação React com Vite
# Usamos uma imagem 'build' para instalar dependências e gerar os arquivos estáticos.
FROM node:18-alpine AS build

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN npm run build

# Stage 2: Servir os arquivos estáticos com um servidor leve
# A imagem final é menor porque não contém as dependências de desenvolvimento.
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve
EXPOSE 3000
# O comando para iniciar o servidor (serve -s dist -l 3000) será dado no docker-compose.yml