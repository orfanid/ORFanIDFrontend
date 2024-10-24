<template>
  <v-app>
    <Header v-if="!isHome" />
    <v-main v-if="!isHome">
      <router-view></router-view>
    </v-main>
    <VueBotUI :messages="messageData" :options="botOptions" :bot-typing="botTyping" :input-disable="inputDisable"
      :is-open="botWindowVisible" @msg-send="msgSend" @init="botStart" @destroy="botDestroy" />
    <router-view v-if="isHome"></router-view>
    <vue-progress-bar></vue-progress-bar>
    <Footer v-if="!isHome" />
    <vue-progress-bar></vue-progress-bar>
  </v-app>
</template>

<script>
import Header from '../src/components/Header'
import Footer from '../src/components/Footer'
import M from 'materialize-css'
import { VueBotUI } from 'vue-bot-ui'
import analysisAPI from "../src/api/analysis";
import BotIcon from '../src/assets/images/bot.png'

export default {
  head: {
    link: [
      {
        rel: "icon",
        href: require("./assets/logo.png")
      },
    ]
  },
  name: 'App',
  components: {
    Header,
    Footer,
    VueBotUI,
    BotIcon
  },
  computed: {
    isHome() {
      return this.$route.name === 'home';
    },
  },
  mounted() {
    M.AutoInit()
  },
  methods: {
    navToChat() {
      console.log("Chat");
      this.botWindowVisible = true;
    },
    messageSendHandler(e) {
      console.log(e);
      this.data = e.text;
    },
    msgSend(value) {
      this.messageData.push({
        agent: 'user',
        type: 'text',
        text: value.text
      });

      this.getBotResponse(value.text);
    },
    botStart() {
      this.messageData = [];
      if (this.botWindowVisible === false) {
        setTimeout(() => {
          this.botTyping = true;
          this.botWindowVisible = true;
          this.botTyping = false;
          this.messageData.push({
            agent: 'bot',
            type: 'text',
            text: 'Hello'
          });
        }, 1000);
      }
    },
    botDestroy() {
      this.botWindowVisible = false;
    },
    getBotResponse(prompt) {
      let request = {
        "question": prompt
      };
      this.botTyping = true;
      analysisAPI.getBotResponse(request).then(response => {
        this.botTyping = false;
        setTimeout(() => {
          this.botTyping = true;
          this.botWindowVisible = true;
          this.botTyping = false;
          this.messageData.push({
            agent: 'bot',
            type: 'text',
            text: response.data.answer
          });
        }, 1000);
      }).catch(error => {
        console.log(error);
        this.botTyping = false;
      });
    }
  },
  data: () => ({
    messageData: [],
    botTyping: false,
    inputDisable: false,
    botOptions: {
      botTitle: "ORFanBase AI Assistance",
      botAvatarImg: BotIcon,
      boardContentBg: '#f4f4f4',
      msgBubbleBgBot: '#009688',
      inputPlaceholder: 'Type here',
      inputDisableBg: '#fff',
      inputDisablePlaceholder: 'Hit the buttons above to respond',
      textColor: '#fff',
      msgBubbleColorBot: '#fff',
      msgBubbleBgUser: '#018786',
    },
    botWindowVisible: false
  }),
};
</script>

<style>
.qkb-board-header {
  background-color: #018786 !important;
}

.qkb-bubble-btn {
  background-color: #018786 !important;
}

.qkb-msg-bubble--user .qkb-msg-bubble-component__text {
  background-color: #02CCCC !important;
}
</style>