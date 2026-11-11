<template>
  <v-text-field
    :value="value"
    :class="fieldClass"
    :label="label"
    :placeholder="placeholder"
    prepend-inner-icon="mdi-magnify"
    clearable
    outlined
    hide-details
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: 'SearchField',
  props: {
    value: { type: String, default: '' },
    label: { type: String, required: true },
    placeholder: { type: String, default: '' },
    fieldClass: { type: String, default: '' },
  },
}
</script>
