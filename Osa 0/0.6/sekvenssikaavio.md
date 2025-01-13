```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: Single page app doesnt rereceive the notes from the server after the initial loading of the page.
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: JSON: message: "note created"
    deactivate server
    

```