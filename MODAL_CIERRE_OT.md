# Modal de Cierre de OT - Documentación

## Descripción General
Se ha creado un nuevo modal `WorkOrderClosingModal` para el cierre final de órdenes de trabajo. Este modal completa el flujo de vida de una OT:

1. **Crear OT** → 2. **Ver Detalles** → 3. **Ejecutar (Salida)** → 4. **Cerrar (Cierre)**

## Ubicación
- **Archivo**: `src/components/WorkOrderClosingModal.tsx`
- **Integrado en**: `src/components/WorkOrders.tsx`

## Flujo de Uso

### Estado de la OT
```
pendiente → programado → ejecutado → cerrado
                              ↓
                        [Modal Cierre]
```

El botón "Cerrar" aparece cuando `status === 'ejecutado'` después de completar la salida de OT.

## Pestañas del Modal

### 1. **General** (Información Base)
- **Año**: Año fiscal (prerellenado con año actual)
- **N° de OT**: Número de orden (prerellenado desde OT seleccionada)
- **Hora de Inicio/Cierre**: Horas de emisión del documento
- **Identificación del Equipo**:
  - Equipo (requerido)
  - Código del Equipo
  - Ubicación/Línea
  - Asignado a (Técnico)
  - Aprobado Por
  - Firma del Técnico
- **Tipo de Mantenimiento**: Radio buttons (Preventivo, Correctivo, Predictivo, Mejora)
- **Prioridad**: Radio buttons (Urgente, Alta, Media, Baja)

### 2. **Seguridad** (Requisitos y Riesgos)
- **Requisitos de Seguridad**:
  - ☐ Aplicar Procedimiento LOTO
  - ☐ Guantes de seguridad
  - ☐ Lentes de seguridad
  - ☐ Arnés de seguridad
- **Riesgos Identificados**:
  - ☐ Riesgo Eléctrico
  - ☐ Riesgo Mecánico
  - ☐ Riesgo Químico
- **Otros Riesgos**: Campo de texto libre

### 3. **Descripción** (Documentación Técnica)
- **Descripción del Estado Antes**: Textarea (estado inicial)
- **Descripción de Efecto/Causa**: Textarea (efectos y causas identificadas)
- **Descripción del Trabajo Realizado** ⭐ (Requerido): Textarea detallada
- **Hallazgos y Anomalías**: Textarea (nivel bajo, fugas, ruido, piezas sueltas, etc.)
- **Repuestos Utilizados**: Textarea (listado con cantidades)
- **Recomendaciones/Trabajos Pendientes**: Textarea (trabajos futuros)

### 4. **Cierre** (Validación Final)
- **Técnico Responsable** ⭐ (Requerido)
- **Firma del Técnico**
- **Tiempos de Ejecución**:
  - Hora de Inicio ⭐ (Requerido)
  - Hora Fin ⭐ (Requerido)
  - Tiempo Total (h) - Se puede calcular automáticamente
- **Validación Final**:
  - Trabajo Recibido y Validado Por ⭐ (Requerido)
  - Firma de Validación
- **Estado Final de la OT** ⭐ (Requerido):
  - ◯ Completado
  - ◯ Pendiente

## Estructura de Datos

```typescript
interface ClosingFormData {
  year: string;
  otNumber: string;
  startHour: string;
  closingHour: string;
  
  // Identificación del Equipo
  equipment: string;
  equipmentCode: string;
  location: string;
  assignedTechnician: string;
  approvedBy: string;
  technicianSignature: string;
  
  // Tipo y Prioridad
  maintenanceType: 'preventivo' | 'correctivo' | 'predictivo' | 'mejora' | '';
  priority: 'urgente' | 'alta' | 'media' | 'baja' | '';
  
  // Requisitos de Seguridad
  securityRequirements: {
    loto: boolean;
    safetyGloves: boolean;
    safetyGlasses: boolean;
    safetyHarness: boolean;
    electricalRisk: boolean;
    mechanicalRisk: boolean;
    chemicalRisk: boolean;
  };
  otherRisks: string;
  
  // Descripciones
  descriptionBefore: string;
  effectCauseDescription: string;
  workDescription: string;
  findings: string;
  spareParts: string;
  recommendations: string;
  
  // Cierre y Validación
  responsibleTechnician: string;
  responsibleSignature: string;
  startTime: string;
  endTime: string;
  totalTime: string;
  receivedValidatedBy: string;
  validationSignature: string;
  
  // Estado Final
  finalStatus: 'completado' | 'pendiente' | '';
}
```

## Integración en WorkOrders.tsx

### Cambios Realizados

