# Stage 1: Build Angular
FROM node:20 AS client-build
WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ ./
RUN npx ng build client --configuration production

# Stage 2: Build .NET API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY API/*.csproj ./API/
RUN dotnet restore ./API/API.csproj

COPY API/. ./API/
WORKDIR /app/API
RUN dotnet publish -c Release -o /publish

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /publish .
COPY --from=client-build /app/client/dist/client/browser /app/wwwroot

ENTRYPOINT ["dotnet", "API.dll"]