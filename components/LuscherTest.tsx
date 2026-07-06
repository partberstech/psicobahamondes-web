'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const spring = [0.32, 0.72, 0, 1]

/* ── Colores oficiales Lüscher ── */
const COLORS = [
  { id: 1, name: 'Azul', hex: '#004983', meaning: 'Necesidad de tranquilidad, armonía y libertad' },
  { id: 2, name: 'Verde', hex: '#1D9772', meaning: 'Autonomía, seguridad, sentido de igualdad' },
  { id: 3, name: 'Rojo', hex: '#F12F23', meaning: 'Vitalidad, acción, fuerza vital, impulso' },
  { id: 4, name: 'Amarillo', hex: '#F2DD00', meaning: 'Optimismo, cambio, esperanza, claridad mental' },
  { id: 5, name: 'Púrpura', hex: '#D42481', meaning: 'Sensibilidad, idealismo, necesidad de protección' },
  { id: 6, name: 'Marrón', hex: '#C55223', meaning: 'Satisfacción, comodidad, sensualidad, seguridad física' },
  { id: 7, name: 'Negro', hex: '#231F20', meaning: 'Rechazo, agresividad, necesidad de protección extrema' },
  { id: 8, name: 'Gris', hex: '#98938D', meaning: 'Neutralidad, protección, deseo de no molestar' },
]

