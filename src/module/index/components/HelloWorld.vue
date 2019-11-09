<template>
  <div class="hello">
    <h1>{{ $t('lang') }}</h1>
    <h2 @click="click">Essential Links</h2>
  </div>
</template>

<script>
import { loadLanguage } from '@/lang'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    click () {
      loadLanguage('zh-CN')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
