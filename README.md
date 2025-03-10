# Web App - Instrukcja Instalacji

## Wymagania:
- Node.js (https://nodejs.org/)
- MySQL lub inny kompatybilny system baz danych

## Instalacja:
1. **Sklonuj repozytorium**:
   ```sh
   git clone https://github.com/twoj-username/web-app-test.git
2. Przejdż do folderu projecktu:
   `cd test-baza-danych`

3. Zainstaluj zależności Node.js:
   `npm install`

4. Załaduj bazę danych:
   Otwórz MySQL i utrórz nową bazę danych.
   Zaimportuj plik .sql:
   `mysql -u użytkownik -p nazwa_bazy < database.sql`

5. Uruchom aplikację (jeśli jest dostępny skrypt startowy):
   `npm start`

6. Otwórz plik HTML w przeglądarce lub uruchom servwe, jeśli wymagany.
   
Uwagi:
Sprawdź plik konfiguracyjny połączenia z bazą danych (config.js, env, lub backend), jeśli jest potrzebny.
W razie problemów sprawdź wersję Node.js oraz zależności w package.json.
📧 W razie pytań skontaktuj się z zespołem!

markdown
Copy
Edit

---

### **Jak zaktualizować README.md?**
#### **Opcja 1: Bezpośrednio na GitHub**
1. Otwórz repozytorium na **GitHub**.
2. Kliknij na plik **README.md**.
3. Kliknij przycisk **"Edit" (Ikona ołówka)**.
4. Wklej nową treść i kliknij **"Commit changes"**.

#### **Opcja 2: Lokalnie i Push na GitHub**
1. **Otwórz terminal** i przejdź do folderu projektu:
   ```sh
   cd path/to/your/project
Edytuj plik README.md (np. w Notepad++, VS Code, czy innym edytorze).
Zapisz zmiany i dodaj do Git:
sh
Copy
Edit
git add README.md
git commit -m "Zaktualizowano README.md"
git push origin main
