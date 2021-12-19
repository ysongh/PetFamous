<template>
  <Navbar></Navbar>
  <Alert></Alert>
  <router-view/>
  <Footer></Footer>
</template>

<script>
import Navbar from './components/Navbar';
import Alert from './components/common/Alert';
import Footer from './components/Footer';

export default {
  name: 'App',
  components: {
    Navbar,
    Alert,
    Footer
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
