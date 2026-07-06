'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RorschachCanvas from './RorschachCanvas'

const spring = [0.32, 0.72, 0, 1]

/* ════════════════════════════════════
   DATA: 10 Láminas reales + contexto clínico
   ════════════════════════════════════ */

interface InkblotData {
  id: number
  label: string
  title: string
  image: string
  commonResponses: string[]
  hasColor: boolean
  desc: string
  clinicalNote: string
}

const INKBLOTS: InkblotData[] = [
  { id: 1, label: 'Lámina I', title: 'La Lámina de Apertura', image: '/images/rorschach/01.jpg',
    commonResponses: ['murciélago', 'mariposa', 'polilla', 'máscara', 'dos figuras femeninas', 'mujeres'],
    hasColor: false, desc: 'La lámina de apertura. Organización perceptual global.',
    clinicalNote: 'Introduce la tarea. La respuesta como un todo (W) sugiere capacidad integradora. Respuestas populares: murciélago, mariposa.' },
  { id: 2, label: 'Lámina II', title: 'La Lámina del Color', image: '/images/rorschach/02.jpg',
    commonResponses: ['dos personas', 'dos animales', 'osos', 'perros', 'elefantes', 'mariposa roja'],
    hasColor: true, desc: 'Primera lámina con color (rojo). Impacto emocional.',
    clinicalNote: 'El rojo suele provocar reacciones emocionales. Dificultad para integrar el color sugiere control emocional rígido.' },
  { id: 3, label: 'Lámina III', title: 'La Lámina Social', image: '/images/rorschach/03.jpg',
    commonResponses: ['dos personas', 'dos figuras humanas', 'camareros', 'mozo', 'corbata', 'lazo', 'mariposa'],
    hasColor: true, desc: 'Lámina de contenido humano frecuente y movimiento.',
    clinicalNote: 'La respuesta de dos personas interactuando (M) es un indicador clave de inteligencia social y empatía. Una de las láminas más reveladoras.' },
  { id: 4, label: 'Lámina IV', title: 'La Lámina del Poder', image: '/images/rorschach/04.jpg',
    commonResponses: ['monstruo', 'gigante', 'gorila', 'animal grande', 'piel de animal', 'alfombra', 'tronco'],
    hasColor: false, desc: 'Lámina oscura y expansiva. Figura de autoridad.',
    clinicalNote: 'Conocida como "la lámina del padre". La percepción de algo amenazante o poderoso puede reflejar la relación con figuras de autoridad.' },
  { id: 5, label: 'Lámina V', title: 'La Lámina de Realidad', image: '/images/rorschach/05.jpg',
    commonResponses: ['murciélago', 'mariposa', 'polilla', 'avión', 'cohete'],
    hasColor: false, desc: 'La más fácil de percibir. Indicador de realidad.',
    clinicalNote: 'Considerada la lámina de "control de realidad". La mayoría de personas ven un murciélago o mariposa. Respuestas inusuales pueden indicar pensamiento no convencional.' },
  { id: 6, label: 'Lámina VI', title: 'La Lámina Sensorial', image: '/images/rorschach/06.jpg',
    commonResponses: ['piel de animal', 'alfombra', 'tapete', 'serpiente', 'insecto', 'arma', 'misil'],
    hasColor: false, desc: 'Lámina texturizada. Percepción táctil.',
    clinicalNote: 'Conocida como "la lámina sexual". La textura marcada invita a respuestas táctiles (T). Contenido de piel/alfombra es popular; contenido anatómico sexual requiere atención.' },
  { id: 7, label: 'Lámina VII', title: 'La Lámina Relacional', image: '/images/rorschach/07.jpg',
    commonResponses: ['dos mujeres', 'cabezas de mujeres', 'niñas', 'nubes', 'angel', 'elegante'],
    hasColor: false, desc: 'Lámina suave y difusa. Figuras femeninas.',
    clinicalNote: 'Conocida como "la lámina de la madre". La calidad de las respuestas suele reflejar la relación con figuras maternas o femeninas significativas.' },
  { id: 8, label: 'Lámina VIII', title: 'La Lámina del Color Complejo', image: '/images/rorschach/08.jpg',
    commonResponses: ['animal trepando', 'oso polar', 'león', 'pingüino', 'colores', 'árbol', 'montaña'],
    hasColor: true, desc: 'Primera lámina pastel. Integración cromática.',
    clinicalNote: 'Primera lámina con colores pastel y múltiples componentes. La capacidad de integrar formas y colores es señal de flexibilidad cognitiva y madurez emocional.' },
  { id: 9, label: 'Lámina IX', title: 'La Lámina de Integración', image: '/images/rorschach/09.jpg',
    commonResponses: ['explosión', 'fuego', 'humo', 'nubes', 'olas', 'ciervo', 'alce', 'colorido'],
    hasColor: true, desc: 'Lámina difusa de difícil integración.',
    clinicalNote: 'La más difícil de integrar en un todo coherente. Revela cómo se maneja la ambigüedad y la complejidad. Respuestas fragmentadas son esperables; la integración exitosa sugiere buena tolerancia.' },
  { id: 10, label: 'Lámina X', title: 'La Lámina Abierta', image: '/images/rorschach/10.jpg',
    commonResponses: ['cangrejo', 'araña', 'conejo', 'pulpo', 'fondo marino', 'fiesta', 'adornos', 'colorido'],
    hasColor: true, desc: 'La más colorida y fragmentada. Cierre del test.',
    clinicalNote: 'Lámina de cierre. La más fragmentada y colorida. La capacidad de encontrar un tema integrador (ej. "fondo marino", "fiesta") es positiva. Respuestas evacuativas pueden indicar fatiga.' },
]

