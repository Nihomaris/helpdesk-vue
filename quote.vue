<template>
    <blockquote class="message__blockquote" v-if="comment">
        <inner-quote :comment="comment.comment"/>
        <div class="message__header">
            <span class="message__name">{{ comment.author.name }}</span>
            <span class="message__date">{{ formatedDate }}</span>
        </div>
        <p class="message__text">{{ comment.message }}</p>
    </blockquote>
</template>
<script>
    import quote from './quote'

    export default {
        components: {
            'inner-quote': quote
        },
        props: ['comment'],
        name: 'inner-quote',
        computed: {
            /* Переформатируем дату сообщения */
            formatedDate() {
                return moment(this.comment.created_at).format('D MMM в HH:mm');
            },
        },
    }
</script>