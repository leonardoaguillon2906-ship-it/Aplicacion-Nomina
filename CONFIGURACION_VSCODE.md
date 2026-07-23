# Configuracion de VS Code para Aplicacion de Nomina

## Extensiones recomendadas

Instalar estas extensiones en VS Code:

1. **ES7+ React/Redux/React-Native snippets**
   - Autor: dsznajder.es7-react-js-snippets
   - Snippets para JavaScript

2. **ESLint**
   - Autor: dbaeumer.vscode-eslint
   - Linting en tiempo real

3. **Prettier - Code formatter**
   - Autor: esbenp.prettier-vscode
   - Formateador de codigo

4. **PostgreSQL**
   - Autor: ms-ossdata.vscode-postgresql
   - Soporte para PostgreSQL

5. **REST Client**
   - Autor: humao.rest-client
   - Probar API endpoints

6. **Thunder Client**
   - Autor: rangav.vscode-thunder-client
   - Cliente HTTP alternativo

7. **Thunder Client**
   - Debugger para Node.js

8. **GitLens**
   - Autor: eamodio.gitlens
   - Informacion de commits

## Configuracion de workspace

Crear `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact"
  ],
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/coverage": true
  },
  "files.exclude": {
    "**/.git": true,
    "**/node_modules": true
  },
  "editor.rulers": [80, 120],
  "editor.wordWrap": "on",
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000
}
```

## Configuracion de launch (debugging)

Crear `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/server.js",
      "restart": true,
      "runtimeArgs": ["--require", "dotenv/config"],
      "console": "integratedTerminal",
      "envFile": "${workspaceFolder}/.env"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Jest All Tests",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal"
    }
  ]
}
```

## Atajos de teclado personalizados

Agregar a `.vscode/keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+f",
    "command": "editor.action.formatDocument"
  },
  {
    "key": "ctrl+shift+l",
    "command": "eslint.executeAutofix"
  }
]
```

## Tareas automatizadas

Crear `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Install Dependencies",
      "type": "shell",
      "command": "npm",
      "args": ["install"],
      "problemMatcher": []
    },
    {
      "label": "Run Dev Server",
      "type": "shell",
      "command": "npm",
      "args": ["run", "dev"],
      "isBackground": true,
      "problemMatcher": {
        "pattern": {
          "regexp": "^.*$",
          "file": 1,
          "location": 2,
          "message": 3
        },
        "background": {
          "activeOnStart": true,
          "beginsPattern": ".",
          "endsPattern": "."
        }
      }
    },
    {
      "label": "Run Tests",
      "type": "shell",
      "command": "npm",
      "args": ["test"],
      "problemMatcher": []
    },
    {
      "label": "Lint Code",
      "type": "shell",
      "command": "npm",
      "args": ["run", "lint"],
      "problemMatcher": []
    }
  ]
}
```

## Uso desde terminal integrada

```bash
# Ejecutar servidor
npm run dev

# Ejecutar linter
npm run lint

# Ejecutar pruebas
npm test

# Formatear codigo
npm run format
```

## Snippets personalizados

Crear `.vscode/javascript.json`:

```json
{
  "Express Controller": {
    "prefix": "controller",
    "body": [
      "class ${1:ControllerName}Controller {",
      "  static async ${2:action}(req, res, next) {",
      "    try {",
      "      // Logica aqui",
      "      res.json({ success: true });",
      "    } catch (error) {",
      "      next(error);",
      "    }",
      "  }",
      "}",
      "",
      "module.exports = ${1:ControllerName}Controller;"
    ],
    "description": "Express Controller Template"
  },
  "Express Service": {
    "prefix": "service",
    "body": [
      "class ${1:ServiceName}Service {",
      "  static async ${2:method}(${3:params}) {",
      "    try {",
      "      // Logica aqui",
      "    } catch (error) {",
      "      throw new Error(`Error en ${2:method}: ${error.message}`);",
      "    }",
      "  }",
      "}",
      "",
      "module.exports = ${1:ServiceName}Service;"
    ],
    "description": "Express Service Template"
  }
}
```

## Testing desde VS Code

1. Instalar la extension "Jest"
2. En settings.json agregar:
```json
"jest.autoRunTestFile": true,
"jest.runMode": "on-demand"
```

3. Los tests se ejecutaran automaticamente al guardar

## Debugging

1. Colocar breakpoints en el codigo (click en numero de linea)
2. Presionar F5 o ir a Run > Start Debugging
3. Usar la consola de debugging para inspeccionar variables

## Productividad

- **Ctrl+Shift+P** - Comando Palette
- **Ctrl+P** - Buscar archivos
- **Ctrl+F** - Buscar en archivo
- **Ctrl+H** - Buscar y reemplazar
- **Alt+Up/Down** - Mover linea
- **Ctrl+D** - Seleccionar palabra siguiente
