  <template>
  <div id="app">
    <Header v-if="!isHome"/>
    <HeaderWelcome v-if="isHome" />
    <main>
      <div>
        <router-view/>
      </div>
    </main>
    <Footer/>
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import HeaderWelcome from '@/components/HeaderWelcome.vue';
import M from 'materialize-css';

export default {
  name: 'App',
  components: { Header, Footer, HeaderWelcome },
  computed: {
    isHome() {
      return this.$route.name === 'Welcome';
    },
  },
  mounted() {
    M.AutoInit();
  },
};
</script>
