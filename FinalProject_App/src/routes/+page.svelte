<script>
    import ProjektDashboardWidget from '$lib/components/ProjektDashboardWidget.svelte'
    import EmailWidget from '$lib/components/EmailWidget.svelte';
    import DailyJournalWidget from '$lib/components/DailyJournalWidget.svelte';

    let { data } = $props(); // Empfängt dashboardData von der load-Funktion

    // Die aufbereiteten Statistiken für das Widget
    let projektStatsFuerWidget = $derived(data?.dashboardData?.projektStatistiken);
</script>

<svelte:head>
    <title>Mein Dashboard - Mein persönliches ProjektTracker</title>
</svelte:head>

<div class="container mt-4 page-title-container">
    <h1 class="page-title-text">Dein Dashboard</h1>
</div>

<div class="container mt-3 mb-5">
    <div class="row">
        <div class="col-lg-7 mb-4">
            {#if projektStatsFuerWidget}
                <div class="mb-4"> <!--Abstand zwischen Widgets-->
                    <ProjektDashboardWidget projektStatistiken={projektStatsFuerWidget} />
                </div>
            {/if}

            <div>
                <DailyJournalWidget />
            </div>
        </div>

        <div class="col-lg-5">
            <div class="mb-4"> <!-- Abstand zwischen Widgets -->
                <EmailWidget /> <!-- Titel "Email" ist in der Komponente selbst -->
            </div>
            <div>
                <EmailWidget title="Email Studium" /> 
            </div>
        </div>
    </div>
</div>

<style>
    .page-title-container {
        margin-bottom: 1.5rem; /* Etwas mehr Abstand nach dem Titel */
    }
    .page-title-text {
        font-size: 2.8rem;
        font-weight: 600;
        color: #111;
    }
</style>