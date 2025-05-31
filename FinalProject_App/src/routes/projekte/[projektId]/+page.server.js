// src/routes/projekte/[projektId]/+page.server.js

import db from '$lib/server/db.js'; // Unser Datenbank-Service-Objekt
import { error } from '@sveltejs/kit'; // SvelteKit's error helper für 404 etc.

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    console.log(`Load-Funktion für Projektdetailseite aufgerufen. Projekt-ID: ${params.projektId}`);

    const projektId = params.projektId;

    if (!projektId) {
        // Dieser Fall sollte durch das Routing eigentlich nicht eintreten.
        console.error('Keine Projekt-ID in params gefunden.');
        throw error(400, { message: 'Ungültige Anfrage: Projekt-ID fehlt.' });
    }

    try {
        const projekt = await db.getProjektById(projektId);

        if (!projekt) {
            // Wenn kein Projekt mit dieser ID gefunden wurde, einen 404-Fehler auslösen.
            // SvelteKit zeigt dann die Standard-Fehlerseite oder Ihre eigene $error.svelte an.
            console.warn(`Projekt mit ID ${projektId} nicht gefunden.`);
            throw error(404, { message: 'Projekt nicht gefunden' });
        }

        // Das gefundene Projekt wird an die +page.svelte Komponente übergeben
        // und ist dort via 'data.projekt' verfügbar.
        return {
            projekt: projekt
        };

    } catch (err) {
        // Hier wird  sowohl Fehler von db.getProjektById als auch die geworfenen 404-Fehler abgefangen.
        // Wenn es ein SvelteKit 'error' Objekt ist (von throw error(404,...)), wird es weitergereicht.
        // Andere Fehler werden als 500er behandelt.
        if (err.status) { // Prüft, ob es ein SvelteKit 'error' Objekt ist
            throw err; // SvelteKit Fehler direkt weiterwerfen
        }
        console.error(`Unerwarteter Fehler beim Laden des Projekts ${projektId}:`, err.message);
        throw error(500, { message: `Ein interner Fehler ist aufgetreten beim Laden des Projekts: ${err.message}` });
    }
}