/* ── Significado de CADA color en CADA grupo de posición ── */
// Cada color tiene un significado distinto según si está en una posición
// favorecida (plus), secundaria (asterisk), indiferente (equal) o rechazada (minus)
const COLOR_POSITION_MEANINGS: Record<string, Record<number, string>> = {
  plus_first: {
    1: 'Tu mayor deseo es vivir una relación profunda y auténtica. Anhelas paz, confianza y un vínculo donde puedas ser tú mismo sin reservas.',
    2: 'Necesitas afirmar tu lugar. Buscas autonomía, determinación y la fortaleza para mantener tu rumbo sin que nada te desvíe.',
    3: 'Te impulsa una intensa energía vital. Deseas acción, logros y la capacidad de enfrentar cualquier desafío con determinación.',
    4: 'Buscas horizontes nuevos. Ansías libertad, cambio y la esperanza de que algo mejor está por llegar a tu vida.',
    5: 'Te atrae lo mágico y sensible. Anhelas una experiencia que trascienda lo ordinario, donde puedas sentirte profundamente identificado.',
    6: 'Buscas seguridad y confort. Deseas una base firme, un refugio donde puedas relajarte completamente y sentirte en casa.',
    7: 'Necesitas establecer límites firmes. Quieres demostrar tu poder y no permitir que nada ni nadie te doblegue.',
    8: 'Deseas mantener distancia emocional. Prefieres observar sin comprometerte, protegiendo tu espacio personal a toda costa.',
  },
  plus_second: {
    1: 'La armonía emocional complementa tu deseo principal. Buscas un entorno donde reine la comprensión y la conexión sincera.',
    2: 'Afirmar tu independencia es parte importante de lo que buscas. Necesitas espacio para ser quien eres.',
    3: 'La vitalidad y el dinamismo son ingredientes esenciales de tu bienestar. Buscas acción, pero desde un lugar de control.',
    4: 'El optimismo y la apertura a nuevas posibilidades te acompañan. Buscas evolucionar sin perder tu esencia.',
    5: 'La sensibilidad estética y emocional forma parte de tus deseos. Buscas belleza y significado en lo que te rodea.',
    6: 'La comodidad y la estabilidad práctica complementan tu visión. Buscas sentirte seguro en tu entorno material.',
    7: 'Afirmar tu voluntad y marcar territorio es parte de lo que necesitas para sentirte completo.',
    8: 'El espacio y la no interferencia son importantes para ti. Buscas un acuerdo tácito que respete tu individualidad.',
  },
  asterisk_first: {
    1: 'En este momento valoras especialmente la tranquilidad emocional. Tu estado actual se caracteriza por buscar serenidad y comprensión.',
    2: 'Hay en ti una voluntad firme y decidida. Tu estado actual te permite mantenerte en tu posición con convicción.',
    3: 'Tu energía vital está en plena actividad. Te encuentras en un estado de iniciativa y empuje.',
    4: 'Tu mente está abierta a nuevas posibilidades. Tu estado actual es de expectativa y disposición al cambio.',
    5: 'Hay en ti una sensibilidad especial. Te encuentras en un estado de receptividad emocional y apertura estética.',
    6: 'Tu estado actual está anclado en lo práctico. Buscas consolidar lo que tienes y sentirte en tierra firme.',
    7: 'Hay en ti una postura clara de límites. Te encuentras definiendo qué aceptas y qué no en tu vida.',
    8: 'Tu estado es de reserva contemplativa. Prefieres mantener cierta distancia para evaluar con claridad.',
  },
  asterisk_second: {
    1: 'Valoras la profundidad en tus vínculos actuales. Buscas que las relaciones que cultivas tengan autenticidad y significado.',
    2: 'Mantienes una postura de autonomía tranquila. Te sientes capaz de sostener tus decisiones sin necesitar aprobación.',
    3: 'Hay iniciativa y vitalidad en tu forma actual de estar. Te mueves con energía hacia lo que te interesa.',
    4: 'Abrazas el cambio con apertura. Tu actitud actual es de curiosidad y disposición a nuevas experiencias.',
    5: 'Tu sensibilidad te permite percibir matices que otros pasan por alto. Estás en sintonía con tu mundo interior.',
    6: 'Valoras lo tangible y real. Prefieres construir sobre bases sólidas que dejarte llevar por lo efímero.',
    7: 'Mantienes una postura definida. No estás dispuesto a ceder en lo que consideras fundamental.',
    8: 'Tu actitud es de observación cautelosa. Prefieres entender antes de actuar y mantener tus opciones abiertas.',
  },
  equal_first: {
    1: 'Hay en ti una capacidad latente de conexión profunda. Aunque no sea tu prioridad, posees una rica vida emocional interior.',
    2: 'Tu determinación silenciosa es una de tus fortalezas ocultas. Tienes más persistencia de la que aparentas.',
    3: 'Hay un reservorio de energía y pasión que no estás utilizando activamente. Tu potencial de acción es mayor del que despliegas.',
    4: 'Tu apertura mental es un recurso disponible pero no siempre aprovechado. Hay ideas y perspectivas que podrías explorar más.',
    5: 'Tu sensibilidad es más profunda de lo que muestras. Hay una veta creativa y espiritual que merece atención.',
    6: 'Tu conexión con lo práctico y lo estable es un recurso que utilizas cuando es necesario, sin hacer de ello tu bandera.',
    7: 'Tu capacidad de poner límites existe pero no la ejerces constantemente. Sabes decir no cuando hace falta.',
    8: 'Tu distancia protectora es una herramienta que usas selectivamente. Sabes cuándo retirarte para observar.',
  },
  equal_second: {
    1: 'La capacidad de conectar con otros está presente, aunque no sea tu foco actual. Tus vínculos tienen más profundidad de la que expresas.',
    2: 'Tu autonomía es un recurso interno sólido. No necesitas demostrarla constantemente porque la posees genuinamente.',
    3: 'Tu vitalidad está disponible cuando la necesitas. Tienes energía de reserva para cuando llegue el momento.',
    4: 'Tu mente abierta te permite adaptarte sin esfuerzo. La flexibilidad es una de tus herramientas internas.',
    5: 'Tu mundo interior es rico y está disponible para ti. La sensibilidad es un recurso al que accedes cuando el contexto lo permite.',
    6: 'Tu sentido práctico es un ancla silenciosa. Te mantiene estable incluso cuando otras áreas están en movimiento.',
    7: 'Tu capacidad de poner límite es selectiva pero efectiva. La usas con precisión más que con frecuencia.',
    8: 'Tu distancia estratégica es una herramienta de discernimiento. Sabes retirarte para ganar perspectiva.',
  },
  minus_first: {
    1: 'Hay una tensión en tu vínculo con la intimidad emocional. Tal vez sientes que tus relaciones no te ofrecen la profundidad que necesitas, o temes depender demasiado de otros.',
    2: 'La presión por afirmarte o demostrar tu valor te genera incomodidad. Hay circunstancias que percibes como una amenaza a tu autonomía.',
    3: 'La sobreestimulación o la confrontación te resultan abrumadoras. Necesitas protegerte del exceso de demanda o agresividad externa.',
    4: 'Hay decepción o escepticismo que te impide abrazar nuevas posibilidades. Sientes que las promesas de cambio no siempre se cumplen.',
    5: 'La vulnerabilidad emocional te inquieta. Prefieres evitar situaciones que te expongan demasiado o que te parezcan irreales.',
    6: 'La inestabilidad material o la falta de rutina te generan ansiedad. Necesitas certezas concretas para sentirte seguro.',
    7: 'Rechazas activamente cualquier forma de coerción o sometimiento. Defiendes tu integridad con determinación.',
    8: 'La presión social o la exigencia de involucrarte te resultan incómodas. Necesitas preservar tu espacio personal a toda costa.',
  },
  minus_second: {
    1: 'La distancia emocional o la falta de reciprocidad te pesa. Tal vez has experimentado decepciones que te llevan a proteger tu mundo afectivo.',
    2: 'La rigidez o el control excesivo sobre ti te resultan asfixiantes. Necesitas espacio para respirar y ser tú mismo.',
    3: 'El conflicto abierto o la competencia desmedida son situaciones que prefieres evitar. Buscas canales más pacíficos de expresión.',
    4: 'La sobreestimulación o el exceso de opciones te abruman. A veces menos es más cuando se trata de cambios y decisiones.',
    5: 'Lo artificial o la falta de autenticidad te resultan profundamente desagradables. Valoras la verdad por encima de la apariencia.',
    6: 'La precariedad o la falta de solidez te generan rechazo. Buscas bases firmes sobre las que construir.',
    7: 'La falta de límites o la invasión de tu espacio te resultan inaceptables. Defiendes tu territorio emocional con firmeza.',
    8: 'El ruido, el exceso de estímulos o la presión social te agotan. Necesitas silencio y distancia para reponerte.',
  },
}

