# 📊 Guía de Logs y Hot Reload

## 🚀 Inicio Rápido

### Opción 1: Inicio con Logs Integrados (Recomendado)
```bash
start-all.bat
```

Esto abrirá:
- **Ventana Verde (🔧 Backend)**: Logs de FastAPI en tiempo real
- **Ventana Azul (⚛️ Frontend)**: Logs de Next.js en tiempo real
- **Ventana Principal**: Información de inicio

### Opción 2: Solo Ver Logs (servicios ya corriendo)
```bash
logs-only.bat
```

---

## 🔄 Hot Reload - Cómo Funciona

### Backend (FastAPI)
El flag `--reload` de Uvicorn detecta cambios automáticamente:

✅ **Archivos monitoreados:**
- `*.py` en toda la carpeta `app/`
- Cambios en imports
- Modificaciones en rutas

⚡ **Tiempo de reload:** ~1-2 segundos

📝 **Ejemplo de log al recargar:**
```
INFO:     Shutting down
INFO:     Waiting for application shutdown.
INFO:     Application shutdown complete.
INFO:     Finished server process [12345]
INFO:     Started reloader process [12346]
INFO:     Started server process [12347]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Frontend (Next.js)
Next.js 16 incluye **Fast Refresh** automáticamente:

✅ **Archivos monitoreados:**
- `*.tsx`, `*.ts`, `*.jsx`, `*.js`
- `*.css`, `globals.css`
- Cambios en componentes React

⚡ **Tiempo de refresh:** Instantáneo (~100ms)

📝 **Ejemplo de log al actualizar:**
```
○ Compiling /page ...
✓ Compiled /page in 347ms
```

---

## 📊 Tipos de Logs

### Backend - FastAPI Logs

#### 1. Startup Logs
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12346] using WatchFiles
```

#### 2. Request Logs
```
INFO:     127.0.0.1:54321 - "GET / HTTP/1.1" 200 OK
INFO:     127.0.0.1:54322 - "POST /api/summarize HTTP/1.1" 200 OK
INFO:     127.0.0.1:54323 - "GET /docs HTTP/1.1" 200 OK
```

#### 3. Error Logs
```
ERROR:    Exception in ASGI application
Traceback (most recent call last):
  File "...", line X, in ...
    ...
RuntimeError: Ollama API error: ...
```

#### 4. Reload Logs
```
INFO:     Will watch for changes in these directories: ['C:\\...\\project']
WARNING:  WatchFiles detected changes in 'app/api/summarize.py'. Reloading...
```

### Frontend - Next.js Logs

#### 1. Startup Logs
```
▲ Next.js 16.0.5
- Local:        http://localhost:3000
- Environments: .env.local

✓ Starting...
✓ Ready in 2.3s
```

#### 2. Compilation Logs
```
○ Compiling / ...
✓ Compiled / in 1.2s (345 modules)

○ Compiling /summarize ...
✓ Compiled /summarize in 850ms (123 modules)
```

#### 3. Fast Refresh Logs
```
Fast Refresh enabled for 1 custom loader
```

#### 4. Error Logs
```
⨯ ./src/app/page.tsx:15:5
Type error: Property 'invalid' does not exist on type '{ name: string; }'.

  13 |   return (
  14 |     <div>
> 15 |       {props.invalid}
     |       ^
  16 |     </div>
  17 |   )
```

---

## 🎨 Personalización de Ventanas

Las ventanas de logs tienen colores específicos:

| Ventana | Color | Código |
|---------|-------|--------|
| Backend | Verde | `color 0A` |
| Frontend | Azul | `color 0B` |

Para cambiar colores, edita `start-all.bat`:
```bat
REM Cambiar a amarillo (0E) o blanco (0F)
color 0E
```

Códigos de color disponibles:
- `0A` - Verde claro
- `0B` - Cian claro  
- `0C` - Rojo claro
- `0E` - Amarillo claro
- `0F` - Blanco brillante

---

## 🔍 Debugging con Logs

### Escenario 1: Error en el Backend

**Síntoma:** La API no responde

**Pasos:**
1. Mira la ventana verde (Backend)
2. Busca el último `ERROR:` o `WARNING:`
3. Lee el traceback completo
4. Identifica el archivo y línea del error

**Ejemplo:**
```
ERROR: Exception in ASGI application
  File "app/services/ai_client.py", line 65, in call_ollama_api
    return response['message']['content']
KeyError: 'message'
```

**Solución:** Revisar `ai_client.py` línea 65

### Escenario 2: Error en el Frontend

**Síntoma:** Pantalla blanca o error de compilación

**Pasos:**
1. Mira la ventana azul (Frontend)
2. Busca `⨯` (símbolo de error)
3. Lee el error de TypeScript
4. Revisa el archivo y línea indicados

**Ejemplo:**
```
⨯ Type error: Property 'data' does not exist on type 'never'.
  File: src/hooks/useSummarize.ts:45:20
```

