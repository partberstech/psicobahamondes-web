'use client'

import { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

const Brain3D = dynamic(() => import('./Brain3D'), { ssr: false })

const spring = [0.32, 0.72, 0, 1]

// Regiones para el explorador 3D
const EXPLORE_REGIONS = [
  { name: 'Corteza Prefrontal', desc: 'Toma de decisiones, personalidad, conducta social', color: '#2563eb' },
  { name: 'Amígdala', desc: 'Procesamiento emocional, miedo y ansiedad', color: '#dc2626' },
  { name: 'Hipocampo', desc: 'Memoria, aprendizaje y navegación espacial', color: '#059669' },
  { name: 'Corteza Cingulada', desc: 'Regulación emocional y dolor', color: '#7c3aed' },
  { name: 'Tallo Cerebral', desc: 'Funciones vitales: respiración, ritmo cardíaco', color: '#ea580c' },
]

// Catálogo completo de regiones cerebrales — EN ESPAÑOL
const REGIONS_CATALOG = [
  { id: 'prefrontal', name: 'Corteza Prefrontal', lobe: 'Frontal', color: '#2563eb',
    function: 'Funciones ejecutivas: planificación, toma de decisiones, control de impulsos, personalidad',
    desc: 'La región más evolucionada del cerebro humano. Anticipa consecuencias, inhibe comportamientos inapropiados y elige acciones alineadas con tus valores. Es clave en la autorregulación emocional y el cambio terapéutico. Incluye las áreas de Brodmann 9, 10, 11, 12, 46 y 47.',
    clinical: 'Su hipoactivación se asocia con TDAH, adicciones y trastornos del control de impulsos. La hiperactivación se relaciona con ansiedad, TOC y rumiación.',
    connections: 'Se conecta con amígdala (regulación emocional), hipocampo (memoria de trabajo), corteza cingulada (detección de errores) y circuito fronto-estriatal (recompensa).',
    neurotrasnsmisores: 'Dopamina (vía mesocortical), noradrenalina, serotonina, GABA' },
  { id: 'motora', name: 'Corteza Motora Primaria', lobe: 'Frontal', color: '#6BA3A0',
    function: 'Control del movimiento voluntario y coordinación motora fina',
    desc: 'Organiza y ejecuta el movimiento. Desde escribir hasta caminar, traduce tus intenciones en acciones físicas concretas. Sus neuronas piramidales envían axones por el tracto corticoespinal hasta las neuronas motoras de la médula espinal.',
    clinical: 'Su daño puede causar apraxia (dificultad para realizar movimientos aprendidos) o hemiplejía contralateral.',
    connections: 'Corteza prefrontal (planificación), ganglios basales (iniciación), cerebelo (coordinación), corteza somatosensorial (retroalimentación).',
    neurotrasnsmisores: 'Glutamato, acetilcolina, dopamina (vía nigroestriatal)',
  },
  { id: 'sensorial', name: 'Corteza Somatosensorial', lobe: 'Parietal', color: '#A0B4C8',
    function: 'Procesa tacto, presión, temperatura, dolor y propiocepción',
    desc: 'Te permite sentir el mundo físico. El trauma se "almacena" frecuentemente a través de esta región. Tiene un mapa somatotópico (homúnculo de Penfield) donde manos y labios ocupan áreas desproporcionadamente grandes.',
    clinical: 'La sobreestimulación sensorial es común en TEA, TEPT y trastornos de ansiedad. El daño causa pérdida de sensibilidad discriminativa.',
    connections: 'Corteza motora (retroalimentación), tálamo (relevancia sensorial), ínsula (interocepción).',
    neurotrasnsmisores: 'Glutamato, GABA, sustancia P (dolor)',
  },
  { id: 'parietal_sup', name: 'Lóbulo Parietal Superior', lobe: 'Parietal', color: '#8B6F9E',
    function: 'Integración sensorial, orientación espacial, atención visoespacial',
    desc: 'Integra información de múltiples sentidos. Te permite saber dónde está tu cuerpo en el espacio y orientar tu atención hacia estímulos relevantes. Incluye el área de association cortex y el giro angular.',
    clinical: 'Su lesión puede causar negligencia espacial (ignorar un lado del cuerpo), síndrome de Balint o agnosia visual.',
    connections: 'Corteza visual (procesamiento dorsal "dónde"), corteza prefrontal (atención sostenida), corteza motora (orientación de movimiento).',
    neurotrasnsmisores: 'Acetilcolina, noradrenalina, dopamina',
  },
  { id: 'temporal_sup', name: 'Lóbulo Temporal Superior', lobe: 'Temporal', color: '#C49A6C',
    function: 'Memoria, lenguaje, reconocimiento facial, procesamiento auditivo',
    desc: 'Almacena recuerdos autobiográficos, reconoces rostros, entiendes el lenguaje y procesas la música. El área de Wernicke (izquierda) es clave para la comprensión del lenguaje.',
    clinical: 'Su disfunción está implicada en trastornos de memoria (Alzheimer), afasia de Wernicke, epilepsia del lóbulo temporal y prosopagnosia.',
    connections: 'Hipocampo (memoria declarativa), amígdala (significado emocional), corteza prefrontal (memoria de trabajo), ínsula (interocepción).',
    neurotrasnsmisores: 'Glutamato, GABA, acetilcolina',
  },
  { id: 'occipital', name: 'Lóbulo Occipital', lobe: 'Occipital', color: '#A06060',
    function: 'Procesamiento visual: interpretación de estímulos visuales',
    desc: 'Transforma señales eléctricas de los ojos en imágenes, colores, movimiento y formas reconocibles. Tiene 6 áreas de Brodmann (17, 18, 19) que procesan progresivamente información más compleja.',
    clinical: 'Su lesión causa ceguera cortical (ojos sanos pero el cerebro no interpreta lo que ve). La cecidad cortial puede ser selectiva para caras (prosopagnosia) o movimiento (akinetopsia).',
    connections: 'Vía magnocelular (movimiento) y parvocelular (color/detalles), corteza temporal (reconocimiento de objetos), corteza parietal (orientación espacial).',
    neurotrasnsmisores: 'Glutamato, GABA',
  },
  { id: 'cingulate_ant', name: 'Corteza Cingulada Anterior', lobe: 'Límbico', color: '#7c3aed',
    function: 'Detección de errores, regulación emocional, motivación, percepción del dolor',
    desc: 'Conecta emoción y cognición. Es crítica para detectar errores, resolver conflictos y dirigir la atención. El área subgenual 25 es un objetivo de estimulación cerebral profunda para depresión resistente al tratamiento.',
    clinical: 'Hiperactividad asociada con TOC, depresión y ansiedad. El área 25 muestra hiperactividad persistente en depresión mayor.',
    connections: 'Amígdala (respuesta emocional), hipocampo (memoria emocional), corteza prefrontal (control cognitivo), sistema de recompensa (motivación).',
    neurotrasnsmisores: 'Dopamina, noradrenalina, serotonina',
  },
  { id: 'hipocampo', name: 'Hipocampo', lobe: 'Límbico', color: '#059669',
    function: 'Consolidación de la memoria, navegación espacial, regulación del eje HPA',
    desc: 'Convierte la memoria de corto plazo en recuerdos duraderos. Contiene células de lugar que se activan en ubicaciones específicas. El estrés crónico puede reducir su volumen significativamente.',
    clinical: 'Atrofiado en depresión crónica, TEPT y Alzheimer. La meditación y el ejercicio físico lo fortalecen. La neurogénesis hippocampal está ligada al estado de ánimo.',
    connections: 'Corteza entorrinal (entrada sensorial), corteza prefrontal (memoria de trabajo), amígdala (memoria emocional), corteza cingulada posterior (recuerdo autobiográfico).',
    neurotrasnsmisores: 'Glutamato, GABA, BDNF (factor neurotrófico), cortisol (regulación HPA)',
  },
  { id: 'amigdala', name: 'Amígdala', lobe: 'Límbico', color: '#dc2626',
    function: 'Centro de procesamiento emocional, especialmente miedo y detección de amenazas',
    desc: 'Tu sistema de alarma interno. Detecta amenazas en milisegundos. En el trauma, puede quedar hiperactivada, generando respuestas de miedo desproporcionadas. Tiene subnúcleos con funciones específicas.',
    clinical: 'Hiperactivada en TEPT, trastornos de ansiedad y pánico. La terapia cognitivo-conductual y EMDR pueden regular su respuesta. La amígdala no tiene corteza — procesa información subcortical.',
    connections: 'Corteza prefrontal (regulación), hipocampo (contexto), corteza cingulada (conflicto), hipotálamo (respuesta de estrés), sistema nervioso autónomo (activación fisiológica).',
    neurotrasnsmisores: 'GABA (inhibición), glutamato (excitación), noradrenalina (activación), oxitocina (regulación social)',
  },
  { id: 'insula', name: 'Ínsula', lobe: 'Límbico', color: '#9B8EC4',
    function: 'Interocepción, conciencia corporal, empatía, procesamiento del dolor',
    desc: 'Región profunda que integra señales del cuerpo con estados emocionales. Es esencial para sentir tu propio estado fisiológico (hambre, sed, latido del corazón) y para la empatía.',
    clinical: 'Disfunción asociada con adicciones, trastornos alimentarios, ansiedad y alexitimia (incapacidad de identificar emociones). La ínsula anterior es clave para la conciencia de enfermedad.',
    connections: 'Amígdala (emociones), corteza cingulada anterior (dolor), corteza prefrontal (decisión), sistema nervioso autónomo (señales viscerales).',
    neurotrasnsmisores: 'Dopamina, serotonina, GABA, oxitocina',
  },
  { id: 'cerebelo', name: 'Cerebelo', lobe: 'Subcortical', color: '#4a90a4',
    function: 'Coordinación motora, equilibrio, aprendizaje procedural, lenguaje',
    desc: 'Contiene más neuronas que el resto del cerebro combinado. Aunque se asocia con movimiento, también contribuye al lenguaje, atención y procesamiento emocional. Participa en la predicción y corrección de errores.',
    clinical: 'Daño causa ataxia (incoordinación), temblor intencional, disartria y dificultades de aprendizaje motor.',
    connections: 'Corteza motora (corrección), ganglios basales (inicio del movimiento), corteza prefrontal (aprendizaje), corteza parietal (integración sensorial).',
    neurotrasnsmisores: 'Glutamato (células de Purkinje), GABA (células de Purkinje), acetilcolina (núcleos profundos)',
  },
  { id: 'talamo', name: 'Tálamo', lobe: 'Subcortical', color: '#5a7a8a',
    function: 'Relé sensorial, regulación de la conciencia, sueño-vigilia',
    desc: 'Estación de relevo de casi toda la información sensorial (excepto olfato). No es pasivo — filtra y modula qué información llega a la corteza. Participa en la conciencia y el ciclo sueño-vigilia.',
    clinical: 'El síndrome talámico puede causar alteraciones de la conciencia, dolor neuropático severo y alteraciones cognitivas.',
    connections: 'Corteza sensorial (relevo), corteza prefrontal (atención), corteza cingulada (dolor), hipotálamo (sueño-vigilia), ganglios basales (circuito motor).',
    neurotrasnsmisores: 'Glutamato, GABA (núcleo reticular), acetilcolina, dopamina',
  },
  { id: 'basal_ganglia', name: 'Ganglios Basales', lobe: 'Subcortical', color: '#8a6a4a',
    function: 'Iniciación del movimiento, hábitos, recompensa, aprendizaje',
    desc: 'Conjunto de núcleos profundos (caudado, putamen, globo pálido, nucleus accumbens) que regulan el inicio y fin del movimiento, la formación de hábitos y el circuito de recompensa.',
    clinical: 'Parkinson (degeneración de dopaminas en sustancia negra), Huntington (degeneración del caudado), adicciones (sistema de recompensa).',
    connections: 'Corteza prefrontal (decisión), corteza motora (ejecución), tálamo (retroalimentación), amígdala (valor emocional), hipocampo (aprendizaje contextual).',
    neurotrasnsmisores: 'Dopamina (circuito mesolímbico y nigroestriatal), GABA, acetilcolina, glutamato'
  },
  { id: 'tronco', name: 'Tronco del Encéfalo', lobe: 'Subcortical', color: '#5a7a7a',
    function: 'Funciones vitales: respiración, ritmo cardíaco, presión arterial, conciencia, sueño',
    desc: 'Conecta el cerebro con la médula espinal. Controla funciones autonómicas esenciales para la vida: respiración, ritmo cardíaco, presión arterial y regulación del ciclo sueño-vigilia a través de la formación reticular.',
    clinical: 'Daño en el tronco encefálico puede causar parálisis, coma, muerte cerebral o síndrome de enclaustramiento (locked-in syndrome). Es la región más crítica para la supervivencia inmediata.',
    connections: 'Médula espinal (vías motoras/sensoriales), cerebelo (coordinación), tálamo (relevo sensorial), hipotálamo (regulación autonómica).',
    neurotrasnsmisores: 'Noradrenalina (locus coeruleus), serotonina (núcleos del rafe), acetilcolina, dopamina' },
]

// Quiz
const QUIZ = [
  { q: '¿Qué parte del cerebro se activa principalmente cuando sentimos miedo?', options: ['Corteza Prefrontal', 'Amígdala', 'Hipocampo', 'Lóbulo Occipital'], correct: 1, explanation: 'La amígdala procesa el miedo en milisegundos y activa la respuesta de lucha/huida antes de que la corteza consciente procese qué ocurrió. Tiene conexiones directas con el hipotálamo para activar el sistema nervioso simpático.' },
  { q: '¿Qué estructura es clave para formar nuevos recuerdos?', options: ['Amígdala', 'Corteza Motora', 'Hipocampo', 'Lóbulo Parietal'], correct: 2, explanation: 'El hipocampo consolida la memoria: convierte experiencias breves en recuerdos duraderos. El estrés crónico puede reducir su volumen, mientras que el ejercicio y la meditación lo fortalecen.' },
  { q: '¿Qué región está más relacionada con la planificación y control de impulsos?', options: ['Lóbulo Temporal', 'Corteza Prefrontal', 'Lóbulo Occipital', 'Tallo Cerebral'], correct: 1, explanation: 'La corteza prefrontal es el "director ejecutivo" del cerebro. Permite planificar, razonar, controlar impulsos y tomar decisiones alineadas con nuestros valores a largo plazo.' },
  { q: '¿Qué significa neuroplasticidad?', options: ['El cerebro no cambia después de los 25', 'El cerebro se reorganiza toda la vida', 'Las neuronas no se regeneran', 'El cerebro es como un computador fijo'], correct: 1, explanation: 'La neuroplasticidad es la capacidad del cerebro de reorganizarse y crear nuevas conexiones durante toda la vida. Permite recuperarse de lesiones, aprender nuevas habilidades y cambiar patrones de pensamiento.' },
  { q: '¿Qué lóbulo procesa la información visual?', options: ['Frontal', 'Temporal', 'Parietal', 'Occipital'], correct: 3, explanation: 'El lóbulo occipital, en la parte posterior del cerebro, interpreta las señales de los ojos para crear imágenes con significado. Tiene 6 áreas de Brodmann que procesan información progresivamente más compleja.' },
  { q: '¿Qué región conecta emoción y cognición?', options: ['Corteza Prefrontal', 'Corteza Cingulada Anterior', 'Hipocampo', 'Cerebelo'], correct: 1, explanation: 'La corteza cingulada anterior es crítica para detectar errores, resolver conflictos emocionales y dirigir la atención. El área subgenual 25 es un objetivo de estimulación cerebral profunda para depresión resistente.' },
  { q: '¿Qué estructura regula el equilibrio y la coordinación?', options: ['Tálamo', 'Ganglios Basales', 'Cerebelo', 'Ínsula'], correct: 2, explanation: 'El cerebelo contiene más neuronas que el resto del cerebro combinado. Aunque se asocia con movimiento, también contribuye al lenguaje, atención y procesamiento emocional.' },
]

/* ─────── COGNITIVE QUIZ ─────── */
function CogniQuiz() {
  const [qi, setQi] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showExp, setShowExp] = useState(false)
  const [score, setScore] = useState(0)

  const q = QUIZ[qi]
  const done = qi >= QUIZ.length

  return (
    <div className="card p-6" style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
      {!done ? (
        <>
          <div className="flex items-center gap-3 mb-4">
            <span className="label">{qi + 1}/{QUIZ.length}</span>
            <div className="flex-1 h-1 rounded-full" style={{ background: '#e5e7eb' }}>
              <motion.div className="h-full rounded-full" style={{ background: '#2563eb' }}
                animate={{ width: `${((qi + 1) / QUIZ.length) * 100}%` }} />
            </div>
            <span className="label">{score} aciertos</span>
          </div>
          <p className="text-sm font-medium mb-4" style={{ color: '#111827' }}>{q.q}</p>
          <div className="space-y-2 mb-4">
            {q.options.map((o, i) => (
              <button key={i} disabled={selected !== null} onClick={() => { setSelected(i); setShowExp(true); if (i === q.correct) setScore(s => s + 1) }}
                className="w-full text-left p-3 text-xs rounded-lg border transition-all"
                style={{
                  background: selected === i ? (i === q.correct ? '#f0fdf4' : '#fef2f2') : '#ffffff',
                  borderColor: selected === i ? (i === q.correct ? '#16a34a' : '#dc2626') : 'rgba(0,0,0,0.06)',
                  color: '#374151',
                }}>
                {o}
              </button>
            ))}
          </div>
          {showExp && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg text-xs leading-relaxed mb-4"
              style={{ background: selected === q.correct ? '#f0fdf4' : '#fef2f2', color: '#374151' }}>
              {q.explanation}
            </motion.div>
          )}
          {selected !== null && (
            <button onClick={() => { setQi(qi + 1); setSelected(null); setShowExp(false) }}
              className="btn btn-primary text-xs w-full">
              {qi < QUIZ.length - 1 ? 'Siguiente pregunta' : 'Ver resultado'}
            </button>
          )}
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-3xl font-bold mb-2" style={{ color: '#2563eb' }}>{score}/{QUIZ.length}</p>
          <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
            {score === 7 ? '¡Excelente! Conoces muy bien tu cerebro.' :
              score >= 5 ? 'Buen conocimiento. Hay áreas por explorar.' :
                'Tu cerebro tiene mucho que enseñarte.'}
          </p>
          <button onClick={() => { setQi(0); setSelected(null); setShowExp(false); setScore(0) }}
            className="btn btn-ghost text-xs" style={{ color: '#2563eb' }}>
            Repetir quiz
          </button>
        </div>
      )}
    </div>
  )
}

