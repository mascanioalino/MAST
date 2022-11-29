<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <div class="new-visit">
    <div>New Visit</div>
  </div>
</template>

<script>
export default {
  name: "NewVisitButton",
};
</script>

<style>
.new-visit {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background-color: black;
  color: white;
  height: 100px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 80px;
  padding: 10px;
}
.new-visit:hover {
  cursor: pointer;
}
</style>
