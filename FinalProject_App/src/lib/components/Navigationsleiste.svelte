<script>
</script>

<nav class="navbar navbar-expand-lg fixed-top site-navbar-wrapper">
    <div class="container-fluid d-flex justify-content-center">
        <button 
            class="navbar-toggler site-navbar-toggler"
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNavPillContent" 
            aria-controls="navbarNavPillContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon site-navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse site-navbar-collapse-wrapper" id="navbarNavPillContent">
            <ul class="nav site-nav-pill mx-auto">
                <li class="nav-item">
                    <a class="nav-link" href="/">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/projekte">Projekte</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/projekte/erstellen">Neues Projekt</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link disabled" href="/support" tabindex="-1" aria-disabled="true">Support</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link disabled" href="/kalendar" tabindex="-1" aria-disabled="true">Kalender</a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<style>
    .site-navbar-wrapper {
        background-color: transparent; /* Der äußere Nav-Container ist transparent */
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        z-index: 1050; /* Sicherstellen, dass es über anderem Inhalt liegt */
        /* Wichtig, damit der Toggler auf kleinen Screens sichtbar ist, auch wenn der Rest transparent ist */
        /* und damit der fixe Bereich korrekt ist. */
    }

    .site-navbar-toggler {
        /* Positionierung des Toggler, wenn die Leiste nicht voll ist */
        /* Alternative: Toggler ist immer sichtbar, z.B. rechts, und die Pill ist zentriert daneben */
        /* Für eine schwebende Pill ist der Toggler-Platz etwas knifflig. */
        /* Hier lassen wir ihn erstmal von Bootstrap Standard-Flexbox positionieren. */
        /* Wenn die Pill zentriert ist, muss der Toggler außerhalb oder mit spezieller Logik platziert werden. */
        /* Vorerst: Bootstrap Standardverhalten, das bei < lg einklappt und den Toggler zeigt. */
        /* Für den Apple-Look wäre ein sehr dezenter Toggler gut. */
        border: 1px solid #666; /* Dunklerer Rand für den Toggler */
    }

    .site-navbar-toggler-icon {
         background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(200, 200, 200, 0.9)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e"); /* Hellere Linien für dunklen Hintergrund der Pill */
    }


    .site-nav-pill {
        background-color: #181818; /* Sehr dunkles Grau / fast Schwarz */
        border-radius: 25px;       /* Starke Abrundung für "Pill"-Form */
        padding: 0.3rem 0.4rem;    /* Innenabstand der Pille */
        display: inline-flex;      /* Passt die Breite der Pille an ihren Inhalt an */
        list-style: none;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3); /* Dezenter Schatten für Tiefe */
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    /* Kein extra margin, padding der Links regelt den Abstand */

    .site-nav-pill .nav-link {
        color: #e0e0e0 !important; /* Helles Grau für Text */
        padding: 0.6rem 1.2rem;   /* Abstand innerhalb der Link-"Buttons" */
        border-radius: 20px;      /* Abgerundete "Buttons" */
        font-weight: 500;         /* Etwas dicker für bessere Lesbarkeit */
        font-size: 1.2rem;       /* Schriftgrösse*/
        transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
        margin: 0 0.15rem;        /* Minimaler Abstand zwischen den Buttons */
        white-space: nowrap;      /* Verhindert Zeilenumbruch in Links */
        background-color: transparent; /*kein individueller Hintergrund für Links */
    }

    .site-nav-pill .nav-link:hover,
    .site-nav-pill .nav-link:focus {
        background-color: #333333; /* Dunklerer Hover-Effekt */
        color: #ffffff !important;
    }
    
    /* Aktiver Link (optional, erfordert JS-Logik) */
    /* .site-nav-pill .nav-link.active { 
        background-color: #007aff; // Apple Blau
        color: #ffffff !important;
    } */

    .site-nav-pill .nav-link.disabled,
    .site-nav-pill .nav-link.disabled:hover {
        color: #757575 !important;
        background-color: transparent !important;
        cursor: default;
    }

    /* Verhalten auf kleinen Bildschirmen (wenn das Menü einklappt) */
    @media (max-width: 991.98px) { /* Bootstrap lg breakpoint */
        .site-navbar-wrapper .container-fluid {
            justify-content: flex-end; /* Toggler nach rechts */
            position: relative; /* Damit der Toggler absolut positioniert werden kann, wenn nötig */
        }
        .site-navbar-collapse-wrapper {
            /* Stellt sicher, dass der Inhalt unter dem Toggler erscheint und zentriert ist */
            width: 100%;
            flex-basis: 100%;
            flex-grow: 2;
            align-items: center;
        }
        .site-nav-pill {
            margin-top: 0.75rem; /* Abstand zum Toggler */
            flex-direction: column; /* Links untereinander */
            width: auto; /* Passt sich an den Inhalt an oder eine max-width setzen */
            max-width: 280px; /* Beispiel: maximale Breite im mobilen Modus */
            /* display: flex; bleibt, wird aber durch flex-direction: column beeinflusst */
        }
        .site-nav-pill .nav-item {
            margin: 0.2rem 0;
            width: 100%;
        }
        .site-nav-pill .nav-link {
            text-align: center; /* Text in den Links zentrieren */
        }
    }
</style>