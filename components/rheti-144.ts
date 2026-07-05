/* ─────── RHETI v2.5 — 144 preguntas de elección forzada ─────── */
/* Estructura original: Riso-Hudson Enneagram Type Indicator v2.5 */
/* Cada respuesta A o B mapea a un tipo: A→9, B→6, C→3, D→1, E→4, F→2, G→8, H→5, I→7 */

export interface RhetiQ {
  id: number;
  a: string;
  aType: number;
  b: string;
  bType: number;
}

function t(id: number, a: string, aT: number, b: string, bT: number): RhetiQ {
  return { id, a, aType: aT, b, bType: bT };
}

/* ────────────────────────────────────────────
   PAR (9,6): 4 preguntas
   ──────────────────────────────────────────── */
const p1 = [
  t(1,  "Prefiero mantener la armonía en mi entorno", 9,  "Prefiero anticipar los problemas para estar preparado", 6),
  t(2,  "Me cuesta tomar partido en un conflicto", 9,  "Analizo cuidadosamente antes de decidir de qué lado estoy", 6),
  t(3,  "Confío en que las cosas se resolverán solas", 9,  "Creo que si no me anticipo, algo saldrá mal", 6),
  t(4,  "Tiendo a ver todos los puntos de vista", 9,  "Identifico rápidamente los riesgos de cada situación", 6),
];

/* PAR (9,3): 4 preguntas */
const p2 = [
  t(5,  "Mi ritmo natural es pausado y constante", 9,  "Mi ritmo natural es activo y orientado a metas", 3),
  t(6,  "Disfruto los momentos de tranquilidad sin hacer nada", 9,  "Necesito estar produciendo o logrando algo", 3),
  t(7,  "Me cuesta identificar mis propias prioridades", 9,  "Sé exactamente lo que quiero y cómo lograrlo", 3),
  t(8,  "Prefiero seguir la corriente antes que imponer mi agenda", 9,  "Prefiero liderar y marcar el rumbo", 3),
];

/* PAR (9,1): 4 preguntas */
const p3 = [
  t(9,  "La imperfección es parte natural de la vida", 9,  "La imperfección me incomoda y trato de corregirla", 1),
  t(10, "Puedo ser bastante autoindulgente", 9, "Soy muy autoexigente y crítico conmigo mismo", 1),
  t(11, "Me frustra poco lo que no sale como esperaba", 9, "Me frustro cuando las cosas no se hacen correctamente", 1),
  t(12, "Acepto la mayoría de las normas sin cuestionarlas", 9, "Necesito que las normas tengan sentido para seguirlas", 1),
];

/* PAR (9,4): 4 preguntas */
const p4 = [
  t(13, "Mi estado de ánimo es generalmente estable", 9, "Mis emociones tienen altibajos profundos", 4),
  t(14, "No siento que me falte algo importante", 9, "A menudo siento que algo esencial me falta", 4),
  t(15, "Me considero una persona común y corriente", 9, "Siento que soy diferente a los demás", 4),
  t(16, "Disfruto de las cosas simples sin necesidad de más", 9, "Busco experiencias profundas con un significado especial", 4),
];

/* PAR (9,2): 4 preguntas */
const p5 = [
  t(17, "Paso desapercibido en situaciones sociales", 9, "Me gusta ser útil y que los demás me necesiten", 2),
  t(18, "Me cuesta saber lo que quiero para mí", 9, "Sé lo que los demás necesitan incluso antes que ellos", 2),
  t(19, "Prefiero no involucrarme demasiado en problemas ajenos", 9, "No puedo evitar involucrarme cuando alguien necesita ayuda", 2),
  t(20, "Mi presencia no suele notarse en un grupo", 9, "La gente suele buscar mi apoyo y atención", 2),
];

/* PAR (9,8): 4 preguntas */
const p6 = [
  t(21, "Evito los conflictos y confrontaciones", 9, "El conflicto me parece necesario y a veces lo busco", 8),
  t(22, "Normalmente cedo para mantener la paz", 9, "Normalmente me impongo para asegurar lo que quiero", 8),
  t(23, "Pocas cosas me sacan de quicio", 9, "Mi carácter puede ser intenso cuando algo me importa", 8),
  t(24, "Las decisiones grupales me parecen lo justo", 9, "Confío más en mi propio juicio que en el de la mayoría", 8),
];

