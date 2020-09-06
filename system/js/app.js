window.addEventListener('load', ()=>{
  document.getElementById('preload').classList.remove('show');
})
//--------------------------------------------------------
//  STORE DE VUEX
//--------------------------------------------------------
const store = new Vuex.Store({
  state:{
    //TODO
  },
  getters:{
    //TODO
  },
  mutations:{
    //TODO
  },
  actions:{
    //TODO
  }
})
//--------------------------------------------------------
//  RAiZ DE LA APLICACION
//--------------------------------------------------------
const app = new Vue({
  el:'#app',
  store,
  data:{
    loadingResource:true,
  },
  methods: {
    onLoadingResource(){
      this.loadingResource = false;
    },
  },
  mounted() {
    window.addEventListener('load', this.onLoadingResource);
  },
  //TODO
});
