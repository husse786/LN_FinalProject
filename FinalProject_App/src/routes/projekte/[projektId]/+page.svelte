<script>

    // Daten von der load-Funktion via $props() empfangen
    let { data } = $props();

    // Abgeleiteter Zustand für das Projekt und mögliche Fehler
    let projekt = $derived(data?.projekt);
    let anzeigeFehler = $derived(data?.error);
    let aufgabenListe = $derived(data?.aufgaben || []); // Aufgabenliste ableiten

    let isDeleting = $state(false); // Für den Deaktivierungs-/Ladezustand des Löschen-Buttons

    // Hilfsfunktionen für Datumsformatierung
    function formatiereDatum(datumString, fallback = "N/A") {
        if (!datumString) return fallback;
        try {
            return new Date(datumString).toLocaleDateString('de-CH', {
                year: 'numeric', month: '2-digit', day: '2-digit'
            });
        } catch (e) {
            return datumString;
        }
    }

    function formatiereDatumZeit(datumString, fallback = "N/A") {
        if (!datumString) return fallback;
        try {
            return new Date(datumString).toLocaleString('de-CH', {
                year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
            });
        } catch (e) {
            return datumString;
        }
    }
</script>

<svelte:head>
    <title>{projekt ? `Projekt: ${projekt.name}` : (anzeigeFehler ? 'Fehler' : 'Lade Projektdetails...')}</title>
</svelte:head>