/* ── Interpretaciones de PARES específicos (Lüscher clásico) ── */
// Estas son las combinaciones que tienen un significado reconocido en la bibliografía.
// Los pares no listados aquí se generan dinámicamente desde COLOR_POSITION_MEANINGS.
const PAIR_INTERPRETATIONS: Record<string, Record<string, string>> = {
  plus: {
    '13': 'Buscas una relación afectuosa, satisfactoria y armoniosa. Anhelas una unión íntima donde haya amor, sacrificio mutuo y confianza.',
    '14': 'Quieres desarrollarte libremente y explorar tu potencial sin restricciones. Buscas un equilibrio entre afecto y libertad.',
    '12': 'Necesitas tanto la conexión emocional como la autonomía. Deseas encontrar un punto de equilibrio entre la intimidad y la independencia.',
    '23': 'Buscas la determinación y elasticidad de voluntad necesarias para establecerse e independizarse a pesar de las dificultades.',
    '24': 'Quieres abrirte camino con flexibilidad. Buscas el éxito sin perder tu autenticidad.',
    '34': 'Anhelas una vida rica en actividad y experiencia. Quieres desarrollarte libremente y superar la autoduda.',
    '35': 'Deseas intensidad con un toque de sensibilidad. Buscas experiencias que combinen pasión y significado emocional.',
    '36': 'Necesitas canalizar tu energía vital hacia logros concretos. Buscas resultados tangibles de tu esfuerzo.',
    '37': 'Quieres abrirte paso con autoridad y determinación. No aceptas obstáculos en tu camino.',
    '45': 'Sobreimaginativo, dado al fantaseo. Anhelas cosas interesantes y emocionantes que te sucedan.',
    '54': 'Eres capaz de hacerte simpático y ganar apoyo mediante tu encanto. Alerta y observador, buscas nuevos ideales.',
    '56': 'Combinas sensibilidad con un deseo de bienestar concreto. Buscas un entorno que alimente tanto tu alma como tu cuerpo.',
    '15': 'Necesitas ternura y sensibilidad para fundirte con el otro. Eres sensible hacia lo estético y lo culto.',
    '16': 'Deseas un refugio seguro donde puedas descansar y ser cuidado. La seguridad emocional es tu prioridad.',
    '18': 'Buscas armonía sin exigencias abrumadoras. Prefieres los vínculos que respetan tu espacio.',
    '78': 'Quieres establecer límites claros y mantener tu distancia. Necesitas definir tu territorio antes de permitir cualquier acercamiento.',
    '46': 'Imaginas un futuro mejor mientras consolidas tu base actual. Buscas progreso sin sacrificar tu estabilidad.',
    '25': 'Deseas independencia con un toque de idealismo. Buscas un camino propio que tenga significado personal.',
    '38': 'Necesitas acción sin presiones externas. Buscas expresar tu vitalidad en tus propios términos.',
    '47': 'Quieres liberarte de restricciones y abrir nuevas posibilidades. La rebeldía constructiva te impulsa.',
    '57': 'Buscas experiencias que trasciendan lo ordinario y te conecten con algo más grande.',
    '68': 'Priorizas la comodidad y la paz. Necesitas un entorno estable y sin conflictos para sentirte bien.',
  },
  asterisk: {
    '5': 'Necesitas sentirte identificado con alguien o algo. Anhelas apoyo a través de tu simpatía. Eres sentimental y romántico.',
    '4': 'Necesitas un cambio en circunstancias que te brinde alivio del estrés. Buscas soluciones mejores.',
    '6': 'Buscas libertad de problemas y un estado seguro de comodidad física para relajarte.',
    '2': 'Deseas armonía tranquila y satisfacción pacífica.',
    '7': 'Consideras las circunstancias actuales desagradables y exigentes. Te proteges activamente.',
    '8': 'Mantienes una distancia de seguridad. Prefieres no involucrarte demasiado emocionalmente.',
    '3': 'Tu energía vital está en busca de cauces de expresión. Necesitas acción dirigida.',
    '1': 'Anhelas paz interior y relaciones auténticas. Buscas espacios de confianza donde puedas ser tú mismo.',
    '13': 'Vives entre la necesidad de conexión y el impulso de acción. Buscas integrar tu sensibilidad con tu energía vital.',
    '24': 'Tu determinación se combina con optimismo. Tienes la convicción de que puedes abrir tu propio camino.',
    '35': 'Tu energía se tiñe de sensibilidad. No buscas cualquier acción, sino aquella que tenga significado.',
    '46': 'Entre la esperanza de cambio y la necesidad de estabilidad, buscas un punto medio que te permita avanzar sin caos.',
    '57': 'Tu sensibilidad te lleva a buscar experiencias que trasciendan lo cotidiano. Hay un anhelo de significado más profundo.',
    '68': 'Buscas paz y confort sin renunciar a tu espacio personal. Un equilibrio sutil entre cercanía y distancia.',
    '12': 'Entre el corazón y la voluntad, buscas un equilibrio. Quieres conectar sin perder tu autonomía.',
    '15': 'Tu sensibilidad estética y emocional busca expresión. Buscas belleza y autenticidad en tu entorno.',
    '26': 'Mantienes una posición firme con necesidad de seguridad de fondo. No cedes fácilmente, pero necesitas saber que hay una base sólida.',
    '37': 'Tu ímpetu se encuentra con límites. La fuerza de tu voluntad choca con barreras que necesitas sortear.',
    '48': 'Miras hacia adelante pero con cautela. Quieres cambio, pero sin perder el control del ritmo.',
    '16': 'Tu deseo de armonía se enfrenta a la necesidad de protección. Buscas paz pero mantienes guardia.',
    '23': 'Entre la determinación y el impulso, te mueves con convicción. Sabes lo que quieres y cómo obtenerlo.',
    '38': 'Canalizas tu energía con moderación. Actúas con intensidad pero eligiendo cuidadosamente tus batallas.',
    '27': 'Afirmas tu posición con firmeza. No permites que nadie cuestione tu autonomía o tus decisiones.',
    '14': 'Entre el afecto y la libertad, buscas un camino propio. Quieres conexiones que no limiten tu desarrollo.',
    '56': 'Tu sensibilidad busca un ancla en lo tangible. Necesitas que tus ideales tengan una base real.',
    '17': 'Entre la vulnerabilidad y la defensa, te mueves con cautela. Proteges tu mundo interior mientras deseas abrirte.',
    '28': 'Afirmas tu independencia en silencio. Prefieres actuar que declarar, demostrar que prometer.',
    '34': 'El impulso se encuentra con el optimismo. Tienes la energía y la actitud para hacer realidad tus proyectos.',
    '36': 'Tu energía se dirige a construir bases sólidas. Buscas acción que dé resultados concretos y duraderos.',
    '45': 'Tu imaginación te lleva a visualizar posibilidades. Eres un soñador con los pies en la tierra.',
    '58': 'Tu sensibilidad se protege en la distancia. Necesitas espacio para conectar con tu mundo interior.',
    '67': 'Entre la comodidad y la resistencia, buscas seguridad. Quieres sentirte protegido sin sacrificar tu integridad.',
  },
  equal: {
    '12': 'Necesitas un ambiente pacífico. Buscas liberación del estrés y controlas la situación con precaución.',
    '15': 'Anhelas ternura y sensibilidad para fundirte. Eres sensible hacia lo estético y lo culto.',
    '20': 'Quieres establecerte y causar impacto a pesar de circunstancias desfavorables.',
    '60': 'Necesitas descanso, relajación, seguridad y libertad de conflictos.',
    '14': 'La conexión emocional y la libertad coexisten en ti sin conflicto. Puedes dar afecto sin perder tu espacio.',
    '16': 'Tu vida emocional es estable. Tienes una capacidad equilibrada de dar y recibir afecto.',
    '24': 'Tu determinación es discreta pero firme. Avanzas sin hacer ruido, con persistencia silenciosa.',
    '26': 'Mantienes un equilibrio entre tu voluntad y tu necesidad de seguridad. No necesitas demostrar nada a nadie.',
    '35': 'Tu energía vital y tu sensibilidad están en equilibrio. Actúas con pasión pero sin perder la ternura.',
    '37': 'Tu determinación tiene un límite claro. Actúas con fuerza hasta donde tu integridad lo permite.',
    '46': 'La esperanza y la estabilidad coexisten pacíficamente. Sueñas sin perder el piso.',
    '48': 'Miras al futuro con calma. Sin prisa pero sin pausa, avanzas a tu propio ritmo.',
    '13': 'La sensibilidad y la acción están en balance en tu interior. Sabes cuándo ser firme y cuándo ser suave.',
    '23': 'Tu voluntad y tu energía se complementan naturalmente. Tienes tanto la determinación como el empuje.',
    '25': 'Tu independencia se expresa con sutileza. Eres autónomo sin necesidad de proclamarlo.',
    '34': 'La vitalidad y el optimismo fluyen en ti de manera natural. Afrontas la vida con energía positiva.',
    '36': 'Tu energía se traduce en construcción. Tus esfuerzos tienen una orientación práctica y productiva.',
    '38': 'Actúas con mesura. Sabes cuándo avanzar y cuándo esperar.',
    '45': 'Tienes una imaginación fértil pero anclada. Tus ideas tienen un lado práctico.',
    '47': 'Sabes cuándo es momento de cambiar de rumbo. Tienes flexibilidad sin perder tu centro.',
    '56': 'Tu sensibilidad encuentra expresión en lo concreto. Eres un alma práctica y soñadora a la vez.',
    '57': 'Hay en ti una veta mística que coexiste con la claridad. Sabes mirar más allá sin perder de vista la realidad.',
    '58': 'Tu mundo interior es rico pero no te aísla. Disfrutas de tu sensibilidad sin perder conexión con el exterior.',
    '67': 'Valoras la paz y el confort, pero también sabes marcar límites. Una combinación de suavidad y firmeza.',
    '68': 'Disfrutas de la tranquilidad y el espacio personal. Sabes estar contigo mismo sin sentirte solo.',
    '17': 'Tu mundo afectivo tiene una veta de protección. Amas pero no te entregas sin reservas.',
    '27': 'Afirmas tu posición sin hostilidad. Sabes lo que quieres y lo comunicas con claridad serena.',
    '18': 'Buscas cercanía que respete tu espacio. Conexiones donde puedas ser tú sin perder tu autonomía.',
    '28': 'Tu independencia es silenciosa y serena. Actúas desde tu centro, sin necesidad de aprobación externa.',
    '78': 'Tu distancia no es frialdad, sino discernimiento. Sabes esperar y observar antes de comprometerte.',
  },
  minus: {
    '61': 'Quieres contento, comodidad y ausencia de conflicto. Necesitas seguridad y protección.',
    '62': 'Te mantienes bajo estricto control para no colapsar bajo dificultades.',
    '63': 'Tienes un poderoso impulso hacia la sensualidad.',
    '64': 'Sientes que hay poca perspectiva de lograr tus esperanzas y te rindes al desaliento.',
    '16': 'Anhelas un refugio sin conflictos que ofrezca seguridad y comodidad. Necesitas cuidado considerado.',
    '17': 'Necesitas alivio urgente. Te sientes maltratado y estás agitado. Tu situación te parece intolerable.',
    '26': 'Sientes que se te exige demasiado y estás agotado, pero quieres superar las dificultades aun así.',
    '27': 'Quieres demostrar superioridad ante la debilidad. Actúas con severidad y actitud autocrática.',
    '30': 'Quieres barrer lo que obstaculiza y seguir tus impulsos hacia situaciones especiales.',
    '35': 'Estás preocupado por cosas intensamente excitantes. Buscas ser percibido como una personalidad interesante.',
    '46': 'Estás en desesperación y necesitas alivio. Anhelas comodidad y recuperación.',
    '47': 'Intentas escapar mediante decisiones abruptas o cambios de dirección impulsivos.',
    '56': 'Anhelas estimulación en una atmósfera voluptuosa de lujo sensorial.',
    '57': 'Necesitas un vínculo o fusión con otro que sea sensualmente satisfactorio.',
    '12': 'La tensión entre tu necesidad de afecto y tu deseo de autonomía te genera conflicto interno.',
    '13': 'Tu energía vital choca con tu necesidad de paz. Te sientes dividido entre la acción y el descanso.',
    '14': 'El optimismo se ve empañado por la decepción. Te cuesta confiar en que las cosas mejorarán.',
    '15': 'Tu sensibilidad te hace vulnerable. Te proteges de la decepción emocional manteniendo distancia.',
    '18': 'Necesitas espacio pero también conexión. La paradoja de querer cercanía sin perder tu independencia te genera malestar.',
    '23': 'La presión por rendir o destacar te resulta opresiva. Necesitas demostrar tu valía en un entorno que percibes exigente.',
    '24': 'Sientes que tu libertad está limitada por circunstancias externas. La falta de opciones te genera frustración.',
    '25': 'Tu necesidad de afirmación se ve frustrada. Sientes que no reconocen tu valor o tu esfuerzo.',
    '28': 'La soledad no deseada te pesa. Aunque valoras tu independencia, hay momentos en que te gustaría más compañía.',
    '34': 'El exceso de estímulos o demandas te sobrepasa. La presión por mantenerte activo te agota.',
    '36': 'El esfuerzo constante sin recompensa visible te desgasta. Buscas resultados que justifiquen tu energía.',
    '37': 'La confrontación o competencia te agota. Prefieres evitar conflictos abiertos.',
    '38': 'La falta de espacio para actuar a tu ritmo te frustra. Necesitas libertad para manejar tus tiempos.',
    '45': 'La decepción empaña tu optimismo natural. Te cuesta encontrar motivos para ilusionarte.',
    '48': 'Te sientes frenado en tu deseo de cambio. Las circunstancias te impiden avanzar como quisieras.',
    '58': 'Tu sensibilidad se repliega para protegerse. Necesitas distancia emocional para procesar.',
    '67': 'El conflicto o la inestabilidad te resultan insoportables. Anhelas paz, aunque sea a costa de aislarte.',
    '68': 'Necesitas descanso real. La fatiga acumulada te pide una pausa que no te estás permitiendo.',
    '78': 'Te sientes atrapado entre la necesidad de protegerte y el deseo de conectar. Optas por la distancia hasta tener claridad.',
    '10': 'Hay una sensación de vacío afectivo que intentas llenar sin éxito. Buscas conexión pero las vías disponibles no te satisfacen.',
    '20': 'La falta de reconocimiento a tu esfuerzo te desgasta. Necesitas validación externa que no estás recibiendo.',
    '40': 'Percibes un estancamiento en tu vida. La sensación de que las cosas no avanzan te genera inquietud.',
    '50': 'Tu sensibilidad encuentra pocos canales de expresión en tu entorno actual. Sientes que no hay espacio para tu mundo interior.',
    '70': 'El nivel de exigencia externa te resulta abrumador. Sientes que invaden tus límites constantemente.',
    '80': 'La presión social por participar e involucrarte te agota. Necesitas retirarte para recuperar tu centro.',
  },
}

