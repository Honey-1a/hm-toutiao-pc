<template>
  <img src="../../assets/welcome.jpg" alt class="ie" />
</template>

<script>

export default {
  created () {
    this.$http.get('articles').then(res => {
      console.log(res.data)
    }).catch(() => {
      console.log('error')
    })
  }
}
</script>

<style>
.ie {
  display: block;
  margin: 0 auto;
}
</style>