{#if anzeigeFehler}
    <div class="container mt-4">
        <div class="alert alert-danger" role="alert">
            <h4 class="alert-heading">Fehler!</h4>
            <p>{anzeigeFehler.message || "Das Projekt konnte nicht geladen werden."}</p>
            <a href="/projekte" class="btn btn-primary mt-2">Zurück zur Projektübersicht</a>
        </div>
    </div>
{:else if projekt}
    <div class="container mt-4 page-title-container">
        <h1 class="page-title-text">{projekt.name}</h1>
    </div>

    <div class="container mt-3 mb-5">
        <div class="row">
            <div class="col-lg-8">  <!-- Hauptspalte für Projektdetails UND Aufgaben -->
                <div class="card shadow-sm mb-4 project-detail-card">
                    <div class="card-body">
                        {#if projekt.projektIcon}
                            <div class="text-center mb-4">
                                <img 
                                    src="/images/projekt-icons/{projekt.projektIcon}" 
                                    alt="Icon für {projekt.name}" 
                                    class="project-icon-large"
                                />
                            </div>
                        {/if}
                        
                        <h5 class="text-muted mb-3">Beschreibung</h5>
                        <p class="project-description mb-4">{projekt.beschreibung || "Keine Beschreibung vorhanden."}</p>
                        
                        <hr class="my-4">

                        <div class="row project-meta-details">
                            <div class="col-md-6 mb-3">
                                <strong>Status:</strong> 
                                <span class="badge ms-2 fs-6 status-badge status-{projekt.status?.toLowerCase().replace(/\s+/g, '-')}">{projekt.status || "N/A"}</span>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Priorität:</strong>
                                <span class="ms-2">{projekt.prioritaet || "N/A"}</span>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Startdatum:</strong>
                                <span class="ms-2">{formatiereDatum(projekt.startDatum)}</span>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Geplantes Enddatum:</strong>
                                <span class="ms-2">{formatiereDatum(projekt.endDatumGeplant)}</span>

                            {#if projekt.endDatumTatsaechlich}
                                <br>
                                <strong>Tatsächliches Enddatum:</strong>
                                <span class="ms-2">{formatiereDatum(projekt.endDatumTatsaechlich)}</span>
                            {/if}
                            </div>
                        </div>
                        
                        <hr class="my-4">
                        <p class="text-muted small">
                            Erstellt: {formatiereDatumZeit(projekt.erstelltAm)}<br>
                            Zuletzt bearbeitet: {formatiereDatumZeit(projekt.zuletztBearbeitetAm)}
                        </p>
                    </div>
                </div> <!--Ende von project-detail-card -->

                <div class="mt-5 pt-4 border-top">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h3 class="mb-0">Zugehörige Aufgaben</h3>
                        {#if projekt}
                            <a href="/projekte/{projekt._id}/aufgaben/erstellen" class="btn btn-success btn-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg me-1" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                                </svg>
                                Neue Aufgabe
                            </a>
                        {/if}
                    </div>

                    {#if aufgabenListe.length > 0}
                        <ul class="list-group">
                            {#each aufgabenListe as aufgabe (aufgabe._id)}
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 class="mb-1">{aufgabe.titel}</h5>
                                        <small class="d-block text-muted">
                                            Status: <span class="badge bg-info text-dark">{aufgabe.status || 'N/A'}</span>
                                            {#if aufgabe.prioritaet}
                                                <span class="ms-2">Priorität: {aufgabe.prioritaet}</span>
                                            {/if}
                                            {#if aufgabe.faelligkeitsDatum}
                                                <span class="ms-2">Fällig bis: {formatiereDatum(aufgabe.faelligkeitsDatum)}</span>
                                            {/if}
                                        </small>
                                    </div>
                                    <div>
                                        {#if projekt}
                                            <form
                                                method="POST"
                                                action="/projekte/{projekt._id}?/deleteAufgabe"
                                                use:enhance={() => {
                                                    if (!confirm(`Sind Sie sicher, dass Sie die Aufgabe "${aufgabe.titel}" löschen möchten?`)) {
                                                        return ({ cancel }) => cancel();
                                                    }
                                                    // Optional: Ladezustand für diesen spezifischen Button setzen, falls benötigt
                                                    return async ({ update }) => {
                                                        await update();
                                                    };
                                                }}
                                                style="display: inline;"
                                            >
                                                <input type="hidden" name="aufgabenId" value={aufgabe._id} />
                                                <button type="submit" class="btn btn-outline-danger btn-sm">
                                                    Löschen
                                                </button>
                                            </form>
                                        {/if}
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        <div class="alert alert-light" role="alert">
                            Für dieses Projekt sind noch keine Aufgaben vorhanden.
                        </div>
                    {/if}
                </div>
                </div> <!--* Ende von col-lg-8 -->

            <!--Rechte Spalte für Aktionen bleibt unverändert -->
            <div class="col-lg-4">
                <div class="sticky-top action-sidebar fixed-top-offset">
                    <h5 class="mb-3">Aktionen</h5>
                    <div class="d-grid gap-2">
                        <a href="/projekte/{projekt._id}/bearbeiten" class="btn btn-primary">
                            Projekt bearbeiten
                        </a>
                        <a href="/projekte" class="btn btn-outline-secondary">
                            Zurück zur Übersicht
                        </a>
                        <form method="POST" action="?/delete" use:enhance={() => {
                            if (!confirm('Sind Sie sicher, dass Sie dieses Projekt endgültig löschen möchten? Zugehörige Aufgaben bleiben dabei bestehen und müssen bei Bedarf separat verwaltet werden (Option A).')) {
                                return ({ cancel }) => {
                                    cancel(); 
                                    isDeleting = false; 
                                };
                            }
                            isDeleting = true; 
                            return async ({ update }) => {
                                await update(); 
                                isDeleting = false; 
                            };
                        }}>
                            <button type="submit" class="btn btn-danger w-100 mt-3" disabled={isDeleting}>
                                {#if isDeleting}
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Wird gelöscht...
                                {:else}
                                    Projekt endgültig löschen
                                {/if}
                            </button>
                        </form>
                    </div>
                </div>
            </div> <!--Ende von col-lg-4 -->
        </div> <!-- Ende von row -->
    </div> <!--Ende von container mt-3 mb-5 -->
{:else}
    <div class="container mt-4">
        <div class="alert alert-info">Lade Projektdetails oder Projekt wurde nicht gefunden...</div>
        <a href="/projekte" class="btn btn-primary mt-2">Zurück zur Projektübersicht</a>
    </div>
{/if}

<style>
    .page-title-text {
        font-size: 2.8rem;
        font-weight: 600;
        color: #111;
        margin-bottom: 0.5rem;
    }
    .project-detail-card {
        border: 1px solid #e9ecef;
        border-radius: 0.5rem;
    }
    .project-icon-large {
        max-width: 180px;
        max-height: 180px;
        object-fit: contain;
        border-radius: 0.375rem;
    }
    .project-description {
        font-size: 1rem;
        line-height: 1.7;
        white-space: pre-wrap;
        color: #444;
    }
    .project-meta-details strong {
        color: #555;
    }
    .project-meta-details span {
        color: #222;
    }
    .action-sidebar h5 {
        font-weight: 500;
        color: #333;
    }
    .fixed-top-offset {
        top: 90px; /* Anpassung an Navbar Höhe*/
    }
    .action-sidebar .btn {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        font-weight: 500;
    }
    .status-badge {
        font-size: 0.9em;
        padding: 0.4em 0.7em;
    }
    .status-planung { background-color: #6c757d !important; color: white !important; }
    .status-in-arbeit { background-color: #0d6efd !important; color: white !important; }
    .status-abgeschlossen { background-color: #198754 !important; color: white !important; }
    .status-angehalten { background-color: #ffc107 !important; color: black !important; }
    .status-abgebrochen { background-color: #dc3545 !important; color: white !important; }

    /* Styles für die Aufgabenliste (optional)*/
    .list-group-item h5 {
        font-size: 1.1rem;
        font-weight: 500;
    }
</style>