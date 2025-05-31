<script>
    let { data } = $props();

    // Daten aus der 'data'-Prop ( via $props() erhalten)
    // für die Verwendung im Template vorbereiten.
    // Das optionale Chaining (data?.error) ist eine gute Absicherung.
    let anzeigeFehler = $derived(data?.error);
    let projekteListe = $derived(data?.projekte || []);
    let hatProjekte = $derived(projekteListe.length > 0);
</script>

<svelte:head>
    <title>Projektübersicht</title>
</svelte:head>

<div class="container mt-4 mb-5">
    <h1>Meine Projekte</h1>

    {#if anzeigeFehler}
        <div class="alert alert-danger" role="alert">
            <h4 class="alert-heading">Fehler!</h4>
            <p>{anzeigeFehler.message || "Ein unbekannter Fehler ist beim Laden der Projekte aufgetreten."}</p>
            <hr />
            <p class="mb-0">Bitte versuchen Sie es später erneut oder laden Sie die Seite neu.</p>
        </div>
    {:else if hatProjekte}
        <p>Hier ist eine Liste Ihrer Projekte:</p>
        <div class="row">
            {#each projekteListe as projekt (projekt._id)}
                <div class="col-md-4 mb-3">
                    <div class="card h-100">
                        {#if projekt.projektIcon}
                            <img 
                                src="/images/projekt-icons/{projekt.projektIcon}" 
                                class="card-img-top p-3" 
                                alt="Projekt Icon {projekt.name}" 
                                style="max-height: 150px; object-fit: contain; border-bottom: 1px solid #eee;"
                            />
                        {/if}
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">{projekt.name}</h5>
                            <p class="card-text">
                                Status: <span class="badge bg-secondary">{projekt.status || "N/A"}</span><br />
                                Priorität: {projekt.prioritaet || "N/A"}<br />
                                Geplantes Ende: {projekt.endDatumGeplant ? new Date(projekt.endDatumGeplant).toLocaleDateString('de-CH') : "N/A"}
                            </p>
                            <div class="mt-auto">
                                <a href="/projekte/{projekt._id}" class="btn btn-primary btn-sm">Details</a>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <div class="alert alert-info" role="alert">
            Sie haben noch keine Projekte angelegt.
            <a href="/projekte/erstellen" class="alert-link">Erstellen Sie jetzt Ihr erstes Projekt!</a>
        </div>
    {/if}

    <div class="mt-4">
        <a href="/projekte/erstellen" class="btn btn-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill me-1" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
            </svg>
            Neues Projekt erstellen
        </a>
    </div>
</div>

<style>
    .card-title {
        margin-bottom: 0.75rem;
    }
</style>