/* ════════════════════════════════════
   PREGUNTAS
   ════════════════════════════════════ */

const QUESTIONS = [
  { id: 'what' as const, text: '¿Qué ves en esta mancha?', hint: 'Describe las formas, objetos o figuras que identificas' },
  { id: 'movement' as const, text: '¿Está estático o en movimiento?', hint: '¿Hay acción, tensión o quietud en lo que ves?' },
  { id: 'emotion' as const, text: '¿Qué emoción te provoca?', hint: 'Confía en tu respuesta visceral' },
]

type QuestionId = 'what' | 'movement' | 'emotion'

/* ════════════════════════════════════
   CONTENIDO (Exner adaptado)
   ════════════════════════════════════ */

const CONTENT_CATS = {
  H: { label: 'Humano', keywords: ['hombre', 'mujer', 'persona', 'cara', 'rostro', 'cuerpo', 'figura', 'silueta', 'pareja', 'gente', 'bebé', 'niño', 'niña', 'humano', 'camarero', 'mozo', 'mano', 'brazo', 'pierna'] },
  A: { label: 'Animal', keywords: ['animal', 'perro', 'gato', 'pájaro', 'mariposa', 'murciélago', 'tortuga', 'pez', 'insecto', 'araña', 'rana', 'águila', 'oso', 'gorila', 'elefante', 'león', 'cangrejo', 'conejo', 'pulpo', 'serpiente', 'polilla', 'animal'] },
  An: { label: 'Anatomía', keywords: ['hueso', 'esqueleto', 'órgano', 'costilla', 'columna', 'anatomía', 'craneo', 'cráneo', 'sangre', 'corazón', 'pulmón', 'cerebro'] },
  Na: { label: 'Naturaleza', keywords: ['árbol', 'flor', 'hoja', 'montaña', 'río', 'lago', 'nube', 'estrella', 'sol', 'luna', 'mar', 'fuego', 'humo', 'agua', 'ola', 'naturaleza', 'paisaje'] },
  Cg: { label: 'Objeto', keywords: ['objeto', 'máquina', 'edificio', 'puente', 'instrumento', 'herramienta', 'cohete', 'avión', 'misil', 'arma', 'lámpara', 'vela', 'reloj', 'libro', 'sombrero'] },
  Sx: { label: 'Sexual', keywords: ['seno', 'pecho', 'pene', 'falo', 'vagina', 'útero', 'genital', 'sexual', 'piernas abiertas', 'entre muslos'] },
  Fd: { label: 'Comida', keywords: ['comida', 'chocolate', 'salsa', 'helado', 'vino', 'copa', 'alimento', 'dulce', 'pastel'] },
  Cl: { label: 'Ropa', keywords: ['ropa', 'vestido', 'sombrero', 'corbata', 'lazo', 'bufanda', 'chal', 'poncho', 'gema', 'joya', 'anillo', 'collar'] },
  Ab: { label: 'Abstracto', keywords: ['forma', 'figura', 'diseño', 'patrón', 'símbolo', 'energía', 'fuerza', 'armonía', 'desorden', 'caos', 'abstracto', 'mancha', 'textura', 'movimiento'] },
} as const

type ContentCode = keyof typeof CONTENT_CATS

/* ════════════════════════════════════
   DETERMINANTES
   ════════════════════════════════════ */

const DETERMINANTS_DATA = {
  F: { label: 'Forma', keywords: ['forma', 'figura', 'silueta', 'contorno', 'borde', 'línea', 'parece', 'parecido', 'estructura'] },
  M: { label: 'Movimiento', keywords: ['camina', 'corre', 'baila', 'salta', 'abraza', 'vuela', 'flota', 'movimiento', 'dinámico', 'acción', 'trepa', 'nada', 'vuela', 'camina', 'bailan'] },
  C: { label: 'Color', keywords: ['rojo', 'azul', 'negro', 'blanco', 'gris', 'verde', 'color', 'oscuro', 'claro', 'pastel', 'brillante', 'tono'] },
  T: { label: 'Textura', keywords: ['suave', 'áspera', 'lisa', 'blanda', 'dura', 'húmeda', 'textura', 'peludo', 'suave', 'rugoso', 'sedoso', 'piel', 'pelaje'] },
  V: { label: 'Sombreado', keywords: ['sombra', 'profundidad', 'dimensión', 'relieve', '3d', 'tridimensional', 'espesor', 'capa', 'oscuro', 'denso'] },
} as const

type DeterminantCode = keyof typeof DETERMINANTS_DATA

/* ════════════════════════════════════
   EMOCIONES
   ════════════════════════════════════ */

