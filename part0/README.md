# Part 0 - FullStackOpen

## 0.4 New Note Diagram
```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: User writes a note and clicks "Save"

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    Note right of server: Server processes the new note and stores it
    server-->>browser: HTTP 302 Redirect to /notes
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET main.css
    activate server
    server-->>browser: CSS file
    deactivate server

    browser->>server: GET main.js
    activate server
    server-->>browser: JavaScript file
    deactivate server

    browser->>server: GET data.json
    activate server
    server-->>browser: Updated notes (including new note)
    deactivate server

    Note right of browser: Browser renders updated notes list
```

## 0.5 Single Page App Diagram
```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET main.css
    activate server
    server-->>browser: CSS file
    deactivate server

    browser->>server: GET spa.js
    activate server
    server-->>browser: JavaScript file
    deactivate server

    Note right of browser: JS loads and runs SPA logic

    browser->>server: GET data.json
    activate server
    server-->>browser: Notes data (JSON)
    deactivate server

    Note right of browser: Notes rendered dynamically without reload
```

## 0.6 New Note in Single Page App
```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: User writes note and clicks "Save"

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: JSON response (new note saved)
    deactivate server

    Note right of browser: Browser updates UI instantly (no reload)

    browser->>browser: Add new note to DOM
```
