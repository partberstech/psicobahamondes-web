// Test de los Cinco Grandes (Big Five / OCEAN)
// 120 preguntas validadas en español
// Fuente: IPIP-NEO-PI (bigfive-web)

export interface BigFiveQuestion {
  text: string
  keyed: 'plus' | 'minus'
  domain: string
  facet: number
}

export const BIGFIVE_QUESTIONS: BigFiveQuestion[] = [
  { text: 'Me preocupo por las cosas', keyed: 'plus', domain: 'N', facet: 1 },
  { text: 'Creo que hago amigos fácilmente', keyed: 'plus', domain: 'E', facet: 1 },
  { text: 'Tengo una imaginación vívida', keyed: 'plus', domain: 'O', facet: 1 },
  { text: 'Confío en los demás', keyed: 'plus', domain: 'A', facet: 1 },
  { text: 'Completo las tareas correctamente', keyed: 'plus', domain: 'C', facet: 1 },
  { text: 'Suelo enojarme fácilmente', keyed: 'plus', domain: 'N', facet: 2 },
  { text: 'Me encantan las fiestas grandes', keyed: 'plus', domain: 'E', facet: 2 },
  { text: 'Creo que el arte es importante', keyed: 'plus', domain: 'O', facet: 2 },
  { text: 'Colaboro con otros solo si obtengo algún beneficio propio', keyed: 'minus', domain: 'A', facet: 2 },
  { text: 'Me gusta mantener las cosas en orden', keyed: 'plus', domain: 'C', facet: 2 },
  { text: 'A menudo me siento triste', keyed: 'plus', domain: 'N', facet: 3 },
  { text: 'Me gusta estar a cargo de las decisiones', keyed: 'plus', domain: 'E', facet: 3 },
  { text: 'Considero que soy muy sentimental', keyed: 'plus', domain: 'O', facet: 3 },
  { text: 'Me siento a gusto ayudando a los demás', keyed: 'plus', domain: 'A', facet: 3 },
  { text: 'Siempre cumplo mis promesas', keyed: 'plus', domain: 'C', facet: 3 },
  { text: 'Tengo dificultades para acercarme a los demás', keyed: 'plus', domain: 'N', facet: 4 },
  { text: 'Estoy ocupado/a todo el tiempo', keyed: 'plus', domain: 'E', facet: 4 },
  { text: 'Prefiero la variedad antes que la rutina', keyed: 'plus', domain: 'O', facet: 4 },
  { text: 'Me gusta pelear', keyed: 'minus', domain: 'A', facet: 4 },
  { text: 'Siempre trabajo duro', keyed: 'plus', domain: 'C', facet: 4 },
  { text: 'A menudo voy de borracheras', keyed: 'plus', domain: 'N', facet: 5 },
  { text: 'Amo la emoción', keyed: 'plus', domain: 'E', facet: 5 },
  { text: 'Me gusta mucho leer', keyed: 'plus', domain: 'O', facet: 5 },
  { text: 'Creo que soy mejor que los demás', keyed: 'minus', domain: 'A', facet: 5 },
  { text: 'Siempre estoy preparado', keyed: 'plus', domain: 'C', facet: 5 },
  { text: 'Me asusto fácilmente', keyed: 'plus', domain: 'N', facet: 6 },
  { text: 'Soy una persona muy alegre', keyed: 'plus', domain: 'E', facet: 6 },
  { text: 'Tiendo a votar por candidatos políticos liberales', keyed: 'plus', domain: 'O', facet: 6 },
  { text: 'Me compadezco por la gente sin hogar', keyed: 'plus', domain: 'A', facet: 6 },
  { text: 'Hago las cosas sin razonar mucho sobre ellas', keyed: 'minus', domain: 'C', facet: 6 },
  { text: 'Temo que suceda lo peor', keyed: 'plus', domain: 'N', facet: 1 },
  { text: 'Me siento cómodo con la gente', keyed: 'plus', domain: 'E', facet: 1 },
  { text: 'Disfruto de fantásticos vuelos de fantasía', keyed: 'plus', domain: 'O', facet: 1 },
  { text: 'Creo que las personas tienen buenas intenciones', keyed: 'plus', domain: 'A', facet: 1 },
  { text: 'Soy muy bueno en lo que hago', keyed: 'plus', domain: 'C', facet: 1 },
  { text: 'Me suelo molestar con facilidad', keyed: 'plus', domain: 'N', facet: 2 },
  { text: 'Me gusta hablar con muchas personas en las fiestas', keyed: 'plus', domain: 'E', facet: 2 },
  { text: 'Veo belleza en cosas que otros podrían no notar', keyed: 'plus', domain: 'O', facet: 2 },
  { text: 'Podría hacer trampa si eso me lleva adelante', keyed: 'minus', domain: 'A', facet: 2 },
  { text: 'A menudo olvido poner las cosas de vuelta donde las tomé', keyed: 'minus', domain: 'C', facet: 2 },
  { text: 'No me siento bien conmigo mismo', keyed: 'plus', domain: 'N', facet: 3 },
  { text: 'Intento dirigir a los demás', keyed: 'plus', domain: 'E', facet: 3 },
  { text: 'Puedo comprender bien las emociones de los demás', keyed: 'plus', domain: 'O', facet: 3 },
  { text: 'Me preocupo por los demás', keyed: 'plus', domain: 'A', facet: 3 },
  { text: 'Siempre digo la verdad', keyed: 'plus', domain: 'C', facet: 3 },
  { text: 'Temo ser el centro de atención', keyed: 'plus', domain: 'N', facet: 4 },
  { text: 'Creo que soy una persona activa y vigorosa', keyed: 'plus', domain: 'E', facet: 4 },
  { text: 'Prefiero quedarme cosas que conozco', keyed: 'minus', domain: 'O', facet: 4 },
  { text: 'Suelo gritar a las personas', keyed: 'minus', domain: 'A', facet: 4 },
  { text: 'Hago más de lo que se espera de mí', keyed: 'plus', domain: 'C', facet: 4 },
  { text: 'Rara vez me dejo llevar', keyed: 'minus', domain: 'N', facet: 5 },
  { text: 'Siempre busco la aventura', keyed: 'plus', domain: 'E', facet: 5 },
  { text: 'Intento evitar discusiones filosóficas', keyed: 'minus', domain: 'O', facet: 5 },
  { text: 'Espero mucho de mí mismo', keyed: 'minus', domain: 'A', facet: 5 },
  { text: 'Llevo a cabo mis planes', keyed: 'plus', domain: 'C', facet: 5 },
  { text: 'Me abrumo fácilmente de las cosas que suceden alrededor', keyed: 'plus', domain: 'N', facet: 6 },
  { text: 'Pienso que soy una persona muy divertida', keyed: 'plus', domain: 'E', facet: 6 },
  { text: 'No creo que haya acciones completamente correctas o incorrectas', keyed: 'plus', domain: 'O', facet: 6 },
  { text: 'Siento simpatía por aquellos que se encuentran en peores situaciones que yo', keyed: 'plus', domain: 'A', facet: 6 },
  { text: 'Suelo tomar decisiones precipitadas', keyed: 'minus', domain: 'C', facet: 6 },
  { text: 'Tengo miedo de muchas cosas', keyed: 'plus', domain: 'N', facet: 1 },
  { text: 'A menudo evito el contacto con los demás', keyed: 'minus', domain: 'E', facet: 1 },
  { text: 'Soy una persona que a veces sueña despierta', keyed: 'plus', domain: 'O', facet: 1 },
  { text: 'Confío en lo que dicen las personas', keyed: 'plus', domain: 'A', facet: 1 },
  { text: 'Realizo mis tareas sin ningún problema', keyed: 'plus', domain: 'C', facet: 1 },
  { text: 'A veces pierdo los estribos', keyed: 'plus', domain: 'N', facet: 2 },
  { text: 'Prefiero estar solo', keyed: 'minus', domain: 'E', facet: 2 },
  { text: 'No me gusta la poesía', keyed: 'minus', domain: 'O', facet: 2 },
  { text: 'Me aprovecho de los demás', keyed: 'minus', domain: 'A', facet: 2 },
  { text: 'Mi habitación es muy desordenada', keyed: 'minus', domain: 'C', facet: 2 },
  { text: 'A menudo me siento bajoneado', keyed: 'plus', domain: 'N', facet: 3 },
  { text: 'Tomo el control de las cosas', keyed: 'plus', domain: 'E', facet: 3 },
  { text: 'En raras ocasiones noto mis reacciones emocionales', keyed: 'minus', domain: 'O', facet: 3 },
  { text: 'Soy indiferente a los sentimientos de los demás', keyed: 'minus', domain: 'A', facet: 3 },
  { text: 'Las reglas fueron hechas para romperse', keyed: 'minus', domain: 'C', facet: 3 },
  { text: 'Sólo me siento cómodo en compañía de amigos', keyed: 'plus', domain: 'N', facet: 4 },
  { text: 'Hago muchas cosas en mi tiempo libre', keyed: 'plus', domain: 'E', facet: 4 },
  { text: 'No me atraen situaciones en constante cambio', keyed: 'minus', domain: 'O', facet: 4 },
  { text: 'No tengo recelo en insultar a la gente', keyed: 'minus', domain: 'A', facet: 4 },
  { text: 'Solo hago el trabajo justo para haberlo cumplido', keyed: 'minus', domain: 'C', facet: 4 },
  { text: 'Resisto las tentaciones fácilmente', keyed: 'minus', domain: 'N', facet: 5 },
  { text: 'Me gusta ser imprudente', keyed: 'plus', domain: 'E', facet: 5 },
  { text: 'Me es difícil entender ideas abstractas', keyed: 'minus', domain: 'O', facet: 5 },
  { text: 'Tengo altas expectativas de mí mismo', keyed: 'minus', domain: 'A', facet: 5 },
  { text: 'No hago mucho en mi tiempo libre', keyed: 'minus', domain: 'C', facet: 5 },
  { text: 'A veces siento que no soy capaz de manejar situaciones', keyed: 'plus', domain: 'N', facet: 6 },
  { text: 'Amo la vida', keyed: 'plus', domain: 'E', facet: 6 },
  { text: 'Tiendo a votar por los candidatos políticos conservativos', keyed: 'minus', domain: 'O', facet: 6 },
  { text: 'No me suelo implicar en los problemas de los demás', keyed: 'minus', domain: 'A', facet: 6 },
  { text: 'Hago las cosas sin cautela', keyed: 'minus', domain: 'C', facet: 6 },
  { text: 'Tiendo a estresarme con facilidad', keyed: 'plus', domain: 'N', facet: 1 },
  { text: 'Siempre mantengo cierta distancia con las personas', keyed: 'minus', domain: 'E', facet: 1 },
  { text: 'Me gusta perderme en mis pensamientos', keyed: 'plus', domain: 'O', facet: 1 },
  { text: 'Desconfío de la gente', keyed: 'minus', domain: 'A', facet: 1 },
  { text: 'Generalmente sé cómo hacer las cosas', keyed: 'plus', domain: 'C', facet: 1 },
  { text: 'No me molesto fácilmente', keyed: 'minus', domain: 'N', facet: 2 },
  { text: 'No me gusta mezclarme con la gente', keyed: 'minus', domain: 'E', facet: 2 },
  { text: 'No me agrada ir a museos de arte', keyed: 'minus', domain: 'O', facet: 2 },
  { text: 'Sería capaz de sabotear los planes de otros', keyed: 'minus', domain: 'A', facet: 2 },
  { text: 'Dejo mis pertenencias aquí y allá', keyed: 'minus', domain: 'C', facet: 2 },
  { text: 'Me siento cómodo conmigo mismo', keyed: 'minus', domain: 'N', facet: 3 },
  { text: 'Espero que alguien más lleve la batuta en un grupo', keyed: 'minus', domain: 'E', facet: 3 },
  { text: 'No comprendo a las personas que se emocionan fácilmente', keyed: 'minus', domain: 'O', facet: 3 },
  { text: 'No tengo tiempo para los demás', keyed: 'minus', domain: 'A', facet: 3 },
  { text: 'No suelo cumplir mis promesas', keyed: 'minus', domain: 'C', facet: 3 },
  { text: 'No me molestan las situaciones sociales difíciles', keyed: 'minus', domain: 'N', facet: 4 },
  { text: 'Me gusta tomar las cosas con calma', keyed: 'minus', domain: 'E', facet: 4 },
  { text: 'Soy una persona mayormente conservadora', keyed: 'minus', domain: 'O', facet: 4 },
  { text: 'No suelo apoyar a los otros', keyed: 'minus', domain: 'A', facet: 4 },
  { text: 'Pongo poco tiempo y esfuerzo en mi trabajo', keyed: 'minus', domain: 'C', facet: 4 },
  { text: 'Siempre puedo controlar mis antojos', keyed: 'minus', domain: 'N', facet: 5 },
  { text: 'Creo que soy una persona activa y vigorosa', keyed: 'plus', domain: 'E', facet: 5 },
  { text: 'No me interesan las discusiones teóricas', keyed: 'minus', domain: 'O', facet: 5 },
  { text: 'Me jacto de mis virtudes', keyed: 'minus', domain: 'A', facet: 5 },
  { text: 'Tengo dificultad para comenzar tareas', keyed: 'minus', domain: 'C', facet: 5 },
  { text: 'Me mantengo tranquilo/a bajo presión', keyed: 'minus', domain: 'N', facet: 6 },
  { text: 'Siempre miro el buen lado de la vida', keyed: 'plus', domain: 'E', facet: 6 },
  { text: 'Creo que deberíamos ser severos con el crimen', keyed: 'minus', domain: 'O', facet: 6 },
  { text: 'Trato de no pensar en los necesitados', keyed: 'minus', domain: 'A', facet: 6 },
  { text: 'Actúo sin pensar', keyed: 'minus', domain: 'C', facet: 6 },
]