const EMOTION_CATS: Record<string, { label: string; keywords: string[] }> = {
  fear: { label: 'Miedo', keywords: ['miedo', 'terror', 'asusta', 'aterra', 'amenaza', 'temible', 'espanto', 'horror'] },
  sadness: { label: 'Tristeza', keywords: ['triste', 'pena', 'dolor', 'melancolía', 'nostalgia', 'soledad', 'vacío'] },
  joy: { label: 'Alegría', keywords: ['alegre', 'feliz', 'contento', 'placer', 'bello', 'hermoso', 'agradable', 'grato', 'bonito'] },
  calm: { label: 'Calma', keywords: ['calma', 'paz', 'tranquilidad', 'serenidad', 'quietud', 'relajación', 'pacifico', 'armonía'] },
  curiosity: { label: 'Curiosidad', keywords: ['curiosidad', 'intriga', 'misterio', 'sorpresa', 'asombro', 'interés', 'fascina'] },
  confusion: { label: 'Confusión', keywords: ['confusión', 'desconcierto', 'no sé', 'difícil', 'complejo', 'enredado', 'ambiguo'] },
  disgust: { label: 'Desagrado', keywords: ['asco', 'repulsión', 'desagrado', 'feo', 'desagradable', 'repugnante', 'molesto'] },
  awe: { label: 'Admiración', keywords: ['admiración', 'impresionante', 'majestuoso', 'grandioso', 'imponente', 'impactante'] },
  anxiety: { label: 'Ansiedad', keywords: ['ansiedad', 'tensión', 'preocupación', 'nervios', 'inquietud', 'angustia', 'opresión'] },
  warmth: { label: 'Calidez', keywords: ['calidez', 'acogedor', 'suave', 'suavidad', 'ternura', 'protección', 'seguridad'] },
}

/* ════════════════════════════════════
   LOCALIZACIÓN
   ════════════════════════════════════ */

const LOCATION_KW = {
  W: { label: 'Global', keywords: ['todo', 'completa', 'en general', 'la mancha es', 'veo un', 'veo una', 'parece un', 'parece una'] },
  D: { label: 'Detalle', keywords: ['en el centro', 'en la parte', 'lado', 'arriba', 'abajo', 'esquina', 'medio', 'mitad', 'sección', 'zona'] },
  S: { label: 'Espacio blanco', keywords: ['hueco', 'vacío', 'espacio', 'blanco', 'fondo', 'entre medio', 'separación'] },
}

/* ════════════════════════════════════
   ANÁLISIS
   ════════════════════════════════════ */

interface CardScore {
  content: Record<ContentCode, number>
  determinants: Record<DeterminantCode, number>
  emotions: string[]
  location: { code: string; score: number }[]
  responseLength: number
  hasSelfRef: boolean
  vocabularyCount: number
  matchesPopular: boolean
}

function analyzeCard(answers: Record<QuestionId, string>, cardId: number): CardScore {
  const allText = Object.values(answers).join(' ').toLowerCase()
  const words = allText.split(/\s+/).filter(Boolean)
  const uniqueWords = new Set(words)

  // Contenido
  const content: Record<string, number> = {}
  for (const [code, cat] of Object.entries(CONTENT_CATS)) {
    content[code] = 0
    for (const kw of cat.keywords) {
      const regex = new RegExp(kw, 'gi')
      const matches = allText.match(regex)
      if (matches) content[code] += matches.length
    }
  }

  // Determinantes
  const determinants: Record<string, number> = {}
  for (const [code, det] of Object.entries(DETERMINANTS_DATA)) {
    determinants[code] = 0
    for (const kw of det.keywords) {
      const regex = new RegExp(kw, 'gi')
      const matches = allText.match(regex)
      if (matches) determinants[code] += matches.length
    }
  }

  // Emociones
  const emotions: string[] = []
  for (const [emo, data] of Object.entries(EMOTION_CATS)) {
    if (data.keywords.some(kw => allText.includes(kw))) emotions.push(emo)
  }

  // Localización
  const location = Object.entries(LOCATION_KW).map(([code, loc]) => ({
    code,
    score: loc.keywords.filter(kw => allText.includes(kw)).length,
  })).filter(l => l.score > 0)

  // Auto-referencia
  const hasSelfRef = /(yo|me|mi|siento|pienso|creo)/i.test(allText)

  // Respuesta popular
  const card = INKBLOTS[cardId]
  const matchesPopular = card.commonResponses.some(r => {
    const regex = new RegExp(r, 'i')
    return regex.test(allText)
  })

  return {
    content: content as Record<ContentCode, number>,
    determinants: determinants as Record<DeterminantCode, number>,
    emotions,
    location: location.length > 0 ? location : [{ code: 'W', score: 1 }],
    responseLength: words.length,
    hasSelfRef,
    vocabularyCount: uniqueWords.size,
    matchesPopular,
  }
}

/* ════════════════════════════════════
   PERFILES (10 tipos)
   ════════════════════════════════════ */

interface ProfileResult {
  id: string
  name: string
  desc: string
  longDesc: string
  traits: string[]
  strengths: string[]
  growths: string[]
}