/* PAR (9,5): 4 preguntas */
const p7 = [
  t(25, "Disfruto socializar y compartir con otros", 9, "Disfruto mi tiempo a solas más que socializar", 5),
  t(26, "Hago lo que otros esperan por no crear conflicto", 9, "Actúo según lo que tiene sentido para mí, sin importar los demás", 5),
  t(27, "Absorbo el ambiente y me fusiono con el grupo", 9, "Observo el ambiente desde una distancia analítica", 5),
  t(28, "Prefiero actividades relajadas y sencillas", 9, "Prefiero actividades que estimulen mi mente", 5),
];

/* PAR (9,7): 4 preguntas */
const p8 = [
  t(29, "Disfruto la rutina y la repetición", 9, "Me aburre la rutina y busco novedad constantemente", 7),
  t(30, "Prefiero un plan definido y predecible", 9, "Prefiero mantener opciones abiertas", 7),
  t(31, "Soy más de estar tranquilo que de buscar aventura", 9, "Busco activamente nuevas experiencias", 7),
  t(32, "Me adapto a lo que venga sin quejarme", 9, "Si algo no me satisface, busco algo mejor", 7),
];

/* ════════ PARES CON 6 ════════ */

/* PAR (6,3): 4 preguntas */
const p9 = [
  t(33, "Mi mente anticipa todo lo que podría salir mal", 6, "Mi mente se enfoca en cómo lograr el éxito", 3),
  t(34, "La seguridad es mi prioridad al tomar decisiones", 6, "El logro y el reconocimiento guían mis decisiones", 3),
  t(35, "Dudo de mí mismo y busco validación externa", 6, "Proyecto confianza aunque tenga dudas internas", 3),
  t(36, "Prefiero lo seguro y probado", 6, "Asumo riesgos calculados si la recompensa es grande", 3),
];

/* PAR (6,1): 4 preguntas */
const p10 = [
  t(37, "Tiendo a desconfiar de la autoridad", 6, "Respeto la autoridad si es legítima", 1),
  t(38, "Puedo ser desorganizado cuando estoy ansioso", 6, "El orden me da tranquilidad y control", 1),
  t(39, "Soy leal a las personas que me dan seguridad", 6, "Soy leal a mis principios y valores", 1),
  t(40, "Puedo rebelarme contra las reglas si no me parecen justas", 6, "Creo que las reglas existen por una razón y deben cumplirse", 1),
];

/* PAR (6,4): 4 preguntas */
const p11 = [
  t(41, "Mi ansiedad me lleva a buscar apoyo en otros", 6, "Mi melancolía me lleva a retirarme hacia mi mundo interior", 4),
  t(42, "Me identifico con grupos y causas que me dan pertenencia", 6, "Me identifico con mi singularidad, aunque me sienta diferente", 4),
  t(43, "Busco certezas y respuestas concretas", 6, "Busco significado y profundidad en todo", 4),
  t(44, "Mi imaginación se enfoca en lo que podría salir mal", 6, "Mi imaginación se enfoca en mundos ideales de belleza", 4),
];

/* PAR (6,2): 4 preguntas */
const p12 = [
  t(45, "Ofrezco lealtad a cambio de seguridad", 6, "Ofrezco ayuda a cambio de ser valorado", 2),
  t(46, "Necesito sentir que puedo contar con otros", 6, "Necesito sentir que otros cuentan conmigo", 2),
  t(47, "Desconfío hasta que alguien demuestra ser confiable", 6, "Confío rápidamente y me entrego a las relaciones", 2),
  t(48, "Mi principal motor es la seguridad", 6, "Mi principal motor es ser necesitado", 2),
];

/* PAR (6,8): 4 preguntas */
const p13 = [
  t(49, "Frente a la amenaza, busco aliados", 6, "Frente a la amenaza, me enfrento solo", 8),
  t(50, "La autoridad me genera desconfianza o miedo", 6, "La autoridad me genera resistencia o desafío", 8),
  t(51, "Mi lealtad se gana con confianza", 6, "Mi lealtad se gana con respeto", 8),
  t(52, "Prefiero prevenir peligros antes que enfrentarlos", 6, "Prefiero enfrentar los problemas de frente", 8),
];

/* PAR (6,5): 4 preguntas */
const p14 = [
  t(53, "Comparto mis dudas con otros para sentirme seguro", 6, "Proceso mis dudas en soledad hasta comprenderlas", 5),
  t(54, "Busco respuestas en personas de confianza", 6, "Busco respuestas en el conocimiento y la información", 5),
  t(55, "La incertidumbre me paraliza", 6, "La incertidumbre me motiva a investigar más", 5),
  t(56, "Necesito sentir respaldo para actuar", 6, "Necesito comprender antes de actuar", 5),
];

