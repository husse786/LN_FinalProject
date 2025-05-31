//src/routes/+page.server.js (Dashboard-Seite)

import db from '$lib/server/db.js'; // Datenbank-Service

/** @type {import('./$types').PageServerLoad} */

export async function load() {
    console.log('Load-Funktion für Dashboard (/) aufgerufen.');
    try {
        const alleProjekte = await db.getAlleProjekte();

        // Heutiges Datum ohne Zeitanteil für den Vergleich
        const heute = new Date();
        heute.setHours(0, 0, 0, 0); // Setzt die Zeit auf Mitternacht

        // 1. Projekte filtern: Nur Projekte, deren startDatum vor heute liegt
        const gestarteteProjekte = alleProjekte.filter(projekt => {
            if (!projekt.startDatum) {
                return false; // Projekte ohne Startdatum ausschließen
            }
            const startDatumProjekt = new Date(projekt.startDatum);
            startDatumProjekt.setHours(0, 0, 0, 0); // Zeitanteil für genauen Tagesvergleich entfernen
            return startDatumProjekt < heute;
        });

        // 2. Daten für das Status-Tortendiagramm aggregieren (basierend auf gefilterten Projekten)
        const statusCounts = gestarteteProjekte.reduce((acc, projekt) => {
            acc[projekt.status] = (acc[projekt.status] || 0) + 1;
            return acc;
        }, {});
        // Beispiel für statusCounts: { "In Arbeit": 2, "Planung": 1, "Abgeschlossen": 5 }

        // 3. Anzahl der Projekte mit hoher Priorität zählen (basierend auf gefilterten Projekten)
        const hochPrioritaetCount = gestarteteProjekte.filter(
            (projekt) => projekt.prioritaet === 'Hoch'
        ).length;

        // Datenobjekt für das Dashboard zusammenstellen
        const dashboardData = {
            projektStatistiken: {
                statusCounts,
                hochPrioritaetCount,
                anzahlGestarteterProjekte: gestarteteProjekte.length
            }
        };

        return {
            dashboardData
        };

    } catch (error) {
        console.error('Fehler beim Laden der Dashboard-Daten:', error.message);
        return {
            dashboardData: null,
            error: { message: 'Fehler beim Laden der Dashboard-Daten.' }
        };
    }
}