function scoreProfiles(allCards: CardScore[]): ProfileResult[] {
  const agg = {
    content: { H: 0, A: 0, An: 0, Na: 0, Cg: 0, Sx: 0, Fd: 0, Cl: 0, Ab: 0 },
    determinants: { F: 0, M: 0, C: 0, T: 0, V: 0 },
    emotions: new Set<string>(),
    totalLocations: { W: 0, D: 0, S: 0 },
    avgLength: 0,
    selfRefCount: 0,
    popularCount: 0,
  }

  for (const card of allCards) {
    for (const [k, v] of Object.entries(card.content)) {
      if (k in agg.content) (agg.content as any)[k] += v
    }
    for (const [k, v] of Object.entries(card.determinants)) {
      if (k in agg.determinants) (agg.determinants as any)[k] += v
    }
    card.emotions.forEach(e => agg.emotions.add(e))
    for (const loc of card.location) {
      if (loc.code in agg.totalLocations) {
        (agg.totalLocations as any)[loc.code] += loc.score
      }
    }
    agg.avgLength += card.responseLength
    if (card.hasSelfRef) agg.selfRefCount++
    if (card.matchesPopular) agg.popularCount++
  }
  agg.avgLength = Math.round(agg.avgLength / allCards.length)

  const d = agg.determinants
  const c = agg.content
  const totalDet = Object.values(d).reduce((a, b) => a + b, 0) || 1
  const totalCont = Object.values(c).reduce((a, b) => a + b, 0) || 1
  const pct = (key: string, map: Record<string, number>, total: number) => (map[key] || 0) / total

  const profiles: ProfileResult[] = []
  const nCards = allCards.length

  // 1. Empático-Social
  if ((pct('H', c, totalCont) > 0.25 || c.H >= nCards) && d.M > 0) {
    profiles.push({
      id: 'empatico-social', name: 'Empático-Social',
      desc: 'Tu percepción está centrada en lo humano y relacional. Ves personas, rostros e interacciones donde otros ven formas abstractas.',
      longDesc: 'Tu mirada busca conexión humana. En cada lámina tu atención se dirige naturalmente hacia figuras humanas o interacciones entre personas. Esto refleja una alta inteligencia interpersonal y una necesidad genuina de comprender a los demás. El movimiento que percibes en tus respuestas indica una rica vida interior y capacidad de empatía proyectiva.',
      traits: ['Empático', 'Social', 'Relacional', 'Humano'],
      strengths: ['Alta inteligencia interpersonal', 'Capacidad de conectar con otros', 'Empatía desarrollada'],
      growths: ['Equilibrar tu mundo social con tu mundo interior', 'Cuidar la sobreidentificación con los demás'],
    })
  }

  // 2. Práctico-Realista
  if (pct('A', c, totalCont) + pct('Cg', c, totalCont) > 0.4 && d.F > pct('M', d, totalDet)) {
    profiles.push({
      id: 'practico-realista', name: 'Práctico-Realista',
      desc: 'Tu percepción se ancla en lo concreto y reconocible. Ves animales, objetos familiares y formas claras.',
      longDesc: 'Tienes los pies en la tierra. Tu mente procesa la realidad desde lo práctico: identificas animales, objetos y formas que reconoces del mundo cotidiano. Tu énfasis en la forma sobre el movimiento sugiere que valoras la estructura y la claridad. Tus respuestas suelen coincidir con lo que la mayoría de personas ven, lo que indica un buen ajuste a la realidad compartida.',
      traits: ['Práctico', 'Realista', 'Concreto', 'Estructurado'],
      strengths: ['Excelente juicio de realidad', 'Pensamiento práctico y eficiente', 'Buena adaptación social'],
      growths: ['Explorar tu mundo creativo e imaginativo', 'Permitirte la ambigüedad sin ansiedad'],
    })
  }

  // 3. Analítico-Detallista
  if (pct('F', d, totalDet) > 0.5 && agg.totalLocations.D > 0) {
    profiles.push({
      id: 'analitico-detallista', name: 'Analítico-Detallista',
      desc: 'Tu atención se dirige a los detalles. Desmenuzas cada estímulo en sus componentes.',
      longDesc: 'Eres una persona que necesita comprender las cosas en profundidad, pieza por pieza. No te conformas con una impresión general: examinas cada sección, cada detalle. Tu pensamiento es meticuloso y preciso. Esta aproximación analítica es una fortaleza en contextos que requieren rigor, pero puede llevarte a perder la visión de conjunto.',
      traits: ['Analítico', 'Detallista', 'Preciso', 'Minucioso'],
      strengths: ['Atención al detalle excepcional', 'Rigor analítico', 'Precisión perceptual'],
      growths: ['Desarrollar visión global e integradora', 'No perder el bosque por los árboles'],
    })
  }

  // 4. Creativo-Imaginativo
  if (pct('Ab', c, totalCont) > 0.2 || d.M > totalDet * 0.3) {
    profiles.push({
      id: 'creativo-imaginativo', name: 'Creativo-Imaginativo',
      desc: 'Tu imaginación da vida a las manchas. Ves movimiento, energía y posibilidades donde otros ven formas estáticas.',
      longDesc: 'Tu mundo interior es rico y dinámico. Tus respuestas tienen vida: las formas se mueven, bailan, interactúan. No te limitas a describir lo que ves; construyes escenas, narrativas y posibilidades. Esta capacidad imaginativa es el motor de la creatividad. Tu percepción es original y poco convencional, lo que te permite ver posibilidades que otros pasan por alto.',
      traits: ['Creativo', 'Imaginativo', 'Original', 'Visionario'],
      strengths: ['Pensamiento divergente', 'Creatividad y originalidad', 'Riqueza de mundo interior'],
      growths: ['Anclar la creatividad en lo concreto', 'Equilibrar imaginación con pragmatismo'],
    })
  }

  // 5. Sensible-Emocional
  if (pct('C', d, totalDet) > 0.3 || agg.emotions.size >= 4) {
    profiles.push({
      id: 'sensible-emocional', name: 'Sensible-Emocional',
      desc: 'El color y las emociones guían tu percepción. Respondes con sensibilidad al estímulo afectivo.',
      longDesc: 'Las láminas en color te afectan profundamente. Tu atención se dirige al tono, la intensidad cromática y la atmósfera emocional de cada mancha. Tus respuestas revelan una persona que siente intensamente y procesa el mundo a través de las emociones. Esta sensibilidad es una fuente de intuición y conexión con los demás, pero también puede hacerte vulnerable a la sobrecarga afectiva.',
      traits: ['Sensible', 'Emocional', 'Intuitivo', 'Perceptivo'],
      strengths: ['Alta inteligencia emocional', 'Empatía y conexión afectiva', 'Intuición aguda'],
      growths: ['Desarrollar distancia emocional cuando sea necesario', 'Equilibrar emoción con razón'],
    })
  }

  // 6. Reflexivo-Contemplativo
  if (pct('V', d, totalDet) > 0.2 || agg.avgLength > 15 || agg.selfRefCount > 3) {
    profiles.push({
      id: 'reflexivo-contemplativo', name: 'Reflexivo-Contemplativo',
      desc: 'Tu mirada es profunda e introspectiva. Te tomas tiempo para explorar cada matiz de la mancha.',
      longDesc: 'Eres de las personas que no se quedan en la superficie. Tus respuestas son elaboradas, reflexivas. Percibes profundidad, textura y matices donde otros ven solo una mancha plana. Esta tendencia a la introspección te da una gran capacidad de autoconocimiento, pero tu propia profundidad a veces puede llevarte a la rumiación excesiva. Buscas significado en todo lo que encuentras.',
      traits: ['Reflexivo', 'Introspectivo', 'Profundo', 'Contemplativo'],
      strengths: ['Autoconocimiento desarrollado', 'Pensamiento profundo y elaborado', 'Capacidad analítica'],
      growths: ['Equilibrar introspección con acción', 'Evitar la sobreinterpretación'],
    })
  }

  // 7. Controlado-Racional
  if (agg.popularCount > 5 && pct('F', d, totalDet) > 0.4 && agg.emotions.size <= 2) {
    profiles.push({
      id: 'controlado-racional', name: 'Controlado-Racional',
      desc: 'Tu percepción es mesurada y convencional. Prefieres respuestas seguras y reconocidas.',
      longDesc: 'Eres una persona que valora el control y la certeza. Tus respuestas son las que la mayoría daría. Evitas lo ambiguo, lo emocionalmente cargado o lo inusual. Esta aproximación te brinda estabilidad y adaptación social, pero puede reflejar una tendencia a evitar lo desconocido o lo emocionalmente desafiante. Buscas estructurar tu mundo de manera predecible.',
      traits: ['Controlado', 'Racional', 'Convencional', 'Estable'],
      strengths: ['Buen juicio de realidad', 'Estabilidad emocional', 'Adaptación social sólida'],
      growths: ['Permitirte explorar lo nuevo y lo ambiguo', 'Conectar con tu espontaneidad'],
    })
  }

  // 8. Orgánico-Natural
  if (pct('Na', c, totalCont) > 0.2 || (pct('T', d, totalDet) > 0.15 && pct('Na', c, totalCont) > 0.1)) {
    profiles.push({
      id: 'organico-natural', name: 'Orgánico-Natural',
      desc: 'Tu percepción se conecta con lo orgánico. Ves paisajes, elementos naturales y texturas vivas.',
      longDesc: 'Hay una conexión natural en tu forma de percibir. Ves montañas, nubes, agua, fuego — elementos de la naturaleza que sugieren una personalidad en sintonía con lo orgánico y lo vital. Las texturas también juegan un papel importante en tus respuestas, indicando una sensibilidad táctil y una conexión con lo tangible. Esta orientación natural sugiere autenticidad y una búsqueda de armonía.',
      traits: ['Natural', 'Orgánico', 'Armonioso', 'Sensible'],
      strengths: ['Conexión con la naturaleza y lo vital', 'Autenticidad', 'Búsqueda de armonía'],
      growths: ['Desarrollar estructura sin perder espontaneidad', 'Equilibrar idealismo con practicidad'],
    })
  }

  // 9. Abierto-Integrador
  if (allCards.length >= 8) {
    const diverseContent = Object.values(c).filter(v => v > 0).length
    const diverseDet = Object.values(d).filter(v => v > 0).length
    if (diverseContent >= 5 && diverseDet >= 3 && agg.popularCount >= 3) {
      profiles.push({
        id: 'abierto-integrador', name: 'Abierto-Integrador',
        desc: 'Integras múltiples perspectivas en una visión coherente. Flexibilidad cognitiva y riqueza perceptual.',
        longDesc: 'Tu forma de percibir es rica y versátil. No te limitas a una sola categoría o enfoque: combinas contenido humano, animal, natural y abstracto. Tus determinantes son variados — usas forma, color, movimiento y textura. Esta integración de múltiples fuentes de información es señal de flexibilidad cognitiva, madurez perceptual y una mente abierta que puede sostener la complejidad sin fragmentarse.',
        traits: ['Integrador', 'Flexible', 'Versátil', 'Abierto'],
        strengths: ['Flexibilidad cognitiva excepcional', 'Capacidad integradora', 'Pensamiento complejo'],
        growths: ['Profundizar sin perder amplitud', 'Mantener enfoque ante la abundancia perceptual'],
      })
    }
  }

  // 10. Perfil de Alerta (si hay señales que requieren atención)
  if (c.Sx > 2 || (c.An > 3 && c.A === 0 && c.H === 0)) {
    profiles.push({
      id: 'alerta-exploratorio', name: 'Exploratorio-Intensivo',
      desc: 'Tu percepción incluye contenido inusual o anatómico que puede merecer exploración más profunda.',
      longDesc: 'Algunas de tus respuestas incluyen contenido anatómico o sexual que, en el contexto del Rorschach, puede indicar áreas de preocupación o particular sensibilidad en ciertos temas. No necesariamente es negativo, pero sería valioso explorar estas asociaciones en una sesión profesional para comprender su significado en tu contexto personal.',
      traits: ['Intensivo', 'Profundo', 'Exploratorio', 'Singular'],
      strengths: ['Honestidad en tus respuestas', 'Disposición a explorar temas profundos'],
      growths: ['Explorar estas áreas en un espacio terapéutico seguro'],
    })
  }

  // Default si no hay perfiles
  if (profiles.length === 0) {
    profiles.push({
      id: 'perceptivo-equilibrado', name: 'Perceptivo-Equilibrado',
      desc: 'Tu perfil muestra un balance saludable entre diferentes formas de percibir. Sin predominancias extremas.',
      longDesc: 'Tus respuestas no se inclinan fuertemente hacia ningún polo perceptual en particular. Esto sugiere una personalidad equilibrada, capaz de adaptar su enfoque según las demandas de la situación. Tienes acceso tanto a lo concreto como a lo abstracto, tanto a la forma como al color y al movimiento. Esta flexibilidad es una señal de salud perceptual y adaptabilidad.',
      traits: ['Equilibrado', 'Adaptable', 'Flexible', 'Saludable'],
      strengths: ['Balance perceptual', 'Adaptabilidad', 'Salud mental', 'Flexibilidad cognitiva'],
      growths: ['Seguir cultivando tu equilibrio', 'Explorar áreas que menos desarrollas naturalmente'],
    })
  }

  return profiles
}