/* PAR (6,7): 4 preguntas */
const p15 = [
  t(57, "Mi mente se enfoca en los riesgos posibles", 6, "Mi mente se enfoca en las posibilidades positivas", 7),
  t(58, "Prefiero lo seguro y probado", 6, "Prefiero experimentar cosas nuevas", 7),
  t(59, "Planifico para evitar sorpresas desagradables", 6, "Planifico para asegurarme de no aburrirme", 7),
  t(60, "El entusiasmo me parece sospechoso", 6, "El entusiasmo es mi estado natural", 7),
];

/* ════════ PARES CON 3 ════════ */

/* PAR (3,1): 4 preguntas */
const p16 = [
  t(61, "Mi autoestima depende de mis logros", 3, "Mi autoestima depende de mi integridad", 1),
  t(62, "Proyecto una imagen de éxito", 3, "Proyecto una imagen de rectitud", 1),
  t(63, "Lo importante es que funcione", 3, "Lo importante es que esté bien hecho", 1),
  t(64, "Me adapto a lo que funcione para alcanzar la meta", 3, "Me mantengo firme en mis principios sin importar el resultado", 1),
];

/* PAR (3,4): 4 preguntas */
const p17 = [
  t(65, "Me identifico con mis éxitos y metas alcanzadas", 3, "Me identifico con mis emociones y mi mundo interior", 4),
  t(66, "Busco destacar y ser admirado", 3, "Busco ser auténtico y único", 4),
  t(67, "Cuando algo no funciona, busco otro camino", 3, "Cuando algo no funciona, lo siento profundamente", 4),
  t(68, "La envidia me parece improductiva", 3, "Reconozco la envidia como una emoción familiar", 4),
];

/* PAR (3,2): 4 preguntas */
const p18 = [
  t(69, "Mi valor se demuestra con logros concretos", 3, "Mi valor se demuestra ayudando a otros", 2),
  t(70, "Prefiero liderar y que me reconozcan", 3, "Prefiero apoyar detrás de escena", 2),
  t(71, "Competir me motiva a dar lo mejor", 3, "Colaborar me motiva más que competir", 2),
  t(72, "Me concentro en mis metas personales", 3, "Me concentro en las necesidades de los demás", 2),
];

/* PAR (3,8): 4 preguntas */
const p19 = [
  t(73, "Influencio a través del carisma y el ejemplo", 3, "Influencio a través de la fuerza y la determinación", 8),
  t(74, "Mi poder está en la imagen y la persuasión", 3, "Mi poder está en la acción directa y el control", 8),
  t(75, "Busco ser admirado por mis logros", 3, "Busco ser respetado por mi fuerza", 8),
  t(76, "La competencia me impulsa a superarme", 3, "La competencia me impulsa a dominar", 8),
];

/* PAR (3,5): 4 preguntas */
const p20 = [
  t(77, "Aprendo haciendo y aplicando", 3, "Aprendo observando y comprendiendo", 5),
  t(78, "Comparto mis conocimientos para destacar", 3, "Comparto mis conocimientos solo cuando es necesario", 5),
  t(79, "Me muevo por resultados prácticos", 3, "Me muevo por comprender la verdad", 5),
  t(80, "La eficiencia es más importante que la teoría", 3, "La comprensión profunda es más importante que la eficiencia", 5),
];

/* PAR (3,7): 4 preguntas */
const p21 = [
  t(81, "Mi entusiasmo está orientado a metas concretas", 3, "Mi entusiasmo está orientado a disfrutar el proceso", 7),
  t(82, "Planifico meticulosamente para asegurar el éxito", 3, "Planifico lo justo para dejar espacio a la espontaneidad", 7),
  t(83, "El ocio me hace sentir que pierdo el tiempo", 3, "El ocio y el placer son parte esencial de la vida", 7),
  t(84, "Lo que hago debe tener un propósito útil", 3, "Lo que hago debe ser interesante y divertido", 7),
];

/* ════════ PARES CON 1 ════════ */

