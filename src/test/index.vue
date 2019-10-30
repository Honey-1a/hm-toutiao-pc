<template>
  <div class="page">
      <!-- 头 -->
      <p>Header</p>
      <!-- 内容 -->
      <div>
        <slot class="container"></slot>
        <slot class="foot"></slot>
      </div>
      <!-- 尾 -->
      <p>Footer</p>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