type GroupKey = keyof typeof PAIR_INTERPRETATIONS
type Phase = 'intro' | 'test' | 'results'

/* ── Helper ── */
function getColorById(id: number) {
  return COLORS.find(c => c.id === id)
}

/* ── Generación dinámica de interpretaciones ── */
function generatePairInterpretation(
  color1: number,
  color2: number,
  group: GroupKey,
  positions: [number, number], // global positions 1-8
): string {
  const pairKey = `${color1}${color2}`

  // 1. Try curated pair interpretation first
  const curated = PAIR_INTERPRETATIONS[group]?.[pairKey]
  if (curated) return curated

  // 2. Fallback: build from individual color-position meanings
  const posGroup =
    group === 'plus' ? 'plus' :
    group === 'asterisk' ? 'asterisk' :
    group === 'equal' ? 'equal' : 'minus'

  const firstKey = `${posGroup}_first` as string
  const secondKey = `${posGroup}_second` as string

  const c1 = getColorById(color1)
  const c2 = getColorById(color2)
  if (!c1 || !c2) return 'Sin interpretación disponible.'

  const meaning1 = COLOR_POSITION_MEANINGS[firstKey]?.[color1]
  const meaning2 = COLOR_POSITION_MEANINGS[secondKey]?.[color2]

  const c1Short = c1.name.toLowerCase()
  const c2Short = c2.name.toLowerCase()

  if (meaning1 && meaning2) {
    return `${meaning1} En segundo lugar, el ${c2Short} complementa tu situación: ${meaning2.charAt(0).toLowerCase() + meaning2.slice(1)}`
  }

  // Minimal fallback
  const labels: Record<string, string> = {
    plus: 'objetivos y deseos',
    asterisk: 'estado actual',
    equal: 'recursos internos',
    minus: 'tensiones y rechazos',
  }
  return `La combinación de ${c1.name} seguido de ${c2.name} en el ámbito de ${labels[group] || 'tu perfil'} sugiere una interacción significativa entre la cualidad de ${c1.meaning.toLowerCase()} y ${c2.meaning.toLowerCase()}.`
}