/* ═══ FACETAS ═══ */
export const FACET_LABELS: Record<string, Record<number, string>> = {
  N: { 1: 'Ansiedad', 2: 'Hostilidad', 3: 'Depresión', 4: 'Ansiedad Social', 5: 'Impulsividad', 6: 'Vulnerabilidad' },
  E: { 1: 'Cordialidad', 2: 'Gregarismo', 3: 'Asertividad', 4: 'Actividad', 5: 'Búsqueda de emociones', 6: 'Emociones positivas' },
  O: { 1: 'Imaginación', 2: 'Interés artístico', 3: 'Emotividad', 4: 'Aventurerismo', 5: 'Intelecto', 6: 'Libertad de pensamiento' },
  A: { 1: 'Confianza', 2: 'Honestidad', 3: 'Altruismo', 4: 'Actitud conciliadora', 5: 'Modestia', 6: 'Sensibilidad' },
  C: { 1: 'Autoeficacia', 2: 'Orden', 3: 'Sentido del deber', 4: 'Orientación a logros', 5: 'Autodisciplina', 6: 'Precaución' },
}

export const FACET_DESCRIPTIONS: Record<string, Record<number, string>> = {
  N: {
    1: 'Tendencia a preocuparse, anticipar peligros y sentir tensión.',
    2: 'Propensión a experimentar ira, frustración y resentimiento.',
    3: 'Facilidad para experimentar tristeza, desánimo y melancolía.',
    4: 'Incomodidad en situaciones sociales, timidez y autoconciencia.',
    5: 'Dificultad para controlar impulsos y manejar deseos intensos.',
    6: 'Susceptibilidad al estrés, sensación de abrumo ante la presión.',
  },
  E: {
    1: 'Calidez y cercanía en las relaciones interpersonales.',
    2: 'Preferencia por la compañía de otros y entornos sociales.',
    3: 'Tendencia a liderar, expresar opiniones y tomar la iniciativa.',
    4: 'Alto nivel de energía, ritmo acelerado y productividad.',
    5: 'Búsqueda de estimulación, riesgo y experiencias intensas.',
    6: 'Frecuencia e intensidad de emociones positivas y alegría.',
  },
  O: {
    1: 'Vida interior rica, fantasía activa y pensamiento divergente.',
    2: 'Apreciación por el arte, la belleza y las expresiones creativas.',
    3: 'Acceso y conciencia de las propias emociones y sentimientos.',
    4: 'Curiosidad por explorar lo nuevo, viajar y probar experiencias.',
    5: 'Interés por ideas abstractas, debates intelectuales y conocimiento.',
    6: 'Mente abierta, cuestionamiento de autoridad y valores no tradicionales.',
  },
  A: {
    1: 'Creencia en la bondad y honestidad de las personas.',
    2: 'Autenticidad, sinceridad y rechazo a la manipulación.',
    3: 'Preocupación activa por el bienestar de los demás.',
    4: 'Preferencia por la cooperación y evitación del conflicto.',
    5: 'Humildad, ausencia de soberbia y reconocimiento de limitaciones.',
    6: 'Conmoción ante las necesidades ajenas y solidaridad.',
  },
  C: {
    1: 'Creencia en la propia capacidad para resolver problemas y lograr metas.',
    2: 'Organización, pulcritud y preferencia por el orden.',
    3: 'Integridad, responsabilidad y adherencia a principios éticos.',
    4: 'Ambición, perseverancia y orientación a resultados.',
    5: 'Capacidad para trabajar, persistir y completar tareas pese a distracciones.',
    6: 'Reflexividad, planificación y toma de decisiones meditada.',
  },
}