/* ════════════════════════════════════
   INTERPRETACIÓN POR LÁMINA
   ════════════════════════════════════ */

function buildCardInterpretation(answers: Record<QuestionId, string>, cardIdx: number, score: CardScore): {
  summary: string
  theme: string
  insight: string
} {
  const card = INKBLOTS[cardIdx]
  const whatText = answers.what || ''
  const emotionText = answers.emotion || ''
  const movementText = answers.movement || ''
  const isStatic = /estático|quieto|inmóvil|quietud|parado/i.test(movementText)
  const isMoving = /movimiento|dinámico|acción|baila|corre|camina|vuela|flota/i.test(movementText)

  const topContent = Object.entries(score.content)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)

  let theme = 'Percepción neutra'
  if (topContent.length > 0) {
    const topCode = topContent[0][0] as ContentCode
    theme = CONTENT_CATS[topCode]?.label || 'Forma'
  }

  let summary = card.commonResponses.length > 0
    ? `En la ${card.label} las respuestas más comunes suelen ser: ${card.commonResponses.slice(0, 3).join(', ')}. `
    : ''
  summary += card.clinicalNote

  let insight = ''
  if (score.matchesPopular) {
    insight += '✅ Tus respuestas coinciden con las más populares para esta lámina, lo que indica buena sintonía con la percepción compartida. '
  } else {
    insight += '🔄 Tus respuestas son poco convencionales para esta lámina, lo que refleja originalidad y una forma única de percibir. '
  }
  if (isStatic) {
    insight += 'Tu percepción es más estática, lo que puede reflejar control o necesidad de estabilidad. '
  } else if (isMoving) {
    insight += 'Percibes movimiento, lo que sugiere una imaginación activa y dinámica. '
  }
  if (card.hasColor && score.determinants.C > 0) {
    insight += 'Notaste el color, indicando sensibilidad a estímulos afectivos. '
  } else if (card.hasColor && score.determinants.C === 0) {
    insight += 'No mencionaste el color; puede indicar indiferencia o supresión emocional. '
  }

  return { summary: summary.trim(), theme, insight }
}