1. **Import**:
```tsx
import { WorkOrderClosingModal } from './WorkOrderClosingModal';
```

2. **Tipo WorkOrder Actualizado**:
```tsx
status: 'pendiente' | 'programado' | 'ejecutado' | 'cerrado' | 'reprogramado' | 'no-ejecutado';
closingData?: any; // Nuevo campo
```

3. **Estado**:
```tsx
const [closingModalOpen, setClosingModalOpen] = useState(false);
```

4. **Handlers**:
```tsx
const handleOpenClosingModal = (order: WorkOrder) => {
  setSelectedOrder(order);
  setClosingModalOpen(true);
};

const handleClosingSubmit = (closingData: any) => {
  const updatedOrders = workOrders.map((order) =>
    order.id === closingData.id ? closingData : order
  );
  setWorkOrders(updatedOrders);
  setClosingModalOpen(false);
  setSelectedOrder(null);
};
```

5. **Botón en Card**:
```tsx
{order.status === 'ejecutado' && (
  <Button
    variant="outline"
    size="sm"
    onClick={() => handleOpenClosingModal(order)}
    className="gap-2 text-blue-600 hover:text-blue-700"
  >
    <CheckCircle className="h-4 w-4" />
    Cerrar
  </Button>
)}
```

## Funcionalidades

✅ **Totalmente Responsivo**: Optimizado para móvil (320px+), tablet (640px+), desktop (1024px+)

✅ **Validación**: Campos requeridos (marcados con ⭐):
- otNumber
- equipment
- workDescription
- responsibleTechnician
- startTime
- endTime
- receivedValidatedBy
- finalStatus

✅ **Secciones Coloreadas**:
- Blue: Identificación del Equipo
- Purple: Tipo de Mantenimiento
- Red: Prioridad
- Orange: Seguridad y Requisitos

✅ **Estados Persistentes**: Los datos se guardan en `workOrder.closingData`

✅ **Transición de Estado**: Status cambia a 'cerrado' al submit

## Flujo Completo de OT

### OT-2024-001 Ejemplo

```
1. CREAR
   → Nueva OT con status: 'pendiente'
   → Información: equipo, descripción, solicitante, etc.

2. ASIGNAR
   → status: 'programado'
   → Se asigna técnico responsable

3. EJECUTAR (Modal Salida)
   → status: 'ejecutado'
   → Se registra trabajo realizado, materiales, precauciones
   → Datos guardados en exitData

4. CERRAR (Modal Cierre) ← NUEVO
   → status: 'cerrado'
   → Se valida trabajo, se generan firmas
   → Datos guardados en closingData
   → OT completa y archivada
```

## Ventajas del Sistema

1. **Trazabilidad Completa**: Todos los datos desde creación hasta cierre
2. **Dos Momentos de Registro**:
   - **Salida**: Qué se hizo (técnico ejecutor)
   - **Cierre**: Validación (supervisor/jefe)
3. **Seguridad Documentada**: Requisitos y riesgos registrados
4. **Auditoría**: Se mantiene histórico de todos los cambios
5. **Estados Claros**: Diferencia entre "ejecutado" y "cerrado"

## Campos de Texto Requeridos

| Tab | Campo | Etiqueta |
|-----|-------|----------|
| General | otNumber | N° de OT * |
| General | equipment | Equipo * |
| Descripción | workDescription | Descripción del Trabajo Realizado * |
| Cierre | responsibleTechnician | Técnico Responsable * |
| Cierre | startTime | Hora de Inicio * |
| Cierre | endTime | Hora Fin * |
| Cierre | receivedValidatedBy | Trabajo Recibido y Validado Por * |
| Cierre | finalStatus | Estado Final de la OT * |

## Notas Importantes

- ✅ Sin perder funcionalidad del sistema
- ✅ Modal responsivo como el anterior
- ✅ Datos persistentes en WorkOrder
- ✅ Validación de formulario
- ✅ Estado visual claro (botón "Cerrar" solo aparece cuando status === 'ejecutado')
- ✅ Sin cambios en otros componentes
- ✅ Sin errores de compilación

## Testing Recomendado

1. Crear una OT
2. Clickear "Ver detalles" - Modal DetailModal
3. Clickear "Finalizar" - Modal Exit
4. Llenar datos de salida
5. Clickear "Finalizar OT" - Status cambia a 'ejecutado'
6. Botón "Cerrar" ahora debe ser visible
7. Clickear "Cerrar" - Modal Closing
8. Llenar datos de cierre
9. Clickear "Cerrar OT" - Status cambia a 'cerrado'
10. Verificar que botón "Cerrar" desaparece