/* ═══ DOMINIOS ═══ */
export const DOMAINS: Record<string, { name: string; desc: string; color: string; icon: string }> = {
  O: { name: 'Apertura', desc: 'Curiosidad intelectual, creatividad, apertura a nuevas experiencias', color: '#7c3aed', icon: '●' },
  C: { name: 'Responsabilidad', desc: 'Organización, autodisciplina, orientación a logros', color: '#2563eb', icon: '■' },
  E: { name: 'Extraversión', desc: 'Sociabilidad, asertividad, búsqueda de estimulación', color: '#d97706', icon: '◆' },
  A: { name: 'Amabilidad', desc: 'Cooperación, empatía, confianza en los demás', color: '#16a34a', icon: '▲' },
  N: { name: 'Neuroticismo', desc: 'Susceptibilidad al estrés, ansiedad, inestabilidad emocional', color: '#dc2626', icon: '★' },
}

/* ═══ INTERPRETACIONES POR DOMINIO ═══ */
export function domainInterpretation(domain: string, score: number, isHigh: boolean, isLow: boolean): {
  narrative: string
  strength?: string
  growth?: string
} {
  const map: Record<string, { low: string; mid: string; high: string; strength?: string; growth?: string }> = {
    O: {
      low: 'Eres una persona práctica y con los pies en la tierra. Prefieres lo concreto, lo probado y lo familiar. Valoras la tradición y la experiencia directa por sobre la especulación.',
      mid: 'Tienes una apertura equilibrada: disfrutas explorar ideas nuevas cuando tienen aplicación práctica, pero mantienes un núcleo de convicciones estables. Sabes cuándo innovar y cuándo conservar.',
      high: 'Tu mente es curiosa e inquisitiva. Buscas activamente nuevas experiencias, ideas y formas de expresión. La creatividad y la exploración intelectual son pilares de tu personalidad.',
      strength: 'Pensamiento divergente, creatividad, curiosidad intelectual',
      growth: 'Complementar tu creatividad con ejecución disciplinada y atención a los detalles prácticos',
    },
    C: {
      low: 'Prefieres la flexibilidad y la espontaneidad sobre la rutina y la planificación. No te gusta sentirte atado por horarios o sistemas rígidos. Funcionas mejor en entornos dinámicos y fluidos.',
      mid: 'Eres organizado sin ser rígido. Planificas lo importante pero sabes improvisar cuando es necesario. Mantienes un equilibrio saludable entre estructura y flexibilidad en tu vida.',
      high: 'Eres metódico, organizado y confiable. Estableces metas claras y trabajas sistemáticamente para alcanzarlas. Tu autodisciplina y sentido del deber son pilares de tu éxito.',
      strength: 'Confiabilidad, autodisciplina, orientación a metas',
      growth: 'Permitirte mayor flexibilidad y espontaneidad sin sentir que pierdes el control',
    },
    E: {
      low: 'Eres reservado y valoras tu espacio personal. Prefieres la intimidad de grupos pequeños o la soledad a los grandes eventos sociales. Tu energía se repone en la tranquilidad.',
      mid: 'Eres selectivamente social. Disfrutas la compañía de otros pero también necesitas tiempo a solas. Sabes ser sociable cuando hace falta, pero no dependes de la estimulación externa.',
      high: 'Eres una persona sociable, enérgica y asertiva. Te nutres de la interacción con los demás y buscas entornos estimulantes. Tu entusiasmo es contagioso.',
      strength: 'Sociabilidad, asertividad, energía positiva',
      growth: 'Cultivar momentos de quietud y reflexión para equilibrar tu actividad social',
    },
    A: {
      low: 'Eres directo y pragmático en tus relaciones. Priorizas tus propios intereses cuando es necesario y no rehúyes el conflicto si la situación lo amerita. Valoras la honestidad por sobre la armonía.',
      mid: 'Eres cooperativo pero con límites claros. Te importa el bienestar de los demás, pero también sabes poner tus necesidades primero cuando hace falta. Eres amable sin ser ingenuo.',
      high: 'Eres una persona compasiva, cooperativa y de buen corazón. Confías en los demás y buscas activamente la armonía en tus relaciones. Tu empatía es una de tus mayores fortalezas.',
      strength: 'Empatía, cooperación, calidez humana',
      growth: 'Mantener límites saludables y no sacrificar tus propias necesidades por complacer a otros',
    },
    N: {
      low: 'Eres emocionalmente estable y resiliente. Manejas el estrés con calma y no te dejas afectar fácilmente por los altibajos de la vida. Tu ecuanimidad es una fortaleza notable.',
      mid: 'Experimentas emociones intensas pero generalmente mantienes el equilibrio. Tienes días buenos y malos, pero logras recuperarte sin que las emociones te desborden.',
      high: 'Eres sensible y emocionalmente reactivo. Experimentas las emociones con intensidad, especialmente las negativas. Tu sensibilidad te hace más consciente de ti mismo y de tu entorno.',
      strength: 'Autoconciencia emocional, profundidad de sentimientos, capacidad de alerta',
      growth: 'Desarrollar herramientas de regulación emocional y manejo del estrés',
    },
  }

  const data = map[domain]
  if (!data) return { narrative: '' }
  const narrative = isHigh ? data.high : isLow ? data.low : data.mid
  return { narrative, strength: data.strength, growth: data.growth }
}

