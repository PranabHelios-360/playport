/* English / Spanish. English is the source text in app.js and index.html;
   this file swaps visible text to Spanish when the player picks it.
   Brand, platform and game names and numbers are matched as placeholders,
   so "Load Fire Kirin" and "Load Juwa" share one entry. */

const ES = {
  // header, nav, footer
  'Log in': 'Entrar','Sign up': 'Registrarse', 'Live Activity': 'Actividad en vivo', 'Live activity': 'Actividad en vivo',
  'redeemed on Milky Way': 'canjeó en Milky Way',
  'Menu': 'Menú', 'Games': 'Juegos', 'Balance': 'Saldo', 'Activity': 'Actividad', 'Chat': 'Chat', 'Home': 'Inicio', 'Profile': 'Perfil',
  'Notifications': 'Notificaciones', 'Join our Telegram': 'Únete a nuestro Telegram', 'Download App': 'Descargar app', 'Shop': 'Tienda',
  'Rewards': 'Recompensas', 'Platforms': 'Plataformas', 'Account': 'Cuenta', 'My account': 'Mi cuenta', 'Help': 'Ayuda', 'Live chat': 'Chat en vivo',
  'FAQ': 'Preguntas frecuentes', 'Contact us': 'Contáctanos', 'Switch site': 'Cambiar de sitio', 'Legal': 'Legal', 'Terms of service': 'Términos del servicio',
  'Privacy policy': 'Política de privacidad', 'Sweepstakes rules': 'Reglas del sorteo', 'Responsible play': 'Juego responsable', 'Play responsibly': 'Juega con responsabilidad',
  'Two-step login': 'Inicio de sesión en dos pasos', 'Colour': 'Color', 'Language': 'Idioma', 'English': 'English', 'Español': 'Español',
  'One wallet for every game we host. Deposit once, unlock each game, load credits and redeem back to your wallet.': 'Una billetera para todos nuestros juegos. Deposita una vez, desbloquea cada juego, carga créditos y canjéalos de vuelta a tu billetera.',
  'No purchase necessary. Void where prohibited by law. 21+ only. Sweeps Coins have no cash value outside the platforms they are issued on. Game names and logos belong to their owners.': 'No se requiere compra. Nulo donde lo prohíba la ley. Solo mayores de 21 años. Los Sweeps Coins no tienen valor en efectivo fuera de las plataformas que los emiten. Los nombres y logotipos de los juegos pertenecen a sus dueños.',
  '© 2026 Recharge777. All rights reserved.': '© 2026 Recharge777. Todos los derechos reservados.',
  'Recharge777 home': 'Inicio de Recharge777', 'Site menu': 'Menú del sitio', 'Main': 'Principal', 'Close menu': 'Cerrar menú', 'Support chat': 'Chat de soporte',
  'Close chat': 'Cerrar chat', 'Type a message': 'Escribe un mensaje', 'Close': 'Cerrar', 'Loading': 'Cargando', 'Back': 'Volver',
  'Plum theme': 'Tema ciruela', 'Plum': 'Ciruela', 'Navy theme': 'Tema azul marino', 'Navy': 'Azul marino', 'White theme': 'Tema blanco', 'White': 'Blanco',
  'Wine theme': 'Tema vino', 'Wine': 'Vino', 'Pick colour': 'Elegir color', 'Theme': 'Tema',
  'Slide 1': 'Diapositiva 1',

  // chooser
  'Choose your site': 'Elige tu sitio', 'Same games, same wallet. Pick the look you like.': 'Los mismos juegos y la misma billetera. Elige el estilo que te guste.',
  'Neon pink · Plum, Navy or White · bottom menu': 'Rosa neón · Ciruela, Azul marino o Blanco · menú inferior',
  'Gold & ruby · Wine, Navy or White · side menu': 'Oro y rubí · Vino, Azul marino o Blanco · menú lateral',
  'Recharge777 or Loaded777': 'Recharge777 o Loaded777',

  // home (guest)
  'One wallet for': 'Una billetera para', 'every game': 'todos los juegos',
  'Make one account, fund it once, and unlock Milky Way, Fire Kirin, Orion Stars and more. Load credits into any game and redeem them back to your wallet.': 'Crea una cuenta, recárgala una vez y desbloquea Milky Way, Fire Kirin, Orion Stars y más. Carga créditos en cualquier juego y canjéalos de vuelta a tu billetera.',
  'Create account': 'Crear cuenta', 'Already have one?': '¿Ya tienes una?', 'Hot right now': 'Lo más jugado', '1,240 playing': '1,240 jugando',
  'Daily 1st bonus': 'Bono Daily 1st', 'Up to +15% on your first load': 'Hasta +15% en tu primera carga',
  'Create your account': 'Crea tu cuenta', "Email and a 6-digit code. That's your Recharge777 login.": 'Correo y un código de 6 dígitos. Ese es tu acceso a Recharge777.',
  'Deposit to your wallet': 'Deposita en tu billetera', 'Send crypto. Your wallet shows it once confirmed.': 'Envía cripto. Tu billetera lo muestra cuando se confirma.',
  'Unlock a game, load credits': 'Desbloquea un juego y carga créditos', 'Each game gets its own login. Move money from your wallet into it.': 'Cada juego tiene su propio acceso. Pasa dinero de tu billetera al juego.',
  'Play, then redeem': 'Juega y luego canjea', 'Redeem credits back to your wallet, then withdraw.': 'Canjea los créditos a tu billetera y luego retira.',
  'Winners': 'Ganadores', 'Latest': 'Recientes', 'This month': 'Este mes', 'Your email address': 'Tu correo electrónico',
  'Welcome back,': 'Bienvenido de nuevo,', 'You have 2 of 6 game accounts unlocked.': 'Tienes 2 de 6 cuentas de juego desbloqueadas.',
  'Unlock your first game account to start playing.': 'Desbloquea tu primera cuenta de juego para empezar a jugar.',
  'Deposit': 'Depositar', 'My games': 'Mis juegos',

  // reviews
  'The Recharge777 community': 'La comunidad de Recharge777', 'Every player.': 'Cada jugador.', 'A different story.': 'Una historia diferente.',
  'A place for the experiences, favorites, and feedback that make our community.': 'Un lugar para las experiencias, favoritos y opiniones que forman nuestra comunidad.',
  'Design preview · sample reviews': 'Vista previa del diseño · reseñas de ejemplo',
  'These examples show the layout. They are not customer testimonials.': 'Estos ejemplos muestran el diseño. No son testimonios de clientes.',
  'Sample review': 'Reseña de ejemplo', 'Sample player': 'Jugador de ejemplo', 'Preview content': 'Contenido de muestra',
  'I like having my game platforms together in one place.': 'Me gusta tener mis plataformas de juego juntas en un solo lugar.',
  'The game categories make it easy to find what I want to explore.': 'Las categorías facilitan encontrar lo que quiero explorar.',
  'The layout feels clear on my phone and my tablet.': 'El diseño se ve claro en mi teléfono y mi tableta.',
  'Switching between the light and dark themes is a nice touch.': 'Poder cambiar entre tema claro y oscuro es un buen detalle.',
  'Loading credits into a game takes just a couple of taps.': 'Cargar créditos en un juego toma solo un par de toques.',
  'Seeing every game login in one place saves me time.': 'Ver todos mis accesos de juego en un solo lugar me ahorra tiempo.',
  'The Daily 1st bonus is a fun reason to check in each day.': 'El bono Daily 1st es un buen motivo para entrar cada día.',
  'Redeeming back to my wallet is simple to follow.': 'Canjear de vuelta a mi billetera es fácil de seguir.',
  'Live chat answered my question quickly.': 'El chat en vivo respondió mi pregunta rápido.',
  'I like that each game keeps its own balance.': 'Me gusta que cada juego tenga su propio saldo.',
  'The deposit limit setting helps me stay on budget.': 'El límite de depósito me ayuda a no pasarme del presupuesto.',
  'Being able to switch to Spanish is really helpful.': 'Poder cambiar a español es muy útil.',
  'Our Trustpilot rating will show here once the business profile is connected.': 'Nuestra calificación de Trustpilot aparecerá aquí cuando se conecte el perfil de empresa.',

  // blog + videos
  'From the blog': 'Del blog', 'How it works': 'Cómo funciona', 'Guide': 'Guía', 'Promos': 'Promociones', 'Tips': 'Consejos', 'Read more': 'Leer más',
  'Nov 19, 2026 · 3 min read': '19 nov 2026 · 3 min de lectura', 'Videos': 'Videos',
  'How to load credits into a game': 'Cómo cargar créditos en un juego', 'Move money from your wallet into any game account in a few taps.': 'Pasa dinero de tu billetera a cualquier cuenta de juego en pocos toques.',
  'The Daily 1st bonus, explained': 'El bono Daily 1st, explicado', 'Get extra credits on your first load of the day in selected games.': 'Recibe créditos extra en tu primera carga del día en juegos seleccionados.',
  'Fish table basics': 'Lo básico de las mesas de pesca', 'Pick your targets, pace your shots and know when to switch tables.': 'Elige tus objetivos, mide tus disparos y sabe cuándo cambiar de mesa.',
  'How redeeming and withdrawing work': 'Cómo funcionan los canjes y retiros', 'Bring credits back to your wallet, then send them to your crypto address.': 'Regresa los créditos a tu billetera y luego envíalos a tu dirección cripto.',
  'Getting started in 60 seconds': 'Empieza en 60 segundos', 'Sign up, deposit, unlock a game': 'Regístrate, deposita y desbloquea un juego',
  'Jade Fortune gameplay': 'Partida de Jade Fortune', 'Ocean King boss hunt': 'Cacería del jefe en Ocean King', 'How to redeem to your wallet': 'Cómo canjear a tu billetera',
  'Step by step': 'Paso a paso', 'The video player goes here once the clip is uploaded.': 'El reproductor aparece aquí cuando se suba el video.', 'Recharge777 videos': 'Videos de Recharge777',
  'Guide · Nov 19, 2026 · 3 min read': 'Guía · 19 nov 2026 · 3 min de lectura',
  'Every game has its own balance. Your wallet is where deposits land; credits are what you play with inside a game.': 'Cada juego tiene su propio saldo. Tu billetera recibe los depósitos; los créditos son con lo que juegas dentro de cada juego.',
  'Open Games, tap Load on the game you want, pick an amount and confirm. The credits show on that game straight away.': 'Abre Juegos, toca Cargar en el juego que quieras, elige un monto y confirma. Los créditos aparecen en ese juego al instante.',
  'Tip: the first load of the day on games tagged Daily 1st adds bonus credits on top.': 'Consejo: la primera carga del día en juegos con la etiqueta Daily 1st suma créditos de bono.',
  'Games with the Daily 1st tag add a percentage on top of your first load each day.': 'Los juegos con la etiqueta Daily 1st suman un porcentaje a tu primera carga de cada día.',
  'Milky Way, Fire Kirin and Juwa give +10%. Orion Stars gives +15%.': 'Milky Way, Fire Kirin y Juwa dan +10%. Orion Stars da +15%.',
  'The tag greys out once you have used it for the day and resets the next day.': 'La etiqueta se apaga cuando la usas en el día y se reinicia al día siguiente.',
  'Start on a low bet to learn how each fish moves before raising it.': 'Empieza con una apuesta baja para aprender cómo se mueve cada pez antes de subirla.',
  'Big targets pay more but take more shots. Mix small, steady targets in between.': 'Los objetivos grandes pagan más pero requieren más disparos. Alterna con objetivos pequeños.',
  'Set a budget before you start and use the deposit limit under My account to stick to it.': 'Fija un presupuesto antes de empezar y usa el límite de depósito en Mi cuenta para cumplirlo.',
  'Redeem first: open Balance, choose Redeem, pick the game and the amount. It lands in your wallet once processed.': 'Primero canjea: abre Saldo, elige Canjear, selecciona el juego y el monto. Llega a tu billetera cuando se procese.',
  'Then withdraw: choose Withdraw, pick a crypto, enter your address and the amount.': 'Luego retira: elige Retirar, selecciona una cripto, ingresa tu dirección y el monto.',
  'You can follow every step under Activity, In progress.': 'Puedes seguir cada paso en Actividad, En proceso.',

  // chat
  'Help & chat': 'Ayuda y chat', 'Recharge777 support': 'Soporte de Recharge777', 'Hi there. How can we help you today?': 'Hola. ¿Cómo podemos ayudarte hoy?',
  'Contact reason': 'Motivo de contacto', 'Account / login issues': 'Problemas de cuenta o acceso', 'Deposit not showing': 'El depósito no aparece',
  'Redeem or withdrawal': 'Canje o retiro', 'Game account / credits': 'Cuenta de juego o créditos', 'Something else': 'Otra cosa', 'Send': 'Enviar',

  // sign up / log in
  'Check your email': 'Revisa tu correo', 'We sent a 6-digit code to': 'Enviamos un código de 6 dígitos a', 'Verify and create account': 'Verificar y crear cuenta',
  'No email?': '¿No llegó el correo?', 'Send a new code': 'Enviar otro código', 'or': 'o', 'change the email': 'cambiar el correo',
  'This is your Recharge777 login for your wallet. Game accounts come later, one per game.': 'Este es tu acceso a Recharge777 para tu billetera. Las cuentas de juego vienen después, una por juego.',
  "I'm 21 or older and agree to the terms and sweepstakes rules.": 'Tengo 21 años o más y acepto los términos y las reglas del sorteo.',
  'Send code': 'Enviar código', 'First name': 'Nombre', 'Email address': 'Correo electrónico', 'Use your Recharge777 username and password.': 'Usa tu usuario y contraseña de Recharge777.',
  'New here?': '¿Eres nuevo?', 'Create an account': 'Crea una cuenta', 'Username or email': 'Usuario o correo', 'Password': 'Contraseña',
  'Log in to see this page': 'Inicia sesión para ver esta página', "Don't have an account yet? Sign up with your email. It takes about a minute.": '¿Aún no tienes cuenta? Regístrate con tu correo. Toma un minuto.',
  'Here is your Recharge777 login. Next, deposit to your wallet and unlock your first game.': 'Este es tu acceso a Recharge777. Ahora deposita en tu billetera y desbloquea tu primer juego.',
  'Username': 'Usuario', 'Unlock a game': 'Desbloquear un juego', 'Copy username': 'Copiar usuario', 'Show password': 'Mostrar contraseña', 'Hide password': 'Ocultar contraseña', 'Copy password': 'Copiar contraseña',
  'Welcome to Loaded777': 'Bienvenido a Loaded777', 'Sign up to get your wallet, game accounts and rewards.': 'Regístrate para obtener tu billetera, cuentas de juego y recompensas.',
  'Join now': 'Únete ahora',

  // how it works doc + FAQ
  'Create your Recharge777 account.': 'Crea tu cuenta de Recharge777.',
  'Email plus a 6-digit code. This login is for the site: your wallet, deposits and withdrawals.': 'Correo y un código de 6 dígitos. Este acceso es para el sitio: tu billetera, depósitos y retiros.',
  'Deposit to your wallet.': 'Deposita en tu billetera.', 'Pick a crypto, send at least $25 to the address we show you. It appears once the network confirms it.': 'Elige una cripto y envía al menos $25 a la dirección que te mostramos. Aparece cuando la red lo confirma.',
  'Unlock a game account.': 'Desbloquea una cuenta de juego.', 'Each game (Milky Way, Fire Kirin and the rest) has its own app and its own login. We create it for you and show the username and password.': 'Cada juego (Milky Way, Fire Kirin y los demás) tiene su propia app y su propio acceso. Lo creamos por ti y te mostramos el usuario y la contraseña.',
  'Load credits.': 'Carga créditos.', 'Move money from your wallet into that game. Credits stay in the game you loaded them into.': 'Pasa dinero de tu billetera a ese juego. Los créditos se quedan en el juego donde los cargaste.',
  'Play': 'Jugar', "in the game's web version or app, using that game's login.": 'en la versión web o la app del juego, con el acceso de ese juego.',
  'Redeem, then withdraw.': 'Canjea y luego retira.', 'Redeem credits from the game back to your wallet, then withdraw from your wallet to your crypto address.': 'Canjea los créditos del juego a tu billetera y luego retira de tu billetera a tu dirección cripto.',
  'Open live chat': 'Abrir chat en vivo',
  'Is my Recharge777 login the same as my game logins?': '¿Mi acceso a Recharge777 es el mismo que el de mis juegos?',
  'No. Recharge777 is for your wallet. Each game has its own username and password, shown under My account.': 'No. Recharge777 es para tu billetera. Cada juego tiene su propio usuario y contraseña, que ves en Mi cuenta.',
  'Why are my credits split between games?': '¿Por qué mis créditos están divididos entre juegos?', 'Each game runs its own balance. Redeem from one game to your wallet, then load another.': 'Cada juego maneja su propio saldo. Canjea de un juego a tu billetera y luego carga otro.',
  'How long do withdrawals take?': '¿Cuánto tardan los retiros?', 'You can see each one under Activity, In progress, until it is sent.': 'Puedes ver cada uno en Actividad, En proceso, hasta que se envíe.',
  'What is the Daily 1st bonus?': '¿Qué es el bono Daily 1st?', 'Games tagged Daily 1st add bonus credits to your first load of the day in that game.': 'Los juegos con la etiqueta Daily 1st suman créditos de bono a tu primera carga del día en ese juego.',
  'I already play one of these games. Can I use my account?': 'Ya juego uno de estos juegos. ¿Puedo usar mi cuenta?', 'Yes. Choose "I have an Account" when you unlock the game and enter your existing login.': 'Sí. Elige "Ya tengo una cuenta" al desbloquear el juego e ingresa tu acceso actual.',
  'Can I limit my spending?': '¿Puedo limitar mi gasto?', 'Yes. Set a daily deposit limit, take a break, or self-exclude under My account.': 'Sí. Fija un límite diario de depósito, toma un descanso o autoexclúyete en Mi cuenta.',
  'This page is coming soon. For help now, use live chat.': 'Esta página llegará pronto. Si necesitas ayuda ahora, usa el chat en vivo.',

  // games + platform
  "Here you'll find your": 'Aquí encontrarás tus', 'Gaming Accounts': 'Cuentas de juego', 'More Games': 'Más juegos', 'Unlock': 'Desbloquear', 'Active': 'Activa',
  'Daily 1st +10%': 'Daily 1st +10%', 'Fish tables and lucky slots. Home of Jade Fortune and Space Jet.': 'Mesas de pesca y tragamonedas. El hogar de Jade Fortune y Space Jet.',
  'Space-themed slots, keno and fish games, with the Milky Way jackpot wheel.': 'Tragamonedas, keno y juegos de pesca espaciales, con la rueda del premio mayor de Milky Way.',
  'The biggest catalogue: fish, slots and keno.': 'El catálogo más grande: pesca, tragamonedas y keno.', 'Lucky-themed slots with daily bonus drops.': 'Tragamonedas de la suerte con bonos diarios.',
  'Fast fish games and multiplier slots.': 'Juegos de pesca rápidos y tragamonedas con multiplicadores.', 'Strip-style reels and classic sevens.': 'Carretes estilo Las Vegas y sietes clásicos.',
  'You need a Fire Kirin account to play these games.': 'Necesitas una cuenta de Fire Kirin para jugar estos juegos.', 'Unlock Account': 'Desbloquear cuenta', 'Get the app': 'Obtener la app',
  'All': 'Todos', 'Fish': 'Pesca', 'Slots': 'Tragamonedas', 'Keno': 'Keno', 'Slots · Fire Kirin': 'Tragamonedas · Fire Kirin', 'Fish · Fire Kirin': 'Pesca · Fire Kirin', 'Keno · Fire Kirin': 'Keno · Fire Kirin',
  'Bonus on your first load each day': 'Bono en tu primera carga de cada día', 'Search games': 'Buscar juegos', 'Your Games': 'Tus juegos', 'View': 'Ver',
  'Your Fire Kirin login:': 'Tu acceso a Fire Kirin:', '· $53.50 credits': '· $53.50 en créditos', 'Load credits': 'Cargar créditos', 'Wallet': 'Billetera',
  'Lobby': 'Lobby', 'My Games': 'Mis juegos', 'Play now': 'Jugar ahora', 'MY WALLET': 'MI BILLETERA', 'Daily check-in': 'Registro diario', 'Start a streak': 'Empieza una racha',
  'Manage': 'Administrar', 'More platforms': 'Más plataformas', 'See all': 'Ver todo', 'Recent big wins': 'Grandes premios recientes', 'Unlocked': 'Desbloqueado', 'Available': 'Disponible',
  'Unlock a game to get its own login. It only takes a tap.': 'Desbloquea un juego para obtener su acceso. Solo toma un toque.',
  'Rubies, cherries and a Grand jackpot. New on Milky Way.': 'Rubíes, cerezas y un premio Grand. Nuevo en Milky Way.', 'The jade dragon pays up to 2,000x on Fire Kirin.': 'El dragón de jade paga hasta 2,000x en Fire Kirin.',
  'Hunt the great white for the boss bonus.': 'Caza al gran tiburón blanco para el bono del jefe.',

  // balance
  'Manage your funds, transfers and rewards': 'Administra tus fondos, transferencias y recompensas', 'Total Balance': 'Saldo total', 'Packages with free bonus': 'Paquetes con bono gratis',
  'Fund your wallet in seconds': 'Recarga tu billetera en segundos', 'Withdraw': 'Retirar', 'Withdraw your winnings': 'Retira tus ganancias', 'Transfer': 'Transferir', 'Send funds to a game': 'Envía fondos a un juego',
  'Redeem': 'Canjear', 'Redeem credits to your balance': 'Canjea créditos a tu saldo', 'P2P': 'P2P', 'Send funds to other players': 'Envía fondos a otros jugadores', 'Voucher': 'Cupón', 'Redeem a voucher code': 'Canjea un código de cupón',
  '$53.50 in game credits': '$53.50 en créditos de juego',
  'Choose the crypto you want to deposit. Minimum $25.': 'Elige la cripto que quieres depositar. Mínimo $25.', 'Wallet balance': 'Saldo de billetera', 'Deposit Now': 'Depositar ahora',
  'Deposit with Bitcoin': 'Depositar con Bitcoin', 'Send money from your wallet to your crypto address. Minimum $20.': 'Envía dinero de tu billetera a tu dirección cripto. Mínimo $20.',
  'Credits inside a game must be redeemed to your wallet first.': 'Los créditos dentro de un juego deben canjearse primero a tu billetera.', 'Withdraw Now': 'Retirar ahora',
  'Load a game': 'Cargar un juego', 'Move money from your wallet into a game account as credits.': 'Pasa dinero de tu billetera a una cuenta de juego como créditos.', 'Game': 'Juego', 'Amount ($)': 'Monto ($)',
  'Bring credits from a game back to your wallet.': 'Regresa créditos de un juego a tu billetera.', 'Send money from your wallet to another Recharge777 player.': 'Envía dinero de tu billetera a otro jugador de Recharge777.',
  'Player username': 'Usuario del jugador', 'e.g. mike77': 'ej. mike77', 'Got a voucher code? It goes straight to your wallet.': '¿Tienes un código de cupón? Va directo a tu billetera.',
  'Apply voucher': 'Aplicar cupón', 'Voucher code (try WELCOME5)': 'Código de cupón (prueba WELCOME5)',
  'No game accounts yet': 'Aún no tienes cuentas de juego', 'Unlock a game first. Each game gets its own login.': 'Primero desbloquea un juego. Cada juego tiene su propio acceso.',
  'Buy the $20.00 package': 'Comprar el paquete de $20.00', 'Choose the crypto you want to pay with. You get $20.00 + $2.00 free bonus.': 'Elige la cripto con la que quieres pagar. Recibes $20.00 + $2.00 de bono gratis.',
  'Deposit with Solana': 'Depositar con Solana', 'Send $20.00 in SOL': 'Envía $20.00 en SOL', 'Includes $2.00 free bonus with the $20.00 package.': 'Incluye $2.00 de bono gratis con el paquete de $20.00.',
  'Send to this address. Only send SOL on the Solana network.': 'Envía a esta dirección. Solo envía SOL en la red Solana.', 'Deposit address (demo)': 'Dirección de depósito (demo)',
  'This address is for this deposit only. Your wallet updates after the network confirms it.': 'Esta dirección es solo para este depósito. Tu billetera se actualiza cuando la red lo confirma.',
  "I've sent it": 'Ya lo envié', 'How much do you want to add to your wallet? Minimum $25.': '¿Cuánto quieres agregar a tu billetera? Mínimo $25.',
  'Get deposit address': 'Obtener dirección de depósito', 'Withdraw to Bitcoin': 'Retirar a Bitcoin', 'Your BTC address': 'Tu dirección BTC', 'Request withdrawal': 'Solicitar retiro',

  // activity
  'Finished': 'Finalizado', 'In progress': 'En proceso', 'Deposits': 'Depósitos', 'Withdrawals': 'Retiros', 'Loads': 'Cargas', 'Redeems': 'Canjes', 'Vouchers': 'Cupones', 'Bonus': 'Bono',
  'Package bonus': 'Bono del paquete', 'First deposit bonus': 'Bono de primer depósito', 'Deposit (Solana)': 'Depósito (Solana)', 'Deposit (Bitcoin)': 'Depósito (Bitcoin)', 'Voucher WELCOME5': 'Cupón WELCOME5',
  'Daily 1st bonus (+10%)': 'Bono Daily 1st (+10%)', 'Loaded credits': 'Créditos cargados', 'Redeemed credits': 'Créditos canjeados', 'Load bonus ($25+)': 'Bono de carga ($25+)',
  'Nothing here yet': 'Aún no hay nada aquí', 'Pending': 'Pendiente', 'Done': 'Listo',

  // account / dashboard
  'Player ID: tester': 'ID de jugador: tester', 'In games': 'En juegos', 'Points': 'Puntos', 'Change username': 'Cambiar usuario', 'Change password': 'Cambiar contraseña',
  'Security settings': 'Seguridad', 'On: a code is asked at every login': 'Activado: se pide un código en cada inicio de sesión', 'Off: turn on for extra safety': 'Desactivado: actívalo para más seguridad',
  'Game accounts': 'Cuentas de juego', 'Invite & Earn': 'Invita y gana', 'Share your link, earn rewards when friends deposit': 'Comparte tu enlace y gana cuando tus amigos depositen',
  'Transactions': 'Transacciones', 'Order history': 'Historial', 'Order History': 'Historial', 'Help Center': 'Centro de ayuda', 'Chat with support': 'Habla con soporte',
  'Daily deposit limit': 'Límite diario de depósito', 'Take a break': 'Tomar un descanso', 'Pause deposits for a while, or self-exclude': 'Pausa los depósitos un tiempo o autoexclúyete',
  'Pause deposits, or self-exclude': 'Pausa depósitos o autoexclúyete', 'Logout': 'Cerrar sesión', 'Dashboard': 'Panel', 'Withdrawable': 'Retirable',
  'Bind/Change Phone': 'Vincular/cambiar teléfono', 'Not Bound': 'Sin vincular', 'Change Password': 'Cambiar contraseña', 'Identity Verification': 'Verificación de identidad',
  'Not Verified': 'No verificado', 'Under review': 'En revisión', 'Verified': 'Verificado', 'Change Username': 'Cambiar usuario', 'Two-step Login': 'Inicio en dos pasos', 'On': 'Activado', 'Off': 'Desactivado',
  'Game Accounts': 'Cuentas de juego', '2 of 6 unlocked': '2 de 6 desbloqueadas', 'View all': 'Ver todo', 'FAQ and live chat': 'Preguntas frecuentes y chat en vivo',
  'Background music': 'Música de fondo', 'Music volume': 'Volumen de la música', '$100 per day': '$100 por día', 'No limit set': 'Sin límite',
  'Save username': 'Guardar usuario', 'Current password': 'Contraseña actual', "Your game logins are separate and don't change.": 'Tus accesos de juego son aparte y no cambian.',
  'Update password': 'Actualizar contraseña', 'Copy current password': 'Copiar contraseña actual', 'New password (8+ characters)': 'Nueva contraseña (8+ caracteres)',
  'Each game has its own login.': 'Cada juego tiene su propio acceso.', 'Lower it any time. Raising it takes 24 hours.': 'Puedes bajarlo cuando quieras. Subirlo toma 24 horas.',
  'No limit': 'Sin límite', 'Save limit': 'Guardar límite', 'Pause deposits and loading credits for a while.': 'Pausa los depósitos y las cargas de créditos por un tiempo.',
  'Self-exclude': 'Autoexcluirme', '24 hours': '24 horas', '7 days': '7 días', '30 days': '30 días',
  'Bind phone': 'Vincular teléfono', 'We text a code to confirm it. Used for login alerts and recovery.': 'Te enviamos un código por SMS para confirmarlo. Se usa para alertas de acceso y recuperación.',
  'Demo: the number is saved straight away.': 'Demo: el número se guarda al instante.',
  'Your documents are under review. We will email you when it is done.': 'Tus documentos están en revisión. Te enviaremos un correo cuando termine.',
  'Verify your identity to unlock withdrawals over $500.': 'Verifica tu identidad para habilitar retiros de más de $500.', 'Start verification': 'Iniciar verificación',

  // rewards
  'YOUR POINTS': 'TUS PUNTOS', 'No level yet': 'Aún sin nivel', 'Cashable': 'Canjeable', 'Move to wallet': 'Pasar a billetera', 'Today': 'Hoy', 'Compete': 'Competir', 'You': 'Tú',
  'DAILY CHECK-IN': 'REGISTRO DIARIO', 'Start a streak today': 'Empieza una racha hoy', 'TODAY': 'HOY', 'DAY 2': 'DÍA 2', 'Collect +10 pts': 'Cobrar +10 pts', 'Collected': 'Cobrado',
  'QUESTS': 'MISIONES', 'Make your first deposit': 'Haz tu primer depósito', 'Top up your wallet for the first time.': 'Recarga tu billetera por primera vez.', '+200 pts': '+200 pts', 'Claimed': 'Reclamado', 'Claim': 'Reclamar',
  'Get your first game': 'Consigue tu primer juego', 'Unlock any game account and start playing.': 'Desbloquea cualquier cuenta de juego y empieza a jugar.',
  'Play 3 days in a row': 'Juega 3 días seguidos', 'Keep a 3-day check-in streak going.': 'Mantén una racha de registro de 3 días.', 'Deposit 5 times': 'Deposita 5 veces',
  'Make 5 successful deposits.': 'Haz 5 depósitos exitosos.', 'Unlock 3 games': 'Desbloquea 3 juegos', 'Have three game accounts ready to play.': 'Ten tres cuentas de juego listas para jugar.',
  'Turn on two-step login': 'Activa el inicio en dos pasos', 'Protect your wallet with a login code.': 'Protege tu billetera con un código de acceso.', 'Complete your profile': 'Completa tu perfil',
  'Pick a photo so we can serve you better.': 'Elige una foto para atenderte mejor.', 'Refer a friend': 'Recomienda a un amigo', 'Invite a friend who makes their first deposit.': 'Invita a un amigo que haga su primer depósito.',
  'GOT A PROMO CODE?': '¿TIENES UN CÓDIGO PROMOCIONAL?', 'Codes from emails, posts or your host unlock extra offers.': 'Los códigos de correos, publicaciones o tu anfitrión desbloquean ofertas extra.',
  'Demo codes: BONUS50, RECHARGE100': 'Códigos demo: BONUS50, RECHARGE100', 'OFFERS FOR YOU': 'OFERTAS PARA TI', 'Daily 1st load bonus': 'Bono Daily 1st de carga',
  'Up to +15% credits · first load each day': 'Hasta +15% en créditos · primera carga del día', 'Milky Way, Fire Kirin and Juwa give +10%, Orion Stars +15%.': 'Milky Way, Fire Kirin y Juwa dan +10%, Orion Stars +15%.',
  'Points on every load': 'Puntos en cada carga', '1 pt for every $1 you load': '1 pt por cada $1 que cargues', 'Spend them in the Shop for cashable money.': 'Úsalos en la Tienda para obtener dinero canjeable.',
  'Open shop': 'Abrir tienda', 'You earn points when your friend makes a first deposit.': 'Ganas puntos cuando tu amigo hace su primer depósito.', 'Get my code': 'Obtener mi código',
  'ENTER A CODE': 'INGRESA UN CÓDIGO', 'Apply': 'Aplicar', 'Promo code': 'Código promocional', 'WEEKLY LEADERBOARD': 'TABLA SEMANAL', 'RESETS MONDAY': 'SE REINICIA EL LUNES',
  'Earn points from check-ins, quests and loads. Top 3 win bonus points.': 'Gana puntos con registros, misiones y cargas. Los 3 primeros ganan puntos extra.', 'you': 'tú',
  'SHOP': 'TIENDA', 'Swap points for cashable money, then move it to your wallet.': 'Cambia puntos por dinero canjeable y luego pásalo a tu billetera.', 'Get it': 'Obtener',
  'Need 90 more': 'Te faltan 90', 'INVITE FRIENDS': 'INVITA AMIGOS', 'Earn': 'Gana', '+250 points': '+250 puntos',
  'when a friend signs up with your code and makes their first deposit.': 'cuando un amigo se registra con tu código y hace su primer depósito.', 'Copy link': 'Copiar enlace', 'Share': 'Compartir',
  'YOUR LEVEL': 'TU NIVEL', 'Bronze': 'Bronce', 'Silver': 'Plata', 'Gold': 'Oro', 'Platinum': 'Platino', 'PROFILE PHOTO': 'FOTO DE PERFIL',
  'Pick one to complete your profile (+50 pts).': 'Elige una para completar tu perfil (+50 pts).', 'HISTORY': 'HISTORIAL', 'Credited': 'Acreditado', 'Loaded Fire Kirin': 'Cargaste Fire Kirin',
  'Daily check-in (day 1)': 'Registro diario (día 1)', '$1 cashable': '$1 canjeable',

  // new money screens
  'Load Fire Kirin': 'Cargar Fire Kirin', 'Game credits': 'Créditos de juego', 'Pick an amount from your wallet to load into Fire Kirin.': 'Elige un monto de tu billetera para cargar en Fire Kirin.',
  'Start Game': 'Iniciar juego', 'Select amount': 'Elige un monto', 'Reset': 'Reiniciar', 'Load $25 or more for bonus credits.': 'Carga $25 o más para recibir créditos de bono.',
  'You get': 'Recibes', 'bonus credits': 'en créditos de bono', 'bonus credits.': 'en créditos de bono.', 'Cancel': 'Cancelar', 'Load to game': 'Cargar al juego', 'Add money': 'Agregar dinero',
  'Less': 'Menos', 'More': 'Más', 'Your wallet is empty.': 'Tu billetera está vacía.',
  'Log in to the game with these.': 'Inicia sesión en el juego con estos datos.', 'Username:': 'Usuario:', 'Password:': 'Contraseña:', 'Reset password': 'Restablecer contraseña',
  'Play Fire Kirin': 'Jugar Fire Kirin', 'Credits': 'Créditos', 'Load': 'Cargar', 'Get app': 'Obtener app',
  'Your Fire Kirin account is ready. Log in to the game with these.': 'Tu cuenta de Fire Kirin está lista. Inicia sesión en el juego con estos datos.',
  'Linked to your existing login.': 'Vinculada a tu acceso actual.', 'In the Fire Kirin app. Log in to the game with these.': 'En la app de Fire Kirin. Inicia sesión en el juego con estos datos.',
  'Unlock Orion Stars': 'Desbloquear Orion Stars', 'Orion Stars runs in its own app with its own login. Choose how you want to sign in.': 'Orion Stars funciona en su propia app con su propio acceso. Elige cómo quieres entrar.',
  'Auto Create Account': 'Crear cuenta automáticamente', 'We make a new Orion Stars login for you.': 'Creamos un nuevo acceso a Orion Stars para ti.', 'I have an Account': 'Ya tengo una cuenta',
  'Link the Orion Stars login you already use.': 'Vincula el acceso a Orion Stars que ya usas.', 'Free. Your Orion Stars credits are kept separate from your other games.': 'Gratis. Tus créditos de Orion Stars se mantienen separados de tus otros juegos.',
  'Link your Orion Stars account': 'Vincula tu cuenta de Orion Stars', 'Enter the username and password you use in the Orion Stars app.': 'Ingresa el usuario y la contraseña que usas en la app de Orion Stars.',
  'Orion Stars username': 'Usuario de Orion Stars', 'Orion Stars password': 'Contraseña de Orion Stars', 'Link account': 'Vincular cuenta', "Don't have one?": '¿No tienes una?', 'Auto create it': 'Créala automáticamente',
  'Get Fire Kirin': 'Obtener Fire Kirin', 'Play in your browser or install the app. Log in with your Fire Kirin username and password.': 'Juega en tu navegador o instala la app. Entra con tu usuario y contraseña de Fire Kirin.',
  'Web version': 'Versión web', 'Opens in a new tab': 'Se abre en una pestaña nueva', 'Android': 'Android', 'Download the APK': 'Descargar el APK', 'iPhone': 'iPhone', 'Install from the link': 'Instalar desde el enlace',
  'Redeem from Fire Kirin': 'Canjear de Fire Kirin', 'Credits go back to your Recharge777 wallet. You can then withdraw or load another game.': 'Los créditos regresan a tu billetera de Recharge777. Luego puedes retirar o cargar otro juego.',
  'Fire Kirin credits': 'Créditos de Fire Kirin', 'Redeem to wallet': 'Canjear a billetera', 'Opening Fire Kirin…': 'Abriendo Fire Kirin…',
  'Packages': 'Paquetes', 'First Deposit': 'Primer depósito', 'Buy a package, get FREE bonus credits on top.': 'Compra un paquete y recibe créditos de bono GRATIS.', 'wallet balance': 'saldo de billetera',
  'FREE': 'GRATIS', 'BEST DEAL': 'MEJOR OFERTA', 'Paid in crypto. Bonus credits land in your wallet with the deposit.': 'Se paga con cripto. Los créditos de bono llegan a tu billetera con el depósito.',
  'You have already made your first deposit. This offer is one-time only.': 'Ya hiciste tu primer depósito. Esta oferta es de una sola vez.', '+20% bonus': '+20% de bono',
  'First deposit only:': 'Solo en el primer depósito:', '+20% extra': '+20% extra', 'bonus credits. One time.': 'en créditos de bono. Una sola vez.',
  'Bitcoin': 'Bitcoin', 'Bitcoin Cash': 'Bitcoin Cash', 'Binance Coin': 'Binance Coin',

  // pieces found in the Spanish sweep
  'All fish games and slots platform under one roof. Sign up': 'Todos los juegos de pesca y tragamonedas en una sola plataforma. Regístrate',
  'What our customers have to say': 'Lo que dicen nuestros clientes', 'Hear from players across Milky Way, Fire Kirin, Orion Stars and more.': 'Escucha a jugadores de Milky Way, Fire Kirin, Orion Stars y más.',
  'Player video review': 'Reseña en video', 'Coming soon': 'Muy pronto', 'Plays Fire Kirin': 'Juega Fire Kirin', '5 stars': '5 estrellas', 'Video review': 'Reseña en video',
  'This player video goes here once the clip is uploaded.': 'El video del jugador aparecerá aquí cuando se suba.',
  'Fish games and slots from every platform, all in one place.': 'Juegos de pesca y tragamonedas de todas las plataformas, en un solo lugar.',
  'You need a Fire Kirin account to play.': 'Necesitas una cuenta de Fire Kirin para jugar.', 'Account ready': 'Cuenta lista', 'Unlock your account': 'Desbloquea tu cuenta',
  'We create your Fire Kirin login, or link the one you have.': 'Creamos tu acceso a Fire Kirin o vinculamos el que ya tienes.',
  'Move money from your wallet into Fire Kirin. First load each day gets +10%.': 'Pasa dinero de tu billetera a Fire Kirin. La primera carga de cada día recibe +10%.',
  'Move money from your wallet into Fire Kirin.': 'Pasa dinero de tu billetera a Fire Kirin.',
  'Open the Fire Kirin web version or app and log in.': 'Abre la versión web o la app de Fire Kirin e inicia sesión.',
  'Player ID': 'ID de jugador', 'Copy Player ID': 'Copiar ID de jugador',
  'Sample quote': 'Cita de ejemplo', '“One wallet for all my games. Loading takes seconds.”': '“Una billetera para todos mis juegos. Cargar toma segundos.”',
  '“I like that every game has its own login, all in one place.”': '“Me gusta que cada juego tenga su propio acceso, todo en un solo lugar.”',
  '“The Daily 1st bonus keeps me coming back.”': '“El bono Daily 1st hace que siempre regrese.”', '“Redeeming back to my wallet was simple.”': '“Canjear de vuelta a mi billetera fue sencillo.”',
  '“Support helped me link my old account in minutes.”': '“Soporte me ayudó a vincular mi cuenta anterior en minutos.”',
  // coins, avatars, verify bonus
  'Switch coins': 'Cambiar monedas', 'Buy coins': 'Comprar monedas', 'Gold Coins': 'Gold Coins', 'Sweeps Coins': 'Sweeps Coins', 'For fun, no cash value': 'Para divertirse, sin valor en efectivo',
  'Redeemable': 'Canjeable', 'Change avatar': 'Cambiar avatar', 'locked! One step to claim.': '¡bloqueado! Un paso para reclamar.', 'Under review. Almost there.': 'En revisión. Ya casi.',
  'Get 30,000 GC + 3.00 SC for verifying!': '¡Recibe 30,000 GC + 3.00 SC por verificarte!',
  'Your documents are under review. The coins land in your account as soon as it is approved.': 'Tus documentos están en revisión. Las monedas llegan a tu cuenta en cuanto se apruebe.',
  'Verify your identity and we will add the bonus to your account. It only takes 2 minutes.': 'Verifica tu identidad y agregaremos el bono a tu cuenta. Solo toma 2 minutos.',
  'Verify now': 'Verificar ahora', 'OK': 'Entendido', 'Choose Avatar': 'Elige tu avatar', 'PREVIEW': 'VISTA PREVIA', 'Name': 'Nombre', 'Enter name': 'Escribe tu nombre',
  'Select an avatar': 'Elige un avatar', '25 available': '25 disponibles', 'Confirm': 'Confirmar', 'Avatar 1': 'Avatar 1', 'Avatar updated': 'Avatar actualizado', 'Choose avatar': 'Elegir avatar',
  'Choose an avatar to complete your profile (+50 pts).': 'Elige un avatar para completar tu perfil (+50 pts).', 'You are verified. Thanks!': 'Ya estás verificado. ¡Gracias!',
  'Documents submitted for review (demo: approved in about 4 seconds)': 'Documentos enviados a revisión (demo: se aprueban en unos 4 segundos)',
  'Verified! 30,000 GC + 3.00 SC added': '¡Verificado! Se agregaron 30,000 GC + 3.00 SC',
  'GC in Fire Kirin': 'GC en Fire Kirin', 'SC in Fire Kirin': 'SC en Fire Kirin', 'Your balance': 'Tu saldo',
  'Pick an amount to load into your Fire Kirin game balance.': 'Elige un monto para cargar en tu saldo de Fire Kirin.', 'bonus.': 'de bono.',
  'Load 2,000 GC or more for a bonus.': 'Carga 2,000 GC o más para recibir un bono.', 'Load 25.00 SC or more for a bonus.': 'Carga 25.00 SC o más para recibir un bono.',
  'You have no Gold Coins yet.': 'Aún no tienes Gold Coins.', 'You have no Sweeps Coins yet.': 'Aún no tienes Sweeps Coins.',
  'Purchase GC and get FREE SC as a bonus!': '¡Compra GC y recibe SC GRATIS de bono!', 'First deposit exclusive: up to': 'Exclusivo del primer depósito: hasta', 'extra SC. One time only.': 'SC extra. Solo una vez.',
  'Paid in crypto. Gold Coins are for fun and have no cash value. Sweeps Coins can be redeemed, 1 SC = $1.': 'Se paga con cripto. Las Gold Coins son para divertirse y no tienen valor en efectivo. Las Sweeps Coins se pueden canjear, 1 SC = $1.',
  '+20% SC': '+20% SC', 'Buy 2,000 GC': 'Comprar 2,000 GC',
  'Choose the crypto you want to pay with. You get 2,000 GC + 20.00 SC free.': 'Elige la cripto con la que quieres pagar. Recibes 2,000 GC + 20.00 SC gratis.',
  'Choose the crypto you want to pay with. Every $1 gets you 100 GC plus 1 free SC. Minimum $25.': 'Elige la cripto con la que quieres pagar. Cada $1 te da 100 GC más 1 SC gratis. Mínimo $25.',
  'You get 2,000 GC + 20.00 SC free.': 'Recibes 2,000 GC + 20.00 SC gratis.', 'Redeem Sweeps Coins to your crypto address. 1 SC = $1. Minimum 20 SC.': 'Canjea Sweeps Coins a tu dirección cripto. 1 SC = $1. Mínimo 20 SC.',
  'Purchase confirmed: 2,500 GC + 25.00 SC free': 'Compra confirmada: 2,500 GC + 25.00 SC gratis', 'Gold Coins purchased': 'Gold Coins compradas', 'Free Sweeps Coins': 'Sweeps Coins gratis',
  'Verification bonus': 'Bono de verificación', 'Loaded Gold Coins': 'Gold Coins cargadas', 'GC load bonus': 'Bono de carga GC', 'How it works and FAQ': 'Cómo funciona y preguntas frecuentes',
  '6,000 GC loaded into Fire Kirin + 100 GC bonus': 'Se cargaron 6,000 GC en Fire Kirin + 100 GC de bono', '6,000 GC loaded into Fire Kirin': 'Se cargaron 6,000 GC en Fire Kirin',
  '60.00 SC loaded into Fire Kirin + 1.50 SC bonus': 'Se cargaron 60.00 SC en Fire Kirin + 1.50 SC de bono', '60.00 SC loaded into Fire Kirin': 'Se cargaron 60.00 SC en Fire Kirin',
  '71.50 SC in games': '71.50 SC en juegos', 'Rewards': 'Recompensas',
  '49,000 GC · 71.50 SC in games': '49,000 GC · 71.50 SC en juegos', '140.00 SC wallet': '140.00 SC en billetera', '18.00 SC credits': '18.00 SC en créditos',
  'Verify once to unlock withdrawals and higher limits. Have a photo ID ready.': 'Verifícate una vez para habilitar retiros y límites más altos. Ten a mano una identificación con foto.',
  '1. Photo of your ID (front and back)': '1. Foto de tu identificación (frente y reverso)', '2. A quick selfie': '2. Una selfie rápida', '3. Proof of address': '3. Comprobante de domicilio',
  'Player Reviews': 'Reseñas de jugadores', 'View All': 'Ver todas', 'See more': 'Ver más', 'See less': 'Ver menos', 'Previous review': 'Reseña anterior', 'Next review': 'Siguiente reseña',
  'Our rating shows here once the Trustpilot profile is connected.': 'Nuestra calificación aparecerá aquí cuando se conecte el perfil de Trustpilot.',
  'Sample reviews. Once Trustpilot is connected, View All opens your Trustpilot page.': 'Reseñas de ejemplo. Cuando se conecte Trustpilot, Ver todas abrirá su página.',
  'All my games in one place': 'Todos mis juegos en un lugar', 'I like having my game platforms together in one place. One wallet, separate logins, no juggling apps.': 'Me gusta tener mis plataformas juntas en un solo lugar. Una billetera, accesos separados y sin cambiar de app.',
  'Easy to find a game': 'Fácil encontrar un juego', 'The game categories make it easy to find what I want to explore, and the platform pages show exactly what to do next.': 'Las categorías facilitan encontrar lo que quiero, y cada plataforma muestra exactamente qué hacer.',
  'Works great on my phone': 'Funciona muy bien en mi teléfono', 'The layout feels clear on my phone and my tablet. Everything fits and nothing is hidden behind tiny buttons.': 'El diseño se ve claro en mi teléfono y mi tableta. Todo cabe y nada se esconde tras botones diminutos.',
  'Loading is quick': 'Cargar es rápido', 'Loading credits into a game takes just a couple of taps, and I can see the new balance before I confirm.': 'Cargar créditos toma solo un par de toques, y veo el nuevo saldo antes de confirmar.',
  'Logins in one spot': 'Accesos en un solo lugar', 'Seeing every game login in one place saves me time. Copy the username, copy the password, done.': 'Ver todos mis accesos en un lugar me ahorra tiempo. Copio el usuario, copio la contraseña y listo.',
  'Nice daily bonus': 'Buen bono diario', 'The Daily 1st bonus is a fun reason to check in each day. The extra credits show up right away.': 'El bono Daily 1st es un buen motivo para entrar cada día. Los créditos extra aparecen al instante.',
  'Simple redeems': 'Canjes sencillos', 'Redeeming back to my wallet is simple to follow, and I can track every step under Activity.': 'Canjear a mi billetera es fácil, y puedo seguir cada paso en Actividad.',
  'Helpful support': 'Soporte útil', 'Live chat answered my question quickly and walked me through linking the account I already had.': 'El chat en vivo respondió rápido y me ayudó a vincular la cuenta que ya tenía.',
  'Budget tools': 'Herramientas de presupuesto', 'The deposit limit setting helps me stay on budget. Good to see a site that offers it.': 'El límite de depósito me ayuda a cuidar mi presupuesto. Qué bueno que el sitio lo ofrezca.',
  'Spanish option': 'Opción en español', 'Being able to switch to Spanish is really helpful for my family.': 'Poder cambiar a español es muy útil para mi familia.',
  'We bring the most popular fish games and slots together in one place.': 'Reunimos los juegos de pesca y tragamonedas más populares en un solo lugar.', 'See what players have to say.': 'Mira lo que dicen los jugadores.',
  'Play video review': 'Ver reseña en video', 'Player 1': 'Jugador 1', 'Their quote will show here once the video is added.': 'Su cita aparecerá aquí cuando se agregue el video.', 'Video review 1': 'Reseña en video 1',
  'Pay your way': 'Paga a tu manera', 'Deposit and withdraw with the coins you already use.': 'Deposita y retira con las monedas que ya usas.',
  'Dogecoin': 'Dogecoin', 'USD Coin': 'USD Coin', 'Dai': 'Dai', 'Ripple': 'Ripple', 'Monero': 'Monero',
  'Our platforms': 'Nuestras plataformas', 'All games': 'Ver todo',
  '5 fish table tips for beginners': '5 consejos de mesas de pesca para principiantes',
  "Don't have one yet? Unlock it now!": '¿Aún no tienes una? ¡Desbloquéala ahora!', '6 available': '6 disponibles', '9 games': '9 juegos', '2 accounts': '2 cuentas',
  'Tap View to play, load or redeem.': 'Toca Ver para jugar, cargar o canjear.', 'Any 6 digits work in this demo.': 'En esta demo funciona cualquier código de 6 dígitos.',
  'Promos · Nov 17, 2026 · 2 min read': 'Promociones · 17 nov 2026 · 2 min de lectura', 'Tips · Nov 14, 2026 · 4 min read': 'Consejos · 14 nov 2026 · 4 min de lectura',
  'Guide · Nov 10, 2026 · 3 min read': 'Guía · 10 nov 2026 · 3 min de lectura', 'Nov 14, 2026 · 4 min read': '14 nov 2026 · 4 min de lectura',
  'Fire Kirin ($53.50 credits)': 'Fire Kirin ($53.50 en créditos)', '4 to 20 letters, numbers or underscores.': 'De 4 a 20 letras, números o guiones bajos.',
  '250 pts · when a friend you invited deposits': '250 pts · cuando deposita un amigo que invitaste', '$137.00 wallet': '$137.00 en billetera',
  '$71.50 in 2 games': '$71.50 en 2 juegos', '2 game accounts ready. Load credits and play.': '2 cuentas de juego listas. Carga créditos y juega.',
  'Sign up, deposit, unlock a game · 1:02': 'Regístrate, deposita y desbloquea un juego · 1:02', 'Step by step · 2:05': 'Paso a paso · 2:05',
  'Pending': 'Pendiente', 'Failed': 'Fallido', 'Copied': 'Copiado',

  // toasts
  'Signed out': 'Sesión cerrada', 'No new notifications': 'No hay notificaciones nuevas', 'Username copied': 'Usuario copiado', 'Password copied': 'Contraseña copiada',
  'Player ID copied': 'ID de jugador copiado', 'Address copied': 'Dirección copiada', 'New password made. Use it next time you log in.': 'Nueva contraseña creada. Úsala la próxima vez que entres.',
  'Waiting for network confirmation (demo: about 4 seconds)': 'Esperando la confirmación de la red (demo: unos 4 segundos)', 'More languages coming soon': 'Pronto habrá más idiomas',
  'Your Telegram channel link goes here': 'Aquí va el enlace de tu canal de Telegram', 'Invite link copied': 'Enlace de invitación copiado',
  'Redeem requested. It lands in your wallet shortly (demo: 4 seconds).': 'Canje solicitado. Llegará a tu billetera en breve (demo: 4 segundos).',
  'Deposit confirmed: $22.00 added to your wallet': 'Depósito confirmado: se agregaron $22.00 a tu billetera', '$60.00 loaded into Fire Kirin + $1.50 bonus': 'Se cargaron $60.00 en Fire Kirin + $1.50 de bono',
  '$60.00 loaded into Fire Kirin': 'Se cargaron $60.00 en Fire Kirin'
};

