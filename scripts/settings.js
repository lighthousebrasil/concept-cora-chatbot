"use strict";

var audioRecorder = {
  /** Stores the recorded audio as Blob objects of audio data as the recording continues*/
  audioBlobs: [] /*of type Blob[]*/,
  /** Stores the reference of the MediaRecorder instance that handles the MediaStream when recording starts*/
  mediaRecorder: null /*of type MediaRecorder*/,
  /** Stores the reference to the stream currently capturing the audio*/
  streamBeingCaptured: null /*of type MediaStream*/,
  /** Start recording the audio
   * @returns {Promise} - returns a promise that resolves if audio recording successfully started
   */
  start: function () {
    //Feature Detection
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      //Feature is not supported in browser
      //return a custom error
      return Promise.reject(
        new Error(
          "mediaDevices API or getUserMedia method is not supported in this browser."
        )
      );
    } else {
      //Feature is supported in browser

      //create an audio stream
      return (
        navigator.mediaDevices
          .getUserMedia({ audio: true } /*of type MediaStreamConstraints*/)
          //returns a promise that resolves to the audio stream
          .then((stream) /*of type MediaStream*/ => {
            //save the reference of the stream to be able to stop it when necessary
            audioRecorder.streamBeingCaptured = stream;

            //create a media recorder instance by passing that stream into the MediaRecorder constructor
            audioRecorder.mediaRecorder = new MediaRecorder(
              stream
            ); /*the MediaRecorder interface of the MediaStream Recording
                      API provides functionality to easily record media*/

            //clear previously saved audio Blobs, if any
            audioRecorder.audioBlobs = [];

            //add a dataavailable event listener in order to store the audio data Blobs when recording
            audioRecorder.mediaRecorder.addEventListener(
              "dataavailable",
              (event) => {
                //store audio Blob object
                audioRecorder.audioBlobs.push(event.data);
              }
            );

            //start the recording by calling the start method on the media recorder
            audioRecorder.mediaRecorder.start();
          })
      );

      /* errors are not handled in the API because if its handled and the promise is chained, the .then after the catch will be executed*/
    }
  },
};

// Set client auth mode - true to enable client auth, false to disable it
var isClientAuthEnabled = false;

var skillVoicePT = [
  {
    lang: "pt-br",
    name: "Google português do Brasil",
  },
  {
    lang: "pt-br",
    name: "Luciana",
  },
  {
    lang: "pt-pt",
    name: "Joana",
  },
  {
    lang: "pt-br",
  },
];

var skillVoiceEN = [
  {
    lang: "en-us",
    name: "Samantha",
  },
  {
    lang: "en-us",
    name: "Alex",
  },
  {
    lang: "en-us",
  },
];

var skillVoiceES = [{ lang: "es-es" }];

var speech = new SpeechSynthesisUtterance();

speech.lang = "pt-BR";
speech.rate = 1;
speech.pitch = 1;
speech.volume = 1;
speech.text = "Olá";
speech.onend = function (event) {
  console.log("Speech has finished");
};
speech.onerror = function (event) {
  console.log("Speech has finished with error: " + event.error);
};
speech.onstart = function (event) {
  console.log("Speech has started");
};
speech.onpause = function (event) {
  console.log("Speech has paused");
};
speech.onresume = function (event) {
  console.log("Speech has resumed");
};
speech.onmark = function (event) {
  console.log("Speech has marked");
};
speech.onboundary = function (event) {
  console.log("Speech has reached a boundary");
};
/**
 * Initializes the SDK and sets a global field with passed name for it the can
 * be referred later
 *
 * @param {string} name Name by which the chat widget should be referred
 */