/* ── Síntesis global ── */
function buildSynthesis(selection: number[]) {
  const plusColor1 = getColorById(selection[0])
  const plusColor2 = getColorById(selection[1])
  const minusColor1 = getColorById(selection[6])
  const minusColor2 = getColorById(selection[7])

  if (!plusColor1 || !plusColor2 || !minusColor1 || !minusColor2) return ''

  const text = []

  const synthesisTemplates: Record<number, { drive: string; avoid: string }> = {
    1: { drive: 'tu corazón busca conexión y autenticidad', avoid: 'la distancia emocional o la falta de reciprocidad' },
    2: { drive: 'tu voluntad busca autonomía y reconocimiento', avoid: 'sentirte controlado o limitado' },
    3: { drive: 'tu energía busca acción y logro', avoid: 'el exceso de presión o la confrontación' },
    4: { drive: 'tu mente busca horizontes nuevos y esperanza', avoid: 'la decepción y el estancamiento' },
    5: { drive: 'tu sensibilidad busca belleza y significado', avoid: 'la superficialidad o la falta de autenticidad' },
    6: { drive: 'tu ser práctico busca estabilidad y confort', avoid: 'la precariedad o la inseguridad' },
    7: { drive: 'tu fuerza busca establecer límites firmes', avoid: 'el sometimiento o la invasión' },
    8: { drive: 'tu espíritu busca paz y espacio personal', avoid: 'la presión social o el ruido' },
  }

  const drive = synthesisTemplates[plusColor1.id]?.drive || 'buscar lo que valoras'
  const avoid = synthesisTemplates[minusColor2.id]?.avoid || 'ciertas tensiones'

  text.push(`En esencia, **${drive}**, mientras que te genera malestar **${avoid}**.`)
  text.push(`Tu selección de colores revela un perfil donde tus motivaciones principales se orientan hacia ${plusColor1.name.toLowerCase()} y ${plusColor2.name.toLowerCase()}, mientras que aquello que rechazas se asocia con ${minusColor2.name.toLowerCase()} y ${minusColor1.name.toLowerCase()}.`)

  // Additional context based on the gap between first and last
  const likedIds = selection.slice(0, 2)
  const dislikedIds = selection.slice(6, 8)

  const likedTypes = likedIds.map(id => {
    if (id <= 2) return 'emocional'
    if (id <= 4) return 'activo'
    if (id <= 6) return 'sensible'
    return 'distante'
  })

  const dislikedTypes = dislikedIds.map(id => {
    if (id <= 2) return 'la frialdad emocional'
    if (id <= 4) return 'la pasividad o la falta de impulso'
    if (id <= 6) return 'la superficialidad'
    return 'la invasión personal'
  })

  const liked = Array.from(new Set(likedTypes))
  const disliked = Array.from(new Set(dislikedTypes))

  if (liked.length > 0 && disliked.length > 0) {
    text.push(`Tu perfil refleja una orientación hacia lo **${liked.join(' y lo ')}**, mientras que tiendes a rechazar **${disliked.join(' y ')}**. Esta dinámica es clave para entender tu estado emocional actual.`)
  }

  text.push('Recuerda que el Test de Lüscher mide tu estado emocional presente, no tu personalidad fija. Estos resultados cambian con tu estado de ánimo y circunstancias.')

  return text.join(' ')
}

