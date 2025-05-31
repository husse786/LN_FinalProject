<script>
    //@runes

    // Daten von der load-Funktion via $props() empfangen
    let { data } = $props();

    // Abgeleiteter Zustand für das Projekt und mögliche Fehler
    let projekt = $derived(data?.projekt);
    let anzeigeFehler = $derived(data?.error);

    let isDeleting = $state(false); // Für den Deaktivierungs-/Ladezustand des Buttons

    // Hilfsfunktionen für Datumsformatierung
    function formatiereDatum(datumString, fallback = "N/A") {
        if (!datumString) return fallback;
        try {
            // 'de-CH' für Schweizer Datumsformat TT.MM.JJJJ
            return new Date(datumString).toLocaleDateString('de-CH', {
                year: 'numeric', month: '2-digit', day: '2-digit'
            });
        } catch (e) {
            return datumString; // Fallback, falls Konvertierung fehlschlägt
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
            <div class="col-lg-8">
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
                </div>

                <div class="mt-4">
                    <h3>Zugehörige Aufgaben</h3>
                    <p class="text-muted fst-italic">
                        (Die Anzeige und Verwaltung von Aufgaben für dieses Projekt wird hier später implementiert.)
                    </p>
                    </div>
            </div>

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
                                    cancel(); // Verhindert das Absenden des Formulars
                                    isDeleting = false; // Setze Ladezustand zurück, falls er gesetzt wurde
                                };
                            }
                            isDeleting = true; // Zeige Ladezustand / deaktiviere Button

                            // Die 'update'-Funktion wird nach der Action-Ausführung aufgerufen.
                            // Wenn die Action serverseitig weiterleitet (was unsere 'delete'-Action tut),
                            // wird dieser Teil für den Erfolgsfall nicht unbedingt benötigt, aber
                            // er ist gut für den Fall, dass die Action 'fail' zurückgibt.
                            return async ({ update }) => {
                                await update(); // Aktualisiert die 'form'-Prop, falls die Action 'fail' zurückgibt
                                isDeleting = false; // Setze Ladezustand zurück (wichtig bei Fehler)
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
            </div>
        </div>
    </div>
{:else}
    <div class="container mt-4">
        <div class="alert alert-info">Lade Projektdetails oder Projekt wurde nicht gefunden...</div>
        <a href="/projekte" class="btn btn-primary mt-2">Zurück zur Projektübersicht</a>
    </div>
{/if}

<style>
    .page-title-text {
        font-size: 2.8rem; /* Groß */
        font-weight: 600;
        color: #111; /* Fast Schwarz */
        margin-bottom: 0.5rem; /* Geringerer Abstand nach unten */
    }

    .project-detail-card {
        border: 1px solid #e9ecef; /* Dezenter Rand für die Karte */
        border-radius: 0.5rem; /* Etwas abgerundeter */
    }

    .project-icon-large {
        max-width: 180px;
        max-height: 180px;
        object-fit: contain;
        border-radius: 0.375rem; /* Bootstrap's Standard-Radius */
        /* box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); */
    }

    .project-description {
        font-size: 1rem;
        line-height: 1.7;
        white-space: pre-wrap; /* Erhält Zeilenumbrüche aus der Beschreibung */
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
        top: 90px;
    }
    .action-sidebar .btn {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        font-weight: 500;
    }

    /* Status-Badge Farben (Beispiel) */
    .status-badge {
        font-size: 0.9em; /* Etwas größer als die Mini-Badges in der Karte */
        padding: 0.4em 0.7em;
    }
    .status-planung { background-color: #6c757d !important; color: white !important; }
    .status-in-arbeit { background-color: #0d6efd !important; color: white !important; }
    .status-abgeschlossen { background-color: #198754 !important; color: white !important; }
    .status-angehalten { background-color: #ffc107 !important; color: black !important; }
    .status-abgebrochen { background-color: #dc3545 !important; color: white !important; }
</style>