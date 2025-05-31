<script>

    export let projekt;

    function formatiereDatum(datumString) {
        if (!datumString) return "N/A";
        return new Date(datumString).toLocaleDateString('de-CH');
    }
</script>

<div class="card h-100">
    {#if projekt.projektIcon}
        <img
            src="/images/projekt-icons/{projekt.projektIcon}"
            class="card-img-top p-3"
            alt="Icon für {projekt.name}"
            style="max-height: 150px; object-fit: contain; border-bottom: 1px solid #eee;"
        />
    {/if}
    <div class="card-body d-flex flex-column">
        <h5 class="card-title">{projekt.name || 'Unbenanntes Projekt'}</h5>
        <p class="card-text mb-2">
            Status: <span class="badge bg-secondary">{projekt.status || 'N/A'}</span>
        </p>
        <p class="card-text mb-2">
            Priorität: {projekt.prioritaet || 'N/A'}
        </p>
        <p class="card-text">
            Geplantes Ende: {formatiereDatum(projekt.endDatumGeplant)}
        </p>
        <div class="mt-auto pt-2">
            <a href="/projekte/{projekt._id}" class="btn btn-primary btn-sm">Details anzeigen</a>
        </div>
    </div>
</div>

<style>
    .card-title {
        margin-bottom: 0.85rem;
        font-weight: 500;
    }
    .card-text {
        font-size: 0.9rem;
    }
    .badge {
        font-size: 0.75rem;
    }
</style>