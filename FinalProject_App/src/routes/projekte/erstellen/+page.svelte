<script>
  import { goto } from '$app/navigation'; // Für die Weiterleitung nach erfolgreicher Speicherung
  import { enhance } from '$app/forms'; // Für Progressive Enhancement.

  /** @type {import('./$types').PageData} */
  export let data; // Bleibt für Konsistenz, wenn nicht direkt genutzt wird. 

  /** @type {import('./$types').ActionData} */
  export let form; // Um Feedback von der Server-Action zu erhalten (z.B. Fehler, Erfolgsmeldungen)

  let projekt = {
    name: '',
    beschreibung: '',
    status: 'Planung', // Standardwert
    prioritaet: 'Mittel', // Standardwert
    startDatum: null,
    endDatumGeplant: null,
    projektIcon: '' // Standardmässig kein Icon ausgewählt
  };

  const verfuegbareIcons = [
    { value: 'icon_arbeit.png', label: 'Arbeit', path: '/images/projekt-icons/work.png' },
    { value: 'icon_idee.png', label: 'Idee', path: '/images/projekt-icons/icon_idee.png' },
    { value: 'icon_privat.png', label: 'Privat', path: '/images/projekt-icons/icon_privat.png' },
    { value: 'icon_studium.png', label: 'Studium', path: '/images/projekt-icons/icon_studium.png' }
    // weitere icons hinzufügen.
  ];


  // Hier wird direkt an Strings oder null gebindet, was für <input type="date"> passt.

  function handleCancel() {
    goto('/projekte'); // Zurück zur Projektübersicht
  }
</script>

<svelte:head>
  <title>Neues Projekt erstellen</title>
</svelte:head>

<div class="container mt-4">
  <h1>Neues Projekt erstellen</h1>

  {#if form?.error}
    <div class="alert alert-danger" role="alert">
      <strong>Fehler:</strong> {form.error}
    </div>
  {/if}
  {#if form?.success}
    <div class="alert alert-success" role="alert">
      Projekt erfolgreich erstellt!
    </div>
  {/if}

  <form method="POST" use:enhance> 
    <div class="mb-3">
      <label for="name" class="form-label">Projektname <span class="text-danger">*</span></label>
      <input type="text" class="form-control" id="name" name="name" bind:value={projekt.name} required />
    </div>

    <div class="mb-3">
      <label for="beschreibung" class="form-label">Beschreibung</label>
      <textarea class="form-control" id="beschreibung" name="beschreibung" rows="3" bind:value={projekt.beschreibung}></textarea>
    </div>

    <div class="row">
      <div class="col-md-6 mb-3">
        <label for="status" class="form-label">Status <span class="text-danger">*</span></label>
        <select class="form-select" id="status" name="status" bind:value={projekt.status} required>
          <option value="Planung">Planung</option>
          <option value="In Arbeit">In Arbeit</option>
          <option value="Angehalten">Angehalten</option>
          <option value="Abgeschlossen">Abgeschlossen</option>
          <option value="Abgebrochen">Abgebrochen</option>
        </select>
      </div>
      <div class="col-md-6 mb-3">
        <label for="prioritaet" class="form-label">Priorität</label>
        <select class="form-select" id="prioritaet" name="prioritaet" bind:value={projekt.prioritaet}>
          <option value="Hoch">Hoch</option>
          <option value="Mittel">Mittel</option>
          <option value="Niedrig">Niedrig</option>
        </select>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 mb-3">
        <label for="startDatum" class="form-label">Startdatum</label>
        <input type="date" class="form-control" id="startDatum" name="startDatum" bind:value={projekt.startDatum} />
      </div>
      <div class="col-md-6 mb-3">
        <label for="endDatumGeplant" class="form-label">Geplantes Enddatum</label>
        <input type="date" class="form-control" id="endDatumGeplant" name="endDatumGeplant" bind:value={projekt.endDatumGeplant} />
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">Projekt-Icon auswählen (optional)</label>
      <div class="d-flex flex-wrap">
        {#each verfuegbareIcons as icon (icon.value)}
          <div class="form-check me-3 mb-2">
            <input class="form-check-input" type="radio" name="projektIcon" id="icon-{icon.value}" value={icon.value} bind:group={projekt.projektIcon}>
            <label class="form-check-label" for="icon-{icon.value}">
              <img src={icon.path} alt={icon.label} title={icon.label} style="width: 50px; height: auto; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;" class:selected={projekt.projektIcon === icon.value}>
              <span class="visually-hidden">{icon.label}</span>
            </label>
          </div>
        {/each}
        {#if projekt.projektIcon}
          <button type="button" class="btn btn-sm btn-outline-secondary align-self-center ms-2" on:click={() => projekt.projektIcon = ''}>Auswahl aufheben</button>
        {/if}
      </div>
    </div>

    <hr />
    <div class="d-flex justify-content-end">
      <button type="button" class="btn btn-secondary me-2" on:click={handleCancel}>Abbrechen</button>
      <button type="submit" class="btn btn-primary">Projekt erstellen</button>
    </div>
  </form>
</div>

<style>
  .form-check-label img.selected {
    border: 2px solid var(--bs-primary); /* Bootstrap primary color */
    box-shadow: 0 0 5px var(--bs-primary);
  }
</style>