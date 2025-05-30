<script>
    /** @type {import('./$types').PageData} */
    export let data; // Die 'data'-Prop wird von SvelteKit mit den Daten aus der load-Funktion befüllt

    // Die Projekte sind jetzt unter data.projekte verfügbar
    // (oder data.error, falls in der load-Funktion ein Fehlerobjekt zurückgegeben wurde)
</script>

<svelte:head>
    <title>Projektübersicht</title>
</svelte:head>

<div class="container mt-4">
    <h1>Meine Projekte</h1>

    {#if data.error}
        <div class="alert alert-danger" role="alert">
            <h4 class="alert-heading">Fehler!</h4>
            <p>
                {data.error.message ||
                    "Ein unbekannter Fehler ist aufgetreten."}
            </p>
            <hr />
            <p class="mb-0">
                Bitte versuchen Sie es später erneut oder kontaktieren Sie den
                Support.
            </p>
        </div>
    {:else if data.projekte && data.projekte.length > 0}
        <p>Hier ist eine Liste Ihrer Projekte:</p>
        <div class="row">
            {#each data.projekte as projekt (projekt._id)}
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">{projekt.name}</h5>
                            <p class="card-text">
                                Status: {projekt.status || "N/A"}<br />
                                Priorität: {projekt.prioritaet || "N/A"}<br />
                                Geplantes Ende: {projekt.endDatumGeplant
                                    ? new Date(
                                          projekt.endDatumGeplant,
                                      ).toLocaleDateString()
                                    : "N/A"}
                            </p>
                            <a
                                href="/projekte/{projekt._id}"
                                class="btn btn-primary btn-sm">Details</a
                            >
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <p>
            Sie haben noch keine Projekte angelegt. <a
                href="/projekte/erstellen"
                >Erstellen Sie jetzt Ihr erstes Projekt!</a
            >
        </p>
    {/if}

    <div class="mt-4">
        <a href="/projekte/erstellen" class="btn btn-success"
            >Neues Projekt erstellen</a
        >
    </div>
</div>