**Solución:** Revisar tipos en `useSummarize.ts`

### Escenario 3: Request lento

**Síntoma:** El frontend se queda esperando

**Pasos:**
1. Mira la ventana verde (Backend)
2. Busca el request POST correspondiente
3. Verifica si aparece código 200 o si se quedó procesando
4. Si no hay respuesta, puede ser timeout de Ollama

**Ejemplo:**
```
INFO: 127.0.0.1:54321 - "POST /api/summarize HTTP/1.1" 200 OK
```
✅ Request exitoso

```
INFO: 127.0.0.1:54321 - "POST /api/summarize HTTP/1.1" ...
(sin respuesta)
```
⚠️ Ollama procesando o timeout

---

## 📁 Guardar Logs en Archivos

### Backend - Uvicorn con archivo de log

Edita `start-all.bat`, cambia la línea de uvicorn a:
```bat
uvicorn app.main:app --reload --port 8000 --log-level info --access-log --log-config logging.ini
```

Crea `project/logging.ini`:
```ini
[loggers]
keys=root,uvicorn

[handlers]
keys=console,file

[formatters]
keys=default

[logger_root]
level=INFO
handlers=console,file

[logger_uvicorn]
level=INFO
handlers=console,file
qualname=uvicorn

[handler_console]
class=StreamHandler
formatter=default
args=(sys.stdout,)

[handler_file]
class=FileHandler
formatter=default
args=('logs/uvicorn.log', 'a')

[formatter_default]
format=%(asctime)s - %(name)s - %(levelname)s - %(message)s
```

### Frontend - Next.js con archivo de log

```bash
# Redirigir logs a archivo
npm run dev > logs/nextjs.log 2>&1
```

O en `start-all.bat`:
```bat
npm run dev | tee logs/nextjs.log
```

---

## ⚡ Hot Reload Avanzado

### Excluir archivos del reload (Backend)

Si quieres que ciertos archivos NO disparen reload:

Crea `project/.watchignore`:
```
*.pyc
__pycache__/
*.log
tests/
```

### Configurar Fast Refresh (Frontend)

Next.js 16 tiene Fast Refresh activado por defecto. Para configuración:

`frontresume/next.config.ts`:
```typescript
const nextConfig = {
  reactStrictMode: true,
  // Fast Refresh ya está habilitado por defecto
};
```

---

## 🛠️ Troubleshooting

### Logs no aparecen en Backend

**Problema:** La ventana verde no muestra logs

**Solución:**
```bash
# Verifica que --reload esté activo
cd project
venv\Scripts\activate
uvicorn app.main:app --reload --log-level debug
```

### Fast Refresh no funciona

**Problema:** Cambios en componentes React no se reflejan

**Solución:**
```bash
# Limpia caché y reinicia
cd frontresume
Remove-Item -Path .next -Recurse -Force
npm run dev
```

### Demasiados logs

**Problema:** La ventana se llena muy rápido

**Solución:**
```bat
REM Reduce nivel de logs en start-all.bat
uvicorn app.main:app --reload --log-level warning
```

### Hot reload demasiado lento

**Problema:** El reload tarda mucho

**Backend:**
```bash
# Usa watchfiles en lugar de watchdog
pip install watchfiles
uvicorn app.main:app --reload --reload-dir app
```

**Frontend:**
```bash
# Next.js ya es óptimo, pero puedes excluir node_modules
# en next.config.ts si tienes problemas
```

---

## 📝 Comandos Útiles

### Ver logs en tiempo real (PowerShell)
```powershell
# Backend
Get-Content project\logs\uvicorn.log -Wait -Tail 50

# Frontend (si guardas logs)
Get-Content frontresume\logs\nextjs.log -Wait -Tail 50
```

### Filtrar logs por tipo
```powershell
# Solo errores del backend
Get-Content project\logs\uvicorn.log | Select-String "ERROR"

# Solo compilaciones del frontend
Get-Content frontresume\logs\nextjs.log | Select-String "Compiled"
```

### Limpiar logs antiguos
```bash
# Windows
Remove-Item project\logs\*.log
Remove-Item frontresume\logs\*.log

# O usar el script
clean-logs.bat
```

---

## ✅ Checklist de Logs Funcionando

- [ ] Backend muestra logs en ventana verde
- [ ] Frontend muestra logs en ventana azul
- [ ] Hot reload del backend funciona al editar .py
- [ ] Fast Refresh funciona al editar componentes React
- [ ] Errores de TypeScript aparecen en tiempo real
- [ ] Requests HTTP aparecen en logs del backend
- [ ] Compilación de Next.js muestra progreso

---

## 📚 Referencias

- [Uvicorn Logging](https://www.uvicorn.org/settings/#logging)
- [Next.js Fast Refresh](https://nextjs.org/docs/architecture/fast-refresh)
- [FastAPI Events](https://fastapi.tiangolo.com/advanced/events/)

---

**Última actualización:** 8 de Diciembre, 2025