/* ── Interpretación completa ── */
function interpretSelection(selection: number[]) {
  const groups = [
    { key: 'plus' as GroupKey, label: 'Lo que buscas', icon: '★', range: [0, 1] as [number, number], description: 'Colores que más te atraen — revelan tus objetivos, deseos y lo que necesitas para sentirte realizado.' },
    { key: 'asterisk' as GroupKey, label: 'Tu estado actual', icon: '●', range: [2, 3] as [number, number], description: 'Colores que también te gustan — describen tu situación presente y cómo te estás desenvolviendo.' },
    { key: 'equal' as GroupKey, label: 'Recursos internos', icon: '◇', range: [4, 5] as [number, number], description: 'Colores indiferentes — representan tus capacidades latentes y aspectos de ti que están en reserva.' },
    { key: 'minus' as GroupKey, label: 'Áreas de tensión', icon: '▲', range: [6, 7] as [number, number], description: 'Colores que menos te atraen — señalan ansiedades, estrés o aspectos que estás rechazando.' },
  ]

  const results = groups.map(g => {
    const idx1 = g.range[0]
    const idx2 = g.range[1]
    const c1 = selection[idx1]
    const c2 = selection[idx2]
    const color1 = getColorById(c1)
    const color2 = getColorById(c2)

    const interpretation = generatePairInterpretation(c1, c2, g.key, [idx1 + 1, idx2 + 1])

    return {
      group: g.key,
      label: g.label,
      icon: g.icon,
      description: g.description,
      colors: [c1, c2],
      colorNames: [color1?.name || '', color2?.name || ''],
      colorHexes: [color1?.hex || '', color2?.hex || ''],
      globalPositions: [idx1 + 1, idx2 + 1],
      interpretation,
    }
  })

  return {
    groups: results,
    synthesis: buildSynthesis(selection),
  }
}

