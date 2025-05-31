// src/routes/projekte/[projektId]/bearbeiten/+page.server.js

import db from '$lib/server/db.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const projektId = params.projektId;
    console.log(`Load-Funktion für Projekt BEARBEITEN aufgerufen. Projekt-ID: ${projektId}`);

    if (!projektId) {
        console.error('Keine Projekt-ID in params für Bearbeiten-Seite gefunden.');
        throw error(400, { message: 'Ungültige Anfrage: Projekt-ID fehlt.' });
    }

    try {
        const projekt = await db.getProjektById(projektId);

        if (!projekt) {
            console.warn(`Bearbeiten-Seite: Projekt mit ID ${projektId} nicht gefunden.`);
            throw error(404, { message: 'Zu bearbeitendes Projekt nicht gefunden' });
        }

        // Das gefundene Projekt wird an die +page.svelte Komponente übergeben
        // und ist dort via 'data.projekt' verfügbar, um das Formular vorab auszufüllen.
        return {
            projekt: projekt
        };

    } catch (err) {
        if (err.status) { 
            throw err; 
        }
        console.error(`Unerwarteter Fehler beim Laden des Projekts ${projektId} zum Bearbeiten:`, err.message);
        throw error(500, { message: `Ein interner Fehler ist aufgetreten beim Laden des Projekts zum Bearbeiten: ${err.message}` });
    }
}
