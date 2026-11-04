// data.js - Contenido cultural, biológico y gastronómico de la Laguna de Fúquene y la Guapucha
const NODES_DATA = {
  "inicio": {
    id: "inicio",
    title: "Inicio: Un viaje por Fúquene",
    category: "Principal",
    subtitle: "El despertar de la laguna y el sabor de sus aguas",
    badge: "Punto de Partida",
    image: "fúquene",
    color: "#27578c",
    text: `Bienvenido a <strong>Guapuchas: Un sabor que nace debajo del agua</strong>, una expedición interactiva y sensorial a través de la memoria biocultural de la <strong>Laguna de Fúquene</strong>, ubicada en el corazón del altiplano cundiboyacense en Colombia.<br><br>
    Este recorrido rescata la historia de la <strong>Guapucha (<em>Grundulus bogotensis</em>)</strong>, un pez emblemático y endémico que ha alimentado a comunidades indígenas muiscas, pescadores artesanales y familias campesinas durante siglos. Explora cada nodo hexagonal para descubrir su biología, los saberes culinarios ancestrales, los testimonios de los habitantes y los cantos del agua.`,
    stats: [
      { label: "Ecosistema", value: "Laguna Altoandina (2.540 msnm)" },
      { label: "Especie Clave", value: "Grundulus bogotensis" },
      { label: "Territorio", value: "Cundinamarca & Boyacá" }
    ],
    quote: "«En las mañanas de niebla, cuando la laguna parece un espejo de plata, la guapucha salta avisando que la vida sigue viva bajo el agua.» — Pescador de Fúquene"
  },

  "que-es-guapucha": {
    id: "que-es-guapucha",
    title: "¿Qué es una guapucha?",
    category: "Biología y Especie",
    subtitle: "El pez nativo de las aguas frías andinas",
    badge: "Especie Endémica",
    color: "#27578c",
    text: `La <strong>Guapucha</strong> (<em>Grundulus bogotensis</em>) es un pez dulceacuícola perteneciente a la familia Characidae. Es una de las pocas especies de peces nativas del altiplano de Bogotá y los valles de Ubaté y Chiquinquirá.<br><br>
    A diferencia de especies introducidas como la trucha arcoíris o la carpa, la guapucha coevolucionó en estos humedales y lagunas andinas. Mide comúnmente entre <strong>5 y 8 centímetros</strong> de longitud, posee un cuerpo esbelto y comprimido, coloración olivácea con reflejos plateados y dorados que le permiten mimetizarse entre los tallos de totora y junco.`,
    stats: [
      { label: "Nombre Científico", value: "Grundulus bogotensis" },
      { label: "Familia", value: "Characidae" },
      { label: "Tamaño Promedio", value: "5 a 8 cm" },
      { label: "Estado", value: "Vulnerable / Endémica" }
    ],
    quote: "«Es un pececito humilde de tamaño, pero inmenso en historia y en sabor.»"
  },

  "no-esta-en-un-libro": {
    id: "no-esta-en-un-libro",
    title: "No está en un libro",
    category: "Memoria Oral",
    subtitle: "Saberes vivos transmitidos a orillas de la laguna",
    badge: "Tradición Oral",
    color: "#27578c",
    text: `El conocimiento sobre la guapucha no se aprende en las enciclopedias formales, sino en la <strong>memoria viva de las abuelas, los pescadores y las cocineras de la ribera</strong>.<br><br>
    Está en el tacto con el que se teje una atarraya, en saber reconocer las fases de la luna para pescar, en el sonido de la leña de aliso en el fogón, y en la receta que pasa de mano en mano sin medidas de balanza: <em>«un puñado de sal marina, un diente de ajo machacado y el punto exacto de la manteca caliente»</em>. Este archivo oral es la verdadera custodia del territorio.`,
    stats: [
      { label: "Transmisión", value: "De generación en generación" },
      { label: "Portadores", value: "Sabedoras y Pescadores" },
      { label: "Patrimonio", value: "Inmaterial Campesino" }
    ],
    quote: "«Lo que la abuela aprendió a la orilla del agua, no cabe en ninguna biblioteca.»"
  },

  "donde-estamos": {
    id: "donde-estamos",
    title: "¿Dónde estamos?",
    category: "Geografía Sagrada",
    subtitle: "La Laguna de Fúquene: espejo del altiplano",
    badge: "Geografía",
    color: "#27578c",
    text: `Nos encontramos en la <strong>Laguna de Fúquene</strong>, un cuerpo de agua natural situado a <strong>2.540 metros sobre el nivel del mar</strong>, en los límites de los departamentos de Cundinamarca y Boyacá (municipios de Fúquene, Guachetá, Ubaté y Simijaca).<br><br>
    En la cosmovisión Muisca, su nombre significa <em>«lecho de la zorra»</em> o <em>«santuario del dios Fu»</em>, un lugar sagrado de reverencia y conexión con el agua cósmica. La cuenca alimenta el río Suárez y fue en tiempos prehispánicos uno de los lagos más grandes de la cordillera Oriental colombiana.`,
    stats: [
      { label: "Altitud", value: "2.540 m.s.n.m." },
      { label: "Temperatura Promedio", value: "13°C" },
      { label: "Cuenca", value: "Río Suárez / Magdalena" }
    ],
    quote: "«Fúquene fue el corazón hídrico de nuestros antepasados; hoy clama por seguir latiendo.»"
  },

  "del-agua-al-plato": {
    id: "del-agua-al-plato",
    title: "Del agua al plato",
    category: "Gastronomía",
    subtitle: "El circuito biocultural de la pesca artesanal",
    badge: "Circuito Vivo",
    color: "#27578c",
    text: `El viaje de la guapucha es un ciclo de respeto y reciprocidad: <strong>del agua a la canoa, de la canoa a la cocina, y de la paila a la mesa</strong>.<br><br>
    Comienza a las 4:00 a.m. cuando los pescadores apartan la niebla en sus botes de madera. Tras la faena, las guapuchas se lavan con agua cristalina, se enharinan suavemente y se sumergen enteras en manteca o aceite bien caliente. Servidas sobre hojas de chusque con papa criolla y maíz tostado, representan la armonía entre el lago y la huerta andina.`,
    stats: [
      { label: "Hora de Pesca", value: "4:00 AM - 7:00 AM" },
      { label: "Cocción Tradicional", value: "Fritura en paila de hierro" },
      { label: "Maridaje Ancestral", value: "Maíz tostado y ají de pimentón" }
    ],
    quote: "«En cada bocado crujiente se siente la frescura de la laguna y el calor del fogón de leña.»"
  },

  "escucha-el-territorio": {
    id: "escucha-el-territorio",
    title: "Escucha el territorio",
    category: "Paisaje Sonoro",
    subtitle: "El murmullo de las olas, las aves y las memorias",
    badge: "Experiencia Auditiva",
    color: "#336ea8",
    isAudioNode: true,
    text: `Cierra los ojos y escucha la laguna. El paisaje sonoro de Fúquene está compuesto por capas sutiles: el chasquido rítmico del remo al quebrar el agua, el canto metálico de la <strong>Tingua bogotana</strong> entre los juncos, el silbido del viento frío bajando de los cerros de Guachetá y el chisporroteo de la leña en la cocina de la orilla.<br><br>
    <em>Usa el botón de audio interactivo abajo para activar el paisaje sonoro procesado en tiempo real con Web Audio API.</em>`,
    stats: [
      { label: "Ambiente", value: "Humedal Altoandino" },
      { label: "Aves Típicas", value: "Tingua, Pato turrio, Garza" },
      { label: "Elemento", value: "Viento andino y agua en movimiento" }
    ],
    quote: "«El territorio no solo se ve ni se come; el territorio se escucha cuando uno aprende a guardar silencio.»"
  },

  "agua": {
    id: "agua",
    title: "Agua",
    category: "Ecología",
    subtitle: "El fluido vital y la memoria hídrica del lago",
    badge: "Elemento Sagrado",
    color: "#3b7ebf",
    text: `El agua de Fúquene es el soporte vital de innumerables vidas: fitoplancton, macrófitas como el junco y la totora, caracoles de agua dulce, anfibios y peces nativos como el capitán de la sabana y la guapucha.<br><br>
    A lo largo del siglo XX, la laguna sufrió graves presiones por drenajes agropecuarios y proliferación de buchón. Sin embargo, hoy en día se adelantan <strong>proyectos de dragado ecológico, descontaminación y siembra de vegetación nativa</strong> para restaurar el espejo de agua y devolverle a la guapucha su hogar ancestral.`,
    stats: [
      { label: "Tipo de Agua", value: "Léntica dulceacuícola" },
      { label: "Profundidad Media", value: "1.5 a 4.5 metros" },
      { label: "Acción Vital", value: "Restauración hidrológica" }
    ],
    quote: "«Cuidar el agua de Fúquene es garantizar que nuestros hijos conozcan la guapucha nadando y no en una foto.»"
  },

  "territorio-comunidad": {
    id: "territorio-comunidad",
    title: "Territorio y comunidad",
    category: "Sociedad",
    subtitle: "Los guardianes de la cuenca de Fúquene",
    badge: "Identidad",
    color: "#3b7ebf",
    text: `Los habitantes de los alrededores de la laguna han forjado una identidad íntimamente ligada al lago: artesanos que tejen esteras de junco, pescadores de toda la vida, y agricultores de papa y maíz.<br><br>
    La comunidad no ve la laguna como un recurso económico aislado, sino como un <strong>vecino vivo</strong> con el que se convive. Festividades locales, mingas comunitarias de limpieza y escuelas campesinas promueven hoy el reconocimiento de la guapucha como símbolo de orgullo territorial.`,
    stats: [
      { label: "Municipios", value: "Fúquene, Ubaté, Guachetá, Simijaca" },
      { label: "Oficios Tradicionales", value: "Pesca, tejeduría en junco, cocina" },
      { label: "Valores", value: "Reciprocidad y arraigo" }
    ],
    quote: "«Somos gente del agua; si la laguna se seca, una parte de nuestra alma campesina se apaga con ella.»"
  },

  "cocina": {
    id: "cocina",
    title: "Cocina Tradicional",
    category: "Gastronomía",
    subtitle: "El calor del fogón y las técnicas ancestrales",
    badge: "Fogón Andino",
    color: "#3b7ebf",
    text: `La cocina campesina de Fúquene es sobria, precisa y basada en el respeto por los ingredientes puros. La preparación de la guapucha requiere un fogón bien alimentado con maderas aromáticas como el aliso o el eucalipto.<br><br>
    A diferencia de pescados grandes que se filetean, la guapucha <strong>se cocina entera</strong>. Su espinazo tierno se vuelve crocante con la fritura, lo que permite comerla completa, aprovechando todo su aporte de fósforo, calcio y omega natural sin generar desperdicio.`,
    stats: [
      { label: "Combustible", value: "Leña de aliso y carbón vegetal" },
      { label: "Técnica Principal", value: "Fritura profunda en paila" },
      { label: "Acompañamiento", value: "Arepa de laja y papa salada" }
    ],
    quote: "«El secreto está en que el aceite chille alegremente en la paila; si está tibio, la guapucha se entristece.»"
  },

  "guapucha": {
    id: "guapucha",
    title: "La Guapucha en la mesa",
    category: "Ingrediente",
    subtitle: "Delicadeza, nutrición y sabor único",
    badge: "Patrimonio Culinario",
    color: "#3b7ebf",
    text: `En el paladar, la guapucha frita sorprende por su textura: un exterior crujiente y dorado que da paso a una carne suave, dulce y delicadamente yodada, con el sabor inconfundible de las aguas dulces altoandinas.<br><br>
    Históricamente, era la merienda preferida de los campesinos durante las jornadas de siembra y cosecha en el altiplano. Es un superalimento andino: alta concentración de proteínas de alto valor biológico y minerales esenciales.`,
    stats: [
      { label: "Perfil de Sabor", value: "Delicado, dulce, con notas a hierba de río" },
      { label: "Textura", value: "Crocante al exterior, tierna adentro" },
      { label: "Aporte Nutricional", value: "Rica en calcio, fósforo y proteína" }
    ],
    quote: "«Un puñado de guapuchas con maíz tostado alimenta el cuerpo y calienta la memoria.»"
  },

  "maiz": {
    id: "maiz",
    title: "Maíz",
    category: "Agricultura Ancestral",
    subtitle: "El compañero eterno de la guapucha",
    badge: "Semilla Sagrada",
    color: "#3b7ebf",
    text: `No hay guapucha sin maíz. El maíz amarillo y porva cultivado en las laderas de Fúquene es el complemento indispensable en todas las mesas de la región.<br><br>
    Se prepara tostado al tiesto de barro con sal y manteca de cerdo, o en forma de <strong>arepa de maíz pelao</strong> molido a mano. La combinación de pescado de agua dulce y maíz tostado es una herencia directa de la dieta prehispánica muisca que ha sobrevivido quinientos años intacta.`,
    stats: [
      { label: "Variedades Locales", value: "Maíz Porva, Amarillo y Choclo" },
      { label: "Preparación", value: "Tostado al tiesto / Arepa campesina" },
      { label: "Herencia", value: "Prehispánica Muisca" }
    ],
    quote: "«El maíz es el oro de la tierra, la guapucha es la plata del agua. Juntos son el banquete de Fúquene.»"
  },

  "que-es": {
    id: "que-es",
    title: "¿Qué es la Guapucha?",
    category: "Morfología",
    subtitle: "Rasgos distintivos y adaptación biológica",
    badge: "Ficha Biológica",
    color: "#4789c8",
    text: `La <em>Grundulus bogotensis</em> es un pez actinopterigio de tamaño reducido. Carece de aleta adiposa (a diferencia de otros carácidos tropicales), lo que representa una notable adaptación evolutiva a las aguas frías de altura.<br><br>
    Posee ojos grandes y expresivos adaptados a la baja visibilidad entre juncales y fondos limosos. Su boca pequeña orientada ligeramente hacia arriba le permite alimentarse eficazmente de microcrustáceos (daphnias, copépodos) y larvas acuáticas de insectos, controlando naturalmente las poblaciones del humedal.`,
    stats: [
      { label: "Clase", value: "Actinopterygii" },
      { label: "Orden", value: "Characiformes" },
      { label: "Dieta", value: "Zooplancton e invertebrados acuáticos" },
      { label: "Respiración", value: "Branquial adaptada a bajo O₂" }
    ],
    quote: "«Observarla nadar entre los juncos es presenciar millones de años de adaptación andina.»"
  },

  "importancia": {
    id: "importancia",
    title: "Importancia Ecológica",
    category: "Conservación",
    subtitle: "El termómetro biológico del altiplano",
    badge: "Bioindicador",
    color: "#4789c8",
    text: `La presencia de la guapucha es un <strong>bioindicador de la salud ecológica</strong> de los humedales andinos. Al ser muy sensible a la contaminación química por pesticidas y aguas residuales no tratadas, su abundancia o escasez avisa de inmediato el estado del ecosistema.<br><br>
    Además, es una presa fundamental para aves migratorias boreales que llegan a Fúquene a descansar, así como para garzas, tinguas y nutrias de río. Su desaparición provocaría un colapso en la cadena trófica del humedal.`,
    stats: [
      { label: "Rol Trófico", value: "Consumidor secundario / Presa clave" },
      { label: "Sensibilidad", value: "Alta a contaminantes e hipoxia" },
      { label: "Impacto", value: "Sostiene poblaciones de aves acuáticas" }
    ],
    quote: "«Si la guapucha prospera, la laguna respira; si la guapucha se apaga, el humedal enferma.»"
  },

  "historia": {
    id: "historia",
    title: "Historia y Memoria",
    category: "Historia",
    subtitle: "De santuario muisca a símbolo de resistencia",
    badge: "Crónica Histórica",
    color: "#4789c8",
    text: `Durante el periodo prehispánico, la confederación Muisca cuidaba las lagunas como moradas sagradas de sus deidades. Las crónicas de Indias del siglo XVI ya mencionaban pequeños peces plateados que los naturales pescaban con cestas de mimbre y secaban al sol para comerciar en los mercados de Chía y Bacatá.<br><br>
    En el siglo XX, planes equivocados intentaron secar Fúquene para convertirla en potreros ganaderos. Gracias a la movilización de ambientalistas y campesinos, la laguna sobrevivió, y con ella la guapucha, convertida hoy en bandera de la defensa del agua.`,
    stats: [
      { label: "Periodo Muisca", value: "Pesca ritual y sustento diario" },
      { label: "Siglo XX", value: "Defensa contra la desecación artificial" },
      { label: "Hoy", value: "Restauración ecológica y patrimonial" }
    ],
    quote: "«En las leyendas muiscas, los peces eran pensamientos que el agua convertía en plata viva.»"
  },

  "tradicion": {
    id: "tradicion",
    title: "Tradición Pesquera",
    category: "Costumbres",
    subtitle: "Ritos, artes de pesca y respeto por los ciclos",
    badge: "Oficio Ancestral",
    color: "#4789c8",
    text: `La pesca de la guapucha no se realiza con métodos industriales depredadores. Se emplean artes manuales tradicionales: la <strong>atarraya de ojo menudo</strong> tejida a mano con nylon resistente y plomos de equilibrio, o las tradicionales nasas de junco colocadas estratégicamente al atardecer en los callejones de agua.<br><br>
    Los pescadores veteranos respetan los periodos de desove en los meses de lluvias, retirando las redes de las zonas de orilla donde las hembras depositan los huevos entre las raíces sumergidas.`,
    stats: [
      { label: "Arte de Pesca", value: "Atarraya artesanal y nasa de junco" },
      { label: "Canoa", value: "Embarcación de madera a remo" },
      { label: "Ética de Pesca", value: "Veda empírica durante el desove" }
    ],
    quote: "«A la laguna se le pide permiso antes de soltar la red, y se le da gracias al recogerla.»"
  },

  "preparacion": {
    id: "preparacion",
    title: "Preparación Culinaria",
    category: "Cocina",
    subtitle: "El arte de lograr la crocancia perfecta",
    badge: "Técnica",
    color: "#4a8fd6",
    text: `Para preparar la guapucha perfecta se siguen tres pasos sagrados:<br><br>
    <strong>1. El lavado:</strong> Se enjuagan suavemente varias veces en agua fría con un toque de salmuera para limpiar impurezas sin maltratar la carne.<br>
    <strong>2. El adobo:</strong> Se frotan con sal de gema molida, ajo majado y un poco de cebolla junca picada finísima. Se dejan reposar unos 15 minutos para que absorban los aromas.<br>
    <strong>3. El enharinado y fritura:</strong> Se espolvorean con una mezcla de harina de trigo y maíz tostado molido. Se sumergen en aceite abundante y muy caliente (180°C) durante 3 a 4 minutos hasta alcanzar un dorado brillante y sonoro.`,
    stats: [
      { label: "Tiempo de Cocción", value: "3 a 4 minutos" },
      { label: "Temperatura de Aceite", value: "180°C (punto humo medio)" },
      { label: "Punto Final", value: "Crocancia total, sin grasa residual" }
    ],
    quote: "«Si la guapucha no cruje como hoja seca bajo el zapato, le faltó fuego o le sobró apuro.»"
  },

  "saberes": {
    id: "saberes",
    title: "Saberes Gastronómicos",
    category: "Sabiduría Popular",
    subtitle: "Secretos de las matronas de la laguna",
    badge: "Sabiduría",
    color: "#4a8fd6",
    text: `Las sabedoras de Fúquene guardan secretos transmitidos de madres a hijas:<br><br>
    • <em>«Nunca tapes la paila mientras fríes»</em>, advierten, pues el vapor ablandaría la costra crujiente.<br>
    • Si quieres un toque aromático, se añade una rama entera de poleo o cilantro de tierra al aceite al momento de calentar.<br>
    • Para servir, nunca utilices platos plásticos fríos; el pescado se dispone sobre hojas frescas o platos de barro cocido de Ráquira para preservar el calor y la textura crujiente.`,
    stats: [
      { label: "Hierba Aromática", value: "Poleo campesino y cilantro cimarrón" },
      { label: "Vajilla Ideal", value: "Barro cocido tradicional de Ráquira" },
      { label: "Transmisión", value: "Linaje femenino culinario" }
    ],
    quote: "«Cocinar es un acto de amor y respeto por el pez que entregó su vida para nutrir a la familia.»"
  },

  "receta-tradicional": {
    id: "receta-tradicional",
    title: "Receta Tradicional",
    category: "Recetario",
    subtitle: "Guapuchas doradas con papas nativas y maíz",
    badge: "Receta Magistral",
    color: "#4a8fd6",
    recipe: true,
    text: `<strong>Ingredientes (para 4 personas):</strong><br>
    • 500g de guapuchas frescas de Fúquene recién pescadas<br>
    • 1 taza de harina de trigo cernida con 2 cucharadas de maíz tostado molido<br>
    • 2 dientes de ajo machacados con sal de piedra<br>
    • 1 tallo de cebolla junca fresca picada<br>
    • Aceite o manteca vegetal abundante para freír<br>
    • 1 libra de papa criolla pequeña cocida con cáscara<br>
    • 2 tazas de maíz tostado al rescoldo<br>
    • Limón mandarina y ají criollo al gusto<br><br>
    <strong>Instrucciones:</strong> Sazona las guapuchas limpias con el ajo y la cebolla. Pásalas por la harina sacudiendo el exceso. Fríelas en tandas pequeñas para no enfriar el aceite hasta que tomen tono oro viejo. Acompaña de inmediato con las papas calientes partidas al medio y el maíz crocante. ¡Una fiesta para los sentidos!`,
    stats: [
      { label: "Dificultad", value: "Media (control de temperatura)" },
      { label: "Porciones", value: "4 personas" },
      { label: "Tiempo Total", value: "25 minutos" }
    ],
    quote: "«En cada bocado se celebra la unión de la tierra fértil de Boyacá y las aguas mágicas de Fúquene.»"
  },

  "cronica": {
    id: "cronica",
    title: "Crónica de la Laguna",
    category: "Narrativa",
    subtitle: "Una madrugada entre la niebla y las canoas",
    badge: "Relato",
    color: "#3b7ebf",
    text: `A las cinco de la mañana, Fúquene no tiene orillas; el cielo y el agua son una sola sábana de bruma blanca. Don Hipólito empuja su canoa con una vara de aliso que toca el fondo fangoso. El agua fría gotea despacio.<br><br>
    <em>«Mire allá, mijo»</em>, dice señalando un temblor en la superficie calma. Lanza la atarraya con un giro circular perfecto que se abre como una telaraña de plata sobre el agua. Al recoger la cuerda tensa, las guapuchas saltan atrapando los primeros rayos del sol andino. En ese instante fugaz, el tiempo se detiene y la memoria de América despierta.`,
    stats: [
      { label: "Lugar", value: "Isla del Sol, Laguna de Fúquene" },
      { label: "Hora", value: "5:15 a.m., temperatura 7°C" },
      { label: "Sensación", value: "Misterio, niebla y vida renaciente" }
    ],
    quote: "«La niebla no es para esconderse; es la cobija con la que la laguna cuida a sus peces mientras amanece.»"
  },

  "el-encuentro-con-la-guapucha": {
    id: "el-encuentro-con-la-guapucha",
    title: "El encuentro con la guapucha",
    category: "Testimonio",
    subtitle: "El asombro del primer bocado y la mirada cercana",
    badge: "Experiencia",
    color: "#3b7ebf",
    text: `Para quien la prueba por primera vez, la guapucha rompe todos los prejuicios sobre comer pescado entero. No hay que temer a las espinas: son tan finas y dóciles que al freírse se tornan en una crujiente delicia que enriquece el bocado.<br><br>
    Quienes visitan los piqueteaderos tradicionales de Ubaté o las orillas de Fúquene recuerdan para siempre la primera canastilla de guapuchas humeantes, con el olor tostado a leña y la sencillez de un plato que no necesita disfraces para cautivar.`,
    stats: [
      { label: "Experiencia", value: "Inmersión sensorial auténtica" },
      { label: "Lugar de Degustación", value: "Piqueteaderos de Ubaté y Fúquene" },
      { label: "Reacción Común", value: "Asombro por su crocancia total" }
    ],
    quote: "«Uno piensa que por ser chiquita no llena, pero la guapucha llena el corazón de historia.»"
  },

  "voces-del-territorio": {
    id: "voces-del-territorio",
    title: "Voces del territorio",
    category: "Entrevistas",
    subtitle: "Palabras vivas de los sabedores locales",
    badge: "Testimonios",
    color: "#3b7ebf",
    text: `<em>«Aquí nací y aquí he criado a mis seis hijos con lo que la laguna nos regala. La guapucha nunca nos faltó en la mesa, ni en las épocas más duras. Cuando uno come guapucha, come laguna viva.»</em><br>
    — Doña Rosaura González, cocinera tradicional de Guachetá.<br><br>
    <em>«El secreto no es pescar mucho, sino pescar bien. No llevarse las crías chiquitas, no botar basura al agua, y saber esperar a que la luna crezca. Si uno respeta la laguna, ella te devuelve la bendición en peces.»</em><br>
    — Don Efraín Pachón, pescador artesanal con 52 años en Fúquene.`,
    stats: [
      { label: "Comunidades", value: "Campesinos, pescadores y sabedoras" },
      { label: "Legado", value: "Ética del cuidado y soberanía alimentaria" }
    ],
    quote: "«Nuestra voz es el agua hablando a través de la gente que nunca la abandonó.»"
  },

  "de-la-pesca-a-la-mesa": {
    id: "de-la-pesca-a-la-mesa",
    title: "De la pesca a la mesa",
    category: "Comercialización",
    subtitle: "Caminos de distribución y economía campesina",
    badge: "Economía Local",
    color: "#3b7ebf",
    text: `Antaño, las vendedoras caminaban con canastos de mimbre cubiertos con hojas frescas de helecho hacia las plazas de mercado de Chiquinquirá, Ubaté y Simijaca. El trueque era común: un plato de guapuchas a cambio de una arroba de papa o panela de la hoya del río Suárez.<br><br>
    Hoy en día, la venta se realiza de manera directa a orillas de la carretera o en cooperativas familiares de pescadores, garantizando precios justos y manteniendo viva una cadena de sustento que respalda la economía rural sin intermediarios abusivos.`,
    stats: [
      { label: "Ruta Histórica", value: "Fúquene - Ubaté - Chiquinquirá" },
      { label: "Modalidad Antigua", value: "Trueque de pesca por granos andinos" },
      { label: "Modalidad Actual", value: "Venta directa de pescador a consumidor" }
    ],
    quote: "«Comprar guapucha local es sembrar futuro en las manos de quien cuida la laguna.»"
  },

  "sabores-y-tradicion": {
    id: "sabores-y-tradicion",
    title: "Sabores y tradición",
    category: "Identidad Culinaria",
    subtitle: "El maridaje de la tierra fría colombiana",
    badge: "Patrimonio Gustativo",
    color: "#3b7ebf",
    text: `El perfil organoléptico de la guapucha es un reflejo puro de su biotopo: notas minerales limpias, ausencia total de olor fangoso gracias al filtrado constante de los totorales, y un fondo dulce característico de los carácidos de alta montaña.<br><br>
    En la mesa tradicional, se complementa con una taza humeante de agua de panela con queso campesino o chicha fermentada en múcura de barro, equilibrando la salinidad crocante del pescado con la dulzura reconfortante del campo andino.`,
    stats: [
      { label: "Notas Gustativas", value: "Mineral, dulce, herbáceo sutil" },
      { label: "Maridaje Líquido", value: "Agua de panela con limón o chicha" },
      { label: "Sensación", value: "Cálida, reconfortante y festiva" }
    ],
    quote: "«En cada bocado se resume el aroma del viento frío y la bondad de nuestras aguas.»"
  },

  "una-tradicion-que-permanece": {
    id: "una-tradicion-que-permanece",
    title: "Una tradición que permanece",
    category: "Futuro y Esperanza",
    subtitle: "El pacto de una generación por la vida",
    badge: "Compromiso",
    color: "#3b7ebf",
    text: `A pesar de los desafíos ecológicos, el cambio climático y la presión urbana, <strong>la guapucha y la cultura de Fúquene se niegan a desaparecer</strong>.<br><br>
    Nuevos movimientos de jóvenes biólogos, cocineros de vanguardia, pescadores tradicionales y escuelas rurales están trabajando de la mano. Investigaciones científicas en reproducción en cautiverio para repoblación, sumadas a la valoración de la gastronomía ancestral como atractivo turístico sostenible, abren un horizonte prometedor donde la laguna y su gente seguirán cantándole a la vida por muchos siglos más.`,
    stats: [
      { label: "Misión Actual", value: "Conservación biocultural activa" },
      { label: "Participantes", value: "Jóvenes, científicos y sabedores" },
      { label: "Visión", value: "Laguna de Fúquene viva y próspera" }
    ],
    quote: "«La guapucha no es solo un pez del pasado; es el faro que nos guía hacia el cuidado del agua en el porvenir.»"
  }
};
