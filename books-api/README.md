Automobilių nuomos svetainės dokumentacija
1. Projekto aprašymas
Pavadinimas: Automobilių nuomos paslauga
Aprašymas: Žiniatinklio programa, skirta automobilių nuomai su rezervavimo galimybe.
Tikslinė auditorija: Žmonės, kuriems reikia išsinuomoti automobilį.
2. Naudojamos technologijos
Frontend: React
Backend: Node.js, Express
Duomenų bazė: MongoDB Atlas
Papildomai: CORS, Multer (failų įkėlimui), nodemon (automatinis backend perkrovimas)
3. Pagrindinės funkcijos
✅ Galimybė peržiūrėti turimus automobilius
✅ Automobilio rezervacija
✅ Užrezervuotų automobilių sąrašas
✅ Rezervacijos atšaukimas
✅ Rezervacijos statuso valdymas
✅ Kontaktinė forma žinutėms siųsti

4. API maršrutai

Automobilių maršrutai:

GET /cars – Gauti visų automobilių sąrašą
GET /cars/:id – Gauti informaciją apie konkretų automobilį
POST /cars – Pridėti naują automobilį (su nuotrauka)
PUT /cars/:id – Atnaujinti automobilio duomenis
DELETE /cars/:id – Ištrinti automobilį

Rezervacijų maršrutai:

GET /cars/reserved-cars – Gauti užrezervuotų automobilių sąrašą
POST /cars/reserve – Rezervuoti automobilį
PUT /cars/reservation/:id – Atnaujinti rezervaciją (datos ir kaina)
PUT /cars/reservation/:id/status – Pakeisti rezervacijos statusą
DELETE /cars/reservation/:id – Atšaukti rezervaciją

Kontaktinių žinučių maršrutai:

POST /api/contact – Siųsti žinutę
GET /api/contact – Gauti žinučių sąrašą
GET /api – Gauti visas žinutes
DELETE /api/contact/:id – Ištrinti žinutę

5. Diegimas ir paleidimas
📥 Projekto paruošimas
Nukopijuokite projektą:

git clone <repo-url>
cd <project-folder>
Įdiekite priklausomybes:
    -npm install


🚀 Paleidimas
🔹 Standartinis paleidimas
    -npm start


Backend veiks adresu http://localhost:5555, frontend – http://localhost:3000.

🔥 Paleidimas su nodemon (rekomenduojama backend'ui)
Jei norite, kad backend automatiškai persikrautų po pakeitimų:
   -npm run dev
(Jei nodemon nėra įdiegtas, įdiekite jį su: npm install -g nodemon)

package.json galite pridėti skriptą:
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}

json


"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
6. Naudotojų rolės
Šiuo metu rolės nėra – visi maršrutai prieinami be autentifikacijos.

7.Tolimesni patobulinimai
✅ Rolių sistemos pridėjimas (administratorius, vartotojas)

✅ UI/UX patobulinimas