/* ─────── MAIN ─────── */
export default function NeuropsicologiaTab() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const selectedRegion = activeRegion ? REGIONS_CATALOG.find(r => r.id === activeRegion) : null

  const SPANISH_NAMES: Record<string, string> = Object.fromEntries(
    REGIONS_CATALOG.map(r => [r.id, r.name])
  )

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: spring }}
        className="relative max-w-2xl mb-6 overflow-hidden"
        style={{ padding: '40px 0' }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none" style={{ opacity: 0.04 }}>
          <img src="/images/brain-silhouette.svg" alt="" className="h-64 w-auto" />
        </div>
        <h2 className="mb-4 relative" style={{ color: '#111827' }}>Neuropsicología</h2>
        <p className="text-base leading-relaxed" style={{ color: '#4b5563', fontFamily: 'var(--font-body)' }}>
          La neuropsicología estudia la relación entre el cerebro y el comportamiento.
          Comprender tus procesos cognitivos — memoria, atención, funciones ejecutivas —
          te da las claves para entender por qué piensas, sientes y actúas de cierta manera.
        </p>
      </motion.div>

      {/* ── Metodología — Cómo aplicamos la neuropsicología ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: spring, delay: 0.05 }}
        className="mb-10 max-w-3xl"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(5,150,105,0.1)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#d1fae5', color: '#059669' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a5 5 0 0 1 4.5 2.8A4 4 0 0 1 20 8.5a4.5 4.5 0 0 1-.8 8A3.5 3.5 0 0 1 16 20H8a3.5 3.5 0 0 1-3.2-3.5 4.5 4.5 0 0 1-.8-8A4 4 0 0 1 7.5 4.8 5 5 0 0 1 12 2z" />
            </svg>
          </div>
          <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>
            ¿Cómo aplicamos la Neuropsicología?
          </span>
        </div>
        <p className="text-sm leading-relaxed mb-3" style={{ color: '#4b5563', fontFamily: 'var(--font-body)' }}>
          La neuropsicología clínica estudia cómo las estructuras cerebrales — corteza prefrontal, amígdala, hipocampo, corteza cingulada — determinan nuestra forma de pensar, sentir y actuar. En terapia, esto no es teoría: es una <strong>herramienta de diagnóstico y cambio</strong>. Cuando identificamos qué circuitos cerebrales están hiperactivados (ansiedad, hipervigilancia) o hipoactivados (dificultad de concentración, desregulación emocional), podemos diseñar intervenciones concretas.
        </p>
        <p className="text-sm leading-relaxed mb-3" style={{ color: '#4b5563', fontFamily: 'var(--font-body)' }}>
          Nos enfocamos en las regiones más relevantes para el proceso terapéutico: la <strong>corteza prefrontal</strong> (funciones ejecutivas, control de impulsos), la <strong>amígdala</strong> (procesamiento del miedo y la ansiedad), el <strong>hipocampo</strong> (memoria y aprendizaje) y la <strong>corteza cingulada anterior</strong> (regulación emocional). Cada una de estas regiones tiene un papel específico en cómo experimentamos el mundo, y comprender su funcionamiento permite diseñar estrategias de cambio basadas en evidencia neurológica.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { region: 'Corteza Prefrontal', color: '#2563eb', role: 'Planificación, control de impulsos, toma de decisiones. Es el "director ejecutivo" del cerebro.' },
            { region: 'Amígdala', color: '#dc2626', role: 'Procesamiento emocional: miedo, ansiedad, detección de amenazas. Tu alarma interna.' },
            { region: 'Hipocampo', color: '#059669', role: 'Consolidación de la memoria, aprendizaje. Vulnerable al estrés crónico, fuerte con meditación y ejercicio.' },
            { region: 'Corteza Cingulada', color: '#7c3aed', role: 'Conecta emoción y cognición. Detección de errores, regulación del dolor emocional.' },
          ].map((r) => (
            <div key={r.region} className="p-3 rounded-xl" style={{ background: `${r.color}06`, border: `1px solid ${r.color}12` }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                <span className="text-xs font-bold" style={{ color: r.color }}>{r.region}</span>
              </div>
              <p className="text-[0.7rem] leading-relaxed" style={{ color: '#6b7280' }}>{r.role}</p>
            </div>
          ))}
        </div>
        <p className="text-xs mt-4 leading-relaxed" style={{ color: '#9ca3af', fontFamily: 'var(--font-body)' }}>
          La neuroplasticidad — la capacidad del cerebro de reorganizarse toda la vida — es nuestra aliada. No estás destinado a repetir los mismos patrones: tus circuitos cerebrales pueden cambiar con las herramientas adecuadas.
        </p>
      </motion.div>

      {/* Catálogo de regiones cerebrales (arriba) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: spring }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#f0fdf4', color: '#059669' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <span className="label">Catálogo de regiones cerebrales</span>
        </div>
        <p className="text-sm mb-6 max-w-lg" style={{ color: '#6b7280' }}>
          Explora las {REGIONS_CATALOG.length} regiones principales del cerebro con información científica completa. Toca una región para ver su detalle o explora el cerebro 3D abajo.
        </p>

        {/* Grid de regiones */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {REGIONS_CATALOG.map(region => (
            <button
              key={region.id}
              onClick={() => setActiveRegion(activeRegion === region.id ? null : region.id)}
              className="text-left p-4 rounded-xl transition-all"
              style={{
                background: activeRegion === region.id ? `${region.color}08` : '#f9fafb',
                border: `1px solid ${activeRegion === region.id ? `${region.color}30` : 'rgba(0,0,0,0.04)'}`,
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: region.color }} />
                <span className="text-xs font-bold" style={{ color: '#111827', fontFamily: 'var(--font-display)' }}>
                  {region.name}
                </span>
              </div>
              <span className="inline-block px-1.5 py-0.5 text-[0.6rem] rounded mb-1.5" style={{ background: `${region.color}10`, color: region.color }}>
                Lóbulo {region.lobe}
              </span>
              <p className="text-[0.7rem] leading-relaxed line-clamp-2" style={{ color: '#6b7280' }}>
                {region.function}
              </p>
            </button>
          ))}
        </div>

        {/* Detalle inline al seleccionar una región */}
        <AnimatePresence mode="wait">
          {selectedRegion && (
            <motion.div
              key={selectedRegion.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: spring }}
              className="mt-6 p-5 rounded-xl"
              style={{ background: '#f9fafb', border: `1px solid ${selectedRegion.color}20` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: selectedRegion.color }} />
                <div>
                  <h4 className="text-sm font-bold" style={{ color: '#111827', fontFamily: 'var(--font-display)' }}>
                    {selectedRegion.name}
                  </h4>
                  <span className="text-[0.65rem] font-medium" style={{ color: selectedRegion.color }}>
                    Lóbulo {selectedRegion.lobe}
                  </span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[0.6rem] font-semibold uppercase tracking-wider" style={{ color: '#9ca3af' }}>Función</span>
                  <p className="text-xs mt-1" style={{ color: '#374151' }}>{selectedRegion.function}</p>
                </div>
                <div>
                  <span className="text-[0.6rem] font-semibold uppercase tracking-wider" style={{ color: '#9ca3af' }}>Descripción</span>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6b7280' }}>{selectedRegion.desc}</p>
                </div>
                <div>
                  <span className="text-[0.6rem] font-semibold uppercase tracking-wider" style={{ color: '#9ca3af' }}>Nota clínica</span>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6b7280' }}>{selectedRegion.clinical}</p>
                </div>
                <div>
                  <span className="text-[0.6rem] font-semibold uppercase tracking-wider" style={{ color: '#9ca3af' }}>Conexiones</span>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6b7280' }}>{selectedRegion.connections}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-[0.6rem] font-semibold uppercase tracking-wider" style={{ color: '#9ca3af' }}>Neurotransmisores</span>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6b7280' }}>{selectedRegion.neurotrasnsmisores}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Explorador 3D (abajo) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: spring }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 18V5" /><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" /><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" />
            </svg>
          </div>
          <span className="label">Explorador 3D interactivo</span>
        </div>
        <p className="text-sm mb-4 max-w-lg" style={{ color: '#6b7280' }}>
          Haz clic en cualquier región del cerebro 3D para ver su información en el catálogo de arriba.
        </p>

        <div className="flex items-center justify-center w-full overflow-hidden">
          <Suspense fallback={
            <div className="flex items-center justify-center rounded-xl" style={{ width: '100%', maxWidth: 700, height: 460 }}>
              <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#e5e7eb', borderTopColor: '#2563eb' }} />
            </div>
          }>
            <Brain3D
              width={700}
              height={460}
              activeRegionId={activeRegion}
              onRegionClick={(id) => { setActiveRegion(id || null); }}
              spanishNames={SPANISH_NAMES}
            />
          </Suspense>
        </div>
      </motion.div>

      {/* Quiz */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: spring }}
        className="mb-10 max-w-xl"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#fef3c7', color: '#d97706' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
            </svg>
          </div>
          <span className="label">Quiz: ¿Cuánto sabes de tu cerebro?</span>
        </div>
        <CogniQuiz />
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: spring }}
        className="text-center p-8" style={{ background: '#f9fafb', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}
      >
        <p className="text-sm mb-3" style={{ color: '#6b7280' }}>
          ¿Quieres entender mejor tu cerebro y cómo afecta tu bienestar?
          Una evaluación neuropsicológica puede revelar patrones que no ves.
        </p>
        <a href="/contacto" className="btn btn-primary">Agendar Sesión Cero</a>
      </motion.div>
    </div>
  )
}
