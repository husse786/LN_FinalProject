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

export const actions = {
    /**
     * Standard-Action zum Aktualisieren eines Projekts.
     * Wird aufgerufen, wenn das Formular auf dieser Seite abgeschickt wird
     * (z.B. mit method="POST" ohne spezifische action="?/andereAction")
     * oder explizit mit action="?/update" (wenn wir es 'update' nennen).
     * Wir nennen sie hier 'default', damit kein expliziter Action-Name im Formular nötig ist,
     * oder 'update', was klarer ist. Nehmen wir 'update'.
     */
    update: async ({ request, params }) => {
        const projektId = params.projektId;
        const formData = await request.formData();

        // Formulardaten extrahieren
        const name = formData.get('name')?.toString();
        const beschreibung = formData.get('beschreibung')?.toString();
        const status = formData.get('status')?.toString();
        const prioritaet = formData.get('prioritaet')?.toString();
        const startDatumString = formData.get('startDatum')?.toString();
        const endDatumGeplantString = formData.get('endDatumGeplant')?.toString();
        const projektIcon = formData.get('projektIcon')?.toString() || '';

        console.log(`Update-Action für Projekt-ID ${projektId} aufgerufen.`);

        // --- Validierung der Formulardaten (ähnlich wie beim Erstellen) ---
        if (!name || name.trim() === '') {
            return fail(400, {
                isError: true,
                errorMessage: 'Projektname ist ein Pflichtfeld.',
                fieldWithError: 'name',
                // Ursprüngliche Daten für das Formular zurückgeben
                name, beschreibung, status, prioritaet, startDatum: startDatumString, endDatumGeplant: endDatumGeplantString, projektIcon
            });
        }
        if (!status || status.trim() === '') {
            return fail(400, {
                isError: true,
                errorMessage: 'Status ist ein Pflichtfeld.',
                fieldWithError: 'status',
                name, beschreibung, status, prioritaet, startDatum: startDatumString, endDatumGeplant: endDatumGeplantString, projektIcon
            });
        }
        // Hier können weitere Validierungen implementiert werden

        // Datenobjekt für das Update vorbereiten
        // Nur die Felder übergeben, die auch geändert werden können.
        // 'erstelltAm' sollte nicht geändert werden. 'zuletztBearbeitetAm' wird in db.updateProjekt gesetzt.
        const datenZumAktualisieren = {
            name: name.trim(),
            beschreibung: beschreibung?.trim() || null,
            status,
            prioritaet,
            startDatum: startDatumString ? new Date(startDatumString) : null,
            endDatumGeplant: endDatumGeplantString ? new Date(endDatumGeplantString) : null,
            projektIcon: projektIcon || null,
            // endDatumTatsaechlich könnte hier auch noch berücksichtigt werden, wenn es im Formular änderbar ist.
        };

        try {
            const updateResult = await db.updateProjekt(projektId, datenZumAktualisieren);

            if (updateResult.matchedCount === 0) {
                // Dieser Fall wird eigentlich schon von db.updateProjekt abgefangen, aber zur Sicherheit
                return fail(404, {
                    isError: true,
                    errorMessage: 'Projekt zum Aktualisieren nicht gefunden.',
                    name, beschreibung, status, prioritaet, startDatum: startDatumString, endDatumGeplant: endDatumGeplantString, projektIcon
                });
            }

            console.log(`Projekt ${projektId} erfolgreich in Action aktualisiert.`);
            // Erfolgsmeldung und die ID des aktualisierten Projekts zurückgeben
            return {
                success: true,
                message: 'Projekt erfolgreich aktualisiert!',
                updatedProjektId: projektId // Nützlich für die clientseitige Weiterleitung
            };

        } catch (error) {
            console.error(`Fehler beim Aktualisieren des Projekts ${projektId} in Action:`, error);
            return fail(500, {
                isError: true,
                errorMessage: error.message || 'Ein interner Fehler ist beim Aktualisieren des Projekts aufgetreten.',
                name, beschreibung, status, prioritaet, startDatum: startDatumString, endDatumGeplant: endDatumGeplantString, projektIcon
            });
        }
    }
};
