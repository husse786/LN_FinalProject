<script>
    //@runes // Runes-Modus explizit deklarieren

    // Props mit der $props() Rune empfangen
    // Die erwartete Prop 'projektStatistiken' wird aus dem $props()-Objekt destrukturiert.
    const { projektStatistiken } = $props();

    // Abgeleitete Zustände basierend auf der projektStatistiken-Prop
    let statCounts = $derived(projektStatistiken?.statusCounts || {});
    let hochCount = $derived(projektStatistiken?.hochPrioritaetCount || 0);
    let gesamtGestarteteProjekte = $derived(projektStatistiken?.anzahlGestarteterProjekte || 0);

    // Farbzuordnung für Status
    const statusFarben = {
        'Planung': 'bg-secondary',
        'In Arbeit': 'bg-primary',
        'Angehalten': 'bg-warning text-dark',
        'Abgeschlossen': 'bg-success',
        'Abgebrochen': 'bg-danger'
    };
</script>

<div class="card h-100 shadow-sm">
    <div class="card-header bg-light">
        <h5 class="mb-0">Projekt-Statusübersicht</h5>
    </div>
    <div class="card-body">
        {#if gesamtGestarteteProjekte > 0}
            <p>Von <strong>{gesamtGestarteteProjekte}</strong> gestarteten Projekten (deren Startdatum vor heute liegt):</p>
            
            {#if Object.keys(statCounts).length > 0}
                <h6>Statusverteilung:</h6>
                <ul class="list-unstyled mb-3">
                    {#each Object.entries(statCounts) as [status, anzahl]}
                        <li>
                            {status}: 
                            <span class="badge {statusFarben[status] || 'bg-light text-dark'} fs-6">{anzahl}</span>
                        </li>
                    {/each}
                </ul>
                <div class="progress-stacked mb-3" style="height: 25px;">
                    {#each Object.entries(statCounts) as [status, anzahl]}
                        {@const prozent = (anzahl / gesamtGestarteteProjekte) * 100}
                        <div 
                            class="progress-bar {statusFarben[status] || 'bg-light text-dark'}" 
                            role="progressbar" 
                            style="width: {prozent}%" 
                            aria-valuenow={prozent} 
                            aria-valuemin="0" 
                            aria-valuemax="100"
                            title="{status}: {anzahl} ({prozent.toFixed(1)}%)"
                        >
                           </div>
                    {/each}
                </div>
            {:else}
                <p class="text-muted">Keine Statusdaten für die relevanten Projekte vorhanden.</p>
            {/if}

            <hr>
            <h6>Wichtige Projekte:</h6>
            <p>
                Anzahl relevanter Projekte mit hoher Priorität: 
                <span class="badge bg-danger fs-6">{hochCount}</span>
            </p>
        {:else}
            <p class="text-muted fst-italic">Aktuell gibt es keine Projekte, die vor heute gestartet wurden, um Statistiken anzuzeigen.</p>
        {/if}
    </div>
    <div class="card-footer bg-light text-end">
        <a href="/projekte" class="btn btn-sm btn-outline-primary">Alle Projekte anzeigen</a>
    </div>
</div>

<style>
    .card-header h5 {
        font-weight: 500;
    }
    .progress-bar {
        font-size: 0.7rem;
        color: white;
        font-weight: bold;
        overflow: visible;
    }
    /* Der Screenshot zeigt auch "Do not use empty rulesets css(emptyRules)".
       Wenn Ihr <style>-Block hier leer ist, können Sie ihn entfernen oder diese Beispiel-Styles behalten/anpassen.
       Falls der <style>-Block in der Datei leer war, können Sie ihn komplett löschen, um die zweite Warnung zu beheben.
       Ich habe hier die Styles belassen, die ich im vorherigen Schritt vorgeschlagen hatte. */
</style>