async function initSdk(name) {
  // Retry initialization later if WebSDK is not available yet
  if (!document || !WebSDK) {
    setTimeout(function () {
      initSdk(name);
    }, 2000);
    return;
  }

  if (!name) {
    name = "Bots"; // Set default reference name to 'Bots'
  }
  var Bots;

  var locale = sessionStorage.getItem("languageTag");
  var speechLocale =
    locale == "pt_BR" ? "pt-br" : locale == "es" ? "es-es" : "en-us";
  var skillVoices =
    locale == "pt_BR"
      ? skillVoicePT
      : locale == "es"
      ? skillVoiceES
      : skillVoiceEN;

  setTimeout(async function () {
    /**
     * SDK configuration settings
     * Other than URI, all fields are optional with two exceptions for auth modes
     * In client auth disabled mode, 'channelId' must be passed, 'userId' is optional
     * In client auth enabled mode, 'clientAuthEnabled: true' must be passed
     */
    var chatWidgetSettings = {
      URI: "oda-27ac513e872642dc9984fe27bd60a41d-da10.data.digitalassistant.oci.oraclecloud.com",
      channelId: "2dcc05e1-f3ac-444f-9c3c-b65d0c29fa8c",
      initUserHiddenMessage: "Oi",
      initMessageOptions: {
        sendAt: "expand",
      },
      displayActionsAsPills: false,
      enableAttachment: true,
      //			shareMenuItems: ['visual'],
      shareLocation: false,
      enableAutocomplete: true,
      enableAutocompleteClientCache: true,
      enableClearMessage: false,
      initUserProfile: {
        profile: {
          givenName: sessionStorage.getItem("givenName"),
          surname: sessionStorage.getItem("surname"),
          email: sessionStorage.getItem("email"),
          languageTag: sessionStorage.getItem("languageTag"),
          passInt: sessionStorage.getItem("passInt"),
        },
      },
      enableTimestamp: true,
      showConnectionStatus: true,
      embeddedVideo: true,
      locale: speechLocale,
      enableBotAudioResponse: true,
      enableSpeech: true,
      speechLocale: speechLocale,
      enableSecureConnection: true,
      initBotAudioMuted: true,
      openChatOnLoad: true,
      initBotAudioMuted: true,
      skillVoices: skillVoices,
      conversationBeginPosition: "bottom",
      font: '14px "Mier B", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      colors: {
        branding: "white",
        text: "#292929",
        textLight: "#737373",
        typingIndicator: "#D47229",
        botText: "white",
        botMessageBackground: "#D47229",
        actionsBackground: "#232323",
      },
      i18n: {
        "pt-BR": {
          audioResponseOff: "Clique para ativar a resposta de áudio",
          audioResponseOn: "Clique para desativar a resposta de áudio",
          chatTitle: "Assistente Digital",
          connected: "Disponível",
          disconnected: "Indisponível",
          inputPlaceholder: "Digite sua mensagem aqui",
          send: "Enviar (Enter)",
          clear: "Limpar Chat",
          close: "Minimizar Chat",
          connecting: "Conectando...",
          closing: "Fechando...",
          requestLocation: "Envie a sua localização",
          upload: "Escolha o arquivo a ser enviado",
          uploadFailed: "Ocorreu um erro. Contacte o administrador.",
          uploadUnsupportedFileType:
            "Ocorreu um erro. Este tipo de arquivo não é permitido.",
          requestLocationString: "Ocorreu um erro. Contacte o administrador",
          uploadFileSizeLimitExceeded:
            "Limite de arquivo ultrapassado. O tamanho máximo é de 25mb.",
          cardNavPrevious: "Opção anterior",
          cardNavNext: "Próxima opção",
          cardImagePlaceholder: "Imagem",
          recognitionTextPlaceholder: "Fale a sua mensagem",
          speak: "Digite a sua mensagem",
          shareVisual: "Selecionar imagem",
          shareLocation: "Compartilhar localização",
          openMap: "Visualizar no mapa",
          userMessage: "Eu disse",
          utteranceGeneric: "Mensagem da Loja Conceito",
          retryMessage: "Tente novamente",
          requestLocationDeniedUnavailable:
            "Seu local atual não está disponível. Tente novamente ou digite sua cidade/UF.",
          requestLocationDeniedTimeout:
            "Demorando muito para obter sua localização atual. Tente novamente ou digite sua cidade/UF.",
          requestLocationDeniedPermission:
            "Permissão de localização negada. Permita o acesso para compartilhar sua localização ou digite sua cidade/UF.",
          previousChats: "Conversa anterior",
          noSpeechTimeout:
            "Não foi possível detectar a voz, nenhuma mensagem foi enviada.",
          errorSpeechUnsupportedLocale:
            "O navegador utilizado para detecção de fala não é compatível. Não é possível iniciar a voz.",
          card: "Cartão",
        },
        en: {
          audioResponseOff: "Click to enable audio response",
          audioResponseOn: "Click to disable audio response",
          chatTitle: "Digital Assistant",
          connected: "Available",
          disconnected: "Unavailable",
          inputPlaceholder: "Type your message here",
          send: "Send (Enter)",
          clear: "Clear Chat",
          close: "Close Chat",
          connecting: "Connecting...",
          closing: "Closing...",
          requestLocation: "Send your location",
          upload: "Choose the file to send",
          uploadFailed: "An error has occurred. Contact your administrator.",
          requestLocationString:
            "An error has occurred. Contact your administrator.",
          uploadFileSizeLimitExceeded:
            "File limit exceeded. The maximum size is 25mb.",
        },
        es: {
          audioResponseOff: "Haz clic para habilitar los comentarios de audio",
          audioResponseOn: "Haga clic para deshabilitar la respuesta de audio",
          chatTitle: "Asistente Digital",
          connected: "Disponible",
          disconnected: "Indisponible",
          inputPlaceholder: "Escribe tu mensaje aquí",
          send: "Mandar (Enter)",
          clear: "Limpiar Chat",
          close: "Minimizar El Chat",
          connecting: "Conectando...",
          closing: "Cerrando...",
          requestLocation: "Envía tu Ubicación",
          upload: "Elige el archivo a enviar",
          uploadFailed: "Ocurrio un error. Contactar al administrador.",
          uploadUnsupportedFileType:
            "Ocurrio un error. Este tipo de archivo no está permitido.",
          requestLocationString: "Ocurrio un error. Contactar al administrador",
          uploadFileSizeLimitExceeded:
            "Se excedió el límite de archivos. El tamaño máximo es de 25mb.",
          cardNavPrevious: "Opción anterior",
          cardNavNext: "Siguiente opción",
          cardImagePlaceholder: "Imagen",
          recognitionTextPlaceholder: "Habla tu mensaje",
          speak: "Escribe tu mensaje",
          shareVisual: "Seleccionar imagen",
          shareLocation: "Comparte ubicacion",
          openMap: "Ver en el mapa",
          userMessage: "Yo dije",
          utteranceGeneric: "Mensaje de la tienda conceptual",
          retryMessage: "Inténtalo de nuevo",
          requestLocationDeniedUnavailable:
            "Su ubicación actual no está disponible. Vuelve a intentarlo o introduce tu ciudad.",
          requestLocationDeniedTimeout:
            "Tardando demasiado en obtener su ubicación actual. Vuelve a intentarlo o introduce tu ciudad.",
          requestLocationDeniedPermission:
            "Permiso de ubicación denegado. Permite el acceso para compartir tu ubicación o ingresar tu ciudad.",
          previousChats: "Conversación anterior",
          noSpeechTimeout:
            "No se puede detectar la voz, no se envió ningún mensaje.",
          errorSpeechUnsupportedLocale:
            "El navegador utilizado para la detección de voz no es compatible. No se puede iniciar la voz.",
          card: "Tarjeta",
        },
      },
    };

    // Initialize SDK
    Bots = new WebSDK(chatWidgetSettings);

    Bots.setSize("100vw", "100vh");

    // Connect to skill when the widget is expanded for the first time
    var isFirstConnection = true;
    Bots.on(WebSDK.EVENT.WIDGET_OPENED, function () {
      if (isFirstConnection) {
        Bots.connect();
        isFirstConnection = false;
      }
    });

    let isFirstMessage = true;

    Bots.on("message", (o) => {
      if (o.source !== "BOT") return;
      console.log(o);

      let text = "";

      if (o.messagePayload.text) {
        text = o.messagePayload.text + ". ";
      }

      if (o.messagePayload.footerText) {
        text += o.messagePayload.footerText + ". ";
      }

      if (text.length > 0) {
        speech.text = text.replace(/<[^>]*>/g, "");
        window.speechSynthesis.speak(speech);
      }

      isFirstMessage = false;
    });

    await audioRecorder.start();

    Bots.openChat();

    // Create global object to refer Bots
    window[name] = Bots;
  }, 2000);
}
