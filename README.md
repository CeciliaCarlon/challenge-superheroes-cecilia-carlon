# ChallengeSuperheroes

Aplicación web Single Page Application (SPA) desarrollada en **Angular 19+** para la gestión y búsqueda de superhéroes, implementando arquitectura moderna con componentes *standalone*, señales (*Signals*) y flujos reactivos con RxJS.

---

## Tecnologías y Arquitectura

- **Framework:** Angular 19+ (Standalone Components, Signals, Reactive Forms, Router)
- **Reactividad:** RxJS (`debounceTime`, `distinctUntilChanged`, `switchMap`, `takeUntilDestroyed`)
- **Testing:** Jasmine & Karma
- **Contenedor:** Docker (Multi-stage build con Nginx)

---

## Ejecución Local

1. **Instalar dependencias:**
    ```bash
    npm install

2. **Instalar servidor de desarrollo:**
    ```bash
    npm start

3. **Ejecutar pruebas unitarias:**
    ```bash
    npm test

4. **Ejecución con Docker:**
    ```bash
    docker build -t challenge-superheroes-app .
    docker run -d -p 8080:80 --name heroes-container challenge-superheroes-app
    ```
    Abrir el navegador con la url: http://localhost:8080

