// src/routes/projekte/[projektId]/aufgaben/erstellen/+page.server.js

import db from '$lib/server/db.js';
import { fail, redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb'; // Importieren, falls später die projektId hier validieren/umwandeln werden soll

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const projektId = params.projektId;
    console.log(`Load-Funktion für "Aufgabe erstellen" aufgerufen für Projekt-ID: ${projektId}`);

    if (!projektId || !ObjectId.isValid(projektId)) {
        throw svelteKitError(404, 'Projekt nicht gefunden oder ungültige ID');
    }

    try {
        const projekt = await db.getProjektById(projektId);

        if (!projekt) {
            throw svelteKitError(404, 'Projekt nicht gefunden');
        }

        return {
            projektId: projektId, // ProjektID >> ID wird aufjeden Fall zu Sicherheit behalten. 
            projektName: projekt.name // Den Projektnamen übergeben
        };
    } catch (err) {
        // Fehlerbehandlung, falls db.getProjektById fehlschlägt oder ein anderer Fehler auftritt
        if (err.status) { // Wenn es schon ein SvelteKit error ist
            throw err;
        }
        console.error("Fehler beim Laden des Projekts für Aufgabenformular:", err);
        throw svelteKitError(500, err.message || 'Fehler beim Laden der Projektdaten.');
    }
}
export const actions = {
    // Wir verwenden die default-Action, da diese Seite nur einen Zweck hat: Aufgabe erstellen.
    default: async ({ request, params }) => {
        const formData = await request.formData();
        const projektId = params.projektId;

        const titel = formData.get('titel')?.toString();
        const beschreibung = formData.get('beschreibung')?.toString();
        const status = formData.get('status')?.toString() || 'Offen'; // Standardwert
        const prioritaet = formData.get('prioritaet')?.toString();
        const faelligkeitsDatumString = formData.get('faelligkeitsDatum')?.toString();

        console.log(`Action "Aufgabe erstellen" für Projekt ${projektId} aufgerufen.`);

        // --- Validierung ---
        if (!titel || titel.trim() === '') {
            return fail(400, {
                isError: true,
                errorMessage: 'Titel ist ein Pflichtfeld.',
                fieldWithError: 'titel',
                // Bereits eingegebene Daten zurückgeben
                titel, beschreibung, status, prioritaet, faelligkeitsDatum: faelligkeitsDatumString
            });
        }

        const aufgabenDaten = {
            titel: titel.trim(),
            beschreibung: beschreibung?.trim() || null,
            status,
            prioritaet: prioritaet || null, // null wenn nicht angegeben
            faelligkeitsDatum: faelligkeitsDatumString ? new Date(faelligkeitsDatumString) : null,
            // projektId wird in db.addAufgabe als ObjectId erwartet oder dort konvertiert.
            // db.addAufgabe-Funktion erwartet, dass projektId in aufgabenDaten ist
            // und konvertiert es selbst zu ObjectId.
            projektId: projektId
        };

        try {
            await db.addAufgabe(aufgabenDaten);
            console.log('Neue Aufgabe erfolgreich in Action gespeichert.');

            // Erfolgsmeldung für Pop-up im Client
            // KEIN REDIRECT HIER, das macht die Client-Seite nach dem Pop-up.
            return {
                success: true,
                message: 'Aufgabe erfolgreich erstellt!'
                // Die projektId für die Weiterleitung ist im Client bereits durch 'data.projektId' bekannt
            };

        } catch (error) {
            console.error('Fehler beim Speichern der Aufgabe:', error);
            return fail(500, {
                isError: true,
                errorMessage: error.message || 'Fehler beim Speichern der Aufgabe.',
                titel, beschreibung, status, prioritaet, faelligkeitsDatum: faelligkeitsDatumString
            });
        }
    }
};