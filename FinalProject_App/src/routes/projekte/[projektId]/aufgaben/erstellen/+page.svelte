<!-- src/routes/projekte/[projektId]/aufgaben/erstellen/+page.svelte -->

<script>
    import { goto } from "$app/navigation";
    import { enhance } from "$app/forms";

    // 'data' enthält hier 'data.projektId' von unserer load-Funktion
    let { data, form } = $props();

    // Formularzustand
    let titel = $state("");
    let beschreibung = $state("");
    let status = $state("Offen"); // Standardwert
    let prioritaet = $state("Mittel"); // Standardwert
    let faelligkeitsDatum = $state(""); // HTML input type="date" erwartet String oder null

    // Die projektId für die Weiterleitung und ggf. Anzeige
    let projektId = $derived(data?.projektId);
    let projektName = $derived(data?.projektName || projektId); // Fallback auf ID, falls Name nicht da

    // $effect wird ausgeführt, wenn sich 'form' (die Prop von der Action) ändert
    $effect(() => {
        if (form?.success) {
            alert(form.message || "Aufgabe erfolgreich erstellt!");
            if (projektId) {
                goto(`/projekte/${projektId}`, {
                    replaceState: true,
                    invalidateAll: true,
                });
            } else {
                goto("/projekte", { replaceState: true, invalidateAll: true }); // Fallback zur Projektübersicht
            }
        } else if (form?.isError) {
            // Formularfelder bei Validierungsfehler mit den zurückgegebenen Werten neu befüllen
            if (form.titel !== undefined) titel = form.titel;
            if (form.beschreibung !== undefined)
                beschreibung = form.beschreibung;
            if (form.status !== undefined) status = form.status;
            if (form.prioritaet !== undefined) prioritaet = form.prioritaet;
            if (form.faelligkeitsDatum !== undefined)
                faelligkeitsDatum = form.faelligkeitsDatum || "";
        }
    });

    function handleCancel() {
        if (projektId) {
            goto(`/projekte/${projektId}`); // Zurück zur Projektdetailseite
        } else {
            goto("/projekte"); // Fallback
        }
    }
</script>

<svelte:head>
    <title>Neue Aufgabe für: {projektName || "Projekt"}</title>
</svelte:head>

<div class="container mt-4 mb-5">
    <h1>Neue Aufgabe erstellen</h1>
    {#if projektName}
        <p class="text-muted fs-5 mb-3">
            Für Projekt: <strong class="text-dark">{projektName}</strong>
        </p>
    {:else if projektId}
        <p class="text-muted">Für Projekt-ID: {projektId}</p>
    {/if}

    {#if form?.isError}
        <div class="alert alert-danger" role="alert">
            <strong>Fehler:</strong>
            {form.errorMessage || "Ein unbekannter Fehler ist aufgetreten."}
            {#if form.fieldWithError}
                <p class="mb-0">
                    Bitte überprüfen Sie das Feld: {form.fieldWithError}
                </p>
            {/if}
        </div>
    {/if}

    <form method="POST" use:enhance>
        <!-- Sendet an die default-Action dieser Route -->
        <div class="mb-3">
            <label for="titel" class="form-label"
                >Titel <span class="text-danger">*</span></label
            >
            <input
                type="text"
                class="form-control"
                id="titel"
                name="titel"
                bind:value={titel}
                required
            />
        </div>

        <div class="mb-3">
            <label for="beschreibung" class="form-label">Beschreibung</label>
            <textarea
                class="form-control"
                id="beschreibung"
                name="beschreibung"
                rows="3"
                bind:value={beschreibung}
            ></textarea>
        </div>

        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="status" class="form-label"
                    >Status <span class="text-danger">*</span></label
                >
                <select
                    class="form-select"
                    id="status"
                    name="status"
                    bind:value={status}
                    required
                >
                    <option value="Offen">Offen</option>
                    <option value="In Bearbeitung">In Bearbeitung</option>
                    <option value="Erledigt">Erledigt</option>
                    <option value="Blockiert">Blockiert</option>
                    <option value="Verworfen">Verworfen</option>
                </select>
            </div>
            <div class="col-md-6 mb-3">
                <label for="prioritaet" class="form-label">Priorität</label>
                <select
                    class="form-select"
                    id="prioritaet"
                    name="prioritaet"
                    bind:value={prioritaet}
                >
                    <option value="Niedrig">Niedrig</option>
                    <option value="Mittel">Mittel</option>
                    <option value="Hoch">Hoch</option>
                </select>
            </div>
        </div>

        <div class="mb-3">
            <label for="faelligkeitsDatum" class="form-label"
                >Fälligkeitsdatum</label
            >
            <input
                type="date"
                class="form-control"
                id="faelligkeitsDatum"
                name="faelligkeitsDatum"
                bind:value={faelligkeitsDatum}
            />
        </div>

        <hr />
        <div class="d-flex justify-content-end">
            <button
                type="button"
                class="btn btn-secondary me-2"
                onclick={handleCancel}>Abbrechen</button
            >
            <button type="submit" class="btn btn-primary"
                >Aufgabe erstellen</button
            >
        </div>
    </form>
</div>

<style>
    /* Spezifische Styles für diese Seite, für später */
</style>
