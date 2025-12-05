# Zobacz https://aka.ms/customizecontainer, aby dowiedzieć się, jak dostosować kontener debugowania.

# Etap bazowy (runtime)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Etap build (kompilacja projektu)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# UWAGA: ŚCIEŻKI i NAZWA PROJEKTU zmienione na API.Alimed
COPY ["API.Alimed/API.Alimed.csproj", "API.Alimed/"]
RUN dotnet restore "./API.Alimed/API.Alimed.csproj"

COPY . .
WORKDIR "/src/API.Alimed"
RUN dotnet build "./API.Alimed.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Etap publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./API.Alimed.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Etap finalny (produkcyjny)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "API.Alimed.dll"]