/* PAR (1,4): 4 preguntas */
const p22 = [
  t(85, "Juzgo si algo está bien o mal según criterios objetivos", 1, "Juzgo si algo resuena conmigo según mi sensibilidad", 4),
  t(86, "Cuando algo no es perfecto, lo critico", 1, "Cuando algo no es perfecto, lo idealizo", 4),
  t(87, "Mis estándares son altos pero claros", 1, "Mis estándares son elevados y a veces inalcanzables", 4),
  t(88, "El orden y la disciplina me dan paz", 1, "La expresión auténtica me da paz aunque sea caótica", 4),
];

/* PAR (1,2): 4 preguntas */
const p23 = [
  t(89, "Ayudo porque es lo correcto y debo hacerlo", 1, "Ayudo porque necesito sentirme querido y apreciado", 2),
  t(90, "Primero está el deber, después los deseos", 1, "Primero están las personas, después las reglas", 2),
  t(91, "Critico para ayudar a mejorar", 1, "Critico cuando me siento no valorado", 2),
  t(92, "Mi orgullo está en ser virtuoso", 1, "Mi orgullo está en ser indispensable", 2),
];

/* PAR (1,8): 4 preguntas */
const p24 = [
  t(93, "Mi ira surge cuando las cosas no se hacen bien", 1, "Mi ira surge cuando alguien me desafía o me controla", 8),
  t(94, "Expreso mi descontento de forma controlada", 1, "Expreso mi descontento de forma directa e intensa", 8),
  t(95, "El control lo ejerzo a través de la disciplina", 1, "El control lo ejerzo a través del poder", 8),
  t(96, "Busco mejorar el mundo siendo ejemplo", 1, "Busco mejorar el mundo tomando acción directa", 8),
];

/* PAR (1,5): 4 preguntas */
const p25 = [
  t(97, "Comparto mis conocimientos para enseñar", 1, "Comparto mis conocimientos solo si es relevante", 5),
  t(98, "Mis decisiones se basan en principios éticos", 1, "Mis decisiones se basan en el análisis objetivo", 5),
  t(99, "El conocimiento debe servir para mejorar el mundo", 1, "El conocimiento es valioso en sí mismo", 5),
  t(100, "Me involucro emocionalmente en mis convicciones", 1, "Mantengo distancia emocional en mis análisis", 5),
];

/* PAR (1,7): 4 preguntas */
const p26 = [
  t(101, "La disciplina es el camino hacia la excelencia", 1, "La espontaneidad es el camino hacia la alegría", 7),
  t(102, "El deber está primero, después el placer", 1, "El placer y el deber pueden coexistir", 7),
  t(103, "Tiendo a pensar que nada es suficientemente bueno", 1, "Tiendo a pensar que todo puede ser mejorable", 7),
  t(104, "Prefiero planes estructurados", 1, "Prefiero planes flexibles", 7),
];

/* ════════ PARES CON 4 ════════ */

/* PAR (4,2): 4 preguntas */
const p27 = [
  t(105, "Me retiro cuando me siento herido", 4, "Me acerco más cuando siento que me necesitan", 2),
  t(106, "A veces disfruto mi tristeza como parte de quien soy", 4, "La tristeza me incomoda porque quiero ayudar", 2),
  t(107, "Valoro mi autenticidad por encima de agradar", 4, "Valoro ser querido por encima de ser auténtico", 2),
  t(108, "Mi sensibilidad me hace único", 4, "Mi sensibilidad me conecta con los demás", 2),
];

/* PAR (4,8): 4 preguntas */
const p28 = [
  t(109, "Expreso mi intensidad a través de la creatividad", 4, "Expreso mi intensidad a través de la acción directa", 8),
  t(110, "Mi vulnerabilidad es mi fortaleza", 4, "Mi fortaleza es no mostrar vulnerabilidad", 8),
  t(111, "Tiendo a retraerme cuando me siento herido", 4, "Tiendo a confrontar cuando me siento herido", 8),
  t(112, "Busco ser comprendido en mi profundidad", 4, "Busco ser respetado en mi poder", 8),
];

/* PAR (4,5): 4 preguntas */
const p29 = [
  t(113, "Mis emociones son el centro de mi experiencia", 4, "Mis pensamientos son el centro de mi experiencia", 5),
  t(114, "Comparto mi mundo interior abiertamente", 4, "Protejo mi mundo interior del escrutinio externo", 5),
  t(115, "La tristeza me conecta con mi profundidad", 4, "La tristeza es algo que prefiero analizar", 5),
  t(116, "Me expreso a través del arte y la emoción", 4, "Me expreso a través de ideas y conceptos", 5),
];