/* ═══ PERFILES COMBINADOS ═══ */
export function generateProfileNarrative(scores: Record<string, number>): {
  title: string
  summary: string
  careers: string[]
  strengths: string[]
  growths: string[]
} {
  const h = (d: string) => scores[d] >= 65
  const l = (d: string) => scores[d] <= 35
  const m = (d: string) => !h(d) && !l(d)

  // Determine profile archetype
  let archetype = 'Perfil Equilibrado'
  let summary = ''

  if (h('E') && h('O') && !h('N')) {
    archetype = 'Explorador Creativo'
    summary = 'Tu combinación de alta Extraversión y alta Apertura te convierte en una persona socialmente activa y mentalmente curiosa. Disfrutas tanto la interacción con los demás como la exploración de ideas y experiencias nuevas. Tu estabilidad emocional te permite aventurarte sin abrumarte.'
  } else if (h('C') && h('A') && m('E')) {
    archetype = 'Pilar Confiable'
    summary = 'Eres una persona responsable, amable y moderadamente sociable. Tu combinación de alta Responsabilidad y alta Amabilidad te convierte en alguien en quien los demás confían naturalmente. Eres el pilar que sostiene equipos y relaciones.'
  } else if (h('N') && l('E')) {
    archetype = 'Alma Sensible'
    summary = 'Tu alta sensibilidad combinada con tu mundo interior rico te hace profundamente consciente de las emociones y matices que otros pasan por alto. Puedes ser más propenso a la preocupación, pero también tienes una profundidad emocional que es un don.'
  } else if (h('O') && l('C')) {
    archetype = 'Espíritu Libre'
    summary = 'Tu alta Apertura combinada con menor Responsabilidad refleja una personalidad que valora la libertad creativa por sobre la estructura. Prefieres seguir tu inspiración antes que un plan establecido. Los entornos rígidos te resultan sofocantes.'
  } else if (h('E') && h('C')) {
    archetype = 'Líder Dinámico'
    summary = 'Combinas energía social con disciplina. Esta es la combinación clásica de liderazgo: te gusta estar con personas y tienes la organización para hacer que las cosas sucedan. Inspiras a otros tanto con tu ejemplo como con tu entusiasmo.'
  } else if (h('A') && h('N')) {
    archetype = 'Empático Profundo'
    summary = 'Tu alta Amabilidad y elevada sensibilidad te convierten en una persona profundamente empática. Sientes el dolor ajeno como propio y te preocupas genuinamente por los demás. Esta intensidad emocional es tu mayor fortaleza y también tu mayor desafío.'
  }

  if (!summary) {
    summary = 'Tu perfil muestra una combinación única de rasgos. Eres una persona multidimensional que no encaja en un solo arquetipo. Cada dimensión de tu personalidad contribuye a formar una identidad compleja y rica.'
  }

  // Derived careers
  const allCareers: string[] = []
  if (h('O') && h('A') && h('C')) allCareers.push('Psicología clínica')
  if (h('O') && h('C') && m('E')) allCareers.push('Investigación científica')
  if (h('E') && h('C') && h('A')) allCareers.push('Gerencia de equipos')
  if (h('E') && h('O')) allCareers.push('Emprendimiento creativo')
  if (h('C') && h('A') && m('O')) allCareers.push('Administración / Finanzas')
  if (h('E') && h('A')) allCareers.push('Ventas / Relaciones públicas')
  if (h('O') && l('C')) allCareers.push('Arte / Diseño / Creación de contenido')
  if (h('C') && l('E')) allCareers.push('Análisis de datos / Contabilidad')
  if (h('A') && h('E') && h('O')) allCareers.push('Docencia / Formación')
  if (h('C') && h('O')) allCareers.push('Arquitectura / Ingeniería')
  if (h('E') && h('C') && h('A')) allCareers.push('Dirección de proyectos')
  if (h('A') && h('N')) allCareers.push('Trabajo social / Terapia')

  // Strengths & growths from domain interpretations
  const strengths: string[] = []
  const growths: string[] = []
  for (const d of ['O', 'C', 'E', 'A', 'N'] as const) {
    const interp = domainInterpretation(d, scores[d], h(d), l(d))
    if (h(d) && interp.strength) strengths.push(interp.strength)
    if (h(d) && interp.growth) growths.push(interp.growth)
  }
  if (strengths.length === 0 && h('N')) strengths.push('Profundidad emocional y autoconciencia')

  return {
    title: archetype,
    summary,
    careers: Array.from(new Set(allCareers)).slice(0, 5),
    strengths: strengths.slice(0, 4),
    growths: growths.slice(0, 3),
  }
}

/* ═══ OPCIONES ═══ */
export const CHOICES = [
  { text: 'Muy en desacuerdo', score: 1 },
  { text: 'Moderadamente en desacuerdo', score: 2 },
  { text: 'Ni de acuerdo, ni en desacuerdo', score: 3 },
  { text: 'Moderadamente de acuerdo', score: 4 },
  { text: 'Muy de acuerdo', score: 5 },
]

/* ═══ SECCIONES ═══ */
export interface DomainSection {
  key: string
  name: string
  desc: string
  color: string
  icon: string
  questionCount: number
}

export const DOMAIN_SECTIONS: DomainSection[] = Object.entries(DOMAINS).map(([key, d]) => ({
  key,
  name: d.name,
  desc: d.desc,
  color: d.color,
  icon: d.icon,
  questionCount: BIGFIVE_QUESTIONS.filter(q => q.domain === key).length,
}))

export function getQuestionsForDomains(domains: string[]) {
  return BIGFIVE_QUESTIONS.map((q, i) => ({ ...q, globalIndex: i }))
    .filter(q => domains.includes(q.domain))
}