/* ── Componente ── */
export default function LuscherTest() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [selection, setSelection] = useState<number[]>([])
  const [results, setResults] = useState<any>(null)

  const handleColorClick = (colorId: number) => {
    if (selection.includes(colorId) || selection.length >= 8) return
    setSelection([...selection, colorId])
  }

  const handleRemove = (idx: number) => {
    setSelection(selection.filter((_, i) => i !== idx))
  }

  const submitTest = () => {
    if (selection.length !== 8) return
    setResults(interpretSelection(selection))
    setPhase('results')
  }

  const resetTest = () => {
    setSelection([])
    setPhase('intro')
    setResults(null)
  }

  const remaining = 8 - selection.length

  return (
    <div>
      <AnimatePresence mode="wait">
        {/* ═══════ INTRO ═══════ */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: spring }}
            className="max-w-xl mx-auto text-center"
          >
            <span className="eyebrow mb-4">Test de Lüscher</span>
            <h2 className="text-3xl font-bold mt-4 mb-6" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>
              Tu estado emocional a través del color
            </h2>
            <p className="text-base mb-8 leading-relaxed" style={{ color: '#4b5563' }}>
              Desarrollado por el psicólogo suizo Max Lüscher, este test revela
              tu estado emocional actual y necesidades psicológicas a través de
              la selección de colores. No hay respuestas correctas.
            </p>

            <div className="space-y-3 text-left mb-10 max-w-sm mx-auto">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: '#eff6ff', color: '#2563eb' }}>1</div>
                <p className="text-sm" style={{ color: '#4b5563' }}>
                  Elige los colores <strong>en orden de preferencia</strong>, del que más te guste al que menos
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: '#eff6ff', color: '#2563eb' }}>2</div>
                <p className="text-sm" style={{ color: '#4b5563' }}>
                  Selecciona <strong>exactamente 8</strong> colores únicos
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: '#eff6ff', color: '#2563eb' }}>3</div>
                <p className="text-sm" style={{ color: '#4b5563' }}>
                  <strong>No pienses demasiado</strong> — confía en tu primera intuición
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: '#eff6ff', color: '#2563eb' }}>4</div>
                <p className="text-sm" style={{ color: '#4b5563' }}>
                  Obtendrás tu interpretación <strong>inmediatamente</strong>
                </p>
              </div>
            </div>

            <button onClick={() => setPhase('test')} className="btn btn-primary" style={{ padding: '14px 40px' }}>
              Comenzar test
            </button>
          </motion.div>
        )}

        {/* ═══════ TEST ═══════ */}
        {phase === 'test' && (
          <motion.div
            key="test"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: spring }}
          >
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold" style={{ color: '#2563eb', fontFamily: 'var(--font-display)' }}>
                Selecciona 8 colores
              </span>
              <div className="flex-1 h-1 rounded-full" style={{ background: '#e5e7eb' }}>
                <motion.div
                  className="h-full rounded-full" style={{ background: '#2563eb' }}
                  animate={{ width: `${(selection.length / 8) * 100}%` }}
                  transition={{ duration: 0.3, ease: spring }}
                />
              </div>
              <span className="text-xs" style={{ color: '#9ca3af' }}>
                {selection.length}/8
              </span>
            </div>

            {/* Paleta */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {COLORS.map((color) => {
                const selected = selection.includes(color.id)
                const selectedIdx = selection.indexOf(color.id)
                return (
                  <motion.button
                    key={color.id}
                    onClick={() => !selected || selectedIdx === -1 ? handleColorClick(color.id) : handleRemove(selectedIdx)}
                    whileHover={!selected ? { scale: 1.05 } : {}}
                    whileTap={{ scale: 0.95 }}
                    className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer"
                    style={{ background: color.hex }}
                    aria-label={`${color.name}: ${color.meaning}`}
                  >
                    {selected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.35)' }}
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90">
                          <span className="text-xs font-bold" style={{ color: '#111827' }}>{selectedIdx + 1}</span>
                        </div>
                      </motion.div>
                    )}
                    {!selected && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2"
                        style={{ background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.5))' }}>
                        <span className="text-[0.55rem] font-semibold text-white drop-shadow">{color.name}</span>
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Selected row */}
            {selection.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>
                    Tu selección ({selection.length}/8)
                  </span>
                  <button onClick={() => setSelection([])} className="text-xs" style={{ color: '#2563eb' }}>
                    Limpiar
                  </button>
                </div>
                <div className="flex gap-1.5">
                  {selection.map((id, idx) => {
                    const color = getColorById(id)!
                    return (
                      <motion.button
                        key={id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleRemove(idx)}
                        className="relative w-10 h-10 rounded-lg flex items-center justify-center text-white cursor-pointer group"
                        style={{ background: color.hex }}
                      >
                        <span className="text-xs font-bold drop-shadow">{idx + 1}</span>
                        <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-0 group-hover:opacity-100">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Submit */}
            {selection.length === 8 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <button onClick={submitTest} className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                  Interpretar mi selección
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ═══════ RESULTS ═══════ */}
        {phase === 'results' && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: spring }}
          >
            {/* Header */}
            <div className="text-center mb-10">
              <span className="eyebrow mb-4">Test de Lüscher</span>
              <h2 className="text-2xl font-bold mt-4 mb-3" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>
                Tu perfil emocional actual
              </h2>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                Basado en tu orden de preferencia de colores
              </p>

              {/* Miniaturas de colores seleccionados */}
              <div className="flex justify-center gap-1 mt-4">
                {(results.groups as any[]).flatMap((g: any) => g.colors).map((id: number, idx: number) => (
                  <div key={idx} className="relative">
                    <div className="w-8 h-8 rounded-lg" style={{ background: getColorById(id)?.hex }} />
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white text-[0.55rem] font-bold flex items-center justify-center shadow-sm" style={{ color: '#374151' }}>
                      {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interpretaciones por grupo */}
            <div className="space-y-4 mb-10">
              {(results.groups as any[]).map((g: any, i: number) => (
                <motion.div
                  key={g.group}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-xl"
                  style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.04)' }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{
                        background: g.group === 'plus' ? '#eff6ff' :
                          g.group === 'asterisk' ? '#faf5ff' :
                          g.group === 'equal' ? '#f0fdf4' : '#fef2f2',
                        color: g.group === 'plus' ? '#2563eb' :
                          g.group === 'asterisk' ? '#9333ea' :
                          g.group === 'equal' ? '#16a34a' : '#dc2626',
                      }}
                    >
                      {g.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold" style={{ color: '#111827' }}>
                        {g.label}
                      </h4>
                      <p className="text-[0.7rem]" style={{ color: '#9ca3af' }}>
                        Posiciones {g.globalPositions[0]} y {g.globalPositions[1]}
                      </p>
                    </div>
                    <div className="ml-auto flex gap-1">
                      {g.colors.map((id: number) => (
                        <div
                          key={id}
                          className="w-5 h-5 rounded shadow-sm"
                          style={{ background: getColorById(id)?.hex }}
                          title={getColorById(id)?.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Description of the group */}
                  <p className="text-[0.7rem] italic mb-2" style={{ color: '#9ca3af' }}>
                    {g.description}
                  </p>

                  {/* Interpretation */}
                  <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                    {g.interpretation}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* ═══════ SÍNTESIS ═══════ */}
            {results.synthesis && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 mb-10 rounded-xl"
                style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.04)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#fef3c7', color: '#d97706' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="2" x2="12" y2="6" />
                      <line x1="12" y1="18" x2="12" y2="22" />
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                      <line x1="2" y1="12" x2="6" y2="12" />
                      <line x1="18" y1="12" x2="22" y2="12" />
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                    </svg>
                  </div>
                  <span className="label">Síntesis de tu perfil</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                  {results.synthesis}
                </p>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 mb-10">
              <button onClick={resetTest} className="btn btn-ghost text-sm" style={{ color: '#2563eb' }}>
                ← Repetir test
              </button>
            </div>

            {/* CTA */}
            <div className="text-center p-8" style={{ background: '#f9fafb', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <p className="text-sm mb-3" style={{ color: '#6b7280' }}>
                Este test mide tu estado emocional presente, no tu personalidad.
                Un análisis profesional en una Sesión Cero te ayuda a integrar
                estos resultados en tu proceso terapéutico.
              </p>
              <a href="/contacto" className="btn btn-primary">Agendar Sesión Cero</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