/* PAR (4,7): 4 preguntas */
const p30 = [
  t(117, "Acepto mis emociones dolorosas como parte mía", 4, "Prefiero desviar mi atención de lo doloroso", 7),
  t(118, "La melancolía tiene una belleza que valoro", 4, "La melancolía es algo que prefiero evitar", 7),
  t(119, "Busco experiencias que tengan significado profundo", 4, "Busco experiencias que sean placenteras", 7),
  t(120, "Mi intensidad puede ser difícil para algunos", 4, "Mi ligereza hace que los demás se sientan bien", 7),
];

/* ════════ PARES CON 2 ════════ */

/* PAR (2,8): 4 preguntas */
const p31 = [
  t(121, "Mi poder está en mi capacidad de generar conexión", 2, "Mi poder está en mi capacidad de imponerme", 8),
  t(122, "Controlo a través de la generosidad", 2, "Controlo a través de la fuerza", 8),
  t(123, "Quiero que me necesiten", 2, "Quiero que me respeten", 8),
  t(124, "Seduzco con mi atención y cuidado", 2, "Seduzco con mi presencia y poder", 8),
];

/* PAR (2,5): 4 preguntas */
const p32 = [
  t(125, "Estar con otros me recarga energía", 2, "Estar solo me recarga energía", 5),
  t(126, "Conozco las necesidades de los demás intuitivamente", 2, "Analizo las situaciones desde una perspectiva objetiva", 5),
  t(127, "Me siento vivo cuando me conecto con otros", 2, "Me siento vivo cuando comprendo algo nuevo", 5),
  t(128, "Ofrezco apoyo emocional antes que soluciones técnicas", 2, "Ofrezco soluciones analíticas antes que apoyo emocional", 5),
];

/* PAR (2,7): 4 preguntas */
const p33 = [
  t(129, "Mi alegría está en ver felices a los demás", 2, "Mi alegría está en experimentar cosas nuevas", 7),
  t(130, "Organizo actividades para que todos disfruten", 2, "Participo en actividades que me entusiasman", 7),
  t(131, "Me preocupo por las necesidades del grupo", 2, "Me preocupo por disfrutar al máximo", 7),
  t(132, "Ser generoso es mi forma de ser feliz", 2, "Ser libre es mi forma de ser feliz", 7),
];

/* PAR (8,5): 4 preguntas */
const p34 = [
  t(133, "Actúo primero y pienso después", 8, "Pienso primero y actúo después", 5),
  t(134, "Comparto mis conclusiones abiertamente", 8, "Guardo mis conclusiones hasta estar seguro", 5),
  t(135, "Confío en mi instinto para tomar decisiones", 8, "Confío en el análisis para tomar decisiones", 5),
  t(136, "Me lanzo al mundo con determinación", 8, "Me retiro a observar antes de participar", 5),
];

/* PAR (8,7): 4 preguntas */
const p35 = [
  t(137, "Mi deseo de libertad me lleva a imponerme", 8, "Mi deseo de libertad me lleva a explorar", 7),
  t(138, "Busco experiencias intensas que me desafíen", 8, "Busco experiencias placenteras que me estimulen", 7),
  t(139, "Si quiero algo, voy directo a por ello sin rodeos", 8, "Si quiero algo, busco el camino más agradable", 7),
  t(140, "Prefiero liderar el grupo", 8, "Prefiero ser el alma del grupo", 7),
];

/* PAR (5,7): 4 preguntas */
const p36 = [
  t(141, "El conocimiento es mi refugio seguro", 5, "Las experiencias son mi camino hacia la felicidad", 7),
  t(142, "Ante el estrés, me retiro a pensar", 5, "Ante el estrés, busco distracción y novedad", 7),
  t(143, "La vida se comprende a través del estudio", 5, "La vida se vive a través de la experiencia", 7),
  t(144, "Mi satisfacción está en entender cómo funciona todo", 5, "Mi satisfacción está en disfrutar todo lo que puedo", 7),
];

export const RHETI_144: RhetiQ[] = [
  ...p1, ...p2, ...p3, ...p4, ...p5, ...p6, ...p7, ...p8,
  ...p9, ...p10, ...p11, ...p12, ...p13, ...p14, ...p15,
  ...p16, ...p17, ...p18, ...p19, ...p20, ...p21,
  ...p22, ...p23, ...p24, ...p25, ...p26,
  ...p27, ...p28, ...p29, ...p30,
  ...p31, ...p32, ...p33,
  ...p34, ...p35,
  ...p36,
];
