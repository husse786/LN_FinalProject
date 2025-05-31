<script>
    // Für dieses statische Widget sind aktuell keine Props oder komplexe Logik nötig.
    // Man kann aber z.B. ein Datum als Prop übergeben. OutofScope jetzt

    const placeholderDate = new Date().toLocaleDateString('de-CH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const placeholderText = "Heute war ein produktiver Tag!\n\n- Wichtige Aufgaben für Projekt 'Alpha' abgeschlossen.\n- Meeting mit dem Team erfolgreich durchgeführt.\n- Neue Ideen für das Dashboard-Design gesammelt...\n\nWas steht morgen an?\n- Vorbereitung für die Präsentation.\n- Recherche für Feature X.";
</script>

<div class="card h-100 shadow-sm">
    <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Tagesnotiz / Journal</h5>
        <span class="text-muted small">{placeholderDate}</span>
    </div>
    <div class="card-body journal-body">
        <p class="card-text journal-placeholder-text">
            {placeholderText}
        </p>
        </div>
    <div class="card-footer bg-light text-end">
        <button type="button" class="btn btn-sm btn-outline-secondary disabled" aria-disabled="true">Eintrag speichern (simuliert)</button>
    </div>
</div>

<style>
    .card-header h5 {
        font-weight: 500;
    }
    .journal-body {
        min-height: 200px; /* Mindesthöhe */
        line-height: 1.6;
    }
    .journal-placeholder-text {
        white-space: pre-wrap; /* Erhält Zeilenumbrüche im Placeholder-Text */
        font-size: 0.9rem;
        color: #495057; /* Dunkleres Grau */
    }
</style>