<template>
  <div class="row d-flex" :class="positionClass">
    <div class="bubble align-right" :style="boxStyle">
      {{ response.text }}
    </div>
  </div>
</template>
<style scoped>
.bubble {
  margin: 10px;
  position: relative;
  width: 345px;
  height: auto;
  text-align: left;
  padding: 10px;
  color: #ffffff;
  -webkit-border-radius: 15px;
  -moz-border-radius: 15px;
  border-radius: 15px;
}
</style>
<script>
import { RESPONSE_SOURCE } from '../config/config.js';
export default {
  props: ['response'],
  computed: {
    positionClass: function() {
      if (this.response.source === RESPONSE_SOURCE.GUEST) {
        return {
          'justify-content-end': true,
        };
      }
      return { 'justify-content-start': false };
    },
    boxStyle: function() {
      if (this.response.source === RESPONSE_SOURCE.GUEST) {
        return {
          background: '#C2D3CD',
          color: 'black',
        };
      }
      return { background: '#AFBFC0', color: 'black' };
    },
  },
};
</script>