/* ════════════════════════════════════
   COMPONENTE PRINCIPAL
   ════════════════════════════════════ */

type Phase = 'intro' | 'test' | 'results-gated' | 'results'

export default function RorschachTest() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [currentInkblot, setCurrentInkblot] = useState(0)
  const [responses, setResponses] = useState<Record<QuestionId, string>[]>([])
  const [currentAnswers, setCurrentAnswers] = useState<Record<QuestionId, string>>({} as Record<QuestionId, string>)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const totalInkblots = INKBLOTS.length

  const handleNext = useCallback(() => {
    const newResponses = [...responses, { ...currentAnswers }]
    setResponses(newResponses)
    if (currentInkblot < totalInkblots - 1) {
      setCurrentInkblot(currentInkblot + 1)
      setCurrentAnswers({} as Record<QuestionId, string>)
    } else {
      setPhase('results-gated')
    }
  }, [responses, currentAnswers, currentInkblot, totalInkblots])

  const handlePrev = useCallback(() => {
    if (currentInkblot > 0) {
      setCurrentInkblot(currentInkblot - 1)
      setCurrentAnswers({ ...responses[currentInkblot - 1] })
    }
  }, [currentInkblot, responses])

  const handleSubmitContact = () => {
    if (email.trim() || phone.trim()) {
      setSubmitted(true)
      setTimeout(() => setPhase('results'), 1500)
    }
  }

  const resetTest = () => {
    setPhase('intro')
    setCurrentInkblot(0)
    setResponses([])
    setCurrentAnswers({} as Record<QuestionId, string>)
    setEmail('')
    setPhone('')
    setSubmitted(false)
  }

  // --- RESULTS ---

  let cardAnalyses: CardScore[] = []
  let profiles: ProfileResult[] = []
  let cardInterpretations: ReturnType<typeof buildCardInterpretation>[] = []

  if (phase === 'results' && responses.length > 0) {
    cardAnalyses = responses.map((r, i) => analyzeCard(r, i))
    profiles = scoreProfiles(cardAnalyses)
    cardInterpretations = responses.map((r, i) => buildCardInterpretation(r, i, cardAnalyses[i]))
  }

  const primaryProfile = profiles[0]

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {/* ═══════ INTRO ═══════ */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: spring }}
          >
            <div className="mb-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="rounded-2xl overflow-hidden shadow-sm" style={{ width: 280, height: 280, border: '1px solid rgba(0,0,0,0.06)' }}>
                  <RorschachCanvas seed={0} width={280} height={280} />
                </div>
              </div>
              <span className="eyebrow mb-4">Test de Rorschach</span>
              <h2 className="text-3xl font-bold mt-4 mb-6" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>
                Las 10 láminas originales
              </h2>
            </div>

            <div className="space-y-4 text-left mb-10 max-w-md mx-auto p-6 rounded-xl" style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: '#eff6ff', color: '#2563eb' }}>1</div>
                <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>
                  Verás las <strong>10 láminas originales</strong> del Test de Rorschach utilizadas en psicología clínica.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: '#eff6ff', color: '#2563eb' }}>2</div>
                <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>
                  Observa cada lámina y responde <strong>3 preguntas</strong>: qué ves, si está en movimiento y qué emoción te provoca.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: '#eff6ff', color: '#2563eb' }}>3</div>
                <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>
                  <strong>No hay respuestas correctas.</strong> Confía en tu primera impresión. Tarda unos 10 minutos.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: '#eff6ff', color: '#2563eb' }}>4</div>
                <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>
                  Recibirás tu perfil perceptivo con interpretación personalizada de cada lámina.
                </p>
              </div>
            </div>

            <div className="text-center">
              <button onClick={() => setPhase('test')} className="btn btn-primary" style={{ padding: '14px 40px' }}>
                Comenzar test
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══════ TEST ═══════ */}
        {phase === 'test' && (
          <motion.div
            key={`inkblot-${currentInkblot}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: spring }}
          >
            {/* Progress */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold" style={{ color: '#2563eb', fontFamily: 'var(--font-display)' }}>
                {INKBLOTS[currentInkblot].label}
              </span>
              <div className="flex-1 h-1 rounded-full" style={{ background: '#e5e7eb' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: '#2563eb' }}
                  animate={{ width: `${((currentInkblot + 1) / totalInkblots) * 100}%` }}
                  transition={{ duration: 0.3, ease: spring }}
                />
              </div>
              <span className="text-xs" style={{ color: '#9ca3af' }}>
                {currentInkblot + 1}/{totalInkblots}
              </span>
            </div>

            {/* Image — real Rorschach card */}
            <div className="mb-3 flex justify-center">
              <div className="relative" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)', background: '#fff' }}>
                <img
                  src={INKBLOTS[currentInkblot].image}
                  alt={`Lámina de Rorschach ${currentInkblot + 1}`}
                  style={{ width: '100%', maxWidth: '500px', height: 'auto', display: 'block' }}
                  loading="lazy"
                />
              </div>
            </div>

            <p className="text-center text-xs mb-1 italic" style={{ color: '#9ca3af' }}>
              {INKBLOTS[currentInkblot].desc}
            </p>

            {/* Preguntas */}
            <div className="space-y-4 mb-6">
              {QUESTIONS.map((q) => (
                <div key={q.id}>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#374151', fontFamily: 'var(--font-display)' }}>
                    {q.text}
                  </label>
                  <span className="block text-xs mb-1.5" style={{ color: '#9ca3af' }}>{q.hint}</span>
                  <textarea
                    value={currentAnswers[q.id] || ''}
                    onChange={(e) => setCurrentAnswers({ ...currentAnswers, [q.id]: e.target.value })}
                    placeholder="Escribe tu respuesta..."
                    className="input"
                    style={{ minHeight: '56px', resize: 'vertical' }}
                    rows={2}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button onClick={handlePrev} disabled={currentInkblot === 0} className="btn btn-ghost" style={{ opacity: currentInkblot === 0 ? 0.3 : 1 }}>
                ← Anterior
              </button>
              <span className="text-xs" style={{ color: '#9ca3af' }}>
                {currentInkblot < totalInkblots - 1 ? `${totalInkblots - currentInkblot - 1} restantes` : 'Última lámina'}
              </span>
              <button onClick={handleNext} className="btn btn-primary">
                {currentInkblot < totalInkblots - 1 ? 'Siguiente' : 'Ver resultados'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══════ RESULTS GATED ═══════ */}
        {phase === 'results-gated' && (
          <motion.div
            key="gated"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: spring }}
            className="max-w-lg mx-auto text-center"
          >
            {!submitted ? (
              <>
                <div className="mb-8">
                  <span className="eyebrow mb-4">Casi listo</span>
                  <h2 className="text-2xl font-bold mt-4 mb-4" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>
                    Recibe tu perfil perceptivo completo
                  </h2>
                  <p className="text-sm" style={{ color: '#6b7280' }}>
                    Analizamos tus respuestas en las 10 láminas. Déjanos tus datos para recibir los resultados y coordinar una Sesión Cero gratuita donde profundizaremos.
                  </p>
                </div>

                <div className="space-y-4 mb-8 text-left max-w-sm mx-auto">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className="input" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>Teléfono (opcional)</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+56 9 XXXX XXXX" className="input" />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleSubmitContact}
                    disabled={!email.trim() && !phone.trim()}
                    className="btn btn-primary"
                    style={{ opacity: !email.trim() && !phone.trim() ? 0.5 : 1 }}>
                    Ver mi perfil perceptivo
                  </button>
                  <a href="/contacto" className="btn btn-ghost text-sm" style={{ color: '#2563eb' }}>
                    Agendar Sesión Cero directamente
                  </a>
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12">
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#dcfce7' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-sm font-medium" style={{ color: '#111827' }}>¡Datos registrados!</p>
                <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Preparando tus resultados...</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ═══════ RESULTS ═══════ */}
        {phase === 'results' && primaryProfile && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: spring }}
          >
            {/* Perfil principal */}
            <div className="text-center mb-10">
              <span className="eyebrow mb-4">Tu perfil perceptivo</span>
              <h3 className="text-2xl font-bold mt-3 mb-3" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>
                {primaryProfile.name}
              </h3>
              <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: '#4b5563' }}>
                {primaryProfile.longDesc}
              </p>
            </div>

            {/* Tags de perfil */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {primaryProfile.traits.map((t) => (
                <span key={t} className="pill pill-brand">{t}</span>
              ))}
            </div>

            {/* Fortalezas y áreas de crecimiento */}
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              <div className="p-5" style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <span className="label mb-3 block">Fortalezas</span>
                <ul className="space-y-2">
                  {primaryProfile.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#374151' }}>
                      <span style={{ color: '#16a34a' }}>✦</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5" style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <span className="label mb-3 block">Áreas de desarrollo</span>
                <ul className="space-y-2">
                  {primaryProfile.growths.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#374151' }}>
                      <span style={{ color: '#d97706' }}>○</span> {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Estadísticas perceptuales */}
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              <div className="p-5" style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <span className="label mb-3 block">Determinantes dominantes</span>
                {Object.entries(cardAnalyses.reduce((acc, c) => {
                  for (const [k, v] of Object.entries(c.determinants)) {
                    if (v > 0) acc[k] = (acc[k] || 0) + v
                  }
                  return acc
                }, {} as Record<string, number>)).sort(([, a], [, b]) => b - a).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs w-24" style={{ color: '#6b7280' }}>{(DETERMINANTS_DATA as any)[k]?.label || k}</span>
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: '#e5e7eb' }}>
                      <div className="h-full rounded-full" style={{ background: '#2563eb', width: `${Math.min(100, v * 12)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-5" style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <span className="label mb-3 block">Contenido recurrente</span>
                {Object.entries(cardAnalyses.reduce((acc, c) => {
                  for (const [k, v] of Object.entries(c.content)) {
                    if (v > 0) acc[k] = (acc[k] || 0) + v
                  }
                  return acc
                }, {} as Record<string, number>)).sort(([, a], [, b]) => b - a).filter(([, v]) => v > 0).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs w-24" style={{ color: '#6b7280' }}>{(CONTENT_CATS as any)[k]?.label || k}</span>
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: '#e5e7eb' }}>
                      <div className="h-full rounded-full" style={{ background: '#2563eb', width: `${Math.min(100, v * 15)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interpretación por lámina */}
            <div className="mb-10">
              <span className="label mb-4 block text-center">Interpretación lámina por lámina</span>
              <div className="space-y-3">
                {cardInterpretations.map((ci, i) => (
                  <motion.details
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="p-4 cursor-pointer"
                    style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}
                  >
                    <summary className="flex items-center gap-3 text-sm font-medium" style={{ color: '#111827', fontFamily: 'var(--font-display)' }}>
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[0.6rem] font-bold" style={{ background: '#e5e7eb', color: '#6b7280' }}>
                        {i + 1}
                      </span>
                      {INKBLOTS[i].label}: {ci.theme}
                    </summary>
                    <div className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: '#4b5563' }}>
                      <p><strong>Respuesta:</strong> {responses[i]?.what || '—'}</p>
                      <p><strong>Contexto clínico:</strong> {ci.summary}</p>
                      <p><strong>Insight:</strong> {ci.insight}</p>
                    </div>
                  </motion.details>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center p-8 rounded-2xl" style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.04)' }}>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: '#6b7280' }}>
                Este análisis es una exploración inicial automatizada. Una interpretación profesional del Test de Rorschach puede revelar mucho más sobre tu mundo interior, patrones de personalidad y procesos cognitivos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={resetTest} className="btn btn-ghost text-sm" style={{ color: '#2563eb' }}>
                  Repetir test
                </button>
                <a href="/contacto" className="btn btn-primary">Agendar Sesión Cero</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