const ES_RX = [
  [/^You're in, (.+)$/, 'Ya estás dentro, $1'],
  [/^Player ID: (.+)$/, 'ID de jugador: $1'],
  [/^We also emailed these to (.+)\. You can change both under My account\.$/, 'También te los enviamos a $1. Puedes cambiar ambos en Mi cuenta.'],
  [/^Need ([\d,]+) more$/, 'Te faltan $1'],
  [/^Welcome back, (.+)$/, 'Bienvenido de nuevo, $1'],
  [/^Username changed to (.+)$/, 'Usuario cambiado a $1'],
  [/^Sent (\$[\d,.]+) to (.+)$/, 'Enviaste $1 a $2'],
  [/^(.+) theme$/, 'Tema $1'],
  [/^(\d+)m ago$/, 'hace $1 min'], [/^(\d+)h ago$/, 'hace $1 h'], [/^just now$/, 'ahora'],
  [/^(.+) · since (\w+) (\d{4})$/, (m, a, mo, y) => `${a} · desde ${({ Jan: 'ene', Feb: 'feb', Mar: 'mar', Apr: 'abr', May: 'may', Jun: 'jun', Jul: 'jul', Aug: 'ago', Sep: 'sep', Oct: 'oct', Nov: 'nov', Dec: 'dic' })[mo] || mo} ${y}`],
  [/^([\d,]+) pts to (\w+)$/, (m, n, l) => `${n} pts para ${({ Bronze: 'Bronce', Silver: 'Plata', Gold: 'Oro', Platinum: 'Platino' })[l] || l}`],
  [/^(\d+) games$/, '$1 juegos'], [/^(\d+) available$/, '$1 disponibles'], [/^(\d+) accounts?$/, '$1 cuentas'],
  [/^(.+) · (\d+) min read$/, '$1 · $2 min de lectura']
];

const LANG_NAMES = { en: 'English', es: 'Español' };
let LANG = (() => { try { return localStorage.getItem('pp_lang') || 'en'; } catch (e) { return 'en'; } })();

const I18N = (() => {
  const orig = new WeakMap(), origAttr = new WeakMap();
  let rx = null, map = null;
  const escRx = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function names() {
    const n = ['Recharge777', 'Loaded777'];
    if (typeof PLATFORMS !== 'undefined') PLATFORMS.forEach(p => n.push(p.name));
    if (typeof GAMES !== 'undefined') GAMES.forEach(g => n.push(g.name));
    return [...new Set(n)].sort((a, b) => b.length - a.length);
  }
  function build() {
    if (map) return;
    const n = names();
    rx = new RegExp(`(${n.map(escRx).join('|')}|\\$?\\d+(?:,\\d{3})*(?:\\.\\d+)?%?)`, 'g');
    map = new Map();
    for (const [en, es] of Object.entries(ES)) {
      if (!es) continue;
      const toks = [];
      const k = en.replace(rx, m => `{${toks.push(m) - 1}}`);
      let v = es;
      toks.map((t, i) => [t, i]).sort((a, b) => b[0].length - a[0].length)
        .forEach(([t, i]) => { v = v.split(t).join(`\u0001${String.fromCharCode(65 + i)}\u0001`); });
      v = v.replace(/\u0001([A-Z])\u0001/g, (_, c) => `{${c.charCodeAt(0) - 65}}`);
      if (!map.has(k)) map.set(k, v);
    }
  }
  function tr(text) {
    build();
    const toks = [];
    const k = text.replace(rx, m => `{${toks.push(m) - 1}}`);
    const v = map.get(k);
    if (v != null) return v.replace(/\{(\d+)\}/g, (_, i) => toks[i] ?? '');
    for (const [r, rep] of ES_RX) if (r.test(text)) return text.replace(r, rep);
    const lead = text.match(/^([.,:;·]\s*)(.+)$/);
    if (lead) { const t = tr(lead[2]); if (t != null) return lead[1] + t; }
    return null;
  }
  function doText(n) {
    const p = n.parentElement;
    if (!p || p.closest('script,style,code,[data-noi18n]')) return;
    const raw = orig.has(n) ? orig.get(n) : n.nodeValue;
    const core = raw.trim();
    if (!core || !/[A-Za-z]/.test(core)) return;
    const t = tr(core.replace(/\s+/g, ' '));
    if (t == null) return;
    if (!orig.has(n)) orig.set(n, raw);
    const out = raw.replace(core, t);
    if (n.nodeValue !== out) n.nodeValue = out;
  }
  function doAttrs(el) {
    for (const a of ['placeholder', 'aria-label', 'title']) {
      if (!el.hasAttribute(a)) continue;
      let o = origAttr.get(el);
      const cur = el.getAttribute(a);
      const src = o && o[a] && o[a].es === cur ? o[a].en : cur;
      const t = tr(src);
      if (t == null) continue;
      if (!o) { o = {}; origAttr.set(el, o); }
      o[a] = { en: src, es: t };
      if (cur !== t) el.setAttribute(a, t);
    }
  }
  function walk(root) {
    if (LANG !== 'es' || !root) return;
    if (root.nodeType === 3) return doText(root);
    if (root.nodeType !== 1) return;
    if (root.matches('[placeholder],[aria-label],[title]')) doAttrs(root);
    root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(doAttrs);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) doText(n);
  }
  function restore() {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) if (orig.has(n)) { n.nodeValue = orig.get(n); orig.delete(n); }
    document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el => {
      const o = origAttr.get(el); if (!o) return;
      for (const a in o) if (el.getAttribute(a) === o[a].es) el.setAttribute(a, o[a].en);
      origAttr.delete(el);
    });
  }
  let busy = false;
  const mo = new MutationObserver(list => {
    if (LANG !== 'es' || busy) return;
    busy = true;
    for (const m of list) {
      if (m.type === 'characterData') doText(m.target);
      else m.addedNodes.forEach(walk);
    }
    busy = false;
  });
  function start() {
    document.documentElement.lang = LANG;
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    walk(document.body);
  }
  return { start, walk, restore, tr };
})();

function setLang(l) {
  if (!LANG_NAMES[l]) return;
  LANG = l;
  try { localStorage.setItem('pp_lang', l); } catch (e) {}
  document.documentElement.lang = l;
  if (typeof S !== 'undefined' && S.user) { S.user.lang = LANG_NAMES[l]; if (typeof save === 'function') save(); }
  if (l === 'es') I18N.walk(document.body); else I18N.restore();
  fillLangPicks();
  document.querySelectorAll('.dash-lang > span').forEach(s => { s.textContent = LANG_NAMES[l]; });
}
const langPick = (label = true) => `<span class="lang-pick">${label ? '<span>Language</span>' : ''}<span class="lp-btns" data-noi18n>${Object.entries(LANG_NAMES).map(([k, v]) => `<button type="button" class="${LANG === k ? 'on' : ''}" data-lang-set="${k}" title="${v}">${k.toUpperCase()}</button>`).join('')}</span></span>`;
const fillLangPicks = () => document.querySelectorAll('[data-lang-pick]').forEach(el => { el.innerHTML = langPick(el.dataset.langPick !== 'bare'); });
