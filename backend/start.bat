@echo off
echo ========================================
echo   GestStock Backend - Demarrage
echo ========================================
echo.

echo Verification de PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] PostgreSQL n'est pas installe ou pas dans le PATH
    echo Consultez INSTALLATION_POSTGRESQL.md pour l'installation
    pause
    exit /b 1
)

echo [OK] PostgreSQL detecte
echo.

echo Verification de la base de donnees...
psql -U postgres -d geststock_db -c "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] La base de donnees geststock_db n'existe pas encore
    echo Creation de la base de donnees...
    psql -U postgres -c "CREATE DATABASE geststock_db;"
    if %errorlevel% neq 0 (
        echo [ERREUR] Impossible de creer la base de donnees
        echo Verifiez le mot de passe PostgreSQL dans .env
        pause
        exit /b 1
    )
    echo [OK] Base de donnees creee
)

echo [OK] Base de donnees prete
echo.

echo Initialisation des donnees de test...
call npm run seed
if %errorlevel% neq 0 (
    echo [ERREUR] Echec de l'initialisation
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Demarrage du serveur...
echo ========================================
echo.
echo Serveur disponible sur: http://localhost:3000
echo.
echo Credentials de test:
echo   Admin: admin@geststock.com / admin123
echo   Gestionnaire: gestionnaire@geststock.com / gestionnaire123
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

call npm run start:dev
